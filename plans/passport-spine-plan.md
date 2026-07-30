# The passport as the spine: catch up, merchandise, and the road to 16

29 July 2026. JP, and this is the whole product rather than a feature:

> "make sure we tell them every step that this passport pass is achievable and
> how linking to want needs to be done ... if child starts app at older age it
> shows a way of completing the previous stages and reminds parents, then
> reflects character earned on child app for previous periods ... encourage
> purchasing the passport so when they complete a stage they can get hold of
> stickers and related merchandise ... gamify the whole concept of learning,
> passing tests and being ensured at 16 with full passport and safe and trained
> in jobs for devices ... Dr Becky style and other child clinicians such as
> Catherine Knibbs ... don't stop until this all works logically simply and is
> achievable by times, ages, ability to catch up earlier years."

Mapped rather than started, because this is weeks of work and because two parts
of it need decisions before a line is written.

## What already exists

- The passport page, five sections, per stage, with the stamp logic (fixed this
  morning, PR 592). Screenshot confirms Foundation showing 0 of 5 green.
- Stage characters, one per stage, and a sticker book keyed partly to stage.
- Lessons and tests per stage with pass tracking.
- Catch up language already appears in PassportBook, StageRoad, StageRoadMap
  and literacy-status. NOT yet verified as a working flow, only as strings.

## The chain that has to hold, end to end

1. A parent joins with a child of any age, say 11.
2. The passport shows Explorer as current AND Foundation and Builder as
   catchable, not as failures.
3. A catch up route exists per earlier stage that is realistic for an 11 year
   old, not the four year old version.
4. Passing an earlier stage stamps it, awards the character for that period,
   and that character appears on the CHILD app as earned.
5. Each stage pass is celebrated and offers the physical sticker or merchandise
   to the PARENT.
6. At 16 the passport is complete: trained, safe, good habits, evidenced.

Step 4 is the one most likely to be missing, because it crosses the parent and
child apps and nothing this session has touched that seam.

## Two things that need a decision before any build

### 1. Named clinicians

The code already names Dr Becky Kennedy in lib/digi/weekly-plan.ts, in DiGi's
system prompt and in generated weekly plans, and JP now wants Catherine Knibbs
too. Both are real, living, practising professionals.

Naming a real clinician in product copy reads as endorsement whether or not it
is meant that way, and a parent choosing a paid product partly because a trusted
name is on it has relied on that. Same category as the ICO work: cheap to get
right now, expensive and reputationally ugly to get wrong later.

Options, in order of cost: describe the approach without the name ("connection
before correction, the approach popularised by leading parenting clinicians"),
or get written permission from each named person, or cite published work
properly as a reference rather than as a badge.

This needs settling BEFORE launch, and it applies to the existing Dr Becky
references as much as to any new one.

### 2. Selling to a child

"Complete a stage, get stickers and related merchandise" is a good loop. Where
it is offered decides whether it is a good product or a problem.

The ICO Children's Code is explicit that a service must not use a child's data
or progress to push commercial pressure at them. A child finishing a stage and
being shown a shop is exactly the pattern it names. A child finishing a stage
and being shown their new character, while the PARENT separately gets an offer,
is fine.

So the rule, and it should be written into CLAUDE.md as a non negotiable: every
purchase prompt goes to the parent, never to the child app. The child gets the
celebration; the parent gets the option to buy.

Physical merchandise also brings its own obligations that the product does not
have today: consumer contract rights, a returns policy, delivery terms.

## Build order once those are settled

1. Verify what catch up actually does today. The strings exist; the flow has
   not been walked. Start there rather than building on an assumption.
2. Close the parent to child seam: an earlier stage passed must award its
   character and show it on the child app for that period.
3. The stage pass moment: celebrate on the child app, offer merchandise on the
   parent app, same event, two audiences.
4. The "you can still get there" thread: on every stage page, for a child who
   joined late, what is left and by when.
5. The 16 year old end state, said plainly at the start so a parent knows what
   they are buying into.

## Note on scope

JP asked me not to stop until this works. It is the right ambition and it is
also several weeks. The honest sequence is to verify catch up first, because
everything above it assumes catch up works, and nobody has checked.
