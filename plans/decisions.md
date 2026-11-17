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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-15 | 109 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 16 November 2026: every printable on guidedchildhood.com/free

- Justin: "all printables should be free", then "make them all available on a page at the link" (the first link in the Instagram bio). Asked which he meant; he chose a taster for the eight £1.99 mini packs (live on Etsy since 11 November), not the whole thing, and to keep the six held tasters off the index (retired characters, the under fives game, the teachers' pack). They still open by direct link.
- The mini packs are three or four pages, so their taster is one page (two for the Routine Picture Cards): the headline page free, the rest on Etsy. The half rule still holds for every pack.
- New in content/printables/free-tasters.json: partOf (the page links to the bigger pack's taster) and letterSource (a US Letter taster too). The email series leaves out page emails a short taster has no page for.
- Not changed: the 27 live taster pages and files. A to Z Showdown, the Ice Cream Shop, the School Year Planner and Word Fishing are now live on Etsy but still say no-listing; flipping them is a follow up.

## 16 November 2026: the worry question asks what parents want help with

- Justin, with the stage check grid: match it to what parents raise most, make it clear we bring the solutions, and do not break the daily tracking. The grid is now the twelve the problem sweep ranked (Mumsnet log plus UK surveys and Ofcom; Reddit and Facebook groups unreadable, stated), each tile with one line of what we bring. Question: "What would you like help with?"
- New: Who they talk to in games, Group chats, They get round the rules, Homework on screens, Endless YouTube, Spending in games. Folded, not deleted: Controller fights, Mood after screens, Morning TV, in RETIRED_WORRIES so families who picked them keep everything.
- Every tile still becomes a concern, a check in row, a focus strip and a script filter (check-focus-labels). No migration. `plans/2026-11-16-worry-question-top-12.md`.

## 16 November 2026: DiGi's recorded voice is Tamsin, a little slower

- Justin chose by ear from six samples of the same 1.3 passage: Tamsin (Higgsfield preset 9eb5a147, seed_audio, speech rate minus 10, about 118 words a minute). Replaces Mabel (films) and Imogen (social) for every new recording.
- The name is written "Didgee" in spoken text, matching the app. The ten films say it three ways today.
- The app's live speech (the phone's British voice) is unchanged. Samples and ids: `content/child-films/voice-test/`. PR 1570.

## 16 November 2026: the advert funnel counts the pathway and the save screen

- After the one tap first question, 8 of 119 advert visitors started the stage check and none made an account, with nothing to say where they stopped (PostHog is not on for the live site). Justin said yes to counting it.
- `video_link_events` gains two kinds, `pathway` and `save` (migration 398), counted once per browser per follow against the code the start was counted against, so per link it reads opened, started, pathway, save, account. Existing counts filter by kind and are unchanged. PR 1569.

## 16 November 2026: the premium motion engine for research cards

- Justin asked for a Remotion engine making a PNG and a 14 second MP4 per approved story, 1080 by 1350, warm ivory, navy, restrained yellow. This brief settles the look for evidence posts, open since 12 November.
- Built in `tools/motion-engine/` as its own package. HyperFrames films stay a separate lane.
- Its gate refuses uncleared numbers, causal wording, a missing source or limitation and any record not Claude reviewed. It records files through `assets.mjs`; Drive, Metricool and the post register are unchanged.
- No Higgsfield footage generated: that spends credits and waits on Justin.

### 16 November 2026: the researcher watch and the parent problems map

`npm run radar-people` (scripts/radar/people.mjs) lists new papers by Odgers,
Haidt and Knibbs (Europe PMC, Crossref) and Haidt's After Babel feed into
content/research-watch/, for a Claude review: SUPPORT, CHALLENGE, CONTEXT or
SKIP, a challenge only on the evidence. LinkedIn likes and reposts cannot be
read. Knibbs is not named beside our advice. parent-issues.md maps ten common
parent problems to a radar stream, our belief and a real product surface.
Runs in the Monday radar sweep.

## 16 November 2026: four older games point to their Etsy listings

- A to Z Showdown (4614794043), Ice Cream Shop (4614808978), School Year Planner (4614796575) and Word Fishing (4614809538) went live on Etsy around 11 to 14 November, so their free taster rows move from no-listing to live and the rebuilt taster bands now link to the listing.

## 16 November 2026: the topic email course is offered on the stage check result page

- Justin chose it on 14 November. A child aged 10 to 12 (or an Explorer run saved before the age question) sees "The first group chat" on the result page: one email box, one button, "Start the seven emails". Day 1 goes at once, then one a morning from the email cron as kind `series`.
- Asking is the consent: the button and the line under it name the seven emails and the odd note after, so the lead is marked `marketing_consent` true like a ticked box (396). No second box, because nothing else is given in exchange.
- No migration. The start row in `lead_email_log` is the clock and its unique key stops a second press restarting the week. The copy lives in `lib/courses/registry.ts`, tested word for word against the checked pack, so the next topic is a new entry. PR 1573.

## 16 November 2026: lesson films from what parents react to, the map and the 1.6 pair

- The last 30 posts from Family IT Guy and the two clinicians, read for subject only and grouped: `content/child-films/parent-reaction-series/subjects-2026-11-16.md`. The cybertrauma account posts on LinkedIn, not Instagram, so her 30 came from there. 32 of 90 are not ours.
- First three subjects, each with a film already: bedtime phones (1.6 remake), "is this real?" (1.5), seen something upsetting (1.4, the largest group). Roblox strangers is the first new film after them.
- The 1.6 child and parent scripts are drafted in Tamsin's voice. Nothing generated: the pair is quoted at about 97 credits and waits on Justin.
- The watch together booking is a plan with four questions for Justin, not built. Plan: `plans/week-of-2026-11-16-lesson-films-from-parent-reactions-plan.md`. PR 1576.

## 16 November 2026: film 1.3 re-voiced in Tamsin, the cost measured

- All 44 lines regenerated in DiGi's voice, pictures slowed to fit, both public cuts and the subtitles rebuilt. 20.9 credits for the film, measured from the balance. About 21 a film for the other four.
- The generator pads lines with long silences and twice dropped a narration phrase; `revoice.py` trims the silences, and every line is transcribed against its words before the build.
- `content/child-films/1.3-release-test/`. PR 1570. Nothing uploaded.

## 16 November 2026: the 1.6 remake and its parent film are built

- On Justin's yes to the quote: 24 pictures of Pebble and DiGi from the reference art, 38 lines in Tamsin's voice, every line checked by transcript (two redone). 68.7 credits against 97 quoted.
- Cuts: the product film with its A, B, C segments, YouTube with subtitles and the stage check, a 9:16 family cut, and the parent film in three shapes, one real product screen in it.
- No closing promise, no screen as villain, one line about the body that claims nothing. Nobody has listened with sound on; not swapped into the product. `content/child-films/parent-reaction-series/1.6-sleep/`. PR 1576.

## 16 November 2026: Watch together booking, planned for approval

- Justin's fuller brief: book, remind, show on the child's app at the time, change or cancel, an after prompt. Plan with privacy and safeguarding and five questions: `plans/2026-11-16-watch-together-booking-plan.md`. Nothing built. Migration 399 noted as free.

## 16 November 2026: the warm ring sent

- Justin asked for the 30 "A small favour, one parent" emails (drafted 6 November, never sent) to go. Sent from justin@thesocialbillboard.com, one each, with two fixes: the link was a Google redirect and is now plain guidedchildhood.com/v/warm-ring, and "a free tool" became "three questions, free" because the product itself has a trial, not a free tier. Old drafts deleted.
- Count stage checks on the founder page under `warm-ring`. Some 2021 addresses will bounce.

## 16 November 2026: six tiles first, and this is just the start

Amendment 3. `shared/schools-progression.ts` gives each lesson a suggested year and the earlier lessons it builds on, read from each lesson's own prior knowledge lines. The scheme's order is kept inside each key stage and cut into years so nothing lands before what it builds on; `scripts/check-progression.mjs` holds that. `/hub/progression` shows it year by year and as four threads; `/hub/year-plan` now goes year by year where it used to lay a whole key stage over three terms. It is a suggestion and every page says so. KS3 still opens on ks3-27 and KS4 on ks4-29, as the scheme orders them: reordering is Justin's call and was not made here. PR 1496.

## 16 November 2026: the COUNTDOWN link rides on the Business Suite auto reply

After Justin completed Meta's identity check, Instagram messages joined the Business Suite inbox, but this account offers no keyword replies. Justin chose "Add to auto reply": the existing first message reply now carries the free countdown link (`src=ig-dm`), and its Instagram channel, which had been off, is on. The previous wording is kept in `content/packs/2026-11-28-free-saturday/christmas-countdown.md` to restore after Christmas. ManyChat stays the upgrade for a reply to the word alone. PR 1535.
- Justin: do not overwhelm parents; reassure them we drive it and keep asking. The stage check shows the six most common worries, the other six one tap away ("See 6 more"); a ticked tile never folds away. The question asks for what is on their mind today, even just one.
- Under the grid: we bring up the next ones for their age (age prompts, the age up cron) and anything they mention to DiGi is added and tracked (concerns written by DiGi, Moments, Right now). "Not sure yet?" starts them on Coming off screens, the most common.

## 16 November 2026: films 1.1, 1.5, 1.2 and 1.4 re-voiced in Tamsin

- All four first release films now exist in DiGi's voice in both public shapes (YouTube with the stage check end card, a vertical cut for the family account), with subtitles and thumbnails. 99.4 credits for the four, measured from the balance.
- The 1.3 scripts became one shared tool, `content/child-films/revoice/`, with each film's settings in its folder's `film.json`. Folders: `content/child-films/1.*-release/`. Nothing uploaded.

## 16 November 2026: the child films go on the Guided Childhood YouTube channel

- Justin named the channel for the five re-voiced films. Each upload still needs made for kids set, which turns off end screens and comments, so the stage check end card built into each film is the only call to action. Recorded in the inventory. PR 1588.

## 16 November 2026: the drop off asks skip the weekly floor and reach stage check visitors

- The three "what stopped you" emails (PR 1558) ran for the first time this morning and held both due asks on the one a week floor, Rachael's among them. Justin: "skip the rule". They now send as a new kind, `ask`: no floor, a stop still holds, three per account ever.
- Justin: "Yes, two short emails". A stage check visitor who never made an account is asked on day 2 and four days later, three short questions, one tap first, answers on the founder's asks page and a push to his phone. Not sent to anyone running a topic course.
- Migration 399 lets parent_answers hold a lead. Until it is applied no lead link goes out, because its answer could not be saved.
- Found on the way: migration 396 (consent) is not applied on the live database. The course and the lead asks read every column so they work either way. PRs 1584 and this one.

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

## 17 November 2026: the Scripts page is three shelves, and every script looks after the parent too

- Justin: show the scripts that answer what they have said, the ones for their age, and the ones done that are worth a revisit, "super easy to understand", and make scripts supportive of parents' own struggles.
- The page went from eleven sections to three shelves under the search: Picked for Teo (lead plus two, each saying why: a raised worry, a check in dip, a device, the age), Worth another go (new: did not land, used three or more weeks ago, or read and never tried; never anything marked not needed), and For Teo's age (nine tiles, chips, the rest one tap away, other ages folded). One paywall card, not two. A star tally of conversations had, counting up, no streak.
- Every script reader gets "If this one is hard for you": calm first, pick the moment, practise once, repair, guilt, the other parent. Same six lines on every script; UI support copy, not a script, so not in the scripts table.
- Why: spaced review (Cepeda et al 2006), practising with your own child and carer consistency (Kaminski et al 2008), no streaks (Silverman and Barasch 2023). `lib/scripts/shelves.ts`, `scripts/check-script-shelves.mjs`. No migration, no API change.

## 17 November 2026: migration 400 applied and read back

- On Justin's yes. Live: watch_bookings with row level security on, no browser grants or policies (service role only), four indexes, no rows; parent_lessons.after_prompt set on all ten films. Last migration recorded: 400_watch_bookings.
- PR 1589 (the booking code) merged the same morning, so booking is live once main deploys. Next: one live test, a film booked a few minutes ahead for one child.

## 17 November 2026: the passport shows the real book and the five Planet Friend stickers

- Justin: the order card showed a yellow "Digital Literacy Passport" photo and generic stickers. Now drawn: the app's burgundy cover (PassportCover, shared with the stage check and the shop) and one Planet Friend sticker per stage (StageSticker), earned ones in colour.
- One rule, screen and paper: lessons passed, talks done, big check passed (lib/pathway/stamped.ts). Moments, stars, balance and outside time show as "along the way" and earn nothing, since the code does not read them. Adding any to the rule is Justin's call, asked in the PR.
- Stage done: both sides see "Stage done, sticker added to your passport" with what the sticker says was learnt, and print a colour A4 sticker sheet (parent and child routes). Guard: check-stage-stickers. PR 1608 (1603 merged as the claim only).
