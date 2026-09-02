# Starter pack reveal: the page that explains the platform, at Apple level

Justin, 2 September 2026, with the reveal page on his phone (the "Our job /
Your job" paragraph, the four mono chapter chips, the Sound familiar card):
"text does not seem UX quality and this bit all overlaps on phone. Remake
with really simple to read fonts, Mobbin and Apple UX level, and introduce
exactly how the platform works: the problems we solve and how, especially
how DiGi works, the daily routine (not every day a task), settings for
devices, managing time, reaching balance, social media and every online
problem solved from 4 to 16, helps parents, child app included which
teaches social media use responsibly."

## What is wrong (traced)

- The reveal is ResultScreen inside app/(marketing)/starter-pack/page.tsx,
  680 lines of the file. It opens with a bold "Our job / Your job" paragraph
  and a mono caption, then four mono chapter chips, then the Sound familiar
  card, then a stage card, then a five day week, a grid of eleven features,
  a numbers strip, the five stage road, a quote and the door.
- It never says how the platform works. It lists things. The mono chips
  and captions are labels doing the job of sentences, which is the review
  file's own rule broken (text-xs is never a sentence).
- On a phone the top of the page scrolls under the iOS status bar with a
  fixed hairline over it, so the first thing seen is half a bold line.

## Mobbin references (2 September)

- Hers "How it works": four numbered steps, one picture, one line each.
- Gentler Streak and Withings explainers: a picture of the real product,
  one big headline, one short paragraph, one button.
- Selfridges "How to": each step a card with a picture and a two line body.

## The build

One new file, app/(marketing)/starter-pack/ResultScreen.tsx, replacing the
function in page.tsx. Mobile first at 390, then desktop.

Sections, in this order, each a picture and a few plain sentences:
1. Hero: "{child}'s pathway is built." One line on what happens next, the
   Let's get started door.
2. What you told us: the concern named, the stage, why it is normal, the
   first script.
3. How it works: three numbered steps with the product drawn in code
   (you say what happened, you get the one thing and the words, you watch
   the stars move). Five minutes a day, not a task every day.
4. How DiGi works: a drawn chat. Never a flat yes or no, remembers your
   family, built on the research, there at 11pm.
5. Devices, time and balance: three kinds of time drawn as three jars, the
   ask and yes loop, the per device settings guides.
6. The child's own app: included, no login, jobs earn stars, lessons that
   teach social media before it arrives, five a day, printables.
7. Every online problem, 4 to 16: the road with the five stages and the
   problems each one meets.
8. For you: the passport, the weekly check in, the scripts, the emails.
9. The door.

Copy in Justin's voice, body at text-base or bigger, mono only for the
smallest eyebrows, no dashes. Every claim already true in the product.

## Checks

- 390 and 1280 screenshots of the whole reveal, nothing overlapping.
- Quiz still completes into it; returning path still lands on it.
- tsc, wiring, dash grep, checkin guard.
