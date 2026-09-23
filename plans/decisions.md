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
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-20 | 225 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-09-16 · 16 September 2026: the per child passport, and the code gets a front door (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-16 · 16 September 2026: four answers, and the tracker gets built (session 0u09q9) · `plans/decisions-archive/2026-09.md`
- 2026-09-16 · 16 September 2026: screens rest, the job board, the approve warning, and Moment (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-16 · 16 September 2026, afternoon: the tab bar, the films tab, and the Stage 2 scripts (session p37w5v) · `plans/decisions-archive/2026-09.md`
- 2026-09-17 · 17 September 2026: the school resources shelf, and a research sweep nothing could verify · `plans/decisions-archive/2026-09.md`
- 2026-09-17 · 17 September 2026, the letterbox is unparked and setup stops asking · `plans/decisions-archive/2026-09.md`
- 2026-09-17 · 17 September 2026, a way in that needs no forwarding at all · `plans/decisions-archive/2026-09.md`
- 2026-09-17 · 17 September 2026, the school offer moves to where people actually look · `plans/decisions-archive/2026-09.md`
- 2026-09-17 · 17 September 2026 — 302 and 303 were both missing, and both were load bearing · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — migration 304 applied, column and backfill together · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — two sessions both took 304, so the promo dismissal is 305 · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — the schools app gets one type scale and one spacing scale · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — batch 2: the shape tokens land, the box sweep is called off · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — batches 3 and 4: motion, and the states that did not exist · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — the check in opens every day, the rotation keeps the tick · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — a cap of three asked seven, and then had to say so · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — migration 306 applied, the note the feature exists for · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — every worry is worked over days, and we record what we spent · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026, the lesson number a teacher reads is a position · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026, a Planet Friend is the only fake we can print · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026, the intro bills the lesson, from the deck · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026, the tracker leads the Hub · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — migration 307 applied, before the queue refilled · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — migration 308 applied, the photo is on the wall · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — the live numbers are one tester, not behaviour · `plans/decisions-archive/2026-09.md`
- 2026-09-18 · 18 September 2026 — every card on Home can be put down · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, `projector` is an instrument, not a width · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, the compliance audit: the map was not the territory · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, the audit's second pass: KCSIE 2026 arrived · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, the KS4 gambling module, and a generator for lesson migrations · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, the tracker now counts statutory requirements, not lessons · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026 — every key the app reads is written down · `plans/decisions-archive/2026-09.md`
- 2026-09-19 · 19 September 2026, the scaffold column had a vocabulary and nothing local knew · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, daily sweep, four backup tables with no RLS at all · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, a module reaches production in hash verified chunks · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the audit is closed: 57 of 57, proved against production · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026 — the layouts have to survive Larger Text · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the council runs on all 29 and five slides come inside the ceiling · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the safeguarding lead's name is typed once, on the device · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the four new lessons' home pages were crashing, and the shape is now decided at the desk · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, correction: the council's fixture was stale, and twelve older slides are over the wall ceiling · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the schools home page moves: the wall builds itself and a lesson opens as you scroll · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the eighteen slides come inside the ceiling, and the four new breaths get their friend · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026, the friends get a plan, the icons get a second home, and the computing map exists · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026 — every screen has to survive Larger Text · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026 — the Larger Text list is empty · `plans/decisions-archive/2026-09.md`
- 2026-09-20 · 20 September 2026 — the school card's door goes somewhere, and the phone switch is on the page · `plans/decisions-archive/2026-09.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 21 September 2026 — DiGi's card link, and a name we have not met

Justin, from his phone: "Digi links to starter pack in response but this is
already a sign up ... we should be clever enough to ask if we want to add
another child as noticed new name?"

Two separate things, both true.

**The link.** DiGi was handed `/m/ID` for moment cards, which is the PUBLIC
share page: the one a stranger opens from a WhatsApp forward, ending in "Get
your free starter pack". Every reader of a DiGi reply is signed in, so the link
is now `/dashboard/moments?card=ID`, the card inside the app where I tried
this, Make it a quest and Ask DiGi live. The share page keeps the starter pack
for the stranger it was built for and offers a member the app instead.

**The name.** He asked about a 9 year old called Olga while the only child set
up was Timbotee, so every follow up since has named a child the app does not
have. The question keeps her name, because it is a true record of what he
asked. What is new is the offer: `lib/digi/new-name.ts` finds a first name in
what the parent typed that we have never met, and a quiet "Add Olga" appears in
the chat and under the question on Home, going to the add child form with the
name filled in. Two signals required before we believe it is a child, so
Roblox, Monday, Miss Davies and London never produce an offer.
`scripts/check-new-name.mjs` pins all of that, 5 that must fire and 15 that
must never.

Also corrected: CLAUDE.md still named Teo, Olga and Alma as the characters.
Justin: "they are not digi squad characters we do not use them anymore we use
planet friends." It now names DiGi and the Planet Friends, as digi-squad has
since 23 July 2026.

## 21 September 2026 — the mirror is true: all 29 lessons in content/modules, hash proved

Every review batch asserts the post state by string hash, which needs the
file to equal the row first. Seven export agents pulled the 21 older lessons
out of production through the Supabase tool and proved each with
`scripts/module-string-hash.mjs`; four September files had gone stale under
later migrations and were re exported. All 29 proved again in one query. The
first apply of 321 refused, correctly, on the stale four: the hash proof
doing its job. PR 1133.

## 21 September 2026 — migration 321: the keyword meanings the wall could not see

Eight lessons written since 11 September stored each keyword's meaning under
`definition`; the wall and the vocabulary page draw `meaning`, so those classes
saw the words and nothing under them, and the council's blocks check counted
the missing meanings as nothing to measure. Found by the rubric's measurable
checks. Renamed in the rows and the files under guard; contract rule 14
refuses a keywords slide without a meaning the wall draws. PR 1133.

## 21 September 2026 — the lesson rubric, and the only road from a finding to production

`scripts/lesson-rubric.md`: every check with its source, MEASURABLE, JUDGEMENT
or SCHEME, from two research reports (the best UK schemes lesson by lesson;
the evidence on projected slides and scripted lessons), honest about what was
opened and what came through a snippet. `scripts/check-lesson-rubric.mjs`
runs the measurable ones per slide. `scripts/gen-review-batch.mjs` is the
only road from a verified finding to a migration: one edit is one string on
one slide, refused if it does not match the file, carries a dash, breaks the
wall ceiling, loses an attested phrase or worsens the contract, then a
guarded batch with backup, abort, proofs and hashes. Migration numbers 321
onwards are the review's. The 29 reviewer and 29 verifier workflow runs
against it. PR 1133.

## 21 September 2026 — on a phone the lesson opens section is a swipe strip, not a pinned board

Justin, from his phone: the board stays and the text underneath scrolls past
and is missed. The pinned card took the top half of the screen and each
step's words slid up under it while the reader was on them. A phone now gets
one panel per step, the board for that step with its words directly beneath,
in a horizontal snap strip with the next panel's edge showing and tappable
dots; nothing is pinned and nothing slides under anything. The desk keeps
the sticky board beside the steps. Rendered at 390, 430 and 1440. PR 1133.

## 21 September 2026 — the passport stands in the door at the end of the road

Justin, from his phone: the passport should be at the end. It was at right
26 per cent, which lands between 56 and 74 per cent of the hero picture; the
doorway runs from 73 to 89. So it sat short of the door, in the middle of the
road, and covered Nova entirely, drawing five friends and showing four. It is
now centred on the door at 81 per cent, inside the open doorway, by a half
width margin rather than a transform because GSAP owns the transform and
animates the rotate. Nothing had regressed: it was wrong from the start and
only visible on a phone. Rendered at 390, 430 and 1440. PR 1135.

## 21 September 2026 — one ruler for a slide the class acts on

Three files each had their own idea of it. The council counted a choice,
discussion, tryit, interactive and scenario, plus a quote and a diagram with
verdicts; the module contract counted four of those and none of the rest; the
rubric checker wrote the council's list out again by hand. On the contract's
ruler 21 of 29 lessons looked like they sat children past the four minute
ceiling, and on the council's almost none did, so the disagreement was between
our instruments rather than in any classroom. Both files now import respondsTo.
The ceiling is unchanged: the threshold was never the problem, the type list
was. Contract failures across all 29 lessons went 60 to 2. Said out loud
because the diff invites the opposite reading: a gate falling from 60 to 2
looks like a guard being silenced, and the defence is that the content was
authored to the council's definition all along. PR 1135.

## 21 September 2026 — the scheme publishes the length it actually runs

The 45 to 60 minute window was a number written into the rubric, not a finding
with a source, and 26 of 29 lessons run past it: median 69, range 42 to 73. A
five lens panel and four adversarial lenses agreed not to trim, because it is
the only course that spends statutory content on a rule with nothing behind
it, and not to publish a core figure either, because the core recomputes to 50
to 72 so any tighter band would be false on day one. So every manifest row
carries the true total, the public curriculum card prints it, and
check-lesson-minutes.mjs holds the published figure to the sum of the slides.
C8 now tests that the printed number is the real one. Every minute in the
scheme is authored, not timed: three timed lessons would settle more than more
analysis. PR 1135.

## 21 September 2026 — Cosmo fronts the sixth form, and the pilot's cast predates the Planet Friends

Cosmo fronted zero lessons, because both sixth form modules are cast to DiGi
and the home page rightly hides a friend who fronts nothing, while the hero
picture, the KS5 printouts and the parents app all still promised him.
Justin's call: recast both KS5 modules to Cosmo, DiGi still closing. Contract
rules 12 and 13 fail ks3-12, the public taster, because its pause and mission
are film and only the arrival check accepts film, so the gate still runs on
four lessons rather than all 29. PR 1135.

CORRECTION, same day, before anyone acts on it. I first read ks3-12's
video_beats as the cast and reported that the taster plays films of zara and
digi_junior against a manifest saying orbit. That was wrong. video_beats is a
render ledger, not the cast, and it is stale: its four job ids match none of
the six films on the slides, and it names kling3_0 while the transactions show
the clips were made on Seedance 2.5 on 11 September. What plays is Orbit, as
Justin's own screenshot of slide 7 shows. The defect is a ledger nobody
updated after the Orbit re-render, which is worth fixing so the next person is
not misled, and it is not a wrong character on a wall.

## 21 September 2026 — migration 323: Cosmo fronts the sixth form, applied

Justin said go. Both KS5 modules move from DiGi to Cosmo on four beats each:
the title's cast key, the arrival, the half time breath and the mission. The
DiGi sign off that ends both lessons is untouched and proved untouched, and
the cast line moves with the beats because contract rule 8 holds every friend
on a beat to the row's own character_cast, which the first generation missed
and the contract caught. Cosmo returns to the home page on his own, because
the squad grid shows any friend the curriculum gives a lesson to.

The words: four writers on four angles, three judges (a Year 13 student, a
head of sixth form, a writer who knows the other friends' voices), three
hostile checks. All three judges picked the same draft; the checks forced six
rewrites and killed three lines for handing over the lesson's own answer in
its opening minute, which the stored script forbids in as many words. The
rule they converged on: Cosmo stops narrating Cosmo, names himself once, and
talks about the room after that, which is how Orbit and Nova already work.

Verified on the live rows: cast line, all four beats, one DiGi sign off left
in each, 30 and 29 slides, 65 minutes each, 29 rows backed up, and both hash
proofs. PR 1137.

Open for Justin, not changed here: DiGi's sign off in module 20 opens "Twenty
modules" and the scheme has 29. True when there were 21. His voice, his call.

## 21 September 2026 — migration 324: the sign off counts the real scheme

Justin's call on the item left open above: make it the real number. Applied.

The number is 28, not 29. ks5-20 is the 28th of 29 in the order the scheme
teaches and ks5-21 still follows it, so 29 would tell a Year 13 class they had
finished a scheme with one lesson to go. The original construction was "this
is module N and N modules led here", so the update keeps the construction and
moves N. The generator computes N from the manifest rather than taking it
typed in.

Also added the guard that should have caught this. check-curriculum-honesty
holds the marketing pages to MODULE_COUNT and the pages have been right for
months; the wall was wrong the whole time, because a count inside a slide is
content in the database and every count guard we had watched the pages.
check-lesson-counts holds any module count stated in a lesson to a number that
is true from where it is spoken: the scheme total, or that lesson's position.
One hit across 29 lessons, and it was the real one.

Verified on the live row: the new line, four lines still in the close, no
character key on the sign off, 30 slides, 29 rows backed up, hash proof. The
retired sentence is gone from every lesson. PR 1138.

Still open for Justin, not changed: "here is where they were all heading" is a
finale and ks5-20 is the 28th of 29, so it lands one lesson early. ks5-21
carries the real close. Whether that line moves, softens or stays is his.

## 21 September 2026, the follow up question moved onto the worry row

Justin: "Yes move follow up." The approved change from the expert review.

The same question, the same three taps, asked in two places, measured on our
own tables: inside the check in about last night's script, 15 answered of 40.
On its own card on Home, days later, 0 answered of 6. Same parents. The only
difference is that the check in asks while the worry is already in their head.

So a follow up ATTACHED TO A WORRY is now asked one line above that worry's
stars in the check in, and is no longer a card. The cron stops making the card
(it still marks the follow up delivered), the prompts route hides the ones
already queued, and lib/checkin/today.ts reads the waiting digi_outcomes row.
Advice not tied to a worry still gets a card, because there is no worry for it
to ride in on.

Nothing is required of the parent and nothing chases them. The band comparison
that actually measures the worry runs whether or not they answer, so the
learning no longer depends on the tap at all.

scripts/check-followup-lives-in-checkin.mjs holds the three files to the same
story. Seven mutations tried, seven caught; the first version of one rule was
fooled by a variable name and was rewritten to count calls.

## 21 September 2026 — four decisions on the curriculum review

Justin pushed back on the review itself: "we are confident in the school
curriculum so let's make the review less often as we don't need to keep
changing often." He was right to. The deep pass proposed 503 accepted edits
across 17 lessons, 311 of them to the wall a child reads, and only 67 of
those were must severity. The other 436 were rubric wins on lessons he is
already happy with, which is churn rather than quality.

1. **The deep curriculum review runs once a term, not continuously.** The
   guards stay on every push: they cost nothing, fire only on something real,
   and are what caught the sign off counting twenty modules. Out of cycle only
   when a lesson is rewritten, a module is added, or the statutory guidance
   moves. Written into CLAUDE.md so a future session does not restart the
   churn. The weekday PR review and weekly UX walkthrough are unchanged,
   because they judge code against review.md and generate no curriculum
   proposals.
2. **This batch applies the must findings only**, plus what is simply empty
   (hard_questions, missing evidence_base) and the places where a printed
   worksheet no longer matches the wall it came from. Every should and polish
   edit stays in the verified files for a later term. Nothing is deleted.
3. **Each lesson gets a named core and an extension.** 26 of 29 run 63 to 73
   minutes against a 50 to 60 minute period, and a reviewer heard what happens:
   teachers cut the last practise slides to reach the exit quiz, which is the
   assessment evidence a head is buying. A stopping point, not a rewrite. The
   published length stays the true total.
4. **ks3-12 gets its two missing beats**, the half time breath and the Orbit
   mission, so the module contract can go into CI over all 29 lessons. The
   breath is a scheme template and needs no new words. The mission lines went
   to Justin for approval first.

Migration numbers from 325. PR to follow.

## 21 September 2026 — migration 325: ks3-12 gets its two beats, and the contract goes into CI

Justin approved the Orbit mission lines. Applied.

ks3-12 was the last lesson failing the module contract, on two rules: no half
time breath led by a friend (it had none at all) and no friend handing over
the mission in the close. It was the odd one out because it was built as the
film pilot, before migration 296 gave every other lesson its beats. The breath
is a scheme template and needed no new words. The mission is new: it names the
three checks, opens on the lesson's real insight that a big instant feeling is
the signal rather than the proof, and ends on pause being a real answer so a
pupil who cannot tell does not leave feeling they failed.

**All 29 lessons now pass the contract, so it is wired into concern-guards and
runs on every push.** That is what makes the once a term review cadence safe: a
gate that runs every time is worth more than a review that runs often.

Two honest notes. The mission script does NOT copy the scheme template line
"DiGi closes on the next slide", because in ks3-11 and ks3-24 the next slide is
the passport page, not DiGi. A reviewer caught it as a scheme wide fault;
fixing the others belongs to the must batch. And the rubric moved 540 to 541
after this morning's migrations: the extra finding was E39 on ks5-20, where
migration 323 wrote "say which one to the person next to you" and the check's
word list knew "neighbour" and "tell" but not "next to you". The prompt does
exactly what the rule asks, so the check was widened rather than the prompt
reworded, which is how a check starts driving the content. Back to 540, and
identical per lesson against the pre migration baseline.

Verified on the live row: 35 slides, 75 minutes, breath at 23 led by Orbit,
mission at 33, passport at 34, DiGi still last, timing string moved with it,
29 rows backed up, hash proof. PR 1140.

## 21 September 2026, the 102 must findings applied, and 601 shoulds parked

The lesson review's own output, filtered to must severity and shipped. 102
edits across 26 of the 29 lessons, written as migrations 326 to 336 and applied
to production in four transactions. The rubric went 540 to 498.

What the musts were, mostly: a presenter script sending a teacher to the wrong
beat (DiGi does not close on the next slide when the passport page is next, in
lesson after lesson), a script naming an answer by its position when the player
shuffles the options every run, and a script telling a teacher to read a reason
the wall never draws. All three are the same fault, which is why they are
musts: the bar tells the teacher something the screen does not do.

**601 shoulds and 54 polish edits are parked, not lost.** Justin's decision
(same day, the cadence question): we are confident in the scheme, so a pass
that proposes hundreds of edits to lessons that are already good is churn.
`scripts/filter-review-batch.mjs` keeps every parked edit with its text and the
verifier's reason, flipped to `accept: false, parked: true`, for a later term.

Proof, because these are 102 edits into live classroom content. Every edit
guards on the slide's type and heading and on the exact text it replaces, and a
single miss aborts the whole batch. Zero misses. Afterwards all 29 production
rows were hashed against `content/modules/` and all 29 matched, so the three
untouched lessons are provably untouched too.

One thing left from that decision: the blanks and drift half. Sixteen of the
seventeen reviewed lessons have an empty `teacher_notes.hard_questions`, some
have no `evidence_base`, and worksheet and wall wording has drifted apart in
places. Those are lesson level proposals rather than string edits, so they
cannot go through the same generator and need their own pass. PR 1142.

## 21 September 2026, the render found the wall clipping, and it is not the batch

Rendering migrations 326 to 336 turned up a separate, pre existing fault: on a
projector, diagram step cards are cut off mid sentence. ks2-09 slide 12 stops at
"Ask the maker BEFORE," and its script tells the teacher to point at three
verdicts that are below the fold.

Measured whole rather than sampled: 12 of 35 slides in ks3-12 and 15 of 29 in
ks2-09 clip at 1920x1080, nine of those 64 by more than a line. More screen
height does not help, because the type scales with the viewport.

Every guard passes it because the word ceiling measures each block on its own,
by design, and nothing measures whether a slide FITS. Four eleven word cards
each clear 105 words while the slide as a whole is cut in half.

Not fixed here, on purpose. Cutting good KS2 copy to a layout nobody has
measured is the wrong repair, and council-checks.mjs learned that once already.
The order is measure all 29, look at the card layout, then a guard that uses a
browser, then copy if any is genuinely too long. Written up with the evidence in
plans/2026-09-21-the-wall-clips-finding.md. PR 1142.

## 21 September 2026, CI caught a lost source claim that the generator should have

concern-guards failed on PR 1142 after the must batch was already live.
check-source-claims found three sentences pinned to a primary source that the
edits had changed: "A computer reader IS allowed" and "A human reader is NOT
allowed" on ks3-24, and "WORKS IN STEPS" on ks2-25.

The facts survived. What changed was the capitals, and the edits were right:
E34 and the BDA guide rule out capitals for emphasis for dyslexic readers, and
ks3-24 slide 12 is the slide written for that reader, about the reader they are
allowed in an exam. So those three claims are now matched case insensitively,
and only those three. Everything else stays an exact match, because for most of
them the exact words are the point.

The real fault is that gen-review-batch checked attested phrases in two of the
three places they live, shared/schools-rshe-2026.ts and
shared/schools-computing-pos.ts, and never looked at check-source-claims.mjs.
It now runs that guard on the post state the same way it runs the module
contract, and only a NEW failure blocks a batch. Proved both ways: a synthetic
edit that guts the phrase exits 1 with the file named, a control edit that
rewords around it exits 0.

Mine to own: I ran ten guards locally before applying and this was not one of
them. CI caught it, which is CI working, but by then it was in production.
PR 1142.

## 21 September 2026, the core and the extension, marked in 26 lessons

147 slides now carry `extension: true`. The core is everything without it, and
a teacher short of time skips the marked ones and still runs the whole arc,
lands the objective and reaches the exit quiz. Not a stopping point, a
droppable set in the middle.

Not one character of lesson text changed. The marks are booleans, so every
module's string hash is byte identical to production.

One rule across all 26 rather than 26 hand picked cuts. Never markable: outside
teach and practise, concepts, key visuals, the first check in a phase, the half
time breath, the main practice, or any slide carrying a protected phrase or a
key learning point with no other home. Taken last first.

**check-lesson-core.mjs caught one while it was being written**, which is the
argument for the guard before the marks: both ks3-11 slides carrying
"password", an RSHE evidence phrase, were marked, which would have dropped it
from the core. Slide 20 came back.

**Five lessons do not reach 55 and that is the right answer.** ks4-17 is
sextortion; what is left after marking is what sextortion is, why paying never
makes it stop, the three lifelines and one check. Reaching 55 there means a
hole in a safeguarding lesson. So the ceiling is per lesson, recorded with its
reason, and may only ever come down: ks4-17 at 60, ks2-07 at 59, ks3-11 at 58,
ks2-08 and ks3-12 at 56. PR 1143.

## 21 September 2026, eighty hard questions, and the one blank left open

Twenty of the 29 lessons had no teacher_notes.hard_questions. Four per lesson
now, written from that lesson's own recorded misconceptions rather than
invented around the topic, so they answer what the lesson actually provokes.

The hard ones are the point. Does paying once make it stop: no, and why. Am I
in trouble if I sent the image myself: no, it is a crime committed against you.
Is the radicalisation lesson an attack on boys: no, the pipeline targets you.
Is Father Christmas real, in EYFS: handed back to the family, on purpose.

Rubric 498 to 478.

**evidence_base is deliberately still blank in those twenty.** It wants claims
with real sources and a verification status, so filling it is a citation pass
rather than a writing pass, and inventing a source is the one thing that must
never happen here. It stays open and named rather than quietly filled.

## 21 September 2026, the wall clips, and the guard that was measuring a demo deck

Found while rendering the must batch: on a 1920x1080 projector, slides are cut
off mid sentence, and no existing guard could see it. council-checks measures
each card against a readability ceiling ONE AT A TIME, deliberately, because a
child reads one card at a time. The wall draws them all at once. The ceiling
measures readability; nothing measured fit.

**Two causes, neither of them the copy.** The teacher's script was taking up to
363px of a 1080 wall, because the presenter bar is flexShrink 0 against a
flex 1 stage, so every pixel it takes comes off what thirty children see. And
three width constants predated the wall scale: a three across diagram grid
divided WALL.column into twenty character ribbons, and both caps inside
AnimatedIntro were a flat 900, which at 40px is NARROWER than comfortable,
which is why title clipped on 29 of 29 lessons with the objective below the
fold.

**Two columns is not the fix and cannot be.** Halving the width doubles each
item's lines and a grid row is as tall as its taller item, so two columns cost
2 x max(a, b) against one column's a + b. Widening is the lever.

Five layout changes, no lesson text touched. Wall clips 243 to 227, and
severity down more than the count: diagram 726 to 504, title 441 to 246.

**The guard was measuring the wrong pages, and that is the real lesson.**
GC_DEV_SLIDES is read by the PAGE, in the server process; the CI step set it on
the guard only. So the server served its built in 21 slide sample deck for
every request and all 29 lessons were measured as one demo deck, 1711 times,
filed under the real lessons' names. Three commits in a row returned the
identical "1 new, 215 fixed", which is what determinism looks like when the
thing being varied is not the thing being measured.

Two wrong diagnoses came first, both checked rather than assumed: fonts
(Nunito loads in both, the fallback is 2.6 percent narrower) and the browser
binary (the headless shell moves one slide in twelve, the one on the
threshold). Both real, both far too small. What was missing was the cheapest
check of the three: whether the measurement was pointed at the right thing.

So the guard now proves its own preconditions before it measures: a sentinel
that must come back in the DOM, a settle loop that refuses a half rendered
page, and a provenance line carrying the browser build, the font, and a fixed
reference slide. A baseline of pixels carries its conditions or it carries
nothing. PR 1143.

**What is left is mostly not layout.** The median wall slide still clipping
carries 530 characters and the worst run past 1000. Only 34 clip while
carrying under 300, and titles are most of those, held up by the 324px
character frame on the opening slide. That is a brand decision, so it is named
here rather than quietly shrunk, and the rest is a curriculum question for the
term review, sized per slide.

## 22 September 2026 — The helpline hotfix, and the number is the lesson

Measured where the DIGITS of every helpline in the scheme sit relative to the
fold on a 1920x1080 projector. Five dialable numbers were below it.

Justin's call was to treat it as safeguarding rather than curriculum quality
and fix it ahead of the term review. The reason it is not a layout defect: the
teacher scripts say the wall is the surface a pupil copies the number from and
that they copy it without wanting to be seen, and no worksheet or print route
carries these numbers anywhere else. The slides are the only pupil facing place
they exist.

Migration 337, applied and verified. Three slides, two of which change no words
at all: a recap point reordered 4th to 3rd (the script pins points 2 and 6, so
3rd was the only free slot above), three chips dropped that repeated the step
titles above them character for character, an NHS clinic sentence moved from
the card into the script, and 64 characters of flourish cut from one body. Five
below the fold became one. PR 1144.

## 22 September 2026 — A guard for the numbers, with two standards on purpose

check-helplines.mjs, in the wall-fit job so it shares one server boot. It runs
first: a child who cannot read a helpline should be at the top of the log, not
twenty four minutes down it.

The wall is a hard gate with a hand written allowlist and no regenerate flag,
because a ratchet promises "no worse than yesterday" and for a helpline the
only acceptable state is readable. One entry: ks4-28 s28, where the number is
the deliberate closing beat of a six point recap.

1366x768 is the tighter surface, which is not obvious and is why the guard
found something the wall pass missed. The type scales by height while the stage
shrinks faster, so ks4-29 s28 clears its helpline on a wall and misses by 83px
on a laptop. There the standard is the wall fit baseline rather than a second
list: a number cut on a slide that fits is an isolated defect and fails, a
number cut on a slide already 513px over is a symptom of that clip and is
reported with its size. That rule cannot rot, because the baseline only
shrinks, so the day such a slide is fixed its helpline becomes a hard gate
with nobody having to remember.

## 22 September 2026 — The star cap, and what it actually bought

AnimatedIntro caps the character frame at min(440px, 22vh), from 324px, which
was 46 percent of the 699px stage on a wall. A calibrated vh rather than a
container query, because making the stage a size container would change
containment on the very box check-wall-fit measures.

Honest result: it took 65px off 56 title slides and cleared 2 of them. The
opening slide has seven elements competing for one screen, so the rest is a
design decision rather than a size one. Across the whole sweep the fix set
cleared 2 pairs, improved 58, and added none.

## 22 September 2026 — Open: two recaps where the number cannot move

ks4-28 s28 and ks4-29 s28 both end on a six point recap that overflows at both
sizes, 434px and 531px on a wall. The helpline in ks4-28 s28 is the last point
by design ("leave a beat after the last one"), and ks4-29 s28 clears on a wall
but not on a laptop. Both need the same decision: split the recap, or cut
points. That is curriculum, not layout, so it is named here rather than done.

## 22 September 2026 — Split the two six point recaps, keep every word

Justin's call on the one open question from the helpline hotfix: split rather
than cut points. "Split, keeps every word."

Migration 338, applied and verified. Both KS4 lessons closed on a six point
recap that overflowed at both sizes, 434px and 531px on a 1920 wall, so the
tail was off screen whatever order the points sat in. Each is now two slides of
three, one minute each, so the pair runs the two minutes the recap ran and the
timing string still states 63. Not one of the twelve point strings is
rewritten, which the migration proves rather than asserts by comparing the
multiset before and after and refusing to write if a word moved.

ks4-29 is regrouped rather than simply cut in half, and that came out of
measuring rather than taste. Its opening point runs four lines where the others
run two, so leaving it above the helpline put the numbers 19px under the fold
on a wall and 55px under at 1366. Five arrangements were measured through the
real player. The one that clears every number at both sizes puts the pastoral
three together (you are not in trouble, here are the numbers, most people are
not harmed) and the mechanics three together (why the feed found you, what a
paid offer is, the three moves it ends on).

check-helplines is now 21 readable, 0 below the fold, and its wall allowlist is
EMPTY. That is the state to keep it in. PR 1144.

## 22 September 2026 — The Planet Friends were drawing as emoji

The schools home page and the curriculum map drew the cast as symbols in three
places: Pebble a seedling, Bloop a jigsaw piece, Orbit a telescope, Nova a
compass, Cosmo a rocket. Every character record already carried its real cutout
in `img` right beside the emblem, and those three spots reached past it.

It matters because of where they are. The curriculum map is the page a head or
a parent reads to decide whether to buy, and the map preview sits above the
fold on the home page. Somebody who has just watched a lesson then meets five
symbols that are not the five characters.

shared/components/FriendMark.tsx draws them: the plate device from FriendPlate
with no motion and no client bundle, because FriendPlate is the friend in a
lesson and that is the wrong tool for a 24px chip, of which the curriculum page
carries twenty nine on one screen. The emblem stays as the fallback. Checked at
1440 and 390: EYFS and KS1 draw Pebble, KS2 Bloop, KS3 Orbit, KS4 Nova, KS5
Cosmo.

## 22 September 2026 — The animation decisions, and a curriculum risk found under them

Justin's calls: Orbit fronts the pilot, every lesson gets a speaking intro
introducing its own friend (so the silent loops go, reversing my
recommendation), the retired cast is confirmed retired, every lesson gets an
outro explaining the Passport stamp, the mini series is for parents and schools
buying with a second strand for schools and teachers, he appears in the parent
and LinkedIn films only, and the friends get generated voices locked to an id.

Two findings worth keeping.

**The Higgsfield account id is inside every asset URL.** 237 assets in the repo
and 10 more in production hang off one CDN path: 95 lesson covers, 37
printables, the cutout and every mood still for all five friends. A new account
cannot serve them. Whether a cancelled one keeps serving is unknown and cannot
be tested from here, so the plan says mirror all 247 to our own storage before
any account decision. On the account itself: bigger subscription on the existing
one, not a new account. The tooling already renders on it, a new one loses the
references and the history, and ULTRA is 30 credits per dollar against 21 for
top up packs that expire in 90 days.

**Eight secondary lessons assume a primary lesson the pupil may never have had.**
Measured from production: every KS3 and KS4 lesson states prior knowledge citing
our own primary modules by id, and ks2-06, the feed loop, carries seven of those
dependencies alone. A secondary buying KS3 to KS5 today is buying lessons that
open by assuming an intake was taught something most of it was not.

The fix is the same work as the speaking intro Justin asked for, which is why it
is cheap: the friend names the one thing from before in fifteen seconds, phrased
so it lands as recall for the pupil who met it and first teaching for the pupil
who did not, with neither singled out. Plus one Year 7 bridge lesson for schools
that want to level a cohort in week one. That is what makes the secondary scheme
sellable standalone.

Plan: plans/2026-09-22-animation-and-mini-series-plan.md. Character bible:
digi-squad/README.md. PR 1146.

## 23 September 2026: daily health sweep, one duplicate index dropped

Routine sweep. Schema clean, all sixteen watched columns present. Crons: every
job on schedule, nothing overdue, no failures in seven days. `legal-watch` has
never run but its route only landed 16 September and its first scheduled fire
is 3 October, so that is expected, not a fault.

Security advisors unchanged in shape from prior sweeps (RLS-no-policy and
search-path notes on ops-only and backup tables, security definer functions,
leaked password protection off). Performance advisors mostly the same known
shape too, except one new item: `child_time_settings` carried two identical
unique indexes on `child_id`, one backing the real constraint and one a plain
duplicate tied to nothing. Dropped the duplicate. Migration 340, no behaviour
change. PR: this sweep's branch.

Also read the body, not just the status, on the monthly review email
(`/api/email/monthly`, CRITICAL). It has been replying `ok:true` every day
with no error, but has sent one real email in the last two catch up windows:
every other due family hits `noData` because none of them have any
device_sessions rows for the month being reviewed. Not a code fault, the
route is doing exactly what it says on the tin. Left for Justin: is this
low device-timer usage across the 27 onboarded families, or a place the
product should be checking. Not fixed here.
