import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'

// A child finished a family stage lesson on their own link. Token is the
// auth, exactly like quest ticks. The completion upserts into
// lesson_completions under the PARENT user_id with the same passed and
// score semantics as the parent route (/api/lessons/complete), so the
// child's pass feeds the parent's ticks exactly like a together pass. A
// pass is never taken away by a later wobbly replay.

const PASS_MARK = 0.7

const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export async function POST(req: NextRequest) {
  let body: { token?: string; lesson_id?: string; correct?: number; total?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token, lesson_id } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  if (!lesson_id || typeof lesson_id !== 'string' || !/^[0-9a-f-]{36}$/.test(lesson_id)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // The lesson must be real, live, and within the child's stage: the same
  // forward only age gate the pages apply, enforced server side too.
  const [{ data: lesson }, { data: child }] = await Promise.all([
    supabase.from('lessons').select('id, stage_id, audience, status, title').eq('id', lesson_id).maybeSingle(),
    supabase.from('children').select('name, age_band').eq('id', link.child_id).maybeSingle(),
  ])
  if (!lesson || lesson.audience !== 'parent' || lesson.status === 'stub') {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')
  if ((STAGE_NUM[lesson.stage_id] ?? 99) > stage.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // Score this run, capped defensively: the client is never trusted beyond
  // its own honest count. No questions in the deck means finishing passes.
  const totalQ = Math.max(0, Math.min(50, Number(body.total) || 0))
  const correctQ = Math.min(Math.max(0, Number(body.correct) || 0), totalQ)
  const passedNow = totalQ === 0 || correctQ / totalQ >= PASS_MARK

  // A pass is never downgraded: keep the best passed score on record.
  const { data: existing } = await supabase
    .from('lesson_completions')
    .select('score, passed')
    .eq('user_id', link.user_id)
    .eq('lesson_id', lesson_id)
    .eq('lesson_source', 'lesson')
    .maybeSingle()
  const priorPassScore = existing?.passed === true ? existing.score ?? null : null
  const passed = passedNow || existing?.passed === true
  const score = totalQ === 0
    ? priorPassScore
    : passedNow
    ? Math.max(correctQ, priorPassScore ?? 0)
    : priorPassScore ?? correctQ

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: link.user_id, lesson_id, lesson_source: 'lesson', score, passed },
      { onConflict: 'user_id,lesson_id,lesson_source' }
    )

  if (error) {
    // Fail soft on a database without the 079 pass columns: the plain
    // completion write still lands so nothing the child did is lost.
    if (/column|schema/i.test(error.message)) {
      const { error: retryError } = await supabase
        .from('lesson_completions')
        .upsert(
          { user_id: link.user_id, lesson_id, lesson_source: 'lesson' },
          { onConflict: 'user_id,lesson_id,lesson_source' }
        )
      if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 })
      return NextResponse.json({ ok: true, passed: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The good news reaches the parent's phone, best effort.
  try {
    const name = child?.name ?? 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: passedNow ? `${name} passed a lesson 🌱` : `${name} had a go at a lesson 💪`,
        body: passedNow
          ? `${lesson.title}: ${correctQ} of ${totalQ} right. The tick is on your pathway now.`
          : `${lesson.title}: ${correctQ} of ${totalQ} this time. They can go back over it any time.`,
        url: '/dashboard/lessons',
      }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, passed })
}
