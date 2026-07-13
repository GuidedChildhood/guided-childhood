import type { createClient } from '@/lib/supabase/server'
import type { StageId } from './progress'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// The journey: the three strands of the pathway resolved into real counts
// and the one next thing for each. Devices set up, moments worked through,
// lessons done. This is what the single spine pathway renders, so a parent
// sees one clear next step instead of a pile of separate features.

const AUDIENCE_TO_STAGE: Record<string, StageId> = {
  age_7: 'foundation', age_9: 'builder', age_11: 'explorer', age_13: 'shaper', age_16: 'independent',
}
function deviceAgeToStage(minAge: number): StageId {
  if (minAge <= 7) return 'foundation'
  if (minAge <= 10) return 'builder'
  if (minAge <= 13) return 'explorer'
  if (minAge <= 15) return 'shaper'
  return 'independent'
}

export interface Journey {
  devices: { done: number; total: number; nextName: string | null; href: string }
  moments: { open: number; topLabel: string | null; href: string }
  lessons: { done: number; total: number; nextTitle: string | null; href: string }
}

export async function getJourney(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId
): Promise<Journey> {
  const [
    { data: deviceGuides },
    { data: deviceProgress },
    { data: concerns },
    { data: stageLessons },
    { data: aiLessons },
    { data: lessonCompletions },
  ] = await Promise.all([
    supabase.from('device_guides').select('device_key, name, min_age').order('min_age', { ascending: true }),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    supabase.from('concerns').select('label, times_flagged').eq('user_id', userId).in('status', ['open', 'improving']).order('times_flagged', { ascending: false }).limit(1),
    supabase.from('lessons').select('id, title').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, title, audience').in('audience', ['age_7', 'age_9', 'age_11', 'age_13', 'age_16']).order('sort_order', { ascending: true }),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
  ])

  // Devices for this stage, by age bucket
  const devicesInStage = (deviceGuides ?? []).filter(d => deviceAgeToStage(d.min_age) === stageId)
  const doneKeys = new Set((deviceProgress ?? []).map(d => d.device_key))
  const devicesDone = devicesInStage.filter(d => doneKeys.has(d.device_key))
  const nextDevice = devicesInStage.find(d => !doneKeys.has(d.device_key))

  // Moments, the live concerns
  const openConcerns = concerns ?? []

  // Lessons for this stage: general plus ai, next uncompleted, in order
  const aiInStage = (aiLessons ?? []).filter(l => AUDIENCE_TO_STAGE[l.audience] === stageId)
  const doneLessonKeys = new Set((lessonCompletions ?? []).map(c => `${c.lesson_source}:${c.lesson_id}`))
  const totalLessons = (stageLessons?.length ?? 0) + aiInStage.length
  const lessonsDone =
    (stageLessons ?? []).filter(l => doneLessonKeys.has(`lesson:${l.id}`)).length +
    aiInStage.filter(l => doneLessonKeys.has(`ai_lesson:${l.id}`)).length
  const nextGeneral = (stageLessons ?? []).find(l => !doneLessonKeys.has(`lesson:${l.id}`))
  const nextAi = aiInStage.find(l => !doneLessonKeys.has(`ai_lesson:${l.id}`))
  const nextLessonTitle = nextGeneral?.title ?? nextAi?.title ?? null
  const nextLessonHref = nextGeneral
    ? `/dashboard/lessons/${nextGeneral.id}`
    : nextAi
    ? `/dashboard/ai-module/${nextAi.id}`
    : '/dashboard/lessons'

  return {
    devices: {
      done: devicesDone.length,
      total: devicesInStage.length,
      nextName: nextDevice?.name ?? null,
      href: '/dashboard/devices',
    },
    moments: {
      open: openConcerns.length,
      topLabel: openConcerns[0]?.label ?? null,
      href: '/dashboard/daily',
    },
    lessons: {
      done: lessonsDone,
      total: totalLessons,
      nextTitle: nextLessonTitle,
      href: nextLessonHref,
    },
  }
}
