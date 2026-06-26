"""
interest_vector.py
==================

A small, friendly building block for the recommendation engine in this folder.

WHAT IS AN INTEREST VECTOR?
---------------------------
Imagine you wrote down, for each topic you might care about, a number between 0
and 1 saying how much you like it right now. Something like this:

    football   0.50
    science    0.20
    music      0.15
    art        0.05
    gaming     0.08
    cooking    0.02

Stack those numbers in a row and you have a "vector". A vector is just an ordered
list of numbers. Computers love vectors because you can compare two of them very
quickly using a little bit of arithmetic.

The whole magic of a recommendation system can be summed up like this:

    1. Describe YOU as a vector of interests.
    2. Describe each VIDEO (or post, or song) as a vector of topics.
    3. The videos whose vectors point in the same direction as yours are the
       ones you are most likely to enjoy.

This file gives us the InterestVector class. It knows how to:

    * hold a person's (or an item's) taste as numbers over a fixed list of topics
    * compare itself to another vector (cosine similarity)
    * LEARN, by nudging its numbers towards things you engaged with and away
      from things you skipped.

Everything here uses only numpy. No magic, no hidden machine learning library.
You could re-derive every line with a pencil and a calculator.
"""

from __future__ import annotations

import numpy as np


# These are the topics our little world knows about. The ORDER matters: position
# 0 is always football, position 1 is always science, and so on. Both users and
# items must agree on this order, otherwise we would be comparing football to
# cooking by accident.
TOPICS = ["football", "science", "music", "art", "gaming", "cooking"]


def topic_index(topic: str) -> int:
    """Turn a topic name into its position in the vector. 'science' -> 1."""
    return TOPICS.index(topic)


class InterestVector:
    """
    A taste profile expressed as one weight per topic.

    The same class is used for two different things, because they are really the
    same idea:

      * A USER's interest vector says how much that person likes each topic.
      * An ITEM's interest vector says how much that item is ABOUT each topic.
        A documentary called "Inside a Volcano" might be 0.9 science, 0.1 art.

    We keep the weights as a numpy array of floats so the maths stays quick.
    """

    def __init__(self, weights: dict[str, float] | None = None):
        # Start every topic at zero, then fill in whatever the caller gave us.
        # Using a dict to build it means nobody has to remember the topic order.
        self.values = np.zeros(len(TOPICS), dtype=float)
        if weights:
            for topic, weight in weights.items():
                self.values[topic_index(topic)] = weight

    # ------------------------------------------------------------------ #
    # Reading the vector
    # ------------------------------------------------------------------ #

    def as_dict(self) -> dict[str, float]:
        """Return the vector as a friendly {topic: weight} dictionary."""
        return {topic: float(self.values[i]) for i, topic in enumerate(TOPICS)}

    def normalised(self) -> np.ndarray:
        """
        Return a copy of the numbers scaled so they add up to 1.

        Why do this? A vector of [2, 1, 1] and a vector of [4, 2, 2] describe the
        SAME taste, just written louder. Normalising removes the loudness so we
        can talk about proportions: "half football, a quarter science, a quarter
        music". We use this when we want the feed to mirror a person's mix of
        interests.
        """
        total = self.values.sum()
        if total <= 0:
            # An all zero vector cannot be turned into proportions, so we share
            # everything out equally rather than dividing by zero.
            return np.full(len(TOPICS), 1.0 / len(TOPICS))
        return self.values / total

    def top_topics(self, n: int = 3) -> list[tuple[str, float]]:
        """Return the n strongest topics, biggest first. Handy for printing."""
        pairs = sorted(self.as_dict().items(), key=lambda kv: kv[1], reverse=True)
        return pairs[:n]

    # ------------------------------------------------------------------ #
    # Comparing two vectors
    # ------------------------------------------------------------------ #

    def cosine_similarity(self, other: "InterestVector") -> float:
        """
        Measure how aligned this vector is with another one, from 0 to 1.

        COSINE SIMILARITY, in plain words:
        Picture each vector as an arrow starting at the same spot. If two arrows
        point in almost the same direction, they are very similar (close to 1).
        If they point in completely different directions, they are not similar at
        all (close to 0). We only care about the DIRECTION of the arrows, not how
        long they are, which is why a quiet fan and a loud fan of the same topic
        still match perfectly.

        The formula is: (a dot b) / (length of a * length of b).
        'dot' multiplies matching positions and adds them up. The lengths are the
        usual "straight line" lengths you get from Pythagoras.
        """
        a = self.values
        b = other.values
        length_a = np.linalg.norm(a)
        length_b = np.linalg.norm(b)
        if length_a == 0 or length_b == 0:
            # An empty taste profile matches nothing. Returning 0 avoids dividing
            # by zero and is the honest answer: we simply do not know yet.
            return 0.0
        return float(np.dot(a, b) / (length_a * length_b))

    # ------------------------------------------------------------------ #
    # Learning from feedback (the heart of the feedback loop)
    # ------------------------------------------------------------------ #

    def update_from_feedback(
        self,
        item_vector: "InterestVector",
        reward: float,
        learning_rate: float = 0.15,
    ) -> dict[str, tuple[float, float]]:
        """
        Nudge this user's interests based on how they reacted to one item.

        THE IDEA:
        Every time you watch something to the end, the system thinks "ah, more of
        that". Every time you skip in the first second, it thinks "less of that".
        That is the feedback loop you have heard about. Here is the simplest
        honest version of it.

        reward is a single number we worked out from the user's behaviour:
            * a happy reward (towards +1) means they engaged: watched, liked.
            * a sad reward (towards -1) means they bailed: skipped quickly.

        For every topic the item is about, we move the user's weight a little in
        the direction of the reward. The size of the step is controlled by the
        learning_rate. A bigger learning rate means the feed reacts faster but
        also over-reacts to one-off clicks. A smaller one means it changes slowly
        and stays calmer.

        The update rule is:

            new_weight = old_weight + learning_rate * reward * item_topic_strength

        We multiply by item_topic_strength so that a video which is 90% science
        moves your science interest much more than a video that is only 10%
        science. The strongest signal comes from the clearest content.

        We return a small report of {topic: (before, after)} but only for the
        topics that actually moved, so the engine can print a child-readable
        sentence like "your interest in SCIENCE rose from 0.30 to 0.41".
        """
        changes: dict[str, tuple[float, float]] = {}

        for i, topic in enumerate(TOPICS):
            item_strength = item_vector.values[i]
            if item_strength == 0:
                # The item is not about this topic, so this topic learns nothing
                # from it. We skip it to keep the report tidy.
                continue

            before = float(self.values[i])
            step = learning_rate * reward * item_strength
            after = before + step

            # Keep weights inside a sensible range. Interests should not go
            # negative (you cannot dislike football "less than nothing" here) and
            # we cap the top so one obsession cannot run away to infinity.
            after = float(np.clip(after, 0.0, 1.0))

            self.values[i] = after
            if abs(after - before) > 1e-9:
                changes[topic] = (before, after)

        return changes

    # ------------------------------------------------------------------ #
    # Tidy printing
    # ------------------------------------------------------------------ #

    def __repr__(self) -> str:
        parts = [f"{t}={v:.2f}" for t, v in self.as_dict().items()]
        return "InterestVector(" + ", ".join(parts) + ")"
