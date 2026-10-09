import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listStarLessons, getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { createAdminClient } from '@/lib/supabase/admin'
import { lessonStageFor, moduleOpenFor, WEEKLY_LESSON_STARS } from '@/lib/lessons/school-path'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import { hasFullAccess } from '@/lib/access'
import { pushToChild } from '@/lib/quests/kid-push'
import { characterKeyFor } from '@gc/shared/friend-register'
import { CHARACTERS } from '@gc/shared/schools-curriculum'

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
    // The catalogue is service role only (migration 274); the parent session
    // reads nothing from it.
    const lesson = await getStarLesson(createAdminClient(), previewId, 'id, title, slides')
    return NextResponse.json({ lesson })
  }

  const [childrenRes, lessons, missionsRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).order('created_at'),
    listStarLessons(createAdminClient()),
    supabase.from('kid_lesson_missions')
      .select('id, child_id, lesson_id, stars, status, score_correct, score_total, sent_at, completed_at')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false }),
  ])

  return NextResponse.json({
    children: childrenRes.data ?? [],
    lessons: lessons ?? [],
    missions: missionsRes.data ?? [],
  })
}

// THE SEND ROUTE, IN THE PARENT'S OWN NAME (plan v10, item 1.7).
//
// Until 9 October 2026 this read the catalogue with the parent's session,
// which migration 274 forbids (so it answered "lessons not set up"), never
// proved the child was theirs, took any star count from the client, and
// upserted a `done` mission back to `sent`, un-passing a lesson a child had
// passed. Now: the catalogue through the admin client and nothing else; the
// child proved theirs; the school year and the paywall refused with 403; a
// passed lesson answers `already_passed`; a new mission pays the weekly 10.
//
// Sending a lesson that is already on the child's list is a NUDGE, and a
// lesson takes one. `nudged_at` is set only when the push reports it reached a
// device, because the push returns early in quiet hours and a tap at half
// nine would otherwise spend the one nudge on nothing. Quiet hours answers its
// own state and the button stays live. The nudge says who it came from.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let body: { child_id?: string; lesson_id?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  if (!body.child_id || !body.lesson_id) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const [{ data: child }, { data: profile }] = await Promise.all([
    supabase.from('children').select('id, name, date_of_birth, age_band').eq('id', body.child_id).eq('parent_id', user.id).maybeSingle(),
    supabase.from('profiles').select('full_name, subscription_status, trial_ends_at, email').eq('id', user.id).maybeSingle(),
  ])
  if (!child) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const admin = createAdminClient()
  const lesson = await getStarLesson(admin, body.lesson_id, 'id, title, key_stage, character_cast') as
    { id: string; title: string; key_stage?: string | null; character_cast?: string | null } | null
  if (!lesson) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const lessonStage = lessonStageFor(child)
  if (!moduleOpenFor(lesson.key_stage, lessonStage)) {
    return NextResponse.json({ error: 'waits', reason: 'school_year' }, { status: 403 })
  }
  const paid = hasFullAccess(profile as { subscription_status?: string | null; trial_ends_at?: string | null } | null, (profile as { email?: string | null } | null)?.email)
  const { path } = await loadChildLessonPath(supabase, { userId: user.id, childId: child.id, stageId: lessonStage, paid })
  if (path.statusById[lesson.id]?.state === 'locked') {
    return NextResponse.json({ error: 'locked', reason: 'paywall' }, { status: 403 })
  }

  const { data: existing } = await supabase
    .from('kid_lesson_missions')
    .select('id, status, nudged_at')
    .eq('user_id', user.id).eq('child_id', child.id).eq('lesson_id', lesson.id)
    .maybeSingle()
  if (existing?.status === 'done') return NextResponse.json({ ok: true, state: 'already_passed' })

  const friendKey = characterKeyFor(lesson.character_cast) ?? 'digi'
  const friend = CHARACTERS[friendKey]?.name ?? 'DiGi'
  const parentName = String((profile as { full_name?: string | null } | null)?.full_name ?? '').trim().split(/\s+/)[0] || 'Your grown up'

  if (!existing || existing.status === 'skipped') {
    const { error } = existing
      ? await supabase.from('kid_lesson_missions').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', existing.id)
      : await supabase.from('kid_lesson_missions').insert({ user_id: user.id, child_id: child.id, lesson_id: lesson.id, stars: WEEKLY_LESSON_STARS, status: 'sent' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const pushed = await pushToChild(admin, user.id, child.id, `A lesson from ${parentName}`, `${lesson.title} is waiting in your lessons, with ${friend}.`)
    return NextResponse.json({ ok: true, state: 'sent', push: pushed.reason })
  }

  // Already on the list: the one nudge this lesson will take.
  if (existing.nudged_at) return NextResponse.json({ ok: true, state: 'already_nudged' })
  const pushed = await pushToChild(admin, user.id, child.id, `${parentName} gave ${friend} a nudge`, 'Still here when you are. No rush.')
  if (pushed.sent > 0) {
    await supabase.from('kid_lesson_missions').update({ nudged_at: new Date().toISOString() }).eq('id', existing.id).is('nudged_at', null)
    return NextResponse.json({ ok: true, state: 'nudged' })
  }
  // Quiet hours, no device, or a push that failed: nothing spent, the button
  // stays live, and the state says which.
  return NextResponse.json({ ok: true, state: pushed.reason })
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
