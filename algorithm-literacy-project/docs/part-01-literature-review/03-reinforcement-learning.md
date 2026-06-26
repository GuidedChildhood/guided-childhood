# Reinforcement Learning for Recommendation

*Reinforcement learning foundations, and reinforcement learning applied to recommendation.*

## Introduction

Reinforcement learning (RL) studies how an agent should act in an environment to maximise cumulative reward over time. Unlike the supervised ranking models of the previous section, which predict a label for a single item, RL is concerned with *sequences* of decisions and their long-run consequences. The canonical formalism is the Markov decision process: states, actions, a reward signal, and a transition model. The agent learns a *policy* (a mapping from states to actions) that maximises expected discounted future reward (Sutton and Barto, 2018). This framing fits feeds unusually well: each recommendation is an action, the user's response is a reward, the user's evolving interest is the state, and the platform cares about the whole session and the user's return tomorrow, not a single click. For children, RL is the part of the literature most directly about *long-term behaviour shaping*, which is exactly the thing a guardian most wants to understand.

## Key findings

**RL with deep function approximation became practical in 2015.** Mnih and colleagues showed that a single deep Q-network, learning only from pixels and score, could reach human-level play across many Atari games, demonstrating that RL could scale to high-dimensional state spaces with neural function approximators. [ESTABLISHED] A deep Q-network learned control policies directly from high-dimensional sensory input and reached human-level performance on many Atari games (Mnih et al. 2015).

**Recommendation can be cast as long-horizon optimisation.** Treating recommendation as RL means optimising for cumulative engagement (session length, day-over-day return) rather than the immediate click. [INFERENCE] A recommender trained on a long-horizon reward such as return-visit probability will favour items that keep a user coming back, which can differ markedly from items that maximise the next click; this follows directly from the RL objective, though the magnitude of the difference in any deployed system is not publicly measured.

**Off-policy correction made RL feasible on real logs.** A live feed cannot freely experiment on users, so RL recommenders must learn from data logged by a *previous* policy. Chen and colleagues (2019) built a top-K REINFORCE recommender for YouTube and introduced an off-policy correction to account for the mismatch between the policy that generated the logs and the policy being learned. They reported that this was among the most impactful changes to their system in live experiments. [ESTABLISHED] A policy-gradient (REINFORCE) recommender with top-K off-policy correction produced significant live engagement gains at YouTube scale (Chen et al. 2019).

**Recommending a whole slate is combinatorially hard, and decomposable.** Real feeds present a *set* (a slate) of items, not one, and the value of a slate is not the sum of its parts. Ie and colleagues (2019) introduced SlateQ, which decomposes the value of a slate into per-item terms under reasonable user-choice assumptions, making RL over slates tractable and trainable from logged data. [ESTABLISHED] SlateQ decomposed slate value into learnable per-item components, enabling tractable RL for recommendation sets (Ie et al. 2019).

**The reward signal is the value statement.** Everything an RL recommender does flows from what it is told to maximise. [INFERENCE] If the reward is cumulative watch time, the policy will, as a side effect, learn behaviours that extend sessions, including surfacing content late at night when the objective is still being optimised; this is a direct consequence of the objective, not evidence that anyone intended to keep children awake. The same architecture trained on a different reward (for example, next-day reported mood, or course completion) would learn different behaviour.

## Key papers

- **Sutton & Barto (2018), "Reinforcement Learning: An Introduction" (2nd ed.), MIT Press.** The standard textbook for the foundations.
- **Mnih et al. (2015), "Human-level control through deep reinforcement learning", Nature.** Deep RL at scale. doi:10.1038/nature14236.
- **Chen et al. (2019), "Top-K Off-Policy Correction for a REINFORCE Recommender System", WSDM 2019.** RL recommendation learned from production logs. arXiv:1812.02353.
- **Ie et al. (2019), "SlateQ: A Tractable Decomposition for Reinforcement Learning with Recommendation Sets", IJCAI 2019.** Tractable RL over slates.

## Limitations of the research

RL for recommendation is genuinely difficult and the published successes are narrow. [CONTESTED] How much of large platforms' ranking is truly reinforcement learning versus supervised multitask ranking with engagement labels is not publicly settled, and outside observers cannot resolve it from the products alone. Off-policy evaluation remains hard: estimating how a new policy would perform without deploying it is an open problem, and offline RL can be unstable. Reward specification is the deepest limitation; a reward that is easy to log (watch time) may be a poor proxy for what anyone actually wants, and there is little public, peer-reviewed work measuring the long-term effects of RL feeds on real users, let alone children specifically. Most safety and value-alignment work in RL is recent and not yet validated in deployed consumer recommenders.

## Practical implications for healthier systems for children

- **The reward is the lever.** Because an RL feed's behaviour is determined by its reward, the single most important child-safety intervention is choosing a reward that proxies wellbeing rather than raw engagement. This is hard but conceptually clear.
- **Long horizons can help as well as harm.** The same long-horizon machinery that can entrench a habit could optimise for genuinely good long-run outcomes (a child who reads more, sleeps better, returns to a hobby) if the reward measures those.
- **Off-policy learning enables safe iteration.** The techniques that let platforms learn from logs without risky live experiments also let a child-safe product test wellbeing-oriented policies more cautiously.
- **Distinguish side effect from intent in teaching.** RL is the clearest place to teach children that a feed "optimises an objective" rather than "wants" anything, which is the core literacy lesson of this whole repository.

## References

1. Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
2. Mnih, V., et al. (2015). Human-level control through deep reinforcement learning. *Nature*, 518, 529-533. doi:10.1038/nature14236.
3. Chen, M., Beutel, A., Covington, P., Jain, S., Belletti, F., & Chi, E. H. (2019). Top-K off-policy correction for a REINFORCE recommender system. *Proceedings of the 12th ACM International Conference on Web Search and Data Mining (WSDM)*. arXiv:1812.02353.
4. Ie, E., et al. (2019). SlateQ: A tractable decomposition for reinforcement learning with recommendation sets. *Proceedings of the 28th International Joint Conference on Artificial Intelligence (IJCAI)*.
