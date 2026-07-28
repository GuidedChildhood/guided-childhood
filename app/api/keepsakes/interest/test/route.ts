import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailConfigured, EMAIL_FROM } from '@/lib/email'

// Does the keepsake notification actually reach anyone? A logged in self test,
// the same shape as /api/school/remind/test.
//
// The signup form says "You are on the list" whenever the row saved OR the
// email sent, so a working row and a dead mailer look exactly like a success
// from the outside. Finding out which used to mean a browser console or a
// Vercel log filter. This answers it in one tap, in words.

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const founder = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

  // No key means nothing leaves this deployment for anything, which on a
  // preview build is usually because the variable is ticked for Production
  // only. Worth saying in exactly those words rather than "send failed".
  if (!emailConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: 'no_key',
      to: founder,
      from: EMAIL_FROM,
      message: 'RESEND_API_KEY is not set on this deployment, so no email can leave it at all. On a preview URL that usually means the variable is ticked for Production only in Vercel.',
    })
  }

  // sendEmail returns { ok, error } rather than throwing, so the result has to
  // be read. Treating a set key as proof of delivery is exactly how a send
  // that Resend rejected has been reading as a success.
  const sent = await sendEmail({
    to: founder,
    subject: 'Test: keepsake interest notification',
    html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1A1A2E">
      <p>This is a test of the keepsake interest notification.</p>
      <p>If this arrived, a real signup on the coming soon form will reach you the same way.</p>
    </div>`,
  })

  return NextResponse.json({
    ok: sent.ok,
    reason: sent.ok ? 'sent' : 'rejected',
    to: founder,
    from: EMAIL_FROM,
    message: sent.ok
      ? `Resend accepted it and sent it to ${founder}. If it is not in the inbox within a minute, check spam and then the Resend dashboard.`
      : `Resend refused it: ${sent.error ?? 'no reason given'}. The usual cause is the from address domain not being verified.`,
  })
}
