# The schools platform to the Apple bar

13 September 2026, afternoon. Session 0u09q9, on PR #1064.

Justin, 13 September 2026: "make sure the appearance of the lesson is top
rating, university, private top school, paid education, better than any
PowerPoint presentation, super Apple slick UX, and all text pages, scripts,
advice and printables are the best possible, and do not stop designing
appearance until this is achieved. All simple flow for teachers to run and
obvious to decision makers that this is the best for their schools, teachers
and children."

This plan turns that into a bar that can be judged, batch by batch, on
rendered frames rather than on intent. The findings it works from are the
should fix list in plans/2026-09-13-schools-review.md.

## The bar, per surface

1. **The lesson on the wall.** Judged from the back row and from the deputy
   head's chair at the door. One idea per slide. The chrome is one line, and
   the shape of the lesson is visible in it. The teacher's words are always on
   screen without stealing the wall. Back and Continue live in one place for
   the whole lesson. Number keys pick an answer. Nothing scrolls on a 1366 by
   768 laptop. Transitions are calm and the same every time.
2. **The text pages.** One header, one grid, one type scale. The first screen
   carries the promise and the button. A phone gets one column and 44px
   targets. Every page has its own title, the site has a face in the tab and
   in a forwarded link.
3. **The script and advice.** The words to say sit in the presenter bar at a
   reading size. The prep page, the run sheet and the hub pages use the same
   type system as the wall. No internal words on a teacher page.
4. **The printables.** A4 in millimetres. Nothing splits across a page. Clean
   in black and white. The print room reads as a table, not 25 cards.

## References, gathered first (Mobbin, 13 September)

- Uxcel, Duolingo, Babbel and Brilliant quiz screens: a slim bar at the top,
  the question centred in the middle third, numbered option cards, one
  primary button in a bottom bar.
- Pitch and Canva in present mode: the slide is the whole canvas, the notes
  sit in a quiet panel beneath it.
- Skillshare for Teams pricing: one plan card, a checklist, one button.

Translated into butter and ink and Nunito. Never a copy.

## The design pass for the wall

**Tokens.** Cream ground, ink text, the hosting friend's accent for the
current state, butter for the one primary button, white for the presenter
bar so it reads as the teacher's strip and not the class's slide.

**Type.** Nunito 900 headlines on the wall scale (shared/wall-scale.ts),
Nunito 400 and 600 body, IBM Plex Mono for the rail labels, the counter and
the keycaps. Nothing new; the scale already exists and every size on the
wall keeps reading from it.

**Layout.** Three bands. One line of chrome (exit, the arc rail, the counter,
the friend and DiGi). The stage, centred, with the slide's own column. One
presenter bar at the bottom: the script on the left at the aside size, Back
and Continue compact on the right, sticky, the same place on every slide.

**Signature.** The arc rail. The Rosenshine arc drawn as one segmented bar,
one segment per phase in the deck, the phase names under their segments in
mono, the current segment in the friend's accent and filling as the slides
advance. It replaces the thin progress bar and the five pills with one
object that says where the lesson is and what shape it has.

**Critique before building.** A progress bar plus a row of pills is what
every quiz app ships and it is what we had. The rail carries the lesson's
shape, which is the product's thesis (Rosenshine worn openly), so it is a
choice made for this brief and not a default. The one risk taken is that
the whole frame gets quieter: the chrome loses two thirds of its height and
the slide gets the room.

**What does not change.** The phone branch of the player is shared with the
parents app and the child app and stays as it is. The slide types keep their
content and their reveals. The wall scale and the classroom contrast variant
hold, and the two guards that police them still run.

## Batches, each shipped on its own commit

- **E1, the wall.** The arc rail. The presenter bar. Keycaps and number keys
  on choice slides. The objective, keywords and recap slides in the centred
  column. The intro frame never empty. Render at 1920 by 1080, 1366 by 768,
  1440 by 900 and 390 by 844 on ks2-25, ks3-24 and ks1-02, every slide type.
- **E2, the text pages.** The One system everywhere, The first screen, Phones
  and Words sections of the review: one header with the school code door,
  44px mobile nav, hero on the first screen, per page titles, favicon and
  share image, hub title colour, curriculum centring, year plan and cast and
  prep buttons on phones, the 12px floor, inline form validation, the orphan
  card, internal words, unproven claims, one reply promise.
- **E3, the printables.** A4 in millimetres, break inside avoid on every card,
  the print room as a table by key stage, the PDFs re-rendered and checked.
- **E4, verify and ship.** Every guard, both typechecks, the renders, the
  review.md check, no dashes, commit, push, PR #1064 updated, decisions.md.

## Verification, every batch

- Frames at 390, 1440 and, for the player, 1920 by 1080 and 1366 by 768.
- scripts/check-wall-scale.mjs and the wall contrast guard for the player.
- The module contract and the flagged briefings guards for the content.
- Both typechecks. The dash scan. review.md sections 5 and 7.

## Not in this plan

The parents app and the child app (the shared player's phone branch is
untouched). The staffroom, which is the one large build and has its own
plan to come. The buying documents, which wait on decisions 2 to 4 in the
review.

## Content follow ups the wall pass exposed (13 September, evening)

Layout can only do so much; three things are the words themselves, and they
belong to the curriculum lane as a small migration, not to this batch.

- Two title slides carry a full stop where the middle dot should be, in
  their eyebrow: ks3-24 ("KS3 . Years 7 and 8") and ks2-25 ("KS2 . Years 3
  to 6"). The other four eyebrows use the dot. One update statement.
- Eight diagram slides carry step texts of 90 to 142 characters (ks3-24
  slides 8 and 12, ks4-17 slides 11 and 17, ks4-19 slides 9, 16 and 19,
  ks2-25 slide 10). At the wall's body size a 130 character step is seven
  lines in its column, and the slide scrolls on a 1366 by 768 laptop even
  with the steps side by side. Oak's diagram steps are five to ten words.
  Cap step text at about 90 characters in the module contract and trim
  those eight.
- The KS1 intro line ("You are doing so well. One more brilliant thing to
  learn, come on!") wraps to two lines at the wall's body size and tips the
  title slide into a scroll on a 768 laptop. Sixty characters fits.

Until those land, a slide that runs past the stage shows the cream fade at
its foot, so the teacher sees there is more rather than discovering it.
