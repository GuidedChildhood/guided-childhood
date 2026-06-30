# Part 7: Can We Change the Algorithms?

*A rigorous, honest investigation into whether recommendation systems could realistically optimise for human outcomes that matter, instead of for engagement.*

## Overview

Every recommender feed answers one question billions of times a day: of all the items I could put in front of this person right now, which one should I rank first? The answer is whatever scores highest against an objective. On the major platforms that objective is some weighted blend of engagement signals (watch time, completion, likes, comments, shares, return visits) plus a handful of guardrails. This part asks a deceptively simple question: could the objective be a human outcome we actually care about, such as a child sleeping better, feeling less anxious, or talking more with their family?

The honest answer this part defends is: **partially, for some outcomes, at a real cost, and never as cleanly as the hopeful version of the idea suggests.** We are not utopian here. We take seriously the possibility that the whole project is harder than it looks and that some of the proposed metrics would do harm if naively optimised. We also take seriously that a handful of these outcomes are genuinely tractable and that small, careful versions of them have already been deployed.

We hold to the repository's epistemic discipline. Every substantive claim is labelled **[ESTABLISHED]**, **[INFERENCE]**, **[SPECULATIVE]**, or **[CONTESTED]**. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

## The core tension

Three properties of human wellbeing make it structurally hostile to the way recommender systems are trained.

1. **Wellbeing outcomes are long-horizon.** Whether a feed helped a child learn, or sleep, or feel less lonely is a fact about days and weeks, not about the next swipe. Recommender training loops are tuned on signals that arrive in milliseconds to minutes. The reward you can measure quickly is almost never the outcome you actually want. [INFERENCE]

2. **Wellbeing outcomes are hard to measure.** Engagement is directly logged: the system observes the click. Mood, confidence, empathy, and family connection are latent states that have to be *inferred* from noisy proxies or *asked about* through surveys that most users will not answer. Every measurement choice introduces bias, gaming, and privacy cost. [INFERENCE]

3. **Wellbeing outcomes are often anti-correlated with short-term engagement.** The content that keeps a person scrolling at midnight is frequently the content that wrecks their sleep. The notification that maximises return visits can be the one that raises anxiety. This is not always true, and the degree is contested, but the existence of a wedge between "what holds attention now" and "what serves the person over time" is the entire reason this question is interesting. [CONTESTED]

Put together, these three properties describe an **alignment problem for recommenders**. We have a system that is extremely good at maximising a measurable short-term proxy, and we want it instead to serve a hard-to-measure long-term value. That gap, between the proxy you can optimise and the value you actually hold, is where Goodhart's law lives and where most of the engineering risk in this part comes from. The cross-cutting treatment of that problem is in [`alignment-and-measurement.md`](alignment-and-measurement.md). The framing of recommenders as value-laden optimisers that *could* target other objectives is set out most clearly in the work of Stray and colleagues (Stray 2020; Stray et al. 2021), which this part builds on throughout.

A second tension runs underneath the technical one. Deciding to optimise a feed for "healthy friendships" or "reduced anxiety" is deciding, on someone else's behalf, what a good life looks like. That is a moral act, not just an engineering one. Who chooses the target, whose definition of healthy wins, and how a young person consents, are questions we treat as first-class throughout, not as an afterthought.

## How to read the scores

For each of the twelve outcomes we give an honest four-way score. The bands are deliberately coarse because the underlying evidence is coarse.

- **Evidence base.** How much credible research connects this outcome to feed design and to media use. High means multiple converging studies including experiments; Low means mostly theory or a few small studies.
- **Measurability.** How well we can actually observe the outcome at the scale and frequency a training loop needs. High means a usable signal exists today; Low means we would be optimising a weak proxy or relying on sparse self-report.
- **Feasibility.** How realistically a production recommender could be steered toward this outcome without unacceptable reward hacking. High means a credible engineering path exists; Low means current methods would likely be gamed or fail.
- **Commercial viability.** Honestly, whether a company could ship this and survive. Most of these *reduce* short-term engagement, so High here usually depends on a non-advertising business model, regulation, or a trust and brand play, not on the outcome paying for itself in the ad auction.

A score is a summary, not a verdict. The reasoning behind each one is in [`outcomes.md`](outcomes.md).

## Summary table: scoring the twelve outcomes

| # | Outcome | Evidence base | Measurability | Feasibility | Commercial viability |
|---|---------|:---:|:---:|:---:|:---:|
| 1 | Mental wellbeing | Medium | Low | Low | Low |
| 2 | Healthy friendships | Medium | Low | Low | Low |
| 3 | Better sleep | High | Medium | Medium | Medium |
| 4 | Learning | High | Medium | Medium | Medium |
| 5 | Creativity | Low | Low | Low | Low |
| 6 | Confidence | Low | Low | Low | Low |
| 7 | Empathy | Low | Low | Low | Low |
| 8 | Critical thinking | Medium | Low | Low | Medium |
| 9 | Family interaction | Medium | Medium | Medium | Medium |
| 10 | Physical activity | High | High | Medium | Medium |
| 11 | Reduced anxiety | Medium | Low | Low | Low |
| 12 | Reduced loneliness | Medium | Low | Low | Low |

**Reading the pattern.** The outcomes that score best (sleep, physical activity, learning, family interaction) share three traits: they have a relatively *behavioural* and *externally observable* target, they have a *shorter* causal horizon between feed and effect, and they have at least one *off-platform* corroborating signal (a wearable, a quiz score, a time-of-day pattern). The outcomes that score worst (empathy, confidence, creativity, mental wellbeing as a global construct) are latent psychological states that resist cheap measurement and invite reward hacking. This is not a coincidence. It is the core tension restated: we can most credibly optimise for the outcomes that look least like deep wellbeing and most like behaviour.

No outcome scores High on commercial viability under an advertising-funded, engagement-monetised model. That single fact is the most important commercial finding in this part. The realistic routes to viability are a subscription or licensed product (a paid child-safe service, a school deployment), a regulatory floor that forces the change on everyone at once so no single firm is disadvantaged, or a long-run brand and trust position that bets retention beats raw daily engagement. We treat each of these soberly in the detail file and avoid claiming any of them is proven.

## What this part is and is not

This part **is** an evidence-grounded feasibility study: for each outcome, what is known, how you would measure and optimise it, what would break, what is ethically at stake, and whether anyone could sell it. It **is not** a product spec, and it is not a claim that any of these systems exists at scale today. The closest real-world precedent, Meta's 2018 shift to "Meaningful Social Interactions," is instructive precisely because it tried to optimise for something other than raw engagement and produced mixed and partly harmful results (see outcome 2 and the alignment essay). We use it as a warning, not a template.

## Section files

- **[`outcomes.md`](outcomes.md)**: the twelve outcomes, one section each, with five subsections apiece: evidence review, technical feasibility, engineering challenges, ethical concerns, and commercial viability.
- **[`alignment-and-measurement.md`](alignment-and-measurement.md)**: the cross-cutting essay covering proxy metrics and Goodhart's law, long-horizon reward and off-policy evaluation, experience sampling as ground truth, the three kinds of preference (revealed, stated, reflective), reward hacking, and the regulatory backdrop (UK Age Appropriate Design Code, Online Safety Act, EU Digital Services Act).

## References

- Stray, J. (2020). Aligning AI Optimization to Community Well-Being. *International Journal of Community Well-Being*, 3, 443 to 463.
- Stray, J., Vendrov, I., Nixon, J., Adler, S., and Hadfield-Menell, D. (2021). What are you optimizing for? Aligning Recommender Systems with Human Values. *arXiv:2107.10939*.
- Milli, S., Pierson, E., and Garg, N. (2023). Engagement, User Satisfaction, and the Amplification of Divisive Content on Social Media. *arXiv* / *PNAS Nexus*.
- Goodhart, C. A. E. (1984). Problems of Monetary Management: The UK Experience. In *Monetary Theory and Practice*. Macmillan.
- Manheim, D., and Garrabrant, S. (2018). Categorizing Variants of Goodhart's Law. *arXiv:1803.04585*.
