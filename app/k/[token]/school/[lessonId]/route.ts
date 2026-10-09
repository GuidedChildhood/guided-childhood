import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { lessonStageFor, moduleOpenFor, newMissionAllowed, WEEKLY_LESSON_STARS } from '@/lib/lessons/school-path'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import { hasFullAccess } from '@/lib/access'

// Open one school lesson for the child, from their own list.
//
// Justin, 29 September 2026, chose "the child learns, the parent closes it":
// the child's lessons are the school modules for their stage, and they can
// start the next one themselves without a grown up sending it first. The
// star lesson machinery (kid_lesson_missions, the kid player, the stars, the
// push to the parent) already did everything else, so this only makes sure a
// mission row exists and sends the child into it.
//
// One mission per child per lesson, reused for every replay. The stars are
// paid once when that row first goes to done (app/api/quests/lesson-complete),
// so a replay can still pass the check and tick the passport but can never
// mint stars a second time.

export const dynamic = 'force-dynamic'

// The stars a self started lesson is worth: the same default a parent's send
// uses (app/api/quests/lessons).

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string; lessonId: string }> }) {
  const { token, lessonId } = await params
  const home = new URL(`/k/${token}`, req.url)
  if (!/^[0-9a-f]{18}$/.test(token) || !/^[0-9a-f-]{36}$/.test(lessonId)) return NextResponse.redirect(home)

  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.redirect(home)

  // The lesson has to be a real school lesson: there is no foreign key on the
  // mission row, so this is the only check between a bad id and a dead link.
  const [lesson, { data: child }] = await Promise.all([
    getStarLesson(supabase, lessonId, 'id, key_stage'),
    supabase.from('children').select('date_of_birth, age_band').eq('id', link.child_id).maybeSingle(),
  ])
  if (!lesson) return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))
  // A lesson from a later key stage waits for the year the child's class meets
  // it (sync plan C). Enforced here, where a mission starts, and not only by
  // the list leaving it out, because any lesson id can be typed into this URL.
  if (!moduleOpenFor((lesson as { key_stage?: string | null }).key_stage, lessonStageFor(child as { date_of_birth?: string | null; age_band?: string | null } | null))) {
    return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))
  }

  const { data: existing } = await supabase
    .from('kid_lesson_missions')
    .select('id, status')
    .eq('child_id', link.child_id)
    .eq('lesson_id', lessonId)
    .order('sent_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let missionId = existing?.id as string | undefined
  // An existing mission always reopens: a retake, a replay of a pass, the
  // week's own lesson. Only a mission that would be CREATED here meets the
  // paywall and the pace (plan v10, 1.5).
  if (!missionId || existing?.status === 'skipped') {
    const lessonStage = lessonStageFor(child as { date_of_birth?: string | null; age_band?: string | null } | null)
    const [{ data: profile }, { data: lastPass }] = await Promise.all([
      supabase.from('profiles').select('subscription_status, trial_ends_at, email').eq('id', link.user_id).maybeSingle(),
      supabase.from('lesson_completions').select('completed_at')
        .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('lesson_source', 'school_lesson').eq('passed', true)
        .order('completed_at', { ascending: false }).limit(1).maybeSingle(),
    ])
    const paid = hasFullAccess(profile as { subscription_status?: string | null; trial_ends_at?: string | null } | null, (profile as { email?: string | null } | null)?.email)
    const { modules, path } = await loadChildLessonPath(supabase, { userId: link.user_id, childId: link.child_id, stageId: lessonStage, paid })
    // The paywall, read here for the first time: until 9 October any module
    // opened by URL, and this PR raises the award from 3 to 10. A locked
    // module goes back to the list, which says it is waiting rather than
    // showing a padlock.
    if (path.statusById[lessonId]?.state === 'locked') return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))
    if (!newMissionAllowed({
      lastPassAt: (lastPass as { completed_at?: string | null } | null)?.completed_at ?? null,
      isFirstOfStage: modules[0]?.id === lessonId,
      isSkippedRestart: existing?.status === 'skipped',
    })) {
      return NextResponse.redirect(new URL(`/k/${token}/lessons?paced=1`, req.url))
    }
  }
  if (existing?.status === 'skipped') {
    await supabase.from('kid_lesson_missions').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', existing.id).eq('status', 'skipped')
  }
  if (!missionId) {
    const { data: created } = await supabase
      .from('kid_lesson_missions')
      .insert({ user_id: link.user_id, child_id: link.child_id, lesson_id: lessonId, stars: WEEKLY_LESSON_STARS, status: 'sent' })
      .select('id')
      .single()
    missionId = created?.id as string | undefined
  }
  if (!missionId) return NextResponse.redirect(new URL(`/k/${token}/lessons`, req.url))

  return NextResponse.redirect(new URL(`/k/${token}/lesson/${missionId}`, req.url))
}
