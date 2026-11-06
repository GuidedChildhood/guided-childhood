# Where Phones Sleep: product folder

The kitchen charging station and fridge pack. Recipe: family screen
agreements and routine charts (printables-engine recipes 1 and 8), as signs
and fridge pages for the whole house. Justin asked on 6 November 2026 for
"good fridge printouts also with signs for where to charge phone devices in
kitchen". Plan approved the same day:
`plans/2026-11-06-kitchen-charging-station-plan.md`.

Price: £5.99 listed, £4.49 with the shop's standing 25 percent sale. One
tier. Evergreen. Shop section: First Phone & Tech Rules.

## The idea

One shelf near a socket, outside the bedrooms, where every device in the
house sleeps, grown ups' phones first. The signs mark the spot and the fridge
pages keep the habit visible. It is the kit for two lines the Passport
already asks for: the Pebble page's doing (set up a charging station) and
the Bloop page's doing (decide together where devices sleep).

## Contents

- `product/`: where-phones-sleep-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf. Ten pages: cover, parent guide, Devices Sleep Here
  poster, stand up sign, bedtime charging line, charging spot labels and
  cable flags, tonight's screen plan, phones in the basket, family tech
  rules, the Passport stickers and free gift page.
- `phone/`: 1080 by 1920: the charging line and tonight's plan.
- `images/`: the approved Pebble, Bloop, Orbit, Nova, Cosmo and DiGi art,
  `preview/` and the image ledger (images.md).
- `listing/`: listing.md (title, description, 13 tags, price, photo plan,
  video and reel scripts, compliance) and `images/`, the 2000 by 2000 set.
- `evidence-check.md`: the evidence red team's verdict on the one sleep line.
- `print.html`, `phone.html`, `fonts/`: the source. The charging shelf, night
  sky, basket, labels, plan rows and rules are drawn by the script at the
  foot of print.html from the lists in it.

## Passport

Last page via `../pack-finish.js`: the Pebble and Bloop stickers, under the
doing, then the Starter Pack at /etsy-bonus, plus one line on the app's
charging shelf.

The pack is in `../guided-childhood-passport/passport-data.js` on pages 1
and 2 with ready off, so the Passport's Go further strip does not print it
yet. Once it is listed on Etsy, flip it to ready and rebuild the Passport.

## Rebuild

    node content/printables/build-pack.mjs where-phones-sleep [print|phone|listing]

Checks: `node content/printables/check-listing-tags.mjs` and
`npm run ai-tells` on the listing and the rendered page text.
