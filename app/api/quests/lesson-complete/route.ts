import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KID_LESSONS, kidLessonQuestTitle } from '@/lib/quests/kid-lessons'

// A kid finished a lesson on their quest link. Token is the auth, exactly
// like quest ticks. Two lesson kinds share this endpoint:
//  - lesson_key: a two minute mini lesson (lib/quests/kid-lessons). It
//    becomes a one off quest with a pending tick so stars land through the
//    parent approve loop.
//  - mission_id: a full Star Lesson from the schools curriculum, sent by
//    the parent (kid_lesson_missions). Stars award once on completion,
//    replays never mint again.

export async function POST(req: NextRequest) {
  let body: { token?: string; lesson_key?: string; mission_id?: string; correct?: number; total?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token } = body
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

  // ── Star Lesson mission (the full curriculum lesson) ──
  if (body.mission_id) {
    const { data: mission } = await supabase
      .from('kid_lesson_missions')
      .select('id, child_id, status, stars, lesson_id')
      .eq('id', body.mission_id)
      .maybeSingle()
    if (!mission || mission.child_id !== link.child_id) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    if (mission.status === 'done') {
      return NextResponse.json({ stars: 0, already_done: true })
    }

    const correct = Math.max(0, Math.min(50, Number(body.correct) || 0))
    const total = Math.max(0, Math.min(50, Number(body.total) || 0))

    const { error } = await supabase
      .from('kid_lesson_missions')
      .update({
        status: 'done',
        score_correct: correct,
        score_total: total,
        completed_at: new Date().toISOString(),
      })
      .eq('id', mission.id)
      .eq('status', 'sent')
    if (error) return NextResponse.json({ error: 'update failed' }, { status: 500 })

    await notifyParent(req, supabase, link, `finished a star lesson 🎬`, `Quiz score ${correct} of ${total}. ${mission.stars} stars landed in their bank.`)
    return NextResponse.json({ stars: mission.stars })
  }

  // ── Mini lesson (two minute card lesson on the quest screen) ──
  if (!body.lesson_key) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const lesson = KID_LESSONS.find(l => l.key === body.lesson_key)
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

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

  await notifyParent(req, supabase, link, `finished a lesson 🧠`, `${lesson.title}, all by themselves. One tap to approve and ${lesson.stars} stars land.`)
  return NextResponse.json({ ok: true })
}

// Nudge the parent's phone, best effort.
async function notifyParent(
  req: NextRequest,
  supabase: ReturnType<typeof createAdminClient>,
  link: { user_id: string; child_id: string },
  titleSuffix: string,
  bodyText: string,
) {
  try {
    const { data: child } = await supabase
      .from('children')
      .select('name')
      .eq('id', link.child_id)
      .maybeSingle()
    const name = child?.name ?? 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} ${titleSuffix}`,
        body: bodyText,
        url: '/dashboard',
      }),
    })
  } catch { /* push is best effort */ }
}
