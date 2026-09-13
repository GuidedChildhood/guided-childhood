// THE PILOT, in numbers a page, a guard and an email can all read.
//
// Justin, 13 September 2026: five schools, one code per school, a free term,
// and the invoice form pre filled when the term ends so a pilot turns into a
// licence in one click. The five lives here and nowhere else: the pilot page
// says "the first five", the places left are counted against it
// (pilot-places.ts), and the home page reads it rather than typing it.
//
// No imports on purpose: scripts/check-pilot-door.mjs loads this file under
// plain node, and the database client next door cannot load there.
export const PILOT_PLACES = 5
export const PILOT_TERM_WEEKS = 12

// The letterbox marker for a pilot request (schools.invoice_requests, band).
// The parent app's cron reads the same word to know it is a lead and not an
// order (app/api/cron/invoice-requests/route.ts).
export const PILOT_BAND = 'pilot'
