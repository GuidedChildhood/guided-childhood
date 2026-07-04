# The operating system for modern parenting: vision spec

**Date:** 2026-07-04 (decisions locked with Justin via structured questions)
**Source:** Justin's vision update plus Duolingo reference screenshots (the lesson path home and the one thing per screen exercise). Keep the existing app, do not rebuild, add carefully.

## The four locked decisions

1. **The path, everywhere.** The Duolingo winding node path becomes the platform's spine: the starter result page shows week one as a path, the dashboard home IS the path organised around today (today's node glowing butter, done nodes flipped to their pastel, the future visible but locked grey, DiGi beside the current node, a stage banner on top: "Stage 2 · Builder · Week 3"). The monthly curriculum extends the same path, each month a section, each script or lesson a node.
2. **Streaks and progress, no gimmicks.** Streak flame, node completion, stage progress. No XP, gems or hearts: calm Duolingo, Good Inside tone, consistent with the ten minute daily close.
3. **Five part Moment anatomy, migrated everywhere.** Every moment answers: what is really happening developmentally, what the child is learning, try saying (the script), what not to say, the skill being developed. A difficult moment is not a failure, it is a chance to build a skill. Agent content pass adds the two missing fields (what the child is learning, skill being developed) to all 160 existing scripts. New columns on scripts table.
4. **The Today stack.** The top of the dashboard home is a Google Now style swipeable card stack answering the three questions: What matters today? (Things you need to know: school actions, dates, kit) · What does my child need next? (the pathway node) · How do I handle this moment? (today's moment). Everything else lives below the fold.

## Naming locked
- The tagline: the operating system for modern parenting.
- The school actions card is called "Things you need to know". Raw emails never shown, only extracted actions.

## The exercise screen pattern (Duolingo image 2)
One thing per screen wherever the parent interacts: character (DiGi) asks in a speech bubble, parent answers with chips or a tap, one primary button. Applies to the quiz (built), answerable DiGi cards, moment check ins, the evening catch up.

## Build order (next sprint, after Justin's live walkthrough findings)
1. Migration: scripts gain child_learning and skill_built columns; streaks table if not already served by daily_sessions.
2. Agent content pass: five part anatomy across all 160 scripts (batch, verified, no dashes).
3. PathwayPath component (one component, three consumers: starter result, dashboard home, curriculum).
4. Today stack on dashboard home (Things you need to know card wired to school_actions, today's moment, next node).
5. Streak flame in the header, wired to daily_sessions.
6. Starter result page swaps its week strip for the real path component.

## Carried principles
Smartphone first examples. Tokens only, GSAP only, no dashes, Justin's voice. The ten minute close. Mobile checked before done. Device guide prompt from Justin still to come (he flagged it).
