# Part 6: Alternative Algorithms

Eight recommendation algorithms that optimise for healthier outcomes instead of pure engagement, with both a written design and runnable Python.

> [SPECULATIVE] These are proof-of-concept designs, not deployed systems. They run on a small synthetic catalogue with hand-set attributes. The point is to make one idea concrete: an algorithm is a scoring formula, and whoever picks the formula is making a values choice. See [`DESIGN.md`](DESIGN.md) for the full, honest write-up including failure modes.

---

## The eight algorithms

| # | Algorithm | Optimises for | Full design |
|---|-----------|---------------|-------------|
| 1 | **Balanced** | Engagement, but caps any one topic | [DESIGN.md](DESIGN.md#1-balanced-algorithm) |
| 2 | **Curiosity** | A gentle stretch beyond current interests | [DESIGN.md](DESIGN.md#2-curiosity-algorithm) |
| 3 | **Learning** | Educational value and skill progression | [DESIGN.md](DESIGN.md#3-learning-algorithm) |
| 4 | **Wellbeing** | Calm; penalises late-night and doomscroll, respects session limits | [DESIGN.md](DESIGN.md#4-wellbeing-algorithm) |
| 5 | **Growth** | The child's own stated goals and effort | [DESIGN.md](DESIGN.md#5-growth-algorithm) |
| 6 | **Healthy Childhood** | Age-fit, offline activity, family-positive | [DESIGN.md](DESIGN.md#6-healthy-childhood-algorithm) |
| 7 | **Kindness** | Prosocial content; demotes outrage and cruelty | [DESIGN.md](DESIGN.md#7-kindness-algorithm) |
| 8 | **Diversity** | Variety of topics, viewpoints, and creators | [DESIGN.md](DESIGN.md#8-diversity-algorithm) |

An **Engagement baseline** is included as a control group so you can see what each alternative is differing *from*.

---

## What is in this folder

| File | What it is |
|------|------------|
| [`DESIGN.md`](DESIGN.md) | The full write-up: objective function, inputs, ranking logic, advantages, unintended consequences, and ethics for each of the eight. |
| [`algorithms.py`](algorithms.py) | The shared `Item` / `User` model, a base `Recommender` class, the eight algorithms as subclasses, a synthetic catalogue, and a side-by-side demo. |
| [`metrics.py`](metrics.py) | Helper functions that measure a finished feed: diversity, educational share, calmness, wellbeing, kindness, and an estimated engagement proxy. |

---

## How to run it

Python 3.10 or newer. Standard library plus numpy.

```bash
cd code/part-06-alternative-algorithms
python algorithms.py
```

You will see the **same 20 videos** ranked eight different ways, the top five from each, and a comparison table showing each feed's diversity, educational share, calmness, wellbeing, kindness, and estimated engagement. A second pass shows the Wellbeing algorithm shifting visibly calmer at 11pm and over the session limit, so you can watch context change the feed.

---

## The one thing to take away

There is no value-free way to rank a child's feed. Every formula here, including the engagement baseline, encodes a choice about what childhood online should be for. Part 6 makes that choice visible so people can argue about the values in the open, instead of pretending the maths decided for them.

Read [`DESIGN.md`](DESIGN.md) next, especially the candid failure modes: a wellbeing filter can turn paternalistic, a kindness classifier can suppress honest disagreement, a diversity target can launder misinformation as "balance".
