# Part 3: Behaviour Mapping

A behaviour-to-influence map. For every action a user can take, this part estimates how strongly that action probably shifts what gets recommended next, how confident we are in that estimate, and what evidence or reasoning supports it.

A warning to read first. **Exact production weights are proprietary.** No platform publishes the live coefficient it places on a like versus a rewatch versus a pause. So almost every influence estimate below is labelled `[INFERENCE]`: it is grounded in published research and observed product behaviour, not in a leaked number. Where a claim is genuinely established by a paper or an official engineering post, it is labelled `[ESTABLISHED]`. Where the field disagrees, it is labelled `[CONTESTED]`. Where we are reasoning forward past the evidence, `[SPECULATIVE]`.

---

## 1. Implicit versus explicit feedback, and why some signals are louder

Recommender systems learn from two broad kinds of feedback.

**Explicit feedback** is when you deliberately tell the system something: a like, a follow, a "not interested," a report. It is clean, because you meant it, but it is rare, because most people rarely tap those buttons.

**Implicit feedback** is everything you do without meaning it as a vote: how long you watched, whether you scrolled past, whether you came back. It is noisy, because watching is not the same as endorsing, but it is abundant, because every second of behaviour produces it. The foundational treatment of this is Hu, Koren and Volinsky (2008), which models implicit signals as evidence with an attached *confidence* rather than as a clean rating, weighting stronger or more frequent interactions more heavily.

The key idea for the whole of this part is why some signals are **louder** than others. A signal tends to be heavily used by a ranking system when it is:

- **(a) Frequent.** It occurs on most items, so the model gets a dense, continuous training signal rather than a sparse one. Watch time exists for every video; a like exists for a tiny fraction.
- **(b) Low-effort.** It does not depend on the user deciding to act, so it is not biased toward the rare, motivated user. Dwell happens whether or not you can be bothered to tap anything.
- **(c) Predictive of future engagement.** It correlates with what the system is trying to maximise next (more watching, more sessions, more retention). A signal that predicts tomorrow's behaviour is worth more than one that only describes today's mood.

Watch time scores on all three counts, which is why it became the optimisation target in YouTube's published ranking work (Covington et al. 2016). A like scores well only on (b).

The mirror image holds for **explicit negative signals** ("not interested," "hide," "block," "report"). These are *rare* (they fail test (a)) and they take *effort* (they fail test (b)), but precisely because they are costly and unambiguous they tend to be weighted heavily **per event**. One "not interested" can move a feed more than a hundred passive scroll-bys, because the user paid a cost to send it and the meaning is unambiguous. Frequent-and-loud (watch time) and rare-but-heavy (an explicit negative) are two different routes to influence. Keeping them separate is most of the skill in reading the table that follows.

---

## 2. Master table

Read every "estimated influence" cell as **probably**, not definitely, unless the evidence column names a citation. "Variable" means the influence depends heavily on the platform, the surface, or the content format (for example, short video versus long video).

| Behaviour | Signal type | Estimated influence | Confidence | Why / evidence |
|---|---|---|---|---|
| Click / tap to open | Implicit, positive | Medium | Medium | Cheap and frequent, but clickbait-prone, so modern systems discount it for deeper signals. [ESTABLISHED] Yi et al. 2014. |
| Pause (deliberate) | Implicit, positive | Medium-High | Low | A pause on a frame is dwell; long dwell signals interest. [INFERENCE] from Yi et al. 2014. |
| Watch time / completion | Implicit, positive | Very high | High | Published optimisation target. [ESTABLISHED] Covington 2016; Zhao 2019. |
| Rewatch / loop | Implicit, positive | High | Low | Repeated consumption is strong revealed preference. [INFERENCE]. |
| Like | Explicit, positive | Medium | Medium | Clear but rare; one of several ranking objectives, not the dominant one. [INFERENCE] Zhao 2019; Mosseri. |
| Share (especially to a person) | Explicit, positive | High | Medium | Costly, social, predictive of value. [ESTABLISHED] Meta MSI; Mosseri posts. |
| Save / bookmark | Explicit, positive | High | Medium | High-intent "I want this later" signal; named by Instagram. [ESTABLISHED] Mosseri posts. |
| Comment | Explicit, positive | High | Medium | High-effort interaction; weighted as meaningful interaction. [ESTABLISHED] Meta MSI; Mosseri. |
| Follow / subscribe | Explicit, positive | High (durable) | Medium | Long-lived preference; shapes candidate pool, not just one ranking. [INFERENCE]. |
| Search | Explicit, positive (intent) | High | Medium | Strong stated intent; reshapes retrieval immediately. [INFERENCE]. |
| Dismiss / skip / fast scroll | Implicit, negative | Medium | Medium | Frequent weak negative; a quick skip is a soft "no." [INFERENCE] Covington 2016. |
| "Not interested" | Explicit, negative | High | Medium | Rare, unambiguous, weighted heavily per event. [INFERENCE]; Mosseri "see less." |
| Hide | Explicit, negative | High | Medium | Stronger than skip; explicit removal. [INFERENCE]. |
| Block | Explicit, negative (hard) | Very high (targeted) | Medium | Hard constraint on a source; near-absolute for that account. [INFERENCE]. |
| Report | Explicit, negative (safety) | Variable | Low | Routes to safety/integrity, not only ranking; effect indirect. [INFERENCE]. |
| Subscriptions (the set) | Explicit, structural | High | Medium | Defines a large slice of the candidate pool. [INFERENCE]. |
| Notifications opened | Implicit, positive | Medium | Low | Feeds re-engagement and notification ranking; partly separate system. [INFERENCE]. |
| Session length | Implicit, contextual | Medium | Medium | An objective at session level more than a per-item feature. [ESTABLISHED] Zhao 2019. |
| Time of day | Contextual feature | Low-Medium | Medium | Context feature; sharpens timing, rarely picks topics alone. [INFERENCE]. |
| Device | Contextual feature | Low | Medium | Format and quality context; weak topical signal. [INFERENCE]. |
| Location | Contextual feature | Low-Medium | Medium | Drives local/language relevance; coarse otherwise. [INFERENCE]. |
| Friend / network activity | Implicit + collaborative | High | Medium | Core of collaborative filtering and social ranking. [ESTABLISHED] Hu 2008; Meta MSI. |

---

## 3. Behaviour by behaviour

**Click / tap to open.** A click is the classic implicit signal: frequent and cheap. But it is also the most gameable, which is exactly why the field moved past it. Yi et al. (2014) showed that two items with the same click-through rate can differ enormously in quality, and that *post-click dwell time* separates them. [ESTABLISHED] Modern systems therefore treat a click as an opening bid, then look at what you did after the click. Confidence: medium, because how much a click still counts varies by surface.

**Pause (deliberate).** Stopping the scroll and letting a frame sit on screen produces dwell time, and dwell is treated as a quality signal rather than a mere click (Yi et al. 2014). [INFERENCE] A deliberate pause on an image or a paused video frame is plausibly read as "this held attention," which is the thing the system most wants to predict. Confidence: low, because distinguishing a deliberate pause from a distracted phone-down is itself a modelling problem.

**Watch time / completion rate.** This is the loud signal. Covington et al. (2016) state plainly that YouTube's ranking model was trained to predict *expected watch time*, not click probability, specifically to avoid clickbait. [ESTABLISHED] Zhao et al. (2019) then generalised this into a multi-objective model combining several engagement and satisfaction predictions. [ESTABLISHED] Watch time wins on all three loudness tests: frequent, low-effort, predictive. Confidence: high.

**Rewatch / loop.** Watching the same thing again, or letting a short video loop, is consumption layered on consumption. As revealed preference it is hard to fake and costly in attention, so it is plausibly a strong positive, especially in short-video formats where a loop is a built-in interaction. [INFERENCE] Confidence: low, because we have no published weight for it; the inference rests on the general principle that repeated voluntary consumption is strong evidence.

**Like.** A like is clean explicit feedback, but it is rarer than a view and easy to give without much meaning. In multi-objective ranking it is one predicted head among many (Zhao et al. 2019), and Instagram's own explanations list likes alongside, not above, other signals (Mosseri). [INFERENCE] So a like matters, but it rarely dominates watch behaviour. Confidence: medium.

**Share (especially to a specific person).** Sharing costs effort and carries social risk, which makes it a strong endorsement. Meta's 2018 shift to "Meaningful Social Interactions" explicitly up-weighted shares and person-to-person interaction in Feed ranking. [ESTABLISHED] A private share to one friend is plausibly weighted above a public reshare, because it is more deliberate. Confidence: medium.

**Save / bookmark.** Saving says "I want to find this again," a forward-looking intent that is hard to misread. Instagram's ranking explanations name saves as a key signal for Reels and Explore (Mosseri). [ESTABLISHED] Because it is high-intent and low-noise, it tends to be weighted strongly despite being rare. Confidence: medium.

**Comment.** Commenting is among the highest-effort actions available, and effortful actions are valuable precisely because they are scarce. Meta's MSI framework treats comments (and replies to comments) as meaningful interactions worth up-weighting. [ESTABLISHED] Note the system usually rewards that you commented, not whether the comment was positive; an angry comment is still engagement. Confidence: medium.

**Follow / subscribe.** A follow is a durable, explicit preference that mostly acts on a different layer: it shapes the *candidate pool* (what is eligible to be shown) rather than the per-item score. [INFERENCE] Its influence is long-lived, which is why unfollowing is one of the more effective ways to change a feed. Confidence: medium.

**Search.** A search is the strongest *stated* intent a user offers: you have typed exactly what you want. It reshapes retrieval immediately and often feeds back into the personalised feed afterwards, because a search reveals an interest the passive feed had not yet seen. [INFERENCE] Confidence: medium.

**Dismiss / skip / fast scroll.** Scrolling quickly past an item is a frequent, weak negative: the implicit opposite of dwell. Because it happens constantly it is statistically useful even though any single skip is ambiguous (you might have been interrupted). A watch-time objective penalises skips automatically, since a skip contributes near-zero watch time (Covington et al. 2016). [INFERENCE] Confidence: medium.

**"Not interested."** This is the archetypal rare-but-heavy signal. It is unambiguous and costs a deliberate tap, so per event it can move a feed far more than a passive skip. Instagram and others expose it as a "see less" control that demonstrably suppresses similar content (Mosseri). [INFERENCE] It is also underused: most users never tap it, which is the practical lesson for Part 4. Confidence: medium.

**Hide.** Hiding is a step beyond skipping: an explicit "remove this from my view." It carries more information than a skip because the user took an action, and is plausibly weighted accordingly, suppressing the item and similar items. [INFERENCE] Confidence: medium.

**Block.** Blocking is a hard negative aimed at a *source* rather than a piece of content. For the blocked account it is close to absolute: that account effectively disappears. Its influence is therefore very high but narrow, scoped to one relationship rather than reshaping topical taste. [INFERENCE] Confidence: medium.

**Report.** Reporting is unusual because it routes primarily into safety and integrity systems (does this break the rules?) rather than into the personalisation objective (do you want more of this?). Its effect on your own recommendations is real but indirect and harder to predict. [INFERENCE] Confidence: low. We avoid claiming a precise ranking weight here because the pathway is genuinely opaque.

**Subscriptions (the set as a whole).** Beyond any single follow, the *collection* of accounts you subscribe to defines a large share of what is even eligible to appear. It is structural rather than per-item, shaping retrieval. [INFERENCE] Confidence: medium.

**Notifications opened.** Whether you open push notifications feeds a partly separate system that decides what and when to notify you, and it also signals re-engagement appetite. It influences the feed indirectly by deciding which content gets a second chance to reach you. [INFERENCE] Confidence: low.

**Session length.** How long a session runs is better understood as an *objective the system optimises toward* than as a per-item input feature. Zhao et al. (2019) describe satisfaction and engagement objectives evaluated over sessions, not just single items. [ESTABLISHED for the objective framing] A system optimising session length will tend to surface content that extends sessions, a side effect, not a stated intent to keep anyone hooked. Confidence: medium.

**Time of day.** Time is a context feature. It sharpens *when* and *how* content is shown (different content lands well at 8am than at 11pm) more than it selects topics on its own. [INFERENCE] Its main practical relevance is timing of notifications and the late-session dynamics discussed in EPISTEMICS. Confidence: medium.

**Device.** Device type is a weak contextual feature, mostly about format and bandwidth (vertical video on a phone, longer-form on a TV), with little topical signal of its own. [INFERENCE] Confidence: medium.

**Location.** Location drives local relevance: language, regional trends, nearby events. Coarse location is genuinely useful for these; beyond that it adds little to topical taste. [INFERENCE] Confidence: medium.

**Friend / network activity.** What people similar to you, or connected to you, engaged with is the heart of collaborative filtering. Hu, Koren and Volinsky (2008) and the broader implicit-feedback literature (Rendle et al. 2009) build recommendations precisely from these co-engagement patterns, and Meta's social ranking adds an explicit friends-and-family layer on top. [ESTABLISHED] This is why a feed can shift after friends, not you, engage with something. Confidence: medium.

---

## 4. The counterintuitive ones

A handful of points surprise people, and they are the ones worth teaching.

- **Watch time usually outweighs a like.** People assume the like button is their main vote. In published practice the loud signal is how long you watched, because YouTube's ranker optimises expected watch time directly, not clicks or likes (Covington et al. 2016; Zhao et al. 2019). [ESTABLISHED] You vote far more with your attention than with your thumb.

- **For short video, completion rate beats raw watch time.** Ten seconds watched of a ten-second clip is a very different signal from ten seconds of a ten-minute one. Completion (and looping) normalises for length, so the *percentage* finished is plausibly the stronger short-form signal. [INFERENCE]

- **A long pause or a rewatch can be a strong positive.** No tap required. Dwell on a paused frame, or letting a clip loop, can register as a clearer endorsement than a like, because it is attention the system did not have to ask for (Yi et al. 2014). [ESTABLISHED for dwell; INFERENCE for rewatch]

- **"Not interested" and "hide" are powerful but underused.** Because they are rare and effortful, each event tends to be weighted heavily, yet most users never touch them. The lever exists; almost nobody pulls it. [INFERENCE]

- **Dwell time on a paused frame matters.** The thing you stop on, even without clicking, is measured. Stillness is data. [ESTABLISHED] Yi et al. 2014.

- **Negatives are scoped differently.** "Not interested" softens a *topic*; block removes a *source*; report routes to *safety*. They feel similar but act on different parts of the system, which is why they are not interchangeable. [INFERENCE]

None of this implies the systems are trying to manipulate anyone. A model that optimises watch time will, as a side effect, favour content that holds attention. That is an optimisation outcome, not evidence of intent. Holding that line, established versus inferred, side effect versus intent, is the discipline of this whole project.

---

## 5. For a child

**Your attention is the vote that counts most.** You probably think you tell the app what you like by tapping the heart. You do, a little. But the app is watching something much louder: how long you look. When you stop to watch a whole video, or watch it twice, that is a big vote, even if you never touch a button. And when something is not for you, the strongest thing you can do is not just scroll past it. Tap "not interested" or "hide." Almost nobody does, which is exactly why it works. You are not powerless in front of the feed. You are voting all the time. Once you know which votes are loud, you get to choose what you are voting for.

---

## References

- Covington, P., Adams, J., and Sargin, E. (2016). Deep Neural Networks for YouTube Recommendations. *Proceedings of the 10th ACM Conference on Recommender Systems (RecSys '16)*, 191-198.
- Zhao, Z., Hong, L., Wei, L., Chen, J., Nath, A., Andrews, S., Kumthekar, A., Sathiamoorthy, M., Yi, X., and Chi, E. (2019). Recommending What Video to Watch Next: A Multitask Ranking System. *Proceedings of the 13th ACM Conference on Recommender Systems (RecSys '19)*, 43-51.
- Hu, Y., Koren, Y., and Volinsky, C. (2008). Collaborative Filtering for Implicit Feedback Datasets. *Proceedings of the 2008 Eighth IEEE International Conference on Data Mining (ICDM '08)*, 263-272.
- Rendle, S., Freudenthaler, C., Gantner, Z., and Schmidt-Thieme, L. (2009). BPR: Bayesian Personalized Ranking from Implicit Feedback. *Proceedings of the 25th Conference on Uncertainty in Artificial Intelligence (UAI '09)*, 452-461.
- Yi, X., Hong, L., Zhong, E., Liu, N. N., and Rajan, S. (2014). Beyond Clicks: Dwell Time for Personalization. *Proceedings of the 8th ACM Conference on Recommender Systems (RecSys '14)*, 113-120.
- Mosseri, A. (2021 and updates). Shedding More Light on How Instagram Works. Instagram / Meta engineering and newsroom posts on ranking signals.
- Meta (2018). Bringing People Closer Together (Meaningful Social Interactions update to News Feed ranking). Meta Newsroom.
