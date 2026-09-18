# Schools: five asks from Justin, 18 September 2026

Two messages, five things. Schools app only. Nothing may break the wiring.

> "the sample video has bloop talking and says this is hot and points but no
> photo [we] have. a funny photo as if on instagram with the likes it says
> showing bloop doing something silly. Also the digi intros can we explain
> which lesson it is, welcome, still tight, or a great industry leading intro
> as if you were introducing a lesson to come"

> "the tracker should be more prominent and give more information on what it
> achieves and why helpful. also can we have a demo animation of how they tick
> as you do lessons and print necessary info etc. also why are the lesson
> numbers out of sync?"

## N1. The lesson numbers are out of sync (do first: highest value, lowest risk)

Justin is right and it is on the page he screenshotted. `n` is the BUILD
number, not a teaching position, and the map renders it as though it were one.
KS2 reads M04 M05 M06 M07 M08 M09 **M23 M25**. KS3 reads M10 to M14 then
**M22 M24**. KS5 (M20, M21) sits under KS4 (M15 to M19).

Worse, `print/passport/[stage]` sorts by `n` and stamps the passport page with
it, so a KS2 child's page carries stamps numbered 4, 5, 6, 7, 8, 9, 23, 25 for
eight lessons.

- `moduleId` and `n` do NOT change. They are stable keys in the database, in
  every migration, in the print routes and on the passport stamps.
- Add `positionOf(moduleId)` to `shared/schools-curriculum.ts`: the teaching
  position within its own key stage, derived from CURRICULUM order.
- Show the position where a number reads as a sequence (map, tracker, print
  room, year plan, passport stamps). Keep the module code where it is a
  reference (RSHE matrix, DSL list), quietly.
- Guard: `check-lesson-numbers.mjs`, ratchet style, so a number that reads as a
  position is a position.

## N2. The tracker, more prominent, and it says what it is for

`/hub/tracker` is one row in the Hub. It is the page a subject lead shows an
inspector, and it is the only coverage record the scheme produces. It should
lead the Hub and say, in a line each: what it achieves (a printable coverage
record), why it helps (evidence for the deep dive without a register), and what
it deliberately is not (no pupil data, no accounts, which is what lets a school
start in a week).

## N3. The demo animation: how a lesson ticks

A small, honest animation on the tracker that shows the five steps ticking in
order as a lesson is taught: read it, print the pack, open it on the board,
reach the finish, fill the passport page. GSAP only, reduced motion respected,
no new dependency. Plus the print line: what the coverage sheet actually
contains and when to print it.

## N4. The photo the video points at

`ks3-12` slide 6 is a video: Orbit holds a photo up and says "This photo got
two million shares. It is completely fake." Nothing is on screen. The class is
asked to look at a photo that does not exist. Slide 7 is a football transfer
post rendered as a 🎬 emoji, and its number (48,200) does not match the clip's
(two million) either.

- `ScenarioSlide` gains an optional `picture`: a Planet Friend cutout rendered
  as the post's photo. Additive, so every existing row renders exactly as it
  does today.
- Migration 302 inserts one scenario slide straight after the video: a post of
  Bloop doing something silly, two million likes, drawn from Bloop's own art.
  Zero credits: FriendPlate already proves the cutouts carry a beat.
- The minute comes from the vote slide (2 → 1), so the teach phase total, the
  cycle minutes and the stated timing string are all untouched.
- Why Bloop and not a real person: you cannot put a real face on a fake post in
  a classroom deck. A fake of our own character is safely, provably fake, the
  class laughs, and then the football post is the one they cannot call. That
  contrast is a better teach than either slide alone.

## N5. The intro bills the lesson

`INTRO_CHARACTERS[x].line` is a generic hello on all 25 modules ("Yay, you came
back! Today is going to be brilliant."). It never says what today is.

The billing a good course intro gives: who is talking, what today is, what you
will be able to do by the end, go. Three of those four are already in the deck
(the friend, the title, the objective's `i can`), so the intro can bill itself
from data rather than from 25 hand written lines.

- `AnimatedIntro` gains an optional `promise`, rendered under the title.
- The friend's hello names the lesson.
- A deck's own `line` still wins, so the DSL modules stay quiet.

## Verification (every batch)

1. `npx tsc --noEmit` at the root and in `schools/`.
2. Every argument free guard, by exit code, plus `wiring-check` for new breaks.
3. `check-cycle-anchors --fixture` before and after the migration.
4. Chromium at 390 and 1440 on every surface touched, and reduced motion on
   anything that moves.
5. Mutation test on every new guard.
