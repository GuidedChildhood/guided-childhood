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

## 2026-10-21, PostHog on the public pages only

PostHog (EU cloud, via a first party /ingest rewrite) counts visits to the
public pages and each stage check step, so we can see which page sends parents
to the stage check. Cookieless (`persistence: 'memory'`), so the privacy page's
"no tracking cookies" stays true and no banner is needed. An allowlist in
`lib/analytics/posthog-policy.ts` keeps the child app, family codes and the
dashboard out, strips query strings to utm and ref, and drops any event or
property not named. Off until NEXT_PUBLIC_POSTHOG_KEY is set. PR 1377.
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

## 22 October 2026: three motions from the Prompt Motion gallery

Justin pointed at prompt-motion.com; it is rendered promo videos, so for films it feeds product-shorts, and in the apps three moves were built in house style: numbers count up (shared CountUp, RSHE tiles and the Balance week total), coverage bars draw in (shared CoverageBar on the RSHE and computing mapping pages, Balance row bars), and a squash landing for the kid stamp and sticker (shared/motion.ts). Server renders the final state; reduced motion and print get it whole; public pages only animate what starts below the fold. PR 1381.

## 1 November 2026: "Ask us for help" on the homework page, demand before build

Justin: a button for assistance that arrives at hello@, and once requests build up, a step by step school framework tool for the topics asked about most. The row opens a topic (prefilled with this week's) and an optional note; the request emails hello@guidedchildhood.com with the subject "Homework help: Year N · topic", so an inbox search counts demand by topic. No table yet: the inbox is the ledger until volume earns one. Checked the "numbers up to 10,000,000" job: it is the DfE's verbatim Year 6 autumn objective (Year 5 is 1,000,000), so it is right for a Year 6 child.

## 2 November 2026: DiGi's Monday failures fixed at the cause, and an email per new signup

Justin asked whether the Monday DiGi email came from real users: it does not. Every case is a test question, and this week's rotating five were the fallback set because no parent spoke to DiGi in seven days (31 accounts, one paid and it is his, no signup since 28 September). Fixes: the howto case still asked for the labelled lesson shape the prompt dropped on 16 October, so the test moved, not DiGi; the voice file's model bedroom sentence was a decree DiGi copied, now an agreed pathway; a number test in the prompt (no r, β, d or percentage unless it is word for word in the knowledge base) and a fabrication rule in the safety reviewer; the Monday cron now stores each failing reply and says how many real conversations there were. New: lib/ops/signup-alert.ts emails Justin once per new account, from /auth/callback and the starter pack. No migration. PR 1392.

## 2 November 2026: DiGi learns from its failed tests, Justin taps approve

Justin asked for DiGi to improve itself and chose "draft weekly, I tap approve" over self rewriting. Every Monday each failed case becomes one proposed rule (or a note that the test is out of date), emailed with a signed link to a page with Approve and Decline; the page's GET only shows, so a mail scanner cannot approve. Approved rules ride in the uncached system block for live DiGi and the evals, under every house rule, ceiling twelve before they are folded into the prompt by hand. Failed rotating cases are kept and re-run weekly. Migration 384, applied and read back. PR 1393.

## 2026-11-02, the Guides section, first three guides

Justin: "Yes on guides". `/guides` and `/guides/<slug>`, one page per question
a parent types, each built on a `DEVICE_ISSUES` entry so the advice is written
once. The approach is free; the word for word scripts are named and locked,
because scripts are paid (11 August). Every guide ends at the stage check.
First three: the nightly screen time argument, the first phone, Roblox
spending. Next ones in the order the gum report gives. Homepage strip sits
under the last stage check button. PR 1395.
## 2026-11-02, click tracking, a Guides section, no community yet

PostHog now records `link_click`: where a public page link went (cleaned by
the policy) and a `data-track` label, never the link text. The five homepage
buttons to the stage check are labelled. Blog: yes, as evergreen `/guides`
built from real scripts and ordered by the gum report, pending Justin's yes.
Community: not now and not on the homepage (safeguarding, the empty room); the
June rule stands, a members only room at about 200 paying members.
Plan: plans/2026-11-02-clicks-guides-community.md.

## 3 November 2026: the school window push changes every school day

Justin: the home from school reminder was the same every day; make it engaging, helpful and varied ("try this", "have a concern, talk to DiGi, it learns from you", "see you tonight", services they have not used). The window push now rotates five kinds over each school week: the move (three wordings per band, all from the October briefing's verified ledger), DiGi (worded as new for a family that has never asked it), tonight's path, and one untried service (a job for stars, then the scripts) only while untried. Rotation counts school days, so Friday and Monday never match. Same moment, same one window per family, no new push. Guard: 52 checks. No migration.

## 4 November 2026: Film 10, DiGi learns you

Justin asked for DiGi clips that show the full cycle and how it learns; he chose a new film for the learning loop, ending on the stage check. The example family from Short 1 across a week: Monday's reply puts the worry on a check in, Friday's real check in records Getting there, and next Monday's reply starts from it under the real thinking line "Your own family history is part of this answer." Proof path: the DiGi route reads concern scores, family memory and what worked before every reply. A marketer review fixed the timeline, took the remembering off the parent, and shortened both bands; its new hook was declined to keep Short 1's bubble. Films in content/packs/2026-10-09-digi-shorts/films. PR 1396.

## 4 November 2026, the Muse connector submitted and locked to a key

Justin submitted the Guided Childhood connector to Meta's Muse review at platform.muse.ai. It authenticates with an API key: `MUSE_CONNECTOR_KEY` is set in Vercel (Production) and the same key is on Meta's form, test and live. Checked live: calls with no key or a wrong key get 401, the spec and `/connectors/muse` stay public. Every form answer is in `integrations/muse/submission.md`. Rotating the key means changing Vercel and the Muse portal together, or Muse calls fail. PRs 1366 and 1380.

## 5 November 2026, the Road to 16 guide and its claim

The free reward for a printable Passport stamped up to the child's age (Justin: the reward, not a product; unlocks when caught up, not at sixteen). Eleven pages, A4, Letter and ink saver, in the Passport's burgundy and gold: balance, signs by stage, eight apps with each one's own minimum age, the school moments, a help page, sixteen, sources. Every line is the app's own content or a sourced fact; the evidence red team passed it after fixes (content/printables/road-to-16-guide/evidence-check.md). /etsy-bonus keeps the Starter Pack and adds an honour based claim, magnet `road-to-16`. Found on the way: migration 093 says Roblox is 13 (its UK terms say 5) and four more stale settings lines. PR 1403.
## 4 November 2026: workshops page and enquiry built, hidden until DBS and insurance

Phase 3 of the workshop audit: schools.guidedchildhood.com/workshops with the four workshops (Years 5 to 6 smartphone one as flagship) and an enquiry form. Enquiries post into the existing invoice_requests letterbox as band `workshop` (no new table); the cron treats it as a lead, emails Justin and sends the school a confirmation promising DBS and insurance certificates before any visit. Page is noindex, unlinked and out of the sitemap until WORKSHOPS_LAUNCHED in schools/lib/workshops.ts is flipped. No prices on the page until Justin picks a column. Privacy notice now names workshop enquiries. PR 1401.
## 4 November 2026: the Etsy Christmas line and Free Saturday

Justin approved the plan: the old Etsy shop is switched over first (not done yet), then ten paid downloads in season order, First Phone Kit, Christmas Countdown and Screens At Granny's listed by 20 November. A free download every Saturday from 7 November, each the taster for a paid one, never listed on Etsy. Instagram emails come through the bio link and Story stickers to `/free?src=ig`; keyword DMs stay banned (funnel rule 4). Paid boost £15 a week, only behind the best free download once four have run. Plan: plans/week-of-2026-11-02-etsy-paid-downloads-and-free-saturday-plan.md. PR 1400.

## 5 November 2026: Etsy branding v2 chosen, the Passport leads the shop

Justin chose the 3D DiGi shop icon on a warm gold ground (no black border) and asked for the Passport on the banner: the five Planet Friends now walk the gold pathway to the burgundy Passport cover, with "Get your Guided Childhood Passport". So a printable Passport (fold out book, stage pages, stamp and sticker sheet, £7.99) joins the paid line and ships first, because the banner names it; the printed keepsake with real stickers follows later as a physical listing. Final images in content/etsy-shop/branding/final. PR 1402.

## 5 November 2026: the app's platform guides match the Road to 16 evidence check

The Road to 16 red team found the app's own settings rows out of date, so migration 385 corrects them, guarded on the 093 text: Roblox accounts from 5 with a parent (its UK terms), YouTube's Family Link content setting instead of a Restricted Mode lock most children cannot have, Facebook supervision without "message oversight", WhatsApp parent managed accounts with a "may not be in the UK yet" hedge, Snapchat Quick Add to friends of friends. The settings page words any age under 13 as "with a parent". The issue bank's group chat and sextortion lines carry the UKCIS rule that a nude image of anyone under 18 is never screenshotted, copied or forwarded. Justin applies 385. PR 1405.

## 5 November 2026: email landing pages, and schools share every lesson with parents

Justin: the email links to the child's app and the agreement sent signed out parents to login ("fix create"), and schools should share lessons that parents read by signing up free ("a secret way to get users"). Public /kids-app and /agreement now explain each one with the real product and one door, the starter pack with ?next= back to the app share step or the builder; the starter pack, login and /auth/callback honour next through lib/auth/safe-next.ts (the callback's unchecked next was an open redirect). The schools lesson page mints a signed parent link per lesson for a licence (all lessons) or pilot (its two); /from-school/<module>/<ref>.<sig> shows title, what was learned and the question to anybody, and the full note and lesson to any account, recording nothing. The ref is a pseudonym of the school's access code. Migration 386 adds profiles.school_share_ref and school_share_module, written once at the trial grant; PARENT_SHARE_SECRET on both Vercel projects. Justin applies 386. PR 1412.

## 5 November 2026: Say This, the script cards deck

A new paid Etsy printable from Justin's ask for "Diary of a CEO cards but scripts for every moment": 60 cards, 50 parent scripts in five levels, one per Planet Friend (4 to 16). The format of premium conversation decks, our own look. Card 1 of each level is that stage's script in stages.ts (the Passport page's talk); the rest are live `scripts` rows word for word, each id in cards-data.js. £7.99 list, £5.99 on the permanent sale. On every Passport page under the talk, not ready until listed. Not uploaded. PR 1416.
