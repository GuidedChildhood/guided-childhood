import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { parseSlides, autoSlidesFromLesson } from '@/lib/content/lesson-slides'
import { badgesFor } from '@/lib/content/curriculum-badges'
import { freeLessonIds, nextOpenLessonId } from '@/lib/content/lesson-access'
import { hasFullAccess } from '@/lib/access'
import LessonPlayer from '@/components/lessons/LessonPlayer'

// A family lesson, taken by the child themselves: the SAME cinematic player
// the parent side uses, as a light full screen takeover over the kid app.
// The token is the auth, the child takes the choice questions, and the pass
// writes through the token route into lesson_completions under the parent,
// so the parent's ticks light up exactly like a together pass.

export const dynamic = 'force-dynamic'

const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

export default async function KidStageLessonPage({ params }: { params: Promise<{ token: string; lessonId: string }> }) {
  const { token, lessonId } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  if (!/^[0-9a-f-]{36}$/.test(lessonId)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const [{ data: child }, { data: lesson }] = await Promise.all([
    supabase.from('children').select('age_band').eq('id', link.child_id).maybeSingle(),
    supabase.from('lessons')
      .select('id, stage_id, category, title, the_idea, why_it_matters, try_this, key_message, sort_order, status, audience, slides')
      .eq('id', lessonId)
      .maybeSingle(),
  ])
  if (!lesson || lesson.audience !== 'parent' || lesson.status === 'stub') notFound()

  // Age gate, forward only: the child can open their own stage and earlier
  // ones, never ahead of their age.
  const stage = getStageFromAgeBand((child?.age_band as AgeBand | null) ?? '8-10')
  const lessonStageNum = STAGE_NUM[lesson.stage_id] ?? 99
  if (lessonStageNum > stage.id) notFound()

  // The paywall holds here too: one free taste per stage unless the family
  // is a member or a completion already opened this lesson.
  const [{ data: parentProfile }, { data: stageList }, { data: allCompletions }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, email').eq('id', link.user_id).maybeSingle(),
    supabase.from('lessons').select('id, stage_id, sort_order').eq('audience', 'parent').neq('status', 'stub'),
    supabase.from('lesson_completions').select('lesson_id, passed').eq('user_id', link.user_id).eq('lesson_source', 'lesson'),
  ])
  const paid = hasFullAccess(
    parentProfile as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfile as { email?: string | null } | null)?.email,
  )
  const freeIds = freeLessonIds((stageList ?? []) as { id: string; stage_id: string; sort_order: number }[])
  // The child's next unpassed lesson in this stage is always open to them, so
  // the drip never dead ends at the paywall; the ones past it still wait for
  // membership. A lesson they have already opened never re locks.
  const openedThis = (allCompletions ?? []).some(c => c.lesson_id === lessonId)
  const passedIds = new Set((allCompletions ?? []).filter(c => c.passed !== false).map(c => c.lesson_id as string))
  const stageLessonsForStage = ((stageList ?? []) as { id: string; stage_id: string; sort_order: number }[]).filter(l => l.stage_id === lesson.stage_id)
  const nextOpenId = nextOpenLessonId(stageLessonsForStage, passedIds)
  if (!paid && !freeIds.has(lesson.id) && !openedThis && lesson.id !== nextOpenId) redirect(`/k/${token}/lessons`)

  const rawSlides = parseSlides(lesson.slides) ?? autoSlidesFromLesson(lesson)
  if (!rawSlides) notFound()
  // The kid client never receives the teacher script channel.
  const slides = rawSlides.map(s => {
    const copy = { ...s }
    delete (copy as { script?: string }).script
    return copy
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)' }}>
      <LessonPlayer
        lessonId={lesson.id}
        lessonSource="lesson"
        slides={slides}
        backHref={`/k/${token}/lessons`}
        homeHref={`/k/${token}`}
        kidMode
        completeEndpoint="/api/kid/lesson-complete"
        completeBody={{ token }}
        badges={badgesFor(lesson.stage_id, lesson.category)}
      />
    </div>
  )
}
