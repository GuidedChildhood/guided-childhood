# Recommender Foundations

*Recommendation systems, collaborative filtering, and content-based recommendation.*

## Introduction

A recommendation system is software that predicts, for a given person, which items from a large catalogue they are most likely to value, and then orders those items for display. The catalogue might be films, products, songs, news articles, or short videos. The problem is one of ranking under uncertainty: the system never observes a person's full preferences, only fragments of behaviour (a click, a purchase, a five-second watch), and must generalise from those fragments to items the person has never seen.

The field organises itself around two complementary strategies. **Collaborative filtering** recommends items by finding patterns across many users: people who behaved like you in the past are a guide to what you will like next. **Content-based recommendation** recommends items by their attributes: if you liked this item, here are others with similar features. Most deployed systems blend the two (hybrid systems), and the Recommender Systems Handbook (Ricci, Rokach, and Shapira) remains the standard reference for the taxonomy. Understanding these foundations matters for child wellbeing because the same machinery that surfaces a helpful tutorial also surfaces the next autoplay video, and the design choices that distinguish the two are mostly choices about what signal the system learns from.

## Key findings

**Collaborative filtering can be neighbourhood-based or model-based.** Early neighbourhood methods computed similarities directly between users or between items. Sarwar and colleagues (2001) showed that *item-based* collaborative filtering, which precomputes item-to-item similarities, scales better and is often more stable than user-based methods, because item relationships change more slowly than the active user set. [ESTABLISHED] Item-based collaborative filtering produced higher quality and faster recommendations than user-based methods on the datasets tested (Sarwar et al. 2001).

**Matrix factorisation reframed the problem as learning latent factors.** Rather than comparing raw co-occurrence, Koren, Bell, and Volinsky (2009) modelled each user and each item as a vector in a shared low-dimensional space; a predicted rating is the dot product of the two vectors. This approach, popularised during the Netflix Prize, captures soft, learned dimensions of taste that no human labelled. [ESTABLISHED] Matrix factorisation models outperformed classical neighbourhood methods on the Netflix dataset and became the dominant collaborative filtering technique of that era (Koren et al. 2009).

**Implicit feedback changed the objective.** Most modern systems do not have star ratings; they have clicks, watches, and skips. Implicit feedback is one-sided: a click is weak positive evidence, but a non-click is ambiguous (not seen, or seen and rejected). Rendle and colleagues (2009) introduced Bayesian Personalised Ranking (BPR), which optimises the *relative order* of a clicked item over an unclicked one rather than predicting an absolute score. [ESTABLISHED] Optimising a pairwise ranking objective (BPR) outperformed pointwise prediction for implicit-feedback recommendation (Rendle et al. 2009). This shift from "predict the rating" to "get the ranking right" is foundational to everything in the next section.

**Content-based methods depend on representation quality.** A content-based recommender is only as good as its item features. Classical text recommenders used term-frequency representations; modern ones use learned embeddings from images, audio, and text. The strength of content-based methods is that they work for brand-new items with no interaction history (they sidestep the *item cold-start* problem); their weakness is overspecialisation, recommending only more of what a person already consumes.

**The cold-start and feedback-loop problems are structural.** Collaborative filtering cannot recommend an item or to a user it has never seen interact (*cold start*). And because a system trains on the behaviour it itself produced, it can narrow what a person sees over time. [INFERENCE] A collaborative filter trained continuously on its own recommendations will tend to reinforce whatever it surfaced earlier, because users can only interact with items the system chose to show, a self-reinforcing loop that is plausible from the training setup and observed in offline studies, though its strength in any specific deployed product is hard to measure from outside.

## Key papers

- **Sarwar, Karypis, Konstan, Riedl (2001), "Item-based collaborative filtering recommendation algorithms", WWW 2001.** The reference for item-based neighbourhood methods.
- **Koren, Bell, Volinsky (2009), "Matrix Factorization Techniques for Recommender Systems", IEEE Computer.** The clearest exposition of latent-factor models. doi:10.1109/MC.2009.263.
- **Rendle, Freudenthaler, Gantner, Schmidt-Thieme (2009), "BPR: Bayesian Personalized Ranking from Implicit Feedback", UAI 2009.** Reframed implicit-feedback recommendation as pairwise ranking. arXiv:1205.2618.
- **He, Liao, Zhang, Nie, Hu, Chua (2017), "Neural Collaborative Filtering", WWW 2017.** Replaced the dot product with a learned neural interaction function; the bridge to deep recommendation. arXiv:1708.05031.
- **Ricci, Rokach, Shapira (eds.), "Recommender Systems Handbook", Springer.** The standard survey of the whole field.

## Limitations of the research

Most published collaborative-filtering results come from *offline* evaluation on fixed datasets (MovieLens, Netflix, Amazon reviews). Offline accuracy correlates only loosely with online behaviour, because a static dataset cannot capture how recommendations change what users do next. Public datasets also skew towards films, books, and products, not the short-form video feeds that dominate children's attention today, so external validity to those settings is an [INFERENCE], not an established fact. Finally, almost all classical metrics reward *accuracy* (did the user click?) and ignore diversity, novelty, long-term satisfaction, or wellbeing, which means the literature optimised hard for a target that may be the wrong one for children.

## Practical implications for healthier systems for children

- **The objective is a design choice, not a law of nature.** BPR optimises click-order; nothing forces that choice. A child-facing system could rank on a different relative-preference signal (for example, "would a parent and child both endorse this?") using the same machinery.
- **Content-based features give explainability.** Because content-based recommendation reasons over human-readable attributes, it is far easier to explain to a child *why* something was recommended, which is itself a literacy goal.
- **Cold-start defaults set the tone.** What a system shows a brand-new child user, before it knows anything about them, is a pure policy decision. Healthy defaults (calm, varied, age-appropriate) cost nothing technically and shape every later interaction.
- **Diversity can be a first-class objective.** Overspecialisation is a known failure mode; injecting novelty and breadth is a solved engineering problem, not a research frontier.

## References

1. Sarwar, B., Karypis, G., Konstan, J., & Riedl, J. (2001). Item-based collaborative filtering recommendation algorithms. *Proceedings of the 10th International Conference on World Wide Web (WWW)*.
2. Koren, Y., Bell, R., & Volinsky, C. (2009). Matrix factorization techniques for recommender systems. *IEEE Computer*, 42(8), 30-37. doi:10.1109/MC.2009.263.
3. Rendle, S., Freudenthaler, C., Gantner, Z., & Schmidt-Thieme, L. (2009). BPR: Bayesian personalized ranking from implicit feedback. *Proceedings of the 25th Conference on Uncertainty in Artificial Intelligence (UAI)*. arXiv:1205.2618.
4. He, X., Liao, L., Zhang, H., Nie, L., Hu, X., & Chua, T.-S. (2017). Neural collaborative filtering. *Proceedings of the 26th International Conference on World Wide Web (WWW)*. arXiv:1708.05031.
5. Ricci, F., Rokach, L., & Shapira, B. (Eds.). *Recommender Systems Handbook*. Springer.
