---
title: "135 GB on a 32 GB Box: A Memory Autopsy"
standfirst: "Five bugs, four crashes, and why four multiplications beat two days of profiling."
date: "2026-08-27"
---

---

```
Fatal error: The Python kernel is unresponsive.
The Python process exited with exit code 137 (SIGKILL: Killed).
This may have been caused by an OOM error.
```

Exit code 137 is the operating system's way of saying it stopped asking.

The job was an ordinary training pipeline: pull historical event records out of a distributed
store, engineer a few hundred features, write them to a feature store, and fit a
gradient-boosted classifier. The data is the kind a lot of people have: wide, sparse,
high-cardinality categoricals, a text column or two. It ran fine for months on the smaller
partitions. On the largest, roughly seven million rows, it went from healthy to gone.

Peak memory was over 135 GB. The driver had 32 GB.

What follows is the whole autopsy, in the order it actually happened, which matters because
**the most useful diagnostic in the entire exercise was watching where the crash moved to.**
Every fix pushed the failure later in the pipeline, and the new location named the next cause.
Four crashes, five bugs, and a final ratio of about five hundred to one on the biggest of
them.

![Four crashes, each later than the last](/diagrams/06-four-crashes.svg)

---

## Crash one: dead on arrival

The first version did not get anywhere near model fitting. It died during feature
engineering.

I read the code before I profiled anything, which in this case took about fifteen minutes and
found this:

```python
enriched_data      = training_data.copy()     # copy 1
self.training_data = enriched_df.copy()       # copy 2, never read anywhere
text_df            = df.copy()                # copy 3
text_df            = df.copy()                # copy 4
```

The conversion from the distributed frame to a local pandas frame produced about 23 GB. Then
it was copied four times.

One of those copies, assigned to an instance attribute, was never read by anything. Not once,
anywhere in the codebase. I grepped for it twice because I did not believe it. It had
presumably been useful at some point, and then the thing that used it was refactored away, and
the assignment stayed, because deleting a line nobody understands feels riskier than leaving
it.

The other two were full-frame copies made in order to touch a handful of text columns.

The fix is not clever:

```python
# was: text_df = df.copy()
text_data = {c: df[c].fillna('') for c in text_cols if c in df.columns}
text_df   = pd.DataFrame(text_data)
```

Delete the unread copy. Replace full-frame copies with column selections. Add an explicit
`del` and a `gc.collect()` before the heaviest steps.

**About 60 GB back**, from reading the code and asking what each line was for.

I want to be honest about how unsatisfying that is as an engineering story, and how often it
is the answer. There was no clever insight. There was a line of code that allocated 23 GB and
served no purpose, sitting in plain sight in a file everyone had read.

---

## Two things that were not crashing, just slow

While in there, two performance problems were impossible to ignore.

### An O(n³) loop wearing a batching disguise

Categorical encoding looked like this:

```python
for start in range(0, n_samples, batch_size):        # ~120 batches
    for col in self.categorical_features:            # ~15 columns
        for idx, val in enumerate(batch[col]):       # 50,000 rows
            name = f"{col}_{val}"
            if name in batch_encoded.columns:
                batch_encoded.iloc[idx, batch_encoded.columns.get_loc(name)] = 1
```

Roughly ninety million iterations. Each one does a `get_loc`, which is a lookup against the
column index, and a positional `.iloc` assignment. Those are two of the slowest per-element
operations pandas offers, and this code performs both, ninety million times. Six million rows
took over an hour.

Here is why I think this survived code review, and it is the interesting part. **The batching
makes it look careful.** Somebody clearly thought about memory: the outer loop chunks the data
so you never materialise the whole encoded frame at once. That is a real and sensible concern.
And the presence of that outer loop makes the whole block scan as "linear, batched, fine," so
your eye slides past the two loops nested inside it.

The replacement is one call:

```python
encoder = OneHotEncoder(sparse_output=True, handle_unknown='ignore', dtype=np.float32)
X_cat = encoder.fit_transform(categorical_df)
```

Two to three minutes instead of sixty. **About 25 times faster**, with less code, and it
returns a sparse `float32` matrix rather than a dense object frame, so it is a memory win as
well as a speed win.

One practical note that made this shippable rather than scary: we verified that the generated
column names were byte-identical to the previous path, because those names are saved alongside
the model and the inference service depends on them. That check took an hour and turned a
risky refactor into a boring one.

### Two `iterrows()` passes over 5.9 million rows

The feature-store write did this, nested:

```python
for start in range(0, len(training_data), batch_size):
    batch = training_data.iloc[start:end]
    for idx, row in batch.iterrows():
        ...
        row_dict = training_data.iloc[i].to_dict()
```

`iterrows()` constructs a Series for every row. That loses dtype information, forces type
coercion on every access, and cannot use a vectorised path for anything. Five point nine
million rows took **five to six hours**.

Two changes. First, vectorise: move the per-row work into `.apply()` over columns, and
pre-extract the columns you need as `.values` arrays so you are indexing NumPy rather than
pandas.

Second, and this is the one that mattered most: **build the deduplication index first, and
process only unique rows.**

It turned out 39.4 percent of rows were unique. The old code processed all 5.9 million and
discarded duplicates at write time. The new code processes 2.3 million.

Five to six hours became **ten to thirty minutes**, and roughly fifty thousand times fewer
`to_dict()` calls.

**Deduplicate before you transform, not after.** When a step is expensive and its input
contains repeats, the dedup ratio is a free multiplier on the entire step, and you collect it
by moving one operation earlier in the pipeline. This is such a cheap win that I now check the
unique-row ratio of any input to any expensive stage as a reflex.

---

## Crash two: dead later, which was the clue

With the copies gone, the job got further. It completed feature extraction, logged success,
and died at the start of model fitting.

That relocation is the diagnostic. Feature extraction now finished, so feature extraction was
no longer the peak. Something was holding memory *across* the boundary between the two phases.

The feature store built several large in-memory dictionaries, serialised them to JSON, wrote
the file, and returned. It never cleared them. So during model fitting, **thirty to fifty
gigabytes** of already-persisted data was still resident, doing nothing at all, because
nothing had told Python it could go.

```python
def _clear_memory_after_save(self):
    self.core_features.clear();          self.core_features = {}
    self.metadata_storage.clear();       self.metadata_storage = {}
    self.classification_storage.clear(); self.classification_storage = {}
    self.message_map.clear();            self.message_map = {}
    gc.collect()
```

Unglamorous, and it is the single highest-value function in that file.

The general rule: **in a long-lived process that hands off between phases, the end of a phase
should explicitly release what the phase owned.** Garbage collection cannot help you while you
are still holding a reference, and an instance attribute is a reference that outlives every
local scope you were reasoning about. Local variables get cleaned up when the function
returns. `self.anything` does not.

We also added one log line before fitting, which is how we found the last bug:

```
Memory status before training: RSS=66.40 GB, Available=238.82 GB
```

---

## Crash three: 238 GB available, and it died anyway

With everything above fixed, the largest partitions still failed:

```
Starting fit with 5,962,270 samples, 615,386 features...
[killed]
```

Six hundred and fifteen thousand features. That is what you get when you one-hot encode
high-cardinality categoricals and concatenate a TF-IDF vocabulary. The matrix was extremely
sparse: about 0.01 percent dense, roughly 250 million non-zero entries. As a sparse object
that is entirely reasonable, a few gigabytes.

I spent two days building better memory instrumentation before doing the thing I should have
done first, which was read the documentation for the algorithm and multiply.

XGBoost's histogram tree method allocates histogram buffers per feature, per node:

```
per node  = max_bin x n_features x 4 bytes x 2
          = 256 x 615,386 x 4 x 2
          ~= 1.2 GB

per tree at depth 6 (63 nodes)
          = 63 x 1.2 GB
          ~= 75 GB
```

Seventy five gigabytes per tree. We were asking for a hundred trees.

Four multiplications. They predicted the failure exactly. No profiler, no heap dump, no
bisection.

And notice that the log line said 238 GB available. It died anyway, because **"available
memory" is not a promise.** It is a sum of fragments. An allocator that wants one large
contiguous region can fail with most of the machine apparently free, and a monitoring number
that aggregates free pages will cheerfully tell you everything is fine right up to the moment
it is not.

---

## The four-layer fix

In order of leverage.

**1. Project the features down.** Above a threshold of 200,000 features, apply a sparse random
projection to 150,000.

```python
if X.shape[1] > MAX_FEATURES:
    projector = SparseRandomProjection(n_components=150_000, density='auto', random_state=42)
    X = projector.fit_transform(X)
```

This is the Johnson-Lindenstrauss lemma doing the work: a random projection into a
sufficiently large subspace preserves pairwise distances with high probability, so a
distance-sensitive learner keeps most of what it needs. It is cheap, it is principled, and it
divides the dominant term in that formula by four. This is the highest-leverage change of the
four and the one people are most reluctant to make, because throwing away three quarters of
your feature space feels like it must cost accuracy. On a matrix that sparse it costs very
little.

**2. Free the input before the expensive phase.**

```python
dtrain = xgb.QuantileDMatrix(X, label=y, weight=w, max_bin=128, nthread=2)
del X; gc.collect()
booster = xgb.train(params, dtrain, num_boost_round=100)
```

`QuantileDMatrix` builds the quantile sketches it needs and can spill them to disk. And
dropping from the estimator's `.fit()` to the lower-level `train()` creates a point in the code
where the original matrix can be released *before* the memory-hungry phase begins.

**Ordering is a memory optimisation.** That sentence took me an embarrassingly long time to
internalise. Freeing the input before the peak is worth as much as making the input smaller,
and it costs nothing.

**3. Subsample columns, compounding.**

```python
'colsample_bytree':  0.1,
'colsample_bylevel': 0.5,
'colsample_bynode':  0.8,
```

These multiply. 150,000 features becomes about 15,000 per tree, 7,500 per level, 6,000 per
node. On a matrix this sparse and this wide most features carry nothing, and the ensemble
tolerates far more aggressive subsampling than intuition suggests.

**4. Shrink the histogram itself.** `max_bin` from 256 to 128. `max_depth` from 6 to 5.
`grow_policy` to `lossguide`, so the tree grows where the loss is rather than filling every
level.

The four together:

```
histogram memory per tree:   ~75 GB  ->  ~150 MB
```

About five hundred times. The job now finishes in around half an hour.

![Peak memory, before and after](/diagrams/06-memory-waterfall.svg)

---

## What the autopsy taught me

**Do the arithmetic before you reach for a profiler.** Most memory blowups at scale have a
closed-form cause you can compute in your head from the algorithm's own documentation. I spent
two days on tooling and then solved it with four multiplications. The tooling was not wasted,
exactly, but it was second.

**Watch where the crash moves.** Each fix relocated the failure, and the new location named the
next cause. A crash that moves later is progress *and* a diagnostic. A crash that stays put
means you fixed something that was not the problem.

**"Available memory" is not a promise.** It is a sum of fragments, and an allocator wanting one
contiguous block does not care about the sum.

**Sparsity is a property of your data, not of the algorithm consuming it.** Histogram
construction allocated for the dense shape regardless. Very sparse and very wide is the worst
case for this family of algorithms, and dimensionality reduction is not a compromise there, it
is the correct move.

**A copy you never read is the cheapest 23 GB you will ever save,** and the only way to find it
is to read the code and ask what each line is for. No tool will tell you that an allocation is
pointless. Only a human reading the code will.

**Batching can hide complexity.** A loop that chunks its input looks like somebody was being
careful. Look inside it.

**Deduplicate before you transform.** The unique-row ratio of the input to any expensive stage
is a free multiplier you collect by reordering.

**An instance attribute outlives every scope you were thinking about.** Phase boundaries should
release what the phase owned, explicitly.

---

## Why this generalises

None of the five bugs are exotic. A copy nobody reads, a triple-nested loop hiding inside a
batching wrapper, `iterrows()` over millions of rows, an instance attribute that outlives the
phase that filled it, and a histogram allocation that scales with the dense shape of a sparse
matrix. Every one of them is available to anyone training a wide sparse model on a single
box, and four of the five were visible by reading the code rather than by running anything.

---

*This is a generic account of a real debugging exercise. Ratios and multiples are exactly as
measured. Code samples are reconstructed to illustrate the shape of the problem, not copied
from any codebase.*
