# The starter reveal, folded: keep the first screen, fold the rest

Justin, 13 September 2026, with the reveal on his phone (the You are not the
only one card and the When it is bigger than this card in the screenshot):

> "a final review of this starter page to streamline, make the best starter
> page that really explains that we will solve their problems, so don't change
> the first part as it is spot on, but fold the other parts like attached to
> make super efficient and simple, happy news style, Apple UX quality."

## What stays exactly as it is

The arrival (stage pill, the child's name, the one line), the What we do about
it heading, the You told us strip and every worry card with its service chips.
That is the part that says we will solve their problem, and it is the part he
called spot on. Not a word moves.

## The Mobbin pass

- [Monzo, What we'll do next](https://mobbin.com/screens/8c60d48a-1a3c-4676-9c67-0a4dedf2ad10):
  the promise in full at the top, then a GOOD TO KNOW group of icon rows, one
  bold line and one small line each, the detail one tap away, Get started
  pinned. This is the shape.
- [Polarsteps, Travel DNA](https://mobbin.com/screens/c5dd04e6-b90b-47da-b819-21f8e8652620):
  five icon rows, one line each, View full behind a single link, Next pinned.
- [Substack, interests](https://mobbin.com/screens/e8955dc9-0b6f-4bdd-b0d0-7fcdcfd8d453):
  chevron rows, everything the same height, Continue pinned.

Lesson: after the answer, everything else is a ROW with an icon, one line, and
a chevron. Nothing is cut. It is one press away.

## What changes

1. **Fold grows a row form.** `components/starter/Fold.tsx` takes an optional
   `icon` (a HappyIcon name) and `line` (one small line under the label). With
   them it draws the happy news row: white, 2px ink edge, one ledge, a butter
   plate with the drawn icon, the label, the line, a butter chevron. Opening
   is a GSAP height tween, not a jump. Every existing Fold call is unchanged.
2. **The other parents and the safeguarding block become two rows** under a
   small Good to know heading, straight after the worry cards. You are not the
   only one carries "9 in 10 parents argue about screen time" as its visible
   line. When it is bigger than this carries "Childline 0800 1111. 999 if
   they are not safe." as its visible line, so the numbers a frightened parent
   needs are on the page without a tap. The `urgent` version, when the typed
   worry trips lib/concerns/risk, stays fully open at the top of the page
   exactly as before. It is never inside a fold.
3. **Screen time keeps the number, folds the rest.** The steer card stays.
   The jars picture, the three points and the how it is counted card all go
   behind the one fold that already existed.
4. **Also included keeps the child's app and the tiles, folds the road.** The
   five stage list and the parent quote go behind a row, One road from 4 to
   16, with the stage line as its visible text.
5. **A guard**, `scripts/check-starter-fold.mjs`, holds: the urgent block is
   never folded; the folded safeguarding row's visible line names Childline
   and 999; neither card is deleted; no fold label carries a dash. Wired into
   .github/workflows/wiring.yml and mutation tested.

## Measurement

`/ref-reveal` at 390 wide, before and after, page height and screens.
