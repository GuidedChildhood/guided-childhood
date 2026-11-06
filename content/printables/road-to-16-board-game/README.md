# The Road to 16 Board Game: product folder

Build next number 5 (`plans/2026-11-06-etsy-build-next-five-plan.md`), from
row 6 of `plans/2026-11-06-etsy-top-sellers-research.md`. Ages 6 to 12, DiGi
hosts, one zone per Planet Friend. List £7.99 with the permanent 25 percent
sale, buyers pay £5.99.

The one idea: the family's screen rules, played as a game. Jobs earn stars,
family jobs earn none, stripy squares rest, and every card is a real lesson
question.

## Pages (19) and the A3 file

1. Cover, with the whole board.
2. How to play: five steps and the four kinds of square.
3. Making the board: the 2 by 2 tile map, trim, tape, the A3 option.
4. to 7. The board in four A4 tiles, each a window on `board.js`.
8. Five tent counters and 40 star tokens.
9. to 16. 48 choice cards, six to a page, in zone order.
17. The card back, six to a page.
18. For the grown up: the five stages and the stage check.
19. The Pebble, Bloop and Orbit stickers and the free gift
    (`../pack-finish.js`, `strip: false`).

Plus `product/road-to-16-board-game-board-A3.pdf`, the whole board on one A3
sheet, from `board-a3.html` (`a3` in `../build-pack.mjs`).

## The board

`board.js`: 60 squares, ten to a row, snaking up from the bottom left, five
zones of twelve in the order of `lib/content/stages.ts`. Each zone runs gate,
go, card, job, go, rest, card, family, go, job, card, rest. The rows stay
clear of the seams at x 210 and y 296, so trimming the tiles never cuts a
square.

## Proof paths

In the head comment of `print.html`: the zones (`lib/content/stages.ts`), the
choice cards (`cards-data.js`, each naming its module or migration), jobs and
stars, family jobs (migration 223), protected time
(`lib/quests/time-tiers.ts`), the stage check (`lib/content/guides.ts`
STAGE_CHECK_HOOK).

## Contents

- `product/`: road-to-16-board-game-A4.pdf, USLetter.pdf, A4-ink-friendly.pdf,
  board-A3.pdf.
- `images/`: all five Planet Friends, DiGi, `preview/`, the ledger.
- `listing/`: `listing.md` and `images/`, the 2000 by 2000 photo set.
- `icons.js`: the line icons, copied from `../planet-day-flip-chart`.

## Rebuild

    node content/printables/build-pack.mjs road-to-16-board-game [print|listing]

Checks: `node scripts/check-ai-tells.mjs` on the html, js and md here, and
`node content/printables/check-listing-tags.mjs content/printables/road-to-16-board-game/listing/listing.md`.
