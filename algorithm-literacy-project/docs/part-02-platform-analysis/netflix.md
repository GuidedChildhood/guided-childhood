# Netflix

Netflix is, alongside YouTube, the best-documented recommender here. It has published in academic venues (notably Gomez-Uribe and Hunt 2015), it ran the famous Netflix Prize that popularised matrix factorisation, and it has written extensively on its tech blog, including on **artwork and thumbnail personalisation** via contextual bandits. Netflix is also philosophically distinct: its catalogue is small (thousands of titles, not billions of clips), and it optimises for **long-term retention of a paid membership**, not within-session time. That changes almost everything about how it behaves.

> ### What we know vs what we infer
>
> **We know (published):** Netflix's recommender is a *system of algorithms* spanning rows, ranking, and search, and it ties recommendation quality to retention (Gomez-Uribe and Hunt 2015, ACM TMIS). The Netflix Prize established matrix factorisation for rating prediction (Koren, Bell, Volinsky 2009). Netflix personalises the **artwork/thumbnail** shown for each title using contextual bandits (Netflix tech blog).
>
> **We infer:** The current production model details, the live objective weights, and how deep learning has replaced or augmented the matrix-factorisation era. The published work is real but, again, a snapshot.

---

## What signals are collected?

`[ESTABLISHED]` Netflix has described using **what you watch, how much of it you watch, when and how (device, time of day), and how titles relate to each other**, alongside the behaviour of members with similar tastes (Gomez-Uribe and Hunt 2015). `[INFERENCE]` In production this includes: play and completion per title, whether you finished a series or abandoned it mid-season, re-watches, time-of-day and device patterns, search queries, my-list adds, thumbs ratings (Netflix replaced star ratings with thumbs and now a two-thumbs-up "love this"), and which artwork variant you clicked. `[ESTABLISHED]` Explicit ratings (originally five-star, the basis of the Netflix Prize; later thumbs) are collected, though Netflix has said implicit play behaviour matters more than explicit ratings.

## How are candidate items generated (retrieval)?

`[INFERENCE]` Because the catalogue is small (thousands, not billions), Netflix does not face the same extreme retrieval pressure as a video platform. Candidate generation is less about narrowing billions and more about **organising a manageable catalogue into personalised rows** ("Because you watched...", "Trending Now", genre rows). `[ESTABLISHED]` Netflix has described its homepage as a set of ranked **rows**, where both the rows themselves and the titles within each row are personalised and ranked (Gomez-Uribe and Hunt 2015). Retrieval, in effect, is choosing which rows and candidate titles are eligible for a given member.

## How is ranking performed?

`[ESTABLISHED]` Netflix's published system ranks titles within rows and ranks the rows themselves, combining a **personalised video ranker**, similarity-based rows, trending rows, and a page-generation algorithm that assembles the whole homepage (Gomez-Uribe and Hunt 2015). `[ESTABLISHED]` Separately, the **artwork shown for each ranked title is itself personalised** by contextual bandits: Netflix tries different images and learns which artwork earns plays for which members (Netflix tech blog, "Artwork Personalization"). `[INFERENCE]` Modern ranking almost certainly uses learned models (deep learning and gradient boosting) rather than only the matrix-factorisation methods of the Prize era.

## What machine learning models are likely used?

- `[ESTABLISHED]` **Matrix factorisation** for collaborative filtering, popularised by the Netflix Prize (Koren et al. 2009). Historically central; likely now one component among many.
- `[ESTABLISHED]` **Contextual bandits** for artwork and thumbnail personalisation (Netflix tech blog).
- `[INFERENCE]` A learned **page-generation and ranking** stack (deep networks and/or gradient-boosted trees) that assembles personalised rows.
- `[INFERENCE]` Sequence models capturing viewing order and session context, in line with where the field has moved.

## What objectives are optimised?

`[ESTABLISHED]` Netflix has been explicit that its north star is **long-term member retention** (reducing cancellations), and it ties recommendation quality directly to that business outcome (Gomez-Uribe and Hunt 2015). This is the single most important contrast with engagement feeds. `[INFERENCE]` Because the objective is "are you glad you subscribed next month," Netflix has an incentive to optimise for **satisfying, completed viewing** rather than maximal raw time, and to avoid leaving you scrolling without playing anything. `[INFERENCE]` It is reasonable to infer this is why Netflix invests so heavily in artwork and row personalisation: reducing the cost of *finding* something worth watching protects retention.

## What user behaviours influence recommendations?

`[ESTABLISHED]` Watching and completing titles is the dominant signal; Netflix has said implicit play behaviour outweighs explicit ratings. `[INFERENCE]` Strong: finishing a series, re-watching, adding to My List, and which artwork you respond to. Moderate: thumbs ratings and search. Negative: abandoning a title early, which signals a poor match. `[ESTABLISHED]` The behaviour of **similar members** (collaborative filtering) strongly influences what you are shown, a direct legacy of the matrix-factorisation approach.

## How quickly does the model adapt?

`[INFERENCE]` Netflix adapts **deliberately and relatively slowly** compared with short-video feeds. Its objective (retention) is measured over weeks and months, so it has little reason to chase within-session swings. `[ESTABLISHED]` The bandit-based artwork system, by contrast, adapts faster because bandits learn continuously from which images earn plays. So Netflix runs a slow main recommender alongside faster bandit components for specific decisions. New profiles get a brief explicit-taste onboarding to cold-start.

## How does feedback affect future recommendations?

`[INFERENCE]` Finishing titles in a genre raises similar titles and similar rows; abandoning titles suppresses similar matches; My List adds and thumbs ratings nudge the model; responding to particular artwork teaches the bandit which images work for you. `[ESTABLISHED]` Because collaborative filtering is central, your feedback also flows through the "members like you" channel: your taste helps shape recommendations for similar members, and theirs shapes yours. `[INFERENCE]` Netflix's retention objective gives it a structural reason to avoid the tightest engagement feedback loops: a feed that maximised binge time but left you feeling the subscription was not worth it would *hurt* its actual objective.

---

## Maturity and adaptation-speed note

Netflix's recommender is highly mature and unusually well documented, but its defining feature is **objective, not architecture**: it optimises long-term retention of a paid membership rather than within-session attention, which makes it adapt deliberately rather than reactively. Confidence is high for the published components (rows, retention objective, bandit artwork) and `[INFERENCE]` for the current deep-learning internals.

## References

- Gomez-Uribe, C. A., and Hunt, N. (2015). The Netflix Recommender System: Algorithms, Business Value, and Innovation. *ACM Transactions on Management Information Systems (TMIS)*.
- Koren, Y., Bell, R., and Volinsky, C. (2009). Matrix Factorization Techniques for Recommender Systems. *IEEE Computer*. (Netflix Prize era.)
- Netflix Technology Blog (2017). "Artwork Personalization at Netflix." (Contextual bandits for thumbnail selection.)
