"""
The denominator shift
=====================

Two dashboard panels move in opposite directions on the same deploy. Neither
movement is real. Nothing in the world changed. Only the label on a pile of
events changed.

This happens whenever a rate has categories in its denominator and you fix the
categoriser. Every derived rate becomes discontinuous at that boundary.

Reproduce: python denominator_shift.py  (no dependencies)
"""

# A fixed population of requests. These counts never change. The world is static
# for the whole of this script.
SUCCESS        = 22_000
MODEL_MISSING  = 61_000   # no model existed yet for this entity
LOAD_ERROR     = 17_000   # a model existed and the serving path failed

TOTAL = SUCCESS + MODEL_MISSING + LOAD_ERROR

# Before the fix, the categoriser could not tell "the artefact is absent" from
# "the artefact failed to load", so most absences were filed as load errors.
MISFILED = 55_000


def panels(model_missing, load_error):
    availability = SUCCESS / (SUCCESS + model_missing)
    reliability = SUCCESS / (SUCCESS + load_error)
    raw = SUCCESS / TOTAL
    return availability, reliability, raw


before = panels(MODEL_MISSING - MISFILED, LOAD_ERROR + MISFILED)
after = panels(MODEL_MISSING, LOAD_ERROR)

print("=" * 68)
print("SAME WORLD, BEFORE AND AFTER A CATEGORISER FIX".center(68))
print("=" * 68)
print(f"\nTotal requests: {TOTAL:,}   Successes: {SUCCESS:,}   (neither changes)\n")

rows = [
    ("Availability panel", before[0], after[0], "success / (success + missing)"),
    ("Reliability panel", before[1], after[1], "success / (success + load_error)"),
    ("Raw success rate", before[2], after[2], "success / all attempts"),
]

print(f"{'':<22}{'before':>10}{'after':>10}{'move':>10}   formula")
print("-" * 68)
for name, b, a, formula in rows:
    move = a - b
    arrow = "  UP " if move > 0.001 else ("DOWN " if move < -0.001 else "  none")
    print(f"{name:<22}{b:>9.1%}{a:>10.1%}{arrow:>10}   {formula}")

av_move = (after[0] - before[0]) * 100
rel_move = (after[1] - before[1]) * 100
print("\n" + "=" * 68)
print(f"Availability fell {abs(av_move):.0f} points. Reliability rose {rel_move:.0f}. "
      "No user experienced")
print(f"anything different. The only change was which bucket {MISFILED:,} events")
print("were counted in.")
print()
print("The raw success rate is invariant to reclassification, by construction.")
print("It is the only number from this deploy worth putting in a status update.")
print("=" * 68)

# ---------------------------------------------------------------------------
# The same data, weighted two ways.

import random
random.seed(42)

N_ENTITIES = 2_000
# long tail: a few entities generate most of the volume
volumes = sorted((int(random.paretovariate(1.1) * 40) + 1 for _ in range(N_ENTITIES)),
                 reverse=True)

# Ten loud entities are fully broken. A broad shallow failure touches many more.
broken_loud = set(range(10))
broken_shallow = set(random.sample(range(10, N_ENTITIES), 1_500))

fail_volume = sum(volumes[i] for i in broken_loud) + \
              sum(int(volumes[i] * 0.15) for i in broken_shallow)
total_volume = sum(volumes)
loud_share = sum(volumes[i] for i in broken_loud) / fail_volume

print("\n" + "=" * 68)
print("THE SAME OUTAGE, WEIGHTED TWO WAYS".center(68))
print("=" * 68)
print(f"\n  Request-weighted:  {loud_share:.0%} of all failure volume comes from 10 entities.")
print(f"                     Reads as: 'ten entities are broken, go fix those ten.'")
print(f"\n  Entity-weighted:   {len(broken_loud | broken_shallow):,} of {N_ENTITIES:,} entities "
      f"({len(broken_loud | broken_shallow)/N_ENTITIES:.0%}) degraded.")
print(f"                     Reads as: 'most of the fleet is having a bad time.'")
print("\nBoth are true. Reporting only the first hides a broad shallow outage")
print("behind a few loud deep ones. It costs one COUNT(DISTINCT entity).")
print("=" * 68)
