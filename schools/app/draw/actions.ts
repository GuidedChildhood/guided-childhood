'use server'

import { anon } from '@/lib/supabase/anon'

// The free class pack draw: the letterbox for a school that is not buying
// yet. From the Happy Newspaper teardown (design-refs/happy-newspaper-notes.md):
// any UK school can sign up, a draw each term, and the winner's class gets
// a free pack. Same table as the invoice request (schools.invoice_requests,
// insert only, migration 195), with band "draw" and the PO field carrying
// the word DRAW, so the parent app's hourly cron emails Justin the entry
// exactly as it does an order, and no new table or migration is needed.

export type DrawResult = { ok: true } | { ok: false; error: string }

export async function enterDraw(formData: FormData): Promise<DrawResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()
  const schoolName = field('school_name').slice(0, 200)
  const contactName = field('contact_name').slice(0, 120)
  const email = field('email').slice(0, 200)
  const yearGroup = field('year_group').slice(0, 60)
  const pupilCountRaw = Number(field('pupil_count'))
  const pupilCount = Number.isFinite(pupilCountRaw) && pupilCountRaw > 0 && pupilCountRaw < 100000 ? Math.round(pupilCountRaw) : null

  if (!schoolName || !contactName) {
    return { ok: false, error: 'School name and your name are both needed, so we know who to send the pack to.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the good news goes, so it needs to be exact.' }
  }

  const { error } = await anon.schema('schools').from('invoice_requests').insert({
    school_name: schoolName,
    band: 'draw',
    pupil_count: pupilCount,
    contact_name: contactName,
    email,
    po_number: 'DRAW',
    notes: `Free class pack draw entry${yearGroup ? ` · ${yearGroup}` : ''}`,
  })
  if (error) {
    return { ok: false, error: 'The entry did not save. Nothing is lost: email hello@guidedchildhood.com with your school name and we will put you in by hand.' }
  }
  return { ok: true }
}
