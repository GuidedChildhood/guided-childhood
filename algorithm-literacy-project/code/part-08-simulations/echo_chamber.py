"""
ECHO CHAMBER
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"Why does a feed sometimes narrow down to the same few things, and what
 stops that from happening?"

THE IDEA IN PLAIN WORDS
-----------------------
A recommender faces a constant trade-off:
  - EXPLOIT: show more of what already got engagement (safe, relevant).
  - EXPLORE: occasionally try something new (risky, but it keeps the
    feed varied and keeps learning).

If a system almost always exploits, the feed can collapse onto a narrow
slice of topics. We call the result an "echo chamber" or "filter bubble"
(Pariser 2011). This is an EMERGENT property of a greedy optimisation
loop. It is not, by itself, evidence that anyone designed it on purpose.
The balance is tuned by one dial here: the exploration rate, epsilon.

IMPORTANT NUANCE  [CONTESTED]
-----------------------------
How strong this effect is in the real world is debated. Bakshy, Messing
and Adamic (2015, Science) found that on Facebook, individual choices
about what to click narrowed exposure MORE than the ranking algorithm
did. So narrowing is partly the algorithm and partly us. This script
isolates and shows the algorithm's side of it, but the honest summary is
that both matter.

WHAT WE MODEL
-------------
A single feed drawing from many topics. Each topic has a hidden "appeal".
An epsilon-greedy algorithm picks topics: with probability epsilon it
explores a random topic, otherwise it shows the current best. We measure
DIVERSITY of the feed over a sliding window using Shannon entropy: high
entropy = many topics in the mix, low entropy = a narrow feed.

We run this for several values of epsilon and plot diversity over time
for each, so you can see exploration keeping the chamber open.

This is a simplified model for intuition, not a model of any one platform.

RUN IT
------
    python echo_chamber.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

SEED = 42
N_TOPICS = 12
ROUNDS = 1200
WINDOW = 80          # how many recent items we look at to judge diversity
EPSILONS = [0.0, 0.05, 0.15, 0.40]   # the exploration dials we compare


def shannon_diversity(counts):
    """Measure how spread out a set of counts is.

    Returns a number from 0 (everything is one topic, a total bubble) to
    1 (perfectly even mix of all topics). This is Shannon entropy,
    normalised so it always lands between 0 and 1.
    """
    total = counts.sum()
    if total == 0:
        return 0.0
    p = counts[counts > 0] / total
    entropy = -np.sum(p * np.log(p))
    return entropy / np.log(N_TOPICS)


def run_feed(epsilon, seed):
    """Run one feed with a given exploration rate. Return diversity over time."""
    rng = np.random.default_rng(seed)

    # Hidden appeal of each topic. A few topics are naturally stickier.
    appeal = rng.uniform(0.2, 0.8, size=N_TOPICS)

    # The algorithm's running estimate of each topic's appeal.
    estimate = np.full(N_TOPICS, 0.5)
    # How many times we have shown each topic (used to average feedback).
    shown = np.zeros(N_TOPICS)

    recent = []                       # the last WINDOW topics shown
    diversity_over_time = np.zeros(ROUNDS)

    for t in range(ROUNDS):
        # Epsilon-greedy choice.
        if rng.random() < epsilon:
            topic = rng.integers(N_TOPICS)          # explore
        else:
            topic = int(np.argmax(estimate))        # exploit best guess

        # Noisy engagement signal based on that topic's true appeal.
        engaged = 1.0 if rng.random() < appeal[topic] else 0.0

        # Update the running average estimate for this topic.
        shown[topic] += 1
        estimate[topic] += (engaged - estimate[topic]) / shown[topic]

        # Track the sliding window and measure its diversity.
        recent.append(topic)
        if len(recent) > WINDOW:
            recent.pop(0)
        counts = np.bincount(recent, minlength=N_TOPICS)
        diversity_over_time[t] = shannon_diversity(counts)

    return diversity_over_time


# Run every epsilon. We give each its own seed offset so the runs differ
# but the whole experiment stays reproducible.
results = {eps: run_feed(eps, SEED + i) for i, eps in enumerate(EPSILONS)}

# --- Make the picture --------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 7))
colours = plt.cm.viridis(np.linspace(0.1, 0.85, len(EPSILONS)))

for colour, eps in zip(colours, EPSILONS):
    label = f"epsilon = {eps:.2f}"
    if eps == 0.0:
        label += "  (pure exploitation)"
    ax.plot(results[eps], color=colour, linewidth=2.2, label=label)

ax.set_title("Feed diversity over time at different exploration rates",
             fontsize=14, fontweight="bold")
ax.set_xlabel("Round (each round = one item shown in the feed)")
ax.set_ylabel("Topic diversity  (1 = wide mix, 0 = single-topic bubble)")
ax.set_ylim(-0.03, 1.03)
ax.legend(title="Exploration dial", loc="upper right", fontsize=10)
ax.grid(alpha=0.3)
ax.text(0.01, 0.02,
        "Lower exploration -> the feed collapses onto a few topics.\n"
        "A little exploration keeps the chamber open.",
        transform=ax.transAxes, fontsize=9, va="bottom")

fig.tight_layout()

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "echo_chamber.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
# Compare the average diversity in the final stretch of each run.
tail = slice(-200, None)
final_div = {eps: results[eps][tail].mean() for eps in EPSILONS}

print("=" * 70)
print("ECHO CHAMBER  ->  saved:", out_path)
print("=" * 70)
print("\nAverage feed diversity over the last 200 rounds:")
for eps in EPSILONS:
    bar = "#" * int(final_div[eps] * 40)
    print(f"  epsilon={eps:<5}  diversity={final_div[eps]:.2f}  {bar}")

print(f"""
WHAT TO TAKE FROM THIS:
With no exploration (epsilon = 0) the feed locked onto whichever topic
looked best early and stopped showing the rest. That is the echo chamber
forming. Adding even a small amount of exploration kept many topics alive
in the feed.

This is a DYNAMIC, not a motive. A system that simply chases the next tap
will tend to narrow, with no one needing to plan it. Equally, the fix is
mechanical too: a higher exploration rate keeps things varied.

REMEMBER THE NUANCE [CONTESTED]:
Bakshy et al. (2015) found that in one large real study, people's own
clicking narrowed their exposure more than the ranking did. So in real
life the bubble is partly built by the machine and partly by us.

TRY CHANGING:
  - EPSILONS   : add your own exploration rates to compare.
  - N_TOPICS   : more topics make collapse more dramatic.
  - WINDOW     : a longer memory makes the diversity line smoother.
""")
