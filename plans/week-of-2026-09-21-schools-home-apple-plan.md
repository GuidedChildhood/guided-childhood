# The schools home page to the Apple bar, with motion

20 September 2026, afternoon. Session 0u09q9, on PR #1128.

Justin: "make the design of home page as good as Apple UX again without
coding changes needed to wiring but super slick animations."

## The rule for this pass

No wiring moves. Every route, link, form, price band, module count and
JSON-LD block stays exactly what it is; the page reads the same manifest and
the same cookie. What changes is what a head sees in the first five seconds
and how the page moves under them.

## References, gathered first (Mobbin, 20 September)

- Brilliant's "Learn by doing" hero: one enormous line, annotated by small
  live product pieces, one primary button. The type is the picture.
- ClassDojo: the characters stand beside the headline as the point of the
  page, not as decoration.
- Devin and Magnific onboarding: a stepped walkthrough with a dot rail and
  one product frame that changes per step. The Apple "sticky media, scrolling
  steps" shape without the pinning risk.

Translated into cream, ink, butter and Nunito. Never a copy.

## Tokens

Cream ground, deep teal for the two dark bands, terracotta gold for the one
accent, ink for text, the friend's own soft and accent tokens on anything
that carries a friend. Nothing new. The two radial glow blobs go: they are
the generic pattern every AI page reaches for.

## Type

PAGE.hero for the h1 and PAGE.section for every h2, as today, so the page
keeps one ladder. Mono eyebrows at text-xs. Body at text-md with 1.7 line
height. What changes is restraint: shorter measures, more air between bands.

## Layout

One idea per band, in this order: the promise (hero), the four numbers, a
lesson opening step by step, one lesson and everything in it, the squad, the
journey, the evidence, home and school, compliance, pricing, questions, the
door. The same order as today, so nothing a head has bookmarked moves.

## The signature: the wall builds itself

The Wall at Sixteen is the page's picture and it now draws itself on
arrival: the road appears from the start, the bricks rise course by course,
the five friends walk in one after another in age order, the sign drops,
the door lights and the passport arrives at it. The whole pitch in three
seconds, made from the same art the lessons use. On a desk the card drifts
gently against the scroll. Reduced motion gets the finished picture.

## The second move: a lesson opens as you scroll

Six steps in the lesson's own phase order, read from the shared phase list
so the words can never differ from the player. A board frame stays in view
and changes as each step passes: the friend arrives, the start card recalls
last lesson, one idea on the wall with the script beneath, a talk task then a
choice, the class proves it, the passport fills and a note goes home. Every
line is true of the product as it ships today.

## Motion rules

GSAP only. Fade ups and staggers, one drawing sequence, one crossfade.
Nothing loops. Everything is visible without JavaScript and everything is
still there under prefers-reduced-motion, just not moving.

## Verification

Both typechecks and every schools guard, the scale ratchet in particular:
new sizes read from tokens or clamp(), nothing raw. Rendered at 390 and 1440
with the page scrolled through the hero, the lesson steps, the journey and
pricing; console clean; no horizontal scroll; a reduced motion pass where
every element is present at full opacity with no script having run.
