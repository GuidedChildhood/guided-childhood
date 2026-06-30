# YouTube

YouTube is the best-documented large recommender in this list. Google has published several papers describing the systems that powered its recommendations at the time of writing. The live system has moved on since each paper, but these papers give us an unusually solid foundation, so much of this file is `[ESTABLISHED]` rather than inferred.

> ### What we know vs what we infer
>
> **We know (published):** YouTube has used a two-stage candidate-generation-then-ranking deep neural network design (Covington et al. 2016). It has used a Multi-gate Mixture-of-Experts multi-task ranking model with a dedicated shallow tower to correct for position and selection bias (Zhao et al. 2019). It has published a REINFORCE-based reinforcement learning recommender with off-policy correction (Chen et al. 2019).
>
> **We infer:** The exact current architecture, the precise objective weights, the live feature set, and how "satisfaction" and "valued watch time" are measured today. These have certainly evolved past the published versions.

---

## What signals are collected?

`[ESTABLISHED]` The 2016 candidate-generation paper describes using a user's watch history (as embedded video IDs), search history (as embedded tokens), and simple demographic and context features such as geography, device, and the example's age (how long ago the video was uploaded, used to model freshness). `[ESTABLISHED]` The 2019 ranking paper adds features describing the candidate video and the user's past interactions with similar videos, plus features describing where the item would be shown (used by the bias-correction tower).

`[INFERENCE]` In production today the signal set is far wider: watch time per video, completion rate, skips, "not interested" and "do not recommend channel" feedback, likes and dislikes (even after the public dislike count was hidden, the signal is still collected), subscriptions, time of day, session position, and survey responses where YouTube directly asks users to rate recommendations. Google has publicly said it uses user satisfaction surveys to train models, which supports this inference.

## How are candidate items generated (retrieval)?

`[ESTABLISHED]` Covington et al. 2016 frames candidate generation as **extreme multiclass classification**: predict which video out of millions a user will watch next, given their history. The network learns user and video embeddings, and at serving time the problem becomes a **nearest-neighbour search** in embedding space. This is the conceptual ancestor of modern two-tower retrieval.

`[INFERENCE]` Today YouTube almost certainly merges several retrieval sources: videos similar to recent watches, videos from subscribed and frequently watched channels, trending and fresh content, and exploratory candidates. The 2016 single-network approach has likely been supplemented by multiple specialised retrievers whose outputs are unioned before ranking.

## How is ranking performed?

`[ESTABLISHED]` Zhao et al. 2019 ("Recommending What Video to Watch Next") describes the ranking stage as a **multi-task learning** problem solved with **Multi-gate Mixture-of-Experts (MMoE)**. The model predicts multiple engagement and satisfaction objectives at once (for example, clicks versus longer-term satisfaction signals), grouped into "engagement" and "satisfaction" families. A key contribution is a **shallow side tower** that models **selection and position bias**: the fact that an item shown near the top gets clicked partly because of its position, not its quality. Subtracting that bias gives a cleaner estimate of genuine relevance.

`[INFERENCE]` The final displayed order combines the multi-task predictions with weights, then applies diversity and freshness rules in a re-ranking pass.

## What machine learning models are likely used?

- `[ESTABLISHED]` Deep feedforward networks with learned embeddings for candidate generation (Covington 2016).
- `[ESTABLISHED]` MMoE multi-task ranking network with a bias-correction tower (Zhao 2019).
- `[ESTABLISHED]` REINFORCE-style policy-gradient reinforcement learning with a **Top-K off-policy correction** for the recommendation policy (Chen et al. 2019, WSDM).
- `[INFERENCE]` Approximate nearest neighbour search (ScaNN, a Google library, is the likely production tool) for retrieval at scale.

## What objectives are optimised?

`[ESTABLISHED]` Early public framing optimised **watch time** rather than raw click-through, precisely because clicks reward misleading thumbnails while watch time rewards content people actually watch (Covington 2016 motivates the move away from clicks). `[ESTABLISHED]` The 2019 work explicitly adds **satisfaction** objectives alongside engagement, acknowledging that pure engagement is not enough. `[INFERENCE]` The live objective is a weighted blend of watch time, completion, explicit satisfaction (surveys, likes), and "responsible" constraints that demote borderline content. Google has publicly described demotion of "borderline" content, which supports this.

`[INFERENCE]` A side effect worth naming plainly: a system that rewards watch time will, without anyone intending it, tend to surface content that holds attention, which can include autoplay chains that run longer than a child intended. That is an optimisation side effect, not evidence of intent to harm.

## What user behaviours influence recommendations?

`[INFERENCE]` Strongly: how long you watch a video (the dominant signal), whether you finish it, what you search for, what you subscribe to, and explicit feedback ("not interested," "do not recommend this channel"). Weakly or indirectly: a single click without watch time (treated with suspicion because of clickbait), and passive impressions you scroll past. `[ESTABLISHED]` Position bias means the slot an item appears in also influences clicks, which is exactly why the bias-correction tower exists (Zhao 2019).

## How quickly does the model adapt?

`[INFERENCE]` Two clocks run at once. **Fast clock:** within a session, your recent watches reshape your candidates almost immediately, because retrieval reacts to fresh history. **Slow clock:** the heavy ranking and retrieval models are retrained on a schedule (likely hours to days), so deeper shifts in your interests are absorbed over a longer period. `[ESTABLISHED]` The reinforcement learning framing (Chen 2019) is explicitly designed to optimise long-term value, not just the next click, implying YouTube cares about adaptation over sessions, not only within one.

## How does feedback affect future recommendations?

`[INFERENCE]` Every action is training data. Finishing videos on a topic increases similar candidates and raises their predicted watch time. Explicit "not interested" suppresses a channel or topic. Likes and survey ratings feed the satisfaction objectives. Because the system learns from your behaviour and your behaviour is shaped by what it shows, there is a **feedback loop**: the bias-correction and exploration mechanisms (Zhao 2019; Chen 2019) exist partly to stop that loop narrowing too hard onto a single rut.

---

## Maturity and adaptation-speed note

YouTube's recommender is among the most mature in the world, with more than a decade of published iteration. Treat the citations below as **snapshots of a moving system**: each was true in production once. Adaptation is two-speed: near-immediate within a session, slower across the retrained models that define your longer-term profile.

## References

- Covington, P., Adams, J., and Sargin, E. (2016). Deep Neural Networks for YouTube Recommendations. *RecSys 2016*. (Official Google publication.)
- Zhao, Z., Hong, L., Wei, L., Chen, J., et al. (2019). Recommending What Video to Watch Next: A Multitask Ranking System. *RecSys 2019*. (Describes MMoE and the shallow bias tower.)
- Chen, M., Beutel, A., Covington, P., Jain, S., Belletti, F., and Chi, E. (2019). Top-K Off-Policy Correction for a REINFORCE Recommender System. *WSDM 2019*.
- Guo, R. et al. (2020). Accelerating Large-Scale Inference with Anisotropic Vector Quantization (ScaNN). *ICML 2020*. (Likely retrieval tooling; inference.)
