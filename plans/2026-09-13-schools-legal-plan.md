# The buying documents: terms, privacy notice and DPA for schools (13 September 2026)

Decision 3 of the six Justin agreed on 13 September: draft the terms, the
privacy notice and the data processing agreement now, from the data
protection pack, for a solicitor's pass. The review's must fix 8 named the
gap: a school could not buy without a phone call because there were no terms
of business, no privacy notice for schools and no DPA to download although
the data pack promised one for signature.

## The facts the documents rest on (read from the code, 13 September)

- The schools app touches two tables: `schools.school_lessons` (content, read
  only) and `schools.invoice_requests` (the letterbox: invoice, draw, taster
  and pilot rows carrying school name, contact name, role in notes, work
  email, PO number, pupil count band, free text notes).
- No pupil data, no teacher accounts, no session. One cookie,
  `gc_schools_access`, holds the school code and an expiry, signed with HMAC,
  180 days, checked against the live allow list on every request.
- The classroom player posts nothing (`completeEndpoint={null}` on both the
  teach and class routes). The AI governance reviews and the passport page
  fill live in the browser only (`shared/ai-governance/storage.ts`,
  `shared/schools-taught.ts`).
- No analytics, no trackers, no model calls in the schools app (wiring check 7
  bans the imports). Providers: Supabase (database, project region eu-west-1,
  Ireland), Vercel (hosting), Resend (the confirmation emails, sent by the
  parent app's cron), Stripe (Justin raises the invoice by hand in the Stripe
  dashboard).
- The legal identity reads from `shared/legal.ts`: Guided Digital Childhood
  Ltd, 17299814, Apple Acre, Star, Winscombe, BS25 1QF, not VAT registered,
  hello@guidedchildhood.com.
- The licence: one code, every teacher, a year, invoice with 30 day terms, no
  VAT. The pilot: five places, one code each, twelve weeks, free.

## The three documents

1. **Terms for schools** (`/terms`): who we are, what the licence opens, what
   a school may and may not do, how long it lasts and renewing (twelve months,
   nothing renews on its own), price and invoice (30 day terms, no VAT, a 30
   day cancel and refund promise at the start of a licence), the free pilot,
   what the Service is and is not (not legal advice, safeguarding stays with
   the school), availability and support, ownership, personal data, liability
   (capped at the year's fees, or £500 on a free pilot), ending, changes,
   general, law of England and Wales.
2. **Privacy notice for schools** (`/privacy`): controller, who it is for,
   what we collect and why with the lawful basis for each, what we never do,
   the four providers, transfers, retention (leads twelve months, licensed
   contacts the licence plus six years for accounting records), rights, the
   ICO, security, children, changes.
3. **Data processing agreement** (`/dpa`): parties and purpose, what personal
   data is involved (pupils: none), the roles (independent controller for the
   contact data; Article 28 terms that apply automatically to any processing
   on the school's behalf), commitments in every case (purpose limits,
   security, breach notice within 48 hours, help with requests, deletion),
   the Article 28 clauses, term and law, Annex 1 the data, Annex 2 the
   security measures, Annex 3 the sub processors, signature blocks for both
   parties. Printed, signed, emailed back.

## Where they live

- Content: `schools/lib/legal/{terms,privacy,dpa}.ts`, typed, every company
  fact read from `@gc/shared/legal` and every pilot number from
  `schools/lib/pilot.ts`, so nothing is typed twice.
- One renderer, `schools/components/LegalDocument.tsx`: eyebrow, title,
  version line, an "In plain words" box in Justin's voice, a contents list,
  numbered sections and clauses, annex tables, signature cards, related
  documents, the print button. Mobbin references: Workable, Bonsai and Remote
  contract pages (numbered clauses with bold lead ins, hairlines, side by side
  signature cards), redrawn in Nunito and IBM Plex Mono on cream and ink.
- Routes: `schools/app/(legal)/{terms,privacy,dpa}/page.tsx` under one layout
  with the nav and the footer. All three join OPEN_PATHS, the sitemap and the
  footer. The data pack links to the DPA and the privacy notice and stops
  naming the old email address. The pilot and invoice letters tell the DPO
  where the DPA is.
- Guard: `scripts/check-schools-legal.mjs` in CI: the routes open, listed
  and linked; no dashes in any document; no company fact typed as a literal;
  the same sub processors named in the privacy notice and the DPA; the data
  pack pointing at both documents.

## Version and the solicitor's pass

Every document carries "Version 1.0 · 13 September 2026". They go live now
because a school reads them before it buys, and a change from the solicitor
becomes version 1.1 with a line in decisions.md. Points a solicitor should
settle, listed in the pull request and repeated here:

- The controller position for the contact data (independent controller,
  with Article 28 terms held in reserve) rather than a plain processor DPA.
- The liability cap (the year's fees, or £500 where no fee has been paid) and
  the exclusions.
- The 30 day cancel and refund promise at the start of a licence.
- Statutory interest on late invoices, and pausing the code after a reminder.
- The 48 hour breach notice to the school.
- Printed materials being used up after a licence ends.
- The order of precedence over a school's own purchase order terms.
- Whether an ICO registration number should appear (the parents app noted an
  ICO registration "going in" on 9 August; none is recorded in the code).
- The signatory title for Justin (Founder is used; Director if that is the
  registered role).
- Whether Resend's open and click tracking is off on the sending domain, so
  the "we do not track" line is true in the dashboard as well as the code.

## Verification

- Both typechecks, every guard in wiring.yml by exit code, the dash scan.
- The three routes rendered at 390 and 1440, and the DPA printed to PDF, to
  see the signature cards land on the page.
- review.md sections 2, 5 and 6 (a migration free change; no children's data).
