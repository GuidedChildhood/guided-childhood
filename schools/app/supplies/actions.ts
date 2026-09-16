'use server'

import { db as anon } from '@/lib/supabase/server-db'

// The supplies letterbox (migration 302). A school asking for printed
// passport books and sticker sheets for its classes.
//
// A QUOTE, NOT AN ORDER, and every decision here follows from that. No
// price is shown, no purchase order is demanded, nothing is charged. There
// is no supplier and no landed cost yet, and a price on a school page is a
// promise finance will hold us to. So this collects what a quote needs and
// Justin replies with a number.
//
// Same shape as every other schools form: insert through the anon key, the
// parent app's cron emails Justin (wiring check 7 keeps email, payment and
// auth code out of this app). A letterbox row survives an email outage
// where a fire and forget send does not.
//
// NOTHING ABOUT A PUPIL. No child name, no class list. The address is the
// school's, because the box goes to the school.

export type SupplyRequestResult = { ok: true } | { ok: false; error: string }

const WANTS = new Set(['books', 'stickers', 'both'])

export async function requestSupplies(formData: FormData): Promise<SupplyRequestResult> {
  const field = (name: string) => String(formData.get(name) ?? '').trim()

  const schoolName = field('school_name').slice(0, 200)
  const contactName = field('contact_name').slice(0, 120)
  const email = field('email').slice(0, 200)
  const want = field('want')
  const keyStages = field('key_stages').slice(0, 200)
  const deliveryAddress = field('delivery_address').slice(0, 500)
  const poNumber = field('po_number').slice(0, 80)
  const notes = field('notes').slice(0, 1000)

  // A count is a number or it is nothing. A zero is not an order and a
  // typo of "thirty" is not a quantity, so both become null and the notes
  // field carries anything we could not read.
  const count = (name: string) => {
    const n = Number(field(name))
    return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n) : null
  }
  const bookCount = count('book_count')
  const stickerCount = count('sticker_count')

  if (!schoolName || !contactName) {
    return { ok: false, error: 'Your name and your school are both needed, so we know who the quote is for.' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'That email address does not look right. It is where the quote goes, so it needs to be exact.' }
  }
  if (!WANTS.has(want)) {
    return { ok: false, error: 'Pick what you need: books, stickers, or both.' }
  }
  if (want !== 'stickers' && !bookCount) {
    return { ok: false, error: 'How many books? A rough number is fine, we are quoting rather than shipping.' }
  }
  if (want !== 'books' && !stickerCount) {
    return { ok: false, error: 'How many sticker sheets? A rough number is fine, we are quoting rather than shipping.' }
  }

  const { error } = await anon.schema('schools').from('supply_requests').insert({
    school_name: schoolName,
    contact_name: contactName,
    email,
    want,
    key_stages: keyStages || null,
    book_count: want === 'stickers' ? null : bookCount,
    sticker_count: want === 'books' ? null : stickerCount,
    delivery_address: deliveryAddress || null,
    po_number: poNumber || null,
    notes: notes || null,
  })

  if (error) {
    return { ok: false, error: 'The request did not save. Nothing is lost: email hello@guidedchildhood.com with the same details and we will quote from there.' }
  }
  return { ok: true }
}
