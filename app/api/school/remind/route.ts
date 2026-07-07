import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Called once a day, evening UK time, by Vercel Cron (see vercel.json).
// The never miss it promise: anything due tomorrow, whether DiGi caught
// it from a school email or the parent typed it in by hand, gets one
// push tonight while there is still time to pack the kit or sign the
// form, grouped into a single message per family, not one per item.

function ukTomorrow(): string {
  const uk = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  uk.setDate(uk.getDate() + 1)
  return uk.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const tomorrow = ukTomorrow()
  const { data: actions } = await supabase
    .from('school_actions')
    .select('user_id, title')
    .eq('status', 'open')
    .eq('due_date', tomorrow)

  const byUser = new Map<string, string[]>()
  for (const a of actions ?? []) {
    const list = byUser.get(a.user_id) ?? []
    list.push(a.title)
    byUser.set(a.user_id, list)
  }

  let sent = 0
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  for (const [userId, titles] of byUser) {
    const body = titles.length === 1
      ? `Tomorrow: ${titles[0]}. Sort it tonight while it is easy.`
      : `Tomorrow: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}. Sort tonight while it is easy.`
    try {
      const res = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId, title: 'From school, due tomorrow', body, url: '/dashboard' }),
      })
      const result = await res.json()
      if (result.sent > 0) sent++
    } catch { /* best effort */ }
  }

  return NextResponse.json({ families: byUser.size, sent, dueDate: tomorrow })
}
