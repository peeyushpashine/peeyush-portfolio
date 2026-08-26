# The stump test and the gate trap

Two diagnostics for one failure: a model that has learned the rule which generated
your labels, rather than anything about the world. They accompany
[Your Model Scored 0.99. That Might Be a Confession.](https://peeyush-portfolio-sepia.vercel.app/writing/stump-test)

- `stump_test.py` fits a ten-leaf decision tree alongside a real model and reports how
  much of the model's lift over chance the stump recovers. A stump that recovers most of
  it means the label is a thin function of a few features.
- `gate_trap.py` shows what happens when a labelling rule references a feature the model
  also sees, which produces circularity you cannot detect from inside your own evaluation.

Both run on public and synthetic data with a fixed seed, need only scikit-learn, and take
about a minute.

```bash
pip install scikit-learn
python stump_test.py
python gate_trap.py
```
