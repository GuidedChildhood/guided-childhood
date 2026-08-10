# The AI Companion Strand, product brief and build plan

**Date:** 9 August 2026. **Owner:** Justin. **Status:** brief for approval, then build.
**Source of the bet:** briefings/2026-08-new-service-landscape.md, lead option.
British English, no dashes anywhere, Justin's voice, Checker tokens, content in the database.

---

## 1. The one line

A short, standalone thing a parent can buy or start this week that teaches their
child what an AI companion actually is, hands the parent the words for the "my
chatbot said" conversation, and opens the door to the whole pathway.

## 2. Why this, why now

The briefing ranked five options and put this first, for four reasons that all
point the same way.

- **Peak fear, fresh evidence, thin pushback.** Three independent 2026 studies
  converge (Stanford, Drexel, Aalto), and unlike the older social media argument
  the counter literature is thin, so we can act without overclaiming.
- **The law just made it a duty.** RSHE names AI and chatbots explicitly from 1
  September 2026. Every school has a gap to fill this term, and every parent is
  about to hear the words for the first time.
- **Almost entirely unserved.** The industry answered this with lawsuits and
  settlements, not with a single lesson that teaches a child how to handle it.
- **We have a running start.** Module 15 is already written in all three
  versions, and the AI literacy architecture (ai_lessons, ai_updates, the reader,
  the DiGi handoff) is already built. This is a fast, credible first move, not a
  cold start.

## 3. What already exists (the running start)

- **Module 15, AI companions and chatbots**, full three version build:
  content/curriculum/social-media-13plus/module-15-ai-companions-and-chatbots.md.
  Schools seven beat lesson with the 2026 RSHE hook, a kid interactive lesson
  with host Nova, and a parent co view guide. The pedagogy is done.
- **The AI literacy layer**: ai_lessons and ai_updates tables, the draft only
  refresh route, lib/config/ai-module.ts, and the member facing reader with an
  Ask DiGi button (see plans/ai-module-plan.md).
- **DiGi**, the parent facing calibrated guide, with the companion prompt already
  drafted inside module 15 (the "tool that stays a tool" worked example).
- **The pathway spine** (foundation, builder, explorer, shaper, independent) the
  strand plugs into, so a standalone buyer has somewhere to go next.

## 4. The gap (what makes it a product, not a document)

The lesson exists. The product does not. Five things stand between the two.

1. **A standalone entry**, a single page a parent can land on, understand in
   thirty seconds, and start, marketed on its own and routing every CTA to
   /starter-pack. This is the wedge.
2. **The wiring**, module 15's three versions moved off the markdown and into the
   live tables (school_lessons for the two school and kid versions, lessons for
   the parent row), which the module doc itself flags as the build session's job.
3. **The "my chatbot said" script**, the parent's word for word conversation,
   held in the scripts table like every other script, not hardcoded.
4. **The DiGi companion pathway**, the calibrated prompt from module 15 wired so
   DiGi actually reaches for it when a parent raises a companion, never allow or
   deny, always a pathway.
5. **A light companion signal** in the balance and passport surfaces, so a family
   already inside sees the strand surfaced at the right moment. Optional for v1.

## 5. The product, three tiers of ambition

Pick the altitude. The build plan below is written for the middle one.

- **v1, the wedge (about a week).** The standalone page, the wired parent lesson,
  the "my chatbot said" script, the DiGi pathway. A parent can start free, learn
  the frame, get the script, and be pulled toward the pathway. Ships fast, tests
  the demand, costs almost nothing because the content exists.
- **v2, the strand (two to three weeks).** Add the child interactive lesson live
  in the app, the schools version into the school_lessons flow, the companion
  signal in balance and passport, and a short three step mini pathway (what it
  is, why it feels like a friend, when a bot is not a person) a child completes.
- **v3, the living module (ongoing).** Turn on the ai_updates feed so the strand
  stays current as new companion apps and safety stories land, with the human in
  the loop publish step that plan already specifies. This is the durability, and
  the reason a competitor cannot copy it once and be done.

## 6. Positioning

- **The wedge line.** The ban will not parent for you. A bot is a tool, and the
  things that matter go to real people.
- **The stance, straight from module 15.** Two buckets, calm about the general
  panic because most teens are fine, serious about the lonely minority who lean
  too hard. Never "AI is bad", never waved through. This is the honest position
  that survives a hostile expert.
- **The funnel.** Standalone companion page, free start, into /starter-pack, into
  the pathway. The companion fear is the door, the pathway is the house.
- **Pricing.** v1 free as the lead magnet. The strand sits inside the existing
  subscription, not a new SKU, so it deepens the core offer rather than
  fragmenting it. Revisit a schools line item once the school_lessons version is
  live.

## 7. Build plan (v2, phased, each phase shippable)

**Phase A, the wedge. One PR.**
- New route, the standalone AI companion page, Checker tokens, Nunito, the two
  bucket frame, one clear start, every CTA to /starter-pack.
- Seed the parent co view guide (module 15 version C) into the lessons table.
- Add the "my chatbot said" script to the scripts table, tagged to the shaper
  stage and the companion challenge.
- Wire DiGi to reach the module 15 companion prompt when a companion comes up.
- Mobile and desktop checked in Chrome DevTools before it is called done.

**Phase B, the child strand. One PR.**
- Seed module 15 version B (the Nova interactive lesson) into school_lessons and
  surface it in the child app at the shaper stage.
- A three step mini pathway a child completes, unlocking the next pathway capability.

**Phase C, schools and signal. One PR.**
- Seed module 15 version A (the seven beat schools lesson) into the schools flow,
  keyed to the RSHE September duty for the schools pitch.
- A light companion signal in the balance report and passport row, so an existing
  family sees the strand at the right moment.

**Phase D, the living layer. Separate, needs a go-ahead.**
- Turn on the ai_updates feed per plans/ai-module-plan.md, trusted sources,
  draft only, human approves before anything reaches a family. This is the
  child safety gate and stays manual on purpose.

## 8. Risks and the honest limits

- **Overclaiming the harm.** The evidence is young and mostly observational. The
  two bucket discipline is the guardrail, and it is already baked into the
  content. Hold it.
- **Reading as a new product to maintain.** Keep it inside the subscription and
  the existing tables so it is a deepening, not a second thing to run.
- **The living layer is a real cost and a real safety call.** That is why Phase D
  is fenced off behind its own go-ahead and keeps the manual publish step.

## 9. What is needed from Justin

- **A yes to the altitude.** v1 wedge only, or v2 strand (recommended, since the
  content is already built and the extra work is mostly wiring).
- **One decision on pricing.** Free wedge inside the subscription, as above, or a
  separate paid strand. Recommendation, free wedge.
- **The Phase D call can wait** until the wedge proves the demand.
