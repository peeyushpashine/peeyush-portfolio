"""
Three timers, set by three people, that cannot all be satisfied
==============================================================

Per-tenant ML: one model per customer, trained on a schedule, stored with a TTL.
Three independent numbers govern a model's life. Each has an owner. The
relationship between them has none.

Reproduce: python timer_race.py   (no dependencies)
"""

def dark_window(retention, retrain_interval, queue_latency):
    """Days per cycle with no usable model. Negative means healthy."""
    cycle = retrain_interval + queue_latency
    return cycle - retention, cycle


CONFIGS = [
    ("as configured",              30, 15, 20),
    ("retention raised to 90",     90, 15, 20),
    ("backlog doubles",            90, 15, 40),
    ("backlog triples",            90, 15, 70),
    ("someone tightens retrain",   90,  7, 70),
]

print("=" * 76)
print("THE RACE NOBODY DESIGNED".center(76))
print("=" * 76)
print(f"\n{'scenario':<28}{'retain':>8}{'retrain':>9}{'queue':>7}{'cycle':>7}"
      f"{'dark days':>12}{'ratio':>8}")
print("-" * 76)

for name, retention, retrain, queue in CONFIGS:
    dark, cycle = dark_window(retention, retrain, queue)
    ratio = cycle / retention
    flag = "  BREACH" if ratio >= 0.8 else ""
    shown = f"{dark:+d}" if dark > 0 else "none"
    print(f"{name:<28}{retention:>8}{retrain:>9}{queue:>7}{cycle:>7}{shown:>12}{ratio:>8.2f}{flag}")

print("\n" + "=" * 76)
print("Row one. Retention 30 days. Effective time between two successful")
print("trainings is retrain interval PLUS queue latency, which is 35.")
print()
print("The artifact lives for 30. Every tenant, every cycle, is guaranteed a")
print("window where the model has expired and its replacement does not exist.")
print()
print("Not a bug in anybody's code. Three reasonable numbers, three owners,")
print("three different weeks, that cannot all be satisfied at once.")
print("=" * 76)

print("\n" + "=" * 76)
print("The invariant, which is embarrassing once written down:")
print()
print("    retention  >  queue_latency + retrain_interval,  with margin")
print()
print("Monitor the ratio, not the timers:")
print()
print("    (queue_backlog_days + retrain_interval_days) / retention_days  <  0.8")
print()
print("Queue latency is the one nobody sets. It is an emergent property of")
print("arrival rate and throughput, and it moves on its own.")
print("=" * 76)
