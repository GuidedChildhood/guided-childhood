import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child finished a star lesson. Token is the auth, exactly like quest
// ticks. Stars award once: a mission already done stays done, replays are
// welcome but do not mint again.

export async function POST(req: Request) {
  let body: { token?: string; mission_id?: string; correct?: number; total?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const { token, mission_id } = body
  if (!token || !/^[0-9a-f]{18}$/.test(token) || !mission_id) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: mission } = await supabase
    .from('kid_lesson_missions')
    .select('id, child_id, status, stars')
    .eq('id', mission_id)
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

  return NextResponse.json({ stars: mission.stars })
}
