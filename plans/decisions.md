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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-23 | 179 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-11-23 · 23 November 2026: weekly ad loop, round 1 closed and round 3 prepared · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: the Monday LinkedIn pass wrote two posts, not three to five · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: GDC 062 and 063 approved · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: Monday radar, hints not answers (GDC 065, 066) · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: adding a school reminder is first on the page, any day, and reminders go at 4pm and 7:20 · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: the homework film says 4pm the day before · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: 403 and 404 are live, 404 had no ledger row · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: the app safety week moves on, and goes out automatically · `plans/decisions-archive/2026-11.md`
- 2026-11-23 · 23 November 2026: GDC 060 and 067 approved, 060 swaps with 063 · `plans/decisions-archive/2026-11.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 24 November 2026: the funnel read honestly, and ten parents before more building

- Justin: no sign ups, doubt about whether the app helps. Read: tracking since 19 Nov works end to end (a test reached q2 and landed in PostHog); no real visitor has yet answered question one. Ad arrivals open straight on the age question with no promise or brand above it.
- Each stage check step now counts once until it changes; every visit had logged two intro events, doubling the top of the funnel.
- Justin, "3 yes": a visit from a post or ad now sees the intro's promise above question one: "Free. Three questions. No sign up. You get the words to use tonight." Measure: share of ad visits that reach q2.
- Next: ten parents who are not friends or family, five ten minute chats (messages in content/packs/2026-11-24-ten-parents). Building pauses until those answers are in.
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

## 24 November 2026: the founder voice review; the radar commits and register only branches merge themselves

- New `.claude/skills/founder-voice-review` runs on every outward word (posts, comments, newsletter, emails, school copy, site copy, scripts, visual text): the ai-tells guard, the ear, the rhythm meter, true scenes and privacy, the read aloud, then a stored VOICE REVIEW verdict. It is not a detector and never says who wrote a text.
- New `content/brand-story/voice-bible.md`: his positions, his research moves, his words, and an append only corrections log.
- The one banned list is `scripts/check-ai-tells.mjs`; it gains the phrases the three editorial sources agree on and stiff sentence openers. QA now runs it over Instagram, Facebook, the newsletter and the script too.
- Justin, "1 yes 3 yes": the radar's prompt now commits from a message file in single commands; a push to claude/radar-* that changes only the registers and passes the tests and gate is merged into main by radar-gate.yml. Decision 2, Justin "yes to family voice": the family account speaks as "we", Justin and Natalia, with Natalia's ear as the test.
### 24 November 2026: Oak API connected, first gap check done
- Justin's Oak key is saved as a network secret and the open API answers. The read only check: Oak RSHE has 15 online life units (71 lessons) in Years 1 to 4, 7, 8, 10 and 11. We go further on AI companions, algorithms, gaming and odds, images and sextortion, the ban, and making and ownership. We also cover Reception, Years 5, 6 and 9 and the sixth form, which Oak's online units do not. This is from titles only; nothing public until lessons are read. Plan: `plans/2026-11-24-oak-rshe-gap-check.md`.

- 2026-11-24 · Every film uses the walkthrough engine and structure (Justin): parents and schools alike, the passport and two apps films included, built as a cut in `videos/2026-10-09-digi-shorts` (problem, turn, numbered real screens, end card, music, TikTok cut). Written into `product-shorts`. The teacher start film was made with a one off recorder, so it is re-cut in the engine before it is posted. PR 1712.

## 24 November 2026: the ten verification checks are required fields of every new research review

- A review stored from 25 November carries `verification` with ten answers (original source, publication date, statistics and denominators, sample and population, design, cause or association, counter evidence, strongest objection, practical implications, claims not to make). `pipeline.mjs review` refuses one missing or thin; `gate.mjs` checks the register for it.
- The labels come from config/content-engine.json; a test fails if the settings list a check the code does not ask for.
- The handoff now tells Stage 2 the design, sample, cause or association wording, the objection to concede and the claims never to make. Rule lives in scripts/radar/verification.mjs.

## 24 November 2026: one handoff manifest for ChatGPT, seventeen fields per post

- `scripts/radar/post-manifest.mjs` writes `content/research-register/handoff-manifest.json`: every unposted GDC post (radar and completion queue), with the brief's seventeen fields, versioned by content hash. It refuses to write if a field is missing or an incomplete entry carries a permission.
- A post may become a draft only when complete (pack and required assets verified in Drive) and editorially cleared (QA, Claude's pack review, the new founder voice review via `pipeline.mjs voice`). Scheduling then follows standing permission D; automatic publishing stays off. A new pack version clears both reviews.
- Fixed: metricool.mjs set schedulingPermitted twice (stage 2), so a post's own state was ignored.
- The afternoon run copies it to the METRICOOL HANDOFF folder as `GDC HANDOFF MANIFEST, CURRENT.json` after everything it names reads back; START HERE tells ChatGPT to read it first.

- 2026-11-24 · Mumsnet replies weighed (feedback-filter): the ten parents post read as machine written, buried the ask, gave an unknown link, named no real scene and led with "the words to use tonight", which a parent rightly called pointless. Adopted: ask first, a domain to type, one true scene, who Justin is, and lead with the star quest (THE-STORY section 10), not scripts. Rewrite in `content/packs/2026-11-24-ten-parents/mumsnet-rewrite.md`; table in `plans/2026-11-24-mumsnet-replies-weighed.md`.

- 2026-11-24 · A Mumsnet parent caught a script line a child would argue with ("phones sleep in the kitchen, the bedroom is for sleep"). Rewritten everywhere it showed (stages.ts, script card, two static pages) with no metaphor and the adult included ("mine too"); the blue light claim in its "why" removed. New rule: script lines are read to a child of the right age and the first comeback recorded before they ship; a full script pass is parked. PR 1714.

## 25 November 2026: school dates land in the right year, and passed dates are not ticked

- Justin: an event showing "364 days late". He had snapped a calendar that prints 2025; nine entries went in a year back and twenty five with a weekday but no year were guessed as 2027, on the wrong weekday.
- `lib/school/fix-years.ts`: a written weekday decides the year, a printed year is kept, and any date already gone is marked past. The snap card shows those greyed and unticked and says an all past letter looks like an older one; forwarded emails do not add past items.
- The 39 entries from that snap were dismissed by hand, with his yes. Plan: plans/2026-11-25-school-dates-right-year.md.
## 25 November 2026: ready before 16 leads; the bedroom script gets its comebacks

- Justin, after the Mumsnet thread and two reviews: lead with the curriculum and the Passport, "ready before 16". This overrules THE-STORY section 10 (star quest leads every list) and the 24 November star quest decision.
- Trial line always: "Free for 4 days. No card, so nothing is ever charged unless you pick a plan." Stars and timer stay, shown third.
- In the app a daily allowance is the default; earning minutes with jobs is a parent switch. Trust is sources, schools and "the dad who did the homework", never expert status.
- Bedroom script rebuilt with the child's own reason as a blank and three comebacks (do not disturb, alarm, you have yours) in the scripts table, migration 405. "Tend to sleep worse" cites Carter and others, JAMA Pediatrics, 2016, as an association.
- Build order: result page after PR 1718, homepage, earning default. Plan: `plans/2026-11-25-ready-before-16-plan.md`. PR 1719.
- 2026-11-24 · The page reloaded itself on every first visit: sw.js calls clients.claim(), so controllerchange fired on landing and PwaRegister reloaded. Each new visitor saw the stage check twice and PostHog counted them twice. Now it reloads only when a newer worker replaces one already in control. Found in the Mumsnet visits; confirmed on live (2 loads) and the preview (1 load). Bedroom line also fixed on the printed sign, passport and craft pack. PR 1717.
- 2026-11-24 · Stage check result says what happens next: three steps (tonight, save the plan, then jobs, timer, lessons and DiGi) and one button under the headline. Mumsnet visitors who reached the result read and left (1 in 10 went on); the one who wrote back was "not sure where it was heading". The number to watch is result to Save the pathway. PR 1718.
- 2026-11-25 · Stage check result rebuilt for ready before 16: headline, what this stage means (the stage's own focus and device lines), three things a child at this stage should understand (lesson outcomes quoted word for word, `lib/content/stage-outcomes.ts`, held by `npm run stage-outcomes-guard`), one conversation for this week with a dashed gap for the child's own reason, what happens next (tonight, the trial line, lessons build the Passport) and its one door, then What you get in Justin's seven line order. None of it shows when helpFirst. Sticky bar carries the full trial line and steps aside over the What happens next card. Also inside chips cut (the list names them); the stars fix is now "Getting the balance right"; the Passport line says lessons go in the Passport, since the code stamps a stage page, not each lesson. PR 1719.

### 25 Nov 2026: AI phrases out of the site and app copy
Justin: "remove AI phrases from everything we do". Twenty lines of live copy rewritten (the "not X, it is Y" contrasts, "the timer is the rule, not you", "no pressure, no catch up, just today"). The timer line now uses his approved wording. `check-ai-tells.mjs --site` sweeps every string and JSX text in app/, components/ and lib/ on every push. It skips DiGi prompts, dev pages, children's lessons and legal pages. Migration 406 does the same for the scripts and the lessons hub, as replace() on the exact old words, so a row that has already changed is left alone. It leaves the safeguarding wording and the curriculum lessons, which are reviewed once a term. PR 1719.

### 25 Nov 2026: homepage rebuilt, ready before 16 leads
The homepage goes from thirteen sections to six. The new order: the hero ("Get your child ready before 16"), what children learn at each stage (the lessons' own "I can" outcomes from stage-outcomes.ts), the Passport, getting the balance right (allowance first, earning optional), the dad who did the homework with sources and schools, then prices with the trial line. Every button reads "Find my child's stage" except on the price cards. The DiGi band, the moment cards, the chatbot band, how it works, inside the platform, safety, and what changes and when are all cut. The founder heading I could not find in founder-context.md was replaced. PR 1719.
