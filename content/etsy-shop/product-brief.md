# Guided Childhood Etsy and free download product brief

Paste this whole file into the session that builds the products. Written 5 November 2026.
It summarises `plans/week-of-2026-11-02-etsy-paid-downloads-and-free-saturday-plan.md`, approved by Justin.

## Rules for every product

- Build each one with `.claude/skills/printables-engine`: PDFs (A4, US Letter, ink saver), phone version, image set, listing package.
- Visuals follow `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`. Approved art only: the Planet Friends in `public/digi-squad/friends/`, DiGi as `public/digi-squad/DiGi-star-3d.png`, the Passport drawn from `components/pathway/PassportBook.tsx`. Never a regenerated character.
- Every listing's first photo uses the cover frame in `content/etsy-shop/branding/v2/etsy-v2.html` (the `#cover` block): real page preview, one friend, big headline.
- No dashes anywhere, UK English, Justin's voice. Run `npm run ai-tells`. No outcome or medical claims for a child.
- The last page of every paid PDF points to `/etsy-bonus`. Free downloads point to the stage check at `/starter-pack`.
- Free downloads are never listed on Etsy. Etsy sells; the website collects emails.
- Price floor £4, except deliberate entry offers. A permanent 25 percent sale sits on top of the list price.

## Paid downloads for Etsy, in build order

| Order | Product | For | Price | What is inside | Proof path in the app |
|---|---|---|---|---|---|
| 1 | **The Guided Childhood Passport, printable** | 4 to 16 | £7.99 | The fold out burgundy Passport, five stage pages (Pebble 4 to 7, Bloop 8 to 10, Orbit 11 to 13, Nova 13 to 15, Cosmo 16 and up), a printable stamp and sticker sheet, and a "what earns each stamp" page | `PassportBook.tsx`, `PassportZineSheet.tsx`, `PassportStamps.tsx`. Must be listed first because the new shop banner says "Get your Guided Childhood Passport" |
| 2 | **The First Phone Kit** | Parents of 9 to 13s | £9.99 | Readiness check, a phone deal the child writes with you, the first 30 days plan, a setup night checklist | The Passport, Ready For My Phone, the devices setup guides, the family phone agreement |
| 3 | **The Christmas Screen Free Countdown** | 4 to 11 | £5.99 | 24 doors, 1 to 24 December, one Planet Friend activity a day, a sticker sheet | The balance wheel, five a day, the Planet Friends |
| 4 | **Screens At Granny's** | Families visiting over Christmas | £4.99 | House rules that travel: a card for the grandparents, a card for the child, the three kinds of time in plain words | The three kinds of time: theirs, earned, protected |
| 5 | **The Christmas Phone Bundle** | Same parent as 2 | £14.99 | The First Phone Kit, the family phone agreement and the calm down kit | As above |
| 6 | **Are We Nearly There** | 4 to 11 | £4.99 | A screen free car and travel pack: games, a journey map to colour, a "tablet after the next town" deal card | Earned time and jobs, the star economy on paper |
| 7 | **The Holiday Screen Deal** | 5 to 12 | £4.99 | A two week school holiday planner: the daily core, jobs board, protected times, a tally | The child app quests and the weekly cap |
| 8 | **The 30 Day Screen Reset Journal** | Whole family | £7.99 | One change a day, five faces each night, the line you draw at the end | The check in, baseline and five faces |
| 9 | **Our Class Screen Promise poster set** | KS1 and KS2 teachers | £6.99 | A3 poster, 30 pupil promise slips, a parent letter | The schools scheme and its lessons |
| 10 | **The Personalised Star Chart** | 4 to 10 | £6.99 | The child's name and their chosen Planet Friend drawn in | The star chart and the buddy a child picks in the app |
| 11 | **The Whole System Bundle** | Any parent | £24.99 | Star chart, earn your screen time, calm down kit, the Five Fights words, the 30 day reset | The whole product on paper |
| 12 | **The printed Passport with real stickers** (later, physical) | 4 to 16 | £14 | The printed keepsake already in the app, with the real sticker sheet | `components/passport/PassportOrderCard.tsx`, `plans/2026-09-16-personalised-passports-and-stickers.md`, `public/shop/sticker_sheet.webp`. Needs shipping and a print partner first |

Dates: 1 as soon as possible. 2, 3 and 4 listed by 20 November. 5 and 6 next. 7 by 12 December. 8 and 9 by 28 December for January. 10 and 11 once there are reviews to carry them. 12 later.

Already built and ready to list as they are (`content/printables/*/listing/listing.md`): the Starter Pack, the star chart, earn your screen time, the family phone agreement, the calm down kit, the school year planner, and seven activity sheets.

## Free downloads, one every Saturday (website and Instagram only, never Etsy)

Each one is the free taste of a paid product. The email is collected on `/free/<slug>`, and links carry `?src=ig` or `?src=ig-story`.

| Saturday | Free download | Taster for | Status |
|---|---|---|---|
| 7 Nov | The Planet Post, Issue 1 | The series | Built, live at `/free/planet-post` |
| 14 Nov | The Bored Jar, 40 slips | Are We Nearly There | To build (spec in `plans/2026-10-13-free-printables-lead-magnets-plan.md`) |
| 21 Nov | The Christmas Countdown, first 7 doors | The 24 door Countdown | Comes from paid product 3 |
| 28 Nov | Five Questions Before The Phone Goes Under The Tree | The First Phone Kit | Exists as the `five-questions` magnet; needs a new cover |
| 5 Dec | Screen Time Tickets, where bedtime is never for sale | The Holiday Screen Deal | To build (spec in the 13 October plan) |
| 12 Dec | The Words For The Five Screen Fights | The Whole System Bundle | To build (spec in the 13 October plan) |
| 19 Dec | The Planet Post, Issue 2: Phones Go To Bed Too | The series | Content only |
| 26 Dec | Rest week: repost the Countdown | | None |
| 2 Jan | The Seven Night Screen Reset | The 30 Day Reset Journal | To build (spec in the 13 October plan) |
| 9 Jan | A free Passport stage page (Pebble) | The printable Passport | Comes from paid product 1 |

## Shop assets, already done

`content/etsy-shop/branding/final/`: the banner (3360 by 840, the friends walking to the Passport), the shop icon (the 3D DiGi on gold), and the Starter Pack listing cover. Shop copy is in `content/etsy-shop/rebrand-assets.md`.
