# 14 · Write it down the day it starts

| | |
|---|---|
| Run | Parents, 8 of 13 |
| Service | Moments, the check in, what is working, the week's balance (map entries 13 and 20) |
| Format | Carousel, 7 cards. Not built |
| Channels | Guided Childhood Instagram. Facebook takes card 1 and the text |
| Proposed | Sunday 6 December, 19:30 |
| Free step | The stage check |

## Hook

> Write the problem down the day it starts. In six weeks you will not believe it was ever that bad.

## Slides

| Card | Words | Screen |
|---|---|---|
| 1 | Write the problem down the day it starts. | None |
| 2 | Tap what was hard today. Each one joins your list, and we bring you the words for it. | Home, "What came up today?" |
| 3 | The first tap is your starting line. Everything after is measured against it. | The first check in |
| 4 | Then one tap a day. Really tough. Hard going. Up and down. Getting there. Going great. | The five faces |
| 5 | A worry can rest. One "going great" and it steps back. It returns in a week to check it held. | The check in outcome line |
| 6 | And you can see what moved. No family score. Just each worry, and where it is now. | "Here is what has actually moved" |
| 7 | Keep this one. Save it for the day something starts. | None |

## Caption, Instagram

Send this to the parent who cannot tell if anything is getting better.

1. Tap what was hard today. That is a moment.
2. Your first check in is the starting line.
3. After that it is one tap a day, on five faces.
4. A worry that is going great steps back, and gets checked again in a week.
5. You can look back and see what moved, and what came back.

A problem you wrote down in October is one you can prove you are past in
December.

8 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What is one thing that was hard in your house a year ago and is fine now?

## Caption, Facebook

Improvements at home are invisible from the inside. The bedtime that was a
battle in spring is quietly fine by summer and nobody notices, because once
a problem is solved you stop thinking about it.

So we built a way to see it.

When something is hard, you tap it. That is a moment, and it joins your
list. Your first check in is the starting line. After that it is one tap a
day on five faces, from really tough to going great.

When a worry reaches going great it steps back, and it comes round again a
week later to check it held. If it comes back, we show that too.

There is no overall family score, on purpose. A number that nobody can
explain is not worth having. You see each worry, where it started and where
it is now. And the week's screen time is shown by what it was for, not as
one total to feel bad about.

8 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-14-fb

What is one thing that was hard in your house a year ago and is fine now?

## Visual brief

- Cream ground. The gold pathway runs through the cards from 2 to 6, so the swipe feels like the weeks passing.
- Captures exist for the first check in (`baseline-checkin.png`), the acknowledge screen (`checkin-ack.png`), the worry list before and after, and the balance page. "What came up today?" and the what is working page need new captures.
- The faces are the product's own, never redrawn.

## Proof

- Moments: `components/daily/MomentTimeline.tsx`, the home card "What came up today?" with "Tap anything that was hard. Each one joins your list, and we bring you the words for it."
- The faces, exactly: "Really tough", "Hard going", "Up and down", "Getting there", "Going great" (`components/daily/ConcernCheckIn.tsx`, `/dashboard/checkin`).
- The first check in is the baseline, and one going great rests a worry for a week: THE-STORY section 4, decisions of 7 October.
- "Here is what has actually moved": `/dashboard/what-is-working`. No overall score is ever computed.
- The week by what it was for: `/dashboard/stats`, `lib/balance/pace.ts`.

## Checks

- Every rating is the parent's own. Nothing here claims a child improved.
- "Six weeks" in the hook is a figure of speech from the service map. If Justin wants no number at all: "Later, you will not believe it was ever that bad."
- The two children comparison from the service map's balance entry is left out. It reads as a claim about effects.
