"""
When the feature works best, the event stops existing
=====================================================

Any feature that prevents an event produces the same data on success as on
non-adoption: nothing.

Fraud blocked before it is attempted. Spam that stops being sent. A noisy
detector somebody finally fixed. Preventive maintenance that stops the failure.
If you measure the feature by the volume it handles, you are optimising against
your own best outcome.

Reproduce: python invisible_success.py   (no dependencies)
"""

MONTHS = 12
PATTERNS = 400          # distinct recurring problem patterns
EVENTS_EACH = 30        # events per pattern per month if left alone


def simulate(fix_rate, label):
    """fix_rate: share of surfaced patterns whose source gets fixed each month."""
    alive = PATTERNS
    rows = []
    for m in range(1, MONTHS + 1):
        volume = alive * EVENTS_EACH
        handled = volume                     # feature labels all of them
        fixed = int(alive * fix_rate)
        alive -= fixed
        rows.append((m, volume, handled, PATTERNS - alive))
    return label, rows


print("=" * 78)
print("TWO WORLDS, MEASURED THE USUAL WAY".center(78))
print("=" * 78)

for label, rows in (simulate(0.00, "A. Nobody acts on the labels"),
                    simulate(0.18, "B. Teams fix the source when a pattern is surfaced")):
    print(f"\n{label}")
    print(f"{'month':>7}{'events handled':>18}{'sources fixed':>16}")
    print("-" * 45)
    for m, _v, handled, fixed in rows:
        if m in (1, 3, 6, 9, 12):
            print(f"{m:>7}{handled:>18,}{fixed:>16}")

print("\n" + "=" * 78)
print("World B is the feature working exactly as intended. Its 'events handled'")
print("curve falls off a cliff, because the events stopped being generated.")
print()
print("Now compare against a third world: nobody adopted the feature at all.")
print("Events handled: zero, every month.")
print()
print("A falling handled-volume curve and an unused feature look similar enough")
print("on a dashboard that a reasonable person reads both as failure.")
print("=" * 78)

print("\n" + "=" * 78)
print("The metric to build instead:")
print()
print("  Count patterns where a classification was followed by a source change")
print("  and then a sustained drop in that pattern's volume.")
print()
print("That is attributable, it goes UP when the feature works, and it measures")
print("elimination rather than handling.")
print()
print("The reframe underneath it is a product one. The label is not a filter.")
print("It is a to-do: this thing is too chatty, go and fix it.")
print("=" * 78)
