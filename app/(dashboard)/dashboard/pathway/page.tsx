import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES, type ChallengeId } from '@/lib/content/stages'
import PathwayEvidence from '@/components/pathway/PathwayEvidence'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import { getReadinessAreas } from '@/lib/pathway/readiness-areas'
import { AREA_ORDER, AREA_START, LITERACY_AREAS } from '@/lib/content/literacy'
import { childWorries, improvedLine } from '@/lib/concerns/sorted'
import { getStageProgress, getAllStagesProgress, type StageId as ProgressStageId } from '@/lib/pathway/progress'
import BackTo from '@/components/nav/BackTo'
import { pickChild } from '@/lib/children/select'
import PassportBook from '@/components/pathway/PassportBook'
import PathwayIntro from '@/components/pathway/PathwayIntro'
import PathwayComplete from '@/components/pathway/PathwayComplete'
import { type Stamp, type StampStatus } from '@/components/pathway/PassportStamps'
import StageReadiness from '@/components/pathway/StageReadiness'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { READINESS } from '@/lib/content/readiness'
import IsItWorkingReport from '@/components/pathway/IsItWorkingReport'
import FiveADayReport from '@/components/pathway/FiveADayReport'
import { getFiveADayReport } from '@/lib/kid/day-report'
import WhatIsWorkingLink from '@/components/working/WhatIsWorkingLink'
import { buildPassportSections } from '@/lib/pathway/passport-sections'
import { readPassportChild } from '@/lib/pathway/passport-child'
import { isStageStamped } from '@/lib/pathway/stamped'
import { createAdminClient } from '@/lib/supabase/admin'
import { stampedStages } from '@/lib/pathway/stamp-store'
import { restingConcernIds, TOP_BAND } from '@/lib/concerns/resting'
import { readScores, type ScoredEvent } from '@/lib/concerns/scores'
import { getWeekParentReport } from '@/lib/balance/week-report'
import SocialRoadNova from '@/components/pathway/SocialRoadNova'
import { getSocialRoad } from '@/lib/pathway/social-road'
import { buildStrands, withChild, StrandCards } from '@/components/passport/Application'
import BalanceZone, { type DayDot } from '@/components/passport/BalanceZone'
import { starWeekStart } from '@/lib/quests/star-week'
import { londonToday } from '@/lib/pathway/today'
import { stagePace, paceLine } from '@/lib/pathway/pace'
import { passportStageFor } from '@/lib/lessons/school-path'
import MarkPassportLook from '@/components/daily/MarkPassportLook'
import PassportPicture, { type PictureStamp } from '@/components/passport/PassportPicture'
import { PassportProgress, PassportNextCard, PassportLearnt, type LearntLesson } from '@/components/passport/PassportPageDetail'
import PassportOrderCard from '@/components/passport/PassportOrderCard'
import { pageCount } from '@/lib/pathway/page-count'
import { passportNext, type NextStep } from '@/lib/pathway/passport-next'
import { loadPassportToday } from '@/lib/pathway/passport-today'
import { STAGE_PAGES } from '@gc/shared/stage-map'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import { schoolYearFromDob } from '@/lib/lessons/school-path'

// ═══ THE PASSPORT, IMAGE FIRST (17 October 2026) ══════════════════════════════
//
// Justin, holding this tab on his phone: "way too complicated. ... a neat
// image of the passport with clear planet turned stamps filling up near
// completion, ability to order the real passport and stickers. Please make
// super image driven but clear." (his brief on PR 1312; the plan is
// plans/2026-10-16-passport-journey-plan.md). So the page is five blocks:
//   1. the picture of the passport, five planet stamps, colour when earned,
//      grey until then, the current one filling up; each stamp opens its page
//   2. that page's one count, split by who ("7 of 12 done")
//   3. its one next step (lib/pathway/passport-next.ts)
//   4. what was learnt: lessons passed with their check, nothing else
//   5. the printed passport and the stickers, as pictures, one button
// and everything else (the flip book, the strands, the balance, the check
// card, the record) folded under "The full book and the record". The six
// places that used to say "next" are one. What follows is the August history
// of the page this replaced, kept because the reasons still hold.
//
// ═══ THE PASSPORT IS THE APPLICATION, AND THE APPLICATION IS THE WHOLE PAGE ═
//
// Justin, 18 August 2026, answering the one open question on the approved
// mock: "application becomes the whole page i think its best." So this page
// is now exactly the eight screen design and nothing else: the application
// for social media at 16, filled per child by four strands, with the book
// untouched at its centre.
//
// The Mercury skeleton, three bands under one slim header:
//   1. WHERE THE APPLICATION IS: the slim header with the stage, the ring and
//      the timeline line (on track, as a rhythm, never a deadline).
//   2. WHAT TO DO RIGHT NOW: exactly one task lit in butter, then the book
//      and the four strand cards counting down.
//   3. THE RECORD: everything that reports rather than asks, folded into one
//      disclosure at the foot so the page stays a next step.
//
// WHAT LEFT THIS PAGE, and where it went, because five different sessions
// have put things here and a bare removal reads as a loss:
//   The six door tiles       -> the rail and the strand cards ARE the doors.
//   The stage road           -> its job here is done by the book's five pages
//                               and the timeline; the component survives for
//                               any surface that wants the drawn road.
//   Meet the friends         -> the squad page, and the Planet Friend pop in
//                               on Today, which is where the characters live
//                               daily.
//   The journey block        -> the one next task rail says the single next
//                               step, at #next-step. It is NOT #working-on:
//                               that belongs to the list of moments below.
//   The DiGi reassurance and
//   help cards               -> DiGi closes the Today loop every day and sits
//                               on the tab bar; two more cards here were the
//                               same invitation in a third and fourth place.
//   The child switcher       -> the plumbing session's rail in the dashboard
//                               layout takes over the moment this page is
//                               added to its route list; until then ?child=
//                               still drives everything, and the children
//                               list at the foot still switches.
//
// EVERY LINK OUT CARRIES THE CHILD (withChild), or a tap would silently reset
// the parent's choice under the layout rail. The plumbing session hit this
// exact bug in their own nav and warned us; it is a rule now, not a nicety.

// date_of_birth feeds the timeline's pace arithmetic: the one true date in
// the system is the birthday that ends the stage.
type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null; date_of_birth: string | null; passport_code: string | null }

export default async function PathwayPage({ searchParams }: { searchParams: Promise<{ child?: string; from?: string; passportday?: string; open?: string }> }) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  const { child: childParam, from, passportday, open } = await searchParams
  // ?open=N flips the book open on that page after paint: the peek on Today
  // and anything else that has already told the parent which page moved.
  const openAt = Number(open)
  const openAtStage = Number.isInteger(openAt) && openAt >= 1 && openAt <= 5 ? openAt : null

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks, date_of_birth, passport_code').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])

  const isPaid = hasFullAccess(profileResult.data, user.email)
  const children = (childrenResult.data ?? []) as Child[]

  const stageIdToNum: Record<string, number> = {
    foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
  }

  // The whole application renders for the selected child (?child=<id>),
  // defaulting to the primary, so every sibling gets their own book.
  const primaryChild = pickChild(children, childParam)
  // ONE CLOCK (plans/2026-10-16-passport-journey-plan.md, decision 1, 17 October
  // 2026): the passport page follows the school year, the same clock as the
  // lessons, so a Year 8 child who has turned 13 is on the page their class is
  // on, with lessons they can open. children.stage_id stays on the birthday
  // for everything that is not the passport.
  const passportStage = primaryChild ? passportStageFor(primaryChild) : null
  const currentStageNum = passportStage ? stageIdToNum[passportStage] ?? null : null

  // The child's own five a day, for the record at the foot. Read with the
  // parent's client so the existing RLS policy is what decides, and empty for
  // a child with no app rather than an error.
  const fiveADay = await getFiveADayReport(supabase, primaryChild?.id ?? null)

  const [currentStageProgress, allStagesProgress] = primaryChild && passportStage
    ? await Promise.all([
        getStageProgress(supabase, user.id, passportStage as ProgressStageId, primaryChild.streak_weeks ?? 0, primaryChild.id),
        getAllStagesProgress(supabase, user.id, primaryChild.streak_weeks ?? 0, primaryChild.id),
      ])
    : [null, null]

  // What the passport's five section checklist needs beyond the per stage
  // blend: how many moments are open against how many this family has already
  // sorted, and this week's balance. Scoped to the SELECTED child (migration
  // 194): their own worries plus family wide null child_id rows, never a
  // sibling's, so a worry about the teenager cannot drag the six year old's
  // percentage down.
  const childScope = primaryChild?.id ? `child_id.eq.${primaryChild.id},child_id.is.null` : 'child_id.is.null'
  // The first sibling who is not the selected child, for the balance glance:
  // the quiet pull to switch when the OTHER child's week needs a look.
  const sibling = children.find(c => c.id !== primaryChild?.id) ?? null
  const [openMomentsRes, solvedMomentsRes, weekReport, weekTicksRes, siblingReport] = await Promise.all([
    supabase.from('concerns').select('id, last_flagged_at, created_at').eq('user_id', user.id).or(childScope).in('status', ['open', 'improving']),
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).or(childScope).eq('status', 'resolved'),
    getWeekParentReport(supabase, user.id, primaryChild ?? null),
    // This star week's approved ticks for the selected child, for the balance
    // zone's seven day dots and the jobs in a row voice. Null child ticks are
    // family jobs and count until migration 206 gives each child their own.
    primaryChild?.id
      ? supabase.from('quest_ticks').select('tick_date, child_id').eq('user_id', user.id).eq('status', 'approved').gte('tick_date', starWeekStart())
      : Promise.resolve({ data: null }),
    sibling ? getWeekParentReport(supabase, user.id, sibling) : Promise.resolve(null),
  ])
  // A RESTING WORRY COUNTS AS SORTED. The check in stopped asking about a
  // worry the parent scored five stars (lib/concerns/resting), and the child's
  // passport stamps it, but this row still counted it as open because it read
  // the raw status. So a parent could watch the check in say "sorted" and the
  // passport say "2 to resolve" about the same two worries. One rule, read
  // here too. Found in the passport audit, 2 September 2026.
  const liveRows = (openMomentsRes.data ?? []) as { id: string; last_flagged_at: string | null; created_at: string }[]
  let restingCount = 0
  if (liveRows.length > 0) {
    const { data: ev } = await supabase
      .from('concern_events').select('concern_id, score, created_at')
      .in('concern_id', liveRows.map(r => r.id)).not('score', 'is', null)
      .order('created_at', { ascending: false })
    const read = readScores((ev ?? []) as ScoredEvent[], TOP_BAND)
    restingCount = restingConcernIds(
      liveRows.map(r => ({ id: r.id, last_flagged_at: r.last_flagged_at ?? r.created_at })),
      read.topRun, read.lastAt,
    ).size
  }
  const stageSections = await buildPassportSections(
    supabase, user.id, primaryChild ?? null, allStagesProgress, currentStageNum,
    {
      openMoments: Math.max(0, liveRows.length - restingCount),
      solvedMoments: (solvedMomentsRes.count ?? 0) + restingCount,
      parentReport: weekReport,
    },
  )

  const currentStageContent = currentStageNum ? STAGES.find(s => s.id === currentStageNum) : null

  // This child's own check passes, fetched BEFORE the stamps and the end of
  // road celebration because both are gated on them.
  const passedStages = await getPassedStageQuizzes(supabase, user.id, primaryChild?.id ?? null)
  // The stored stamps (migration 378): a page earned once stays earned, and a
  // page the rule reads as earned today is stored on the way through.
  const storedStamps = allStagesProgress
    ? await stampedStages(createAdminClient(), { userId: user.id, childId: primaryChild?.id ?? null, progress: allStagesProgress, passed: passedStages })
    : new Set<number>()

  // Content complete AND this child's check passed, stage by stage: the same
  // two halves a single stamp needs, so the end of road celebration can never
  // fire for a child who has not sat their own checks.
  const allStagesEarned = !!allStagesProgress
    && (['foundation', 'builder', 'explorer', 'shaper', 'independent'] as ProgressStageId[])
      .every((slug, i) => isStageStamped(allStagesProgress[slug], passedStages, i + 1, storedStamps))

  // ── THE FOUR THINGS, COUNTED ONCE ──────────────────────────────────────────
  //
  // One read of the four areas for every stage (lib/pathway/readiness-areas.ts,
  // the one rule), handed to the literacy reading for the check card and
  // printed on every page of the passport book. Justin, 13 September 2026: the
  // passport is "updated based on progression through the areas we have agreed
  // need to be met". Alongside it, the worries as the child's own passport
  // reads them, for the behaviour line on the parent's book.
  const [areasRead, worries] = await Promise.all([
    getReadinessAreas(supabase, user.id, primaryChild?.id ?? null),
    primaryChild?.id ? childWorries(supabase, user.id, primaryChild.id) : Promise.resolve([]),
  ])
  const improved = improvedLine(worries)

  // One live literacy reading, for the end of stage check's greens and ambers.
  const litStatuses = await getLiteracyStatuses(supabase, user.id, currentStageNum ?? 1, primaryChild?.id ?? null, areasRead)

  // The start age per area is declared once, in lib/content/literacy.ts.
  const READINESS_AREAS = AREA_ORDER.map(key => ({ key, name: LITERACY_AREAS[key].name, startStage: AREA_START[key] }))
  const stageNum = currentStageNum ?? 1
  const activeAreas = READINESS_AREAS.filter(a => stageNum >= a.startStage)
  const readinessAmbers = activeAreas
    .filter(a => (litStatuses[a.key]?.tone ?? 'green') !== 'green')
    .map(a => ({ name: a.name, improve: litStatuses[a.key]?.improve ?? 'Do the next step', href: litStatuses[a.key]?.href ?? '/dashboard/lessons' }))
  const readinessGreens = activeAreas.length - readinessAmbers.length
  const lessonsLeft = Math.max(0, (currentStageProgress?.lessonsTotal ?? 0) - (currentStageProgress?.lessonsDone ?? 0))
  const stageQuizPassed = passedStages.has(stageNum)

  // The check is the child's and lives on their own link, so all this page
  // needs is the token to send them to it.
  const { data: kidLink } = primaryChild?.id
    ? await supabase.from('kid_links').select('token').eq('child_id', primaryChild.id).maybeSingle()
    : { data: null }

  // ── THE CHILD'S OWN NUMBERS, FINALLY ON THE PAGE ───────────────────────────
  //
  // lib/pathway/passport-child.ts has computed these since 10 September and
  // was called from exactly one place: a dev fixture with the numbers hard
  // coded. So every passport in production showed five rows about what a
  // GROWN UP had done, on an object with the child's name on the cover, and
  // the days they had finished in their own app and the stars they were
  // holding were never drawn.
  //
  // Justin, 11 September 2026: "the passport needs to sync that when kids do
  // their today jobs it adds a star per day." The star is real now, paid by
  // the approval (lib/quests/day-star); this is where a parent sees it.
  const childRead = primaryChild?.id
    ? await readPassportChild(supabase, user.id, primaryChild.id, (primaryChild.age_band as string | null) ?? null)
    : null

  // Show the end of stage check as a family nears the end: content finished,
  // or the blend past three quarters, or the stamp already earned so it can
  // show.
  const nearStageEnd = !!passportStage && (
    stageQuizPassed ||
    (currentStageProgress?.contentComplete ?? false) ||
    (currentStageProgress?.overallPct ?? 0) >= 75
  )
  const stampName = READINESS[Math.min(4, Math.max(0, stageNum - 1))].stamp

  // The stamps for the book, one per stage. Earned is per child: content
  // complete AND this child's own check. The current stage's ring reads the
  // flat average of its five rows so the ring and the rows agree.
  const STAGE_SLUGS_ARR: ProgressStageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
  const passportStamps: Stamp[] = allStagesProgress && currentStageNum
    ? STAGES.map(s => {
        const prog = allStagesProgress[STAGE_SLUGS_ARR[s.id - 1]]
        const status: StampStatus =
          isStageStamped(prog, passedStages, s.id, storedStamps) ? 'earned'
          : s.id === currentStageNum ? 'current'
          : s.id < currentStageNum ? 'catchup'
          : 'upcoming'
        const sections = stageSections[s.id]
        const pct = status === 'earned' ? 100
          : status === 'upcoming' ? 0
          : s.id === currentStageNum && sections ? sections.blended
          : prog.overallPct
        return {
          id: s.id, name: s.name, ages: s.ages, pct, status,
          href: withChild('/dashboard/lessons', childParam),
          lessonsDone: prog.lessonsDone, lessonsTotal: prog.lessonsTotal,
          scriptsPct: prog.scriptsPct, streakPct: prog.streakPct,
          devicesPct: prog.devicesPct, lessonsPct: prog.lessonsPct,
          // The three parts of a pass, for the block on the page. The check
          // is this child's own (getPassedStageQuizzes is scoped to them).
          scriptsDone: prog.scriptsDone, scriptsTotal: prog.scriptsTotal,
          checkPassed: passedStages.has(s.id),
          // Every row's link out carries the child, so working a sibling's
          // page never silently switches whose data the next screen shows.
          ...(sections ? { sections: sections.sections.map(row => ({ ...row, href: withChild(row.href, childParam) })) } : {}),
          // The four things this page builds, as counts, for StageAreas.
          areas: areasRead.byStage[s.id],
        }
      })
    : []

  // The current page's five rows, for the strands in the record. The to do
  // that used to sit above the book is the one Next card now.
  const currentSections = currentStageNum ? stageSections[currentStageNum]?.sections ?? [] : []

  // Nova's road, from stage 3 where the social media lessons start.
  const socialRoad = (currentStageNum ?? 0) >= 3
    ? await getSocialRoad(supabase, user.id, primaryChild?.id ?? null, currentStageNum)
    : null

  // Tailored by what this family flagged for THIS child, not by the child's
  // sex: the top open concern maps to the stage's own action for it.
  const { data: topConcern } = await supabase
    .from('concerns').select('slug, label, status')
    .eq('user_id', user.id).or(childScope).neq('status', 'resolved')
    .order('times_flagged', { ascending: false }).limit(1).maybeSingle()
  const concernSlug = (topConcern as { slug?: string } | null)?.slug as ChallengeId | undefined
  const concernLabel = (topConcern as { label?: string } | null)?.label ?? null
  const kidLabel = primaryChild?.name && primaryChild.name !== 'Your child' ? primaryChild.name : 'your child'
  const kidName = kidLabel === 'your child' ? 'Your child' : kidLabel

  const tailoredAction = concernSlug && currentStageContent
    ? currentStageContent.challengeActions[concernSlug] ?? null
    : null

  // ── THE TIMELINE: what needs doing and when, as a rhythm ──────────────────
  //
  // Items left are the two the stamp counts, lessons and scripts. The pace is
  // real arithmetic against the birthday that ends the stage (lib/pathway/
  // pace.ts), said calm when on track and honest when not, never a deadline,
  // because in the code nothing expires.
  const itemsLeft = currentStageProgress
    ? Math.max(0, currentStageProgress.lessonsTotal - currentStageProgress.lessonsDone)
      + Math.max(0, currentStageProgress.scriptsTotal - currentStageProgress.scriptsDone)
    : 0
  const dobRaw = primaryChild?.date_of_birth ? new Date(primaryChild.date_of_birth) : null
  const dob = dobRaw && !Number.isNaN(dobRaw.getTime()) ? dobRaw : null
  const dobOk = dob !== null
  const pace = currentStageNum ? stagePace(currentStageNum, itemsLeft, dob) : null

  // The strands and the one next task, from the same rows as everything else.
  const strands = buildStrands(currentSections, currentStageProgress, childParam)

  // ── THE BALANCE ZONE'S READINGS ───────────────────────────────────────────
  // Seven day dots, Monday first, kept where a job was approved that day, and
  // the jobs voice as in a row rather than complete, because keeping up is the
  // whole grammar of this strand.
  const childTicks = ((weekTicksRes.data ?? []) as { tick_date: string; child_id: string | null }[])
    .filter(t => t.child_id === null || t.child_id === primaryChild?.id)
  const keptDates = new Set(childTicks.map(t => t.tick_date))
  const monday = starWeekStart()
  const todayStr = londonToday()
  const dayDots: DayDot[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${monday}T00:00:00Z`)
    d.setUTCDate(d.getUTCDate() + i)
    const iso = d.toISOString().slice(0, 10)
    return { kept: keptDates.has(iso), today: iso === todayStr, future: iso > todayStr }
  })
  let inARow = 0
  for (let i = dayDots.findIndex(d => d.today); i >= 0; i--) {
    if (dayDots[i].kept) inARow++
    else if (!dayDots[i].today) break
  }
  const jobsOkZone = (currentSections.find(r => r.key === 'jobs')?.pct ?? 100) >= 100
  const jobsLine = inARow > 0 ? `${inARow} day${inARow === 1 ? '' : 's'} in a row` : 'None yet this week'
  // The glance only pulls when the sibling genuinely needs a look, never as a
  // scoreboard between children.
  const siblingGlance = sibling && siblingReport && (siblingReport.status === 'over' || siblingReport.status === 'well_over')
    ? { name: sibling.name, href: withChild('/dashboard/pathway#balance-zone', sibling.id) }
    : null
  // The strand card is the door to the zone below rather than a leap off the
  // page: the close up answers the card before the stats page answers the
  // close up.
  const strandsWithZoneDoor = strands.map(st => st.key === 'balance' ? { ...st, href: '#balance-zone' } : st)

  // The paced line per catch up page: items left on THAT page, the rhythm
  // anchored to the next birthday that matters (the current stage's exit),
  // because nothing expires and the next stage change is the only date ahead.
  // Absent without a birthday, and the banner reads fine without it.
  const catchupLines: Record<number, string> = {}
  if (allStagesProgress && currentStageNum && dobOk) {
    for (const st of STAGE_SLUGS_ARR.slice(0, currentStageNum - 1)) {
      const prog = allStagesProgress[st]
      const id = stageIdToNum[st]
      if (isStageStamped(prog, passedStages, id, storedStamps)) continue
      const left = Math.max(0, prog.lessonsTotal - prog.lessonsDone)
        + Math.max(0, prog.scriptsTotal - prog.scriptsDone)
      if (left === 0) { catchupLines[id] = 'Just the check left on it'; continue }
      const p2 = stagePace(currentStageNum, left, dob)
      if (p2.kind === 'month') catchupLines[id] = 'One a month fills this page'
      else if (p2.kind === 'fortnight') catchupLines[id] = 'One a fortnight fills this page'
      else if (p2.kind === 'week') catchupLines[id] = 'One a week fills this page'
      else if (p2.kind === 'few') catchupLines[id] = `Only ${p2.left} left on it`
      else catchupLines[id] = 'At your own pace, it stays open'
    }
  }

  // ── THE PICTURE, THE PAGE, ITS ONE NEXT STEP AND WHAT WAS LEARNT ─────────
  //
  // Justin's brief on PR 1312, 16 October 2026: "a neat image of the passport
  // with clear planet turned stamps filling up near completion ... progress,
  // what to do, what they have learnt ... order the real passport and
  // stickers ... super image driven but clear." The picture is the way into
  // each page (?open=N), and the page answers three things in this order:
  // how far, the one next step, what was learnt.
  const pageOf = (n: number) => STAGE_PAGES[STAGE_SLUGS_ARR[n - 1]]
  const START_YEAR: Record<number, string> = { 1: 'Reception', 2: 'Year 3', 3: 'Year 7', 4: 'Year 10', 5: 'Year 12' }
  const countOf = (n: number) => pageCount(allStagesProgress?.[STAGE_SLUGS_ARR[n - 1]], passedStages.has(n))
  const selectedNum = openAtStage ?? currentStageNum
  const stampedCount = passportStamps.filter(st => st.status === 'earned').length
  const pictureStamps: PictureStamp[] = passportStamps.map(st => {
    const c = countOf(st.id)
    const ch = STAGE_CHARACTERS[st.id - 1]
    return {
      n: st.id, page: pageOf(st.id).page, friend: ch.name, img: ch.cutout,
      status: st.status,
      fill: st.status === 'earned' ? 1 : st.status === 'upcoming' ? 0 : (c.total ? c.done / c.total : 0),
      caption: st.status === 'earned' ? 'Stamped'
        : st.status === 'current' ? `${c.done} of ${c.total}`
        : st.status === 'catchup' ? (c.done > 0 ? `${c.done} of ${c.total}` : 'Earlier')
        : START_YEAR[st.id],
      href: withChild(`/dashboard/pathway?open=${st.id}#page`, childParam),
    }
  })
  const selStatus = passportStamps.find(st => st.id === selectedNum)?.status ?? null
  const schoolYear = primaryChild ? schoolYearFromDob(primaryChild.date_of_birth) : null
  const yearLabel = schoolYear === null ? null : schoolYear <= 0 ? 'Reception' : `Year ${schoolYear}`
  const selEyebrow = selectedNum
    ? `Page ${selectedNum} of 5 · ${selStatus === 'current' ? (yearLabel ?? pageOf(selectedNum).keyStage)
      : selStatus === 'earned' ? 'Stamped'
      : selStatus === 'catchup' ? 'An earlier page'
      : `Opens in ${START_YEAR[selectedNum]}`}`
    : ''

  // What was learnt on the selected page: lessons PASSED with their check,
  // with the line each one leaves the child with. Nothing opened or watched.
  const selPath = primaryChild && selectedNum
    ? await loadChildLessonPath(supabase, { userId: user.id, childId: primaryChild.id, stageId: STAGE_SLUGS_ARR[selectedNum - 1], paid: isPaid }).catch(() => null)
    : null
  const learnt: LearntLesson[] = selPath
    ? selPath.modules.filter(m => selPath.path.statusById[m.id]?.state === 'passed')
        .map(m => ({ id: m.id, title: m.title, outcome: (m as { single_action_outcome?: string | null }).single_action_outcome ?? null }))
    : []

  // The one next step, worked out for the current page; a stamped page says
  // so; an earlier or later page says plainly where it stands.
  let nextStep: NextStep | null = null
  if (primaryChild && selectedNum && selStatus === 'earned') {
    nextStep = passportNext({
      kid: kidName, childId: primaryChild.id, stageNum: selectedNum, page: pageOf(selectedNum).page,
      count: countOf(selectedNum), stamped: true, lesson: null, weekOpen: false, opensOn: null, script: null, lastPass: null,
    })
  } else if (primaryChild && currentStageNum && selectedNum === currentStageNum) {
    // The one writer of the next step (lib/pathway/passport-today.ts), the same
    // one Home's passport card and the pushes about the page read.
    const today = await loadPassportToday(supabase as never, { userId: user.id, child: primaryChild, paid: isPaid }).catch(() => null)
    nextStep = today?.step ?? null
  } else if (selectedNum && selStatus === 'catchup') {
    nextStep = { key: 'clear', chip: 'An earlier page', title: `This page came before ${kidName}'s`, how: `It stays open, and nothing on it holds up the ${currentStageNum ? pageOf(currentStageNum).page : 'current'} page.`, button: null }
  } else if (selectedNum && selStatus === 'upcoming') {
    nextStep = { key: 'clear', chip: 'Later', title: `Opens in ${START_YEAR[selectedNum]}`, how: `With ${kidName}'s class. Everything on this page waits until then.`, button: null }
  }

  return (
    <div style={{ padding: '20px 0 32px' }}>
      <div style={{ padding: '0 20px', maxWidth: '640px', margin: '0 auto' }}>
        {/* On passport day, arriving here FROM the road is the day's one
            thing, so the look is recorded. Any other visit records nothing. */}
        {from === 'today' && passportday === '1' && (
          <MarkPassportLook childId={primaryChild?.id ?? null} />
        )}
        {from && <BackTo from={from} fallback={{ href: '/dashboard#today', label: 'Today' }} />}

        {/* Passport everywhere, Road to sixteen the subtitle (15 October 2026). */}
        <header style={{ marginBottom: 10 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 2px' }}>
            Road to sixteen
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: 0, lineHeight: 1.15 }}>
            {kidName === 'Your child' ? 'The passport' : `${kidName}'s passport`}
          </h1>
        </header>

        {allStagesEarned && <PathwayComplete childName={primaryChild?.name ?? null} />}

        {/* 1. THE PICTURE: five planet stamps, colour when earned, grey until then. */}
        {pictureStamps.length > 0 && (
          <div id="passport" style={{ scrollMarginTop: '84px' }}>
            <div id="the-road" />
            <PassportPicture kid={kidName} stamps={pictureStamps} selected={selectedNum} stampedCount={stampedCount} />
          </div>
        )}

        {/* 2 to 4. THE PAGE: how far, the one next step, what was learnt. */}
        {selectedNum && (
          <PassportProgress n={selectedNum} page={pageOf(selectedNum).page} eyebrow={selEyebrow} kid={kidName} count={countOf(selectedNum)} />
        )}
        {nextStep && <PassportNextCard step={nextStep} />}
        {selectedNum && selStatus !== 'upcoming' && <PassportLearnt kid={kidName} lessons={learnt} />}

        {/* 5. ON PAPER: the booklet and the sticker sheet, one button. */}
        {primaryChild && <PassportOrderCard kid={kidName} childId={primaryChild.id} stampedCount={stampedCount} />}
      </div>

      {/* ── THE FULL BOOK AND THE RECORD, folded ─────────────────────────────
          Everything that is not the picture, the page or the next step: the
          flip book itself, the pace, the four strands, the balance, the stage
          check card, the week's honest read and the evidence. A native
          details element, so it costs no script and opens when an anchor
          inside it is the target; every old anchor still lands. */}
      <div style={{ padding: '0 20px', maxWidth: '640px', margin: '4px auto 0' }}>
        <details className="passport-record" style={{
          background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)', boxShadow: 'var(--lift)',
        }}>
          <summary style={{
            cursor: 'pointer', listStyle: 'none', padding: '13px 16px', minHeight: 44, boxSizing: 'border-box',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>The full book and the record</span>
            <span aria-hidden>›</span>
          </summary>
          <div style={{ padding: '4px 16px 16px' }}>
            {pace && (
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '4px 0 14px' }}>
                {paceLine(pace, kidName, stageNum)}
              </p>
            )}
            <PathwayIntro kidLabel={kidLabel} childCount={children.length} />
            {passportStamps.length > 0 && (
              <div style={{ minWidth: 0 }}>
                <PassportBook
                  stamps={passportStamps}
                  childName={primaryChild?.name ?? 'your child'}
                  currentStage={currentStageNum}
                  childId={primaryChild?.id ?? null}
                  catchupLines={catchupLines}
                  passportCode={primaryChild?.passport_code ?? null}
                  childRead={childRead}
                  improved={improved}
                  onApp={!!kidLink?.token}
                  openAtStage={null}
                  childParam={childParam ?? null}
                />
              </div>
            )}
            {socialRoad && socialRoad.total > 0 && primaryChild?.id && (
              <SocialRoadNova
                road={socialRoad}
                childId={primaryChild.id}
                childName={primaryChild.name ?? null}
                onApp={!!kidLink?.token}
              />
            )}
            <div id="four-things" style={{ scrollMarginTop: '84px' }}>
              <StrandCards strands={strandsWithZoneDoor} kid={kidName} />
            </div>
            <BalanceZone
              report={weekReport}
              jobsLine={jobsLine}
              jobsOk={jobsOkZone}
              days={dayDots}
              kid={kidName}
              childParam={childParam}
              siblingGlance={siblingGlance}
            />
            {nearStageEnd && currentStageContent && (
              <div id="stage-check" style={{ scrollMarginTop: '84px', marginTop: 4 }}>
                <StageReadiness
                  stageId={stageNum}
                  stageName={currentStageContent.name}
                  stampName={stampName}
                  childId={primaryChild?.id ?? null}
                  childName={primaryChild?.name ?? null}
                  greens={readinessGreens}
                  activeAreas={activeAreas.length}
                  lessonsLeft={lessonsLeft}
                  ambers={readinessAmbers}
                  alreadyPassed={stageQuizPassed}
                  kidToken={(kidLink as { token?: string } | null)?.token ?? null}
                />
              </div>
            )}
            {tailoredAction && (
              <div style={{ background: 'var(--tint-sage)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '14px 16px', margin: '14px 0 0' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '5px' }}>
                  For your family right now{concernLabel ? ` · ${concernLabel}` : ''}
                </div>
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{tailoredAction}</p>
              </div>
            )}
            <div style={{ margin: '14px -16px 0' }}>
              <WhatIsWorkingLink />
              <div id="is-it-working" style={{ scrollMarginTop: '84px' }} />
              <div id="stickers" style={{ scrollMarginTop: '84px' }} />
              <IsItWorkingReport childParam={childParam} parentReport={weekReport} />
              {primaryChild?.name && (
                <FiveADayReport
                  childName={primaryChild.name}
                  days={fiveADay.days}
                  today={fiveADay.today}
                />
              )}
              <div style={{ padding: '0 16px' }}>
                <div id="why-this-works" style={{ scrollMarginTop: '84px' }} />
                <PathwayEvidence />
              </div>
            </div>
            <p style={{ textAlign: 'center', margin: '14px 0 0' }}>
              <Link href="/dashboard/settings" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textDecoration: 'underline', letterSpacing: '0.04em' }}>
                Manage children
              </Link>
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
