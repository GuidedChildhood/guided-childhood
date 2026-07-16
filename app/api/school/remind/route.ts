import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Called once a day, evening UK time, by Vercel Cron (see vercel.json).
// The never miss it promise: anything due tomorrow, whether a one off
// with a due date or a weekly routine (PE every Thursday), whether
// DiGi caught it from a school email or the parent typed it in by
// hand, gets one push tonight while there is still time to pack the
// kit or sign the form, grouped into a single message per family. A
// weekly routine marked auto_send_to_child also gets its own quest on
// the child's page every week it comes round, no parent tap needed.

const KIND_EMOJI: Record<string, string> = {
  kit: '🎒', payment: '💷', homework: '📖', event: '📅', deadline: '⏰', notice: '📌',
}

function ukTomorrow(): { dateStr: string; weekday: number } {
  const uk = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  uk.setDate(uk.getDate() + 1)
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

  const { dateStr: tomorrow, weekday } = ukTomorrow()
  const today = new Date().toISOString().slice(0, 10)

  const { data: dueTomorrow } = await supabase
    .from('school_actions')
    .select('user_id, title')
    .eq('status', 'open')
    .eq('due_date', tomorrow)

  const { data: routines } = await supabase
    .from('school_actions')
    .select('user_id, title, kind, auto_send_to_child')
    .eq('status', 'open')
    .eq('recurs_weekday', weekday)

  const byUser = new Map<string, string[]>()
  for (const a of dueTomorrow ?? []) {
    const list = byUser.get(a.user_id) ?? []
    list.push(a.title)
    byUser.set(a.user_id, list)
  }
  for (const r of routines ?? []) {
    const list = byUser.get(r.user_id) ?? []
    list.push(r.title)
    byUser.set(r.user_id, list)
  }

  let sent = 0
  let childSent = 0
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  for (const [userId, titles] of byUser) {
    const body = titles.length === 1
      ? `Tomorrow: ${titles[0]}. Sort it tonight while it is easy.`
      : `Tomorrow: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}. Sort tonight while it is easy.`
    try {
      const res = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({ userId, title: 'From school, due tomorrow', body, url: '/dashboard/school' }),
      })
      const result = await res.json()
      if (result.sent > 0) sent++
    } catch { /* best effort */ }
  }

  // The weekly routines that also nudge the child, every week, automatically.
  for (const routine of (routines ?? []).filter(r => r.auto_send_to_child)) {
    try {
      const { data: child } = await supabase
        .from('children')
        .select('id, name')
        .eq('parent_id', routine.user_id)
        .eq('is_primary', true)
        .maybeSingle()
      if (!child) continue

      // One quest per week: skip if this routine already sent today.
      const { data: existing } = await supabase
        .from('family_quests')
        .select('id')
        .eq('user_id', routine.user_id)
        .eq('child_id', child.id)
        .eq('title', routine.title)
        .gte('created_at', `${today}T00:00:00Z`)
        .maybeSingle()
      if (existing) continue

      const { data: quest } = await supabase
        .from('family_quests')
        .insert({
          user_id: routine.user_id, child_id: child.id, title: routine.title,
          emoji: KIND_EMOJI[routine.kind] ?? '📌', stars: 1, schedule: 'once',
        })
        .select('id')
        .single()
      if (!quest) continue

      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({
          userId: routine.user_id, audience: 'kids',
          title: 'From home ⭐', body: `${routine.title}. Tick it off on your quests when it is sorted.`, url: '/',
        }),
      })
      childSent++
    } catch { /* best effort, next week tries again */ }
  }

  return NextResponse.json({ families: byUser.size, sent, childSent, dueDate: tomorrow, weekday })
}
