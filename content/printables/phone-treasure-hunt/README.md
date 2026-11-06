# The Phone Under The Tree Treasure Hunt: product folder

Build next number 1 (`plans/2026-11-06-etsy-build-next-five-plan.md`), from
row 12 of `plans/2026-11-06-etsy-top-sellers-research.md`. Ages 9 to 13,
fronted by Orbit. List £5.99 with the permanent 25 percent sale, buyers pay
£4.49. Must be listed by 20 November. Also in the Christmas Phone Bundle.

The one idea: by the time they reach the box, they have said the whole plan
themselves.

## Pages (13)

1. Cover.
2. Setting up the hunt, for the grown up: five steps, and "Not a phone this
   Christmas?" (the second box card).
3. The hiding map: card by card, the printed place, a line to change it, a
   tick box.
4. to 8. Clue cards 1 to 10, two to a page, cut line between. Each has a read
   out loud line, a rhyming riddle to the next place, and a write your own
   clue line.
9. The box cards: "You found it" (a phone in the box) and "You found the
   plan" (the phone comes later, with a date and the first thing to
   practise).
10. Our phone promises: the card lines as a deal, signed together, a review
    date.
11. and 12. Four blank clue cards.
13. The Orbit Passport sticker and the free gift (`../pack-finish.js`,
    `strip: false`).

## Proof paths

Every read out loud line: `components/printables/drawn/ReadyForMyPhoneSheet.tsx`
(the ten stops), `lib/content/agreement-clauses.ts` (the first phone deal:
SCREENS_OFF, DEVICE_SLEEP grown ups included, ANSWER_CALL, KINDNESS, MONEY,
WHEN_WRONG), and `lib/quests/time-tiers.ts` (mealtimes are protected time).
The box card's promise is the First Phone Kit's: telling never costs the phone.

## Fillable

`fields: true` in `../build-pack.mjs`: every `data-field` in `print.html`
becomes a typing field in all three PDFs. The name is one field, so typing it
on the first box card fills the second.

## Contents

- `product/`: phone-under-the-tree-treasure-hunt-A4.pdf, USLetter.pdf,
  A4-ink-friendly.pdf, all fillable.
- `phone/`: hiding-map.png and our-promises.png, 1080 by 1920.
- `images/`: Orbit, DiGi, `preview/`, the ledger.
- `listing/`: `listing.md` and `images/`, the 2000 by 2000 photo set.

## Rebuild

    node content/printables/build-pack.mjs phone-treasure-hunt [print|phone|listing]

Checks: `node scripts/check-ai-tells.mjs` on the html and md here, and
`node content/printables/check-listing-tags.mjs content/printables/phone-treasure-hunt/listing/listing.md`.
