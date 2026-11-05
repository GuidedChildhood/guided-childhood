'use server'

import { db as letterbox } from '@/lib/supabase/server-db'
import { WORKSHOPS, WORKSHOP_BAND } from '@/lib/workshops'

// THE WORKSHOP LETTERBOX. The same table as the pilot and the invoice
// requests (schools.invoice_requests, migration 195), with band 'workshop',
// because the parent app's cron already reads that table, emails Justin the
// lead and sends the school its own confirmation. No email code in this app
// by design (wiring check 7). The answers that have no column of their own
// (which workshops, year groups, dates, how, a parent session, quote or
// call) go into notes, the way the pilot form does it, so Justin reads the
// whole enquiry in one email.

export type WorkshopEnquiryResult = { ok: true } | { ok: false; error: string }

const MODES = new Set(['in_person', 'online', ''])
const NEXT = new Set(['quote', 'call', ''])

export async function requestWorkshop(formData: FormData): Promise<WorkshopEnquiryResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()

  const schoolName = field('school_name').slice(0, 200)
  const contactName = field('contact_name').slice(0, 120)
  const email = field('email').slice(0, 200)
  const role = field('role').slice(0, 80)
  const phone = field('phone').slice(0, 40)
  const postcode = field('postcode').slice(0, 12).toUpperCase()
  const years = field('years').slice(0, 120)
  const dates = field('dates').slice(0, 300)
  const mode = field('mode')
  const next = field('next')
  const parent = field('parent') === 'yes'
  const message = field('message').slice(0, 1000)
  const pupilsRaw = field('pupils')
  const pupils = pupilsRaw ? Number.parseInt(pupilsRaw, 10) : null
  const chosen = WORKSHOPS.filter(w => formData.getAll('workshop').map(String).includes(w.id))

  if (!schoolName || !contactName) {
    return { ok: false, error: 'Your name and your school are both needed, so Justin knows who to reply to.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the reply goes, so it needs to be exact.' }
  }
  if (chosen.length === 0) {
    return { ok: false, error: 'Pick at least one workshop, or the one closest to what you have in mind.' }
  }
  if (!MODES.has(mode) || !NEXT.has(next)) {
    return { ok: false, error: 'Pick how you would like it delivered and what you would like back, or leave them blank.' }
  }
  if (pupils !== null && (!Number.isFinite(pupils) || pupils < 1 || pupils > 5000)) {
    return { ok: false, error: 'The number of pupils should be a whole number, roughly is fine.' }
  }

  const MODE_WORDS: Record<string, string> = { in_person: 'In person', online: 'Online' }
  const NEXT_WORDS: Record<string, string> = { quote: 'Wants a quote', call: 'Wants an intro call' }
  const notes = [
    'Workshop enquiry',
    chosen.map(w => `${w.years}: ${w.title}`).join(' + '),
    years && `Year groups: ${years}`,
    dates && `Dates: ${dates}`,
    MODE_WORDS[mode],
    parent && 'Add a parent session',
    NEXT_WORDS[next],
    role,
    postcode && `Postcode ${postcode}`,
    phone && `Phone ${phone}`,
    message,
  ].filter(Boolean).join(' · ')

  const { error } = await letterbox.schema('schools').from('invoice_requests').insert({
    school_name: schoolName,
    band: WORKSHOP_BAND,
    pupil_count: pupils,
    contact_name: contactName,
    email,
    po_number: 'WORKSHOP',
    notes: notes.slice(0, 2000),
  })

  if (error) {
    return { ok: false, error: 'That did not save. Nothing is lost: email hello@guidedchildhood.com with your school and the workshop you would like, and Justin will reply by hand.' }
  }
  return { ok: true }
}
