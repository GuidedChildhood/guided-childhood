'use client'

// The parent balance graph. A calm, glanceable read on the week: screen time
// as bars grouped by what the device is for (gaming, watching, social, learning)
// with a dashed healthy level marked from the science based age guide, then the
// off screen report line. Presentational only: it takes a ParentReport (built by
// lib/balance/parent-report) so any surface, including the passport, can fetch
// its own rows and drop this in.

import { fmtMins, type ParentReport } from '@/lib/balance/parent-report'
import type { ScreenStatus } from '@/lib/quests/screen-balance'

const GOOD = '#4C9F6B'
const OVER = '#D98B45'

// Each device type reads as under, on track or over on its own line, with a
// calm colour a parent can scan. Under and on track are both green (a light
// week is never a problem); over warms to amber, well over a shade deeper.
const TYPE_STATUS: Record<ScreenStatus, { label: string; bg: string; fg: string }> = {
  under:     { label: 'Under guide', bg: '#EAF3EC', fg: GOOD },
  healthy:   { label: 'On track',    bg: '#EAF3EC', fg: GOOD },
  over:      { label: 'Over',        bg: '#FBEEDF', fg: OVER },
  well_over: { label: 'Well over',   bg: '#F7E3D6', fg: '#C0603A' },
}

export default function BalanceReport({ report }: { report: ParentReport }) {
  const { childName, bandLabel, totalWeekMins, healthyWeekMins, status, buckets, offscreen, guidance } = report
  const name = childName && childName !== 'Your child' ? childName : 'Your child'

  // Scale so the healthy marker sits about three quarters across, leaving room
  // for a week that runs over. Every bar shares this scale.
  const maxDevice = buckets.reduce((m, b) => Math.max(m, ...b.devices.map(d => d.minutes)), 0)
  const scale = Math.max(healthyWeekMins / 0.75, maxDevice * 1.05, 1)
  const markerPct = Math.min(100, (healthyWeekMins / scale) * 100)
  const over = status === 'over' || status === 'well_over'

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
    boxShadow: '0 4px 22px rgba(26,26,46,0.06)', padding: 18, marginBottom: 16,
  }
  const cardTitle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 14,
  }

  return (
    <div>
      {/* Per bucket bars with the healthy marker */}
      <div style={card}>
        <div style={cardTitle}>{name}&apos;s screen time this week</div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>
            <i style={{ width: 16, height: 0, borderTop: `2px dashed ${OVER}`, display: 'inline-block' }} /> Healthy level
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', fontWeight: 700 }}>Ages {bandLabel}</span>
        </div>

        <div style={{ position: 'relative' }}>
          {/* the healthy marker line spanning the bars */}
          <div style={{ position: 'absolute', top: 18, bottom: 8, left: `${markerPct}%`, width: 0, borderLeft: `2px dashed ${OVER}`, zIndex: 2 }} />

          {buckets.length === 0 && (
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0' }}>
              No screen time logged this week. Add each device to the timer to see it here.
            </p>
          )}

          {buckets.map(b => (
            <div key={b.bucket} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5, color: 'var(--ink)' }}>
                  {b.emoji} {b.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-soft)' }}>{fmtMins(b.minutes)}</span>
              </div>
              {b.devices.map(d => {
                const pct = Math.max(3, Math.min(100, (d.minutes / scale) * 100))
                const barOver = d.minutes > healthyWeekMins
                return (
                  <div key={d.device} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                    <span style={{ width: 70, fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{d.device}</span>
                    <div style={{ position: 'relative', flex: 1, height: 20, background: 'var(--cream)', borderRadius: 7 }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 7, background: barOver ? OVER : b.tone }} />
                    </div>
                    <span style={{ width: 50, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', flexShrink: 0 }}>{fmtMins(d.minutes)}</span>
                  </div>
                )
              })}
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <b style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--ink)' }}>Total this week</b>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12.5, color: over ? OVER : GOOD }}>
              {fmtMins(totalWeekMins)} of {fmtMins(healthyWeekMins)} healthy
            </span>
          </div>
        </div>
      </div>

      {/* The recommended amount per device type, for this age, with each type
          set as under, on track or over so the guidance is concrete, not one
          number for the whole week. */}
      <div style={card}>
        <div style={cardTitle}>Healthy amount by type · Ages {bandLabel}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {report.typeGuides.map(tg => {
            const s = TYPE_STATUS[tg.status]
            const dailyAvg = Math.round(tg.actualWeekMins / 7)
            return (
              <div key={tg.bucket} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }} aria-hidden>{tg.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>{tg.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', fontWeight: 700, marginTop: 2 }}>
                    Guide about {fmtMins(tg.recommendedDailyMins)} a day · {fmtMins(tg.recommendedWeekMins)} a week
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: s.fg }}>{fmtMins(tg.actualWeekMins)}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-muted)', fontWeight: 700, marginTop: 1 }}>
                    {tg.actualWeekMins > 0 ? `${fmtMins(dailyAvg)}/day` : 'none yet'}
                  </div>
                </div>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: s.fg, background: s.bg, padding: '5px 9px', borderRadius: 100, minWidth: 62, textAlign: 'center' }}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
          A steer for their age, never a hard cap. What screens crowd out, sleep, movement and real play, matters more than the clock.
        </p>
      </div>

      {/* The off screen report line */}
      <div style={{ ...card, background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: 'var(--stage-1, #FFFBEE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌟</span>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
            {name} spent <b>{fmtMins(offscreen.minutes)} off screen</b> this week across <b>{offscreen.activities}</b> off screen {offscreen.activities === 1 ? 'win' : 'wins'}, and earned <b>{offscreen.stars} {offscreen.stars === 1 ? 'star' : 'stars'}</b> away from a screen.
          </p>
        </div>
      </div>

      {/* One line of guidance */}
      <div style={{ ...card, marginBottom: 0, background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #FFE9A8, #EDC35F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 3px 0 var(--terracotta-dark)' }}>⭐</span>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>{guidance}</p>
      </div>
    </div>
  )
}
