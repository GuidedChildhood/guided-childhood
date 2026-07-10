import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Star Lessons, the parent side. GET returns children, the sendable
// lesson list (the schools curriculum, which doubles as the homeschool
// version by design) and every mission already sent with its status and
// quiz score. POST sends a lesson to a child, DELETE takes one back.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const [childrenRes, lessonsRes, missionsRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).order('created_at'),
    supabase.from('school_lessons').select('id, module_id, title, key_stage, year_band, single_action_outcome').order('sort_order'),
    supabase.from('kid_lesson_missions')
      .select('id, child_id, lesson_id, stars, status, score_correct, score_total, sent_at, completed_at')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false }),
  ])

  return NextResponse.json({
    children: childrenRes.data ?? [],
    lessons: lessonsRes.data ?? [],
    missions: missionsRes.data ?? [],
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: { child_id?: string; lesson_id?: string; stars?: number }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  if (!body.child_id || !body.lesson_id) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const stars = Math.max(1, Math.min(10, Number(body.stars) || 3))

  // Re-sending an already sent lesson updates the stars and resets it to
  // playable, so a parent can offer a replay with a fresh reward.
  const { error } = await supabase
    .from('kid_lesson_missions')
    .upsert(
      { user_id: user.id, child_id: body.child_id, lesson_id: body.lesson_id, stars, status: 'sent' },
      { onConflict: 'child_id,lesson_id' }
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: { id?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  if (!body.id) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const { error } = await supabase
    .from('kid_lesson_missions')
    .delete()
    .eq('id', body.id)
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
