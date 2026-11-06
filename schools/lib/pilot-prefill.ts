import { db } from '@/lib/supabase/server-db'
import { PILOT_BAND } from './pilot'

// THE PILOT'S LICENCE LINK, RESOLVED ON THE SERVER (6 November 2026).
//
// The pilot confirmation email ends with "turn the pilot into a licence", a
// link here with the invoice form already filled in. It used to carry the
// school name, the contact's name and their email in the query string, and a
// URL is not a private place: request logs, analytics, browser history on a
// shared staff room machine, the Referer of the next request (the funnel
// audit, fix 8). Now it carries ?pilot=<token>, the row's random
// prefill_token (migration 387), and this looks the row up.
//
// Three rules, because this hands a name and an email to whoever holds a link:
// the token must be the exact shape we mint (anything else never reaches the
// database), only pilot rows answer (the only letter that carries the link),
// and only the three fields the form needs come back. Every failure is an
// empty form, never an error page: the head can still type their details.

export type Prefill = { school_name?: string; contact_name?: string; email?: string }

const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

/** The shape check on its own, exported for the test. */
export function isPrefillToken(raw: unknown): raw is string {
  return typeof raw === 'string' && TOKEN.test(raw)
}

export async function pilotPrefill(raw: string | string[] | undefined): Promise<Prefill> {
  const token = Array.isArray(raw) ? raw[0] : raw
  if (!isPrefillToken(token)) return {}
  try {
    const { data, error } = await db
      .schema('schools')
      .from('invoice_requests')
      .select('school_name, contact_name, email')
      .eq('prefill_token', token)
      .eq('band', PILOT_BAND)
      .limit(1)
      .maybeSingle()
    if (error || !data) return {}
    return {
      school_name: String(data.school_name ?? '').slice(0, 200) || undefined,
      contact_name: String(data.contact_name ?? '').slice(0, 120) || undefined,
      email: String(data.email ?? '').slice(0, 200) || undefined,
    }
  } catch {
    return {}
  }
}
