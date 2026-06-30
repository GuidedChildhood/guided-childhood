# Part 1: Literature Review

*A deep, cited review across fourteen research fields that together explain how modern recommendation systems work and how they meet a developing child.*

## Overview

This part lays the evidence foundation for the whole repository. To understand the feeds that shape modern childhood, you have to read across fields that rarely talk to one another: the machine-learning research that builds recommenders, the behavioural science that explains why we respond to them, the developmental psychology that describes the children on the other side of the screen, and the human-computer interaction research that designs the surface where all of it meets. We review fourteen such fields here, grouped into six readable section files. Each section gives an introduction, the key findings, the key papers with citations, the honest limitations of the research, and concrete implications for designing healthier systems for children.

We hold to the repository's epistemic discipline throughout. Every substantive claim is labelled: **[ESTABLISHED]** for peer-reviewed or primary-document findings you can check, **[INFERENCE]** for reasonable engineering or scientific conclusions that are not officially confirmed, **[SPECULATIVE]** for forward-looking ideas, and **[CONTESTED]** where the research community itself has not settled. See [`EPISTEMICS.md`](../../EPISTEMICS.md) for the full scheme. We keep a deliberately neutral stance: optimising a system for engagement can produce harmful side effects without anyone designing those harms on purpose, and we never claim a platform "intends" a harm without strong evidence of intent.

A recurring theme connects all fourteen fields. The behaviour of a recommendation system is determined by the *objective* it is told to maximise and the *interface* through which it reaches a person. Neither of those is a law of nature; both are design choices. That single observation is what makes a healthier system imaginable, and it is what this literature review is here to ground in evidence.

## The fourteen fields

| # | Field | Section file | What it grounds |
|---|-------|--------------|-----------------|
| 1 | Recommendation systems | [01](01-recommender-foundations.md) | What a recommender is and the two core strategies |
| 2 | Collaborative filtering | [01](01-recommender-foundations.md) | Learning from patterns across users |
| 3 | Content-based recommendation | [01](01-recommender-foundations.md) | Learning from item attributes; explainability |
| 4 | Machine learning ranking algorithms | [02](02-ranking-and-deep-recsys.md) | Turning recommendation into ranking |
| 5 | Deep neural recommendation systems | [02](02-ranking-and-deep-recsys.md) | The 2016-onwards deep-learning shift |
| 6 | Large-scale ranking systems | [02](02-ranking-and-deep-recsys.md) | Two-stage pipelines at billion-user scale |
| 7 | Multi-objective optimisation | [02](02-ranking-and-deep-recsys.md) | Where values get encoded as weights |
| 8 | Reinforcement learning | [03](03-reinforcement-learning.md) | Long-horizon behaviour shaping |
| 9 | Behavioural economics | [04](04-behaviour-persuasion-wellbeing.md) | Why we respond; defaults and biases |
| 10 | Persuasive technology | [04](04-behaviour-persuasion-wellbeing.md) | Designing for behaviour change |
| 11 | Digital wellbeing | [04](04-behaviour-persuasion-wellbeing.md) | Tools and their thin evidence base |
| 12 | Child development | [05](05-child-and-adolescent-psychology.md) | The developing mind and its stages |
| 13 | Adolescent psychology | [05](05-child-and-adolescent-psychology.md) | The teenage brain and the contested mental-health debate |
| 14 | Human-computer interaction | [06](06-human-computer-interaction.md) | The interface, attention, and dark patterns |

## Section files

- **[01 - Recommender Foundations](01-recommender-foundations.md)**: recommendation systems, collaborative filtering, content-based recommendation.
- **[02 - Ranking and Deep Recommendation Systems](02-ranking-and-deep-recsys.md)**: ML ranking algorithms, deep neural recommenders, large-scale ranking, multi-objective optimisation.
- **[03 - Reinforcement Learning for Recommendation](03-reinforcement-learning.md)**: RL foundations and RL applied to feeds.
- **[04 - Behaviour, Persuasion, and Digital Wellbeing](04-behaviour-persuasion-wellbeing.md)**: behavioural economics, persuasive technology, digital wellbeing.
- **[05 - Child and Adolescent Psychology](05-child-and-adolescent-psychology.md)**: child development, adolescent psychology, and the contested social-media debate.
- **[06 - Human-Computer Interaction](06-human-computer-interaction.md)**: HCI, attention, design, dark patterns.

## How to use this part

Researchers should read the sections in order and follow the references. Engineers may want to start with sections 02 and 03, then jump to the code in Parts 5 and 6. Anyone writing for children or teachers should read sections 04, 05, and 06, where the human stakes and the design levers are clearest. Throughout, watch the labels: the difference between what is *established*, what is *inferred*, and what is *contested* is the most important thing this review has to teach.
