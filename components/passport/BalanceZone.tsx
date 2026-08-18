import Link from 'next/link'
import type { ParentReport } from '@/lib/balance/parent-report'
import { withChild } from '@/components/passport/Application'

// ═══ THE BALANCE, DRAWN AS A ZONE YOU STAY IN ═══════════════════════════════
//
// Justin, 18 August 2026: "balance is a moving picture based on all use and
// current position." So this is the one part of the application that is a
// POSITION, not a bar to fill. The Mobbin sweep settled the form (recorded in
// decisions.md): Gentler Streak's zone band, Whoop's word before any number,
// Oura's contributors list, Apple Fitness's seven day dots, and CRED's claim
// it back framing for a bad week.
//
// The rules this component enforces, because each one was a decision:
//   A WORD, NEVER A NUMBER in the headline. Numbers invite gaming and shame;
//     hours live one tap deeper, on the stats page.
//   NO RING. A ring promises completion at 100 percent, and this is the one
//     strand that must never promise completion.
//   A BAD WEEK SHIPS WITH THE WAY BACK in the same sentence, and the next
//     reading date, so the metric visibly breathes on a schedule. Never a red
//     cross, never the word failed.
//   THE MARKER CAN SIT LEFT OF THE ZONE TOO: a very light week is a position,
//     not a triumph, which is what makes the band honest in both directions.

export type DayDot = { kept: boolean; today: boolean; future: boolean }

function overBy(report: ParentReport): string {
  // Against the guide pro rated to the days gone, the same maths the report
  // itself uses, said in halves of hours so it never reads as surveillance.
  const guideSoFar = (report.healthyWeekMins / 7) * report.daysSoFar
  const over = report.totalWeekMins - guideSoFar
  if (over <= 30) return 'a little'
  const hours = Math.round(over / 30) / 2
  return `about ${hours === Math.floor(hours) ? hours : hours.toFixed(1)} hour${hours > 1 ? 's' : ''}`
}

/** Marker position across the band, 0 to 100, with the healthy zone at
 *  38 to 62. Ratio of actual use to the pro rated guide, clamped so the
 *  marker never leaves the band however wild the week. */
function markerPct(report: ParentReport): number {
  const guideSoFar = Math.max(1, (report.healthyWeekMins / 7) * report.daysSoFar)
  const ratio = report.totalWeekMins / guideSoFar
  const raw = Math.max(4, Math.min(96, Math.round(50 * ratio)))
  // The STATUS is the authority on which side of the zone the week is, so the
  // marker must agree with the word above it: a healthy week sits INSIDE the
  // drawn zone (39 to 61) even when the raw ratio grazes an edge, and an over
  // week sits visibly past it. The ratio still decides where within the band.
  if (report.status === 'healthy') return Math.max(40, Math.min(60, raw))
  if (report.status === 'under') return Math.min(34, raw)
  if (report.status === 'over') return Math.max(66, Math.min(82, raw))
  return Math.max(84, raw)
}

export default function BalanceZone({
  report,
  jobsLine,
  jobsOk,
  days,
  kid,
  childParam,
  siblingGlance,
}: {
  /** Null when no week has been logged yet: the honest empty state. */
  report: ParentReport | null
  /** The jobs reading in the in a row voice, from the ticks: "4 days in a row"
   *  or "None yet this week". */
  jobsLine: string
  jobsOk: boolean
  /** Monday to Sunday of the star week. */
  days: DayDot[]
  kid: string
  childParam: string | null | undefined
  /** The other child's pull, only when they need a look:
   *  { name, href } for "Alma's balance is worth a look ›". */
  siblingGlance: { name: string; href: string } | null
}) {
  const screensOk = report ? (report.status === 'healthy' || report.status === 'under') : true
  const green = screensOk && jobsOk
  const word = !report
    ? 'No week to read yet'
    : green ? 'In balance this week'
    : !screensOk ? 'Worth a look this week'
    : 'Jobs need a look this week'

  const pct = report ? markerPct(report) : 50

  return (
    <div id="balance-zone" style={{ scrollMarginTop: '84px', margin: '18px 0 0' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
        boxShadow: '0 3px 0 rgba(26,26,46,0.05)', padding: '15px 16px 14px',
      }}>
        <p className="eyebrow" style={{ marginBottom: 3 }}>{kid}&rsquo;s balance</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 10px' }}>
          {word}
        </h3>

        {/* The zone band. The healthy middle is a real drawn region, so the
            marker has somewhere to BE rather than a percentage to reach. */}
        <div aria-hidden style={{ position: 'relative', height: 14, borderRadius: 100, background: '#EDE9DF', margin: '14px 2px 6px' }}>
          <span style={{ position: 'absolute', left: '38%', width: '24%', top: 0, bottom: 0, background: 'var(--tint-sage)', border: '1.5px solid #C9DDD5', borderRadius: 100 }} />
          <span style={{
            position: 'absolute', left: `${pct}%`, top: -5, width: 24, height: 24, marginLeft: -12,
            borderRadius: 100, background: 'var(--terracotta)', border: '2.5px solid var(--terracotta-dark)',
            boxShadow: '0 2px 0 rgba(26,26,46,0.18)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 2px 12px' }}>
          <span>Light</span><span>The healthy zone</span><span>Over</span>
        </div>

        {/* The two contributors, straight from the readings the product
            already makes: what moves the marker, one status word each. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '9px 12px' }}>
            <span aria-hidden>⭐</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>Jobs</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: jobsOk ? 'var(--retro-green)' : 'var(--terracotta-dark)' }}>
              {jobsLine}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '9px 12px' }}>
            <span aria-hidden>📱</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>Screens</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: screensOk ? 'var(--retro-green)' : 'var(--terracotta-dark)' }}>
              {!report ? 'Nothing logged' : report.status === 'under' ? 'Light' : report.status === 'healthy' ? 'Healthy' : report.status === 'over' ? 'Over' : 'Well over'}
            </span>
          </div>
        </div>

        {/* The week as a moving window: seven dots, Monday first, filled where
            the day was kept, today ringed, the rest waiting. */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', margin: '13px 0 0' }}>
          {days.map((d, i) => (
            <span key={i} aria-hidden style={{
              width: 13, height: 13, borderRadius: 100,
              background: d.kept ? 'var(--terracotta)' : '#fff',
              border: d.today ? '2px solid var(--terracotta-dark)' : `1.5px solid ${d.kept ? 'var(--terracotta-dark)' : 'var(--border)'}`,
              opacity: d.future ? 0.45 : 1,
            }} />
          ))}
        </div>

        {/* The repair line, only when the week has slipped: the way back in
            the same breath, and the fact that a comeback still counts. */}
        {report && !green && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '10px 12px', margin: '12px 0 0' }}>
            {!screensOk
              ? `Over by ${overBy(report)}. A couple of jobs and a lighter weekend brings it back, and back in the zone by Sunday still counts.`
              : 'No jobs banked yet this week. One tick tonight starts the week again, and a late start still counts.'}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>
            Kept up, not ticked off · reads again Sunday
          </span>
          <Link href={withChild('/dashboard/stats?from=passport', childParam)} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            The hours ›
          </Link>
        </div>
      </div>

      {/* The sibling glance: the quiet pull to switch, only when another child
          genuinely needs a look. This is the per child balance signal that
          would have been dots on the switcher pills; the pills belong to the
          layout rail now, so the signal lives here in the passport's own lane
          and stays a sentence rather than a badge. */}
      {siblingGlance && (
        <Link href={siblingGlance.href} style={{
          display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: 12, padding: '9px 13px', marginTop: 9,
        }}>
          <span aria-hidden style={{ width: 9, height: 9, borderRadius: 100, background: '#D97706', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
            {siblingGlance.name}&rsquo;s balance is worth a look this week
          </span>
          <span aria-hidden style={{ marginLeft: 'auto', color: 'var(--terracotta-dark)', fontWeight: 800 }}>›</span>
        </Link>
      )}
    </div>
  )
}
