---
name: founder-voice-review
description: The last read before any outward facing words leave us, in Justin's voice or the family account's. Use whenever a post, first comment, newsletter, email, comment reply, school communication, website copy, video script, lesson narration or text on a visual is written, edited or reviewed, by Claude, by ChatGPT or by Justin himself, and whenever Justin corrects a line (the correction goes in the Voice Bible). Runs the machine guard, the ear checks, the rhythm meter against his own writing, the true scenes and privacy rules, and the read aloud test, then stores a VOICE REVIEW verdict. It never decides whether a claim is true (the evidence skills do that) and it never claims a text is or is not machine written.
---

# Founder voice review

Justin, 24 November 2026: a permanent founder voice skill that runs whenever
outward facing writing is created, edited or reviewed. "Read every finished
piece aloud mentally. Ask whether I would genuinely say it."

This is one skill on top of what already exists, not a second set of rules.
Each part below points at the file that owns it:

| Part | Owner | What it gives |
|---|---|---|
| The hard list | `scripts/check-ai-tells.mjs` (`npm run ai-tells -- <file>`) | dashes, stock phrases, correction shapes, signposting, stiff openers. **The one banned list.** Skills point here, they do not keep copies |
| The ear | `.claude/skills/content-engine/ai-tells.md` plus section 3 below | what a guard cannot judge |
| The meter | `scripts/rhythm.mjs` (`npm run rhythm -- <file>`) | sentence length, spread, triads, openers, against his own prose. Prints, never fails |
| Who he is | `content/brand-story/founder-context.md` | true scenes and GREEN, AMBER, RED |
| How he sounds | `content/brand-story/voice-bible.md` | his positions, his moves, his words, every correction he has made |
| The settings | `config/content-engine.json` (`voice`, `philosophy`, `audiences`, `linkedin`) | British English, dashes never, cadence and length |
| A Drive post | `.claude/skills/content-engine/drive-post-review.md` | the ten point review of a post waiting in Drive; this skill is its step 9 and the read aloud |

## When it runs

Every piece of outward writing, whoever wrote it, before it is called ready:
LinkedIn posts and first comments, Instagram and Facebook captions, the weekly
newsletter (both editions, title, subtitle, preview text, promos), emails to
parents, schools or partners, comment replies, school communications, website
and app copy, talking head and explainer scripts, lesson narration, and every
word on a card, carousel, cover or motion frame.

It runs **after** the claims are settled. A sentence that is false does not get
a voice pass, it gets cut. The evidence skills (`evidence-reveal`,
`kids-research`, the radar review) own truth; this skill owns how the true
thing is said.

## The order

1. **Which voice.** Justin in his own name (LinkedIn, Substack, emails he
   signs, talking head) or the family account (`config/content-engine.json`
   `voice.familyAccount`), or the schools register (a head or a DSL reading at
   work: plainer, no family scenes unless GREEN and relevant). Lesson narration
   for children belongs to the characters in `digi-squad/README.md`; for that,
   run only steps 2 and 7 here and leave the character voice to the squad.
2. **The machine guard.** Save the copy to a file and run
   `npm run ai-tells -- <file>`. Every FAIL is fixed, none is argued with.
3. **The ear.** Read for the soft tells below. One is rhythm, a cluster is a
   machine. Fix the cluster, not the single word.
4. **The meter.** `npm run rhythm -- <file>`. Compare rates to his, never raw
   counts. His baseline (9 November): mean sentence 12.8 words, spread 79
   percent, rule of three in 1.6 percent of sentences. Our drafts run long and
   even; that is the usual fix.
5. **The Bible.** Does it hold his positions (section 2 of the Bible), make his
   moves (section 3), use his words and spellings (section 4), and avoid every
   correction in the log (section 6)? A line that repeats a corrected mistake is
   a fail even if it passes everything else.
6. **Scenes and privacy.** Any personal or family detail must be in
   `founder-context.md` or `founding-story.md`, used once and small, never
   embellished. AMBER is flagged to Justin; RED never goes out without his
   explicit yes for that use. **Never invent an anecdote, an experience, a
   quotation, a family story or dialogue.** If a piece needs a scene that does
   not exist, it goes without one.
7. **Read it aloud.** In your head, at speaking pace, as Justin at the school
   gate (or Natalia, for the family account). Anything you stumble on, anything
   he would not say to another parent, anything that sounds assembled rather
   than said, goes.
8. **Store the verdict** (below).

## 3. The ear, in one place

From `ai-tells.md` and from the three editorial sources read on 24 November
(Wikipedia's Signs of AI writing, CC BY-SA, summarised not copied; softaworks'
writing clearly and concisely, MIT; the ai-writing-markers dataset, CC0 and MIT.
Read as text only. Nothing from them is installed or run).

**Structure**
- The rule of three, stacked. One triple a piece; four is a machine.
- Negative parallelism beyond the guard: "not X, but Y", "Y rather than X", a
  strawman put up to be knocked down. A real claim denied in its own sentence
  is fine and is one of his moves.
- Too many one line paragraphs. Some is LinkedIn; every line alone is a tell.
- An opening rhetorical question. He opens on the named study and its finding.
- A forced closing question. The closing question asks what the reader would
  measure, count or do (`config` `linkedin.closingQuestion`), and only one.
- A summary closer that restates the opening in the same shape.
- Even sentences and even paragraphs. Real writing is lumpy.
- Synonym cycling: calling the same study three names to avoid repeating one.
- A tacked on clause claiming significance ("..., highlighting the need").

**Tone**
- Puffery: legacy, importance, landmark, where a plain fact would do.
- Generic over specific. Safe, positive filler where his version has a number,
  a named body or a thing a parent does at teatime. This is the one that
  matters most for him.
- Vague attribution: "experts say", "research shows", "studies suggest" with
  one source or none. Name it or cut it.
- Hedging in both directions in one sentence. Put the concession in its own
  sentence: that is the honest pivot.
- Telling the reader what to think ("it is crucial to remember").
- Adverb pile up: genuinely, honestly, truly, incredibly, absolutely.

**Words, weak alone, a rewrite when two meet in a paragraph** (re date each
year; the sources say the lists move): crucial, vital, pivotal, robust,
intricate, meticulous, vibrant, nuanced, multifaceted, landscape, realm,
myriad, plethora, holistic, transformative, empower, elevate, harness, utilise,
streamline, foster, bolster, showcase, enhance, garner, interplay, align with,
prioritise, quietly, universally, valuable, ultimately, notably, importantly.

**Formatting**
- Bold scattered through running text; a bold label and colon on every bullet.
- Title Case Headings. Sentence case.
- Emoji as bullets or headings.
- Pasted chat leftovers (the guard catches the common ones).

## What this is not

- **Not a detector.** All three sources say these are weak signals, not proof,
  and that detectors misfire, worst on careful plain prose. Never say a text
  is or is not machine written. Never promise a piece will pass a detector.
- **Not a disguise.** The posts are Justin's: his thesis, his decisions, his
  name. Making them sound like him is accuracy. The test for every edit: does
  it make the writing more like a person talking, or only harder to place?
  Only the first kind is made.
- **Not a flattener.** Fixing surface markers alone makes text harder to spot
  without making it better. If the fix is a synonym swap, the sentence still
  has the problem. Rewrite the thought.
- **Not a copy of his typos.** His messages are fast and often misspelt. The
  voice is the thinking and the rhythm, not the slips.

## The verdict

Stored with the piece, in the pack or the review file, as:

```
VOICE REVIEW, <date>, <who reviewed>
Voice: Justin | family | schools
Guard: PASS (npm run ai-tells)
Meter: mean <n> words, spread <n> percent, triads <n> percent (his 12.8, 79, 1.6)
Changed: <each line changed, old then new, or "nothing">
Scenes: none | <scene, privacy level, flagged to Justin if AMBER>
Read aloud: PASS | <what still sounds assembled>
Verdict: PASS | CHANGES MADE | BACK TO WRITER (<why>)
```

A piece is editorially cleared only with this stored beside the automatic
checks and the Claude review (`config/content-engine.json` `approval`). A
material edit after the verdict resets it.

## When Justin corrects a line

Every time he rewrites, rejects or comments on wording, add a row to section 6
of `content/brand-story/voice-bible.md` the same day: the date, his words
quoted exactly where he gave them, the line before and after, and the rule it
teaches. If the rule is mechanical, add it to `scripts/check-ai-tells.mjs` as
well, so it is caught by code from then on. Never put private detail from his
correction into the Bible: the public safe version only.

## For ChatGPT

ChatGPT cannot read this repository. START HERE carries the short form of this
review (the voice section), and a pack ChatGPT writes is reviewed here at the
afternoon run before it is cleared.
