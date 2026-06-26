# For Teachers

A ready-to-use guide for teaching how recommendation feeds work, at any key stage. It gives you the framing, the curriculum links, three discussion prompts, the misconceptions to head off, and the science you need to feel confident at the front of the room.

## The framing that works in a classroom

Open with a stance, not a scare. The line that sets the right tone:

> "We are not here to decide whether apps are good or bad. We are here to understand how they work, so you are the one in charge of your feed instead of the other way round."

This does three useful things at once. It signals neutrality, so the phone-loving and the phone-sceptical pupils both lean in. It reframes the topic from morality to mechanism, which is far easier to teach and assess. And it promises agency, which is what keeps a class of teenagers from rolling their eyes at an adult talking about their apps.

Then teach the one true picture, sized to the class. Every age file in this folder builds the same core model:

1. **A feed is chosen for you, not random.** Everyone's is different by design.
2. **It learns from signals**, above all **how long you watch**.
3. **Gather, then rank.** It pulls a shortlist of candidates, then orders them best-guess-first.
4. **A feedback loop.** What you do changes what you see, which changes what you do.
5. **It optimises for engagement**, so keeping you watching is not the same as helping you.
6. **Exploration vs exploitation**, and how feeds narrow into filter bubbles.
7. **You have power**: search, "not interested", who you follow, and when you stop.

Pick the running analogy that fits your class: robot waiter (Y2-3), the accidentally trained puppy (Y4-5), the DJ reading the room (Y6-7), the self-rearranging vending machine (Y8-9), and near-real engineering with retrieval and ranking (Y10-12). The analogies are designed to hand up cleanly, so a child taught the puppy at nine is not contradicted by the vending machine at thirteen.

## A simple lesson arc (one hour)

- **Hook (10 min):** The feed swap. Two volunteers describe their feeds aloud. The class predicts why they differ. Lands "chosen for you" instantly.
- **Build (20 min):** Teach gather-then-rank and signals using the age-appropriate analogy. Emphasise watch time as the heaviest signal.
- **Investigate (15 min):** The five-screenshot audit (below), discussed in pairs.
- **Empower (15 min):** Pupils each write down two deliberate signals they will send their own feed this week, and one moment they will practise stopping.

## Links to the curriculum (Part 9)

This unit maps onto several existing strands. Cross-reference the detailed mapping and lesson plans in **Part 9 (docs/part-09-curriculum)**; in summary:

- **Computing:** algorithms as ordered processes, sorting and ranking, the idea that data drives behaviour, and an honest age-appropriate sense of how recommender pipelines work (retrieval and ranking) at upper key stages.
- **PSHE and RSHE (Online relationships, Internet safety and harms):** how content is targeted, why something is shown to you, recognising persuasive design, and looking after wellbeing online. This unit gives the *mechanism* behind those statutory aims, which most resources skip.
- **Citizenship / Media literacy:** filter bubbles, echo chambers, why two people see different information, and the civic consequences of personalised feeds.
- **Maths (upper KS):** probability and prediction, proxies versus true measures, and an optional extension on exploration/exploitation as a decision-under-uncertainty problem.

(For the full standards alignment and assessment rubric, see Part 9.)

## Three discussion prompts

Designed to provoke real thinking, not a "correct answer". All work from Year 6 upward; the first two suit younger classes too.

1. **"The app is trying to keep you watching. Is that the same as helping you? When are they the same, and when do they split apart?"** Pushes pupils to find the engagement/wellbeing gap themselves rather than be told it. Expect strong examples from their own late-night experience.

2. **"You train your feed every day without meaning to. What was the last 'accidental' signal you sent, and what would change if you sent signals on purpose instead?"** Moves the class from passive to active framing and makes the feedback loop personal.

3. **"If a feed only ever shows you more of what you already like, what do you stop seeing, and why might that matter beyond just being boring?"** Opens filter bubbles, range, and the civic dimension, without lecturing. Good bridge to citizenship.

## Common misconceptions to correct

- **"The feed is random / shows everyone the same thing."** No. It is individually assembled. The feed swap demolishes this in two minutes.
- **"It only learns from what I like or comment on."** No. The dominant signal is usually passive: how long you watch and whether you finish. You train it just by lingering. This is the single most important correction to make, because it reframes responsibility.
- **"The algorithm wants to make me unhappy / is out to get me."** No. It does not want anything. It optimises a number, usually engagement. Harm is a side effect of an indifferent optimiser, not a goal. This correction lowers anxiety and raises accuracy at once.
- **"Liking things is how you control your feed."** Partly. The stronger levers are watch time, search, follows and when you stop. Teach the powerful levers, not just the obvious button.
- **"A filter bubble means someone is hiding things from you."** Not deliberately. It is an emergent result of the system favouring more-of-the-same (exploitation). No censor required.
- **"Understanding this means I should quit social media."** Not the message. The goal is fluent, deliberate use. Literacy, not abstinence, and certainly not fear.

## A classroom activity you can run tomorrow

**The five-screenshot audit.** Pupils screenshot the first five items in their most-used feed (or describe them, if devices are not allowed). In pairs they categorise each: *chosen because I searched it, because I watched similar, because a friend engaged, or no idea.* Then they answer two questions: *Is this making me feel good or just keeping me here?* and *What is one deliberate thing I could do to improve this feed?* It makes every abstract concept in this unit concrete, personal and theirs, in about fifteen minutes. Pair it with the empowerment close so pupils leave with intent, not just insight.

## The science in one paragraph

A recommendation feed is a personalised ranking system. Because the catalogue is far too large to score in full, the system first retrieves a shortlist of plausible candidates (candidate generation), then a ranking model predicts the probability of several engagement outcomes for each, watching, finishing, liking, returning, and orders the feed by a weighted combination of those predictions. Watch time tends to dominate because it is abundant, honest and hard to fake. The model optimises an objective function centred on engagement, which is a proxy for value rather than value itself: usually they align, but when they diverge the system still maximises engagement with great consistency. Every interaction becomes training data, forming a feedback loop that personalises rapidly and, when it over-favours exploitation over exploration, can narrow into a filter bubble. There is no malice in any of this; it is incentives and optimisation operating exactly as designed, which is exactly why teaching pupils the mechanism, rather than warning them off, is what genuinely protects them.
