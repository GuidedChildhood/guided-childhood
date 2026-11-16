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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-13 | 89 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 14 November 2026: round 1 paused; the stage check opens on one tap

Round 1 reached 9,210 parents, 216 clicks, 136 page loads, £10.64, and no stage check was begun; the counter was proved working. Question one asked a stranger for the child's name and birth month and year before anything, with no button. Justin: "Pause and fix it". Campaign paused. Question one is now the child's age, one tap (4 to 16); the birth month moves to the save screen, where with the age it gives the exact year; "Not you? Start fresh" shows only to a real returning visit. Left out was the clear winner on clicks (117 of 216). `plans/2026-11-14-stage-check-one-tap.md`.

## 14 November 2026: the parent problem sweep, first ranked log

- Prompt B of the answer series plan, run on open pages only. 15 problems ranked in `content/parent-problem-log.md`, beside the radar log. No usernames stored, nothing published.
- Top of the list by threads read: coming off the screen (12), the first phone (9), Roblox and games at primary age (8), the phone in the bedroom at night (7). Weeks 1 to 3 of the plan are supported as they stand.
- Proposed for week 4 onward: the bedroom at night, Snapchat before 13, homework on the screen. Coming off the screen needs a refresh, not new research.
- Limits: every thread is Mumsnet bar two. Reddit, Netmums and public Facebook pages gave nothing readable without a login, so they are not covered. Quotes need a person to check them against the page before use. Messenger is NOT OURS for now. PR 1538.

## 14 November 2026: the answer series, email courses and child films, plan before build

- Justin asked for a twice weekly post answering Family IT Guy, Dr Becky Kennedy and Catherine Knibbs, an email course per topic in place of downloads, a parent problem sweep, child lesson films released, and a research pop Reel.
- Verdict: one verified topic pack feeds every format, as the Roblox pilot did. One new topic a week, two posts from it.
- He extended Instagram collection for analysis to the other two accounts, same limits as 13 November.
- Six decisions wait on him, the main two being where the email course sits in the funnel and whether the two clinicians may be named.
- Plan and the four prompts: `plans/2026-11-14-answer-series-email-courses-and-child-films-plan.md`. Nothing is built until he says go.

## 14 November 2026: Justin's answers on the answer series

- Twice a week. Stage check stays the call to action on every post, with the topic email course offered on the result page.
- The two clinicians are not named: our own posts, built off their subject material. Family IT Guy may be named.
- Child films are released everywhere: YouTube, the family account and the product.
- He gave the James Smith video and the Instagram post with the Mike Tyson comparison. Neither could be read by machine (both sites refused), so the Roblox post stays held until the exact words are read.

## 14 November 2026: the seven rules marketing video, weighed

- The transcript Justin pasted is by a speaker addressed as Sabri and does not say email sequences over downloads. The email course stays on our own reasoning.
- Adopted: every piece must give what a chatbot cannot. Adapted: a stage named in an ad's first line, tested free first. Parked: PR and cloned funnels. Declined: rewarded reviews.
- `plans/2026-11-14-seven-rules-video-weighed.md`. No spend, no new funnel.

## 14 November 2026: James Smith on lead magnets, weighed

- The right video this time: no PDF as the price of an email address, a short email a day instead.
- Adopted in adapted form: the topic email course is seven daily emails of about a minute each, one thing to do, the offer on days five and seven. Declined: pressure lines and a thirty day run.
- Adopted: name our own bottleneck with real numbers before building more content.
- `plans/2026-11-14-james-smith-lead-magnet-video-weighed.md`.

## 14 November 2026: the child film inventory (Prompt D)

- Ten finished child films exist: the Stage 1 watch together films, ages 4 to 7, all live. Everything else is a script or a clip of 5 to 12 seconds.
- First five to release, in journey order: 1.1, 1.5, 1.2, 1.4, 1.3. Remake: 1.6 (frightening picture), 1.9 (miscounts, DiGi off model), 1.10 (three patched stretches).
- None is ready for YouTube or the family account: landscape only, no stage check ending, and each closes on a promise about the child.
- Not reached: the languages films, the music video, Drive beyond one search, the channels.
- `content/child-films/2026-11-14-inventory-and-release-list.md`. Nothing uploaded or published.

## 14 November 2026: the first WhatsApp group pack, and the August briefing no longer stands alone

- Topic production for the first WhatsApp group, Prompt C. The August briefing was re checked first: of 37 lines, 12 confirmed, 17 corrected, 7 removed, 1 not reached. `content/packs/2026-11-14-first-whatsapp-group/recheck.md`.
- Withdrawn: "the blockers cannot see inside WhatsApp" (Bark's own page says it can), three untraceable Ofcom figures, and every teenage sleep or trajectory figure as a claim about a 10 or 11 year old. The briefing carries a notice at the top.
- New: WhatsApp parent managed accounts for under 13s (March) and teen controls (September). UK availability unconfirmed, so every asset says so.
- The pack: answer post, second angle, Reel, Short, seven daily emails (Justin's change the same day), child film brief, checklist marked NOT READY. Every post ends at the stage check, no clinician named.
- No GDC number claimed. The register takes one study per record and a topic pack does not fit it yet. Nothing posted or sent.

## 14 November 2026: the pathway is ready page, in pictures

Justin, on the page after the three questions ("Ava's pathway is ready"): show
what a parent gets, far less wordy, the passport, DiGi and how it learns. The
three middle sections of sentences became four picture blocks
(components/starter/InsideBlocks.tsx): the road with their stage marked, three
fixes with the product drawn, DiGi with its learning loop (no counts, no
success rate), the rest as labels. The time number, its evidence and the
"we do not read the device" note moved one tap in under the stars. The intro
before the questions is unchanged; an earlier pass on it was reverted the same
day because it was the wrong page. PR 1546.

## 14 November 2026: Tell us about your child, asked after joining

The one tap stage check (PR 1541) lets a parent join without a name or a birth month. Audited: nothing breaks, but a child with no birthday never ages up (the age up cron reads only children with one) and a skipped name shows as "Your child". Justin: ask for it after they join, to avoid blocks. So finish-setup keeps the age tapped and the day (onboarding_answers.ageYears, ageOn) and marks the family (askAbout) when either is missing; that family's Setup Quest leads with "Tell us about your child": the name and the birth month, the year worked out from the age. Saving writes the birthday and re-derives the band and stage, so the age up takes over. Shown only to marked families, so step numbers never shift. Round 1 adverts back on the same day at Justin's word.

## 16 November 2026: every printable on guidedchildhood.com/free

- Justin: "all printables should be free", then "make them all available on a page at the link" (the first link in the Instagram bio). Asked which he meant; he chose a taster for the eight £1.99 mini packs (live on Etsy since 11 November), not the whole thing, and to keep the six held tasters off the index (retired characters, the under fives game, the teachers' pack). They still open by direct link.
- The mini packs are three or four pages, so their taster is one page (two for the Routine Picture Cards): the headline page free, the rest on Etsy. The half rule still holds for every pack.
- New in content/printables/free-tasters.json: partOf (the page links to the bigger pack's taster) and letterSource (a US Letter taster too). The email series leaves out page emails a short taster has no page for.
- Not changed: the 27 live taster pages and files. A to Z Showdown, the Ice Cream Shop, the School Year Planner and Word Fishing are now live on Etsy but still say no-listing; flipping them is a follow up.
## 14 November 2026: child films, Justin's four answers and the 1.3 test

- The first five go out in the look they have now. The closing promise to the grown up is cut from public versions. Remakes wait until the five are out, 1.6 first.
- Film 1.3 built in both public shapes as the test: YouTube 3:58 with the stage check end card, a 1:23 vertical cut with full captions, a thumbnail and subtitles.
- Not listened to by ear. Nothing uploaded. `content/child-films/1.3-release-test/`. PR 1547.

## 15 November 2026: the Quests page is the day, and setup has its own page

- Justin, with a screenshot: "seems way too much". Measured on a phone with a two child family: 17 screens, 124 things to tap. Now 2 screens and 16 on a quiet day.
- The page keeps one job: what is waiting on me, each child today, add a job, the timer, give a star, then one quiet list. QuestManager moved whole to `/dashboard/quests/setup`; old `?tab=` and `?add_child=` links are sent on.
- Waiting ticks showed twice on a busy day. The lower queue now stays folded until Turn one down is tapped, and the two cards tell each other when a tick is answered.
- Research (sources in the PR): no body gives a screen to outdoor ratio or a balance score, so this page shows none, and the age guide is worded as our steer. `weekBalance()`'s 0 to 100 figure and the "healthy ceiling" wording elsewhere are for Justin to decide.
- No migration, no API change, child app untouched. PR 1551.

## 15 November 2026: no balance score, and play pays the same with praise

- Justin's two answers after the Quests research. One: the 0 to 100 weekly balance figure goes; the round up shows two plain tallies (minutes on screens, minutes earned by jobs and play) and holds screens against "our guide". No health body gives a ratio, and it broke "no composite scores".
- Two: play and outside jobs still lead every list but earn what any job their size earns (defaults 2, was 3 to 5). An expected reward for something a child already enjoys can lower their own interest; specific praise raises it (Deci, Koestner and Ryan 1999). So every yes now prompts the parent to say what they saw.
- New jobs only. A family's existing jobs keep their stars; no migration. Homepage, guide and child copy changed from "pays the most" to "leads the list".
- Not done, for Justin: "healthy guide" wording is still in about twenty other places (pace card, timer push, DiGi, lessons).

## 15 November 2026: Rachel first, and the promises match the code

- Justin: Rachel is the one live family. The five families task reopens as "Rachel through one full week, then four more". Read only check: no finished day since 28 September and the day's tick and its record stop together, so nobody ticked rather than ticks being lost.
- The reminder prompt said three a day while the cap is two. It now reads the number from `DAILY_NUDGE_CAP`, setup says "at most two", and `check-nudge-cap` fails if they drift.
- Setup's child step says "Send them their own link. It opens their app, nothing to download, no password", held by the new `check-child-link-open`.
- "You just follow the path" on a family's first day on Home and in the welcome email. The price card and upgrade page say the four free days carry DiGi a few times a day and the starter scripts.
- Later the same day: Rachael (her spelling) signed in once on 10 November and never chose a plan, so the choose screen is the last thing she saw and she never reached Home. Her free days were reset to 19 November on Justin's yes. Whether the choice moves later is Justin's to decide.
- Justin kept school, French and Etsy builds going (no pause). Five questions for Rachel in `plans/2026-11-15-rachel-five-questions.md`.
## 15 November 2026: French sync issue 1537 closed by hand, and her new progression tables

The sync could not open its own pull request (the repository setting is still off), so it left issue 1537. Her data is brought in here instead. Her site also changed its "grow" table into one sentence growing half term by half term, plus a lesson by lesson table for one unit; the old shape check would have turned tonight's run red, so the sync now reads both as rows of three and the curriculum page shows them. The unit page links the new phonics mat. PR to follow.
## 15 November 2026: "our guide", never "healthy", across the app

- Justin said yes to finishing the wording. About 45 lines in 23 files (timer, pushes, pace card, parent report, DiGi's context, the child's timer card, three emails, one quiz option) now say "our guide" or "today's guide" where they said healthy guide, amount, level or range.
- Reason: the daily minutes are our own steer set under the published guidance. WHO 2020 gives no screen number for ages 5 to 17, so "healthy" claimed more than we can show. The three emails now say "set under what the WHO, AAP, Canadian guidelines and RCPCH say", not "drawn straight from".
- The area name "Healthy balance" (passport, lessons) is a title, not a claim about a number, and stays.
- Board tasks due 21 November (walkthrough campaign, one family's first day, first paying family, Fable 5.2 compare) snoozed a week at his word.

## 15 November 2026: ask the parent who stopped

- Justin: capture the questions, keep nudging if unanswered, alert him on his phone. `/tell-us` opens from a signed email link with no sign in; question one is one tap. Answers go to `parent_answers` (migration 397, applied live), push to Justin's phone and show at the top of the founder asks page.
- Three emails, then silence: day three, four days later, a week after that. Any answer, a first check in or a finished day stops them. Accounts under 45 days old only. They ride the one programme email a week floor.
- Plan in `plans/2026-11-15-ask-the-parent-who-stopped.md`. PR 1558.
## 15 November 2026: French is in every school's licence, and the gaps against the paid schemes

Justin: "all schools get french", the author agreed, under our branding. A school's scheme code now opens French with no second code: the proxy mints the French cookie from the scheme cookie, French only, rechecked against the scheme list on every request. It is on the pricing list and the Hub. From the review of Oak, Kapow, Jigsaw, Project Evolve, Twinkl and Language Angels: a subject lead kit (deep dive questions with the page that answers each, a pupil voice sheet, a staff audit, how the lessons are designed), an end of year "can say" list per year on the year plan from each lesson's own outcome, In short on nine long Hub pages, and the SEND page corrected. Not built: adapted versions of the printable sheets (each needs writing), pupil voice recorded online (needs a legal version), songs and a home practice site. PR 1557.

## 15 November 2026: one French lesson is free to open

Justin said yes to a French taster. `/languages/fr/y3-ht2/1` and its teach screen open with no code, and the media route serves that one lesson's deck. Everything beside it still needs a code: exact paths, checked in `scripts/check-languages-door.mjs`. A visitor sees a line saying what it is and gets no record step and no links into gated pages. Linked from the pricing page. PR 1557.

## 15 November 2026: the plan choice waits for the first check in

- Justin's yes. A new parent now goes straight in free and lands on setup, whose first step is the home screen and reminders. The founder or free choice is owed only after their first check in (`needsPlanChoice`). It reverses the 14 August placement at the end of sign up, because the one live family left at that screen before seeing the product.
- Still its own route behind the middleware, so once owed it cannot be skipped. A parent who never checks in meets the upgrade page when the free days end.
- Homepage line and THE STORY section 9 changed to match. No migration.

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
## 16 November 2026: film 1.3 re-voiced in Tamsin, the cost measured

- All 44 lines regenerated in DiGi's voice, pictures slowed to fit, both public cuts and the subtitles rebuilt. 20.9 credits for the film, measured from the balance. About 21 a film for the other four.
- The generator pads lines with long silences and twice dropped a narration phrase; `revoice.py` trims the silences, and every line is transcribed against its words before the build.
- `content/child-films/1.3-release-test/`. PR 1570. Nothing uploaded.
## 16 November 2026: the warm ring sent

- Justin asked for the 30 "A small favour, one parent" emails (drafted 6 November, never sent) to go. Sent from justin@thesocialbillboard.com, one each, with two fixes: the link was a Google redirect and is now plain guidedchildhood.com/v/warm-ring, and "a free tool" became "three questions, free" because the product itself has a trial, not a free tier. Old drafts deleted.
- Count stage checks on the founder page under `warm-ring`. Some 2021 addresses will bounce.
