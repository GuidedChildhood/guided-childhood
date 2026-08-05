import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The pass mark for the end of lesson check: at least 70 percent of the
// choice questions right. A lesson with no choice slides passes on finishing.
const PASS_MARK = 0.7

export async function POST(req: NextRequest) {
  const { lesson_id, lesson_source, correct, total } = await req.json()
  if (!lesson_id || !['lesson', 'ai_lesson', 'school_lesson'].includes(lesson_source)) {
    return NextResponse.json({ error: 'missing or invalid lesson_id / lesson_source' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Score this run. No questions in the deck means finishing is the pass.
  const totalQ = Number(total) || 0
  const correctQ = Math.min(Number(correct) || 0, totalQ)
  const passedNow = totalQ === 0 || correctQ / totalQ >= PASS_MARK

  // A pass is never taken away by a later wobbly replay: if an earlier run
  // already passed, the row stays passed and keeps its best score.
  const { data: existing } = await supabase
    .from('lesson_completions')
    .select('score, passed')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)
    .eq('lesson_source', lesson_source)
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
      { user_id: user.id, lesson_id, lesson_source, score, passed },
      { onConflict: 'user_id,lesson_id,lesson_source' }
    )

  if (error) {
    // Safety net for a deploy that lands moments before migration 079 is
    // applied: fall back to the plain completion write so nothing is lost.
    if (/column|schema/i.test(error.message)) {
      const { error: retryError } = await supabase
        .from('lesson_completions')
        .upsert(
          { user_id: user.id, lesson_id, lesson_source },
          { onConflict: 'user_id,lesson_id,lesson_source' }
        )
      if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 })
      return NextResponse.json({ ok: true, passed: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // WHO passed it, alongside the shared family row.
  //
  // lesson_completions cannot answer this: the child's own link upserts the
  // very same row, so either side doing a lesson looks like both. The road to
  // social media is the one place that difference matters, since a leg only
  // counts when the parent AND the child have each walked it. See migration 162
  // and lib/pathway/social-road.ts.
  //
  // child_id null: a parent watching a lesson is watching it for the family,
  // not for one child. Best effort throughout, because a missing row here costs
  // a tick on one card and must never cost somebody their pass.
  //
  // A plain insert, with the duplicate swallowed. Not an upsert: the uniqueness
  // is a PARTIAL index (one per lesson where child_id is null), and a partial
  // index is not a target PostgREST can name in an on conflict clause.
  if (passed && lesson_source === 'lesson') {
    try {
      await supabase.from('lesson_pass_by')
        .insert({ user_id: user.id, lesson_id, who: 'parent', child_id: null })
    } catch { /* already recorded, or pre migration 162 */ }
  }

  return NextResponse.json({ ok: true, passed })
}

export async function DELETE(req: NextRequest) {
  const { lesson_id, lesson_source } = await req.json()
  if (!lesson_id || !['lesson', 'ai_lesson', 'school_lesson'].includes(lesson_source)) {
    return NextResponse.json({ error: 'missing or invalid lesson_id / lesson_source' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('lesson_completions')
    .delete()
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)
    .eq('lesson_source', lesson_source)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The parent's side of the social road goes with it. Only theirs: a parent
  // un ticking their own completion has not undone the lesson their child sat.
  try {
    await supabase.from('lesson_pass_by')
      .delete().eq('user_id', user.id).eq('lesson_id', lesson_id).is('child_id', null)
  } catch { /* pre migration 162 */ }

  return NextResponse.json({ ok: true })
}
