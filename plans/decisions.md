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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-24 | 185 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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
- 2026-11-24 · 24 November 2026: the funnel read honestly, and ten parents before more building · `plans/decisions-archive/2026-11.md`
- 2026-11-24 · 24 November 2026: eligibility is a status, not a date; every pack is the full pack · `plans/decisions-archive/2026-11.md`
- 2026-11-24 · 24 November 2026: one settings file for the content engine; ChatGPT may schedule cleared posts · `plans/decisions-archive/2026-11.md`
- 2026-11-24 · 24 November 2026: the founder voice review; the radar commits and register only branches merge themselves · `plans/decisions-archive/2026-11.md`
- 2026-11-24 · 24 November 2026: the ten verification checks are required fields of every new research review · `plans/decisions-archive/2026-11.md`
- 2026-11-24 · 24 November 2026: one handoff manifest for ChatGPT, seventeen fields per post · `plans/decisions-archive/2026-11.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

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

### 26 Nov 2026: daily allowance on by default for new children
Justin chose "On, allowance added". Children added from 26 November with no settings row get the age band base (two thirds of the guide) as free daily minutes. Jobs and stars stay on. A row always wins, including 0. Older children with no row stay at 0, so nobody is handed minutes they never chose. It is applied when the row is read, so the setup step still asks. PR 1723.

### 26 Nov 2026: problem then fix homepage, a lesson per stage to try, parents first
Justin read the research: "Keep parents first". Schools stay a side channel. The homepage now runs six problem then fix sections in his approved order: school teaches, screen time, road to 16, DiGi remembers (back in), school and homework, settings. One real lesson per stage opens at /try/[module] with no account. It is the together deck through getStarLessonForShare, with no teacher or DSL notes, and nothing is recorded. The passport screenshots that showed Teo's name were replaced or deleted. Plan: plans/2026-11-26-problem-solution-homepage-plan.md. PR 1723.

### 26 Nov 2026: result page uses the same six problem then fix cards
Justin: "the starter page really more than homepage". The result page's What you get list is now the homepage's six problem then fix cards, worded for the child's stage. The first card opens that stage's free lesson in a new tab, so the result stays put. Then, on his live screenshots, the six cards moved to the top, straight under the headline, with the lessons' three outcomes inside card one. The conversation and the save button follow. The first screen is unchanged. Justin doubted Mumsnet was a sound basis for changing it, and across all sources (60 days) 181 saw the first screen and 68 started the questions. PR 1723.

### 26 Nov 2026: stage check opens on question one, and reads for every age
Justin: "looks like they need to be 16 so wont work for younger", base it on how apps like Duolingo get sign ups. This supersedes "the first screen is unchanged" above. The 181 to 68 figure was inflated by the reload bug (PR 1717). The research behind the change: Duolingo moved sign up later, Headspace's quiz doubled course starts, and Noom shows a result before asking. So new visitors now land on question one, with one DiGi line on top (three questions, then the stage, free, no sign up). Only returning visitors see the intro card, which means the `stage_check_step` 'intro' event now fires for them alone and the funnel starts at q1. The result lead depends on age: stages 1 and 2 hear "start small, while habits are still forming", stages 3 to 5 keep "ready before 16". The thing they get is called a plan everywhere. The homepage hero is now "From first tablet to first phone", under the ages 4 to 16 eyebrow. The number to watch is still result to account. PR 1723.

## 26 November 2026: after Mumsnet, Justin writes in other people's spaces and Claude only checks

- Justin, "1 yes": forums, groups, school WhatsApps and replies to parents are his own writing. Claude gives prompts, checks facts, rules and privacy, and suggests at most three fixes. `npm run own-words` must show 90 percent of the posted words are his.
- The Mumsnet post passed the guard and sat near his rhythm. New `scripts/forum-tells.mjs` (announced honesty, survey shapes, our tics, product copy, tracked links); `check-ai-tells.mjs --community` fails on them; `rhythm.mjs` prints them everywhere. A test keeps the Mumsnet post failing (wiring.yml).
- Founder voice review gains a genre step; Voice Bible correction logged. The thread is deleted, so no samples. Plan: plans/2026-11-26-community-voice-plan.md, PR 1726.

## 26 November 2026: the Mumsnet three, checked against what other sessions shipped

- Justin, "yes go ahead with all 3 but check". Two of the three were already done by other sessions: the bedroom line is fixed everywhere, and the save line is now Justin's decision of 25 November ("Free for 4 days. No card, so nothing is ever charged unless you pick a plan."), so it stays. The result page already hands over a "Say this" script, after the six problem and fix cards Justin ordered on 26 November; the order is his and stays.
- New: the four part labels on each worry card (Device time, Scripts, Their app, DiGi) looked like buttons and did nothing. Each now opens the line written for that worry in lib/content/proof.ts. A Mumsnet parent said nothing seemed clickable.

## 26 November 2026: the authentic founder writing standard

- Justin's standard is permanent: ten checks before anything is done (founder-voice-review), an editorial watchlist (`content/brand-story/editorial-watchlist.md`, two Reddit threads unreadable), and the Voice Bible labels every source AUTHENTIC, MIXED or GENERATED; only his own words count as voice samples.
- `scripts/radar/openings.mjs` compares openings, endings and house tics with the last posts. It found the backlog's shared moves: invented reflections, "I build a parent tool", "the strongest objection is", a repost ask plus question on every post. QA no longer requires a closing question.
- Backlog: v2 copy for 059, 060, 061, 062, 063, 066, 067 in `content/packs/2026-11-26-backlog-authenticity-review/`; originals kept; 065 unchanged. Nothing to Metricool until Justin approves v2. Plan: plans/2026-11-26-authentic-writing-standard-plan.md.
## 26 November 2026: the result page's Save the plan button shows from the first screen

- Justin: a button always visible to get straight into the pathway. The pinned bar used to wait for 520px of scroll, and the Mumsnet parents read the top and left without scrolling, so none saw a way in.
- `StickyJoin` takes `fromTop`; the result page sets it. It still steps aside over What happens next and at the foot, and never shows for a parent whose answers need help first.
## 26 November 2026: the Sunday DiGi wisdom rebuild keeps the good part of a broken reply

- The ops board showed DiGi wisdom red: the 22 November run failed on both tries with broken JSON at character 3845, so the week's candidates were never written.
- The reply now has 4000 tokens (was 2000), and a broken reply keeps every complete piece when at least four survive (`lib/school/parse-items.ts`). Candidates still land pending for Justin to approve; nothing reaches a parent unreviewed. `scripts/check-wisdom-salvage.mjs`.

## 26 November 2026: the evidence carousel becomes a weekly series

- Justin: GDC 064 (GTA VI) did well, so one or two carousels a week inside the cadence, in its look: crinkled paper, black type, one yellow highlight, one idea a page, a practical last page.
- Built into the motion engine, not a new workflow: `tools/motion-engine/carousel/template.html` (the look), `scripts/carousel.mjs` (Instagram slides, LinkedIn PDF, optional 4:5 and 9:16 motion), `scripts/carousel-gate.mjs` (no uncleared figure, no causal wording, no dash, no GDC number on a page; tested in wiring.yml). Midday runbook step 4b; START HERE asks ChatGPT for a CAROUSEL section when a story is picked.
- First trial: GDC 066 (RAND, AI and homework) rendered for the week of 13 December, awaiting Justin. No Metricool performance data is readable from here; GDC 064's numbers need ChatGPT's report or a screenshot.

## 27 November 2026: the save screen says Last step, and Schools links skip the redirect

- Justin said yes. The save screen eyebrow reads "Last step" (it repeated "Question 3 of 3" after three questions). The birth month stays above the sign in buttons, so a one tap sign up still carries it, but it now says Optional; it always was. Every "For schools" link goes straight to schools.guidedchildhood.com, ending the desktop console error from the redirect.
## 27 November 2026: app pages hand into the stage check

- Justin said yes. 51 app page visits from 24 to 27 November, none reached the check. A button under the answer ("Get the plan for your 12 year old") and every check link on an app page now carry ?age= and ?app=; the check skips question one and ticks that app's worry (lib/app-safety/handoff.ts, held to apps.ts by npm run app-handoff-test). A Google sign in return no longer counts a question one that never happened.
## 27 November 2026: a sixth trial email, their app tonight

- Justin said yes. Sent the morning after joining, days one to three only, to a family whose child (8 and over, not settled on no device) has never opened their app. Button opens the QR on Jobs. The trial guard now expects six emails. Plan: plans/2026-11-27-activation-and-funnel-plan.md.
## 26 November 2026: where the phone sleeps at explorer, mood script around the named app, bedroom evidence tagged

- Justin's top three this week. New explorer script "Where the phone sleeps tonight": a landing spot, chargers for every phone (mine too), a two week trial, her three answers. After Mumsnet, the why opens by saying the parent knew the answer already and is not doing it wrong; the script is about her agreeing.
- Explorer 601 "Mood drops after phone use" now opens with the Instagram moment the parent saw that evening, names the big four apps, and links to the Instagram guide (script tonight line naming a guide becomes a link, `lib/scripts/guide-links.ts`).
- Carter 2016 and Mireku 2019 tagged phone, bedtime, new_phone; "bedroom" and "charger" now find the sleep research. Migration 407, not yet applied live. Plan: plans/2026-11-26-explorer-phone-placement-plan.md.

## 27 November 2026: the explorer phone and mood scripts made reachable, from the expert walkthrough

- Justin, "yes" to all five walkthrough fixes. Parents were not reaching 407's scripts: DiGi matched every stage and the word "tonight", and both worry tiles pointed elsewhere.
- DiGi now weights the child's stage first; the tiles lead with the new scripts; the Instagram guide covers sleep mode, hidden words and the feed; 9673 opens with "you already know the bedroom answer"; 601 agrees with starter script 8.
- New "Remind me" button on a script's check back writes the follow up DiGi already delivers, timed from the script's words. Migration 408, waits for Justin's yes. Plan: plans/2026-11-27-explorer-flow-fixes-plan.md.
