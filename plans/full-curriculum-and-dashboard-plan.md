# Full curriculum + industry leading teacher dashboard — build plan
**6 Jul 2026 · JP directive: do not stop until the full curriculum is in and the dashboard beats Twinkl, Oak and Jigsaw combined. Current slides look basic and are not enough for a teacher to give a full lesson.**

Branch: claude/lesson-3-5-deep-dive-4mzjyp (PR #91, stacking). Migrations claimed: 031 (done), 032, 033.

## What "not enough for a full lesson" means, concretely

Oak's lesson unit is the benchmark teachers recognise: starter quiz, exposition in cycles,
practice tasks, exit quiz, slide deck AND worksheet AND plan, all consistent. Our v2 deck
has depth of content but the PLAYER does not show the lesson's shape: no phases, no
timings, no talk tasks, no sense of a 60 minute arc. Fix the grammar, then refit the deck.

## Phase 1 — Lesson engine v3 (the grammar)
- Slide base gains `phase` ('starter' | 'teach' | 'practise' | 'prove' | 'close') and `minutes`.
- New slide types: `discussion` (talk task: prompt, seconds, pair/group/class mode),
  `stat` (one big number with source line, the evidence register).
- Player: phase strip above the progress bar (Starter → Teach → Practise → Prove → Close,
  current phase lit), timing chip per slide, "Slide N of M" counter, discussion timer.

## Phase 2 — Reference lesson v3 (migration 032)
Refit ks3-12 with phases, minutes, two discussion slides, one stat slide. ~28 slides.
This deck is the exemplar every other module copies.

## Phase 3 — THE FULL CURRICULUM (migration 033, the big one)
All 20 remaining modules seeded as complete school_lessons rows:
- Full slide deck in the v3 grammar per key stage register (EYFS short and teacher led,
  KS1 picture world, KS2 squad adventure, KS3 detective, KS4 straight talking, KS5 clean).
- Teacher script on every slide. No video slides yet (beats land when Higgsfield credits
  are topped up); digi/diagram/scenario slides carry the load, which also satisfies the
  paper fallback principle.
- teacher_notes complete: learning_objective, timing, misconceptions (3), differentiation,
  paper_fallback, worksheet_items (6, so the worksheet prints), keywords.
- parent_note, dsl_note where flagged, statutory hooks, EfCW strands per spec section 5.
- Production: 20 parallel drafting agents, one per module, each fed the house style guide
  and the reference deck. Output validated (JSON parse, slide types, no em dashes, no
  semicolons in strings) then assembled into one dashboard safe migration.

## Phase 4 — The teacher dashboard
- Shared educator layout: top nav (Home · Curriculum · Classes · Print room · Help),
  school name, sign out. Every educator page gets it.
- Dashboard home rebuilt: stat row (classes, pupils, lessons taught, coverage %),
  "teach next" suggestion per class, quick links, the curriculum map card, classes.
- Print room index: /educator/print lists every module's pack, booklet, quizzes in one place.

## Phase 5 — Marketing /schools page refresh
Show the real product: curriculum map screenshotless walkthrough (cards), the lesson
anatomy, the pack list, pilot offer CTA. Reuse the schools-curriculum manifest so the
marketing page and the product never drift.

## Order and gates
1 → 2 (exemplar ready) → 3 (agents fan out) → 4 while agents run → assemble 033 → 5 → ship.
Non negotiables: no dashes in copy, Checker tokens only, scripts in DB, DiGi is the star.
