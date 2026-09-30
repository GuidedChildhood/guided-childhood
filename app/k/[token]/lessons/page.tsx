import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import KidScreenChrome from '@/components/kid/KidScreenChrome'
import { readTodayState } from '@/lib/kid/today-state'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { listStarLessons } from '@/lib/quests/star-lesson-catalogue'
import { schoolModulesForStage, isTogetherStage } from '@/lib/lessons/school-path'
import type { StageId } from '@/lib/pathway/progress'
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
  const wantsNext = (await searchParams)?.next === '1'
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
    .select('name, age_band, accent')
    .eq('id', link.child_id)
    .maybeSingle()
  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  // THE SCHOOL VERSION (29 September 2026). Justin chose "the child learns,
  // the parent closes it": this list is the school modules for the child's
  // stage (lib/lessons/school-path), not the parent library, which is written
  // to grown ups. Each opens through /k/[token]/school/[id], which reuses the
  // star lesson player, stars and push, and its pass ticks the passport.
  const stageId = stage.name.toLowerCase() as StageId
  const allModules = await listStarLessons(supabase)
  const stageModules = schoolModulesForStage(allModules, stageId)

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

  // This child's school lesson passes. Scoped to the child, because the
  // passport that reads the same rows is scoped to the child.
  const { data: completionRows } = await supabase
    .from('lesson_completions')
    .select('lesson_id, passed, score')
    .eq('user_id', link.user_id)
    .eq('child_id', link.child_id)
    .eq('lesson_source', 'school_lesson')
  const byLesson = new Map(((completionRows ?? []) as { lesson_id: string; passed: boolean | null; score: number | null }[]).map(c => [c.lesson_id, c]))

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
  const isPassed = (id: string) => byLesson.get(id)?.passed === true
  const nextOpenId = stageModules.find(m => !isPassed(m.id))?.id ?? null

  // The five a day's lesson row asks for the next one they have not passed, so
  // send them into it rather than showing a shelf to pick from. Falling through
  // to the list is the right answer when there is nothing left in the stage: a
  // child who has passed everything should see what they finished, not a
  // redirect to nowhere.
  if (wantsNext && nextOpenId) redirect(`/k/${token}/school/${nextOpenId}`)

  const items: KidLessonItem[] = stageModules.map((m, i) => {
    const c = byLesson.get(m.id)
    const done = c?.passed === true
    return {
      id: m.id,
      title: m.title,
      emoji: '🎬',
      keyMessage: m.single_action_outcome ?? '',
      done,
      score: done ? c?.score ?? null : null,
      locked: !paid && i > 0 && !c && m.id !== nextOpenId,
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
