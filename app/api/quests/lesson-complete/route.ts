import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KID_LESSONS, kidLessonQuestTitle } from '@/lib/quests/kid-lessons'

// A kid finished a mini lesson on their quest page. Same trust model as
// ticking: the link token is the auth. The lesson becomes a one off
// quest with a pending tick, so the stars land through the normal
// approve loop and the parent sees exactly what was learned. Star
// values come from the server side lesson list, never the client.

export async function POST(req: NextRequest) {
  const { token, lesson_key } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token) || !lesson_key) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const lesson = KID_LESSONS.find(l => l.key === lesson_key)
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const title = kidLessonQuestTitle(lesson)

  // Each lesson lands its stars once per child.
  const { data: existing } = await supabase
    .from('family_quests')
    .select('id')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .eq('title', title)
    .maybeSingle()
  if (existing) return NextResponse.json({ ok: true, already: true })

  const { data: quest, error: questError } = await supabase
    .from('family_quests')
    .insert({
      user_id: link.user_id,
      child_id: link.child_id,
      title,
      emoji: lesson.emoji,
      stars: lesson.stars,
      schedule: 'once',
    })
    .select('id')
    .single()
  if (questError || !quest) {
    return NextResponse.json({ error: questError?.message ?? 'could not save' }, { status: 500 })
  }

  await supabase.from('quest_ticks').insert({
    quest_id: quest.id,
    user_id: link.user_id,
    child_id: link.child_id,
    tick_date: new Date().toISOString().slice(0, 10),
    status: 'pending',
    ticked_by: 'child',
  })

  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('id', link.child_id)
    .maybeSingle()
  const name = child?.name ?? 'Your child'

  // Nudge the parent's phone, best effort
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} finished a lesson 🧠`,
        body: `${lesson.title}, all by themselves. One tap to approve and ${lesson.stars} stars land.`,
        url: '/dashboard',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true })
}
