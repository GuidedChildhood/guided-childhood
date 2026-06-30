# Part 10, Theme 1: Transparency and Explainability

*Ideas 1 to 20. The premise of this theme is simple: a child cannot shape what a child cannot see. Every idea here tries to make a recommendation system legible, so that the reasons behind a feed become a thing you can read, question, and learn from rather than an invisible force you only feel.*

Feasibility labels follow the repository convention. **High** means buildable today with known methods. **Medium** means buildable but with real engineering or product cost. **Low** means a hard research or deployment problem stands in the way. **Speculative** means the idea is a design provocation that has not been built or tested at scale. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

---

### 1. Algorithm Transparency Dashboard

**How it would work.** A single screen, reachable from any feed, that shows the live signals currently shaping a child's recommendations: top inferred interests, recent strong signals (a video watched twice, a search), and a plain-language note on what the system is optimising for right now. [SPECULATIVE], though component parts are [ESTABLISHED] in research dashboards.

**Problem it solves.** The feed is the most consequential interface in a child's day and the only one with no instrument panel. A dashboard turns a black box into a glass box.

**Technical feasibility.** Medium. The signals already exist inside the ranking stack; surfacing a faithful, non-misleading summary of them is the hard part.

**Potential risks.** A simplified dashboard can mislead by omission, implying the system is simpler than it is. It can also be gamed by users who learn to perform for it.

**Educational value.** High. It is, in effect, a science instrument for the feed.

---

### 2. "Why Am I Seeing This?" On Every Item

**How it would work.** Every recommended item carries a tappable tag that explains, in one honest sentence, the main reason it was ranked: "Because you re-watched two videos about skateboarding tricks this week." [INFERENCE] that platforms can do this; some already ship weak versions.

**Problem it solves.** Recommendations feel like mind-reading magic. A per-item reason replaces magic with cause and effect, which is the heart of algorithm literacy.

**Technical feasibility.** Medium. Faithful per-item attribution in a deep ranking model is genuinely hard; honest approximate reasons are achievable.

**Potential risks.** A plausible but inaccurate reason is worse than none, because it teaches a false mental model.

**Educational value.** High.

---

### 3. Digital Nutrition Scores

**How it would work.** Each item and each session carries a nutrition-style label: a small panel rating things like learning content, calm versus agitation, novelty, and "empty calories" (passive scroll bait), shown the way a food label shows sugar and fibre. [SPECULATIVE].

**Problem it solves.** Children have a rich vocabulary for food quality and almost none for media quality. A familiar metaphor gives them one.

**Technical feasibility.** Medium. Classifying content along wellbeing dimensions is doable but noisy, and the rubric is value-laden.

**Potential risks.** Whoever defines "healthy" content holds real power; the rubric can encode a narrow cultural view of good media.

**Educational value.** High.

---

### 4. Daily Feed Summary, Like a Weather Report

**How it would work.** Once a day the app produces a short, friendly recap: "Today your feed leaned heavily toward gaming, got more intense after 9pm, and showed you three new creators." Delivered as a card, not a buried setting. [SPECULATIVE].

**Problem it solves.** Patterns invisible in the moment become obvious in aggregate. A daily mirror builds self-knowledge.

**Technical feasibility.** High. This is straightforward session analytics presented kindly.

**Potential risks.** Could become another engagement surface if gamified. Must inform, not hook.

**Educational value.** High.

---

### 5. Signal Receipts

**How it would work.** After any action that strongly shapes future recommendations (a long watch, a follow, a search), the app shows a brief "receipt": "Noted: you like long science explainers. This will affect what comes next." [SPECULATIVE].

**Problem it solves.** Children rarely connect a single action to its downstream effect on the feed. Receipts make the feedback loop visible at the moment it forms.

**Technical feasibility.** High. The system already knows which actions were strong signals.

**Potential risks.** Too many receipts become noise and get dismissed reflexively.

**Educational value.** High.

---

### 6. Counterfactual Preview ("If You Tap This...")

**How it would work.** Before committing to an item, an optional preview estimates how it would tilt the feed: "Watching this tends to bring more reaction videos." A small forecast of consequence. [SPECULATIVE].

**Problem it solves.** It moves literacy upstream, from explaining the past to anticipating the future, which is where real agency lives.

**Technical feasibility.** Low. Honest counterfactual prediction of feed drift is a hard modelling problem and easy to get wrong.

**Potential risks.** Inaccurate forecasts erode trust quickly; could be exploited to nudge behaviour.

**Educational value.** High.

---

### 7. Open Ranking Cards

**How it would work.** A public, plain-language card for each ranking objective the platform uses, written for children and parents: what the signal is, why it exists, and what it tends to do. A standardised disclosure format, like ingredient lists. [SPECULATIVE], policy-dependent.

**Problem it solves.** Today the objectives are undisclosed and shift silently. A standard card format makes them comparable across platforms.

**Technical feasibility.** Medium. The hard part is institutional willingness, not engineering.

**Potential risks.** Cards can be written to reassure rather than inform; needs independent review to mean anything.

**Educational value.** High.

---

### 8. Confidence Labels on Inferences

**How it would work.** When the system shows what it thinks you like, it also shows how sure it is: "Probably interested in football (low confidence, based on one video)." Borrowed straight from this repository's epistemic discipline. [SPECULATIVE].

**Problem it solves.** Inferred profiles are presented as fact when they are guesses. Confidence labels teach uncertainty as a habit of mind.

**Technical feasibility.** Medium. Calibrated confidence is available in principle; surfacing it honestly is a design challenge.

**Potential risks.** Confidence numbers can be miscalibrated and falsely reassuring.

**Educational value.** High.

---

### 9. The Feed Replay

**How it would work.** A scrubber that lets a child replay the last week of their feed and watch where it changed direction, with markers showing what triggered each turn. A flight recorder for attention. [SPECULATIVE].

**Problem it solves.** Drift happens slowly and is hard to notice. Replay compresses weeks into minutes and makes the shape of drift visible.

**Technical feasibility.** Medium. Requires storing and rendering recommendation history, which has privacy and storage cost.

**Potential risks.** Replaying intense content can re-expose a child to it. Storage of history is itself a data risk.

**Educational value.** High.

---

### 10. Interest Map

**How it would work.** A visual map of the topics the system associates with a child, sized by strength and linked by relatedness, that the child can explore, pinch, and zoom. The profile as a landscape rather than a hidden list. [SPECULATIVE].

**Problem it solves.** A profile described in words feels abstract. A map makes "who the algorithm thinks I am" tangible and explorable.

**Technical feasibility.** Medium. Embeddings to a child-readable map is doable but the layout choices carry meaning.

**Potential risks.** A vivid map can reify a stereotype the child then lives up to.

**Educational value.** High.

---

### 11. Explainable Feed Mode

**How it would work.** A toggle that turns the whole feed into its explained version: every item annotated, every transition narrated, recommendations slowed slightly so the reasoning can be read. A "show your working" mode. [SPECULATIVE].

**Problem it solves.** Explanation is usually buried one tap deep and rarely used. A whole-feed mode makes it the default lens for a learning session.

**Technical feasibility.** Medium. Bundles several explanation features into one experience.

**Potential risks.** Explanations slow the feed, which most users will switch off; risk of being a token feature.

**Educational value.** High.

---

### 12. Plain-Language Model Cards for Kids

**How it would work.** A child-readable version of the model card concept: a short illustrated document describing what the recommender does, what it was trained on, where it is known to be weak, and who to ask if it goes wrong. [INFERENCE]; model cards are [ESTABLISHED] practice (Mitchell et al. 2019).

**Problem it solves.** Documentation exists for engineers and regulators but never for the children actually subject to the system.

**Technical feasibility.** High. It is a writing and design task more than an engineering one.

**Potential risks.** Can become marketing if not independently checked.

**Educational value.** High.

---

### 13. The Honesty Ledger

**How it would work.** A running log a child can open showing every time the app changed something about how it recommends to them: a new model, a tweaked objective, an experiment they were enrolled in. [SPECULATIVE].

**Problem it solves.** Children are silently enrolled in A/B tests and model changes. A ledger makes the platform's changes to *them* as visible as their actions are to the platform.

**Technical feasibility.** Medium. Change tracking is feasible; honest disclosure of experiments is a policy hurdle.

**Potential risks.** Could overwhelm with technical churn; needs careful summarising.

**Educational value.** Medium.

---

### 14. Side-by-Side Feed Comparison

**How it would work.** A view that shows your feed beside a "neutral" feed (popular-for-your-age, no personalisation) so the child can see exactly what personalisation is adding and removing. [SPECULATIVE].

**Problem it solves.** Personalisation is invisible because there is nothing to compare it against. A control feed reveals its footprint.

**Technical feasibility.** Medium. Running a parallel non-personalised feed is cheap; the comparison UI is the work.

**Potential risks.** The "neutral" baseline is itself a choice and can mislead about what neutral means.

**Educational value.** High.

---

### 15. Trigger Word Spotlight

**How it would work.** The app highlights the specific cues in content that the recommender reacted to: the thumbnail style, the sound, the caption keyword that pulled it into your feed. A literacy of bait. [SPECULATIVE].

**Problem it solves.** Children absorb attention-grabbing patterns without ever naming them. Spotlighting the hooks teaches the grammar of the feed.

**Technical feasibility.** Low. Faithfully attributing a ranking decision to a specific cue is hard.

**Potential risks.** Teaches creators how to bait more effectively as much as it teaches viewers to resist.

**Educational value.** High.

---

### 16. The "Boring Truth" Button

**How it would work.** A button that strips the personality from any explanation and gives the dry mechanical version: "Ranked 1st of 4,812 candidates, score 0.91, top feature: watch-time-similarity to last session." For older children who want the real thing. [SPECULATIVE].

**Problem it solves.** Friendly explanations can patronise. A truth button respects that some children want the engineering, not the metaphor.

**Technical feasibility.** Medium. Exposing real ranking internals readably and safely is non-trivial.

**Potential risks.** Raw internals can be reverse-engineered for manipulation.

**Educational value.** High.

---

### 17. Recommendation Provenance Trail

**How it would work.** For any item, a trail showing how it reached you: who made it, how it first spread, and which step in the pipeline (retrieval, ranking, re-ranking) surfaced it to you. [SPECULATIVE].

**Problem it solves.** Children treat the feed as a single thing. Provenance reveals it as a pipeline with stages, each of which can be questioned.

**Technical feasibility.** Low. End-to-end provenance across a large system is a serious engineering undertaking.

**Potential risks.** Provenance data is sensitive and can expose creators or other users.

**Educational value.** High.

---

### 18. Ad Versus Organic X-Ray

**How it would work.** A mode that visually separates paid, promoted, and organic recommendations with unmistakable colour and labels, including content where money quietly changed the ranking. [INFERENCE]; ad disclosure is partly [ESTABLISHED] by regulation.

**Problem it solves.** Children frequently cannot tell advertising from content. An x-ray makes the commercial layer of the feed legible.

**Technical feasibility.** High for explicit ads, Medium for subtler paid influence.

**Potential risks.** Commercial resistance is strong; partial disclosure can imply the rest is uninfluenced.

**Educational value.** High.

---

### 19. The Uncertainty Window

**How it would work.** Periodically the feed admits what it does not know about you and asks rather than guesses: "I am not sure if you are into this for the music or the dancing. Which is it?" Transparency as dialogue. [SPECULATIVE].

**Problem it solves.** Systems resolve ambiguity silently and often wrongly. Asking turns a hidden guess into a shared decision.

**Technical feasibility.** Medium. Identifying high-uncertainty moments is feasible; not annoying the user is the design problem.

**Potential risks.** Frequent questions feel like nagging; answers can be used to deepen targeting.

**Educational value.** High.

---

### 20. Glossary-Linked Explanations

**How it would work.** Every technical term in any explanation surface is tappable and links to a plain-language definition, building a child's vocabulary as they use the product. Tied to this repository's [`GLOSSARY.md`](../../GLOSSARY.md). [SPECULATIVE], trivially buildable.

**Problem it solves.** Explanations fail when they use words the child does not have. Inline definitions close that gap without leaving the moment.

**Technical feasibility.** High. A term dictionary and tap targets.

**Potential risks.** Minimal. Over-linking can clutter the interface.

**Educational value.** High.
