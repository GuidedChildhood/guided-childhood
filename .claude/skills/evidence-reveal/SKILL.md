---
name: evidence-reveal
description: The default creative framework for every research led social post (Justin, 18 November 2026). Use whenever a story from the radar becomes a post, a card, a film or a carousel, whenever ChatGPT's Stage 2 packs are checked, or when Justin asks for hooks, a storyboard, a cover or a motion visual for an evidence post. Three hooks, one chosen, a Disrupt Reveal Reframe Invite storyboard, CARD TEXT with timing and visual lines, and the performance log against the GDC number.
---

**The evidence carousel series** (26 November 2026): one or two stories a week become a five page carousel in the GDC 064 look (crinkled paper, black type, one yellow highlight, one idea a page, a practical last page). Built by `tools/motion-engine/scripts/carousel.mjs`; see that README, "The evidence carousel". Same research, voice and approval rules as every post.

# The Evidence Reveal

Challenge an assumption without stretching the evidence. Reward curiosity with
understanding. A viewer stops because the finding is interesting, stays because
the explanation is clear, and leaves better informed rather than frightened.

Reference standard: the "Twenty five thousand teenagers" post (GDC 049, 4,545
impressions, the best of its week) and the black and white GDC 061 motion
direction.

## For each story

1. **Verify.** Only a story the radar has cleared, and only its cleared
   figures. Publication status (preprint, peer reviewed, official) and the
   limits travel with the claim.
2. **Find the most surprising defensible finding.** Surprising to a parent,
   and true of the study as reviewed.
3. **Write three hooks of different kinds**: reversal, missing variable,
   comparison, uncomfortable question, overlooked finding, practical
   consequence. One per line under HOOKS, as `TYPE: the hook`.
4. **Reject** any hook that implies a cause the design did not show, inflates
   the risk, misdescribes who was studied (age, country, sample), or drops a
   qualification the finding needs.
5. **Choose** on clarity, curiosity and factual integrity, in that order of
   veto: integrity first. Mark it `CHOSEN` and say in one line why the other
   two lost.
6. **Storyboard**, timing to suit the story, not a fixed clock:
   - DISRUPT: the chosen hook on screen
   - REVEAL: the finding and its figure
   - REFRAME: what it does and does not mean, with the limit
   - INVITE: the question or the practical step
   - COVER: the still that works alone
   - CAROUSEL: slide by slide only where it helps, otherwise NOT RECOMMENDED
7. **CARD TEXT** closes every evidence pack: HEADLINE, FINDING, CONTEXT,
   SOURCE, LIMITATION (under 45 words), then TIMING and VISUAL lines that are
   not counted.
8. **Nothing essential depends on sound**, and the post and the visual each
   stand alone.

## The look

Predominantly black and white editorial paper, one restrained yellow highlight,
clear type (Nunito, IBM Plex Mono for labels and sources), slow deliberate
motion, a still hold of at least five seconds at the end, 30 frames a second,
portrait 1080 by 1350. No faces of children, no synthetic parent, no invented
screen, no icon or label that misdescribes the topic. Source and caveat at a
size a phone can read. `tools/motion-engine` builds and checks this; any file
from elsewhere goes through `scripts/check.mjs` and a read of its frames before
it is used.

## What the checks enforce

`scripts/radar/qa.mjs` reads HOOKS and STORYBOARD for uncleared figures and
dashes, and check 8b holds a pack whose hooks number fewer than three, mark
other than one CHOSEN, or use causal wording. A pack written before 18
November has no HOOKS section; that passes and is flagged for the Claude
review.

## Approval and publishing

Every pack carries a LinkedIn post, first comment with the verified source,
Instagram caption, Facebook adaptation, a visual brief for each platform and
motion requirements where the story has one clean finding (Justin, 24 November
2026; QA enforces it). A story stays eligible until completed, withdrawn,
superseded or on HOLD; an older START HERE date never stops it. At most three
personal LinkedIn posts a calendar week, the rest held in reserve.

All new copy and media go through Claude's checks and then Justin. Never
replace an existing Metricool asset, schedule or publish without his separate
word. Cadence: one strong personal LinkedIn post every other day, subject to
approval, no filler (see the decision of 18 November for how this sits with the
three a week cap).

## Learning what works

Record each post against its permanent GDC number in
`content/analytics/linkedin-post-register.json` and
`content/analytics/linkedin-post-tags.json`: the hook type chosen, the format
(text, card still, card film, carousel), impressions, viewing metrics, clicks
and meaningful comments. Recommend a change only when the same pattern repeats
across several posts, never from one success.
