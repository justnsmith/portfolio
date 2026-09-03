---
title: Building a replicated key-value store in C++
date: March 2026
sort: 2026-03
summary: Three months of notes on a distributed KV store I wrote alone. An LSM storage engine, a Raft implementation, the three locks I deleted to make reads scale, and a replication bug I fixed wrong twice before I understood it.
tags: C++20, Go, Raft, LSM-tree, Distributed systems
project: distributed-kv-store
repo: https://github.com/justnsmith/KVRaft
---

I worked on this from late December 2025 to the end of March 2026, on my own.
It's a key-value store that replicates across three nodes using Raft, sitting on
top of an LSM storage engine I wrote from scratch. The engine, the consensus
layer and the server are C++20. The CLI is Go.

The reason I wanted both halves in one project is that they're usually taught
apart. A storage engine is about making one machine durable and fast. Raft is
about making several machines agree on an ordering. When you put them in the
same process you have to decide how they meet, and that turned out to be where
most of the real work was.

## The shape of it

Each node is a single `kv_server` process running four things: a client-facing
TCP server with a worker thread pool, a Raft RPC listener on its own port, a
Prometheus endpoint, and the embedded storage engine. Three of those processes
make a cluster.

```diagram
kv-write-path
```

If you start a node without `--node-id` and `--repl-port` it skips Raft entirely
and applies writes straight to the engine. That standalone mode was useful for
benchmarking the engine without consensus in the way.

## Writes

A `PUT` lands in `TcpServer::executeCommand`. If the node isn't the leader it
replies `-ERR NOT_LEADER host:port` and the client retries against that address.
I didn't proxy the write, because forwarding hides which node actually ordered
the operation, and handling the redirect is two lines in the client.

On the leader the command becomes a log entry and goes to `RaftNode::replicate`,
which appends locally, fans out `AppendEntries` with one thread per peer, and
counts acknowledgements. Commit needs a majority, and the entry has to belong to
the current term, which is the §5.4.2 safety rule. Once `commit_index` moves the
apply thread wakes and calls a registered callback bound to the engine's `put`
and `del`.

Inside the engine, no write touches the memtable on the caller's thread. Every
`put` pushes a request carrying a `std::promise<bool>` onto an MPSC queue and
blocks on the future. One writer thread drains up to 1,000 requests at a time,
applies them to the memtable, appends to the WAL, issues a single `flush()` for
the whole batch, and then resolves the futures.

Making writes single-threaded was deliberate. Sequence numbers become correct by
construction, since `seq_number_++` on one thread needs no atomics. A thousand
concurrent writes share one fsync. There's no write-write contention on the
memtable at all. The cost is that write throughput is capped by a single core: I
measured that ceiling at about 47k ops/sec at 16 threads, and it doesn't move no
matter how many client threads you add.

### The ordering bug that was worth two lines

The writer thread originally called `checkFlush()` before resolving the futures.
`checkFlush()` can block on a condition variable while the flush thread writes an
8 MB SSTable out to disk, so every client thread waiting on a future was stuck
behind a flush it had nothing to do with. Write latency had a periodic spike and
that was why.

Swapping the two lines fixed it. The reordering is safe because the WAL fsync,
which is the actual durability point, has already happened by then. There's a
comment in the code explaining that now, because otherwise it reads like
something you'd tidy up.

## Reads

A read walks the layers newest-first and returns at the first hit.

```diagram
kv-read-path
```

Each SSTable is laid out as sorted records, then min/max key metadata, then a
sparse index with one entry per `INDEX_INTERVAL` records, then a serialized
bloom filter, then an 8-byte trailer pointing back at the metadata offset. The
trailer is what makes the file readable back-to-front, so you can open one and
find its index without scanning the data.

`SCAN` can't stop at the first layer that answers, because a newer tombstone in
the memtable has to suppress an older value sitting down in L2. It merges range
results from every layer into a `std::map` keyed by highest sequence number,
then filters tombstones at the end.

Compaction is leveled, L0 to L3, on its own thread. L0 triggers at 4 files and
the lower levels trigger on byte thresholds of 10 MB, 100 MB and 1 GB. The merge
is a k-way merge through a `priority_queue` ordered by key ascending and
sequence descending, keeping the highest sequence number per key and dropping
tombstones.

### Making reads scale

The multithreaded benchmark showed read throughput completely flat from 4 to 16
threads. Adding cores did nothing, which meant contention rather than slow code.
I went looking for shared mutable state that every read touched and found three
things.

The LRU cache had one global mutex, so every read in the process serialized on
it. I split it into 16 shards routed by `hash(key) % 16` and made the miss path
take a `shared_lock` rather than an exclusive one, since a miss doesn't reorder
the LRU list. That second part only pays off because misses dominate when a
small cache sits over a large key space, which is exactly the regime this cache
is in. A hit still takes the writer lock to splice the list.

`SSTable::get()` was reading through a cached `std::ifstream` behind a mutex. An
ifstream carries a file position, so concurrent readers corrupt each other's
seeks without one. I replaced it with `pread()` on a descriptor opened once at
construction. `pread` takes the offset as an argument, so there's no shared
position and no lock at all, and any number of threads can read the same file at
once. The buffered stream is still used for whole-file sequential scans, where
buffering is worth more than concurrency.

The third was the future-ordering fix above. It's on the write path but it
showed up in the read benchmark, because writer threads periodically froze
everything.

Separately, compaction deletes SSTable files while readers are mid-lookup. The
manifest is an immutable `TableVersion` published with `std::atomic_store`;
mutators deep-copy it, modify the copy, and install that. A reader takes a
`shared_ptr` snapshot and the files it references stay alive until it drops the
reference. This is the LevelDB version-set idea, and it means the read path
takes no lock on the manifest. Copying the whole manifest on every metadata
change is fine at tens of files and would need a delta log at thousands.

## Raft

The implementation follows the extended paper. Election timeouts are randomized
between 150 and 300 ms with 50 ms heartbeats. The randomization is doing all the
work in preventing split votes; with a fixed timeout, three nodes that start
together keep timing out simultaneously.

**Fast log backup.** The naive algorithm decrements `nextIndex` by one per round
trip, so a follower that diverged by 10,000 entries needs 10,000 round trips.
`AppendEntriesReply` here carries `conflict_index` and `conflict_term`, so the
leader skips a whole term per round trip instead. There are three branches to
it, depending on whether the leader has the conflicting term in its own log,
doesn't have it, or got no hint at all. Each branch has its own test, because
the middle case is easy to get wrong.

**Snapshots.** At 10,000 applied entries past the last snapshot the leader
captures the state machine, writes it out atomically with a tmp file, fsync and
rename, and truncates the log. Followers behind the compaction point get
`InstallSnapshot` instead of `AppendEntries`. Raft reaches the state machine
through two callbacks, capture and install, so `RaftNode` never learns that a
storage engine exists. That decoupling is what lets the chaos tests substitute a
plain `std::map` and test consensus on its own.

The honest weakness is that snapshot creation scans the entire keyspace
synchronously while the apply loop holds `raft_mutex_`, so it stalls consensus
for a period proportional to dataset size. A real system would snapshot from a
consistent read view on another thread. I left a comment about it rather than
pretending it isn't there.

**Persistence.** `currentTerm` and `votedFor` go to disk before any RPC reply
depends on them. A node that forgets its vote across a restart can vote twice in
one term and elect two leaders. The peer list is saved after each election too,
so a node can rejoin without being reconfigured by hand.

**Read consistency** is a per-node config setting rather than a decision I made
on everyone's behalf. `stale` serves a GET from the local engine on any node and
costs nothing. `linearizable` requires the node to be leader and to complete a
heartbeat round confirming a majority still recognizes it, before it answers. A
partitioned old leader still believes it's the leader and will happily serve a
value that was correct a minute ago. The optimization I didn't build is leader
leases, which amortize that round trip in exchange for an assumption about
clocks.

## Numbers

These are from an M3 MacBook Pro, and all of them measure the storage engine
in-process.

| Workload | Threads | Throughput |
| --- | --- | --- |
| Writes | 16 | ~47k ops/sec |
| Reads | 4 | ~2.1M ops/sec |
| Reads | 16 | ~1.3M ops/sec |
| Mixed, 70/30 | 16 | ~164k ops/sec |

Read throughput peaks at 4 threads and then regresses. Past that, cache-line
contention on the shared shards outweighs the extra cores. I'd rather report
that than the peak on its own, because it points at what to fix next, which is
probably more shards or a different cache structure.

What I don't have is any cluster-level benchmark. The replication latency and
heartbeat histograms are instrumented but nothing exercises them under load, so
I can't tell you writes/sec through consensus, replication p99, or how long
failover takes before a new leader accepts a write. That's the biggest gap in
the project and it's the next thing I'd do.

## Testing

194 tests in three tiers.

146 are storage engine unit tests covering the memtable, the SSTable format, WAL
replay and corruption handling, bloom filter false-positive rate, LRU eviction,
the version manager, range scans and the write queue.

36 are Raft tests that construct a `RaftNode` and call `handleRequestVote`,
`handleAppendEntries` and `handleInstallSnapshot` directly, with no threads and
no sockets. Safety properties are functions of state, so they can be tested
synchronously and can't flake. These cover term comparison, double-vote
prevention, §5.4 log freshness, conflict truncation, idempotent re-append,
commit index advance and snapshot boundaries.

12 are chaos tests that spin up real multi-node clusters in-process over
loopback TCP on kernel-assigned ports, then break them. They kill leaders, kill
followers, destroy quorum and restart nodes. Liveness is a function of timing,
so there's no way to test it without real timing. The price is that this tier is
timing-sensitive, and there's a commit in the history that is literally
"increased timeout in follower_catches_up_after_rejoin."

The one I care most about is `majority_loss_blocks_writes`, which kills two of
three nodes and asserts that commits stop. Every other test asserts the cluster
kept working. An implementation that commits without a quorum passes all of
those and is useless.

## The replication race

After I replaced my earlier ad-hoc log shipper with real `AppendEntries`, writes
started failing intermittently with `REPLICATION_FAILED`. Often in CI, rarely on
my laptop. It took me several days and four wrong turns before I understood it.

The first two attempts were a 500 ms warmup delay and then a retry loop. Both
lowered the failure rate without explaining it, which is the tell that you don't
understand the bug yet. I should have stopped after the first one and gone
looking instead of shipping the second.

There were two causes. The heartbeat thread and `replicate()` were interleaving
messages on the same peer socket, so a reply could get read by the wrong sender.
That needed a per-peer send mutex serializing the send and receive as one unit.
Separately, `replicate()` counted only the acknowledgements its own threads
collected, but the heartbeat thread could have already replicated the entry, in
which case it sent an empty `AppendEntries` and never incremented the counter.
A successfully replicated entry was being reported as a quorum failure. The fix
cross-checks `match_index` for every peer and de-duplicates against cluster
size.

After that the chaos suite went from intermittent to reliably passing, and CI
stopped flaking on the Docker job.

## Everything else

There's a Prometheus-compatible metrics layer I wrote instead of pulling in
prometheus-cpp. Counters, gauges and a 17-bucket latency histogram, all plain
atomics, with a hand-written text exposition serializer and a small HTTP server.
Recording an observation is one atomic increment on a fixed bucket array, no map
lookup and no allocation. The registry is a struct of named members rather than
a string-keyed map. The cost is no dynamic label cardinality, since every series
has to be a named member, which is the right trade for a fixed metric set and
the wrong one for a general library. 26 series feed a 19-panel Grafana dashboard
that provisions itself.

CI runs two jobs on every push: a CMake build, all 194 tests, cppcheck and
clang-format, then a second job that builds Docker images, brings up a 3-node
cluster, and asserts leader election and cross-node replication before tearing
it down. There's Terraform for an AWS deployment (VPC, subnet, gateway, route
table, security group with separate client and replication ingress, three EC2
instances on static private IPs) and a Go CLI on cobra and viper with
human-readable and JSON output.

## What I'd change

Cluster-level benchmarks first, as above. After that, the write path is
single-threaded by construction, so 47k ops/sec is an architectural ceiling
rather than a tuning problem; sharding the memtable by key hash with a writer
per shard would break it and produce a clean before-and-after number. Snapshot
creation should move off the Raft mutex. And there's no membership change
support at all, so the cluster is fixed at startup, with no joint consensus and
no single-server reconfiguration.

If I were starting again I'd finish the engine before touching Raft. For a while
both layers were moving at once, and every consensus bug was ambiguous, because
I couldn't tell a replication fault from an apply fault without stopping to
check.
