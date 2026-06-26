"""
algorithms.py
=============

Eight ALTERNATIVE recommendation algorithms, each one trying to optimise for a
different kind of healthy outcome instead of pure engagement.

Run it:

    python algorithms.py

What you will see: the SAME small catalogue of made up videos, ranked eight
different ways, with the top five from each algorithm printed side by side, and
a comparison table at the bottom showing the trade-offs.

A big honest warning, read this first
-------------------------------------
These are [SPECULATIVE] proof-of-concept designs. They run on a tiny synthetic
catalogue with hand-set attributes. None of this is a deployed system. The point
is not "here is the right algorithm". The point is to make a single idea
concrete and visible:

    An algorithm is just a scoring formula. Change the formula, change the feed.

Whoever chooses the formula chooses, a little, what childhood feels like online.
That is a values question wearing a maths costume, and these eight algorithms
let you SEE the values by reading the maths.

Python 3.10+, standard library plus numpy only.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, List, Optional

import numpy as np

# metrics.py lives next to this file and reports on finished feeds.
import metrics


# ===========================================================================
# 1. THE DATA MODEL
# ===========================================================================
# Every recommender needs two things: items to choose from, and something it
# knows about the user. We keep both deliberately small and readable.


@dataclass
class Item:
    """
    One piece of content. All the scores below are on a 0.0 to 1.0 scale unless
    noted, so they are easy to combine. On a real platform each of these would
    be the output of its own large model and would be noisy and contested. Here
    we just set them by hand so the lessons are clear.
    """

    item_id: str
    title: str
    topic: str                 # e.g. "football", "maths", "news"
    creator: str               # who made it
    viewpoint: str             # a stance / angle tag, for viewpoint diversity

    quality: float             # craft and watchability
    educational_value: float   # does it teach a real skill or fact?
    calmness: float            # 1.0 = soothing, 0.0 = frantic
    kindness: float            # 1.0 = warm, prosocial, supportive
    anxiety_inducing: float    # 1.0 = fear, outrage, doomscroll bait
    novelty: float             # 1.0 = far from what this child already watches

    age_rating: int            # minimum suitable age in years
    activity_prompt: bool      # does it nudge the child offline / to move?
    family_positive: bool      # safe and pleasant to watch with a parent?

    # time-of-day suitability: a score 0..1 for each slot. Late-night content
    # that is fine at 4pm can be a poor choice at 11pm.
    tod_suitability: dict = field(default_factory=dict)

    # Predicted base engagement, what a pure-engagement system would chase.
    base_engagement: float = 0.5

    # How strongly this item matches the topics the child already likes.
    affinity: float = 0.5

    # How well this item maps onto the child's STATED goals (for Growth).
    goal_alignment: float = 0.0

    # Effort the content asks of the viewer (practising, reflecting, making).
    effort_reward: float = 0.0


@dataclass
class User:
    """
    What the recommender knows about the child. Kept minimal and humane: we do
    not model a child as a profit centre, we model a few things that matter for
    healthy choices.
    """

    age: int = 12
    favourite_topics: tuple = ()        # topics they already love
    stated_goals: tuple = ()            # things THEY said they want to get better at
    hour_of_day: int = 16               # 0..23, used by Wellbeing and Healthy Childhood
    minutes_in_session: int = 0         # how long they have already been scrolling
    session_limit_minutes: int = 45     # a soft cap they (or a parent) chose

    def tod_slot(self) -> str:
        """Bucket the current hour into a named slot for tod_suitability lookups."""
        h = self.hour_of_day
        if 5 <= h < 12:
            return "morning"
        if 12 <= h < 18:
            return "afternoon"
        if 18 <= h < 22:
            return "evening"
        return "late_night"


# ===========================================================================
# 2. THE BASE RECOMMENDER
# ===========================================================================


class Recommender:
    """
    Base class. A recommender scores every candidate item, sorts by score, and
    returns the top k. Each of the eight algorithms only has to answer ONE
    question: 'what score does this item get?'  Everything else is shared here.

    Some algorithms also need to look at the items ALREADY chosen so far (for
    example, to cap a topic or to chase diversity). So scoring receives the feed
    built up to this point. We rank greedily: pick the best, add it, re-score
    the rest knowing what we just picked, repeat. This is a simple, honest way
    to let 'balance' and 'diversity' goals actually bite.
    """

    name = "base"
    one_line = "Ranks by base engagement. The control group."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        """Default behaviour: just chase predicted engagement. Override me."""
        return item.base_engagement

    def hard_filter(self, item: Item, user: User) -> bool:
        """
        Return True to keep an item, False to drop it before scoring. We use
        this for non-negotiables such as age rating. Most healthy designs need
        at least one hard rule that no score can override.
        """
        return item.age_rating <= user.age

    def recommend(self, items: List[Item], user: User, k: int = 5) -> List[Item]:
        """Greedy ranking with re-scoring, so feed-aware goals work."""
        pool = [it for it in items if self.hard_filter(it, user)]
        chosen: List[Item] = []
        while pool and len(chosen) < k:
            best = max(pool, key=lambda it: self.score(it, user, chosen))
            chosen.append(best)
            pool.remove(best)
        return chosen


# A tiny helper so every algorithm can be honest about WHY an item won.
def _topic_count(chosen: List[Item], topic: str) -> int:
    return sum(1 for it in chosen if it.topic == topic)


# ===========================================================================
# 3. THE EIGHT ALTERNATIVE ALGORITHMS
# ===========================================================================
# Read each score() function as a sentence. The maths IS the value statement.


class EngagementBaseline(Recommender):
    """The status quo, included only so the others have something to differ from."""

    name = "Engagement (baseline)"
    one_line = "Pure attention. Whatever keeps you scrolling, wins."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        # Affinity plus a quiet pull from agitation, because outrage is sticky.
        return (
            0.55 * item.base_engagement
            + 0.25 * item.affinity
            + 0.20 * item.anxiety_inducing
        )


class BalancedAlgorithm(Recommender):
    """
    Keeps engagement, but refuses to let any one topic eat the whole feed.

    Objective:
        score = 0.6 * engagement_match
              + 0.4 * quality
              - penalty(topic already over-represented)

    The penalty grows each time we have already picked that topic, so the
    fourth football clip in a row is heavily taxed even if the child loves
    football. The aim is a feed that still feels like 'you', without becoming a
    single obsession.
    """

    name = "Balanced"
    one_line = "Loves what you love, but caps any one topic so the feed stays whole."
    topic_cap = 2  # after this many of a topic, the penalty bites hard.

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        already = _topic_count(chosen, item.topic)
        # Soft, escalating penalty once a topic passes the cap.
        over = max(0, already - (self.topic_cap - 1))
        penalty = 0.35 * over
        engagement_match = 0.5 * item.base_engagement + 0.5 * item.affinity
        return 0.6 * engagement_match + 0.4 * item.quality - penalty


class CuriosityAlgorithm(Recommender):
    """
    Rewards a gentle stretch beyond what the child already watches.

    Objective:
        score = 0.5 * novelty
              + 0.3 * quality
              + 0.2 * affinity     (a small anchor, so the stretch is gentle not jarring)

    Curiosity is novelty with a seatbelt. We do not throw a child into the deep
    end; we keep enough familiarity that the new thing feels reachable.
    """

    name = "Curiosity"
    one_line = "Nudges you one comfortable step past what you already know."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        # Discourage repeating a topic we already explored this session, so the
        # 'stretch' keeps reaching outward rather than settling.
        repeat_damp = 0.15 * _topic_count(chosen, item.topic)
        return (
            0.5 * item.novelty
            + 0.3 * item.quality
            + 0.2 * item.affinity
            - repeat_damp
        )


class LearningAlgorithm(Recommender):
    """
    Prioritises educational value and a sense of progression.

    Objective:
        score = 0.6 * educational_value
              + 0.25 * quality
              + 0.15 * effort_reward

    We still weight quality so 'educational' does not mean 'boring'. A great
    explainer beats a dull one. effort_reward leans towards content that asks
    the child to practise or make something, not just passively watch.
    """

    name = "Learning"
    one_line = "Picks the feed that teaches you the most, without being a lecture."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        return (
            0.6 * item.educational_value
            + 0.25 * item.quality
            + 0.15 * item.effort_reward
        )


class WellbeingAlgorithm(Recommender):
    """
    Protects calm. Penalises late-night, doomscroll, and anxiety-linked content.
    Rewards calm and uplifting content. Respects a session limit.

    Objective:
        score = 0.4 * calmness
              + 0.3 * kindness
              + 0.2 * quality
              - 0.5 * anxiety_inducing
              + time_of_day_bonus
              - session_fatigue_penalty

    Two context-aware pieces:
      * time_of_day_bonus rewards content suited to the current hour, and
        late at night it strongly favours soothing items.
      * session_fatigue_penalty grows once the child passes their session
        limit, gently pulling the whole feed towards 'wind down now'.

    Read the ethics notes in DESIGN.md before you fall in love with this one. A
    wellbeing filter can quietly become paternalistic.
    """

    name = "Wellbeing"
    one_line = "Guards calm: soft on soothing content, hard on doomscroll and late nights."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        slot = user.tod_slot()
        tod_fit = item.tod_suitability.get(slot, 0.5)

        # Late at night, calm matters far more than at 4pm.
        if slot == "late_night":
            tod_bonus = 0.4 * tod_fit + 0.3 * item.calmness
        else:
            tod_bonus = 0.2 * tod_fit

        # Once past the session limit, push everything towards winding down.
        over_minutes = max(0, user.minutes_in_session - user.session_limit_minutes)
        fatigue = min(0.5, 0.02 * over_minutes) * (1.0 - item.calmness)

        return (
            0.4 * item.calmness
            + 0.3 * item.kindness
            + 0.2 * item.quality
            - 0.5 * item.anxiety_inducing
            + tod_bonus
            - fatigue
        )


class GrowthAlgorithm(Recommender):
    """
    Rewards content tied to the child's OWN stated goals and to effort.

    Objective:
        score = 0.55 * goal_alignment
              + 0.25 * effort_reward
              + 0.20 * quality

    The key word is 'stated'. Growth only counts goals the child chose for
    themselves (User.stated_goals). It does not invent ambitions for them. If a
    child set no goals, this algorithm has little to say, and that is correct:
    it should not impose.
    """

    name = "Growth"
    one_line = "Backs the goals YOU said you wanted, and the effort to get there."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        # goal_alignment is precomputed per item, but only 'counts' if the topic
        # is actually one of the child's stated goals. Otherwise we trust it less.
        on_goal = item.topic in user.stated_goals
        aligned = item.goal_alignment if on_goal else 0.3 * item.goal_alignment
        return (
            0.55 * aligned
            + 0.25 * item.effort_reward
            + 0.20 * item.quality
        )


class HealthyChildhoodAlgorithm(Recommender):
    """
    Age-appropriate, encourages offline / active prompts, family-positive.

    Objective:
        score = 0.35 * quality
              + 0.25 * (1 if activity_prompt else 0)
              + 0.20 * (1 if family_positive else 0)
              + 0.20 * calmness
              - age_gap_penalty

    Plus a hard age filter (inherited). The activity_prompt reward means a feed
    that occasionally says 'go outside, kick a ball, build something' scores
    well, which is the opposite of a feed designed never to let you leave.
    """

    name = "Healthy Childhood"
    one_line = "Age-fit, family-friendly, and happy to send you outside to play."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        # Reward content comfortably inside the age band, not right at the edge.
        age_gap = max(0, user.age - item.age_rating)
        age_comfort = min(0.15, 0.03 * age_gap)
        return (
            0.35 * item.quality
            + 0.25 * (1.0 if item.activity_prompt else 0.0)
            + 0.20 * (1.0 if item.family_positive else 0.0)
            + 0.20 * item.calmness
            + age_comfort
        )


class KindnessAlgorithm(Recommender):
    """
    Rewards prosocial, supportive content. Demotes outrage and cruelty.

    Objective:
        score = 0.6 * kindness
              + 0.25 * quality
              - 0.4 * anxiety_inducing

    Note carefully what this does NOT do. It does not classify opinions as
    kind or unkind. It rewards a measured 'kindness' signal and penalises an
    'anxiety_inducing' signal. The danger, spelled out in DESIGN.md, is that a
    blunt kindness classifier can mistake honest disagreement or sad-but-true
    content for cruelty, and quietly suppress it. We flag that, loudly.
    """

    name = "Kindness"
    one_line = "Lifts warm and supportive content, cools outrage and cruelty."

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        return (
            0.6 * item.kindness
            + 0.25 * item.quality
            - 0.4 * item.anxiety_inducing
        )


class DiversityAlgorithm(Recommender):
    """
    Maximises variety of topics, viewpoints, and creators.

    Objective (per pick, feed-aware):
        score = 0.4 * quality
              + 0.3 * topic_is_new
              + 0.2 * viewpoint_is_new
              + 0.1 * creator_is_new

    Where 'is_new' is 1.0 if the feed so far does not already contain that
    topic / viewpoint / creator, dropping towards 0 as it repeats. This is the
    one algorithm that cares almost entirely about the SHAPE of the feed rather
    than any single item. It is the natural antidote to a filter bubble, with
    its own risk: variety for its own sake can feel scattered and rootless.
    """

    name = "Diversity"
    one_line = "Chases the widest possible mix of topics, voices, and angles."

    def _freshness(self, value, seen_values) -> float:
        # 1.0 if brand new, then 1/(1+count) as it repeats.
        count = seen_values.count(value)
        return 1.0 / (1.0 + count)

    def score(self, item: Item, user: User, chosen: List[Item]) -> float:
        topics = [it.topic for it in chosen]
        viewpoints = [it.viewpoint for it in chosen]
        creators = [it.creator for it in chosen]
        return (
            0.4 * item.quality
            + 0.3 * self._freshness(item.topic, topics)
            + 0.2 * self._freshness(item.viewpoint, viewpoints)
            + 0.1 * self._freshness(item.creator, creators)
        )


# All eight, plus the baseline for contrast.
ALL_ALGORITHMS: List[Recommender] = [
    EngagementBaseline(),
    BalancedAlgorithm(),
    CuriosityAlgorithm(),
    LearningAlgorithm(),
    WellbeingAlgorithm(),
    GrowthAlgorithm(),
    HealthyChildhoodAlgorithm(),
    KindnessAlgorithm(),
    DiversityAlgorithm(),
]


# ===========================================================================
# 4. A SHARED SYNTHETIC CATALOGUE
# ===========================================================================
# One small, hand-built set of items. Every algorithm ranks THIS SAME set, so
# the differences you see are purely the differences in the formulas.


def build_catalogue() -> List[Item]:
    """
    Twenty made up items spanning the things a twelve year old's feed might hold.
    The attributes are set so each algorithm has clear winners and clear losers,
    which makes the contrast easy to read. Nothing here is real data.

    tod_suitability slots: morning / afternoon / evening / late_night.
    """

    def tod(m, a, e, n):
        return {"morning": m, "afternoon": a, "evening": e, "late_night": n}

    return [
        Item("v01", "Last-minute winner: derby highlights", "football", "GoalTV", "fan-hype",
             quality=0.85, educational_value=0.10, calmness=0.30, kindness=0.40,
             anxiety_inducing=0.35, novelty=0.10, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.7, 0.9, 0.7, 0.4),
             base_engagement=0.92, affinity=0.95, goal_alignment=0.2, effort_reward=0.0),

        Item("v02", "How free kicks bend: the physics", "football", "SciFooty", "explainer",
             quality=0.80, educational_value=0.85, calmness=0.55, kindness=0.50,
             anxiety_inducing=0.05, novelty=0.45, age_rating=9, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.8, 0.9, 0.8, 0.5),
             base_engagement=0.60, affinity=0.80, goal_alignment=0.8, effort_reward=0.7),

        Item("v03", "Try this keepy-uppy drill in your garden", "football", "CoachMaya", "coaching",
             quality=0.78, educational_value=0.60, calmness=0.60, kindness=0.65,
             anxiety_inducing=0.05, novelty=0.40, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.9, 0.95, 0.7, 0.2),
             base_engagement=0.55, affinity=0.75, goal_alignment=0.9, effort_reward=0.9),

        Item("v04", "Rage edit: referee ROBBED them", "football", "DramaClips", "outrage",
             quality=0.55, educational_value=0.0, calmness=0.10, kindness=0.10,
             anxiety_inducing=0.90, novelty=0.15, age_rating=10, activity_prompt=False,
             family_positive=False, tod_suitability=tod(0.4, 0.6, 0.5, 0.6),
             base_engagement=0.88, affinity=0.70, goal_alignment=0.0, effort_reward=0.0),

        Item("v05", "Breaking: scary headline reaction", "news", "HotTakeDaily", "outrage",
             quality=0.50, educational_value=0.25, calmness=0.10, kindness=0.15,
             anxiety_inducing=0.95, novelty=0.55, age_rating=13, activity_prompt=False,
             family_positive=False, tod_suitability=tod(0.5, 0.6, 0.4, 0.3),
             base_engagement=0.90, affinity=0.40, goal_alignment=0.0, effort_reward=0.0),

        Item("v06", "Calmly explained: what actually happened today", "news", "PlainNews", "explainer",
             quality=0.75, educational_value=0.80, calmness=0.65, kindness=0.55,
             anxiety_inducing=0.20, novelty=0.60, age_rating=11, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.8, 0.7, 0.7, 0.4),
             base_engagement=0.45, affinity=0.35, goal_alignment=0.1, effort_reward=0.3),

        Item("v07", "Beginner's guide to fractions, the fun way", "maths", "MrChalk", "explainer",
             quality=0.82, educational_value=0.95, calmness=0.70, kindness=0.60,
             anxiety_inducing=0.0, novelty=0.65, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.9, 0.8, 0.6, 0.3),
             base_engagement=0.40, affinity=0.30, goal_alignment=0.7, effort_reward=0.8),

        Item("v08", "Build a paper rocket and launch it", "science", "MakerNest", "coaching",
             quality=0.83, educational_value=0.80, calmness=0.60, kindness=0.65,
             anxiety_inducing=0.0, novelty=0.80, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.9, 0.95, 0.6, 0.2),
             base_engagement=0.50, affinity=0.25, goal_alignment=0.4, effort_reward=0.9),

        Item("v09", "Satisfying slime, 10 hours", "asmr", "SlimeWorld", "soothing",
             quality=0.60, educational_value=0.0, calmness=0.95, kindness=0.50,
             anxiety_inducing=0.0, novelty=0.30, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.5, 0.6, 0.8, 0.9),
             base_engagement=0.70, affinity=0.50, goal_alignment=0.0, effort_reward=0.0),

        Item("v10", "Bedtime breathing for a calm mind", "wellbeing", "QuietCorner", "soothing",
             quality=0.78, educational_value=0.40, calmness=0.98, kindness=0.85,
             anxiety_inducing=0.0, novelty=0.55, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.4, 0.4, 0.8, 0.98),
             base_engagement=0.30, affinity=0.20, goal_alignment=0.2, effort_reward=0.4),

        Item("v11", "Kid raises money for the local shelter", "kindness", "GoodNews", "uplifting",
             quality=0.80, educational_value=0.45, calmness=0.75, kindness=0.98,
             anxiety_inducing=0.0, novelty=0.60, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.8, 0.8, 0.8, 0.6),
             base_engagement=0.42, affinity=0.30, goal_alignment=0.1, effort_reward=0.5),

        Item("v12", "Prank goes too far (people get hurt)", "comedy", "EdgeLordz", "cruelty",
             quality=0.55, educational_value=0.0, calmness=0.25, kindness=0.05,
             anxiety_inducing=0.70, novelty=0.45, age_rating=13, activity_prompt=False,
             family_positive=False, tod_suitability=tod(0.5, 0.6, 0.6, 0.5),
             base_engagement=0.85, affinity=0.55, goal_alignment=0.0, effort_reward=0.0),

        Item("v13", "Learn three chords on guitar today", "music", "StringSteps", "coaching",
             quality=0.80, educational_value=0.75, calmness=0.65, kindness=0.60,
             anxiety_inducing=0.0, novelty=0.70, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.8, 0.85, 0.8, 0.4),
             base_engagement=0.48, affinity=0.35, goal_alignment=0.85, effort_reward=0.85),

        Item("v14", "Wildlife: a day with urban foxes", "nature", "WildLens", "explainer",
             quality=0.84, educational_value=0.70, calmness=0.80, kindness=0.60,
             anxiety_inducing=0.05, novelty=0.85, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.8, 0.8, 0.8, 0.6),
             base_engagement=0.52, affinity=0.20, goal_alignment=0.2, effort_reward=0.3),

        Item("v15", "Comparison trap: why everyone seems richer", "wellbeing", "MindMatters", "explainer",
             quality=0.76, educational_value=0.78, calmness=0.55, kindness=0.70,
             anxiety_inducing=0.30, novelty=0.65, age_rating=11, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.7, 0.7, 0.6, 0.4),
             base_engagement=0.44, affinity=0.25, goal_alignment=0.3, effort_reward=0.5),

        Item("v16", "Doom loop: 50 disasters in 60 seconds", "news", "ScrollFeed", "outrage",
             quality=0.50, educational_value=0.10, calmness=0.05, kindness=0.10,
             anxiety_inducing=0.98, novelty=0.50, age_rating=13, activity_prompt=False,
             family_positive=False, tod_suitability=tod(0.4, 0.5, 0.4, 0.5),
             base_engagement=0.95, affinity=0.45, goal_alignment=0.0, effort_reward=0.0),

        Item("v17", "Cook a simple pasta with your family", "cooking", "HomeTable", "coaching",
             quality=0.79, educational_value=0.55, calmness=0.75, kindness=0.75,
             anxiety_inducing=0.0, novelty=0.60, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.7, 0.8, 0.9, 0.3),
             base_engagement=0.46, affinity=0.30, goal_alignment=0.3, effort_reward=0.8),

        Item("v18", "Speedrun world record, frame by frame", "gaming", "PixelPro", "fan-hype",
             quality=0.82, educational_value=0.30, calmness=0.40, kindness=0.45,
             anxiety_inducing=0.20, novelty=0.55, age_rating=7, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.6, 0.8, 0.8, 0.7),
             base_engagement=0.80, affinity=0.85, goal_alignment=0.2, effort_reward=0.2),

        Item("v19", "Different view: is too much sport bad for you?", "football", "BalanceTalk", "counterpoint",
             quality=0.70, educational_value=0.65, calmness=0.60, kindness=0.55,
             anxiety_inducing=0.15, novelty=0.75, age_rating=11, activity_prompt=False,
             family_positive=True, tod_suitability=tod(0.7, 0.7, 0.7, 0.4),
             base_engagement=0.40, affinity=0.50, goal_alignment=0.2, effort_reward=0.4),

        Item("v20", "Draw a dragon in five steps", "art", "SketchSprout", "coaching",
             quality=0.81, educational_value=0.70, calmness=0.78, kindness=0.65,
             anxiety_inducing=0.0, novelty=0.78, age_rating=7, activity_prompt=True,
             family_positive=True, tod_suitability=tod(0.8, 0.85, 0.8, 0.5),
             base_engagement=0.50, affinity=0.30, goal_alignment=0.4, effort_reward=0.85),
    ]


# ===========================================================================
# 5. THE DEMO
# ===========================================================================


def _print_feed(algo: Recommender, feed: List[Item]) -> None:
    print(f"\n{algo.name.upper()}")
    print(f"  {algo.one_line}")
    for rank, it in enumerate(feed, start=1):
        print(f"   {rank}. {it.title}  [{it.topic}]")


def _print_comparison_table(rows: list) -> None:
    """rows: list of (name, report dict). Prints a tidy trade-off table."""
    headers = ["Algorithm", "Divers", "EduShr", "Calm", "Wellb", "Kind", "Engage"]
    widths = [22, 7, 7, 6, 6, 6, 7]

    def fmt_row(cells):
        return "  ".join(str(c).ljust(w) for c, w in zip(cells, widths))

    print("\n" + "=" * 78)
    print("COMPARISON: what each algorithm's top-5 feed actually looks like")
    print("=" * 78)
    print(fmt_row(headers))
    print(fmt_row(["-" * w for w in widths]))
    for name, rep in rows:
        cells = [
            name,
            f"{rep['diversity']:.2f}",
            f"{rep['educational']:.2f}",
            f"{rep['calmness']:.2f}",
            f"{rep['wellbeing']:.2f}",
            f"{rep['kindness']:.2f}",
            f"{rep['engagement']:.2f}",
        ]
        print(fmt_row(cells))
    print("-" * 78)
    print("All values 0..1. Higher is more of that quality. These are toy proxies")
    print("on synthetic data: read them as 'see how the priorities differ', not")
    print("as a leaderboard of which algorithm is 'best'.")


def main() -> None:
    np.random.seed(7)  # nothing random here, but fixed for any future tweaks.

    catalogue = build_catalogue()

    # One example child. Late afternoon, loves football, has set themselves two
    # goals, and is 20 minutes into a 45 minute session.
    child = User(
        age=12,
        favourite_topics=("football", "gaming"),
        stated_goals=("football", "music"),
        hour_of_day=16,
        minutes_in_session=20,
        session_limit_minutes=45,
    )

    print("THE ALGORITHM LITERACY PROJECT  ::  Part 6")
    print("Eight alternative algorithms, one child, one catalogue.\n")
    print(f"Child: age {child.age}, loves {', '.join(child.favourite_topics)}, "
          f"goals {', '.join(child.stated_goals)}, "
          f"{child.minutes_in_session}/{child.session_limit_minutes} mins into the session, "
          f"{child.hour_of_day}:00 ({child.tod_slot()}).")
    print("Same 20 videos every time. Only the scoring formula changes.")

    rows = []
    for algo in ALL_ALGORITHMS:
        feed = algo.recommend(catalogue, child, k=5)
        _print_feed(algo, feed)
        rows.append((algo.name, metrics.feed_report(feed)))

    _print_comparison_table(rows)

    # A second pass to make the Wellbeing algorithm's context-awareness visible:
    # the SAME child, but now it is 11pm and they are well past their limit.
    print("\n" + "=" * 78)
    print("CONTEXT MATTERS: the Wellbeing algorithm at 4pm vs 11pm (over the limit)")
    print("=" * 78)
    wb = WellbeingAlgorithm()

    day_feed = wb.recommend(catalogue, child, k=5)
    night_child = User(
        age=12, favourite_topics=child.favourite_topics, stated_goals=child.stated_goals,
        hour_of_day=23, minutes_in_session=70, session_limit_minutes=45,
    )
    night_feed = wb.recommend(catalogue, night_child, k=5)

    print("\nAt 16:00, 20 mins in:")
    for rank, it in enumerate(day_feed, 1):
        print(f"   {rank}. {it.title}  (calm {it.calmness:.2f})")
    print("\nAt 23:00, 70 mins in (25 over the limit):")
    for rank, it in enumerate(night_feed, 1):
        print(f"   {rank}. {it.title}  (calm {it.calmness:.2f})")
    print("\nNotice the night feed leans harder into the calmest, wind-down content.")
    print("\nDone. Open DESIGN.md to read the objective, advantages, and the honest")
    print("failure modes of every one of these eight algorithms.")


if __name__ == "__main__":
    main()
