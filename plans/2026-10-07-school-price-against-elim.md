# The school price, weighed against eLIM (7 October 2026)

Justin: "I'm charging for my school platform but I can see local schools are
using this, so my wife, a teacher, thinks it may be too expensive. Review for
me." Link: https://www.somersetelim.org. Run through the feedback-filter skill:
the advice is an input, weighed against THE-STORY.md section 9 and review.md.

## What eLIM is (read from its own pages, 7 October 2026)

- A traded service inside Somerset Council, selling to schools nationally.
- **ActiveBYTES Online Safety**, primary only: "Complete Online Safety Scheme
  of Work £197.40 for any UK Primary School". The page does not say whether
  that is a year or once; existing customers receive the 2026 to 27 update,
  which reads like a subscription. EYFS to Year 6, "an Online Safety lesson
  plan for each year group for each half term", termly assemblies per key stage, EYFS continuous provision guidance,
  progression and self assessment grids, SEND guidance, pupil surveys, reward
  materials, ideas for sharing learning with families. Mapped to the 2025 RSHE
  guidance and the computing curriculum. AI being added through 2026 to 27.
  Delivered through a SharePoint portal for logged in customers.
- Also New Wessex Computing (primary computing planning, price on request),
  CPD and termly update meetings, Digital First Steps for EYFS, pupil voice
  surveys, 360 Degree Safe.
- Nothing for secondary or post 16.

## Ours (schools/lib/pricing.ts)

Primary up to 200 pupils £495, primary 200 to 500 £795, secondary £1,495,
secondary 1,000 plus £1,995, trust on application. A primary gets 16 lessons
(EYFS 3, KS1 4, KS2 9), each ready on the board with the script on every
slide, print packs, parent notes with home codes, the Hub (RSHE mapping,
policy, DSL notes, CPD briefings). The £495 entry was kept on 13 September
2026, before this local price was known.

## The arithmetic a head will do

| | eLIM ActiveBYTES | Guided Childhood |
|---|---|---|
| Small primary | £197.40 (term not stated) | £495 a year (2.5 times) |
| Primary 200 to 500 | £197.40 (term not stated) | £795 a year (4 times) |
| Primary lessons | about 36 plans (Years 1 to 6) plus EYFS guidance and assemblies | 16 complete lessons |
| Secondary and post 16 | none | 17 lessons, £1,495 to £1,995 |

On paper, to a Somerset primary that already pays eLIM, we cost two and a half
to four times as much for fewer lessons, and more than that if their £197.40
turns out to be a one off. The difference that is ours (ready to
teach with nothing to prepare, the parent link into the parents app, the Hub)
does not show up in that arithmetic.

## Verdicts

| Point | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| Too expensive for primaries | "thinks it may be too expensive" | **Adapt.** The need is real: we sit at 2.5 to 4 times the price local primaries already pay. A founding rate at the local price, rather than cutting every band, keeps the list price and removes the objection for the first schools. | Schools as distribution (THE-STORY section 9: one primary is a couple of hundred families with the school's endorsement) | Small |
| Local schools already have a scheme | "local schools are using this" | **Adapt.** Lead with what eLIM's own pages do not offer: KS3 to KS5, the lesson on the board with the words on every slide, the parent notes into the parents app. Claim nothing about eLIM we have not read on its pages. | The customer test; evidence or silence | Small |
| Secondary bands | (not raised) | **Park.** eLIM sells nothing for secondary, so this evidence does not touch those bands. Revisit on the first secondary price conversation. | | |

## Found on the way

THE-STORY.md section 6 still says "against Jigsaw at £795 entry". The
9 September check (comment in schools/lib/pricing.ts) found that figure
untraceable; Jigsaw's own site says from £495 for a whole primary. The story
needs the correction.

## The decisions that are Justin's

1. **A founding schools rate?** Recommended: the first 50 schools, any
   primary at £195 a year, held while they stay, capped in code like the
   founder parent rate. List prices stay. The five pilots convert at it.
   Alternative: cut the primary bands outright.
2. **Secondary unchanged for now?** Recommended: yes.

Not built until Justin answers.
