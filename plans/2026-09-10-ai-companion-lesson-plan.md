# The missing lesson: when an AI acts like a friend

10 September 2026. Justin: "add missing lesson regarding ai."

## Why this exists

The school AI governance tool (PR #1027) joins a procurement risk to the lesson
that teaches a child about it. Seven links, six of which resolve to a real
module. The seventh does not:

```
risk:       The product behaves like a friend rather than a tool.
competency: Can I explain the difference between an AI that talks like a
            friend and a friend?
stages:     explorer, shaper
modules:    []
gap:        No module covers this yet. The nearest are the persuasion and mood
            lessons, and neither is about a machine that acts like a person who
            cares.
```

That gap is currently shown to schools, in amber, on the result page. It was
written down rather than papered over with a near miss, on the basis that it
would get filled. This fills it.

## What the evidence lets us say

From `research/2026-09-09-lesson-quality-council.md`, section 9, all verified:

- **KCSIE 2026 treats generative AI simulating harmful interaction as a contact
  risk, in force from 1 September 2026.** This is the spine. It makes the lesson
  a safeguarding matter rather than an IT one, and it is why a DSL cares.
- **Around six in ten 8 to 17s use generative AI.** The lesson is not
  hypothetical for the room.
- **Bastani et al., PNAS 2025:** unrestricted chatbot access produced 17 percent
  lower exam grades in a randomised trial of near 1,000 secondary pupils, and
  the harm disappeared with guardrails. Used for the dependence beat only.

**Never say, from the same section:** that AI is rewiring children's brains
(a preprint of 54 adults); the two sigma personal tutor promise; the retracted
learning gains paper; the 65 percent of future jobs figure.

## Placement

**KS3, sort_order 22.** The plan said insert at 15 and shift the rest. Building
it changed that, and the reason is worth keeping: the seven modules after KS3
carry their numbers inside their ids, so shifting the display number would have
produced a module labelled 16 whose id says `ks4-15`. Every surface that shows
the scheme filters by key stage and keeps array order, so placing the entry
after `ks3-14` in `shared/schools-curriculum.ts` puts it last in KS3 everywhere
without renumbering anything. Nothing shifts, nothing is renamed, and the
catalogue number, the id and the sort order all agree on 22.

`passport_stage` is `shaper`, which is what every KS3 module takes.

Why KS3 and not KS2: the competency lands on explorer and shaper, and shaper is
KS3. The KCSIE contact risk framing suits eleven to fourteen. A KS2 version is
worth doing later and is named as follow up work, not smuggled into this.

## The shape of the lesson

The three cycles, each anchored on a real slide heading so the player's cycle
map resolves (the rule migration 281 had to repair on ks4-16):

1. **Notice: It is built to sound like it cares.** What makes a companion
   product feel like a friend. Warmth is a design decision, not a feeling.
2. **Weigh: What a friend does that this cannot.** Not a put down of the tool.
   A friend has their own day, can be wrong with you, can be told a secret they
   then carry, and can notice you are not alright without being told.
3. **Decide: What I do when it starts to matter.** The escalation move. Who a
   pupil tells, and that telling is never trouble.

The lesson never says the tool is bad or forbidden. Non negotiable 1 applies:
never allow or deny, always a calibrated pathway.

## The contract every module has to meet

21 `teacher_notes` keys, matching every other module: `commitment_stem`,
`cycles`, `differentiation`, `equipment`, `essential_question`, `exit_quiz`,
`i_can`, `key_learning_points`, `keywords`, `learning_objective`,
`misconceptions`, `paper_fallback`, `passport_stage`, `prior_knowledge`, `send`,
`starter_quiz`, `teacher_tip`, `timing`, `tool`, `worksheet`, `worksheet_items`.

Plus the bars the scheme now holds itself to:

- Cycle minutes equal the teach phase (270, 281) and every cycle title anchors
  on a heading in its own deck.
- No passive stretch longer than four minutes (279, 280).
- Wall scale and contrast: nothing under the ISO 9241 legibility floor, every
  text node clear of WCAG AA on the projector (276, 278, and the rendered
  contrast guard).
- The timing string must state the real total, which is the one thing all 21
  existing modules currently get wrong. This module will be the first that does
  not, and the fix for the other 21 stays a separate migration.

## Migration

**282.** Claimed in the draft PR at the same time as this plan lands. One insert
plus the `sort_order` shift, both inside the existing transaction and backup
pattern. Guards: the cycle rules from 281, the contract key set, and the beat
cadence.

## Also changing

- `shared/ai-governance/passport-links.ts`: the companion link gains the module
  and loses its `gap`. `scripts/ai-governance.test.mjs` already asserts every
  linked lesson resolves in `CURRICULUM`, so the repo copy has to gain the
  module in the same commit or the guard fails. That is the guard doing its job.
- `shared/schools-curriculum.ts`: the new module.

## Out of scope, named rather than quietly dropped

- The KS2 version of this lesson.
- The 21 timing strings that under state their totals.
- Applying 281 or 282 to production, which wants a human eye.
