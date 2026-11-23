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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-19 | 159 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

- 2026-11-10 · 10 November 2026: the walkthrough campaign, 20 drafts and three built · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: French media mirrors into our storage, from GitHub · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: 390 applied, and the sweep is clear · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: French files stay on her site for now; the print room · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the finish pass on French and the digital print room · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the walkthrough campaign, all 20 built · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the French scheme syncs every night · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the walkthrough runs from 17 November, three a week · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the Research Radar and ChatGPT run as one gated pipeline · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: French re-cut into three rooms, and the three pages it was missing · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the relay, so Justin stops carrying research between ChatGPT and Claude · `plans/decisions-archive/2026-11.md`
- 2026-11-10 · 10 November 2026: the lesson run and the school's record (first build) · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: her handbook comes across, and digital gets its progress page · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: films are checked, numbers come back, and why the 09:17 run did nothing · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: the ad system, step by step, and step 1 the creative director gate · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: Etsy repriced, and twelve more listings built · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: ad round 1 built, and the uploader that loads it paused · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: the ads measured against the talk's and the competitors', and a picture added · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: all five Round 1 cards carry a picture · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: the ad goal, the swipe file, and accounts of their own · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: ad video 1, the script for Justin to camera · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: the Facebook key is Justin's own, because the Page cannot be moved yet · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: Anna cannot be reached, so the Page goes to Meta support · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: migration 391 applied, after PR 1490 merged · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: progression and assessment reviewed against the best platforms · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: the nine amendments, built in order (first: the record, the musts, the descriptors) · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: a suggested year for every lesson, and the progression map · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: quiz counts, the leader's page and the look back quiz · `plans/decisions-archive/2026-11.md`
- 2026-11-11 · 11 November 2026: a free taster of every printable pack, and the three email week behind it · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: migrations 393 and 394 applied, after PR 1496 merged · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: 391 and 392 applied, and 394 was already in · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: the second ad talk weighed, the results read, the Monday loop · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: the verified advertiser on the ads is The Social Billboard Ltd · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: round 1 loaded paused, the benchmark pass, the Monday loop scheduled, the how to use page · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: ten out of ten, the build order, and the Fable 5.2 trial · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: reconciliation before the next batch · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: migration 395 applied · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: round 1 paid test switched on · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: a simple version of mid match joins the paid test · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: the ad system takes a brand: The Social Billboard and Schools join · `plans/decisions-archive/2026-11.md`
- 2026-11-12 · 12 November 2026: The Social Billboard's first ad round, built · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: creator radar brief, plan before build · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: ChatGPT's feedback on the visual report, weighed · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: Roblox pilot, the verified research pack · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: collecting from one creator's Instagram is allowed, for analysis · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: Family IT Guy may be named in the Roblox story · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: the French sync stops going red, and her checkpoint model is ours · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: Free Saturday, a free printable a week built to be claimed, and the download no longer signs anyone up · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: a five day email series for anyone who asks, daily, outside the weekly floor · `plans/decisions-archive/2026-11.md`
- 2026-11-13 · 13 November 2026: creator radar pilots 2 and 3, draft packs · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: round 1 paused; the stage check opens on one tap · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the parent problem sweep, first ranked log · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the answer series, email courses and child films, plan before build · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: Justin's answers on the answer series · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the seven rules marketing video, weighed · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: James Smith on lead magnets, weighed · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the child film inventory (Prompt D) · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the first WhatsApp group pack, and the August briefing no longer stands alone · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: the pathway is ready page, in pictures · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: Tell us about your child, asked after joining · `plans/decisions-archive/2026-11.md`
- 2026-11-14 · 14 November 2026: child films, Justin's four answers and the 1.3 test · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: the Quests page is the day, and setup has its own page · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: no balance score, and play pays the same with praise · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: Rachel first, and the promises match the code · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: French sync issue 1537 closed by hand, and her new progression tables · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: "our guide", never "healthy", across the app · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: ask the parent who stopped · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: French is in every school's licence, and the gaps against the paid schemes · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: one French lesson is free to open · `plans/decisions-archive/2026-11.md`
- 2026-11-15 · 15 November 2026: the plan choice waits for the first check in · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: every printable on guidedchildhood.com/free · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the worry question asks what parents want help with · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: DiGi's recorded voice is Tamsin, a little slower · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the advert funnel counts the pathway and the save screen · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the premium motion engine for research cards · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: four older games point to their Etsy listings · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the topic email course is offered on the stage check result page · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: lesson films from what parents react to, the map and the 1.6 pair · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: film 1.3 re-voiced in Tamsin, the cost measured · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the 1.6 remake and its parent film are built · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: Watch together booking, planned for approval · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the warm ring sent · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: six tiles first, and this is just the start · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the COUNTDOWN link rides on the Business Suite auto reply · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: films 1.1, 1.5, 1.2 and 1.4 re-voiced in Tamsin · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the child films go on the Guided Childhood YouTube channel · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: the drop off asks skip the weekly floor and reach stage check visitors · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: weekly ad loop, round 1 read, left out wins, round 2 is left out by school year · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: Watch together booking built (migration 400, not applied) · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: 1.4 keeps its line, old labels stay, and a second voice test · `plans/decisions-archive/2026-11.md`
- 2026-11-16 · 16 November 2026: DiGi's films re-voiced in Isla · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: migration 400 applied and read back · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the fridge star chart, redesigned to match the app · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the Scripts page is three shelves, and every script looks after the parent too · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: migration 400 applied and read back · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 Nov 2026: three personal LinkedIn posts a week, from Wed 18 Nov · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: KS2 French gets our Planet Friends, Nova and Bloop · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the passport shows the real book and the five Planet Friend stickers · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the 1.5 remake and its parent film are built · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the walkthrough checked against the week, post 1 re-laid, three new posts · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the RSHE mapping page leads with the answer · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the 1.4 remake and its parent film are built · `plans/decisions-archive/2026-11.md`
- 2026-11-17 · 17 November 2026: the passport record book, every step on paper · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the child's passport page, the weekly email reminder, and honest evidence · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the remade 1.6, 1.5 and 1.4 are live in the app · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the Stage 2 film 2.1 is built, and kept out of the app · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: 2.1 goes to YouTube and the family account only · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: 2.1 is live on YouTube · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the remade films come out, and the format is on hold · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: French lesson films, pilot started; both curricula reviewed · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the top of the Quests page, redrawn · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: children on Quests are their letter on their colour, not their buddy · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: Quests setup is a settings list, not fourteen screens of cards · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 Nov 2026: the Evidence Reveal is the default for research led posts · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: the starter page's three fixes are drawn the way the app draws them · `plans/decisions-archive/2026-11.md`
- 2026-11-18 · 18 November 2026: Pebble has a voice, and 1.4 is the animated pilot · `plans/decisions-archive/2026-11.md`
- 2026-11-19 · 19 November 2026: search foundations (Phase 1 of the SEO plan) · `plans/decisions-archive/2026-11.md`
- 2026-11-19 · 19 Nov 2026: posting slots, the Sunday issue and the daily numbers · `plans/decisions-archive/2026-11.md`
- 2026-11-19 · 19 November 2026: homework and projects get reminders that lead up to the day · `plans/decisions-archive/2026-11.md`
- 2026-11-19 · 19 November 2026: the walkthrough fixes Justin chose, and two promises brought into line · `plans/decisions-archive/2026-11.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 22 November 2026: design tells guard, and the app safety pages (Phase 2)

- Justin: nothing should look AI made; Apple standard. `npm run design-tells` (ratchet over twelve visual tells, in CI) and the checklist in `.claude/skills/uiux-pro-max/design-tells.md`; Wikipedia's Signs of AI writing phrases joined `check-ai-tells.mjs`. Our own mono eyebrows, "→" and "·" are flagged as the next wave of defaults: rationed on new pages, old ones untouched.
- Phase 2: 20 apps in `lib/app-safety/apps.ts`, 220 static pages at `/is-<app>-safe(-for-<age>-year-old)`, hub `/app-safety-guide`, the TRUST check (no score, no verdict). Every fact sourced; 61 unconfirmed points in `plans/2026-11-22-app-safety-review-list.md`. Lead CTA the stage check, email capture the existing Starter Pack magnet. Compared against main: every existing page identical. PR 1644.

## 22 November 2026: the school parent pack (Phase 3)

- `/schools/parent-pack?school=<name or code>`: a newsletter blurb with a copy button, a QR code to download, and the free tools (stage check, app guide, guides, printables). A school with a code (migration 353) gets its own `/s/<code>`, which remembers it on the family's profile; any other name gets a short `/go/<slug>` that forwards to the stage check with UTM tags, so PostHog counts it per school. Name cleaned, school versions noindex. `npm run school-pack-test`, in CI. PR 1644.

## 22 November 2026: the iPhone service films, four, from the real app

- Justin asked for Apple-style iPhone walkthroughs of DiGi on the hardest questions (and how it is tracked), Quests, Scripts, and the charts and school help. All four are built: real fixture screens recorded frame by frame with the film family's names, in a drawn iPhone, one headline per beat, ending on the stage check. 27 to 43 seconds each. No model credits.
- No music baked in: trending sounds are added in the app at upload. The shortlist comes from TikTok's Commercial Music Library (UK, 7 days) through the Higgsfield connector.
- The engine is `videos/2026-11-19-iphone-films/`. The pack and captions are in `content/packs/2026-11-19-iphone-films/posting-plan.md`.
- Scheduling in Meta Business Suite stays with Justin, because no connected tool can schedule organic posts. The posting queue page carries the whole drip feed.

## 22 November 2026: SEO Phase 4, the handover guide and the gum join

- Phase 4 checks all green (build, tsc, every guard, posthog 13/13, app-safety 6/6, school-pack 4/4). `SEO-SETUP-GUIDE.md` at the repo root: Search Console (Domain property, DNS verify, both sitemaps, ten URLs to request), Bing import, the PostHog Search dashboard, the weekly 15 minutes, next builds and risks.
- Reviewed the 21 October "Gum app SEO plan" session. Its weekly report read only literal sitemap paths, so it could not see the 220 app pages: `sitemapUrls` now reads `lib/app-safety/apps.ts` and AGES, and the never shown list folds age pages to one line per app. gum stays optional until Search Console has a few weeks of data; no pull has been committed yet.

## 22 November 2026: the homework reminders film and its posts

- Justin: "run on this session", the walkthrough of the school snap and homework reminders. Made as the fifth iPhone service film (32.8s) with the 19 November kit: real screens, example family, no generated imagery.
- Pack: `content/packs/2026-11-22-homework-reminders/` (film, Instagram, Facebook, TikTok captions, one LinkedIn post in Justin's voice, flagged AMBER for his check). Drafts; Justin posts.
- The recorder gained a per scene `clock` and a `file` action (a photo into the snap card). The child's slim home line drops the star so it stays on one line. Migration 401 was applied the same day.

## 22 November 2026: scripts reach the parent at the moment

- The scripts page opens on My scripts (up to five pinned) and "What is happening?" with eight moment tiles. A tile opens one card at a time with the line to say first. Migration 402 (script_pins, script_nudges), applied live.
- Script reminders are capped at two a week, never two within 20 hours (Justin's choice). The turning it off words ride on the existing timer end push. A Sunday push sends the words for this week. A one tap "did it work" the morning after decides what is sent next. PR 1649.
- The timer page now explains why to use the timer every time.

## 22 November 2026: "Homework on screens" becomes "Homework and school"

- Justin asked for a school worry on the stage check. One already existed, so he chose to widen it, keeping the grid at the twelve set on 16 November. Same id and slug, so every family who picked it keeps it.
- Label, promise and answer now cover the project remembered the night before: the answer names the school snap and the reminders that lead up to the day (PR 1641). The homework film's tile is this one.

## 22 November 2026: migration sweep, 397 ran but was never recorded

- Candidates past 394: 395, 396, 397, 398, 399, 400. Every one is live. Only 397 (`public.parent_answers`) had no ledger row, so a row was written for it; nothing was applied.
- 397 was proved live by its own shape, not by its absence from the ledger: the table carries 397's six columns plus 399's `lead_id`, RLS on with no policies, no grant to anon or authenticated, and 399 only alters `parent_answers`, so 399 being applied means 397 ran first. Same pattern as 381 to 383: a missing ledger row is not evidence a migration did not run.
- 395, 396, 398 and 400 were each checked by their own object rather than their ledger row (`parent_nudge_log`, the two `starter_leads` consent columns, the four value `video_link_events` kind check, `watch_bookings` and `parent_lessons.after_prompt`). All present.
- 377 is resolved. The planet lane took the handback and renamed the newspaper ledger to `planet_issue_events`; `public.planet_events` keeps the children's shape. Repo file and live database agree.
- The duplicate 394 ledger row (version 20261112090300) is deleted, on Justin's say so. One row left, the one carrying the real SQL.

## 22 November 2026: GTA VI approved, the week of 23 November cut to three

- Justin: "gta approved, drop 24th and 062 this week and add to next week after".
- GTA VI carousel approved for Mon 23 Nov 08:00 and given GDC 064, because a published post spends a number. ChatGPT's provisional 064 to 066 are void.
- Week of 23 Nov: 064, 061, then the Sun 29 native booking. 059 moves to Wed 2 Dec, and 062 to Mon 7 Dec, because the week of 30 Nov already holds 063 and the 6 Dec booking.
- 062 and 063 are still not approved. Detail is in content/metricool-reconciliation-2026-11-22.md.

## 22 November 2026: search joins the review board, Speed Insights, IndexNow

- Justin: ten out of ten on every part of search, kept under review until it holds. Search is lens 11 of the Friday board (`review-search`, eight parts, mean rounded down); business running moves to 12. Unknown data scores 0, never guessed. A weekly board beats a loop: search moves in weeks.
- Vercel Speed Insights on the public pages only (same allowlist as PostHog, query strings stripped, `lib/analytics/speed-policy.ts`); privacy page says so. IndexNow: `scripts/indexnow.mjs`, key file in `public/`, sends sitemap URLs with a recent lastmod after each deploy (`.github/workflows/indexnow.yml`), never fails a build.
### 22 November 2026: teachers can say what they would change, and Justin gets it weekly (migration 403, not applied)
- The digital lesson record gains one optional line, "What would you change about this lesson?", saved to `schools.lesson_records.would_change` (280 characters, no pupil names). Every line written goes to Justin in a Monday 07:17 digest beside the revisit counts per lesson, so every lesson taught anywhere can improve the lesson. Taken from the French scheme, whose author changes each lesson after she runs it.
- Reads and saves fall back cleanly until 403 is applied, so the deploy can land first. Apply 403 after the PR merges. PR 1658.

## 22 November 2026: the school page opens on Next up, and the photo reader keeps every date

- The school page is three parts: Next up (one large card, then the next seven days as rows that tick away, overdue held on top, one count line), Add from school (photo first, Type it in beside it), and one fold for the week grid, routines and forwarding. Rule in lib/school/next-up.ts. Mobbin: Future Pro, Givingli, Slack Later.
- The photo reader now treats every dated thing as an item (inset days, term dates, non uniform days), has room for twenty items, and keeps the finished items of a reply that was cut short. A photo that finds nothing offers Type it in.
- The full calendar card now follows the server after a refresh, so a photo add shows in the list without a reload.
- Scripts: phones, something online and big feelings have their own picture book tiles (Higgsfield, 2.25 credits, Justin said yes).

## 23 November 2026: weekly ad loop, round 1 closed and round 3 prepared

- Round 1 final read: left out finished on 20 stage checks begun from 9,794 reached, 2.0 per thousand at £1.39 a check (£27.89). It stays the control. No signups from any card. Round 2 was never loaded, so nothing to read.
- Round 3 (Justin, 22 November: "Prepare round 3") is three cards against left out, one mechanic each: one line of the free script (`r3-left-out-line`), the founder in the first person on a plain card (`r3-founder-origin`), and moment then reassurance then the free thing (`r3-left-out-seen`). Deck `2026-11-23-round-3`, pack `content/packs/2026-11-23-round-3`. Gate passed, no new scene, no credits spent.
- Card 1 shows the NOT THIS line because the first SAY THIS sentence cannot be cropped whole at any phone width. Card 3 is one card because the uploader has no carousel. Both are Justin's to overrule.
- Nothing loaded, nothing spent. Suggested split £10 a card over 7 days; an even split needs one ad set per card, which the uploader does not do yet.
- Competitors: nobody in the UK library says our lines. Ten long runners from the 22 November read are in the swipe file and six are on the watchlist.

## 23 November 2026: the Monday LinkedIn pass wrote two posts, not three to five

- GDC 060 (EU KIDS Act, recruit strangers) is written for the first time; the 16 November pass claimed the number and left no copy. GDC 067 (YouGov, 77 percent back the ban and split 45 to 46 on whether it works, start an argument) is new.
- Two because post-picker found no free slot before 9 December under the three a week rule, and the reserve was short only of argument posts and anything on the ban. Australia one year on was dropped: esafety.gov.au returned 503, so no figure could be read at source.
- The KIDS Act feedback window closes 3 December, not 26 November. 060 still needs a slot Justin has to free. PR 1669.

## 23 November 2026: GDC 062 and 063 approved

- Justin: "062 and 063 approved". 063 goes Mon 30 Nov 08:00, 062 Mon 7 Dec 08:00.
- Recorded in the post register only. The radar pipeline approve gate needs a pack at ASSETS READY, and neither pack reached Claude QA (only the Evidence Reveal motion files are in Drive), so the pipeline status was left as it is rather than forced.

## 23 November 2026: Monday radar, hints not answers (GDC 065, 066)

- Two findings survived: Stanford SCALE's November review of 52 controlled studies of AI and schoolwork, and RAND's survey of what US parents tell teenagers about AI and homework. Both PDFs read in full, 22 claims verified. Nine candidates killed, reasons in `content/research-radar-log.md`.
- The review contains a trial where answers beat hints, against the one our hint card and script 261 rest on. The pack opens on that. Whether to soften the script's "why it works" and the migration 263 row is Justin's call; nothing in the product was changed.
- The routine's stored brief still says to open on the question. The 11 November analytics say named body and finding first, so the posts follow that. Pack `content/packs/2026-11-23-hints-not-answers/`. PR 1668.
### 23 November 2026: Oak call, lead with PSHE plus parent engagement for trusts
- Oak's partnerships lead: EdTech now enters schools at trust level, where gatekeepers hear from 10 to 20 companies a week. Lead with what few do, PSHE and parent engagement, not "a new product". Oak's API is free for commercial use and updated for the latest RSHE. A case study tier opens once pilots are running. Notes: `plans/2026-11-23-oak-call-notes.md`.

## 23 November 2026: adding a school reminder is first on the page, any day, and reminders go at 4pm and 7:20

- Justin: adding should be easy and one of the first tasks; he could only choose today; default reminders 16:00 the day before and 07:20 that morning on the phones.
- "Add a reminder" sits under the page heading. The sheet has a day strip (Today, Tomorrow, twelve more days, then Another date) and opens on tomorrow; the week card's "+ Add reminder" was locked to today and now uses it too.
- Reminders moved from 17:00 and 07:05 UTC to 16:00 and 07:20 UK time all year: each schedule fires at both UTC hours and the route sends only in the London hour. Plan: plans/2026-11-23-add-reminder-easy.md.

### 23 November 2026: pupil booklets at three levels, and a support mat
- Every module's booklet now prints as Expected, Adapted (word box, reasons started) or Inclusion (four cards, point and colour, no writing), plus a support mat for every two pupils. Taken from the French scheme's tiered printouts. Generated from the lesson row, so no new content. Plan: `plans/2026-11-23-booklet-levels-plan.md`.

## 23 November 2026: the homework film says 4pm the day before

- Justin asked for the one headline re-cut after reminders moved to 4pm (PR 1670). All three screens were re-recorded from the current app, so the card, the confirmation and the headline agree. Both cuts are now 36.7s; captions and the LinkedIn list updated. Two stale "night before" lines on the school promo card and the letterbox went too.

### 23 November 2026: schools reference pages fold behind a summary, and pilot emails 3 and 4
- The staff briefings, safeguarding crosswalk, parent pack, philosophy and run sheet now open on a summary card and jump chips, with every section folded in one shared `RefFold`. Printing opens every fold, so paper keeps the full text. On a phone they are now 3 to 7 screens instead of 18 to 28; the run sheet opens on Teach this lesson.
- Pilot emails 3 (three weeks in, one reply question) and 4 (before the term ends: record, choice, a quote and a trust name) are written and saved as Mailchimp drafts for Justin to add to journey 762. Pilot email 1 in the paused journey now carries the parent pack line.

## 16 November 2026: weekly ad loop, round 1 read, left out wins, round 2 is left out by school year

- Round 1 (live 12 to 16 November, £19.96, 16,542 reached): left out began 8 stage checks from 6,438 reached, 1.2 per thousand at £1.78 a check, every one after the one tap question one went in on 14 November. The other five began none and are retired. No signups yet from the 8, so the next leak sits after the check.
- Round 2 is left out three times with only the school year changed (Year 5, 6, 7; proven rule 10), left out itself as the control. Gate passed, the old hallway scene reused, no Higgsfield credits spent. Not loaded: the three link codes must be made on the founder links page first, and loading is Justin's word.
- Competitors: Kairoo has no live UK adverts (its generated families never reached 30 days). Four Qustodio adverts past 80 days logged. Nobody says what left out says.

## 16 November 2026: Watch together booking built (migration 400, not applied)

- On Justin's go ahead, with his five answers: book from a film page (three suggestions plus another time), the film leads the child's page at the time and never before, a parent push fifteen minutes before, one daytime buzz for the child (never after 19:00), change or cancel, a calendar file with no child's name, and a Tonight prompt after watching (stored on parent_lessons).
- Home gets its own small card for a booking in the next hour or one that slipped by yesterday, because next up only draws after the day's habit is ticked.
- Every read answers "no booking" until migration 400 is applied, so nothing changes for families before then. Applying it and deploying wait for Justin. PR 1589.

## 16 November 2026: 1.4 keeps its line, old labels stay, and a second voice test

- Justin: leave "They'll remember it forever." in 1.4, and leave the dashed labels inside the old drawings for now.
- Tamsin on Seed Audio does not sound real enough to him. Nine samples of the same 1.3 opening on ElevenLabs and MiniMax wait for his ear in `content/child-films/voice-test-2/`, at about 0.15 credits each. A real recorded voice is the other option. PR 1588.

## 17 November 2026: migration 400 applied and read back

- On Justin's yes. Live: watch_bookings with row level security on, no browser grants or policies (service role only), four indexes, no rows; parent_lessons.after_prompt set on all ten films. Last migration recorded: 400_watch_bookings.
- The booking code reaches families only when PR 1589 merges and deploys. Next: one live test, a film booked a few minutes ahead for one child.
### 16 November 2026: one post ready a day, research card by default

Justin: aim for one post ready every day; he posts 3 or 4 a week and picks
which. Every evidence post now gets a research card by default (still plus
14 second motion, plain paper, contrarian headline inside what the study
shows); text only only when there is no single clean finding. Media is
attached to the existing Metricool draft through mediaToAttach, never
scheduled without his time. GDC 057 and 059 approved with cards (PR 1591).

## 16 November 2026: DiGi's films re-voiced in Isla

- Justin heard Tamsin as not real enough and chose Isla on ElevenLabs by ear (sample 5 of nine). All five first release films (1.1, 1.2, 1.3, 1.4, 1.5) are now in Isla's voice in both public shapes, subtitles rebuilt. DiGi's voice row in `digi-squad/README.md` now names Isla.
- Every line was transcribed against its words before the build; one 1.4 line ("Screens" heard as "Screams") was redone.
- About 52 credits for the four, so roughly 0.25 a line, not the 0.15 quoted. Nothing uploaded. PR 1588 and its follow up.
## 17 November 2026: the fridge star chart, redesigned to match the app

- Page one is now a fixed A4 page in the child app's look: rainbow, "My five a day", a full day planet row, the Planet Friends trail with the child's real full days, the goal line at the top, and three panels (where our phones sleep, outside this week by season, end of the week tally with a QR to the paper week entry).
- The old "4 stars in a day = one Planet Friend" was wrong. The sheet now imports the real ladder (2, 10, 22, 38, 58 full days) and says full days count when ticked in the app.
- SheetScale measured zoomed pixels and clipped sheets on phones; fixed for every sheet. Plan in plans/2026-11-17-fridge-star-chart.md.

## 17 November 2026: the Scripts page is three shelves, and every script looks after the parent too

- Justin: show the scripts that answer what they have said, the ones for their age, and the ones done that are worth a revisit, "super easy to understand", and make scripts supportive of parents' own struggles.
- The page went from eleven sections to three shelves under the search: Picked for Teo (lead plus two, each saying why: a raised worry, a check in dip, a device, the age), Worth another go (new: did not land, used three or more weeks ago, or read and never tried; never anything marked not needed), and For Teo's age (nine tiles, chips, the rest one tap away, other ages folded). One paywall card, not two. A star tally of conversations had, counting up, no streak.
- Every script reader gets "If this one is hard for you": calm first, pick the moment, practise once, repair, guilt, the other parent. Same six lines on every script; UI support copy, not a script, so not in the scripts table.
- Why: spaced review (Cepeda et al 2006), practising with your own child and carer consistency (Kaminski et al 2008), no streaks (Silverman and Barasch 2023). `lib/scripts/shelves.ts`, `scripts/check-script-shelves.mjs`. No migration, no API change.

## 17 November 2026: migration 400 applied and read back

- On Justin's yes. Live: watch_bookings with row level security on, no browser grants or policies (service role only), four indexes, no rows; parent_lessons.after_prompt set on all ten films. Last migration recorded: 400_watch_bookings.
- PR 1589 (the booking code) merged the same morning, so booking is live once main deploys. Next: one live test, a film booked a few minutes ahead for one child.

## 17 Nov 2026: three personal LinkedIn posts a week, from Wed 18 Nov

From Wednesday 18 November, no more than three personal LinkedIn posts in a calendar week. Research, review and pack writing carry on daily, building a reserve, with no publication forced. Claude assigns no dates and schedules nothing; Justin does. The suggested order already fits: 058, 059, 057 this week; 060 (if approved), 055, 056 next. The engagement audit sheet is "GDC LinkedIn Engagement and First Comment Audit" in the Approval Desk; comment and first comment status stays UNVERIFIED until someone reads the comments themselves (no LinkedIn or Metricool access here).
## 17 November 2026: KS2 French gets our Planet Friends, Nova and Bloop

- The scheme's two class toys (shy Marie, loud Pierre) are played on our French pages by Nova (quiet, Still register) and Bloop (loud, the Stage 2 friend for ages 8 to 10). Mapped as fr.json is read (`schools/lib/languages/fr-friends.ts`), never in fr.json, which the nightly sync rewrites. `scripts/check-french-friends.mjs` (in CI) fails if either toy's name reaches a page through our copy.
- Whisper or shout: GSAP moment on the approach page, beside each lesson's song, and as two buttons in the teach bar that stand the friend in the corner of the board. Approved art only; dressed up art is a brief in the visual system, section 17, waiting for Justin.
- Her decks and PDFs still say Marie and Pierre (15 slides, the Je peux unit). Slide titles are listed verbatim. Teacher note proposed, not shipped. PR 1609.
- Same day, Justin's answers: Nova and Bloop confirmed; the slide note ships, built from whichever friends are chosen; French touch art made (Nova scarf `08aaf000`, Bloop beret and neckerchief `15bb5703`, 4 credits, image to image from the approved cutouts, all on model). French pages only. PR 1609.
## 17 November 2026: the passport shows the real book and the five Planet Friend stickers

- Justin: the order card showed a yellow "Digital Literacy Passport" photo and generic stickers. Now drawn: the app's burgundy cover (PassportCover, shared with the stage check and the shop) and one Planet Friend sticker per stage (StageSticker), earned ones in colour.
- One rule, screen and paper: lessons passed, talks done, big check passed (lib/pathway/stamped.ts). Moments, stars, balance and outside time show as "along the way" and earn nothing, since the code does not read them. Adding any to the rule is Justin's call, asked in the PR.
- Stage done: both sides see "Stage done, sticker added to your passport" with what the sticker says was learnt, and print a colour A4 sticker sheet (parent and child routes). Guard: check-stage-stickers. PR 1608 (1603 merged as the claim only).
## 17 November 2026: the 1.5 remake and its parent film are built

- Real, pretend, and made by a computer (the dog on the moon), as the school lesson ks1-03 teaches it. Keeps the live keyword, catchphrase and pause cards, so it swaps in with no database change. It deliberately teaches asking, not spotting fakes by clues.
- 14 pictures (one redraw so the upside down book reads), 36 lines in Tamsin's voice checked by transcript (one redone for a stutter). 43.3 credits against 53 quoted.
- The parent film's real screen is the Book a time panel. Nobody has listened with sound on; not swapped into the product. `content/child-films/parent-reaction-series/1.5-real/`. PR 1604.
## 17 November 2026: the walkthrough checked against the week, post 1 re-laid, three new posts

- Justin asked for a high quality walkthrough of every service. The 20 post run (PR 1475) already covers them, so this pass checked it against the week's changes and built posts only for what is new: the school letter catch, the stage check's twelve, watch it together ("New in Guided Childhood, 1 of 3").
- Post 1, due tonight, showed the retired worry question. The current screen was laid over those 4.8 seconds of the finished film (the source captures are on the Mac); the old render is kept as `-v1`.
- Two stage check tiles no longer promise "safe". Posts 4, 10 and 18 have stale lines, listed with fixes. PR 1611 merged with only the claim; the work is in its follow up. `plans/2026-11-17-instagram-walkthrough-plan.md`.

## 17 November 2026: the RSHE mapping page leads with the answer
Justin: Apple UX, obvious to a teacher arriving from the schools email. The page now opens on "All 57 online requirements are taught" with a ring, then three steps, then a Primary or Secondary switch, a search and strand links; KCSIE and the lesson hooks fold away and open when printed; one "how we check" line at the foot. Same data and guard. Plan: plans/2026-11-17-rshe-mapping-clarity-plan.md.
## 17 November 2026: the 1.4 remake and its parent film are built

- Notice the uh oh feeling, turn it over, go and tell, with the live keyword, catchphrase and pause cards kept. The upsetting thing is never shown; the grown up says the never in trouble promise on the pause card.
- The parent film ends at the NSPCC helpline for adults (0808 800 5000, checked on nspcc.org.uk; no hours given, their own pages disagree). 38.1 credits against 46 quoted.
- Found and fixed in the build: the fade at a picture change used to fade the whole frame, so hooks and captions flickered in every portrait and parent cut. Now only the picture fades. 1.5 and 1.6 are re-rendered with the fix. PR 1612.

## 17 November 2026: the passport record book, every step on paper

- Justin picked the paper record book from four options ("a book like a swimming passport"). One A4 page per stage: the Planet Friend sticker spot and its line, then every lesson, talk and the big check on its own row, with how to do it, a tick and date when the app has it, and a grown up's initials. A sign off line ends each stage.
- The rows are only what the stamp counts, read through the same functions as the page count, so the paper never disagrees with the app. Route `/dashboard/keepsakes/passport-print/record`, linked from the earn card and the order card. Parked: the child's page view, gentle reminders, the evidence check. PR 1616.

## 18 November 2026: the child's passport page, the weekly email reminder, and honest evidence

- Justin: "do them in order as you recommend". (1) The child's passport shows their page step by step in kid words, next step lit, earlier pages as gentle catch up; talks show as "A talk with your grown up", never the script title. (2) The reminder rides the weekly email (pace line plus print the steps), no new push, because the 17 October no new push decision stands. (3) Five evidence claims were verified at source. Two were corrected: skills go with more risk, not less, and enabling parenting goes with more opportunities and more risks. The passport now says plainly that no study shows a programme like this makes children safer. Guard: check-stage-stickers. PR 1623.

## 18 November 2026: the remade 1.6, 1.5 and 1.4 are live in the app

- On Justin's "Go ahead with all". Each film's four segments point at new uploads (checked to serve byte for byte), with new durations and a plain poster.
- 1.6's row described the old film and claimed growth during sleep as fact: title, keyword, knowledge intention, misconception, parent note and both pause cards now match the remake. 1.5 and 1.4 already matched.
- Rollback values and the new links: `content/child-films/parent-reaction-series/app-swap-2026-11-18.md`. PR 1618.

## 18 November 2026: the Stage 2 film 2.1 is built, and kept out of the app

- Strangers in games, with Bloop, from the 2.1 script plus the "let's chat somewhere else" move from the verified Roblox pack. 19 pictures, 37 lines checked by transcript (three redone). 70.5 credits against 71 quoted.
- Not in the app: as the only active Stage 2 lesson, finishing it would award the whole Stage 2 passport (`/api/parent-lessons/complete`). Waits on Justin: more Stage 2 films first, or a passport rule change. PR 1618.

## 18 November 2026: 2.1 goes to YouTube and the family account only

- Justin's choice. No `parent_lessons` row for 2.1 and no change to the passport rule, so one Stage 2 film cannot award the whole Stage 2 passport. Revisit when more Stage 2 films exist.

## 18 November 2026: 2.1 is live on YouTube

- https://youtu.be/UPbRSQzYEGg on the Guided Childhood channel. Public, made for kids, English subtitles and the thumbnail on. Published only after YouTube's checks came back clean. The copy is in `2.1-pieces/youtube-post.md`.

## 18 November 2026: the remade films come out, and the format is on hold

- Justin made 2.1 private on YouTube. He said the voice was too AI, the sound wasn't right and there was no animation. The app's 1.6, 1.5 and 1.4 went back to their old films the same afternoon, restored from the rollback table in `app-swap-2026-11-18.md`.
- No more films in the stills plus AI voice format, and nothing public until Justin has heard it. Next: settle a real voice and some movement before any remake.
## 18 November 2026: French lesson films, pilot started; both curricula reviewed
Justin: rebuild her lesson video with our friends, better animation, correct voices, for every lesson. Pilot on Year 3 Colours lesson 1: native French word recordings (Higgsfield, ElevenLabs engine), Nova whispers and Bloop shouts in a code animated film, our own song kit for ACE-Step (the rap program, his choice). 2.55 credits so far. Reviews of the digital (about 7.5) and French (about 8 for Years 3 and 4) schemes are in plans/, musts await his yes. Plan: plans/2026-11-18-french-lesson-films-plan.md.

## 18 November 2026: the top of the Quests page, redrawn

- Justin, with a screenshot: the top "needs expert attention, better Happy News styled icons, easier to use".
- The caught up strip now has a drawn trophy on a sage plate, the headline "All caught up", and one row of remind chips, each showing the child's buddy.
- Each child row now shows the buddy the child picked in their own app, on their stage colour (`components/quests/ChildBuddy.tsx`, the same picture the child sees). Then name and "0 of 10 today", a full width bar, and stars in words ("No stars yet this week", not "0 = 0 min").
- The card heading is now "Today". No data, API or child app change.

## 18 November 2026: Pebble has a voice, and 1.4 is the animated pilot

- Pebble is Kaia on ElevenLabs (preset bb9db352), picked by Justin by ear from five. DiGi stays Isla. No background music in any child film.
- The 1.4 animated script is merged from a four lens panel (curriculum, children's TV, safeguarding, animation) in `content/child-films/animation-pilot-1.4/`. It waits on Justin's budget: key moments about 81 credits, or the full plan about 110. PR 1626.
### 23 November 2026: a school code now opens a three step start page
- Typing the code used to land on the whole 34 lesson map. It now lands on /start: pick your year, then one Teach button for that year's first lesson, with the rest listed in teaching order. The year is remembered in the browser only. Pilot codes see their lessons straight away. Flagged first lessons point to the staff briefing.
- Emails 3 and 4 are saved as Mailchimp templates for journey 762. The API is read only for journey steps (Allow: GET), so Justin adds the two steps in the builder.

## 23 November 2026: the app safety week moves on, and goes out automatically

- Justin: "push to next week, just do next weeks if any full, no want you to do it auto". Both accounts were full this week.
- Family posts take next week's anchor days (30 Nov, 2, 4, 5 Dec); Sunday 29's social-week batch builds their cards, and the skill now reads approved moved posts before the sheet. LinkedIn keeps three a week; 30 Nov and 7 Dec weeks are full (060, 059; 062, 063, 067), so L1 Mon 14, L3 Wed 16, L2 Fri 18 December. Pins 1, 3 and 5 December.
- Automatic, not Justin posting: through Metricool, the scheduler that already holds both accounts. Claude has no Metricool access, so a Metricool API key was asked for; until then the pack file is the handoff, with scheduling and automatic publishing approved for these posts only. Earlier rule (17 Nov, Claude schedules nothing) stands for everything else. PR 1694.

### 23 November 2026: Schools v3 keeps running
- 615 of the 634 schools in the Schools v3 series also got the 21 November invitation that ends "I will not write again". Justin chose to keep v3 running anyway (S03 is queued for 384). If complaints or unsubscribes rise, pause journey 749 first.
## 23 November 2026: GDC 060 and 067 approved, 060 swaps with 063

- Justin: "approve 060 swap with 063, 067 approved".
- 060 (EU KIDS Act) takes Mon 30 Nov 08:00 so it lands before the feedback window closes on 3 Dec; 063 moves to Wed 9 Dec. 067 goes Fri 11 Dec, the next free slot under the three a week rule.
- Full slot table in content/metricool-reconciliation-2026-11-22.md. Metricool changes go through ChatGPT; nothing is scheduled from here.


### 23 November 2026: schools outreach runs itself every Monday
- A Monday task adds up to 30 schools (GIAS register plus the office email each school publishes) and schedules their invitation (Tuesday 09:30) and one reminder two weeks later. These are replicated regular campaigns, because the Mailchimp API cannot build flows. The first 34 go Tuesday 24 November, with the reminder on 8 December.
### 23 November 2026: the one email a week guard runs in CI, and learns the kinds it missed
- `scripts/check-email-guard.mjs` had 5 failures on main. All five were the guard behind the code, each opt out traced to a decision of Justin's: the topic course (series, 16 November), the heavy lesson heads up (transactional, sync plan C), and the ask kind ("skip the rule", 16 November). No code changed.
- The guard now reads the email kinds from the type, so a new kind can no longer opt out unseen (ask did, for a week). It also holds the caps that make skipping the floor safe: seven emails a course, three asks an account, two a lead.
- Runs in the concern-guards job of wiring.yml. PR 1695.
