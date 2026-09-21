# The core and the extension

Justin approved this on 21 September 2026, from the curriculum review.

## The problem, measured

26 of 29 lessons run longer than 55 minutes. The median is 69 and the longest
is 73. A typical secondary period is 50 to 60 minutes, and a teacher who has
settled a class has less than that.

A reviewer heard what actually happens in the room: **teachers cut the last two
practise slides to reach the exit quiz.** Some do not reach it at all.

Here is why that is worse than it sounds. Every lesson in the scheme puts its
minutes in the same shape:

| Phase | Minutes, across all 29 |
| --- | --- |
| starter | 9 to 12 |
| teach | 10 to 33 |
| practise | 11 to 20 |
| **prove** | **4, in every single lesson** |
| close | 4 to 10 |

The prove phase is four minutes long and it is at the end. It is the exit quiz,
which is the assessment evidence a head is buying and the thing the tracker
reads. So a teacher who stops when the bell goes loses one hundred per cent of
the assessment and keeps all of the explaining.

**The instinct is exactly backwards, and no amount of publishing the true length
fixes it.** That is what this builds.

## The design

Not a stopping point. A **droppable set in the middle.**

Individual slides carry `extension: true`. The core is every slide without it.
A teacher short of time skips the marked ones and still runs the whole arc,
lands the objective, and reaches the exit quiz.

Rules, enforced rather than described:

1. A slide may be marked extension **only in the teach or practise phase.**
   Never starter, never prove, never close. The arc has to survive the cut.
2. **The core fits 55 minutes**, which is a 60 minute period with five minutes
   of settling. 8 to 18 minutes per lesson need marking, against a teach phase
   of 26 to 33, so this is comfortably possible without gutting anything.
3. **The core still teaches the objective.** Every `key_learning_point` in
   teacher_notes must still be reachable from a core slide, and every protected
   phrase must still appear in the core.
4. **Nothing is deleted and no minute changes.** The published length stays the
   real total of every slide, core and extension together, because that is what
   a lesson actually contains. The card gains a second figure, not a smaller
   one.
5. The three youngest lessons (42, 48 and 50 minutes) already fit. They get no
   extension marks and the guard expects none.

## What gets built

- `shared/lesson-slides.ts`: `extension?: boolean` on the slide type.
- The migration that marks the slides, one guarded batch, hash proved against
  content/modules as every content migration in this repo is.
- `scripts/check-lesson-core.mjs`: holds rules 1 to 5 above, prints the core and
  total per lesson with `--list`, and goes into `concern-guards` beside
  check-lesson-minutes.mjs. A core that drifts over 55, an extension mark in the
  prove phase, or a lesson whose core no longer carries a protected phrase all
  fail the build.
- The player: an extension slide is still played, and its chrome says so, so a
  teacher watching the clock knows this is the one to skip next time rather than
  discovering it at the bell.
- The prep page and the printed run sheet: the core minutes and the total, and
  the extension slides named, so the decision is made before the lesson rather
  than during it.
- `shared/schools-curriculum.ts` and the curriculum map: the card shows the core
  figure alongside the true total.

## Order

After ks3-12 gains its two missing beats, because that lesson changes length,
and after migration 325 applies the must findings, because those are string
edits and must not collide with a structural pass.

## What this is not

It is not a trim. It is not a second, smaller published length. It is not a
rewrite of a single teaching slide. Justin's 21 September call on the shop
window stands: the length a school sees is the real one.
