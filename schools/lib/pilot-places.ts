import { db } from '@/lib/supabase/server-db'
import { PILOT_BAND, PILOT_PLACES } from './pilot'

// Requests that never use up a place (Justin, 21 October 2026). His own test
// on 7 October made the page say "4 of 5" with no school behind it, so a
// request from the founder's own addresses, or the app's own sender, or one
// whose school or contact is plainly a test, is left out of the count. The
// row stays in the table; it just is not a school. FOUNDER_NOTIFY_EMAIL is
// the same value the parent app's cron mails the leads to; the others are the
// addresses Justin has tested from.
const OWN_ADDRESSES = new Set(
  [
    process.env.FOUNDER_NOTIFY_EMAIL,
    'justin@thesocialbillboard.com', // legal-ok: an internal allowlist, never rendered to a school
    'j31phillips@gmail.com',
    'hello@guidedchildhood.com',
  ]
    .filter((a): a is string => !!a)
    .map((a) => a.trim().toLowerCase()),
)
const TEST_NAMES = new Set(['test', 'tester', 'testing'])

type PilotRow = { email: string | null; school_name: string | null; contact_name: string | null }

function isTest(row: PilotRow): boolean {
  const email = (row.email ?? '').trim().toLowerCase()
  const school = (row.school_name ?? '').trim().toLowerCase()
  const contact = (row.contact_name ?? '').trim().toLowerCase()
  return OWN_ADDRESSES.has(email) || TEST_NAMES.has(school) || TEST_NAMES.has(contact)
}

/** How many of the pilot places are still open. Counted from the requests
 *  themselves, through the server only client, so the page can say "3 of 5"
 *  and mean it. Tests and the founder's own requests do not count. Null when
 *  the count cannot be read, and the page then says nothing rather than
 *  something wrong. */
export async function pilotPlacesLeft(): Promise<number | null> {
  try {
    const { data, error } = await db
      .schema('schools')
      .from('invoice_requests')
      .select('email, school_name, contact_name')
      .eq('band', PILOT_BAND)
    if (error || !data) return null
    const taken = (data as PilotRow[]).filter((row) => !isTest(row)).length
    return Math.max(0, PILOT_PLACES - taken)
  } catch {
    return null
  }
}
