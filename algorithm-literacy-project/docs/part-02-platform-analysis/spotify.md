# Spotify

Spotify is well documented in public, partly through research (the influential 2013 deep content-based music paper came out of work Spotify hired the author into), partly through engineering talks on **Discover Weekly** and the **BaRT** ("Bandits for Recommendations as Treatments") system that powers the personalised home page. Spotify's catalogue is music and podcasts, which introduces two distinctive ingredients absent from the other platforms: **audio content analysis** and **playlist structure**.

> ### What we know vs what we infer
>
> **We know (published or presented):** Spotify combines **collaborative filtering**, **natural-language processing** of text about music (reviews, blogs, playlist co-occurrence), and **audio analysis** via convolutional neural networks for music recommendation, famously behind Discover Weekly (van den Oord, Dieleman, Schrauwen 2013, NeurIPS). Spotify's home page uses a multi-armed bandit system, **BaRT**, presented publicly by Spotify engineers.
>
> **We infer:** The current production blend, exact objectives and weights, and how much podcast recommendation differs from music. The 2013 audio paper is real and seminal but, again, a snapshot of one component.

---

## What signals are collected?

`[ESTABLISHED]` Spotify's documented approach draws on three very different signal sources: **collaborative-filtering signals** (what you and similar listeners play, skip, save, and add to playlists), **text signals** (NLP over what the web writes about tracks and artists, and playlist co-occurrence), and **audio signals** (raw acoustic features learned by a CNN directly from the waveform or spectrogram) (van den Oord et al. 2013). `[INFERENCE]` In production this expands to: plays and completion per track, skips (especially skips in the first 30 seconds, a strong negative signal), saves and playlist adds, repeats, time of day and context (workout, commute, focus), search, and follow behaviour. `[INFERENCE]` For podcasts, episode completion and subscription are key signals.

## How are candidate items generated (retrieval)?

`[ESTABLISHED]` The classic Discover Weekly pipeline generates candidates by **collaborative filtering** (find tracks that listeners with similar taste play, especially tracks in playlists alongside ones you like), then uses **audio CNN embeddings to cold-start tracks that have too little play history for collaborative filtering** to work (van den Oord et al. 2013 was motivated exactly by this cold-start gap). `[INFERENCE]` In production, retrieval blends collaborative candidates, content-similar (audio and NLP) candidates, freshly released tracks, and editorially or contextually relevant candidates.

## How is ranking performed?

`[ESTABLISHED]` The personalised **home page** is assembled by **BaRT**, a multi-armed bandit system that treats each shelf and card as an option to be explored and exploited, learning which recommendations earn engagement for which users in which context. `[INFERENCE]` Within a recommendation set (a playlist like Discover Weekly), ranking orders candidates by predicted enjoyment (play-through, save likelihood) while maintaining variety and flow. `[INFERENCE]` Sequence and "flow" considerations matter more here than on other platforms: the order of songs affects the listening experience directly, so ranking is not purely pointwise.

## What machine learning models are likely used?

- `[ESTABLISHED]` **Collaborative filtering** (matrix factorisation and successors) for taste-based candidates.
- `[ESTABLISHED]` **Convolutional neural networks on audio** for content-based recommendation and cold-start (van den Oord et al. 2013).
- `[ESTABLISHED]` **NLP** over text about music and over playlist co-occurrence (treating playlists like documents and tracks like words, in word2vec style).
- `[ESTABLISHED]` **Multi-armed / contextual bandits (BaRT)** for home-page recommendation.
- `[INFERENCE]` Modern deep ranking models layered on top, and increasingly podcast and audiobook-specific models.

## What objectives are optimised?

`[INFERENCE]` Spotify optimises a blend of **short-term engagement** (plays, completed listens, low skip rate) and **longer-term satisfaction and retention**, balanced explicitly through bandit exploration so the home page does not collapse into the same safe recommendations forever. `[ESTABLISHED]` The BaRT framing ("Bandits for Recommendations as Treatments") makes the explore-versus-exploit trade-off a first-class objective: Spotify deliberately spends some impressions learning, not just exploiting known preferences. `[INFERENCE]` Discover Weekly's objective is specifically **discovery**: surfacing unfamiliar tracks you will like, which is a different goal from maximising immediate plays of familiar favourites.

## What user behaviours influence recommendations?

`[INFERENCE]` Strong: playing a track to completion, saving it, adding it to a playlist, and repeat listens. Strong negative: an early skip (within the first several seconds), which is one of the cleanest dislike signals in any recommender. Moderate: following an artist, search, and context (the playlist or session a track was played in). `[ESTABLISHED]` Playlist co-occurrence is itself a powerful signal: tracks that appear together in many user playlists are treated as related, which is how NLP-style methods learn music similarity without anyone labelling genres.

## How quickly does the model adapt?

`[INFERENCE]` Spotify runs on **two clocks**. The bandit-driven home page adapts **quickly**, learning within and across sessions which shelves and tracks earn your engagement. Batch products like **Discover Weekly refresh on a fixed weekly schedule**, so that particular recommendation set adapts slowly and predictably by design. So "how fast does Spotify adapt" depends entirely on which surface: home page fast, weekly playlists weekly.

## How does feedback affect future recommendations?

`[INFERENCE]` Completing and saving tracks increases similar recommendations and feeds next week's Discover Weekly; early skips suppress similar tracks; hearting and hiding give explicit signals; following artists and adding to playlists strongly shape future candidates. `[ESTABLISHED]` Because BaRT is a bandit, your responses directly update the explore-exploit balance: a recommendation you engage with is reinforced, one you ignore is explored less. `[INFERENCE]` And because collaborative filtering and playlist co-occurrence are central, your listening also feeds the "listeners like you" channel, so your feedback subtly shapes others' recommendations and theirs shape yours.

---

## Maturity and adaptation-speed note

Spotify's recommender is mature and unusually **multi-method**: collaborative filtering, audio CNNs, NLP, and bandits all run together, which is why it handles brand-new tracks (via audio) and personalised discovery (via bandits) better than a single-method system could. Confidence is high for the named components (`[ESTABLISHED]`) and `[INFERENCE]` for the current production blend. Adaptation speed is surface-dependent: fast on the bandit home page, weekly on batch playlists.

## References

- van den Oord, A., Dieleman, S., and Schrauwen, B. (2013). Deep Content-Based Music Recommendation. *NeurIPS (NIPS) 2013*. (Audio CNN for cold-start, the basis of Discover Weekly's content side.)
- Spotify Engineering / Research presentations on **BaRT** (Bandits for Recommendations as Treatments) for home-page recommendation. (Public talks.)
- Spotify Engineering blog and talks describing Discover Weekly's combination of collaborative filtering, NLP, and audio models. (Official, high-level.)
