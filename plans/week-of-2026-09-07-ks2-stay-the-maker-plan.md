# KS2, stay the maker. The primary half of the AI thinking lesson.

Justin, 11 September 2026, asked for the recommendation and took it: build the
KS2 lesson, skip the briefing.

## Claimed

- **Module `ks2-25-stay-the-maker`**, n 25, sort_order 25. Next free slot: the
  scheme runs 1 to 24 with n and sort_order identical throughout.
- **Migration 294.** Highest on origin/main is 293 and there are zero open pull
  requests, so nothing else has a claim on it.

Note the July handoff proposed `ks2-22-ai-maker`. That id is dead: 22 went to
ks3-22 and 23 to ks2-23, both since built.

## Why this lesson exists

**The governance tool still has no primary answer.** `dependence` in
shared/ai-governance/passport-links.ts now resolves to ks3-24 plus the two KS5
modules. Migration 292 fixed the worst of it, a primary school being pointed at
Years 12 to 13, but a Year 4 teacher is still sent to a Year 7 lesson. This
closes that properly.

## The constraint that decides the whole design

**The evidence for the cognitive cost does not reach this age, and we do not
pretend it does.**

- Bastani (PNAS 2025), the trial the KS3 lesson is built on, is ages roughly 14
  to 17 at one Turkish secondary school. It has nothing to say about a Year 4
  class. It is NOT cited as if it did, anywhere in this module.
- Mills and Keil (2004) DOES cover this age: the illusion of explanatory depth
  is found in grades 2 and 4, roughly ages 7 to 10, for devices. That is direct
  support for the explain it back drill and it is the module's evidence anchor.
- The muscle line from the July script stays, and stays a metaphor, labelled as
  one in the teacher notes.

So the lesson rests on **ownership**, not on harm. If you can explain it, you
made it. That is age appropriate, it is defensible, and it happens to be the
better idea for seven to eleven year olds anyway.

## The source

`content/lesson-scripts/ai-panel-additions.md`, written 25 July 2026 and never
built. Seven beats, about four minutes, host DiGi. It is a video script, not a
sixty minute deck, so it is the spine and not a shortcut. Its three moves
become the three cycles.

## The shape

Title **Stay the maker**. KS2, Years 3 to 6. Passport stage builder. Bloop asks
the question, DiGi closes, matching ks2-23.

**27 slides, 60 minutes.** Starter 8, cycle one 10, cycle two 10, cycle three
10, practise 14, prove 4, close 4. Fifteen teach slides at two minutes, five per
cycle, so the cycle map is 10 / 10 / 10 and each cycle anchors on the teach
slide heading that names it.

| cycle | verb | anchors on | outcome |
| --- | --- | --- | --- |
| 1 | Notice | Whose dragon is it? | I can say who made a thing and how I can tell. |
| 2 | Try | Ask for help, not for the whole thing | I can turn a do it all ask into a help me ask. |
| 3 | Prove | Explain it back | I can explain something back and spot the part I did not really know. |

**The tool**, chanted and printed:

> Ask for help, not for the whole thing.
> Add your own bit, the part only you would think of.
> Explain it back. If you can explain it, you made it.

## What gets checked before it ships

The same bar as ks3-24, which is now the house standard:

1. `check-module-contract` with the shape rule and the case insensitive dash rule.
2. All four council checks at 10, run against the real exported functions.
3. All three cycles anchoring at 1.00, cycle minutes equal to contained slides.
4. No passive run over four minutes.
5. `check-source-claims` extended with the claims this module makes, mutation
   tested, so the age limits cannot quietly come off later.
6. Every slide rendered in a real browser at 390 and 1440 via `?slide=N`, plus
   the prep page and the run sheet. This is what found the 500 last time.
7. The applied row digest checked against the source file, `collate "C"`.

## Not in scope

The briefing. Justin took the recommendation to skip it: the research already
changed what got built, its raw lens output was never saved, and re-running the
sweep buys nothing the lesson has not already spent.
