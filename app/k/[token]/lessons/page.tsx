import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import KidScreenChrome from '@/components/kid/KidScreenChrome'
import { readTodayState } from '@/lib/kid/today-state'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { isTogetherStage, lessonStageFor, newMissionAllowed } from '@/lib/lessons/school-path'
import type { StageId } from '@/lib/pathway/progress'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import { hasFullAccess } from '@/lib/access'
import KidLessonList, { type KidLessonItem } from '@/components/kid/KidLessonList'
import { resolveTheme } from '@/lib/kid/theme'
import { lessonsPassedCount } from '@/lib/planet/server'
import { newPlanets, type Home } from '@/lib/planet/logic'
import { MAP_LINES } from '@/lib/planet/world'
import { PLANET_FRIENDS_LIVE } from '@/lib/planet/flag'
import { PLANET_WORDS } from '@/lib/planet/universe'

// My lessons: the child's own list of the age right stage lessons, the
// school version since 29 September 2026, opened from their quest link. No account, no login; the
// token scopes everything. The child takes the choice questions themselves
// and a pass lands in lesson_completions under the parent, so the parent
// side shows the same tick a sofa lesson would.

export const dynamic = 'force-dynamic'

export default async function KidLessonsPage({ params, searchParams }: {
  params: Promise<{ token: string }>
  searchParams?: Promise<{ next?: string; quiz?: string }>
}) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band, accent, date_of_birth')
    .eq('id', link.child_id)
    .maybeSingle()
  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  // THE SCHOOL VERSION (29 September 2026). Justin chose "the child learns,
  // the parent closes it": this list is the school modules for the child's
  // stage (lib/lessons/school-path), not the parent library, which is written
  // to grown ups. Each opens through /k/[token]/school/[id], which reuses the
  // star lesson player, stars and push, and its pass ticks the passport.
  // Lessons follow the school year (sync plan C): a Year 8 child who has
  // turned 13 gets the KS3 lessons their class meets, not the KS4 ones. The
  // stage check card below still reads the passport stage.
  const stageId = lessonStageFor(child as { date_of_birth?: string | null; age_band?: string | null } | null)

  // Whether the big end of stage check is already passed, so the card at the
  // bottom of the list says so rather than inviting them to sit it again.
  // Fails soft to not passed before migration 098.
  let stageCheckPassed = false
  {
    const { data } = await supabase
      .from('stage_quiz_passes')
      .select('stage_id')
      .eq('user_id', link.user_id)
      .eq('child_id', link.child_id)
      .eq('stage_id', stage.id)
      .eq('passed', true)
      .limit(1)
    stageCheckPassed = !!data?.length
  }

  // The paywall holds on the kid link as it does for the parent: the first
  // lesson of the stage is the free taste, and the next one they have not
  // passed is always open so the path never stalls; beyond that, members.
  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at, email')
    .eq('id', link.user_id)
    .maybeSingle()
  const paid = hasFullAccess(
    parentProfile as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfile as { email?: string | null } | null)?.email,
  )

  // Passed, next, locked: from the one lesson count (lib/pathway/lesson-path),
  // the function the passport, the parent's page and the road all read. Until
  // 9 October 2026 this page kept its own: the child's rows only (so a pass a
  // grown up led for the family showed on the passport and not here), no
  // skipped lessons, and a lock rule of its own. The scores are display only
  // and still come from the child's own rows.
  const [{ modules: stageModules, path }, { data: completionRows }] = await Promise.all([
    loadChildLessonPath(supabase, { userId: link.user_id, childId: link.child_id, stageId, paid }),
    supabase.from('lesson_completions').select('lesson_id, score')
      .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('lesson_source', 'school_lesson'),
  ])
  const scoreOf = new Map(((completionRows ?? []) as { lesson_id: string; score: number | null }[]).map(c => [c.lesson_id, c.score]))
  const nextOpenId = path.school.next?.id ?? null

  // ONE A WEEK, SAID ON THE LIST (plan v10, 1.5). Only the week's lesson
  // opens. Inside seven days of a pass, a week's lesson with no mission yet
  // says the day it opens instead of offering a button the opener would
  // bounce; a mission that exists always opens (a retake, the week's own).
  const [{ data: missionRows }, { data: lastPassRow }] = await Promise.all([
    supabase.from('kid_lesson_missions').select('lesson_id').eq('child_id', link.child_id),
    supabase.from('lesson_completions').select('completed_at')
      .eq('user_id', link.user_id).eq('child_id', link.child_id).eq('lesson_source', 'school_lesson').eq('passed', true)
      .order('completed_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  const hasMission = new Set(((missionRows ?? []) as { lesson_id: string }[]).map(r => r.lesson_id))
  const lastPassAt = (lastPassRow as { completed_at?: string | null } | null)?.completed_at ?? null
  const weekOpen = !nextOpenId || hasMission.has(nextOpenId) || newMissionAllowed({
    lastPassAt, isFirstOfStage: stageModules[0]?.id === nextOpenId, isSkippedRestart: false,
  })
  const opensOn = lastPassAt
    ? new Date(Date.parse(lastPassAt) + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
    : null

  // The five a day's lesson row asks for the next one they have not passed, so
  // send them into it rather than showing a shelf to pick from. Falling through
  // to the list is the right answer when there is nothing left in the stage: a
  // child who has passed everything should see what they finished, not a
  // redirect to nowhere.

  const items: KidLessonItem[] = stageModules.map(m => {
    const state = path.statusById[m.id]?.state
    const done = state === 'passed'
    return {
      id: m.id,
      title: m.title,
      emoji: '🎬',
      keyMessage: (m as { single_action_outcome?: string | null }).single_action_outcome ?? '',
      done,
      score: done ? scoreOf.get(m.id) ?? null : null,
      locked: state === 'locked',
      waiting: state === 'thisWeek' && !weekOpen ? `One a week. This one opens on ${opensOn ?? 'your next lesson day'}.`
        : state === 'paced' && !hasMission.has(m.id) ? `After lesson ${stageModules.findIndex(x => x.id === m.id)}, this one is waiting for you`
        : null,
    }
  })

  // A planet that a lesson opened and the child has not flown to yet
  // (Planet Friends slice 3b). Best effort: a missing planet row or table
  // means no banner, never a broken list.
  let planetLine: { text: string; href: string } | null = null
  try {
    if (!PLANET_FRIENDS_LIVE) throw new Error('hidden')
    const [count, { data: planetRow }] = await Promise.all([
      lessonsPassedCount(supabase, link.child_id as string),
      supabase.from('planet_homes').select('state').eq('child_id', link.child_id).maybeSingle(),
    ])
    if (count !== null && planetRow?.state) {
      const fresh = newPlanets({ ...(planetRow.state as Home), lessonsPassed: count })
      if (fresh.length > 0) planetLine = { text: `${MAP_LINES.newWaiting} ${PLANET_WORDS[fresh[0]].title} is open.`, href: `/k/${token}/planet?go=map` }
    }
  } catch { /* the map says it on the next open */ }

  // The bar's Today entry, which is what replaces the KidTodayReturn pill that
  // used to float here. Two cheap reads that fail soft to an empty day.
  const todayState = await readTodayState(supabase, link.child_id)
  const todayTab = {
    left: todayState.left,
    total: todayState.steps.length,
    complete: todayState.complete,
    opened: todayState.done.length > 0,
  }

  return (
    <KidScreenChrome token={token} current="lessons" today={todayTab}>
    <KidLessonList
      planetLine={planetLine}
      theme={resolveTheme(child?.accent as string | null)}
      backHref={`/k/${token}`}
      childName={child?.name ?? 'Superstar'}
      stageName={stage.name}
      ages={stage.ages}
      items={items}
      hrefFor={id => `/k/${token}/school/${id}`}
      checkHref={`/k/${token}/quiz`}
      checkPassed={stageCheckPassed}
      together={isTogetherStage(stageId)}
    />
    </KidScreenChrome>
  )
}
