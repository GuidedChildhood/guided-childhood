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
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-11 | 41 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-10-08 · 8 October 2026: the two brains film is sequential (v5) · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: French and Spanish join, sealed behind their own code · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: one curriculum, two rooms; three decisions · `plans/decisions-archive/2026-10.md`
- 2026-10-11 · 11 October 2026: AI and SaaS advice, weighed · `plans/decisions-archive/2026-10.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 12 October 2026: the DiGi hero and Short 1, from real screens

Justin: "build hero n short now". The research panel (nine specialists, 330 coded Reddit posts, a Mumsnet sweep, a code mapper, three concepts, four judges) ranked the top problems: the switch off fight, the first phone, always the bad guy. The hero (46s) and Short 1 (30s) are built from the real product, filmed frame by frame from the ref-* pages with the fixture names swapped for an example family, and every DiGi reply labelled illustrative. The first launch film (PR 1220) showed three things the product does not do and should not be posted. Pack: `content/packs/2026-10-09-digi-shorts/`. Films: `videos/2026-10-09-digi-shorts/`.

## 12 October 2026: the extension marks reach the live decks (migration 369)

The 147 `extension: true` marks from 21 September (26 decks) were only ever in content/modules; the live rows carried none, so since PR 1236 every run sheet said nothing was marked to skip. Migration 369 writes them: one boolean per marked slide, guarded per deck on slide count and each marked slide's type and phase, proved to change nothing but that key. Generated by `scripts/gen-369.mjs`; dry run in Postgres passed, including seven tampered decks that abort. Applying it to production is Justin's call. Found in passing: 13 live decks also lack `teacher_notes.hard_questions` from the same day; not in this PR. PR 1240.

## 12 October 2026: every paper pack fits its paper

Thirteen of the 34 paper packs printed a sheet onto a second page, measured in real PDFs: the nine known since 9 October, plus four parent notes tipped over by the QR block, which every production lesson prints. Fixed by layout in the print kit, with no lesson words cut and the pupil register sizes untouched. Teacher sheet text goes from 12.5px to 12px (9pt). Box labels are set into the top rule on the teacher one pager and the parent note. The home code floats beside its words, and the friend on the start and exit cards floats beside the question at the same size. All 34 now print one page per sheet, including with a school's safeguarding lead typed in. CI holds it with no browser: check-print-kit compares each lesson's words with the room scripts/check-print-pack-fit.mjs measured, and any edit to the kit or the pack page asks for a new measurement. PR 1239.

## 12 October 2026: four lessons print their own tool (migration 370)

ks2-26, ks3-27, ks4-28 and ks4-29 held `teacher_notes.tool` as one sentence, so their bookmarks and parent note printed the reference lesson's three checks and the organiser printed an empty tool box. Each is now `{ heading, lines, strapline }`, written from the lesson's own slides, in content/modules and, by migration 370, the live rows (guarded on the exact sentence read from production, proved to change nothing else; dry run passed). The module contract now refuses a sentence tool, and the pages read it through `asTool` as a belt. All 34 packs re measured: one page per sheet. Justin said apply it: 370 applied to production on 12 October, the four live tools verified equal to the files, no sentence tool left in the table. PR 1243.

## 12 October 2026: the ending is agreed, not warned (migration 371)

The library told parents two opposite things: the newer scripts and DiGi's research bank say warned endings were followed by more upset (Hiniker 2016, ages 1 to 5) and that agreeing the ending first helps, while scripts 2, 103 and 1302 and moment cards 22 and 330 still said to give a two or five minute warning, one card calling it "consistently more effective". Justin said fix it. All five now agree the ending before the screen goes on; 9650, horizons.ts and agreement-clauses.ts stop overstating the study ("far better", "made it worse"); 9671 names the study's ages and says "let's". Every guard checked against the live rows before the PR. Lessons that teach a five minute warning (033, 076, 327) are curriculum, left for the term review.

## 12 October 2026: the films show the script deck, its sources, and the tracking to sorted

Justin asked for Dr Becky level scripts, useful and easy, the tracking until ticked off, and the science. Reviewed Good Inside's App Store screens (Mobbin carries none): one card per idea, a curved header band, a big headline naming the moment, short Know this and Try this. Our product already does this in the script deck ("Try as deck"), so no product change is needed; the first cut had filmed the long script page zoomed to giant text. The hero and Short 1 now film the deck, a Why it works card naming the study (with its ages) and the RCPCH, and a tracker rail that ticks Asked DiGi, The words, Checked in, Sorted. The film shows script 9671 as it reads after the content fix PR, so that ships first. Detail in videos/2026-10-09-digi-shorts/BRIEF.md and the PR.

## 12 October 2026: "Ready", the brand advert, and its series template (PR 1221)

- The hero is "Ready" (`videos/2026-10-12-ready`): John Lewis craft, one
  family from six to sixteen, the first gold star given back, Justin's line,
  the stage check. Rough cut on 312 credits of drafts with a guide score in
  code; the licensed track and the finals wait on Justin.
- Higgsfield's licensed music is TikTok's library, usable only inside a
  TikTok post, so it cannot score the film.
- The how it works story moves into a series: five worries from the
  audience research, one per episode, about forty seconds, built from one
  template (`videos/_templates/ready-series`, plan in
  `plans/2026-10-12-ready-series-plan.md`). Every phone in them is a real
  capture of the running app from the /dev and /ref pages, never a mock up.

## 12 October 2026: the film link, /v/<code> (migration 372)

The shorts panel's measurement gap: nothing counted a stage check start, so a film could only be judged on views. Justin approved a link per film. /v/<code> works like the school link (353): it counts the follow, sets a cookie and lands on the stage check; the first answer counts a start once per browser; the trial grant writes profiles.video_link. Counts only, no IP or account on an event. /dashboard/admin/videos shows followed, began, signed up, card on, paying. Seeded digi-hero and switch-off. Judge a film on starts and signups, never views.

## 12 October 2026: PR 2 of the lessons loop, the home code records coverage (migration 373)

Sync plan items B, D, G3 and G5 and plan v10's 2.1 and 2.2, built as PR 2. The plan's 367 was taken with 368 to 372 while the build was held, so it is 373. The home code now writes one `lesson_coverage` row (the class met it) and no completion; a code with no child is refused, and a code scanned before signing up rides a cookie through the starter pack. One stage map lives in `shared/stage-map.ts` and every copy derives from it: KS3 Explorer, KS4 Shaper, KS5 Independent, stamps Orbit, Nova, Cosmo; 18 rows' `passport_stage` move and the beat reads its page from the module id. All 34 tea questions teach ("Can you teach me"), with `listen_for` and `then_ask` under them; the six heavy lessons carry a private `say_this` instead; one label, Ask at tea, on every surface. `children.lessons_together` plays the together deck for any child with a Read it to me button in the device's British voice. The first two Foundation decks carry a grown up line per slide. Still to come from this PR: the two KS5 passport beats (PR 5, a slide), and the 1.8 live walkthrough has not run. Guard: check-lesson-path rule 12.

## 12 October 2026: the shorts re-cut after the marketer review

An expert marketer agent reviewed the hero and Short 1 from frame sheets; weighed with the feedback filter (plans/2026-10-12-shorts-marketer-review-weighed.md). Justin chose: the science beat leaves these two films and leads the early years film, where the 1 to 5 year old study fits (our own 9 October rule); the app's "not the open web" thinking line changes, "Earn more stars" stays; the hero opens on "I'm always the bad guy when the tablet goes off". Re-cut: hook at 2s, no "open web" line on screen, a push in on the Say this line, the timer centred and cut before "Earn more stars", one worry from asked to sorted with the rating label from the first tap, the rail below the platform headers, end cards out of the caption zone with each film's /v/ link. Hero 39s, Short 1 30s. Paid boost parked.

## 12 October 2026: guilt, not "bad guy"

Justin on the hero's opening line: "bad guy is not a good wording ... I feel guilty". The research agrees that guilt runs under all five top problems in parents' own words ("makes me feel so guilty"), met with tone and one next step, never blame. The hero's parent now types "Turning the tablet off ends in tears and I feel so guilty. What do I say?", DiGi's reply in both films opens "At nine, stopping is the hard part for every child, and feeling guilty about it is normal.", and "bad guy" is out of every caption.

## 12 October 2026: readable films, the series line, and the product-shorts skill

Justin: "moves a bit too quickly to take in", then the brand line every film must carry: the research backed, easy system for every digital worry, keeping children safe. The films now follow research 07's reading rule (hero 57.8s, Short 1 44.4s, a 36s TikTok cut). A SaaS growth review (no-go, go after one render) was weighed: fixed Short 1's reply, cropped a suggested question unsuitable for a nine year old, removed a 0.2s flash of "Earn more stars", added "One plan for screens, phones and AI." to every end card and the AI and social media tiles to the hero. The whole method is now `.claude/skills/product-shorts`, routed from CLAUDE.md. Posting plan with the phone playbook in content/packs/2026-10-09-digi-shorts/posting-plan.md.

## 13 October 2026: the Digital Health Report is not a service

Justin, asked where the founder story's CTA should point: "no digital health
report not a service at the moment." So nothing in our copy sells it. The
founder story canon drives to `/starter-pack` and now rules the report out of
copy entirely until he says it is back, and the kids-research product block no
longer carries £9.99 and £29.99 as live prices.

Still pointing at it and needing his call, because it is a visible marketing
change rather than a story fix: the homepage footer ("Digital Health Check"),
the `/join` footer ("Health Check"), the `/ban-workarounds` footer ("Digital
wellbeing"), the sitemap entry, and `/digitalwellbeing` itself, which is a live
page whose buttons go to a paid signup. Separately, the user level
`linkedin-comment-replies` skill still states the report is live and tells
Claude to lead with the £9.99 report on first customer interest. That file lives
in Justin's own skills, not this repo, so he has to change it there.

## 13 October 2026: migration 360 was never applied, so the whole referral feature had no tables

The sweep of 348 to 372 found one real gap. 360 give five get five was
merged on 4 October and never run: neither `referral_codes` nor `referrals`
existed on the live database, while thirteen files of app code already read
them, including `/r/[code]`, the refer page, the admin page and the daily
cron. Checkout was the one safe path, because it wraps the referral lookup
in a catch and never blocks a payment, so no parent was stopped from
joining; the £5 was simply never offered and no referral was ever recorded.

Applied and verified: both tables with their columns, RLS on, both policies,
both indexes, and the real access paths exercised rather than read off the
grant list (anon refused outright, authenticated with no uid sees nothing,
and the only columns a parent may update are `paypal_email` and
`updated_at`). 348 was also applied, as a confirmed no op: its grant list
matches the live catalogue table for table.

367 and 368 are skipped numbers, not missing work. 373 landed on main during
this sweep and is handled in the entry below. PR 1265.

## 13 October 2026: 373 arrives in two halves, because 70 KB will not go through the tool

Justin: "apply missing migrations". 360 was the gap (above). 373 merged
while that was in flight, so it was swept too, and it will not go through
the Supabase tool in one piece: the call times out at 60 seconds, twice,
and 373 is 70 KB in a single guarded transaction. scripts/module-to-chunks.mjs
already says a hand carried paste that size cannot be trusted; this is the
same wall, hit from the other side.

So its two schema changes are applied and verified (`lesson_coverage` with
RLS, its policy, both indexes, no anon grant, and `children.lessons_together`
boolean not null default false across all 47 children). Its content half,
34 parent notes, 18 passport stages and 40 together_prompt lines, is NOT
applied and is still outstanding.

That split is safe to leave for now, which was checked rather than assumed:
every reader of the new content is optional (`parent.listen_for &&`,
`passport_stage ?? null`, `together_prompt?`), and nothing renders
together_prompt yet, so the absent content is absent rather than wrong.

Worth recording honestly: the timed out call left `lesson_coverage` created
with RLS off and the old default anon grant for about two minutes before the
next statement closed it. The table was empty throughout and anon is now
refused outright, but a create table and its RLS belong in the same
statement, and splitting them is what opened the window.

The content half needs the lane that generated it (scripts/gen-373.mjs) or a
chunked variant. PR 1265.

## 13 October 2026: migrations 371 and 372 applied, and the shorts go out on the family account

Justin said apply them. 371 (the ending is agreed, not warned) applied to production; all seven edited rows read back correctly. 372 (the film link) applied; a live follow of guidedchildhood.com/v/switch-off landed on the stage check, set the cookie and logged one follow (that first row is the test). Short 1 is the family account's Service Friday post, service 1, the five o'clock fight, so its Instagram and Facebook captions now follow the family format in content/brand-story/weekly-rhythm.md: the family's own moment ("Five o'clock in our house used to be a fight", the canon supports the fight and the five o'clock handover, not a duration), five numbered lines ending on a consequence, a closing question.

## 13 October 2026: the hard questions reach the live decks (migration 374)

The 52 `teacher_notes.hard_questions` written on 21 September were only in content/modules for 13 decks (eyfs-01, ks1-02, ks1-03, ks2-04, ks2-05, ks2-06, ks2-08, ks2-09, ks3-13, ks4-15, ks4-19, ks5-20, ks5-21); a read of production found that key the only difference. Migration 374 adds it with jsonb_set, guarded per deck on slide count and an absent key, proved to change nothing else. Generated by `scripts/gen-374.mjs`, which also prints the read only before and after check. Independent of 373. Dry run passed, including four refusals. Applying it is Justin's call. PR 1267.

## 13 October 2026: the six heavy lessons wait for a grown up

Justin said yes (sync plan C). When a child starts one of the six heaviest lessons alone, it opens 48 hours later or the moment the parent taps Ready, and the parent gets the note first: a push with no subject on the lock screen and an email, both landing on `/dashboard/lessons/heads-up`, built from the deck's own parent text. A lesson the parent sends, nudges or opens together is theirs already and opens at once. No migration: the mission's `sent_at` is set ahead. Guard: check-lesson-path section 14. Detail in the PR.

## 13 October 2026: the child's home, simpler, and nothing written for the parent reaches it

Teo's home showed a DiGi answer written for Justin (markdown, a dashboard link). Send to their phone now sits only under the child's version, and a note pointing into the dashboard is refused and hidden (PR 1263). After a four agent review, each kid tab is its own page, red badges count only what a grown up sent, a "not done yet" job is never counted done and reaches the child kindly (PR 1268), and the jobs step shows its stars (PR 1264). Bigger reshuffles that reverse earlier choices wait for Justin: plans/2026-10-13-kid-home-simplify-plan.md.

Justin then chose "one streak, not four": the flame bar with the next Friend is the only streak on the child's home; the five a day's days in a row, the balance card's day streak and the greeting's full days count are gone (PR 1264).

## 13 October 2026: every post in Drive gets a Claude review, and the queue restarts at GDC-018

Justin: "lets tidy up and start from gdc 18 and lets always apply a calude
review over piosts put in drive."

The rule is now `.claude/skills/content-engine/drive-post-review.md`, routed from
CLAUDE.md and wired into research-radar Phase 5 so a pack is reviewed before it
reaches Drive rather than after. Ten checks, every one of them a finding the GDC
queue review actually produced: the hook, the repeated founder line, hedging,
the proof path, the first comment, the claims, the reader, the clock, the
mechanics, the filing. READY in a Drive document now means nobody has checked it
yet.

The Drive tidy: 24 files trashed (14 empty placeholders and 10 byte identical
duplicates), 11 superseded or parked sources moved into an archive subfolder
named with what replaced them, the four posted ones renamed to carry POSTED, and
the folder down from 18 items to 9. Numbers 018 to 024 now hold the seven
rewrites, in posting order, so the number is the order.

Two documents survive unreviewed and are marked NEEDS REVIEW in the live folder:
the screen time umbrella review, and "Europe has written the staircase into
law". Both have real content, neither has been through the review above.
PR 1262.

## 13 October 2026: live DiGi agrees the ending, and the bedroom rule is a pathway (migration 375)

The Ready series eval run found live DiGi still advising "Give a warning... Five minutes before" for bedtime TV, after 371 took that advice out of the library. Cause: the prompt's own reflective question example was a five minute warning. The prompt now has an ENDING A SCREEN rule (agree it before the screen goes on, never a warning or countdown), and 375 corrects three expert_knowledge rows that said the opposite (Child Mind Institute, the NHS sleep leaflet, Hiniker overstated). The same run failed the phone question for "no exceptions": the voice file used "The bedroom rule is not negotiable" as its model sentence. Now the bedroom rule is given as a calibrated pathway. ND-01's visual timer stays: a timer the child can see, set together, is an agreed ending, and the study was of under sixes in general. Two permanent eval cases guard both. Applying 375 is Justin's call. PR 1275.

## 13 October 2026: the starter pack and the welcome agree the ending too

Migration 371 took the warned ending out of the scripts and moment cards; the
public starter pack (ages 4 to 7 and 8 to 10 conversation guides) and the
welcome walkthrough (the scripts card and DiGi's pathway card) still told
parents to give a five or two minute warning. All now say the ending is agreed
before the screen goes on. What the grep still finds in product code is the
copy that refuses a warning, plus DiGi's example follow up in lib/digi/system.ts,
which PR 1275 replaces. Seed files and research briefings are left as the
historical record.

## 13 October 2026: the Digital Health Report stays linked, and GDC-025 is live

Justin, on the four open items: keep the live Digital Health Report links
("keep it there as dos work"), tell him what the comment replies skill should
say, and run the new review over the two unreviewed documents.

**Correction.** The canon had said the report is "not a service at the moment"
and ruled it out of copy entirely. That went further than Justin did. The tool
works and the links stay. The rule is about which product the founder story
sells, not about whether the report exists. Corrected in the canon, the audit,
drive-post-review and kids-research.

**The comment replies skill** lives in Justin's own claude.ai skills, so nothing
here can fix it. `content/brand-story/linkedin-comment-replies-product-facts.md`
is the replacement block to paste: lead with the free stage check, the real
parent prices, and never quote a figure for the report.

**The two unreviewed documents.** The 2.8 million children screen time post
carried "done" on its first line and had already been posted, so it is
relabelled POSTED GDC-022 and needs nothing. The EU KIDS Act post is the find:
its consultation closes 26 November, so it is the one genuinely live post left
in that batch. Rewritten as GDC-025, opening on what a twelve year old should be
able to do rather than on "for five years", with the UK under 16 restrictions as
the bridge and the consultation deadline moved to the close where a head can act
on it.

**Still not possible from a session:** the Monday radar Routine cannot store the
Google Drive connector, because create_trigger rejects the connectors parameter
for this organisation. Retried today and refused again. Only Justin can attach
it, from the claude.ai routines page.

## 13 October 2026: GDC-022 was already spent, and the two parked posts are written

Two things, one of them a correction to this morning.

**The collision.** I renumbered the queue into 018 to 024 believing 022 and 023
were empty placeholders. 022 was not: the 2.8 million children screen time post
carries "done" on its first line and went out in September. I found that an hour
later, when the new review rule made me read the document rather than its file
size. "Two children, same game" is now GDC-036, the first number nothing has
ever used. A gap in a sequence costs nothing; two posts sharing a number costs
the thing the tidy up bought.

Still open for Justin: every number from 018 to 035 is now posted, archived or
reserved, so one clean run would mean moving the whole queue to 036 onward. That
is renumbering his filing twice in a day and it is his call.

**The two parked posts, written because he asked.** GDC-037 "How would you test
readiness", from the parked GDC-001, with the Californian bill stripped out. It
is the only post in the queue with no clock on it, and it admits we have no
outcome evidence that finishing a stage changes anything. GDC-038 "Same app,
different rules", from the parked GDC-025. I had parked it as a duplicate of
GDC-036 and that was wrong on a closer read: 036 is capability inside one
product, 038 is a boundary running through the middle of a single app.

**The radar Routine still cannot hold Google Drive from here.** `create_trigger`
refuses the connectors parameter for this organisation and `update_trigger` has
no connectors parameter at all. His daily health sweep Routine does hold
Google-Drive, so the capability exists on the account; it has to be attached in
the claude.ai Routines UI. PR 1274.

## 13 October 2026: when the five land, the Planet Friends moonwalk on

Justin, with the rocket on Teo's phone: each Planet Friend moonwalks on one at a time with a tip for earning stars (all five tips are true of the app). It plays after the day screen every time the five land; on a Friend day the earned Friend's arrival card follows without the rocket flight. The arrival card's text and button had been wiped by clearProps 'all' and are fixed; the guard now bans it in components/kid.

## 13 October 2026: screen break ideas, and Add your own on every step sheet

Justin, from Teo's phone: the Screen break together ideas are Play football, Puzzles, Draw, Read, and add one of your own. Every step sheet with ideas now ends in + Add your own; what the child types travels to the grown up with the tick like a tapped idea (notes keep 80 characters).

## 13 October 2026: a child's lesson count is that child's own

Teo's mission said 9 of 10 lessons: 0 passed himself, 1 star lesson in his app, and 8 parent side rows with no child picked, which every per child count added in. Justin chose "only Teo's own": a child's lessons are their own passes plus any a grown up passed with that child picked; a household row counts for nobody's badge. One rule, lib/lessons/child-scope, read by the sticker book, the planets, the stage stamp and the journey. Teo now reads 1 of 10.

## 13 October 2026: five free Happy News printables, The Planet Post first

Justin approved the plan (plans/2026-10-13-free-printables-lead-magnets-plan.md) with every recommended option: The Planet Post, Screen Time Tickets, the Seven Night Screen Reset, the Five Screen Fights cards, the Bored Jar, in that order; preview free, PDF by email. Issue 1 of The Planet Post ships: four pages drawn in code (components/printables/news), the words as data (lib/printables/free), rendered by scripts/render-free-printables.mjs to A4, Letter, two ink savers and an A5 booklet with Nunito embedded; /free and /free/planet-post with the email gate; the email names multi page printables honestly and lists every file. Guard: check-free-printables. PR 1284.

## 13 October 2026: the child's home, the day first and linked to the grown up

Justin approved all four: the greeting and the five a day are one card at the top; one reward card (Use my time, balance, timer) that is never locked, with a line saying what finishing the five adds; reminders asked only once a day has been finished; and the parent link, "2 waiting for Mum or Dad to say yes" plus a Since you last looked card for yeses that landed while the child was away. The school diary is one slim line. "Mum or Dad" until the account says what the child calls the parent (that setting comes with the parent side PR). Guard: check-kid-home-simple. PR 1283.

## 13 October 2026: the grown up's side of the link

Settings asks "What does Teo call you?" (migration 376, children.calls_grown_up); the child's home, the yes pushes and every note to the child use it, "Mum or Dad" until set. Remind shows "Teo read it ✓" (kid_nudges.seen). The bell carries screen time asks with Say yes in place, and the child's finished days and passed lessons with Send a well done, which lands on the child's home as a note (kind well_done, one per win). Every new column is read softly. PR 1285.

## 13 October 2026: The Guided Planet, the newspaper engine and Issue 001

Justin asked for a system that makes every edition of a monthly 12 page illustrated paper for 7 to 12s ("The good side of screens"), with him approving twice. Built in publishing/: the issue is one JSON file, nine templates, Chromium print (fixed page boxes, not Paged.js, so every frame is measured), characters composited from the approved files and hash checked (Higgsfield paints backdrops only, behind a per issue credit budget), research verified by our own code against each source page, approvals bound to the content and PDF by hash, publishing idempotent. Issue 001 renders clean; every printed claim went through an adversarial citation check (7 wordings corrected). Issue 002 is a sample made from words alone. Migration 377 written, not applied. Dashboard /dashboard/admin/planet. PR 1287.
## 13 October 2026: 373's content half carried in pieces, and proved before it was written

Justin: "APPLY ALL NEEDED MIGRATIONS". The content half would not go through
the tool in one 70 KB transaction, so it went the way
scripts/module-to-chunks.mjs already says to carry curriculum prose: cut into
pieces of a few kilobytes, which is a size that can be carried accurately.

The method, and the part worth keeping. Two staging tables in `schools` took
the 34 parent notes in seven pieces and the 40 together lines in two. Nothing
touched a live lesson until the staging was **proved against
content/modules**: 34 of 34 notes byte identical, and the 40 lines byte
identical as one digest. That ordering is the whole point. A slip in a hand
carried paste is normally written and then checked against the same slip; here
the repo was the authority and the check came before the write.

Then 373's own guards and both updates ran as one transaction reading from
staging: the preconditions on every row, the slide type check, the two
updates, and all five proofs against the backup. Every guard passed.

Verified after: 34 notes carry listen_for and then_ask, the six that should
carry say_this do, 9 KS3 rows read explorer and 7 KS4 read shaper, 40
together lines are in place, and every module with a file in content/modules
is byte identical to it on slides, parent_note and passport_stage. The three
standalone lessons have no file there and were untouched.

Left behind: schools.stage_373_notes and schools.stage_373_lines. The drop
timed out three times and they are inert (RLS on, no grant to anon or
authenticated), so they are rubbish to sweep rather than a risk. PR 1265.

## 13 October 2026: 375 and 374 applied, and 377 cannot be

375 first, because it was the one that mattered to a parent today. Three rows
of expert_knowledge still told DiGi to warn before a screen ends, which 371
had already established is the wrong advice (the one close study found warned
endings were followed by more upset, Hiniker et al CHI 2016). DiGi reads that
table unguarded, so retrieval could hand it the opposite of the fixed prompt.
Three guarded updates, one per statement to stay inside the tool's minute,
then 375's own check: zero active findings still advise a warning.

374 carried the 52 hard questions onto the 13 decks that were missing them,
by the method 373 proved. A staging table in `schools` took the 13 rows in
four pieces, and nothing touched a live deck until staging was proved against
content/modules: all 13 slide counts and all 13 question digests identical.
Then 374's guards, its update and its proof ran as **one statement**, so a
timeout could only ever roll the whole thing back. Its proof passed, and the
live whole set digest now equals the repo's, 8acf4c52. Backup in
schools.school_lessons_backup_374, RLS on, anon refused on the real path.

Both are in the migration ledger now, so the next sweep sees them.

377 is NOT applied and must not be. It creates public.planet_events as the
newspaper's audit trail, but migration 252 already made that table the kids'
Guided Planet ledger, with a foreign key to children and a different shape
entirely. As written 377 aborts on its own index (no `issue` column), so
nothing is corrupted; the danger is anyone who clears that error, because the
next statement attaches an append only trigger to the children's ledger, for
ever, service role included. publishing/engine/store-supabase.ts writes the
newspaper shape to the same name, so that half is broken either way. The fix
is a rename, and it belongs to the lane that wrote it (PR 1287).

Left behind: schools.stage_374_hq, plus 373's two, inert for the same reason.

## 13 October 2026: a correction to what the 373 staging tables were granted

The 373 entry above said the two leftover staging tables had no grant to anon
or authenticated. That was right about anon and wrong about authenticated,
which still held select on both. RLS was on with no policies, so a signed in
user got zero rows rather than data, and nothing was exposed. The grant should
not have been there at all, and it is revoked now: all three staging tables
refuse authenticated on the real access path, tested by setting the role
rather than by reading a privilege table.

Worth keeping, because it is the same shape as the 373 slip it corrects. A
fresh table in this project inherits a grant, so a new table is only as closed
as the statement that made it. 374's staging table was created with its revoke
in the same statement and was closed from the first instant.

## 13 October 2026: 377 goes back to the planet lane, not fixed here

Justin's call, asked and answered today: leave 377 unapplied and let whoever
owns the Guided Planet engine rename the table. So this is NOT an outstanding
migration for the next sweep to pick up, and nobody should apply it as it
stands. The newspaper dashboard has no audit trail until that lane acts.

What they need to change: 377 creates public.planet_events, which migration
252 already made the kids' ledger (foreign key to children, different shape).
Rename 377's table, its index, its trigger and its function, and the two
calls in publishing/engine/store-supabase.ts. The danger to avoid is clearing
377's index error without the rename, because the statement after it attaches
an append only trigger to the children's ledger for ever. Detail in PR 1289.
## 13 October 2026: The Guided Planet wears boho Happy News, and the audience is written down

Justin: be clear on the audience; more Happy News icons; lettering; the family account (formerly Inspired by Alma) loved the look of the Happy News printables, so the free downloads need boho, super attractive appeal. Decided: the reader is 7 to 12 (heart 7 to 11), the chooser is the parent on the family account, the passer on is the teacher (publishing/README.md). A boho theme, on for every issue: sand, clay, mustard, sage and rose; Fraunces Soft lettering with Caveat handwriting (OFL); the app's own Happy News icons and marks, not copies; the masthead drawn from the font so the PDF text stays clean. Reverses, for printables only, the 5 October retirement of Happy News as a social reference. Every check still passes.
## 13 October 2026: the review board, eleven lenses scored every Friday

Justin asked for agents that check the platform weekly on ten questions until each is ten out of ten, with a dashboard and an alert at every session that asks him whether his tasks are done. Ten lens agents and a chief of staff (`.claude/agents/review-*`) score out of ten; a skeptic must agree to any nine or ten, and a lens closes only after two weeks at ten. Every gap passes the feedback filter before it becomes a task. A SessionStart hook prints the alert and asks about each of Justin's tasks at most once a day; answers are one file each in `plans/review-board/answers/` so parallel sessions never collide. Routine: Friday 06:49 London. First run: 0 of 11 at ten, scores 6 to 8, 33 tasks. PR 1288.

## 14 October 2026: competitor sightings logged, and a first phone ad drafted

Justin saw seven parenting and family app ads on Instagram and asked if he should worry. None does our core loop; Kairoo (screen agreement and bedtime reminders) is the closest and takes the job off the parent, the opposite of commitment 2. All seven are logged in `briefings/notes/competitor-sightings.md`, which the competitor watch lens now reads. No ad named the first phone, so an ad that opens on it was drafted (three cards plus captions, organic first per the money rule). A second sweep the same day added Balance Phone (a phone maker now running our readiness hook), Qustodio (now leading on the battle) and Nuet (the plain voice; it overlaps our school letterbox), with seven campaign lessons in the same file: `content/packs/2026-10-14-first-phone-ad/`. Nothing posted.
## 13 October 2026: 377's grants are fixed, its name collision is not

The planet lane answered the guard in PR 1290 and chose well: the grants went
to service_role, not to authenticated. That matters, because the guard's own
printed suggestion was `grant select, insert, update, delete on
public.planet_events to authenticated`, and public.planet_events is the kids'
ledger from 252. Pasting the suggestion would have handed signed in users read
and write on a table of children's events.

So `npm run check-migration-grants` is green again and the repo is unblocked.
377 still cannot be applied. The guard checks that a new public table has a
grant and RLS; it cannot see that the name is already taken. 377 still creates
public.planet_events, so a run still stops at its own index for want of an
`issue` column, and it now also asks for `public.planet_events_id_seq`, which
does not exist because the kids' table keys on a uuid.

The rename is still the outstanding piece: the table, its index, its trigger,
its function, the sequence grant, and the two calls in
publishing/engine/store-supabase.ts. A green guard is not a green light here.

## 14 October 2026: reels story bank from Family IT Guy's parent questions, not his content

Justin asked for agents to scrape family_it_guy for our reels. We did not scrape
(Instagram blocked, terms, his copyright, his fear engine fails the hidden
thread). Two agents catalogued his public topics; each became the parent
question underneath, answered our way: 24 silent UGC stories, each with a real
app proof path and the stage check at the end. The gap: he says "add more as
they show they are ready" and never says what ready looks like.
`content/packs/2026-10-14-reels-story-bank/`. PR 1293.

## 14 October 2026: Happy News design system in Claude Design; printables start from it

After a design critique of The Planet Post canvas (friends band, bigger lead
text and stars, clearer answers), Justin said go on a design system. "Guided
Childhood Happy News" now lives in Claude Design
(https://claude.ai/artifact/LgLM8FhZ63cKbvkYZT6BWT): our tokens, Nunito and
IBM Plex Mono, five components (ChunkyButton, Sticker, Burst, Ribbon,
FriendPlate) and the approved DiGi and Planet Friends art as uploads, never
regenerated. Every next printable canvas (Screen Time Tickets first) starts
from it. It is a copy, not synced: when shared/tokens.css changes, update it.
