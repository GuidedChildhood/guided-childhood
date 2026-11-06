# The 30 Day Screen Reset Journal: product folder

Part of the paid Etsy line, plans/2026-11-06-etsy-paid-downloads-build-plan.md.
Listed £7.99 with a permanent 25 percent sale, so buyers pay £5.99. January is
its season. For the whole family: children 8 and up writing alongside a
grown up, younger ones drawing. Fronted by DiGi, with Bloop (8 to 10) and
Nova (13 to 15).

One small change a day for thirty days, five faces each night for how the
day felt, and on day thirty the family draws the line: what stays, what goes,
what to try next month. A reset, not a ban, and the grown ups do every change
too.

## Contents

- `product/`: 30-day-screen-reset-journal-A4.pdf (colour),
  30-day-screen-reset-journal-USLetter.pdf and
  30-day-screen-reset-journal-A4-ink-friendly.pdf. Sixteen pages: cover, how
  it works, where we start (the baseline), the five faces key, the thirty days
  on ten pages (three a page), the line we draw, and the Passport stickers
  with the free gift.
- No phone version. The journal is written in by hand; listing slot 5 shows a
  booklet card in its place.
- `images/`: the approved DiGi, Bloop and Nova art, `preview/` (a PNG per
  page) and the image ledger (images.md).
- `listing/`: listing.md (title, price and sale, description, 13 tags, photo
  slots, video and reel, compliance) and `images/`, the 2000 by 2000 photo
  set from `images.html` and `../listing-images.js`.
- `print.html`, `fonts/`: the editable source. The day pages are built by the
  script at the foot of print.html from the DAYS list, so a change is edited
  in one place.

## Proof paths

- The five faces and their words: `components/daily/ConcernCheckIn.tsx`
  (BANDS and Face). Really tough, hard going, up and down, getting there,
  going great, drawn with the same mouths.
- The baseline and the second look: `lib/working/first-week.ts` and
  `lib/content/proof.ts`. Day zero faces are the baseline, day thirty faces
  are the second look, and nothing is ever added up into a score.
- Protected time (bedtime, mealtimes, school hours) on the line page is the
  three kinds of time in THE-STORY.md section 3.

## Claims rule

The journal never claims the reset improves sleep, mood, behaviour or
anything else, and never calls itself a detox. It says what the family does:
tries a change, circles a face, writes a line, decides what stays.

## Last page

`../pack-finish.js` with the Bloop and Nova pages under the check, and
"strip":false (the Passport's Go further strip does not name this pack). Then
the free gift at guidedchildhood.com/etsy-bonus.

## Rebuild

    node content/printables/build-pack.mjs screen-reset-journal [print|listing]

Checks: `node scripts/check-ai-tells.mjs` on every html and md file here, and
`node content/printables/check-listing-tags.mjs` on listing/listing.md.
