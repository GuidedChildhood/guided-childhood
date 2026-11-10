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

## 6 November 2026: the week of 9 November approved as recommended

Justin said go on the recommendations: a Thursday film slot for two weeks, kept only if `/v/` numbers show films bring stage checks; the Robux film ships with no tool beat (the star deal buys minutes, not Robux) and its opening line as is; the phone carousel on Saturday 14 November; Snap Map on Friday 13 only if he has the time Thursday, else Friday 20; the PACK gate only on days he can reply within hours; bio "Not a ban. A plan." He makes the four film links and merges. Detail: content/brand-story/weeks/2026-11-09/review.md. PR 1424.
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

## 6 November 2026: the Guided Times has its own app edition

Justin said yes to an app version without the Etsy pages. `build.mjs issue-1 app` prints `?edition=app`: no shop page, the back page swaps the /etsy-bonus gift and Etsy review for app lines, and the contents renumber. Eleven pages, colour and ink friendly; the Etsy and taster editions are unchanged. Issues 2 and 3 carry the shop on their back page and need an app back page first.

## 6 November 2026: Google Play and Microsoft Store packaging, payments stay on the web

Section 7 of the first 20 sign ups plan. The Play app is a Trusted Web Activity (`com.guidedchildhood.app`, Bubblewrap, `npm run android-build`), opening `/dashboard?source=play`; the upload key lives in `~/GuidedChildhood-signing/`, never in git. Families policy applies: children use the child side and a child's link opens in the app. Payments inside the Play app would breach Play's billing rules for UK users, so the Play app goes consumption only (no payment links while `source=play`), which is a follow up that must land before the first closed test upload, with a report button on the child's hint card and a privacy policy update. Microsoft allows our own billing for non game apps, so Windows needs none of that. Everything Justin does is in `app-stores/README.md`. PR 1434.

## 6 November 2026: endings at a natural stopping point, not a warning

Evidence map C1: Hiniker 2016 (ages 1 to 5) found warned endings went with more upset. Every remaining line advising a warning now says to stop at a natural end and name what comes next: the controller fights proof line, the dinner and Roblox seed scripts (seed only, neither is a live row), and three printables, PDFs rebuilt. The app lines C1 names were already fixed by 371 and 375. The live scripts table cites Hiniker only against warnings. Two lessons built on a warning step (Foundation "the whisper", KS2 ks2-04 "warn, finish, swap") wait on Justin. PR 1452.
## 6 November 2026: UTMs kept with the sign up, TikTok and YouTube channels

Funnel audit fixes 4, 7 and 8. `/v/<code>` and `/starter-pack` keep the four utm_* values: on the opened and started rows, in a `gc_utm` cookie, and on the profile at the trial grant beside `video_link` (migration 388, with `video_link_utm_counts` and a By post table on the founder page). Values are slugs only (shared/utm.ts, checked again in the database), so personal data in a link is dropped. `tiktok` and `youtube` are channels. The intro is "Your free stage check" and a visit from a post opens on question one. The schools pilot form notes src and UTMs. PostHog still needs its key set in Vercel. Plan: plans/2026-11-06-utm-attribution-plan.md.
## 6 November 2026: no name or email address in a URL
The pilot letter's licence link carried ?school=&name=&email= (funnel audit fix 8). It now carries a random token on the row (migration 387), resolved on the schools pricing page. The sweep found the same habit in the lead stop and starter links (now a sealed AES-GCM token, old links still honoured), the sign up and sign in redirects (?email=, now device storage) and DiGi's ?add_child=<name> (now tab storage). `scripts/check-no-pii-in-urls.mjs` holds it in CI. DiGi's ?q= prompts can still carry a child's name: left for its own change. PR 1450.
## 6 November 2026: real photos first, filled in, on every listing

Justin: "make the real images the first image on Etsy", "real images for all listings and super real images", "make the chart look great printed out, special that someone will buy". The real life photo is now photo one (the thumbnail) on every listing, and the Canva cover moves a few places in. The eight scenes are enlarged to 2160px on Higgsfield, and scene-composite.mjs now matches the page to the room (nine samples a pixel for lens softness and clean edges, ink lifted to what a printer lays down, paper fibre and grain). Charts set `inUse`, so the photo shows them filled in by `content/printables/in-use.js`: a name, jobs written in, a week of stars, the daily totals. Only the photo is filled in, never the product. The card decks, both bundles and the Guided Times get real photos too, so all 23 listings have them. Rules in the printables engine skill, step 7b.

## 7 November 2026: a question for DiGi never rides in the URL as words
The follow up PR 1450 left: about thirty links opened DiGi as `?q=<question>` or `?ask=<question>`, often with a child's name and the family's own words (a deal change ask, a homework, a follow up). Client code now holds the question in the tab (`DigiAskLink`, `holdDigiPrompt`, `shared/digi-handoff.ts`) and links to `/dashboard/digi?held=1`; server code (crons, notification collectors, stored card hrefs, suggestions) seals it with AES-GCM for that parent only (`digiPromptHref`, `lib/digi/prompt-token.ts`, no migration). Old `?q=` and `?ask=` links still open and are stripped from the address bar; old card hrefs are resealed on the way out. Script titles and device guides move too: the guard cannot tell a variable holding a script title from one holding a child's name, so only a fixed string may ride as `?q=`. `check-no-pii-in-urls.mjs` fails any computed DiGi question. Found on the way: the old `?q=` strip ran before Next hooked history, so the refresh after a sent question put the words back in the address bar; it now waits a tick. PR 1455.
## 7 November 2026: the two lessons stop teaching the warning

Justin: "Rewrite both." The Foundation home lesson's five minute whisper becomes the stopping place, picked before the screen goes on; KS2 ks2-04's cool down lap becomes agree, finish, swap, and ks2-05's recall follows. Migration 389 (gen-389.mjs) writes them, guarded on production's hashes so a hand edit aborts it. Not applied. PR 1452.

## 9 November 2026: 388 and 389 applied, and three that were live with no ledger row

Justin: "Merge 388 and 389 and any others in superbase". The sweep found five
candidates with no ledger row. The live schema cut that to two: 381, 382 and
383 were already applied in full (tables, indexes, policies, RLS, grants and
383's muse row all present), they just never got a ledger entry. They have one
now, so the next sweep stops re-reading them. A missing ledger row is not
evidence a migration did not run, which is why the probe comes second.

388 went in as one transaction, because it drops and re-adds the channel
constraint and a timeout between the two would leave video_links unconstrained.
All 33 rows already fitted the new list, which only adds tiktok and youtube.

389 is the one worth keeping. It is 101 KB, and a 27 KB single line is what
scripts/module-to-chunks.mjs calls the least reliable thing in the pipeline.
It did not need carrying: production held the old module files, so only the
difference had to move. Diffing the old and new content/modules in git gave
49 changed leaf values, which became 49 jsonb_set statements of a few hundred
bytes each, paths computed rather than hand derived. 14.8 KB instead of 76 KB,
no line over 653 characters.

What makes it safe is the ordering, again. Each deck ran as one transaction:
389's own guard on the before hash, the updates, then an assertion that the
deck now hashes to 389's after hash. Both after hashes were first proved in
Python to equal the repo's content/modules, so a wrong paste could not commit,
it could only roll back. The Foundation lesson was verified the same way, by
an order independent digest of all 83 string values plus the three columns.

Verified after: ks2-04 is d5d3b529, ks2-05 is aed88edc, both equal to the
files; zero live lessons mention the whisper and zero school decks mention
warn, finish.

Two things found on the way. 384 is used twice in the ledger,
384_the_match_ending_is_agreed_first and 384_digi_learned_rules, so one of
them was numbered over another lane's migration. And 383's muse_calls still
carries a default select grant to authenticated, which its own comment says
nobody but the service role should reach; RLS with no policies means a parent
sees zero rows, so nothing is exposed, but the grant should not be there.
## 9 November 2026: the usual rows, thirty everyday flashpoints headed off

Justin's Monday morning row over an 11 year old's room, and 29 more like it. `lib/content/family-flashpoints.ts` is the twin of the device issues bank for rows that are not about screens. Each row has the parent's line first, the plan, the child's part, the real scripts, a source (checked, one demoted and rephrased) and a heads up. `/dashboard/flashpoints` says "these happen in every house". One tap raises the row as a concern and turns on its heads up, which replaces the usual window push on the day and in the window it happens, at most two days a week, and never goes to a child's device. The plan can be sent to the other parent with the share sheet. DiGi reads the rows when no device issue matches. The room reset stays a starred job, as the template already has it. No migration. Guard: `check-family-flashpoints`. PR 1461.

## 9 November 2026: main green again after 1452 and 1458

Two merges turned main red and nobody's PR could go green on top. 1458 sealed the DiGi links and four guards still read `?q=` and `?ask=`; they follow `digiPromptHref` and `DigiAskLink` now, and a hand typed `#fff` became `var(--white)` (PR 1464). 1452's agree, finish, swap lengthened two ks2-04 slides past the wall: slide 17's teacher script and slide 9's question, both tightened with nothing taught changing; migration 390 carries the same two edits, guarded per value on the live text (checked read only, both match), not applied (PR 1465).

## 9 November 2026: one click lesson tracking, audited, not built

Justin asked for one tap delivery records, optional assessment and automatic reports across every lesson type. Audit and spec in `plans/2026-11-09-one-click-tracking-spec.md`. Finding: the tracker and every curriculum mapping already exist, but delivery lives in one browser's localStorage, so there is no whole school record. Proposal: one `schools.lesson_deliveries` table keyed by the existing school pseudonym, framework credits computed at read time (no double counting), seven reports off one query. Needs Justin to reverse the 29 August "no delivery state on the server" rule. Waiting on his approval; nothing built.

## 9 November 2026: the pilot teacher's French arrives in the languages tab

Justin asked for her KS2 French (french-curriculum.pages.dev) on the platform as its own tab, in our structure. `scripts/languages/sync-french.mjs` parses her site's data files without running them into `schools/lib/languages/fr.json`; `/languages/fr` generates the year view, unit, lesson, full screen teach (her decks framed) and a KS2 coverage grid from it. Media stays on her host for now (186 MB for two units). The nav gets a Languages tab only for a languages code, so the 9 October hidden rule holds; `check-languages-door` allows that one conditional link. Plan with eight improvement ideas: `plans/2026-11-09-french-into-languages-plan.md`.

## 9 November 2026: tracking approved, bridge b reversed for delivery records

Justin approved the one click tracking spec as recommended: delivery records go on the server (the 29 August bridge b rule reversed for these only, still no pupil data or accounts), anyone with the school code sees and corrects them, optional teacher initials, optional 280 character note, and he reads the DPA and privacy wording before PR 1 merges. French: Mark delivered is its first improvement, its media moves to our storage now, and it stays hidden until launch. Detail in the spec's Decided table.

## 10 November 2026: French media mirrors into our storage, from GitHub

Justin's 9 November call. `scripts/languages/mirror-french-media.mjs` copies the 104 decks, songs and sheets into the public `languages` bucket, run by `.github/workflows/languages-media.yml` because GitHub already holds the Supabase key (no key typed anywhere). Pages use one route, `/languages/fr/media`, which serves our copy and falls back to her site until a file is mirrored. Decks are served sandboxed so their scripts never run as the schools app. Also fixed: the "What I can do" sheet was missing from unit pages.
