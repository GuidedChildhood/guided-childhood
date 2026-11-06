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
| `plans/decisions-archive/2026-11.md` | 2026-11-01 to 2026-11-04 | 10 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

- 2026-10-07 · 7 October 2026: every script Justin has to record, as read cards · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: the check in rates on faces, one outcome per tap, two fives still rest a worry · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, later: one five rests a worry, and the faces get the happy news finish · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: lesson videos are H.264 and ship with the schools site · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: the momentum block rides inside the reviews · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: DiGi asks "How did that go?" once, and a tough check in leaves one invite · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the pilot review's fixes, and the sort turns its cards over · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the school price weighed against eLIM, decision with Justin · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026 — the two school day windows: per family pushes and a one tap moment card · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — migration 363 applied, the three school day PRs merged, 1213 unblocked · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the founding schools rate · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the DiGi launch film · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, afternoon: the DiGi launch film slows down and shows its brain · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, later: the launch film's researchers layer names four · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the school day post is bulletproofed before it ships; the hostile panel is standard · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails, rewritten to the research · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: DiGi in 3D, and a KS3 lesson on copyright · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails link to the proof, and the form comes after the yes · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the loop promise on every surface, the pilot drafts set right, the school day posts in their final shape · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the two brains film is sequential (v5) · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: French and Spanish join, sealed behind their own code · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: one curriculum, two rooms; three decisions · `plans/decisions-archive/2026-10.md`
- 2026-10-11 · 11 October 2026: AI and SaaS advice, weighed · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the DiGi hero and Short 1, from real screens · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the extension marks reach the live decks (migration 369) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: every paper pack fits its paper · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: four lessons print their own tool (migration 370) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the ending is agreed, not warned (migration 371) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the films show the script deck, its sources, and the tracking to sorted · `plans/decisions-archive/2026-10.md`
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

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 5 November 2026, the Road to 16 guide and its claim

The free reward for a printable Passport stamped up to the child's age (Justin: the reward, not a product; unlocks when caught up, not at sixteen). Eleven pages, A4, Letter and ink saver, in the Passport's burgundy and gold: balance, signs by stage, eight apps with each one's own minimum age, the school moments, a help page, sixteen, sources. Every line is the app's own content or a sourced fact; the evidence red team passed it after fixes (content/printables/road-to-16-guide/evidence-check.md). /etsy-bonus keeps the Starter Pack and adds an honour based claim, magnet `road-to-16`. Found on the way: migration 093 says Roblox is 13 (its UK terms say 5) and four more stale settings lines. PR 1403.

## 5 November 2026: Etsy branding v2 chosen, the Passport leads the shop

Justin chose the 3D DiGi shop icon on a warm gold ground (no black border) and asked for the Passport on the banner: the five Planet Friends now walk the gold pathway to the burgundy Passport cover, with "Get your Guided Childhood Passport". So a printable Passport (fold out book, stage pages, stamp and sticker sheet, £7.99) joins the paid line and ships first, because the banner names it; the printed keepsake with real stickers follows later as a physical listing. Final images in content/etsy-shop/branding/final. PR 1402.

## 5 November 2026: the app's platform guides match the Road to 16 evidence check

The Road to 16 red team found the app's own settings rows out of date, so migration 385 corrects them, guarded on the 093 text: Roblox accounts from 5 with a parent (its UK terms), YouTube's Family Link content setting instead of a Restricted Mode lock most children cannot have, Facebook supervision without "message oversight", WhatsApp parent managed accounts with a "may not be in the UK yet" hedge, Snapchat Quick Add to friends of friends. The settings page words any age under 13 as "with a parent". The issue bank's group chat and sextortion lines carry the UKCIS rule that a nude image of anyone under 18 is never screenshotted, copied or forwarded. Justin applies 385. PR 1405.

## 6 November 2026: Robux DiGi short and the five step phone carousel built, review weighed

Justin picked the Robux film and the phone carousel from the Family IT Guy drafts. DiGi's reply in the film is a real generation from the live prompt (the evals method), unedited, chosen from three runs. The marketer review caught "fix" on screen, a flash of the script's Not this ultimatum and an empty first frame; all fixed by framing and cuts, never by editing the reply (plans/2026-11-06-robux-short-review-weighed.md). "Ladder" and "rung" stay out of public copy (carousel skill rule). Links: robux-ig, robux-fb, robux-tt. PR 1424.

## 5 November 2026: the printed Passport, made to order through Etsy

Justin asked for the Passport as a real printed book bought on Etsy. Etsy's built in print partners do not print a small stapled booklet, so it is a 16 page A6 book printed one copy at a time by Mixam UK, placed by hand for the first fifty orders, with the Mixam API wired only after that. The child's first name on the cover is optional and comes from Etsy's personalisation box; order files are gitignored. A kiss cut sticker sheet goes with it. Silent films for the Etsy listing (square) and for social (vertical, ending on the stage check), rendered from the real pages. Waits for Justin's Mixam proof copy, which sets the price. PR 1414.

## 5 November 2026: email landing pages, and schools share every lesson with parents

Justin: the email links to the child's app and the agreement sent signed out parents to login ("fix create"), and schools should share lessons that parents read by signing up free ("a secret way to get users"). Public /kids-app and /agreement now explain each one with the real product and one door, the starter pack with ?next= back to the app share step or the builder; the starter pack, login and /auth/callback honour next through lib/auth/safe-next.ts (the callback's unchecked next was an open redirect). The schools lesson page mints a signed parent link per lesson for a licence (all lessons) or pilot (its two); /from-school/<module>/<ref>.<sig> shows title, what was learned and the question to anybody, and the full note and lesson to any account, recording nothing. The ref is a pseudonym of the school's access code. Migration 386 adds profiles.school_share_ref and school_share_module, written once at the trial grant; PARENT_SHARE_SECRET on both Vercel projects. Justin applies 386. PR 1412.

## 5 November 2026: every reminder opens the part of the app it is about

Justin: a homework reminder he had asked DiGi for opened DiGi's chat; it should open the homework helper, and each reminder should link to the relevant service. lib/push/destination.ts reads the reminder's own words (homework, school, screens, bedtime, jobs, check in, lessons, scripts, agreement, devices; anything else stays on DiGi), opens that page for the child, and adds "Tap to open the homework helper." to the push. Also: the weekly review opens the week page, a finished tutor lesson opens the homework helper, and three child pushes open the child's app instead of the parent dashboard. Guard: check-push-destinations, in the checkin chain.

## 5 November 2026: Say This, the script cards deck

A new paid Etsy printable from Justin's ask for "Diary of a CEO cards but scripts for every moment": 60 cards, 50 parent scripts in five levels, one per Planet Friend (4 to 16). The format of premium conversation decks, our own look. Card 1 of each level is that stage's script in stages.ts (the Passport page's talk); the rest are live `scripts` rows word for word, each id in cards-data.js. £7.99 list, £5.99 on the permanent sale. On every Passport page under the talk, not ready until listed. Not uploaded. PR 1416.

## 6 November 2026: the rest of the Etsy paid line, built

Justin: "etsy top sellers research and add all products not yet added". Products 2 to 9 and 11 of content/etsy-shop/product-brief.md are built to the five packs' standard: the First Phone Kit, the Christmas Screen Free Countdown, Screens At Granny's, Are We Nearly There, the Holiday Screen Deal, the 30 Day Screen Reset Journal, Our Class Screen Promise, and two bundles photographed from the packs' real pages. The Whole System Bundle carries Say This where the brief named the free Five Fights words. Personalised Star Chart and the printed Passport are not in it. Research: screen time charts alone barely sell on Etsy, chore and routine charts do; five new formats wait for Justin's yes. Not uploaded. PR 1422.

## 6 November 2026: the first 20 sign ups, four doors and a link for each

Justin asked for founder podcasts, YouTube and launch sites reviewed and a plan for the first 20 sign ups. Read live: 4 stage checks started in 30 days, and of 32 accounts and 54 leads all but a handful are Justin's own test addresses, so there are no real sign ups yet. The research says parent products grow through groups parents already belong to (Smartphone Free Childhood, Wait Until 8th) and directories bring makers, not UK parents. So the plan is three weeks at 45 minutes a day, in this order: friends of friends, local press on the Christmas and ban moment, local parent groups with the admin's yes, one class or PTA together. Directories and app stores get one evening each. Nineteen tracked `/v/` codes made in `video_links`, one per door. Found: `starter_leads.converted` is false for all 54. Same day, Justin's answers: warm ring drafted to 30 people from his Contacts, press says Star near Winscombe, PTA talk drafts to the four nearest primaries, Google Play and Microsoft Store packaging in its own session; all drafts in Gmail, nothing sent. Plan: plans/week-of-2026-11-02-first-20-signups-plan.md. PR 1431.
## 5 November 2026: the app's copies of the five Passport packs match the Etsy ones

The app library and /starter-pack served old PDFs of the Starter Pack, Calm Down Corner Kit, Earn Your Screen Time and Family Phone Agreement, still carrying the damaged Friend art. They are now built from the same print.html as the Etsy editions with `build-pack.mjs <pack> app`: colour and ink friendly (the Colour in button), A4, minus the Etsy last page (Passport sticker, /etsy-bonus gift, Etsy review). The star chart builder uses public/digi-squad/friends and public/printables/friends is deleted. /etsy-bonus now says thirteen pages, no colouring page and no game, which is what the email delivers. PR to follow 1408.

## 6 November 2026: every Etsy download is in the app, free for parent and child

Justin: "all etsy downloads should be in app for free to child and parent." Every Etsy pack in the app library is free for any parent and opens straight away for the child, with no Ask and no paywall. Nine more are added (First Phone Kit, Christmas Countdown, Screens At Granny's, Are We Nearly There, Holiday Screen Deal, Screen Reset Journal, Star Swap Shop, Guided Times 1, Say This script cards, which are for grown ups only), and the Starter Pack is back in the grid. Not in the app as their own card: the Star Chart, the printable Passport (the app has both of its own), the Class Screen Promise (for teachers) and the bundles. `npm run etsy-in-app`, in CI, fails a new Etsy pack until it has an app edition. PR 1427.

## 6 November 2026: Etsy listing photos in the Canva look, varied per product
Justin: the photos "look more AI than Canva" and should not all look alike.
`listing-images.js`, `bundle-images.js` and the Passport's `images.html` now
build flat paper photos: serif headline, handwritten note, real pages on a
clipboard or fridge with washi tape, no 3D characters, road or ink outlines.
Each product sets one of five themes and one of three cover layouts so shop
neighbours differ. The Etsy creation setting stays "With an AI generator"
while AI made friends are printed on the pages. Rules in the printables
engine skill, step 7b.
## 6 November 2026: the five build next Etsy packs, built

From the top sellers research's build next list, in deadline order: the Phone Under The Tree Treasure Hunt (13 pages, Orbit, list by 20 November, now also in the Christmas Phone Bundle at the same £14.99), the Planet Day Flip Chart (25 pages, 120 picture cards), the Jobs Board for 11 to 15s (8 pages), What Would You Do? Table Talk cards (100 cards) and the Road to 16 Board Game (19 pages plus an A3 board). Every line has a proof path in the product; titles lead with the format that sells. build-pack.mjs gains fillable PDF fields (so "fillable" is true), an A3 output, and a Letter fix: Letter had been printing at about 88 percent and off centre, the older packs keep that until rebuilt. Not uploaded. PR 1425.
