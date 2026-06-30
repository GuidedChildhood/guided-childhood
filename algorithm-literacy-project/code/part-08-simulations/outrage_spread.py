"""
OUTRAGE SPREAD
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"Why does angry, dramatic content seem to travel further than calm,
 ordinary content?"

THE IDEA IN PLAIN WORDS
-----------------------
Researchers have repeatedly found that high-arousal content (especially
content that triggers moral emotions like anger or outrage) tends to be
shared more readily than neutral content.

  - Brady et al. (2017, PNAS) found that each moral-emotional word added
    to a message increased its diffusion on social media.
  - Vosoughi, Roy and Aral (2018, Science) found false news, which often
    carries more novelty and emotion, spread faster and further than the
    truth.

We model this with ONE difference between two pieces of content: outrage
content has a higher per-contact transmission probability than neutral
content. Everything else (the network, the seeds, the timing) is held
identical, so any difference in spread comes only from that dial.

A CAREFUL NOTE ON INTENT
------------------------
This models a documented TENDENCY in human sharing behaviour. It is NOT a
claim that any platform deliberately amplifies outrage, and it is not a
claim about anyone's motives. The higher transmission probability here
stands in for "people are more likely to pass this on", which is a
finding about us, the audience, as much as about any system.

This is a simplified model for intuition, not a forecast for any platform.

RUN IT
------
    python outrage_spread.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx

SEED = 11
N_PEOPLE = 500
N_SEEDS = 4
MAX_STEPS = 60

# The single dial that differs between the two pieces of content.
NEUTRAL_PROB = 0.06    # calm content: shared less readily
OUTRAGE_PROB = 0.14    # high-arousal content: shared more readily

# One shared network so the comparison is fair.
G = nx.barabasi_albert_graph(N_PEOPLE, m=2, seed=SEED)
degrees = np.array([deg for _, deg in G.degree()])
seed_nodes = np.argsort(degrees)[-N_SEEDS:]   # same seeds for both runs


def run_cascade(transmit_prob, seed):
    """Independent-cascade spread. Return cumulative adoption per step."""
    rng = np.random.default_rng(seed)
    state = np.zeros(N_PEOPLE, dtype=int)   # 0 susceptible, 1 active, 2 done
    state[seed_nodes] = 1
    cumulative = [int((state >= 1).sum())]
    newly_active = list(seed_nodes)

    for _ in range(MAX_STEPS):
        next_active = []
        for node in newly_active:
            for nb in G.neighbors(node):
                if state[nb] == 0 and rng.random() < transmit_prob:
                    state[nb] = 1
                    next_active.append(nb)
            state[node] = 2
        newly_active = next_active
        cumulative.append(int((state >= 1).sum()))
        if not newly_active:
            break
    # Pad so both curves are the same length for plotting.
    while len(cumulative) < MAX_STEPS + 1:
        cumulative.append(cumulative[-1])
    return np.array(cumulative)


# Same RNG seed for both so the only difference is the probability.
neutral_curve = run_cascade(NEUTRAL_PROB, SEED)
outrage_curve = run_cascade(OUTRAGE_PROB, SEED)

# --- Make the picture --------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 7))
steps = np.arange(len(neutral_curve))

ax.plot(steps, outrage_curve, color="orangered", linewidth=2.8,
        marker="o", markersize=4,
        label=f"high-arousal content (transmit = {OUTRAGE_PROB:.0%})")
ax.plot(steps, neutral_curve, color="steelblue", linewidth=2.8,
        marker="s", markersize=4,
        label=f"neutral content (transmit = {NEUTRAL_PROB:.0%})")

ax.fill_between(steps, neutral_curve, outrage_curve,
                where=outrage_curve >= neutral_curve,
                color="orangered", alpha=0.08)

ax.set_title("How far the same idea travels: outrage vs neutral",
             fontsize=14, fontweight="bold")
ax.set_xlabel("Time step (each step = one round of sharing)")
ax.set_ylabel("Total people reached")
ax.set_ylim(0, N_PEOPLE)
ax.legend(loc="lower right", fontsize=11)
ax.grid(alpha=0.3)
ax.text(0.01, 0.97,
        "Same network. Same seeds. Same timing.\n"
        "Only the per-share probability differs.",
        transform=ax.transAxes, va="top", fontsize=9,
        bbox=dict(boxstyle="round", facecolor="lightyellow"))

fig.tight_layout()

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "outrage_spread.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
neutral_final = int(neutral_curve[-1])
outrage_final = int(outrage_curve[-1])
ratio = outrage_final / max(neutral_final, 1)

print("=" * 70)
print("OUTRAGE SPREAD  ->  saved:", out_path)
print("=" * 70)
print(f"""
Two pieces of content were released into the SAME network from the SAME
starting people. The only difference: people were more likely to pass on
the high-arousal one ({OUTRAGE_PROB:.0%} per contact) than the neutral one ({NEUTRAL_PROB:.0%}).

Final reach:
  neutral content : {neutral_final} people
  outrage content : {outrage_final} people
The high-arousal content reached about {ratio:.1f} times as many people.

WHAT TO TAKE FROM THIS:
A small edge in how willing people are to share something compounds
through a network into a large difference in total reach. This matches
real findings (Brady 2017; Vosoughi 2018).

THE HONEST FRAMING:
This is a property of how WE share, amplified by network structure. It is
not proof that a platform set out to make us angry. The practical lesson
is for the reader: if something in your feed is travelling fast and it is
making you furious, that combination is exactly what spreads most easily.
That is a good moment to slow down and check before you pass it on.

TRY CHANGING:
  - OUTRAGE_PROB / NEUTRAL_PROB : widen or narrow the gap.
  - N_SEEDS : see whether starting bigger changes the ratio.
""")
