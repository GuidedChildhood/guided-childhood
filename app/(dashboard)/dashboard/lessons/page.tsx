import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasFullAccess } from '@/lib/access'
import { freeLessonIds } from '@/lib/content/lesson-access'
import { getParentLessons, getCompletionsForChild, durationLabel } from '@/lib/lessons/parent-lessons'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { keyStageFor, strandFor } from '@/lib/content/curriculum-badges'
import { lessonCoverForTitle, lessonCoverForAiCategory } from '@/lib/content/lesson-covers'
import { PRINTABLES } from '@/lib/printables/registry'
import LessonsBrowser, { type WatchItem, type LibraryItem } from './LessonsBrowser'

// The Lessons hub: one place for every lesson type, split into three tidy
// views (Watch together films, the interactive Lessons library, and the
// paper Printables) so it never reads as one endless list. This page does
// the reads and hands flat, display ready arrays to the browser, which
// owns the segmented control and the stage filter.

export const metadata = { title: 'Lessons — Guided Childhood' }

const STAGE_META: Record<string, { num: number; label: string; ages: string }> = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above' },
}
const CATEGORY_LABEL: Record<string, string> = {
  screen_habits: 'Screen habits', safety: 'Safety', wellbeing: 'Wellbeing',
  online_risks: 'Online risks', ai_safety: 'AI safety', ai_literacy: 'AI literacy',
}
const AUDIENCE_TO_STAGE: Record<string, string> = {
  age_7: 'foundation', age_9: 'builder', age_11: 'explorer', age_13: 'shaper', age_16: 'independent',
}

// deep = the full seven beat Rosenshine deck (five or more slides). These are
// the qualifying route for a stage's stamp; the thinner lessons and the AI
// modules ride along as linked bonus. coverUrl is resolved here, where the raw
// title and AI category are both to hand, so every tile shows a real drawn
// badge rather than the fallback emoji.
type LessonRow = { id: string; stageKey: string; category: string; title: string; key_message: string; sort_order: number; source: 'lesson' | 'ai'; coverUrl: string | null; deep: boolean }

export default async function LessonsPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  // A ?stage=<1..5> deep link (from the passport rows and the road) opens the
  // library straight on that stage's route, so "Watch the lessons" lands
  // exactly where the work is, not on a generic all ages grid.
  const { stage: stageParam } = await searchParams
  const stageNum = Number(stageParam)
  const initialStage = Number.isInteger(stageNum) && stageNum >= 1 && stageNum <= 5 ? stageNum : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children').select('id, name, age_band').eq('parent_id', user.id).eq('is_primary', true).maybeSingle()
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
  const childStageNum = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2

  const [{ data: profile }, { data: lessonsData }, { data: aiLessonsData }, { data: completionsData }, watch, watchCompletions] = await Promise.all([
    supabase.from('profiles').select('full_name, subscription_status, trial_ends_at').eq('id', user.id).maybeSingle(),
    supabase.from('lessons').select('id, stage_id, category, title, key_message, sort_order, slides').eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, audience, category, title, key_message, sort_order').in('audience', ['age_7', 'age_9', 'age_11', 'age_13', 'age_16']).order('sort_order', { ascending: true }),
    supabase.from('lesson_completions').select('lesson_id, lesson_source, score, passed').eq('user_id', user.id).in('lesson_source', ['lesson', 'ai_lesson']),
    getParentLessons(supabase),
    child ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Map()),
  ])

  const isPaid = hasFullAccess(profile, user.email)

  // ── Interactive library, flattened for the browser ──
  const generalLessons: LessonRow[] = (lessonsData ?? []).map(l => {
    const slides = (l as { slides?: unknown }).slides
    const deep = Array.isArray(slides) && slides.length >= 5
    return { id: l.id, stageKey: l.stage_id, category: l.category, title: l.title, key_message: l.key_message, sort_order: l.sort_order, source: 'lesson' as const, coverUrl: lessonCoverForTitle(l.title), deep }
  })
  const aiLessons: LessonRow[] = (aiLessonsData ?? []).map(l => ({ id: l.id, stageKey: AUDIENCE_TO_STAGE[l.audience], category: 'ai_literacy', title: l.title, key_message: l.key_message, sort_order: l.sort_order, source: 'ai' as const, coverUrl: lessonCoverForAiCategory(l.category) ?? lessonCoverForTitle(l.title), deep: false }))
  const allLessons = [...generalLessons, ...aiLessons]
  const freeIds = freeLessonIds(generalLessons.map(l => ({ ...l, stage_id: l.stageKey })))
  // A lesson shows as done once its end of lesson check was passed; a failed
  // run stays open to retake. Any completion, passed or not, keeps a lesson
  // unlocked so a near miss never re-locks a lesson already opened.
  const completedLessonIds = new Set((completionsData ?? []).filter(c => c.lesson_source === 'lesson').map(c => c.lesson_id))
  const passedScore = (src: 'lesson' | 'ai_lesson') =>
    new Map((completionsData ?? []).filter(c => c.lesson_source === src && c.passed !== false).map(c => [c.lesson_id, c.score as number | null]))
  const passedLessons = passedScore('lesson')
  const passedAi = passedScore('ai_lesson')
  // A genuine attempt that did not pass: the lesson reads as "attempted, retake"
  // rather than fresh, so a near miss is honest and inviting.
  const attemptedSet = (src: 'lesson' | 'ai_lesson') =>
    new Set((completionsData ?? []).filter(c => c.lesson_source === src && c.passed === false).map(c => c.lesson_id))
  const attemptedLessons = attemptedSet('lesson')
  const attemptedAi = attemptedSet('ai_lesson')

  const libraryItems: LibraryItem[] = allLessons
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(l => {
      const meta = STAGE_META[l.stageKey]
      const passMap = l.source === 'ai' ? passedAi : passedLessons
      const attemptedSetForSrc = l.source === 'ai' ? attemptedAi : attemptedLessons
      const done = passMap.has(l.id)
      const attempted = !done && attemptedSetForSrc.has(l.id)
      const locked = l.source === 'lesson' && !isPaid && !freeIds.has(l.id) && !completedLessonIds.has(l.id)
      return {
        id: `${l.source}-${l.id}`,
        href: l.source === 'ai' ? `/dashboard/ai-module/${l.id}` : `/dashboard/lessons/${l.id}`,
        stageNum: meta?.num ?? 2, stageLabel: meta?.label ?? '', stageAges: meta?.ages ?? '',
        categoryLabel: CATEGORY_LABEL[l.category] ?? l.category,
        title: l.title, keyMessage: l.key_message, locked, done, attempted,
        score: done ? passMap.get(l.id) ?? null : null,
        ks: keyStageFor(l.stageKey), strand: strandFor(l.category),
        coverUrl: l.coverUrl, deep: l.deep,
      }
    })
    .filter(l => l.stageNum)

  // ── Watch together films, flattened ──
  const { lessons: watchLessons, segmentsByLesson } = watch
  const watchItems: WatchItem[] = watchLessons.map(l => ({
    code: l.lesson_code, stageNum: l.stage_id, stageName: '', title: l.title,
    catchphrase: l.catchphrase, strand: l.strand, posterUrl: l.poster_url,
    journeyStep: l.journey_step, duration: durationLabel(segmentsByLesson.get(l.id)),
    done: watchCompletions.has(l.lesson_code),
  }))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 48px' }}>
      <div style={{ marginBottom: '4px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Every lesson, one place</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>Lessons</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.6, marginBottom: '14px' }}>
          Films to watch with {childName}, lessons you lead, and sheets to print. Switch between them below.
        </p>
      </div>

      <LessonsBrowser
        childId={child?.id ?? null}
        childName={childName}
        childStageNum={childStageNum}
        watchItems={watchItems}
        libraryItems={libraryItems}
        printables={PRINTABLES}
        isPaid={isPaid}
        initialStage={initialStage}
        initialView={initialStage ? 'library' : undefined}
      />
    </div>
  )
}
