# Etsy listing package: The Guided Childhood Passport, printed

The physical edition of the printable Passport, made to order. Plan:
`plans/2026-11-05-printed-passport-plan.md`. Nothing is listed until Justin
has held the Mixam proof and said so.

## Files

| What | File | Goes to |
|---|---|---|
| The booklet, blank cover | `printed/guided-childhood-passport-printed-A6-booklet.pdf` | Mixam, A6 stapled, 16 pages |
| One order's booklet, name on the cover | `node build-passport.mjs printed --name "Sam"` writes `printed/orders/…-Sam.pdf` (gitignored) | Mixam |
| The sticker sheet | `printed/guided-childhood-passport-printed-A6-stickers.pdf` | sticker printer, kiss cut |
| The sticker cut lines | `printed/guided-childhood-passport-printed-A6-stickers-cutline.pdf` (magenta, 0.25 pt) | sticker printer |
| Listing photos | `listing/images/printed/p01` to `p06`, 2000 by 2000 | Etsy |
| Etsy video | `videos/2026-11-05-printed-passport/` | Etsy |

**Mixam settings:** A6 portrait, stapled (saddle stitched), 16 pages self
cover, silk 150 gsm inside, matt laminated 300 gsm cover if offered as a
separate cover, plain packaging. Every PDF page is the A6 trim plus 3 mm
bleed. Chrome writes the page as 111.2 by 154.2 mm, a fifth of a millimetre
over, which sits inside the bleed; if Mixam's checker flags it, accept its
fit to bleed.

## Title (119 characters)

Personalised Kids Passport Book with Stickers | Printed Stamp Book for Screen Time and Online Safety Talks | Ages 4 to 16

## Price

Set once the proof gives the real cost. The brief says £14 (the app's
keepsake price). Free UK delivery is built into the price, because Etsy
ranks free delivery higher. Physical goods sold in the UK by a seller who is
not VAT registered carry no VAT, so the buyer pays the list price.

Rule of thumb: list price at least three times the Mixam cost of one copy
plus postage, so the sale and Etsy's fees still leave a margin.

## Personalisation (Etsy's personalisation box, optional)

> Your child's first name for the cover, up to 16 letters. Or leave it blank
> and they write it in themselves.

## Description

A stamp in this passport is earned. Your child gets one when they have
learned something, never for a birthday.

This is the printed Guided Childhood Passport: a real little book, made for
your child and posted to your door. It covers the journey from four to
sixteen in five stages, and each stage belongs to one of our Planet Friends:
Pebble, Bloop, Orbit, Nova and Cosmo.

Every stage has its own spread. On the left are three things to do: the
conversation (with the words to say printed on the page), one small thing to
do together, and the check, where your child tells you the big idea back in
their own words. That is a chat, not a test. On the right is the stamp ring.
When all three are done, the stamp sticker goes in.

What you get:

- A 16 page A6 booklet, stapled, with a burgundy and gold cover
- Your child's first name in gold on the cover, if you like. Leave it blank
  and they write it themselves
- A page to draw their own passport photo
- A spread for every stage, with the words to say, the thing to do and the
  check
- A page for grown ups explaining what earns each stamp
- A sticker sheet: five stage stamps, a Passport complete seal, a name label
  and fourteen DiGi stars

Join at any age. Start on the page for your child's age today. The earlier
pages stay open, so you can come back and fill them in whenever you like.

The stages:

- Pebble, ages 4 to 7: the first device conversation
- Bloop, ages 8 to 10: the bedroom rule
- Orbit, ages 11 to 12: the algorithm conversation
- Nova, ages 13 to 15: when things go wrong online
- Cosmo, 16 and up: building independence

Made to order. Each book is printed one at a time in the UK and posted
direct to you, so please allow a few working days before it is sent.

Would you rather print it yourself? The printable version is in the shop
too.

I am Justin, a dad who got tired of the screen time fight. The Passport is
the paper version of the one in the Guided Childhood app. If anything is not
right when it arrives, message me and I will put it right.

Stickers are small parts: not for children under 3.

## 13 tags (every one 20 characters or fewer)

| Tag | Characters |
|---|---|
| custom kids passport | 20 |
| kids passport book | 18 |
| reward sticker book | 19 |
| stamp book for kids | 19 |
| screen time chart | 17 |
| online safety kids | 18 |
| digital skills kids | 19 |
| kids milestone book | 19 |
| personalised gift | 17 |
| name book for kids | 18 |
| family screen rules | 19 |
| tween phone talk | 16 |
| keepsake for kids | 17 |

## Etsy settings

- Physical item, made to order, "Made by a production partner": Mixam UK,
  printing. Etsy requires the partner to be named.
- Who made it: I did (design). What is it: a finished product.
- Processing time: 3 to 5 working days. UK delivery only until the proof run
  shows what overseas postage costs.
- Creation details: the Planet Friends and DiGi were made with AI tools.

## Fulfilment, the first fifty, by hand

1. An order lands. Read the personalisation box.
2. `node content/printables/guided-childhood-passport/build-passport.mjs printed --name "<name>"`
   (or the blank booklet when the box is empty).
3. Upload that PDF at Mixam, one copy, plain packaging, the buyer's address.
4. Post the sticker sheet from the stock of pre printed sheets, or tuck it in
   if Mixam ships to us first. Decided after the proof.
5. Mark it dispatched on Etsy with Mixam's tracking.

After fifty orders, wire Mixam's API (`plans/2026-08-10-star-chart-and-planner.md`
phase C has the shape) and drop step 3.

## Compliance

- No outcome claims about a child. The copy says what the family does.
- No checkout link and no cheaper elsewhere line. The book's page 15 points
  to guidedchildhood.com/etsy-bonus, a free page, as the printable does.
- The child's name goes to Etsy and Mixam only, for this order. It is never
  kept in the repo: `printed/orders/` is gitignored.
- Photos are renders of the real pages, labelled as such in the source. A
  real photo replaces slot 1 once the proof exists.
