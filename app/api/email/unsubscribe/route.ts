import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unsubscribeToken } from '@/lib/email'

export const dynamic = 'force-dynamic'

// One click unsubscribe from the email footer. The HMAC token proves the
// link came from an email we sent to this account, no login needed.
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('u')
  const token = req.nextUrl.searchParams.get('k')

  if (!userId || !token || token !== unsubscribeToken(userId)) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  await supabase.from('profiles').update({ email_opt_out: true }).eq('id', userId)

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
