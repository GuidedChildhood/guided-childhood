import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail, emailConfigured } from '@/lib/email'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

// A parent asks DiGi for a script we do not have yet, in their own words. We log
// it so the founder sees real demand in the insights dashboard and can write the
// next script from what parents actually need. The closest existing script we
// pointed them at is stored too, so patterns are easy to read.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { problem, matchedSortOrder } = await request.json().catch(() => ({}))
  const p = typeof problem === 'string' ? problem.trim() : ''
  if (p.length < 4) return NextResponse.json({ error: 'Tell DiGi a little more' }, { status: 400 })

  const { error } = await supabase.from('script_requests').insert({
    user_id: user.id,
    problem: p.slice(0, 1000),
    matched_sort_order: typeof matchedSortOrder === 'number' ? matchedSortOrder : null,
  })
  if (error) return NextResponse.json({ error: 'Could not send' }, { status: 500 })

  // Tell the founder a parent asked for a script, so real demand is never
  // missed. Best effort, and it never blocks the parent's request.
  if (emailConfigured()) {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
    try {
      await sendEmail({
        to: FOUNDER_EMAIL,
        subject: 'A parent asked DiGi for a script',
        html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A2E">
          <p>A parent could not find a script and asked DiGi for one:</p>
          <p style="font-size:17px;font-weight:700">&ldquo;${p.replace(/</g, '&lt;').slice(0, 400)}&rdquo;</p>
          <p><a href="${origin}/dashboard/insights" style="color:#C29018;font-weight:700">See it in the insights board</a>, where you can write it in a couple of minutes.</p>
        </div>`,
      })
    } catch { /* email is best effort */ }
  }

  return NextResponse.json({ ok: true })
}
