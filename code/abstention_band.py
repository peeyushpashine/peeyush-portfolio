"""
Shrinking the abstain band converts visible uncertainty into invisible error
===========================================================================

A classifier with three outputs: quiet it, show it, or abstain. Abstention shows
the item and offers no opinion.

Every dashboard review wants the abstain rate to go down. Here is what happens
when it does.

Reproduce: pip install numpy, then python abstention_band.py
"""
import numpy as np

rng = np.random.default_rng(42)
N = 200_000

# Truth: is this item worth a human? Scores overlap, because the label is
# genuinely subjective and no threshold separates the classes cleanly.
is_signal = rng.random(N) < 0.30
score = np.where(is_signal, rng.beta(5, 3, N), rng.beta(3, 5, N))  # model confidence it is noise

print("=" * 72)
print("SHRINKING THE ABSTAIN BAND".center(72))
print("=" * 72)
print("\nAbstain when the score sits inside a dead band around 0.5.\n")
print(f"{'half-width':>11}{'abstain rate':>15}{'quieted noise':>16}{'MISSED SIGNAL':>16}")
print("-" * 72)

for half in (0.30, 0.25, 0.20, 0.15, 0.10, 0.05, 0.00):
    lo, hi = 0.5 - half, 0.5 + half
    abstain = (score > lo) & (score < hi)
    quiet = (score <= lo) & ~abstain          # low score means "noise", quiet it
    # a miss is a real signal that got quieted with no human ever seeing it
    missed = (quiet & is_signal).sum()
    quieted_noise = (quiet & ~is_signal).sum()
    print(f"{half:>11.2f}{abstain.mean():>14.1%}{quieted_noise/max((~is_signal).sum(),1):>16.1%}"
          f"{missed:>16,}")

print("\n" + "=" * 72)
print("Read the last two columns together. Every point of abstain rate you buy")
print("back arrives as quieted noise AND as missed signal. The dashboard number")
print("improves. The system gets more dangerous.")
print()
print("An abstention cannot suppress a signal. By construction. It is a release")
print("valve on the exact pressure you are most afraid of.")
print("=" * 72)
