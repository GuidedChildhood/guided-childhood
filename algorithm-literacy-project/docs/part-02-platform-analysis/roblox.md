# Roblox

Roblox is the odd one out: it does not recommend posts, videos, or songs, but **experiences** (games) and items inside a large user-generated catalogue. Its recommendation problem is closer to an **app store or marketplace discovery** system than to a media feed. Roblox has published engineering-blog material on home-page personalisation, but far less than YouTube or Netflix, so this file is heavily inferential and says so.

> ### What we know vs what we infer
>
> **We know (engineering blog, high-level):** Roblox personalises its home page and discovery surfaces (sort rows such as "Recommended for You," "Continue," "Popular"). Roblox has published engineering writing describing recommendation and ranking of experiences, and that it uses machine learning to personalise which experiences appear and in what order.
>
> **We infer:** The model architectures, the exact objectives and their weights, how monetisation is balanced against engagement, and adaptation speed. The catalogue is experiences and items, not media clips, which changes the problem. Mark this file as heavy inference.

---

## What signals are collected?

`[INFERENCE]` The signals that matter most for game discovery are **play behaviour**: which experiences you play, session length and total play time per experience, return visits (retention), and whether you finish onboarding or churn in the first minutes. `[INFERENCE]` Also collected: searches, genre and tag preferences, friends' activity (Roblox is strongly social, so friends playing an experience is a powerful signal), device, age bracket, and in-experience monetisation behaviour (Robux spend, item purchases). `[INFERENCE]` Content features of each experience (genre, tags, thumbnail, age rating, creator) feed the system, important because new experiences launch constantly with little play history.

## How are candidate items generated (retrieval)?

`[INFERENCE]` Candidate generation pulls a pool of eligible experiences for each home-page request from several sources: experiences similar to ones you have played (embedding similarity), experiences your friends play, trending and popular experiences, fresh launches being explored, and experiences matched to your inferred genre preferences. `[INFERENCE]` Because the catalogue is large but far smaller than a video platform's, retrieval can be less aggressive than a billions-scale media feed, though the same retrieve-then-rank shape almost certainly applies.

## How is ranking performed?

`[INFERENCE]` Roblox most plausibly uses **machine-learning ranking** that predicts, per experience, the probability you will click in, play, stay engaged, and return, then orders the home-page rows accordingly. `[INFERENCE]` Because the home page is organised into **sorts (rows)**, ranking happens at two levels: which rows to show and in what order, and which experiences to place within each row. `[INFERENCE]` A re-ranking pass handles diversity (do not fill the page with one genre), age-appropriateness filters, and freshness.

## What machine learning models are likely used?

- `[INFERENCE]` Embedding-based retrieval (two-tower style) to find experiences similar to your play history.
- `[INFERENCE]` A ranking model (gradient-boosted trees or a deep network) predicting click-through, play time, and retention per experience.
- `[INFERENCE]` Possibly graph-based models that exploit the strong friend signal, since "friends play this" is so predictive on Roblox.
- `[INFERENCE]` Content models on experience metadata and thumbnails to cold-start new experiences. No specific Roblox model architecture is cited because the public detail is limited.

## What objectives are optimised?

`[INFERENCE]` Roblox plausibly optimises a **blend of engagement and monetisation**: time spent and retention (so users keep coming back) alongside healthy economy metrics (Robux spend, creator earnings), because Roblox's business depends on a thriving creator economy, not just attention. `[INFERENCE]` This dual objective is the most important way Roblox differs from a pure media feed: surfacing an experience that earns and retains can matter as much as one that is merely watched. The honest framing remains: optimising for retention and spend can produce side effects (for example, favouring experiences with strong monetisation hooks) without anyone intending harm.

## What user behaviours influence recommendations?

`[INFERENCE]` Strong: playing an experience for a long time, returning to it across days (retention), and friends playing it. Moderate: clicking into an experience, searching a genre, favouriting. Weaker or negative: bouncing out within seconds (a churn signal that suppresses similar experiences). `[INFERENCE]` Because retention across days is so valuable for a games platform, **return behaviour likely outweighs a single long session**, which is a meaningful difference from short-video feeds that reward immediate completion.

## How quickly does the model adapt?

`[INFERENCE]` Adaptation is plausibly slower than a short-video feed: the meaningful signal (did you come back tomorrow?) takes days to materialise, and play sessions are long and sparse compared with the rapid-fire swipes of TikTok. In-session, your recent plays can reshape the home page on your next visit, but the deeper retention-driven adaptation likely runs on an hours-to-days clock. This is inference from the nature of the catalogue, not documented detail.

## How does feedback affect future recommendations?

`[INFERENCE]` Playing and returning to experiences in a genre increases similar recommendations and surfaces related rows; bouncing quickly suppresses similar experiences; friends adopting a game can pull it onto your home page even without your own history. `[INFERENCE]` Because the friend signal is strong, Roblox feedback loops have a **social** dimension absent from most media feeds: your recommendations are shaped not only by what you do, but by what your friends play.

---

## Maturity and adaptation-speed note

Roblox's recommender is a **marketplace and discovery** system, not a media feed, and is the least publicly documented in this set after Snapchat. Confidence is low: a thin layer of `[ESTABLISHED, high-level]` engineering-blog statements over substantial `[INFERENCE]`. It most plausibly adapts on an hours-to-days clock because its key signal, retention, is inherently slow, and it likely balances engagement against monetisation in a way pure media feeds do not.

## References

- Roblox Engineering Blog: posts on home-page personalisation, discovery, and recommendation of experiences (official, high-level). Used for the existence and broad shape of the system, not architecture.
- General marketplace and app-store recommendation literature, and the retrieve-then-rank background in this part's [`README.md`](README.md), used as analogues. All architectural claims here are explicit inference.
