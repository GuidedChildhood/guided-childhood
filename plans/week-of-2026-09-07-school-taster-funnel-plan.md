# The taster funnel: one lesson, sent, that turns a teacher into an invoice

Justin, 11 September 2026: "how can I send that one sample lesson so teachers
can get a taster, then leads, then to sign up, request an invoice page."

## What is already there, and what is not

The two ends exist. The middle does not.

| piece | state |
| --- | --- |
| Invoice request form on /pricing | works, posts to `schools.invoice_requests` |
| Hourly cron emailing Justin each request | works, `app/api/cron/invoice-requests/route.ts` |
| A non buying lead going through the same letterbox | works, `/draw` does it with `band: 'draw'` |
| A link you can send a teacher that opens a lesson | MISSING, it redirects to /unlock |
| A lead capture between the taster and the PO | MISSING |

So a lesson link sent to a teacher today hits the code door and bounces, and
the only form on the site demands a purchase order number, which is the last
thing a browsing teacher has rather than the first.

## The shape

Justin named the order himself: taster, then lead, then invoice. So the
lesson is NOT behind the form. The lesson is the pitch, and the form comes
after it has done its work.

1. **Taster.** `/lesson/ks3-12-misinfo-deepfakes` opens with no code.
2. **Lead.** A bar on the page, for visitors without a licence cookie only,
   offering the printable pack in exchange for name, school, role and email.
3. **Invoice.** That form's success state points at /pricing, which already
   holds the five band invoice request.

## Why the real pages rather than a built for purpose demo

`/lesson/[module]` is already "the page a teacher opens the night before":
objective, essential question, misconceptions, differentiation, SEND and EAL,
timing, the named cycles, and one button to teach. That page IS the argument
for zero prep. A cut down demo would sell the product worse than the product
does, and would be a second thing to keep in step.

So the taster is the real prep page, the real player and the real print pack,
for ONE module out of 23, reached at their ordinary URLs.

## The gate change, stated plainly

This amends the open map decision of 30 August 2026, which put the paid wall
at "the lessons, the scripts, the packs and the testing". One module of 23
now sits outside it, deliberately, as the sample. The catalogue is still the
product; a single worked example is the advert for it.

The whitelist is one array in `schools/lib/taster.ts`. Adding or removing a
taster module is a one line change, and every other module 404s the same way
it does today.

## No migration

`/draw` already established that a lead who is not buying goes into
`schools.invoice_requests` with a marker band and the PO field carrying a
word rather than a number. A taster lead is the same shape: `band: 'taster'`,
`po_number: 'TASTER'`, module and role in the notes. No new table, no
migration number to claim, and Justin's hourly email picks it up unchanged
once `BAND_LABELS` learns the word.

## Build

1. `schools/lib/taster.ts`: the whitelist, and a matcher for the four path
   shapes (`/lesson/<m>`, `/lesson/<m>/run`, `/teach/<m>`, `/print/<m>/...`).
2. `schools/lib/access.ts`: `isOpenPath` consults it.
3. `schools/app/taster/actions.ts`: the lead, through the existing letterbox.
4. A taster bar plus lead form, rendered only when the access cookie is
   absent, on the prep page and the print pack.
5. `BAND_LABELS` gains `taster`.
6. A guard so a future edit cannot widen the whitelist silently or let a
   taster path through for a module that is not on it.

## Checks

Typecheck both workspaces, run the guard, then render it: the schools app
boots locally with a dummy access gate (recipe in decisions.md, 11 September)
so the bar and the form get looked at on a phone and a laptop, licensed and
unlicensed, before this ships.
