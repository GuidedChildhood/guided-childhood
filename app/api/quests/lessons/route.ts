import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Star Lessons, the parent side. GET returns children, the sendable
// lesson list (the schools curriculum, which doubles as the homeschool
// version by design) and every mission already sent with its status and
// quiz score. POST sends a lesson to a child, DELETE takes one back.

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Preview one lesson: return its slides so a parent can see exactly what
  // they are sending before they send it.
  const previewId = req.nextUrl.searchParams.get('lesson')
  if (previewId) {
    const { data } = await supabase
      .from('school_lessons').select('id, title, slides').eq('id', previewId).maybeSingle()
    return NextResponse.json({ lesson: data })
  }

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

  // The lesson must exist. If school_lessons has no rows (the curriculum
  // migration has not been run on this database), say so plainly rather
  // than throwing a foreign key error the parent cannot read.
  const { data: lessonRow, error: lookupError } = await supabase
    .from('school_lessons').select('id').eq('id', body.lesson_id).maybeSingle()
  if (lookupError) return NextResponse.json({ error: 'lessons not set up' }, { status: 503 })
  if (!lessonRow) return NextResponse.json({ error: 'lessons not set up' }, { status: 503 })

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
