---
title: "The Chart Where Nothing Happened"
standfirst: "Two panels moved in opposite directions on the same deploy. Neither delta was real."
date: "2026-09-10"
---

A team fixes fifteen lines of code in an error categoriser. On the day it deploys, two
dashboard panels move sharply. One falls. One rises.

Nothing happened. No user experienced anything different, no code path behaved differently,
and the only thing that changed was the label on a pile of events.

This is not exotic. It is guaranteed arithmetic for any rate that has categories in its
denominator, and it is one of the few measurement traps that will have you reporting a large
false result to senior people with complete confidence. I have quoted numbers produced this
way, in rooms with people who were making decisions based on them.

*The concepts here are replicated from production work I cannot detail. Every figure below is
computed by the script linked at the end, on synthetic data, and reproduces with a fixed seed.
Nothing here is a measurement of any system I have worked on.*

---

## 1. Three questions people insist on treating as one

Start upstream of the bug, because the bug is only the delivery mechanism.

An ML feature in production is not one thing. A prediction request clears several independent
gates before anybody gets an answer, and those gates fail for unrelated reasons owned by
different parts of the system. Does a fresh model exist for this entity at all? If it does,
does the artifact load and do the features resolve? If something comes back, is it right?

If you have one number called "is the ML feature working," you have blended those. The blend
fails in a specific and frustrating way. The number goes down, and you cannot tell anybody
what to do about it.

So split it, and give each part a name and an owner.

- **Availability.** Does a fresh, loadable model exist at request time? A training and
  retention question.
- **Reliability.** Given a model exists, does the request come back with a confident answer? A
  serving question.
- **Accuracy.** Given a confident answer, is it right? A modelling question.

Three questions, three owners, three different fixes, and three different denominators.

Hold that last point.

![Six stages, three owners, and the narrowest pipe sets the flow](/diagrams/03-six-stage-funnel.svg)

The useful property of drawing it this way is that the narrowest pipe sets the flow, and you
can only see which pipe is narrowest if every stage is measured separately.

---

## 2. Fifteen lines of code

Model artifacts sit in object storage with a time to live. The artifact expires, a request
arrives for that entity, the storage client raises an exception.

The categoriser turning exceptions into metric buckets does what a reasonable person would
write. It looks at the exception type, sees a storage client exception, files it under
network. Anything it cannot place goes into a bucket called `unknown`.

Here is the problem. "The artifact is not there" is not a network error. It is not an error at
all in the sense that matters. It is the absence of a model, it belongs entirely to the
availability question, and it has just been counted against reliability, where it looks like a
serving failure.

Two things let this survive for quarters rather than days.

The residual bucket grows quietly. Because the error text varies depending on which storage
path failed, a large share never even reaches the wrong named bucket. It lands in `unknown`. A
system can reach a state where most of its failure events are uncategorised while both
headline numbers are computed from those same categories and rendered to one decimal place.

And the wrong number is plausible. This is the real defence mechanism. Eighty eight percent
availability is exactly what a maturing ML feature ought to look like. A number that is
obviously wrong gets caught in a week. A number that matches everybody's expectations gets
quoted in planning documents until somebody trips over the code.

There is a corollary I did not see for a long time. If a serving path is being reported as
broken when it is fine, then every hour spent hardening it was spent on the wrong problem, and
a metric sent it there. Bad instrumentation does not just misinform you. It allocates your
engineering effort.

---

## 3. The chart where nothing happened

Now the part I actually want to write about.

Simplify the two panels.

```
availability = success / (success + model_missing)
reliability  = success / (success + load_error)
```

The categoriser fix moves a mass of events out of `load_error` and into `model_missing`.
Nothing else changes.

Follow the consequence. That mass leaves reliability's denominator, so reliability goes up. It
enters availability's denominator, so availability goes down. Two panels, two large arrows,
two completely spurious stories, and both of them read like a result.

Here it is on a population where I control every count. One hundred thousand requests, twenty
two thousand successes, and neither figure moves at any point.

```
                          before     after      move   formula
Availability panel        78.6%     26.5%     DOWN    success / (success + missing)
Reliability panel         23.4%     56.4%       UP    success / (success + load_error)
Raw success rate          22.0%     22.0%      none   success / all attempts
```

Availability falls fifty two points. Reliability rises thirty three. The world is frozen. The
only change is which bucket fifty five thousand events are counted in.

![Two panels moving opposite ways, with neither delta real](/diagrams/03-denominator-shift.svg)

Read that last row again. The raw success rate cannot move, by construction, because it has no
category in its denominator. It is the only honest number on the chart. It is also the most
boring one, which is why nobody leads with it.

> **When you fix an instrument, publish a re-baseline, not a delta.** Any metric whose
> denominator is composed of categories becomes discontinuous the moment you change the
> categorisation, and every rate derived from it is uncomparable across that boundary.

---

## 4. Three habits that fall out

**Lead with a metric that is invariant to reclassification.** Successes over all attempts. No
category in the denominator, so no reclassification can touch it. It is a far less exciting
number than either panel arrow and it is the only true one. If the raw rate moves, something
happened in the world. If only the composed rates move, you changed a definition.

**Put a permanent marker on the chart.** A vertical line on the deploy date, labelled
"measurement methodology changed here, do not compare across this line." Permanent, not a
temporary annotation, because somebody will pull that chart in a year with no memory of any of
this and read straight across it.

**Say it out loud in the write-up.** A sentence close to: *across this deploy the two panels
move in opposite directions and neither delta is real; both are the classification fix
correctly reshuffling each panel's denominator.*

Writing that felt like giving up a good headline. It was the most credibility-building
sentence in the document, because the next time we reported a genuine five point move,
everybody believed it.

---

## 5. Two things worth building while you are in there

**Declare the taxonomy in one place.** Replace bucket inference from exception classes with an
ordered pattern table mapping to a closed enumeration: `success`, `model_missing`,
`bad_request`, `transient_error`, `error`. Keep a residual bucket, give it a single digit
target, and alarm on it. The property that matters is that somebody who is not reading a stack
trace can review the entire taxonomy on one screen. Ours had grown by accretion inside a
try-except ladder, which is how every error taxonomy grows unless somebody stops it.

**Check that your index and your objects expire together.** Model files expire at thirty days.
The lookup index pointing at them has no expiry. So the index keeps confidently returning
locations for objects that were deleted weeks earlier. Every request for an expired entity
does a lookup, gets a location, fetches, fails, retries. At fleet scale that is enough traffic
to hit storage throttling, and the throttling then spills onto entities whose models are
perfectly fine.

I have now seen this in three different systems and the signature is identical every time.
Mysterious throttling, and load that scales with the number of broken things rather than the
number of working ones. It is a checklist item.

---

## 6. Measure twice, by volume and by entity

One more choice that paid for itself immediately. Compute every funnel metric two ways.
Request-weighted, where each request counts once. Entity-weighted, where each tenant counts
once regardless of volume.

On any long-tail population these diverge violently, and the divergence is the diagnostic
rather than an annoyance. From the same simulated outage:

```
  Request-weighted:  90% of all failure volume comes from 10 entities.
                     Reads as: 'ten entities are broken, go fix those ten.'

  Entity-weighted:   1,510 of 2,000 entities (76%) degraded.
                     Reads as: 'most of the fleet is having a bad time.'
```

Both are true. The first is small, tractable and almost reassuring. The second is a different
problem with a different fix and a different urgency, and it is the one your users are living
in.

Report only the first and you systematically hide a broad shallow outage behind a few loud
deep ones. That is the failure mode of every volume-weighted metric on a long tail, and it
costs one extra `COUNT(DISTINCT entity)` to avoid.

---

## 7. What I would tell somebody starting this

An entire first quarter of reliability work can turn out to be measurement work. That is
frustrating while it is happening. I now think it is the normal and correct order, and I would
plan for it rather than discover it.

Three things you can do this week.

Find every dashboard rate whose denominator is a sum of categories, and write down what would
happen to it if you reclassified a large bucket. Not what you think should happen. The
arithmetic.

Check what fraction of your failure events are sitting in a residual bucket right now. If it
is above single digits, your headline numbers are opinions.

Confirm that your caches and indexes expire no later than the things they point at.

The script producing every number in this post is on GitHub: [`denominator_shift.py`](https://github.com/peeyushpashine/peeyush-portfolio/blob/main/code/denominator_shift.py). No
dependencies, runs instantly, and you can change the counts and watch both panels lie about a
world you control.

---

*Concepts replicated from production work I cannot detail. All figures computed on synthetic
data by the linked script.*
