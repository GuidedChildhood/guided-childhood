# Snapchat

Snapchat publishes relatively little engineering detail about its recommenders, so this file is the most inference-heavy of the social platforms. Snapchat is also structurally different: its core is **private messaging between friends**, with algorithmic recommendation concentrated in two surfaces, **Discover** (publisher and creator content) and **Spotlight** (short, public, TikTok-style video). We reason about those surfaces by analogy to comparable systems and label accordingly.

> ### What we know vs what we infer
>
> **We know (official, high-level):** Snapchat operates Discover (curated and recommended publisher and creator stories) and Spotlight (a public short-video feed). Snap has publicly stated Spotlight surfaces content based on engagement signals such as how long people watch, shares, and favourites, and that it is not primarily follower-driven. Snap has discussed using machine-learning ranking for these surfaces in general terms.
>
> **We infer:** Essentially all architectural detail: the retrieval method, the ranking model family, the exact objectives and weights, and adaptation speed. Treat this file as a careful analogy to TikTok and YouTube, not as documented fact.

---

## What signals are collected?

`[INFERENCE]` On **Spotlight**, the most valuable signals are almost certainly the same dense watch signals that power any short-video feed: watch time per clip, completion, replays, shares, favourites, and swipe-aways. `[ESTABLISHED, high-level]` Snap has publicly described Spotlight ranking as based on engagement (time watched, shares, favourites) rather than follower count. `[INFERENCE]` On **Discover**, signals likely include taps into stories, time spent, subscriptions to publishers and creators, and completion of multi-snap stories. `[INFERENCE]` Snapchat also holds strong **social-graph signals** (who you message, your best friends, snap streaks), which plausibly inform friend-content ordering even if they are kept separate from public-content ranking.

## How are candidate items generated (retrieval)?

`[INFERENCE]` For Spotlight, candidate generation is most plausibly embedding-based retrieval over a pool of recent public submissions, blended with fresh and popular candidates, much like other short-video feeds. For Discover, the candidate pool is a curated and recommended set of publisher and creator stories, so retrieval likely mixes editorial curation with personalised selection. `[INFERENCE]` Friend stories are not "retrieved" in the recommendation sense; they come from your graph and are ordered rather than discovered.

## How is ranking performed?

`[INFERENCE]` Spotlight and Discover almost certainly use **machine-learning ranking** that predicts engagement outcomes (watch time, completion, share, favourite) per candidate and orders accordingly, with a re-ranking pass for diversity, freshness, and safety. `[INFERENCE]` Given Snapchat's younger user base, it is reasonable to infer additional safety constraints layered onto ranking for Spotlight and Discover, though the specifics are not public.

## What machine learning models are likely used?

- `[INFERENCE]` Embedding-based retrieval (two-tower style) for Spotlight candidate generation.
- `[INFERENCE]` A multi-task ranking network predicting watch and share outcomes, in the same family as other short-video rankers.
- `[INFERENCE]` Content-understanding models for video and audio, important because Spotlight submissions are new and have little engagement history at first.
- We have **no published Snap model architecture** to cite, so all four points are inference by analogy.

## What objectives are optimised?

`[INFERENCE]` For Spotlight, the objective is most plausibly **engagement and watch time** on short video, consistent with Snap's public statements that the feed rewards content people watch and share. For Discover, the objective likely blends completion and time spent with publisher and creator relationships. `[INFERENCE]` Because Snap's business and product identity centre on **friend communication**, it is reasonable to infer the public recommendation surfaces are tuned to complement messaging rather than to maximise total time at all costs, but this is an inference about product strategy, not a documented objective.

## What user behaviours influence recommendations?

`[INFERENCE]` On Spotlight: watching to the end, replaying, sharing, and favouriting push similar content up; quick swipe-aways push it down. On Discover: tapping in, finishing a story, and subscribing to a publisher or creator raise similar content. `[INFERENCE]` Friend-side behaviours (streaks, frequent messaging) shape the friend portions of the app more than the public recommendation feeds, and the two are likely modelled separately.

## How quickly does the model adapt?

`[INFERENCE]` Spotlight, as a short-video engagement feed, most plausibly adapts within a session in the same way TikTok does, because the dense watch signals arrive fast. Discover likely adapts more slowly because it mixes curation with personalisation. Without published infrastructure detail, adaptation speed is an inference from the surface's behaviour and from how comparable feeds are built.

## How does feedback affect future recommendations?

`[INFERENCE]` Watching, sharing, and favouriting on Spotlight increase similar recommendations; ignoring or quickly skipping reduces them. Subscribing to or muting publishers on Discover adjusts that surface. `[INFERENCE]` As with every engagement-ranked feed, there is a feedback loop, and exploration of new content is the standard counterweight, but Snap has not published the mechanics, so this is reasoning by analogy rather than documentation.

---

## Maturity and adaptation-speed note

Snapchat's public recommenders (Spotlight and Discover) are real and engagement-ranked, but **poorly documented from the outside**, so this is the lowest-confidence social platform in the set: a small core of `[ESTABLISHED, high-level]` statements wrapped in `[INFERENCE]`. Spotlight most plausibly adapts fast (short-video dense signals); Discover more slowly (curation plus personalisation). Treat specifics as careful analogy, not fact.

## References

- Snap Inc. official Spotlight and Discover help-centre and newsroom materials describing engagement-based ranking (watch time, shares, favourites) and the non-follower-driven nature of Spotlight. High-level only.
- No peer-reviewed Snap recommender architecture paper is cited here because none is relied upon. Architectural claims are explicit inference by analogy to TikTok ([`tiktok.md`](tiktok.md)) and YouTube ([`youtube.md`](youtube.md)).
