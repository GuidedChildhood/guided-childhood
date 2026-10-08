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
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-30 | 297 |
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-06 | 17 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-09-23 · 23 September 2026: daily health sweep, one duplicate index dropped · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026 — The safeguarding crosswalk is open, because a DSL could not see it · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026 — The LinkedIn Featured banner is built, not generated · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026 — A launch post opens on the buyer, not on the founder · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: the free taster gets its evidence, and two claims are corrected · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: source notes are shown, not hidden behind a badge · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: a DSL can make the crosswalk her school's own · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: evidence for the 8 flagged lessons, and what it waits on · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: the parent track asks one thing at a time, and says what parents want · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the hero names the stage check, and says what a parent gets · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: outside advice is weighed before it is acted on · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: three flagged lessons get evidence, and say only what their sources say · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: Simon Squibb's ideas weighed, and a KS3 module to follow the checks · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the Squibb lesson stands alone, outside the scheme · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: every page checks who you are without a trip to the auth server · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: DiGi stays at medium effort; the wait explains more · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the standalone lesson is built, and opens free at its own link · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: DiGi's typing box is always on screen, and the page is quieter · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the Devices step ticks on the devices, and "All clear" says what · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: Start is the first thing on the parent's timer card · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the child's Print it bar sits on top of the tabs · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the child's home runs the five a day first · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the standalone lesson's migration is 349, and 350 is next · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the parent's ten minutes are confirmed, Duolingo style · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: trial emails on the trial clock, trial stays four days · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the school link, before any paid school pass · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: a second standalone lesson, on being an entrepreneur · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the first check in says getting started, and a calendar corner · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: school emails were never read past the subject line · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: homework help, hints not answers, no chat · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: a reminder for a child with no phone says so · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the pathway build reveals line by line on every phone · `plans/decisions-archive/2026-09.md`
- 2026-09-26 · 26 September 2026: three flagged lessons now say what their sources say · `plans/decisions-archive/2026-09.md`
- 2026-09-26 · 26 September 2026: the second standalone lesson, Could you be an entrepreneur? · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: no green from last week, no minutes not spent · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: after a pitch, another idea or back to the day · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: Moments to resolve is its own page, with DiGi and scripts on each · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: the third standalone lesson, Should people wear smart glasses? · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: a video system from Nate Herk's method, weighed first · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: every print is branded; the script prints as a fridge card · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: lessons, the child learns the school version and the parent closes it · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: four new under 7 lessons, the shelf goes from three to seven · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: the launch plan, three lanes, one number, day by day · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: the Control Room, one page that runs the marketing · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: migration 358 is live, the under 7 shelf is seven lessons · `plans/decisions-archive/2026-09.md`
- 2026-10-01 · 1 October 2026: the master plan, the content pack, the explainer template, the daily desk · `plans/decisions-archive/2026-10.md`
- 2026-10-01 · 1 October 2026: the founder context and the weekly image sheet · `plans/decisions-archive/2026-10.md`
- 2026-10-01 · 1 October 2026: The Social Billboard playlist card and Instagram carousels (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: parents can talk to DiGi, and DiGi can read aloud, both optional · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: the handover series is told by Justin alone · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: why the explainer looked basic, and the DiGi brain film (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: DiGi reminders, log a moment, worries tracked, hands free (PR 1186) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: migration 359 live, LinkedIn pack, PRs 1187 and 1188 unblocked · `plans/decisions-archive/2026-10.md`
- 2026-10-04 · 4 October 2026: Give £5, get £5 built for Guided Childhood (PR 1190, migration 360) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: two sessions, one Social Billboard feed · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: the Social Billboard lane is blocked by the site, not by content · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: one control document for the Social Billboard parent launch (PR 1192) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: Space playlist approved; the review behind it becomes a post (PR 1192) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: one social visual system, the real assets win · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: the six formats built, and the Sunday batch · `plans/decisions-archive/2026-10.md`
- 2026-10-06 · 6 October 2026: the free pilot email campaign, Wessex first, then 15 miles · `plans/decisions-archive/2026-10.md`
- 2026-10-06 · 6 October 2026: Social Billboard cards use black, white and yellow only · `plans/decisions-archive/2026-10.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 7 October 2026: Two brains, one clock has sound and 1080p clips (PR 1184)

- The child's brain film got an original score and five placed effects,
  declared in `videos/2026-10-06-two-brains/beats.json` and written by the
  build. No trending sound: no TikTok account is connected, trending audio is
  a licence problem off TikTok, and original beats reposted. Add one inside
  TikTok at publish time if wanted.
- Six Seedance clips finalised at 1080p (432 credits). The readability rule
  from 6 October stays: the build refuses long cards and sets the hold from
  the word count.
- Later on 7 October: Justin asked for more cinematic music and the Nate Herk
  editing treatment. Adopted in our palette: punch zooms, translucent
  highlight shapes (coral on the feed side, butter on DiGi's, never pure
  red) with pointers, marker swipes on the key phrase, clock pops, a whoosh
  on every time jump, a new trailer style score. All per beat in
  `beats.json`. The gentler score is kept as an alternative file.

## 7 October 2026: every script Justin has to record, as read cards

- A sweep of the repo and Drive found 29 spoken pieces written for Justin
  since July, none yet filmed. They are now two printable card decks in
  `content/read-cards/` (one idea per card, four to a page, setup card per
  piece), built by `tools/read-cards`. The Penny video uses the 30 September
  text, which replaced the 29 September cards. The one reason: Justin asked
  for the scripts in note sized chunks he can read one at a time, so each
  clip is one card and the cut is mechanical.

## 7 October 2026: the check in rates on faces, one outcome per tap, two fives still rest a worry

Justin: "Happy face icons, easy messaging, flows super easy ... Tell the user exactly what happens." Five faces replace the stars, because gold stars are the child's currency; the band word sits under each, last time is grey, today is butter. Everything the card says after a tap comes from `lib/concerns/outcome.ts`, unit tested row by row, after the sorted box was found showing on every first five for a month. The save lands in about a second with Change until it does, then the row stays open a read beat before it folds. Change never re opens a saved row: a second post the same day can mark the concern resolved on the server, and a resolved concern is never asked again. Two top scores in a row still rest a worry; the first five now says one more. PR 1200 and the faces PR that stacks on it.

## 7 October 2026, later: one five rests a worry, and the faces get the happy news finish

Justin: "lets just use one 5 in a row to keep simple?" and "super attractive to use, happy news styling as usual and slick." `SILVER_RUN` is 1. The weekly return is what makes one safe where it was not in September: a rested worry comes back after seven days to check it held, and a dip or a logged moment brings it back at once. The outcome function, the silver guard and the browser guard read the number rather than assume it. The faces now carry full ink lines on crayon paper, a catch light and the house ledge on the chosen one, and the sorted and tough tiles wear the card's edge and lift. In PR 1201.

## 7 October 2026: lesson videos are H.264 and ship with the schools site

Justin: the taster's "DiGi opens the lesson" would not play. Every video slide (11 in 6 lessons, both primary pilot lessons among them) was the generator's raw HEVC Main 10, which a school laptop without the hardware decoder shows as a dead play button. The clips are converted to H.264 High 8 bit and served from `schools/public/clips` by absolute address, because the kid app plays the same rows. `check-lesson-clips.mjs` in CI holds every video slide to an H.264 clip that exists, so the next generated clip is converted before it ships. Migration 361, applied after the deploy. PR 1205.

## 7 October 2026, afternoon: the momentum block rides inside the reviews

Justin: "every now and again email the successes to keep momentum ... top experts quotes and why our system works ... not too often ... support parents with some nuggets on guilt, shouting, losing it", then "yes plus future emails can echo this". Built as one block, not a new email, because the six day floor already enforces not too often. Under the family's own successes in the Sunday review and the monthly review: one finding from `expert_knowledge` with its named source (142 of 142 carry one), matched to the child's age and a live worry; one line on why it works from a seven line registry rotated by the week; one line for the parent linking to the repair script in the scripts table. `lib/email/momentum.ts`, held by `scripts/check-momentum-block.mjs`. The monthly review now says "went to going great" instead of "reached five stars".

## 7 October 2026, afternoon: DiGi asks "How did that go?" once, and a tough check in leaves one invite

Justin, with his own Notifications page: "Teo asked same thing 3 times ... it needs to show once", and "once check in done it flashes up ask digi but quickly flips to next child ... goes on alert notification? But only once." Then: "we don't want to miss those issues if dropped off after 2 weeks, also to ask DiGi it needs to know what the issue was." Read off the live tables: three conversations in August and September each booked a follow up, each became a card, none was answered, none expired. Now one unanswered card per child at a time, a due follow up waits behind it (and is let go after ten days waiting), an unanswered card expires after a fortnight and its thread goes onto the tracker as a worry first, and every card opens DiGi on the thread itself rather than its title. A one or two on the check in keeps its row open and plants one invite on Notifications and Home, keyed by the worry, cleared when the worry lifts. `lib/digi/followup-queue.ts`, held by `scripts/check-followup-once.mjs`.

## 7 October 2026, evening: the pilot review's fixes, and the sort turns its cards over

Justin: "run a review over lessons to make sure all works before going to pilot". Every slide of all 36 lessons played to the finish with no errors; three things would still stop a teacher mid lesson. The verdict sort now turns each card over after the class vote to show the marked answer and its why, which 25 of the 26 sort scripts already told the teacher to read; front and back share one cell, so the wall zoom never jumps mid card. The next card no longer flies in off the edge of the wall. PageDown and PageUp move the deck, so a presenter clicker works. After a wrong first pick, the options still to choose stay in view. Four sorts that opened empty (`items`, not `posts`) now play. On the wall a film now takes only the height the stage has: once the clips decoded (PR 1205) it drew 968px tall and hid its own play controls on ten slides, which is what turned main's wall fit check red. Migration 364 carries the words (362 went out with PR 1209). PR 1213.

## 7 October 2026, evening: the school price weighed against eLIM, decision with Justin

Justin's wife, a teacher: our school price may be too expensive, because Somerset primaries use eLIM. eLIM's ActiveBYTES (Somerset Council traded service) is "£197.40 for any UK Primary School", a plan per year group per half term, primary only. Our primary bands are £495 and £795 for 16 lessons. Weighed with the feedback filter: adapt, not cut every band. Recommended a founding schools rate (first 50 schools, any primary £195 a year, held while they stay, capped in code) with list prices kept and secondary unchanged, since eLIM sells nothing there. Nothing built until Justin answers. `plans/2026-10-07-school-price-against-elim.md`.

## 7 October 2026 — the two school day windows: per family pushes and a one tap moment card

Justin asked for the morning before school and the after school return to be researched "so we can build advice in and cleverly pre empt what happens ... as well as giving parents opportunity to log as a moment so we can track and provide best advice", then "Go with all recommendations." The briefing (nine lenses, 75 sources verified, PR 1208) put both moments somewhere other than the screen: sleep and food carry associations several times the size of technology use across 355,358 adolescents, three prompts a week beat five, and the after school fall apart is real but its popular label is a 2016 blog term whose mechanism failed replication. So: the 07:30 and 15:30 broadcasts become per family sends from each child's school start and home time (migration 363, null keeps the old times), one window per family by default, a Home card inside the window with Went fine, It happened and I tried it posting to the routes that already make a tap a moment, three scripts and twelve sourced findings, DiGi rails that lead with sleep and food and never name a syndrome. Guard `check-school-windows.mjs`, 46 checks. PR 1210, draft; 363 to apply.

## 8 October 2026: the founding schools rate

Justin: "yes on founding rate". The first 50 schools pay £195 a year for any primary, held while they stay; list prices and secondary are unchanged. Capped in code: band `founding_primary` is counted from `schools.invoice_requests` like the pilot's five, and the invoice action refuses it once the places are gone or the count cannot be read. `/pricing` shows the offer and places left, and the invoice form starts on it while it is open. `plans/2026-10-08-founding-schools-rate-plan.md`.

## 8 October 2026: the DiGi launch film

Justin: rewrite the QuickSend and Qbot launch brief for Guided Childhood with DiGi at the centre, then "build it". The brief sits in `videos/2026-10-08-digi-launch/BRIEF.md` and the film is built the house way (beats.json, build.mjs, GSAP, HyperFrames). Decided on the way: HyperFrames over Remotion, because four films already use it and DiGi's motion is GSAP in the product; the twelve client headshots became twelve memory cards, so no image generation and no faces; the music is composed in code because no catalogue was reachable, and the brief allows a local generate. Every screen is rebuilt from the real component, never a mock up. PR 1220.
