'use client'

// The parent balance graph. A calm, glanceable read on the week: screen time
// grouped by what the device is for (social, gaming, watching, creating and
// learning), and for each type the healthy guide for this age marked right on
// its own bar, so a parent sees used against acceptable for every type, not one
// number for the whole week. Then the week total, and the off screen report set
// against the on screen time. Presentational only: it takes a ParentReport
// (built by lib/balance/parent-report) so any surface can drop it in.

import { fmtMins, BUCKET_META, type ParentReport } from '@/lib/balance/parent-report'
import { SCREEN_GUIDE_SOURCES, type ScreenStatus } from '@/lib/quests/screen-balance'

const GOOD = '#4C9F6B'
const OVER = '#D98B45'

// Each type reads as under, on track or over on its own line, with a calm
// colour a parent can scan. Under and on track are both green (a light week is
// never a problem); over warms to amber, well over a shade deeper.
const TYPE_STATUS: Record<ScreenStatus, { label: string; bg: string; fg: string }> = {
  under:     { label: 'Under guide', bg: '#EAF3EC', fg: GOOD },
  healthy:   { label: 'On track',    bg: '#EAF3EC', fg: GOOD },
  over:      { label: 'Over',        bg: '#FBEEDF', fg: OVER },
  well_over: { label: 'Well over',   bg: '#F7E3D6', fg: '#C0603A' },
}

export default function BalanceReport({ report }: { report: ParentReport }) {
  const { childName, bandLabel, totalWeekMins, healthyWeekMins, status, buckets, offscreen, guidance } = report
  const name = childName && childName !== 'Your child' ? childName : 'Your child'

  // One row per type, always all four, each carrying its own used total and the
  // healthy guide for this age, so a type not used yet still shows its limit.
  const usedByBucket = new Map(buckets.map(b => [b.bucket, b]))
  const rows = report.typeGuides.map(tg => ({ tg, summary: usedByBucket.get(tg.bucket) ?? null }))

  // Shared scale across every bar: the biggest of any type's used or guide, so
  // the used fill and the guide marker are comparable line to line.
  const scale = Math.max(
    1,
    ...rows.map(r => Math.max(r.tg.recommendedWeekMins, r.summary?.minutes ?? 0)),
  ) * 1.08

  const over = status === 'over' || status === 'well_over'
  const dailyGuideMins = Math.round(healthyWeekMins / 7)
  const totalDailyAvg = Math.round(totalWeekMins / 7)

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
      {/* Per type: used against the healthy guide for this age, marked on each bar */}
      <div style={card}>
        <div style={cardTitle}>{name}&apos;s screen time this week</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 700 }}>
              <i style={{ width: 16, height: 0, borderTop: `2px dashed ${OVER}`, display: 'inline-block' }} /> Healthy guide
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)', fontWeight: 700 }}>Ages {bandLabel}</span>
          </div>
          {/* The number in plain words, day and week, why it is a guide not a
              cap, and that the average across the week is what matters. The
              research it draws on is listed below, open on the page not a hover,
              so a parent on a phone can see exactly where it comes from. */}
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            For age {bandLabel}, the health guidance lands on about <b style={{ color: 'var(--ink)' }}>{fmtMins(dailyGuideMins)} a day</b> of recreational screen, which is around <b style={{ color: 'var(--ink)' }}>{fmtMins(healthyWeekMins)} a week</b>. The dashed line marks it on each bar, and the coloured bar is what we have recorded. It is an average to aim at, not a limit: a day over is fine when the week balances out.
          </p>
          <details style={{ marginTop: 9 }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              Where this guide comes from ›
            </summary>
            <ul style={{ margin: '9px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {SCREEN_GUIDE_SOURCES.map(src => (
                <li key={src.body} style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                  <b style={{ color: 'var(--ink)' }}>{src.body}</b> ({src.year}): {src.note}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0' }}>
              The bodies stop short of one universal number for school age and up, so this is a calibrated steer for the age, not a hard rule. What screens crowd out, sleep, movement and real play, matters more than the clock.
            </p>
          </details>
        </div>

        {rows.map(({ tg, summary }) => {
          const used = summary?.minutes ?? 0
          const guide = tg.recommendedWeekMins
          const usedDaily = Math.round(used / 7)
          const guideDaily = tg.recommendedDailyMins
          const usedPct = Math.min(100, (used / scale) * 100)
          const guidePct = Math.min(100, (guide / scale) * 100)
          const s = TYPE_STATUS[tg.status]
          const barOver = used > guide
          return (
            <div key={tg.bucket} style={{ marginBottom: 18 }}>
              {/* Type header: name on the left, the status for the age on the right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--ink)' }}>
                  {tg.emoji} {tg.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: s.fg, background: s.bg, padding: '4px 8px', borderRadius: 100, flexShrink: 0 }}>
                  {s.label}
                </span>
              </div>

              {/* The plain daily read, the one a parent grasps at a glance: what
                  the child averaged a day set beside the recommended a day. */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                <span style={{ color: s.fg }}>{name}: {fmtMins(usedDaily)} a day</span>
                <span style={{ color: 'var(--ink-muted)' }}>guide {fmtMins(guideDaily)} a day</span>
              </div>

              {/* The bar: this week's minutes under the dashed weekly guide marker */}
              <div style={{ position: 'relative', height: 20, background: 'var(--cream)', borderRadius: 8 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(used > 0 ? 3 : 0, usedPct)}%`, borderRadius: 8, background: barOver ? OVER : BUCKET_META[tg.bucket].tone }} />
                <div style={{ position: 'absolute', top: -3, bottom: -3, left: `${guidePct}%`, width: 0, borderLeft: `2px dashed ${OVER}`, zIndex: 2 }} />
              </div>

              {/* The full week: recorded against the recommended week, and the per
                  device split when a type has more than one device in it. */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-muted)', fontWeight: 700, marginTop: 5 }}>
                This week {fmtMins(used)} of {fmtMins(guide)} recommended
                {summary && summary.devices.length > 1 && (
                  <span style={{ color: 'var(--ink-soft)' }}>
                    {'  ·  '}
                    {summary.devices.map(d => `${d.device} ${fmtMins(d.minutes)}`).join('  ·  ')}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <b style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--ink)' }}>Total this week</b>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12.5, color: over ? OVER : GOOD }}>
            {fmtMins(totalWeekMins)} of {fmtMins(healthyWeekMins)} healthy
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-muted)', textAlign: 'right', marginTop: 3 }}>
          about {fmtMins(totalDailyAvg)} a day of {fmtMins(dailyGuideMins)} a day recommended
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '10px 0 0' }}>
          A steer for their age, never a hard cap. What screens crowd out, sleep, movement and real play, matters more than the clock.
        </p>
      </div>

      {/* Off screen against on screen: the real world total for the week set
          beside the screen total, so the balance reads at a glance. */}
      <div style={{ ...card, background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: 'var(--stage-1, #FFFBEE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌟</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
              {name} put in <b>{fmtMins(offscreen.minutes)} on jobs, printables and getting outside</b> this week, against <b>{fmtMins(totalWeekMins)} on screen</b>, earning <b>{offscreen.stars} {offscreen.stars === 1 ? 'star' : 'stars'}</b> across <b>{offscreen.activities}</b> real world {offscreen.activities === 1 ? 'win' : 'wins'}.
            </p>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--ink-soft)', margin: '6px 0 0' }}>
              This counts the offline things that got recorded, jobs done, printables finished and time outside, not their whole day away from a screen.
            </p>
          </div>
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
