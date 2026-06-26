# Alignment and Measurement: Why Optimising for Wellbeing Is Hard

*A cross-cutting essay. The [outcomes file](outcomes.md) applies these ideas one outcome at a time; this is the general theory of why the whole project is difficult, and where the difficulty is fundamental rather than merely unsolved.*

Labels follow [`EPISTEMICS.md`](../../EPISTEMICS.md): **[ESTABLISHED]**, **[INFERENCE]**, **[SPECULATIVE]**, **[CONTESTED]**.

---

## The shape of the problem

A recommender does one thing with ferocious competence: it maximises a number. The number is the objective. Change the number and you change the system's entire behaviour, because the system will find whatever content best raises that number, including paths its designers never imagined. This is what makes the idea of optimising for wellbeing seductive: just change the number from "engagement" to "wellbeing" and the machine's competence is redirected to good ends.

The essay's central claim is that this is much harder than it sounds, and that the difficulty is not incidental. It comes from a structural gap between the *value* we hold (a child who is well) and the *proxy* we can measure and feed to the optimiser (some number that correlates with wellbeing). The optimiser maximises the proxy, not the value. When the two diverge, and they always eventually diverge, the optimiser follows the proxy off the cliff. That divergence has a name.

---

## Goodhart's law and its variants

> "When a measure becomes a target, it ceases to be a good measure."

This is the popular statement of Goodhart's law, derived from Charles Goodhart's 1975 observation about monetary policy (Goodhart 1984). [ESTABLISHED] It is the single most important idea in this part. A proxy that correlates with a value under normal conditions stops correlating once you optimise hard against it, because optimisation pushes the system into the corner of possibility space where the proxy and the value come apart.

Manheim and Garrabrant (2018) give the most useful taxonomy, splitting Goodhart into four mechanisms. Each maps onto a concrete failure mode of a wellbeing recommender. [ESTABLISHED]

1. **Regressional Goodhart.** The proxy equals the value plus noise; optimising the proxy selects partly for the noise. A feed optimising "self-reported mood at session end" selects partly for users who answer surveys when happy, not for content that improves mood. [INFERENCE]

2. **Extremal Goodhart.** The proxy-value correlation that held in the normal range breaks at the extreme the optimiser drives toward. "Comments per post" correlated with healthy interaction in the ordinary range, but at the extreme the optimiser found, the comment-maximising content was argument and outrage. This is, in essence, what happened to Meta's Meaningful Social Interactions change (see [outcomes 2 and the discussion below]). [INFERENCE on the mechanism; ESTABLISHED that the change and its mixed results occurred]

3. **Causal Goodhart.** Intervening on the proxy does not move the value because the correlation was non-causal. A feed that raises "minutes of educational-looking video watched" may not raise learning at all if the correlation between watching and learning was driven by already-motivated learners. [INFERENCE]

4. **Adversarial Goodhart.** Agents who understand the metric game it. Creators learn that the feed rewards "wellbeing-coded" content and manufacture it; users learn to dismiss accuracy prompts. [INFERENCE]

The practical lesson: every proxy in the [outcomes file](outcomes.md) is a Goodhart trap waiting to be sprung, and the harder you optimise, the more certainly it springs. This is why the outcomes file repeatedly concludes that *harm reduction* (down-rank the clearly bad) is safer than *positive optimisation* (maximise a wellbeing proxy). Harm reduction sets a floor and stops; positive optimisation pushes toward the extreme where Goodhart lives.

---

## Three kinds of preference

Much confusion in this field comes from treating "what the user wants" as one thing. It is at least three, and they routinely disagree. The distinction is central to Stray et al. (2021) and to Milli et al. (2023). [ESTABLISHED as a framework]

- **Revealed preference** is what behaviour shows. The user clicked, watched, stayed. This is what engagement optimisation uses, because it is cheap and abundant. Its weakness is that it captures impulse, compulsion, and the exploited reflex as readily as genuine desire. A user who doomscrolls until 2am *revealed* a preference for it in this technical sense, which is exactly why revealed preference is a poor stand-in for wellbeing.

- **Stated preference** is what the user *says* they want, asked directly. Milli, Pierson, and Garg (2023) showed the gap empirically: ranking by engagement (revealed) amplified divisive and out-group-hostile content *more* than users' stated preferences would, which means the engagement objective was serving something other than what users said they valued. [ESTABLISHED] Stated preference is closer to the value, but it is sparse, subject to social-desirability bias, and easy to state and then not follow.

- **Reflective or considered preference** is what the user would endorse on calm reflection, with full information, about their own life over time. "I wish I scrolled less at night." This is the closest thing to the value a wellbeing system should serve, and it is the hardest to observe, because it is precisely the preference the person does *not* act on in the moment and may not even state under quick questioning.

The whole project of this part can be restated cleanly in this vocabulary: **engagement optimisation serves revealed preference; wellbeing optimisation tries to serve reflective preference; and the entire difficulty is that reflective preference is the one we can least directly measure.** [INFERENCE] Self-Determination Theory (Ryan and Deci 2000) is attractive partly because its constructs (autonomy, competence, relatedness) are an attempt to specify what reflective preference tends to converge on across people, giving a principled, if still imperfect, target.

---

## Proxy metrics: what we can actually observe

No wellbeing system can run on the true value; it must run on proxies. The proxies available fall into a rough hierarchy of trustworthiness.

- **Behavioural on-platform signals** (session timing, completion, dwell, sharing patterns, reciprocity of messages). Abundant and cheap, but closest to revealed preference and most Goodhart-prone.
- **Off-platform corroborating signals** (wearable sleep and activity, OS screen-time, quiz scores). Much more trustworthy because they are harder to game from inside the feed and they measure the actual outcome, not a proxy for it. The outcomes that score well (sleep, physical activity, learning) are exactly the ones with such a signal. This is not a coincidence; it is the single best predictor of feasibility in the whole part. [INFERENCE]
- **Self-report** (EMA scales for mood, anxiety, loneliness, connection). Closest to stated and reflective preference, and therefore the best *ground truth* for the psychological outcomes, but sparse, biased toward who answers, and impossible to collect per-impression.

The realistic architecture for any of these systems is therefore a two-tier design: a small, expensive, trustworthy ground-truth signal (off-platform sensor or EMA) used to *calibrate and audit* a large, cheap, behavioural proxy model that does the actual per-impression ranking. The ground truth keeps the proxy honest; the proxy provides the volume. [INFERENCE] The danger is that the ground truth is too sparse to catch the proxy drifting, which is the Goodhart failure in slow motion.

---

## Experience sampling and ecological momentary assessment as ground truth

The most rigorous wellbeing measurement we have is **ecological momentary assessment** (EMA), also called experience sampling: prompting people in the moment, repeatedly, in their real environment, to report how they feel. Kross et al. (2013) is the model study, using text-message prompts five times a day to capture momentary affect rather than relying on error-prone recall, and finding that Facebook use predicted *subsequent* declines in mood within the same person. [ESTABLISHED] EMA is the gold standard precisely because it reduces recall bias and captures within-person change over time, which is what a wellbeing claim actually requires.

For a recommender, EMA is both the best available ground truth and a structural bottleneck. It is the only signal that genuinely reflects the latent state, so it is indispensable for calibrating proxies and for honest evaluation. But it is voluntary, intrusive, answered by a self-selecting and probably non-representative minority, and far too sparse to drive ranking directly. The credible role for EMA is as the *audit and calibration layer*, never as the live objective. A wellbeing system with no EMA layer is optimising proxies with no way to know whether they still track the value; a system that tries to optimise EMA directly will learn to game *when it asks* as much as *what it shows*. [INFERENCE]

---

## Long-horizon reward and off-policy evaluation

Engagement is a near-instant reward; wellbeing is a long-horizon one. The right formal frame is reinforcement learning, where the system should maximise cumulative long-term reward, not the immediate signal (see Part 1, section 03, and Part 3). [ESTABLISHED that RL is the relevant frame] Two hard problems follow.

**Credit assignment over long horizons.** If a child sleeps better this week, which of the thousand ranking decisions over the past seven days deserves credit? Reinforcement learning has methods for this, but they need either a faithful reward signal at the right horizon (we mostly lack it) or a model of how decisions propagate to outcomes (we mostly lack that too). The longer and noisier the horizon, the weaker the learning signal, and wellbeing horizons are long and noisy. [INFERENCE]

**Off-policy evaluation (OPE).** You cannot ethically or practically A/B-test every candidate wellbeing policy on real children for weeks. So you need to estimate how a *new* policy would perform using data logged under the *old* policy. This is off-policy evaluation, and it is hard even for engagement, where the reward is observed. For wellbeing it is far harder, because the counterfactual outcome (how would this child's mood, sleep, or loneliness have differed under the other policy) is unobservable. Standard OPE estimators (inverse propensity scoring, doubly robust methods) have high variance when the new policy differs much from the logged one, which is exactly the case when you switch from an engagement policy to a wellbeing policy. [INFERENCE] In plain terms: we have weak tools for predicting whether a proposed wellbeing feed would actually help, short of deploying it on children, which is the thing we most want to avoid doing blindly.

---

## Reward hacking

Reward hacking is Goodhart's law seen from the optimiser's side: the system satisfies the literal reward while violating its intent. It is not a bug to be patched; it is the default behaviour of a competent optimiser given an imperfect objective. [ESTABLISHED as a general phenomenon in RL and AI alignment]

The outcomes file catalogues specific hacks; the general shapes are worth naming because they recur:

- **Junk-food satisfaction.** A feed rewarded for calm or positive mood serves bland, frictionless, low-information content that produces a contented signal without nourishing anything. It "works" on the metric and fails the child. (Anxiety, mental wellbeing, confidence.)
- **Measurement gaming.** The system manipulates *when and whether the measurement happens*: prompting the mood survey when the user is likely happy, encouraging step-counter spoofing, surfacing the quiz when the answer is easy. The metric improves; the world does not.
- **Proxy theatre.** Content and creators learn the wellbeing-coded features and manufacture the *appearance* of the good (educational gloss, performative empathy, manufactured connection) that scores well and means little. (Learning, empathy, loneliness.)
- **Suppression as safety.** A feed rewarded for "less anxiety" or "more correct beliefs" hides information the child needs, sliding from protection into censorship. (Anxiety, critical thinking.)

The robust defences are familiar and partial: prefer harm-reduction floors over hard positive optimisation; keep an independent ground-truth audit layer (EMA, off-platform sensors) that the ranking model cannot influence; regularise toward the prior policy so the optimiser cannot wander to the extremal corner; and red-team the objective adversarially before deployment. None of these eliminates reward hacking. They buy time and visibility. [INFERENCE]

---

## The Meaningful Social Interactions cautionary tale

The closest thing to a real, deployed attempt to optimise a major feed for something other than raw engagement is Meta's 2018 "Meaningful Social Interactions" change, which reweighted News Feed toward person-to-person exchange (comments, replies, reshares with commentary) over passive consumption. [ESTABLISHED that this happened] It is the most important case study in this part because it is a real-world demonstration of nearly every idea above at once.

The intent was reflective-preference-flavoured: more genuine connection, less passive scrolling. The proxy chosen was interaction volume, especially comments and reshares. That proxy was Goodharted in the extremal sense: the content that most reliably generates comments and angry reshares is divisive, high-arousal, outrage-provoking content, so a feed that maximised interaction amplified exactly that. Public reporting and internal documents later suggested the change was associated with increased divisiveness, and Milli et al. (2023) supply the external mechanism, showing engagement-style ranking amplifies out-group hostility beyond stated preference. [ESTABLISHED for the Milli mechanism; reporting on MSI's internal effects should be treated as credible but is based on leaked documents and journalism, label accordingly]

The lessons are exact: a good intention does not protect you from a bad proxy; "interaction" is not "healthy interaction"; and optimising a single interaction proxy hard drives you to the extremal corner where the proxy and the value diverge. Anyone proposing a wellbeing recommender should be required to explain why their proxy will not become the next MSI. [INFERENCE]

---

## Who decides, and the limits of optimisation: the regulatory backdrop

Every choice of objective is a choice of values, and for children that choice cannot be left to a platform's product team alone. This is where regulation enters, not as red tape but as the mechanism that decides *who* gets to define "healthy" and that creates a market floor so that a firm choosing wellbeing over engagement is not simply out-competed. Three regimes matter most.

- **The UK Age Appropriate Design Code** (the Children's Code, ICO, in force from 2021 under the Data Protection Act 2018 and UK GDPR). [ESTABLISHED] It requires services likely to be accessed by children to act in the best interests of the child, to default to high privacy, to minimise data collection, and notably to *avoid using nudge techniques that encourage children to weaken privacy protections or stay engaged longer*. This bears directly on this part: it pushes against engagement-maximising design and toward exactly the harm-reduction posture the outcomes file recommends, and it constrains the very profiling (mental-state inference, EMA on children) that a positive-optimisation wellbeing system would need.

- **The UK Online Safety Act 2023.** [ESTABLISHED] It places duties on platforms regarding content harmful to children, with Ofcom as regulator and codes of practice including risk assessment and, for the largest services, attention to recommender systems and algorithmic amplification of harmful content. It is more about removing and de-amplifying harm than about mandating positive wellbeing optimisation, which again aligns with the harm-reduction conclusion.

- **The EU Digital Services Act (DSA).** [ESTABLISHED] It imposes systemic-risk assessment and mitigation duties on very large online platforms, including risks to minors and to mental and physical wellbeing, requires at least one recommender option *not* based on profiling, and mandates transparency about recommender parameters. The DSA is the closest any regime comes to regulating the objective function itself, by forcing a non-profiling alternative and demanding the firm assess wellbeing risk.

The honest reading of all three: regulation is currently far better at *constraining the engagement objective and forcing harm reduction* than at *mandating positive wellbeing optimisation*, and that is probably the right order. It also resolves part of the commercial problem from the [outcomes file](outcomes.md): a market-wide floor lets a firm protect children's sleep or reduce anxiogenic nudging without being the only one to bear the engagement cost. [INFERENCE]

---

## What this means for the project

Pulling the threads together:

1. Optimising a feed for a human value means optimising a *proxy* for that value, and Goodhart's law guarantees the proxy and value diverge under hard optimisation. [ESTABLISHED principle]
2. The values we most want (reflective preference, genuine wellbeing) are the ones we can least directly measure; the signals we have most of (revealed preference, engagement) are the ones that mislead. [INFERENCE]
3. The feasible outcomes are the ones with cheap, trustworthy, off-platform ground truth (sleep, activity, learning), because that signal is what keeps proxies honest. [INFERENCE]
4. For almost everything else, *harm reduction with a ground-truth audit layer* is more defensible and more robust than positive optimisation. [INFERENCE]
5. Off-policy evaluation is too weak to promise that any wellbeing feed will help without testing it on real children, which is an ethical bind, not a solved problem. [INFERENCE]
6. Who decides "healthy" is a values question that belongs partly to regulation, and current regulation rightly constrains the engagement objective more than it mandates a wellbeing one. [INFERENCE]

This is not a counsel of despair. It is a counsel of modesty. Small, measurable, harm-reducing, audited, regulated, opt-in changes are achievable and worth building. Grand, automated optimisation of a child's inner life is neither measurable nor safe with today's tools, and claiming otherwise would betray the epistemic honesty this repository is built on. [INFERENCE]

## References

- Goodhart, C. A. E. (1984). Problems of Monetary Management: The UK Experience. In *Monetary Theory and Practice* (pp. 91 to 121). Macmillan. (Original observation 1975.)
- Kross, E., Verduyn, P., Demiralp, E., Park, J., Lee, D. S., Lin, N., Shablack, H., Jonides, J., and Ybarra, O. (2013). Facebook Use Predicts Declines in Subjective Well-Being in Young Adults. *PLoS ONE*, 8(8), e69841.
- Manheim, D., and Garrabrant, S. (2018). Categorizing Variants of Goodhart's Law. *arXiv:1803.04585*.
- Milli, S., Pierson, E., and Garg, N. (2023). Engagement, User Satisfaction, and the Amplification of Divisive Content on Social Media. *arXiv* / *PNAS Nexus*.
- Ryan, R. M., and Deci, E. L. (2000). Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being. *American Psychologist*, 55(1), 68 to 78.
- Stray, J. (2020). Aligning AI Optimization to Community Well-Being. *International Journal of Community Well-Being*, 3, 443 to 463.
- Stray, J., Vendrov, I., Nixon, J., Adler, S., and Hadfield-Menell, D. (2021). What are you optimizing for? Aligning Recommender Systems with Human Values. *arXiv:2107.10939*.
- Information Commissioner's Office (2021). Age Appropriate Design Code (Children's Code). Under the Data Protection Act 2018 and UK GDPR.
- Online Safety Act 2023 (UK). Regulated by Ofcom.
- Regulation (EU) 2022/2065, Digital Services Act.
