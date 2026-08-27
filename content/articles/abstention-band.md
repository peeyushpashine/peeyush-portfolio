---
title: "Accuracy Is the Wrong Target When One Mistake Wakes Somebody at 3 a.m."
standfirst: "Four outcomes, one of them incident-grade, and why shrinking the uncertain band makes the dashboard better and the system worse."
date: "2026-09-28"
draft: true
---

A classifier with two classes has four outcomes, and treating them as equally costly is a
category error that no amount of model tuning corrects.

This is obvious when stated. It is routinely ignored in practice, because accuracy is one
number, everybody knows what it means, and the alternative requires you to hold four numbers
in a room at once and explain why you will not average them.

This post is about what to optimise instead, and about a specific trap that will make your
dashboard improve while your system becomes more dangerous.

*The concepts here are replicated from production work I cannot detail. Every figure below is
computed by the script linked at the end. Nothing here is a measurement of any system I have
worked on.*

---

## 1. Only one of the four is an incident

Take **signal**, meaning worth a human's attention, as the positive class.

- **True positive.** Real signal, shown. Correct, and invisible, which is the goal.
- **True negative.** Real noise, quieted. This is the entire product. Every one of these is an
  interruption that did not happen.
- **False positive.** Noise, shown anyway. Annoying, costs attention, erodes trust slowly.
  Tolerable.
- **False negative.** Real signal, quieted. **The only incident-grade error in the system.** A
  smoke alarm somebody switched off during a fire.

![The four outcomes with their real costs](/diagrams/02-asymmetric-outcomes.svg)

Write it that way and the objective writes itself, and it is not a classification objective.

> **Maximise correctly-quieted noise, subject to the missed-signal rate staying under a
> per-tier budget.**

Stricter budget where a miss is an outage. Looser where a miss is a Monday-morning discovery.
That is cost-sensitive learning with abstention, which Charles Elkan wrote up properly in 2001,
and if you treat it as plain binary classification you will spend a year tuning the wrong thing.

The practical consequence is that we stopped reporting accuracy at all. Every experiment,
every proposed rule, every threshold change reports four numbers separately.

| Metric | What it is | How it is treated |
|---|---|---|
| Missed-signal rate | Predicted quiet, actually signal | **Protected.** A hard gate. Breach it and the change does not ship, whatever else improved. |
| Correctly-quieted rate | Predicted quiet, actually noise | Maximise, under the gate above. |
| Correction rate | Corrections over accepts plus corrections | The honest read on whether we are right. |
| Accept rate | Accepts over accepts plus corrections | Tracked **separately**. |

That last row took me embarrassingly long to see and I think it is the most transferable idea
here. Accept rate and correction rate are arithmetically two views of one ratio, but they
respond to different interventions.

Improve the explanation attached to a prediction and users will accept more of them without
the model getting one bit more correct. Report a single blended trust number and you will ship
an explanation improvement, book it as an accuracy win, and be baffled six months later when
the missed-signal rate has not moved.

Two metrics, side by side, permanently.

---

## 2. Abstention is a safety mechanism, not a failure

Give the system a third output: **not sure**. Show the item, offer no opinion, ask the human.

The instinct in every dashboard review I have sat in is that this number should go down.
Unknowns look like the model failing to do its job. Somebody always proposes shrinking the
band.

Here is why that instinct is dangerous. **An abstention cannot suppress a signal.** By
construction. The item is shown, the human sees it, the loop is intact. Abstention is a
release valve on the exact pressure you are most afraid of.

Shrink the band and every item you pull out of it goes to one side or the other. Some of the
ones going to the quiet side are real signals.

Watch it happen. Two hundred thousand items, a genuinely overlapping score distribution
because the label is subjective, and the abstain band narrowing from wide to nothing:

```
 half-width   abstain rate   quieted noise   MISSED SIGNAL
       0.30          84.8%           14.8%             278
       0.25          74.4%           24.4%             754
       0.20          62.0%           35.2%           1,704
       0.15          47.8%           46.8%           3,332
       0.10          32.4%           58.0%           5,805
       0.05          16.4%           68.3%           9,147
       0.00           0.0%           77.3%          13,625
```

Read the last two columns together. Every point of abstain rate you buy back arrives as
quieted noise **and** as missed signal. Going from a 0.15 band to no band at all doubles your
quieted noise and quadruples your misses.

You have not reduced uncertainty. You have converted visible uncertainty into invisible error.
The number on the dashboard improves and the system gets more dangerous.

So put the guardrail in the harness rather than in the review:

> Any candidate change that reduces the unknown rate must report its missed-signal delta in
> the same table, and a change that buys a lower unknown rate with a higher miss rate fails
> automatically.

An automated column, not a review convention, because review conventions lose to a
nice-looking chart about a third of the time.

**The legitimate way to shrink abstentions is narrower.** We found the inference path was
collapsing every ambiguous case to not-sure unconditionally, including near-ties where one
side was genuinely ahead. Replacing the blanket collapse with a confidence-banded tiebreak,
surfacing the leader at reduced confidence when it sits outside a genuine dead band, cut
unknowns substantially at zero added misses. That is a real win, and it is a real win
precisely because we could prove the second half of the sentence.

---

## 3. Your users will not report the error that matters

Now the structural problem underneath all of this.

The mechanism generating your correction data is anti-correlated with the error you most need
to measure.

Think about who reports what. A false positive is visible: the item was shown, it was noise,
the user is mildly annoyed and can tell you so. A false negative is invisible **by
construction**, because the item was quieted and the user never saw it. Nobody files a
complaint about a notification they did not receive.

So your feedback stream fills up with exactly the error class you care about least, and stays
silent on the one that can hurt somebody. Every correction you collect makes your precision
estimate better and your recall estimate no better at all.

This is not a data quality problem you can fix with more volume. More users generate more of
the same asymmetry.

Three channels help, and none of them require the user to notice anything.

**Log the decision you did not make.** Record the counterfactual. When you quiet something,
store enough to reconstruct what would have been shown, so the population of suppressed items
is inspectable later rather than gone.

**Watch what the human did next.** If something was quieted and the same person went looking
for it, opened the source, or acted on the underlying problem within the hour, that is a miss
telling you about itself without anybody filing anything.

**Sample and audit.** A few hundred quieted items a month, reviewed by somebody who did not
build the system. Small, expensive, and the only channel that gives you an unbiased estimate.

---

## 4. Arithmetic that keeps you honest in the room

Two rules that have saved me from overstating a result more than once.

**Gate the win by the precision.** Somebody will ask how many interruptions you can remove.
The raw count of things you would quiet is not the answer. The answer is that count multiplied
by your precision on the quiet class, because the rest are mistakes you are also making. If
those two numbers are far apart, quote the second one, and quote it before anybody else does
the multiplication.

**Never add percentages with different denominators.** A rate over all items and a rate over
items that reached a particular stage are not commensurable, and summing them produces a
confident number that means nothing. This happens constantly in funnel reporting and it always
flatters the result.

---

## 5. What I would tell somebody starting this

Decide what your incident-grade error is on day one, before you have a model, before you have
data, before anybody has proposed a metric. Write it on the wall. Everything else in your
measurement design falls out of that one choice, and if you make it late you will make it in
the presence of numbers you are already attached to.

Then accept that you will never measure it well from user feedback, and build one of the three
channels above immediately rather than after the first miss.

And when somebody proposes shrinking the uncertain band, ask them for the missed-signal delta
in the same breath. Not as a challenge. As a column in the table that was always going to be
there.

The script producing the abstention table is on GitHub: [`abstention_band.py`](https://github.com/peeyushpashine/peeyush-portfolio/blob/main/code/abstention_band.py). Change the
class overlap and watch how much worse the trade gets as the label becomes more subjective.

---

*Concepts replicated from production work I cannot detail. All figures computed on synthetic
data by the linked script.*
