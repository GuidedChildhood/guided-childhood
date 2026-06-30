"""
HOW AN ALGORITHM LEARNS
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"How does a recommendation system figure out what I like, even though I
never tell it directly?"

THE IDEA IN PLAIN WORDS
-----------------------
Imagine you have a hidden set of interests. You never write them down.
But every time something appears in your feed, you either engage with it
(a tap, a like, a watch to the end) or you scroll past. The algorithm
only ever sees those tiny signals. From thousands of them, it slowly
builds a GUESS about your interests, and it gets better over time.

This script builds a small synthetic version of that process so you can
watch the guess (the "estimate") move towards the truth.

WHAT WE MODEL
-------------
- You have a TRUE interest score for each of several topics. This is
  hidden from the algorithm. It is the thing it is trying to learn.
- The algorithm keeps an ESTIMATE of your interest in each topic. It
  starts out neutral (it knows nothing).
- Each round it shows you one item from some topic, observes whether you
  engage (a noisy yes or no), and nudges its estimate up or down.
  This is a simple form of online learning, very close to how real
  systems update their internal model from feedback.

This is a simplified model built for intuition. It is not a copy of any
specific platform's code.

WHAT THE OUTPUT SHOWS
---------------------
Left panel:  the algorithm's estimate for each topic (dashed lines)
             climbing towards the true hidden interest (flat dotted
             lines) as the rounds go by.
Right panel: how RELEVANT the feed is on average. As the estimate
             improves, the system shows you more of what you actually
             like, so feed relevance rises.

RUN IT
------
    python how_an_algorithm_learns.py

The PNG is saved in output/ and a plain-language summary is printed.
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")  # no screen needed, just save to a file
import matplotlib.pyplot as plt

# A fixed seed means everyone who runs this gets the exact same result.
SEED = 8
rng = np.random.default_rng(SEED)

# --- The world ---------------------------------------------------------
TOPICS = ["football", "baking", "space", "fashion", "gaming"]
N_TOPICS = len(TOPICS)
ROUNDS = 600

# Your TRUE hidden interest in each topic, on a 0 to 1 scale.
# The algorithm cannot see these numbers. It must learn them.
TRUE_INTEREST = np.array([0.85, 0.15, 0.65, 0.10, 0.45])

# The algorithm's ESTIMATE starts neutral: it assumes 0.5 for everything.
estimate = np.full(N_TOPICS, 0.5)

# How big a nudge each piece of feedback gives. Small means careful and
# slow, large means jumpy. This is the "learning rate".
LEARNING_RATE = 0.04

# A little exploration so the algorithm keeps sampling every topic and
# does not get stuck. Most of the time it shows you its current best
# guess; sometimes it tries a random topic.
EXPLORE_CHANCE = 0.2

# We record the estimate and the feed relevance after every round so we
# can plot how they change.
estimate_history = np.zeros((ROUNDS, N_TOPICS))
relevance_history = np.zeros(ROUNDS)


def choose_topic():
    """Pick which topic to show next.

    Most of the time, show the topic the algorithm currently thinks you
    like most (this is "exploitation"). Sometimes pick at random to keep
    learning about every topic (this is "exploration").
    """
    if rng.random() < EXPLORE_CHANCE:
        return rng.integers(N_TOPICS)
    return int(np.argmax(estimate))


for t in range(ROUNDS):
    topic = choose_topic()

    # Your real reaction is noisy. Even something you love, you skip
    # sometimes; even something you dislike, you occasionally tap. We
    # draw a yes/no engagement using your true interest as the
    # probability.
    engaged = 1 if rng.random() < TRUE_INTEREST[topic] else 0

    # The learning step: move the estimate towards what we just saw.
    # If you engaged (1) the estimate goes up a bit; if you skipped (0)
    # it goes down a bit. This is online gradient-style updating.
    estimate[topic] += LEARNING_RATE * (engaged - estimate[topic])

    # Feed relevance = how well the items we would now choose match your
    # true interests. We measure it as the true interest of the topic the
    # algorithm currently rates highest.
    best_topic = int(np.argmax(estimate))
    relevance_history[t] = TRUE_INTEREST[best_topic]

    estimate_history[t] = estimate

# --- Make the picture --------------------------------------------------
fig, (ax_left, ax_right) = plt.subplots(1, 2, figsize=(14, 6))
colours = plt.cm.tab10(np.linspace(0, 1, N_TOPICS))

# Left: estimate climbing towards the hidden truth.
for i, name in enumerate(TOPICS):
    ax_left.plot(estimate_history[:, i], color=colours[i],
                 linestyle="--", linewidth=2, label=f"{name} (estimate)")
    ax_left.axhline(TRUE_INTEREST[i], color=colours[i],
                    linestyle=":", linewidth=1.5, alpha=0.7)

ax_left.set_title("The algorithm's guess moves towards your hidden interests")
ax_left.set_xlabel("Round (each round = one item shown and one reaction)")
ax_left.set_ylabel("Interest score (0 = never, 1 = always)")
ax_left.set_ylim(-0.05, 1.05)
ax_left.legend(loc="center right", fontsize=8)
ax_left.grid(alpha=0.3)
ax_left.text(0.02, 0.02,
             "Dotted flat line = true hidden interest\nDashed line = the estimate",
             transform=ax_left.transAxes, fontsize=8, va="bottom")

# Right: feed relevance rising. We add a light rolling average so the
# trend is easy to read through the noise.
window = 20
smoothed = np.convolve(relevance_history,
                       np.ones(window) / window, mode="valid")
ax_right.plot(relevance_history, color="lightgrey", linewidth=1,
              label="relevance each round")
ax_right.plot(np.arange(window - 1, ROUNDS), smoothed,
              color="seagreen", linewidth=2.5,
              label=f"smoothed (over {window} rounds)")
ax_right.set_title("As the guess improves, the feed becomes more relevant")
ax_right.set_xlabel("Round")
ax_right.set_ylabel("Average relevance of the feed")
ax_right.set_ylim(-0.05, 1.05)
ax_right.legend(loc="lower right", fontsize=9)
ax_right.grid(alpha=0.3)

fig.suptitle("How an algorithm learns your preferences from tiny signals",
             fontsize=15, fontweight="bold")
fig.tight_layout(rect=[0, 0, 1, 0.96])

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "how_an_algorithm_learns.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
final_error = np.abs(estimate - TRUE_INTEREST).mean()
top_true = TOPICS[int(np.argmax(TRUE_INTEREST))]
top_learned = TOPICS[int(np.argmax(estimate))]

print("=" * 70)
print("HOW AN ALGORITHM LEARNS  ->  saved:", out_path)
print("=" * 70)
print(f"""
The algorithm started knowing nothing: it assumed you were equally
interested in all {N_TOPICS} topics. It never saw your true interests. It only
saw whether you engaged with each item it showed you.

After {ROUNDS} rounds:
  - Your true favourite topic was '{top_true}'.
  - The algorithm's best guess for your favourite was '{top_learned}'.
  - The average gap between its guess and the truth was {final_error:.2f}
    (0 would be a perfect guess).

WHAT TO TAKE FROM THIS:
A recommender does not need you to fill in a form. Thousands of small
choices (a tap here, a skip there) are enough for it to build a model of
you. That is powerful and often useful. It also means your behaviour,
not your stated wishes, is what shapes the feed. Knowing this helps you
read your own feed with clearer eyes.

TRY CHANGING:
  - TRUE_INTEREST   : give yourself different hidden tastes.
  - LEARNING_RATE   : higher learns faster but is jumpier.
  - EXPLORE_CHANCE  : lower means it locks on sooner (see echo_chamber.py).
""")
