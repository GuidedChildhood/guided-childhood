import { notFound } from 'next/navigation'
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

export default async function KidLessonsPage({ params }: { params: Promise<{ token: string }> }) {
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

  const items: KidLessonItem[] = stageLessons.map(l => {
    const c = byLesson.get(l.id)
    const done = Boolean(c && c.passed !== false)
    return {
      id: l.id,
      title: l.title,
      emoji: CATEGORY_EMOJI[l.category] ?? '📘',
      keyMessage: l.key_message,
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
