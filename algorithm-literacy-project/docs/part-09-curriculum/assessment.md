# Assessment

Formative and summative assessment for the whole programme. A bank of 36 questions sorted by Key Stage and by Bloom level (recall, understand, apply, analyse, evaluate, create), plus a simple rubric for the end-of-unit project "Design your ideal feed".

Use the bank flexibly. Lower-level questions check that the core picture has landed. Higher-level questions are where real algorithm literacy shows. A confident answer to one analyse or evaluate question tells you more than ten recall answers.

Indicative answers are given for the recall and understand questions. For apply, analyse, evaluate, and create, look for the reasoning described, not a fixed word.

---

## How to use this for formative assessment

- **Exit tickets:** pick one understand or apply question, one sticky note per child, at the end of a lesson.
- **Cold-call warm-ups:** open the next lesson with one recall question to retrieve prior learning.
- **Spot the misconception:** if a child answers a recall question with one of the misconceptions in `teacher-guides.md`, you have found exactly what to reteach.

---

## KS1 (ages 5 to 7)

**Recall**
1. True or false: a feed shows everyone exactly the same thing. *(False. It is chosen for each person.)*
2. What does the robot waiter watch to decide what to bring you? *(Your face / your smile / what you like.)*

**Understand**
3. Why does your feed look different from your friend's feed? *(Because it learned from you, and you like different things.)*
4. If you keep smiling at one thing, what does the robot do? *(Brings you more of it.)*

**Apply**
5. Your plate is full of only one thing and you are bored. What can you do? *(Ask for, look for, or try something different.)*

**Create**
6. Draw the plate your robot would bring you, and one new thing you would add to it yourself.

---

## KS2 (ages 7 to 11)

**Recall**
7. What do we call the things you do that the feed watches? *(Signals.)*
8. What is the biggest signal a feed usually reads? *(How long you watch / watch time.)*
9. Name the two moves a feed makes. *(Gather a shortlist, then rank it.)*

**Understand**
10. Explain the feedback loop in your own words. *(What I do is a signal, signals change what I see, what I see changes what I do, round and round.)*
11. Why is watching something to the end like a "treat" for the feed, even if you did not mean it? *(The feed counts the watch as "more of this please", whether or not you meant it.)*
12. What is a filter bubble? *(When a feed narrows until you mostly see one kind of thing.)*

**Apply**
13. Your feed has gone all the same and samey. Name two actions that would widen it.
14. Here is a scoring rule: score = watch-time + likes. Card P has watch-time 5 and likes 2. Card Q has watch-time 3 and likes 6. Which ranks higher, and what are the scores? *(P = 7, Q = 9, so Q ranks higher.)*

**Analyse**
15. Two children used the same app and got very different feeds. Explain how that is possible if it is the same app.

**Evaluate**
16. "A narrow feed is always a bad thing." Do you agree? Give one case where it might be fine. *(Looking for cases like deliberately learning one skill.)*

**Create**
17. Invent your own scoring rule for ranking videos and explain why you chose it.

---

## KS3 (ages 11 to 14)

**Recall**
18. What is the difference between an explicit signal and an implicit signal? *(Explicit: you chose to do it, like a like. Implicit: you did it without deciding, like lingering.)*
19. Why is watch time called an "honest" signal? *(You can like something without meaning it, but your time spent watching is hard to fake.)*

**Understand**
20. Explain why content that provokes a strong reaction tends to spread further. *(Reactions are engagement; engagement is the rewarded signal; so reaction-provoking content spreads.)*
21. Explain why a feed "knows you" without reading your mind. *(It reads your behaviour, the signals, and infers from them. It does not see your thoughts.)*

**Apply**
22. You want to deliberately reset a feed that has narrowed. Describe three concrete actions you would take.
23. Apply the three check-before-you-share questions to this post: "URGENT, share before they take it down!" *(Is it true? Who gains? Am I fired up? Likely conclusion: pause and verify; urgency with no source is a red flag.)*

**Analyse**
24. A post is going viral. Explain why "it is spreading fast" and "it is true" are not the same thing.
25. Distinguish between a feed "holding your attention" and "helping you". Give an example of each.

**Evaluate**
26. Is it fair to call a recommendation algorithm "evil"? Argue using the idea of incentives. *(Looking for: it optimises for engagement because of the business model; that is an incentive, not malice. Reward nuance either way if reasoned.)*
27. Which is more useful for understanding your own feed: knowing what you tapped, or knowing how long you watched? Justify.

**Create**
28. Design a one-page guide that teaches a younger child how their feed works, using one clear analogy of your own.

---

## KS4 (ages 14 to 16)

**Recall**
29. Name the two stages of a recommendation pipeline. *(Retrieval, then ranking.)*
30. What is an objective function in the context of a feed? *(The thing the feed is told to maximise, usually a blend of engagement signals.)*

**Understand**
31. Explain the difference between exploration and exploitation in a recommender. *(Exploitation: more of what it knows you like. Exploration: trying new things to learn what else you might like.)*
32. Explain, with reference to measurement, why optimising a feed for "wellbeing" is harder than optimising for "watch time". *(Watch time is directly logged; wellbeing is a latent state, hard to measure, slow to appear, and easy to game.)*

**Apply**
33. A team wants to optimise a feed for "better sleep". Propose one signal they could realistically use, and one weakness of that signal.

**Analyse**
34. Explain how Goodhart's law would apply if a feed optimised purely for "quiz scores completed". *(The metric becomes the target; the feed floods trivially easy quizzes to inflate the score without real learning.)*

**Evaluate**
35. "No major platform has shipped a feed optimised for child wellbeing, therefore it is impossible." Evaluate this claim using Part 7. *(Strong answers separate "not commercially shipped under an ad model" from "technically impossible", and note that some outcomes are partially tractable at a cost.)*

**Create**
36. Design an objective function for a thirteen year old's feed that you would defend in public. State the metric, the trade-off it accepts, the way it could be gamed, and who you think should get to choose it.

---

## Summative project: "Design your ideal feed"

The end-of-unit project for KS3 and KS4. Students design a feed built around a human outcome, present the design, and are honest about its trade-offs. It directly assesses the whole spiral: they cannot do it well without understanding signals, the loop, the objective, bubbles, and the kinder-feed question.

**The brief (give to students):**
> Design the ideal feed for someone your age. Choose what your feed should optimise for. Decide what signals it would read, how it would avoid trapping people in a bubble, and what it would do differently from a feed built only to keep people watching. Be honest about the trade-offs: what does your feed give up, and how could it be gamed? Present it as a poster, a slide deck, a short written report, or a recorded pitch.

### Rubric

Mark each strand against the four levels. A strong project does not need to be technically advanced; it needs to be honest and well-reasoned.

| Strand | Emerging | Developing | Secure | Exceeding |
|---|---|---|---|---|
| **Understands the machine** | Describes a feed as "random" or "magic" | Mentions signals or ranking loosely | Correctly explains gather-then-rank and the feedback loop | Uses retrieval, ranking, and objective function accurately and in their own words |
| **Chooses an objective** | No clear goal for the feed | States a vague goal ("be nicer") | Picks a specific human outcome and says why | Picks an outcome and justifies it against Part 7's evidence and measurability |
| **Designs a metric** | No signal proposed | Names a signal but it does not fit the goal | Proposes a plausible, observable signal | Proposes a signal and openly names its noise or bias |
| **Handles bubbles** | Not addressed | Mentions variety vaguely | Builds in at least one concrete widening mechanism | Balances exploration and exploitation and explains the cost |
| **Honest about trade-offs** | Claims the design has no downsides | Notes one downside | Identifies the engagement trade-off and one way it could be gamed | Breaks their own design convincingly (Goodhart) and still defends it |
| **Communication** | Hard to follow | Clear in places | Clear, well-organised, audience-aware | Compelling, neutral about platforms, and genuinely usable |

**Headline marking principle:** reward honesty over polish. A modest design whose author can explain exactly how it would be gamed beats a glossy utopian feed that pretends to have no trade-offs. That principle is the entire point of the unit.
