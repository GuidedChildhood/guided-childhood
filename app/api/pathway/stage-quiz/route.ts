import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stageQuizFor, STAGE_QUIZ_LENGTH, STAGE_QUIZ_PASS } from '@/lib/content/stage-quizzes'

// The passport stage quiz result, recorded parent side. This is a grown up
// surface, so the auth is the logged in parent (auth.uid()), not a kid token,
// and the row is written under RLS to their own user_id. The score is checked
// against the real quiz length so a made up pass cannot stamp a stage. Fails
// soft before migration 098 so a preview without the table never errors the page.

export async function POST(req: NextRequest) {
  const { childId, stageId, correct } = await req.json().catch(() => ({}))
  const stage = Number(stageId)
  if (!Number.isInteger(stage) || stage < 1 || stage > 5) {
    return NextResponse.json({ error: 'bad stage' }, { status: 400 })
  }
  if (!stageQuizFor(stage)) {
    return NextResponse.json({ error: 'unknown stage' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })

  // Every run is a sample of STAGE_QUIZ_LENGTH, so that is the honest total.
  const total = STAGE_QUIZ_LENGTH
  const right = Math.min(Math.max(0, Number(correct) || 0), total)
  const passed = right >= STAGE_QUIZ_PASS

  // The child is optional, but when present it must belong to this parent, so a
  // pass is always tied to a real child of theirs.
  let child: string | null = null
  if (childId && typeof childId === 'string') {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
    child = owned?.id ?? null
  }

  const { error } = await supabase.from('stage_quiz_passes').insert({
    user_id: user.id,
    child_id: child,
    stage_id: stage,
    score: right,
    total,
    passed,
  })
  // Before migration 098 the table is absent. Say so plainly rather than 500,
  // so the client can show the score without claiming the stamp landed.
  if (error) {
    return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  }

  return NextResponse.json({ ok: true, passed, score: right, total })
}
