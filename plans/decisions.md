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
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-21 | 245 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

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
