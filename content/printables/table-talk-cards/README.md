# What Would You Do? Table Talk Cards: product folder

Build next number 4 (`plans/2026-11-06-etsy-build-next-five-plan.md`), from
rows 5 and 18 of `plans/2026-11-06-etsy-top-sellers-research.md`. Ages 8 to
14, Orbit fronts it. List £5.99 with the permanent 25 percent sale, buyers
pay £4.49.

The one idea: questions for the child (Say This is words for the parent).

## Pages (29)

1. Cover.
2. Ten minutes, then stop: the three suits, the one rule at the table,
   printing, backs and the ring hole.
3. to 27. 25 sheets of four cards, 88 by 124mm, cut line and bleed as Say
   This: cards 1 to 40 talk at tea (Bloop), 41 to 74 online (Orbit), 75 to
   100 what would DiGi say (DiGi).
28. The card back, one design for all, symmetric, optional.
29. The Bloop and Orbit Passport stickers (under the talk) and the free gift
    (`../pack-finish.js`, `strip: false`).

## Words

Every word is in `cards-data.js`. The online cards are the lessons' choice
questions with the right answer as the strong move, each naming its source:
`content/modules/*.json` or the family lesson migrations (074, 076, 110).
The DiGi cards are pathways, never a yes or a no (`digi/01-philosophy.md`).

## Not yet

The research says these cards also go into Are We Nearly There, the way the
winner reuses its conversation set. That changes another listed pack, so it
is a follow up, not part of this build.

## Contents

- `product/`: what-would-you-do-table-talk-cards-A4.pdf, USLetter.pdf,
  A4-ink-friendly.pdf.
- `images/`: Orbit, Bloop, DiGi, `preview/`, `cards/` (every
  card front and the four rendered backs, for the photos), the ledger.
- `listing/`: `listing.md` and `images/`, the 2000 by 2000 photo set.

## Rebuild

    node content/printables/build-pack.mjs table-talk-cards [print|listing]

Checks: `node scripts/check-ai-tells.mjs` on the html, js and md here, and
`node content/printables/check-listing-tags.mjs content/printables/table-talk-cards/listing/listing.md`.
