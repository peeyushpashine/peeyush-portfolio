"""
Safety dampeners compose multiplicatively
=========================================

Four safeguards. Each one individually defensible, each reviewed by a different
person, each attenuating the same effect a little. Nobody computes the product,
because the product is not any single reviewer's responsibility.

This is what an inert feedback loop looks like from the inside.

Reproduce: python dampener_stack.py   (no dependencies)

"""

MEASURED_LIFT = 10.0   # percentage points, established in a clean harness

DAMPENERS = [
    ("Confidence floor at 0.65",
     0.38,
     "genuine consensus on a subjective label is rarely emphatic, so most of it lands below the floor"),
    ("Class bias cap, inside the overlay",
     0.60,
     "the cap belongs here and is correct"),
    ("Class bias cap again, at prediction time",
     0.60,
     "a separate guard, different author, different reason, same quantity"),
    ("Downstream rule layer can override",
     0.70,
     "runs after the overlay and knows nothing about the correction"),
]

print("=" * 74)
print("WHAT SURVIVES THE STACK".center(74))
print("=" * 74)
print(f"\nEffect measured in the harness: {MEASURED_LIFT} points\n")
print(f"{'stage':<46}{'passes':>9}{'remaining':>19}")
print("-" * 74)

surviving = 1.0
print(f"{'(as measured, no dampeners)':<46}{'':>9}{MEASURED_LIFT:>15.2f} pts")
for name, passes, _why in DAMPENERS:
    surviving *= passes
    print(f"{name:<46}{passes:>8.0%}{MEASURED_LIFT * surviving:>15.2f} pts")

print("-" * 74)
print(f"{'PRODUCT':<46}{surviving:>8.1%}{MEASURED_LIFT * surviving:>15.2f} pts")

print("\n" + "=" * 74)
print("Every individual number above would pass review. Not one of them is")
print("unreasonable. The product is what shipped, and the product had no owner.")
print("=" * 74)

# ---------------------------------------------------------------------------
print("\n" + "=" * 74)
print("HOW FAST THIS GETS BAD".center(74))
print("=" * 74)
print("\nIdentical, individually mild dampeners, stacked:\n")
print(f"{'each passes':>12}" + "".join(f"{n:>10}" for n in range(1, 7)))
print("-" * 74)
for p in (0.90, 0.80, 0.70, 0.60, 0.50):
    row = "".join(f"{p**n:>9.0%} " for n in range(1, 7))
    print(f"{p:>11.0%} {row}")

print("\nThree measures that each keep 60 percent leave you 22 percent.")
print("The more safety-conscious the culture, the more of these accumulate,")
print("which is a genuinely uncomfortable thought.")
print("=" * 74)

print("\n" + "=" * 74)
print("The test that would have caught it on day one:")
print()
print("  1. Accept a correction.")
print("  2. Send a matching input.")
print("  3. Assert the prediction changed.")
print()
print("One integration test, end to end, in the environment where it runs.")
print("=" * 74)
