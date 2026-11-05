# The printed Passport on Etsy, plus its video: plan

Written 5 November 2026. Justin asked: "could we do a passport straight to a
print on order system via Etsy so they request an actual passport", then
"yes build it also lets make a video of it for etsy" and "and social media".

## The answer that shaped it

The print services that plug into Etsy (Printful, Printify, Gelato, Prodigi)
print clothes, wall art and photo books, not a small stapled A6 booklet. The
September supplier research (`plans/2026-09-14-keepsakes-suppliers-research.md`)
already ruled them out. Mixam UK prints an A6 stapled booklet from one copy,
ships direct in plain packaging and has an API. So the first fifty orders are
placed on Mixam by hand, which is the shop's standing rule anyway, and the
Mixam API is wired only after real orders.

## What gets built

1. **The A6 printed edition**, `content/printables/guided-childhood-passport/printed.html`.
   16 pages, a multiple of four, A6 trim with 3 mm bleed (111 by 154 mm PDF
   pages), text kept 6 mm inside the trim. Built from the same
   `passport-data.js`, so the words cannot drift from the printable or the app.
   - 1 cover (burgundy, crest, the five Friends, the child's name in gold when
     given, a gold name line when not)
   - 2 this passport belongs to, draw your passport photo, started on
   - 3 how it works
   - 4 the road from four to sixteen
   - 5 to 14 one spread per stage: the left page is the talk, the doing and the
     check with tick boxes; the right page is the stamp ring, date, signatures
     and the best thing I learned
   - 15 for the grown ups: what earns each stamp, the reward, the app
   - 16 back cover
2. **The sticker sheet**, A6 with bleed, kiss cut guides: five stage stamps,
   the Passport complete seal, a blank name label (the September plan's free
   personalisation) and DiGi stars.
3. **The build**: `node build-passport.mjs printed [--name "Alma"]` writes the
   blank booklet, the sticker sheet and, with a name, one order's booklet.
4. **The listing package**, `listing/printed-listing.md` plus photos rendered
   from the real pages.
5. **The films**, from the real page renders, never a generated booklet:
   - Etsy: square, 12 seconds, silent (Etsy strips sound), ends on the book.
   - Social: 9 by 16, silent UGC rules, text hook in the top third, ends on the
     stage check line, plus captions for Instagram, Facebook and TikTok.

## Rules

- A render is a render: no generated hands or photo presented as the real
  booklet. When the proof copy arrives, the hands on the table film in
  `listing/listing.md` replaces it.
- No dashes, no outcome claims, Planet Friends and DiGi only, UK English.
- The child's name is optional, only on the cover, and goes to Etsy and Mixam
  only. Leaving it blank is offered as the default ritual: the child writes it.

## Needs Justin

- Order one proof copy from Mixam (a purchase, so his) to fix the real cost
  and check the colour of the burgundy and gold.
- Then the price (the brief says £14) and whether the sticker sheet travels
  in the booklet's envelope (Justin posts) or separately.
- Nothing is listed or posted without his word.
