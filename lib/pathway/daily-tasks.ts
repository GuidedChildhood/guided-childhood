import type { createClient } from '@/lib/supabase/server'
import { getRecommendedScript, type RecommendedScript } from './recommend'
import { isScriptLocked } from '@/lib/content/free-script-limit'
import type { StageId } from './progress'
import type { ChallengeId } from '@/lib/content/stages'
import { londonToday, londonDayStart } from '@/lib/pathway/today'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface DailyTask {
  key: 'moment' | 'script' | 'lesson' | 'device' | 'checkin'
  label: string
  detail: string
  href: string
  done: boolean
}

export interface TodayLoopTask {
  key: 'checkin' | 'setup' | 'moment' | 'script' | 'quests' | 'digi' | 'done'
  label: string
  href: string
  done: boolean
}

// ── TODAY. THE ORDER IS THE DESIGN. ─────────────────────────────────────────
//
// Justin, 13 August 2026: "check in is different from moments so should be
// check in, set up (which stays until all ticked), then moments, then scripts,
// then set up quests for device use."
//
// So the day runs:
//
//   1  CHECK IN     how it is going, and on day one where things are now. It
//                   leads because it is the only step that measures anything,
//                   and the first one is the baseline everything later is read
//                   against. Its own page now, never the moments deck.
//   2  SET UP       and it STAYS until every step is ticked. A half set up
//                   family is the single biggest reason this product does not
//                   work for somebody, and setup was a card competing with
//                   everything else on Home rather than a rung on the road.
//   3  MOMENT       what actually happened today.
//   4  SCRIPT       the words for tonight.
//   5  QUESTS       the jobs that earn the screen time, which is what device
//                   use runs on. Whichever is live: no jobs yet, set the
//                   first; anything waiting from the child, approve it.
//   6  DIGI         first day only. See below.
//
// It is called Today, which is the name Justin picked on 13 August over
// "to do list", because a to do list is a chores app and this is the one
// question the product answers: what am I doing today.
// A free account must never be routed from "the words for tonight" into
// the script reader's paywall redirect. Prefer a free script, then check
// the weekly allowance; if even that is spent, the honest link is the
// scripts list, where locked cards say so up front.
async function safeScriptHref(
  supabase: SupabaseClient,
  userId: string,
  isPaid: boolean,
  recommended: RecommendedScript | null
): Promise<string> {
  if (!recommended) return '/dashboard/scripts'
  if (isPaid) return `/dashboard/scripts/${recommended.sort_order}`
  const locked = await isScriptLocked(supabase, userId, false, recommended)
  return locked ? '/dashboard/scripts' : `/dashboard/scripts/${recommended.sort_order}`
}

export async function getTodayLoop(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null,
  isPaid = true,
  /**
   * Their first ever check in, from profiles.first_checkin_at. Null means it
   * has never happened, which is what puts the baseline at the front of the
   * loop. Passed in rather than read here because the dashboard already has
   * the profile row in hand and this runs on every open.
   */
  firstCheckInAt: string | null = null,
  /**
   * Setup, from the dashboard's own flags. Null when it is finished, in which
   * case the step drops off the road for good. Passed in because the page
   * already computes it for SetupPath and the two must never disagree.
   */
  setupNextStep: string | null = null,
): Promise<TodayLoopTask[]> {
  const today = londonToday()
  // The instant today began in London, not UTC midnight. Through British summer
  // time the two are an hour apart, so a step completed between midnight and
  // 1am counted for the day before and the parent was told to do it again.
  const dayStart = londonDayStart()

  const [
    { data: pendingConcerns },
    { data: session },
    recommended,
    { data: scriptToday },
    { data: digiToday },
    { data: momentCompletionsToday },
    { data: anyConcerns },
    { count: questCount },
    { count: ticksWaiting },
    { count: asksWaiting },
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
    getRecommendedScript(supabase, userId, stageId, challenge, { preferFree: !isPaid }),
    supabase.from('script_completions').select('id').eq('user_id', userId).gte('completed_at', dayStart).limit(1),
    supabase.from('digi_questions').select('id').eq('user_id', userId).gte('created_at', dayStart).limit(1),
    supabase.from('moment_completions').select('id').eq('user_id', userId).eq('completed_on', today).limit(1),
    // Whether this family has ANY live concern at all. Nothing to check in on
    // is not the same thing as having checked in, and only one of those two is
    // worth a tick. See the comment where the step is built.
    supabase.from('concerns').select('slug').eq('user_id', userId).in('status', ['open', 'improving']).limit(1),
    // The quests step decides between "set the first job" and "approve what is
    // waiting", so it needs both. Head counts, in the wave that was already
    // going, so this costs no extra round trip. The same two tables the nav
    // badge counts, so the rung and the red number can never disagree.
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('active', true),
    supabase.from('quest_ticks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending'),
    supabase.from('quest_requests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending'),
  ])

  const anyQuests = (questCount ?? 0) > 0
  const questsWaiting = (ticksWaiting ?? 0) + (asksWaiting ?? 0)

  const scriptHref = await safeScriptHref(supabase, userId, isPaid, recommended)
  // Doing a moment counts whether it came from the daily deck (a session) or
  // from reading a card in the library (a completion), so the step ticks either
  // way and never looks stuck.
  const momentDone = (!!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0))
    || (momentCompletionsToday ?? []).length > 0

  // The check in only belongs on today's loop when there is something to check
  // in ON. It used to be done whenever no concern was waiting, which is true
  // from the very first minute of a brand new account, so every parent who had
  // never flagged a concern opened Home to a green tick against a step they
  // had never touched. An empty list means nothing to do, not done, and only
  // one of those two deserves a tick. So: no live concerns, no step.
  const hasLiveConcerns = (anyConcerns ?? []).length > 0

  // ── EXCEPT THE VERY FIRST ONE, WHICH IS THE BASELINE ──────────────────────
  //
  // Justin, 12 August 2026: "Should be first task, not sure why check in was
  // not there? First ever time could set the baseline."
  //
  // He is right and the rule above is also right, because they are answering
  // different questions. A check in on nothing is meaningless, and the FIRST
  // one is not a check in on anything: it is where the numbers on the journey
  // come from, the "8 at the start" that makes "9 now" mean something. A
  // family that never does one has nothing to measure against for as long as
  // they stay, and the whole what is working page is empty for them for ever.
  //
  // So day one it leads, framed as where are things now rather than as a
  // review of concerns that do not exist yet. After that the existing rule is
  // right and stays exactly as it was.
  //
  // It is also what opens the two doors, so this is the step that decides
  // whether anybody is ever asked to pay. See lib/access.ts.
  const neverCheckedIn = !firstCheckInAt

  const tasks: TodayLoopTask[] = [
    ...(hasLiveConcerns || neverCheckedIn ? [{
      key: 'checkin' as const,
      label: neverCheckedIn ? 'Where things are now' : 'Check in',
      href: '/dashboard/checkin',
      // Never checked in is never done, whatever the concern list says. The
      // baseline is a thing that has happened or has not.
      //
      // Otherwise a real reading: they have concerns, and none is still
      // waiting on them today, so the tick was genuinely earned.
      done: neverCheckedIn ? false : (pendingConcerns ?? []).length === 0,
    }] : []),
    // ── SETUP, AND IT STAYS UNTIL IT IS ALL TICKED ─────────────────────────
    //
    // Justin: "then set up for first time until all green and continue set up
    // appear every day on the to do list."
    //
    // A rung rather than a card, because a card on Home competes with
    // everything else on Home and setup is the thing that decides whether any
    // of the rest works. It disappears for good the moment the last step goes
    // green, so it can never become furniture.
    ...(setupNextStep ? [{
      key: 'setup' as const,
      label: 'Set up',
      href: '/dashboard/setup',
      // Never done while a step is outstanding. That is the whole point of it
      // staying: a half green road is an honest one.
      done: false,
    }] : []),
    {
      key: 'moment',
      label: 'Moment',
      href: '/dashboard/daily',
      done: momentDone,
    },
    {
      key: 'script',
      label: 'Script',
      href: scriptHref,
      done: (scriptToday ?? []).length > 0,
    },
    // ── QUESTS: WHICHEVER IS LIVE, IN THIS ORDER ───────────────────────────
    //
    // Justin asked whether this step is adding the first job or approving what
    // is outstanding, and the answer he picked is both, in that order. A family
    // with no jobs cannot approve anything, and a family whose child has ticked
    // something has a real person waiting on them, which beats housekeeping.
    //
    // The same order the Home card already uses, so the two surfaces can never
    // tell a parent different things about their own quests.
    {
      key: 'quests',
      label: !anyQuests ? 'First job' : questsWaiting > 0 ? 'Approve' : 'Quests',
      href: !anyQuests ? '/dashboard/quests' : '/dashboard/quests#quest-board',
      // Nothing waiting and jobs already set is a genuinely finished step.
      // No jobs at all is never done, because that is the thing the whole star
      // system runs on and a tick against it would be a lie.
      done: anyQuests && questsWaiting === 0,
    },
    // ── DIGI, ON THE FIRST DAY ONLY ────────────────────────────────────────
    //
    // Justin, 13 August 2026: "I think it's useful to have there if only the
    // first ever today so they are aware of it."
    //
    // Exactly right, and it is an introduction rather than a task. DiGi is on
    // the tab bar and behind the Help now button every day for ever, so a
    // standing rung that says "talk to DiGi" is an invitation pretending to be
    // a step, and every other rung here is a concrete thing with an end. On
    // day one it is neither: it is how a parent finds out DiGi is there at all.
    //
    // Keyed off the same first check in stamp as the baseline, so the whole of
    // day one hangs on one timestamp rather than two different ideas of new.
    ...(neverCheckedIn ? [{
      key: 'digi' as const,
      label: 'Meet DiGi',
      href: '/dashboard/digi',
      done: (digiToday ?? []).length > 0,
    }] : []),
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
  challenge: ChallengeId | null,
  isPaid = true
): Promise<DailyTask[]> {
  const today = londonToday()
  // The instant today began in London, not UTC midnight. Through British summer
  // time the two are an hour apart, so a step completed between midnight and
  // 1am counted for the day before and the parent was told to do it again.
  const dayStart = londonDayStart()
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
    { data: momentCompletionsToday },
  ] = await Promise.all([
    supabase.from('daily_sessions').select('completed_at, cards_completed').eq('user_id', userId).eq('session_date', today).maybeSingle(),
    getRecommendedScript(supabase, userId, stageId, challenge, { preferFree: !isPaid }),
    supabase.from('script_completions').select('id').eq('user_id', userId).gte('completed_at', dayStart).limit(1),
    supabase.from('lessons').select('id, title').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, title').eq('audience', STAGE_TO_AUDIENCE[stageId]),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, name, min_age').lte('min_age', STAGE_DEVICE_MAX_AGE[stageId]).order('min_age', { ascending: true }),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    childId
      ? supabase.from('wellbeing_checks').select('id').eq('child_id', childId).eq('week_start', weekStart).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('moment_completions').select('id').eq('user_id', userId).eq('completed_on', today).limit(1),
  ])

  const momentDone = (!!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0))
    || (momentCompletionsToday ?? []).length > 0

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
      href: await safeScriptHref(supabase, userId, isPaid, recommended),
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
      href: '/dashboard/pathway',
      done: !!checkin,
    },
  ]
}
