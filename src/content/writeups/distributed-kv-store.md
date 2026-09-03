---
title: Two hard problems in one box: an LSM engine under Raft
date: February 2026
sort: 2026-02
summary: Building a replicated key-value store from scratch in C++20: a log-structured storage engine, a Raft consensus layer, and the places where the two designs pull against each other.
tags: C++20, Raft, LSM-tree, Distributed systems, Storage engines
project: distributed-kv-store
repo: https://github.com/justnsmith/KVRaft
---

A distributed key-value store is two systems wearing one name. Underneath is a
storage engine that has to make a single machine durable and fast. On top is a
consensus layer that has to make three machines agree on what happened and in
what order. They are usually studied apart. Building both, in one process, is
where the interesting friction lives.

This is a walk through the design of [KVRaft](https://github.com/justnsmith/KVRaft):
an LSM-tree engine in C++20, a Raft implementation following the extended paper,
a text wire protocol over TCP, and a chaos harness that kills leaders to see
what breaks.

## The storage engine

The engine is a log-structured merge tree, which is the standard answer for a
write-heavy workload. In-place updates scatter random writes across the disk;
an LSM converts them into sequential appends and pays the cost back later, in
the background, as merges.

A write lands in a **write-ahead log**, CRC32-checksummed and fsynced on a
background thread, and then in an in-memory **memtable**. At 8 MB the memtable
freezes, a new one takes over, and the frozen one is flushed to an immutable
**SSTable** on disk. SSTables compact from L0 down to L3 as they accumulate.

A read walks the layers in newest-first order: LRU cache, active memtable,
immutable memtable if a flush is mid-flight, then the SSTables through the
version manager. Each SSTable carries a **Bloom filter** tuned to a 1% false
positive rate, so a lookup for a key that isn't in a file skips the file
entirely. With four levels of SSTables, that check is the difference between
one disk read and a dozen.

`SCAN startKey endKey` is the awkward one. A point lookup can stop at the first
layer that answers; a range scan cannot, because a newer tombstone in the
memtable has to suppress an older value sitting in L2. So the scan merges every
layer by sequence number and filters tombstones at the end, which means the
cost of a range scan is structural, not incidental.

### Concurrency: one writer, many readers

The write path is a **single writer thread** fed by an MPSC queue. Producers
push and get a future back; the future resolves once the entry is durable in
the WAL, not once it reaches disk in an SSTable. That is the correct place to
resolve it, since durability is the promise and flushing is an implementation
detail, and it is what lets the queue batch.

Reads are fully parallel. The LRU cache is **sharded 16 ways** behind
`std::shared_mutex`, and SSTable reads use `pread()` against a pre-opened file
descriptor, so several threads read the same file at once with no lock at all.
`pread` takes its offset as an argument rather than mutating a shared file
position, which is exactly why it exists.

The asymmetry shows up in the numbers. On an M3 MacBook Pro: roughly 47k
writes/sec at 16 threads, bounded by the single writer; roughly 2.1M reads/sec
at 4 threads. Read throughput actually *falls* from 4 threads to 16, to about
1.3M/sec, as cache-line contention on the shards overtakes the gain from more
cores. A mixed workload lands near 164k ops/sec.

That regression is the most useful thing the benchmark told me. More threads is
not more throughput, and the point where it inverts is a property of the shard
count, not of the machine.

## Raft on top

Raft turns those three independent engines into one replicated state machine.
The implementation follows the extended paper section by section:

- **§5.2, leader election.** Randomized timeouts between 150 and 300 ms, 50 ms
  heartbeats. Randomization is the entire mechanism preventing split votes; with
  a fixed timeout, three nodes that start together deadlock on candidacy
  forever.
- **§5.3, log replication.** `AppendEntries` carries `prevLogIndex` and
  `prevLogTerm`, and a follower rejects anything that doesn't match. That is
  the consistency check that makes the induction argument work.
- **§5.4, safety.** A vote is denied to a candidate whose log is behind, and
  entries are committed by counting replicas only for the *current* term. The
  second rule is the one that looks like an optimization you could drop, and
  the one whose absence loses committed data.

**Fast log backup.** When a follower rejects an `AppendEntries`, it reports the
conflicting term and the first index of that term rather than a bare "no". The
leader can then skip an entire bad term in one RPC round instead of decrementing
`nextIndex` one entry at a time. A follower that has diverged by thousands of
entries reconciles in a handful of round trips.

**Snapshots.** A log that only grows is a log that eventually cannot be replayed.
Once compacted, a follower too far behind to catch up from the log is brought
current with `InstallSnapshot` instead.

**Persistence.** `currentTerm` and `votedFor` are written to disk before any RPC
response depends on them. A node that forgets its vote across a restart can
vote twice in one term and elect two leaders. The peer list is saved after each
election too, so a node can rejoin without being reconfigured by hand.

### Reads, and the lie of the local replica

The subtle part is not writes. It's reads.

A follower always has a locally consistent view, but not necessarily a *current*
one. So consistency is a per-node setting:

| Mode | Behaviour |
| --- | --- |
| `stale` | Serve from the local engine immediately. Any node, highest throughput. |
| `linearizable` | Leader sends a heartbeat round first, confirming it is still leader, then serves. |

The linearizable path exists because leadership is not self-evident. A partitioned
leader still believes it is the leader; it just cannot hear the new one. Serving
a read from that node returns a value that was true and is now wrong. A heartbeat
round before answering converts "I think I'm the leader" into "a majority agreed
I was the leader more recently than this read."

Writes to a follower aren't proxied. They get `-ERR NOT_LEADER host:port`, and
the client retries against the address it was handed. Redirecting is honest
about where the ordering happens.

## Testing in three tiers

Correctness claims about a consensus implementation are worth exactly as much
as the failures they've survived.

**Unit tests: 146 for the engine, 36 for Raft.** The Raft tests construct
`RaftNode` objects and call `handleRequestVote` and `handleAppendEntries`
directly, with no threads and no sockets. Deterministic, fast, and able to
exercise the cases a running cluster reaches once a week: stale terms, missing
previous entries, conflict truncation, double-vote prevention, log freshness.

**Chaos tests: 12, on real in-process clusters over real TCP.** These start
actual multi-node clusters and then break them:

- `leader_failover_preserves_data`: kill the leader, verify the data survived
- `majority_loss_blocks_writes`: kill two of three, verify commits *stop*
- `follower_catches_up_after_rejoin`: restart a killed follower, verify replay
- `old_leader_steps_down_on_rejoin`: a stale leader must discover the higher
  term and demote itself
- `rapid_leader_kills`: two consecutive leader kills on a five-node cluster
- `snapshot_based_recovery`: recovery via `InstallSnapshot` after compaction

`majority_loss_blocks_writes` is the one I care most about. Every other test
asserts the cluster kept working; that one asserts it correctly *refused* to.
An implementation that silently commits without quorum passes every liveness
test and is worthless.

**Integration, in Docker.** A three-node cluster on a bridge network, plus CI that
builds the images, waits for an election, and runs a PUT/GET smoke test on every
push.

## Observability

Every node exposes a Prometheus `/metrics` endpoint and the repo ships a Grafana
dashboard with 19 panels across overview, latency, storage engine, and Raft.

The engine metrics are the ordinary ones: cache hit ratio, flush and compaction
rate, PUT and GET latency percentiles. The Raft metrics are the ones worth
having: current term, node role, elections started versus won, leader changes,
replication and heartbeat latency histograms.

Term number is the single most diagnostic value in a Raft cluster. A steadily
climbing term means elections that aren't completing, which means the cluster is
churning rather than serving. It is also invisible from the outside, because a
cluster in permanent election looks exactly like a slow one.

---

## What I'd tell someone starting this

Build the engine first and finish it. Raft assumes a state machine that applies
entries deterministically and durably; if that layer is still shifting under you,
every consensus bug is ambiguous, because you cannot tell a replication fault
from an apply fault.

Then write the chaos tests before you believe any of it. The Raft paper's safety
argument is convincing on the page, and my implementation of it still had bugs
that only surfaced when a leader died at an inconvenient microsecond. Reading
the proof is not the same as having obeyed it.
