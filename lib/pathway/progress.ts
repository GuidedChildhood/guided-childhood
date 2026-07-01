import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type StageId = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

const AUDIENCE_TO_STAGE: Record<string, StageId> = {
  age_7: 'foundation',
  age_9: 'builder',
  age_11: 'explorer',
  age_13: 'shaper',
  age_16: 'independent',
}

function deviceAgeToStage(minAge: number): StageId {
  if (minAge <= 7) return 'foundation'
  if (minAge <= 10) return 'builder'
  if (minAge <= 13) return 'explorer'
  if (minAge <= 15) return 'shaper'
  return 'independent'
}

export interface StageProgress {
  scriptsPct: number
  streakPct: number
  devicesPct: number
  lessonsPct: number
  overallPct: number
}

// Blends four independent signals into one progress number per stage:
// scripts actually read, the daily practice streak, devices set up for
// that age, and lessons marked done. Each was previously tracked in
// isolation with no combined view anywhere in the app.
export async function getStageProgress(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  streakWeeks: number
): Promise<StageProgress> {
  const [
    { data: stageScripts },
    { data: userCompletedScripts },
    { data: stageDeviceGuides },
    { data: deviceProgress },
    { data: lessonsForStage },
    { data: aiLessonsAll },
    { data: lessonCompletions },
  ] = await Promise.all([
    supabase.from('scripts').select('sort_order').eq('stage_id', stageId),
    supabase.from('script_completions').select('script_sort_order').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, min_age'),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    supabase.from('lessons').select('id').eq('stage_id', stageId).eq('audience', 'parent'),
    supabase.from('ai_lessons').select('id, audience').in('audience', ['age_7', 'age_9', 'age_11', 'age_13', 'age_16']),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
  ])

  // Scripts: how many of this stage's scripts has this user actually completed.
  const stageScriptOrders = new Set((stageScripts ?? []).map(s => s.sort_order))
  const completedInStage = (userCompletedScripts ?? []).filter(c => stageScriptOrders.has(c.script_sort_order)).length
  const scriptsPct = stageScriptOrders.size > 0 ? Math.round((completedInStage / stageScriptOrders.size) * 100) : 0

  // Streak: consistency credit, caps out at 4 weeks so it does not require
  // a permanent streak to ever show full marks.
  const streakPct = Math.min(Math.round((streakWeeks / 4) * 100), 100)

  // Devices: bucket each device guide to a stage by its minimum age, then
  // check completion against only the devices that belong to this stage.
  const devicesInStage = (stageDeviceGuides ?? []).filter(d => deviceAgeToStage(d.min_age) === stageId)
  const completedDeviceKeys = new Set((deviceProgress ?? []).map(d => d.device_key))
  const devicesDoneInStage = devicesInStage.filter(d => completedDeviceKeys.has(d.device_key)).length
  const devicesPct = devicesInStage.length > 0 ? Math.round((devicesDoneInStage / devicesInStage.length) * 100) : 0

  // Lessons: combine the general lessons table (already stage scoped) with
  // ai_lessons (audience scoped, mapped to stage), then check completion.
  const aiLessonsInStage = (aiLessonsAll ?? []).filter(l => AUDIENCE_TO_STAGE[l.audience] === stageId)
  const totalLessonsInStage = (lessonsForStage?.length ?? 0) + aiLessonsInStage.length
  const completedLessonKeys = new Set((lessonCompletions ?? []).map(c => `${c.lesson_source}:${c.lesson_id}`))
  const lessonsDone =
    (lessonsForStage ?? []).filter(l => completedLessonKeys.has(`lesson:${l.id}`)).length +
    aiLessonsInStage.filter(l => completedLessonKeys.has(`ai_lesson:${l.id}`)).length
  const lessonsPct = totalLessonsInStage > 0 ? Math.round((lessonsDone / totalLessonsInStage) * 100) : 0

  const overallPct = Math.round((scriptsPct + streakPct + devicesPct + lessonsPct) / 4)

  return { scriptsPct, streakPct, devicesPct, lessonsPct, overallPct }
}

export function nextStageId(current: StageId): StageId | null {
  const idx = STAGE_ORDER.indexOf(current)
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null
}
