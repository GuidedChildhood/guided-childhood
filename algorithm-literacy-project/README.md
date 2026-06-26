# The Algorithm Literacy Project

**An evidence-based, openly licensed research repository that explains how social media recommendation systems work, and explores how they could be designed to support healthier childhoods.**

Part of [Guided Childhood](https://guidedchildhood.co.uk). Built to teach children, parents, and schools the science and engineering behind the feeds that shape modern childhood.

---

## Why this exists

Most children grow up inside recommendation systems they have never been taught to understand. By the time a child is thirteen they may have received tens of thousands of algorithmically ranked recommendations, yet almost no school teaches how that ranking happens or how a person can shape it.

This repository treats that gap as a literacy problem, not a moral panic. It explains recommendation systems the way a good science teacher explains the weather: as something complex, knowable, and worth understanding so you can dress for the day.

Our stance is deliberately neutral. We do **not** assume that existing algorithms were designed to harm children. We separate what research has established from what engineers can reasonably infer and from what is still speculation. Where the evidence is mixed, we say so.

---

## What is inside

| Part | Folder | What it covers |
|------|--------|----------------|
| 1 | [`docs/part-01-literature-review`](docs/part-01-literature-review) | Deep literature review across fourteen research fields, with citations |
| 2 | [`docs/part-02-platform-analysis`](docs/part-02-platform-analysis) | How recommendation works on eight major platforms, fact vs inference |
| 3 | [`docs/part-03-behaviour-mapping`](docs/part-03-behaviour-mapping) | Every user behaviour mapped to its likely influence, with confidence levels |
| 4 | [`docs/part-04-child-friendly-explanations`](docs/part-04-child-friendly-explanations) | Every concept rewritten for ages 7, 9, 11, 13, 16, parents, and teachers |
| 5 | [`code/part-05-recommendation-engine`](code/part-05-recommendation-engine) | A complete, heavily commented educational recommendation engine in Python |
| 6 | [`code/part-06-alternative-algorithms`](code/part-06-alternative-algorithms) | Eight alternative algorithms that optimise for wellbeing, not engagement |
| 7 | [`docs/part-07-can-we-change-algorithms`](docs/part-07-can-we-change-algorithms) | Can feeds optimise for sleep, learning, empathy? Evidence and feasibility |
| 8 | [`code/part-08-simulations`](code/part-08-simulations) | Interactive simulations of echo chambers, virality, and learning |
| 9 | [`docs/part-09-curriculum`](docs/part-09-curriculum) | A full classroom curriculum: lessons, games, worksheets, assessments |
| 10 | [`docs/part-10-future-ideas`](docs/part-10-future-ideas) | 200 ideas for healthier recommendation systems |

Supporting material:

- [`EPISTEMICS.md`](EPISTEMICS.md) — how we label established research, engineering inference, and speculation
- [`references/`](references) — the master bibliography
- [`diagrams/`](diagrams) — architecture diagrams of recommendation systems
- [`GLOSSARY.md`](GLOSSARY.md) — plain-language definitions of every technical term

---

## How to read this repository

**If you are a researcher**, start with Part 1 and the references folder.

**If you are an engineer**, start with Part 2, then the code in Parts 5, 6, and 8.

**If you are a teacher**, start with Part 9, then dip into Part 4 for age-appropriate language.

**If you are a parent**, start with Part 4, then Part 10 for what the future could look like.

**If you are a curious child**, start with Part 4 and then run the simulations in Part 8.

---

## Running the code

All code is Python 3.10 or newer and uses a small, standard scientific stack.

```bash
cd algorithm-literacy-project
python -m venv .venv
source .venv/bin/activate          # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Then, for example:

```bash
python code/part-05-recommendation-engine/engine.py
python code/part-08-simulations/echo_chamber.py
```

Every script prints a friendly explanation of what it is doing as it runs.

---

## Our three rules of honesty

1. **Label every claim.** Established research, plausible engineering inference, or speculation. Never blur them.
2. **Cite real sources.** We link to peer-reviewed papers and primary documents wherever possible, and we never invent a citation.
3. **No villains, no heroes.** We describe systems and incentives, not conspiracies. The goal is understanding, not blame.

---

## Licence

Documentation is released under [CC BY 4.0](LICENSE-DOCS). Code is released under the [MIT Licence](LICENSE-CODE). You are free to use this in classrooms, research, and products, with attribution.

---

## A note on language

This repository uses British English and avoids jargon wherever a plain word will do. Technical terms are defined in the [glossary](GLOSSARY.md) the first time they matter. If a sentence cannot be understood by a bright thirteen year old, we have tried to rewrite it.
