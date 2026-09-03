---
title: Making an LLM a measurable SQL predicate
date: November 2025
sort: 2025-11
summary: SQLPlus asks how many LLM calls you can remove from a semantic query operator before accuracy starts to hurt. Four operators, a four-stage filter cascade, and a set of measurements including the optimizations I threw away.
tags: Python, LLM, BM25, sentence-transformers, Information retrieval
repo: https://github.com/justnsmith/SQLPlus
---

`WHERE body LIKE '%caching%'` matches characters. It has no opinion about
whether the row is actually about caching. SQLPlus is a research harness that
asks what happens if the predicate is a language model instead, and then treats
the obvious problem with that idea as the whole project.

I worked on it between March and November 2025 as research at the iDB Lab, on my
own. It's paused, not finished. There is no service to deploy here, just an
experiment harness and a pile of recorded runs.

## Four operators

Each one answers `f(X, Y) -> bool` over a 1,000-row labeled dataset.

| Operator | Question |
| --- | --- |
| `contains` | Is concept X meaningfully present in text Y? |
| `is_a` | Is X an instance of category Y? |
| `is_in` | Is topic Y relevant to text X? |
| `semantic_eq` | Are X and Y interchangeable in use? |

Three are synthetic. `is_in` runs on `cardiffnlp/tweet_topic_multi`, tweets
against 17 topic labels, which turns out to matter later.

Done naively that's one round trip per row. A thousand calls, roughly half a
second each, six to thirteen minutes per operator per experiment, and a bill
attached to every one of them. So the question the project actually answers is
narrower than "can an LLM be a predicate": it's how many of those thousand calls
you can avoid, and what each avoided call costs in correctness.

## The cascade

Four stages ordered by cost per query. Each resolves what it can and passes the
rest down.

```diagram
sqlplus-cascade
```

### 1. The keyword prefilter

A hand-curated lexicon per operator, 103 entries for `contains`, 269 for `is_a`,
the 17 topic labels for `is_in`. It substring-counts lexicon words in the other
side of the pair and fires when the count clears a threshold. Microseconds.

The part worth explaining is that it only ever returns True. A miss isn't a
negative answer, it's a fall-through to the next stage. The evidence is
asymmetric: a keyword hit is strong evidence the concept is present, a keyword
miss is nearly no evidence that it's absent.

That asymmetry is what makes the stage auditable. The filter can only ever
introduce false positives, so every accuracy point the cascade loses here is a
row it claimed True on that was actually False. On `contains` the prefilter fired
on 335 rows and cost 5.4 points of accuracy, and I could go read those 335 rows
rather than all 1,000.

### 2. The embedding classifier

Cosine similarity between the concept and three descriptive keywords for the row,
firing at 0.75. The keywords come from the model, which would defeat the whole
point if it happened at query time, so it doesn't.

```diagram
sqlplus-offline
```

Keyword generation runs once per operator through the OpenAI Batch API.
`run_job.py` writes a JSONL of 1,000 requests, uploads it, and appends
`batch_id<TAB>operator` to `jobs.txt`. `check_jobs.py` is a separate script that
reads the registry, polls, materializes the output, embeds every keyword,
persists the vectors, and only then removes the line.

Two scripts and a text file, because a batch has a 24-hour completion window and
no script should stay alive that long. Submitter appends, poller consumes, the
line disappears only after the output is durably on disk. It's crash-safe and
resumable in about twenty lines of file I/O. It is not concurrent-safe at all,
and `remove_job` matches on a line prefix rather than the full id, which would
bite immediately if a second submitter ever existed.

The vectors are written L2-normalized, so the online comparison is a bare
`np.dot` with no norm division. Classifying 1,000 rows takes about five seconds
against roughly five hundred seconds of model time for the same rows.

### 3. The BM25 answer cache

An index that starts empty and fills up during the run. Every answer the model
gives is inserted as a document keyed by its label, and a new query retrieves the
highest-scoring document with the same label. If the min-max-normalized score
clears 0.9, the cached boolean gets reused.

It's approximate memoization: near-enough queries share an answer. Two decisions
in there are load-bearing.

Retrieval is partitioned by label before the argmax, so the cache key is the
`(text, label)` pair rather than the text. Two tweets can be textually almost
identical and have opposite answers for different topic labels. A cross-label hit
isn't a slow answer, it's a wrong one.

The index also rebuilds itself completely on every insert. `rank_bm25` has no
incremental API, and at n = 1,000 with a 500 ms model call dominating everything,
a sub-millisecond rebuild is free. It's O(n²) across a run by construction, which
is fine here and fatal at 100,000 rows, and the real cost isn't the cycles, it's
that the whole lookup path sits behind one lock and serializes part of an
otherwise concurrent pipeline.

### 4. The call itself

Structured output through a Pydantic schema, `temperature=0.0`, a 50-token cap
because the answer is one boolean. Five workers through a `ThreadPoolExecutor`
with a semaphore gating in-flight requests, and two separate locks, one for the
BM25 index and one for the stats counters. Threads rather than asyncio because
the SDK call is blocking and the shared state is a Python object graph, so
threads mapped onto the problem with less friction.

Calls spread across two API clients with different per-minute token budgets
through a small load balancer that tracks estimated usage per client, resets
every 60 seconds, and picks the least loaded client that can still fit the
request.

Failures are logged and skipped rather than retried. For a benchmark harness a
partial run that still reports beats a crash at row 900, and a skipped row shows
up as accuracy loss rather than disappearing. The honest cost is that a transient
429 and a genuinely wrong answer look identical in the final number.

## What it bought

| Operator | Baseline | Best pipeline | Speedup | LLM calls | Accuracy |
| --- | --- | --- | --- | --- | --- |
| `contains` | 561.6s | 92.5s | 6.07× | 1000 → 523 | 99.40% → 97.70% |
| `semantic_eq` | 791.3s | 165.5s | 4.78× | 1000 → 896 | 98.60% → 97.90% |
| `is_in` | 381.2s | 101.8s | 3.74× | 997 → 596 | 97.39% → 94.18% |
| `is_a` | 377.5s | 139.8s | 2.70× | 1000 → 690 | 99.90% → 98.40% |

Pulling `contains` apart stage by stage, all against the same 1,000 rows:

| Change | Runtime | Accuracy cost |
| --- | --- | --- |
| Concurrency alone, 5 workers | 561.6s → 204.4s | 0.30pp |
| Keyword prefilter, 335 rows | −209s of 620s estimated | 5.40pp |
| BM25 cache, 202 rows | 143.6s → 81.3s | 2.10pp |
| Embedding classifier, 27 rows | ~5s per 1,000 rows | none measured |

Concurrency was the largest and cheapest win in the entire project. Five threads,
0.3 points of accuracy, which is inside run-to-run noise. Everything clever I
built afterward was worse per point of accuracy spent than five threads.

The embedding stage is the opposite shape: it resolved the fewest rows of any
stage, 27 out of 1,000, but at 98.02% precision it's the most accurate thing in
the cascade and it costs about five seconds.

A caveat that applies to every number above: these are single unrepeated runs
against a live commercial API from one machine. Accuracy is reproducible. Timings
are indicative. The ratios within one operator are the part I'd defend.

## Three things I got wrong

### The classifier that was 37% right

The offline embedding classifier hit 98% precision on `contains`, 96% on `is_a`,
100% on `is_in`. On `semantic_eq` it got 36.88%. Same code, same threshold, same
model.

Every operator used the same recipe: ask the model for three keywords describing
the row, embed those, compare. That's a fair summary when the question is "does
this text mention X". It falls apart for "are these two things equivalent",
because equivalence lives in the relationship between X and Y, and compressing
each side to three topic words deletes exactly that relationship.

```diagram
sqlplus-embedding-fix
```

Embedding the sentences directly instead, with the same threshold machinery,
took precision to 96.15%. It also got faster, because there were fewer
embeddings to compute.

### The optimization I measured and threw away

Packing three queries into one prompt cuts calls from 1,000 to 334 and runs 2.64×
faster. Every instinct said ship it.

It also cost accuracy on all four operators: 99.40 → 96.30, 99.90 → 97.10,
97.39 → 93.08, 98.60 → 95.90. Four independent datasets moving the same direction
rules out noise. The cause is cross-query contamination inside one context
window, and I went at it with prompt engineering, explicit per-query delimiters
and an all-caps instruction to evaluate each query in complete isolation. That
narrowed the gap and never closed it.

So batching stayed in the repo as a measured comparison point and out of the
final pipelines. Concurrency delivered a comparable speedup for 0.3 points
instead of three.

### One threshold, two operators, ten points

The BM25 cache threshold was tuned on `contains`, where 0.9 gave a decent hit
rate. On `is_in` I tried 0.5 and got a spectacular-looking result: 574 cache hits,
only 153 model calls, 85 seconds. Accuracy 84.05%, against a 97.39% baseline.

The cache was the obvious suspect, since it was the only stage returning answers
it hadn't derived. Tweets are short, noisy and share vocabulary heavily, so
min-max-normalized BM25 scores clustered high and near-unrelated tweets sailed
past 0.5. Moving back to 0.9 and tightening the prefilter from one required
keyword match to two recovered 9.93 points, at the cost of 177 cache hits.

Both runs are still sitting next to each other in the results file. Cascade
thresholds are a property of the data distribution rather than the algorithm, and
have to be re-tuned per operator.

## Where it stands

Paused since November 2025. If I picked it up the first things would be the ones
that undermine the numbers rather than the ones that improve them.

There's no token or dollar accounting anywhere, so call count is a proxy that
understates the batching win and ignores the Batch API discount. Every timing is
n=1 with no variance. Every dataset is exactly 1,000 rows and concurrency is
fixed at 5, so there's no scaling curve and the O(n²) index rebuild has never
been measured as a knee. There are no tests, which is also why a few entrypoints
have signature drift that would raise on first call.

The part I'd keep is the discipline rather than the pipeline. Thirty-odd recorded
configurations, per-stage attribution of both the wins and what they cost, and
the negative results left in the file instead of deleted.
