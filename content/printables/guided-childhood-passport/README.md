# The Guided Childhood Passport, printable

Product 1 of the 5 November 2026 Etsy brief. Ages 4 to 16. List £7.99 with a
permanent 25 percent sale, so buyers pay £5.99. Evergreen.

Recipe: nearest is printables-engine recipe 8 (family agreements and guides),
with the stamp loop of recipe 1. Characters: the five Planet Friends and DiGi
only, per the brief and Justin's confirmation on 5 November 2026.

## Source of truth

The Passport in the app. Layout and words are copied, not invented:

- `components/pathway/PassportZineSheet.tsx` and `shared/zine.ts`: the fold
  out sheet, its imposition, slit, fold ticks and fold steps
- `components/pathway/PassportBook.tsx`: the burgundy cover, crest and the
  five Friends along its foot
- `components/pathway/PassportStamps.tsx`, `lib/pathway/stamped.ts` and
  `lib/pathway/passport-pass.ts`: what stamps a page, catch up, nothing expires
- `lib/content/stages.ts`: each stage's focus, script and action
- `lib/content/stage-characters.ts`: Friends, blurbs, art
- `lib/pathway/passport-print-style.ts`: burgundy, gold, stage colours, paper
- `lib/content/stage-quizzes.ts`: what each paper check asks about

## Contents

- `product/`: guided-childhood-passport-A4.pdf, -USLetter.pdf and
  -A4-ink-saver.pdf. Sixteen pages: front, how it works, the fold out sheet
  (its own landscape page), five stage pages each followed by its guide (so a
  double sided print puts the guide on the back), stamp and sticker sheet,
  what earns each stamp, the free bonus. The guides were added on 5 November
  2026; every line is the app's, from `lib/content/stages.ts`.
- `phone/`: seven 1080 by 1920 screens (cover, five stages, the stamp guide).
- `listing/`: listing.md (title, description, tags, price, photos, video)
  and `images/`, photo slots 1 to 10 at 2000 by 2000 (two options for slot 1).
- `images/`: the approved art copied in (Friends from
  `public/digi-squad/friends/`, `DiGi-star-3d.png`) and `preview/`, the page
  renders used for checking and for the listing images.
- `print.html`, `phone.html`, `listing/images.html`, `passport-data.js`:
  the editable source. `passport-data.js` holds every word.

## Rebuild

    node content/printables/guided-childhood-passport/build-passport.mjs

Optional argument `print`, `phone` or `listing`. Uses system Chrome and the
main checkout's playwright-core (override with CHROME and PW_CORE).

US Letter is laid out at Letter size, not an A4 page shrunk to fit, because
the fold out sheet must be the whole of the paper or its creases move.

## Funnel

Last PDF page: guidedchildhood.com/etsy-bonus, which already offers the free
Starter Pack for an email. Discreet footer URL on every page.

## Still open

1. Photo slot 1 is 01b, the road to 16 (Justin, 5 November 2026).
2. Orbit is 11 to 12, the app's ages (Justin, 5 November 2026).
3. **Before listing:** the PDF promises the Road to 16 guide free when every
   page up to the child's age is stamped, claimed at /etsy-bonus. The guide and that claim
   route must exist first.
4. Cover wording: the app's own covers say "Digital Literacy Passport" (fold
   out) and "Digital Childhood Passport" (book). This product says "Guided
   Childhood Passport" to match the shop banner.
5. **Before listing:** the stage pages name the ready packs (Calm Down
   Corner Kit, Earn Your Screen Time, Family Phone Agreement).
   List those on Etsy first, or with the Passport. The Starter Pack is the
   free gift at /etsy-bonus and is never sold (Justin, 5 November 2026).
6. Nothing is listed on Etsy until Justin says so.
