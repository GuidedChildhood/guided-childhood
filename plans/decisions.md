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
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-18 | 204 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 19 September 2026, `projector` is an instrument, not a width

Justin, on a phone: "bloop lands on moon not showing right on mobile."

The post photo went beside the post text whenever `projector` was set, and the
teach route sets it on every device. So a teacher opening a lesson on their
phone got the wall layout: a 292px card with a 244px photo pinned inside it,
a text column measured at exactly **0px**, and the handle rendered outside the
card. Reproduced at 390 and 430 before touching anything, fine from 768 up.

Decided: a layout that depends on width is decided by a media query, never by
a flag. `POST_CSS` stacks the row below 900px and relaxes the card from 70vw to
460px there; 1024 and above render byte identically to before, which is how we
know the wall did not move. The card's width had to move into the stylesheet
too, because an inline maxWidth wins over any class trying to relax it.

This is the fourth bug of its family, so it went into the guard that already
names the other three: `check-wall-scale.mjs` rule 4, four mutations, four
caught. The type was never the problem, since the wall scale is viewport
relative and floors at 16px on a phone. It only looked enormous because the
column was 0px and every word took its own line. PR 1123.

## 19 September 2026, the compliance audit: the map was not the territory

Justin asked for a full statutory coverage and lesson audit before any more
building, with the rule "do not implement changes yet".

Two files, no code touched: `GDC_SCHOOLS_2026_COMPLIANCE_AUDIT.md` and
`GDC_SCHOOLS_COVERAGE_MATRIX.csv` (65 rows, requirement text verbatim from the
July 2025 guidance). Every verdict was tested against the live
`schools.school_lessons` rows, 732 slides, not against module titles.

The finding: `RSHE_2025_TOPICS` is a ten item list of themes, and the real
guidance has 28 strands and 195 numbered items. Every compliance surface
renders from that list, so nothing downstream can be more accurate than it.
Of the 57 requirements this scheme could be expected to teach: 18 FULL,
28 PARTIAL, 2 INDIRECT, 9 NONE. The nine include the age 13 minimum, bullying
at secondary, online gambling, and self harm content, which the pricing page
already implies we teach.

Awaiting approval before anything is implemented. The first fix is copy, not
curriculum: "line by line" and "every relevant requirement" cannot stand.

## 19 September 2026, the audit's second pass: KCSIE 2026 arrived

Justin sent the real KCSIE 2026 (split by part, with PDF page markers) and a
clean markdown conversion of the RSHE guidance, then asked "do you have enough".

Yes. Three things settled that the first pass had to flag as unverified.

The RSHE extraction is now double sourced: my PDF extraction and the markdown
conversion independently give 28 strands and 195 items with identical wording.
"Compulsory on 1 September 2026" is verified, not from the RSHE body, which
carries no commencement date, but from KCSIE 2026 para 159, "revised for
introduction September 2026". The Hub's KCSIE sentence is true, with two
wording fixes: the five risks sit INSIDE the four areas of risk (para 165), not
alongside them, and the fourth C is commerce.

The finding that got worse: seven of the nine gaps are named by KCSIE too.
Online gambling and self harm are both in para 165. Online bullying is in
conduct. A gap named by the curriculum guidance and the safeguarding guidance
is a different kind of gap.

The finding that got better: five per module KCSIE hooks are now verified by
paragraph, including the one ks2-23 and ks3-22 carry, which turns out to be
KCSIE's own words: contact risk includes "generative AI applications that
simulate this". PR 1125.

## 19 September 2026, the KS4 gambling module, and a generator for lesson migrations

Module three of the four statutory gap fills. `ks4-28-the-money-and-the-odds`
closes RSHE-S-WO-4 and RSHE-S-MW-8, the two requirements KCSIE 2026 names under
commerce at paragraph 165. Before it, a word boundary search of every slide in
production returned one hit for `gambl`, a single KS2 loot box slide, while the
Hub listed online gambling as a covered topic. The `gambling` key moves off
ks4-15, which never used the word, onto the module that teaches it.

Taught as three questions rather than a warning: THE PRICE, THE ODDS, THE LOOP.
Every number on a slide is either arithmetic a class can check in ten seconds
(2.7 percent from 37 pockets paying 35 to 1; a 36.7 percent chance of nothing
in 200 opens at 1 in 200) or it went through an adversarial citation pass.

That pass changed five things, and the pattern is worth keeping. The speed and
harm claim was demoted from causal to correlational, because the research says
correlational and the Gambling Commission's own survey has counter evidence in
it, so the lesson now says that out loud and the prove question rewards the
honest answer over the tidy one. The 2025 online slot stake caps went in
instead, because a legal fact carries the cycle better than a contested
research one. The helpline gained the detail that decides whether a pupil rings
it: no minimum age. The national self exclusion scheme was left UNNAMED on the
pupil slide, because its minimum age could not be confirmed and it has been
rebranded, and silence beats a wrong age on a wall. And the widely quoted 400
gambling suicides a year is named in the teacher notes as a number NOT to use,
because it is a modelled estimate rather than a count.

Also new: `scripts/module-to-migration.mjs`. Migrations 312 and 313 were
assembled by hand out of sixty thousand characters of curriculum prose, which
works right up until somebody mistypes a quote. The JSON is now the source and
the SQL is generated. Checked by regenerating 313: byte identical to the hand
written file up to the first jsonb literal, differing only in JSON separator
spacing after it, with all six payloads parsing deep equal.

Migrations 312, 313 and 314 are generated and NOT yet applied. Nothing is
claimed as covered until they are live and the evidence check passes against
production, which is step B6. PR 1125.

## 19 September 2026, the tracker now counts statutory requirements, not lessons

B7. Ticking a lesson used to record that it was delivered and nothing more,
which is a record of activity rather than of coverage. A deep dive does not
ask how many lessons were taught, it asks which requirements were met, and the
honest answer lived on a different page that knew nothing about what this
school had actually done.

Each row now says what it evidences, a panel above counts it, and the printed
coverage sheet gained an appendix: every requirement met, in the wording of
the guidance, with the lesson that taught it. That appendix is the artefact a
subject lead is actually asked for.

The first draft counted 48 and was wrong, which is worth recording because it
is the same mistake the audit was written to catch. Counting every requirement
that names a module swept in the PARTIAL rows, where the lesson teaches only
some of it, and the BY_DESIGN rows, which the school's own scheme owns and we
deliberately do not. Both are quiet overclaims. The count is FULL only, 40, and
the panel says out loud that partly covered requirements are not counted and
neither are the ones the school owns.

Verified at 390 and 1440 and in print, with a seeded term of five ticked
lessons: 18 of 40, no overflow, no console errors, appendix print only. The
two new modules show DONE and evidence nothing, which is correct, because
their migrations are not applied and their verdicts are still GAP. PR 1125.

## 19 September 2026 — every key the app reads is written down

Setting up a new laptop, the template listed 23 keys and the app read 43.

The two that mattered: `VAPID_EMAIL` and `VAPID_PRIVATE_KEY`. `lib/push/send.ts`
returns early and sends NOTHING when either is missing, with no error and no
log, so push stops while everything else carries on looking healthy.
`EMBEDDING_API_KEY` is the same shape, semantic search silently returning
nothing for ever and DiGi falling back to keywords without saying so.

That is the class: a missing key does not crash anything, it removes a feature
quietly, and whoever set the machine up cannot find out.

`scripts/check-env-documented.mjs` in CI, scoped to app/ and lib/. It found two
I had already miscategorised as script only. The template also now opens with
`vercel env pull .env.local`, which is the right way to set up a machine
anyway: one command, every key, nothing carried on a stick and nothing stale.

## 19 September 2026, the scaffold column had a vocabulary and nothing local knew

Trying to apply migration 312 to production failed on
`school_lessons_scaffold_check`. The column is a three way classification of
what a lesson asks a child to DO, and it allows exactly NOTICE, CHOOSE or
TELL. All 25 live modules carry one of the three.

All four new modules had the lesson's memorable tool in the field instead:
SHIELD, NAME IT SAVE IT SAY IT, THE PRICE THE ODDS THE LOOP, STOP IT REPORT
IT SAY IT. Every local guard passed. The contract check, the typecheck, the
scale guard and the wiring check all had nothing to say, because none of them
knew the column had a vocabulary. The first thing to object was Postgres, at
apply time, four modules and eleven commits after the mistake was made.

The fix cost nothing, which is the annoying part: the tool string was already
in `teacher_notes.tool` on all four, so the field was simply duplicating it
into a slot that means something else. Corrected to NOTICE, TELL, NOTICE,
TELL, and the four migrations regenerated.

The durable fix is rule 10 in `scripts/check-module-contract.mjs`, which
holds the field to the same three values the database does. Verified both
ways: it exits 1 on the old value and passes all four corrected modules and
all 25 live ones. If the constraint ever widens, widen the rule in the same
commit. PR 1125.

## 20 September 2026, daily sweep, four backup tables with no RLS at all

The Supabase advisor sweep found migrations 309, 310, 311 and 316 each
backed up schools.school_lessons before rewriting it, the way every
migration since 308 does, but dropped the `enable row level security` line
308 set the pattern with. Four of roughly forty backup tables had no RLS and
no policy, meaning PostgREST could actually serve them, not just the safe
"RLS on, nothing granted" state every sibling backup table sits in.

Migration 317 enables RLS on those four, no policy added, matching every
other backup table. Verified on the live database: all four now show
relrowsecurity = true. Schema check, cron heartbeats and required columns
were all green; nothing else from today's sweep needed a fix.

## 20 September 2026, a module reaches production in hash verified chunks

There is no database password in the build container and no migration step in
CI, so a new module reaches production by being pasted through the Supabase
tool, and a module migration is forty to seventy thousand characters with the
slides as one thirty thousand character literal. Retyping that is the least
reliable step in the pipeline, and what it corrupts is lesson text on a wall.

So the module is cut up. `scripts/module-to-chunks.mjs` turns the JSON into
statements under five thousand characters, applied in order.
`scripts/module-string-hash.mjs` then proves the row arrived: every string in
the module hashed, sorted and hashed again, computed locally and on the
server, and the two match or the module did not arrive. Its `--assert` mode
prints that proof as a migration, so 312 to 315 sit in the remote history as
executable assertions rather than as absent. All four hold.

The tool earned its keep on the first run: ks2-25 differs from its JSON file
by two strings, migration 296's pause beat, applied and never written back.
Production is the source of truth for a module amended in place. PR 1125.

## 20 September 2026, the audit is closed: 57 of 57, proved against production

The 19 September audit found 18 of 57 digital requirements taught in full.
Migrations 309 to 311 took that to 40. Migrations 312 to 316, four new modules
and fourteen appended sentences, take it to 57, with 0 part taught, 0 not
covered and 0 handed to the school's own scheme.

The claim is a test result. 147 evidence phrases, read out of the exact slide
text now in production, were run against the live table: 147 checked, 0 not
found. The hash is in `scripts/fixtures/rshe-evidence.json` and the ratchet
in `scripts/check-rshe-coverage.mjs` is at zero and zero, where it stays.

Two limits stand, in the audit's new top section: this does not make a school
compliant, because the eight non teaching duties are the school's, and it
covers 57 of the 195 items, never all of them. PR 1125.

## 20 September 2026 — the layouts have to survive Larger Text

Justin, from his phone: "this needs redesigning as text not reading right."
His screenshots had "How this works" with "warded em" printed across it, and
"Spelling test" written through the MONDAY pill.

**Not a wrapping bug, and not a mistake to undo.** `shared/tokens.css` sets
`html { font: -apple-system-body }` on purpose, so the rem type scale follows
the iOS Dynamic Type dial. A parent on Larger Text genuinely gets the type at
up to two and a half times the size. That is the accessible choice and it
stays. What never happened is building the layouts to survive it: the type is
rem, the pill padding, the 40px buttons and the flexShrink 0 chips are px.

Reproduced at `html { font-size: 40px }` on /ref-school-card and it fell apart
exactly as his phone did. Fixed by letting things wrap rather than by stopping
the scaling: the fold value drops below its label, a reminder title takes its
own line, the tick and cross move as a pair, the step badges are em.

**This is not only that card.** Every screen uses these tokens, so the same
shape of fault is waiting anywhere a fixed pill sits beside rem text.

Second thing, same card: the "Send a test" button called
/api/school/remind/test, which tests whether this PHONE buzzes, inside a box
titled Forwarded emails. It looked like it was testing the forwarding and
silently was not. The steps were never missing either, /dashboard/school has
minted the address and shown it with Copy since 17 September, and nothing
pointed at it. Three numbered steps after Tripsy, a real door, and the phone
test named for what it does.
## 20 September 2026, the council runs on all 29 and five slides come inside the ceiling

The lesson council's counted checks had not been run since the four new
modules landed. Run over all 29 on a fixture of the production rows: prose
9.81, blocks 9.68, engagement 9.41, passport 10, all above the floor. The one
place the new four sat below the other 25 was five KS4 concept slides at 120
to 165 words against the measured 105 word ceiling.

Justin's decision: trim. Migration 318 rewrites the five bodies to 103 words
or fewer, moving nothing off the wall except into the teacher script on the
same slide, guarded by heading and by the body it expects to find, and proved
by the same string hash the module tools use. The attestation still holds at
147 of 147, and prose is 9.95 after it. The council fixture run does not move
the ratchet; the next live run will. PR to follow on this branch.

## 20 September 2026, the safeguarding lead's name is typed once, on the device

Every lesson can teach that there is a grown up in the building whose actual
job is safeguarding. None of them can say who, and the KS2 slide migration 316
added asks the teacher to say the name out loud and write it on the board.
Justin's decision: type it once. A "your school" box on the Hub takes the
lead's name and where to find them.

It lives in the browser like the tracker and the passport fill, is never sent
to us, and is shown under any slide whose words name the safeguarding lead (the
KS2 slide, the KS3 and KS4 choices that list who to tell), on the flagged
lessons' prep page and run sheet, and on the printed teacher sheet when it is
printed from a screen that knows it. The privacy notice's sentence about what
stays on the device now names it, and the legal set is re dated. PR 1128.

## 20 September 2026, the four new lessons' home pages were crashing, and the shape is now decided at the desk

Rendering the panel found it: the four modules written on 19 September
carried prior_knowledge and i_can as prose and differentiation as one string,
where the other 25 carry two lists and a { support, stretch } object. The
lesson home page maps over prior_knowledge, so it crashed on all four in
production, "That page did not load" on the page a teacher opens first. A day
live before it was seen.

Three fixes, all in PR 1128. Migration 319 puts the four rows in shape, the
same words in lists and an object, guarded by the exact strings it expects and
proved by hash. The pages read every list through `schools/lib/notes.ts`, so
prose renders as one entry rather than taking the page down. And the module
contract gained rule 11, which refuses the shape, proven both ways: it fails
the old files and passes the fixed ones.

The lesson: a guard that only checks what somebody thought to check, and a
render that only visits the pages somebody thought to visit. The four new
lessons' home pages were never rendered before they shipped. Every new
module's prep page, run sheet and pack get rendered before its migration is
applied from now on.

## 20 September 2026, correction: the council's fixture was stale, and twelve older slides are over the wall ceiling

The two entries above that give prose as 9.81 and 9.95 were measured on a
fixture whose copies of the 25 older modules predate migrations 309 to 316.
The same rule run on the production table gives prose 9.52: 357 of 375
within the ceiling, 18 over. Six are EYFS and KS1 slides over the decoding
ceiling since before the audit. Twelve are KS2 to KS4 concept slides that
yesterday's appended clauses pushed past the measured 105 word projector
ceiling, to between 106 and 207 words: ks4-17 s7 and s13, ks4-16 s7, s16 and
s20, ks3-12 s10, ks3-11 s19, ks4-18 s11, ks2-07 s11, ks3-14 s15, ks2-08 s18,
ks2-06 s7. A live council run would show the ratchet going backwards from its
9.78 floor.

Not fixed yet, because the fix changes where a statutory clause is taught:
the recommendation is to carry each appended clause in the teacher's script,
which the attestation reads and the teacher says word for word, rather than
on the wall, so no slide, minute or claim moves. Justin's call. Until then
the council is only trusted against production or a fixture pulled the same
day, and the audit's top section says so.

## 20 September 2026, the schools home page moves: the wall builds itself and a lesson opens as you scroll

Justin asked for the home page at the Apple bar with slick animation and no
wiring changes. Decided: the motion is the product's own story told once, not
decoration. The Wall at Sixteen draws itself on arrival in three seconds from
the art the lessons use (road, bricks, friends in age order, sign, door,
passport), a pinned board turns through the six phases, read from the shared
phase list, as the reader's steps pass it, and the two radial glow blobs go.
Every route, link, form and price band is untouched, the server still sends
the finished page, and reduced motion sees it still.

Found on the way: a jump to an anchor (the hero's "See every year") left the
section blank for two seconds, because the reveal staggered everything the
jump had passed. Fixed in the schools HomeReveals: what is above the screen
appears at once, only what is on the screen rises. The parents home page's
copy of that reveal has the same shape and is outside this lane. PR 1130.

## 20 September 2026, the eighteen slides come inside the ceiling, and the four new breaths get their friend

Justin: "yes fix slides". Migration 320 moves the twelve September clauses off
the wall and into the teacher's script, word for word, introduced as "Say
this, as written" and sitting between the teacher's own notes and the delivery
notes that came with them, so the wall keeps one idea and the teacher still
says every sentence. The six early years slides get one short line each and
carry the old one in the script the same way. The four half time breaths in
the 19 September lessons get their friend, a heading, the half time words and
a four second breath; they had a thirty second one, which the player renders
as one breath in that lasts half a minute. Every write was guarded by its
exact current text and every proof held on apply: 147 of 147 phrases, prose
375 of 375 on production (10.00, from 9.52), hashes equal to the four module
files.

Two instrument changes, both explained in the files: the council no longer
counts the eyebrow label on a title slide, because the label and the title
alone were thirteen words and the early years titles could never pass; and
contract rule 12 keeps every star breath at four seconds and the half time
one the friend's. PR 1130.

## 20 September 2026, the friends get a plan, the icons get a second home, and the computing map exists

Justin: "can we use happy news icons on lessons, since we have icons", "can we
keep seeing appearances from characters, and how to plan that", and the
computing programme of study text. Three things, all in PR 1130.

The Happy News drawn icon set and its palette move to shared, with the two
parents app files re-exporting so a colour is still stated once. Six lesson
objects join it (lock, magnifier, shield, compass, letters, access) and the
schools Hub tiles wear drawn icons on crayon discs instead of fourteen emoji.
The wall keeps its emoji for now: the review agents propose an icon per slide
once the rubric says what a picture on a slide is for.

plans/character-appearances-plan.md says where every friend appears in every
lesson today and what to build next: the friend's reaction after each check,
Cosmo's debut on the two KS5 lessons, the friend on the exit card. Contract
rule 13 refuses a lesson whose friend does not arrive and hand over the
mission.

shared/schools-computing-pos.ts is the national curriculum for computing's
subject content, verbatim: 3 statements taught in full, 3 in progress with
the missing clause named (keeping personal information private at KS1,
search skills at KS2, making artefacts at KS3), 19 the school's computing
scheme. Every taught claim held to phrases checked on production (30 of 30)
and by scripts/check-computing-coverage.mjs in CI. /hub/computing-mapping
shows it.
## 20 September 2026 — every screen has to survive Larger Text

Justin, with Larger Text on on his own iPhone: "just checking that this needs
to work even when user changes text size on their phone." It does. It did not.

The root follows the iOS Dynamic Type dial on purpose (`shared/tokens.css`,
`font: -apple-system-body`), and that stays. What was never done is building
the layouts to survive it: the type is rem, the pill padding, fixed buttons and
`flexShrink: 0` chips are px, so text grows and containers do not.

Measured, not guessed: every dev and ref fixture rendered at phone width at
16px and at 40px root. **44 of 145 were clean at normal size and broken at
Larger Text.** Print sheets that are wide by design are not counted.

`scripts/check-larger-text.mjs` runs in the browser job and holds the known
list in `scripts/larger-text-baseline.json`, which only gets shorter: a screen
not on the list that breaks fails CI, and a screen on the list that is fixed
also fails until it is taken off. The first pass fixed 23, mostly the screens a
family touches daily: the road, the check in, the passport, the balance, the
stickers, the device tiles, the shop. 21 remain on the list.

The fix is always the same shape and never the same line: let the row wrap,
let the chip shrink, size a badge in em, drop a two column grid to one when
the words are wide. Never stop the text scaling.

## 20 September 2026 — the Larger Text list is empty

Justin: "Do 21." The remaining 21 screens on `scripts/larger-text-baseline.json`
are fixed, plus two the sharper guard then exposed, and the list is `{}`. Any screen that breaks at Larger Text from here
fails CI as a regression; nothing is grandfathered.

Two things worth knowing beyond the usual wrap and shrink fixes. First, the
CSS minifier folds `min(0.5625rem, 9px)` to `0.5625rem` because the two are
equal at a 16px root, so the Moment button's cap from PR 1129 never reached
the built stylesheet; the rem now goes through a `var()`, which cannot be
folded. Second, the guard now judges what the eye can see: an element's right
edge is cut down to every ancestor that clips, so a chip row that scrolls
sideways on purpose and a star sweep hidden inside a card no longer count.

## 20 September 2026 — the school card's door goes somewhere, and the phone switch is on the page

Justin, from his phone: "link to forwarding doesn't work and it should have how
to turn check in here when clicked and says not turned on."

Both were true. The card lives on /dashboard/school and its door linked to
/dashboard/school, the page it was already on, so a tap did nothing; it now
scrolls to the letterbox card further down (`LETTERBOX_ID`). And the phone
test's "tap Turn on check ins" named a button that only exists on Home, so
the card now carries the switch itself, through the shared `enablePush`, and
re-runs the test the moment it succeeds. Rule reaffirmed: never tell a parent
to tap something that is not on the screen in front of them.
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
