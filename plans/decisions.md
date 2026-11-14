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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-12 | 80 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 13 November 2026: creator radar brief, plan before build

- Justin pasted a fifteen phase brief for a creator research radar and a unified LinkedIn, Reels and YouTube engine.
- Verdict through the feedback filter: most of it extends the existing research register. No second database, no scraping (decided 14 October, PR 1293), Roblox pilot first.
- Six decisions wait on him, the main one being whether named clinicians may be challenged in public, which the house rule forbids.
- Plan: `plans/week-of-2026-11-09-creator-radar-and-unified-engine-plan.md`. Nothing is built until he says go.

## 13 November 2026: ChatGPT's feedback on the visual report, weighed

Twelve points, through the feedback filter (`plans/2026-11-13-chatgpt-visual-feedback-weighed.md`). Adopted: the two post Australia comparison is an association, not a test, and the report now says so; any figure card carries what the figure counts and its source; every proposed visual stays optional until reviewed. Parked for Justin: the look for evidence posts, a handwritten GDC-056, the 12 November screenshot we do not hold, and whether the Manchester post was a newsletter. No pack, handoff or schedule changed.

## 13 November 2026: Roblox pilot, the verified research pack

- Justin said go on the Roblox pilot. Six lenses, then 33 sources checked against their primary: 21 confirmed, 12 corrected, none demoted.
- Position the evidence supports: not ban, not shrug. Who can message my child, where does it go next, will they tell me. No trial backs a staged path over a ban, and the pack says so.
- Dr Becky Kennedy has no sourced Roblox position. Catherine Knibbs has one descriptive statement, no view on banning. Family IT Guy says skip it. No named person goes into copy until Justin decides.
- Nothing written from it yet and no GDC number claimed. `briefings/2026-11-13-roblox-predators-ban-v2.html`.

## 13 November 2026: collecting from one creator's Instagram is allowed, for analysis

- Justin said scraping is fine to get the information and analyse it, for the Family IT Guy Instagram account, from his own logged in browser.
- This is an exception to the 14 October no scraping decision (PR 1293), for analysis of one named public account. It is not a general change.
- Still holds: nothing collected is republished, no video is reposted or reused, no person is named in copy until he decides, and a post that could not be seen is logged as not seen.

## 13 November 2026: Family IT Guy may be named in the Roblox story

- Justin said to name him. He is not a clinician, so the rule about clinicians is untouched.
- He is named for his published advice to skip Roblox and for the Mike Tyson comparison. The first is sourced. The second is on Justin's word until we hold the video link and his exact words, and nothing attributing it goes out before then.
- The copy says what he gets right before it disagrees.

## 13 November 2026: the French sync stops going red, and her checkpoint model is ours

Three nights of `languages-sync` failed because the repository refuses a job's pull request; the changes were already on the sync branch. The job now leaves one issue with the link and passes. Her site moved to one formal judgement per code per year at a checkpoint, with task descriptors, so the French assessment page is rebuilt around that map and the unit, lesson and progress pages label formal against formative. Also brought in: answer sheets beside every sheet, wall displays, sheets for every class, her pupil games (linked, not embedded). Her "In short" box is now a shared component and opens the digital class progress page too. Declined: her twenty link menu and her colours. Verdicts and the digital principles not yet built are in `plans/2026-11-13-french-scheme-review-plan.md`. PR 1532.

## 13 November 2026: Free Saturday, a free printable a week built to be claimed, and the download no longer signs anyone up

Justin: carousels that offer a free resource each week and get followers to leave an email or sign in for the free downloads. Researched (`content/packs/2026-11-28-free-saturday/research.md`), then built: one schedule (`content/printables/free-saturdays.json`), one link that never changes (`/free/this-week`, the Saturday's taster until the next), a seven card format (`content/brand-story/free-saturday.md`) and the first deck, the Christmas countdown for Saturday 28 November (14 November was already booked with The Planet Post). Found on the way and fixed: under PECR a free download cannot be conditional on marketing email, so the gate has an optional unticked box and the lead programmes skip a no (migration 396). Comment keyword DMs, the strongest tactic found, stay off: the 6 November fix pack bans them, so it is Justin's call. PR 1535.

## 13 November 2026: a five day email series for anyone who asks, daily, outside the weekly floor

Justin passed on a talk arguing a PDF alone goes unread and a short email a day works better; weighed in `plans/2026-11-13-email-series-advice-weighed.md` (adopted, adapted to five days, the 30 day version declined). Then, asked about the clash with "one email a week from all systems": "Yes, daily for the series". So a tick on a free taster page now brings page 1, 2 and 3 in the email with a tip each, the stage check, then the rest of the pack, one a day as a new email kind, `series`: no floor for its days, unsubscribes still win, sends recorded so the weekly programme counts on from the last. `check-email-guard` holds it to exactly five emails, one send site, ticked boxes only. The countdown carousel is booked for Saturday 28 November at 10:00 (Instagram carousel, Facebook card one): 14 November already held The Planet Post. PR 1535.

## 13 November 2026: creator radar pilots 2 and 3, draft packs

- Justin said start. Two draft packs: boundaries (kind and firm when the tablet goes off) and disclosure (what to say when a child tells you something scary happened online).
- No person is named in any copy. The 29 July rule held: the clinicians' public work is cited only in each pack's `sources.md`, and the copy stands on independent evidence and on NSPCC, CEOP and Ofcom.
- Found on the way: the August cybertrauma series credited "fewer than one in five told a trusted adult" to Internet Matters, and the report does not say it (it measures reporting to the platform, 36 percent). Justin said fix it: the live LinkedIn post was edited and a correction comment added, and the pack and briefing were corrected. The newsletter had never been sent.
- Three house lines in `digi/07` and `digi/02` outrun the evidence. Listed in the boundaries sheet, not changed.
- Nothing posted, no GDC number claimed. PR 1533.

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

## 14 November 2026: the first WhatsApp group pack, and the August briefing no longer stands alone

- Topic production for the first WhatsApp group, Prompt C. The August briefing was re checked first: of 37 lines, 12 confirmed, 17 corrected, 7 removed, 1 not reached. `content/packs/2026-11-14-first-whatsapp-group/recheck.md`.
- Withdrawn: "the blockers cannot see inside WhatsApp" (Bark's own page says it can), three untraceable Ofcom figures, and every teenage sleep or trajectory figure as a claim about a 10 or 11 year old. The briefing carries a notice at the top.
- New: WhatsApp parent managed accounts for under 13s (March) and teen controls (September). UK availability unconfirmed, so every asset says so.
- The pack: answer post, second angle, Reel, Short, seven daily emails (Justin's change the same day), child film brief, checklist marked NOT READY. Every post ends at the stage check, no clinician named.
- No GDC number claimed. The register takes one study per record and a topic pack does not fit it yet. Nothing posted or sent.
