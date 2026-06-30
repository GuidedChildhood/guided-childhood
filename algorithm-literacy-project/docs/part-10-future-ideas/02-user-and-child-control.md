# Part 10, Theme 2: User and Child Control

*Ideas 21 to 45. Transparency lets a child see the feed. Control lets a child shape it. The guiding principle of this theme is that a recommendation system should optimise for a child's reflective interests (what they would endorse on calm reflection) and not only for their revealed impulses (whatever they tapped at 11pm). The way to bridge that gap is to give the child real, legible, reversible controls and to make using them feel like steering, not like filling in a form.*

Feasibility labels follow the repository convention: **High**, **Medium**, **Low**, **Speculative**. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

---

### 21. Child-Owned Preference Controls

**How it would work.** A first-class settings space the child owns, where they declare what they want more and less of in their own words ("more animals, less arguing"), and the feed visibly obeys. Not a buried filter but a primary surface. [SPECULATIVE].

**Problem it solves.** Children are the subject of recommendation yet have almost no direct say. Ownership of preferences reframes them as the pilot.

**Technical feasibility.** Medium. Translating free-text preferences into reliable ranking constraints is the hard part.

**Potential risks.** Stated preferences can be overridden by stronger behavioural signals unless the system is built to honour them.

**Educational value.** High.

---

### 22. "Tune My Feed" Dials

**How it would work.** A small set of physical-feeling dials the child can turn: calmer versus livelier, familiar versus new, learning versus fun, fast versus slow. Each turn re-ranks the feed immediately and visibly. [SPECULATIVE].

**Problem it solves.** Preference today is expressed only through opaque behaviour. Dials make taste an explicit, adjustable thing.

**Technical feasibility.** Medium. Mapping intuitive dials to objective weights is feasible but needs careful calibration.

**Potential risks.** Too many dials overwhelm; defaults still dominate behaviour for most users.

**Educational value.** High.

---

### 23. Personal Values-Based Recommendation Settings

**How it would work.** The child (often with a parent) selects values they want their feed to reflect, such as kindness, curiosity, honesty, or calm, and the ranker weights content that embodies them. Values, not just topics. [SPECULATIVE].

**Problem it solves.** Topic filters miss the *character* of content. A values layer lets a child shape tone and not only subject.

**Technical feasibility.** Low. Classifying content by abstract values is noisy and culturally loaded.

**Potential risks.** Encoding values risks a narrow or imposed moral frame; values can be performed for the classifier.

**Educational value.** High.

---

### 24. Interest Budgets

**How it would work.** The child allocates a fixed weekly "budget" of feed attention across topics, like pocket money: 40% gaming, 30% sport, 20% music, 10% surprise. The feed spends to the budget. [SPECULATIVE].

**Problem it solves.** Feeds drift toward whatever is most engaging, crowding out everything else. A budget enforces deliberate balance.

**Technical feasibility.** Medium. Budgeted re-ranking is achievable; honouring it without feeling rigid is the design challenge.

**Potential risks.** Rigid budgets can feel like a chore; children may set budgets they then resent.

**Educational value.** High. It teaches scarcity, allocation, and trade-offs directly.

---

### 25. One-Tap Undo and Reset

**How it would work.** A prominent undo for the last few strong signals, plus a clean "reset my feed" that returns to a neutral starting point without deleting the account. Forgiveness built into the interface. [SPECULATIVE].

**Problem it solves.** A single accidental rabbit hole can warp a feed for weeks with no easy way back. Undo restores reversibility.

**Technical feasibility.** Medium. Selective unlearning of recent signals is harder than it sounds in a continuously trained model.

**Potential risks.** A reset that does not truly reset teaches mistrust. Frequent resets can be used to dodge safety systems.

**Educational value.** High.

---

### 26. The Mute Garden

**How it would work.** A visual collection of everything the child has chosen to see less of, kept as living tiles they can prune or revive, so muting is a tended thing rather than a one-way disappearance. [SPECULATIVE].

**Problem it solves.** Mute and block decisions vanish and are forgotten, so the feed quietly stays shaped by old choices. A garden keeps them reviewable.

**Technical feasibility.** High. It is a UI over existing mute lists.

**Potential risks.** Revisiting muted topics can re-expose distressing content; needs gentle handling.

**Educational value.** Medium.

---

### 27. Two-Speed Feed

**How it would work.** A deliberate "slow" lane and a "fast" lane the child chooses between, where slow shows fewer, longer, calmer items and fast behaves like a normal feed. Pace as a setting. [SPECULATIVE].

**Problem it solves.** The feed has one speed, optimised for retention. Letting the child pick a pace returns control over tempo and arousal.

**Technical feasibility.** Medium. Pacing controls exist; building a genuinely calm lane that still feels alive is hard.

**Potential risks.** The fast lane may simply win every time without nudges toward slow.

**Educational value.** Medium.

---

### 28. Feed Bookmarks (Save the Mix)

**How it would work.** The child can save the current "shape" of their feed as a named preset ("homework mode", "weekend chill") and switch between them like playlists. [SPECULATIVE].

**Problem it solves.** A feed good for relaxing is wrong for studying, yet there is only one feed. Presets let context drive recommendation.

**Technical feasibility.** Medium. Storing and restoring ranking configurations is feasible.

**Potential risks.** Presets can lock children into narrow modes; needs easy editing.

**Educational value.** Medium.

---

### 29. "Show Me Less Like This" With a Reason

**How it would work.** Negative feedback that asks one quick follow-up: less because it is boring, upsetting, too much, or not now? The reason routes to different system responses. [INFERENCE]; coarse versions are [ESTABLISHED].

**Problem it solves.** A single dislike conflates very different intentions, so the system often learns the wrong lesson. A reason disambiguates.

**Technical feasibility.** High. A one-tap reason chip on existing controls.

**Potential risks.** Extra friction reduces use; reasons can be ignored by the ranker if not wired through.

**Educational value.** Medium.

---

### 30. The Interest Half-Life Slider

**How it would work.** A control for how quickly old interests fade: a child can say "let my old obsessions decay fast" or "keep my long-term loves stable", setting the memory of the feed. [SPECULATIVE].

**Problem it solves.** Feeds either cling to a phase a child has outgrown or forget a lasting love too fast. A half-life control puts memory under the child's hand.

**Technical feasibility.** Low. Tunable per-user decay is feasible but exposing it intuitively is unproven.

**Potential risks.** Abstract for most children without strong scaffolding.

**Educational value.** Medium.

---

### 31. Topic Quarantine

**How it would work.** A child can place a topic in "quarantine" for a set period (no recommendations, no resurfacing) with an automatic check-in when it ends. A cooling-off pen for things they want a break from. [SPECULATIVE].

**Problem it solves.** Some interests turn compulsive or distressing; muting forever feels too final. Quarantine offers a timed, reversible pause.

**Technical feasibility.** Medium. Time-boxed suppression with reliable exclusion is achievable.

**Potential risks.** Quarantine can be circumvented by adjacent topics the system does not link.

**Educational value.** Medium.

---

### 32. The "Not Today" Gesture

**How it would work.** A swipe meaning "fine in general, just not in this mood", distinct from "never again", so a child can shape the moment without permanently teaching the system. [SPECULATIVE].

**Problem it solves.** Current controls force a permanent verdict on a temporary feeling, polluting the long-term profile with mood noise.

**Technical feasibility.** Medium. Separating session-local from durable signals is doable with care.

**Potential risks.** Subtle distinction many users will not grasp; risk of being ignored.

**Educational value.** Medium.

---

### 33. Curiosity Tokens

**How it would work.** The child earns tokens by exploring outside their usual feed and spends them to summon a burst of a chosen new topic, making exploration a small game of agency. [SPECULATIVE].

**Problem it solves.** Feeds reward narrowing. Tokens make widening feel rewarding too, on the child's own terms.

**Technical feasibility.** Medium. A token economy over recommendation is feasible but easy to over-gamify.

**Potential risks.** Gamification can become its own compulsion; must stay lightweight.

**Educational value.** High.

---

### 34. Editable Profile (Strike-Through the Wrong Guesses)

**How it would work.** The inferred-interest list is directly editable: a child crosses out wrong guesses and pins right ones, and the system treats edits as authoritative over inferred behaviour. [SPECULATIVE].

**Problem it solves.** Inferred profiles are often wrong and uncorrectable, so a child is mis-served by a caricature of themselves.

**Technical feasibility.** Medium. Honouring explicit edits above behavioural signals requires deliberate design.

**Potential risks.** Children may edit toward an idealised self the system then cannot serve well.

**Educational value.** High.

---

### 35. The "Surprise Me" Wheel

**How it would work.** A deliberate randomiser the child spins to break out of their feed, with adjustable wildness from "nearby new" to "totally unexpected". Controlled serendipity on demand. [SPECULATIVE].

**Problem it solves.** Children sense the feed narrowing but lack a lever to widen it. A wheel makes breaking out a fun, intentional act.

**Technical feasibility.** High. Injecting tuned randomness into retrieval is straightforward.

**Potential risks.** Random content needs safety filtering; "wild" must never mean unsafe.

**Educational value.** High.

---

### 36. Consent to Personalise

**How it would work.** Personalisation is off until the child meaningfully opts in, choosing what signals it may use, with a plain explanation of the trade-off between a generic and a tailored feed. [SPECULATIVE], regulation-adjacent.

**Problem it solves.** Personalisation is the silent default no one chose. Making it a deliberate choice restores it as a decision.

**Technical feasibility.** Medium. Technically simple; commercially and behaviourally hard given default effects.

**Potential risks.** Most users accept defaults, so consent can become a rubber stamp unless designed against dark patterns.

**Educational value.** High.

---

### 37. The Attention Allowance

**How it would work.** The child sets a daily attention allowance per content type, and the feed gradually shifts toward calmer, more closing-down content as the allowance runs low, rather than cutting off abruptly. [SPECULATIVE].

**Problem it solves.** Hard time limits feel punitive and get evaded. A gradual taper respects autonomy while honouring a self-set limit.

**Technical feasibility.** Medium. Allowance-aware re-ranking is feasible; the taper curve needs tuning.

**Potential risks.** Children may set generous allowances; needs a parent or reflective check.

**Educational value.** High.

---

### 38. Mood-In Controls

**How it would work.** At the start of a session the child can optionally tell the feed how they feel and what they want from it ("I'm wired, help me wind down"), and the ranker adapts to that stated intent. [SPECULATIVE].

**Problem it solves.** The feed treats every session identically. Letting the child name their intent aligns the feed with the actual reason they opened it.

**Technical feasibility.** Medium. Intent-conditioned ranking is feasible; honest mood input is the soft part.

**Potential risks.** Mood data is sensitive; must not be retained or monetised. Children may not self-report accurately.

**Educational value.** High.

---

### 39. The "Pin a Creator" System

**How it would work.** A child pins the creators they genuinely value, and pinned creators are protected from being crowded out by whatever is trending, guaranteeing them a place in the feed. [SPECULATIVE].

**Problem it solves.** Loved creators get buried under viral churn. Pinning lets relationships outrank momentary virality.

**Technical feasibility.** High. A guaranteed-slot mechanism over ranking.

**Potential risks.** Over-pinning recreates a narrow bubble of the child's own making.

**Educational value.** Medium.

---

### 40. Feed Diet Plans

**How it would work.** Borrowing the nutrition metaphor, the child (optionally with a parent or teacher) picks a "diet" template (balanced, learning-rich, low-stimulation) that sets sensible default dials, which they can then customise. [SPECULATIVE].

**Problem it solves.** A blank set of controls paralyses; sensible templates give a starting point that teaches what balance looks like.

**Technical feasibility.** Medium. Templates over the dial system.

**Potential risks.** Templates embed someone's idea of healthy; must be transparent and editable.

**Educational value.** High.

---

### 41. The Veto Vault

**How it would work.** A private, child-controlled list of absolute no-go topics that the system treats as hard constraints, never to be tested or probed, with no requirement to explain why. [SPECULATIVE].

**Problem it solves.** Some boundaries should never be A/B tested. A veto vault gives the child an inviolable line the optimiser cannot cross.

**Technical feasibility.** Medium. Hard exclusion is feasible; truly never resurfacing adjacent content is harder.

**Potential risks.** A child may over-restrict; vault contents are sensitive and must be protected.

**Educational value.** Medium.

---

### 42. Adjustable Autoplay

**How it would work.** Autoplay is not a single on/off but a spectrum the child sets: off, ask-each-time, play-then-pause-after-three, or continuous, with the default skewed toward the gentler end for younger ages. [INFERENCE]; toggles are [ESTABLISHED].

**Problem it solves.** Binary autoplay forces a choice between full convenience and none. A spectrum lets the child design their own friction.

**Technical feasibility.** High.

**Potential risks.** Default still dominates; the gentle default must be defended commercially.

**Educational value.** Medium.

---

### 43. The "What Changed?" Diff

**How it would work.** Whenever the child adjusts a control, the app shows a quick before-and-after of how the feed shifted, so the effect of each control is felt, not just asserted. [SPECULATIVE].

**Problem it solves.** Controls feel like they do nothing when their effect is invisible. A visible diff closes the loop and teaches cause and effect.

**Technical feasibility.** Medium. Computing and showing a meaningful feed diff is non-trivial.

**Potential risks.** Diffs can mislead if the underlying change is subtle or delayed.

**Educational value.** High.

---

### 44. Co-Designed Controls

**How it would work.** Children help design the controls themselves through participatory sessions, and the resulting controls ship with credit to the young designers, making control literally child-authored. [SPECULATIVE], a process more than a feature.

**Problem it solves.** Adults design "child controls" that children find baffling. Co-design grounds them in real comprehension and ownership.

**Technical feasibility.** High as a process; the outputs vary.

**Potential risks.** Token participation that does not affect the product; must be genuine.

**Educational value.** High.

---

### 45. The Reflective Pause Setting

**How it would work.** The child sets how often the feed should pause and ask whether they still want to be here, tuning the frequency of reflection themselves, from never to every ten minutes. Self-imposed mindfulness. [SPECULATIVE].

**Problem it solves.** Reflection imposed by the platform feels like nagging; reflection the child sets for themselves is a chosen discipline.

**Technical feasibility.** High. A timed prompt with user-set cadence.

**Potential risks.** Children may set it to never; pairs best with a parent or default floor.

**Educational value.** High.
