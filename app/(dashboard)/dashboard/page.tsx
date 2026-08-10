import { createClient } from '@/lib/supabase/server'
import { hasFullAccess, inTrial, TRIAL_DAYS } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, ageBandInList, type AgeBand, type ChallengeId, STAGES } from '@/lib/content/stages'
import type { Moment } from '@/components/cards/MomentCard'
import MomentCard from '@/components/cards/MomentCard'
import PushPrompt from '@/components/push/PushPrompt'
import SmartAlerts from '@/components/alerts/SmartAlerts'
import DigiPrompts from '@/components/digi/DigiPrompts'
import DigiWondering from '@/components/digi/DigiWondering'
import DigiDeviceCheckin from '@/components/digi/DigiDeviceCheckin'
import SundayCheckIn from '@/components/digi/SundayCheckIn'
import RevealCard from '@/components/onboarding/RevealCard'
import { revealedKeys, eligibleReveals, daysSince } from '@/lib/onboarding/reveal'
import { unmetCoverage } from '@/lib/dashboard/coverage'
import DigiDiscoverNudge from '@/components/digi/DigiDiscoverNudge'
import { getSuggestions, type Suggestion } from '@/lib/alerts/suggestions'
import DigiStreakWidget from '@/components/digi/DigiStreakWidget'
import AddChildName from '@/components/dashboard/AddChildName'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolPromoCard from '@/components/school/SchoolPromoCard'
import HomeStats from '@/components/dashboard/HomeStats'
import { visibleSteps as visibleSetupSteps } from '@/lib/setup/steps'
import { allBirthdaysIn } from '@/lib/setup/flags'
import { nextEventForChild, aroundWhen } from '@/lib/learning/calendar'
import { academicYearStart } from '@/lib/learning/term'
import { transitionFor, transitionAsk } from '@/lib/learning/transition'
import SchoolAheadCard from '@/components/home/SchoolAheadCard'
import TermPreviewCard from '@/components/home/TermPreviewCard'
import { buildTermPreview } from '@/lib/learning/term-preview'
import { getFamilyRegion } from '@/lib/learning/region'
import DayCheckup from '@/components/home/DayCheckup'
import PhoneBridgeCard from '@/components/home/PhoneBridgeCard'
import { MAX_HANDOVER_ASKS } from '@/lib/handover'
import SocialMediaReadiness from '@/components/pathway/SocialMediaReadiness'
import SocialMediaHeadsUp from '@/components/pathway/SocialMediaHeadsUp'
import PhoneHeadsUp from '@/components/pathway/PhoneHeadsUp'
import SetupUnlockToast from '@/components/setup/SetupUnlockToast'
import DigiWelcomeSheet from '@/components/digi/DigiWelcomeSheet'
import TodayPathBig from '@/components/daily/TodayPathBig'
import CatchupCard from '@/components/daily/CatchupCard'
import { rollVisit, getCatchup } from '@/lib/pathway/catchup'
import DigiGreeting from '@/components/home/DigiGreeting'
import MissionWelcome from '@/components/home/MissionWelcome'
import CommunityBite from '@/components/community/CommunityBite'
import HomeRows from '@/components/home/HomeRows'
import TodayCard from '@/components/home/TodayCard'
import TrialCountdown from '@/components/home/TrialCountdown'
import HomeLive from '@/components/home/HomeLive'
import HomeMain from '@/components/home/HomeMain'
import { investedMinutes } from '@/lib/pathway/task-minutes'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import DigiLessonNudge from '@/components/lessons/DigiLessonNudge'
import DigiFlashUp from '@/components/digi/DigiFlashUp'
import DigiPrintableNudge from '@/components/digi/DigiPrintableNudge'
import DigiScriptNudge from '@/components/digi/DigiScriptNudge'
import { printablesForStage } from '@/lib/printables/registry'
import { getParentLessons, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { getDailyStreak } from '@/lib/pathway/streak'
import { computeJobsStreak, jobsTodayStatus, type StreakQuest, type StreakTick } from '@/lib/pathway/jobs-streak'
import { getTodayLoop } from '@/lib/pathway/daily-tasks'
import { getWeekBrief } from '@/lib/learning/this-week'
import type { StageId as PathwayStageId } from '@/lib/pathway/progress'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import FoldSection from '@/components/dashboard/FoldSection'

const WEEKLY_ACTIONS = [
  'Put the bedroom rule in place',
  'Ask one open question about their online week',
  'Do this week’s wellbeing check in',
]

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam } = await searchParams

  const today = new Date().toISOString().split('T')[0]

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Stage the reveal by account age: a new parent meets a one loop Home, and the
  // rest opens up over the first fortnight. Established accounts reveal everything
  // (daysSince is large), so nothing regresses for existing families. Computed
  // before the reads because it gates one of them.
  const accountAgeDays = daysSince(user.created_at)
  const revealed = revealedKeys(accountAgeDays)
  const reveals = eligibleReveals(accountAgeDays)

  // ONE WAVE, NOT TEN. Everything here needs only the user id, and it used to
  // run as eight separate awaits down the length of this function: profile,
  // then thirteen reads, then birthdays, then the handover row, then the deal
  // age, then the last script, then the last check in. Each await is a full
  // round trip to the database before a single byte of HTML leaves the
  // server, which is the whole of "opening the app seems a little slow".
  // Same reads, same order of meaning, one round trip of latency.
  const [profileResult, childResult, dailySessionResult, todayMomentsResult, lastFeedbackResult, schoolActionsResult, schoolConnectionResult, agreementResult, questsCountResult, pushSubResult, anySessionResult, anySchoolActionResult, kidLinksResult, focusConcernResult, birthdays, handoverResult, lastQuestResult, lastCompletionResult, lastCheckinResult, flashScriptRows] = await Promise.all([
    supabase.from('profiles').select('full_name, onboarding_complete, subscription_status, trial_ends_at, onboarding_answers, daily_minutes').eq('id', user.id).maybeSingle(),
    supabase.from('children').select('id, name, age_band, stage_id, streak_weeks, actions_this_week, is_primary, date_of_birth').eq('parent_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
    supabase.from('daily_moments').select('id, title, category, age_bands, icon, science_brief, digi_opener').eq('active', true).order('sort_order').limit(20),
    supabase.from('digi_feedback').select('feedback_date, question, parent_response, digi_insight').eq('user_id', user.id).not('parent_response', 'is', null).gte('feedback_date', sevenDaysAgo).order('feedback_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('school_actions').select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child').eq('user_id', user.id).eq('status', 'open').order('due_date', { ascending: true, nullsFirst: false }).limit(20),
    supabase.from('school_connections').select('id').eq('user_id', user.id).eq('active', true).maybeSingle(),
    supabase.from('family_agreements').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('active', true),
    supabase.from('push_subscriptions').select('endpoint').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('daily_sessions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    // Any school action ever added, connected inbox or typed by hand, done
    // or dismissed or still open: either path is the setup step complete,
    // and once complete it should stay complete, not flip back off the
    // moment the open list empties out.
    supabase.from('school_actions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    // Whether any child already has their own phone link (the kid companion
    // link). Keyed by user, matched to the primary child below. last_seen_at
    // rides along because a link that was made and never opened leaves the
    // family exactly where a link that was never made does.
    supabase.from('kid_links').select('child_id, last_seen_at').eq('user_id', user.id),
    // The problem this family is working on right now: the most recently
    // flagged live concern, for the focus bar above the path.
    supabase.from('concerns').select('label, status').eq('user_id', user.id).in('status', ['open', 'improving']).order('last_flagged_at', { ascending: false }).limit(1).maybeSingle(),
    // The birthday is a setup step now, not a welcome card and not a day three
    // reveal. The read fails soft to done before migration 083, so a deploy
    // without the column never shows a step nobody can finish.
    supabase.from('children').select('date_of_birth, name').eq('parent_id', user.id),
    // The handover columns, read on their own rather than folded into the
    // profile select, so on any deploy where migration 103 has not run the
    // missing columns cost nothing but this one null rather than taking the
    // whole profile read down with them.
    supabase.from('profiles').select('handover_choice, handover_asks').eq('id', user.id).maybeSingle(),
    // How long since anything in the family deal actually moved: the most
    // recent job added or changed, the part of the deal a family touches.
    supabase.from('family_quests').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    // Last completed script, for the insight card and the coverage read.
    supabase.from('script_completions').select('script_sort_order, completed_at').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
    // Monthly wellbeing check in: when the last one happened, if ever.
    supabase.from('wellbeing_checkins').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    // The flash up script rotation pool, only once moments are revealed.
    revealed.has('moments')
      ? supabase.from('scripts').select('title, situation, sort_order').order('sort_order', { ascending: true }).limit(30)
      : Promise.resolve({ data: null }),
  ])

  const profile = profileResult.data
  // Only send to onboarding when we POSITIVELY know it is not done. If the
  // profile read comes back empty (a transient session or read hiccup),
  // rendering the dashboard is safe (everything below is null tolerant) and,
  // crucially, never bounces to onboarding, which onboarding then bounces
  // back, the continuous flashing loop. One side must not fight the other.
  if (profile && profile.onboarding_complete === false) redirect('/onboarding')

  // Every child, primary first. The whole page runs on the selected child
  // (?child=<id>, defaulting to the primary), and the same list feeds the
  // switcher pills and DiGi's whole family greeting in the welcome sheet.
  const allKids = childResult.data ?? []
  const child = pickChild(allKids, childParam)
  const welcomeChildren = allKids
    .filter(k => k.name)
    .map(k => ({ name: k.name as string, ageBand: (k.age_band as string | null) ?? null }))

  const dailyDone = !!dailySessionResult.data?.completed_at
  const lastFeedback = lastFeedbackResult.data

  // What school is about to throw at this family, and the one moment that
  // matters more than any other. Both read from the birthday and the fixed
  // England calendar, so neither knows anything about how the child is doing
  // and neither can be read as a verdict. No birthday means both stay quiet.
  const dobRows = (birthdays.data ?? []) as { date_of_birth: string | null; name: string | null }[]
  const bridgeRow = dobRows.map(r => ({ r, state: transitionFor(r.date_of_birth) })).find(x => x.state)
  const phoneBridge = bridgeRow?.state
    ? {
        phase: bridgeRow.state.phase,
        headline: bridgeRow.state.headline,
        line: bridgeRow.state.line,
        ask: transitionAsk(bridgeRow.state),
        childName: bridgeRow.r.name,
      }
    : null

  // Only when the transition card is not already there. Both at once is two
  // school cards on one screen, and the phone conversation outranks the
  // calendar every time.
  const upcoming = phoneBridge ? null : dobRows.map(r => nextEventForChild(r.date_of_birth)).find(Boolean) ?? null
  // What the class is doing next term, three subjects and a line each.
  //
  // Silent outside a school holiday and the first week back, so this is null
  // for most of the year rather than a card that repeats itself daily. Reads
  // the SELECTED child rather than the primary, so a family with two gets the
  // preview for whoever they are looking at, like the rest of this screen.
  const termPreview = child
    ? await buildTermPreview(
        supabase,
        { date_of_birth: (child as { date_of_birth?: string | null }).date_of_birth ?? null },
        new Date(),
        await getFamilyRegion(supabase, user.id).catch(() => 'uk' as const),
      )
    : null

  const schoolAhead = upcoming
    ? {
        eventKey: upcoming.event.key,
        title: upcoming.event.title,
        what: upcoming.event.what,
        doThis: upcoming.event.doThis,
        when: aroundWhen(upcoming),
        ask: upcoming.event.ask,
        academicYear: academicYearStart(new Date()),
        thisWeek: upcoming.phase === 'this_week',
      }
    : null

  // Which routines keep going in the school holidays, read guarded because
  // runs_in_holidays lands with migration 182, run by hand, and naming a
  // missing column fails the whole query it is part of. An error reads as
  // school time, which rests every routine through the holidays, the
  // truthful default for a school diary.
  const schoolHolidayFlags = new Map<string, boolean>()
  try {
    const { data, error } = await supabase
      .from('school_actions')
      .select('id, runs_in_holidays')
      .eq('user_id', user.id)
      .eq('status', 'open')
    if (!error) {
      for (const r of (data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
        schoolHolidayFlags.set(String(r.id), r.runs_in_holidays === true)
      }
    }
  } catch { /* pre 182 */ }
  const schoolActions: SchoolAction[] = (schoolActionsResult.data ?? []).map((a: SchoolAction) => ({
    ...a,
    runs_in_holidays: schoolHolidayFlags.get(String(a.id)) ?? false,
  }))
  // Which school calendar this family keeps, so the card's holiday hold
  // reads the right country's holidays.
  const { getFamilyRegion } = await import('@/lib/learning/region')
  const familyRegion = await getFamilyRegion(supabase, user.id)
  const hasSchoolConnection = !!schoolConnectionResult.data
  // The child phone link step only belongs once a child is old enough to
  // have a phone. We record around 9 as the point that starts, so any band
  // above Foundation (4 to 7) shows it. If the parent set an even younger
  // child, the step simply waits until they move up.
  const phoneAge = !!child?.age_band && child.age_band !== '4-7'
  const hasKidLink = (kidLinksResult.data ?? []).some(k => k.child_id === child?.id)
  // The child app is only really set up once the child has actually opened it.
  // A parent can run the whole parent side for weeks without realising the
  // jobs, the earned device time and the printables all live on the child's
  // side, so until this is true Home says so plainly.
  const childAppLive = (kidLinksResult.data ?? [])
    .some(k => k.child_id === child?.id && !!k.last_seen_at)
  const setupFlags = {
    agreement: !!agreementResult.data,
    quests: (questsCountResult.count ?? 0) > 0,
    school: hasSchoolConnection || !!anySchoolActionResult.data,
    push: !!pushSubResult.data,
    daily: !!anySessionResult.data,
    childLink: hasKidLink,
    birthday: allBirthdaysIn(birthdays),
  }

  // DiGi brings a lesson to Home: one age relevant film the child has not
  // watched yet, offered with the same two choices as the hub (watch together
  // here, or send to their phone). This is the mobile answer to a nav that has
  // no room for a Lessons tab, so lessons are always one tap away. Only once
  // lessons have been revealed for this account.
  // The reads join the second wave below; the pick happens after it lands.
  const wantLessonNudge = revealed.has('lessons') && !!child?.id
  let lessonNudge: { code: string; title: string; catchphrase: string | null } | null = null
  const lessonChildName = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  // The flash up rotation: DiGi brings ONE thing to Home now and then, a
  // printable one visit, a script another, a lesson, a moment. The cards
  // themselves are picked here so the choice is steady by the day, not random,
  // and the gate below decides whether today is even a show day.
  const childStageNum = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  const stagePrintables = printablesForStage(childStageNum)
  const flashPrintable = stagePrintables.length ? stagePrintables[dayIndex % stagePrintables.length] : null
  let flashScript: { title: string; situation: string | null; sort_order: number } | null = null
  {
    const rows = (flashScriptRows.data ?? []) as { title: string; situation: string | null; sort_order: number }[]
    const r = rows.length ? rows[dayIndex % rows.length] : null
    if (r) flashScript = { title: r.title, situation: r.situation ?? null, sort_order: r.sort_order }
  }

  // One conductor, one ask at a time. SetupPath sequences the setup steps
  // in order, and the standalone prompts below only appear when it is their
  // turn, so a new parent never faces a wall of asks at once. When setup is
  // finished, the supplementary cards return to normal. visibleSetupSteps
  // drops the phone link step for children too young to have a phone, so it
  // never blocks completion for a Foundation age family.
  const setupSteps = visibleSetupSteps(phoneAge)
  const currentSetupStep = setupSteps.find(s => !setupFlags[s.key])?.key ?? null
  const setupComplete = currentSetupStep === null

  // Is the child phone handover still an open question for this family? Four
  // gates, all of them server side. Old enough to have a phone at all, no link
  // made yet, they have not told us they do it on paper, and we have not
  // already asked more times than is fair. The overlay itself waits for the
  // second app open, which the client counts.
  const handoverRow = handoverResult.data
  const handoverAsks = Number((handoverRow as { handover_asks?: number } | null)?.handover_asks ?? 0)
  const handoverChoice = (handoverRow as { handover_choice?: string | null } | null)?.handover_choice ?? null
  const handoverChild = (phoneAge && child?.id && !hasKidLink && !handoverChoice && handoverAsks < MAX_HANDOVER_ASKS)
    ? { id: child.id, name: child.name ?? null }
    : null

  // Most applicable first: filter to the child's age, then lead with the
  // categories most likely happening at this hour (UK time), so the grid
  // greets the parent with their probable right now.
  const ukHour = Number(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }))
  const slotOrder: string[] =
    ukHour < 12 ? ['Morning', 'Transitions', 'Digital', 'School', 'Food', 'Emotions', 'Evening']
    : ukHour < 15 ? ['School', 'Food', 'Digital', 'Transitions', 'Emotions', 'Morning', 'Evening']
    : ukHour < 18 ? ['Transitions', 'Digital', 'Food', 'School', 'Emotions', 'Evening', 'Morning']
    : ['Evening', 'Digital', 'Emotions', 'Food', 'Transitions', 'School', 'Morning']
  const slotRank = (m: Moment) => {
    const i = slotOrder.indexOf(m.category)
    return i === -1 ? slotOrder.length : i
  }
  const allMoments: Moment[] = todayMomentsResult.data ?? []
  const ageMoments = child?.age_band
    ? allMoments.filter(m => ageBandInList(child.age_band, m.age_bands))
    : allMoments
  const todayMoments = [...ageMoments].sort((a, b) => slotRank(a) - slotRank(b)).slice(0, 5)

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[0]

  const isPaid = hasFullAccess(profile, user.email)
  // The parent's first name, resolved from the best source we have: the
  // profile, then the auth metadata set at signup, then the email local part,
  // so a warm greeting almost never falls back to the bare "there".
  const rawName =
    profile?.full_name
    || (user.user_metadata?.full_name as string | undefined)
    || (user.user_metadata?.name as string | undefined)
    || (user.email ? user.email.split('@')[0].replace(/[._-]+/g, ' ') : '')
  const firstNameRaw = (rawName ?? '').trim().split(' ')[0]
  const firstName = firstNameRaw
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1)
    : 'there'

  // How long since anything in the family deal actually moved, so the review
  // nudge only ever fires on a deal that has genuinely gone quiet. The most
  // recent job added or changed is the honest signal: it is the part of the
  // deal a family touches. Null means there is no deal yet to review.
  let dealDaysSinceChange: number | null = null
  {
    const lastQuest = lastQuestResult.data
    if (lastQuest?.created_at) {
      const days = Math.floor((Date.now() - new Date(lastQuest.created_at as string).getTime()) / 86400000)
      dealDaysSinceChange = Number.isFinite(days) ? days : null
    }
  }

  // Today's loop and the daily streak, both resolved server side.
  // stage.name lowercased matches the pathway stage slugs exactly
  // (foundation/builder/explorer/shaper/independent), same rule the
  // daily deck relies on.
  const stageSlug = stage.name.toLowerCase() as PathwayStageId
  const challenge = ((profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null) as ChallengeId | null
  // THE SECOND AND LAST WAVE. Everything that needed the child or the stage
  // from wave one: the loop, the streak, the strands, plus the reads that
  // used to trail behind as their own awaits (the lesson nudge pair, the
  // last script's insight, the jobs board). Two waves total, not ten.
  const sinceJobs = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10)
  const lastCompletion = lastCompletionResult.data
  const [streak, todayLoop, literacyStatuses, suggestions, watchTogetherTotal, watchTogetherDone, stageLessonRows, stageLessonDone, nudgeFilms, nudgeWatched, lastScriptResult, jqRes, jtRes, weekBrief] = await Promise.all([
    getDailyStreak(supabase, user.id),
    getTodayLoop(supabase, user.id, stageSlug, challenge, isPaid),
    getLiteracyStatuses(supabase, user.id, stage.id),
    child?.stage_id
      ? getSuggestions(supabase, user.id, { childName: child.name, childId: child.id, stageId: stageSlug, ukHour })
      : Promise.resolve([] as Suggestion[]),
    // Watch together lessons: the co view videos, for the progress count
    // on the lessons card below (completions are the primary child's).
    supabase.from('parent_lessons').select('id', { count: 'exact', head: true }).eq('active', true),
    child
      ? supabase.from('parent_lesson_completions').select('id', { count: 'exact', head: true }).eq('child_id', child.id)
      : Promise.resolve({ count: 0 }),
    // The child's own stage lessons and their passes, so DiGi's welcome can
    // name exactly which lessons to send for progress with the live count.
    supabase.from('lessons').select('id').eq('audience', 'parent').eq('stage_id', stageSlug).neq('status', 'stub'),
    supabase.from('lesson_completions').select('lesson_id, passed').eq('user_id', user.id).eq('lesson_source', 'lesson'),
    wantLessonNudge ? getParentLessons(supabase) : Promise.resolve({ lessons: [] as Awaited<ReturnType<typeof getParentLessons>>['lessons'] }),
    wantLessonNudge && child?.id ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Set<string>()),
    lastCompletion
      ? supabase.from('scripts').select('title, why_it_works, sort_order, category').eq('sort_order', lastCompletion.script_sort_order).single()
      : Promise.resolve({ data: null }),
    child?.id
      ? supabase.from('family_quests').select('id, schedule, schedule_days, created_at').eq('user_id', user.id).eq('child_id', child.id).eq('active', true)
      : Promise.resolve({ data: null }),
    child?.id
      ? supabase.from('quest_ticks').select('quest_id, tick_date, status').eq('user_id', user.id).eq('child_id', child.id).gte('tick_date', sinceJobs)
      : Promise.resolve({ data: null }),
    // This week at school, for the Today card row. Null without a birthday or
    // outside Years 1 to 6, the same honest gate every curriculum surface has.
    getWeekBrief(supabase, (child as { date_of_birth?: string | null } | null)?.date_of_birth ?? null),
  ])

  // The lesson nudge pick, from the wave's reads: one age relevant film the
  // child has not watched yet, closest at or below their stage, earliest
  // step first.
  if (wantLessonNudge && child) {
    const stageNum = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
    const unseen = nudgeFilms.lessons.filter(f => !nudgeWatched.has(f.lesson_code))
    const pick = [...unseen]
      .filter(f => f.stage_id <= stageNum)
      .sort((a, b) => (b.stage_id - a.stage_id) || (a.journey_step - b.journey_step))[0]
      ?? unseen[0]
    if (pick) lessonNudge = { code: pick.lesson_code, title: pick.title, catchphrase: pick.catchphrase ?? null }
  }
  const watchTogether = {
    total: watchTogetherTotal.count ?? 0,
    done: Math.min(watchTogetherDone.count ?? 0, watchTogetherTotal.count ?? 0),
  }
  // The same counting rule as the progress report: only this stage's family
  // lessons, and only passes (an old completion without the pass columns
  // counts, a failed run does not).
  const stageLessonIds = new Set((stageLessonRows.data ?? []).map(l => l.id))
  const stagePassed = new Set(
    (stageLessonDone.data ?? [])
      .filter(c => c.passed !== false && stageLessonIds.has(c.lesson_id))
      .map(c => c.lesson_id)
  )
  const stageLessons = stageLessonIds.size > 0
    ? { total: stageLessonIds.size, passed: stagePassed.size }
    : null

  // Last completed script insight, from the second wave's read.
  const lastInsight: { title: string; why_it_works: string; sort_order: number; category: string | null } | null =
    lastScriptResult.data ?? null

  // Monthly wellbeing check in: due when it has never been done, or the last
  // one was more than 28 days ago. A gentle prompt, not a nag, and only once
  // the core setup is behind them so day one stays calm.
  const lastCheckin = lastCheckinResult.data
  // WHAT THIS FAMILY HAS NOT MET YET, for the discover slot in the flash up
  // rotation below.
  //
  // Justin: "all vital info on the parent home page, like the week round up,
  // gets in front of the user, and we rotate so everything we offer is at some
  // point front of mind."
  //
  // Built from signals already in hand rather than fresh queries. See
  // lib/dashboard/coverage.ts for why it offers only what has not been used,
  // and why it is seven cards and not eleven.
  const coverage = unmetCoverage({
    hasAgreement: setupFlags.agreement,
    hasKidLink: setupFlags.childLink,
    hasJobs: setupFlags.quests,
    hasPush: setupFlags.push,
    hasCheckin: !!lastCheckin,
    hasReadScript: !!lastCompletion,
    hasDoneLesson: stagePassed.size > 0,
  })

  const checkinDue = !lastCheckin
    || (Date.now() - new Date(lastCheckin.created_at).getTime()) > 28 * 24 * 60 * 60 * 1000

  const showTrial = inTrial(profile)
  const trialEnded = !isPaid && Boolean(profile?.trial_ends_at) && !showTrial

  // The child's jobs, read across for DiGi's greeting: whether today's jobs are
  // done and the on time streak, so the parent line says if they are on track
  // and links to the screen and jobs balance. The same strict streak the
  // passport uses. Best effort, silent if the tables are not there yet.
  let jobsStatus: 'on_track' | 'pending' | 'none' | undefined
  let jobsStreakDays = 0
  if (child?.id) {
    const jq = (jqRes.data ?? []) as StreakQuest[]
    const jt = (jtRes.data ?? []) as StreakTick[]
    jobsStatus = jobsTodayStatus(jq, jt)
    jobsStreakDays = computeJobsStreak(jq, jt).streakDays
  }

  // Once today's habit is done, a returning parent should land on quests, an
  // overview of what is waiting from their child, not the finished path. This
  // reads the same "day done" the greeting and the path use, so the lead only
  // changes once the daily loop is genuinely complete.
  // The visit marks roll first, then the summary reads the gap they describe.
  // Both fail soft to no card: this sits on a page with plenty else on it.
  const visit = await rollVisit(supabase, user.id)
  const catchup = visit
    ? await getCatchup(supabase, user.id, child?.id ?? null, child?.name ?? null, visit.since)
    : null

  const dailySteps = todayLoop.filter(t => t.key !== 'done')
  const dayComplete = dailyDone
    || investedMinutes(todayLoop) >= ((profile?.daily_minutes as number | null) ?? 10)
    || (dailySteps.length > 0 && dailySteps.every(t => t.done))
  const questsChildName = child?.name && child.name !== 'Your child' ? child.name : null

  // Finishing the daily habit is not the end of the day's work, it is the point
  // the parent is free to do the thing that actually moves the family along. So
  // rather than always pointing at the quests board, this picks the one real
  // next job and names it.
  //
  // The order is what would genuinely cost them most to miss: a child waiting
  // on an answer beats setting anything up, an empty jobs board beats the
  // passport (nothing else works without jobs), and once both are running the
  // passport is what is left. The child app handover is deliberately not in
  // here, because the Today card's child app row already owns that and saying
  // it twice on one screen is nagging.
  const noQuestsYet = (questsCountResult.count ?? 0) === 0
  const stageLessonsLeft = stageLessons ? stageLessons.total - stageLessons.passed : 0

  // The four strands, worked out once and read by both the after day check up
  // and whatever else wants them. The href comes from literacyStatuses, which
  // already decides where each strand is actually fixed: devices, quests or
  // lessons depending on what is wrong. It used to be dropped on the way to
  // the walk, which is the whole reason "fix this" did nothing. Only carried
  // while the strand is live, so a grey one never offers a tap.
  const literacyStrands = (['safe', 'balance', 'ai', 'social'] as const).map(k => {
    const live = stage.id >= (k === 'ai' || k === 'social' ? 3 : 1)
    return {
      key: k,
      name: k === 'safe' ? 'Safe online' : k === 'balance' ? 'Healthy balance' : k === 'ai' ? 'AI and chatbots' : 'Social media ready',
      tone: (live ? (literacyStatuses[k]?.tone ?? 'green') : 'grey') as 'green' | 'red' | 'grey',
      href: live ? literacyStatuses[k]?.href : undefined,
    }
  })

  const nextUp: { eyebrow: string; title: string; line: string; href: string; icon: string } =
    jobsStatus === 'pending'
      ? {
          eyebrow: "Today's habit done",
          title: questsChildName ? `${questsChildName}'s quests` : 'Family quests',
          line: 'Jobs to check off and any asks to answer',
          href: '/dashboard/quests', icon: '⭐',
        }
      : noQuestsYet
      ? {
          eyebrow: "Today's habit done",
          title: 'Set their first jobs',
          line: 'Real world jobs are what earn screen time, so nothing else starts moving until these exist.',
          href: '/dashboard/quests', icon: '🧹',
        }
      : stageLessonsLeft > 0
      ? {
          eyebrow: "Today's habit done",
          title: 'Move the passport on',
          line: `${stageLessons!.passed} of ${stageLessons!.total} lessons passed at ${stage.name}. Pass the rest to stamp this stage.`,
          href: '/dashboard/pathway', icon: '🛂',
        }
      : {
          eyebrow: "Today's habit done",
          title: questsChildName ? `${questsChildName}'s quests` : 'Family quests',
          line: jobsStatus === 'on_track'
            ? "Today's jobs are done. Check any asks and set tomorrow's"
            : 'Set the jobs and screen time to get the stars flowing',
          href: '/dashboard/quests', icon: '⭐',
        }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
      {/* More than one child: butter pills at the top switch whose day this
          is. Every reading below recomputes for the selected child. */}
      <ChildSwitcher kids={allKids} selectedId={child?.id ?? null} basePath="/dashboard" />

      {/* ── THE FIRST SCREEN ────────────────────────────────────────────────
          Two things, in this order, and then everything else.

          Justin: "when you open Duolingo first time it has pathway only on Home
          Screen scroll, this is neat."

          Step 2 put Today second and it was still not second. Seven things
          rendered above it: the round up card, DiGi's welcome, two trial
          banners, the mission welcome, the child app nudge and the deal review
          nudge. All of them conditional, so no parent met all seven, but any
          two of them together pushed the day below the fold on a phone. That is
          the whole complaint, and moving Today past ten components while
          leaving seven in front of it fixed about half of it.

          The rule now, and it is the only rule this screen has: WHOEVER IS
          WAITING, then THE DAY. Everything else is worth having and is not
          worth being met before those two, so it sits underneath in the order
          it always had. Nothing is deleted here. ─────────────────────────── */}
      {/* THE NOW SLOT: one fixed place for anything with a person on the
          other end of it, now speaking in the one voice phase 3 gave it: a
          single butter row, a pulse dot, a sentence naming who is waiting.
          Only ever one; approvals outrank the due check in. The quiet day
          stays a sentence, not a gap. */}
      <HomeLive
        checkinDue={todayLoop.some(t => t.key === 'checkin' && !t.done)}
        childName={child?.name ?? null}
      />

      {/* TODAY, THE SPINE OF THE SCREEN, second only to whoever is waiting.
          Justin, holding up Duolingo's home: "it has pathway only on Home
          Screen scroll, this is neat".
          This is that path and it has always been the right component. It was
          simply ELEVENTH on the page, under the community question, the quests
          lead and the day checkup, so the thing a parent opens the app to do
          was below the fold on a phone. Nothing about the card changed; only
          where it sits. Its own finished state already folds it to one line
          (see TodayPathBig), which is Justin's "after pathway is done for the
          day it should move away leaving all the next important tabs". */}
      {/* WHILE YOU WERE AWAY, above the day's tasks and only for someone who
          has been away. Justin: "how we keep them coming back to feel they are
          getting real use, feedback, enjoyment, seeing their child progress."
          The order is the argument: what your child DID, then what is waiting
          for you, then today's list. A parent who has not looked since Friday
          meets their child's week before they are handed another checklist.
          Nothing happened means no card, and a parent who is here every day
          never sees it, which is the point. It is news. */}
      {catchup && <CatchupCard catchup={catchup} childName={child?.name ?? null} />}

      <TodayPathBig tasks={todayLoop} dailyMinutes={(profile?.daily_minutes as number | null) ?? 10} childName={child?.name ?? undefined} streakCount={streak.count} />

      {/* THE TODAY CARD, volume two: everything that used to be its own
          banner or nudge card on this screen is a tick and fold row in here
          instead. The round up, the unread ideas, the child app handover,
          the deal review and the stage device settings, one place to look,
          one motion to learn. Renders nothing on a clear day; the calm
          sentence belongs to the Now slot above. */}
      <TodayCard
        childApp={!childAppLive && handoverChoice !== 'paper' ? { childName: child?.name ?? null } : null}
        dealReview={dealDaysSinceChange !== null && dealDaysSinceChange >= 14 ? { daysSinceChange: dealDaysSinceChange } : null}
        deviceSetup={setupComplete ? { stageId: stage.id, stageName: stage.name } : null}
        weekBrief={weekBrief ? {
          childName: child?.name && child.name !== 'Your child' ? child.name : null,
          lead: weekBrief.lead,
          preview: weekBrief.preview,
        } : null}
      />
      {/* DiGi comes up first, once a day, greeting the family by name */}
      <DigiWelcomeSheet
        childrenInfo={welcomeChildren}
        guide={{
          stageNum: stage.id,
          stageName: stage.name,
          childName: (child?.name && child.name !== 'Your child') ? child.name : 'your child',
          // DiGi's walk ends on today, one thing. While the child has never
          // opened their app, that IS the one thing: nothing else on the loop
          // pays off as much as the side of the product they cannot see yet.
          // Once they are in, it goes back to the normal daily loop.
          // Always the daily loop, never the handover. This used to jump to
          // Share the QR code whenever the child had not opened their app,
          // which is exactly the case where the Today card's child app row is
          // already on screen saying it, and where HomeRows was saying it a
          // third time. The handover stays out of the one next thing because
          // that row owns it; this is that rule actually applied.
          nextTask: (() => { const t = todayLoop.find(x => !x.done && x.key !== 'done'); return t ? { label: t.label, href: t.href } : null })(),
          strands: literacyStrands,
        }}
      />
      {/* Trial status: warm during, a real countdown inside the last day, an
          honest close after, never a lockout. The three registers and the
          honest techniques argument live in TrialCountdown. It used to say
          7 days after the trial became 4, which is exactly why the number now
          comes from TRIAL_DAYS rather than copy. */}
      {(showTrial || trialEnded) && (
        <TrialCountdown
          trialEndsAt={(profile?.trial_ends_at as string | null) ?? null}
          ended={trialEnded}
          trialDays={TRIAL_DAYS}
          jobsTicked={(jtRes.data ?? []).filter(t => (t as { status?: string }).status === 'approved').length}
          streakCount={streak.count}
        />
      )}
      {/* Welcome back, one beat, gone. Each open introduces a different thing
          the platform does, and what we do with what you tell it, so a parent
          meets the whole product across a fortnight of quick hellos instead of
          a tour nobody sits through. Anything not set up yet leads. */}
      <MissionWelcome
        firstName={firstName}
        flags={setupFlags}
        phoneAge={phoneAge}
        handoverChild={handoverChild}
      />

      {/* Year 6 into Year 7. The one card that earns a place near the top
          without being asked for: it happens once, and what a family decides in
          these few weeks sets the next five years. */}
      {phoneBridge && <PhoneBridgeCard bridge={phoneBridge} />}

      {/* Otherwise, whatever school has coming, four to six weeks out. Early
          enough to be a head start rather than a warning. */}
      {schoolAhead && <SchoolAheadCard ahead={schoolAhead} />}

      {/* What the class will be working on next term. Three subjects, one line
          each, and one thing to do about it. Only in a holiday and the first
          week back, because that is when the question is live. */}
      {termPreview && (
        <TermPreviewCard preview={termPreview} childName={(child?.name as string | null) ?? null} />
      )}

      {/* DiGi greets in one line: who, where on the road, and what today
          costs in minutes, with the streak flame alongside. The h1 header
          this replaces said the same things across three rows. */}
      {(() => {
        const dailyBudget = (profile?.daily_minutes as number | null) ?? 10
        const spent = investedMinutes(todayLoop)
        const stepsAllDone = todayLoop.filter(t => t.key !== 'done').every(t => t.done)
        return (
          <DigiGreeting
            firstName={firstName}
            childName={child?.name ?? undefined}
            stageName={stage.name}
            stageNum={stage.id}
            minutesLeft={Math.max(1, dailyBudget - spent)}
            dayDone={spent >= dailyBudget || stepsAllDone}
            streakCount={streak.count}
            aliveToday={streak.aliveToday}
            jobsStatus={jobsStatus}
            jobsStreakDays={jobsStreakDays}
            balanceHref="/dashboard/quests"
          />
        )
      })()}

      {/* The monthly community bite, now BELOW today rather than above it. One
          question a month is worth having and is not worth the second slot on
          the screen: a parent who has not done their day yet has something
          better to do than answer it. Silent once answered, until next month. */}
      <CommunityBite />

      {/* Day done, so lead with quests. A returning parent whose daily habit is
          finished lands on an overview of what is waiting from their child,
          jobs to check and asks to answer, one tap into the Quests board. This
          sits above the finished path so the day's next real thing is first.
          Silent until the habit is done, so it never crowds the path. */}
      {dayComplete && (
        <Link href={nextUp.href} style={{ textDecoration: 'none', display: 'block', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', background: 'linear-gradient(135deg, #FFF7EA 0%, #FCEAC0 100%)', border: '1.5px solid var(--gold)', borderRadius: '22px', padding: '18px 20px', boxShadow: '0 10px 26px -12px rgba(198,144,24,0.45)' }}>
            <span style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '15px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', boxShadow: '0 3px 8px rgba(198,144,24,0.18)' }}>{nextUp.icon}</span>
            {/* The words own the whole width, and Open sits under them. As a
                third column the fixed Open pill starved the title into one
                word a line at larger text sizes (Justin's screenshot,
                8 August). */}
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '4px' }}>{nextUp.eyebrow}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                {nextUp.title}
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', marginTop: '3px', lineHeight: 1.4 }}>
                {nextUp.line}
              </span>
              <span style={{ display: 'inline-block', marginTop: '10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', background: 'var(--gold)', borderRadius: '13px', padding: '9px 18px', boxShadow: '0 4px 0 var(--gold-dark)' }}>Open</span>
            </span>
          </div>
        </Link>
      )}

      {/* And then the wider check on the child, which used to be step one of
          DiGi's morning walk. It came before the day's one thing, which is the
          wrong way round: follow the path first, check on the child after.
          Silent unless a strand is red or lessons are waiting, so silence
          honestly means checked and fine. */}
      {dayComplete && (
        <DayCheckup
          childName={child?.name ?? null}
          stageNum={stage.id}
          stageName={stage.name}
          strands={literacyStrands}
          lessonsLeft={stageLessonsLeft}
          lessonsTotal={stageLessons?.total ?? 0}
        />
      )}


      {/* Everything else folds to big friendly rows: quests with the live
          approve count, the road to 16 with the stamp position, and DiGi.
          Sundays add the round up row. The full quest board lives on the
          Quests page, the full road on the Pathway page, the strand ticks on
          the Progress page. */}
      {(() => {
        const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/London' }).format(new Date())
        return (
          <HomeRows
            stageName={stage.name}
            stageNum={stage.id}
            criticalWindow={stage.isCritical}
          />
        )
      })()}

      {/* Stage the reveal: DiGi introduces one newly unlocked feature to a new
          parent, once. Silent for an established account. */}
      <RevealCard reveals={reveals} />

      {/* The Sunday round up keeps its spot: it carries the agreed plan through
          the week and is a weekly ritual, not a daily nag. */}
      {revealed.has('wellbeing') && <SundayCheckIn />}

      {/* One DiGi interrupt, and only now and then. The flash up gate shows a
          SINGLE card on the first visit of a day, at most twice a week, never
          two days running, rotating the theme: a lesson one time, a printable
          another, a script, a gentle moment, a device check in, and most days
          nothing at all. Each slot may still self hide (a device check in with
          no pattern to raise), which simply makes it a quiet day. This replaces
          the old stack of device check in, wondering and the standalone lesson
          nudge, so a parent never meets a wall of DiGi cards. */}
      <DigiFlashUp
        slots={[
          ...(lessonNudge ? [{ key: 'lesson', node: (
            <DigiLessonNudge childId={child?.id ?? null} childName={lessonChildName} code={lessonNudge.code} title={lessonNudge.title} catchphrase={lessonNudge.catchphrase} />
          ) }] : []),
          ...(revealed.has('lessons') && flashPrintable ? [{ key: 'printable', node: (
            <DigiPrintableNudge emoji={flashPrintable.emoji} title={flashPrintable.title} blurb={flashPrintable.blurb} />
          ) }] : []),
          ...(flashScript ? [{ key: 'script', node: (
            <DigiScriptNudge title={flashScript.title} situation={flashScript.situation} sortOrder={flashScript.sort_order} />
          ) }] : []),
          ...(revealed.has('wellbeing') ? [{ key: 'moment', node: <DigiWondering /> }] : []),
          ...(revealed.has('wellbeing') ? [{ key: 'device', node: <DigiDeviceCheckin /> }] : []),
          // The discover slot. Only present when there is genuinely something
          // this family has not met, so it takes a turn in the rotation while
          // that is true and disappears from it entirely once they have seen
          // everything. A family who has met the lot gets a quieter Home,
          // which is the right reward rather than a bug.
          ...(coverage.length > 0 ? [{ key: 'discover', node: <DigiDiscoverNudge card={coverage[0]} /> }] : []),
        ]}
      />

      {/* Setup lives on its own page now, out of the daily Home. While it is
          unfinished, Home carries one compact way in, naming the next step;
          when it is done, this disappears and Home stays clean. */}
      {!setupComplete && (() => {
        const doneCount = setupSteps.filter(s => setupFlags[s.key]).length
        const next = setupSteps.find(s => !setupFlags[s.key])
        return (
          <Link href="/dashboard/setup" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '15px 18px',
              boxShadow: '0 4px 16px rgba(201,154,40,0.12)',
            }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '13px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>🧭</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
                  Finish setting up
                </span>
                <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {doneCount} of {setupSteps.length} done{next ? ` · next: ${next.title.toLowerCase()}` : ''}
                </span>
                <span style={{ display: 'inline-block', marginTop: '8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '11px', padding: '8px 15px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
                  Continue
                </span>
              </span>
            </div>
          </Link>
        )
      })()}
      <SetupUnlockToast flags={setupFlags} />

      {/* The child's name was skipped at setup: one gentle ask, one tap to make
          the whole app personal. Dismissable, never nags. */}
      {(!child?.name || child.name === 'Your child') && <AddChildName />}

      {/* The problem first: the concern this family keeps flagging, named, with
          its arc and the one tap path to the words that fix it tonight. The
          whole platform framed the way the parent experiences it: my problem,
          the clear route to the solution. Falls back to the challenge they
          told us at signup, and stays silent when there is nothing live. */}
      {(() => {
        const focusConcern = focusConcernResult.data
        const challengeLabels: Record<string, string> = {
          morning_tv: 'Morning TV battles', controller_fights: 'Controller fights',
          wont_put_down: 'Will not put the device down', bedtime_screens: 'Bedtime screens',
          mood_after_screens: 'Mood after screens', something_else: '',
          screens_takeover: 'Screens are taking over', mood_changes: 'Mood changes after phone use',
          gaming: 'Gaming concerns', online_safety: 'Online safety worries',
          start_conversation: 'Starting the conversation', asking_for_phone: 'Asking for a phone',
        }
        const challengeKey = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? ''
        const label = focusConcern?.label ?? challengeLabels[challengeKey] ?? ''
        if (!label) return null
        const improving = focusConcern?.status === 'improving'
        const scriptHref = todayLoop.find(t => t.key === 'script')?.href ?? '/dashboard/scripts'
        return (
          <Link href={scriptHref} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: '14px', padding: '11px 14px',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                Your focus
              </span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label}
                <span style={{ fontWeight: 600, color: improving ? 'var(--stage-1-text)' : 'var(--ink-muted)' }}>
                  {' '}· {focusConcern ? (improving ? 'getting better' : 'working on it') : 'your starting focus'}
                </span>
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                The words for tonight →
              </span>
            </div>
          </Link>
        )
      })()}

      {/* The glanceable stat row: streak, stars in the bank, today's quests,
          the three numbers a parent wants at a glance. */}
      <HomeStats streakCount={streak.count} streakTotal={streak.total} />

      {/* Push notification opt-in. Rendered whenever check ins are not yet on
          (so the enable button is always reachable, including when a parent
          taps the Turn on check ins step out of order), and kept once they are
          on so the granted state and Send a test stay available. The id is the
          anchor the setup step link scrolls to. Stays outside the fold below
          so that link never lands on a closed drawer. */}
      <div id="turn-on-check-ins" style={{ marginBottom: '20px', scrollMarginTop: '80px' }}>
        <PushPrompt userId={user.id} stage={`Stage ${stage.id}`} />
      </div>

      {/* The five places a parent actually goes, then one door to the rest.
          Home carried two grids of tiles under each other, sixteen and nine,
          plus a sticky strip of jump chips to navigate its own length. A screen
          that needs a table of contents is too long. Both grids are gone and
          every tile that was in them is on /dashboard/explore, grouped, with a
          way back. Today's path above this is untouched. */}
      <div id="dash-explore" style={{ paddingTop: '10px', scrollMarginTop: '64px' }}>
        <HomeMain />
      </div>

      {/* There were TWO eyebrows here, back to back, with nothing at all
          between them: "Your cards and prompts" labelled no content and was
          immediately followed by the one below. On a phone that reads as a
          heading whose section failed to load. One heading, for the section
          that actually exists.

          Below the daily flow, quieter: the streak card, DiGi's proactive
          prompts, the ranked alerts and the age gate. */}
      {/* Five components, one line until asked for.
          This block already carried its own eyebrow, already sat below the
          daily flow, and is already the quiet half of Home: the streak card,
          DiGi's prompts, the ranked alerts and the age gate. Five full width
          cards is most of a phone screen for the part of the page a parent
          reads last. Folded, it is one row that still says where the streak is,
          so nothing is lost but the height. */}
      <div id="dash-more" style={{ scrollMarginTop: '64px' }}>
        <FoldSection
          label="DiGi, your streak and alerts"
          value={streak.count > 0 ? `${streak.count} day streak` : undefined}
          count={suggestions.length}
        >
          <DigiStreakWidget count={streak.count} aliveToday={streak.aliveToday} firstName={firstName} />
          {revealed.has('moments') && (
            <>
              <DigiPrompts />
              <SmartAlerts suggestions={suggestions} />
              {/* Looking ahead at Builder (Stage 2): DiGi rotates two calm pre
                  warnings so only one shows, and never every day, the phone
                  conversation and the secondary school social media move. From
                  Stage 3 the full readiness panel takes over. */}
              {stage.id === 2 && (
                new Date().getDate() % 2 === 0
                  ? <PhoneHeadsUp childName={child?.name} />
                  : <SocialMediaHeadsUp childName={child?.name} />
              )}
              <SocialMediaReadiness stageId={stage.id} childName={child?.name} />
            </>
          )}
        </FoldSection>
      </div>

      {/* DiGi check in — surfaces last reflective answer if the parent responded */}
      {lastFeedback && (
        <div style={{
          background: 'var(--stage-5)',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 22px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '9px',
              background: 'var(--terracotta)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 0 var(--terracotta-dark)',
            }}>
              <span style={{ fontSize: '.9rem', color: '#fff', lineHeight: 1 }}>◎</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>DiGi</div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}>Following up from {lastFeedback.feedback_date === today ? 'earlier today' : 'yesterday'}</div>
            </div>
          </div>

          {lastFeedback.digi_insight ? (
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
              {lastFeedback.digi_insight}
            </p>
          ) : (
            <>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                You answered: &ldquo;{lastFeedback.parent_response!.length > 120 ? lastFeedback.parent_response!.slice(0, 117) + '...' : lastFeedback.parent_response}&rdquo;
              </p>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                {buildDigiFollowup(stage.id, child?.name ?? null)}
              </p>
            </>
          )}

          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', textDecoration: 'none', marginTop: '14px', display: 'inline-block' }}>
            Continue with DiGi →
          </Link>
        </div>
      )}

      {/* Things you need to know: open school actions from forwarded school
          emails, or added by hand. The id is the anchor the setup path's
          school step points at, so Go lands right here, not on a separate
          page the parent then has to hunt through for the add form. */}
      {/* Open only when school has actually sent something.
          The biggest component on Home at 675 lines, and on most days it is a
          card saying there is nothing. Folded it costs one line and still says
          so; with actions waiting it opens itself and carries a red count,
          because a school deadline is the one thing here a parent cannot
          afford to scroll past. Same rule as the quest tabs. */}
      <div id="school-actions" style={{ scrollMarginTop: '64px' }}>
        <FoldSection
          label="From school"
          value={schoolActions.length === 0 ? 'Nothing waiting' : undefined}
          count={schoolActions.length}
          alert={schoolActions.length > 0}
          open={schoolActions.length > 0}
        >
          <SchoolActionsCard actions={schoolActions} childName={child?.name} region={familyRegion} />
        </FoldSection>
      </div>

      {/* School email promo: only when school is the current setup step, or
          once the core setup is complete, so it waits its turn like the rest. */}
      {!hasSchoolConnection && (currentSetupStep === 'school' || setupComplete) && <SchoolPromoCard />}

      {/* Moment cards section */}
      {todayMoments.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Moment cards</p>
            <Link
              href="/dashboard/moments"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 500 }}
            >
              Browse all →
            </Link>
          </div>
          {/* One row that scrolls sideways, not ten rows that scroll down.
              todayMoments takes up to twenty, and at a 170px minimum in a two
              column grid that is ten rows, roughly 1,800px, for a section a
              parent browses rather than acts on. The rail is the Apple TV and
              Prime Video pattern: a section costs one row of height however
              many things are in it, and Browse all is already there for anyone
              who wants the full set laid out.

              Still a grid, just flowing across instead of down, so every card
              inside keeps the sizing it already had. No scroll snapping: it
              needs scroll-snap-align on each child and those live inside
              MomentCard, so declaring only the container half would have been a
              line that looks like it does something and does not. */}
          <div style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(150px, 170px)',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: 6,
            // The cards have their own rounded corners and shadows, so let them
            // reach the screen edge on a phone rather than stopping short of it,
            // which is what tells a thumb there is more to the right.
            marginInline: -4,
            paddingInline: 4,
          }}>
            {todayMoments.map(moment => (
              <MomentCard
                key={moment.id}
                moment={moment}
                childName={child?.name ?? undefined}
                ageBand={child?.age_band ?? undefined}
              />
            ))}
            {/* The grid always closes with quick help to every moment */}
            <Link href="/dashboard/moments" style={{ textDecoration: 'none' }}>
              <div style={{
                height: '100%', minHeight: '170px',
                background: 'var(--deep-teal)', borderRadius: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '10px', padding: '18px 14px', textAlign: 'center',
              }}>
                <span style={{
                  width: 56, height: 56, borderRadius: '16px', background: 'rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)',
                }}>✨</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: '#fff', lineHeight: 1.25 }}>
                  All moments
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
                  Quick help for any battle, any time of day
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Last script insight */}
      {lastInsight && (
        <div style={{
          background: 'var(--stage-2)',
          border: '1.5px solid var(--stage-2)',
          borderRadius: '16px',
          padding: '22px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              Last script insight
            </div>
            <Link
              href={`/dashboard/scripts/${lastInsight.sort_order}/deck`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', textDecoration: 'none', letterSpacing: '0.06em' }}
            >
              Read again →
            </Link>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '8px' }}>
            {lastInsight.title}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {lastInsight.why_it_works}
          </p>
        </div>
      )}

      {/* Everything below is the fuller home. It waits until setup is done,
          so a new parent gets a calm first screen, the conductor and today's
          practice, not a wall of explore me cards on day one. */}
      {setupComplete && (<>

      {/* Monthly wellbeing check in prompt: the mission made real, you in view
          not only your child. Shown when a check in is due. */}
      {checkinDue && (
        <Link href="/dashboard/checkin" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
          <div style={{
            background: 'var(--stage-4)', border: '1.5px solid var(--stage-4)',
            borderRadius: '16px', padding: '20px 22px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <span style={{
              width: 48, height: 48, borderRadius: '14px', background: 'var(--deep-teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', flexShrink: 0,
            }}>💛</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
                Monthly check in
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '2px' }}>
                A minute for you, {firstName}
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                How have you been this month? Not your child. You.
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
          </div>
        </Link>
      )}

      {/* This week's actions */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            This week's actions
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta)' }}>
            {child?.actions_this_week ?? 0} done from daily practice
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {WEEKLY_ACTIONS.map((action, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--terracotta)',
                flexShrink: 0,
                marginTop: '7px',
              }} />
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>{action}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', padding: '14px 16px', background: 'var(--stage-5)', border: '1px solid var(--stage-5)', borderRadius: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi tip
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {stage.id <= 2
              ? 'The bedroom rule is the single most effective structural protection at this stage. If it is not in place, this is the week.'
              : stage.id === 3
              ? 'The algorithm conversation opens more than any rule will close. Curiosity, not alarm.'
              : 'The weekly check in, same day same time, is your relationship maintenance. It does not have to be about screens.'}
          </p>
          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', textDecoration: 'none', marginTop: '8px', display: 'block' }}>
            Ask DiGi →
          </Link>
        </div>
      </div>

      </>)}

      {/* DiGi quick access */}
      <div style={{ background: 'var(--stage-5)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              DiGi
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '0' }}>
              Ask me anything about your child&apos;s digital world
            </h3>
          </div>
          {!isPaid && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
              3 / day free
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {getStagePrompts(stage.id).map((prompt, i) => (
            <Link
              key={i}
              href={`/dashboard/digi?q=${encodeURIComponent(prompt)}`}
              style={{
                display: 'block',
                padding: '10px 14px',
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: 'var(--text-base)',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                lineHeight: 1.4,
              }}
            >
              {prompt}
            </Link>
          ))}
        </div>

        <Link href="/dashboard/digi" className="btn btn-gold" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          Open DiGi
        </Link>
      </div>

      {/* Upgrade nudge for free users */}
      {!isPaid && (
        <div style={{ border: '2px solid var(--stage-5)', borderRadius: '16px', padding: '20px 22px', background: 'var(--stage-5)' }}>
          <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate, 50 places</p>
          <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Unlock everything for £7.99 / month</h3>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            All 5 stages, unlimited DiGi, 100 plus scripts, the AI module, wellbeing tracker. First 50 members only.
          </p>
          <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
            Claim founder rate
          </Link>
        </div>
      )}

        </div>
  )
}

function buildDigiFollowup(stageId: number, childName: string | null): string {
  const name = (childName && childName !== 'Your child') ? childName : 'your child'
  const messages: Record<number, string> = {
    1: `The pattern you described is very common at this stage. ${name.charAt(0).toUpperCase() + name.slice(1)} is not being difficult. Structure does the work that willpower cannot. One consistent boundary this week is worth more than five conversations.`,
    2: `What you noticed matters. At this stage the fix is almost always structural, not a new conversation. Think about the environment first: what needs to change before you say anything?`,
    3: `The mood signal you picked up on is real and it matters. Tracking it for one more week will give you a clearer picture before you say anything to ${name}. Curiosity before action.`,
    4: `Trust is the only currency at Stage 4. How you responded to what you noticed will shape whether ${name} comes to you with the next thing. Openness over interrogation.`,
    5: `At this stage you are building the relationship that outlasts the rules. What you noticed is worth holding lightly. One open question today is better than ten closed ones.`,
  }
  return messages[stageId] ?? messages[3]
}

function getStagePrompts(stageId: number): string[] {
  const prompts: Record<number, string[]> = {
    1: [
      'How do I manage screen time without constant battles?',
      'When should my child get their first device?',
      'How do I set up the bedroom rule?',
    ],
    2: [
      'How do I introduce the bedroom rule without a fight?',
      'My child wants to play games online, is that safe?',
      'What does a good screen time routine look like at this age?',
    ],
    3: [
      'Her mood drops after Instagram, what do I say tonight?',
      'My son wants TikTok, how do I handle this?',
      'How do I have the algorithm conversation?',
    ],
    4: [
      'He is secretive about his phone, how do I approach this?',
      'She found something upsetting online, what do I do?',
      'How do I keep the conversation open without being controlling?',
    ],
    5: [
      'How do I talk about deepfakes and AI content?',
      'She defines her worth by her follower count, how do I help?',
      'What does genuine digital independence look like at 16?',
    ],
  }
  return prompts[stageId] ?? prompts[3]
}
