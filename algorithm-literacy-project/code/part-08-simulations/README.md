# Part 8: Simulations

Seven small, runnable simulations that let you WATCH recommendation and spreading dynamics unfold, instead of just reading about them. Each one builds a tiny synthetic model, saves a clearly labelled chart to `output/`, and prints a plain-language explanation of what you are seeing.

> [SPECULATIVE] / [ESTABLISHED] mix. These are simplified models built for intuition, not predictions of any specific platform. Where a simulation illustrates a published finding (for example that false news spreads faster than true news), that finding is cited and labelled. Where it just illustrates a mechanism, treat it as a thinking tool, not a measurement. See the repository's [`EPISTEMICS.md`](../../EPISTEMICS.md) for how we label what we know, and [Part 1](../../docs/part-01-literature-review) for the underlying literature.

The neutral stance of the whole project applies here especially. Echo chambers, virality, and outrage advantage are **emergent properties** of optimisation loops and human sharing behaviour on networks. Showing that a dynamic exists is not the same as claiming any platform designed it on purpose. We are careful throughout to separate dynamics from intent.

---

## The seven simulations

| # | Script | The question it answers | What the PNG shows |
|---|--------|-------------------------|--------------------|
| 1 | [`how_an_algorithm_learns.py`](how_an_algorithm_learns.py) | How does a system learn what I like without me telling it? | Estimated interest converging on hidden true interest; feed relevance rising |
| 2 | [`echo_chamber.py`](echo_chamber.py) | Why do feeds narrow, and what stops it? | Topic diversity over time at several exploration rates (epsilon) |
| 3 | [`viral_spread.py`](viral_spread.py) | What does "going viral" actually look like? | The adoption S-curve, plus a network snapshot coloured by who adopted |
| 4 | [`outrage_spread.py`](outrage_spread.py) | Why does angry content travel further? | Adoption curves for high-arousal vs neutral content, side by side |
| 5 | [`misinformation_spread.py`](misinformation_spread.py) | Does falsehood outrun truth, and do fact-checks help? | True vs false spread, with debunks at different times; final-reach bars |
| 6 | [`healthy_recommendation_spread.py`](healthy_recommendation_spread.py) | Can GOOD content spread too? | Quality content with no boost vs with a boost (a hopeful counterpoint) |
| 7 | [`one_click_vs_fifty_clicks.py`](one_click_vs_fifty_clicks.py) | How fast does my feed reshape around what I click? | Feed composition after 1 click vs after 50 clicks on one topic |

---

## How to run them

Python 3.10 or newer. Dependencies are the standard library plus three packages:

```bash
cd code/part-08-simulations
pip install -r requirements.txt
```

Run any single simulation:

```bash
python how_an_algorithm_learns.py
```

Or run all seven in sequence:

```bash
python run_all.py
```

Every script:

- uses matplotlib's `Agg` backend, so **no screen or display is needed**,
- saves its chart as a PNG into [`output/`](output) (the folder is created automatically),
- is **deterministic** via a fixed random seed, so you get the same result every time,
- prints a plain-language interpretation to the terminal when it finishes.

`run_all.py` prints a summary at the end listing where each PNG was saved and whether it succeeded.

---

## What each simulation shows, and what you can change

Each script has a `TRY CHANGING` section in its closing print-out. The headline knobs:

### 1. `how_an_algorithm_learns.py`
An agent learns your hidden topic interests purely from noisy yes/no engagement signals (online updating). The left panel shows the estimate climbing towards the hidden truth; the right shows feed relevance rising as the estimate sharpens.
**Change:** `TRUE_INTEREST` (your hidden tastes), `LEARNING_RATE` (how fast and jumpy), `EXPLORE_CHANCE` (how much it samples every topic).

### 2. `echo_chamber.py`
A single feed using epsilon-greedy selection. We measure topic diversity (normalised Shannon entropy) over time at several exploration rates and plot them together. With no exploration the feed collapses onto a few topics; a little exploration keeps it open. Carries a `[CONTESTED]` note: Bakshy, Messing and Adamic (2015) found individual choice narrowed exposure more than ranking did, so real-world bubbles are partly the machine and partly us.
**Change:** `EPSILONS`, `N_TOPICS`, `WINDOW`.

### 3. `viral_spread.py`
An independent-cascade contagion (close cousin of SIR) on a Barabasi and Albert (1999) scale-free network, seeded from the best-connected hubs. Left: the cumulative adoption S-curve. Right: the network coloured by who adopted, dot size by connectedness.
**Change:** `TRANSMIT_PROB` (note the tipping point), `N_SEEDS`, or swap in `nx.watts_strogatz_graph` (Watts and Strogatz 1998).

### 4. `outrage_spread.py`
The same idea released into the same network twice, with the ONLY difference being a higher per-share probability for high-arousal content. A small edge compounds into a large reach gap. Models a documented tendency in human sharing (Brady et al. 2017; Vosoughi et al. 2018), and is explicitly **not** a claim about platform intent.
**Change:** `OUTRAGE_PROB`, `NEUTRAL_PROB`, `N_SEEDS`.

### 5. `misinformation_spread.py`
False content (higher transmission) versus true content, plus an optional debunk that cuts transmission after a delay. We run the debunk early, late, and never, and chart the final reach. The lesson: timing is decisive, because a cascade does most of its growing early.
**Change:** the `debunk_step` values, `DEBUNK_FACTOR`, the gap between `FALSE_PROB` and `TRUE_PROB`.

### 6. `healthy_recommendation_spread.py`
The hopeful counterpoint. Quality content spreads modestly on its own; with a small algorithmic boost (standing in for "ranked higher / shown to more people") it reaches far more. Same mechanism that helps outrage can help good content. Amplification is a lever that points either way.
**Change:** `BOOST_MULTIPLIER`, `NATURAL_PROB`.

### 7. `one_click_vs_fifty_clicks.py`
Start from a balanced feed, then click one topic repeatedly. Snapshots of feed composition after 1 click and after 50 show how nudges compound: one tap barely moves things, fifty reshape the feed. The same mechanism works in reverse, which is the practical hope.
**Change:** `CLICK_PULL`, the snapshot click counts, `CLICKED_TOPIC`.

---

## Citations behind these models

- **Vosoughi, Roy and Aral (2018)**, "The spread of true and false news online", *Science*. doi:10.1126/science.aap9559. (False news spread faster, deeper and wider than true news.) Used in simulations 4 and 5.
- **Brady et al. (2017)**, "Emotion shapes the diffusion of moralized content in social networks", *PNAS*. (Moral-emotional language increased diffusion.) Used in simulation 4.
- **Centola (2010)**, "The Spread of Behavior in an Online Social Network Experiment", *Science*. (Some behaviours need reinforcement from multiple contacts; our single-contact models are the simplest case.) Context for simulation 3.
- **Watts and Strogatz (1998)**, small-world networks, *Nature*; **Barabasi and Albert (1999)**, scale-free networks, *Science*. Network structures used in simulations 3 to 6.
- **Pariser (2011)**, *The Filter Bubble*. The filter-bubble framing in simulation 2.
- **Bakshy, Messing and Adamic (2015)**, "Exposure to ideologically diverse news and opinion on Facebook", *Science*. `[CONTESTED]` Found the ranking algorithm's narrowing effect smaller than individuals' own choices. Presented even-handedly in simulation 2.

---

## The one thing to take away

Spread is about transmission conditions on a network, not about whether content is true, kind, or important. That single fact explains both the worrying simulations (outrage and falsehood can travel fast) and the hopeful ones (so can quality, if it is given a lift). Understanding the dynamics is what lets a reader, a parent, or a school ask sharper questions about the feeds that shape modern childhood, which is the whole purpose of [The Algorithm Literacy Project](../../README.md).
