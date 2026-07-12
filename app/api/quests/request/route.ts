import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// A child asks for their own quest: clean my room, wash the car, help
// with dinner. Same trust model as ticking, the link token is the auth.
// The ask lands as pending, the parent's phone gets a nudge, and one tap
// on the board turns it into a real quest with stars attached.

export async function POST(req: NextRequest) {
  const { token, title, emoji } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const cleanTitle = String(title ?? '').replace(/\s+/g, ' ').trim().slice(0, 60)
  if (cleanTitle.length < 3) {
    return NextResponse.json({ error: 'title too short' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // A handful of open asks at a time keeps it an ask, not a flood
  const { count } = await supabase
    .from('quest_requests')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', link.child_id)
    .eq('status', 'pending')
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'too many pending' }, { status: 429 })
  }

  const { data: request, error } = await supabase.from('quest_requests').insert({
    user_id: link.user_id,
    child_id: link.child_id,
    title: cleanTitle,
    emoji: typeof emoji === 'string' && emoji ? emoji.slice(0, 8) : '⭐',
  }).select('id, title, emoji, status, created_at').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('kid_links').update({ last_seen_at: new Date().toISOString() }).eq('token', token)

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name ?? 'Your child'

  // Nudge the parent's phone, best effort
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} is asking for a quest ⭐`,
        body: `"${cleanTitle}" is their idea. One tap to make it a real quest with stars.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, request })
}
