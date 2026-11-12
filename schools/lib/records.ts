import { cookies } from 'next/headers'
import type { Assessment, Delivery, Subject } from '@gc/shared/lesson-records'
import { ACCESS_COOKIE, tokenAccess } from './access'
import { LANGUAGES_COOKIE, languagesTokenAccess } from './languages-access'
import { db } from './supabase/server-db'

// THE SCHOOL'S RECORD, READ AND WRITTEN (10 November 2026).
//
// The one place that touches schools.lesson_records (migration 391). The
// rules about what a record may hold are in @gc/shared/lesson-records; this
// file is who is asking and the queries.
//
// WHO IS ASKING. There are no accounts, so a school is its access code, and
// the record is keyed by a pseudonym of that code. The browser never sends a
// school: recordsSchool() reads the signed cookie, checks it the way the
// proxy does (signature, expiry, still on the list), and derives the
// pseudonym. A page or action that has no school gets null and shows nothing.
// That is the whole of the isolation between schools, so nothing in this file
// takes a school_ref as a parameter from outside it.
//
// The French record hangs off the languages code and the digital record off
// the scheme code. They are different codes, so a school holding both has two
// pseudonyms, one per subject, and neither page reads the other's rows.
//
// SERVER ONLY, like the client it uses (lib/supabase/server-db.ts).

const enc = new TextEncoder()

/** The pseudonym a school's rows are kept under: an HMAC of its code under
 *  the access secret, 32 hex characters. Not the 8 character share ref
 *  (shared/parent-share.ts): that one goes home on a link and is short for
 *  that reason, and two schools sharing a record would be a leak. */
async function refOf(subject: Subject, code: string): Promise<string | null> {
  const secret = (process.env.SCHOOLS_ACCESS_SECRET || '').trim()
  const clean = code.trim().toLowerCase()
  if (!secret || !clean) return null
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`records:${subject === 'digital' ? 'scheme' : 'languages'}:${clean}`))
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}

/** The school behind this request for one subject, as its pseudonym, or null. */
export async function recordsSchool(subject: Subject): Promise<string | null> {
  const store = await cookies()
  if (subject === 'digital') {
    const token = store.get(ACCESS_COOKIE)?.value
    if (!token || !(await tokenAccess(token))) return null
    return refOf('digital', token.split('|')[0] ?? '')
  }
  const token = store.get(LANGUAGES_COOKIE)?.value
  const access = await languagesTokenAccess(token)
  if (!token || !access?.langs.includes(subject)) return null
  // lang|code|expires|signature, read only after the signature was checked.
  return refOf(subject, token.split('|')[1] ?? '')
}

type Row = {
  id: string
  subject: Subject
  lesson_key: string
  delivered_on: string
  academic_year: string
  groups: string[]
  assessment: Assessment
  objective_marks: Record<string, unknown> | null
  note: string | null
  created_at: string
}

const COLUMNS = 'id, subject, lesson_key, delivered_on, academic_year, groups, assessment, objective_marks, note, created_at'

const toDelivery = (r: Row): Delivery => ({
  id: r.id,
  subject: r.subject,
  lessonKey: r.lesson_key,
  deliveredOn: r.delivered_on,
  academicYear: r.academic_year,
  groups: r.groups ?? [],
  assessment: r.assessment,
  marks: r.objective_marks ?? {},
  note: r.note,
  createdAt: r.created_at,
})

export type RecordsRead = { school: boolean; deliveries: Delivery[]; failed: boolean }

/** This school's live deliveries for one subject and academic year, oldest
 *  first. `school` is false when nobody with a code is asking; `failed` is
 *  true when the database did not answer, so a page can say the record could
 *  not be read rather than show an empty one as if nothing had been taught. */
export async function readDeliveries(subject: Subject, academicYear: string, lessonKey?: string): Promise<RecordsRead> {
  const ref = await recordsSchool(subject)
  if (!ref) return { school: false, deliveries: [], failed: false }
  let q = db.from('lesson_records').select(COLUMNS)
    .eq('school_ref', ref).eq('subject', subject).eq('academic_year', academicYear).eq('status', 'delivered')
  if (lessonKey) q = q.eq('lesson_key', lessonKey)
  const { data, error } = await q.order('delivered_on', { ascending: true }).order('created_at', { ascending: true }).limit(2000)
  if (error) {
    console.error('[records] read failed:', error.message)
    return { school: true, deliveries: [], failed: true }
  }
  return { school: true, deliveries: ((data ?? []) as Row[]).map(toDelivery), failed: false }
}

/** The academic years this school has a record in for one subject, newest
 *  first, always including the current one, so a page can offer last year's
 *  record without inventing years. Empty when nobody with a code is asking. */
export async function recordYears(subject: Subject, current: string): Promise<string[]> {
  const ref = await recordsSchool(subject)
  if (!ref) return []
  const { data, error } = await db.from('lesson_records').select('academic_year')
    .eq('school_ref', ref).eq('subject', subject).eq('status', 'delivered').limit(5000)
  if (error) return [current]
  const years = new Set<string>([current])
  for (const r of (data ?? []) as { academic_year: string }[]) if (/^\d{4}-\d{2}$/.test(r.academic_year)) years.add(r.academic_year)
  return [...years].sort().reverse()
}

/** One delivery, only if it belongs to the given school. */
export async function readOwnDelivery(ref: string, id: string): Promise<Delivery | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null
  const { data } = await db.from('lesson_records').select(COLUMNS)
    .eq('id', id).eq('school_ref', ref).eq('status', 'delivered').maybeSingle()
  return data ? toDelivery(data as Row) : null
}

export { db as recordsDb }
