# The stage check intro shows the product

Justin, 14 November 2026, on /starter-pack: the first page should show exactly
what a parent gets from the platform, but it "looks a bit messy and confusing".
He asked for the industry leading way to present it: nothing that scares, a
solution beside each known problem, easy to read, every service shown, a
demonstration of how it works, and a demo if it helps them keep going.

## What was wrong

The intro was a title, three numbered cards that describe the quiz, one button
and a "what this is not" box. It never showed the product. A parent learned
there were three questions and learned what we are not, and had to take the
rest on trust.

## What the research said

Two agents and a Mobbin pass. The full findings are in the pull request.

- Value before the account is the best evidenced thing on the screen
  (Duolingo's own test, NN/g on login walls). We already do it. Say it once.
- Most attention goes to the first screen (NN/g eyetracking), so the first
  screen is the outcome, one reassurance line and the button. Proof goes below.
- Name a worry only beside its fix (Tannenbaum 2015, fear appeals work only
  with an efficacy statement). No threat numbers anywhere on this page.
- Stack the services. Tabs and carousels get missed on a phone (Baymard, NN/g).
- A sticky button is mixed evidence. Ours appears only after the first button
  has scrolled away, and goes again at the last one.
- An inline demo has no direct test behind it, only the Duolingo analogy. So it
  is one tap, already showing an answer before it is touched, and below the
  first button so it never delays a start.
- Mobbin: Greenlight ("your device, kid device"), GoHenry (the product in the
  hero), Norma (how it works as cards with the product inside each).

## What is built

`app/(marketing)/starter-pack/page.tsx`, the intro step, and a new
`IntroInside.tsx` beside it. Nothing new is invented: every line and drawing is
read from what the result screen already uses.

1. First screen: "Your free stage check" as the eyebrow, the outcome as the
   heading, one line, the gold button "Find my child's stage" (the 24 September
   hook, same words everywhere), and a quiet link down to what is inside.
2. Try it: four worries as chips. Tap one and see the parent's question, our
   answer, what we do each time and one thing for tonight for a nine year old.
   All from `ANSWERS` (`lib/content/proof.ts`) and the Builder stage's
   `challengeActions` (`lib/content/stages.ts`).
3. What you get: four stacked rows, each a problem in a parent's words, the
   service that answers it, and the drawn product from `Mocks.tsx`. The star
   quest leads, shown as their app beside your phone.
4. Also inside: the rest as one plain list, the 13 September rule.
5. How it works, in three lines.
6. What this is not: the 16 October block, kept, without its quoted script,
   because the demo above now does that job.
7. The same button again.

## What is deliberately not here

- The four free days. They are told on the result and account screens, where
  they apply.
- Any price, any count of scripts or lessons, any statistic.
- A drawn DiGi answer. No DiGi reply was ever approved for this page and we do
  not invent one; DiGi is named in the list and in the demo's method rows.

## Who sees it

Arrivals from a post, an advert or a /v/ link open on question one and never
see the intro (funnel audit, fix 4). This screen is for the parent who comes
from the home page, a search or a typed address, who has not been told
anything yet.

## Check

390 and 1280 in the browser, every chip tapped, the button reaches question
one, `starter-order-guard`, `hex-guard`, `tap-guard`, `token-guard`, tsc.
No migration.

## Second pass, the same day

Justin on the first version: polish it to Apple level, make it flow the way
the services work, show an example of it fixing the problem, and encourage the
balance between online and offline.

The three service boxes became one ordinary day with one child, on a rail:
breakfast (the day agreed, the three jars), after school (life first, then
screens: jobs and time outside add stars), teatime (she asks, you tap yes),
evening (the words), bedtime (ten seconds, and the line over the weeks). Each
beat names what used to go wrong there and shows the part of the product that
picks it up. The balance is the mechanism itself, so it is shown, not preached.
Rail pattern from MacroFactor and Deepstash on Mobbin. The demo now follows the
day, and the three quiz steps sit with the last button. Fade up on scroll with
GSAP, off for reduced motion.

## Third pass, the same day

Justin: "super slick and much less wordy and obvious", highlight what we offer
and solve and the passport (safe, ready, taught), "the best look of any
starter page". Then: include a DiGi example and how it learns from what
parents say works.

Five ideas, a picture and a handful of words each:

1. The passport: five stages with their Planet Friend and ages, one line.
2. What it fixes: three "instead of" lines, each with the product drawn
   (the ask on your phone, tap a worry for tonight's one thing, the line
   over the weeks).
3. DiGi: one drawn exchange, its advice and words taken from the Builder
   stage's own online safety line, and the loop in four icons (you ask, you
   try it, did it work, it remembers). The loops are the real ones in
   digi/00-how-digi-works.md. No count of families and no success rate,
   because the counted outcomes table is still filling.
4. Also inside, as labels.
5. Not a blocking app, we never read their chats, then the button.

The day rail, the long demo card and the full "what this is not" block went.
WhatWeAreNot.tsx is unchanged and still used elsewhere.
