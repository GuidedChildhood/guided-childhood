# Decisions Log — Guided Childhood Platform

Append only. This file is the index. The full text lives in the monthly
archives under `plans/decisions-archive/`.

**Writing an entry.** Append it to the bottom of this file, under a heading of
`## <date>, <what it is about>`. Keep it under a dozen lines: what was decided,
the one reason worth knowing, and the PR number where the detail lives. The
reasoning belongs in the code comments and the pull request body. An entry that
runs to three hundred lines gets read by every session for weeks afterwards.

**Reading one.** Do not load an archive whole. Each archive opens with an index
giving the line number of every entry, so one decision is
`sed -n '400,460p' plans/decisions-archive/2026-08.md`, and a search across all
of them is `grep -n "founder rate" plans/decisions-archive/*.md`.

**Migration numbers.** The authoritative count is `supabase/migrations/` plus
the numbers named in the open pull requests, never this file. Past ledger
entries are in the archives: `grep -n "migration" plans/decisions-archive/*.md`.

**Rolling.** `npm run roll-decisions` moves anything older than the keep window
into its month archive and rebuilds the index below. Run it at session end, or
when `npm run context-guard` says this file is over budget. Nothing is deleted.

<!-- roll:index:start -->
## Where the full entries live

| Archive | Covers | Entries |
| --- | --- | --- |
| `plans/decisions-archive/2026-06.md` | 2026-06-13 to 2026-06-27 | 3 |
| `plans/decisions-archive/2026-07.md` | 2026-07-01 to 2026-07-31 | 217 |
| `plans/decisions-archive/2026-08.md` | 2026-08-01 to 2026-08-30 | 155 |
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-14 | 178 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

- 2026-09-06 · 6 September 2026: migration 257 renumbered to 260 · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: no more claim only pull requests on the Planet Friends lane · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the bank file is 263, and PCAST joins the bank (migration 264) · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the child gets their own explorer figure · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: two builds of the star system met, and one survived · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the PCAST migration is 264, settled at the merge · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: migrations 253 and 254 were already on production · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: slice 3c built, the universe with every planet a place · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the Planet Friends design canvas, Toca quality in our own clothes · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the Space Port opens at stage 2, Moonbase School keeps its growth key · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the audit's stage three, Justin's eight answers · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the registered company, from the register · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: the perfect lessons wave (migrations 265 to 267) · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026, evening: the town and the hide and seek, designed and waiting on the go · `plans/decisions-archive/2026-09.md`
- 2026-09-06 · 6 September 2026: Planet Friends hidden from the app until it is good · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026: Oak and Common Sense read from the live sites, and the lesson contract lands · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026, afternoon: Oak phase 2, the quizzes and the two surfaces · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026 — the two reference accounts, torn down (no migration) · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026 — section 6 approved, the four days change shape (no migration) · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026, later: Oak phase 3, and the cycle map bug the QA found · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026, evening: the classroom was never in classroom mode · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026 — the video beats get a way in, and half of them turn out to be silent · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026 — the RSHE mapping matrix answers the question it is opened with · `plans/decisions-archive/2026-09.md`
- 2026-09-07 · 7 September 2026 — the lesson animations, and the retired cast that keeps regenerating · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the perfect lesson standard, and three matrix claims that were padding · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the audit applied, and a correction to my own number · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the four teacher fields, made real on ks3-14 (migration 273) · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the setup worries, wired end to end · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the repeat picker, and the readers that ignored it · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the whole curriculum was publicly readable, and is not now · `plans/decisions-archive/2026-09.md`
- 2026-09-08 · 8 September 2026 — the parents app content, and the door that was not the table · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, one worry question, asked in the quiz · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, the reveal answers the problem, not just explains the platform · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, every worry reaches the check in, and Something else takes their words · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, silver, and the base the report measures from · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, the butter that was never a colour · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, the base, the ceiling, and dropping the word earn · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026, the setup loop, and why Home and the quest disagreed · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the youngest children's slides, and what the score really moved · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the gate is a ratchet, and the check that could not see · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the 77 dense slides above KS1 are a different problem · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the schools preview can be a commit behind, quietly · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the projector was rendering at half the legible size · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — every lesson now knows its passport page · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — engagement was scoring the module's own tool as passive · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — the KS2 to KS5 ceiling, measured instead of asserted · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026 — migration 278, fourteen slides split so they fit the wall · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026: the classroom contrast variant, and the widgets that were legible and cut off · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026: the engagement cadence, and an action beat that changed nothing · `plans/decisions-archive/2026-09.md`
- 2026-09-09 · 9 September 2026: the last fifteen gaps, and engagement at ten · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the Passport daily sticker, decision 3 of 3 · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the school AI governance layer, and the audit that reshaped it · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the cycle budgets 280 broke, and a map that had been missing since 270 · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the recommended time on setup step three, and the table that already existed · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the twenty second module, demanded by a feature · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026 — Migration 283, every timing string tells the truth · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the daily sticker, the worry that says where it came from, and the grey nobody could read · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the KS2 half, and a job another session had already done · `plans/decisions-archive/2026-09.md`
- 2026-09-10 · 10 September 2026: the account goes last, and the advert becomes true again · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026: migration 285 applied at last, and the six animations that show the wrong cast · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026: the lesson animations meet the new cast, and the six checks that found what the eye would not · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026, later: every beat gets a voice, and the DiGi reference that was the legacy robot · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — 286 and 287 were on main and not in the database · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026, applied: 286 and 288 are on production · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026, footnote: 286 was applied twice, seventeen seconds apart · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026: the pilot lesson, and the last silent beat · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026: the answer beat, and a bridge I said was missing that was already there · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · THE CORRECTION, and it is mine · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — the answer beat's Continue button, and why the schools UI can be looked at after all · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — the taster: one lesson outside the wall, and the lead that follows it · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — the AI cognition lesson, and the numbers we will not use · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — what the sources actually say, and the slide that was backwards · `plans/decisions-archive/2026-09.md`
- 2026-09-11 · 11 September 2026 — stay the maker, and the parent note that never printed · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the DiGi review (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the look and feel pass, session one (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, DiGi answers on Fable 5.1 (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, every lesson animated (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the passport carries through every lesson (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the fifteen faces (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, the ink edge stays at 2px (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026: the passport proves the four things · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026: DiGi as the driving force, on judgement under a cap · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, later: a pass on every passport page, the book turns on GSAP, the peek on Today · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, evening: the daily loop solves the top device problems by age, and the habit holds a Duolingo grade · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the schools platform reviewed (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday, the legal identity, and day one of the schools fixes (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday evening, the lesson on the wall to the Apple bar (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday evening, the text pages and the printables to the Apple bar (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, the starter reveal folded below the worry cards · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026 — 298 was the only one missing, and the ledger nearly hid it · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, later: every worry card says what we do about it, each time · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, later still: What you get is one list, not a grid · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday night, the pilot comes into the product (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, evening: the platform review, speed and a simpler DiGi · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, Sunday night, the buying documents (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, night: the seven choices, one and four first · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, night: DiGi reads in ten seconds · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, night: the researchers file behind a switch · `plans/decisions-archive/2026-09.md`
- 2026-09-13 · 13 September 2026, night: the session verified locally · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday, the print kit and the passport print out (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday: the deal ties together, and DiGi says hello properly · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the deal is the root of the loop · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, afternoon: stickers that land, and the keepsakes that match them · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, late afternoon: the agreement reviewed against its own science · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, evening: the child's week, drawn with the Friend · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, evening: the ask row cannot get stuck, and the week page leaves the yellow · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, evening: ask for screen time has its own page · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the fifth step unblocked, the calendar on the white page, the sticker book leads with stickers · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday, the print kit after the design council (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday, the pilot is two lessons (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday, the character voices made consistent (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026, Monday, the pilot set approved and Cosmo deferred (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the daily jobs guide, start small and build up, advice not a block · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the week row moves with the day, and the five carry a mission · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the front page is the calendar page, and tomorrow's kit is pushed the evening before · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the paper sweep, because the ground moved under every child screen · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the ooooo on the streak bar was two faults, not one · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the child app crashed on Use my time, and the child got the parent's error page · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the mission rows became doors, and the answer to "does it sync" turned up a dead query · `plans/decisions-archive/2026-09.md`
- 2026-09-14 · 14 September 2026: the child's tab bar, what is waiting, and the dial in the wrong place · `plans/decisions-archive/2026-09.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 16 September 2026: the per child passport, and the code gets a front door (session 0u09q9)

Justin asked how per child passports actually work, how they auto update, how
to show that happening, how to print one per child, how to print like a book,
and how a school orders blank books and stickers. He then said: "yes build and
quote form."

Plan: `plans/2026-09-16-per-child-passport-plan.md`.

**The correction he was right to ask for.** There are two passports and they
are different objects. The child's record lives in the parents app, keyed to a
child row, and already prints per child. `/hub/passport` counts LESSONS TAUGHT
ON A SCREEN, never children, because the schools app holds no pupil data and
the data processing agreement is written on that. Per child therefore splits
in two, and both halves already existed: the record at home, the object in
class, one A4 per child with the name written by hand.

**Most of the rest existed too, and was not joined up.** The home code
(migration 230) already writes a completion against one named child. The fill
animation already lived in `shared/components/PassportPage`, tuned by age,
reduced motion respected, and played on the classroom wall only. The zine
imposition already folded eight panels from one A4. What was missing was joins.

- **The code has a front door.** The parent note and the pupil booklet carry a
  QR beside the code, rendered server side as SVG, black on white because it
  gets photocopied before anybody points a phone at it. It opens
  `/home-code/[code]`, which redirects a signed in parent straight to the card
  with the code prefilled, and offers a signed out one the starter pack or
  login with `?next`. Its own route rather than a query on `/join`, because
  every CTA on `/join` routes to `/starter-pack` (non negotiable 9) and a code
  arriving there would either break that rule or be swallowed by it.
- **No text message, and that is a decision rather than a gap.** Texting a
  parent means the schools app holds parent contact data, which ends the
  promise the DPA rests on. The code on paper with a QR does the same job.
- **The page fills in front of them.** The card draws that child's real page
  and plays the same fill the wall plays. The label under it says it is the
  SCHOOL half, because this ring counts school modules and the book's ring
  counts the whole stage: two fractions with the same shape, so the card names
  which one it is rather than letting a parent assume.
- **The zine at home, saddle stitch for the keepsake.** The A6 file is nine
  pages at one per sheet, which is right for the printer who binds the £14
  keepsake and wrong for a home printer. A new route folds the child's real
  passport from one sheet of A4: five stages plus three covers is exactly
  eight panels. The free one sells the paid one; a parent who has folded the
  paper passport knows what a bound one is worth.
- **The fold moved to `shared/zine.ts`.** Both apps fold the same passport, so
  the imposition is described once. Two copies of a fold is two things that can
  drift, and a drifted fold is thirty ruined sheets in a classroom.
- **Migration 302, `schools.supply_requests`, and `/supplies` is a QUOTE form.**
  No price, no card, no purchase order demanded. There is no supplier and no
  landed cost yet, and a price on a school page is a promise finance holds you
  to. It earns its own table where the draw, the taster and the pilot did not:
  those are leads for the same product and fit the invoice columns exactly,
  while supplies carries items, counts and a delivery address that would
  otherwise live in a free text note nobody can total. Same cron, though, not a
  second job.
- **No typed class list**, by the plan's own recommendation. It is safe if the
  names never leave the browser, but a box that looks like it collects
  children's names costs more in questions than it saves in time. It waits for
  a teacher to ask.

Guard `check-passport-bridge.mjs`, nineteen rules, in CI, five mutations
caught. Every rule guards something that fails QUIETLY: a parent note that lost
its QR still prints, a price on the supplies page still renders, a second copy
of the zine fold still folds until the two copies disagree.

`check-print-kit.mjs` caught the fold move and was repointed at
`shared/zine.ts`, with a new rule holding the schools app to re-exporting it
rather than growing its own copy.

Still open, and named on the plan: the five commercial answers (what is in the
box, who packs thirty, school or parent, supplier for the stickers, and the
price itself). The form works and a school can be answered by hand today; what
it cannot do is quote a number, because there is no supplier.

## 16 September 2026: four answers, and the tracker gets built (session 0u09q9)

Justin answered the questions the per child passport work left open, and took
the recommended option on all four.

1. **The lesson tracker is built, and its roll up lives at `/hub/tracker`.**
   The Hub is where a subject lead already goes for compliance things, so a
   coverage record belongs beside the RSHE mapping. The curriculum map stays
   the teaching map: a green tick there would read as a recommendation rather
   than a record.
2. **The printed passport books are PRE PRINTED**, five pages ready to fill.
   A blank book is a notebook. The pages are the product, and they are the
   same pages a parent folds at home.
3. **A print on demand supplier ships direct to the school.** No packing, no
   cash tied up, and a school can be quoted within a week of a supplier being
   found. Thinner margin than buying a run, which is the right trade at zero
   schools. What this still needs is one quote from a UK booklet printer.
4. **School first, parent later.** The schools quote form is the only door for
   now. A school has a purchase order and buys thirty; a parent already has
   the £14 keepsake in the shop and the free foldable covers everyone else.
   Nothing was added to the parents shop.

Decisions 2, 3 and 4 needed no code: `/supplies` already says pre printed and
five pages, already quotes rather than prices, and already exists only on the
schools side. They are recorded here because the next session should not
re-open them.

### What the tracker actually is

Seven of its nine rows tick themselves, which is the whole point. Justin's
reference was Meta's "You're following best practices" panel, and that panel
is believable because every row in it is machine checked. The moment one row
needs a human to tap it, the panel becomes a form and a green tick stops being
evidence.

The seven signals, each written at the moment the thing happens:

| Row | What ticks it |
|---|---|
| You have read the lesson | the lesson page opened |
| You have looked back | the previous lesson's page opened, or it is already taught |
| The pack is printed | `beforeprint` on the pack route |
| The learning record is printed | `beforeprint` on the record route |
| The board is ready | the teach route opened |
| You taught it | the player reached its finish, through a new `onFinish` prop |
| The class filled the passport page | read from `shared/schools-taught`, never stored twice |

`beforeprint` rather than a click on our own button, because a teacher who
presses ctrl P has printed it just as much. A cancelled print dialog still
ticks, and that is the failure we accept: the alternative leaves a row grey
after a real printer run.

**Look back is ticked on the PREVIOUS lesson's page**, not on the page that
benefits from it. That is the only honest way to observe it: the act of
looking back happens where you look.

The two rows we cannot see (brief the safeguarding lead, parent notes into
book bags) sit in their own block with outlined circles, and the panel says in
one line that they are a teacher's word rather than the product's.

**The tick is computed and there is deliberately no way to store it.** A tick
a teacher can award themselves proves nothing to a subject lead.

**Which rows apply is read, never listed.** Three facts come from the manifest
(passport page, safeguarding flag, is there a lesson before it) and one from
the row (`i can` statements). A lesson that gains `i can` statements gains its
learning record row on the next deploy with nobody editing anything.

The honest limit, on every surface that shows it: this screen only, this
browser, no child named, a different laptop shows nothing. `/hub/tracker`
prints as a coverage sheet for the file before anybody clears it.

Guard `check-lesson-tracker.mjs` in CI, six mutations caught. Its pupil data
rule strips comments before testing, because every file here explains at
length that there is no register and a rule that could not tell the
explanation from the thing would push us to stop explaining.

## 16 September 2026: screens rest, the job board, the approve warning, and Moment (session p37w5v)

Four merges from the device time lane, in order.

**Screens rest defaults moved an hour earlier** (PR #1095). The old default ran
right up to bedtime, which is the hour the light does the damage. Also fixed:
the time pickers wrote every intermediate keystroke to the live row, so a
half typed `09:57` could land. They commit on blur now.

**The job board row rebuilt, with drawn icons** (PR #1095). 24 new Happy News
icons and `lib/quests/job-icon.ts` mapping emoji and words to them. Built from
the live `family_quests` table, not the template file, so every emoji a real
family uses is covered.

**The approve path warns, never blocks** (PR #1098). Justin chose warn over
stop: "Screens are meant to be resting right now. Saying yes still works."
Non negotiable 1 holds, a pathway not a gate.

**The Now button becomes Moment, and lifts clear** (PR #1100). It was
`position: absolute` inside a flex bar, so it sat on Passport at every width.
Now `bottom: calc(100% + 8px)`, measured from the bar's top edge, with page
padding grown to match. Renamed because the button also writes to the concerns
ledger, which "Now" never said. Proved against production: three of the four
moments ever raised show the full flagged, checked, resolved loop.

**1043 words of superfluous copy cut from eleven parent screens** (PR #1100).
A second adversarial pass found seven cuts that took real understanding with
them, and all seven are back. Guard `check-tab-bar-clear.mjs` added, 77 total.

## 16 September 2026, afternoon: the tab bar, the films tab, and the Stage 2 scripts (session p37w5v)

**The text size dial was breaking the tab bar** (PR #1101). Every size in that row
was rem, which follows the iOS dial, and the row is six fixed columns that cannot
grow. Worse, the dashboard layout carried its own `.gc-dash .tab-item` font rule
that outranked globals.css, so the sizes measured back in September had never
applied on a dashboard route. One token now, `--tab-label-size`, capped with min()
against vw. Measured: 7 of 16 width and text size combinations were clean before,
16 of 16 after.

**"Nothing written for this stage yet" was the wrong word** (PR #1101). Ten films
exist, all Stage 1, so there really is none at a teenager's stage. But nothing has
been FILMED while 39 lessons are written for that stage. Justin chose: make the
Stage 2 films where a parent and child still watch together, and above that say
what the format is for rather than apologise. Keyed off a fixed age
(`CO_WATCH_MAX_STAGE`), never off which films happen to exist.

**The tab counts were frozen on one stage** (PR #1101). Both counts were pinned to
the child's own stage, so every age chip read the same number while the list
changed underneath. The library is 141 lessons, not the 39 the tab showed.

**Five Stage 2 film scripts written** (PR #1101). 2.1 What we keep private online,
2.2 Spot the trick, 2.3 Screens and sleep, 2.4 Why stopping feels hard, 2.5 Mean
messages. Each reviewed by three lenses, cut to the Stage 1 runtime, then repaired:
15 must restore findings, several safeguarding. Measured rather than guessed, Mabel
reads at 131 words a minute, so the five are about 35 minutes of animation.

**One substitution awaiting Justin.** The films system doc names the fifth Stage 2
film as "What social media really is", which is not a Stage 2 lesson in the
database. Substituted Mean messages, which is.

**A badge has to land on what it counts** (PR #1102). The child's Quests badge
counts their own pending asks; tapping it opened a page listing only jobs a grown
up had sent, so Justin's 2 became "No jobs today" and the badge itself vanished on
arrival. Verified in the live data first: one pitched job, one live screen ask,
both real. The jobs page now reads those rows the way the home screen counts them
and shows them, and the bar keeps the count. Guard, 14 mutations, two of which
only became real checks after mutating them.

## 17 September 2026, the letterbox is unparked and setup stops asking

**The MX was live, so the flags came off** (PR #1105). `SCHOOL_EMAIL_FORWARDING_LIVE`
and `SCHOOL_LINK_LIVE` are both true. `in.guidedchildhood.com` resolves to Resend's
inbound host, checked.

**Setup was the reason it was parked, so it was rebuilt in the same change.** The old
way in asked for the school's name AND a comma separated list of its sender addresses
before it would hand over an address. Nobody knows what address ParentPay sends from,
so the first screen of the feature was a question its own user cannot answer. Worse,
the Home promo card pointed at /dashboard/school, which carried no setup at all, only
a dashed box saying coming soon, while the real form sat greyed out in Settings.

**The rule now: nothing is asked before something is given.** The address is minted on
one tap with no form, gets emailed to the parent (the hard step was moving a random
address into the mail app, not understanding it), and the first ask is to forward one
email, which takes ten seconds and proves it works. The school name and its senders are
read off that first email and confirmed with one tap. The automatic Gmail rule is
offered afterwards and never blocks anything.

**Migration 303.** school_name nullable, plus first_email_at, last_email_at,
emails_caught and learned_domain, so the screen can say "nothing yet" honestly and then
celebrate. Arrivals are stamped before extraction on purpose: a newsletter with nothing
to do in it still answers the only question a parent is asking, which is did that work.

**One way in, not two.** The Settings card is now a pointer to /dashboard/school.
**A duration is not a clock** (PR #1104). The trial banner read "Free days end in
22:27" in mono with a colon, which is the shape of a time of day: a parent could
read twenty two hours left as twenty seven minutes past ten tonight. It now says
how long is left in words, floors so it never overstates, and drops the minutes
above three hours. The guard runs the function rather than reading it, after
mutation testing showed a name check matching the code's own identifier.

**The printed passport is the whole sheet, and the margin is zero** (PR #1104).
Measured as a real PDF, both print routes went to the printer 7 per cent too big:
tokens.css zooms body by 1.07, the dashboard shell moves that onto `.gc-dash >
main`, zoom applies on paper, and neither print block reset it. The tempting fix,
insetting the artwork inside a margin, is the wrong one for a zine: the creases
are the paper's own quarters, so a 285mm sheet throws both quarter folds 4.5mm
out. Decided: full sheet, margin zero, the safe area held inside the panels, fold
ticks on the outer edge. The class edition has the same fault and needs its own
look. Chrome's Background graphics default also had the cover printing white.

## 17 September 2026, a way in that needs no forwarding at all

**Justin: "Is there a way without having to set up forward?"** (PR #1105). Yes, and
the best one reaches what forwarding never could. Snap a photo of the letter, or
paste the text, and the same DiGi extraction that reads forwarded emails reads
that instead. No address, no rule, no email provider, nothing set up.

**The reason it beats forwarding is the paper.** A large share of primary school
communication has never been an email: the letter in the book bag, the note in
the reading record, the trip slip, the sheet by the door at pickup. No forwarding
rule catches any of it, and a parent holding one is exactly when this is useful.

**One extractor, not two.** The prompt and validation moved out of the inbound
webhook into `lib/school/extract.ts`, shared by both ways in, so the email path
and the photo path can never drift. Saving goes through the existing
POST /api/school/actions, which already owns dedupe and the per child check.

**It shows what it found before saving anything**, unlike the email path. Email
arrives while the parent is elsewhere; a photo is taken while they are standing
there holding the letter, which is the one moment they can check a date better
than we can read it.

**The image is never stored**, same promise as email. iPhone photos are
downscaled and converted to JPEG in the browser first, because HEIC is the normal
case for this feature and the API cannot read it.

**Ruled out: reading the inbox via Gmail.** `gmail.readonly` is a Google
restricted scope needing an annual paid third party security assessment, and it
breaks the line that makes a nervous parent say yes.
