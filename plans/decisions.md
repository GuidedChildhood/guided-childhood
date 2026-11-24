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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-22 | 170 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-11-22 · 22 November 2026: design tells guard, and the app safety pages (Phase 2) · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: the school parent pack (Phase 3) · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: the iPhone service films, four, from the real app · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: SEO Phase 4, the handover guide and the gum join · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: the homework reminders film and its posts · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: scripts reach the parent at the moment · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: "Homework on screens" becomes "Homework and school" · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: migration sweep, 397 ran but was never recorded · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: GTA VI approved, the week of 23 November cut to three · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: search joins the review board, Speed Insights, IndexNow · `plans/decisions-archive/2026-11.md`
- 2026-11-22 · 22 November 2026: the school page opens on Next up, and the photo reader keeps every date · `plans/decisions-archive/2026-11.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

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

## 23 November 2026: 403 and 404 are live, 404 had no ledger row

- Both were applied by the sessions that wrote them. 404 was recorded, not re-run: the script wording, the `expert_knowledge` finding and both `kid_homework_help_uses` columns with their comments are already exactly what the file asks for.
- 404's two text updates are guarded on the old wording, so a no-op is indistinguishable from applied unless you look. Both were checked from the other side: the old strings are gone and the new ones are present, one row each.
- The Bastani knowledge row's embedding is null, which is 404 doing its job. The daily sweep at 06:40 UTC (`/api/cron/knowledge-embed`) refills it. Until it does, DiGi cannot reach that row by vector search.
- Ledger now agrees with the repo to 404.
### 23 November 2026: schools reference pages fold behind a summary, and pilot emails 3 and 4
- The staff briefings, safeguarding crosswalk, parent pack, philosophy and run sheet now open on a summary card and jump chips, with every section folded in one shared `RefFold`. Printing opens every fold, so paper keeps the full text. On a phone they are now 3 to 7 screens instead of 18 to 28; the run sheet opens on Teach this lesson.
- Pilot emails 3 (three weeks in, one reply question) and 4 (before the term ends: record, choice, a quote and a trust name) are written and saved as Mailchimp drafts for Justin to add to journey 762. Pilot email 1 in the paused journey now carries the parent pack line.

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

### 23 November 2026: a page for trusts and MATs
- New public /trusts page, built on Oak's advice that EdTech is bought at trust level. It covers the two jobs (online RSHE, parents), each school keeping its own code and record, a free pilot in two schools first, and pricing per school on application with the single school range shown. It claims no trust wide dashboard. Linked from the pricing trust band and the pilot page. OPEN_PATHS is now 15.

## 24 November 2026: eligibility is a status, not a date; every pack is the full pack

- Justin: remove the rule that START HERE must be dated today; verified stories stay eligible until completed, withdrawn, superseded or on HOLD.
- START HERE now says an older date does not stop production. The queue was already status based; the "more than a day old, ask Justin" line was the block.
- Every pack carries LinkedIn, first comment and source, Instagram, Facebook, a visual brief per platform and motion where appropriate. QA holds packs without them.
- Posts outside the radar queue sit in content/research-register/completion-queue.json (060, 067 approved; 065, 066 reserve).
- Three personal LinkedIn posts a week; the rest reserve. Detail in scripts/radar/README.md, "Eligibility and completion".

## 24 November 2026: one settings file for the content engine; ChatGPT may schedule cleared posts

- config/content-engine.json holds cadence (3 to 4 a week), formats (Instagram and Facebook where appropriate), scheduling (next free date, then every other day), permissions A to F, the pause switch, the newsletter and the daily report. Code reads it through scripts/radar/settings.mjs.
- Justin's addendum: ChatGPT has standing permission to schedule editorially cleared posts; automatic publishing stays off; ChatGPT's 14:30 task owns the one daily report.
- Plan and audit: plans/2026-11-24-content-engine-plan.md and -audit.md.
