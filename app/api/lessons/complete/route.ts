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
  return NextResponse.json({ ok: true })
}
