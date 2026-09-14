'use client'

import { HAPPY, Ribbon, StarShape } from '@/components/kid/HappyNewsBits'
import type { MissionRow } from '@/lib/kid/mission'

// The mission card under the five a day.
//
// Justin, 14 September 2026: "the five a day have a mission over time to
// achieve our objectives of balanced device use and understanding online
// safety lessons." Three rows, one per objective, each the next sticker the
// child is working towards with a bar and the count. The Happy News finish:
// white card, ink edge, one ribbon, the Friend as a sticker on the first row.
// The line under the ribbon says the whole thing in one breath.

export default function KidMission({ rows, compact = false }: { rows: MissionRow[]; compact?: boolean }) {
  if (rows.length === 0) return null
  return (
    <div data-mission style={{
      position: 'relative', background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)',
      boxShadow: `0 5px 0 ${HAPPY.ink}`, padding: compact ? '12px 12px 10px' : '14px 14px 12px', overflow: 'hidden',
    }}>
      <span aria-hidden style={{ position: 'absolute', top: 8, right: 10 }}><StarShape size={12} color={HAPPY.coral} /></span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <Ribbon>Your mission</Ribbon>
      </div>
      <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
        Every full day adds up: balanced screens, safe online, and a Friend for the days you finish.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(r => {
          const pct = r.need > 0 ? Math.round((Math.min(r.have, r.need) / r.need) * 100) : 0
          return (
            <div key={r.key} data-mission-row={r.key} data-done={r.done ? 'yes' : 'no'} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span aria-hidden style={{
                position: 'relative', flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                background: r.done ? HAPPY.butter : '#fff', border: `2px solid ${HAPPY.ink}`, boxShadow: `0 2px 0 ${HAPPY.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {r.art
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={r.art} alt="" width={32} height={32} style={{ width: 32, height: 32, objectFit: 'contain', filter: r.done ? 'none' : 'grayscale(0.35)' }} />
                  : <span style={{ fontSize: 18, lineHeight: 1 }}>{r.emoji}</span>}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.2, minWidth: 0 }}>
                    {r.title}
                  </span>
                  <span data-mission-line style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: r.done ? HAPPY.green : 'var(--ink-muted)' }}>
                    {r.line}
                  </span>
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 1 }}>
                  {r.objective}
                </span>
                <span style={{ display: 'block', height: 6, borderRadius: 'var(--radius-pill)', background: 'rgba(26,26,46,0.1)', overflow: 'hidden', marginTop: 5 }}>
                  <span style={{ display: 'block', height: '100%', width: `${r.done ? 100 : pct}%`, background: r.done ? HAPPY.green : r.colour, borderRadius: 'var(--radius-pill)', transition: 'width 0.35s ease' }} />
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
