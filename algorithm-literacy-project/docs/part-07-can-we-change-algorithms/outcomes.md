# The Twelve Outcomes

*For each outcome: a review of existing evidence, technical feasibility, engineering challenges, ethical concerns, and an honest estimate of commercial viability.*

This file is the detailed companion to the [README](README.md) and the cross-cutting [alignment essay](alignment-and-measurement.md). Read the alignment essay first if you want the general theory of why optimising for any of these is hard; this file applies that theory outcome by outcome. Labels follow [`EPISTEMICS.md`](../../EPISTEMICS.md): **[ESTABLISHED]**, **[INFERENCE]**, **[SPECULATIVE]**, **[CONTESTED]**.

A recurring caveat applies to all twelve. The evidence linking *media use in general* to these outcomes is much larger than the evidence linking *a specific feed-design intervention* to them. Almost nobody has run the experiment that matters most, which is: hold a population on the same platform, change only the ranking objective, and measure a wellbeing outcome over weeks. So for every outcome we are reasoning from adjacent evidence to a feasibility claim, and we label that move honestly.

---

## 1. Mental wellbeing

**Scores: Evidence base Medium · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

"Mental wellbeing" is the hardest target precisely because it is the broadest. It bundles mood, life satisfaction, depression and anxiety symptoms, and self-worth into one construct. The evidence linking social media to it is real but contested. Correlational work finds associations that are statistically reliable but small in average magnitude: Orben and Przybylski (2019), using specification-curve analysis across large datasets, found the average association between digital technology use and adolescent wellbeing to be tiny, comparable to the effect of wearing glasses, and argued much prior alarm was overstated. [CONTESTED] At the same time, experimental and longitudinal work points to genuine causal effects in at least some directions: Kross et al. (2013) found that more Facebook use predicted *declines* in moment-to-moment affect and life satisfaction in young adults, using experience sampling rather than recall. [ESTABLISHED for that sample] Allcott et al. (2020), a large deactivation randomised controlled trial, found that four weeks off Facebook improved self-reported wellbeing and happiness while reducing factual news knowledge, a clean causal result. [ESTABLISHED] The fair summary is that effects exist, vary by person and by use pattern, and are on average modest, with a contested but plausible larger tail for vulnerable subgroups. [CONTESTED]

### Technical feasibility

To optimise a feed for mental wellbeing you must first measure it. The only direct measurement is self-report: validated short scales (WHO-5, PHQ for depression, GAD for anxiety) delivered through in-app experience sampling or ecological momentary assessment (EMA). These are the closest thing to ground truth (see the [alignment essay](alignment-and-measurement.md)), but they are sparse, voluntary, and answered by a biased minority. Proxy signals exist but are weak: session-end sentiment, late-night use, doomscroll patterns, sentiment of content consumed, switching to other apps. Self-Determination Theory (Ryan and Deci 2000) offers a more principled proxy set: behavioural indicators of autonomy (user-initiated versus algorithm-pushed sessions), competence, and relatedness (genuine reciprocal interaction versus passive consumption) correlate with wellbeing and are partly observable. [INFERENCE] A credible system would optimise a *blend*: a small ground-truth EMA signal used to calibrate a much larger model of proxy signals, with the proxies doing the per-impression ranking and the EMA keeping the proxies honest.

### Engineering challenges

This is the worst-case alignment problem. Measurement is sparse and self-selected, so the model learns the wellbeing of survey-answerers, not of everyone. The horizon is long: a feed's effect on mood compounds over days, far beyond any training loop. Reward hacking is severe and subtle: a feed told to raise reported mood can learn to surface bland, frictionless, low-information content (a "junk-food calm"), or worse, to selectively prompt the survey when the user happens to be in a good mood. Off-policy evaluation is treacherous because counterfactual mood is unobservable. Privacy cost is high: inferring mental state from behaviour is exactly the kind of sensitive profiling that data-protection regimes restrict for children.

### Ethical concerns

Inferring a child's mental state from their scrolling is surveillance of the most intimate kind, and doing it to *improve* them is paternalism with a benevolent face. Who defines wellbeing matters enormously: a feed tuned to a clinical depression scale encodes one culture's model of a healthy mind. There is real risk of pathologising ordinary sadness, or of a system that detects distress and then must decide whether to act, escalate, or stay silent, each with liability and consent implications. Value pluralism cuts deep here: a contemplative, melancholic, or intensely focused inner life is not a malfunction.

### Commercial viability

Low. Mental wellbeing as a global optimisation target is too diffuse to measure cheaply and too easy to hack to trust. It almost certainly reduces short-term engagement (the deactivation evidence suggests the most wellbeing-positive feed might be a smaller one). No ad-funded firm will adopt it voluntarily. The only realistic homes are a paid, child-specific subscription product where parents are buying *less* compulsive use as the feature, or a clinical or school context with consent and oversight. Even there, "we optimise your child's mental health" is a promise that invites regulatory and liability scrutiny a startup should fear.

---

## 2. Healthy friendships

**Scores: Evidence base Medium · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

The relevant distinction in the research is between *active, reciprocal, directed* social use and *passive consumption*. Reviews of the displacement and stimulation hypotheses find that online interaction can support friendships when it deepens existing relationships and harm them when it displaces face-to-face contact or substitutes parasocial feeds for real exchange. [CONTESTED] The single most instructive real-world attempt to optimise for relationships rather than raw engagement is Meta's 2018 "Meaningful Social Interactions" (MSI) change, which reweighted News Feed toward comments, replies, and exchanges between people over passive video consumption. [ESTABLISHED that the change happened] Its results were genuinely mixed: internally and in later reporting it was associated with amplification of divisive and high-arousal content, because comment-generating content is disproportionately content that provokes argument. Milli, Pierson, and Garg (2023) provide the sharpest external evidence for the underlying mechanism, showing that ranking by engagement signals amplifies divisive and out-group-hostile content *more* than users' own stated preferences would, which is exactly the failure mode MSI risked. [ESTABLISHED] The lesson is sobering: an honest attempt to optimise for "interaction" used a proxy (comments) that was Goodharted into "argument."

### Technical feasibility

Proxy signals for friendship quality are richer than for most outcomes because interaction is on-platform and observable: reciprocity (do messages flow both ways), directedness (one-to-one or small-group versus broadcast), persistence (relationships sustained over months), and balance (not dominated by one party). A friendship-positive recommender would up-rank content that prompts reciprocated, directed, sustained exchange and down-rank one-to-many broadcast and parasocial consumption. The graph structure helps: strong-tie reinforcement is measurable in a way that "feeling connected" is not.

### Engineering challenges

The MSI story *is* the engineering challenge. "Interaction" is a proxy, and the gap between interaction and *healthy* interaction is enormous: harassment is high-reciprocity, pile-ons are high-comment, and toxic group chats are persistent. Any reward built from interaction counts must be heavily penalised by sentiment and conflict detection, which are themselves error-prone. Long-horizon: a healthy friendship is a fact about years. Off-policy evaluation of "would this child's friendships be healthier" is essentially impossible from logs. Privacy: measuring friendship quality means reading the texture of children's private exchanges.

### Ethical concerns

Defining a "healthy friendship" for a child is a value judgement adults disagree about. A system that nudges toward strong existing ties may entrench cliques and isolate the already-isolated. Surveillance of children's social graphs to score their relationships is intrusive even when well-meant. There is a real autonomy cost in an algorithm steering who a young person grows closer to.

### Commercial viability

Low. MSI is the cautionary tale: the closest thing to a deployed attempt cost engagement, generated controversy, and arguably backfired. The reciprocal-friendship framing is most viable inside a small, closed, age-appropriate product (a child-safe messaging or community app) where the business model is trust and safety, not reach, and where the graph is small enough to reason about.

---

## 3. Better sleep

**Scores: Evidence base High · Measurability Medium · Feasibility Medium · Commercial viability Medium**

### Evidence review

Sleep is the outcome with the strongest and least contested evidence base, which is why it scores highest overall. Carter et al. (2016), a meta-analysis in *JAMA Pediatrics* covering more than 125,000 children, found that bedtime media device use was associated with inadequate sleep quantity, poor sleep quality, and excessive daytime sleepiness, with the presence of a device in the sleep environment harmful even without active use. [ESTABLISHED] Twenge and Campbell's work links the rise in adolescent screen time to declines in sleep duration. [CONTESTED on the causal magnitude, ESTABLISHED on the association] The mechanisms are well understood: displacement of sleep time, pre-sleep arousal from high-stimulation content, and the autoplay and notification design patterns that extend sessions past bedtime. Crucially, the harm here is partly *temporal and behavioural* rather than psychological, which makes it far more measurable than mood.

### Technical feasibility

This is the most tractable target in the set because the proxy is almost the outcome. The feed already knows the local time, the user's typical sleep window (inferable from inactivity patterns), session length, and content arousal level. A sleep-positive recommender would, near bedtime, taper arousal, suppress autoplay and infinite scroll, withhold notifications, and at the limit serve a soft stop. Corroborating off-platform ground truth is available and cheap: a wearable or phone-OS sleep estimate, used to calibrate the on-platform proxy. This off-platform signal is what lets sleep escape the worst of the measurement problem.

### Engineering challenges

Reward hacking is comparatively benign: the main failure is that the user simply switches to another app, so the platform's measured "improvement" is illusory while the child's sleep is unchanged. This is why off-platform calibration matters. The horizon is short (next-day sleep), which suits training loops. Privacy is moderate: bedtime windows and sleep estimates are sensitive but less so than mental-state inference, and OS-level sleep APIs already exist with user consent.

### Ethical concerns

Lowest of the set, but not zero. A feed enforcing bedtime is paternalistic and may clash with family practice, shift work in older users, or cultural norms about sleep. Consent and override matter: a young person should be able to see and adjust the bedtime model. Inferring a sleep schedule is still surveillance of the home. But "we help your child stop scrolling at night" is a value most parents share, which softens the pluralism problem.

### Commercial viability

Medium, and the best in the set. A sleep-protective mode is a *sellable feature*: parents will pay for, and platforms can market, "winds down at bedtime." It plainly reduces late-night engagement, the most valuable engagement for ad inventory, so it will not emerge from an ad-funded incentive alone. But it aligns neatly with regulation (the UK Age Appropriate Design Code explicitly discourages nudge techniques and features that extend children's sessions) and with a subscription or device-maker model. Apple and Google ship sleep and downtime features already; a recommender-level version is a credible extension.

---

## 4. Learning

**Scores: Evidence base High · Measurability Medium · Feasibility Medium · Commercial viability Medium**

### Evidence review

Learning is the outcome where there is a mature, separate field to borrow from: educational technology, intelligent tutoring systems, and the learning-sciences literature on spaced repetition, retrieval practice, and the expertise-reversal effect. Adaptive learning systems that sequence content to a learner's demonstrated mastery have decades of evidence for improving measured learning outcomes. [ESTABLISHED] The harder claim is that a *general entertainment feed* could be steered to teach. Here the evidence is thinner: informal learning from video (the YouTube "explainer" ecosystem) is real but uneven, and self-selected. The key insight is that learning, unlike mood, has a natural ground-truth signal: a quiz, a demonstrated skill, a recall test. That puts it among the measurable outcomes.

### Technical feasibility

A learning-positive recommender resembles a tutoring system more than a social feed. Proxies: topic coverage and diversity, difficulty progression matched to inferred mastery, spacing of revisited concepts, and crucially *retention checks* (lightweight quizzes or recall prompts) that supply ground truth. The reward is improvement on those checks over time, not time-on-task. Knowledge-tracing models (Bayesian knowledge tracing, deep knowledge tracing) already estimate latent mastery from interaction sequences and are directly reusable.

### Engineering challenges

The central trap is confusing *engagement with educational-looking content* for *learning*. A feed rewarded for serving lessons will serve the *feeling* of learning (slick, satisfying, low-effort videos) unless it is anchored to retention tests, and retention tests add friction users dislike. Desirable difficulty is the cruel twist: the content that teaches best often feels worst in the moment, so any short-term satisfaction proxy actively fights the goal. Long-horizon: real learning shows up weeks later. Off-policy evaluation is more feasible than elsewhere because mastery can be tested directly. Privacy: educational performance data on children is highly sensitive and regulated (in the UK and EU, and under sectoral rules elsewhere).

### Ethical concerns

Who chooses the curriculum is a genuine values question, sharper for children than adults. An optimiser deciding what a child should learn next, and inferring their ability, risks tracking, mislabelling, and narrowing. There is a real tension between learner autonomy (interest-led exploration) and optimised sequencing. Surveillance of a child's competence is intimate.

### Commercial viability

Medium. Learning is a *paid category* already (the entire edtech market), so a learning-optimised feed has an honest business model that does not depend on ad engagement. Schools are a natural buyer (see [docs/09] in the wider project on the delivery model). The catch is that a learning feed is a different product from an entertainment feed, and trying to bolt learning optimisation onto an engagement-monetised consumer app will lose to the entertainment objective every time. As a standalone or school product, viable.

---

## 5. Creativity

**Scores: Evidence base Low · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

Creativity is poorly served by the existing evidence. There is psychological work on divergent thinking, on the conditions that foster it (psychological safety, slack time, exposure to varied stimuli, intrinsic motivation per Self-Determination Theory), and a contested literature on whether short-form video harms attention and imaginative play. [CONTESTED] But there is essentially no rigorous work connecting *feed design* to *measured creative output or capacity*. We are reasoning almost entirely from theory.

### Technical feasibility

Two readings, both weak. The first measures *creative consumption*: does the feed expose the user to diverse, novel, cross-domain content rather than a narrowing filter bubble? Diversity and novelty are measurable (embedding-space spread, serendipity metrics already studied in the recsys literature). The second, much harder, measures *creative production*: does the user make things (posts, art, code, music) and improve? Production is observable on creation-oriented platforms but conflating "posts a lot" with "is creative" is a obvious trap.

### Engineering challenges

Measurement is the wall. "Creativity" has no agreed behavioural ground truth at scale; divergent-thinking tests do not fit a feed. Optimising for consumption diversity is feasible but is a proxy for *exposure*, not creativity, and is easily Goodharted into random or incoherent feeds that feel novel but teach nothing. Production proxies reward volume over quality. Long-horizon and unobservable: creative growth is a fact about a person's years.

### Ethical concerns

Defining and scoring a child's creativity is presumptuous and culturally loaded. An algorithm rewarding "creative" output may impose a narrow aesthetic and pressure children to perform creativity for the metric, which is corrosive to the intrinsic motivation that creativity depends on. The autonomy cost is high.

### Commercial viability

Low. There is no clean metric to sell against and no evidence base to back a claim. The most defensible (and modest) commercial version is "a more diverse, less narrowing feed," sold as an anti-filter-bubble feature, which is real but is not the same as optimising for creativity and should not be marketed as such.

---

## 6. Confidence

**Scores: Evidence base Low · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

The relevant constructs are self-esteem, self-efficacy (Bandura), and social comparison. There is reasonable evidence that appearance-focused and comparison-heavy social media use is associated with lower body confidence and self-esteem in adolescents, especially girls, though magnitudes are contested and confounded. [CONTESTED] Self-Determination Theory's *competence* need (Ryan and Deci 2000) is the most usable theoretical hook: experiences of mastery build confidence. But there is no body of work showing a feed can be tuned to raise measured confidence.

### Technical feasibility

Direct measurement requires self-report scales (Rosenberg self-esteem and similar) via EMA, with all the sparsity problems that implies. Proxies are weak and dangerous: a feed could try to *reduce upward social comparison* (down-ranking idealised appearance and status content) and *increase competence experiences* (content the user can act on and succeed at). Reducing comparison is more tractable than raising confidence directly, and is closer to a harm-reduction framing than an optimisation target.

### Engineering challenges

Confidence is a latent trait with sparse, gameable ground truth. The most plausible reward hack is grim: a feed that raises self-reported confidence by flattering the user, surfacing only agreeable content and validation, which is manipulation, not wellbeing. Distinguishing earned confidence from inflated comparison-suppressed confidence is beyond current measurement. Long-horizon and deeply private.

### Ethical concerns

Manipulating a child's self-image, even upward, is ethically fraught: confidence built on algorithmic flattery is fragile and infantilising. Surveillance of self-esteem is intrusive. There is a fine and important line between *removing a harm* (less appearance comparison) and *engineering a feeling* (more confidence), and only the former is defensible.

### Commercial viability

Low as an optimisation target. The harm-reduction version (less appearance and social-comparison pressure) is more saleable and aligns with regulation aimed at protecting children from content that harms self-image, but "we boost your child's confidence" is a claim no responsible product should make.

---

## 7. Empathy

**Scores: Evidence base Low · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

Empathy research distinguishes cognitive empathy (perspective-taking) from affective empathy (shared feeling). There is media-effects work suggesting narrative and perspective-taking content can increase prosocial attitudes and that dehumanising or out-group-hostile content can erode them. [CONTESTED] Milli et al. (2023) is again relevant in the negative: engagement ranking amplifies out-group-hostile content beyond user preference, so the *default* objective actively works against empathy. [ESTABLISHED for that mechanism] But there is no evidence base for a feed that *raises measured empathy*.

### Technical feasibility

Direct measurement of empathy at scale is not realistic; validated instruments (Interpersonal Reactivity Index) cannot be run per-impression. Proxies are crude: prosocial versus hostile content classification, exposure to diverse perspectives and out-groups, sentiment of the user's own contributions. The most credible move is *defensive*: down-rank dehumanising and out-group-hostile content, which is a content-safety task, rather than optimising for empathy as a positive metric.

### Engineering challenges

No usable ground truth. Empathy is among the most latent of all these constructs. Reward hacking is severe: a feed rewarded for "empathetic engagement" can surface emotionally manipulative content (exploitative sad stories) that produces empathy *signals* without moral substance. Long-horizon, culturally specific, deeply private.

### Ethical concerns

Engineering a child's moral emotions is the most paternalistic ambition in the entire set, and the one most open to abuse: a system that decides which out-groups deserve empathy is making profound political choices. Whose empathy, toward whom, is not a question an optimiser should answer silently. The defensive framing (less hostility) is far safer than the positive one.

### Commercial viability

Low. There is no metric, no evidence, and serious reputational risk in claiming to shape children's morality. The viable, modest version is hostility reduction as a safety feature.

---

## 8. Critical thinking

**Scores: Evidence base Medium · Measurability Low · Feasibility Low · Commercial viability Medium**

### Evidence review

There is a substantial and growing evidence base for *interventions* that improve resistance to misinformation: inoculation or "prebunking" (showing people manipulation techniques in advance), accuracy nudges (prompting users to consider whether a headline is true before sharing), and lateral-reading media-literacy training. Several of these have randomised evidence of effect on sharing and discernment. [ESTABLISHED] This is the difference from the softer outcomes: critical thinking has *tested interventions*, even if "critical thinking" as a global capacity is not directly measurable.

### Technical feasibility

A critical-thinking-positive feed would borrow these interventions: inject accuracy prompts before sharing, surface source-quality and provenance signals, present counter-perspectives on contested claims, and down-rank known manipulation patterns. Measurable proxies: sharing of low-quality sources (down is good), engagement with provenance information, performance on occasional embedded discernment checks. The accuracy-nudge literature shows the proxy (sharing accuracy) is both measurable and movable.

### Engineering challenges

The hard part is that "critical thinking" generalises poorly: a feed can reduce sharing of *flagged* falsehoods without making the user a better thinker, and the flags themselves encode contested judgements about truth. Reward hacking risks a feed that performs epistemic virtue (lots of "consider the source" friction) that users learn to click past. Long-horizon: durable discernment is hard to confirm. Off-policy evaluation of "would this user think more critically" is weak. Politically, deciding what counts as a "low-quality source" is a minefield.

### Ethical concerns

Who decides what is true, and what counts as a source worth trusting, is the central and unavoidable problem. A system that nudges children toward "correct" beliefs can slide from teaching reasoning into enforcing conclusions. The defensible target is *process* (showing technique, prompting reflection, exposing provenance), not *outcome* (steering to approved answers). Transparency about why something was flagged is essential.

### Commercial viability

Medium, and notably higher than the soft outcomes, because misinformation is a regulated and reputational priority. Platforms already ship accuracy prompts and provenance labels under public and regulatory pressure (the EU DSA's systemic-risk duties bear directly on this). A child-literacy product, or a school media-literacy deployment, has a real market. The honest catch: process-focused critical-thinking features add friction and slightly reduce sharing-driven engagement, so they tend to arrive via regulation or trust positioning, not organic growth.

---

## 9. Family interaction

**Scores: Evidence base Medium · Measurability Medium · Feasibility Medium · Commercial viability Medium**

### Evidence review

There is solid evidence on "technoference" (technology interfering with family interactions) and on the displacement of family time by individual screen use. [ESTABLISHED on association] Co-use and joint media engagement (parent and child using media together) is associated with better outcomes than solitary use, and is a recognised positive pattern in the child-development literature. [ESTABLISHED] This gives family interaction an unusual property: there is an evidence-backed *positive behaviour* to aim for (co-use and offline family time), not just a harm to avoid.

### Technical feasibility

Family interaction is more measurable than most because some of it is behavioural and observable at the account or household level: shared-account or family-mode co-viewing, content surfaced for joint use, and *session timing that protects family windows* (mealtimes, evenings). A family-positive recommender could surface co-viewable content during family hours, suppress solitary doomscroll-friendly content at those times, and offer joint activities (a video to watch together, a thing to make). Off-platform corroboration is weaker than for sleep but household routines are partly inferable.

### Engineering challenges

The deepest content stays offline by definition: the system cannot see the conversation it hopes to encourage, so it must optimise a proxy (created the conditions for family time) and trust it. Reward hacking: "family content" can be Goodharted into bland mass-appeal video that the family half-watches in parallel silence. Privacy is acute because the unit is the household and may include adults who did not consent to family-interaction inference. Long-horizon for relationship quality.

### Ethical concerns

"Family" and "healthy family interaction" are culturally loaded and not universal; an optimiser encoding one model of family life is a strong values imposition. There is a paternalism risk in a platform deciding when a family should be together. Consent across household members is genuinely hard.

### Commercial viability

Medium. There is a real and saleable product here: family co-viewing modes and "family time" protections that parents value and will pay for, and that fit a child-safe subscription model well. It reduces solitary engagement during protected windows but can *increase* co-viewing engagement, so the engagement hit is softer than for sleep or anxiety. Aligns with the Age Appropriate Design Code's emphasis on the best interests of the child.

---

## 10. Physical activity

**Scores: Evidence base High · Measurability High · Feasibility Medium · Commercial viability Medium**

### Evidence review

The evidence linking sedentary screen time to reduced physical activity and associated health outcomes in children is large and well established. [ESTABLISHED] More usefully, there is a sizeable literature on *exergaming* and activity-prompting apps showing that digital systems can *increase* measured physical activity, at least in the short to medium term, before novelty fades. [ESTABLISHED, with the well-known caveat that effects often decay.] This is the only outcome in the set with a cheap, objective, off-platform ground-truth signal that already exists in billions of pockets: the accelerometer and step counter.

### Technical feasibility

Highest measurability of all twelve. A wearable or phone step and activity API gives a direct, objective, daily reward signal. A physical-activity-positive system would prompt movement breaks, surface activity-oriented content, time interventions to inactivity, and use the measured activity (not time-on-app) as the reward. The off-platform sensor is what makes this so much more tractable than the psychological outcomes: the optimiser is not guessing at a latent state, it is reading a number.

### Engineering challenges

The signal is good, but the *feed mechanism* is weak: a recommender's natural lever (what to show next) is a blunt tool for getting a child off the couch, and the most activity-positive action a feed can take is often to *end the session*, which is in direct tension with the platform's existence. Reward hacking: gaming step counts (phantom steps, holding the phone while sitting) is a known problem. Novelty decay is severe; activity prompts lose effect fast. Privacy: location and movement data on children is highly sensitive.

### Ethical concerns

Generally favourable, but with caveats: an activity-pushing system can shade into pressure that harms children with eating disorders or body-image vulnerability, and movement-tracking is intimate surveillance. "More active" is widely shared as a value, easing the pluralism problem, but it is not universal and must be opt-in and overridable.

### Commercial viability

Medium. Strong measurement and broad value-agreement make this saleable, and there is a mature market (fitness wearables, family-health products). But the core engagement tension is acute: a feed whose best move is to make the child stop using the feed cannot be funded by that feed's engagement. The viable homes are device-maker and wearable ecosystems, health and insurance partnerships, and child-health subscription products, not ad-funded social feeds.

---

## 11. Reduced anxiety

**Scores: Evidence base Medium · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

Anxiety overlaps with mental wellbeing (outcome 1) but is more specific and slightly better evidenced as a *target for reduction*. Hunt et al. (2018) ran an experiment limiting social media to 30 minutes a day and found significant reductions in loneliness and depression, with the largest improvements among those most depressed at baseline; anxiety-relevant measures moved in the healthy direction. [ESTABLISHED for that sample] There is consistent evidence linking specific content patterns (doomscrolling, news of threat, social-comparison content, notification-driven interruption) to acute anxiety and physiological arousal. [CONTESTED on magnitude] The fair reading is that *reducing exposure* to specific anxiogenic patterns is better supported than *optimising for calm* as a positive metric.

### Technical feasibility

Direct measurement is self-report (GAD scales via EMA) with the usual sparsity, plus weak physiological proxies if a wearable is present (heart-rate variability, sleep). On-platform proxies for anxiogenic *exposure* are more tractable than for anxiety itself: density of threat and outrage content, notification frequency and timing, doomscroll session signatures, late-night threat consumption. The defensible design is harm reduction: detect and down-rank anxiogenic patterns and cap interruptive notifications, rather than chase a positive "calm" reward.

### Engineering challenges

Anxiety as a positive target invites the same junk-food-calm reward hack as wellbeing: a feed that sedates with bland, frictionless content, or that suppresses information a child genuinely needs (including, dangerously, content about real threats). Distinguishing healthy alertness from harmful anxiety is beyond cheap measurement. Long-horizon and private. The exposure-reduction framing is more robust but risks paternalistic information suppression.

### Ethical concerns

Deciding what should make a child anxious, and filtering accordingly, is a serious value and information-access judgement. Over-suppression can leave children uninformed; under-suppression leaves them distressed. Surveillance of anxiety states is intimate. Consent and the child's right to know are in tension with protection.

### Commercial viability

Low as a positive target; modestly higher as harm reduction. "Fewer anxiety-spiking notifications and less doomscrolling" is a feature parents value and that fits the Age Appropriate Design Code's stance against engagement-maximising nudges, but it plainly cuts the most engagement-rich content and notification volume, so it needs a non-ad business model to survive.

---

## 12. Reduced loneliness

**Scores: Evidence base Medium · Measurability Low · Feasibility Low · Commercial viability Low**

### Evidence review

Loneliness is the subjective sense of social disconnection, distinct from objective isolation. The Hunt et al. (2018) experiment found that *limiting* social media reduced loneliness, a counter-intuitive result suggesting that for many young people the feed was a substitute for, not a route to, real connection. [ESTABLISHED for that sample] This connects to the active-versus-passive distinction (outcome 2): passive consumption tracks higher loneliness, reciprocal directed interaction tracks lower. Self-Determination Theory's *relatedness* need (Ryan and Deci 2000) is the cleanest theoretical anchor: genuine relatedness reduces loneliness; parasocial or comparison-driven use does not.

### Technical feasibility

Direct measurement is the UCLA Loneliness Scale or single-item EMA prompts, sparse and self-selected as ever. Proxies overlap heavily with healthy friendships: reciprocity, directedness, depth and persistence of interaction, ratio of active to passive use. A loneliness-reducing recommender would up-rank content that prompts reciprocated one-to-one and small-group connection and down-rank passive parasocial consumption, the same lever as outcome 2 with a subjective endpoint.

### Engineering challenges

The Hunt result implies the most loneliness-reducing intervention may again be *less feed*, which no engagement-funded platform will optimise toward. Reward hacking: a feed can manufacture pseudo-connection (engagement-bait that simulates social warmth, parasocial relationships with creators) that reduces reported loneliness briefly while deepening the underlying isolation. Long-horizon and deeply subjective; ground truth is sparse self-report. Off-policy evaluation is very weak.

### Ethical concerns

Inferring a child's loneliness from behaviour is intimate surveillance of a vulnerable state, and a system that detects loneliness faces the same act-or-stay-silent dilemma as the mental-wellbeing case, with safeguarding implications. There is real risk of a feed exploiting loneliness (the most engageable state) under cover of treating it. Consent and the child's dignity are paramount.

### Commercial viability

Low. The strongest evidence points toward *reduced use*, which is commercially self-defeating for an ad-funded feed. The honest commercial framing is, again, a paid child-safe product whose pitch is healthier, smaller, more reciprocal social experience, or a school and community deployment. "We cure your child's loneliness" is a claim to avoid; "we build a smaller, kinder, more reciprocal social space" is defensible.

---

## Cross-outcome summary

Three patterns hold across all twelve.

First, **the measurable outcomes are the behavioural ones.** Sleep, physical activity, learning, and family interaction score best because each has a relatively external, observable target and at least one off-platform corroborating signal (a wearable, a quiz, a clock, a household routine). The psychological outcomes (mental wellbeing, confidence, empathy, anxiety, loneliness) score worst because they are latent states observable only through sparse, biased, gameable self-report. [INFERENCE]

Second, **for almost every outcome the defensible version is harm reduction, not positive optimisation.** "Down-rank the anxiogenic, the hostile, the appearance-comparison, the bedtime-wrecking content" is more robust, less gameable, and more ethically defensible than "optimise for calm, empathy, confidence, sleep." Positive optimisation invites reward hacking (the junk-food-calm, the flattery feed, the manufactured connection); harm reduction mostly does not. This is the single most useful engineering conclusion in this part. [INFERENCE]

Third, **none of these pays for itself in the ad auction.** Every outcome that meaningfully helps a child tends to reduce the late-night, high-arousal, high-frequency engagement that monetises best. The viable commercial routes are therefore structural, not organic: a paid subscription where *less compulsive use* is the product, a school or health-system deployment with its own budget, or a regulatory floor (Age Appropriate Design Code, Online Safety Act, EU DSA) that forces the change across the market so no single firm is competitively punished for it. We treat that regulatory backdrop in the [alignment essay](alignment-and-measurement.md).

## References

- Allcott, H., Braghieri, L., Eichmeyer, S., and Gentzkow, M. (2020). The Welfare Effects of Social Media. *American Economic Review*, 110(3), 629 to 676.
- Carter, B., Rees, P., Hale, L., Bhattacharjee, D., and Paradkar, M. S. (2016). Association Between Portable Screen-Based Media Device Access or Use and Sleep Outcomes: A Systematic Review and Meta-analysis. *JAMA Pediatrics*, 170(12), 1202 to 1208.
- Hunt, M. G., Marx, R., Lipson, C., and Young, J. (2018). No More FOMO: Limiting Social Media Decreases Loneliness and Depression. *Journal of Social and Clinical Psychology*, 37(10), 751 to 768.
- Kross, E., Verduyn, P., Demiralp, E., Park, J., Lee, D. S., Lin, N., Shablack, H., Jonides, J., and Ybarra, O. (2013). Facebook Use Predicts Declines in Subjective Well-Being in Young Adults. *PLoS ONE*, 8(8), e69841.
- Milli, S., Pierson, E., and Garg, N. (2023). Engagement, User Satisfaction, and the Amplification of Divisive Content on Social Media. *arXiv* / *PNAS Nexus*.
- Orben, A., and Przybylski, A. K. (2019). The Association Between Adolescent Well-Being and Digital Technology Use. *Nature Human Behaviour*, 3, 173 to 182.
- Ryan, R. M., and Deci, E. L. (2000). Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being. *American Psychologist*, 55(1), 68 to 78.
- Stray, J. (2020). Aligning AI Optimization to Community Well-Being. *International Journal of Community Well-Being*, 3, 443 to 463.
- Stray, J., Vendrov, I., Nixon, J., Adler, S., and Hadfield-Menell, D. (2021). What are you optimizing for? Aligning Recommender Systems with Human Values. *arXiv:2107.10939*.
- Twenge, J. M., and Campbell, W. K. (2018). Associations between screen time and lower psychological well-being among children and adolescents. *Preventive Medicine Reports*, 12, 271 to 283.
