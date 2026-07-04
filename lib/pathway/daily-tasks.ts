import type { createClient } from '@/lib/supabase/server'
import { getRecommendedScript } from './recommend'
import type { StageId } from './progress'
import type { ChallengeId } from '@/lib/content/stages'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface DailyTask {
  key: 'moment' | 'script' | 'lesson' | 'device' | 'checkin'
  label: string
  detail: string
  href: string
  done: boolean
}

export interface TodayLoopTask {
  key: 'checkin' | 'moment' | 'script' | 'digi' | 'done'
  label: string
  href: string
  done: boolean
}

// Today's loop for the home path strip: the five nodes of the daily
// rhythm (check in, moment, script, DiGi, done), each resolved against
// real completion data for TODAY only. This is the seed of the full
// node path home: same shape, one day's slice.
export async function getTodayLoop(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null
): Promise<TodayLoopTask[]> {
  const today = new Date().toISOString().slice(0, 10)

  const [
    { data: pendingConcerns },
    { data: session },
    recommended,
    { data: scriptToday },
    { data: digiToday },
  ] = await Promise.all([
    // Concerns flagged before today that have not been checked today:
    // the same query the daily deck uses to build its check in card.
    supabase.from('concerns')
      .select('slug')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      .lt('last_flagged_at', today)
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      .limit(1),
    supabase.from('daily_sessions').select('completed_at, cards_completed').eq('user_id', userId).eq('session_date', today).maybeSingle(),
    getRecommendedScript(supabase, userId, stageId, challenge),
    supabase.from('script_completions').select('id').eq('user_id', userId).gte('completed_at', `${today}T00:00:00Z`).limit(1),
    supabase.from('digi_questions').select('id').eq('user_id', userId).gte('created_at', `${today}T00:00:00Z`).limit(1),
  ])

  const momentDone = !!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0)

  const tasks: TodayLoopTask[] = [
    {
      key: 'checkin',
      label: 'Check in',
      href: '/dashboard/daily',
      done: (pendingConcerns ?? []).length === 0,
    },
    {
      key: 'moment',
      label: 'Moment',
      href: '/dashboard/daily',
      done: momentDone,
    },
    {
      key: 'script',
      label: 'Script',
      href: recommended ? `/dashboard/scripts/${recommended.sort_order}` : '/dashboard/scripts',
      done: (scriptToday ?? []).length > 0,
    },
    {
      key: 'digi',
      label: 'DiGi',
      href: '/dashboard/digi',
      done: (digiToday ?? []).length > 0,
    },
  ]

  tasks.push({
    key: 'done',
    label: 'Done',
    href: '/dashboard/pathway',
    done: tasks.every(t => t.done),
  })

  return tasks
}

const STAGE_TO_AUDIENCE: Record<StageId, string> = {
  foundation: 'age_7',
  builder: 'age_9',
  explorer: 'age_11',
  shaper: 'age_13',
  independent: 'age_16',
}

const STAGE_DEVICE_MAX_AGE: Record<StageId, number> = {
  foundation: 7, builder: 10, explorer: 13, shaper: 15, independent: 99,
}

function mondayOf(d: Date): string {
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  const monday = new Date(d)
  monday.setUTCDate(d.getUTCDate() - diff)
  return monday.toISOString().slice(0, 10)
}

// The day's trail: five concrete tasks in walking order, each resolved
// against real completion data so DiGi can stand at the first one that is
// actually not done and name the exact next action, not a generic nudge.
export async function getDailyTasks(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  stageId: StageId,
  challenge: ChallengeId | null
): Promise<DailyTask[]> {
  const today = new Date().toISOString().slice(0, 10)
  const weekStart = mondayOf(new Date())

  const [
    { data: session },
    recommended,
    { data: scriptDoneToday },
    { data: stageLessons },
    { data: aiLessons },
    { data: lessonCompletions },
    { data: stageDevices },
    { data: deviceProgress },
    { data: checkin },
  ] = await Promise.all([
    supabase.from('daily_sessions').select('completed_at, cards_completed').eq('user_id', userId).eq('session_date', today).maybeSingle(),
    getRecommendedScript(supabase, userId, stageId, challenge),
    supabase.from('script_completions').select('id').eq('user_id', userId).gte('completed_at', `${today}T00:00:00Z`).limit(1),
    supabase.from('lessons').select('id, title').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, title').eq('audience', STAGE_TO_AUDIENCE[stageId]),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, name, min_age').lte('min_age', STAGE_DEVICE_MAX_AGE[stageId]).order('min_age', { ascending: true }),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    childId
      ? supabase.from('wellbeing_checks').select('id').eq('child_id', childId).eq('week_start', weekStart).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const momentDone = !!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0)

  const doneLessonKeys = new Set((lessonCompletions ?? []).map(c => `${c.lesson_source}:${c.lesson_id}`))
  const nextLesson =
    (stageLessons ?? []).find(l => !doneLessonKeys.has(`lesson:${l.id}`)) ??
    (aiLessons ?? []).find(l => !doneLessonKeys.has(`ai_lesson:${l.id}`))
  const nextLessonHref = nextLesson
    ? (stageLessons ?? []).some(l => l.id === nextLesson.id)
      ? `/dashboard/lessons/${nextLesson.id}`
      : `/dashboard/ai-module/${nextLesson.id}`
    : '/dashboard/ai-module'

  const setUpKeys = new Set((deviceProgress ?? []).map(d => d.device_key))
  const nextDevice = (stageDevices ?? []).find(d => !setUpKeys.has(d.device_key))

  return [
    {
      key: 'moment',
      label: 'Daily moments',
      detail: momentDone ? 'Done for today' : 'Two minutes, today’s cards',
      href: '/dashboard/daily',
      done: momentDone,
    },
    {
      key: 'script',
      label: recommended ? recommended.title : 'Scripts',
      detail: recommended
        ? 'Tonight’s script, picked for you'
        : 'Every script for this stage is read',
      href: recommended ? `/dashboard/scripts/${recommended.sort_order}` : '/dashboard/scripts',
      done: !recommended || (scriptDoneToday ?? []).length > 0,
    },
    {
      key: 'lesson',
      label: nextLesson ? nextLesson.title : 'Lessons',
      detail: nextLesson ? 'Your next lesson, about 3 minutes' : 'All lessons for this stage are done',
      href: nextLessonHref,
      done: !nextLesson,
    },
    {
      key: 'device',
      label: nextDevice ? `Set up ${nextDevice.name}` : 'Devices',
      detail: nextDevice ? 'Step by step, DiGi can walk you through it' : 'Every device for this stage is set up',
      href: '/dashboard/devices',
      done: !nextDevice,
    },
    {
      key: 'checkin',
      label: 'Weekly check in',
      detail: checkin ? 'Done for this week' : 'Five questions, once a week',
      href: '/dashboard/tracker',
      done: !!checkin,
    },
  ]
}
