# The split: one repo, two apps, two Vercel projects
**9 Aug 2026 · Approved by JP. This branch carries steps 1 to 4 only. Steps 5 to 9 (the FK drop, the schools schema move, the cutover, the parents folder move, cleanup) wait for JP to schedule the cutover day. Full audit with every entanglement item: the split audit artifact, 9 Aug.**

## Why

The schools framework grew inside the parent app. Before it goes further it
moves to its own top level app on its own Vercel project, Oak model: no login,
open catalogue, zero prep lessons. A bad parents deploy must never break
schools and schools must never import auth, session, membership or billing.

## The target

- One repo. Top level parents/ (later, step 8), schools/, shared/.
- shared/ = tokens, lesson slide grammar, the player and characters, EfCW
  strands, curriculum badges, brand, the social media law flag. Never the
  Supabase clients: each app keeps its own, so shared can never read a session.
- schools/ = the marketing page as homepage, open curriculum catalogue,
  teach, print room, the hub. Anon reads with ISR. No middleware, no crons,
  no API routes, no Stripe, no login. Educator accounts (classes, pupils,
  deliveries: 1 class, 0 pupils, 0 deliveries live) are PARKED, not ported.
- Database: one Supabase project; the 11 schools tables move to a schools
  schema at step 6 (not this branch). kid_lesson_missions stays parent side,
  its FK to school_lessons becomes a soft uuid at step 5 (not this branch).
- Star Lessons and the kid app keep working at every step: the four
  school_lessons read sites are re pointed in the same deploy as the schema
  move, and the Playwright gate below proves the flow before and after.

## Steps on this branch

1. Untangle in place: player classMode CTA becomes a prop, stage characters
   inlined into schools-curriculum, PrintButton deduped, dead school_lesson
   lesson_source branch deleted.
2. shared/ package (@gc/shared, file: dependency, transpilePackages): moves
   lesson-slides, curriculum-badges, new efcw.ts single strand source,
   social-media-law, brand, LessonPlayer, AnimatedIntro, interactives,
   DigiCharacter, PrintBrand. Eslint boundary rule: shared and schools may
   never import supabase server or admin clients, stripe, or the Anthropic SDK.
3. tokens.css extracted from globals.css into shared; DESIGN_SYSTEM.md
   rewritten from the real tokens (the current file documents a design system
   that does not exist).
4. schools/ app scaffolded and building green with zero env, plus
   e2e/star-lessons.spec.ts: the send, play, quiz, stars land flow that gates
   step 6. Run it against a preview URL with a seeded kid token.

## Lanes

This branch is the platform lane and touches structure only. No copy, no
curriculum content, no DiGi. Migration numbers: none claimed on this branch
(steps 5 and 6 will claim theirs when JP schedules the cutover).
