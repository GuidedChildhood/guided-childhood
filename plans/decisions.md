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
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-19 | 119 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-10-12 · 12 October 2026: the DiGi hero and Short 1, from real screens · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the extension marks reach the live decks (migration 369) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: every paper pack fits its paper · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: four lessons print their own tool (migration 370) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the ending is agreed, not warned (migration 371) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the films show the script deck, its sources, and the tracking to sorted · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: "Ready", the brand advert, and its series template (PR 1221) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the film link, /v/<code> (migration 372) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: PR 2 of the lessons loop, the home code records coverage (migration 373) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the shorts re-cut after the marketer review · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: guilt, not "bad guy" · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: readable films, the series line, and the product-shorts skill · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the Digital Health Report is not a service · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: migration 360 was never applied, so the whole referral feature had no tables · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 373 arrives in two halves, because 70 KB will not go through the tool · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: migrations 371 and 372 applied, and the shorts go out on the family account · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the hard questions reach the live decks (migration 374) · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the six heavy lessons wait for a grown up · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the child's home, simpler, and nothing written for the parent reaches it · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: every post in Drive gets a Claude review, and the queue restarts at GDC-018 · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: live DiGi agrees the ending, and the bedroom rule is a pathway (migration 375) · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the starter pack and the welcome agree the ending too · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the Digital Health Report stays linked, and GDC-025 is live · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: GDC-022 was already spent, and the two parked posts are written · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: when the five land, the Planet Friends moonwalk on · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: screen break ideas, and Add your own on every step sheet · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: a child's lesson count is that child's own · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: five free Happy News printables, The Planet Post first · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the child's home, the day first and linked to the grown up · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the grown up's side of the link · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: The Guided Planet, the newspaper engine and Issue 001 · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 373's content half carried in pieces, and proved before it was written · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 375 and 374 applied, and 377 cannot be · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: a correction to what the 373 staging tables were granted · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 377 goes back to the planet lane, not fixed here · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: The Guided Planet wears boho Happy News, and the audience is written down · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the review board, eleven lenses scored every Friday · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 377's grants are fixed, its name collision is not · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: The Guided Planet emails through Resend, and boho is for the printables · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: competitor sightings logged, and a first phone ad drafted · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: reels story bank from Family IT Guy's parent questions, not his content · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: the last three ChatGPT posts rewritten, and one register for the numbers · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: Happy News design system in Claude Design; printables start from it · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: GDC-039, 037, 038 running order approved · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: the Drive post review now runs itself · `plans/decisions-archive/2026-10.md`
- 2026-10-14 · 14 October 2026: the Drive sweep nearly rewrote five published posts · `plans/decisions-archive/2026-10.md`
- 2026-10-15 · 15 October 2026: The Planet Post is the taster, The Guided Planet the paper, one look · `plans/decisions-archive/2026-10.md`
- 2026-10-15 · 15 October 2026: The Planet Post downloads now carry the better version · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: every stage check start is counted, by source · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: the board prints one line of real behaviour, and says unknown when it cannot read it · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: Digital Parenting Week planned as two date free pieces · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: every named worry has an exact script shelf, and the first phone is a plan · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: the child rule is "never chats", with one fixed card, and the guard is wired · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: our link in copy is guidedchildhood.com, and a guard holds it · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: The nightly evening push stops after seven unanswered nights · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: The Planet Post, clearer after a nine year old tried it · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: thumb sized buttons, route shaped loaders, a hex ratchet · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: The live Pathway Session line comes off the paid screens · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: The ask names what the family keeps, and repeats after the first look · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: the stage result has a share action · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: The Monday CrewAI meeting is deleted · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: we start at 4, and the parent of a 2 or 3 year old is told so · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: DiGi fallback ladders move to Opus 5.5 and Sonnet 5.5 · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: the Sweden screens post, checked and answered · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: GDC-043 red teamed against Odgers and Ferguson · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: GDC-043 v3, the motive is the story · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: GDC-043 hook rewritten, it referred to a post nobody had read · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: the child can ask to change the deal (PR 1344, migration 381) · `plans/decisions-archive/2026-10.md`
- 2026-10-16 · 16 October 2026: Kairoo upgraded to the competitor to watch · `plans/decisions-archive/2026-10.md`
- 2026-10-17 · 17 October 2026: the passport journey, nine decisions as recommended · `plans/decisions-archive/2026-10.md`
- 2026-10-17 · 17 October 2026: Today path gets a Done bar, a green for jobs all approved, and a finish line (migration 382) · `plans/decisions-archive/2026-10.md`
- 2026-10-17 · 17 October 2026: Today path redesigned, less gold, Happy News crayon (PR 1345) · `plans/decisions-archive/2026-10.md`
- 2026-10-17 · 17 October 2026: migration 378 applied · `plans/decisions-archive/2026-10.md`
- 2026-10-17 · 17 October 2026: Homework page asks about the evening, not the child's word (PR 1354) · `plans/decisions-archive/2026-10.md`
- 2026-10-18 · 18 October 2026: migration 382 applied and read back · `plans/decisions-archive/2026-10.md`
- 2026-10-18 · 18 October 2026: GDC-044, the ban is a teaching instrument · `plans/decisions-archive/2026-10.md`
- 2026-10-18 · 18 October 2026: GDC-044 v2, the post was betting on the wrong commitment · `plans/decisions-archive/2026-10.md`
- 2026-10-19 · 19 October 2026: the ad studio skill, cards A and C first, 381 confirmed live · `plans/decisions-archive/2026-10.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 20 October 2026: the ad campaign council

Three agents (ads, parent forums, creative) researched and debated the ad
campaign over three rounds. Direction agreed; last round fixes applied.
Butter becomes one mark per card, never a surface; espresso buttons; no 3D
characters on paid ads; flat real screen crops; the full hook on every card;
Round 1 tests five hooks led by the free scripts. Brief in
`briefings/2026-10-19-ad-campaign-council.md`.

## 20 October 2026, the Meta Muse connector

Justin: connect Guided Childhood to Meta's Muse, and he is happy for us to appear inside it. Built as a Raw API with an OpenAPI spec (`/api/muse/ask`, `/api/muse/scripts`, `/api/muse/openapi.json`, docs at `/connectors/muse`), no new packages. Muse pays nothing, so the revenue is the funnel: every answer ends at `/starter-pack?src=muse`, counted by migration 379. Parents only, nothing about a child stored; crisis questions get the helplines and nothing else. `MUSE_DAILY_CAP` (default 300) caps model answers, then free scripts answer instead. Free scripts only, never paid ones, and never the Planet Friends mission prompts. Migration 383. Justin submits the form at platform.muse.ai after deploy. PR 1366.

## 20 October 2026: the reply when a school already uses Common Sense

Canva put Common Sense Media's free lessons (60, US made, 20 to 40 minute decks) into Canva Education from 9 October. Not a new competitor, since Common Sense UK was already free, but it anchors "free" in teachers' heads. Justin agreed a ready reply under campaign rule 12: never knock it, keep it, and name the UK statutory layer we add (the 57 RSHE requirements mapped, the DSL crosswalk, UK law, nothing to plan).

## 21 October 2026: an email gate on the free standalone lessons

Justin: "can we get the lesson with email address required as well as another button to request pilot", then "if someone does have a license then we dont want to ask for email". All three standalone lessons (they share one bar and link each other), including smart glasses for Votes for Schools. The proxy shows the gate at the lesson's own URL, so the link sent to Penny keeps working; a school code skips it, and a `gc_free_lesson` cookie stops anyone being asked twice. Email and school name only, stored as band `standalone` in the letterbox; Justin gets the lead note, the teacher gets no letter. Fails open if the save fails. A separate Request a pilot button carries `?from=<module>` into the pilot notes. The taster stays ungated. No migration. PR 1370.

## 21 October 2026: tests never use up a pilot place

The pilot page said "4 of 5 places left" because of Justin's own test request on 7 October. `pilotPlacesLeft` now leaves out requests from his addresses (FOUNDER_NOTIFY_EMAIL plus the two he tests from, and the app's own sender) and any whose school or contact is just "Test". The rows stay in the table. The test row itself is deleted only on Justin's yes. No migration.

## 2026-10-21, SEO through gum for both apps

gum (gumcli.dev, MIT) reads Search Console for www. and schools. through
`npm run seo` (doctor, pull, report, inspect, submit). The pull runs on
Justin's Mac because gum's Search Console auth is a browser OAuth a cloud
session cannot finish; only the weekly numbers reach the repo. Measure first,
then build the Phase 4 search pages in the order the data gives. Never the
Indexing API, never a delete. Five public pages were missing from the sitemap;
added, and `npm run sitemap-guard` now runs in CI. PR 1376.
## 21 October 2026: the stage check knows someone who has been before

Justin opened /starter-pack signed in and saw the quiz filled in with his child's name. Two causes: a signed in parent was never detected beyond a small line, and progress was saved on the intro and account steps, so any later visit restored question one pre filled and hid the finished run. Now a member gets a Welcome back card (Go to [child]'s pathway, Check another child into the add child form) instead of the quiz, never a redirect; a returning signed out parent gets the same card shape; every card and a restored mid quiz offer Not you? Start fresh, which clears every gc_starter_ key and signs out this browser only. Progress is saved only on a question. No migration. PR 1375.
