# Part 10: Future Ideas for Healthier Recommendation Systems

*Two hundred ideas for recommendation systems that would serve children and families better. A brainstorm, not a roadmap. Most ideas here are openly speculative; a few are inferences from current engineering, and a handful are already partly established. We label each one honestly.*

---

## The design philosophy

Every idea in this part rests on one shift in objective.

A typical recommendation system optimises for a child's **revealed impulses**: whatever they tapped, watched, or lingered on, mostly in the last few minutes. That is a real signal, and a useful one, but it is not the same as what the child actually wants from their life. A child who watched ten reaction videos at midnight has revealed an impulse. They have not necessarily revealed an interest they would endorse on calm reflection the next morning.

This part is built around optimising instead for the child's **reflective interests**: the things they would, on considered reflection, be glad the feed helped them spend time on. Curiosity they would want fed. Friendships they would want strengthened. Sleep they would want protected. Skills they would want to build. The whole collection is an attempt to imagine recommendation systems that close the gap between the impulse and the reflective interest, and that, at their most ambitious, help the child grow into the chooser they would themselves endorse.

This is not a call to override children. A system that decides it knows better than a child and quietly steers them is not healthier; it is paternalism with a friendly face. The recurring move across these ideas is therefore to make the system **legible, controllable, and reversible**, so the child remains the author. We surface the reasons (Theme 1), hand over the controls (Theme 2), bring the family in as scaffolding (Theme 3), insert reflection and rest (Theme 4), turn the feed toward growth (Theme 5), connection (Theme 6), and breadth (Theme 7), and then ask what rules and rights (Theme 8) and what far-future technology (Theme 9) would be needed to make any of it trustworthy.

We are honest about the hard wall behind much of this, set out in [Part 7](../part-07-can-we-change-algorithms): reflective interests are long-horizon, hard to measure, and often anti-correlated with short-term engagement. That is exactly why most of these ideas are speculative and why several would do harm if naively optimised. A good idea on this list is not a proven one. It is a provocation worth taking seriously.

---

## The ten themes (and how many ideas each holds)

This part is split across ten files. Numbering runs continuously from 1 to 200.

| File | Theme | Ideas | Count |
|------|-------|:-----:|:-----:|
| [`README.md`](README.md) | Philosophy, contents, and shortlist | n/a | n/a |
| [`01-transparency-and-explainability.md`](01-transparency-and-explainability.md) | Transparency and explainability | 1 to 20 | 20 |
| [`02-user-and-child-control.md`](02-user-and-child-control.md) | User and child control | 21 to 45 | 25 |
| [`03-family-and-parental.md`](03-family-and-parental.md) | Family and parental | 46 to 70 | 25 |
| [`04-wellbeing-and-reflection.md`](04-wellbeing-and-reflection.md) | Wellbeing and reflection | 71 to 100 | 30 |
| [`05-learning-and-growth.md`](05-learning-and-growth.md) | Learning and growth | 101 to 125 | 25 |
| [`06-prosocial-and-community.md`](06-prosocial-and-community.md) | Prosocial and community | 126 to 150 | 25 |
| [`07-diversity-and-serendipity.md`](07-diversity-and-serendipity.md) | Diversity and serendipity | 151 to 170 | 20 |
| [`08-governance-and-rights.md`](08-governance-and-rights.md) | Governance and rights | 171 to 185 | 15 |
| [`09-speculative-and-moonshots.md`](09-speculative-and-moonshots.md) | Speculative and moonshots | 186 to 200 | 15 |

That is **200 ideas** in total. Each is a self-contained entry with a title, how it would work, the problem it solves, a feasibility label, the risks, and an educational-value rating.

---

## How to read a feasibility label

Every idea carries one feasibility label. The bands are deliberately coarse, because the future is.

- **High.** Buildable today with known methods and modest cost. The obstacles are mostly product and commercial, not technical.
- **Medium.** Buildable, but with real engineering or design cost, or a hard sub-problem (such as classifying content by tone or value) that is solvable but noisy.
- **Low.** A genuine research or deployment problem stands in the way. The idea is coherent, but no one knows yet how to do it well or safely at scale.
- **Speculative.** Depends on technology, institutions, or social agreement that do not yet exist at the required scale. A design provocation, not a plan.

Where useful, an idea also carries the repository's epistemic tags so you can see what kind of claim each part of it is making: **[ESTABLISHED]** (a citable, reviewed fact), **[INFERENCE]** (a reasonable engineering conclusion), **[SPECULATIVE]** (a forward-looking idea), or **[CONTESTED]** (the research community has not settled it). See [`EPISTEMICS.md`](../../EPISTEMICS.md) for how we use these.

Two reminders that run through the whole part. First, feasibility is not desirability: some High-feasibility ideas carry serious risks, and some Speculative ones are the most worth wanting. Second, almost every idea here reduces short-term engagement, so commercial viability usually depends on a non-advertising business model, a regulatory floor, or a long-run trust play, exactly as Part 7 concludes.

---

## Shortlist: the twelve to build first

If you could only start on twelve, start here. These are chosen for a buildable-today feasibility, high educational value, and low risk of doing harm. They are the ones a school, a public-service product, or a careful platform could ship now and learn from.

1. **Why am I seeing this (idea 2).** The single most important literacy feature; turns the feed's magic into cause and effect on every item.
2. **Daily feed summary (idea 4).** Cheap to build, builds self-knowledge, and gently introduces the whole idea of watching your own patterns.
3. **Glossary-linked explanations (idea 20).** Almost free, and it quietly grows a child's vocabulary every time they use the product.
4. **"Show me less like this" with a reason (idea 29).** A tiny change that makes negative feedback actually work, and teaches intention.
5. **Adjustable autoplay (idea 42).** High feasibility, directly targets the strongest narrowing-and-overuse force in the feed.
6. **Reflection prompts before autoplay (idea 71).** The canonical wellbeing intervention; restores a stopping point where the feed removes one.
7. **Emotional weather check-in (idea 79).** Private, simple, and it builds the lifelong habit of linking how you feel to what you consume.
8. **Notification sabbath (idea 85).** Trivially buildable, and a clean way to establish rest as a family norm.
9. **Spaced-repetition feed (idea 106).** Turns the feed's novelty bias into a learning tool using settled learning science.
10. **Co-curated starter feeds (idea 58).** A high-feasibility onboarding change that seeds a child's feed with intention instead of a stereotype.
11. **The right to a non-personalised feed (idea 182).** Partly established in law already; the simplest structural guarantee of choice.
12. **Diversity-aware autoplay (idea 166).** A small re-ranking change that counters narrowing exactly where it bites hardest.

A note on what is *not* on this list. The most exciting ideas in this part (the AI wellbeing coach, value-aligned RL with child assent, the reflective-interest optimiser) are deliberately left off the build-first shortlist. They are the right direction and the wrong starting point: their risks are real, their measurement problems are unsolved, and a careless first version would do harm. Build the legible, low-risk twelve first. Earn the trust and the evidence. Then climb.

---

## How this part connects to the rest

- The objective shift it rests on is argued in detail in [Part 7](../part-07-can-we-change-algorithms).
- The alternative algorithms that some of these ideas would need are prototyped in [Part 6](../../code/part-06-alternative-algorithms).
- The simulations in [Part 8](../../code/part-08-simulations) let you test what some of these designs would do.
- The child-friendly language for explaining any of this is in [Part 4](../part-04-child-friendly-explanations).
- The classroom version, including activities a class could run on several of these ideas, is in [Part 9](../part-09-curriculum).

---

*Documentation is released under [CC BY 4.0](../../LICENSE-DOCS). Use it in classrooms, research, and products, with attribution. If you build one of these, we would love to hear how it went.*
