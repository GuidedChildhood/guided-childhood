# TikTok

TikTok is widely treated as the strongest short-video recommender, yet it is one of the least formally documented. ByteDance (TikTok's parent) has published its real-time recommendation infrastructure (Monolith), and press reporting has described an internal document, but the live ranking model is not public. So this file leans more heavily on `[INFERENCE]` than the YouTube one, and says so throughout.

> ### What we know vs what we infer
>
> **We know (published or reported):** ByteDance published **Monolith** (arXiv:2209.07663), a real-time recommendation system built around collisionless embedding tables and online (near real-time) training. Press reporting (The New York Times, 2021) described an internal document in which TikTok's recommendation objective roughly combined likes, comments, watch time, and plays via a simple formula.
>
> **We infer:** That the For You feed is a real-time, multi-task ranking system over a two-stage retrieve-then-rank pipeline, that completion rate and replays are heavily weighted, and that it adapts within a single session. None of the exact weights, model architecture, or features are public.

---

## What signals are collected?

`[INFERENCE]` The dominant and most distinctive signal is **watch behaviour on full-screen autoplay video**: how long you watch each clip, whether you finish it, whether you replay it, and whether you swipe away early. Because every clip plays automatically and fills the screen, TikTok gets a clean, high-volume implicit signal that does not depend on you tapping anything. `[INFERENCE]` Other signals: likes, comments, shares, follows, "not interested," watching to the end, re-watching, saving, following a sound or hashtag, and rich content features extracted from the video and audio themselves (objects, scenes, captions, music). `[ESTABLISHED]` Reported internal documentation listed likes, comments, plays, and watch time as the components feeding the objective.

## How are candidate items generated (retrieval)?

`[INFERENCE]` TikTok almost certainly uses **embedding-based retrieval** to pull a few thousand candidate clips per request, blending: clips similar to ones you engaged with, clips popular within your inferred interest clusters, fresh clips being explored, and clips matched on content features (sound, topic, visual). `[ESTABLISHED]` Monolith's design (collisionless hash embedding tables, online training) is built precisely so that brand-new items and brand-new user signals enter the system quickly, which is the infrastructure you would want behind fast retrieval of fresh content.

## How is ranking performed?

`[INFERENCE]` The ranking stage is almost certainly a **multi-task deep network** predicting several outcomes per candidate (probability you finish, replay, like, comment, share, follow), combined into a single score. `[ESTABLISHED]` The reported internal formula was a weighted sum of predicted engagement terms (a representation along the lines of `score = w1·likes + w2·comments + w3·watch_time + w4·plays`), which is consistent with a multi-task model whose head predictions are blended. `[INFERENCE]` A re-ranking pass then enforces diversity (so you do not see ten near-identical clips), creator and content de-duplication, and exploration of new material.

## What machine learning models are likely used?

- `[ESTABLISHED]` **Monolith**: a real-time recommendation system with collisionless embedding tables and online training (arXiv:2209.07663). This tells us the *infrastructure*, not the ranking model.
- `[INFERENCE]` Two-tower or similar embedding retrieval for candidate generation.
- `[INFERENCE]` A multi-task deep ranking network (the standard for this kind of feed), likely with strong real-time features.
- `[INFERENCE]` Content-understanding models (computer vision and audio) that embed each clip, important because so much TikTok content is brand new with little engagement history, so content features carry early ranking weight.

## What objectives are optimised?

`[INFERENCE]` The core optimisation target is **engagement and time spent**, with **completion rate and replays** likely weighted heavily because they are dense, fast signals on short clips. `[ESTABLISHED]` Reported documentation framed the objective as a weighted blend of watch time, plays, likes, and comments. `[INFERENCE]` TikTok has publicly described interventions to *diversify* and to *limit* repetitive or distressing content for some users, which implies the raw engagement objective is wrapped in policy constraints. The honest framing: a feed tuned for completion of very short clips will, as a side effect, encourage long uninterrupted scroll sessions. That is an optimisation outcome, not stated intent.

## What user behaviours influence recommendations?

`[INFERENCE]` Most influential: watching a clip to the end, replaying it, and how long you linger before swiping. These are powerful because they are implicit, abundant, and hard to fake. Moderately influential: likes, shares, comments, follows, and saves. Available but weaker on their own: a fast swipe-away (a negative signal). `[INFERENCE]` Because the strongest signals are passive (you do not have to tap anything), TikTok can build an interest profile unusually fast, which is the likely reason the For You feed feels uncannily quick to "read" a new user.

## How quickly does the model adapt?

`[INFERENCE]` **Within a single session.** Watch a few clips on a niche topic to completion, and similar clips tend to appear within minutes. `[ESTABLISHED]` Monolith's online-training and collisionless-embedding design supports exactly this: new interactions update embeddings continuously rather than waiting for a nightly batch. This near-real-time adaptation is the most plausible technical explanation for TikTok's reputation for fast personalisation.

## How does feedback affect future recommendations?

`[INFERENCE]` Every swipe is feedback. Completing and replaying clips on a topic rapidly increases that topic's share of your feed; consistently swiping away suppresses it; explicit "not interested" suppresses it faster. Because adaptation is fast and the signal is passive, the **feedback loop is tight**: small early behaviours can compound quickly into a narrow feed. `[INFERENCE]` Exploration (mixing in uncertain or off-profile clips) is the standard counterweight and is almost certainly present, both to keep learning about you and to give new creators a chance.

---

## Maturity and adaptation-speed note

TikTok's recommender is mature and, by reputation and by Monolith's published design, optimised for **speed of adaptation** more than any other platform here. The trade-off for outside observers is that very little is published about the ranking model itself, so confidence is mixed: the infrastructure is `[ESTABLISHED]`, the ranking behaviour is mostly `[INFERENCE]`.

## References

- Liu, Z., Zou, L., Zou, X., et al. (2022). Monolith: Real Time Recommendation System With Collisionless Embedding Table. arXiv:2209.07663. (ByteDance.)
- Smith, B. (2021). How TikTok Reads Your Mind. *The New York Times*. (Reporting describing an internal TikTok document and its objective formula. Reporting, not engineering documentation.)
- General two-stage and multi-task ranking background: see Covington et al. 2016 and Zhao et al. 2019 in [`youtube.md`](youtube.md), used here only as analogues, not as TikTok sources.
