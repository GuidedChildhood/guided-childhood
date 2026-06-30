"""
HEALTHY RECOMMENDATION SPREAD
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"If outrage and falsehood can spread, can GOOD content spread too? Is the
 system doomed to amplify only the worst stuff?"

THE HOPEFUL IDEA
----------------
The same machinery that can amplify junk can amplify quality. Spread is
about transmission conditions, not about whether content is good or bad.
If a recommender gives a small BOOST to prosocial, accurate, kind, or
genuinely useful content (for example by ranking it slightly higher, or
surfacing it to a few extra people), that boost compounds through the
network just like outrage's natural advantage does.

This is the encouraging counterpoint to outrage_spread.py and
misinformation_spread.py: design choices cut both ways. A feed is not
fated to be toxic. What gets a lift is a choice.

WHAT WE MODEL
-------------
Quality content that, on its own, spreads modestly (people do not share
it quite as eagerly as drama). We run it twice on the SAME network:
  - NO BOOST: it spreads at its natural, modest rate.
  - WITH BOOST: the algorithm lifts its effective transmission, standing
    in for "shown to more people / ranked higher".
We compare the two adoption curves.

This is a simplified model for intuition, not a forecast for any platform.
A real "quality boost" is far harder to define and to do fairly. The point
here is only that amplification is a lever that can point either way.

RUN IT
------
    python healthy_recommendation_spread.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx

SEED = 33
N_PEOPLE = 500
N_SEEDS = 4
MAX_STEPS = 60

NATURAL_PROB = 0.06        # quality content's modest natural spread rate
BOOST_MULTIPLIER = 2.0     # the algorithm lifts its effective reach
BOOSTED_PROB = min(NATURAL_PROB * BOOST_MULTIPLIER, 0.99)

G = nx.barabasi_albert_graph(N_PEOPLE, m=2, seed=SEED)
degrees = np.array([deg for _, deg in G.degree()])
seed_nodes = np.argsort(degrees)[-N_SEEDS:]


def run_cascade(transmit_prob, seed=SEED):
    """Independent-cascade spread. Return cumulative adoption per step."""
    rng = np.random.default_rng(seed)
    state = np.zeros(N_PEOPLE, dtype=int)
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
    while len(cumulative) < MAX_STEPS + 1:
        cumulative.append(cumulative[-1])
    return np.array(cumulative)


no_boost = run_cascade(NATURAL_PROB, seed=SEED)
with_boost = run_cascade(BOOSTED_PROB, seed=SEED)

# --- Make the picture --------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 7))
steps = np.arange(len(no_boost))

ax.plot(steps, with_boost, color="seagreen", linewidth=2.8,
        marker="o", markersize=4,
        label=f"quality content WITH a boost (transmit = {BOOSTED_PROB:.0%})")
ax.plot(steps, no_boost, color="slategrey", linewidth=2.8,
        marker="s", markersize=4,
        label=f"quality content with NO boost (transmit = {NATURAL_PROB:.0%})")
ax.fill_between(steps, no_boost, with_boost,
                where=with_boost >= no_boost,
                color="seagreen", alpha=0.10)

ax.set_title("Good content can spread too, if it is given a lift",
             fontsize=14, fontweight="bold")
ax.set_xlabel("Time step (each step = one round of sharing)")
ax.set_ylabel("Total people reached")
ax.set_ylim(0, N_PEOPLE)
ax.legend(loc="lower right", fontsize=11)
ax.grid(alpha=0.3)
ax.text(0.01, 0.97,
        "Same network. Same seeds.\n"
        "The only difference is a design choice to amplify quality.",
        transform=ax.transAxes, va="top", fontsize=9,
        bbox=dict(boxstyle="round", facecolor="honeydew"))

fig.tight_layout()

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "healthy_recommendation_spread.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
no_final = int(no_boost[-1])
boost_final = int(with_boost[-1])
ratio = boost_final / max(no_final, 1)

print("=" * 70)
print("HEALTHY RECOMMENDATION SPREAD  ->  saved:", out_path)
print("=" * 70)
print(f"""
The same piece of quality content was released into the same network
twice. Once it spread at its natural modest rate. Once the algorithm gave
it a boost (here, doubling its effective transmission).

Final reach:
  no boost   : {no_final} people
  with boost : {boost_final} people
The boost lifted reach by about {ratio:.1f} times.

WHAT TO TAKE FROM THIS:
Virality is not a moral judgement. The network does not know or care
whether content is kind or cruel, true or false. It only responds to
transmission conditions. That means the SAME amplification that makes
outrage travel can make good, accurate, generous content travel.

THE HOPEFUL POINT:
A feed full of the worst of us is not inevitable. What gets boosted is a
choice, made by people who build and tune these systems, and increasingly
something the public can ask questions about. Understanding the dynamics
(Parts of this project) is the first step to asking for better ones.

TRY CHANGING:
  - BOOST_MULTIPLIER : how strong a lift quality content gets.
  - NATURAL_PROB : start quality content even lower and see if a boost
                   can still rescue its reach.
""")
