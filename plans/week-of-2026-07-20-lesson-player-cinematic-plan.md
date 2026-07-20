# Week of 20 July 2026 — the cinematic lesson player, kid lessons, class mode

The booked player upgrade (decisions.md, 20 July: "Booked: the lesson library
grows on a rhythm" plus "The lesson player build carries the schools wow
brief"). One player build lifts every lesson at once because slides are data.
The family app lessons stay the family version; the school curriculum stays
its own deeper tier, and the whole class mode showcases toward it.

Lane: platform code (lesson player and lesson surfaces). No migration needed:
kid completions reuse lesson_completions under the parent user_id with the
existing passed and score columns from migration 079. Migration 084 is left
free for the next claim.

## 1. Cinematic player (in place, components/lessons/LessonPlayer.tsx)

The existing player becomes a full screen takeover, one idea per slide, so
every surface that already renders it (parent lessons, AI modules, educator
teach, kid star lessons) upgrades at once.

- Full bleed cream stage, huge Nunito 900 headlines, content centred.
- Thin butter progress bar along the top, GSAP animated.
- GSAP slide transitions plus staggered element reveals: concepts, lists and
  diagrams build piece by piece via data-reveal marks.
- Swipe (touch) and arrow key navigation. Enter or ArrowRight continues,
  ArrowLeft goes back.
- Rosenshine worn openly: a quiet mono phase label on every slide, mapped
  starter RETRIEVAL, teach TEACH, practise PRACTISE, prove PROVE, close
  CLOSE. The near miss retake is framed as retrieval practice.
- Choice slides tactile: big tappable answers with the pressed 0 5px 0 edge,
  instant warm feedback, GSAP pop. Score and the 70 percent pass system are
  untouched.
- DiGi slides get the app greeting treatment: butter star avatar circle plus
  white bubbles popping in one by one.

## 2. Curriculum badges (honest, no overclaiming)

lib/content/curriculum-badges.ts maps what already exists:

- Key Stage from the stage: Foundation KS1, Builder KS2, Explorer KS2 to 3,
  Shaper KS3, Independent KS4.
- Education for a Connected World strand from the lesson category:
  safety to Online relationships, online_risks to Privacy and security,
  screen_habits and wellbeing to Health, wellbeing and lifestyle,
  ai categories to Managing online information, identity or social to Self
  image and identity.

One small mono chip each on the lesson intro slide and on the hub cards.

## 3. Child app lessons (the both sides part)

- /k/[token]/lessons: My lessons on the kid dark theme, listing the child's
  stage lessons (stage from children.age_band through the kid link), passed
  ticks, warm kid copy.
- /k/[token]/lessons/[lessonId]: the SAME player as a light full screen
  takeover, kid friendly copy, teacher scripts stripped server side.
- /api/kid/lesson-complete: token authenticated, admin client, upserts
  lesson_completions under the parent user_id with the existing passed and
  score semantics, fail soft pre migration, best effort parent push.
- Passing celebrates with stars language and points back to their road.
- A My lessons tile joins the kid home grid.

## 4. Whole class mode (the schools showcase)

- /class/[lessonId]: no auth, read only render of a live family lesson at
  projector scale, teacher advances with arrow keys, choice answers big for
  hands up, scripts stripped.
- One quiet end slide: "This is the family version. The full school
  curriculum goes deeper", pointing at /schools. Showcases toward the school
  tier, never presents the family lesson as the school offer.

## Verify

npx tsc --noEmit clean, then fixture screenshots on port 3813: a concept
slide with phase label and badges, a tactile choice slide, the kid list, and
the class projector view.
