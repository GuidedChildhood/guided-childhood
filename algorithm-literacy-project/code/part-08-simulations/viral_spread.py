"""
VIRAL SPREAD
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"What does it actually mean for something to 'go viral', and what shape
 does that take over time?"

THE IDEA IN PLAIN WORDS
-----------------------
A piece of content spreads through a network of people. Each person who
has adopted it (shared it, talked about it) can pass it to their
neighbours with some probability. We borrow a model from how researchers
study contagion: the INDEPENDENT CASCADE model, which is closely related
to SIR models used for diseases.

States each person can be in:
  - SUSCEPTIBLE: has not adopted yet, could still catch it.
  - INFECTED/ACTIVE: just adopted, and gets one chance to pass it on.
  - RECOVERED: has had their turn passing it on and is now done.

We run this on a real network structure. Online social graphs often have
a few very-connected "hubs" and many low-degree people. The Barabasi and
Albert (1999) scale-free model captures that shape, so we use it here.
(Watts and Strogatz 1998 give an alternative "small world" structure.)

Centola (2010) showed that for some behaviours, spread depends on
reinforcement from several contacts, not just one. Our simple model uses
single-contact transmission, so treat it as the easiest case.

This is a simplified model for intuition, not a forecast for any platform.

WHAT THE OUTPUT SHOWS
---------------------
Left:  the classic S-curve of cumulative adoption over time.
Right: a snapshot of the network, with nodes coloured by whether they
       adopted, so you can see the spread reach the hubs and fan out.

RUN IT
------
    python viral_spread.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx

SEED = 7
rng = np.random.default_rng(SEED)

N_PEOPLE = 400
TRANSMIT_PROB = 0.12      # chance an active person infects a given neighbour
N_SEEDS = 3               # how many people start off having adopted it
MAX_STEPS = 60

# Build a scale-free network: a few hubs, many ordinary nodes. This mimics
# the lumpy connection patterns seen in real social platforms.
G = nx.barabasi_albert_graph(N_PEOPLE, m=2, seed=SEED)

# State: 0 = susceptible, 1 = active (will spread now), 2 = recovered.
state = np.zeros(N_PEOPLE, dtype=int)

# Seed the outbreak from the most connected hubs, the way a popular
# account might kick something off.
degrees = np.array([deg for _, deg in G.degree()])
seed_nodes = np.argsort(degrees)[-N_SEEDS:]
state[seed_nodes] = 1

cumulative_adopted = [int((state >= 1).sum())]
newly_active = list(seed_nodes)

for step in range(MAX_STEPS):
    next_active = []
    for node in newly_active:
        for neighbour in G.neighbors(node):
            # Each susceptible neighbour gets one independent chance.
            if state[neighbour] == 0 and rng.random() < TRANSMIT_PROB:
                state[neighbour] = 1
                next_active.append(neighbour)
        state[node] = 2  # this node has had its turn

    newly_active = next_active
    cumulative_adopted.append(int((state >= 1).sum()))
    if not newly_active:
        break  # nothing new spread, the cascade has burned out

final_reach = (state >= 1).sum()
reach_fraction = final_reach / N_PEOPLE

# --- Make the picture --------------------------------------------------
fig, (ax_curve, ax_net) = plt.subplots(1, 2, figsize=(15, 6.5))

# Left: cumulative adoption S-curve.
ax_curve.plot(cumulative_adopted, color="crimson", linewidth=2.6,
              marker="o", markersize=4)
ax_curve.set_title("Cumulative adoption over time (the viral S-curve)")
ax_curve.set_xlabel("Time step (each step = one round of sharing)")
ax_curve.set_ylabel("Total people who have adopted")
ax_curve.set_ylim(0, N_PEOPLE)
ax_curve.grid(alpha=0.3)
ax_curve.text(0.97, 0.05,
              f"Final reach: {final_reach} of {N_PEOPLE}\n"
              f"({reach_fraction:.0%} of the network)",
              transform=ax_curve.transAxes, ha="right", va="bottom",
              fontsize=10,
              bbox=dict(boxstyle="round", facecolor="mistyrose"))

# Right: network snapshot. Adopted nodes glow, the rest are grey.
pos = nx.spring_layout(G, seed=SEED, k=0.5)
adopted_mask = state >= 1
node_colours = np.where(adopted_mask, "crimson", "lightgrey")
node_sizes = 20 + degrees * 6   # bigger dot = more connected (a hub)

nx.draw_networkx_edges(G, pos, ax=ax_net, alpha=0.15, width=0.5)
nx.draw_networkx_nodes(G, pos, ax=ax_net, node_color=node_colours,
                       node_size=node_sizes, linewidths=0)
ax_net.set_title("Who adopted (red) vs who did not (grey)\n"
                 "bigger dots are better-connected hubs")
ax_net.axis("off")

fig.suptitle("Viral spread on a scale-free social network",
             fontsize=15, fontweight="bold")
fig.tight_layout(rect=[0, 0, 1, 0.95])

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "viral_spread.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
print("=" * 70)
print("VIRAL SPREAD  ->  saved:", out_path)
print("=" * 70)
print(f"""
We started the spread from {N_SEEDS} of the most-connected people in a network
of {N_PEOPLE}. Each adopter had a {TRANSMIT_PROB:.0%} chance of passing it to each of
their neighbours, once.

The cascade reached {final_reach} people ({reach_fraction:.0%} of the network) in {len(cumulative_adopted) - 1} steps.

WHAT TO TAKE FROM THIS:
- The adoption curve has an S-shape: slow start, fast middle, levelling
  off. That is the signature of contagion through a network.
- Hubs matter enormously. Starting from well-connected people lets a
  cascade take off; starting from the edges often fizzles.
- "Viral" is just a network dynamic. Something spreading widely does not
  prove it is true, good, or important. It mainly tells you the
  transmission conditions were right.

TRY CHANGING:
  - TRANSMIT_PROB : there is a tipping point. Below it, most cascades die
                    out; above it, they engulf the network.
  - N_SEEDS / seed_nodes : try seeding from random nodes instead of hubs.
  - The graph : swap in nx.watts_strogatz_graph for a small-world shape.
""")
