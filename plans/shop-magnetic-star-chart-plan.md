# The magnetic star chart in the keepsake shop (migration 116)

Lane: platform code (shop). Branch `claude/etsy-printables-research-izl4ex`,
restarted from origin/main. Migration number 116 claimed here.

## What Justin asked

Add the custom printable star chart, with magnetic stars and the Planet Family,
to the shop. It is the physical end of the in app star chart builder: a magnetic
fridge board, gold star magnets for each job done, and the five Planet Friends
as magnets to earn and bring home.

## Decision: coming soon, not on sale yet

The stars and the Friends are small magnets. That is a toy in law and a real
swallowing risk, so it follows the shop's existing rule: anything a child can
hold and chew goes through toy safety testing before we sell one. Seeded
inactive, shown honestly in the Coming soon section with the interest form, the
same as the charms and the plush. Turning it on later is a flag flip, not a new
migration (migration 102's upsert deliberately never overwrites `active`).

Open question for Justin: price is set at £16 and it is coming soon. Say the
word to change the price or to ship it active once samples pass.

## Changes

- `supabase/migrations/116_shop_magnetic_star_chart.sql`: widen the products
  `kind` check to include `chart`; upsert the `star_chart_magnetic` product
  (kind chart, £16, min_earned 0, inactive, sort 25).
- `lib/shop/catalogue.ts`: add `chart` to `ProductKind`.
- `components/shop/Shop.tsx`: chart counts as a whole family product so the
  Planet Friends row renders on its card; add a magnet icon fallback; name the
  magnetic chart in the coming soon safety line.

The keepsakes page reads products from the DB, so the new row appears in Coming
soon once migration 116 is applied. Checkout gates on `canBuy` (active plus the
earned rule) and reads the price from the row, so an inactive product cannot be
bought.

## Follow up (offered, not done)

- A product photo render in the house style for the card, vendored to
  /public/shop, to swap in when real samples exist. For now the card falls back
  to DiGi leading the Planet Friends row, which is honest for a coming soon line.
