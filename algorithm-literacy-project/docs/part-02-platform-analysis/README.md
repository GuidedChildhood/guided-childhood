# Part 2: Platform Analysis

How recommendation likely works on eight major platforms, with a strict separation between what is established and what is inferred.

This part takes eight platforms that shape a large share of modern childhood (YouTube, TikTok, Instagram, Facebook, Snapchat, Roblox, Netflix, and Spotify) and explains, for each, how its recommendation system probably works. Each platform has its own file. This README gives you the shared mental model you need to read those files, a comparison table, and a strong warning about how much of this is public fact versus engineering inference.

---

## The most important warning in this whole repository

**Almost no platform publishes the live details of its production recommender.** What is public falls into a few categories:

- **Research papers** describing systems that were in production at a moment in the past (for example, YouTube's 2016 candidate generation paper). These are real and citable, but the live system has almost certainly moved on.
- **Engineering blogs** that describe architecture at a high level, often without the numbers that would let you reproduce anything.
- **Open-source frameworks** a company has released (Meta's DLRM, ByteDance's Monolith), which tell you the *kind* of model the company builds, not the exact model running today.
- **Leaks and reporting** (for example, press coverage of an internal TikTok document), which are partial, dated, and not engineering-grade.

So we follow the project's labelling rules without exception. Every substantive claim is tagged:

- `[ESTABLISHED]`: supported by a published paper, patent, or official platform engineering document or blog you can check.
- `[INFERENCE]`: a reasonable engineering conclusion drawn from public information and the standard toolbox of large-scale ranking, not confirmed by the platform.
- `[SPECULATIVE]`: a forward-looking or uncertain claim that has not been built or verified at scale.

If a file says TikTok "almost certainly" does something, that is an `[INFERENCE]`, and we say so in the text. We never dress an inference up as a fact. We also keep a strict distinction the project insists on: **optimising an objective can produce a harmful side effect without anyone intending that harm.** We describe objectives and their side effects. We do not assume malicious intent.

---

## The shared mental model: retrieve, then rank

Nearly every large recommender, across very different companies, is built as a funnel with the same two big stages. Once you hold this picture in your head, every platform file becomes a variation on one theme.

```
  Billions of candidate items (the full catalogue)
                  |
                  v
   [ STAGE 1: CANDIDATE GENERATION / RETRIEVAL ]
   Cheap, approximate. Narrow billions down to hundreds or low thousands.
   Usually many retrieval sources merged together.
                  |
                  v
   Hundreds to a few thousand candidates
                  |
                  v
   [ STAGE 2: RANKING ]
   Expensive, accurate. Score each candidate with a heavy model.
   Predict several outcomes at once (click, finish, like, share, follow...).
                  |
                  v
   [ STAGE 3: RE-RANKING / POLICY ]
   Diversity, freshness, de-duplication, safety filters, business rules,
   exploration. Decide the final order actually shown.
                  |
                  v
         The feed you see
```

### Stage 1: candidate generation (retrieval)

You cannot score billions of items with a heavy model for every request. It would be too slow and too expensive. So the first job is to cheaply pull a shortlist of a few hundred to a few thousand plausible items.

- The dominant modern technique is **two-tower retrieval** `[INFERENCE for most platforms]`. One neural network (tower) turns the user and context into a vector. Another turns each item into a vector. Items whose vectors point in a similar direction to the user vector are good candidates. Because the item vectors can be computed in advance and stored, retrieval becomes a fast nearest-neighbour search (often using approximate nearest neighbour indexes such as those described in the FAISS and ScaNN literature).
- Real systems usually blend **several retrieval sources**: items similar to what you just watched, items popular with people like you, items from accounts you follow, fresh items being explored, and so on. The candidate set is a union of these.

### Stage 2: ranking

Now a heavier model scores each shortlisted candidate. Modern ranking models are usually **multi-task**: instead of predicting one number, they predict several at once (the chance you click, the chance you finish, the chance you like, comment, share, or follow). A final score combines these predictions with weights. YouTube's published work uses a Multi-gate Mixture-of-Experts (MMoE) network for exactly this `[ESTABLISHED]` (Zhao et al. 2019).

### Stage 3: re-ranking and policy

The top-scoring list is not shown raw. A final pass applies diversity (do not show five near-identical clips in a row), freshness, de-duplication, safety and policy filters, and **exploration** (deliberately mixing in uncertain items to learn about you and to give new content a chance). Exploration is often framed as a multi-armed bandit problem; Spotify and Netflix have both described bandit-style systems publicly `[ESTABLISHED]`.

### Why this shape is so universal

The funnel exists because of a hard constraint: you have tens of milliseconds to choose from billions of items. Cheap-then-expensive is the only way to make that tractable. So even though the eight platforms differ in catalogue (short video, long video, music, games, friends' posts), they converge on the same skeleton. The interesting differences are in the *signals* they collect, the *objectives* they weight, and how *fast* they adapt.

---

## Comparison table across the eight platforms

Confidence is shown as how much of each cell is public fact (`E` = established), inference (`I`), or speculation (`S`).

| Platform | Primary catalogue | Strongest published evidence | Main objective (inferred unless noted) | Adaptation speed | Confidence |
|---|---|---|---|---|---|
| YouTube | Long and short video | Covington 2016, Zhao 2019, Chen 2019 (Google papers) | Watch time and "valued" watch time, multi-task | Minutes to hours for signals; periodic retrain | High (E) |
| TikTok | Short video | Monolith paper; reported internal doc | Watch time, completion, replays, plays plus likes/comments/shares | Near real-time within a session | Mixed (I, some E) |
| Instagram | Posts, Stories, Reels, Explore | Mosseri "ranking explained" posts; Meta DLRM | Per-surface engagement and "meaningful interaction" | Fast for in-session; per-surface | Medium (E/I) |
| Facebook | Feed, Reels, Groups, video | EdgeRank history; MSI 2018; DLRM | Meaningful Social Interactions weighting | Fast in-session; periodic retrain | Medium (E/I) |
| Snapchat | Discover, Spotlight, friends | Sparse public detail; product behaviour | Engagement and watch time on Spotlight/Discover | Fast for Spotlight | Low (mostly I) |
| Roblox | Games (experiences), items | Roblox engineering blogs on home personalisation | Engagement, session length, monetisation | Hours to days likely | Low (mostly I) |
| Netflix | Films and series | Gomez-Uribe and Hunt 2015; bandit thumbnail work | Long-term retention (membership) | Slow and deliberate; bandits faster | High (E) |
| Spotify | Music and podcasts | van den Oord 2013; BaRT bandit talks | Engagement, completion, long-term satisfaction | Mixed; bandits fast, weekly batch | High (E) |

Read each cell as "probably," not "definitely," unless the citation is named.

---

## How to read the platform files

Each file answers the same eight questions as subsections, so you can compare like with like:

1. What signals are collected?
2. How are candidate items generated (retrieval)?
3. How is ranking performed?
4. What machine learning models are likely used?
5. What objectives are optimised?
6. What user behaviours influence recommendations?
7. How quickly does the model adapt?
8. How does feedback affect future recommendations?

Each file also carries a short **"What we know vs what we infer"** callout and a **maturity / adaptation-speed note**, and ends with **References**.

A final reminder before you read on: when a platform optimises for, say, watch time, and the side effect is that a child watches longer than they meant to, that is a side effect of an objective, not proof of an intent to harm. Holding that distinction steady is the whole point of this part.

---

## Files in this part

- [`youtube.md`](youtube.md)
- [`tiktok.md`](tiktok.md)
- [`instagram.md`](instagram.md)
- [`facebook.md`](facebook.md)
- [`snapchat.md`](snapchat.md)
- [`roblox.md`](roblox.md)
- [`netflix.md`](netflix.md)
- [`spotify.md`](spotify.md)
