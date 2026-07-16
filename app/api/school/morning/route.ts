import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// The morning nudge. The evening remind cron warns the night before; this one
// runs first thing (about 7:45 UK) and tells BOTH the parent and the child
// what is needed today, whether a one off due today or a weekly routine that
// lands on this weekday, so nobody is packing the kit at the door. One grouped
// message per family, to the parent's phone and to the child's, best effort.

function ukToday(): { dateStr: string; weekday: number } {
  const uk = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  return { dateStr: uk.toISOString().slice(0, 10), weekday: uk.getDay() }
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

  const { dateStr: today, weekday } = ukToday()

  const [{ data: dueToday }, { data: routines }] = await Promise.all([
    supabase.from('school_actions').select('user_id, title').eq('status', 'open').eq('due_date', today),
    supabase.from('school_actions').select('user_id, title').eq('status', 'open').eq('recurs_weekday', weekday),
  ])

  const byUser = new Map<string, string[]>()
  for (const a of [...(dueToday ?? []), ...(routines ?? [])]) {
    const list = byUser.get(a.user_id) ?? []
    if (!list.includes(a.title)) list.push(a.title)
    byUser.set(a.user_id, list)
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  let parents = 0
  let kids = 0

  for (const [userId, titles] of byUser) {
    const body = titles.length === 1
      ? `Today: ${titles[0]}.`
      : `Today: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}.`
    // The parent's own devices.
    try {
      const r = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId, title: 'This morning, for school 🎒', body, url: '/dashboard/school' }),
      })
      if ((await r.json()).sent > 0) parents++
    } catch { /* best effort */ }
    // The child's own devices, so they know what to grab too.
    try {
      const r = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId, audience: 'kids', title: 'For school today 🎒', body }),
      })
      if ((await r.json()).sent > 0) kids++
    } catch { /* best effort */ }
  }

  return NextResponse.json({ ok: true, families: byUser.size, parents, kids })
}
