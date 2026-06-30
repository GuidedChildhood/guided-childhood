# Glossary

Plain-language definitions of every technical term used in this repository. Where a term has a child-friendly version, we give that first, then the precise version.

---

**Algorithm.** A set of step-by-step rules a computer follows to make a decision. A recommendation algorithm decides what to show you next.

**A/B test.** An experiment where some users see version A and others see version B, so a company can measure which one performs better on a chosen metric.

**Bandit (multi-armed bandit).** A way for a system to choose between options when it is unsure which is best. It balances trying new options (exploration) against repeating what already works (exploitation). The name comes from imagining a row of slot machines, each with unknown payouts.

**Candidate generation (retrieval).** The first stage of a feed. Out of millions of possible items, the system quickly gathers a few hundred or thousand that might be relevant, before ranking them. Think of it as the shortlist.

**Cold start.** The problem of recommending to a brand new user or for a brand new item, when there is little or no history to learn from.

**Collaborative filtering.** Recommending things based on what similar people liked. "People who liked what you like also liked this." It uses patterns across many users rather than the content itself.

**Content-based recommendation.** Recommending things that are similar in content to what you already engaged with, using features of the items themselves (topic, words, sound, images).

**Cosine similarity.** A maths way to measure how alike two lists of numbers are, used to compare a person's tastes with an item's features. Closer to 1 means more alike.

**Dark pattern.** A design choice that nudges people into doing something they did not really intend, such as infinite scroll or hard-to-find unsubscribe buttons.

**Deep neural network.** A flexible kind of machine learning model, loosely inspired by brain cells, made of many layers that learn patterns from data. Used in modern recommenders to predict what you will engage with.

**Dwell time.** How long you linger on a piece of content, even without clicking. A common implicit signal of interest.

**Echo chamber.** A situation where you mostly see views and topics you already agree with, because the feed keeps showing more of the same. Related to the filter bubble.

**Embedding.** A way of turning something complicated (a video, a song, a user) into a short list of numbers that captures its meaning, so a computer can compare and search them quickly.

**Engagement.** Any measurable interaction: a click, a watch, a like, a comment, a share. Many systems are trained to increase engagement.

**Engagement optimisation.** Designing or training a system to maximise engagement signals. It can improve relevance, and it can also have side effects, such as favouring content that holds attention regardless of whether it is good for you.

**Epsilon-greedy.** A simple exploration rule. Most of the time pick the best-known option, but a small fraction of the time (epsilon) pick something random to keep learning.

**Exploitation.** Showing you more of what the system already believes you like.

**Exploration.** Showing you something new to learn more about your tastes, even if it is a gamble.

**Feature.** A single piece of information the model uses to make a prediction, for example time of day, video length, or your past watch time on a topic.

**Feedback loop.** When what you do changes what you are shown, which changes what you do next, and so on. The core engine of personalisation, and the reason feeds can drift or narrow.

**Filter bubble.** A term popularised by Eli Pariser for the idea that personalisation can isolate you in your own informational world. The research on how strong this effect really is, is contested.

**Gradient boosted trees.** A popular, powerful machine learning method built from many small decision trees. Often used for ranking.

**Ground truth.** The real answer you are trying to predict or measure, against which a model is judged.

**Implicit feedback.** Signals you give without meaning to, such as watch time, pauses, and scroll speed. Contrasted with explicit feedback like a like or a rating.

**Matrix factorisation.** A classic recommendation technique that explains the big table of who-liked-what using a small number of hidden factors. It powered the famous Netflix Prize.

**Multi-objective optimisation.** Trying to do well on several goals at once, for example relevance, diversity, and watch time, which often pull in different directions. The system has to trade them off.

**Multi-task learning.** Training one model to predict several things at once (will you click, will you finish, will you like), which can be more efficient and accurate. MMoE is one well-known design.

**Objective function (loss function).** The single number a system is trying to make as big (or as small) as possible. It is the system's definition of success. Choosing it well is most of the ethics.

**Off-policy evaluation.** Estimating how a new recommendation strategy would perform using data collected under the old strategy, without having to deploy it first. Hard but important.

**Personalisation.** Tailoring what is shown to each individual based on their data and behaviour.

**Proxy metric.** A measurable stand-in for something you actually care about but cannot measure directly. Watch time is a proxy for satisfaction. Proxies can be gamed, which is Goodhart's law.

**Ranking.** The second stage of a feed. The shortlist of candidates is put into an order, usually by predicting how likely you are to engage with or value each one.

**Recommendation system (recommender).** The whole machine that decides what to show you: signals in, candidates generated, items ranked, results shown, feedback collected, repeat.

**Reinforcement learning (RL).** A type of machine learning where an agent learns by trial and error to maximise a long-term reward. Some recommenders use it to optimise for outcomes over a whole session, not just the next click.

**Reward.** In reinforcement learning, the number the agent is trying to accumulate. Designing the reward is where values get encoded.

**Reward hacking.** When a system finds a way to score highly on its objective that misses the real intent, like a student memorising the test instead of learning the subject.

**Selection bias.** When the data a model learns from is shaped by past decisions of the system itself, for example you only have watch data for videos that were already recommended.

**Session.** A single stretch of using an app. Session length is a common engagement metric.

**Signal.** Any piece of data about you or your behaviour that the system can use. See Part 3 for a full map of behavioural signals.

**Two-tower model.** A common retrieval design with one neural network for the user and one for the item, so their embeddings can be compared quickly at large scale.

**UCB (upper confidence bound).** An exploration rule that prefers options that are either known to be good or still uncertain, by adding a bonus for uncertainty. A smarter alternative to epsilon-greedy.

**Watch time.** Total time spent watching. A heavily used training target for video recommenders because it is frequent, low-effort, and predictive.

---

*New terms are added to this glossary the first time they appear in a document. If a term you need is missing, that is a bug worth reporting.*
