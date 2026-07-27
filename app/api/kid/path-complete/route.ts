import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The whole path done in one day: every due job ticked and the daily chest
// opened, verified here against the real records, pays three bonus stars
// through the star_bonuses ledger, once a day. The client also counts the
// found stones (characters, game, reading) on its own device before it calls
// this; the server holds the line on the parts it can prove. Token is the
// auth, everything fails soft before migration 086, and the grown up gets
// the good news push.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // Every job due today must carry a tick (pending or approved both count,
  // the child has done their part either way).
  const today = new Date().toISOString().slice(0, 10)
  const dow = new Date().getUTCDay()
  const isWeekend = dow === 0 || dow === 6
  const [{ data: quests }, { data: ticks }] = await Promise.all([
    supabase.from('family_quests')
      .select('id, schedule, child_id')
      .eq('user_id', link.user_id).eq('active', true),
    supabase.from('quest_ticks')
      .select('quest_id, child_id, status')
      .eq('user_id', link.user_id).eq('tick_date', today).neq('status', 'rejected').limit(100),
  ])
  const ticked = new Set(
    (ticks ?? []).filter(t => t.child_id === link.child_id || t.child_id === null).map(t => t.quest_id)
  )
  const due = (quests ?? [])
    .filter(q => q.child_id === null || q.child_id === link.child_id)
    .filter(q =>
      q.schedule === 'daily' || q.schedule === 'once'
      || (q.schedule === 'weekdays' && !isWeekend)
      || (q.schedule === 'weekend' && isWeekend))
    .slice(0, 8)
  if (due.length === 0 || due.some(q => !ticked.has(q.id))) {
    return NextResponse.json({ error: 'jobs not done' }, { status: 400 })
  }

  // The chest must be open, and the path bonus lands once a day.
  const { data: bonuses, error: readErr } = await supabase
    .from('star_bonuses')
    .select('note')
    .eq('user_id', link.user_id).eq('child_id', link.child_id)
    .or('note.ilike.Path chest%,note.ilike.Path complete%')
    .gte('created_at', `${today}T00:00:00Z`)
    .limit(10)
  if (readErr) return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  if (!(bonuses ?? []).some(b => String(b.note).startsWith('Path chest'))) {
    return NextResponse.json({ error: 'chest not opened' }, { status: 400 })
  }
  if ((bonuses ?? []).some(b => String(b.note).startsWith('Path complete'))) {
    return NextResponse.json({ error: 'already claimed today' }, { status: 409 })
  }

  const { error } = await supabase.from('star_bonuses').insert({
    user_id: link.user_id, child_id: link.child_id, stars: 3,
    note: 'Path complete: the whole day done ⭐',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const { data: child } = await supabase.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const name = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} completed the whole path today 🏁`,
        body: `Every job, the chest and all the finds. 3 bonus stars banked. That is the daily loop working perfectly.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, stars: 3 })
}
