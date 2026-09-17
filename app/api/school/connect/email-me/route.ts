import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailConfigured, unsubscribeUrl } from '@/lib/email'
import { schoolLetterboxEmail } from '@/lib/email/templates'

// Send the parent their own letterbox address.
//
// THE REASON THIS ROUTE EXISTS.
//
// Setup was failing at a step that has nothing to do with understanding the
// feature: moving a random nineteen character address from our screen into the
// Gmail app. On a phone that is app switching, a paste that drops, and a typo
// nobody can see. Copy to clipboard helps on a laptop and barely helps on a
// phone, which is where parents actually open this.
//
// Emailing it to them turns the hard step into a step they have done a
// thousand times: open your inbox, hit forward. It also puts the address on
// every device they own without asking them to do anything on the others.
//
// Transactional on purpose. They pressed the button ten seconds ago and are
// waiting for it, so the six day programme floor must not hold it and
// suppression must not eat it.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: conn } = await supabase
    .from('school_connections')
    .select('forward_token')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!conn) {
    return NextResponse.json({ ok: false, message: 'Create your address first.' }, { status: 400 })
  }

  if (!emailConfigured()) {
    // Said plainly rather than as a success, because a parent who is told it is
    // sent and then waits at an empty inbox has been given a worse problem than
    // the one they started with.
    return NextResponse.json({ ok: false, message: 'Email is not set up on this server yet. Copy the address instead.' })
  }

  const domain = process.env.SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.com'
  const forwardAddress = `school+${conn.forward_token}@${domain}`
  const mail = schoolLetterboxEmail({ forwardAddress, unsubscribe: unsubscribeUrl(user.id) })

  const res = await sendEmail({
    to: user.email,
    subject: mail.subject,
    html: mail.html,
    kind: 'transactional',
    key: 'school-letterbox-address',
  })

  if (!res.ok) {
    return NextResponse.json({ ok: false, message: 'That did not send. Copy the address instead.' })
  }
  // The address is echoed back so the screen can name the inbox it went to
  // without a second round trip.
  return NextResponse.json({ ok: true, sentTo: user.email })
}
