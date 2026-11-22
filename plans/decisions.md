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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-17 | 142 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

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

## 18 November 2026: children on Quests are their letter on their colour, not their buddy

- Justin asked whether children should have icons and whether there was a better way. He chose the letter disc: the child's first letter on their stage colour, the same disc the child switcher draws on every page.
- Why it replaces the buddy picture from PR 1629: a child who never picked a buddy shows DiGi, so two children could wear the same face, and the parent app had two ways of drawing one child.
- `components/quests/ChildDisc.tsx` replaces `ChildBuddy.tsx`. No data change.

## 18 November 2026: Quests setup is a settings list, not fourteen screens of cards

- Justin: make /dashboard/quests/setup "super easy to follow and easy to read", following the best apps.
- It measured 14.8 phone screens and 110 taps for a two child family. Most of it copied pages that already exist: the job list and both idea lists (Add a job), the routines (their own page), the balance card (Stats).
- Now: the child picker and the stars card, then three grouped rows in the Apple Settings style. Jobs and Routines link to their pages. Rewards, Do this first and messages, Learning games, Their app and Print open in place with an "All settings" back row. 3 screens, 16 taps. The "a lot for one day" advice only shows when the day is heavy.
- The stars card keeps only an Approve button, and only when something is waiting. The deal guard now holds every page that mounts the job composer, and fails if Add a job ever stops mounting it.
- No data or API change. `components/quests/SettingsList.tsx`.

## 18 Nov 2026: the Evidence Reveal is the default for research led posts

Every evidence pack now carries three hooks of different kinds with one CHOSEN, a DISRUPT, REVEAL, REFRAME, INVITE storyboard with a cover, and CARD TEXT with TIMING and VISUAL lines. The pack checks read hooks and storyboard for uncleared figures, dashes and causal wording (qa.mjs check 8b); a pack with no HOOKS passes and is flagged, so work in flight is not stopped. The look moves to black and white editorial paper with one yellow highlight. Cadence "every other day" sits under the 17 Nov cap of three a week until Justin says otherwise. Skill: .claude/skills/evidence-reveal. ChatGPT's v3 motion files for 055 to 061 are on HOLD (wrong AI label on three, unreadable caveats, 12 fps, no end hold); the Claude cards stay the approved visuals.

## 18 November 2026: the starter page's three fixes are drawn the way the app draws them

- Justin, with a screenshot: still clunky, "the graphics need to be way more stylish and in fit with app". Good Inside is not on Mobbin; Alma (stacked turned cards), X (the notification lifted off the screen) and Finch/Duolingo (progress as the app's own marks) set the shape.
- Stars: the child's ask behind, the parent's card in front. Words: "Not this" struck through behind, "Say this" in the script finish on top, with Practise with DiGi and Fridge card. Check in: the real five faces (now `components/daily/CheckFace.tsx`, shared with the app), six weeks climbing, ending on the real rest rule. The pink bars and "Stamped in the passport" went: the check in has neither. `components/starter/FixArt.tsx`. PR 1633.

## 19 November 2026: search foundations (Phase 1 of the SEO plan)

- Justin: Google and AI search become the main way parents find us. Plan: plans/2026-11-19-seo-and-app-safety-pages-plan.md, PR 1635. Phases ship one at a time with a preview check.
- His answers: the Digital Health Check is left alone for now (not a lead, no app data on it); free tool pages lead to the stage check; the existing email course signup is reused unchanged; all age pages indexed if each carries genuinely different advice.
- Phase 1: every public page builds its metadata through `lib/seo/meta.ts` (canonical, its own share card; the brand was printed twice in a dozen titles), private pages noindexed, AI crawlers named in robots, real sitemap dates, Organization JSON-LD site wide, FAQPage on /join, SoftwareApplication on the home page, `/llms.txt`, the Google verification slot (`lib/config/site.ts`), and `ai_source` on PostHog events from ChatGPT, Perplexity, Gemini, Claude and Copilot.
- Found: PostHog has never run on the live site (NEXT_PUBLIC_POSTHOG_KEY is not set in Vercel). Setup steps went to Justin.

## 19 Nov 2026: posting slots, the Sunday issue and the daily numbers

- Personal LinkedIn posts go in Monday, Wednesday and Friday slots at 08:00 UK time, at most three in a calendar week. A booking Justin already made in LinkedIn counts towards its week and is never moved, so the week with the 29 Nov booking has two free slots and the week with the 6 Dec booking has two.
- The Sunday 22 Nov newsletter is approved by Justin; the long form running order slides a week if issue 1 has not gone out.
- `daily.mjs summary` opens with TODAY IN NUMBERS: discovered, cleared, held, packs produced, stages failed, and Metricool named as NOT CONNECTED.
- Recovered the 18 and 19 Nov radar runs from the Drive patch (the scheduled session's git commit was refused). The 19 Nov afternoon run committed normally, so the refusal is intermittent, not constant.
## 19 November 2026: homework and projects get reminders that lead up to the day

- Justin snapped the Anderson shelter letter (due 1 December): the date went in, but it was on the bell at once, came in as two items, and nothing helped it get started.
- Homework and deadlines now get a week before and 3 days before when there is room (worked out from the day it was added), plus the night before as always. Parent push, the child's own app for homework, and the same alerts inside the calendar file. Apple style chips on a new "Coming up" block above the week turn each on or off.
- The bell waits for the first reminder; due dates read "Tue 1 Dec · 12 days to go". The letter reader merges near duplicates (same kind, same date, two shared words).
- Migration 401 (`remind_days`) must be applied for the chips to save; until then the automatic plan runs. `lib/school/lead-up.ts`, PR 1641.
## 19 November 2026: the walkthrough fixes Justin chose, and two promises brought into line

- The three New in Guided Childhood posts run on Sunday mornings at 10:00 (22 Nov, 29 Nov, 6 Dec); the family week pack takes Free Saturday 21 Nov.
- The stage check intro says "a confident, capable 16", not "a safe" one, and the save screen says "four days free", not "four days of everything", to match FreeDoor and the upgrade page.
- Posts 10 and 18 re-rendered. Post 4 says outside comes first; `ref-kid-jobs` now pays outside play what the templates pay. Its film is re-rendered on the Mac.

## 22 November 2026: design tells guard, and the app safety pages (Phase 2)

- Justin: nothing should look AI made; Apple standard. `npm run design-tells` (ratchet over twelve visual tells, in CI) and the checklist in `.claude/skills/uiux-pro-max/design-tells.md`; Wikipedia's Signs of AI writing phrases joined `check-ai-tells.mjs`. Our own mono eyebrows, "→" and "·" are flagged as the next wave of defaults: rationed on new pages, old ones untouched.
- Phase 2: 20 apps in `lib/app-safety/apps.ts`, 220 static pages at `/is-<app>-safe(-for-<age>-year-old)`, hub `/app-safety-guide`, the TRUST check (no score, no verdict). Every fact sourced; 61 unconfirmed points in `plans/2026-11-22-app-safety-review-list.md`. Lead CTA the stage check, email capture the existing Starter Pack magnet. Compared against main: every existing page identical. PR 1644.
## 22 November 2026: the iPhone service films, four, from the real app

- Justin asked for Apple-style iPhone walkthroughs of DiGi on the hardest questions (and how it is tracked), Quests, Scripts, and the charts and school help. All four are built: real fixture screens recorded frame by frame with the film family's names, in a drawn iPhone, one headline per beat, ending on the stage check. 27 to 43 seconds each. No model credits.
- No music baked in: trending sounds are added in the app at upload. The shortlist comes from TikTok's Commercial Music Library (UK, 7 days) through the Higgsfield connector.
- The engine is `videos/2026-11-19-iphone-films/`. The pack and captions are in `content/packs/2026-11-19-iphone-films/posting-plan.md`.
- Scheduling in Meta Business Suite stays with Justin, because no connected tool can schedule organic posts. The posting queue page carries the whole drip feed.
