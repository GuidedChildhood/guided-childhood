# DiGi proactive audit — 19 August 2026

Justin: "a real audit of DiGi, that it is also proactive on advice that matches
child and age, and devices and platforms researched and used for that age, and
common problems."

Audited the four systems that make DiGi proactive or age aware, against the
live database and the code.

## What was already right, verified rather than assumed

- **Expert knowledge is age banded and retrieval filters by band.** Every row in
  `expert_knowledge` carries `age_bands[]` (migration 019), and BOTH retrieval
  paths respect it: the semantic search passes `band` into
  `match_expert_knowledge` (migration 142), and the keyword scorer takes the
  band too. A question about a nine year old is answered from nine year old
  research.
- **Platform guides arrive at the right age.** `social_platform_guides` carries
  `first_seen_stage` (migration 093), so WhatsApp guidance surfaces when a child
  reaches the stage where WhatsApp becomes real, sourced from the platforms' own
  terms plus Internet Matters, NSPCC, Childnet and Ofcom.
- **Device and screen life context is per family and live**, and the reactive
  chat now takes `?child=` so memory, concerns and questions all file against
  the child the parent has open (fixed earlier this week).
- **The grounding rule holds.** The prompt writer is forbidden from inferring a
  situation from age or family shape, and must build only from recorded
  concerns, memory and pathway facts.

## The fault: proactive DiGi was blind to every child but the first

`app/api/digi/prompts/route.ts` line 45 read `is_primary` and scanned ONE
child. So a mood dip on Olga's weekly check, low sleep two weeks running, a
phone flag on her balance report: none of it could ever trip a proactive
prompt. The proactive half of DiGi could not see her, in the one place whose
whole job is noticing.

**Fixed today.** Every child is scanned for signals: wellbeing dips, the young
age phone flag, streak milestones. The routine cadence pair (daily tip, parent
care) stays family level and fires once, so three children never means three
copies of the same tip. The budget stays two prompts a day, and a signal about
a child outranks the routine drumbeat when the cap bites. Each prompt names its
child, is written for that child's age, and is FILED against that child.

## The genuine gap, recommended rather than built

Nothing proactively marks a child ARRIVING at an age. The platform guides know
`first_seen_stage`, but nothing watches for the crossing, so DiGi never says
"Olga turns eleven soon, and this is the age WhatsApp starts appearing in her
class. Here is where we stand on it." That is the most valuable proactive
moment this product could own, the advice arriving BEFORE the problem, and all
the data for it already exists: date_of_birth, stage boundaries,
social_platform_guides, and age banded expert knowledge.

Recommend: a stage arrival trigger in findTriggers, firing once per child per
stage crossing, drawing on the platform guides for that stage. One migration
(a `stage_arrival_prompted` mark per child per stage) and one trigger. Not
built today because the check in and passport work is ahead of it in Justin's
order.
