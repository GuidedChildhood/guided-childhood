import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { freeLessonIds, nextOpenLessonId } from '@/lib/content/lesson-access'
import { hasFullAccess } from '@/lib/access'
import KidLessonList, { type KidLessonItem } from '@/components/kid/KidLessonList'

// My lessons: the child's own list of the age right stage lessons from the
// family library, opened from their quest link. No account, no login; the
// token scopes everything. The child takes the choice questions themselves
// and a pass lands in lesson_completions under the parent, so the parent
// side shows the same tick a sofa lesson would.

export const dynamic = 'force-dynamic'

const CATEGORY_EMOJI: Record<string, string> = {
  safety: '🛡️', screen_habits: '📱', wellbeing: '💛',
  online_risks: '🔍', ai_safety: '🤖', ai_literacy: '🤖',
}

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
    .select('name, age_band')
    .eq('id', link.child_id)
    .maybeSingle()
  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')

  // The child's stage lessons, and the whole parent lesson list so the free
  // taste per stage is worked out exactly like the parent hub does it.
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, stage_id, category, title, key_message, sort_order')
    .eq('audience', 'parent')
    .neq('status', 'stub')
    .order('sort_order', { ascending: true })
  const stageLessons = (allLessons ?? []).filter(l => l.stage_id === stage.name.toLowerCase())

  // The child's own one line per lesson. key_message is written for the grown
  // up on fifteen of these ("your child holds the keys to four doors"), and this
  // is the page where the child reads it about themselves. Asked for separately
  // and failing soft to an empty map, so before migration 156 the column is
  // simply absent and every lesson keeps the line it has today.
  const childLines = new Map<string, string>()
  {
    const { data } = await supabase
      .from('lessons')
      .select('id, child_key_message')
      .eq('audience', 'parent')
      .not('child_key_message', 'is', null)
    for (const r of data ?? []) {
      if (r.child_key_message) childLines.set(r.id as string, r.child_key_message as string)
    }
  }

  // Passes already on record for this family, columns fail soft: an older
  // database without the 079 pass columns just shows nothing as passed yet.
  let completions: { lesson_id: string; passed: boolean | null; score: number | null }[] = []
  {
    const { data, error } = await supabase
      .from('lesson_completions')
      .select('lesson_id, passed, score')
      .eq('user_id', link.user_id)
      .eq('lesson_source', 'lesson')
    if (!error) {
      completions = (data ?? []) as { lesson_id: string; passed: boolean | null; score: number | null }[]
    }
  }
  const byLesson = new Map(completions.map(c => [c.lesson_id, c]))

  // The paywall holds on the kid link exactly as it does for the parent:
  // one free taste per stage, everything open for members and trials, and a
  // lesson already opened by the family never re locks.
  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at, email')
    .eq('id', link.user_id)
    .maybeSingle()
  const paid = hasFullAccess(
    parentProfile as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfile as { email?: string | null } | null)?.email,
  )
  const freeIds = freeLessonIds((allLessons ?? []).map(l => ({ id: l.id, stage_id: l.stage_id, sort_order: l.sort_order })))
  // The child's next lesson in order is always open to them, so the drip never
  // stalls behind the paywall; the ones beyond it still wait for membership.
  const passedIds = new Set(stageLessons.filter(l => { const c = byLesson.get(l.id); return Boolean(c && c.passed !== false) }).map(l => l.id))
  const nextOpenId = nextOpenLessonId(stageLessons.map(l => ({ id: l.id, stage_id: l.stage_id, sort_order: l.sort_order })), passedIds)

  // The five a day's lesson row asks for the next one they have not passed, so
  // send them into it rather than showing a shelf to pick from. Falling through
  // to the list is the right answer when there is nothing left in the stage: a
  // child who has passed everything should see what they finished, not a
  // redirect to nowhere.
  if (wantsNext && nextOpenId) redirect(`/k/${token}/lessons/${nextOpenId}`)

  const items: KidLessonItem[] = stageLessons.map(l => {
    const c = byLesson.get(l.id)
    const done = Boolean(c && c.passed !== false)
    return {
      id: l.id,
      title: l.title,
      emoji: CATEGORY_EMOJI[l.category] ?? '📘',
      keyMessage: childLines.get(l.id) ?? l.key_message,
      done,
      score: done ? c?.score ?? null : null,
      locked: !paid && !freeIds.has(l.id) && !c && l.id !== nextOpenId,
    }
  })

  return (
    <KidLessonList
      backHref={`/k/${token}`}
      childName={child?.name ?? 'Superstar'}
      stageName={stage.name}
      ages={stage.ages}
      items={items}
      hrefFor={id => `/k/${token}/lessons/${id}`}
    />
  )
}
