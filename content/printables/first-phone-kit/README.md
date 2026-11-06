# The First Phone Kit: product folder

Paid product 2 (`content/etsy-shop/product-brief.md`), built 6 November 2026
under `plans/2026-11-06-etsy-paid-downloads-build-plan.md`. For parents of 9
to 13 year olds about to hand over a first phone. List £9.99 with a permanent
25 percent sale, so buyers pay £7.49. Fronted by Orbit (ages 11 to 12, the
phone stage), with Bloop where the nine and ten year olds need it.

The one idea: the phone arrives with a plan, and the plan is made together.

## What it is not

The Family Phone Agreement (`../family-phone-agreement`) is the family deal
the parent leads: five questions, trust levels, wallet cards. This kit's deal
is written by the child, in open prompts in their own words, and the kit
wraps it in the things around it: the readiness check, setup night, and the
first month. No page repeats the other pack.

## Pages (12)

1. Cover.
2. How to use it: the four steps in order, the no confiscation promise said
   before the box is opened, smartphone or calls and texts, and the nine or
   ten note.
3. The readiness check, the child's side: eight lines from the app's Ready
   For My Phone road, each ready, nearly or not yet, each with what to
   practise next.
4. The readiness check, the grown up's side, and how to read both pages
   together. No pass mark, no date.
5. My phone deal, written by the child.
6. Our promises to you (the first phone clauses, grown ups included),
   signatures, three review dates.
7. Setup night checklist, by feature rather than menu path.
8. The first 30 days, weeks 1 and 2.
9. Weeks 3 and 4 (days 22 to 30).
10. Day 30, the first review: keep, loosen, practise.
11. The words for the first wobble: four scripts from the scripts table and
    the screenshot exception from device-issues.
12. The Orbit Passport sticker and the free gift (`../pack-finish.js`,
    `strip: false`, since the Passport's Go further strip does not name it).

## Proof paths

The check: `components/printables/drawn/ReadyForMyPhoneSheet.tsx`,
`lib/content/readiness.ts`, `lib/content/stages.ts` (Orbit). The deal:
`lib/content/agreement-clauses.ts` (the first phone clauses),
`lib/content/agreement-promises.ts`, `lib/content/kid-contract.ts`. Setup
night: the device guides in `supabase/migrations/014_device_safety_hub.sql`
and `lib/content/device-issues.ts` (night_phone). The words: the scripts
table rows as `../script-cards/cards-data.js` holds them, said word for word.

## Contents

- `product/`: first-phone-kit-A4.pdf (colour), USLetter.pdf,
  A4-ink-friendly.pdf.
- `phone/`: 1080 by 1920, setup-night.png and first-30-days.png.
- `images/`: the Orbit and Bloop cutouts, DiGi, `preview/` and the ledger
  (`images.md`).
- `listing/`: `listing.md` (title, price, description, 13 tags, photo slots,
  compliance) and `images/`, the 2000 by 2000 photo set.
- `print.html`, `phone.html`, `listing/images.html`, `fonts/`: the source.

## Rebuild

    node content/printables/build-pack.mjs first-phone-kit [print|phone|listing]

Checks: `node scripts/check-ai-tells.mjs` on every html and md file here, and
`node content/printables/check-listing-tags.mjs content/printables/first-phone-kit/listing/listing.md`.
