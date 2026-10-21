# The email gate on the free standalone lessons (21 October 2026)

Justin: "can we get the lesson with email address required as well as another
button to request pilot?" The lesson is the one promised to Votes for Schools,
/lesson/should-people-wear-smart-glasses, linked from the reply to Penny Lamb,
so that URL has to keep working.

Justin, later the same day: "if someone does have a license then we dont want
to ask for email and the system should know not to gate it".

## What gets built

1. The proxy (schools/proxy.ts) holds the gate, in one place, for every page a
   standalone lesson has: the lesson page, the run sheet, the player and the
   printable pack. A visitor with a school code (licence or pilot) goes
   straight through. A visitor with the free lesson cookie goes straight
   through. Anyone else sees the gate at the SAME URL (a rewrite, not a
   redirect), so the link in the email keeps working.
2. The gate asks for a school email (required) and the school name (the taster
   lead takes it, so this does too). The action stores the lead in
   schools.invoice_requests, band 'standalone', the way the taster does, sets
   the cookie for a year, and the page reloads into the lesson.
3. The cron (app/api/cron/invoice-requests) learns the band: a lead, labelled,
   and NO letter to the school. The teacher already has the lesson; an
   automatic letter would be a new email nobody asked for.
4. "Request a pilot" on the gate and on the lesson's free bar, a separate
   outline button, to /pilot?from=<module>. The pilot form carries it into the
   notes, so Justin sees which lesson the request came from. Hidden for a
   school with a code, which already has a licence or a pilot.

## Scope decisions

- All three standalone lessons, not only smart glasses: they share one path
  predicate and one bar, and each bar links the other two, so gating one
  leaves the others as an open door to the same free set. One cookie opens all
  three, so nobody is asked twice.
- The taster (ks3-12) stays ungated. Its order was Justin's own (taster, then
  lead) and its bar already asks for the email after the lesson.
- No migration: band is free text, same table, insert only RLS.
