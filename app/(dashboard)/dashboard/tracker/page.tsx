import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { getDailyStreak } from '@/lib/pathway/streak'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import WorkingOn from '@/components/tracker/WorkingOn'
import StageRoad from '@/components/pathway/StageRoad'
import DigiStarBuild from '@/components/pathway/DigiStarBuild'
import LiteracyAreas from '@/components/pathway/LiteracyAreas'
import LiteracyCheckIn from '@/components/pathway/LiteracyCheckIn'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import PassportBook from '@/components/pathway/PassportBook'
import { type Stamp, type StampStatus, type ChecklistSection } from '@/components/pathway/PassportStamps'
import { computeJobsStreak, jobsTodayStatus, type StreakQuest, type StreakTick } from '@/lib/pathway/jobs-streak'
import ToolCard, { type Tool } from '@/components/tools/ToolCard'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import BalanceReport from '@/components/balance/BalanceReport'
import { buildParentReport, type ParentReport } from '@/lib/balance/parent-report'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The Progress page: the answer to the only question that matters, is it
// working. One honest generated sentence at the top, then the evidence:
// the child's position on the pathway to 16, the concerns and their
// arcs, the week in numbers, the wellbeing trend in plain words, and
// what unlocks next. The weekly check in form lives at /tracker/checkin.

type Check = {
  week_start: string
  mood_score: number | null
  sleep_score: number | null
  social_score: number | null
  screen_mood_score: number | null
  open_communication: number | null
}

const SCORE_NEXT: { key: keyof Omit<Check, 'week_start'>; label: string; next: string; href: string }[] = [
  { key: 'sleep_score', label: 'sleep', next: 'the bedroom rule, tonight', href: '/dashboard/scripts' },
  { key: 'mood_score', label: 'mood', next: 'the mood after screens conversation', href: '/dashboard/moments' },
  { key: 'screen_mood_score', label: 'screen mood', next: 'the screen off script at the next switch off', href: '/dashboard/scripts' },
  { key: 'open_communication', label: 'talking', next: 'one open question at dinner, no follow up', href: '/dashboard/digi' },
  { key: 'social_score', label: 'friendships', next: 'ask DiGi about the friendship dip', href: '/dashboard/digi' },
]

function avg(c: Check): number | null {
  const vals = [c.mood_score, c.sleep_score, c.social_score, c.screen_mood_score, c.open_communication]
    .filter((v): v is number => typeof v === 'number')
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam } = await searchParams

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]
  const today = new Date().toISOString().slice(0, 10)

  const [childrenRes, concernsRes, resolvedCountRes, recentSolvedRes, checksRes, questsRes, ticksRes, streak, dailyRes] = await Promise.all([
    supabase.from('children').select('id, name, age_band, streak_weeks, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
    // What we are working on: only the live ones, most stubborn first so the
    // pattern line has something to point at.
    supabase.from('concerns').select('slug, label, status, times_flagged, last_flagged_at').eq('user_id', user.id).in('status', ['open', 'improving']).order('times_flagged', { ascending: false }).limit(10),
    // The win count for the report: everything the family has sorted.
    supabase.from('concerns').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'resolved'),
    // The most recently sorted, so a parent can flag one that has come
    // back. Reopening it bumps the flag count and DiGi reads the recurrence.
    supabase.from('concerns').select('slug, label, times_flagged').eq('user_id', user.id).eq('status', 'resolved').order('last_checked_at', { ascending: false }).limit(6),
    supabase.from('wellbeing_checks').select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication').eq('parent_id', user.id).order('week_start', { ascending: false }).limit(6),
    supabase.from('family_quests').select('id, stars, child_id').eq('user_id', user.id).eq('active', true),
    supabase.from('quest_ticks').select('quest_id, child_id, status').eq('user_id', user.id).eq('status', 'approved').gte('tick_date', weekAgo),
    getDailyStreak(supabase, user.id),
    // Today's ten minute loop, so the report can say the day's work is
    // already feeding the readings below.
    supabase.from('daily_sessions').select('completed_at').eq('user_id', user.id).eq('session_date', today).maybeSingle(),
  ])
  const dailyDoneToday = !!dailyRes.data?.completed_at

  const children = childrenRes.data ?? []
  // The report reads for the selected child (?child=<id>), defaulting to
  // the primary. Before this, the page silently reported on the oldest
  // created child whatever the family shape.
  const primary = pickChild(children, childParam)
  const concerns = concernsRes.data ?? []
  const solvedCount = resolvedCountRes.count ?? 0
  const recentSolved = recentSolvedRes.data ?? []
  const checks = (checksRes.data ?? []) as Check[]
  const quests = questsRes.data ?? []
  const ticks = ticksRes.data ?? []

  const stage = primary?.age_band ? getStageFromAgeBand(primary.age_band as AgeBand) : null

  // The passport, live. Real progress for all five stages, mapped to stamps:
  // earned at 100 percent, in progress on the current stage, catch up for an
  // earlier stage not yet filled, ahead for one still to come. Each links to
  // its stage so the passport doubles as a map and a catch up plan.
  const STAGE_SLUGS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
  const allProgress = stage ? await getAllStagesProgress(supabase, user.id, primary?.streak_weeks ?? 0) : null

  // The five section checklist reads. Devices and lessons vary per stage (from
  // the blend); moments, jobs and the ahead of age heads up read for the child
  // now, the current readiness picture, so they are the same on every page.
  // Section five (screen balance and limits) is the mobbin session's stats
  // dashboard and slots in when it lands, so it is not built here.
  const openMoments = concerns.length
  const momentsTotal = openMoments + solvedCount
  const momentsPct = momentsTotal > 0 ? Math.round((solvedCount / momentsTotal) * 100) : 100

  let jobsStatus: 'on_track' | 'pending' | 'none' = 'none'
  let jobsStreakDays = 0
  let aheadNames: string[] = []
  // Section five, the screen balance and limits view, from the mobbin session's
  // parent report: this week's screen minutes per device against the healthy
  // amount for the child's age, with the off screen effort beside it.
  let parentReport: ParentReport | null = null
  if (primary?.id) {
    const sinceJobs = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10)
    const AGE_BAND_UPPER: Record<string, number> = { '4-7': 7, '8-10': 10, '11-13': 13, '13-15': 15, '16+': 99 }
    const childUpper = primary.age_band ? (AGE_BAND_UPPER[primary.age_band] ?? 99) : 99
    const [jqRes, jtRes, dgRes, dpRes, dsRes] = await Promise.all([
      supabase.from('family_quests').select('id, schedule, schedule_days, created_at').eq('user_id', user.id).eq('child_id', primary.id).eq('active', true),
      supabase.from('quest_ticks').select('quest_id, tick_date, status').eq('user_id', user.id).eq('child_id', primary.id).gte('tick_date', sinceJobs),
      supabase.from('device_guides').select('device_key, name, min_age'),
      supabase.from('device_setup_progress').select('device_key, status').eq('user_id', user.id),
      supabase.from('device_sessions').select('device, minutes').eq('user_id', user.id).eq('child_id', primary.id).gte('started_at', weekAgo),
    ])
    const jq = (jqRes.data ?? []) as StreakQuest[]
    const jt = (jtRes.data ?? []) as StreakTick[]
    jobsStatus = jobsTodayStatus(jq, jt)
    jobsStreakDays = computeJobsStreak(jq, jt).streakDays
    // A device counts as ahead only when it is actually set up (owned) and its
    // minimum age is above the child's band, like a smartphone for a young one.
    const doneKeys = new Set((dpRes.data ?? []).filter(d => d.status !== 'not_owned').map(d => d.device_key))
    aheadNames = (dgRes.data ?? [])
      .filter(d => doneKeys.has(d.device_key) && (d.min_age as number) > childUpper)
      .map(d => d.name as string)

    // The off screen effort this week, from approved jobs, so the report weighs
    // real life against screen. Stars carry the minutes at the family rate.
    const childTicks = ticks.filter(t => t.child_id === primary.id)
    const offStars = childTicks.reduce((sum, t) => sum + ((quests.find(q => q.id === t.quest_id)?.stars as number | undefined) ?? 1), 0)
    parentReport = buildParentReport({
      childName: primary.name,
      ageBand: primary.age_band ?? null,
      deviceMinutes: (dsRes.data ?? []).map(d => ({ device: d.device as string, minutes: d.minutes as number })),
      offscreen: { activities: childTicks.length, stars: offStars, minutes: offStars * STAR_MINUTES },
    })
  }
  const jobsPct = jobsStatus === 'on_track' ? 100 : jobsStatus === 'pending' ? 40 : 0
  // Balance section reading: healthy or a light week is full, over is a nudge,
  // well over is the clear to do. Never a lock, just the honest heads up.
  const balancePct = !parentReport ? 100
    : parentReport.status === 'well_over' ? 0
    : parentReport.status === 'over' ? 50 : 100
  const balanceDetail = !parentReport ? 'No screens logged'
    : parentReport.status === 'under' ? 'Light week'
    : parentReport.status === 'healthy' ? 'Healthy'
    : parentReport.status === 'over' ? 'A bit over' : 'Well over'

  const stamps: Stamp[] = stage && allProgress
    ? STAGES.map(s => {
        const slug = STAGE_SLUGS[s.id - 1]
        const prog = allProgress[slug]
        const status: StampStatus =
          prog.contentComplete ? 'earned'
          : s.id === stage.id ? 'current'
          : s.id < stage.id ? 'catchup'
          : 'upcoming'
        const isCurrent = s.id === stage.id
        const reached = isCurrent || status === 'earned' || status === 'catchup'
        // The live now reads, moments, jobs and screen balance, belong to the
        // stage the child is actually on. On any other page they show as later,
        // so a stage still ahead never borrows today's wellbeing and reads a
        // true zero. Devices and lessons stay per stage, naturally zero for a
        // stage the child has not reached yet.
        const sections: ChecklistSection[] = [
          {
            key: 'devices', emoji: '🔧', label: 'Devices set up',
            pct: reached ? prog.devicesPct : 0,
            detail: !reached ? 'Ahead' : prog.devicesPct >= 100 ? 'All set' : prog.devicesPct === 0 ? 'To set up' : `${prog.devicesPct}%`,
            href: '/dashboard/devices',
            help: 'Set up the devices you have for their age.',
            ...(isCurrent && aheadNames.length > 0
              ? { alert: `${aheadNames.join(', ')} is set up ahead of their age. Worth a look together.` }
              : {}),
          },
          {
            key: 'moments', emoji: '💬', label: 'Moments to resolve',
            pct: isCurrent ? momentsPct : 0,
            detail: !isCurrent ? 'Later' : openMoments > 0 ? `${openMoments} to resolve` : 'All clear',
            href: '/dashboard/moments',
            help: 'Work through any open worries together.',
          },
          {
            key: 'lessons', emoji: '📚', label: 'Lessons and tests',
            pct: prog.lessonsPct,
            detail: prog.lessonsTotal > 0 ? `${prog.lessonsDone} of ${prog.lessonsTotal}` : 'None yet',
            href: `/dashboard/lessons?stage=${s.id}`,
            help: 'Do the age matched lessons and pass the check.',
          },
          {
            key: 'jobs', emoji: '⭐', label: 'Jobs and routines',
            pct: isCurrent ? jobsPct : 0,
            detail: !isCurrent ? 'Later' : jobsStreakDays > 0 ? `${jobsStreakDays} day streak` : jobsStatus === 'pending' ? 'Jobs to do' : 'Set a job',
            href: '/dashboard/quests',
            help: 'Keep the daily jobs going, all done on time.',
          },
          {
            key: 'balance', emoji: '⚖️', label: 'Screen balance',
            pct: isCurrent ? balancePct : 0,
            detail: !isCurrent ? 'Later' : balanceDetail,
            href: '/dashboard/tracker#screen-balance',
            help: 'The healthy screen amount for their age, across the week.',
          },
        ]
        // The headline circle reads this stage only. The stamp when earned, the
        // live blend on the stage the child is on, that stage's own content when
        // catching up an earlier page, and a true zero for any stage still
        // ahead. So the passport never shows progress on a stage not reached.
        const blended = Math.round(sections.reduce((sum, x) => sum + x.pct, 0) / sections.length)
        const contentPct = Math.round(prog.lessonsPct * 0.55 + prog.scriptsPct * 0.3 + prog.devicesPct * 0.15)
        const pct = status === 'earned' ? 100
          : isCurrent ? blended
          : status === 'catchup' ? contentPct
          : 0
        return {
          id: s.id, name: s.name, ages: s.ages, pct, status,
          href: `/dashboard/lessons`,
          lessonsDone: prog.lessonsDone, lessonsTotal: prog.lessonsTotal,
          scriptsPct: prog.scriptsPct, streakPct: prog.streakPct,
          devicesPct: prog.devicesPct, lessonsPct: prog.lessonsPct,
          sections,
        }
      })
    : []

  // Road readings: the same per stage blend the passport uses, keyed by stage
  // number, so the map and the stamps always tell one story. This is what
  // brings the pathway road onto the Digital Passport, beside the stamps.
  const stageStatus: Record<number, { pct: number; complete: boolean }> = {}
  if (allProgress) {
    STAGE_SLUGS.forEach((slug, i) => {
      stageStatus[i + 1] = { pct: allProgress[slug].overallPct, complete: allProgress[slug].contentComplete }
    })
  }
  const earnedStages = stamps.filter(s => s.status === 'earned').length
  const currentIdx = stamps.findIndex(s => s.status === 'current')
  const currentStagePct = stage ? stamps[stage.id - 1]?.pct ?? null : null

  const starsByQuest = new Map(quests.map(q => [q.id, q.stars]))
  const weekStars = ticks.reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)

  const open = concerns.filter(c => c.status === 'open')
  const improving = concerns.filter(c => c.status === 'improving')

  // DiGi's toolbox, matched to the moment: the one vetted outside tool that
  // helps with the concern this family has actually flagged. Fails soft to
  // nothing before migration 091, or when no tool matches the concern.
  const topConcernSlug = (open[0] ?? improving[0] ?? concerns[0])?.slug ?? null
  let matchedTool: Tool | null = null
  if (topConcernSlug) {
    const { data: mt } = await supabase
      .from('recommended_tools')
      .select('id, category, name, problem, fix, science, benefit, url, cost_note, evidence_grade, affiliate')
      .eq('concern_slug', topConcernSlug).eq('active', true)
      .order('sort_order', { ascending: true }).limit(1).maybeSingle()
    matchedTool = (mt as Tool | null) ?? null
  }

  // Trend: this week's average against the one before
  const a0 = checks[0] ? avg(checks[0]) : null
  const a1 = checks[1] ? avg(checks[1]) : null
  const trend = a0 !== null && a1 !== null ? (a0 - a1 > 0.3 ? 'up' : a1 - a0 > 0.3 ? 'down' : 'steady') : null

  // The lowest scoring area drives the next step suggestion
  let nextStep = SCORE_NEXT[3] // default: one open question
  if (checks[0]) {
    let lowest = Infinity
    for (const s of SCORE_NEXT) {
      const v = checks[0][s.key]
      if (typeof v === 'number' && v < lowest) { lowest = v; nextStep = s }
    }
  }

  // The is it working sentence, built honestly from what is true
  const bits: string[] = []
  if (streak.count > 0) bits.push(`you have shown up ${streak.count} day${streak.count === 1 ? '' : 's'} running`)
  if (improving.length > 0) bits.push(`${improving[0].label.toLowerCase()} is getting better`)
  if (weekStars > 0) bits.push(`the kids earned ${weekStars} star${weekStars === 1 ? '' : 's'} this week`)
  if (trend === 'up') bits.push('the week scores are climbing')
  const headline = bits.length > 0
    ? `${bits.join(', ')}.`
    : 'Your story starts with the first check in and the first daily practice. Everything you do lands here.'

  const checkedThisWeek = checks.some(c => c.week_start === weekStartStr)

  // The literacy readings drive both the report card and the header's
  // warmth, so they are computed once here.
  const stageNum = primary?.age_band ? getStageFromAgeBand(primary.age_band as AgeBand).id : 1
  const literacyStatuses = await getLiteracyStatuses(supabase, user.id, stageNum)
  const activeAreaKeys = ['safe', 'balance', ...(stageNum >= 3 ? ['ai', 'social'] : [])]
  const greenCount = activeAreaKeys.filter(k => literacyStatuses[k]?.tone === 'green').length

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <ChildSwitcher kids={children} selectedId={primary?.id ?? null} basePath="/dashboard/tracker" />
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>Digital Passport</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6.5vw, 2.7rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        Is it working?
      </h1>
      {/* The report in one warm sentence, sat on green so the message shows
          itself: what green means, and that amber is a next step, never a mark
          against anyone. Bigger and ink dark so it reads at a glance. */}
      <div style={{ background: 'var(--tint-green)', border: '1.5px solid #BADFC9', borderRadius: '16px', padding: '16px 18px', margin: '0 0 22px', maxWidth: '620px' }}>
        <p style={{ fontSize: '18px', color: 'var(--ink)', lineHeight: 1.55, fontWeight: 600, margin: 0 }}>
          <span style={{ color: '#2F8F6B', fontWeight: 800 }}>Green</span> means that part of the plan is doing its job. Anything <span style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>amber</span> comes with one clear next step, like a good school report.
        </p>
      </div>

      {/* The passport first, the document this whole page fills: the star
          assembling a point per stage and the passport it earns, stamp by
          stage. The pathway road follows below, the map it all sits on. */}
      {stage && stamps.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
            <DigiStarBuild earned={earnedStages} currentIndex={currentIdx >= 0 ? currentIdx : null} size={150} />
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', margin: '0 0 16px' }}>
            {earnedStages >= 5 ? 'DiGi is whole. Every stage earned 🌟' : `${earnedStages} of 5 points of DiGi's star earned`}
          </p>
          <PassportBook stamps={stamps} childName={primary?.name ?? 'your child'} />
        </div>
      )}

      {/* Section five of the passport, the screen balance and limits view: this
          week's screen minutes per device against the healthy amount for their
          age, with the off screen effort beside it. The checklist balance row
          taps down to here. */}
      {parentReport && (
        <div id="screen-balance" style={{ scrollMarginTop: '80px', marginBottom: '22px' }}>
          <BalanceReport report={parentReport} />
        </div>
      )}

      {/* The pathway road below the passport: the road to 16 with the child on
          their stage. It follows the document now, so the passport comes first
          and the map shows where that stage sits on the whole journey. */}
      {stage && (
        <div style={{ margin: '6px -20px 24px' }}>
          <StageRoad
            currentStageNum={stage.id}
            progressPct={currentStagePct}
            childName={primary?.name ?? undefined}
            stageStatus={stageStatus}
          />
        </div>
      )}

      {/* Warmth when the report is mostly green, in colour not noise */}
      {greenCount >= 3 && (
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--retro-green-dark)', lineHeight: 1.5, margin: '0 0 14px' }}>
          🌱 Nearly all green. Lovely work.
        </p>
      )}

      {/* The day's work acknowledged before the report reads out */}
      {dailyDoneToday && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--tint-green)', border: '1.5px solid var(--border)',
          borderRadius: '14px', padding: '12px 16px', marginBottom: '16px',
        }}>
          <span aria-hidden style={{
            flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
            background: 'var(--retro-green)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 900,
          }}>✓</span>
          <p style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            Today&rsquo;s ten minutes are done. That feeds the four below.
          </p>
        </div>
      )}

      {/* The same four strands as Home and the pathway, read from the same
          source, so progress always lands in one consistent picture. The
          stamp chip lives in the page header here, so the card skips it. */}
      <div style={{ margin: '0 -20px' }}>
        <LiteracyAreas stageId={stageNum} childName={primary?.name ?? undefined} statuses={literacyStatuses} stampChip={false} />
        <LiteracyCheckIn stageId={stageNum} />
      </div>

      {/* The honest sentence */}
      <div style={{
        background: 'var(--tint-sage)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          {headline.charAt(0).toUpperCase() + headline.slice(1)}
        </p>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '8px 0 0' }}>
          Next: {nextStep.next}. <Link href={nextStep.href} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Go →</Link>
        </p>
      </div>

      {/* The streak, front and centre: the number that moves every single
          day, ahead of the slower moving wellbeing picture below. */}
      {streak.count > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          background: streak.aliveToday ? 'var(--terracotta-lt)' : 'var(--cream)',
          border: `1.5px solid ${streak.aliveToday ? 'var(--terracotta)' : 'var(--border)'}`,
          borderRadius: '18px', padding: '18px 20px', marginBottom: '20px',
        }}>
          <svg width="30" height="38" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path
              d="M12 1.6c.5 4.4 2.2 6.4 3.9 8.8 1.3 1.8 2.1 3.5 2.1 5.5 0 3.8-2.7 6.5-6 6.5s-6-2.7-6-6.5c0-2.7 1.5-4.7 3.1-6.6C10.5 7.6 11.7 5.6 12 1.6z"
              fill={streak.aliveToday ? 'var(--terracotta)' : 'var(--ink-light)'}
            />
            <path
              d="M12 12.4c1.7 2 2.7 3.1 2.7 4.8 0 1.8-1.2 3.1-2.7 3.1s-2.7-1.3-2.7-3.1c0-1.7 1-2.8 2.7-4.8z"
              fill={streak.aliveToday ? 'var(--terracotta-lt)' : 'var(--cream)'}
            />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: streak.aliveToday ? 'var(--terracotta-dark)' : 'var(--ink)', lineHeight: 1 }}>
              {streak.count} day{streak.count === 1 ? '' : 's'} running
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              {streak.aliveToday
                ? 'Today is already counted. Come back tomorrow to keep it going.'
                : 'Not counted yet today. One check in, moment or script keeps it alive.'}
            </div>
          </div>
        </div>
      )}

      {/* What we are working on: the real list, with the parent's verdict */}
      <WorkingOn
        concerns={concerns.map(c => ({ slug: c.slug, label: c.label, status: c.status, times_flagged: c.times_flagged }))}
        solvedAlready={solvedCount}
        recentSolved={recentSolved.map(c => ({ slug: c.slug, label: c.label, times_flagged: c.times_flagged }))}
        childName={primary?.name ?? 'your child'}
        parentEmail={user.email ?? ''}
      />

      {/* The one outside tool that helps with what this family flagged, in the
          honest problem to benefit shape. Only shows when a vetted tool matches
          the concern. */}
      {matchedTool && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '9px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              What helps with this
            </span>
            <Link href="/dashboard/toolbox" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
              The toolbox →
            </Link>
          </div>
          <ToolCard tool={matchedTool} />
        </div>
      )}

      {/* The week in numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { n: String(weekStars), label: 'stars earned', sub: 'this week' },
          { n: String(checks.length), label: 'check ins', sub: 'so far' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--ink)', lineHeight: 1 }}>{stat.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '6px' }}>{stat.label}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--ink-light)', marginTop: '2px' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* The weekly check in: a plain prompt, no graph. The real picture is
          the working on list above, in words the parent trusts. */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 20px', marginBottom: '20px',
      }}>
        <span style={{ flex: 1, minWidth: '180px' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>
            {checkedThisWeek ? 'This week is logged' : 'Weekly check in'}
          </span>
          <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>
            {checkedThisWeek
              ? `A quick read on how ${primary?.name ?? 'your child'} is doing, done for this week.`
              : `Five minutes on how ${primary?.name ?? 'your child'} is really doing. It feeds the advice DiGi gives you.`}
          </span>
        </span>
        <Link href="/dashboard/tracker/checkin" style={{
          flexShrink: 0,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
          background: checkedThisWeek ? 'var(--cream)' : 'var(--terracotta)',
          color: checkedThisWeek ? 'var(--ink-muted)' : 'var(--ink)',
          borderRadius: '12px', padding: '11px 18px', textDecoration: 'none',
          boxShadow: checkedThisWeek ? 'none' : '0 3px 0 var(--terracotta-dark)',
          border: checkedThisWeek ? '1.5px solid var(--border)' : 'none',
        }}>
          {checkedThisWeek ? 'Update' : 'Start, 5 minutes'}
        </Link>
      </div>

      {/* The weekly mission, an invitation never a lock */}
      <div style={{ background: 'var(--deep-teal)', borderRadius: '18px', padding: '18px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
          Streak missions
        </div>
        <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6, margin: '0 0 8px', fontWeight: 600 }}>
          {streak.count >= 5
            ? `Five days of showing up. This week's mission: do an age matched lesson together. Is That Real? is a good one to start with.`
            : `Show up ${Math.max(0, 5 - streak.count)} more day${5 - streak.count === 1 ? '' : 's'} and your first mission lands: a lesson to do together.`}
        </p>
        <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, margin: 0 }}>
          Missions are invitations, never locks. Every lesson is open to members any time in the Lessons tab.
        </p>
      </div>
    </div>
  )
}
