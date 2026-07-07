import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import { getDailyStreak } from '@/lib/pathway/streak'

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

  const [childrenRes, concernsRes, checksRes, questsRes, ticksRes, streak] = await Promise.all([
    supabase.from('children').select('id, name, age_band').eq('parent_id', user.id).order('created_at'),
    supabase.from('concerns').select('slug, label, status, times_flagged, last_flagged_at').eq('user_id', user.id).order('last_flagged_at', { ascending: false }).limit(8),
    supabase.from('wellbeing_checks').select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication').eq('parent_id', user.id).order('week_start', { ascending: false }).limit(6),
    supabase.from('family_quests').select('id, stars, child_id').eq('user_id', user.id).eq('active', true),
    supabase.from('quest_ticks').select('quest_id, child_id, status').eq('user_id', user.id).eq('status', 'approved').gte('tick_date', weekAgo),
    getDailyStreak(supabase, user.id),
  ])

  const children = childrenRes.data ?? []
  const primary = children[0] ?? null
  const concerns = concernsRes.data ?? []
  const checks = (checksRes.data ?? []) as Check[]
  const quests = questsRes.data ?? []
  const ticks = ticksRes.data ?? []

  const stage = primary?.age_band ? getStageFromAgeBand(primary.age_band as AgeBand) : null
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
      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '14px' }}>
        Is it working?
      </h1>

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

      {/* Position on the pathway to 16 */}
      {stage && (
        <Link href="/dashboard/pathway" style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
              {primary?.name ?? 'Your child'} on the pathway to 16
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {STAGES.map((s, i) => {
                const here = s.id === stage.id
                return (
                  <div key={s.id} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: here ? 34 : 22, height: here ? 34 : 22, borderRadius: '50%', flexShrink: 0,
                      background: s.id < stage.id ? 'var(--tint-sage)' : here ? 'var(--terracotta)' : 'var(--cream)',
                      border: here ? '3px solid var(--terracotta-dark)' : '2px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: here ? '13px' : '10px', fontWeight: 700,
                      color: here ? '#fff' : 'var(--ink-muted)',
                    }}>
                      {s.id < stage.id ? '✓' : s.id}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div style={{ flex: 1, height: '3px', borderRadius: '3px', background: s.id < stage.id ? 'var(--tint-sage)' : 'var(--border)' }} />
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', margin: '12px 0 0', lineHeight: 1.5 }}>
              Stage {stage.id}, {stage.name} ({stage.ages}). Every lesson, quest and setting from here builds toward full independence at 16.
            </p>
          </div>
        </Link>
      )}

      {/* Concern arcs */}
      {concerns.length > 0 && (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            What you are working on
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {concerns.map(c => (
              <Link key={c.slug} href={`/dashboard/digi?q=${encodeURIComponent(`Update on: ${c.label}. What is the next step for us?`)}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '12px',
                  background: c.status === 'improving' ? 'var(--tint-sage)' : c.status === 'resolved' ? 'var(--cream)' : 'var(--terracotta-lt)',
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>
                    {c.status === 'improving' ? '↗' : c.status === 'resolved' ? '✓' : '·'}
                  </span>
                  <span style={{
                    flex: 1, fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)',
                    textDecoration: c.status === 'resolved' ? 'line-through' : 'none',
                    opacity: c.status === 'resolved' ? 0.6 : 1,
                  }}>
                    {c.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--ink-muted)', flexShrink: 0 }}>
                    {c.status === 'improving' ? 'better this week' : c.status === 'resolved' ? 'resolved' : `came up ${c.times_flagged} time${c.times_flagged === 1 ? '' : 's'}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* The week in numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { n: String(streak.count), label: 'day streak', sub: streak.count >= 5 ? 'mission ready' : `${Math.max(0, 5 - streak.count)} to a mission` },
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

      {/* Wellbeing trend in plain words */}
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            The wellbeing picture
          </span>
          <Link href="/dashboard/tracker/checkin" style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px',
            background: checkedThisWeek ? 'var(--cream)' : 'var(--terracotta)',
            color: checkedThisWeek ? 'var(--ink-muted)' : 'var(--ink)',
            borderRadius: '10px', padding: '8px 14px', textDecoration: 'none',
            boxShadow: checkedThisWeek ? 'none' : '0 3px 0 var(--terracotta-dark)',
          }}>
            {checkedThisWeek ? 'Update this week' : 'Start this week, 5 minutes'}
          </Link>
        </div>

        {checks.length === 0 ? (
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The weekly check in takes five minutes and becomes the most useful picture in this app: how {primary?.name ?? 'your child'} is actually doing, week on week, in your own words.
          </p>
        ) : (
          <>
            {(() => {
              const ordered = [...checks].reverse()
              const mostRecentWeek = ordered[ordered.length - 1]?.week_start
              return (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '4px' }}>
                  {ordered.map(c => {
                    const a = avg(c)
                    const isThisWeek = c.week_start === mostRecentWeek
                    const dateLabel = new Date(`${c.week_start}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    return (
                      <div key={c.week_start} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>
                          {a !== null ? a.toFixed(1) : '–'}
                        </span>
                        <div style={{
                          width: '100%', borderRadius: '6px 6px 3px 3px',
                          height: `${a !== null ? Math.max(10, (a / 5) * 46) : 10}px`,
                          background: a !== null && a >= 3.4 ? 'var(--tint-sage)' : a !== null && a >= 2.4 ? 'var(--stage-1-bold)' : 'var(--terracotta-lt)',
                          border: '1px solid var(--border)',
                        }} />
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: isThisWeek ? 700 : 600,
                          color: isThisWeek ? 'var(--terracotta-dark)' : 'var(--ink-light)', whiteSpace: 'nowrap',
                        }}>
                          {isThisWeek ? 'This week' : dateLabel}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
            <p style={{ fontSize: '11px', color: 'var(--ink-light)', margin: '2px 0 12px' }}>
              Out of 5, averaged across mood, sleep, social and screens. Green is doing well, amber is mixed, coral means worth a look.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
              {trend === 'up' && 'Climbing: this week scored better than last. Whatever changed, keep it.'}
              {trend === 'down' && `A dip this week. Not a crisis, a signal: start with ${nextStep.next}.`}
              {trend === 'steady' && 'Holding steady week on week. Structure is doing its quiet work.'}
              {trend === null && 'One more week of check ins and the trend starts telling its story.'}
            </p>
          </>
        )}
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
