import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Test the letterbox. Proves the platform side of the school email
// pipeline is alive: it pushes a synthetic Gmail confirmation email
// through the real inbound webhook (with the shared secret and a test
// flag so nothing is saved and no reminders are created), and reports
// whether the webhook resolved this family's private address and read
// the code. If this passes but real Gmail codes never appear, the
// confirmation email is simply not reaching us, which is the MX record
// on the forwarding domain, not the app.

const INBOUND_DOMAIN = process.env.SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.com'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: conn } = await supabase
    .from('school_connections')
    .select('forward_token, active')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!conn) {
    return NextResponse.json({ ok: false, stage: 'connection', message: 'Create your address first, then run the test.' })
  }
  if (!conn.active) {
    return NextResponse.json({ ok: false, stage: 'paused', message: 'This connection is paused. Resume it, then run the test.' })
  }

  const secret = process.env.SCHOOL_INBOUND_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, stage: 'config', message: 'The inbound secret is not set on the server. Tell Claude to check SCHOOL_INBOUND_SECRET.' })
  }

  const forwardAddress = `school+${conn.forward_token}@${INBOUND_DOMAIN}`
  const synthetic = {
    test: true,
    to: forwardAddress,
    from: 'forwarding-noreply@google.com',
    subject: 'Guided Childhood letterbox test',
    text: 'This is a test. Confirmation code: 123456789 . https://mail-settings.google.com/mail/test-only-not-a-real-link',
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  try {
    const res = await fetch(`${origin}/api/school/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-inbound-secret': secret },
      body: JSON.stringify(synthetic),
    })
    const data = await res.json().catch(() => ({}))

    if (res.status === 401) {
      return NextResponse.json({ ok: false, stage: 'auth', message: 'The webhook rejected the test. The inbound secret does not match.' })
    }
    if (data.resolvedToken && data.codeFound) {
      return NextResponse.json({ ok: true, stage: 'done', message: 'The platform is ready. It received a test email and read the code. If your real Gmail code still does not appear, the confirmation email is not reaching us, which is the forwarding domain MX record, not the app.' })
    }
    if (data.resolvedToken === false) {
      return NextResponse.json({ ok: false, stage: 'token', message: 'The webhook could not match your private address. Tell Claude, this is a token or domain mismatch.' })
    }
    return NextResponse.json({ ok: false, stage: 'parse', message: 'The webhook received the test but could not read the code. Tell Claude to check the code parsing.' })
  } catch {
    return NextResponse.json({ ok: false, stage: 'unreachable', message: 'Could not reach the inbound webhook from the server. Check the app URL and that the route is deployed.' })
  }
}
