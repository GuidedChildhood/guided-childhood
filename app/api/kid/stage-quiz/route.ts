import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { STAGE_QUIZ_LENGTH, STAGE_QUIZ_PASS } from '@/lib/content/stage-quizzes'
import { sendPush } from '@/lib/push/send'

// The child finished the end of stage check on their own link. Token is the
// auth, exactly like quest ticks and lesson completions.
//
// This is the child's quiz, not the grown up's: the questions are gathered from
// the lessons the child worked through, so the child is the one who answers
// them, and the pass is what earns the stamp on their passport.
//
// The row still lands under the PARENT user_id, because stage_quiz_passes is
// read by the pathway page under RLS as auth.uid(). Same shape as
// /api/kid/lesson-complete: the child's work shows up on the parent's board
// without the child needing an account.

const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export async function POST(req: NextRequest) {
  let body: { token?: string; stage_id?: number; correct?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token } = body
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const stage = Number(body.stage_id)
  if (!Number.isInteger(stage) || stage < 1 || stage > 5) {
    return NextResponse.json({ error: 'bad stage' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  // A child can only sit the check for a stage they have actually reached, the
  // same forward only age gate the lesson pages apply, enforced here too so the
  // gate is not just a link they could edit.
  const { data: child } = await supabase
    .from('children').select('name, age_band').eq('id', link.child_id).maybeSingle()
  const theirStage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')
  if (stage > theirStage.id) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Every run is STAGE_QUIZ_LENGTH, so that is the honest total, and the count
  // is capped to it. The client is never trusted beyond its own honest count.
  const total = STAGE_QUIZ_LENGTH
  const right = Math.min(Math.max(0, Number(body.correct) || 0), total)
  const passed = right >= STAGE_QUIZ_PASS

  const { error } = await supabase.from('stage_quiz_passes').insert({
    user_id: link.user_id,
    child_id: link.child_id,
    stage_id: stage,
    score: right,
    total,
    passed,
  })
  // Before migration 098 the table is absent. Say so plainly rather than 500,
  // so the child still sees their score instead of an error.
  if (error) {
    return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
  }

  // The grown up hears, best effort. A stage check is the biggest thing a child
  // does on their side, so this one is worth the parent's phone buzzing.
  try {
    const name = child?.name ?? 'Your child'
    await sendPush({
      userId: link.user_id,
      title: passed ? `${name} passed the stage check 🏅` : `${name} had a go at the stage check 💪`,
      body: passed
        ? `${right} of ${total} right. That is the last green before the stamp.`
        : `${right} of ${total} this time. They can go back over the lessons and try again.`,
      url: '/dashboard/pathway',
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, passed, score: right, total })
}
