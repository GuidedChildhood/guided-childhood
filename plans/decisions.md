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
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-22 | 252 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-09-21 · 21 September 2026 — DiGi's card link, and a name we have not met · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — the mirror is true: all 29 lessons in content/modules, hash proved · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — migration 321: the keyword meanings the wall could not see · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — the lesson rubric, and the only road from a finding to production · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — on a phone the lesson opens section is a swipe strip, not a pinned board · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — the passport stands in the door at the end of the road · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — one ruler for a slide the class acts on · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — the scheme publishes the length it actually runs · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — Cosmo fronts the sixth form, and the pilot's cast predates the Planet Friends · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — migration 323: Cosmo fronts the sixth form, applied · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — migration 324: the sign off counts the real scheme · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, the follow up question moved onto the worry row · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — four decisions on the curriculum review · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026 — migration 325: ks3-12 gets its two beats, and the contract goes into CI · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, the 102 must findings applied, and 601 shoulds parked · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, the render found the wall clipping, and it is not the batch · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, CI caught a lost source claim that the generator should have · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, the core and the extension, marked in 26 lessons · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, eighty hard questions, and the one blank left open · `plans/decisions-archive/2026-09.md`
- 2026-09-21 · 21 September 2026, the wall clips, and the guard that was measuring a demo deck · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — The helpline hotfix, and the number is the lesson · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — A guard for the numbers, with two standards on purpose · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — The star cap, and what it actually bought · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — Open: two recaps where the number cannot move · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — Split the two six point recaps, keep every word · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — The Planet Friends were drawing as emoji · `plans/decisions-archive/2026-09.md`
- 2026-09-22 · 22 September 2026 — The animation decisions, and a curriculum risk found under them · `plans/decisions-archive/2026-09.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

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

## 23 September 2026 — The safeguarding crosswalk is open, because a DSL could not see it

We asked a designated safeguarding lead to review the schools site. She came
back with "I can't see the DSL Hub element of it, so I am unable to comment".
She was not missing it. `/hub/dsl` was not in `OPEN_PATHS`, so the most
qualified reviewer we had could not reach the one page written for her.

Decided: open it. The crosswalk is an assurance document a school reads to
evaluate us, the same category as `/hub/rshe-mapping` and
`/hub/data-protection`, and nothing on it can be taught from. The staff
briefings behind it stay gated, because those are the product.

Three guards asserted the opposite on purpose, including `OPEN_PATHS.length`
pinned at 12 with the note "change this number on purpose". Changed on
purpose, reasoning recorded at both ends. Now 13. PR 1149.

Her second point is still open and is the harder one: **nothing is adaptable.**
Everything generates from the lesson row. She does not mean rewrite the lesson,
she means their school in it, the DSL, the deputy, the reporting route, the
policy title. Sized in `content/linkedin/schools-launch-pack.md` as change 2.

## 23 September 2026 — The LinkedIn Featured banner is built, not generated

Canva's API cannot set a font family and an image model cannot spell
"Reception to Year 13", so either route would have shipped a banner in the
wrong typeface, which breaks a non negotiable. Rendered instead from real
Nunito and IBM Plex Mono with the tokens read out of `shared/tokens.css`.

Fonts are embedded as base64, not linked. The first render linked them, fell
back silently to a system face and looked almost right, which is the dangerous
kind of wrong. The render now asserts both families loaded before it shoots.

Source, generator and both sizes are in `content/linkedin/featured-banner/`,
so the numbers can be corrected when the scheme moves. PR 1149.

## 23 September 2026 — A launch post opens on the buyer, not on the founder

The first draft of the schools launch post opened "we read every one", which
is the founder talking about the founder. Justin caught it. It now names the
PSHE lead and their pain in the first twelve words.

The cost is real and accepted: Justin's following is mostly parents and
researchers, so a hook aimed at PSHE leads reaches fewer people. The goal is
five pilot schools, not impressions. Paste ready text, wrapped for LinkedIn
rather than for a markdown file, is in `content/linkedin/paste-ready/`.
PR 1149.

## 23 September 2026: the free taster gets its evidence, and two claims are corrected

ks3-12 is the one lesson a school opens without a code, and every piece of
launch copy points at it, yet its "Where the claims come from" panel was
empty. Migration 341 gives it four sourced rows and corrects two claims that
said more than their source: the iProov study measured telling real from fake
across every item, not spotting every fake, and "every fake" became "most
fakes". 342 writes the statutory requirement in words, because the module
contract counts the hyphens in RSHE-S-OSA-7 as dashes in copy and only caught
it after 341 was live. The rule from it: run the contract on the mirror BEFORE
production. The iProov row stays "Not yet checked" until its primary is
opened. PR 1150.

## 23 September 2026: source notes are shown, not hidden behind a badge

The lesson page knew three status words and drew anything else as "Mechanism,
no figure". ks2-26, ks3-27, ks4-28 and ks4-29 wrote their checker's notes into
that field, so 24 notes never reached a teacher, and a source ks4-29 marks
DEMOTED was badged as though it backed the lesson. Justin chose the renderer
fix and a guard, no content change: `shared/evidence-status.ts` decides badge
or note, and `check-evidence-status.mjs` fails CI if a note can hide again.
PR 1150.

## 23 September 2026: a DSL can make the crosswalk her school's own

Jane's second point, adapt, answered with the three facts a DSL otherwise
writes on every filed page by hand: the deputy, how a concern is recorded, and
the policy title, beside the lead's name in the same browser store. They print
at the top of the crosswalk and the staff briefings, under every briefing's
disclosure paragraph and on the teacher sheet. Not typed, the paper gets ruled
lines to write them in. Justin put the form on the open crosswalk too, so a
DSL can adapt and print it before buying. Still browser only, and
`check-your-school-local.mjs` holds that in CI. PR 1150.

## 23 September 2026: evidence for the 8 flagged lessons, and what it waits on

Next, by Justin's choice: the 8 safeguarding flagged lessons whose evidence
panel is empty (ks1-02, ks2-07, ks2-08, ks3-10, ks3-11, ks4-16, ks4-17,
ks4-18), two or three a day, every claim checked against its primary before it
goes live. This environment's network policy refuses the primaries (gov.uk,
legislation.gov.uk, the NCA, IWF, Childline and the journals), so the checking
starts once Network access is widened. Plan in
`plans/2026-09-23-adapt-and-evidence-plan.md`.

## 23 September 2026: the parent track asks one thing at a time, and says what parents want

Pam, a clinician, reviewed the parent track: every quote a problem, a teen
question that asked two things and shamed ("Is your phone giving you what you
want from it, or is it just habit?"), and nothing on the parent's own phone.
Justin took all four recommendations. The teen lines follow her ramp (enjoy,
feel, the why, the worry as a question, the perspective swap), and so do
DiGi's notes and the one library script with the same shape (migration 343,
applied). A "What you want" line sits under each verbatim worry, with a goal
line above the cards, and every stage has a "Your own phone" step under
Tonight. Reply to Pam drafted, to send once live. PR 1150.

## 24 September 2026: the hero names the stage check, and says what a parent gets

Alice, reviewing the site with an early years website AI, said the strongest
conversion idea is "Find my child's stage", not a free trial. That was already
our strategy (THE-STORY.md section 9: every CTA goes to the three question
stage check, same words everywhere), but the hero and final buttons said
"Start for free". Both now say "Find my child's stage", matching the stages
section. The hero line now gives the benefit from our one line story instead
of a feature list. The header "Get Started" stays until the restructure, which
waits for Alice's full notes so the homepage is rebuilt once. Reply to Alice in
`content/linkedin/paste-ready/reply-to-alice.txt`.

## 24 September 2026: outside advice is weighed before it is acted on

Justin asked that no advice be acted on until it has been checked against our
own philosophy and goal. Now every piece of outside feedback goes through
`.claude/skills/feedback-filter`, routed from CLAUDE.md. It splits the advice
into points, tests each against the goal (the stage check), the five
commitments, the customer, evidence or silence and what already exists, then
returns adopt, adapt, already built, park or decline with the reason. Jane,
Pam and Alice were weighed retrospectively in
`plans/2026-09-24-outside-reviews-weighed.md`: nothing shipped needed undoing,
and four face value mistakes were avoided. PR 1151.

## 24 September 2026: three flagged lessons get evidence, and say only what their sources say

V1 batch one, now the network is open: ks3-10, ks3-11 and ks4-17, plus the
taster's iProov row, now verified. Every claim was checked against its primary.
The panels are written, and 71 strings are corrected where they said more than
a source supports or had gone out of date. Examples: the Oxford study never
measured "what you do on a screen"; paying is "no guarantee", not "never"; and
a live sextortion case goes from the DSL to the police, as the NCA alert says. It emerged that the 80 hard questions
of 21 September were never migrated. These four lessons now carry theirs; 16
still wait. Migrations 344 to 347, hash proved, 88 render checks pass. PR 1152.

## 24 September 2026: Simon Squibb's ideas weighed, and a KS3 module to follow the checks

Justin asked for a module Simon Squibb would value, on work school does not
prepare children for, wrapped in AI. Weighed first in
`plans/2026-09-24-simon-squibb-weighed.md`. His view of phones is already ours:
create rather than just consume, with a parent alongside. Adopted: "what problem do you want to
solve?", asking for help, doing over ideas. Declined: memorising is pointless,
ignore your parents, and his unsourced figures. Justin's calls: build "What
problem would you solve?" for Years 8 and 9 after the flagged lessons are
checked; no Squibb name on slides; send him the finished lesson instead. PR 1152.

## 24 September 2026: the Squibb lesson stands alone, outside the scheme

Justin, later the same day: it sits outside the school curriculum for now,
because he is not sure it belongs there, but it should exist as a standalone
lesson. So "What problem would you solve?" (Years 8 and 9) is one lesson in the
same format and player as the scheme. It has its own free link, so Simon Squibb
can open it without a school code, and it stays out of the curriculum manifest,
so it is never counted, mapped, tracked or put on the passport. It can join the
scheme later with one change. It still comes after the flagged lesson checks.
How it stands alone is in `plans/2026-09-24-simon-squibb-weighed.md`. PR 1152.

## 24 September 2026: every page checks who you are without a trip to the auth server

Justin: "DiGi and navigating is still slow." The 13 September fix moved the
middleware and layout to a local token check but left 64 dashboard pages and
the DiGi route still calling the auth server first (1,504 calls a day; DiGi
auth median 130ms). All now use sessionUser; Home reads the account's age from
the profile, identical to the second on all 28 rows. Guarded by
scripts/check-page-auth.mjs. DiGi's biggest wait is the model's first word
(median 2.4s at medium effort); DIGI_CHAT_EFFORT is Justin's call. PR to follow.

## 24 September 2026: DiGi stays at medium effort; the wait explains more

Justin chose accuracy over speed: DIGI_CHAT_EFFORT stays medium. Instead the
thinking lines now say more of what is really happening: never a flat yes or
no, connection before control, the pathway stage, the scientists we trust, the
words to use. The old "safety guardrails first" line overclaimed (the verifier
checks the finished reply) and is replaced by two true lines. No brain science
line: 4 of 142 research rows. Justin confirmed Supabase signing keys are set,
so PR 1154's local session check is live at full speed. PR 1155.

## 25 September 2026: DiGi's typing box is always on screen, and the page is quieter

Justin, screenshot: he could not type to DiGi, and too much was going on. The
chat was a guessed calc(100dvh - 80px) tall, so the taller child badges pushed
the compose box behind the tab bar. Now the dashboard shell sizes DiGi to the
space left (globals.css, `.gc-dash:has(.digi-chat)`), whatever sits above. The
empty page loses the device setup card, shows two examples not three, opens at
the welcome, and the header is one row. Fixture: /ref-digi-chat. PR to follow.

## 25 September 2026: the Devices step ticks on the devices, and "All clear" says what

Justin: "why does it say all clear?" and "i looked at devices but has not
ticked". The passport rung named Devices set up but waited on the whole
passport (lessons, jobs, balance too). It now ticks on its own job, and a job
finished today holds the rung so the tick is seen. The quests rung reads "No
jobs waiting" instead of "All clear". Devices opens on the family's own screens
(research card moved below), and all covered says so with Back to today.
Guarded in check-rung-truth. PR 1161.

## 25 September 2026: Start is the first thing on the parent's timer card

Justin: no obvious way to start the timer, and it must remind parent and child
that every screen goes through it. Start sat at the foot of each child's card,
below settings and three payment options. Now: the rule in one line, the jobs
nudge, device, minutes and a big Start (Jomo and Brink shape); gift or bonus
folds under it; who starts and time tiers fold into the child's settings. The
timer and balance pages say the rule for every family, not only phone free ones.
Holiday time: Teo's 180 min are two July rollovers (90 each). PR 1161.

## 25 September 2026: the child's Print it bar sits on top of the tabs

Justin, photo of the bucket list builder: "print option here hidden by tabs".
Its Print it bar was fixed to bottom 0 under the kid tab bar added on 15
September. KidTabBar now publishes its height as --kid-tabs-h and the bar is
sticky just above it. check-kid-chrome guards both. PR 1161.

## 25 September 2026: the child's home runs the five a day first

Justin: the child's home should run with the five a day, step by step, less
cluttered. While the day runs, the tiles, balance card, goal bars, holiday line
and the quests scene fold behind one More things to do; the diary, greeting,
ask, five a day, what a grown up sent, Use my time and Telling a grown up stay.
A live timer always shows. The five a day gains numbered step circles, "step 3
of 5", and one line per step on why it helps a day with screens in it.
Guarded as rule Q in check-stickers-land. PR 1161.
## 24 September 2026: the standalone lesson is built, and opens free at its own link

Built ahead of the flagged lesson checks because Justin asked to see it; those
resume tomorrow. "What problem would you solve?" is live in production
(migration 348, hash proved): Years 8 and 9, 30 slides, Orbit, three moves
(name a problem, ask three people you know, build the smallest version), with
AI as the checker and never the judge. Every figure is read from its primary:
the WEF employer survey (47 percent of tasks by people alone today, about a
third expected by 2030) and each platform's own 18 plus rules behind the one
safety question. Free to anyone at /lesson/what-problem-would-you-solve, live
now. The guards read content/standalone rather than skip it. Main holds two 348
files (this and PR 1157's grants): the database keys migrations by timestamp,
so nothing clashes, and 349 is next. PR 1158, and the follow up for the guard.

## 25 September 2026: the standalone lesson's migration is 349, and 350 is next

PR 1157's grants reached main as 348 before the standalone lesson did, and
wiring-check refuses two migrations with one number, so main's wiring went
red. The lesson's file moved to 349 (it was applied as 348, and its backup
table keeps that name). This replaces yesterday's "349 is next": 350 is. PR to follow.
## 25 September 2026: the parent's ten minutes are confirmed, Duolingo style

Justin: clear confirmation the parent has done their 10 minutes and what
happens next, the Duolingo loop. The day counting used to be a small box under
the whole path. DayTickFlow now opens when the day's tick lands: your minutes
done (what you did), the streak with the flame, then what happens next
(tomorrow's focus, and what is left today only if there is time). Held in
sessionStorage until closed; the full path close is unchanged. check-today-tick
guards it. PR 1161.

## 25 September 2026: trial emails on the trial clock, trial stays four days

After the Duolingo review. New 'trial' email kind: the welcome, days two to
four and trial ending skip the one a week floor but never suppression, and
only inside the free days. Four days reads welcome day 0, stage day 2, trial
ending day 3 (first on the last day so a drip cannot take the slot). Justin
first chose seven days, then kept four the same morning. Lock after the trial
stays. School family pass is undecided; plan and ideas in
plans/2026-09-25-trial-and-school-pass-plan.md. PR 1164.

## 25 September 2026: the school link, before any paid school pass

Justin picked idea 1: test whether schools bring families before building a
paid pass. A school shares /s/<code> in its newsletter; families get the
ordinary four days and founder rate, and the stage check names their school.
The profile is tagged once at the trial grant. /dashboard/admin/schools adds
schools and shows signed up, card on still free, and paying per school
(a card trial is not counted as paying). Migration 353, its own table, not the
paid licence. check-school-link guards it. PR 1164.

## 25 September 2026: a second standalone lesson, on being an entrepreneur

Justin saw "What problem would you solve?" and asked for more on being an
entrepreneur: the benefits, how to become one, and the ways to look at work.
The first lesson already runs an hour, so this becomes a second standalone
lesson that follows it (working title "Could you be an entrepreneur?", Years
8 and 9). It covers the ways to work, the honest upsides and risks with ONS
figures, and what is allowed under 18. It is built after today's flagged
lesson checks. The sketch is in plans/2026-09-24-simon-squibb-weighed.md.

## 25 September 2026: the first check in says getting started, and a calendar corner

Justin after his own first check in: "10 mins done is not accurate as it takes
2 seconds", and it congratulated a streak on day one. On the day of
first_checkin_at the close is now "First check in, done", then four setup
moves ticked from real state (send the child their app, first jobs, school
reminders, home screen and reminders), then tomorrow. Once per family, not
per child. Home also gets a Calendar and Alerts corner top left, before the
children: the school page (dates, email forwarding, photo a letter) with what
is due this week, and the alerts hub on phones. PR 1164.

## 25 September 2026: school emails were never read past the subject line

Justin added Gmail forwarding and no code appeared. The live table showed no
school connection had ever caught a code, a link or an email. Resend's
email.received webhook carries the envelope only, and the body was fetched
from /emails/{id}, which is for sent mail; received mail is at
/emails/receiving/{id}. Fixed for the Gmail code and for every school email
(the extractor had been reading subjects alone). A Gmail email with no
readable code now says so on screen. The forwarding steps are rewritten as
two parts naming every button. PR 1164.

## 25 September 2026: homework help, hints not answers, no chat

Justin's answers: from 10 the child gets DiGi hint cards, but never an LLM
chat; under 10 the button asks their grown up (a push, no model); photos read
once, never kept; the weekly school job becomes one line, no stars, moving
on Mondays. The child types or snaps the question; one card back says what
it practises (the curriculum line, revalidated, Year 1 to 6), what the
teacher wants, one hint and one thing to try; three hints at most, the last
a worked example on a different question. Daily cap in migration 354.
check-homework-help guards it. Plan: plans/2026-09-25-homework-help-plan.md.
PR 1164.
