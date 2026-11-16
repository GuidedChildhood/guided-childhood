---
name: reel-engine
description: The weekly Reel engine. Turns the topic banks (other creators' topics and researchers' findings, answered our way) into three talking head Reels a week, each with three openings, then to the Prompter, Justin's one filming sitting, the edit, Trial Reels, the log, and lets the winner shape the next week. Use when Justin says "next week's reels", "the reel engine", "more reels like his", "turn this creator into reels", or after a creator breakdown.
---

# The Reel engine

One loop, every week. It doesn't replace any skill. It joins them up in order.

```
banks ──> pick 3 ──> write 3 scripts x 3 openings ──> check ──> Prompter
  ^                                                              |
  |                                                    Justin films once
  |                                                              v
next week <── winner and log at 72 hours <── Trial Reels <── edit (talking-head-video)
```

THE-STORY.md first, as for any content. The house style is decided and is
Justin's: `~/Carousels/Reel tests/HOUSE-STYLE.md`. Read it before writing a line.
Never change it without his say.

## 1. The banks (where topics come from)

| Bank | What it is | File |
|---|---|---|
| Family IT Guy | His topics turned into the parent question underneath, with our hooks | `content/packs/2026-10-14-reels-story-bank/README.md` |
| Family IT Guy, 53 posts | Claim checks and where he contradicts himself | `content/creator-breakdowns/family-it-guy-2026-11-14.md` |
| Catherine Knibbs | Her findings, attributed, turned into parent questions | `content/packs/2026-11-16-reel-engine/knibbs-bank.md` |
| Justin's own scenes | Founder Reels, which earned all his shares and follows so far | `content/brand-story/founder-context.md` |

**The one rule for every bank:** we take the parent question, never the piece.
No line, title card or structure is lifted from another creator. A researcher is
credited by name, every figure is attributed to them, and their framing is kept
as they hold it (Knibbs: mechanism, never prevalence; cybertrauma is a pattern
she calls that, not a diagnosis).

**Adding a creator:** do a breakdown first (the method is in the Family IT Guy
file and in memory `instagram-reel-caption-sheets`), then write a bank file in
the same shape: their topic, the parent question, our hook, the proof path, why
ours is different, and a Never make list.

## 2. Pick three (Monday)

- One founder or stage check Reel, one from a creator bank, one from a research
  bank. Founder Reels have earned every share and follow, so never drop that one.
- The star quest leads one Reel in three, or appears in one.
- The fear lane (strangers, sextortion, harm) is at most one post in ten across
  all channels (hidden-thread.md). Its parent's first reaction is the main
  character, never the stranger or the platform.
- Every Reel stands alone. No "part 2". Views fell with every part of a series.
- Check the Prompter (`~/Carousels/Prompter/scripts/`) and the Reel tests folder
  so a topic already drafted elsewhere (the Roblox responses, for example) is not
  written twice.

## 3. Write (the house template)

One folder per Reel: `~/Carousels/Reel tests/NN topic/script.md`. Copy the shape
of Reel 03:

- **Three openings, the only thing that changes.** A: him (his standing lines
  under test: "I'm a dad of three who read the research", "I dropped out of college
  and built this", "Five years ago I thought screens were just bad"). B: the
  parent's question, or the claim being checked. C: the proof, the product or the
  finding on screen.
- **The body is identical in all three**, and its first line must make sense
  after any opening. Say it aloud after each one.
- 25 to 35 seconds, about 70 words with an opening. A bold fact with a twist,
  always fair, never aimed at a person. The feeling is relief and one thing to try
  tonight.
- Ends on: three questions, no sign up, link in bio.
- **Caption** (the same on all three), **Proof** (every claim to a file, a
  migration or a source read at source), **Where and how** (screen recordings use
  a made up child, Sam, March 2017; no real children, nothing that shows the
  house).
- Never put words in his mouth. A scene that isn't in founder-context.md, or
  that he hasn't told us, isn't used. A line that is only true if it's true for
  him is flagged in the Prompter.

## 4. Check

- `npm run ai-tells` on every script (no dashes, no AI tells).
- Every figure read at source, or the line comes out. A research Reel goes past
  the evidence-red-team agent before it reaches the Prompter.
- review.md's must fix list.
- The status is `draft` in the Prompter until Justin says yes to the topic.

## 5. Prompter

One JSON file per week in `~/Carousels/Prompter/scripts/`, words copied exactly
from script.md, made by
`python3 -I "$HOME/Carousels/Reel tests/to_prompter.py" --week N --due YYYY-MM-DD 05 06 07`
(add `--ready` once Justin says yes). It reads the openings table and the numbered
body, so keep script.md in the Reel 05 shape. Build with
`python3 -I ~/Carousels/Prompter/build.py`, then publish `index.html` with the
Artifact tool to the URL in `LIVE.txt`, so his link stays the same. Add a row
per version to `~/Carousels/Reel tests/LOG.md`.

## 6. Film, edit, post (Justin's part, then ours)

- One sitting a week: each opening twice, then the body once.
- When he says "recorded": `python3 -I ~/Carousels/Prompter/intake.py`, which
  sorts the clips by what he says.
- The edit is the talking-head-video skill in the house look (bold captions, no
  music, natural pace, a third of a second after each sentence).
- Justin posts all three versions as Trial Reels from his phone, at the same hour
  on three days running, rotating which version goes first. Nothing is scheduled
  or posted for him.

## 7. Log and learn (72 hours after each post)

Fill the LOG row. The winner keeps the most people past three seconds. Under
about ten points at around 200 views is a tie, and saying so is fine. After six
Reels, an opening kind that wins five of six is a result. The winner goes to the
main feed and runs again four weeks later, and its opening kind leads next week's
three.

## Reporting

Three things: what was drafted, whether it checked clean, and what he needs to do
(say yes to the topics, then the sitting).
