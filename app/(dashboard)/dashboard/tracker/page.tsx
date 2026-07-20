import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { getDailyStreak } from '@/lib/pathway/streak'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import WorkingOn from '@/components/tracker/WorkingOn'
import LiteracyAreas from '@/components/pathway/LiteracyAreas'
import LiteracyCheckIn from '@/components/pathway/LiteracyCheckIn'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import PassportBook from '@/components/pathway/PassportBook'
import { type Stamp, type StampStatus } from '@/components/pathway/PassportStamps'

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

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const [childrenRes, concernsRes, resolvedCountRes, recentSolvedRes, checksRes, questsRes, ticksRes, streak] = await Promise.all([
    supabase.from('children').select('id, name, age_band, streak_weeks').eq('parent_id', user.id).order('created_at'),
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
  ])

  const children = childrenRes.data ?? []
  const primary = children[0] ?? null
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
  const stamps: Stamp[] = stage && allProgress
    ? STAGES.map(s => {
        const slug = STAGE_SLUGS[s.id - 1]
        const prog = allProgress[slug]
        const pct = prog.overallPct
        const status: StampStatus =
          prog.contentComplete ? 'earned'
          : s.id === stage.id ? 'current'
          : s.id < stage.id ? 'catchup'
          : 'upcoming'
        return {
          id: s.id, name: s.name, ages: s.ages, pct, status,
          href: `/dashboard/lessons`,
          lessonsDone: prog.lessonsDone, lessonsTotal: prog.lessonsTotal,
          scriptsPct: prog.scriptsPct, streakPct: prog.streakPct,
          devicesPct: prog.devicesPct, lessonsPct: prog.lessonsPct,
        }
      })
    : []

  const starsByQuest = new Map(quests.map(q => [q.id, q.stars]))
  const weekStars = ticks.reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)

  const open = concerns.filter(c => c.status === 'open')
  const improving = concerns.filter(c => c.status === 'improving')

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

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>Progress</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6.5vw, 2.7rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        Is it working?
      </h1>
      {/* The report in one warm sentence: what green means, and that amber
          is a next step, never a mark against anyone. */}
      <p style={{ fontSize: '16.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px', maxWidth: '620px' }}>
        Green means that part of the plan is doing its job. Anything amber comes with one clear next step, like a good school report.
      </p>

      {/* The same four strands as Home and the pathway, read from the same
          source, so progress always lands in one consistent picture. */}
      {await (async () => {
        const primary = (children ?? [])[0]
        const stageNum = primary?.age_band ? getStageFromAgeBand(primary.age_band as AgeBand).id : 1
        return (
          <div style={{ margin: '0 -20px' }}>
            <LiteracyAreas stageId={stageNum} childName={primary?.name ?? undefined} statuses={await getLiteracyStatuses(supabase, user.id, stageNum)} />
            <LiteracyCheckIn stageId={stageNum} />
          </div>
        )
      })()}

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

      {/* The passport as a flip book: a cover and one page per stage, each
          page's circle filling as that stage is worked through, stamped
          solid at 100 percent, with catch up pages for earlier stages and a
          celebration when the whole passport is complete. */}
      {stage && stamps.length > 0 && (
        <PassportBook stamps={stamps} childName={primary?.name ?? 'your child'} />
      )}

      {/* What we are working on: the real list, with the parent's verdict */}
      <WorkingOn
        concerns={concerns.map(c => ({ slug: c.slug, label: c.label, status: c.status, times_flagged: c.times_flagged }))}
        solvedAlready={solvedCount}
        recentSolved={recentSolved.map(c => ({ slug: c.slug, label: c.label, times_flagged: c.times_flagged }))}
        childName={primary?.name ?? 'your child'}
        parentEmail={user.email ?? ''}
      />

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
