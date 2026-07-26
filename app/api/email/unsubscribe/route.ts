import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unsubscribeToken, leadUnsubscribeToken } from '@/lib/email'

export const dynamic = 'force-dynamic'

// One click unsubscribe from the email footer. The HMAC token proves the
// link came from an email we sent, no login needed.
//
// Two kinds of recipient, one door. ?u is an account, and opts the profile out.
// ?e is someone who gave us their email before they had an account, and stops
// the pre sign up sequence. That second case is the one that matters: a parent
// who downloaded a printable with one address and then joined with another was
// still being sold the thing they had already bought, with only a mailto to
// stop it.
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('u')
  const leadEmail = req.nextUrl.searchParams.get('e')
  const token = req.nextUrl.searchParams.get('k')

  const validAccount = !!userId && !!token && token === unsubscribeToken(userId)
  const addr = leadEmail?.trim().toLowerCase() ?? ''
  const validLead = !!addr && !!token && token === leadUnsubscribeToken(addr)

  if (!validAccount && !validLead) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  if (validAccount) {
    await supabase.from('profiles').update({ email_opt_out: true }).eq('id', userId!)
  } else {
    await supabase
      .from('starter_leads').update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', addr).is('unsubscribed_at', null)
    // If that address also has an account, stop those too. Someone clicking
    // stop means stop, not stop one of the two lists they did not know about.
    await supabase.from('profiles').update({ email_opt_out: true }).eq('email', addr)
  }

  return new NextResponse(
    `<!doctype html><html><body style="margin:0;background:#F9F8F6;font-family:Nunito,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
      <div style="max-width:420px;background:#fff;border:1px solid #EAEAF0;border-radius:20px;padding:40px 32px;text-align:center">
        <h1 style="font-size:22px;color:#1A1A2E;margin:0 0 12px">You are unsubscribed.</h1>
        <p style="font-size:15px;color:#52526A;line-height:1.6;margin:0">No more emails from us. Your account and everything in it stays exactly as it was.</p>
      </div>
    </body></html>`,
    { status: 200, headers: { 'content-type': 'text/html' } }
  )
}
