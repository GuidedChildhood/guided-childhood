"""
metrics.py
==========

Helper functions that measure what a finished feed actually looks like.

An algorithm picks items. These functions then ask honest questions about the
result: how varied is it, how much of it teaches you something, how calm is it,
and roughly how much it might pull at your attention.

We keep this file separate from algorithms.py on purpose. The thing that BUILDS
a feed and the thing that JUDGES a feed should not be the same code, or it is
too easy to fool yourself into thinking your feed is great.

Everything here is deliberately simple so a curious teenager can read it.
Standard library plus numpy only.

NOTE ON HONESTY: every number below is a toy proxy. "Engagement" here is a made
up score on synthetic data, not a real measurement of a real person. Real
wellbeing and real learning cannot be captured in one float. These metrics are
teaching tools, not truth.
"""

from __future__ import annotations

from collections import Counter
from typing import Iterable, List
import math

import numpy as np


# ---------------------------------------------------------------------------
# Diversity
# ---------------------------------------------------------------------------

def topic_diversity(items: Iterable) -> float:
    """
    How spread out is the feed across different topics?

    We use normalised Shannon entropy. The idea:
      - A feed that is all one topic has entropy 0 (no surprise, no variety).
      - A feed evenly split across many topics has entropy near 1.

    Returns a value between 0.0 (one topic) and 1.0 (perfectly even spread).
    """
    items = list(items)
    if len(items) <= 1:
        return 0.0

    counts = Counter(item.topic for item in items)
    total = sum(counts.values())
    # Shannon entropy in bits.
    entropy = 0.0
    for count in counts.values():
        p = count / total
        entropy -= p * math.log2(p)

    # The most diverse possible feed of this length has every item on its own
    # topic, giving log2(number of distinct slots). We normalise against the
    # smaller of (distinct topics seen) and (feed length) so a short feed is
    # not unfairly punished.
    max_entropy = math.log2(min(len(items), len(counts))) if len(counts) > 1 else 1.0
    if max_entropy == 0:
        return 0.0
    return entropy / max_entropy


def creator_diversity(items: Iterable) -> float:
    """
    What fraction of the feed comes from DISTINCT creators?

    1.0 means every item is from a different creator. 0.2 means one creator is
    dominating. A healthy feed usually wants this reasonably high so a single
    voice does not capture a child's whole attention.
    """
    items = list(items)
    if not items:
        return 0.0
    distinct = len({item.creator for item in items})
    return distinct / len(items)


def viewpoint_diversity(items: Iterable) -> float:
    """
    How many distinct 'viewpoints' (stances, angles, framings) appear?

    On real platforms this is the hardest thing to measure honestly. Here each
    synthetic item simply carries a viewpoint tag, and we report the spread the
    same way we do for topics. Treat this as illustrative only.
    """
    items = list(items)
    if len(items) <= 1:
        return 0.0
    counts = Counter(item.viewpoint for item in items)
    total = sum(counts.values())
    entropy = 0.0
    for count in counts.values():
        p = count / total
        entropy -= p * math.log2(p)
    max_entropy = math.log2(min(len(items), len(counts))) if len(counts) > 1 else 1.0
    if max_entropy == 0:
        return 0.0
    return entropy / max_entropy


# ---------------------------------------------------------------------------
# Educational share
# ---------------------------------------------------------------------------

def educational_share(items: Iterable) -> float:
    """
    Average educational value of the feed, on a 0 to 1 scale.

    This is the mean of each item's educational_value. A feed of pure
    entertainment lands near 0. A feed of well made explainers lands near 1.
    Most healthy feeds sit somewhere in the middle, because all-learning-all-the
    -time is not actually how childhood works.
    """
    items = list(items)
    if not items:
        return 0.0
    return float(np.mean([item.educational_value for item in items]))


# ---------------------------------------------------------------------------
# Wellbeing
# ---------------------------------------------------------------------------

def wellbeing_score(items: Iterable) -> float:
    """
    A rough, honest-about-its-limits wellbeing proxy for the whole feed.

    We reward calm and kindness, and we gently penalise anxiety-linked content.
    Each item contributes:
        calmness                  (higher is calmer)
      + kindness                  (higher is more prosocial)
      - anxiety_inducing          (higher is more agitating)

    The result is squashed into 0 to 1 so it reads like the other metrics.

    IMPORTANT: this is a teaching proxy. Real wellbeing depends on the child,
    the moment, and a hundred things no feed can see. A 'calm' feed is not
    automatically a 'good' feed. Sometimes a child needs to feel something.
    """
    items = list(items)
    if not items:
        return 0.0
    raw = []
    for item in items:
        raw.append(item.calmness + item.kindness - item.anxiety_inducing)
    mean_raw = float(np.mean(raw))
    # raw ranges roughly from -1 to +2; map that onto 0..1.
    return float(np.clip((mean_raw + 1.0) / 3.0, 0.0, 1.0))


def calmness_score(items: Iterable) -> float:
    """Average calmness of the feed, 0 to 1. Simpler cousin of wellbeing."""
    items = list(items)
    if not items:
        return 0.0
    return float(np.mean([item.calmness for item in items]))


def kindness_share(items: Iterable) -> float:
    """Average prosocial / kindness score of the feed, 0 to 1."""
    items = list(items)
    if not items:
        return 0.0
    return float(np.mean([item.kindness for item in items]))


# ---------------------------------------------------------------------------
# Engagement (the thing most real systems quietly optimise for)
# ---------------------------------------------------------------------------

def estimated_engagement(items: Iterable) -> float:
    """
    A toy estimate of how 'sticky' this feed would be, 0 to 1.

    On real platforms engagement is predicted by huge models. Here we fake it
    with a simple intuition: content that is high quality, novel, and a little
    bit activating tends to hold attention. We include a small pull from
    anxiety_inducing on purpose, because outrage and worry ARE engaging, and
    pretending otherwise would be dishonest. That uncomfortable fact is exactly
    why pure-engagement feeds drift the way they do.
    """
    items = list(items)
    if not items:
        return 0.0
    scores = []
    for item in items:
        s = (
            0.45 * item.quality
            + 0.25 * item.novelty
            + 0.20 * item.anxiety_inducing   # yes: agitation is engaging
            + 0.10 * item.kindness
        )
        scores.append(s)
    return float(np.clip(np.mean(scores), 0.0, 1.0))


# ---------------------------------------------------------------------------
# One-stop report
# ---------------------------------------------------------------------------

def feed_report(items: List) -> dict:
    """
    Bundle the headline metrics for one feed into a small dictionary.

    Used by the demo to build the side-by-side comparison table so a reader can
    SEE the trade-offs each algorithm makes.
    """
    return {
        "diversity": topic_diversity(items),
        "educational": educational_share(items),
        "calmness": calmness_score(items),
        "wellbeing": wellbeing_score(items),
        "kindness": kindness_share(items),
        "engagement": estimated_engagement(items),
    }
