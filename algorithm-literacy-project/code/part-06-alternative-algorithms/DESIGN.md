# Part 6: Eight Alternative Algorithms

**Design notes for a set of recommendation algorithms that optimise for healthier outcomes instead of pure engagement.**

> [SPECULATIVE] Everything in this document is a proof-of-concept design, not a deployed system. The algorithms run on a tiny synthetic catalogue with hand-set attributes (see `algorithms.py`). They are built to make one idea concrete and visible: an algorithm is a scoring formula, and changing the formula changes the feed. Whoever picks the formula is making a values choice wearing a maths costume. None of these has been tested on real children, real content, or at scale.

---

## How to read each algorithm

Every algorithm below is described with the same six sections.

1. **Objective function.** The scoring formula, written plainly. This is the heart of it. Read the maths as a sentence and you can hear what the algorithm values.
2. **Inputs.** What the algorithm needs to know about each item and about the child.
3. **Ranking logic.** How those inputs become an ordered feed.
4. **Advantages.** What it does well, honestly.
5. **Possible unintended consequences.** How it can go wrong, gamed, or drift. We are candid here on purpose.
6. **Ethical considerations.** The deeper questions of power, autonomy, and who decides.

A shared note on the maths: all per-item attributes are scored 0.0 to 1.0. Most algorithms rank greedily and re-score after each pick, so feed-aware goals such as "cap a topic" or "maximise variety" can actually bite. A hard age filter sits underneath all of them, because some rules should never be outvoted by a score.

---

## A shared honesty about the proxies

[INFERENCE] Real platforms predict things like "watch time" or "probability of a like" with large models trained on billions of interactions. Our toy attributes (`calmness`, `kindness`, `educational_value`, and so on) stand in for the outputs of such models. On a real system, each of those signals would itself be a noisy, contestable classifier with its own failure modes. So every algorithm below inherits a hidden dependency: it is only as fair and accurate as the classifiers feeding it. A "wellbeing" algorithm built on a bad "anxiety" detector is a bad algorithm with good intentions. Keep that in mind throughout.

---

## 1. Balanced Algorithm

Keeps engagement, but refuses to let any single topic swallow the whole feed.

**Objective function**

```
score(item) = 0.6 * engagement_match
            + 0.4 * quality
            - 0.35 * max(0, topic_count_so_far - (cap - 1))

where engagement_match = 0.5 * base_engagement + 0.5 * affinity
      cap = 2
```

**Inputs.** Per item: `base_engagement`, `affinity` (match to the child's existing tastes), `quality`, `topic`. Per feed: how many items of each topic are already chosen.

**Ranking logic.** Greedy. The penalty term grows every time a topic repeats past the cap, so the third and fourth football clip are taxed even for a football-mad child. The feed still feels personal but cannot collapse into one obsession.

**Advantages.** Preserves the "this feels like me" quality that makes a feed pleasant, while structurally preventing a single-topic spiral. It is a light touch: it does not tell a child what to like, only that variety is healthy. Easy to explain to a parent.

**Possible unintended consequences.** The cap is a blunt number. For a child whose genuine passion is one subject, a hard cap can feel like the feed fighting them, and they may simply leave for a platform that does not. The "balance" can also be cosmetic: three different topics that are all low quality is still a poor feed. And `affinity` is itself learned from past behaviour, so the algorithm can still entrench yesterday's preferences within the cap.

**Ethical considerations.** Who decides the cap, and what counts as a "topic"? Topic boundaries are a design choice that quietly shapes outcomes. Defining "news" and "football" as separate but lumping all "wellbeing" together is not neutral. Balance is a value, and imposing it, even gently, is still imposing.

---

## 2. Curiosity Algorithm

Rewards a gentle stretch just beyond what the child already watches.

**Objective function**

```
score(item) = 0.5 * novelty
            + 0.3 * quality
            + 0.2 * affinity
            - 0.15 * topic_count_so_far
```

**Inputs.** Per item: `novelty` (distance from the child's current interests), `quality`, `affinity`, `topic`. Per feed: topics already chosen.

**Ranking logic.** Greedy, with novelty dominant but a small affinity anchor so the stretch stays reachable rather than jarring. The damping term keeps the feed reaching outward instead of settling on one new thing.

**Advantages.** Directly counters the filter bubble. Novelty with a seatbelt: the affinity anchor means a child is nudged one comfortable step past their comfort zone, which is how curiosity actually grows. Can reintroduce serendipity, the pleasant surprise that pure-affinity systems erode.

**Possible unintended consequences.** "Novelty" is easy to game: anything weird is novel, and shock content is reliably novel. A naive novelty reward can surface the bizarre or the disturbing simply because it is unfamiliar. Constant stretch is also tiring; sometimes a child wants the comfort of the known, and a curiosity-maximiser can feel relentless. Novelty relative to a child's history can also mean "we have never shown you this", which is not the same as "this is good for you".

**Ethical considerations.** Curating what a child should be curious about is a soft form of steering. Done well it is education; done carelessly it is an adult's idea of "broadening horizons" imposed on a child who did not ask. The line between widening a world and managing a mind is thinner than it looks.

---

## 3. Learning Algorithm

Prioritises educational value and a sense of skill progression.

**Objective function**

```
score(item) = 0.6 * educational_value
            + 0.25 * quality
            + 0.15 * effort_reward
```

**Inputs.** Per item: `educational_value`, `quality`, `effort_reward` (does it ask the child to practise or make something?).

**Ranking logic.** Straight weighted sum, no feed-aware terms. Quality is kept in the mix so "educational" does not collapse into "dull", and `effort_reward` leans towards active learning over passive watching.

**Advantages.** Turns scroll time into something closer to study time without pretending to be a worksheet. The quality weight protects against the classic failure of educational content, which is being worthy but unwatchable. Could pair naturally with a school curriculum (see Part 9).

**Possible unintended consequences.** "Educational value" is one of the hardest things to score honestly, and a weak classifier rewards content that *looks* educational (a confident voice, a whiteboard, a list of "facts") over content that actually teaches. This is a direct route to surfacing confident misinformation. It can also make a leisure space feel like school, which children may resist, and resistance can push them to less supervised platforms.

**Ethical considerations.** Whose curriculum? Educational value is not culturally neutral. A learning feed encodes a view of what is worth knowing. There is also a quieter risk: optimising childhood for measurable "progression" can crowd out rest, play, and aimless wondering, which are not wasted time.

---

## 4. Wellbeing Algorithm

Protects calm. Penalises late-night, doomscroll, and anxiety-linked content. Rewards calm and uplifting content. Respects a session limit.

**Objective function**

```
score(item) = 0.4 * calmness
            + 0.3 * kindness
            + 0.2 * quality
            - 0.5 * anxiety_inducing
            + time_of_day_bonus
            - session_fatigue_penalty

time_of_day_bonus      = 0.4 * tod_fit + 0.3 * calmness   (late at night)
                       = 0.2 * tod_fit                      (otherwise)
session_fatigue_penalty = min(0.5, 0.02 * minutes_over_limit) * (1 - calmness)
```

**Inputs.** Per item: `calmness`, `kindness`, `quality`, `anxiety_inducing`, `tod_suitability` per time slot. Per child: `hour_of_day`, `minutes_in_session`, `session_limit_minutes`.

**Ranking logic.** Greedy. Two pieces are context-aware. Late at night the formula leans much harder on calm. Once the child passes their chosen session limit, a fatigue penalty grows and pulls the whole feed towards wind-down content. The demo shows the same child's feed shifting visibly calmer at 11pm and over the limit.

**Advantages.** [SPECULATIVE] Among the most promising in principle. It directly targets the side effects most associated with harm: late-night use, doomscrolling, and anxiety-linked content. The session limit is the child's or parent's own number, not the platform's, which keeps the control where it belongs.

**Possible unintended consequences.** This is the algorithm most at risk of becoming **paternalistic**. A feed that decides what a child is "allowed" to feel can deny them content they legitimately need: a sad song after a hard day, a serious documentary, news about a real crisis. "Calm" is not the same as "good", and an always-soothing feed can be infantilising. It is also gameable in both directions: content can be dressed in calm aesthetics while carrying harmful messages, and a child who wants intensity will learn to defeat or abandon the filter. Worst case, a clumsy "anxiety" classifier suppresses content about anxiety itself, cutting children off from help.

**Ethical considerations.** This algorithm makes a claim about what is good for a child's inner life, which is profound territory. Who defines wellbeing? A measure of "calm" can quietly encode "compliant and quiet". There is a real autonomy cost: protecting a child from all difficult feeling is also denying them the chance to learn to handle it. The session limit must be transparent and child-visible, never a hidden throttle, or it becomes manipulation dressed as care.

---

## 5. Growth Algorithm

Backs the goals the child has set for themselves, and the effort to reach them.

**Objective function**

```
score(item) = 0.55 * effective_alignment
            + 0.25 * effort_reward
            + 0.20 * quality

effective_alignment = goal_alignment           if item.topic in child's stated goals
                    = 0.3 * goal_alignment      otherwise
```

**Inputs.** Per item: `goal_alignment`, `effort_reward`, `quality`, `topic`. Per child: `stated_goals` (goals the child chose, not goals inferred for them).

**Ranking logic.** Weighted sum, but goal alignment only counts at full strength when the item's topic is one the child explicitly named as a goal. If the child set no goals, this algorithm has very little to say, which is the correct behaviour: it should not invent ambitions.

**Advantages.** Puts the child in the driver's seat. It optimises for *their* stated wants, not the platform's guess about them, which is a meaningful shift in power. It rewards effort and practice, supporting the satisfying loop of getting better at something a child actually chose.

**Possible unintended consequences.** Children's stated goals are fragile and easily shaped by what they have just seen, so "stated" goals can quietly be platform-suggested goals wearing the child's name. A relentless focus on self-improvement can also breed a joyless, productivity-obsessed relationship with leisure, and can amplify comparison and pressure. If goal-setting is gamified, children may set goals to please the system rather than themselves.

**Ethical considerations.** The integrity of "stated" is everything. The moment the platform starts nudging which goals a child sets, the autonomy this design promises becomes a polite fiction. There is also an equity question: children with supportive adults around them will set richer goals, so a goals-based feed can widen existing gaps unless paired with active support.

---

## 6. Healthy Childhood Algorithm

Age-appropriate, encourages offline and active prompts, family-positive.

**Objective function**

```
score(item) = 0.35 * quality
            + 0.25 * activity_prompt        (1 if it nudges the child offline, else 0)
            + 0.20 * family_positive        (1 if safe and pleasant with a parent, else 0)
            + 0.20 * calmness
            + age_comfort

age_comfort = min(0.15, 0.03 * (child_age - item_age_rating))
plus a hard filter: item_age_rating <= child_age
```

**Inputs.** Per item: `quality`, `activity_prompt`, `family_positive`, `calmness`, `age_rating`. Per child: `age`.

**Ranking logic.** Hard age filter first, then a weighted sum that rewards content comfortably inside the age band rather than right at its edge. The `activity_prompt` reward is the distinctive move: a feed that sometimes says "go outside, build something, kick a ball" scores well, which is the exact opposite of a feed engineered never to let a child leave.

**Advantages.** Directly rewards the feed for sending the child *off* the platform, which no engagement-driven system would ever do. Family-positive weighting makes co-viewing pleasant and supports the parent's role. The age-comfort term avoids surfacing content technically allowed but slightly too mature.

**Possible unintended consequences.** "Healthy childhood" and "family-positive" carry strong cultural assumptions about what a childhood and a family should look like, and a single definition can erase the variety of real families. Older children may find a heavily "wholesome" feed patronising and leave for less safe spaces. Activity prompts that no child acts on become empty virtue signalling that trains children to ignore them.

**Ethical considerations.** This is the most values-laden of the eight, because "healthy childhood" is contested terrain where reasonable adults disagree. Encoding one vision risks marginalising children whose home lives, cultures, or abilities do not fit the template. Age ratings themselves are coarse and culturally specific. The design must hold its definition of "healthy" lightly and make it visible and adjustable, not baked in as universal truth.

---

## 7. Kindness Algorithm

Lifts prosocial, supportive content. Cools outrage and cruelty.

**Objective function**

```
score(item) = 0.6 * kindness
            + 0.25 * quality
            - 0.4 * anxiety_inducing
```

**Inputs.** Per item: `kindness` (warmth, support, prosocial behaviour), `quality`, `anxiety_inducing` (here used as a proxy for outrage and cruelty bait).

**Ranking logic.** Simple weighted sum that promotes warmth and demotes the agitation that drives pile-ons and cruelty. Note what it deliberately does **not** do: it does not classify *opinions* as kind or unkind. It rewards a measured kindness signal and penalises an agitation signal.

**Advantages.** [INFERENCE] Targets a well-evidenced dynamic: outrage and conflict are unusually engaging, so engagement-optimised feeds tend to amplify them. A kindness-weighted feed pushes the other way, towards supportive and prosocial content, which may model better behaviour for children still learning how to treat people.

**Possible unintended consequences.** This is the algorithm whose failure mode is most politically charged. A blunt "kindness" classifier can mistake **honest disagreement, criticism, satire, or sad-but-true content for cruelty**, and quietly suppress it. That is a real harm: a feed that only ever shows agreement and comfort is a feed that cannot tell a child a hard truth, raise an injustice, or host a genuine debate. "Kindness" can decay into "niceness", and enforced niceness silences the legitimately angry, the grieving, and the dissenting. It is also gameable: cruelty wrapped in a sweet tone can pass, while blunt honesty gets penalised.

**Ethical considerations.** The core tension is between protecting children from cruelty and preserving their access to real disagreement, which they need in order to grow into capable citizens. Who labels content "kind"? Any such classifier carries the labellers' values and biases, and at scale that is a quiet form of viewpoint control. The safest version demotes clear cruelty and harassment while leaving robust, civil disagreement fully intact, and that line is genuinely hard to draw.

---

## 8. Diversity Algorithm

Chases the widest possible mix of topics, viewpoints, and creators.

**Objective function**

```
score(item) = 0.4 * quality
            + 0.3 * freshness(topic)
            + 0.2 * freshness(viewpoint)
            + 0.1 * freshness(creator)

freshness(value) = 1 / (1 + times that value already appears in the feed)
```

**Inputs.** Per item: `quality`, `topic`, `viewpoint`, `creator`. Per feed: the topics, viewpoints, and creators already chosen.

**Ranking logic.** Greedy and strongly feed-aware. Each new pick is rewarded for introducing a topic, viewpoint, or creator the feed does not yet contain, with the reward decaying as that value repeats. This is the one algorithm that cares about the *shape* of the whole feed more than any single item.

**Advantages.** The most direct antidote to filter bubbles and creator monopolies. It guarantees a child hears more than one voice and sees more than one angle, including counterpoints, which supports independent thinking. Spreads attention across many creators rather than concentrating it.

**Possible unintended consequences.** Variety for its own sake can feel scattered and rootless, and a child may never go deep enough on anything to develop real expertise or a sense of mastery. "Viewpoint diversity" can be weaponised into false balance, presenting fringe or harmful views as equal to well-supported ones simply to tick the variety box. Forced creator-spreading can also starve a genuinely excellent creator the child loves.

**Ethical considerations.** Diversity is not automatically good, and the hardest case is viewpoint diversity. Treating every viewpoint as equally worth surfacing can launder misinformation into a child's feed under the banner of "balance". A responsible version pursues diversity of quality content within bounds of accuracy and safety, which means someone must still decide what falls outside those bounds. There is no value-free way to define "a viewpoint", and that definitional power is where the real ethics live.

---

## The honest meta-point

Lay the eight objective functions side by side and a single lesson appears: **none of these is the "true" algorithm, because there is no value-free way to rank a child's feed.** Every formula encodes a choice about what childhood online should be for. The engagement baseline encodes one too; it just hides the choice behind the word "neutral".

The purpose of Part 6 is not to crown a winner. It is to make the choosing visible, so that children, parents, teachers, and engineers can argue about the values directly, in the open, instead of pretending the maths decided for them.

Run `python algorithms.py` to watch all eight rank the same catalogue and see the trade-offs in the comparison table.
