# Say This: the script cards deck, plan

Written 5 November 2026, before building. Branch claude/etsy-script-cards.

## What Justin asked for

A paid Etsy printable: a deck of conversation cards full of parent scripts,
one card for every hard screen and tech moment. "Like the Diary of a CEO cards
material but of scripts for every moment, super fancy looking, using
characters, but also selling the app for more learning."

We copy the format of premium conversation decks (big bold moment on the
front, the answer on the back, numbered, colour coded levels, a box worthy
cover card, an instructions card). Never their look, words or brand.

## The product

**Say This: The Guided Childhood Script Cards.** 50 moment cards in five
levels, one level per Planet Friend, plus a cover card, a how to use card,
five level cards, an app card and two blank cards for the family's own
moment. 60 cards, four to an A4 sheet, 15 sheets.

- Level 1, Pebble, 4 to 7. Level 2, Bloop, 8 to 10. Level 3, Orbit, 11 to 12.
  Level 4, Nova, 13 to 15. Level 5, Cosmo, 16 and up. Ages are the app's.
- Card 1 of each level is that stage's own script from `lib/content/stages.ts`,
  the same talk the Passport's stage page asks for. The other nine are rows of
  the live `scripts` table, law_flag none, picked to cover the moments: the
  timer goes, the phone ask, everyone else has it, bedtime and the bedroom,
  group chats, strangers and safety, money in games, AI, something went wrong
  online, trust and the rules, and repair.
- Front: the moment, in the child's words or as the situation, a moment label,
  the number, the level colour and the Friend. Back: Say this (the script,
  trimmed for the card, never reworded) and one line on why (a cut of the
  row's why_it_works, picked to carry no statistic and no outcome promise).
- Never allow or deny: every card is a calibrated pathway because every
  script already is one. Safety cards keep their help line from the script.
- Proof path: every card names its script id (or stages.ts stage) in
  `cards-data.js`, and `cards-source.md` lists them.

## Files, following PR 1408's pack pattern

`content/printables/script-cards/`:
- `cards-data.js`: the words, the levels and the proof path, shared by
  print.html, phone.html and the listing photos so they cannot drift
- `print.html`: page 1 how to print, cut and play; then fronts and backs
  alternating (backs mirrored for long edge duplex), cut lines; last page
  from `pack-finish.js`. A4, US Letter (build-pack's 94 percent centred) and
  ink friendly
- `phone.html`: five screens, one per level, the level's own script
- `product/`, `images/preview/`, `images/cards/` (single card renders for the
  photos), `phone/`, `listing/listing.md`, `listing/images.html`,
  `listing/images/` at 2000 by 2000, `images/images.md`, `README.md`
- Art: the five approved cutouts from `public/digi-squad/friends/` and
  `public/digi-squad/DiGi-star-3d.png`, copied unaltered

Shared tooling changes, each optional so the other packs build the same:
- `build-pack.mjs`: add `script-cards` to PACKS; with `cards: true` it also
  renders each card on its own for the photos
- `pack-finish.js`: add Nova and Cosmo to STAGES; a five page layout (one
  column per stage); optional `where` and `app` lines
- `listing-images.js`: optional card fan on the cover and close up, so the
  photos show cards rather than A4 sheets
- `check-listing-tags.mjs`: add the pack to the default list
- Passport `passport-data.js`: add Say This to all five pages under the talk,
  `ready: false` until it is listed (the rule: on Etsy before a Passport
  naming it is uploaded). It fills the Nova and Cosmo gap.

## The app line (Etsy safe)

On the how to use card and the last page, once each: the Guided Childhood app
holds every script (over 300), the lessons and the stage check. No checkout
link, no price, no cheaper elsewhere line.

## Price

List £7.99 with the permanent 25 percent sale, buyers pay £5.99. More than a
single pack (£5.99 list) because it is 60 cards across all five stages, less
than the Passport would suggest is a bundle. Above the £4 floor.

## Checks before done

1. Every page by eye in A4, US Letter and ink friendly (previews plus PDF
   pages rendered to PNG).
2. Duplex: back of each card lands behind its front (mirror check in code).
3. `npm run ai-tells` on listing.md and the rendered page text.
4. `node content/printables/check-listing-tags.mjs`.
5. review.md must fix list against the diff.
6. Commit, PR. Do not upload to Etsy.
