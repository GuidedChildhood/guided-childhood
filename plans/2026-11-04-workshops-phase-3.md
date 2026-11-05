# Workshops, phase 3: the page and the enquiry (4 November 2026)

Justin approved the workshop audit's page location and flagship outline, then
"yes start phase 3 on a branch, can you take this over". Phase 3 is the page
and the enquiry flow. The flagship pack (phase 2) is written separately.

## What gets built

1. `schools/lib/workshops.ts`: the four workshops (year group, title,
   length, three things pupils do, flagship marked), the delivery options,
   the enquiry band, and a `WORKSHOPS_LAUNCHED` switch.
2. `schools/app/workshops/`: the page and its form, in the house system
   (Nunito and Plex Mono, butter on cream, the pilot page's layout).
   Sections: headline, founder line, four workshop cards, what pupils do
   and what teachers receive, curriculum links (to /hub/rshe-mapping),
   delivery, founding schools, the form, FAQ.
3. The enquiry posts into `schools.invoice_requests` with band `workshop`,
   the same letterbox the pilot uses. The form's extra answers go in the
   notes, as the pilot form does. No new table.
4. The parent app cron (`app/api/cron/invoice-requests`) treats `workshop`
   as a lead: Justin gets the enquiry, the school gets a confirmation
   (`lib/email/school-letters.ts`) saying he replies within two working days.

## What waits on Justin

- Prices stay off the page until he picks a column.
- `WORKSHOPS_LAUNCHED` stays false (page noindex, not in the nav or the
  sitemap) until the DBS check and insurance are in hand, because the audit
  holds all marketing until then. The FAQ promises the DBS certificate and
  insurance before any visit is confirmed, which is true either way.
- No sample slide yet: the flagship deck is phase 2.

## Checks

Typecheck both apps, wiring, ai-tells on every new line of copy, Playwright
at 390 and 1440, keyboard through the form, validation errors without a
submit (no production form is ever submitted).
