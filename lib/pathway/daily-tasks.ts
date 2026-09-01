import type { createClient } from '@/lib/supabase/server'
import { getRecommendedScript, type RecommendedScript } from './recommend'
import { isScriptLocked } from '@/lib/content/free-script-limit'
import type { StageId } from './progress'
import type { ChallengeId } from '@/lib/content/stages'
import { londonToday, londonDayStart } from '@/lib/pathway/today'
import { currentStagePassportSections, type CurrentStageChild } from '@/lib/pathway/passport-sections'
import { dayFocusFor, type DayFocus } from '@/lib/pathway/day-focus'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface DailyTask {
  key: 'moment' | 'script' | 'lesson' | 'device' | 'checkin'
  label: string
  detail: string
  href: string
  done: boolean
}

export interface TodayLoopTask {
  key: 'checkin' | 'setup' | 'moment' | 'agreement' | 'script' | 'quests' | 'passport' | 'digi' | 'lesson' | 'done'
  label: string
  href: string
  done: boolean
  /**
   * The day's ONE tick. Justin, 1 September 2026: "only have to click one
   * tick per day but have other recommended." Exactly one task carries this
   * flag, the day completes when it is done, and everything else on the road
   * is a recommendation rather than a requirement. Which task leads follows
   * the day's focus (lib/pathway/day-focus.ts): connect days lead with the
   * check in or the moment, lesson days with the next lesson for the age,
   * DiGi days with DiGi, and passport day with the weekly look at progress.
   */
  lead?: boolean
}

// ── TODAY. THE ORDER IS THE DESIGN. ─────────────────────────────────────────
//
// Justin, 13 August 2026: "check in is different from moments so should be
// check in, set up (which stays until all ticked), then moments, then scripts,
// then set up quests for device use."
//
// So the day runs:
//
//   1  SET UP       while it is unfinished, and it STAYS until every step is
//                   ticked. A half set up family is the single biggest reason
//                   this product does not work for somebody. It LEADS as of 17
//                   August 2026, on Justin's "make set up first when first
//                   there ... not check in until this is done".
//   2  CHECK IN     how it is going, and only once setup is behind them. It
//                   used to lead, including on day one, and that was wrong for
//                   a reason Justin reached himself: a check in MEASURES
//                   MOVEMENT, and on the first morning there is nothing to have
//                   moved from. Three separate faults were fixed to make a day
//                   one check in work before anyone asked whether it should
//                   exist. Its own page, never the moments deck.
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
   * The child this whole loop is about: whose passport the rung reads, and
   * since migration 210 whose daily_sessions row counts. Normally the
   * dashboard's selected child. Null keeps the rung off the road entirely and
   * falls back to the old family wide reading of the day.
   *
   * Two parameters briefly wanted to say this, one from each side of a merge on
   * 18 August: an id for the session read and a whole child for the passport
   * rung. One is right. A caller that can be handed two ways to name the child
   * is a caller that can eventually name two different ones.
   *
   * This replaces a passportSections parameter that was dormant for six days:
   * it claimed the dashboard "already built" the rows, the dashboard never
   * had, and the null default meant the rung never rendered once. The rows are
   * now fetched HERE through currentStagePassportSections, the same builder
   * the passport page uses, so the rung and the page cannot disagree and
   * there is no hand off left for a caller to silently drop.
   */
  child: CurrentStageChild | null = null,
): Promise<TodayLoopTask[]> {
  const today = londonToday()
  // The instant today began in London, not UTC midnight. Through British summer
  // time the two are an hour apart, so a step completed between midnight and
  // 1am counted for the day before and the parent was told to do it again.
  const dayStart = londonDayStart()

  const [
    { data: pendingConcerns },
    { data: sessionRows },
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
    passportRead,
    { data: completedBefore },
    { data: stageLessons },
    { data: aiLessons },
    { data: lessonRows },
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
    // Not maybeSingle: with more than one child there is now a row each, and
    // PostgREST treats more than one row as an error, so the answer came back
    // null and every child's day read as not started. A legacy row with no
    // child still counts for everybody, which is what it meant when written.
    supabase.from('daily_sessions').select('completed_at, cards_completed, child_id').eq('user_id', userId).eq('session_date', today),
    getRecommendedScript(supabase, userId, stageId, challenge, { preferFree: !isPaid, childId: child?.id ?? null }),
    // THIS child's script today (or a household row), so Jody's bedtime read
    // ticks Jody's day and Tray's stays open. Key per child since 219.
    supabase.from('script_completions').select('id, child_id').eq('user_id', userId).gte('completed_at', dayStart).limit(10),
    supabase.from('digi_questions').select('id, child_id').eq('user_id', userId).gte('created_at', dayStart).limit(10),
    // Per child since migration 211. Asking by user alone is what let one
    // child's moment tick the step for the whole household, so a parent doing
    // Today with Teo was told Olgie's moment was done too.
    supabase.from('moment_completions').select('id, child_id').eq('user_id', userId).eq('completed_on', today),
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
    // The passport's five rows for the selected child, the same builder the
    // passport page uses. See the child parameter above for why this is
    // fetched here rather than handed in.
    currentStagePassportSections(supabase, userId, child),
    // ── THE ROTATION'S ODOMETER ────────────────────────────────────────────
    //
    // How many days this child's road has completed, strictly BEFORE today,
    // which is what makes the day's focus stable for the whole of a day and
    // gap proof for a family who opens the app twice a week. See
    // lib/pathway/day-focus.ts for the argument.
    supabase.from('daily_sessions')
      .select('session_date, child_id')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .lt('session_date', today)
      .limit(500),
    // The next lesson for the age, for lesson days: the same two shelves the
    // legacy trail read, the stage's own lessons first, then the AI modules
    // for the stage's audience.
    supabase.from('lessons').select('id, title').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, title').eq('audience', STAGE_TO_AUDIENCE[stageId]),
    // One read serves both questions: which lessons are behind this child
    // (per child, a row with no child speaks for the household), and whether
    // a lesson landed TODAY, which is what ticks a lesson day.
    supabase.from('lesson_completions').select('lesson_id, lesson_source, passed, child_id, completed_at').eq('user_id', userId).limit(1000),
  ])

  // THIS CHILD'S DAY, out of the rows for today.
  //
  // A legacy row with no child counts for everybody, which is exactly what it
  // meant before migration 210, so a family mid week does not lose the day they
  // already finished.
  type SessionRow = { completed_at: string | null; cards_completed: number | null; child_id: string | null }
  const session = ((sessionRows ?? []) as SessionRow[])
    .find(r => r.child_id === (child?.id ?? null) || r.child_id === null) ?? null


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
  const passportOutstanding = passportRead === null
    ? null
    : passportRead.sections.filter(sec => sec.pct < 100).length

  // ── THE DAY'S FOCUS ────────────────────────────────────────────────────────
  //
  // Counted on completed days before today, per child (a household row from
  // before migration 210 counts for everybody), so the rotation advances only
  // when a day actually finished and holds still all day.
  const completedDaysBefore = new Set(
    ((completedBefore ?? []) as { session_date: string; child_id: string | null }[])
      .filter(r => r.child_id === (child?.id ?? null) || r.child_id === null)
      .map(r => r.session_date),
  ).size

  // The next lesson for the age, per child. A completion with passed false is
  // a lesson still owed; passed null is a row from before scoring existed and
  // counts as done rather than asking an old family to redo their history.
  type LessonCompletionRow = { lesson_id: string; lesson_source: string; passed: boolean | null; child_id: string | null; completed_at: string | null }
  const myLessonRows = ((lessonRows ?? []) as LessonCompletionRow[])
    .filter(r => r.child_id === (child?.id ?? null) || r.child_id === null)
  const doneLessonKeys = new Set(
    myLessonRows.filter(r => r.passed !== false).map(r => `${r.lesson_source}:${r.lesson_id}`),
  )
  const nextLesson =
    (stageLessons ?? []).find(l => !doneLessonKeys.has(`lesson:${l.id}`)) ??
    (aiLessons ?? []).find(l => !doneLessonKeys.has(`ai_lesson:${l.id}`))
  const nextLessonHref = nextLesson
    ? (stageLessons ?? []).some(l => l.id === nextLesson.id)
      ? `/dashboard/lessons/${nextLesson.id}`
      : `/dashboard/ai-module/${nextLesson.id}`
    : '/dashboard/lessons'
  const lessonDoneToday = myLessonRows.some(r => r.completed_at !== null && r.completed_at >= dayStart)

  // The focus, with its honest fallbacks: a lesson day with every lesson done
  // falls back to connect (there is nothing to lead with), and passport day
  // needs a passport to look at with something still open on it. The day the
  // fallback fires the rotation still advances next time, so nobody gets
  // stuck on a day type their family has outgrown.
  let focus: DayFocus = dayFocusFor(completedDaysBefore)
  if (focus === 'lesson' && !nextLesson) focus = 'connect'
  if (focus === 'passport' && (passportOutstanding === null || passportOutstanding === 0)) focus = 'connect'

  const scriptHref = await safeScriptHref(supabase, userId, isPaid, recommended)
  // Doing a moment counts whether it came from the daily deck (a session) or
  // from reading a card in the library (a completion), so the step ticks either
  // way and never looks stuck.
  const momentDone = (!!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0))
    // THIS child's moment. A row with no child counts for everybody, which is
    // what the rows written before migration 211 mean.
    || ((momentCompletionsToday ?? []) as { child_id: string | null }[])
         .some(r => r.child_id === (child?.id ?? null) || r.child_id === null)

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

  // Every rung's link carries the child the loop is about, so tapping a rung
  // never quietly snaps the destination back to the primary child. This was
  // the August audit's root cause and it was still live here on the main
  // loop: the pills said Alma, the rung opened Teo. Idempotent, because the
  // script link already names its child.
  const withChild = (href: string) =>
    child?.id && !href.includes('child=')
      ? `${href}${href.includes('?') ? '&' : '?'}child=${child.id}`
      : href

  const tasks: TodayLoopTask[] = [
    // ── SETUP LEADS, AND THE CHECK IN WAITS FOR IT ─────────────────────────
    //
    // Justin, 17 August 2026: "it returns to check in, not to set up, then set
    // up is there on the list second. Let's make it return to set up and make
    // set up first when first there ... not check in until this is done."
    //
    // And his own reasoning from the day before, which is the half that matters:
    // a check in MEASURES MOVEMENT, and on the first morning there is nothing to
    // have moved from. Three separate faults were fixed to make a day one check
    // in work before anybody asked whether it should exist. It should not.
    //
    // So while setup is unfinished it is the first rung and the check in is not
    // on the road at all. A family that has never set anything up is not being
    // asked to rate four worries a stranger picked for them, and a parent who
    // finishes the agreement lands back on the thing that sent them.
    //
    // Once setup is done the order returns to what it always was, check in
    // first, because from that day on it is measuring something real.
    ...(setupNextStep ? [{
      key: 'setup' as const,
      label: 'Set up',
      href: withChild('/dashboard/setup'),
      // Never done while a step is outstanding. That is the whole point of it
      // staying: a half green road is an honest one.
      done: false,
    }] : []),
    ...(!setupNextStep && (hasLiveConcerns || neverCheckedIn) ? [{
      key: 'checkin' as const,
      label: neverCheckedIn ? 'Where things are now' : 'Check in',
      href: withChild('/dashboard/checkin'),
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
    {
      key: 'moment',
      label: 'Moment',
      href: withChild('/dashboard/daily'),
      done: momentDone,
    },
    // ── THE LESSON, ON LESSON DAYS ONLY ────────────────────────────────────
    //
    // Justin, 1 September 2026: rotate days "to go through lessons needed for
    // age one by one which tick off". The rung leads a lesson day and stays
    // off the road otherwise, because a standing lesson rung is how a road
    // grows into a chores list. Done is a lesson landed TODAY, any lesson:
    // the parent who took a different one still did the day's real thing.
    ...(focus === 'lesson' && nextLesson ? [{
      key: 'lesson' as const,
      label: 'Lesson',
      href: withChild(nextLessonHref),
      done: lessonDoneToday,
    }] : []),
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
      href: withChild('/dashboard/agreement?from=today'),
      done: agreementFreshThisWeek,
    }] : []),
    {
      key: 'script',
      label: 'Script',
      href: withChild(scriptHref),
      // This child's row or the household's. A sibling's script must not tick
      // this child's rung. See migration 219.
      done: (scriptToday ?? []).some(r => (r as { child_id?: string | null }).child_id === (child?.id ?? null) || (r as { child_id?: string | null }).child_id == null),
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
      href: !anyQuests ? withChild('/dashboard/quests') : `${withChild('/dashboard/quests')}#quest-board`,
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
      // On passport day the link carries passportday=1 so the pathway page
      // knows this visit IS the day's one thing and records the look; any
      // other day the same page records nothing.
      href: withChild(focus === 'passport' ? '/dashboard/pathway?from=today&passportday=1' : '/dashboard/pathway?from=today'),
      // On passport day the ask is a LOOK, not a finish: reading the record
      // is the day's one thing, and the pathway page records the look when it
      // is opened from the road. Every other day keeps the honest reading the
      // page itself shows: nothing outstanding on the parent's side.
      done: focus === 'passport'
        ? (!!session?.completed_at || passportOutstanding === 0)
        : passportOutstanding === 0,
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
      href: withChild('/dashboard/digi'),
      done: (digiToday ?? []).some(r => (r as { child_id?: string | null }).child_id === (child?.id ?? null) || (r as { child_id?: string | null }).child_id == null),
    },
  ]

  // ── ONE MAIN TICK ──────────────────────────────────────────────────────────
  //
  // Justin, 1 September 2026: "only have to click one tick per day but have
  // other recommended." The day's focus names its lead: setup while it is
  // unfinished (nothing works before it), then the check in or the moment on
  // connect days, the lesson on lesson days, DiGi on DiGi days, the passport
  // look on passport day. The lead walks to the front of the road so the one
  // thing is the first thing, and the done flag below reads the lead alone:
  // everything after it is a recommendation, never a requirement.
  const leadKey: TodayLoopTask['key'] =
    setupNextStep ? 'setup'
    : focus === 'lesson' && tasks.some(t => t.key === 'lesson') ? 'lesson'
    : focus === 'digi' ? 'digi'
    : focus === 'passport' && tasks.some(t => t.key === 'passport') ? 'passport'
    : tasks.some(t => t.key === 'checkin') ? 'checkin'
    : 'moment'
  const leadIdx = tasks.findIndex(t => t.key === leadKey)
  if (leadIdx >= 0) {
    tasks[leadIdx].lead = true
    if (leadIdx > 0) {
      const [lead] = tasks.splice(leadIdx, 1)
      // Setup, when present and not itself the lead, stays in front of
      // everything: a half set up family's road starts at setup whatever the
      // rotation says.
      const insertAt = tasks[0]?.key === 'setup' ? 1 : 0
      tasks.splice(insertAt, 0, lead)
    }
  }

  const lead = tasks.find(t => t.lead)
  tasks.push({
    key: 'done',
    label: 'Done',
    href: withChild('/dashboard/pathway'),
    // The day completes on the ONE tick. Before the rotation this required
    // every rung, which made the road a checklist; now the lead alone decides
    // and the rest of the ticks are bonuses that never gate the day.
    done: lead ? lead.done : tasks.every(t => t.done),
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
    { data: sessionRows },
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
    // Not maybeSingle: with more than one child there is now a row each, and
    // PostgREST treats more than one row as an error, so the answer came back
    // null and every child's day read as not started. A legacy row with no
    // child still counts for everybody, which is what it meant when written.
    supabase.from('daily_sessions').select('completed_at, cards_completed, child_id').eq('user_id', userId).eq('session_date', today),
    getRecommendedScript(supabase, userId, stageId, challenge, { preferFree: !isPaid, childId }),
    // THIS child's script today (or a household row), so Jody's bedtime read
    // ticks Jody's day and Tray's stays open. Key per child since 219.
    supabase.from('script_completions').select('id, child_id').eq('user_id', userId).gte('completed_at', dayStart).limit(10),
    supabase.from('lessons').select('id, title').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, title').eq('audience', STAGE_TO_AUDIENCE[stageId]),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, name, min_age').lte('min_age', STAGE_DEVICE_MAX_AGE[stageId]).order('min_age', { ascending: true }),
    supabase.from('device_setup_progress').select('device_key').eq('user_id', userId),
    childId
      ? supabase.from('wellbeing_checks').select('id').eq('child_id', childId).eq('week_start', weekStart).maybeSingle()
      : Promise.resolve({ data: null }),
    // Per child since migration 211. Asking by user alone is what let one
    // child's moment tick the step for the whole household, so a parent doing
    // Today with Teo was told Olgie's moment was done too.
    supabase.from('moment_completions').select('id, child_id').eq('user_id', userId).eq('completed_on', today),
  ])

  // THIS CHILD'S DAY, out of the rows for today.
  //
  // A legacy row with no child counts for everybody, which is exactly what it
  // meant before migration 210, so a family mid week does not lose the day they
  // already finished.
  type SessionRow = { completed_at: string | null; cards_completed: number | null; child_id: string | null }
  const session = ((sessionRows ?? []) as SessionRow[])
    .find(r => r.child_id === childId || r.child_id === null) ?? null


  const momentDone = (!!session && (session.completed_at !== null || (session.cards_completed ?? 0) > 0))
    // THIS child's moment. See the note in getTodayLoop above.
    || ((momentCompletionsToday ?? []) as { child_id: string | null }[])
         .some(r => r.child_id === childId || r.child_id === null)

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

  // Same rule as getTodayLoop: every link carries the child it is about.
  const withChild = (href: string) =>
    childId && !href.includes('child=')
      ? `${href}${href.includes('?') ? '&' : '?'}child=${childId}`
      : href

  return [
    {
      key: 'moment',
      label: 'Daily moments',
      detail: momentDone ? 'Done for today' : 'Two minutes, today’s cards',
      href: withChild('/dashboard/daily'),
      done: momentDone,
    },
    {
      key: 'script',
      label: recommended ? recommended.title : 'Scripts',
      detail: recommended
        ? 'Tonight’s script, picked for you'
        : 'Every script for this stage is read',
      href: withChild(await safeScriptHref(supabase, userId, isPaid, recommended)),
      done: !recommended || (scriptDoneToday ?? []).some(r => (r as { child_id?: string | null }).child_id === childId || (r as { child_id?: string | null }).child_id == null),
    },
    {
      key: 'lesson',
      label: nextLesson ? nextLesson.title : 'Lessons',
      detail: nextLesson ? 'Your next lesson, about 3 minutes' : 'All lessons for this stage are done',
      href: withChild(nextLessonHref),
      done: !nextLesson,
    },
    {
      key: 'device',
      label: nextDevice ? `Set up ${nextDevice.name}` : 'Devices',
      detail: nextDevice ? 'Step by step, DiGi can walk you through it' : 'Every device for this stage is set up',
      href: withChild('/dashboard/devices'),
      done: !nextDevice,
    },
    {
      key: 'checkin',
      label: 'Weekly check in',
      detail: checkin ? 'Done for this week' : 'Five questions, once a week',
      href: withChild('/dashboard/pathway'),
      done: !!checkin,
    },
  ]
}
