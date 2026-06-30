# Instagram

Instagram is unusual in this list because its head, Adam Mosseri, has published plain-language "ranking explained" posts describing the signals and the fact that **each surface (Feed, Stories, Explore, Reels) has its own model**. That gives us a credible high-level skeleton, though not the model internals. Instagram is owned by Meta, so it shares infrastructure (notably DLRM) with Facebook.

> ### What we know vs what we infer
>
> **We know (official):** Instagram has published that ranking differs per surface, that it predicts a set of actions per candidate (for example, likelihood you will spend time on a post, comment, like, save, or tap through), and that signals include the post, the person who posted, your activity, and your history with that person (Mosseri / Instagram "ranking explained"). Meta has open-sourced **DLRM** (Naumov et al. 2019, arXiv:1906.00091), its deep learning recommendation model family.
>
> **We infer:** The exact model architecture per surface, the precise predicted actions and their weights, and the live feature set. DLRM tells us the *style* of model Meta builds, not the exact Reels or Explore model.

---

## What signals are collected?

`[ESTABLISHED]` Instagram's published explanations group signals into a few families: **information about the post** (when it was posted, how popular it is, attached media), **information about the person who posted it**, **your activity** (what you have liked, saved, commented on), and **your history of interacting with that person**. `[INFERENCE]` In practice this expands to: dwell time on a post, watch time and completion on Reels, profile visits, shares to DMs (a strong signal Instagram has publicly emphasised), saves, story replies, close-friends behaviour, and content-understanding features from images and video.

## How are candidate items generated (retrieval)?

`[INFERENCE]` Retrieval differs sharply by surface. **Feed and Stories** draw mostly from accounts you follow, so retrieval is closer to "gather recent posts from your graph" than open-web search. **Explore and Reels** are recommendation surfaces that pull from accounts you do **not** follow, so they rely on classic embedding-based retrieval: find accounts and posts similar to ones you engaged with, plus popular and fresh candidates. `[INFERENCE]` Explore likely uses an account-level retrieval step (find accounts you might like) followed by a post-level step (pick posts from those accounts), a structure Instagram engineers have described in talks.

## How is ranking performed?

`[ESTABLISHED]` Instagram has said it **predicts a set of actions** for each candidate (such as the probability you spend time on it, like it, comment, save, or tap the profile) and combines those predicted probabilities into a score, with the weights differing by surface. `[INFERENCE]` This is textbook **multi-task ranking**: one model with several prediction heads, scored and blended, then passed through a re-ranking pass for diversity and policy (for example, demoting borderline or "recommendability"-failing content, which Meta has publicly described).

## What machine learning models are likely used?

- `[ESTABLISHED]` **DLRM** (Naumov et al. 2019), Meta's open deep learning recommendation model combining embeddings for sparse categorical features with multilayer perceptrons for dense features. This is the family Meta builds with.
- `[INFERENCE]` Two-tower or graph-based retrieval for Explore and Reels.
- `[INFERENCE]` Per-surface multi-task ranking networks with several action-prediction heads.
- `[INFERENCE]` Image and video content-understanding models feeding embeddings, especially important for Reels and Explore where many items are from accounts you do not follow.

## What objectives are optimised?

`[INFERENCE]` Per surface, the objective is a weighted blend of the predicted actions. For Feed, time spent and meaningful interactions (likes, comments, shares to DMs) dominate; for Reels, watch time and completion likely dominate, mirroring TikTok's pressure. `[ESTABLISHED]` Meta's broader 2018 "Meaningful Social Interactions" change (documented for Facebook but reflecting Meta-wide philosophy) shifted weight toward interactions between people over passive consumption. `[INFERENCE]` Instagram has also publicly described **values-based interventions**: limiting recommendations of sensitive content to teens and adding "take a break" nudges, which sit on top of the engagement objective as constraints.

## What user behaviours influence recommendations?

`[INFERENCE]` Strong: sharing a post to DMs (Instagram has called this one of its most important signals), saves, dwell time, Reels watch time, and repeated interaction with a specific account. Moderate: likes and comments. Weaker alone: a passing impression. `[ESTABLISHED]` Instagram has publicly stated that your **history of interacting with a person** is a major factor in whether their posts rank highly for you, which is why Feed tends to surface close friends and frequently visited accounts.

## How quickly does the model adapt?

`[INFERENCE]` In-session signals (what you just watched or saved) feed back quickly, especially on Reels and Explore, which behave like fast recommendation surfaces. Feed adapts more gently because its candidate pool is your follow graph, which changes slowly. `[INFERENCE]` Heavy models are retrained on a batch schedule (hours to days), so your longer-term profile shifts over days rather than seconds.

## How does feedback affect future recommendations?

`[INFERENCE]` Saving and DM-sharing a kind of content increases similar recommendations on Explore and Reels noticeably; "not interested" and unfollowing suppress sources; muting reduces an account's weight without unfollowing. Because Explore and Reels pull from outside your follow graph, feedback there can shift your feed faster than on Feed. `[ESTABLISHED]` Instagram has published guidance telling users that these explicit controls (not interested, mute, favourites, following) directly shape ranking, which is a rare case of a platform documenting the feedback channel itself.

---

## Maturity and adaptation-speed note

Instagram's recommender is mature and, importantly, **multi-surface**: there is no single "Instagram algorithm," but a family of per-surface models with different objectives. Confidence is medium: the high-level structure and signal families are `[ESTABLISHED]` from official posts, while architecture and weights are `[INFERENCE]`. Reels is the fastest-adapting surface; Feed the slowest.

## References

- Mosseri, A. and Instagram (2021 onward). "Shedding More Light on How Instagram Works" / "Ranking Explained." Official Instagram / Meta blog posts describing per-surface ranking and signals.
- Naumov, M., Mudigere, D., et al. (2019). Deep Learning Recommendation Model for Personalization and Recommendation Systems (DLRM). arXiv:1906.00091. (Meta.)
- Meta (2018). "Bringing People Closer Together" (Meaningful Social Interactions announcement). Official Meta newsroom post.
