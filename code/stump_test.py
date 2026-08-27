"""
The stump test
==============

A diagnostic for one specific failure: your model has learned the rule that
generated your labels, rather than anything about the world.

The idea. Fit a deliberately weak model, a decision tree capped at ten leaves,
alongside your real one. Measure how much of the strong model's lift over chance
the weak one recovers. If a ten-leaf tree gets nearly all of it, your label is a
thin function of your features, and your headline score is measuring the
labelling rule's self-consistency.

Two experiments, both reproducible in about a minute:

  1. A controlled sweep over label complexity, holding features fixed.
  2. Real data, one feature matrix, two different label sources.

Reproduce: pip install scikit-learn, then python stump_test.py
"""
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler

RNG = 42
CV = StratifiedKFold(n_splits=5, shuffle=True, random_state=RNG)
STUMP_LEAVES = 10
CIRCULAR_AT = 0.90


def stump_test(X, y):
    """Returns (full AUC, stump AUC, fraction of lift the stump recovers)."""
    full = cross_val_score(
        HistGradientBoostingClassifier(random_state=RNG), X, y, cv=CV, scoring="roc_auc"
    ).mean()
    stump = cross_val_score(
        DecisionTreeClassifier(max_leaf_nodes=STUMP_LEAVES, random_state=RNG),
        X, y, cv=CV, scoring="roc_auc"
    ).mean()
    return full, stump, (stump - 0.5) / (full - 0.5)


data = load_breast_cancer()
X = data.data
Xs = StandardScaler().fit_transform(X)
rng = np.random.default_rng(RNG)

# ---------------------------------------------------------------- experiment 1
# Features are fixed. Only the number of features the label depends on changes.
# k=1 is "somebody wrote a threshold". k=30 is a label that genuinely needs the
# whole feature space, which is what a real-world judgement usually looks like.

print("=" * 70)
print("EXPERIMENT 1: sweeping label complexity".center(70))
print("30 independent features, only the label's structure changes".center(70))
print("=" * 70)
print(f"\n{'features in label':>18} {'full AUC':>10} {'stump AUC':>11} {'lift recovered':>16}")
print("-" * 70)

Xi = rng.normal(size=(3000, 30))
for k in (1, 2, 3, 5, 10, 20, 30):
    w = rng.normal(size=k)
    score = Xi[:, :k] @ w
    y = (score > np.median(score)).astype(int)
    full, stump, rec = stump_test(Xi, y)
    flag = "  <-- circular" if rec > CIRCULAR_AT else ""
    print(f"{k:>18} {full:>10.4f} {stump:>11.4f} {rec:>15.1%}{flag}")

print("\nThe full model stays strong throughout. Only the stump falls away.")
print("That gap is the diagnostic.")

# ---------------------------------------------------------------- experiment 2
print("\n" + "=" * 70)
print("EXPERIMENT 2: real data, two label sources".center(70))
print("=" * 70)

names = list(data.feature_names)
i_r, i_t, i_c = (names.index(n) for n in
                 ("worst radius", "worst texture", "worst concave points"))
rule = ((X[:, i_r] > np.median(X[:, i_r])).astype(int)
        + (X[:, i_t] > np.percentile(X[:, i_t], 40)).astype(int)
        + (X[:, i_c] > np.percentile(X[:, i_c], 75)).astype(int))
y_rule = (rule >= 2).astype(int)

for label_name, y in (
    ("diagnostic label, assigned outside the feature set", data.target),
    ("label written as a three-feature rule", y_rule),
):
    full, stump, rec = stump_test(X, y)
    verdict = "CIRCULAR" if rec > CIRCULAR_AT else "ok"
    print(f"\n{label_name}")
    print(f"  full {full:.4f}   stump {stump:.4f}   lift recovered {rec:.1%}   [{verdict}]")

print("\n" + "=" * 70)
print("A ten-leaf tree recovering more than ~90% of the lift means the")
print("label is a thin function of the features. The score is real. It is")
print("just not measuring what the headline implies.")
print("=" * 70)
