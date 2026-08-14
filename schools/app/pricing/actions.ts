'use server'

import { anon } from '@/lib/supabase/anon'
import { PRICING_BANDS } from '@/lib/pricing'

// The invoice request letterbox. This posts a row through the anon key into
// schools.invoice_requests (insert only RLS, migration 195); the parent
// app's hourly cron emails Justin. Deliberately NOT an email send from
// here: the schools app carries no email, auth or payment code (wiring
// check 7), and a letterbox row survives an email outage where a fire and
// forget send does not.

export type InvoiceRequestResult = { ok: true } | { ok: false; error: string }

export async function requestInvoice(formData: FormData): Promise<InvoiceRequestResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()

  const schoolName = field('school_name').slice(0, 200)
  const band = field('band')
  const contactName = field('contact_name').slice(0, 120)
  const email = field('email').slice(0, 200)
  const poNumber = field('po_number').slice(0, 80)
  const notes = field('notes').slice(0, 1000)
  const pupilCountRaw = Number(field('pupil_count'))
  const pupilCount = Number.isFinite(pupilCountRaw) && pupilCountRaw > 0 && pupilCountRaw < 100000
    ? Math.round(pupilCountRaw)
    : null

  if (!schoolName || !contactName || !poNumber) {
    return { ok: false, error: 'School name, contact name and purchase order number are all needed. Finance will bounce an invoice without the PO.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the invoice goes, so it needs to be exact.' }
  }
  if (!PRICING_BANDS.some(b => b.key === band)) {
    return { ok: false, error: 'Pick the band that matches your school.' }
  }

  const { error } = await anon.schema('schools').from('invoice_requests').insert({
    school_name: schoolName,
    band,
    pupil_count: pupilCount,
    contact_name: contactName,
    email,
    po_number: poNumber,
    notes: notes || null,
  })

  if (error) {
    return { ok: false, error: 'The request did not save. Nothing is lost: email hello@guidedchildhood.com with the same details and we will raise the invoice from there.' }
  }
  return { ok: true }
}
