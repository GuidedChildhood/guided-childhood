# Facebook

Facebook has the longest public paper trail of any social feed, from the original **EdgeRank** era through the 2018 **Meaningful Social Interactions** change to the modern Meta machine-learning stack. It is owned by Meta and shares infrastructure (DLRM) with Instagram. As with Instagram, the high-level history is well documented; the live model is not.

> ### What we know vs what we infer
>
> **We know (official or widely documented):** Facebook's early News Feed used **EdgeRank**, a simple formula combining affinity (your relationship to the poster), weight (the type of interaction), and time decay. In 2018 Meta announced **Meaningful Social Interactions (MSI)**, re-weighting the feed toward interactions between people (comments, replies, shares) over passive consumption of public content. Meta open-sourced **DLRM** (arXiv:1906.00091).
>
> **We infer:** The current ranking model architecture, the exact MSI weights, and the live signal set. EdgeRank itself is long retired as the literal mechanism; it survives as a useful mental model.

---

## What signals are collected?

`[ESTABLISHED]` The EdgeRank framing names three signal families that still matter conceptually: **affinity** (how close you are to the source, from past interactions), **weight** (the value assigned to different actions, with comments and shares worth more than likes), and **recency** (newer posts favoured). `[INFERENCE]` Modern Facebook collects far more: dwell time, video watch time, comment length and whether comments are exchanged back and forth, group membership and activity, link click-throughs, "show more / show less" feedback, and content-understanding features on text, images, and video. `[ESTABLISHED]` Meta has publicly stated it down-weights clickbait, engagement-bait ("tag a friend!"), and links to low-quality sites.

## How are candidate items generated (retrieval)?

`[INFERENCE]` For the main Feed, candidate generation is dominated by your **social graph and group memberships**: gather recent eligible posts from friends, followed pages, and groups you belong to. This is closer to "inventory gathering from your network" than open recommendation. `[INFERENCE]` For **Reels and video** surfaces, Facebook behaves like an open recommender and uses embedding-based retrieval from accounts you do not follow, similar to Instagram Reels. `[INFERENCE]` A safety and eligibility filter removes policy-violating and demoted content before ranking.

## How is ranking performed?

`[ESTABLISHED]` Meta has described News Feed ranking as predicting, for each candidate post, the probability of several outcomes (you comment, share, react, hide it, click through) and combining them into a single score, with MSI raising the weight on person-to-person interactions. `[INFERENCE]` This is **multi-task ranking** in the same family as Instagram's, almost certainly built on Meta's DLRM-style models, followed by a re-ranking pass for diversity, integrity demotions, and business rules.

## What machine learning models are likely used?

- `[ESTABLISHED]` **DLRM** (Naumov et al. 2019): embeddings for sparse categorical features plus MLPs for dense features, with the specific engineering challenge of enormous embedding tables. This is Meta's core recommendation model family.
- `[INFERENCE]` Multi-task ranking networks predicting multiple feed actions per post.
- `[INFERENCE]` Embedding retrieval for Reels and video recommendation surfaces.
- `[INFERENCE]` Integrity classifiers (separate models) that detect clickbait, misinformation flags, and policy violations to drive demotion.

## What objectives are optimised?

`[ESTABLISHED]` Since 2018 the headline objective has been **Meaningful Social Interactions**: weighting the feed toward content likely to generate genuine interaction between people, explicitly *over* passive consumption of publisher content. Meta framed this as a wellbeing-oriented change. `[INFERENCE]` Underneath, the optimisation is still a blend of predicted engagement actions, now with heavier weight on comments, replies, and shares, plus integrity penalties that subtract from a post's score. `[CONTESTED]` Reporting (including documents disclosed in 2021) argued the MSI re-weighting had the side effect of amplifying divisive content, because content that provokes argument generates comments and reshares. Meta has disputed aspects of this. We present it as contested: it illustrates how an objective tuned for "interaction" can have side effects nobody set out to create.

## What user behaviours influence recommendations?

`[INFERENCE]` Strong: commenting (especially back-and-forth threads), sharing, reacting, time spent, and joining or being active in groups. Moderate: likes and link clicks. Negative: hiding a post, "show less," unfollowing, and reporting. `[ESTABLISHED]` Comments and shares are weighted above passive reactions by design under MSI, so the behaviours that move your feed most are the interactive ones.

## How quickly does the model adapt?

`[INFERENCE]` In-session feedback (hiding posts, watching video) influences ranking quickly, but the Feed's candidate pool is your relatively stable social graph, so the feed changes more slowly than a pure recommendation surface like Reels. `[INFERENCE]` The heavy models retrain on a batch schedule (hours to days). Net effect: Facebook Feed feels more stable and less volatile than TikTok or Reels because its inventory is bounded by your network.

## How does feedback affect future recommendations?

`[INFERENCE]` Explicit controls have direct effects: "show less" and hide suppress similar content and sources; "show more" and following do the reverse; snoozing or unfollowing removes a source from your candidate pool without ending the friendship. `[ESTABLISHED]` Meta documents these controls and states they shape ranking, and has added "Favourites" and a reverse-chronological option, giving users an explicit lever over the feedback loop. `[INFERENCE]` Because comments and shares are heavily weighted, the act of arguing with a post can, paradoxically, increase how much similar content you see, a clean example of an engagement objective producing an unintended side effect.

---

## Maturity and adaptation-speed note

Facebook's feed is the most historically documented in this set, which makes it tempting to over-trust old descriptions. EdgeRank is a retired mechanism kept alive as a teaching model; MSI is the most recent *named* objective shift; the current system is `[INFERENCE]`. It adapts more slowly than recommendation-first feeds because its inventory is anchored to your social graph.

## References

- Meta (2018). "Bringing People Closer Together" (Meaningful Social Interactions). Official Meta newsroom.
- Naumov, M., Mudigere, D., et al. (2019). Deep Learning Recommendation Model for Personalization and Recommendation Systems (DLRM). arXiv:1906.00091.
- EdgeRank: originally described by Facebook engineers circa 2010 and widely documented in industry literature; retired as a literal mechanism but retained as a conceptual model.
- 2021 disclosures ("Facebook Papers") regarding MSI side effects: reported by multiple outlets and the US Securities and Exchange Commission filings. Presented here as `[CONTESTED]` reporting, not engineering documentation.
