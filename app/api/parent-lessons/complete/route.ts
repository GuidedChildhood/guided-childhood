import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { FIRST_COMPLETION_STARS, REDO_STARS } from '@/lib/lessons/parent-lessons'
import { STAGES } from '@/lib/content/stages'

// A watch together lesson finished: segment C ended and the quiz cards
// answered. Two callers share this endpoint, exactly like the star
// lesson flow:
//  - the kid link (token is the auth, no login, service role writes)
//  - the parent dashboard (session is the auth, child ownership checked,
//    then the same service role write path so both callers behave the same)
//
// Stars: 10 land once on first completion, 2 on every redo, written as a
// running total on parent_lesson_completions.stars_awarded, which
// lib/quests/bank.ts counts into the existing star bank. No new currency,
// no parent approval step (mirrors star lesson missions, not mini quests).
//
// The stage passport: after any completion write we check whether this
// child now has completions for every active lesson of that stage. First
// time that happens, a stage_passports row lands and passport_awarded
// comes back true so the player can celebrate. Passports are permanent.

export async function POST(req: NextRequest) {
  let body: {
    token?: string
    child_id?: string
    lesson_code?: string
    quiz_right_first_try?: boolean
  }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const lessonCode = body.lesson_code
  if (!lessonCode || typeof lessonCode !== 'string' || !/^\d{1,2}\.\d{1,2}$/.test(lessonCode)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const admin = createAdminClient()

  // ── Who is completing, and for which child? ──
  let childId: string | null = null
  let parentId: string | null = null
  let viaKidLink = false

  if (body.token) {
    if (typeof body.token !== 'string' || !/^[0-9a-f]{18}$/.test(body.token)) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }
    const { data: link } = await admin
      .from('kid_links')
      .select('user_id, child_id')
      .eq('token', body.token)
      .maybeSingle()
    if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
    childId = link.child_id
    parentId = link.user_id
    viaKidLink = true
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    if (!body.child_id || typeof body.child_id !== 'string') {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }
    const { data: child } = await admin
      .from('children')
      .select('id, parent_id')
      .eq('id', body.child_id)
      .maybeSingle()
    if (!child || child.parent_id !== user.id) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    childId = child.id
    parentId = user.id
  }
  if (!childId || !parentId) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  // ── The lesson must exist and be live ──
  const { data: lesson } = await admin
    .from('parent_lessons')
    .select('lesson_code, stage_id, title')
    .eq('lesson_code', lessonCode)
    .eq('active', true)
    .maybeSingle()
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

  // Null when the lesson has no quiz cards yet: absent evidence is not a
  // wrong answer, and the evidence file only wants real signals.
  const quizRightFirstTry =
    typeof body.quiz_right_first_try === 'boolean' ? body.quiz_right_first_try : null

  // ── Completion write: first completion or redo ──
  const { data: existing } = await admin
    .from('parent_lesson_completions')
    .select('id, times_completed, stars_awarded')
    .eq('child_id', childId)
    .eq('lesson_code', lessonCode)
    .maybeSingle()

  let starsThisTime: number
  let timesCompleted: number
  let firstCompletion: boolean

  if (!existing) {
    firstCompletion = true
    starsThisTime = FIRST_COMPLETION_STARS
    timesCompleted = 1
    const { error } = await admin.from('parent_lesson_completions').insert({
      child_id: childId,
      lesson_code: lessonCode,
      times_completed: 1,
      quiz_right_first_try: quizRightFirstTry,
      stars_awarded: FIRST_COMPLETION_STARS,
    })
    if (error) return NextResponse.json({ error: 'write failed' }, { status: 500 })
  } else {
    // Redo: the tick stays, the count and the running star total move.
    // quiz_right_first_try keeps its first completion value, that is the
    // quiet quality signal and a redo never rewrites history.
    firstCompletion = false
    starsThisTime = REDO_STARS
    timesCompleted = (Number(existing.times_completed) || 1) + 1
    const { error } = await admin
      .from('parent_lesson_completions')
      .update({
        times_completed: timesCompleted,
        last_completed_at: new Date().toISOString(),
        stars_awarded: (Number(existing.stars_awarded) || 0) + REDO_STARS,
      })
      .eq('id', existing.id)
    if (error) return NextResponse.json({ error: 'write failed' }, { status: 500 })
  }

  // ── Stage passport check ──
  // Does this child now hold a completion for every active lesson of the
  // stage? Runs after every completion write so catch up passports land
  // retroactively the moment the last lesson finishes.
  let passportAwarded = false
  const [{ data: stageLessons }, { data: stageCompletions }, { data: passport }] = await Promise.all([
    admin.from('parent_lessons').select('lesson_code').eq('stage_id', lesson.stage_id).eq('active', true),
    admin.from('parent_lesson_completions').select('lesson_code').eq('child_id', childId),
    admin.from('stage_passports').select('id').eq('child_id', childId).eq('stage_id', lesson.stage_id).maybeSingle(),
  ])
  const completedCodes = new Set((stageCompletions ?? []).map(c => c.lesson_code))
  const stageComplete =
    (stageLessons ?? []).length > 0 &&
    (stageLessons ?? []).every(l => completedCodes.has(l.lesson_code))
  if (stageComplete && !passport) {
    const { error } = await admin.from('stage_passports').insert({
      child_id: childId,
      stage_id: lesson.stage_id,
    })
    // A racing duplicate insert loses to the unique constraint; the
    // passport already exists then, so no celebration twice.
    passportAwarded = !error
  }

  // ── The parent push: the good news moment ──
  // Only when the child finished it on their own link; a parent pressing
  // finish on their own dashboard was in the room for it.
  if (viaKidLink) {
    const stageName = STAGES.find(s => s.id === lesson.stage_id)?.name ?? `Stage ${lesson.stage_id}`
    await notifyParent(
      req,
      admin,
      { user_id: parentId, child_id: childId },
      passportAwarded ? 'earned a stage passport 🌟' : firstCompletion ? 'finished a lesson together 🎬' : 'rewatched a lesson 🎬',
      passportAwarded
        ? `Every ${stageName} lesson is complete. The ${stageName} passport just landed, ${starsThisTime} stars with it.`
        : `${lesson.title}. ${starsThisTime} star${starsThisTime === 1 ? '' : 's'} landed in their bank.`,
    )
  }

  return NextResponse.json({
    ok: true,
    first_completion: firstCompletion,
    times_completed: timesCompleted,
    stars: starsThisTime,
    passport_awarded: passportAwarded,
    stage_id: lesson.stage_id,
  })
}

// Nudge the parent's phone, best effort, same shape as the star lesson flow.
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
        url: '/dashboard/lessons/together',
      }),
    })
  } catch { /* push is best effort */ }
}
