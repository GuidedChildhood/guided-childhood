---
name: social-week
description: The Sunday batch for Guided Childhood social. Turns next week's content and image sheet into finished, on brand cards and captions for Instagram and Facebook (and the Guided Childhood LinkedIn page), renders them with tools/social-cards, and refreshes the one pinned "GDC posts" page Justin opens each morning. Use when the Sunday routine fires, or whenever Justin says "do the social week", "build next week's posts", "run the Sunday batch", "make this week's cards". Never posts and never schedules; Justin does that.
---

# The social week

Decided by Justin, 5 October 2026: **a Sunday batch, and he posts.** Sunday
evening this skill builds the whole week. Each morning he opens one page,
sees today's post first, saves the cards, copies the words and posts. Or he
schedules the whole week in Meta Business Suite in one sitting on Sunday.

**Nothing here posts, schedules or sends.** If a step would publish to a
social platform, stop.

## The page

One pinned page, refreshed every Sunday, same link for ever:
**https://claude.ai/artifact/1yUXSQ4EdHBThHkEPfWf7v** ("GDC posts").

## Phase 0 · Read, every time

1. `THE-STORY.md` sections 1, 2 and 10: the one line story, the customer,
   the marketing story, the stage check hook.
2. `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`: the six formats, which friend owns
   which topic, the colour rule, the evidence rule. Every card obeys it.
3. `content/brand-story/visual-system.md`: sizes, the Facebook rule (card
   one only), the last card is a save and send ask.
4. `content/brand-story/weekly-rhythm.md` and `.claude/skills/family-social/SKILL.md`:
   the four anchor days, the family voice and its Phase 3 checks (voice,
   dash, claim, hidden thread, pathway, clinician, character, consent).
5. `content/brand-story/posted-log.md`: what already went out, so nothing
   repeats.

## Phase 1 · Find the week's brief

The Monday the week starts on is `<monday>` (YYYY-MM-DD).

1. In Google Drive, search the Control Room folder
   (`parentId = '1SKfJggHdP7P50gH1c7lrnrQi6b2_kPfP'`) for the newest
   spreadsheet titled "Weekly content and image ideas" covering that week.
   The `weekly-content-sheet` task makes it every Sunday at 18:00. Read it:
   one row per post, with the platform, the idea and the image idea.
2. If there is no sheet for that week, plan from the four anchor days in
   `weekly-rhythm.md` and the next unused services in
   `content/brand-story/service-post-map.md`, and say so at the top of the
   pull request. Never invent a post to fill a slot; a slot with nothing
   true to say is left empty and named.

Out of scope here: Justin's own LinkedIn (a real photo, or the `viral-post`
research card), Substack, TikTok and video. Those have their own skills.

## Phase 2 · One deck per post

For each Instagram, Facebook or Guided Childhood LinkedIn page post:

1. **Pick the format** from section 8 of the system file, and the lead friend
   from section 3 by topic (Pebble feelings and what is real, Bloop
   routines and gaming, Orbit AI and checking, Nova pressure and
   independence, Cosmo 16 and over, DiGi answers). One friend per deck.
   The franchise names in section 9 keep their eyebrow every week.
2. **Write the cards** in the family voice: one idea per card, the carousel
   order hook, tension, explanation, useful action, proof, close (an `ask`).
   Real assets only: a printable's real page, a real screenshot, the
   approved cutouts. Scenario quotes carry the eyebrow "A thing parents say".
3. **Write the post block**: `date` (YYYY-MM-DD), `day`, `time`, `channels`,
   `instagram` caption, `facebook` text (longer, card one only), `alt`,
   optional `first_comment`. The stage check goes in the caption, never on
   a card: *What stage is your child? Three questions, no sign up.*
4. A Founder Monday real photo post gets a deck with `"cards": []` and a
   `photo` line saying what to photograph, plus its captions.
5. Save as `content/packs/<monday>-social-week/<n>-<day>-<slug>.json`,
   numbered in posting order. The deck schema is the top of
   `tools/social-cards/week.mjs`; `tools/social-cards/decks/six-formats.json`
   shows every card type.

**Every number** on a card or in a caption goes to the `citation-verifier`
agent before it ships. CORRECTED means use the corrected figure; DEMOTED
means cut it. An association is never written as a cause.

## Phase 3 · Render and check

```bash
npm run social-week -- content/packs/<monday>-social-week
npm run ai-tells
```

The first renders every deck, writes `THIS-WEEK.md` into the pack folder and
builds the page in `tools/social-cards/out/_week/<monday>-social-week/`. It
fails on any dash. The second sweeps every caption for dashes and stock
phrases. Then **look at every card** (Read the PNGs): nothing overlapping,
the friend standing on the road, every headline readable at thumbnail size.
Fix the deck and re-run until clean.

## Phase 4 · Refresh the page

1. Read the page first (`Artifact` action `read`, the URL above) so the
   publish is accepted, and list its files (`scope: "files"`).
2. Publish `tools/social-cards/out/_week/<monday>-social-week/page.html` to
   the URL above with `root` set to that folder and `files` listing every
   `img/...` path in it. Set last week's image paths that are not in this
   week's set to `null` so the page does not pile up old files.
3. Label the publish "Week of <date>".

## Phase 5 · Hand over

1. Branch `claude/social-week-<monday>`, commit the pack folder (the decks and
   `THIS-WEEK.md`), push, open a draft pull request titled
   "Social week <monday>". The body: the page link, one line per post, and
   anything left empty and why.
2. In the Control Room, create a Google Doc "Social week, <date>" with the
   page link at the top and the text of `THIS-WEEK.md` under it, so the 06:30
   daily desk can point at today's section. Text only: the images live on
   the page.
3. Report in three lines: what was built, whether it rendered clean, and what
   Justin needs to do (a photo to take, a number that was cut).

## Never

- Post, schedule or send anything.
- Generate a character, a screen or a person. Composite the approved files.
- Put a real child's name or face on a card.
- Fill an empty slot with something untrue.
