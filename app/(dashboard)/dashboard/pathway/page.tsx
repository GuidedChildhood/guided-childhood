import { createClient } from '@/lib/supabase/server'
import { hasFullAccess } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STAGES, type ChallengeId } from '@/lib/content/stages'
import PathwayEvidence from '@/components/pathway/PathwayEvidence'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
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
import { getWeekParentReport } from '@/lib/balance/week-report'
import PassportToDo from '@/components/pathway/PassportToDo'
import { parentPassportToDo } from '@/lib/pathway/passport-todo'
import { gatherChildPassportToDo } from '@/lib/pathway/passport-todo-gather'
import SocialRoadNova from '@/components/pathway/SocialRoadNova'
import { getSocialRoad } from '@/lib/pathway/social-road'
import { buildStrands, nextTask, withChild, NextOnTheApplication, StrandCards } from '@/components/passport/Application'
import BalanceZone, { type DayDot } from '@/components/passport/BalanceZone'
import { starWeekStart } from '@/lib/quests/star-week'
import { londonToday } from '@/lib/pathway/today'
import { stagePace, paceLine } from '@/lib/pathway/pace'

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
//                               step; #working-on lands on the rail.
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
type Child = { id: string; name: string; age_band: string | null; stage_id: string | null; is_primary: boolean; streak_weeks: number | null; date_of_birth: string | null }

export default async function PathwayPage({ searchParams }: { searchParams: Promise<{ child?: string; from?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam, from } = await searchParams

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('id, name, age_band, stage_id, is_primary, streak_weeks, date_of_birth').eq('parent_id', user.id).order('is_primary', { ascending: false }),
  ])

  const isPaid = hasFullAccess(profileResult.data, user.email)
  const children = (childrenResult.data ?? []) as Child[]

  const stageIdToNum: Record<string, number> = {
    foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
  }

  // The whole application renders for the selected child (?child=<id>),
  // defaulting to the primary, so every sibling gets their own book.
  const primaryChild = pickChild(children, childParam)
  const currentStageNum = primaryChild?.stage_id ? stageIdToNum[primaryChild.stage_id] ?? null : null

  // The child's own five a day, for the record at the foot. Read with the
  // parent's client so the existing RLS policy is what decides, and empty for
  // a child with no app rather than an error.
  const fiveADay = await getFiveADayReport(supabase, primaryChild?.id ?? null)

  const [currentStageProgress, allStagesProgress] = primaryChild?.stage_id
    ? await Promise.all([
        getStageProgress(supabase, user.id, primaryChild.stage_id as ProgressStageId, primaryChild.streak_weeks ?? 0, primaryChild.id),
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
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).or(childScope).in('status', ['open', 'improving']),
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
  const stageSections = await buildPassportSections(
    supabase, user.id, primaryChild ?? null, allStagesProgress, currentStageNum,
    {
      openMoments: openMomentsRes.count ?? 0,
      solvedMoments: solvedMomentsRes.count ?? 0,
      parentReport: weekReport,
    },
  )

  const currentStageContent = currentStageNum ? STAGES.find(s => s.id === currentStageNum) : null

  // This child's own check passes, fetched BEFORE the stamps and the end of
  // road celebration because both are gated on them.
  const passedStages = await getPassedStageQuizzes(supabase, user.id, primaryChild?.id ?? null)

  // Content complete AND this child's check passed, stage by stage: the same
  // two halves a single stamp needs, so the end of road celebration can never
  // fire for a child who has not sat their own checks.
  const allStagesEarned = !!allStagesProgress
    && (['foundation', 'builder', 'explorer', 'shaper', 'independent'] as ProgressStageId[])
      .every((slug, i) => allStagesProgress[slug].contentComplete && passedStages.has(i + 1))

  // One live literacy reading, for the end of stage check's greens and ambers.
  const litStatuses = await getLiteracyStatuses(supabase, user.id, currentStageNum ?? 1)

  const READINESS_AREAS = [
    { key: 'safe', name: 'Safe online', startStage: 1 },
    { key: 'balance', name: 'Healthy balance', startStage: 1 },
    { key: 'ai', name: 'AI and chatbots', startStage: 3 },
    { key: 'social', name: 'Social media ready', startStage: 3 },
  ] as const
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

  // Show the end of stage check as a family nears the end: content finished,
  // or the blend past three quarters, or the stamp already earned so it can
  // show.
  const nearStageEnd = !!primaryChild?.stage_id && (
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
          prog.contentComplete && passedStages.has(s.id) ? 'earned'
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
          // Every row's link out carries the child, so working a sibling's
          // page never silently switches whose data the next screen shows.
          ...(sections ? { sections: sections.sections.map(row => ({ ...row, href: withChild(row.href, childParam) })) } : {}),
        }
      })
    : []

  // THE TO DO ABOVE THE BOOK: both halves read from the SAME five rows the
  // book prints, so the line above the passport and the page inside it can
  // never disagree.
  const currentSections = currentStageNum ? stageSections[currentStageNum]?.sections ?? [] : []
  const passportToDo = parentPassportToDo(currentSections)
  const childToDo = primaryChild
    ? await gatherChildPassportToDo(supabase, user.id, primaryChild, { progress: currentStageProgress })
    : []

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
  const dob = primaryChild?.date_of_birth ? new Date(primaryChild.date_of_birth) : null
  const pace = currentStageNum ? stagePace(currentStageNum, itemsLeft, dob && !Number.isNaN(dob.getTime()) ? dob : null) : null
  const paceOnTrack = pace ? ['stamped', 'few', 'month', 'fortnight', 'week'].includes(pace.kind) : true

  // The strands and the one next task, from the same rows as everything else.
  const strands = buildStrands(currentSections, currentStageProgress, childParam)
  const next = nextTask(strands)
  // When nothing is open and the check is not passed, the rail's one task IS
  // the check, landing on the readiness card below.
  const checkHref = !next && !stageQuizPassed && nearStageEnd ? '#stage-check' : null

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

  // The stage pastel for the slim header, the same five the book uses.
  const stageTheme = currentStageNum
    ? { bold: `var(--stage-${currentStageNum}-bold)`, text: `var(--stage-${currentStageNum}-text)` }
    : { bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' }
  const headerPct = currentStageNum ? stageSections[currentStageNum]?.blended ?? currentStageProgress?.overallPct ?? 0 : 0

  return (
    <div style={{ padding: '20px 0 32px' }}>
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto' }}>
        {/* The way back to Today, only for a parent who genuinely came from
            somewhere: a back button to a page you were never on is furniture. */}
        {from && <BackTo from={from} fallback={{ href: '/dashboard#today', label: 'Today' }} />}

        {/* THE END OF THE ROAD, WHEN IT ARRIVES: above everything on the day
            it lands. Gated on content AND this child's five checks. */}
        {allStagesEarned && <PathwayComplete childName={primaryChild?.name ?? null} />}

        {/* ── BAND ONE: WHERE THE APPLICATION IS ────────────────────────────
            The slim header: whose passport, which stage, the ring, and the
            timeline line. The ring reads the same blended number as the book's
            current page, so the header and the book can never disagree. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div aria-hidden style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: `conic-gradient(${stageTheme.text} 0 ${headerPct}%, var(--border) ${headerPct}% 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)',
            }}>
              {headerPct}%
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
              color: 'var(--ink)', margin: 0, lineHeight: 1.15,
            }}>
              {kidName === 'Your child' ? 'The application to 16' : `${kidName}'s application to 16`}
            </h1>
            {currentStageContent && (
              <span style={{
                display: 'inline-block', marginTop: 3,
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: stageTheme.bold, color: stageTheme.text,
                borderRadius: 6, padding: '2px 8px',
              }}>
                {currentStageContent.name} · {currentStageContent.ages}
              </span>
            )}
          </div>
        </div>

        {/* The timeline line: on track reads calm in sage, behind pace names
            the clock plainly in the butter tint. Never red, never a deadline. */}
        {pace && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            background: paceOnTrack ? 'var(--tint-sage)' : 'var(--terracotta-lt)',
            border: `1.5px solid ${paceOnTrack ? '#C9DDD5' : 'var(--terracotta)'}`,
            borderRadius: 14, padding: '11px 14px', marginBottom: 14,
          }}>
            <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', lineHeight: 1.4 }}>🕰️</span>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
              {paceLine(pace, kidName, stageNum)}
            </p>
          </div>
        )}

        {/* The overview: the whole journey explained once, then folded to a
            tap. PathwayIntro owns the fold and the first visit behaviour. */}
        <PathwayIntro kidLabel={kidLabel} childCount={children.length} />

        {/* ── BAND TWO: WHAT TO DO RIGHT NOW ─────────────────────────────────
            Exactly one task lit. #working-on lands here because this rail IS
            what we are working on. */}
        <div id="working-on" style={{ scrollMarginTop: '84px' }}>
          <NextOnTheApplication strands={strands} checkHref={checkHref} />
        </div>

        {/* The book, the jewel, untouched: cover first, the child's page one
            tap away, catch up pages behind it. */}
        {passportStamps.length > 0 && (
          <div id="passport" style={{ scrollMarginTop: '84px', minWidth: 0 }}>
            <div id="the-road" />
            <PassportToDo
              childId={primaryChild?.id ?? null}
              childName={primaryChild?.name ?? null}
              items={passportToDo}
              childItems={childToDo}
              onApp={!!kidLink?.token}
            />
            <PassportBook
              stamps={passportStamps}
              childName={primaryChild?.name ?? 'your child'}
              currentStage={currentStageNum}
              childId={primaryChild?.id ?? null}
            />
            {socialRoad && socialRoad.total > 0 && primaryChild?.id && (
              <SocialRoadNova
                road={socialRoad}
                childId={primaryChild.id}
                childName={primaryChild.name ?? null}
                onApp={!!kidLink?.token}
              />
            )}
          </div>
        )}

        {/* The four strands, counting down. #four-things keeps every old link
            landing on the strands it always meant. */}
        <div id="four-things" style={{ scrollMarginTop: '84px' }}>
          <StrandCards strands={strandsWithZoneDoor} kid={kidName} />
        </div>

        {/* The moving picture itself: the zone, the two contributors, the
            week's dots, and the sibling glance when another child needs a
            look. The balance strand card above lands here. */}
        <BalanceZone
          report={weekReport}
          jobsLine={jobsLine}
          jobsOk={jobsOkZone}
          days={dayDots}
          kid={kidName}
          childParam={childParam}
          siblingGlance={siblingGlance}
        />

        {/* The end of stage check, DiGi's voice, with the child app door and
            the together fallback. The rail's check card lands here. */}
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

        {/* Tailored by what this family flagged for this child. */}
        {tailoredAction && (
          <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', margin: '18px 0 0' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)', marginBottom: '5px' }}>
              For your family right now{concernLabel ? ` · ${concernLabel}` : ''}
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{tailoredAction}</p>
          </div>
        )}
      </div>

      {/* ── BAND THREE: THE RECORD, folded ─────────────────────────────────
          Everything that reports rather than asks: the week's honest read,
          the child's five a day, the doorway to what is working, and the
          evidence. Mercury's collapsed completed tasks, in a native details
          element so it costs no script and stays open when an anchor inside
          it is the target. The ids stay on their sections so every old link
          (#is-it-working, #why-this-works, #screen-balance inside the
          report) still lands. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '18px auto 0' }}>
        <details className="passport-record" style={{
          background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 16,
        }}>
          <summary style={{
            cursor: 'pointer', listStyle: 'none', padding: '13px 16px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>The record · the week, the numbers, the why</span>
            <span aria-hidden>›</span>
          </summary>
          <div style={{ padding: '2px 0 14px' }}>
            <WhatIsWorkingLink />
            <div id="is-it-working" style={{ scrollMarginTop: '84px' }} />
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
        </details>
      </div>

      {/* The children, the manage door and the founder card, at the foot. */}
      <div style={{ padding: '0 20px', maxWidth: '720px', margin: '22px auto 0' }}>
        {children.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Your children
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {children.map(child => {
                const nStage = child.stage_id ? stageIdToNum[child.stage_id] : null
                const stageMeta = nStage ? STAGES.find(st => st.id === nStage) ?? null : null
                return (
                  <Link key={child.id} href={child.is_primary ? '/dashboard/pathway' : `/dashboard/pathway?child=${child.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '12px 16px', gap: '12px',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                      {child.name}
                    </span>
                    {stageMeta && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                        padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.06em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        Stage {stageMeta.id} · {stageMeta.name}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Multiple children? One account covers all of them.
          </p>
          <Link href="/dashboard/settings" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)',
            textDecoration: 'underline', letterSpacing: '0.04em',
          }}>
            Manage children →
          </Link>
        </div>

        {!isPaid && (
          <div style={{
            marginTop: '24px',
            border: '2px solid var(--stage-5)', borderRadius: '16px',
            padding: '20px 22px', background: 'var(--stage-5)',
          }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Founder rate</p>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Unlock all 5 stages for £7.99 / month</h3>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              All scripts, unlimited DiGi, wellbeing tracker. First 50 members only.
            </p>
            <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex' }}>
              Claim founder rate
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
