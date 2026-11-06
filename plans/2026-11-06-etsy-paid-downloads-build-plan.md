# Etsy paid downloads 2 to 9 and 11, built (6 November 2026)

Justin, 6 November 2026: "etsy top sellers research and add all products not
yet added". The approved list is `content/etsy-shop/product-brief.md` (from
`plans/week-of-2026-11-02-etsy-paid-downloads-and-free-saturday-plan.md`).
Product 1, the Passport, and the five packs it names are live. This plan
builds the rest of the paid line and runs the top sellers research beside it.

## Claimed in the draft PR

| # | Product | Folder | Friend | List price | Due |
|---|---|---|---|---|---|
| 2 | The First Phone Kit | `content/printables/first-phone-kit` | Orbit | £9.99 | 20 Nov |
| 3 | The Christmas Screen Free Countdown | `content/printables/christmas-countdown` | all five | £5.99 | 20 Nov |
| 4 | Screens At Granny's | `content/printables/screens-at-grannys` | Bloop | £4.99 | 20 Nov |
| 5 | The Christmas Phone Bundle | `content/printables/christmas-phone-bundle` (listing only) | Orbit | £14.99 | next |
| 6 | Are We Nearly There | `content/printables/are-we-nearly-there` | Pebble | £4.99 | next |
| 7 | The Holiday Screen Deal | `content/printables/holiday-screen-deal` | Bloop | £4.99 | 12 Dec |
| 8 | The 30 Day Screen Reset Journal | `content/printables/screen-reset-journal` | Nova | £7.99 | 28 Dec |
| 9 | Our Class Screen Promise poster set | `content/printables/class-screen-promise` | all five | £6.99 | 28 Dec |
| 11 | The Whole System Bundle | `content/printables/whole-system-bundle` (listing only) | DiGi | £24.99 | after reviews |

Not built here: 10, the Personalised Star Chart (the brief waits for reviews,
and personalising is a per order job), and 12, the printed Passport (physical,
its own PR 1417).

## How every product is made

The five packs' pipeline (PR 1408), unchanged: `print.html` in mm on A4,
`phone.html` where the brief names a phone use, `listing/images.html` feeding
`content/printables/listing-images.js`, built by
`node content/printables/build-pack.mjs <pack>` into product/ (A4, US Letter,
A4 ink friendly), images/preview, phone/ and listing/images (2000 by 2000).
Last page from `pack-finish.js`: the Passport sticker where the Passport's Go
further strip or a stage page fits it, and the honest /etsy-bonus gift.
`listing/listing.md` to the Passport standard, tags checked by
`check-listing-tags.mjs`. Approved cutouts only, never a drawn character.
No dashes, UK English, no outcome or medical claims, `npm run ai-tells`.

Bundles are listing packages over files that already exist: a photo set and a
listing.md that name the PDFs to attach. No new pages.

## Research

`plans/2026-11-06-etsy-top-sellers-research.md`: the formats that sell in our
customer's corner of Etsy, mapped HAVE, PLANNED, GAP or SKIP against the
product, with a build next list. Formats only, never anyone's design or words.
Any GAP worth building becomes its own row in a later plan.

## Not in scope

Uploading to Etsy. The listings land ready; the Etsy session saves the drafts.
