# Ranking and Deep Recommendation Systems

*Machine learning ranking algorithms, deep neural recommendation systems, large-scale ranking systems, and multi-objective optimisation.*

## Introduction

The systems that order a modern feed are not single models but pipelines. A *candidate generation* (retrieval) stage narrows a catalogue of millions to a few hundred plausible items; a *ranking* stage then scores those candidates precisely and sorts them; a *re-ranking* stage applies business rules, diversity, and freshness. This two-stage shape is now standard across large platforms, and the published architectures from YouTube are the canonical public examples. Understanding the pipeline matters for children because each stage embeds a different objective, and the objective most associated with engagement (watch time, session length) lives in the ranking and re-ranking stages, where it is most amenable to redesign.

## Key findings

**Recommendation became a deep-learning problem around 2016.** Covington, Adams, and Sargin (2016) described YouTube's production system as two deep neural networks: a candidate-generation network that frames retrieval as extreme multiclass classification over the corpus, and a separate ranking network that scores the shortlist with richer features. They reported that training the candidate model to predict *expected watch time* rather than click probability better matched the product goal. [ESTABLISHED] YouTube's recommender was restructured as deep candidate-generation and ranking networks, with the ranker optimised towards watch time (Covington et al. 2016).

**Wide and deep models combined memorisation and generalisation.** Cheng and colleagues (2016) at Google introduced Wide & Deep learning: a wide linear component memorises frequent feature interactions while a deep component generalises to unseen combinations through embeddings. [ESTABLISHED] Jointly training wide (memorisation) and deep (generalisation) components improved app recommendation over either alone (Cheng et al. 2016). This template, and successors such as DeepFM, underpins much industrial ranking.

**Neural collaborative filtering generalised the interaction function.** He and colleagues (2017) replaced the fixed dot product of matrix factorisation with a learned multilayer network, letting the model capture non-linear user-item interactions. [ESTABLISHED] Learning the interaction function with a neural network outperformed dot-product matrix factorisation on implicit-feedback benchmarks (He et al. 2017).

**Real systems optimise many objectives at once.** A single feed must balance whether a user will click, watch to completion, like, share, comment, or report. Ma and colleagues (2018) introduced Multi-gate Mixture-of-Experts (MMoE), which lets multiple prediction tasks share a pool of expert sub-networks while each task learns its own gate over them, reducing the harm that conflicting tasks do to one another. Zhao and colleagues (2019) applied exactly this to YouTube's "what to watch next" ranker, combining engagement objectives (watch time, clicks) with satisfaction objectives (likes, dismissals, survey responses) in one multitask network, and explicitly modelled and removed *position bias* (items shown higher get clicked more regardless of quality). [ESTABLISHED] A multitask MMoE ranker jointly optimised engagement and satisfaction objectives while correcting for position bias in a deployed video recommender (Zhao et al. 2019; Ma et al. 2018).

**Multi-objective optimisation is where values get encoded.** Combining objectives requires weights, and those weights are policy. The research literature on multi-objective optimisation (Pareto fronts, scalarisation, constrained optimisation) gives the formal tools, but the *choice* of which objectives to include and how to weight them is a human decision that the maths does not make. [INFERENCE] When a deployed ranker adds a "satisfaction" head (surveys, dismissals) alongside watch-time, the relative weight on each head directly shapes how much the feed chases retention versus reported satisfaction; this is inferable from the published multitask designs, though the exact production weights are not public.

**Scale forces specific engineering, and that engineering shapes behaviour.** Large-scale ranking depends on embeddings, approximate nearest-neighbour retrieval, feature stores, and frequent retraining. [INFERENCE] Rapid, near real-time feature updates and short retraining loops are consistent with how comparable streaming ranking systems are built, and they explain why a feed can adapt within a single session; this is a reasonable engineering inference from public talks and the products' observable behaviour, not a confirmed internal fact for any specific platform.

## Key papers

- **Covington, Adams, Sargin (2016), "Deep Neural Networks for YouTube Recommendations", RecSys 2016.** The canonical public two-stage deep recommender.
- **Cheng et al. (2016), "Wide & Deep Learning for Recommender Systems", DLRS/arXiv.** Memorisation plus generalisation. arXiv:1606.07792.
- **He et al. (2017), "Neural Collaborative Filtering", WWW 2017.** Learned interaction functions. arXiv:1708.05031.
- **Ma, Zhao, Yi, Chen, Hong, Chi (2018), "Modeling Task Relationships in Multi-task Learning with Multi-gate Mixture-of-Experts" (MMoE), KDD 2018.** The multitask backbone.
- **Zhao et al. (2019), "Recommending What Video to Watch Next: A Multitask Ranking System", RecSys 2019.** MMoE applied to YouTube ranking with bias correction.

## Limitations of the research

The most detailed published architectures are several years old; current production systems are almost certainly more capable, so reasoning from these papers to today's feeds is [INFERENCE]. Published industrial papers also report the metrics the authors chose to improve (engagement, satisfaction surveys), and rarely report long-run effects on users' wellbeing, sleep, or attention, because those are not measured in the offline or short A/B windows used. Position-bias correction and multitask balancing are active research areas without settled best practice, and most academic benchmarks remain too small to surface the dynamics that only appear at billion-user scale.

## Practical implications for healthier systems for children

- **Add objectives rather than remove the system.** The multitask architecture is the opportunity: a satisfaction or wellbeing head can be added to an existing ranker without rebuilding it. The hard part is measuring a good wellbeing signal, not wiring it in.
- **Make the weights visible.** Because objective weights are policy, a child-safe product could publish or even expose them, turning an invisible value judgement into a teachable, auditable setting.
- **Correct for bias deliberately.** Position-bias correction shows that engineers already remove distortions they consider unfair; the same toolkit can down-weight signals (for example, late-night watch time) that are healthy to discount for children.
- **Retrieval defaults bound everything downstream.** No re-ranking can rescue a candidate set that was unhealthy to begin with, so age-appropriate retrieval is the highest-leverage intervention.

## References

1. Covington, P., Adams, J., & Sargin, E. (2016). Deep neural networks for YouTube recommendations. *Proceedings of the 10th ACM Conference on Recommender Systems (RecSys)*.
2. Cheng, H.-T., et al. (2016). Wide & deep learning for recommender systems. *Proceedings of the 1st Workshop on Deep Learning for Recommender Systems*. arXiv:1606.07792.
3. He, X., Liao, L., Zhang, H., Nie, L., Hu, X., & Chua, T.-S. (2017). Neural collaborative filtering. *WWW 2017*. arXiv:1708.05031.
4. Ma, J., Zhao, Z., Yi, X., Chen, J., Hong, L., & Chi, E. H. (2018). Modeling task relationships in multi-task learning with multi-gate mixture-of-experts. *Proceedings of the 24th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining (KDD)*.
5. Zhao, Z., et al. (2019). Recommending what video to watch next: A multitask ranking system. *Proceedings of the 13th ACM Conference on Recommender Systems (RecSys)*.
