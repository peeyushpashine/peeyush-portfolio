"""
The gate trap
=============

A labelling rule that references a feature the model also sees produces
circularity you cannot detect from inside your own evaluation.

Setup. Items have a priority, 1 (highest) to 5. In the world, some high-priority
items really are routine noise: the health check somebody configured at P2 three
years ago and nobody has touched since.

The labelling rule is written safety-first: only label something noise if its
priority is 4 or 5. The reasoning sounds right. Do not teach the model that
important things are quietable.

Watch what that one gate does.

Reproduce: pip install scikit-learn, then python gate_trap.py
"""
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, recall_score

RNG = 42
rng = np.random.default_rng(RNG)
N = 20_000

# ---- the world -------------------------------------------------------------
priority = rng.choice([1, 2, 3, 4, 5], size=N, p=[.08, .17, .25, .30, .20])
recurrence = rng.gamma(2.0, 2.0, size=N)         # how often this shape repeats
auto_resolves = rng.random(size=N) < 0.45        # does it clear without a human
noisy_source = rng.random(size=N) < 0.35         # flappy source system

# Ground truth: noise is about behaviour, not priority. Priority is weakly
# correlated with it, which is exactly why gating on priority feels reasonable.
noise_logit = (1.5 * (recurrence > 4) + 1.2 * auto_resolves + 1.0 * noisy_source
               + 0.25 * (priority >= 4) - 2.0)
truth_noise = rng.random(size=N) < 1 / (1 + np.exp(-noise_logit))

X = np.column_stack([priority, recurrence, auto_resolves, noisy_source])

# ---- the labelling rule, with the safety gate ------------------------------
looks_like_noise = (recurrence > 4) & (auto_resolves | noisy_source)
rule_label = looks_like_noise & (priority >= 4)          # <-- the gate

high_pri_noise = truth_noise & (priority <= 3)
print(f"High-priority items that are genuinely noise: {high_pri_noise.sum():,} "
      f"({high_pri_noise.mean():.1%} of all items)")
print(f"How many the labelling rule can ever mark as noise: "
      f"{(rule_label & (priority <= 3)).sum()}")

# ---- train on rule labels, evaluate two ways -------------------------------
idx = np.arange(N)
tr, te = train_test_split(idx, test_size=0.3, random_state=RNG, stratify=rule_label)

model = HistGradientBoostingClassifier(random_state=RNG).fit(X[tr], rule_label[tr])
pred = model.predict(X[te])
proba = model.predict_proba(X[te])[:, 1]

print("\n" + "=" * 66)
print("GRADED AGAINST THE RULE LABELS (what your dashboard shows)")
print("=" * 66)
print(f"  AUC                                    {roc_auc_score(rule_label[te], proba):.4f}")
print(f"  high-priority noise cases in the test set    "
      f"{(rule_label[te] & (priority[te] <= 3)).sum()}"
      "   (none, so none can be failed)")

print("\n" + "=" * 66)
print("GRADED AGAINST THE TRUTH (what is actually happening)")
print("=" * 66)
print(f"  AUC                                    {roc_auc_score(truth_noise[te], proba):.4f}")
hp = priority[te] <= 3
lp = priority[te] >= 4
print(f"  recall on noise, low priority          "
      f"{recall_score(truth_noise[te][lp], pred[lp], zero_division=0):.4f}")
print(f"  recall on noise, HIGH priority         "
      f"{recall_score(truth_noise[te][hp], pred[hp], zero_division=0):.4f}   <-- structurally zero")

print("\n" + "=" * 66)
print("One gate, three failures:")
print("  1. the model cannot learn high-priority noise, no dataset would help")
print("  2. the evaluation cannot detect that, the cases are excluded from the exam")
print("  3. a calibration set for this class cannot be built from these labels")
print("=" * 66)
