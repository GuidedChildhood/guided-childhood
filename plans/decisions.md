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
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-09 | 39 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-10-07 · 7 October 2026: Two brains, one clock has sound and 1080p clips (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: every script Justin has to record, as read cards · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: the check in rates on faces, one outcome per tap, two fives still rest a worry · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, later: one five rests a worry, and the faces get the happy news finish · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: lesson videos are H.264 and ship with the schools site · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: the momentum block rides inside the reviews · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: DiGi asks "How did that go?" once, and a tough check in leaves one invite · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the pilot review's fixes, and the sort turns its cards over · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the school price weighed against eLIM, decision with Justin · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026 — the two school day windows: per family pushes and a one tap moment card · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — migration 363 applied, the three school day PRs merged, 1213 unblocked · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the founding schools rate · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the DiGi launch film · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, afternoon: the DiGi launch film slows down and shows its brain · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, later: the launch film's researchers layer names four · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the school day post is bulletproofed before it ships; the hostile panel is standard · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails, rewritten to the research · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: DiGi in 3D, and a KS3 lesson on copyright · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails link to the proof, and the form comes after the yes · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the loop promise on every surface, the pilot drafts set right, the school day posts in their final shape · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: French and Spanish join, sealed behind their own code · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: one curriculum, two rooms; three decisions · `plans/decisions-archive/2026-10.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 12 October 2026: the DiGi hero and Short 1, from real screens

Justin: "build hero n short now". The research panel (nine specialists, 330 coded Reddit posts, a Mumsnet sweep, a code mapper, three concepts, four judges) ranked the top problems: the switch off fight, the first phone, always the bad guy. The hero (46s) and Short 1 (30s) are built from the real product, filmed frame by frame from the ref-* pages with the fixture names swapped for an example family, and every DiGi reply labelled illustrative. The first launch film (PR 1220) showed three things the product does not do and should not be posted. Pack: `content/packs/2026-10-09-digi-shorts/`. Films: `videos/2026-10-09-digi-shorts/`.

## 11 October 2026: AI and SaaS advice, weighed

Justin asked whether another AI's advice ("AI won't kill SaaS, it kills the reasons people pay for it") was good. Weighed with the feedback filter: sound in direction and mostly already built (DiGi's family memory and stage context, provenance, the stage pathway, schools as distribution). Two corrections: standard is £12.99, not £9.99; the Social Billboard's "checked against a published framework" waits for gate G3. Taken: for the Social Billboard the checking is the moat, so G3 comes first. Justin decided: the Social Billboard stays separate for now, linked by cross referral, and the direction stands. Gartner's $234B verified as enterprise exposure, background only; Bain's $100B not verified. `plans/2026-10-11-ai-and-saas-advice-weighed.md`.

## 12 October 2026: the extension marks reach the live decks (migration 369)

The 147 `extension: true` marks from 21 September (26 decks) were only ever in content/modules; the live rows carried none, so since PR 1236 every run sheet said nothing was marked to skip. Migration 369 writes them: one boolean per marked slide, guarded per deck on slide count and each marked slide's type and phase, proved to change nothing but that key. Generated by `scripts/gen-369.mjs`; dry run in Postgres passed, including seven tampered decks that abort. Applying it to production is Justin's call. Found in passing: 13 live decks also lack `teacher_notes.hard_questions` from the same day; not in this PR. PR 1240.
## 12 October 2026: every paper pack fits its paper

Thirteen of the 34 paper packs printed a sheet onto a second page, measured in real PDFs: the nine known since 9 October, plus four parent notes tipped over by the QR block, which every production lesson prints. Fixed by layout in the print kit, with no lesson words cut and the pupil register sizes untouched. Teacher sheet text goes from 12.5px to 12px (9pt). Box labels are set into the top rule on the teacher one pager and the parent note. The home code floats beside its words, and the friend on the start and exit cards floats beside the question at the same size. All 34 now print one page per sheet, including with a school's safeguarding lead typed in. CI holds it with no browser: check-print-kit compares each lesson's words with the room scripts/check-print-pack-fit.mjs measured, and any edit to the kit or the pack page asks for a new measurement. PR 1239.
## 12 October 2026: four lessons print their own tool (migration 370)

ks2-26, ks3-27, ks4-28 and ks4-29 held `teacher_notes.tool` as one sentence, so their bookmarks and parent note printed the reference lesson's three checks and the organiser printed an empty tool box. Each is now `{ heading, lines, strapline }`, written from the lesson's own slides, in content/modules and, by migration 370, the live rows (guarded on the exact sentence read from production, proved to change nothing else; dry run passed). The module contract now refuses a sentence tool, and the pages read it through `asTool` as a belt. All 34 packs re measured: one page per sheet. Justin said apply it: 370 applied to production on 12 October, the four live tools verified equal to the files, no sentence tool left in the table. PR 1243.

## 8 October 2026: the two brains film is sequential (v5)

8 October, afternoon: the two brains film is sequential (v5). The split screen with two text streams was the stacked case the research warns against; the best films run problem, turn, solution. Same clock, her brain first, the question as the hinge, DiGi on the same minutes, one side by side at the morning. Glass text over a scrim, never a solid box. Kill stale headless Chromium before any HyperFrames check or render.
