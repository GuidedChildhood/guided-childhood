"""
MISINFORMATION SPREAD
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"Does false information really spread faster than the truth, and does a
 fact-check actually help, even if it arrives late?"

THE IDEA IN PLAIN WORDS
-----------------------
Vosoughi, Roy and Aral (2018, Science) studied a huge set of rumour
cascades on Twitter and found that false news spread faster, deeper and
more widely than true news, largely because it tended to be more novel
and emotionally charged. We model that here with a higher transmission
probability for false content.

Then we add a DEBUNK (a fact-check). After a delay, a correction begins
to circulate. We model its effect simply: once the debunk is active, the
transmission probability of the false content is cut down, because some
people now hesitate or refuse to pass it on.

The big question we explore: HOW MUCH DOES TIMING MATTER? We run the same
false cascade with the debunk arriving early, late, and never, and
compare the final reach.

This is a simplified model for intuition, not a forecast for any platform.
Real fact-checking is harder and slower than this clean version.

WHAT THE OUTPUT SHOWS
---------------------
Left:  adoption curves for true content, false-with-no-debunk, and false
       with debunks at different times. Vertical lines mark debunk timing.
Right: a bar chart of final reach, making the cost of delay obvious.

RUN IT
------
    python misinformation_spread.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx

SEED = 21
N_PEOPLE = 600
N_SEEDS = 4
MAX_STEPS = 50

TRUE_PROB = 0.07            # truth spreads, but more slowly
FALSE_PROB = 0.13          # falsehood spreads faster (Vosoughi 2018)
DEBUNK_FACTOR = 0.35       # after a debunk, false transmission drops to 35%

G = nx.barabasi_albert_graph(N_PEOPLE, m=2, seed=SEED)
degrees = np.array([deg for _, deg in G.degree()])
seed_nodes = np.argsort(degrees)[-N_SEEDS:]


def run_cascade(base_prob, debunk_step=None, seed=SEED):
    """Spread content. If debunk_step is set, cut transmission from then on.

    debunk_step = None  -> no debunk ever.
    Returns cumulative adoption per time step.
    """
    rng = np.random.default_rng(seed)
    state = np.zeros(N_PEOPLE, dtype=int)
    state[seed_nodes] = 1
    cumulative = [int((state >= 1).sum())]
    newly_active = list(seed_nodes)

    for step in range(MAX_STEPS):
        # The transmission probability for this step. After the debunk
        # lands, it is reduced.
        prob = base_prob
        if debunk_step is not None and step >= debunk_step:
            prob = base_prob * DEBUNK_FACTOR

        next_active = []
        for node in newly_active:
            for nb in G.neighbors(node):
                if state[nb] == 0 and rng.random() < prob:
                    state[nb] = 1
                    next_active.append(nb)
            state[node] = 2
        newly_active = next_active
        cumulative.append(int((state >= 1).sum()))
        if not newly_active:
            break
    while len(cumulative) < MAX_STEPS + 1:
        cumulative.append(cumulative[-1])
    return np.array(cumulative)


# Use the same RNG seed everywhere so the only differences are the
# probability and the debunk timing.
true_curve = run_cascade(TRUE_PROB, debunk_step=None, seed=SEED)
false_none = run_cascade(FALSE_PROB, debunk_step=None, seed=SEED)
false_early = run_cascade(FALSE_PROB, debunk_step=6, seed=SEED)
false_late = run_cascade(FALSE_PROB, debunk_step=16, seed=SEED)

scenarios = [
    ("true content (no debunk needed)", true_curve, "seagreen", None),
    ("false: no debunk", false_none, "darkred", None),
    ("false: debunk at step 16 (late)", false_late, "orange", 16),
    ("false: debunk at step 6 (early)", false_early, "royalblue", 6),
]

# --- Make the picture --------------------------------------------------
fig, (ax_curve, ax_bar) = plt.subplots(1, 2, figsize=(15, 6.5),
                                       gridspec_kw={"width_ratios": [2, 1]})
steps = np.arange(len(true_curve))

for label, curve, colour, debunk in scenarios:
    ax_curve.plot(steps, curve, color=colour, linewidth=2.5, label=label)
    if debunk is not None:
        ax_curve.axvline(debunk, color=colour, linestyle=":", alpha=0.7)

ax_curve.set_title("True vs false spread, and when the fact-check lands")
ax_curve.set_xlabel("Time step")
ax_curve.set_ylabel("Total people reached")
ax_curve.set_ylim(0, N_PEOPLE)
ax_curve.legend(loc="lower right", fontsize=9)
ax_curve.grid(alpha=0.3)
ax_curve.text(0.01, 0.97,
              "Dotted vertical line = moment the debunk starts working",
              transform=ax_curve.transAxes, va="top", fontsize=8)

# Right: final reach bar chart.
labels = [s[0].replace("false: ", "").replace(" content (no debunk needed)", "")
          for s in scenarios]
finals = [int(s[1][-1]) for s in scenarios]
bar_colours = [s[2] for s in scenarios]
ax_bar.barh(range(len(finals)), finals, color=bar_colours)
ax_bar.set_yticks(range(len(finals)))
ax_bar.set_yticklabels(labels, fontsize=9)
ax_bar.invert_yaxis()
ax_bar.set_xlabel("Final reach (people)")
ax_bar.set_title("Final reach: timing changes everything")
for i, v in enumerate(finals):
    ax_bar.text(v + 5, i, str(v), va="center", fontsize=9)
ax_bar.set_xlim(0, N_PEOPLE)

fig.suptitle("Misinformation spread and the value of an early fact-check",
             fontsize=15, fontweight="bold")
fig.tight_layout(rect=[0, 0, 1, 0.95])

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "misinformation_spread.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
print("=" * 70)
print("MISINFORMATION SPREAD  ->  saved:", out_path)
print("=" * 70)
print(f"""
Final reach in each scenario (out of {N_PEOPLE} people):
  true content (slower by nature) : {int(true_curve[-1])}
  false, no debunk                : {int(false_none[-1])}
  false, debunk LATE (step 16)    : {int(false_late[-1])}
  false, debunk EARLY (step 6)    : {int(false_early[-1])}

WHAT TO TAKE FROM THIS:
- With the same network and starting point, the false content (higher
  transmission) reached more people than the true content. This mirrors
  Vosoughi et al. (2018).
- A debunk helps, but TIMING is decisive. An early correction caps the
  spread; a late one mostly arrives after the damage is done, because a
  cascade does most of its growing in the early, fast part of the curve.

THE TAKEAWAY FOR A READER:
The first hours of a rumour are when correction matters most. Once
something has spread widely, a fact-check can no longer un-spread it. That
is why a moment of caution BEFORE you share is worth more than any
correction afterwards.

TRY CHANGING:
  - The debunk_step values : try a debunk at step 0 (instant).
  - DEBUNK_FACTOR : how strongly a correction dampens sharing.
  - FALSE_PROB vs TRUE_PROB : narrow the gap and see what happens.
""")
