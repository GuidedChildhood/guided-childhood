'use server'

import { db as anon } from '@/lib/supabase/server-db'

// The taster letterbox: a teacher who has just watched the sample lesson and
// wants the printable pack that goes with it.
//
// SAME TABLE, no migration. /draw established the pattern on 2 September: a
// lead who is not buying goes into schools.invoice_requests (insert only RLS,
// migration 195) with a marker band and the PO field carrying a word rather
// than a number, so the parent app's hourly cron emails Justin the lead
// exactly as it emails an order. A taster lead is the same shape.
//
// NO PURCHASE ORDER, and that is the point of this existing at all. The
// invoice form asks for a PO because finance bounces an invoice without one,
// which is correct at the bottom of the funnel and fatal at the top: a
// teacher browsing on their phone has a school email and no PO, and asking
// for one is asking them to leave.

export type TasterLeadResult = { ok: true } | { ok: false; error: string }

export async function captureTasterLead(formData: FormData): Promise<TasterLeadResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()

  const schoolName = field('school_name').slice(0, 200)
  const contactName = field('contact_name').slice(0, 120)
  const email = field('email').slice(0, 200)
  const role = field('role').slice(0, 80)
  const moduleId = field('module_id').slice(0, 120)

  if (!schoolName || !contactName) {
    return { ok: false, error: 'Your name and your school are both needed, so we know who the pack is going to.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the pack goes, so it needs to be exact.' }
  }

  const { error } = await anon.schema('schools').from('invoice_requests').insert({
    school_name: schoolName,
    band: 'taster',
    pupil_count: null,
    contact_name: contactName,
    email,
    po_number: 'TASTER',
    notes: `Sample lesson taster${role ? ` · ${role}` : ''}${moduleId ? ` · ${moduleId}` : ''}`,
  })

  if (error) {
    return { ok: false, error: 'That did not save. Nothing is lost: email hello@guidedchildhood.com and we will send the pack by hand.' }
  }
  return { ok: true }
}
