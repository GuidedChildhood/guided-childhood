"""
engine.py
=========

A complete, runnable, EDUCATIONAL recommendation engine.

This is the kind of machine that decides what shows up next in a video feed. It
is deliberately small so you can read every line, but it is REAL: it uses the
same two stage shape (retrieve, then rank) that the big platforms use, and it
learns from your behaviour the same way they do.

Run it with:

    python engine.py

and read the story it prints. You will watch a pretend person use the feed for a
few days and see the feed quietly reshape itself around them.

THE TWO STAGES, in one breath:

    Stage 1, CANDIDATE GENERATION ("retrieve"):
        Out of thousands of possible videos, quickly grab a shortlist of maybe a
        few dozen that look promising. This has to be fast and rough.

    Stage 2, RANKING ("rank"):
        Take that shortlist and carefully score each one, then sort. This can be
        slower and cleverer because the list is now short.

Then we SHOW the top few, watch what the person does, and LEARN. Round and round.

        +-----------+      +--------+      +--------+      +---------+
        |  RETRIEVE | ---> |  RANK  | ---> |  SHOW  | ---> |  LEARN  |
        | shortlist |      |  score |      |  feed  |      | update  |
        +-----------+      +--------+      +--------+      +---------+
              ^                                                 |
              |_________________________________________________|
                         tomorrow's feed is different

Everything below uses only numpy and the small InterestVector helper next door.
"""

from __future__ import annotations

import numpy as np

from interest_vector import TOPICS, InterestVector


# A single random number generator we control, so every run tells the same story
# unless you change the seed. Reproducibility makes experiments fair.
RNG = np.random.default_rng(7)


# ====================================================================== #
# 1. THE WORLD: a tiny catalogue of items
# ====================================================================== #
#
# Each item is one thing the feed could show: a clip, a post, a track. It has:
#   * a name we can print
#   * a topic vector saying what it is about (its InterestVector)
#   * a quality score from 0 to 1 (roughly: how well made / well liked it is)
#   * an age in days (how fresh it is; newer things often feel more exciting)
#
# In a real system this catalogue would have millions of rows in a database. We
# use about twenty so you can hold the whole world in your head.

class Item:
    def __init__(self, name: str, topics: dict[str, float], quality: float, age_days: float):
        self.name = name
        self.vector = InterestVector(topics)
        self.quality = quality
        self.age_days = age_days

    def freshness(self) -> float:
        """
        Turn 'age in days' into a 0 to 1 freshness score, newest = 1.

        We use a gentle decay: something posted today scores about 1, something a
        week old scores lower, something a month old scores near zero. Platforms
        do this so the feed does not feel like a museum.
        """
        # exp(-age/7) means freshness halves roughly every five days. The 7 is a
        # tunable "how long does new stay new" knob.
        return float(np.exp(-self.age_days / 7.0))

    def main_topic(self) -> str:
        """The single topic this item is mostly about. Used for tidy printing."""
        return TOPICS[int(np.argmax(self.vector.values))]


def build_catalogue() -> list[Item]:
    """Hand built so the topics and qualities are easy to reason about."""
    return [
        # name                              topic mix                              quality  age(days)
        Item("Last Minute Winner",          {"football": 0.95, "gaming": 0.05},    0.80,   1),
        Item("How Goalkeepers Train",       {"football": 0.85, "science": 0.15},   0.70,   4),
        Item("History of the World Cup",    {"football": 0.90, "music": 0.10},     0.65,   30),
        Item("Penalty Shootout Drama",      {"football": 0.92, "music": 0.08},     0.75,   2),

        Item("Inside a Volcano",            {"science": 0.90, "art": 0.10},        0.88,   3),
        Item("Why the Sky is Blue",         {"science": 0.95, "art": 0.05},        0.82,   6),
        Item("Black Holes Explained",       {"science": 0.93, "music": 0.07},      0.90,   1),
        Item("How Vaccines Work",           {"science": 0.88, "cooking": 0.12},    0.78,   20),

        Item("Lo-fi Beats to Study To",     {"music": 0.90, "science": 0.10},      0.72,   5),
        Item("How a Guitar is Made",        {"music": 0.70, "art": 0.30},          0.68,   12),
        Item("Drumming for Beginners",      {"music": 0.95, "gaming": 0.05},       0.66,   8),

        Item("Speed Painting a Galaxy",     {"art": 0.80, "science": 0.20},        0.74,   3),
        Item("Street Art Around the World",  {"art": 0.92, "music": 0.08},          0.70,   18),
        Item("Drawing Cartoon Animals",     {"art": 0.95, "cooking": 0.05},        0.64,   9),

        Item("Speedrun World Record",       {"gaming": 0.93, "football": 0.07},    0.81,   2),
        Item("Building a Castle in Minecraft", {"gaming": 0.85, "art": 0.15},      0.69,   4),
        Item("Retro Games History",         {"gaming": 0.88, "music": 0.12},       0.62,   25),

        Item("One Pan Pasta",               {"cooking": 0.90, "science": 0.10},    0.71,   7),
        Item("The Science of Bread",        {"cooking": 0.60, "science": 0.40},    0.85,   3),
        Item("Decorating a Birthday Cake",   {"cooking": 0.85, "art": 0.15},        0.67,   11),
    ]


# ====================================================================== #
# 2. THE USER
# ====================================================================== #

class User:
    """
    A person using the feed. Their taste lives in an InterestVector that the
    engine updates over time. We also remember which items they have already been
    shown, so the feed does not keep repeating itself.
    """

    def __init__(self, name: str, starting_interests: dict[str, float]):
        self.name = name
        self.interests = InterestVector(starting_interests)
        self.seen: set[str] = set()


# ====================================================================== #
# 3. THE RANKING WEIGHTS (and how they learn)
# ====================================================================== #
#
# When we score a candidate item we combine several signals. How much should each
# signal matter? Those amounts are the "weights". They are just numbers you can
# tune. We START with sensible guesses and then let the engine nudge them based
# on whether the person actually engaged. That nudging is a baby version of the
# machine learning that runs real feeds.

class RankingWeights:
    def __init__(self):
        # Our starting beliefs about what makes a good recommendation.
        self.relevance = 1.00   # how much we trust "this matches your taste"
        self.quality = 0.50     # how much we trust "this is well made"
        self.freshness = 0.30   # how much we reward "this is new"

    def online_update(self, features: dict[str, float], reward: float, lr: float = 0.05):
        """
        A tiny online learning step for the weights themselves.

        ONLINE LEARNING means: learn one example at a time, as it arrives, instead
        of crunching a giant dataset overnight. After we show an item and see the
        reward, we ask: which signals were high for this item? If the person
        engaged (positive reward), the signals that were high probably deserve a
        little MORE trust, so we increase those weights. If they bailed, we trim
        the weights that pushed this item up.

        This is gradient ascent in disguise. The 'features' are the raw signal
        values for the chosen item (its relevance, quality, freshness). The
        update rule for each weight is:

            weight += learning_rate * reward * feature_value

        so a weight only moves when BOTH the reward is non-zero AND that feature
        was actually present. Over many rounds the weights drift towards whatever
        genuinely predicts engagement for this person.
        """
        self.relevance += lr * reward * features["relevance"]
        self.quality += lr * reward * features["quality"]
        self.freshness += lr * reward * features["freshness"]

        # Keep weights non-negative and bounded so one wild day cannot break the
        # whole engine. Real systems use similar guard rails.
        self.relevance = float(np.clip(self.relevance, 0.0, 3.0))
        self.quality = float(np.clip(self.quality, 0.0, 3.0))
        self.freshness = float(np.clip(self.freshness, 0.0, 3.0))

    def __repr__(self) -> str:
        return (f"weights(relevance={self.relevance:.2f}, "
                f"quality={self.quality:.2f}, freshness={self.freshness:.2f})")


# ====================================================================== #
# 4. STAGE ONE: CANDIDATE GENERATION (retrieve)
# ====================================================================== #

def generate_candidates(user: User, catalogue: list[Item], epsilon: float,
                        k: int = 8) -> list[Item]:
    """
    Build a shortlist of items worth ranking carefully.

    We do it in two parts, exactly like the big systems:

      1. THE OBVIOUS MATCHES (exploitation): take the k items whose topic vectors
         point most like the user's interests, measured by cosine similarity.
         These are the "we are pretty sure you will like this" picks.

      2. A SPLASH OF THE UNKNOWN (exploration): also throw in some items chosen at
         random from everything else. Without this, the feed could only ever
         recommend more of what it already knows you like, and you would never
         discover that you also love cooking. This is how the system breaks out of
         its own bubble.

    HOW MANY random explorers we add is tied to epsilon, the single "curiosity"
    knob used everywhere in this engine. When epsilon is 0 we add none at all, so
    the shortlist is purely "more of the same": a true filter bubble. When epsilon
    is larger we mix in more of the unknown. This is the deepest place the
    filter-bubble effect is born, before ranking even happens.

    We never include items the user has already seen.
    """
    unseen = [item for item in catalogue if item.name not in user.seen]

    # Part 1: the obvious matches, sorted by similarity to the user.
    scored = [(item, user.interests.cosine_similarity(item.vector)) for item in unseen]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    top_matches = [item for item, _ in scored[:k]]

    # Part 2: random exploration. The number of explorers grows with epsilon, so
    # a cautious feed (epsilon=0) explores nothing and an adventurous one explores
    # plenty. round() turns the fraction into a whole number of items.
    n_explore = int(round(epsilon * 10))
    leftovers = [item for item in unseen if item not in top_matches]
    if leftovers and n_explore > 0:
        chosen = RNG.choice(len(leftovers), size=min(n_explore, len(leftovers)), replace=False)
        explore_items = [leftovers[int(i)] for i in chosen]
    else:
        explore_items = []

    return top_matches + explore_items


# ====================================================================== #
# 5. STAGE TWO: RANKING (score and sort)
# ====================================================================== #

def score_item(user: User, item: Item, weights: RankingWeights,
               epsilon: float, total_views: int) -> tuple[float, dict[str, float]]:
    """
    Give one candidate a final score, and report the raw signals we used.

    The score is a weighted sum of three honest signals plus a curiosity bonus:

        score = w_relevance * relevance
              + w_quality   * quality
              + w_freshness * freshness
              + exploration_bonus

    where:
        relevance  = how well the item matches the user (cosine similarity)
        quality    = how well made the item is (baked into the item)
        freshness  = how new the item is (decays with age)

    THE EXPLORATION BONUS is where we deliberately reward uncertainty. The idea
    comes from a method called UCB ("Upper Confidence Bound"): give a small boost
    to things we have not shown much, because the only way to learn whether you
    like cooking is to occasionally TRY a cooking video. The less the whole feed
    has been used, the bigger this curiosity boost, and it shrinks as the system
    gathers experience. epsilon scales how adventurous we are overall.
    """
    relevance = user.interests.cosine_similarity(item.vector)
    quality = item.quality
    freshness = item.freshness()

    # A simple optimistic / UCB-style curiosity bonus. It is largest early on
    # (when total_views is small) and fades as the system has seen more. We tie
    # its strength to epsilon so a cautious feed (low epsilon) barely explores.
    exploration_bonus = epsilon * float(np.sqrt(np.log(total_views + 2) / (total_views + 1)))

    score = (weights.relevance * relevance
             + weights.quality * quality
             + weights.freshness * freshness
             + exploration_bonus)

    features = {"relevance": relevance, "quality": quality, "freshness": freshness}
    return score, features


def rank_candidates(user: User, candidates: list[Item], weights: RankingWeights,
                    epsilon: float, total_views: int):
    """
    Score every candidate, then sort best first.

    We also fold in EPSILON-GREEDY exploration here, which is the other classic
    way to stay curious:

        with probability (1 - epsilon): trust the scores, show the best.
        with probability epsilon:       shuffle in a random pick instead.

    "Greedy" means "always grab the highest score". Pure greed gets stuck: it
    keeps serving your favourite topic forever. epsilon is the chance we throw
    greed aside and gamble on something random, just to keep learning. epsilon=0
    is a perfectly obedient, bubble-forming feed. epsilon=0.3 is a more
    adventurous one.

    Returns a list of (item, score, features), sorted by the score we will act on.
    """
    ranked = []
    for item in candidates:
        score, features = score_item(user, item, weights, epsilon, total_views)
        ranked.append([item, score, features])

    # Epsilon-greedy: with probability epsilon, give a random candidate a big
    # temporary boost so it jumps to the top. This is a blunt but honest way to
    # force the feed to try something off-script.
    if RNG.random() < epsilon and ranked:
        lucky = int(RNG.integers(len(ranked)))
        ranked[lucky][1] += 10.0  # an enormous one off boost, only for this round

    ranked.sort(key=lambda triple: triple[1], reverse=True)
    return ranked


# ====================================================================== #
# 6. SIMULATING THE PERSON: behaviour -> reward
# ====================================================================== #

def simulate_engagement(user: User, item: Item) -> dict:
    """
    Pretend to be the human and react to one shown item.

    We do not have a real person, so we invent a believable reaction. The closer
    the item matches the user's CURRENT interests, the more likely they are to
    watch a lot of it. We produce three everyday signals:

        watch_fraction : how much of it they watched, 0 to 1
        liked          : did they tap like
        skipped        : did they bail almost immediately

    Then we boil those signals down into ONE reward number between about -1 and
    +1. This is exactly the messy real life step where a company decides how much
    a "like" is worth versus a "watch" versus a "skip". The weights we pick here
    quietly encode what the feed is really optimising for.
    """
    match = user.interests.cosine_similarity(item.vector)

    # Watch fraction: mostly driven by match and quality, with a little randomness
    # so the same item is not always watched identically. np.clip keeps it in [0,1].
    noise = RNG.normal(0, 0.08)
    watch_fraction = float(np.clip(0.2 + 0.7 * match + 0.2 * item.quality + noise, 0.0, 1.0))

    liked = watch_fraction > 0.75 and RNG.random() < 0.6
    skipped = watch_fraction < 0.25

    # Turn behaviour into a single reward. Watching most of something is good,
    # bailing is bad, a like is a strong happy signal. These coefficients are a
    # value judgement, not a law of nature: change them and you change the feed's
    # personality.
    reward = (watch_fraction - 0.4) * 1.5      # centred so ~40% watched is neutral
    if liked:
        reward += 0.4
    if skipped:
        reward -= 0.3
    reward = float(np.clip(reward, -1.0, 1.0))

    return {
        "watch_fraction": watch_fraction,
        "liked": liked,
        "skipped": skipped,
        "reward": reward,
    }


# ====================================================================== #
# 7. ONE FULL ROUND: retrieve -> rank -> show -> learn
# ====================================================================== #

def run_round(round_no: int, user: User, catalogue: list[Item], weights: RankingWeights,
              epsilon: float, total_views: int, feed_size: int = 4, verbose: bool = True):
    """
    Play one day of the feed and let the user learn from the top pick.

    Steps:
      1. RETRIEVE a shortlist of candidates.
      2. RANK them into a feed.
      3. SHOW the top feed_size items, but only treat the very top one as the one
         the user actually engages with (that keeps the printed story simple).
      4. LEARN: convert their behaviour into a reward, update their interest
         vector, and nudge the ranking weights.

    Returns the updated total_views and the feed we showed, so the caller can
    keep score across rounds.
    """
    candidates = generate_candidates(user, catalogue, epsilon, k=8)
    ranked = rank_candidates(user, candidates, weights, epsilon, total_views)

    feed = [triple[0] for triple in ranked[:feed_size]]
    feed_topics = sorted({item.main_topic() for item in feed})

    if verbose:
        topic_counts = _topic_breakdown(feed)
        print(f"\nRound {round_no}: today's feed")
        for rank_position, (item, score, _features) in enumerate(ranked[:feed_size], start=1):
            print(f"   {rank_position}. {item.name:<28} "
                  f"[{item.main_topic():<8}] score={score:.2f}")
        print(f"   topics on screen: {', '.join(feed_topics)}  "
              f"({_count_phrase(topic_counts)})")

    # The user engages with the top item (the one the feed pushed hardest).
    top_item, top_score, top_features = ranked[0]
    user.seen.add(top_item.name)
    behaviour = simulate_engagement(user, top_item)
    total_views += 1

    # --- LEARN: update the user's interests from this one experience. ---
    before_top = user.interests.top_topics(1)[0]
    changes = user.interests.update_from_feedback(
        top_item.vector, behaviour["reward"], learning_rate=0.18
    )

    # --- LEARN: nudge the ranking weights too (online learning). ---
    weights.online_update(top_features, behaviour["reward"], lr=0.05)

    if verbose:
        pct = int(round(behaviour["watch_fraction"] * 100))
        verb = "watched"
        tag = ""
        if behaviour["liked"]:
            tag = " and LIKED it"
        elif behaviour["skipped"]:
            verb = "skipped"
        print(f"   you {verb} '{top_item.name}' for {pct}%{tag} "
              f"(reward {behaviour['reward']:+.2f})")

        # Report the biggest interest change in a child-readable sentence.
        if changes:
            topic, (before, after) = max(changes.items(), key=lambda kv: abs(kv[1][1] - kv[1][0]))
            direction = "rose" if after >= before else "fell"
            print(f"   -> your interest in {topic.upper()} {direction} "
                  f"from {before:.2f} to {after:.2f}")
        else:
            print("   -> your interests did not move much this time")

    return total_views, feed


def _topic_breakdown(feed: list[Item]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for item in feed:
        t = item.main_topic()
        counts[t] = counts.get(t, 0) + 1
    return counts


def _count_phrase(counts: dict[str, int]) -> str:
    return ", ".join(f"{n} {t}" for t, n in sorted(counts.items(), key=lambda kv: -kv[1]))


# ====================================================================== #
# 8. THE DEMO: watch the feed adapt over several rounds
# ====================================================================== #

def demo_adapting_feed():
    print("=" * 70)
    print("PART 5: A RECOMMENDATION ENGINE YOU CAN READ")
    print("=" * 70)
    print(
        "\nWe will follow one pretend person, Robin, for several days. Robin\n"
        "starts out mostly into football, with only a faint interest in other\n"
        "things. Watch how the feed learns, and how Robin's interests shift as\n"
        "the feed keeps offering more of whatever Robin engages with.\n"
    )

    catalogue = build_catalogue()
    robin = User("Robin", {"football": 0.6, "science": 0.2, "music": 0.1, "gaming": 0.1})
    weights = RankingWeights()

    print("Robin's starting interests:")
    for topic, value in robin.interests.top_topics(len(TOPICS)):
        bar = "#" * int(round(value * 20))
        print(f"   {topic:<9} {value:.2f} {bar}")
    print(f"\nStarting ranking {weights}")

    # A modest amount of exploration: enough to discover new things, not so much
    # that the feed feels random.
    epsilon = 0.15
    total_views = 0

    for round_no in range(1, 9):
        total_views, _feed = run_round(
            round_no, robin, catalogue, weights, epsilon, total_views
        )

    print("\n" + "-" * 70)
    print("After eight rounds:")
    print("\nRobin's interests now:")
    for topic, value in robin.interests.top_topics(len(TOPICS)):
        bar = "#" * int(round(value * 20))
        print(f"   {topic:<9} {value:.2f} {bar}")
    print(f"\nRanking weights the engine learned: {weights}")
    print(
        "\nNotice that the weights drifted. The engine slowly worked out which\n"
        "signals predicted that Robin would stay, and trusted those more.\n"
    )


# ====================================================================== #
# 9. THE EXPERIMENT: filter bubbles, epsilon = 0.0 vs 0.3
# ====================================================================== #

def measure_feed_diversity(epsilon: float, rounds: int = 14) -> tuple[int, list[str]]:
    """
    Run a fresh copy of the same person and count how many DISTINCT topics they
    were actually shown across all rounds. More distinct topics = a broader, less
    bubbled feed. We return the count and the set of topics so we can print both.

    One important detail: a real feed never runs out of videos. There is always
    another football clip. To model that we clear the "already seen" memory each
    round, so a greedy feed is free to keep serving the same favourite topic for
    ever rather than being forced onto new topics simply because it ran out of old
    ones. This is what lets the filter bubble actually form.

    Both runs start from the EXACT same interests, catalogue and random luck. The
    only thing that differs is epsilon, the willingness to explore. That is what
    makes this a fair test of the filter-bubble effect.
    """
    # Reset the shared random generator so both experiments face the same luck.
    global RNG
    RNG = np.random.default_rng(42)

    catalogue = build_catalogue()
    robin = User("Robin", {"football": 0.6, "science": 0.2, "music": 0.1, "gaming": 0.1})
    weights = RankingWeights()
    total_views = 0

    topics_shown: set[str] = set()
    for round_no in range(1, rounds + 1):
        robin.seen.clear()  # infinite supply: the feed can repeat topics freely
        total_views, feed = run_round(
            round_no, robin, catalogue, weights, epsilon, total_views, verbose=False
        )
        for item in feed:
            topics_shown.add(item.main_topic())

    return len(topics_shown), sorted(topics_shown)


def experiment_filter_bubble():
    print("\n" + "=" * 70)
    print("EXPERIMENT: does more exploration pop the filter bubble?")
    print("=" * 70)
    print(
        "\nWe run the SAME person twice with the same starting interests. The\n"
        "only difference is epsilon, how often the feed gambles on something\n"
        "new. Then we count how many different topics each feed ever showed.\n"
    )

    narrow_count, narrow_topics = measure_feed_diversity(epsilon=0.0)
    broad_count, broad_topics = measure_feed_diversity(epsilon=0.3)

    def topic_word(n: int) -> str:
        return "topic" if n == 1 else "topics"

    print(f"epsilon = 0.0 (never explores): {narrow_count} distinct {topic_word(narrow_count)} shown")
    print(f"   -> {', '.join(narrow_topics)}")
    print(f"epsilon = 0.3 (explores often): {broad_count} distinct {topic_word(broad_count)} shown")
    print(f"   -> {', '.join(broad_topics)}")

    print(
        "\nWhat to take away:\n"
        "With no exploration the feed quickly funnels into a narrow set of\n"
        "topics, the classic filter bubble. With more exploration the same\n"
        "person is shown a noticeably wider world. Neither is 'correct'. The\n"
        "point is that a single hidden number, epsilon, quietly decides how\n"
        "broad or narrow your view of the world becomes.\n"
    )


# ====================================================================== #
# 10. RUN EVERYTHING
# ====================================================================== #

if __name__ == "__main__":
    demo_adapting_feed()
    experiment_filter_bubble()
    print("=" * 70)
    print("Done. Open the README in this folder for things to try next.")
    print("=" * 70)
