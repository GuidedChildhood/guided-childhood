import { createHash } from 'crypto'

// THE SCHOOL FUNNEL IN MAILCHIMP (12 November 2026).
//
// Justin: "when a school signs up for pilot they need to be added to mail
// chimp school funnel". The pilot form on the schools site only writes a row
// (schools.invoice_requests, band 'pilot'); the cron that already emails
// Justin and the school (app/api/cron/invoice-requests) now also hands the
// contact to Mailchimp, here.
//
// WHAT IT SENDS. The contact's email, first name, last name and school, and
// one tag. Mailchimp starts the school funnel journey from the tag, so the
// journey is built and changed in Mailchimp, never in this code.
//
// IDEMPOTENT. A member is written with PUT on the hash of the lower case
// address, so a second call updates the same person rather than adding a
// duplicate, and a tag already on a member is a no op.
//
// OFF UNTIL CONFIGURED, AND IT NEVER STOPS AN EMAIL. With any of the three
// settings missing it returns { skipped } and does nothing. A Mailchimp error
// is returned, logged by the caller, and never thrown: the confirmation to the
// school and the note to Justin matter more than the funnel.
//
// Settings (Vercel, the parent app project):
//   MAILCHIMP_API_KEY            the key, ending in its data centre, e.g. -us21
//   MAILCHIMP_SCHOOLS_AUDIENCE_ID  the audience the school funnel runs in
//   MAILCHIMP_SCHOOLS_PILOT_TAG    optional, the tag that starts the journey
//                                  (default "School pilot")

export type FunnelResult = { ok: true } | { ok: false; error: string } | { skipped: string }

export const DEFAULT_PILOT_TAG = 'School pilot'

/** The data centre is the part of the key after the last dash: "abc-us21" is us21. */
export function dataCentre(key: string): string | null {
  const dc = key.split('-').pop() ?? ''
  return /^[a-z]{2}\d{1,3}$/.test(dc) ? dc : null
}

/** Mailchimp's member id: the md5 of the lower case address. */
export function memberHash(email: string): string {
  return createHash('md5').update(email.trim().toLowerCase()).digest('hex')
}

/** "Jo Bloggs Smith" is first "Jo", last "Bloggs Smith". One word is a first name. */
export function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}

export async function addSchoolToFunnel(contact: {
  email: string
  contactName: string
  schoolName: string
  tag?: string
}): Promise<FunnelResult> {
  const key = (process.env.MAILCHIMP_API_KEY ?? '').trim()
  const list = (process.env.MAILCHIMP_SCHOOLS_AUDIENCE_ID ?? '').trim()
  const tag = (contact.tag ?? process.env.MAILCHIMP_SCHOOLS_PILOT_TAG ?? DEFAULT_PILOT_TAG).trim()
  if (!key || !list) return { skipped: 'Mailchimp is not configured for schools' }
  const dc = dataCentre(key)
  if (!dc) return { ok: false, error: 'MAILCHIMP_API_KEY does not end in a data centre such as -us21' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) return { ok: false, error: 'not an email address' }

  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${encodeURIComponent(list)}/members/${memberHash(contact.email)}`
  const headers = { Authorization: `Basic ${Buffer.from(`anystring:${key}`).toString('base64')}`, 'Content-Type': 'application/json' }
  const { first, last } = splitName(contact.contactName)

  try {
    const put = await fetch(base, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        email_address: contact.email.trim(),
        status_if_new: 'subscribed',
        merge_fields: { FNAME: first, LNAME: last, SCHOOL: contact.schoolName.slice(0, 255) },
      }),
    })
    // An audience without a SCHOOL field refuses the whole write. Write it
    // again with the names alone rather than lose the contact.
    if (put.status === 400) {
      const retry = await fetch(base, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ email_address: contact.email.trim(), status_if_new: 'subscribed', merge_fields: { FNAME: first, LNAME: last } }),
      })
      if (!retry.ok) return { ok: false, error: `Mailchimp refused the contact: HTTP ${retry.status}` }
    } else if (!put.ok) {
      return { ok: false, error: `Mailchimp refused the contact: HTTP ${put.status}` }
    }
    if (tag) {
      const tagged = await fetch(`${base}/tags`, { method: 'POST', headers, body: JSON.stringify({ tags: [{ name: tag, status: 'active' }] }) })
      if (!tagged.ok) return { ok: false, error: `Mailchimp added the contact but refused the tag: HTTP ${tagged.status}` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Mailchimp could not be reached' }
  }
}
