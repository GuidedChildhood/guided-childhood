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

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 1 October 2026: the master plan, the content pack, the explainer template, the daily desk

- Justin asked for the full marketing plan built on everything learned, with
  content ready for LinkedIn (parents and schools), Facebook and Instagram
  (the family account switch told by Justin alone, Natalia off camera, and
  The Social Billboard), YouTube for the safe playlist, the attached draw
  on animation as a template agent, three transcripts folded in, and a daily
  system that tells him what to post and film.
- Three transcripts weighed first (`plans/2026-10-01-three-transcripts-weighed.md`):
  three changes adopted (LinkedIn at 10:00, the enemy is the cliff edge, the
  profile as a landing page); fake accounts, bought followers, planted
  comments and mass synthetic UGC declined.
- The master plan is `plans/2026-10-01-marketing-master-plan.md`, the two
  week content pack `content/packs/2026-10-01-launch-content-pack/`, both
  mirrored as Google Docs in 00 CONTROL ROOM.
- The explainer video skill (`.claude/skills/explainer-video`) and template
  (`videos/_templates/explainer-draw`): a brief in, a cream and ink draw on
  film out, landscape and vertical. First film built and checked:
  `videos/2026-10-01-five-oclock-fight`.
- A local scheduled task, daily-content-desk, runs weekdays at 06:30 and
  writes "Today's content" into the Control Room. It never posts.

## 2 October 2026: parents can talk to DiGi, and DiGi can read aloud, both optional

- Justin asked for both, "so not annoying". A microphone in DiGi's chat puts the spoken words in the box to check before sending; read aloud is off until turned on, speaks only the one line worth hearing, follows a spoken question, and stops on any tap. Parents only, words never audio (the browser does the listening). check-digi-voice holds it. Plan: plans/2026-10-02-digi-voice-plan.md.
- Justin said yes. The four lessons went in with a backup first (school_lessons_backup_358), each hash proved against its file (24, 24, 25, 25 slides), home codes written, and the ks5-20 sign off now reads thirty two. The table went from 32 to 36 and no other lesson moved. Recorded as 358_the_under_7_shelf.
- Still to come, when credits allow: a Pebble clip per lesson on the blank board rule.

## 1 October 2026: the founder context and the weekly image sheet

- Justin's founder biography and story rules (authenticity, GREEN/AMBER/RED)
  live at `content/brand-story/founder-context.md`, routed from CLAUDE.md for
  anything in his voice; the content engine, explainer skill and daily desk
  read it. One true scene when it fits the idea, never invented, never
  repeated; AMBER flagged for his yes. Private context stays out of the repo.
- A weekly Google Sheet in the Control Room, "Weekly content and image
  ideas", one row per post with the image or video idea, who makes it and any
  founder scene. The `weekly-content-sheet` task creates next week's every
  Sunday 18:00; the daily desk reads it as its brief. The one reason: Justin
  asked for the images to be decided a week ahead so filming happens once.

## 2 October 2026: the handover series is told by Justin alone

- Natalia is not on camera. The six post Inspired by Alma handover (5 to 16
  October) is rewritten in Justin's first person with read sheets, one
  Saturday filming session, the switch checklist and the AMBER lines held for
  his yes: `content/packs/2026-10-02-handover-justin-only/README.md`, Google
  Doc in the Control Room. It stays step 1 of the parents lane beside the
  LinkedIn founding 50 post; the reason is that the account's followers are the
  warmest audience the business has and the series costs nothing but an
  afternoon. Honest maths in section 1: a first proof, not the £4,000.

## 5 October 2026: two sessions, one Social Billboard feed

- The playlist builder session owns the Thursday Social Billboard post (the
  weekly Safe Watch announcement, written to Drive "SB Posts - FB and Insta").
  Every other Social Billboard post stays with the parent launch plan and the
  daily desk, which now read that folder so the sheet and the desk show one
  feed. Post 4 of the launch plan (what should we curate next) is dropped in
  favour of the Space announcement on 8 October, with its question kept as
  the closing line. The one reason: one Thursday, one post, no duplicate
  free offer in the same week.
## 1 October 2026: The Social Billboard playlist card and Instagram carousels (PR 1184)

- The weekly free playlist image is a template, not a one off:
  `tools/tsb-playlist-card/`. Higgsfield makes the sky with no text; the words
  are HTML in Montserrat, the live site font, rendered at 1200 x 630 and
  1080 x 1080. The accent is the site's own yellow so the post matches the
  page it lands on; the pink from the brief is kept as a variant.
- Ages are written "9 to 11", never with a dash, on The Social Billboard too.
- Six Instagram carousels for the TSB account, researched live against
  Duolingo, Good Inside, Headspace, Finch and Yoto and weighed through the
  feedback filter: `plans/2026-10-01-tsb-instagram-carousels.md`, mirrored
  in Drive, 02 The Social Billboard, Content Engine. Scene first, send to one
  parent, free offer on slide ten, eight to ten slides. Carousel one is
  rendered and ready.
- Declined: a mascot for TSB. DiGi belongs to Guided Childhood, a separate
  company; Justin's face does that job at launch. Declined: quote cards and
  a frightening statistic as a hook.
- Later the same day: competitor creative audit (Qustodio, Bark, Kidslox,
  Yoto, tonies, Moshi, YouTube Kids, the free video apps, the UK whitelist
  tools) plus the 2026 format evidence, in
  `plans/2026-10-01-tsb-creative-research-and-set.md`. Finding: the category
  sells fear or relief, nobody sells the session that ends by itself, and
  nobody offers a free playlist with no card. Plain text and the founder
  letter beat UGC, polish and animation (Motion, 578,750 ads). Seven statics
  built in `decks/statics-01-launch-set.json`. Parked: the Ofcom stat card
  (LinkedIn lane only) and the comparison table (landing page, not feed).
  Declined: fear hooks and five star review stacks.

## 2 October 2026: DiGi reminders, log a moment, worries tracked, hands free (PR 1186)

- Justin chose reminders at a set time, log it as a moment, a hands free switch, and worries told to DiGi tracked each day until sorted.
- New tools: `set_reminder` (UK clock time, cap five, migration 359 `digi_reminders`, sent by `/api/cron/digi-reminders` every five minutes, Home card when no push device, an hour late is missed not sent) and `log_moment` (exact moment card title or nothing, ticks today's Moment step).
- Worries: save_memory now runs before other tools, so a follow up booked in the same turn attaches to the worry just raised. "Tell DiGi what is hard right now" opens the chat.
- Hands free, not a wake word: a page cannot keep a microphone open all day and should not. Off on every page open, never stored, off after two quiet minutes or a hidden page. Guarded in check-digi-voice.

## 5 October 2026: the Social Billboard lane is blocked by the site, not by content

- Verified in a browser: all seven sign in and start free buttons on
  thesocialbillboard.com/safe-youtube-for-kids are literal REGISTER_URL and
  LOGIN_URL placeholders, seven footer links are "#", the parents transparency
  page is a 404 and the creators route shows the parents page. Source is not
  in this repo or on this Mac (Vite build behind nginx). Every Social
  Billboard post and email, both sessions, holds until fixed; the daily desk
  marks those slots BLOCKED. The one reason: a post today sends a parent to a
  404 from a child safety product.
