import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

// A parent registering interest in a real world keepsake: a printed passport, a
// set of Planet Friend charms, or both. Best effort, exactly like the starter
// lead capture: a failure never blocks the page, and the table (migration 097)
// may not exist yet in every environment, so a missing table is treated as a
// quiet no op rather than an error the parent ever sees.
//
// The row is only half the point: an interest nobody sees is an interest nobody
// acts on. So the moment one lands we also email it to the founder, and the
// email is the durable copy, sent even when the table is missing, so a coming
// soon signup reaches a person rather than sitting in a table no one reads.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ITEMS = new Set(['printed_passport', 'charm_set', 'both'])

const ITEM_LABEL: Record<string, string> = {
  printed_passport: 'The printed passport',
  charm_set: 'The Planet Friend keepsakes (charms, plush and the magnetic star chart)',
  both: 'Both the passport and the keepsakes',
}

export async function POST(req: NextRequest) {
  let body: { email?: string; item?: string; childName?: string; note?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const item = typeof body.item === 'string' ? body.item : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }
  if (!ITEMS.has(item)) return NextResponse.json({ error: 'invalid item' }, { status: 400 })

  const childName = typeof body.childName === 'string' ? body.childName.slice(0, 80) : null
  const note = typeof body.note === 'string' ? body.note.slice(0, 500) : null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('keepsake_interest').insert({
      user_id: user?.id ?? null,
      email,
      item,
      child_name: childName,
      note,
    })
    // A missing table or any write error is a quiet no op for the parent. It
    // does not stop the email below, which is the copy that actually reaches
    // someone.
  } catch { /* the row is best effort, the email is the real notification */ }

  // Tell the founder, always. This is the notification that was missing: an
  // interest used to land only in a table nobody opens, so a coming soon
  // signup never reached a person. Best effort, so a mail failure never turns
  // the parent's warm confirmation into an error.
  const founder = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'
  try {
    await sendEmail({
      to: founder,
      subject: `Keepsake interest: ${ITEM_LABEL[item] ?? item}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1A1A2E">
        <p>A family registered interest in a coming soon keepsake.</p>
        <p><strong>Wants:</strong> ${ITEM_LABEL[item] ?? item}<br/>
        <strong>Email:</strong> ${email}${childName ? `<br/><strong>Child:</strong> ${childName}` : ''}${note ? `<br/><strong>Note:</strong> ${note}` : ''}</p>
        <p style="color:#8a8a9a;font-size:13px">Sent from the keepsakes coming soon form.</p>
      </div>`,
    })
  } catch { /* never block the parent on our own notification */ }

  return NextResponse.json({ ok: true })
}
