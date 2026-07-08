import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The kid side tick. No account, no session: the kid link token is the
// auth, exactly like the school letterbox. A tick lands as pending, the
// parent's phone gets a nudge, approval releases the stars.

export async function POST(req: NextRequest) {
  const { token, quest_id, untick } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !quest_id) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // The quest must belong to the same family and be active
  const { data: quest } = await supabase
    .from('family_quests')
    .select('id, title, stars, child_id, user_id, active')
    .eq('id', quest_id)
    .eq('user_id', link.user_id)
    .eq('active', true)
    .maybeSingle()
  if (!quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 })

  const today = new Date().toISOString().slice(0, 10)

  if (untick) {
    // A kid can take back a pending tick, never an approved one
    await supabase.from('quest_ticks')
      .delete()
      .eq('quest_id', quest.id)
      .eq('tick_date', today)
      .eq('status', 'pending')
    await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)
    return NextResponse.json({ ok: true, status: null })
  }

  const { error } = await supabase.from('quest_ticks').insert({
    quest_id: quest.id,
    user_id: link.user_id,
    child_id: link.child_id,
    tick_date: today,
    status: 'pending',
    ticked_by: 'child',
  })
  // Unique (quest_id, tick_date): a repeat tap is fine, not an error
  if (error && !error.message.includes('duplicate')) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  // Nudge the parent's phone, best effort
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: 'Quest done, needs your approve',
        body: `${quest.title} was just ticked off. One tap to approve and the stars land.`,
        url: '/dashboard',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, status: 'pending' })
}
