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
  key: 'checkin' | 'setup' | 'moment' | 'agreement' | 'script' | 'quests' | 'passport' | 'digi' | 'done'
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
  /**
   * The passport's five section readings, already built by the dashboard for
   * PassportToDo. Passed in rather than rebuilt here for the same reason
   * setupNextStep is: two readings of the same thing is two readings that can
   * disagree, and the rung must say what the passport page says. Null when the
   * family has no stage yet, which keeps the rung off the road.
   */
  passportSections: { pct: number }[] | null = null,
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
    { data: scoredToday },
    { data: agreementRow },
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
    // Whether this family has ANY live concern at all, AND WHOSE.
    //
    // Nothing to check in on is not the same thing as having checked in, and
    // only one of those two is worth a tick. child_id joined the select on 15
    // August 2026 so the rung can tell a family who have finished from a family
    // who have finished ONE child. See the comment where the step is built.
    supabase.from('concerns').select('child_id').eq('user_id', userId).in('status', ['open', 'improving']).limit(200),
    // The quests step decides between "set the first job" and "approve what is
    // waiting", so it needs both. Head counts, in the wave that was already
    // going, so this costs no extra round trip. The same two tables the nav
    // badge counts, so the rung and the red number can never disagree.
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('active', true),
    supabase.from('quest_ticks').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending'),
    supabase.from('quest_requests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending'),
    // ── DID THEY ACTUALLY MOVE THE SCALE TODAY ─────────────────────────────
    //
    // Justin, 13 August 2026: "just looking at the check in is not enough to
    // tick it off, they need to complete the scale, which we already
    // designed."
    //
    // A real answer with a real number on it, today. Nothing else counts, and
    // in particular OPENING the page counts for nothing.
    //
    // ── AND WHOSE, WHICH IS THE 15 AUGUST 2026 FIX ─────────────────────────
    //
    // Justin: "may be done for other child as this will need to be child by
    // child". He was exactly right, and the live database said so: nine scored
    // rows that morning, every one of them Teo's, and the rung read done for
    // the whole family. Olga's worries were never going to be asked about.
    //
    // concern_events carries no child_id of its own, so whose a score is comes
    // through the concern it scored. The inner join is what makes it a filter
    // as well as a read: an event whose concern has been deleted cannot make a
    // child look checked in.
    supabase.from('concern_events')
      .select('id, concerns!inner(child_id)')
      .eq('user_id', userId)
      .not('score', 'is', null)
      .gte('created_at', dayStart)
      .limit(200),
    // The family agreement, for the weekly rung below. updated_at is what the
    // save route writes on every edit, so "looked at it this week" and "changed
    // it this week" are the same fact, which is the right one: an agreement
    // reopened and left alone is still a review.
    supabase.from('family_agreements')
      .select('updated_at, created_at, signed_by_parent, signed_by_child')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const anyQuests = (questCount ?? 0) > 0
  const questsWaiting = (ticksWaiting ?? 0) + (asksWaiting ?? 0)

  // The agreement's weekly clock. updated_at is written on every save, so a
  // family who opened it and changed nothing still reads as reviewed, which is
  // right: reading it IS the review.
  // ── THE REVIEW BELONGS TO A SIGNED AGREEMENT, NOT TO A DRAFT ──────────────
  //
  // Justin, 16 August 2026: "we need to remove this end of week update as this
  // does not apply when first signing up, only a week after agreement has been
  // agreed."
  //
  // The rung appeared the moment a ROW existed, and the builder writes that row
  // as clauses are picked, so a family met "The deal, review it this week" on
  // the day they signed up, about a document they had not finished making. Four
  // of the six agreements on the live database are signed by nobody, so this was
  // the common case rather than an edge one.
  //
  // Both signatures gate it now. In the week after signing, updated_at is fresh
  // so the rung reads DONE and says nothing; it only starts asking once a week
  // has passed, which is exactly the shape asked for.
  //
  // Honest limitation: there is no agreed_at column, so "a week after it was
  // agreed" is measured from the last touch rather than from the signature. For
  // a family who signs and then leaves it alone those are the same instant. For
  // one who signs and edits it twice more, the clock restarts on the last edit,
  // which is the right answer for a review anyway.
  const agreementSigned = !!(agreementRow as { signed_by_parent?: boolean } | null)?.signed_by_parent
    && !!(agreementRow as { signed_by_child?: boolean } | null)?.signed_by_child
  const agreementUpdatedAt = !agreementSigned ? null : (agreementRow?.updated_at as string | null)
    ?? (agreementRow?.created_at as string | null) ?? null
  const agreementFreshThisWeek = agreementUpdatedAt
    ? (Date.now() - new Date(agreementUpdatedAt).getTime()) < 7 * 86_400_000
    : false

  // How much of the passport is still on the parent to move. Null means there
  // is no passport to read yet, and the rung stays off the road entirely.
  const passportOutstanding = passportSections === null
    ? null
    : passportSections.filter(sec => sec.pct < 100).length

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

  // ── THE CHECK IN IS PER CHILD (15 August 2026) ────────────────────────────
  //
  // Justin: the check in "will be showing as done when I log in at the moment
  // although may be done for other child as this will need to be child by
  // child".
  //
  // Two sets, and the rung is done only when the second covers the first: every
  // child this family has a live worry about has a number against them TODAY.
  // A family with one child behaves exactly as it always did, which is why this
  // went unnoticed. A family with two did not: scoring Teo's nine worries
  // ticked the rung and Olga was never asked.
  //
  // A null child_id is its own bucket rather than being dropped. Concerns
  // predate migration 194 and the oldest rows have no child on them, and a
  // worry we cannot attribute still has to be checked in on.
  const CHILDLESS = '__no_child__'
  const liveChildren = new Set(
    (anyConcerns ?? []).map(c => ((c as { child_id?: string | null }).child_id ?? CHILDLESS)),
  )
  const scoredChildrenToday = new Set(
    (scoredToday ?? []).map(e => {
      // PostgREST returns an embedded to-one either as an object or, depending
      // on how it infers the relationship, as a one element array.
      const rel = (e as { concerns?: { child_id?: string | null } | { child_id?: string | null }[] }).concerns
      const row = Array.isArray(rel) ? rel[0] : rel
      return row?.child_id ?? CHILDLESS
    }),
  )
  const everyChildCheckedIn =
    scoredChildrenToday.size > 0
    && [...liveChildren].every(id => scoredChildrenToday.has(id))

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
      // ── DONE MEANS A NUMBER WAS RECORDED TODAY ─────────────────────────
      //
      // Justin: "just looking at the check in is not enough to tick it off,
      // they need to complete the scale."
      //
      // This asked whether anything was still PENDING, which is a different
      // question and quietly answered yes too often. A concern flagged TODAY
      // from the moments timeline is excluded from the pending list by the
      // flagged-before-today rule, so a parent who tapped two moments this
      // morning had nothing pending and the rung ticked itself green without
      // a single number being answered.
      //
      // So it asks the honest thing: is there a scored concern_event today.
      // That row is written by /api/daily/concern-check, which is the endpoint
      // the five word scale posts to, so the tick and the record cannot
      // disagree and opening the page earns nothing.
      //
      // AND EVERY CHILD, not just one of them. See everyChildCheckedIn above.
      done: everyChildCheckedIn,
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
    // ── THE AGREEMENT, ONCE A WEEK, RIGHT AFTER THE MOMENTS ────────────────
    //
    // Justin, 14 August 2026, walking his own loop: "after going through the
    // moment cards on today it did confirm agreement which is great... so
    // moments on today then check agreement but every time once a week then add
    // more moments or skip."
    //
    // It sits here rather than in setup because it is not a one time job. What
    // a family agreed in March is wrong by September: the child is older, the
    // devices have changed, and the deal that is never revisited is the deal
    // nobody follows. Weekly is the cadence he named and it is also the most it
    // can bear, because a daily rung about a document is furniture within a
    // fortnight.
    //
    // Only for families who HAVE one. Making one is a setup step and already
    // has a rung; this is the review, and a rung asking a family to review a
    // thing they have never made is two asks wearing one hat.
    ...(agreementUpdatedAt ? [{
      key: 'agreement' as const,
      label: 'The deal',
      href: '/dashboard/agreement?from=today',
      done: agreementFreshThisWeek,
    }] : []),
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
    // ── THE PASSPORT, AFTER THE QUESTS ─────────────────────────────────────
    //
    // Justin, 14 August 2026, describing the loop he wants: quests, "then send
    // to check progress on passport so thats the loop then once passport is
    // marked as save for now it goes to digi to advice and help."
    //
    // The order is the argument. Quests is what the family DOES this week, and
    // the passport is what it ADDS UP TO, so reading the record straight after
    // doing the work is the one moment it means something. Opened at any other
    // time it is a page about the future.
    //
    // Done is the passport having nothing outstanding on the parent's side,
    // which is the same reading PassportToDo shows on the page itself, so the
    // rung and the page can never disagree. A family with a full passport gets
    // a rung that is already green rather than a chore.
    //
    // It never appears before there is a passport to read: no stage, no rung.
    ...(passportOutstanding !== null ? [{
      key: 'passport' as const,
      label: 'Passport',
      // Both halves of this line arrived from different branches on the same
      // day and both are right. The route is the passport's own page since
      // 13 August, which is the whole reason that split was worth doing: this
      // rung can land ON the passport rather than near it. The from=today is
      // main's, so the way back to the loop is on the page when they arrive.
      href: '/dashboard/passport?from=today',
      done: passportOutstanding === 0,
    }] : []),
    // ── DIGI CLOSES THE DAY ────────────────────────────────────────────────
    //
    // It used to be day one only, and Justin was right at the time: "I think
    // it's useful to have there if only the first ever today so they are aware
    // of it." A standing rung reading "talk to DiGi" was an invitation
    // pretending to be a step, when DiGi is on the tab bar every day anyway.
    //
    // What changed is where it sits. Justin, 14 August: "once passport is
    // marked as save for now it goes to digi to advice and help." At the END of
    // the loop it is not an invitation any more, it is the debrief: the parent
    // has just answered how the week is going, logged what happened, looked at
    // the jobs and read the record, and DiGi is the one thing on the list that
    // can respond to all four. That is a concrete step with an end, which is
    // the test every other rung here has to pass.
    {
      key: 'digi' as const,
      label: neverCheckedIn ? 'Meet DiGi' : 'Ask DiGi',
      href: '/dashboard/digi',
      done: (digiToday ?? []).length > 0,
    },
  ]

  tasks.push({
    key: 'done',
    label: 'Done',
    href: '/dashboard/road',
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
      href: '/dashboard/road',
      done: !!checkin,
    },
  ]
}
