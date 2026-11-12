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
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-22 | 128 |
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-09 | 39 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-10-20 · 20 October 2026: the ad campaign council · `plans/decisions-archive/2026-10.md`
- 2026-10-20 · 20 October 2026, the Meta Muse connector · `plans/decisions-archive/2026-10.md`
- 2026-10-20 · 20 October 2026: the reply when a school already uses Common Sense · `plans/decisions-archive/2026-10.md`
- 2026-10-21 · 21 October 2026: an email gate on the free standalone lessons · `plans/decisions-archive/2026-10.md`
- 2026-10-21 · 21 October 2026: tests never use up a pilot place · `plans/decisions-archive/2026-10.md`
- 2026-10-21 · 2026-10-21, PostHog on the public pages only · `plans/decisions-archive/2026-10.md`
- 2026-10-21 · 2026-10-21, SEO through gum for both apps · `plans/decisions-archive/2026-10.md`
- 2026-10-21 · 21 October 2026: the stage check knows someone who has been before · `plans/decisions-archive/2026-10.md`
- 2026-10-22 · 22 October 2026: three motions from the Prompt Motion gallery · `plans/decisions-archive/2026-10.md`
- 2026-11-01 · 1 November 2026: "Ask us for help" on the homework page, demand before build · `plans/decisions-archive/2026-11.md`
- 2026-11-02 · 2 November 2026: DiGi's Monday failures fixed at the cause, and an email per new signup · `plans/decisions-archive/2026-11.md`
- 2026-11-02 · 2 November 2026: DiGi learns from its failed tests, Justin taps approve · `plans/decisions-archive/2026-11.md`
- 2026-11-02 · 2026-11-02, the Guides section, first three guides · `plans/decisions-archive/2026-11.md`
- 2026-11-02 · 2026-11-02, click tracking, a Guides section, no community yet · `plans/decisions-archive/2026-11.md`
- 2026-11-03 · 3 November 2026: the school window push changes every school day · `plans/decisions-archive/2026-11.md`
- 2026-11-04 · 4 November 2026: Film 10, DiGi learns you · `plans/decisions-archive/2026-11.md`
- 2026-11-04 · 4 November 2026, the Muse connector submitted and locked to a key · `plans/decisions-archive/2026-11.md`
- 2026-11-04 · 4 November 2026: workshops page and enquiry built, hidden until DBS and insurance · `plans/decisions-archive/2026-11.md`
- 2026-11-04 · 4 November 2026: the Etsy Christmas line and Free Saturday · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026, the Road to 16 guide and its claim · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: Etsy branding v2 chosen, the Passport leads the shop · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: the app's platform guides match the Road to 16 evidence check · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: the printed Passport, made to order through Etsy · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: email landing pages, and schools share every lesson with parents · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: every reminder opens the part of the app it is about · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: Say This, the script cards deck · `plans/decisions-archive/2026-11.md`
- 2026-11-05 · 5 November 2026: the app's copies of the five Passport packs match the Etsy ones · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: Robux DiGi short and the five step phone carousel built, review weighed · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: the rest of the Etsy paid line, built · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: the week of 9 November approved as recommended · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: the first 20 sign ups, four doors and a link for each · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: every Etsy download is in the app, free for parent and child · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: Etsy listing photos in the Canva look, varied per product · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: the five build next Etsy packs, built · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: the Guided Times has its own app edition · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: Google Play and Microsoft Store packaging, payments stay on the web · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: endings at a natural stopping point, not a warning · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: UTMs kept with the sign up, TikTok and YouTube channels · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: no name or email address in a URL · `plans/decisions-archive/2026-11.md`
- 2026-11-06 · 6 November 2026: real photos first, filled in, on every listing · `plans/decisions-archive/2026-11.md`
- 2026-11-07 · 7 November 2026: a question for DiGi never rides in the URL as words · `plans/decisions-archive/2026-11.md`
- 2026-11-07 · 7 November 2026: the two lessons stop teaching the warning · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: 388 and 389 applied, and three that were live with no ledger row · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: the usual rows, thirty everyday flashpoints headed off · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: main green again after 1452 and 1458 · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: one click lesson tracking, audited, not built · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: the pilot teacher's French arrives in the languages tab · `plans/decisions-archive/2026-11.md`
- 2026-11-09 · 9 November 2026: tracking approved, bridge b reversed for delivery records · `plans/decisions-archive/2026-11.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 10 November 2026: the walkthrough campaign, 20 drafts and three built

Justin asked for a 20 post walkthrough of the three platforms, one service a post, one goal: free sign ups. Plan: `plans/week-of-2026-11-09-walkthrough-campaign-plan.md`; drafts and the three built pieces (a 30 second Reel cut from existing real captures, an 8 page schools carousel from captures of the live site, a playlists card) in `content/campaigns/platform-walkthrough/`. The spine is the sideways launch sequence with a problem, promise, proof, proposal shape and no agitate. Split 13 parents, 4 schools, 3 playlists, numbered per account because the three audiences never see each other's posts. Found on the live sites: schools has no open catalogue any more (the free steps are one whole lesson and the pilot), parents have no free tier (four days of everything, no card), "school chest" is on no live page, and school email forwarding is live. Nothing posted, scheduled or spent; six decisions wait on Justin. The film engine's tap ripple no longer paints a dot before the tap. PR 1471 was merged as the empty claim; the work is PR 1475.

## 10 November 2026: French media mirrors into our storage, from GitHub

Justin's 9 November call. `scripts/languages/mirror-french-media.mjs` copies the 104 decks, songs and sheets into the public `languages` bucket, run by `.github/workflows/languages-media.yml` because GitHub already holds the Supabase key (no key typed anywhere). Pages use one route, `/languages/fr/media`, which serves our copy and falls back to her site until a file is mirrored. Decks are served sandboxed so their scripts never run as the schools app. Also fixed: the "What I can do" sheet was missing from unit pages.

## 10 November 2026: 390 applied, and the sweep is clear

390 is the follow up to 389: two ks2-04 slides grew past what a projector and
a teacher laptop show at once, and check-wall-fit turned main red. Applied as
one transaction with its own per value guards and proof, so an abort would have
left the deck alone. Both slides are now the shorter text, and the live ks2-04
digest is 055deef8, equal to content/modules, so the deck and its file still
match after both migrations.

Nothing else is outstanding. 390 was the only file in the repo without its
effect in the database. Worth writing down how that was established, because
the ledger alone says the opposite: 252 of the 380 numbered migration files
have no ledger row under their number, and nearly all of those are old rows
recorded under a name with no number prefix (361 is
lesson_clips_every_browser_can_play, 363 is school_day_windows). So the
number comparison is noise. What settles it is the live schema: everything
from 350 up was probed by its own effect, usually the backup table each one
creates, and all of it is there.

Left from yesterday, still open and not mine: the concern-guards failure on
main is a miscount in scripts/check-followup-lives-in-checkin.mjs, not a fault
in the route it guards. The guard subtracts one for its helper's definition,
and the helper became generic, so the definition no longer matches the pattern
and two real call sites count as one. The patch is on PR 1462.

## 10 November 2026: French files stay on her site for now; the print room

The mirror's first run found no Supabase secrets in GitHub. Justin chose to keep the French files on the author's site for now: the media route already falls back to it, and the mirror job waits quietly until the two secrets are added (that is the whole switch). New page `/languages/fr/print`, the French print room: all 89 sheets on one page by unit and lesson, three versions side by side, a link filter per version.

## 10 November 2026: the finish pass on French and the digital print room

Justin asked for our level of finish on the French pages, with motion and better navigation, then flagged `/print`. French: one segmented control on every page (Units, Print room, Coverage), a live sandboxed preview of the first slide on the lesson page, a play button per lesson row, the house Reveal and the site's own button classes. `/print`: 238 pills in tables became one row per lesson that opens to its seven sheets (native details, no script, still cached). Her slides themselves are untouched; restyling them needs her say. Her own site is not changed by any of this.

## 10 November 2026: the walkthrough campaign, all 20 built

Justin said yes to the look of posts 1 to 3, so the other seventeen were built the same afternoon, all free: four more parents Reels from the reference pages, seven parents carousels and cards with `tools/social-cards`, three schools decks from captures of the live site, two playlists decks. Six pages of the live parent app that no reference page shows (Scripts, app settings, first phone, Printables, tell a parent) were captured in his signed in Chrome, with the film family's names swapped on the page first and anything showing the family's own record cropped out. `tools/social-cards` gained a framed screen card (`shot`), a `start` number for lists and a tighter five band row. Open on the built pieces: a real fridge photo for post 17, the printed passport price on post 18, the marketer review of the five new films. Nothing posted, scheduled or spent. PRs 1478 and 1481.

## 10 November 2026: the French scheme syncs every night

Justin said yes to a nightly sync. `languages-sync.yml` reads the author's data each night and, only when it changed, opens or refreshes one pull request (`languages/french-sync`) with the new `fr.json`; merging it is what goes live. The sync script now refuses to write a file whose shape the pages could not draw. Slides, songs and sheets are not in this: they load from her site as they are.

## 10 November 2026: the walkthrough runs from 17 November, three a week

Justin: "Yes, 17 November". The walkthrough starts Tuesday 17 November and runs to Sunday 20 December as proposed, three posts a week on the family account (Tuesday, Friday, Sunday), which lifts the one ask in five rule for those five weeks; Monday and Wednesday still carry none. Schools go on his LinkedIn on Thursdays, playlists on Sunday mornings. The day by day list, with the file to upload and the links to make, is `content/campaigns/platform-walkthrough/schedule.md`. He posts and schedules; nothing was scheduled for him.

## 10 November 2026: the Research Radar and ChatGPT run as one gated pipeline

Justin asked for an audit and repair of the Claude and ChatGPT workflow. The audit found the repo manifest, the Drive manifest and the live register each giving a different record count (14, 25, 16), and the queue pointing Stage 2 at a handoff doc he had already retitled superseded. Decided: GitHub owns post numbers, research history and publication status; Drive holds stamped copies (source commit, content digest, facts digest) that are only counted as synced after a readback compares. Every gate returns PASS or HOLD with reasons, and a HOLD never continues quietly. What is still manual, and said so on the dashboard: the copy to Drive is a Claude step, ChatGPT cannot see GitHub or be started by Claude, and approval, posting and the link stay with Justin. `scripts/radar/README.md` is the operating guide; `npm run radar-pipeline-test` is the proof. PR 1482.

## 10 November 2026: French re-cut into three rooms, and the three pages it was missing

Justin: bring across lesson plans, assessment across the year and culture, and "really simplify the flow". Three more tabs would have made six, so the section stays at three, named for what a teacher is doing: **Teach** (pick the year, six half terms in order, open one, press play), **Print**, **Plan and assess** (printable lesson plans per unit, assessment across the year, the coverage grid). The unit page leads with its lessons and folds the reference material away. Culture lessons carry a star and sit outside the numbered lessons, as the scheme has them. Assessment is labelled SOLO 3, 4 and 5, her own model, where the page had said "working towards, expected, greater depth", which was our reading of it. Two "challenge" sheets that the reader was dropping now show.

## 10 November 2026: the relay, so Justin stops carrying research between ChatGPT and Claude

Justin: "I should only need to review and publish." Decided: research reaches Claude through a Drive inbox ChatGPT writes one JSON document a day into (`scripts/radar/candidate.schema.json`), never through him. A candidate is a claim to check and enters the register as DISCOVERED. Storing a review, claiming a GDC number and sending a pack back are now gated steps, not hand edits. Every run writes a log and a summary that opens with what needs him. His four statuses are READY FOR JUSTIN, CHANGES REQUESTED, APPROVED, PUBLISHED, and only he moves them. The Claude runs stay on the Claude Code scheduled task (it has the Drive connector); GitHub Actions carries the tests, an integrity gate and a watchdog, with no secrets. Running Claude inside Actions was costed and not enabled: it needs an API key and a Google credential, which is his call. Not automatic by design: approval, posting, and merging the day's pull request. `scripts/radar/README.md`; `npm run radar-relay-test`. PRs 1489 and 1491.

## 10 November 2026: the lesson run and the school's record (first build)

Justin asked for one flow per lesson from prep to record, after a head asked how progress against a fixed progression gets recorded. Built on the 9 November spec: one table for both subjects (`schools.lesson_records`, migration 391, **not applied yet**), the school always read from the signed cookie, no pupil ever. The French lesson page is now three steps (Get ready, Teach, Record); a new progress page shows each class against the fixed sequence and the share at SOLO 4 or above; the digital run sheet and lesson page end in the same button. The head's question was put through the feedback filter: level **counts per class, no names** (adapted from "how children are learning"). Researched and verified against primary sources: it meets what Ofsted, the RSHE guidance and KCSIE ask for, and we must never call it "Ofsted ready" (inspectors do not review internal data) or a legal requirement. Four real gaps are written down in the plan. Renamed from the spec's `lesson_deliveries`, which already exists, empty, from the first schools build. Waiting on Justin: read the DPA and privacy wording (version 1.1), then the migration is applied.

## 11 November 2026: her handbook comes across, and digital gets its progress page

The author rebuilt her site's home page as a handbook for a head. Brought in by sync, not retyped: three pages in Plan and assess (how progress is assessed, the curriculum, how the lessons work), her seven lesson steps folded into every lesson page, the lesson pack download, and her own reporting columns on the count (below SOLO 4, SOLO 4, SOLO 5). The French progress page gains each statement each time it comes round, with the change. The digital side takes three of her rules through the feedback filter: `/hub/progress` shows a class against the fixed sequence, the judgements added up, and a "to teach again" list from every objective marked needs revisiting. Parked: moderation. Declined for now: a named pupil over time. All in PR 1490, still waiting on the wording and migration 391.

## 11 November 2026: films are checked, numbers come back, and why the 09:17 run did nothing

Justin: every ChatGPT pack returns to Claude for the final review, a film only where it earns one, and "create an analytics register for all published posts". Decided: (1) the visual choice is recorded with its reason and text only is the default; a film must decode end to end and have a written review of its frames or the pack is held (`scripts/radar/assets.mjs`). (2) LinkedIn numbers arrive by a pasted screen and a checked import, because no connector reaches LinkedIn's post analytics; the report will not compare partial counts or rank a group under five (`scripts/analytics/linkedin.mjs`). (3) What the numbers say is printed in the start here document ChatGPT writes from. (4) The Founder Approval Desk is one Drive folder with a fixed link. The 09:17 run had fired and stopped in three minutes because its message told it to list pull requests and a scheduled run cannot; it now finds its branch with git and may never finish without a log. Five live posts sit on rows the number register calls retired: listed for Justin, nothing changed. PR 1491.
## 11 November 2026: the ad system, step by step, and step 1 the creative director gate

Justin asked to build the "marketing engineer" ad system from Cody Schneider's talk into ours. Weighed with the feedback filter (`plans/2026-11-11-ad-system-plan.md`): most of it is already built (ad studio, the renderer, per link counting in Supabase is our warehouse). Declined: AI avatar UGC presented as real people, cold outbound to parents (PECR), Graph. Parked: Meta API writes and creator networks until a winner is proven. Adopted first: a reviewer that is not the maker. `npm run ad-gate` fails any round deck card missing the full hook, its own link code, real screens, or breaking the claim and look rules; then a scored vision pass, eight of ten or it goes round again. Every round deck now carries `round` and each card `src`, the ledger step 3 reads. Eight steps, one PR each. PR 1493.

## 11 November 2026: Etsy repriced, and twelve more listings built

Justin asked whether to go in much cheaper. Etsy UK search on 11 November showed kids phone contracts at £1.40 to £4.68 and chore and reward charts at £1.42 to £3.66 with VAT, against our £4.12 to £5.39, about double, with no reviews in the category and no visits from Etsy search. So all 23 live listings were repriced that day: entry singles £2.49 to £2.99, core packs £3.49 to £5.99, the First Phone Kit £6.99, both bundles £12.99 (about 23 percent under their parts). Etsy adds VAT on top. The £4 floor is retired. Justin chose to keep the 25 percent shop sale running to 30 November. Every live `listing.md` carries the new price.

Twelve more listings are built, not yet uploaded: four older games that were never listed (A to Z Showdown £3.99, the Ice Cream Shop £3.99, the School Year Planner £5.99, Word Fishing £2.99) and eight spin offs at £1.99, each a few pages of a live pack cut out by `content/printables/cut-pack.mjs` (Star Breathing Poster, Feelings Cards, Weekly Routine Chart, Routine Picture Cards, Car Bingo, Devices Sleep Here Sign, Family Tech Rules, Screen Time Tokens). The older games' last pages promised bonuses that /etsy-bonus does not give, so the same script swaps them for the thank you page that offers the Starter Pack. Left out: the Fish Tank game, whose pages still speak in the robot's "BEEP BOOP", and the four packs fronted by Zara, Sofia and Oliver. The First Phone Kit's readiness check was not cut out, because it points at other pages of the kit. Rules for spin offs are in the printables engine skill, step 7b.
## 11 November 2026: ad round 1 built, and the uploader that loads it paused

Justin asked for step 2 with the creating and the uploading set up, at a top finish, and asked why not an avatar. Round 1 is the council's brief built: five hooks in one stacked treatment, real screens (three live `/say/` captures), gated, butter measured at under 3 percent, scored 8 to 9. The ad studio rule changed at his ask: `npm run ad-upload` may load a round into Facebook and Instagram ads, with everything PAUSED; switching on and spending stay his. Proved against a stand in only, no token yet. Five link codes (`r1-*`) inserted on the live database. Google waits for a developer token and a winner. The avatar rule is unchanged and clarified: never a synthetic parent or customer; Justin's own twin is allowed, to be tested against Justin on camera. `content/ads/SETUP.md`, `content/packs/2026-11-11-round-1/`.

## 11 November 2026: the ads measured against the talk's and the competitors', and a picture added

Justin asked whether Round 1 matches the finish of the adverts in the talk and of the competitors' proven ads, using the same products. Watched the talk's adverts frame by frame and read the Meta Ad Library live (`briefings/notes/competitor-sightings.md`). Found: the only proven set is Qustodio's plain videos in real homes (240 days and more); Kairoo launched a generated, illustrated campaign 5 to 11 days ago, including "Jobs first. Then screen time.", which is our card 5; the talk's adverts share our card's structure and add a picture. So a stacked card may now carry `scene`, a generated photograph of a room or objects behind the real screen, under visual system section 15 with nothing loosened. Proof made for mid match: 5.5 credits, agreed first. Seedance costed at 128 credits for eight seconds, not run. Open with Justin: scenes on all five, and card 5's hook.

## 11 November 2026: all five Round 1 cards carry a picture

Justin said yes to a picture behind the screen on all five cards. Each has a generated photograph of its moment (a room and objects, nobody in it, visual system section 15) with the real screen untouched on top. Ten images, 27.5 credits in all, agreed first. Gate passes, butter under 4 percent. The plain cards are kept in `content/packs/2026-11-11-round-1/plain/`. Card 5's hook is still open with Justin.

## 11 November 2026: the ad goal, the swipe file, and accounts of their own

Justin set the goal: the best performing adverts, built on what is proven, with Facebook and Google ready to upload to. Written down with its one measure (stage checks begun per thousand reached, then cost per stage check) in `content/ads/proven-rules.md`, over a swipe file of 21 adverts from six companies read by hand in the Ad Library (`content/ads/swipe/ads.json`). First rule: everything past 180 days is video, so the video round comes before more cards. We copy structure only; competitors' pictures, films and sentences are never stored or reused, and there is no scraper, which would break Meta's terms on the account we advertise from. Card 5 now reads "They earn their screen time. You set the rate." (code `r1-earned-time`). Accounts, looked at read only: the Page sits in the Inspired by Alma portfolio where Justin has partial access, his ad account is an old Etsy one, and the Google login opens another business. Guided Childhood gets its own of each: `content/ads/SETUP.md`.

## 11 November 2026: ad video 1, the script for Justin to camera

The video round starts with one twenty second advert on the mid match moment, Justin to camera on his own phone, because every competitor advert past 180 days is plain video. Sixty words, every line taken from the live free script, ending on the hook word for word, plus a second opening filmed in the same sitting so only the hook is tested. No scene from his own life is used. Read cards in `content/read-cards/2026-11-11-ad-video-1.json`; script, sources and the cut plan in `content/packs/2026-11-11-ad-video-1/`. Not filmed. His digital twin reads the same cards as a third version later.

## 11 November 2026: the Facebook key is Justin's own, because the Page cannot be moved yet

Justin was not sure who owns the Inspired by Alma business portfolio. Looked, read only: two people, Justin with partial access and Anna Quiles with full access, who left long ago. She alone can move the Page or add an admin. So the setup no longer waits on her: a Guided Childhood portfolio and ad account of its own, and Justin's own 60 day token in place of a system user, since he has full access to the Page himself. The app goes Live, not development. Separately and soon, the Page needs making safe: Anna raises him to full access, or Meta Business Support's process for a departed admin. `content/ads/SETUP.md`.

## 11 November 2026: Anna cannot be reached, so the Page goes to Meta support

Justin cannot reach Anna Quiles, the only full access admin of the portfolio that owns the Page. Only Meta can change that. Meta publishes no form for a departed admin; the route in `content/ads/SETUP.md` section E (proof of ownership, ID, a signed statement, a case opened from Business Support Home) is what third party guides describe, and is marked as such. The wording to paste is written with both IDs. Justin opens the case himself. Adverts do not wait on it.
## 11 November 2026: migration 391 applied, after PR 1490 merged

Justin marked PR 1490 ready and merged it at 10:57 UTC. The record button was then live with no tables behind it, so migration 391 (`schools.lesson_records`, `schools.lesson_record_events`) was applied to production straight away, exactly as dry run the day before. Checked afterwards on the live database: no privilege for `anon` or `authenticated`, the server role has select, insert and update on the records and select and insert only on the trail, row level security on, no policy. The legal wording (version 1.1) went live with the merge.

## 11 November 2026: progression and assessment reviewed against the best platforms

Justin asked for a review of what heads and teachers expect of progression over years, how the top platforms do it, each lesson rated, and amendments until we are first. Eight passes: two researchers on rivals' own pages and the primary sources, four lesson reviewers against the house rubric, one on the French scheme, one mapping what exists. Lessons score about 6.5 of 10 on progression and assessment: strongest at being runnable cold, weakest at telling a teacher what good looks like (30 of 34 have no descriptor, and the rows carry four vocabularies). Five answer keys contradict the lesson they mark. Nothing says which year teaches which lesson. French: 8 to 9 for its two finished units, about 4.8 as a whole. Nine amendments ranked in `plans/2026-11-11-progression-and-assessment-review.md`; none built. "First" is defined as the best no pupil data, no prep scheme, not first at being Jigsaw.

## 11 November 2026: the nine amendments, built in order (first: the record, the musts, the descriptors)

Justin on the progression review: "go ahead with all but dont change price." So amendments 1 to 8 are built, in the order in `plans/2026-11-11-progression-build-plan.md`; 9 is the French author's and nothing is written in her name; no price is touched. First increment: each judgement button now says what it looks like in that lesson (three lines per lesson, written only from the lesson's own misconceptions and check questions, held at `assessment.teacher_judgement.descriptors` in one vocabulary); the 21 lesson musts are fixed, including five answer keys that disagreed with their own wall; the stale "mark on the register" lines are gone; the school's record gets a Hub card, an every class grid, last year, and one spreadsheet download; the board's finish leads to Record. The lesson edits are migrations 393 and 394 (392 is claimed by PR 1498), generated by `scripts/gen-lesson-musts.mjs`, each value guarded on what it replaces. One must is only half met: ks5-20's new brief writing task sits on an extension slide, and moving it into the core changes the lesson's minutes, so that is left for Justin. PR 1496.

## 11 November 2026: a suggested year for every lesson, and the progression map

Amendment 3. `shared/schools-progression.ts` gives each lesson a suggested year and the earlier lessons it builds on, read from each lesson's own prior knowledge lines. The scheme's order is kept inside each key stage and cut into years so nothing lands before what it builds on; `scripts/check-progression.mjs` holds that. `/hub/progression` shows it year by year and as four threads; `/hub/year-plan` now goes year by year where it used to lay a whole key stage over three terms. It is a suggestion and every page says so. KS3 still opens on ks3-27 and KS4 on ks4-29, as the scheme orders them: reordering is Justin's call and was not made here. PR 1496.

## 11 November 2026: quiz counts, the leader's page and the look back quiz

Amendments 4, 6 and 7, with nothing new stored. Quiz counts are three optional numbers beside the judgement (pupils in the room, most of the starter right, most of the exit right), kept inside the record's existing marks, shown as two shares and never as a gain, because they are two different quizzes; the DPA and privacy notice name them (legal version 1.2, for Justin to read). `/hub/coverage` joins the record to the RSHE requirements and computing statements the scheme teaches: a requirement with some of its lessons delivered reads as started, never as covered. `/print/look-back` builds an end of term quiz from the exit questions of the lessons a class has been taught, word for word, with one more question on anything judged developing or needing revisiting. PR 1496.
## 11 November 2026: a free taster of every printable pack, and the three email week behind it

Justin: "the email funnel that gives our printables away for free ... we promised Saturdays", on his 9 November ruling "tasters free, full on Etsy". Built: 31 tasters (two or three pages, always fewer than half the pack, stamped "Free taster" with the Etsy link) on one `/free/<slug>` template, all from `content/printables/free-tasters.json`, which the Saturday engine reads for slug, title, ages, url and status. Each claim is counted per post (`free_download_events`, migration 392: slug, src, UTMs, new lead, nothing about the person). Emails on Resend, not Mailchimp: the taster at once, the stage check next morning, the full pack and membership a week on, the only spacing the one a week floor allows. Not tasters: bundles, the Starter Pack and Road to 16 (already free or a reward), the twelve singles still being listed. `/v/` destinations and the public paid PDFs are left to their own tasks. PR 1498.

## 12 November 2026: migrations 393 and 394 applied, after PR 1496 merged

Justin said yes. Both parts were applied to production through the Supabase tools, each value guarded on the exact value it replaced, and none refused. All 37 lessons now carry the three descriptor lines (secure, developing, needs revisiting) and the 21 musts are live, including the five answer keys that disagreed with their own wall. Spot checked against the lesson files afterwards (ks2-05 answer key, ks4-19 warm up, ks4-29 fifth exit question, the descriptors): equal. PR 1496.

## 12 November 2026: 391 and 392 applied, and 394 was already in

The sweep found four candidates past 390 and only two needed applying.

391 (the school's lesson records) and 392 (the free taster claims) each went in
as one transaction, so neither table existed for an instant without its RLS and
grants. Verified after: 391 has its 17 and 8 columns, 12 and 3 checks, the
foreign key, both indexes and both comments, service_role holding exactly
insert, select and update on the records and insert and select on the trail,
with no delete on either and nothing at all for anon or authenticated, both
refused on the real access path. The old schools.lesson_deliveries is untouched
at 6 columns, which 391 asks for by name. 392 has its table, view, four indexes
and the lead foreign key set to set null on erasure.

394 needed nothing. Another session was applying 393 and 394 as this ran, and
its ledger rows are minutes old. Rather than carry 32 KB of generated content
into a deck another session was writing, all 65 of 394's target values were
compared against live by digest first: every one already held the new value. So
the probe is what stopped two sessions writing the same 65 values at once, and
it is the reason to keep probing before applying rather than after.

Worth keeping: 394's slide 24 hash looked like neither the old nor the new
value at first glance, which is what prompted the full check. It was the new
value's hash all along. One value read in isolation can mislead; 65 compared
at once cannot.

Left for Justin: my own ledger row for 394 duplicates the one that session
wrote, and the delete needs a confirmation in the Supabase tool that has gone
unanswered twice. Harmless, both name the same migration.

## 12 November 2026: the second ad talk weighed, the results read, the Monday loop

Justin brought a second talk (seven rules for digital marketing) and asked for the best of both talks in a routine that gathers feedback and keeps our adverts ahead. Weighed point by point (`plans/2026-11-12-second-ad-video-weighed.md`). Adopted: the words are the targeting (segment versions of a winner, two or three words changed), one niche until exhausted, a monthly check of who the chatbots recommend. Declined: rewarding reviews (unlawful when hidden in the UK) and a third party MCP holding the ad account. Built: `npm run ad-results` (Meta reach and spend, reads only, joined with our per link counts) and ad studio Phase 7, the weekly loop. Instagram linked to the uploader the same day (`META_INSTAGRAM_ID`, after adding the Instagram use case to the app).

## 12 November 2026: the verified advertiser on the ads is The Social Billboard Ltd

Ads Manager would not publish round 1's ad set without an advertiser and payer, and offers only a verified identity; the one verified was THE SOCIAL BILLBOARD LTD. Justin: it is a linked company he runs, happy for it to pay as long as it does not confuse the ad. It does not appear on the advert, which still runs as The Guided Childhood on Facebook and @guidedchildhood on Instagram; it shows only in the advert's transparency details and Meta's Ad Library. Selected and published on round 1 (the adverts stay off); the uploader carries it for later rounds. A Guided Childhood verification can replace it later. PR 1515.
## 12 November 2026: round 1 loaded paused, the benchmark pass, the Monday loop scheduled, the how to use page

Justin said load them. All five round 1 adverts are in the Guided Childhood ad account, every one paused, on Facebook and Instagram, first run with no errors (ids in `content/ads/meta/2026-11-11-round-1.json`). Asked that every advert be as good as the best competitor known to work: ad studio Phase 4 now has pass 3, the benchmark, scoring each card against the closest proven competitor advert; round 1 scores 6 to 8 of 8 against Qustodio's 97 day static at 4. The honest gap is video: their longest runners are plain videos. The ad set audience is now UK 25 and over with Advantage+ (the words do the targeting). The weekly ad loop is scheduled on Justin's Mac, Mondays 09:00, never posting or spending. His one page guide: `content/ads/HOW-TO-USE.md`.
## 12 November 2026: ten out of ten, the build order, and the Fable 5.2 trial

Justin's answers to the board's ten out of ten questions (`plans/week-of-2026-11-09-ten-out-of-ten-plan.md`): test Fable 5.2 and switch only if it scores as well; Home becomes the lead plus one slot; schools, French, Etsy and ads keep going; under 4 email list, 14 to 16 first step and two reminders a day agreed. Built as one PR per step (1509, 1511 to 1514, 1516, and the eval). Migration 395 claimed for the nudge cap. The Fable 5.2 switch is held for the side by side eval (`DIGI_MODEL_CANDIDATE`, the "Compare the new model" button); the bar is as many cases passed, no breach, average within two points. DIGI_MODEL stays claude-fable-5-1 until then.

## 12 November 2026: reconciliation before the next batch

- Justin: build the reconciliation and handoff contract first, before the next batch of posts is written.
- `scripts/radar/publication.mjs` builds one publication register (slot owner, approval, schedule, live URL) and classifies each queued story NEW, FOLLOW UP, OVERLAP, DUPLICATE or UNKNOWN. SCHEDULED needs Justin's approval on record plus exactly one slot owner. PUBLISHED needs a URL.
- `daily.mjs handoffs` refuses to hand ChatGPT a DUPLICATE. Today it reports HOLD with ten things to settle, all of them Justin's to decide.
- Why: on 12 November two posts sat in LinkedIn and Metricool at once and five scheduled posts had no record. No single file showed it.
## 12 November 2026: migration 395 applied

Justin said apply it. `parent_nudge_log` and `claim_parent_nudge` are live: RLS on, three columns, no read or execute for authenticated, execute for service_role, checked after applying. The two reminders a day cap (PR 1512) now takes effect; before this it failed open by design.
## 12 November 2026: round 1 paid test switched on

Justin chose the paid test over free first, and confirmed the terms: five adverts, £5 a day until 19 November, about £35 at most, Visa ending 2258, paid as The Social Billboard Ltd. Meta had approved all five; switched on and confirmed active. A knowing exception to the money rule at a capped cost. The uploader still creates adverts switched off only. First read in the Monday loop on 16 November.
