# Keepsakes and merch: suppliers, compliance, and how we sell it

Research done 25 July 2026. Covers the five physical product lines Justin asked
about (plush, croc charms, charm bracelet, printed passport, stickers), who can
actually make them at our size, the safety law that decides the order we do them
in, and how buying works both in the app and on Etsy.

The one line summary: **stickers and the printed passport can ship in weeks with
no safety testing at all. Charms need a test but are cheap and low risk. Plush is
the hardest and most expensive, so it goes last and it goes through a campaign so
we never carry the stock risk.**

---

## 1. The compliance reality, because it decides everything else

Plush toys and shoe charms are **children's products**, not merch. Before any of
it can be sold in the UK it needs:

- **BS EN71 testing.** Part 1 physical and mechanical, part 2 flammability,
  part 3 migration of heavy metals. A plush toy needs all three.
- **CE or UKCA marking**, plus a technical file and a Declaration of Conformity
  held on record.
- If we import from a Chinese factory and put our name on it, **we are the
  manufacturer in law**, and we carry those duties. That is the part people miss.

As of April 2026 the UK confirmed **CE marking is recognised in Great Britain
indefinitely**, so we do not need a separate UKCA route for the same product.
Check GOV.UK at the time rather than trusting this note.

What this means in practice:

| Line | Toy safety testing needed | Risk |
| --- | --- | --- |
| Sticker sheets | No (paper, not a toy) | Very low |
| Printed passport | No (a book) | Very low |
| Croc charms | Yes, EN71 1 and 3, age 3+ | Medium |
| Charm bracelet | Yes, EN71 1 and 3, age 3+ | Medium |
| Plush | Yes, EN71 1, 2 and 3 | High |

Small parts are a choking hazard, so **every charm product is age graded 3+**
and must say so on the packaging.

---

## 2. Line by line: who makes it

### Stickers, and the charm family: Vograce

One supplier covers stickers, croc charms, acrylic charms and keyrings, which
means one purchase order, one shipment, one relationship.

- Low or no MOQ, which is exactly our position for a first run
- **Custom shoe charms and hat charms**, fully custom shape, so a Pebble shaped
  charm rather than a printed circle
- **Series connection acrylic charms**, designed for character line ups and
  collectible sets. This is precisely the five Planet Friends plus DiGi
- Prototypes in 3 to 5 days, mass production about 15 days
- Also holographic stickers and standees in the same house style

Alternatives worth a quote for stickers only: Sticker Mule, Awesome Merchandise,
Zap Creatives (UK based, so no import duty and faster).

### Printed passport: UK booklet printers

This is ordinary saddle stitch booklet printing and it is the easiest thing on
the list.

- Minimum 8 pages, page count always a multiple of 4
- A6 (105x148mm) is available and is close to real passport size (88x125mm)
- Laminated cover, matte or soft touch, gives it the passport feel
- Digital print means **runs of 1 are viable**, which is what personalisation needs

Quote: **Mixam**, **Doxzoo**, **Apprintable**, **Imprint Digital** (all UK).

This is the product with the highest emotional value and the lowest risk. It is
also the only one that can be **personalised per child**, printed from their real
earned stamps.

### Plush: Makeship first, factories later

Two routes, and the difference matters enormously at our stage.

**Route A, Makeship (recommended first).** A 21 day pre order campaign. Fans
pledge, and production only happens once it clears the minimum (roughly 200
backers). **No upfront cost, no stock risk, and they handle production and
fulfilment.** It doubles as a demand test: if we cannot find 200 families who
want a Pebble, we should know that before spending thousands.

**Route B, direct factory** once demand is proven:

| Maker | MOQ | Note |
| --- | --- | --- |
| CustomPlushMaker | None | Highest per unit cost |
| Stuffed Animal Pros | None | US based |
| Budsies | None | Known for mascots and characters |
| EverLighten | 30 units | Good bridge quantity |
| Maple Eye Toys | 100 per design | Cheapest per unit of the low MOQ set |

Most take a 50% deposit to start production.

**Squishmallow style specifically** means a super soft polyester, marshmallow
round shape and a flat embroidered face. Pebble, Bloop and Orbit already have
the right silhouette for it. Nova as currently drawn does not, which is a
separate art problem noted below.

---

## 3. What we actually sell

Six SKUs, deliberately small, because a big catalogue is a warehouse problem.

1. **The Passport**, personalised, A6 saddle stitch, their name and their real
   earned stamps printed in. Made to order.
2. **Sticker sheet**, all six characters plus the five stage stamps.
3. **Croc charm, single**, one per character, sold individually so a child can
   collect the one they just earned.
4. **Charm set of six**, the whole family including DiGi, at a saving.
5. **Charm bracelet**, the band plus the charms they have earned.
6. **Plush**, one character at a time, campaign led, starting with whichever the
   data says is most loved.

### The mechanic that makes this ours rather than generic tat

**A charm can only be bought once the child has earned that Friend in the app.**

That is the whole idea. The merch stops being merch and becomes proof. A parent
buying the Bloop charm is buying evidence their child did four streaks of real
world jobs. It is the physical end of the same pathway, and no competitor can
copy it without building the pathway first.

The printed passport works the same way: it prints the stamps they actually
earned, so no two are identical.

---

## 4. Selling it in the app

We already run Stripe, and this is a **PWA, not a native App Store app**, so
there is no Apple or Google 30% cut and no in app purchase rules to satisfy.
Stripe Checkout is the whole answer.

### What to build

**Migration (next free number, check origin/main and open PRs first):**

- `products`: key, name, blurb, price_pence, kind, character_key (nullable),
  requires_earned (bool), image_url, active
- `orders`: id, user_id, child_id, status, stripe_session_id, total_pence,
  shipping_json, created_at
- `order_items`: order_id, product_key, qty, unit_price_pence, personalisation_json

**Routes:**

- `POST /api/shop/checkout` builds a Stripe Checkout session from the basket.
  Server side it re checks the earned gate for every character item, so a made
  up basket cannot buy an unearned charm.
- `POST /api/shop/webhook` on `checkout.session.completed` marks the order paid
  and fires the fulfilment email.
- Personalised passport: on payment, generate the PDF from that child's real
  stamps and either post it to the printer's API or drop it in a queue we
  fulfil by hand at first. Manual is completely fine for the first fifty.

**Surface:** `/dashboard/keepsakes` becomes the real shop. It already exists and
already captures interest, so the interest list is the launch list.

Earned items show in full colour with a Buy button. Unearned ones show greyed
with "Earn Bloop to unlock this charm", which turns the shop into another reason
to keep the streak going.

### Sequencing the build

Ship the shop with **stickers and the passport only**. Those need no safety
testing, so the shop can be live and taking money while the charms are still in
the lab. Add charms when the EN71 certificate lands. Add plush when a campaign
succeeds.

---

## 5. Selling it on Etsy

Etsy and the app do different jobs and should not be confused.

- **The app sells to warm buyers.** They already know what a Planet Friend is
  and their child has earned it. Highest conversion, full margin, and the earned
  gate works.
- **Etsy sells to cold buyers.** People searching "kids chore chart" or
  "personalised passport gift". It is a discovery channel and a top of funnel
  feeder back to the app.

### The honest limitation

**Etsy does not integrate with Vograce or Makeship.** Printify and Printful,
which do integrate, do not make croc charms or the plush we want. So for Etsy:

- **Charms and stickers:** order a batch from Vograce, hold the stock, and ship
  ourselves. At these sizes that is a box in a cupboard, not a warehouse.
- **Personalised passport:** list as made to order. Etsy actively favours
  personalisation, and it is the listing most likely to be found by someone who
  has never heard of us.
- **Plush:** do not list on Etsy until a campaign has proven it.

### Rules to hold

- Identical SKUs, names and photography across both, so the brand reads as one
  thing.
- Etsy priced slightly higher to absorb their fees, so the app is always the
  better deal for a family already with us.
- Every Etsy parcel carries a card pointing at the app, with a code. Etsy is
  paying us to acquire customers.

---

## 6. Recommended order of work

**Phase 1, now, no safety testing, weeks not months**
Sticker sheet and personalised passport. Build the shop, wire Stripe, quote
Mixam and Doxzoo for the booklet and Vograce for the stickers. Live before the
charms are even tested.

**Phase 2, once EN71 is back**
Croc charms and the bracelet through Vograce. Age grade 3+. Turn on the earned
gate. This is where the pathway and the physical product lock together.

**Phase 3, demand proven**
Plush through a Makeship campaign. Zero capital at risk. If it clears, consider a
direct factory run for the second character.

**Do not** start with plush. It is the most exciting one and the one most likely
to leave us with a garage full of unsold Pebbles and a testing bill.

---

## 7. Open questions for Justin

1. **Is the orange flame character Cosmo?** It is not referenced anywhere in the
   app. The registry points Cosmo at a different file. If the orange one is the
   real Cosmo, the registry needs repointing before any of it goes to print.
2. **Nova needs redrawing before it can be a physical product.** It is currently
   off style: matte not glossy, horns, an older face, and photographed on a
   wooden floor. It will not plush or charm consistently with the other four.
   Candidates generated 25 July.
3. **Who holds the compliance duty?** If we import and brand it, we are the
   manufacturer in law. Worth an hour with a toy safety consultant before the
   first charm order, not after.
4. **Price points.** Suggested starting points to sense check: passport £12 to
   £15, sticker sheet £4, single charm £5, set of six £22, bracelet £16,
   plush £25 to £30.

---

## Sources

- Plush makers: [The Clever Business POD plush roundup](https://thecleverbusiness.com/print-on-demand-stuffed-animals/), [CustomPlushMaker](https://customplushmaker.com/), [Budsies](https://www.budsies.com/plush-production/), [EverLighten](https://everlighten.com/collections/custom-plush-toys), [Maple Eye Toys](https://mapleeyetoys.com/plush-printing/), [Stuffed Animal Pros](https://www.stuffedanimalpros.com/)
- Campaign route: [Makeship how it works](https://www.makeship.com/how-it-works), [Makeship FAQ](https://www.makeship.com/faqs), [Makeship for brands](https://www.makeship.com/brands)
- Charms and stickers: [Vograce custom shoe charms](https://vograce.com/products/custom-shoe-charms-personalized-hat-charms), [Vograce series connection charms](https://vograce.com/collections/custom-series-connection-acrylic-charms), [Vograce low MOQ overview](https://vograce.com/pages/discover-vograce)
- Booklet printing: [Mixam](https://mixam.com/booklets), [Doxzoo](https://doxzoo.com/products/booklet-printing), [Apprintable](https://www.apprintable.com/saddle-stitched-booklet/), [Imprint Digital](https://imprintdigital.com/services/booklet-printing/)
- Toy safety: [UK toy compliance guide 2026](https://blog.angliamarket.com/post/legal-requirements-for-selling-childrens-toys-in-the-uk-2026-compliance-guide), [Compliance Gate UK toy regulations](https://www.compliancegate.com/toy-regulations-united-kingdom/), [EN71 plush testing](https://deesev.com/en/common/904.html)
