'use client'

// The parent balance graph, redesigned as a family wall: one glanceable state
// for the child at the top (read in a second), then the screen types split into
// two honest groups, the ones to keep in check and the ones to build up, then
// the week total and the off screen effort beside it. When the week needs a
// nudge it offers one tap to a real world activity, so the wall does not just
// report, it guides the child back toward balance. Presentational only: it takes
// a ParentReport (built by lib/balance/parent-report) so any surface drops it in.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { fmtMins, BUCKET_META, type ParentReport, type TypeGuide, type BucketSummary, type TopState } from '@/lib/balance/parent-report'
import { SCREEN_GUIDE_SOURCES, type BucketStatus } from '@/lib/quests/screen-balance'

const GOOD = '#4C9F6B'
const OVER = '#D98B45'
const FLAG = '#C4574D'
const GROW = '#B67A2E'

// The look of the one top state, keyed to its tone. Calm greens for a good or
// quiet week, warm amber for a watch or a grow nudge, a clear warm red for the
// flag a parent should actually act on.
const TOP_TONE: Record<TopState['tone'], { bg: string; border: string; fg: string; emoji: string }> = {
  good:  { bg: '#EAF3EC', border: '#CFE6D6', fg: GOOD, emoji: '⭐' },
  quiet: { bg: 'var(--cream)', border: 'var(--border)', fg: 'var(--ink-soft)', emoji: '🌱' },
  grow:  { bg: '#FBF3E3', border: '#F1E4BE', fg: GROW, emoji: '✏️' },
  watch: { bg: '#FBEEDF', border: '#F1E0C6', fg: OVER, emoji: '👀' },
  flag:  { bg: '#F9E1DB', border: '#EFC9BF', fg: FLAG, emoji: '📱' },
}

// The pill on each bucket row. Builders and keepers read differently: a builder
// under its aim is an invitation (room to grow), never a green pass.
function pillFor(tg: TypeGuide): { label: string; bg: string; fg: string } {
  const s: BucketStatus = tg.status
  if (tg.kind === 'build') {
    return s === 'good'
      ? { label: 'Building well', bg: '#EAF3EC', fg: GOOD }
      : { label: 'Room to grow', bg: '#FBF3E3', fg: GROW }
  }
  if (s === 'good') return { label: 'Good', bg: '#EAF3EC', fg: GOOD }
  if (s === 'watch') return { label: 'Watch', bg: '#FBEEDF', fg: OVER }
  return { label: 'Needs a look', bg: '#F9E1DB', fg: FLAG }
}

// The bar fill colour for a row, from its status and kind.
function fillFor(tg: TypeGuide): string {
  if (tg.status === 'flag') return FLAG
  if (tg.status === 'watch') return OVER
  if (tg.kind === 'build') return tg.status === 'good' ? GOOD : BUCKET_META[tg.bucket].tone
  return BUCKET_META[tg.bucket].tone
}

export default function BalanceReport({ report }: { report: ParentReport }) {
  const { childName, bandLabel, totalWeekMins, healthyWeekMins, status, topState, buckets, offscreen, daysSoFar } = report
  const name = childName && childName !== 'Your child' ? childName : 'Your child'

  const usedByBucket = new Map(buckets.map(b => [b.bucket, b]))
  const rows = report.typeGuides.map(tg => ({ tg, summary: usedByBucket.get(tg.bucket) ?? null }))
  const keepRows = rows.filter(r => r.tg.kind === 'keep')
  const buildRows = rows.filter(r => r.tg.kind === 'build')

  // Shared scale across every bar, so the used fill and the guide marker are
  // comparable line to line.
  const scale = Math.max(1, ...rows.map(r => Math.max(r.tg.recommendedWeekMins, r.summary?.minutes ?? 0))) * 1.08

  const over = status === 'over' || status === 'well_over'
  // The guide is a full week's worth however far into the week it is read, so
  // it stays over 7. What the child actually did is averaged over the days
  // that have happened, which on a Monday is one day and not a seventh of one.
  const dailyGuideMins = Math.round(healthyWeekMins / 7)
  const totalDailyAvg = Math.round(totalWeekMins / Math.max(1, daysSoFar))
  const showAction = topState.tone === 'flag' || topState.tone === 'watch' || topState.tone === 'grow'

  // On a good week the top state emblem gives a small, warm pop, so a balanced
  // week feels earned rather than reading the same as a flagged one in another
  // colour. Never against reduced motion.
  const good = topState.tone === 'good'
  const starRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!good || !starRef.current) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = starRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { scale: 0.5, rotate: -14 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.55)', delay: 0.1 })
    })
    return () => ctx.revert()
  }, [good])

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
    boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16,
  }
  const cardTitle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: 'var(--ink-muted)',
  }
  const groupTitle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '4px 0 12px',
  }

  const top = TOP_TONE[topState.tone]

  const renderRow = ({ tg, summary }: { tg: TypeGuide; summary: BucketSummary | null }) => {
    const used = summary?.minutes ?? 0
    const guideWeek = tg.recommendedWeekMins
    const usedDaily = Math.round(used / Math.max(1, daysSoFar))
    const guideDaily = tg.recommendedDailyMins
    const usedPct = Math.min(100, (used / scale) * 100)
    const guidePct = guideWeek > 0 ? Math.min(100, (guideWeek / scale) * 100) : 0
    const pill = pillFor(tg)
    const fill = fillFor(tg)

    const guideText = tg.kind === 'build'
      ? `aim ${fmtMins(Math.max(1, guideDaily))} a day plus`
      : guideDaily > 0 ? `guide ${fmtMins(guideDaily)} a day` : `keep near zero at this age`

    let foot: string
    if (tg.kind === 'build') {
      foot = tg.status === 'good' ? `${fmtMins(used)} this week` : `Only ${fmtMins(used)} this week. A quick win is one making or learning thing.`
    } else if (guideDaily <= 0) {
      foot = used > 0 ? `${fmtMins(used)} this week, best kept near zero for ${bandLabel}` : `None this week, which is right for ${bandLabel}`
    } else {
      foot = `${fmtMins(used)} of ${fmtMins(guideWeek)} this week`
    }

    return (
      <div key={tg.bucket} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 5 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)' }}>{tg.emoji} {tg.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: pill.fg, background: pill.bg, padding: '4px 8px', borderRadius: 100, flexShrink: 0 }}>{pill.label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700 }}>
          <span style={{ color: pill.fg }}>{name}: {fmtMins(usedDaily)} a day</span>
          <span style={{ color: 'var(--ink-muted)' }}>{guideText}</span>
        </div>
        <div style={{ position: 'relative', height: 18, background: 'var(--cream)', borderRadius: 8 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(used > 0 ? 3 : 0, usedPct)}%`, borderRadius: 8, background: fill }} />
          {guidePct > 0 && <div style={{ position: 'absolute', top: -3, bottom: -3, left: `${guidePct}%`, width: 0, borderLeft: `2px dashed ${OVER}`, zIndex: 2 }} />}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', fontWeight: 700, marginTop: 5 }}>
          {foot}
          {summary && summary.devices.length > 1 && (
            <span style={{ color: 'var(--ink-soft)' }}>{'  ·  '}{summary.devices.map(d => `${d.device} ${fmtMins(d.minutes)}`).join('  ·  ')}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* One glanceable state for the whole child, read before any bars. */}
      <div style={{ ...card, background: top.bg, border: `1.5px solid ${top.border}`, display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        <span ref={starRef} style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 2px 0 rgba(26,26,46,0.06)' }}>{top.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', lineHeight: 1.25 }}>{topState.label}</div>
          <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 0' }}>{topState.sub}</p>
        </div>
      </div>

      {/* The detail: screen types split into keep in check and build up. */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={cardTitle}>{name}&apos;s week by type</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-muted)', fontWeight: 700 }}>Ages {bandLabel} · about {fmtMins(dailyGuideMins)} a day</span>
        </div>

        <div style={groupTitle}>Keep in balance</div>
        {keepRows.map(renderRow)}

        <div style={{ ...groupTitle, marginTop: 18 }}>Build up</div>
        {buildRows.map(renderRow)}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <b style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)' }}>Total this week</b>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: over ? OVER : GOOD }}>{fmtMins(totalWeekMins)} of {fmtMins(healthyWeekMins)} healthy</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textAlign: 'right', marginTop: 3 }}>
          about {fmtMins(totalDailyAvg)} a day of {fmtMins(dailyGuideMins)} a day guide
        </div>

        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Where this guide comes from ›
          </summary>
          <ul style={{ margin: '9px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {SCREEN_GUIDE_SOURCES.map(src => (
              <li key={src.body} style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                <b style={{ color: 'var(--ink)' }}>{src.body}</b> ({src.year}): {src.note}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
            A steer for the age, never a hard cap. What screens crowd out, sleep, movement and real play, matters more than the clock.
          </p>
        </details>
      </div>

      {/* Guide the child onward: one tap to a real world activity, shown only
          when the week actually needs a nudge. */}
      {showAction && (
        <div style={{ ...card, background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)', marginBottom: 4 }}>
            {topState.tone === 'grow' ? `A quick way to top up ${name}'s making time` : `Bring the week back into balance`}
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            The steadiest fix is not less screen, it is more of the other thing. Point {name} at one real world win and the balance follows.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/dashboard/quests" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '9px 14px', textDecoration: 'none', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>Set a quest</a>
            <a href="/dashboard/quests/crafts" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14, padding: '9px 14px', textDecoration: 'none', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>Print something to make</a>
          </div>
        </div>
      )}

      {/* Off screen against on screen: the real world total for the week set
          beside the screen total, so the balance reads at a glance. */}
      <div style={{ ...card, marginBottom: 0, background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: 'var(--stage-1, #FFFBEE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌟</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
              {name} put in <b>{fmtMins(offscreen.minutes)} on jobs, printables and getting outside</b> this week, against <b>{fmtMins(totalWeekMins)} on screen</b>, earning <b>{offscreen.stars} {offscreen.stars === 1 ? 'star' : 'stars'}</b> across <b>{offscreen.activities}</b> real world {offscreen.activities === 1 ? 'win' : 'wins'}.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-soft)', margin: '6px 0 0' }}>
              This counts the offline things that got recorded, jobs done, printables finished and time outside, not their whole day away from a screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
