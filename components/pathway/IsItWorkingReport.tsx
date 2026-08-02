import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { getDailyStreak } from '@/lib/pathway/streak'
import WorkingOn from '@/components/tracker/WorkingOn'
import LiteracyCheckIn from '@/components/pathway/LiteracyCheckIn'
import { getLiteracyStatuses } from '@/lib/pathway/literacy-status'
import StickerBook from '@/components/pathway/StickerBook'
import { getStickerBook } from '@/lib/stickers/book'
import StaggerReveal from '@/components/pathway/StaggerReveal'
import ToolCard, { type Tool } from '@/components/tools/ToolCard'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import { pickChild } from '@/lib/children/select'
import BalanceReport from '@/components/balance/BalanceReport'
import { type ParentReport } from '@/lib/balance/parent-report'

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

// The "Is it working?" report: the honest read on where a family actually is.
//
// This was its own page at /dashboard/tracker, which meant the passport lived
// in two places and a parent had two pages both claiming to be the passport.
// It is a section of the pathway now, so there is one passport, one road, one
// set of four strands, and this report reads underneath them rather than
// repeating them.
//
// Moved wholesale rather than rewritten, so nothing in it could be quietly
// dropped in translation. What WAS deliberately removed is only the blocks the
// pathway already renders above it: the passport book, the stage road, the
// four literacy strands and the working on list. Everything else, the verdict
// sentence, the friends, the sticker book, the screen balance, the streak, the
// week in numbers, the check in and the mission, is exactly as it was.
export default async function IsItWorkingReport(
  { childParam, parentReport }: { childParam?: string; parentReport?: ParentReport | null },
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')


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
    supabase.from('family_quests').select('id, stars, child_id, title').eq('user_id', user.id).eq('active', true),
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

  // The screen balance reading comes from the page above, which builds it once
  // and gives the same object to the passport's balance row and to the report
  // below, so one page can never quote two different totals for one week.

  // The child's sticker book: earned from the same star bank and printable
  // loop the rest of this page reads, so the collection can never disagree with
  // the numbers. Reconciled and made permanent on read, fails soft pre 101.
  const stickerBook = primary?.id
    ? await getStickerBook(supabase, user.id, { id: primary.id, age_band: primary.age_band ?? null })
    : null

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
    <StaggerReveal style={{ maxWidth: '640px', margin: '0 auto', padding: '8px 20px 40px' }}>
      <ChildSwitcher kids={children} selectedId={primary?.id ?? null} basePath="/dashboard/pathway" />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 5.5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        Is it working?
      </h2>
      {/* The report in one warm sentence, sat on green so the message shows
          itself: what green means, and that amber is a next step, never a mark
          against anyone. Bigger and ink dark so it reads at a glance. */}
      <div style={{ background: 'var(--tint-green)', border: '1.5px solid #BADFC9', borderRadius: '16px', padding: '16px 18px', margin: '0 0 22px', maxWidth: '620px' }}>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.55, fontWeight: 600, margin: 0 }}>
          <span style={{ color: '#2F8F6B', fontWeight: 800 }}>Green</span> means that part of the plan is doing its job. Anything <span style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>amber</span> comes with one clear next step, like a good school report.
        </p>
      </div>

      {/* Meet the family, where the five point badge used to sit: DiGi and the
          Planet Friends the child grows up with, an introduction not a score. */}

      {/* The sticker book: the child's collection, filling up as they earn
          stars, finish printables and grow through the stages. */}
      {stickerBook && stickerBook.total > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <StickerBook book={stickerBook} childName={primary?.name ?? undefined} />
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

      {/* Warmth when the report is mostly green, in colour not noise */}
      {greenCount >= 3 && (
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--retro-green-dark)', lineHeight: 1.5, margin: '0 0 14px' }}>
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
            fontSize: 'var(--text-base)', fontWeight: 900,
          }}>✓</span>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            Today&rsquo;s ten minutes are done. That feeds the four below.
          </p>
        </div>
      )}


      {/* The check in stays: it is the only place a parent grades the four
          strands themselves, and the pathway's own strands card is a read out
          rather than an input. */}
      <div style={{ margin: '0 -20px' }}>
        <LiteracyCheckIn stageId={stageNum} />
      </div>

      {/* The honest sentence */}
      <div style={{
        background: 'var(--tint-sage)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          {headline.charAt(0).toUpperCase() + headline.slice(1)}
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '8px 0 0' }}>
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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: streak.aliveToday ? 'var(--terracotta-dark)' : 'var(--ink)', lineHeight: 1 }}>
              {streak.count} day{streak.count === 1 ? '' : 's'} running
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '4px' }}>
              {streak.aliveToday
                ? 'Today is already counted. Come back tomorrow to keep it going.'
                : 'Not counted yet today. One check in, moment or script keeps it alive.'}
            </div>
          </div>
        </div>
      )}

      {/* What we are working on: the real list, with the parent's verdict.
          Not the same thing as the pathway's journey card above, which is the
          three strands and the next step. This is the concerns a parent has
          actually flagged and whether they are shifting. */}
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              What helps with this
            </span>
            <Link href="/dashboard/toolbox" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1 }}>{stat.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '6px' }}>{stat.label}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-light)', marginTop: '2px' }}>{stat.sub}</div>
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
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            {checkedThisWeek ? 'This week is logged' : 'Weekly check in'}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '2px' }}>
            {checkedThisWeek
              ? `A quick read on how ${primary?.name ?? 'your child'} is doing, done for this week.`
              : `Five minutes on how ${primary?.name ?? 'your child'} is really doing. It feeds the advice DiGi gives you.`}
          </span>
        </span>
        <Link href="/dashboard/tracker/checkin" style={{
          flexShrink: 0,
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
          Streak missions
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: '#fff', lineHeight: 1.6, margin: '0 0 8px', fontWeight: 600 }}>
          {streak.count >= 5
            ? `Five days of showing up. This week's mission: do an age matched lesson together. Is That Real? is a good one to start with.`
            : `Show up ${Math.max(0, 5 - streak.count)} more day${5 - streak.count === 1 ? '' : 's'} and your first mission lands: a lesson to do together.`}
        </p>
        <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, margin: 0 }}>
          Missions are invitations, never locks. Every lesson is open to members any time in the Lessons tab.
        </p>
      </div>
    </StaggerReveal>
  )
}
