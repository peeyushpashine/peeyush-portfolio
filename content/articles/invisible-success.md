---
title: "When Your Feature Works Best, the Data Disappears"
standfirst: "A successfully prevented problem and a feature nobody uses produce the same evidence: nothing."
date: "2026-09-21"
draft: true
---

Adoption looked healthy. Volume handled was climbing. The dashboard was green in every panel I
had built.

I had designed those panels, and I eventually worked out that the composite score at the top of
them was structurally incapable of reporting bad news. There was no term in it that could go
down when the feature did something harmful. Every input was a thing that increases when people
use it more.

That was the smaller problem. The larger one took longer to see and it is the reason for this
post.

**The best thing the feature did was invisible to every metric, because when it worked
properly the events it handled stopped being generated at all.**

*The concepts here are replicated from production work I cannot detail. Every figure below is
computed by the script linked at the end. Nothing here is a measurement of any system I have
worked on.*

---

## 1. The shape of the problem

Some features handle a problem. Some features remove it.

If you build something that classifies incoming items and helps a person deal with them, the
obvious measure is how many items it handled. It goes up when people adopt it, up when volume
grows, and up when the thing is working. Everybody understands it.

Now suppose users do something you did not design for. Instead of only using the label to
triage, they treat a repeated label as a prompt to go and fix the source. The item keeps
getting classified the same way, somebody notices, and they change the thing generating it so
it stops.

That is a categorically different kind of value.

- Handling it at triage time helps with **one item, once.**
- Fixing the source removes that item **permanently, for everybody.**

It compounds. It is also completely invisible to a handled-volume metric, and worse than
invisible, because it drives that metric down.

---

## 2. Two worlds that look the same on a dashboard

Same feature, same adoption, twelve months. The only difference is whether teams act on what
they are shown.

```
A. Nobody acts on the labels
  month    events handled   sources fixed
      1            12,000               0
      6            12,000               0
     12            12,000               0

B. Teams fix the source when a pattern is surfaced
  month    events handled   sources fixed
      1            12,000              72
      6             4,500             277
     12             1,410             361
```

World B is the feature working exactly as intended. Its headline number fell by eighty eight
percent.

Now hold a third world next to it: nobody adopted the feature at all. Events handled, zero,
every month.

A falling handled-volume curve and an unused feature look similar enough on a chart that a
reasonable person reads both as failure. If you are reporting World B to leadership using the
metric you built for World A, you are reporting your best outcome as a decline.

> **When the feature works best, the event stops existing. A successfully fixed source and a
> feature nobody uses produce the same data: nothing.**

Follow that to its conclusion. If you optimise for handled volume, you are at the margin
optimising against your own best outcome. You would rather the source stayed broken.

---

## 3. This is not specific to one domain

I want to be explicit about the generalisation, because I think this is common and rarely
named.

Any feature whose success prevents an event has this property. Fraud prevention that deters an
attempt that is therefore never recorded. Spam filtering good enough that the sender stops
sending. Preventive maintenance that stops a failure you then cannot count. A linter that
changes how people write code so the violations disappear. Documentation that works, measured
by support tickets.

In every one of those, the natural volume metric moves the wrong way on success. And in every
one, "nobody is using it" and "it worked so well the problem went away" produce the same
telemetry.

If you own a feature like this, the question to ask is not "what is our adoption." It is:
**what would this dashboard look like if the feature had completely succeeded, and can I tell
that apart from complete failure?**

If you cannot tell them apart, you do not have a measurement problem to fix later. You have a
measurement that will actively mislead you at the exact moment things go right.

---

## 4. A single composite score cannot report bad news

The other half of this, briefly, because it is the same mistake in a different costume.

I built a composite value score. Weighted inputs, one number, tracked over time, easy to put
on a slide. It had three flaws and I only see the third one clearly in hindsight.

Every input was a usage quantity, so the score rose with adoption regardless of whether the
feature was doing anything useful. There was **no safety term at all**, meaning nothing in the
formula could go down if the feature started causing harm. And weighting decisions I made in
an afternoon became, once the number was on a slide, the organisation's definition of value.

A composite score with no term that can fall is not a measurement. It is an advocacy
instrument for the thing it measures, and I built it, and it took me an uncomfortably long time
to notice.

The replacement was a pair, not a number. One measure of benefit and one measure of harm,
reported side by side, permanently, with a rule that the harm measure gates the benefit
measure rather than being averaged with it.

---

## 5. The metric I would build first

Not handled volume. This:

> Count the patterns where a classification was followed by a change at the source, and then a
> sustained drop in that pattern's volume.

It is attributable, it goes up when the feature works, and it measures elimination rather than
handling. It is harder to compute than a count, which is presumably why nobody starts there.

And there is a product reframe underneath it that is better than the metric.

**The label is not a filter. It is a to-do.** "This thing is too chatty, go and fix it." Once
you see the users doing that on their own, the right response is to build the product they are
already improvising: surface the recurring patterns per team as a work list rather than as a
classification, and close the loop by tracking what happened after.

We found that by asking six people to narrate their week. Not from the data, because the data
could not contain it.

---

## 6. What I would tell somebody starting this

Three things, in the order I wish I had done them.

**Write down what complete success looks like in your telemetry, before you build the
telemetry.** If the answer is "the numbers go to zero," you need a different denominator or a
different metric entirely. This takes twenty minutes and it is the highest-leverage twenty
minutes in the project.

**Never ship a single composite score without a term that can fall.** If no input to your
formula can decrease when the feature causes harm, the formula is incapable of telling you
about harm, and everybody reading it will believe it can.

**Go and ask people what they do with your output.** The most valuable behaviour our users had
was one we did not design, did not measure, and could not have discovered from the data,
because the data was the wrong shape to contain it. Six conversations found it. No amount of
dashboard work would have.

The script producing every number here is on GitHub: [`invisible_success.py`](https://github.com/peeyushpashine/peeyush-portfolio/blob/main/code/invisible_success.py). No
dependencies. Change the fix rate and watch your best outcome turn into a declining chart.

---

*Concepts replicated from production work I cannot detail. All figures computed on synthetic
data by the linked script.*
