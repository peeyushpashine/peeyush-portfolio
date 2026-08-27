---
title: "Three Timers, Three Owners, and a Gap Nobody Designed"
standfirst: "Per-tenant ML puts you in a queueing problem before it puts you in a modelling one."
date: "2026-10-05"
draft: true
---

One model per customer is an appealing idea and it is often the right one. Behaviour varies so
much between tenants that a single global model is mostly averaging away the thing you care
about, and a per-tenant model learns each customer's actual patterns.

Then you have thousands of models, and you discover you are not running a modelling problem.
You are running a queue with a modelling problem attached to it.

This post is about the arithmetic of that, and specifically about a failure mode where three
independently reasonable configuration values combine to guarantee that every tenant has a
window with no usable model. Nobody designs this. It assembles itself.

*The concepts here are replicated from production work I cannot detail. Every figure below is
computed by the script linked at the end. Nothing here is a measurement of any system I have
worked on.*

---

## 1. Three timers, set by three people

Three independent numbers govern the life of a model.

**Artifact retention: 30 days.** Trained models go to object storage with a time to live. Set
by whoever configured the bucket, reasonably, to keep storage costs sane.

**Retrain interval: 15 days.** When a training job completes, the scheduler writes the next job
for that tenant fifteen days out. A sensible trade between freshness and compute cost.

**Queue latency: about 20 days.** The trainer pulls from the scheduled pool oldest first, and
the pool is deep enough that a job written today gets picked up roughly twenty days later.

Nobody set that third one. It is an emergent property of arrival rate and throughput, and it
drifts on its own while the other two sit in a config file looking stable.

Now put them together. The effective time between two successful trainings for a tenant is not
fifteen days. It is the retrain interval **plus** the queue latency. Roughly thirty five.

The artifact lives for thirty.

![The race nobody designed](/diagrams/04-ttl-race.svg)

Every tenant in the fleet is guaranteed a window, every cycle, in which their model has expired
and its replacement has not been built yet. Not a bug in anybody's code. Three numbers, each
individually reasonable, chosen by three different people at three different times, that cannot
all be satisfied at once.

```
scenario                      retain  retrain  queue  cycle   dark days   ratio
as configured                     30       15     20     35          +5    1.17  BREACH
retention raised to 90            90       15     20     35        none    0.39
backlog doubles                   90       15     40     55        none    0.61
backlog triples                   90       15     70     85        none    0.94  BREACH
someone tightens retrain          90        7     70     77        none    0.86  BREACH
```

Look at the last two rows. Raising retention to ninety days buys real headroom, and then the
backlog grows and eats it, and nobody notices because the backlog is not a configured value
that shows up in a review.

The final row is my favourite kind of bug. Somebody tightens the retrain interval from fifteen
days to seven, which is unambiguously an improvement in model freshness, and it moves the
system closer to breach rather than further from it. Their change was correct. The system was
already sitting on the edge of an inequality nobody had written down.

The invariant is embarrassing once you see it:

> **retention > queue latency + retrain interval,** with margin.

Which becomes a monitored ratio with a pager on it:

```
(queue_backlog_days + retrain_interval_days) / retention_days   must stay below 0.8
```

**If your system has more than one independently configured timer, write down the inequality
they must jointly satisfy and monitor the inequality, not the timers.** Each timer had an
owner. The relationship between them had none, which is why it went unwatched for as long as
it did.

And it was not found by a monitor. It was found by somebody sitting down and multiplying.

---

## 2. The queue does not drain to zero, and that is correct

The instinct on seeing a twenty day backlog is to treat it as a failure and drive it to zero.

That instinct is wrong, and understanding why changes how you think about the whole system.

The queue is recirculating. Every completed job schedules its own successor. So the steady
state is not empty; the steady state is a standing population set by Little's Law, where the
number of jobs in the system equals the arrival rate times the time each spends in it. With
thousands of tenants each rescheduling on a fixed interval, the arrival rate is fixed by
construction. You do not get to reduce it without reducing the fleet or lengthening the
interval.

So there is no version of this where the queue is empty. There is only a version where the
standing population is small enough that the latency it implies fits inside your retention
window.

This reframes the problem usefully. You are not trying to clear a backlog. You are trying to
keep a steady-state number below a threshold set by a different subsystem's TTL.

---

## 3. Two leaks, and only one heals itself

A recirculating queue has a specific pathology: work that can never succeed still consumes
capacity, forever, because failure reschedules it.

**Work that cannot succeed, retried indefinitely.** A tenant with insufficient history, or
corrupted input, or some permanent condition that makes training impossible. The job fails.
The scheduler writes the next one. It fails again. This tenant now consumes a slot every cycle
for the rest of time, and there is no natural mechanism that removes it, because the removal
mechanism is success.

**Work that never entered the queue.** The mirror image, and harder to see. A tenant that
should be scheduled but is not, because a job write failed silently, or the tenant was created
through a path that skipped registration. It never fails, so it never alerts. It is simply
absent, and absence does not generate signals.

The first leak wastes capacity loudly. The second wastes nothing and quietly leaves tenants
without models forever.

The sequencing rule that falls out: **cap the retries before you widen the pipe.** If you add
capacity while permanent failures are still recirculating, you have bought more throughput for
work that cannot succeed, and the leak scales with your fix. Bound the retries, move exhausted
work to a dead state that alerts, and only then look at throughput.

For the second leak, the check is a reconciliation rather than a monitor. Periodically compare
the set of tenants that should have a scheduled job against the set that does. It is a cheap
query and it is the only thing that finds absence.

---

## 4. A query that lies about its own subject

One more, because it cost real time and it is a general trap.

If you query your scheduling store for the distribution of job ages, you are querying jobs
that exist. Tenants whose jobs were never written, or were written and lost, are not in the
result. Your backlog analysis is computed over the population that is working correctly enough
to appear in it.

This is survivorship bias with a database in the middle, and it is easy to walk into because
the query looks complete. It returns rows, the rows have a sensible distribution, and nothing
about the output announces that its subject is defined by the thing you are trying to measure.

Anchor the query on the population that should exist, not the one that does. Start from the
tenant list and left-join the jobs. The nulls are the answer.

---

## 5. What I would tell somebody starting this

Per-tenant models are worth it. The behaviour really does differ enough per customer to
justify the machinery, and a global model really does average away the thing you were trying
to learn.

But be clear with yourself that you are taking on a distributed systems problem in exchange
for a modelling win, and that the distributed systems problem will consume more of your time
than the modelling did.

So, before the first model trains:

Write down every timer in the system, who owns it, and the inequality they jointly satisfy.
Monitor the inequality. This is a whiteboard exercise and it takes an hour.

Cap retries on day one, and make exhausted work loud rather than silent.

Build the reconciliation between tenants that should be scheduled and tenants that are, and
run it on a schedule. Absence is the failure mode that nothing else will surface.

And treat the queue latency as a first-class number rather than an implementation detail. It
is the only one of the three timers that moves without anybody deciding to move it, and it is
therefore the one that will eventually break your invariant.

The script producing the table above is on GitHub: [`timer_race.py`](https://github.com/peeyushpashine/peeyush-portfolio/blob/main/code/timer_race.py). No dependencies. Put
your own timers in and see whether you are already in breach.

---

*Concepts replicated from production work I cannot detail. All figures computed by the linked
script.*
