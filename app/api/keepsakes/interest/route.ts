import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailConfigured } from '@/lib/email'

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

  // Whether the interest actually survived this request, in either of the two
  // places it can live. A signup that lands in neither is lost, and the parent
  // must not be told they are on a list that does not have them on it.
  let stored = false
  let notified = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('keepsake_interest').insert({
      user_id: user?.id ?? null,
      email,
      item,
      child_name: childName,
      note,
    })
    if (error) {
      // Almost always a missing table before migration 097. Logged rather than
      // swallowed, because until now this failed in total silence.
      console.error('[keepsakes/interest] row not stored', error.message)
    } else {
      stored = true
    }
  } catch (err) {
    console.error('[keepsakes/interest] row not stored', err)
  }

  // Tell the founder. An interest that lands only in a table nobody opens is
  // an interest nobody acts on.
  const founder = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'
  if (!emailConfigured()) {
    // No RESEND_API_KEY means no email leaves this deployment, at all, for
    // anything. Worth saying out loud here: a keepsake signup that reaches
    // nobody looks identical to one that worked.
    console.error('[keepsakes/interest] RESEND_API_KEY is not set, so no notification was sent')
  }
  // sendEmail never throws: it RETURNS { ok, error }. So a try/catch around it
  // catches nothing, and treating a set API key as proof of delivery is how a
  // send that Resend rejected (an unverified from domain is the usual one) has
  // been reading as a success. Read the result instead, and log the reason.
  const sent = await sendEmail({
    to: founder,
    subject: `Keepsake interest: ${ITEM_LABEL[item] ?? item}`,
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1A1A2E">
      <p>A family registered interest in a coming soon keepsake.</p>
      <p><strong>Wants:</strong> ${ITEM_LABEL[item] ?? item}<br/>
      <strong>Email:</strong> ${email}${childName ? `<br/><strong>Child:</strong> ${childName}` : ''}${note ? `<br/><strong>Note:</strong> ${note}` : ''}</p>
      <p style="color:#8a8a9a;font-size:13px">Sent from the keepsakes coming soon form.</p>
    </div>`,
    kind: 'operational',
  })
  notified = sent.ok
  if (!sent.ok) console.error('[keepsakes/interest] notification not sent:', sent.error)

  // Stored or notified is enough: either one means someone can act on it. If
  // both failed the interest is genuinely gone, so say so rather than show a
  // warm confirmation for something that did not happen.
  if (!stored && !notified) {
    return NextResponse.json({ error: 'not recorded' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, stored, notified })
}
