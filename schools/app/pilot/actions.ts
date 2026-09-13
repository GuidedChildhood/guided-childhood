'use server'

import { db as letterbox } from '@/lib/supabase/server-db'
import { PILOT_BAND } from '@/lib/pilot'

// THE PILOT LETTERBOX. The same table as an invoice request, the taster and
// the draw (schools.invoice_requests, migration 195), with band 'pilot' and
// the PO field carrying a word, because the parent app's cron reads that
// table, emails Justin the lead and, since migration 299, emails the school
// its own confirmation. No email code in this app by design (wiring check 7).
//
// No purchase order, no pupil count: a pilot is a conversation, not an order,
// and the form asks for what a head can answer on a phone between lessons.

export type PilotRequestResult = { ok: true } | { ok: false; error: string }

const PHASES = new Set(['primary', 'secondary', 'all_through', 'post16', ''])
const STARTS = new Set(['this_term', 'next_term', 'not_sure', ''])

export async function requestPilot(formData: FormData): Promise<PilotRequestResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()

  const schoolName = field('school_name').slice(0, 200)
  const contactName = field('contact_name').slice(0, 120)
  const role = field('role').slice(0, 80)
  const email = field('email').slice(0, 200)
  const phase = field('phase')
  const start = field('start')
  const message = field('message').slice(0, 1000)

  if (!schoolName || !contactName) {
    return { ok: false, error: 'Your name and your school are both needed, so we know who the code is for.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the code goes, so it needs to be exact.' }
  }
  if (!PHASES.has(phase) || !STARTS.has(start)) {
    return { ok: false, error: 'Pick the phase and the start that fit, or leave them blank.' }
  }

  const PHASE_WORDS: Record<string, string> = { primary: 'Primary', secondary: 'Secondary', all_through: 'All through', post16: 'Sixth form or college' }
  const START_WORDS: Record<string, string> = { this_term: 'this term', next_term: 'next term', not_sure: 'start not decided' }
  const notes = ['Pilot request', role, PHASE_WORDS[phase], START_WORDS[start], message].filter(Boolean).join(' · ')

  const { error } = await letterbox.schema('schools').from('invoice_requests').insert({
    school_name: schoolName,
    band: PILOT_BAND,
    pupil_count: null,
    contact_name: contactName,
    email,
    po_number: 'PILOT',
    notes,
  })

  if (error) {
    return { ok: false, error: 'That did not save. Nothing is lost: email hello@guidedchildhood.com with your school and we will set the pilot up by hand.' }
  }
  return { ok: true }
}
