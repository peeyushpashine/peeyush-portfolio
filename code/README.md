# ML diagnostics

Small, self-contained scripts behind the diagnostics written up at
[peeyush-portfolio-sepia.vercel.app/writing](https://peeyush-portfolio-sepia.vercel.app/writing).
Each one runs standalone on public or synthetic data with a fixed seed, and every figure
quoted in the corresponding post is produced by the script here.

| Script | Post | What it shows |
|---|---|---|
| `stump_test.py` | Your Model Scored 0.99 | A ten-leaf tree recovering most of a model's lift means the label is a thin function of the features |
| `gate_trap.py` | Your Model Scored 0.99 | A labelling rule that gates on a feature the model sees makes a pattern structurally unlearnable |
| `denominator_shift.py` | The Denominator Shift | The same outage read two ways, depending on what you divide by |
| `dampener_stack.py` | The Dampener Stack | Independent safety measures multiply rather than add |
| `invisible_success.py` | Invisible Success | A metric that goes down when the feature works |
| `abstention_band.py` | The Abstention Band | Every point of abstention arrives as quieted noise and as missed signal |
| `timer_race.py` | Three Timers, Three Owners | Retention, queue latency and retrain interval cannot all be satisfied at once |

## Running them

Figures were measured on scikit-learn 1.9.0. The stumps are `DecisionTreeClassifier` and are
version-stable; `HistGradientBoostingClassifier` moves slightly between releases.

```bash
pip install 'scikit-learn==1.9.0'
python stump_test.py
```

`stump_test.py` and `gate_trap.py` need scikit-learn, `abstention_band.py` needs numpy, and the
rest need nothing beyond the standard library.
