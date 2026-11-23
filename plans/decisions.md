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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-19 | 158 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

- 2026-11-09 · 9 November 2026: tracking approved, bridge b reversed for delivery records · `plans/decisions-archive/2026-11.md`
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

## 23 November 2026: the Monday LinkedIn pass wrote two posts, not three to five

- GDC 060 (EU KIDS Act, recruit strangers) is written for the first time; the 16 November pass claimed the number and left no copy. GDC 067 (YouGov, 77 percent back the ban and split 45 to 46 on whether it works, start an argument) is new.
- Two because post-picker found no free slot before 9 December under the three a week rule, and the reserve was short only of argument posts and anything on the ban. Australia one year on was dropped: esafety.gov.au returned 503, so no figure could be read at source.
- The KIDS Act feedback window closes 3 December, not 26 November. 060 still needs a slot Justin has to free. PR 1669.
