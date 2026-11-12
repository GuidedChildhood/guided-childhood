---
name: ad-studio
description: Make Guided Childhood adverts the same way every time, built from what competitors' best performing ads actually do. Use whenever Justin says "make an ad", "make adverts", "ads like theirs", "what ads are working", "do an ad round", "remake this ad for us", pastes a screenshot of a competitor's ad or an Ad Library page, or wants to boost a post. Finds the competitor ads that have run longest (the best public sign an ad works), tears each down into hook, format, offer and proof, rebuilds the structure with our own message in our visual system, makes three to five hook variants, gates every claim, and plans an organic test before any money is spent. Keeps a results log so each round learns from the last. Can load a round into Facebook and Instagram ads switched off; never posts, never switches an ad on, never spends.
---

# Ad studio

Justin, 19 October 2026: yes to making adverts like the ones we have seen
competitors run, with a skill so it happens the same way every time.

**The one rule: copy the structure, never the message.** A winning competitor
ad shows what works. That might be a short hook naming one moment, a real
screen in a hand, or two plain lines and stop. Copy that. Their message
belongs to them and mostly sells the wrong thing (blocking, battle, fear).
Ours is the gap none of them fill: getting a child ready for a phone and
social media, together, staged to 16. An ad that sounds like Qustodio loses
the one thing that makes ours worth clicking.

**Nothing here posts, switches an ad on or spends.** Justin does all of
that. One thing changed on 11 November 2026, at his ask: `npm run ad-upload`
loads a round into Facebook and Instagram ads with the campaign, the ad set
and every ad PAUSED (Phase 5). Paused is the fence. If a step would publish,
switch something on or spend, stop and hand it over.

## Phase 0 · Read, every time

1. `THE-STORY.md` sections 1, 2, 9 and 10: the one line story, parents' own
   words for the problem, the money rule, the marketing story, and the hook,
   word for word: *What stage is your child? Three questions, no sign up.*
2. `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`: the six permanent formats, which
   friend owns which topic, the evidence rule, the section 16 checklist.
3. `briefings/notes/competitor-sightings.md`: every product already seen, and
   "What to take for our campaigns" (the seven lessons, including the do not
   copy list). Do not rediscover what is logged.
4. `content/ads/results-log.md`: what already ran and what it did. Never
   remake a loser without saying why this time is different.
5. `ad-library-watchlist.md` in this folder: who to watch and the links.
6. `content/ads/proven-rules.md`: the goal, and what the adverts that have run
   longest share. `content/ads/swipe/ads.json` is the evidence under it, one
   entry per advert read. Add to both after every sweep.

## Phase 1 · Find the winners

**How long an ad has been running is the best public sign it works.**
Nobody keeps paying for an ad that does not sell. The Meta Ad Library shows
every live ad on Facebook and Instagram, with "Started running on" and how
many versions are live. Score each ad on two things:

- **Days live.** 30 days or more is a probable winner. 90 or more is a proven
  one. Under 14 days tells you nothing yet.
- **Versions.** The same idea in several versions (different hooks, crops or
  first lines) means they are testing around something that works. The idea
  they keep is the signal.

This is a clue, not proof. Say so in the teardown, and never quote another
company's results as ours.

**Getting the ads.** The Ad Library blocks cloud sessions. Use whichever of
these is available, in this order:

1. **Justin's screenshots.** Send him the links from the watchlist and ask for
   a screenshot of each ad that shows the "Started running on" date. This is
   how the first two sweeps worked.
2. **A browser on his computer**, if one is linked to the session (Claude in
   Chrome or the built in browser; load that skill first). Read the library
   pages directly. Never log in as him or click an ad.
3. **Ads seen in his feed.** A screenshot of an ad in the wild still counts
   for the teardown, but has no days live figure, so it ranks below a library
   ad that has run 90 days.

**What a sweep keeps.** For each advert: who, the library id, days live,
whether it is in several versions, video or image, the hook in a few words,
what the picture is of, what to borrow and what to leave. That goes in
`content/ads/swipe/ads.json`. Their images, films and body copy are never
saved into the repo or reused: they are theirs, and we borrow structure only.
A sweep is read by hand, a handful of pages, in Justin's browser. Never a
standing scraper: collecting from the library by machine breaks Meta's terms,
and it is the same account we advertise from.

Pick the five strongest across the watchlist. Fewer good ones beat many weak
ones.

## Phase 2 · Tear each one down

One block per ad, appended to `briefings/notes/competitor-sightings.md` under
a dated heading, in the same shape as the existing entries:

- **Who, where, days live, versions.**
- **Hook:** the first line or first two seconds, verbatim.
- **Format:** which of our six formats it is closest to (big hook, character
  and question, printable, product screen, journey, parent situation), or
  video (silent text hook, talking head, screen recording).
- **Offer:** free download, trial length, price shown or not, quiz.
- **Proof:** what makes it believable (a real screen, a named expert, a
  number, a review count). Note whether it is real or empty.
- **Why it probably works**, in one line.
- **Borrow / do not borrow.** Borrow only structure. Anything on the do not
  copy list is out, however well it seems to perform.

## Phase 3 · Rebuild it as ours

For each borrowed structure, write one angle: the moment, our answer, and the
proof path in the product. Then three to five hook variants on that angle.
The hook is the variable we test. Change the hook, keep everything else the
same, or the test tells us nothing.

Every variant:

- **Leads on our gap.** The first phone, social media, the road to 16, the
  words for tonight's argument, the child earning their time. Never
  "battle", which Qustodio now owns, and never a fear button.
- **Uses one of the six formats** and an approved character file, unaltered.
  A product screen is a real screenshot (`screens-shotlist.md` in
  `content/ugc/` lists what exists); never an invented screen.
- **Ends at the stage check**, with the hook word for word.
- **Has a proof path.** Every claim on the card is something the product
  does today, and the teardown names the screen that proves it.

Make them with the tools we already have:

- **Phone ads, the default:** a deck with `"template": "ad"` in
  `tools/social-cards/decks/<round>.json`, rendered with
  `npm run social-cards -- tools/social-cards/decks/<round>.json`. It draws a
  real device with a real screen in it, at 2160 by 2700, with one line of the
  screen lifted out large as a callout. This is the quality bar Justin set on
  19 October, matching the competitor ads. The fields are documented at the
  top of `ad-template.html`. `ad-round-phone.json` shows the layout but
  predates the council and fails the gate; do not copy its copy or its look.
- **Every deck is a round, every card has a code.** The deck carries
  `"round": "<yyyy-mm-dd>-<name>"` and every card `"src": "<code>"`, its own
  link code, never reused (for example `ig-1111-mid-match`). This is the
  ledger: the card's exact spec in the deck, joined by its code to the opens,
  stage checks begun and signups the database counts per link. Make each
  code on the founder links page before the post goes out.
- **Real screens for them:** `content/ads/screens/`. For a new one, capture a
  ref fixture or the live stage check at 390 wide and three times the pixels
  (`deviceScaleFactor: 3`), never a signed in family. A callout is a crop of
  the same capture, never redrawn. Set the phone's `bar` to the screen's top
  colour so the status bar runs into it.
- **The Round 1 treatment, the default for a hook test:** `"layout": "stacked"`
  on the deck. Headline full width, one flat real screen in a fixed slot (no
  phone frame, glow or callout), the espresso button, the hook line.
  `2026-11-11-round-1.json` is the model. A card's `screen` is a crop of a
  real capture; `node tools/social-cards/capture.mjs say <script id> <name>`
  captures a public script page and prints the crop, from SAY THIS to the end
  of its quote. The renderer prints each card's butter share and fails over
  10 percent.
- **A picture of the moment, behind the real screen:** a stacked card may
  carry `scene`, a generated photograph that fills the slot with the real
  screen sitting on it (`2026-11-11-round-1.json` is the model). Ask for
  the subject in the left third and the rest soft and empty, so the screen
  has somewhere to sit. The
  competitors' longest running ads all lead with a picture; this is how ours
  does without inventing anything. The rules are visual system section 15,
  all of them: a room or objects only, never a person, a child's face, a
  character, a logo or a screen; no text in the image; our palette; and
  **Justin's yes on the credit cost before any paid generation.** GPT Image
  on Higgsfield is 2.75 credits an image at 2k. Scenes live in
  `content/ads/scenes/`, apart from the real captures, and the gate refuses a
  scene with no real screen on it. Video is a different order of cost:
  Seedance 2.5 is 128 credits for eight seconds at 1080p.
- **The words beside the card:** every round card carries `ad`: `text` (what
  runs above the card), `headline` and `description` (the hook, word for
  word). The gate holds them to the same rules as the card.
- **Flat cards:** the original template (card type `cta`, one friend, one gold
  mark, `first-phone-ad.json`) is for organic posts and carousels. Use it for
  an ad only when the idea has no screen to show.
- **Video:** `.claude/skills/silent-ugc` (text hook over a real shot) or
  `.claude/skills/product-shorts` (the real app, problem to solution). Both
  keep their own rules; this skill only supplies the angle and the hooks.

Write the pack to `content/packs/<date>-<round>/README.md`: the cards, a
caption for Instagram (no link in the caption, "link in bio") and one for
Facebook (link in the body), and which card is the control.

## Phase 4 · The creative director, then the gates

Nothing reaches Justin until it has passed a reviewer that is not the maker.
Two passes, in this order, and a card that fails goes round again. Three loops
at most; a card still failing after three is dropped from the round, with a
line in the pack saying why.

**Pass 1, the machine: `npm run ad-gate`.** Run it on every round deck before
rendering. It fails on anything a script can be right about: the full hook on
every card, a unique `src` per card, real screens only, dashes, borrowed
proof, an unnamed expert, a promised outcome, competitor words and fear
buttons, butter as a ground, more than one gold mark, a question outside the
button, tilted callouts. Fix the deck until it passes. Never weaken a rule to
get a card through; if a rule is wrong, that is a decision for Justin and a
change to `scripts/check-ad-round.mjs` with the reason.

**Pass 2, the eye: the vision review.** Render, then open every PNG with the
Read tool and score it out of ten, one point per line, writing the scores into
the pack README:

1. The moment is named in the first three words of the headline.
2. Readable at thumbnail size: shrink it in your head to a third of a phone
   width; the headline and the hook still read.
3. The screen proves the headline; a parent could find that screen in the app.
4. One gold detail, a third of the card empty, nothing glows or shines.
5. It looks like a real app screenshot in a plain card, not a made image.
6. Nothing is cut off, overlapping or sitting in the outer 5 percent.
7. It sounds like a parent talking, in parents' own words
   (`research/homepage-audience-language.md`), not like us.
8. It could not be a Qustodio, Bark or Kairoo ad with the logo swapped.
9. The hook is the only thing that changes between cards in a round.
10. Justin would post it without changing a word.

Under eight: name the lines it lost, fix them, render and score again. At
eight or more it goes on to the gates below, which the two passes do not
replace: the pass checks the card, the gates check the claims.

### The gates

Every card and caption passes all of these, or it does not go in the pack.

1. **No synthetic person** presented as a parent or child, in any frame. Not
   a close call: see `silent-ugc` for the reasons.
2. **No testimonial that nobody gave.** A scenario quote carries an eyebrow
   such as A THING PARENTS SAY. UK ad rules (the CAP Code) want testimonials
   genuine and held on file, and claims backed by evidence before they run.
3. **No numbers we do not have.** No star ratings, review counts, user counts
   or "parents love it". A research number goes through the evidence rule in
   the visual system, and association is never sold as cause.
4. **No "expert built" without a named expert** who agreed to be named.
5. **No outcome promised for a child.** We give the stage and the next step,
   never "ready" or "safe".
6. **No dashes** on the card, the caption or the alt text. Run
   `npm run ai-tells` over the pack README.
7. **Section 16 checklist** of the visual system, every item.
8. **Hidden thread and engagement rules** (`content-engine/hidden-thread.md`,
   `content-engine/linkedin-engagement.md`) where the ad doubles as a post.

## Phase 5 · Test free, then spend on the winner

The money rule (`THE-STORY.md` section 9): never pay to find out if something
works, only to scale something proven.

1. **Give each variant its own link.** Make a link per card on the founder
   links page (`/dashboard/admin/videos`, channel "Instagram" or "Facebook").
   The stage check counts starts per link through `?src=<code>`. Without a
   link per variant, the test cannot be read.
2. **Post as ordinary posts** on the family account, a few days apart, one
   variant at a time. Justin posts.
3. **Judge on stage checks begun and signups**, never likes or views. The
   founder links page shows both per link. Give each post seven days.
4. **The winner** is the variant with the most stage checks begun per
   thousand people reached, with at least 300 reached. Below that, call it
   too early and keep it running.
5. **Load it into Meta, switched off.** `npm run ad-upload -- <round>` is a
   dry run that prints every call; `--go` sends them. It refuses a deck that
   fails the gate, uploads the cards from `content/packs/<round>/`, and
   creates one campaign, one ad set and one ad per card, all PAUSED, each ad
   linking to its own code with `utm_medium=paid`. The ids land in
   `content/ads/meta/<round>.json` so a second run never makes a copy. The
   audience and budget come from `content/ads/meta/config.json`. Setup is in
   `content/ads/SETUP.md`. It never reads results from Meta; results come
   from our own tables. Justin switches on only the winner.
6. **Only then a boost brief** for Justin, one short block: which post, the
   audience (UK parents of children 8 to 13, the first phone years), a small
   daily budget and a fixed end date, so the most it can cost is known before
   it starts. He sets the budget and decides whether to spend. Paid spend
   follows the order in `plans/DISTRIBUTION-PLAYBOOK-step-by-step.md`.

## Phase 6 · Log it

Add a row to `content/ads/results-log.md` for every variant that went out:
date, round, hook, format, link code, reached, stage checks begun, signups,
verdict (winner, loser, too early). Add one line of what we learned. The
next round reads this first.

## Phase 7 · The weekly loop, every Monday

Both talks Justin brought (11 and 12 November 2026) end on the same loop, and
it is what keeps our adverts ahead of the competitors' rather than level with
them: make, test, read, keep the winner, vary it, again. One pass a week, in
this order, about forty minutes. Nothing in it posts, switches on or spends.

1. **Read the numbers.** Run this with the Supabase connector (project
   `zgkdfiwtnzqmtfgfsxzo`), with the round's code prefix:

   ```sql
   select l.code,
     count(*) filter (where e.kind = 'opened')  as opened,
     count(*) filter (where e.kind = 'started') as started,
     (select count(*) from public.profiles p where p.video_link = l.code) as signups,
     (select count(*) from public.profiles p where p.video_link = l.code
        and p.subscription_status in ('active','trialing')) as paying
   from public.video_links l
   left join public.video_link_events e on e.code = l.code
   where l.code like 'r1-%'
   group by l.code order by l.code;
   ```

   Save the rows as JSON in the scratchpad and run
   `npm run ad-results -- <round> --counts <that file>`. It adds Meta's reach,
   clicks and spend for any advert the uploader loaded, judges each card by
   the results log rule (most stage checks begun per thousand reached, at
   least 300 reached) and saves `content/ads/results/<round>.json`. For
   organic posts, Meta has no ids for them: ask Justin for each post's reach
   from its insights, or add `reach` to the counts file.
2. **Log it.** One row per card in `content/ads/results-log.md`, and one line
   under "What we learned". A card with a verdict never changes it later.
3. **Keep the winner, vary it.** For a winner: write segment versions that
   change two or three words and nothing else (`content/ads/proven-rules.md`
   rule 10), one per segment from the stages and the moments, each with its
   own `src`. For a loser: retire it, and say in the log why the next card
   is different. Too early: leave it running.
4. **Look at the competitors.** Open the watchlist links in Justin's browser,
   a handful of pages (Phase 1). Anything new past 30 days goes in
   `content/ads/swipe/ads.json`; anything past 90 that does something we do
   not, write up against the rules. Note any competitor now saying what our
   cards say (as Kairoo did with "Jobs first" on 6 November): that card's
   hook gets rewritten.
5. **Once a month, the chatbot check** (proven rule 12 and the second talk's
   rule 4): ask ChatGPT, Claude and Gemini "what is the best way to get my
   child ready for a phone in the UK" and "best app to help with screen time
   arguments UK", and log who each names, in `content/ads/swipe/ai-answers.md`.
   We are named or we are not; the trend is the point.
6. **Make next week's round.** The new variants and any new hooks, through the
   gate, the vision pass and the claim gates (Phase 4), rendered and packed.
7. **Hand over** in three lines: what won, what is new for this week, and
   what Justin needs to do (post, switch on, or nothing).

Stop the loop and say so if the read shows something wrong rather than slow:
links counting nothing after a post went out, a card refused by Meta, a
competitor copying a card word for word.

## Hand over

Tell Justin in three parts and stop: what is in the pack (with the path), which
variant is the control and why, and what is needed from him (the screenshots,
or which to post first, or whether to boost the winner).
