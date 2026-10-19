---
name: ad-studio
description: Make Guided Childhood adverts the same way every time, built from what competitors' best performing ads actually do. Use whenever Justin says "make an ad", "make adverts", "ads like theirs", "what ads are working", "do an ad round", "remake this ad for us", pastes a screenshot of a competitor's ad or an Ad Library page, or wants to boost a post. Finds the competitor ads that have run longest (the best public sign an ad works), tears each down into hook, format, offer and proof, rebuilds the structure with our own message in our visual system, makes three to five hook variants, gates every claim, and plans an organic test before any money is spent. Keeps a results log so each round learns from the last. Never posts, boosts or touches Ads Manager.
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

**Nothing here posts, schedules, boosts or opens Ads Manager.** Justin does
all of that. If a step would publish or spend, stop and hand it over.

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
  19 October, matching the competitor ads. `ad-round-phone.json` is the model;
  the fields are documented at the top of `ad-template.html`.
- **Real screens for them:** `content/ads/screens/`. For a new one, capture a
  ref fixture or the live stage check at 390 wide and three times the pixels
  (`deviceScaleFactor: 3`), never a signed in family. A callout is a crop of
  the same capture, never redrawn. Set the phone's `bar` to the screen's top
  colour so the status bar runs into it.
- **Flat cards:** the original template (card type `cta`, one friend, one gold
  mark, `first-phone-ad.json`) is for organic posts and carousels. Use it for
  an ad only when the idea has no screen to show.
- **Video:** `.claude/skills/silent-ugc` (text hook over a real shot) or
  `.claude/skills/product-shorts` (the real app, problem to solution). Both
  keep their own rules; this skill only supplies the angle and the hooks.

Write the pack to `content/packs/<date>-<round>/README.md`: the cards, a
caption for Instagram (no link in the caption, "link in bio") and one for
Facebook (link in the body), and which card is the control.

## Phase 4 · The gates

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
5. **Only then a boost brief** for Justin, one short block: which post, the
   audience (UK parents of children 8 to 13, the first phone years), a small
   daily budget and a fixed end date, so the most it can cost is known before
   it starts. He sets the budget and decides whether to spend. Paid spend
   follows the order in `plans/DISTRIBUTION-PLAYBOOK-step-by-step.md`.

## Phase 6 · Log it

Add a row to `content/ads/results-log.md` for every variant that went out:
date, round, hook, format, link code, reached, stage checks begun, signups,
verdict (winner, loser, too early). Add one line of what we learned. The
next round reads this first.

## Hand over

Tell Justin in three parts and stop: what is in the pack (with the path), which
variant is the control and why, and what is needed from him (the screenshots,
or which to post first, or whether to boost the winner).
