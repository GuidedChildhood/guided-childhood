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
  // The stamp is earned when the stage's real tasks, its lessons and scripts,
  // are all done. Deliberately not gated on a four week streak, so completing
  // the content a parent can actually finish is what fills and earns the
  // stamp. The streak and devices still lift the ring, they just do not block
  // the badge.
  contentComplete: boolean
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
    supabase.from('lessons').select('id').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub'),
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

  const totalContent = stageScriptOrders.size + totalLessonsInStage
  const doneContent = completedInStage + lessonsDone
  const contentComplete = totalContent > 0 && doneContent === totalContent

  return { scriptsPct, streakPct, devicesPct, lessonsPct, overallPct, contentComplete }
}

export function nextStageId(current: StageId): StageId | null {
  const idx = STAGE_ORDER.indexOf(current)
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null
}

// All five stages' progress in one pass, for the passport. getStageProgress is
// perfect for one stage but runs seven queries; calling it five times would be
// thirty five. This fetches the raw rows once and computes every stage in
// memory, so the passport is cheap. The number per stage matches
// getStageProgress exactly: the blend of scripts, streak, devices and lessons.
export async function getAllStagesProgress(
  supabase: SupabaseClient,
  userId: string,
  streakWeeks: number,
): Promise<Record<StageId, StageProgress>> {
  const [
    { data: scripts },
    { data: completedScripts },
    { data: deviceGuides },
    { data: deviceProgress },
    { data: lessons },
    { data: aiLessons },
    { data: lessonCompletions },
  ] = await Promise.all([
    supabase.from('scripts').select('sort_order, stage_id'),
    supabase.from('script_completions').select('script_sort_order').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, min_age'),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    supabase.from('lessons').select('id, stage_id').eq('audience', 'parent').neq('status', 'stub'),
    supabase.from('ai_lessons').select('id, audience'),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
  ])

  const completedScriptOrders = new Set((completedScripts ?? []).map(c => c.script_sort_order))
  const completedDeviceKeys = new Set((deviceProgress ?? []).map(d => d.device_key))
  const completedLessonKeys = new Set((lessonCompletions ?? []).map(c => `${c.lesson_source}:${c.lesson_id}`))
  const streakPct = Math.min(Math.round((streakWeeks / 4) * 100), 100)

  const out = {} as Record<StageId, StageProgress>
  for (const stageId of STAGE_ORDER) {
    const stageScripts = (scripts ?? []).filter(s => s.stage_id === stageId)
    const scriptsDone = stageScripts.filter(s => completedScriptOrders.has(s.sort_order)).length
    const scriptsPct = stageScripts.length > 0 ? Math.round((scriptsDone / stageScripts.length) * 100) : 0

    const devicesInStage = (deviceGuides ?? []).filter(d => deviceAgeToStage(d.min_age) === stageId)
    const devicesDone = devicesInStage.filter(d => completedDeviceKeys.has(d.device_key)).length
    const devicesPct = devicesInStage.length > 0 ? Math.round((devicesDone / devicesInStage.length) * 100) : 0

    const stageLessons = (lessons ?? []).filter(l => l.stage_id === stageId)
    const aiInStage = (aiLessons ?? []).filter(l => AUDIENCE_TO_STAGE[l.audience] === stageId)
    const totalLessons = stageLessons.length + aiInStage.length
    const lessonsDone =
      stageLessons.filter(l => completedLessonKeys.has(`lesson:${l.id}`)).length +
      aiInStage.filter(l => completedLessonKeys.has(`ai_lesson:${l.id}`)).length
    const lessonsPct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0

    const totalContent = stageScripts.length + stageLessons.length + aiInStage.length
    const doneContent = scriptsDone + lessonsDone
    out[stageId] = {
      scriptsPct, streakPct, devicesPct, lessonsPct,
      overallPct: Math.round((scriptsPct + streakPct + devicesPct + lessonsPct) / 4),
      contentComplete: totalContent > 0 && doneContent === totalContent,
    }
  }
  return out
}
