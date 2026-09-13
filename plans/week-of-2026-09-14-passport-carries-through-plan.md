# The passport carries through every lesson

Date: 13 September 2026. Lane: schools lessons (platform code). Migration claimed: 297.
Branch and PR: `claude/schoollesson-3-5-deep-dive-0u09q9`, PR #1058 (stacked on 296).

Justin, 13 September 2026, on the schools lessons: "make sure the passport theme
carries through and updates for progression as agreed, fills up, makes sense,
matches the other platform passport."

The other platform is the parents app, and the same ask reached it the same
morning: PR #1057 (session p37w5v) puts the four agreed areas on every passport
page as a two by two block with "n of N" and a slim bar in the stage's ink. That
is the canon this plan matches. Nothing here touches the parents app.

## What is true today

- Every school module knows its passport page (migration 277) and carries a
  passport line in the parent note. The prep page and the run sheet say the page
  in words. Only lesson 1 has a passport beat in the deck (migration 231).
- The class never sees the passport. A child finishes a lesson with a tool, a
  chant and a mission, and the thing it all fills is a sentence on a sheet.
- The schools app holds no pupil data and no teacher accounts, by design. The
  29 August plan rules out lesson delivery state on the server (bridge b).

## The agreed rules, unchanged

- A lesson fills a page. A stage earns a Planet Friend's stamp, and the stamp is
  the stage's content complete and the big check passed (lib/pathway/stamped).
- School modules are credit through the home code, never the stamp.
- The passport never records where a page was filled.
- The vocabulary: the passport, fills, earns, stamp, page, the big check. Never
  digital passport, never test or pass or fail, never safe or ready as a claim.
- The four areas and where they start are the parents app's own
  (lib/content/literacy.ts): safe from stage 1, balance from 1, ai from 1,
  social from 3.

## The build

- **G. `shared/passport-areas.ts`.** The four areas, their order and start stage,
  copied from the parents canon with a drift guard, and one area per school
  module (25 lines, each with its reason). Page helpers: the modules on a page,
  lessons done of total, and the four areas done of total.
- **H. `shared/schools-taught.ts`.** The device memory: which modules this screen
  has filled the page for. localStorage, class level, no pupil data, the same
  grammar as the parents app's SchoolChest. The teacher can unfill by tapping
  again and forget the whole record on the hub page.
- **I. `shared/components/PassportPage.tsx`.** One component draws the page
  everywhere: the stage's pastel and ink, the page name, the ring that counts
  lessons done of total, the friend's seal ghosted until a stage is stamped at
  home, and the four areas two by two in the parents app's shape. GSAP fills it
  in the lesson's register; reduced motion sets the final state.
- **J. The `passport-page` interactive.** A beat in every lesson that has a page:
  the class taps Fill the page, the ring and the area bar move by one, the seal
  pulses, and the room says the word stamp. An interactive is an action under
  the council rule, so the closing stretch of watching gets shorter, not longer.
- **K. The school finish.** The player's Completed screen for a school lesson
  shows the page as it now stands and the home code that puts today into the
  child's own passport at home.
- **L. The prep page and the run sheet.** The "What this lesson earns" card draws
  the page instead of describing it; the run sheet names the area.
- **M. `/hub/passport`.** The five pages side by side with this screen's fill, the
  honesty lines, and the forget control. The teacher's progression view.
- **N. Migration 297.** Generated like 296: a holding table and one guarded DO
  block. 23 beats (every module with a page; the two KS5 modules sit after the
  passport and get none), lesson 1's old passport slide replaced in the same
  shape, timing kept true. The four JSON modules spliced the same way.
- **O. Guards.** Contract rule 9: exactly one passport beat on a module with a
  page, none on a module after it, its config naming this module and its page,
  sitting before DiGi's close. `scripts/check-passport-areas.mjs`: every
  curriculum module has an area and every area is real, and the shared copy of
  the parents' area model has not drifted. Both in CI.
- **P. Render.** 390 and 1440: the beat before and after the tap, the finish,
  the prep card and the hub page, one module per register.

## Not in this plan

- Anything on the parents app side (PR #1057 owns it).
- Server side class progress (bridge b, ruled out 29 August).
- A KS5 closing chapter beat showing the finished book. Worth doing once the
  certificate page has art; the two modules say "no page today" honestly.
- Whether a school module should ever count toward an area in the child's own
  passport once its home code is entered. Today it is credit on the lessons
  ladder only. Justin's call, raised in the report.

## What is needed from Justin

Nothing to start. Two decisions raised at the end: the home code credit and the
areas, and whether the class count on the wall should ever live on the server.
