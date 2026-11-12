# The ad system, step by step (11 November 2026)

Justin pasted Cody Schneider's "marketing engineer" talk (Greg Isenberg's
show) and asked to build that advertising system into what we already have,
step by step. It is outside advice, so it went through the feedback filter
first. Graph is the guest's own company and he was raising a round while he
said it, so the talk is weighed as a pitch as well as a method.

## What the talk says, weighed

| # | The point | Verdict | Why, against our objectives |
| :-- | :-- | :-- | :-- |
| 1 | Marketing is now code and tokens: the agent does the designer, copywriter and editor work | **Already built** | `ad-studio`, the social cards renderer, `silent-ugc`, `product-shorts`, HyperFrames. The labour is already code. |
| 2 | Give the agent a data warehouse (Airbyte into ClickHouse) and let it read only from there, never from the ad APIs | **Adapt** | The idea is right and we already have the warehouse: Supabase holds every source link (`video_links`), every open and stage check begun per link (`video_link_events`, with UTMs, migrations 372, 379, 388), and which link each family came through (`profiles.video_link`). What is missing is the ad side (reach, spend) and one read that joins the lot. No Airbyte or ClickHouse at our size: step 3. |
| 3 | Give the agent write access to Meta through the Marketing API, writes only, to upload creative and switch ads off | **Park** | The ad studio rule stands: nothing here posts, boosts or opens Ads Manager. The money rule says no spend until a winner is proven organically, so there is nothing to automate yet. Revisit once a boosted winner runs for a month: step 8. The talk's warning is adopted now: an agent hammering a platform API is how ad accounts get banned. |
| 4 | Tools: image and video model APIs, transcription, an LLM router, Apollo for leads | **Adapt** | We already hold Higgsfield, HeyGen, HyperFrames, local whisper and the renderer. No new subscriptions. Apollo and cold outbound to parents: **decline**, PECR forbids unsolicited marketing email to individuals. Schools outreach already has its own drafted email system. |
| 5 | `/static-ads <url>`: extract the brand, pull the competitor's ad library, mine Reddit for pains, propose five concepts, generate, upload | **Already built, mostly** | Ad studio phases 0 to 3 do this with our own brand file, the watchlist, the council's top ten parent problems and the 330 coded Reddit posts. **Adapt** the generation: our static ads are rendered from real screens, never an image model (visual system section 1: never an invented screen, never a regenerated character). The one gap is a single command that runs a round end to end: step 5. |
| 6 | AI avatar UGC: a voice clone, a real creator's photo remixed, Seedance lip sync, "looks insanely real" | **Decline** | Breaks `silent-ugc` rule 1 and ad studio gate 1: a synthetic person presented as a parent is a fake testimonial under the CAP Code, and remixing a real creator's face is a likeness problem. It also breaks commitment 5, evidence or silence. |
| 6a | ...but the mechanics: lock the render to the exact script, transcribe word by word, match it to the script, fix only the wrong words | **Adapt** | Worth having on real footage: Justin to camera and the product shorts. Step 6. |
| 7 | Real creators through a network API (Tribe, Sideshift), the agent as creator manager, paid per video plus a bonus | **Adopt, parked** | This is Part 4 of the distribution playbook already (paid parent creators, capped at £1,000). It waits for free traffic to convert. When it opens: the agent writes briefs, gives each creator a link code and reads their numbers; Justin pays. Step 7. |
| 8 | A creative director agent scores every ad before a human sees it, and a vision model loops the creative against the rules until it passes (how they do regulated markets) | **Adopt** | The highest value point in the talk. Today the ad studio gates are a checklist somebody has to remember; the council found five gate breaks in a round that had been "checked". Step 1. |
| 8a | ...trained on Ogilvy's books and a hundred ad podcasts | **Decline** | Copyright, and our bar is already written down: the council brief, the visual system and the research on what wins for parents. |
| 9 | A swipe warehouse: thousands of winning ads to draw from | **Adapt** | `briefings/notes/competitor-sightings.md` and the watchlist hold this as prose. Make each sighting a structured entry the round can sort by days live and structure. Step 4. |
| 10 | Store the exact spec of every ad (the JSON) and tie its results to it, so you learn at the level of each element | **Adopt** | Our cards are already JSON decks. Give every card a link code in the deck, and the code is the join from the spec to stage checks begun, signups and payment. Step 1 (the fields) and step 3 (the read). |
| 11 | Creative velocity: ship cohorts of thirty and let Meta's algorithm find the buyers | **Park** | True for big budgets. At a few pounds a day thirty ads never leave learning, and the money rule tests on organic first. The system makes variety cheap; the test stays one hook at a time until a winner exists. |
| 12 | A Google Ads agent auditing search terms for buyer intent | **Park** | We run no search ads. Search pages come after creators in the channel order. Note it for then. |
| 13 | Run the harness in the cloud around the clock | **Already built** | Routines already run the research, review board and drafts. |
| 14 | Use Graph | **Decline** | A vendor pitch. Everything we need is in the repo or already paid for. |

Nothing here is a decision only Justin can make except the one he already
made by asking: build it. Two lines need his eye when they come up: step 7
spends money, step 8 gives an agent write access to a paid account.

## The steps

Each step is one small pull request, merged before the next starts.

1. **The creative director gate.** `npm run ad-gate` checks every card in an
   ad round deck against the rules a machine can be right about: the full
   hook on every card, a link code per card, real screens only, no dashes, no
   borrowed proof or numbers, no promised outcome, no words a competitor owns,
   butter as a mark not a ground, no 3D character. Then the skill's vision
   pass: open every rendered card, score it out of ten on a fixed rubric, fix
   and re render anything under eight, three loops at most, and only then
   hand it to Justin. A round deck carries a `round` and each card a `src`,
   which is the ledger the later steps read. **This PR.**
2. **The first round through the gate.** Rebuild the council's Round 1 (five
   hooks, one held treatment) as a round deck, render, gate, and make the five
   links. Justin posts.
3. **The results read.** `npm run ad-results -- <round>` reads Supabase for
   each card's code: opened, stage checks begun, signups, paid. Justin adds
   reach (and spend, once there is any) from the post insights, and the
   script writes the rows into `content/ads/results-log.md` with the verdict
   by the existing rule (most checks per thousand reached, 300 reached
   minimum).
4. **The swipe file, structured.** One entry per competitor ad in
   `content/ads/swipe/`: who, days live, versions, hook, format, offer, proof,
   the structure to borrow. The round reads it to pick structures.
5. **One command per round.** The skill's phases chained: read the results
   log and the swipe file, pick the structure, write five hooks against the
   parent problems, build the deck, render, gate, write the pack.
6. **Video, on real footage.** The script lock and word by word check on
   Justin's talking head and the product shorts, so a wrong word is cut and
   replaced, never regenerated.
7. **Creators (when Part 4 opens).** Briefs, a link per creator, their numbers
   in the same read. Justin books and pays.
8. **Meta writes (when a winner is spending).** Writes only, rate limited, a
   human approval on every change, every read from our own tables. Justin's
   call on the access token.

## 11 November, later: step 2 done, and two things Justin moved

Justin asked for step 2 with the creating and the uploading to Facebook and
Google set up as well, at a top finish, and asked why not an avatar.

- **Step 2 is built**: `content/packs/2026-11-11-round-1/`, five cards in the
  council's held treatment, gated, measured for butter and scored.
- **Step 8 came forward, fenced.** `npm run ad-upload` loads a round into
  Facebook and Instagram ads with everything PAUSED. Switching on stays with
  Justin. It is proved against a stand in only, since no token exists yet.
  Google waits for a developer token and a winning hook
  (`content/ads/SETUP.md`).
- **The avatar.** The decline in row 6 was never "no avatar". It is "no
  synthetic person presented as a real parent or customer", because that is a
  testimonial nobody gave. An avatar of Justin himself, saying what Justin
  would say, is allowed by `silent-ugc` (he is option 2, the face already) and
  is what `lesson-video` already uses. So step 6 becomes: one script, read
  twice, once by Justin's own digital twin and once by Justin on his phone,
  each with its own link code, and the numbers decide. Whether the twin reads
  as AI made, which the council found costs attention, is the thing the test
  measures.

## 11 November, evening: the goal, the swipe file, and what the accounts need

Justin set the goal: the best performing adverts, built on what is proven,
copying the adverts that worked as far as we can, with Facebook and Google
ready to upload to.

- **The goal is written down** in `content/ads/proven-rules.md`, with the one
  number it is judged on.
- **Step 4 is done**: `content/ads/swipe/ads.json`, 21 adverts from six
  companies, and nine rules drawn from the eight that have run 90 days or
  more. The first rule changes the order of work: everything past 180 days is
  video, so the video round (step 6) comes next, before more cards.
- **"As much as possible" has a line.** We copy structure. Their pictures,
  films and sentences stay theirs, and the sweep stays by hand: a scraper
  breaks Meta's terms on the account we mean to advertise from.
- **The accounts are not ready, and not for the reason expected.** Looked at
  both, read only. The Facebook Page (The Guided Childhood) is owned by the
  Inspired by Alma business portfolio, where Justin has partial access, so he
  cannot make a system user there. His own ad account is an old one with an
  expired card and Etsy campaigns in it. The Google Ads login opens another
  business's account. Guided Childhood needs its own of each:
  `content/ads/SETUP.md`, rewritten to what is actually there.

## 12 November: the second talk, and the loop

Justin brought a second talk (the seven new rules, https://youtu.be/xsdoHywBD0I)
and asked for the best of both in a routine that reads the results and keeps
us ahead of the competitors. Weighed in `plans/2026-11-12-second-ad-video-weighed.md`.

- **Step 3 is built**: `npm run ad-results`, Meta's reach and spend per
  advert (reads only) joined with our own counts per link code, judged by the
  results log rule.
- **The loop is written down**: ad studio Phase 7, every Monday. Read, log,
  keep the winner and make segment versions of it (two or three words
  changed, the second talk's rule 1), look at the competitors, once a month
  ask the chatbots who they recommend, make next week's round.
- **Declined from the second talk**: rewarding people for reviews (unlawful
  when hidden in the UK) and handing the ad account to a third party MCP.
