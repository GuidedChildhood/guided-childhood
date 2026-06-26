"""
ONE CLICK VS FIFTY CLICKS
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

THE QUESTION THIS ANSWERS
-------------------------
"How quickly does my feed change shape based on what I click? Is one tap a
 big deal, or does it take a while?"

THE IDEA IN PLAIN WORDS
-----------------------
Every time you engage with a topic, the recommender nudges your feed
towards more of that topic. A single click barely moves things. But the
nudges compound: click the same kind of thing fifty times and the feed
can reorganise itself around that topic, crowding out everything else.

This script starts with a balanced feed across several topics. Then we
simulate a viewer who keeps clicking ONE topic ("gaming"). We snapshot the
feed's composition after 1 click and again after 50 clicks, and put the
two side by side.

HOW THE FEED RESPONDS
---------------------
Each topic has a "weight" that decides how much of the feed it fills. When
you click a topic, its weight goes up. The feed composition is just those
weights turned into percentages. This is a simplified stand-in for how
engagement feeds back into ranking.

This is a simplified model for intuition, not a copy of any platform.

WHAT THE OUTPUT SHOWS
---------------------
Two bar charts side by side: the feed's topic mix after 1 click, and
after 50 clicks on the same topic. The shift makes the compounding visible.

RUN IT
------
    python one_click_vs_fifty_clicks.py
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

SEED = 5
rng = np.random.default_rng(SEED)

TOPICS = ["gaming", "music", "cooking", "sport", "science", "art"]
N_TOPICS = len(TOPICS)
CLICKED_TOPIC = 0          # the viewer keeps clicking "gaming"

# How strongly one click pulls the feed towards that topic. Larger = the
# feed reshapes faster.
CLICK_PULL = 0.08


def feed_composition(weights):
    """Turn topic weights into the share of the feed each topic fills."""
    return weights / weights.sum()


def simulate_clicks(n_clicks):
    """Start from a balanced feed, click CLICKED_TOPIC n_clicks times,
    and return the resulting feed composition (as percentages)."""
    # A roughly balanced starting feed with a little natural variation.
    weights = np.ones(N_TOPICS) + rng.uniform(0, 0.05, size=N_TOPICS)

    for _ in range(n_clicks):
        # Each click multiplies the clicked topic's weight up a little,
        # so repeated clicks compound rather than just add.
        weights[CLICKED_TOPIC] *= (1 + CLICK_PULL)
    return feed_composition(weights)


# We re-seed before each run so the small starting variation is identical,
# isolating the effect of the number of clicks.
rng = np.random.default_rng(SEED)
after_1 = simulate_clicks(1)
rng = np.random.default_rng(SEED)
after_50 = simulate_clicks(50)

# --- Make the picture --------------------------------------------------
fig, (ax1, ax50) = plt.subplots(1, 2, figsize=(14, 6.5), sharey=True)
colours = plt.cm.Set2(np.linspace(0, 1, N_TOPICS))
x = np.arange(N_TOPICS)


def draw(ax, comp, title):
    bars = ax.bar(x, comp * 100, color=colours)
    # Highlight the clicked topic with a dark edge.
    bars[CLICKED_TOPIC].set_edgecolor("black")
    bars[CLICKED_TOPIC].set_linewidth(2.5)
    ax.set_xticks(x)
    ax.set_xticklabels(TOPICS, rotation=30, ha="right")
    ax.set_title(title, fontsize=13)
    ax.set_ylabel("Share of the feed (%)")
    ax.grid(axis="y", alpha=0.3)
    for i, v in enumerate(comp * 100):
        ax.text(i, v + 0.6, f"{v:.0f}%", ha="center", fontsize=9)


draw(ax1, after_1, "Feed after 1 click on 'gaming'")
draw(ax50, after_50, "Feed after 50 clicks on 'gaming'")
ax1.set_ylim(0, max(after_50.max() * 100 + 10, 40))

fig.suptitle("One click barely moves the feed. Fifty clicks reshape it.",
             fontsize=15, fontweight="bold")
fig.tight_layout(rect=[0, 0, 1, 0.95])

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUT_DIR, exist_ok=True)
out_path = os.path.join(OUT_DIR, "one_click_vs_fifty_clicks.png")
fig.savefig(out_path, dpi=120)
plt.close(fig)

# --- Plain-language interpretation ------------------------------------
share_1 = after_1[CLICKED_TOPIC] * 100
share_50 = after_50[CLICKED_TOPIC] * 100

print("=" * 70)
print("ONE CLICK VS FIFTY CLICKS  ->  saved:", out_path)
print("=" * 70)
print(f"""
We started with a roughly balanced feed across {N_TOPICS} topics. Then a viewer
kept clicking just one topic, '{TOPICS[CLICKED_TOPIC]}'.

Share of the feed taken up by '{TOPICS[CLICKED_TOPIC]}':
  after  1 click  : {share_1:.0f}%
  after 50 clicks : {share_50:.0f}%

WHAT TO TAKE FROM THIS:
- A single click hardly changes anything. The feed still looks balanced.
- But the nudges compound. After fifty clicks the feed has reorganised
  itself around that one topic, and the other topics shrink to make room.
- This happens quietly. No single click felt decisive, yet the cumulative
  effect is a very different feed.

THE TAKEAWAY FOR A READER:
Your feed is a mirror of your past behaviour, weighted towards your most
repeated choices. If your feed feels narrow, that is partly the algorithm
and partly the sum of many small taps you may not remember making. The
good news: the same mechanism works in reverse. Deliberately engaging with
a wider range of things gradually widens the feed back out.

TRY CHANGING:
  - CLICK_PULL : how hard each click pulls the feed.
  - The number of clicks in the snapshots (1 and 50).
  - CLICKED_TOPIC : click a different topic and watch the mix tilt.
""")
