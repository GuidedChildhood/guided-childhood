import { VERDICT_LABEL, VERDICT_TONE, type Pace } from '@/lib/balance/pace'

// The one card that answers the question a parent actually came to the stats
// page with: is this alright, and what should tomorrow look like.
//
// It leads, above the graph, because a graph is something you interpret and
// this is something you read. The big number is the daily average rather than
// the weekly total, since nobody has an instinct for what 210 minutes a week
// means and everybody has one for half an hour a day.

export default function PaceCard({ pace, childName }: { pace: Pace; childName?: string | null }) {
  const tone = VERDICT_TONE[pace.verdict]
  const name = childName && childName !== 'Your child' ? childName : null

  return (
    <div style={{
      background: tone.bg, border: `1.5px solid ${tone.border}`, borderRadius: 20,
      padding: '20px 20px 22px', marginBottom: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
        letterSpacing: '0.13em', textTransform: 'uppercase', color: tone.ink, marginBottom: 10,
      }}>
        {VERDICT_LABEL[pace.verdict]}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 46,
          color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.03em',
        }}>
          {pace.average}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>
          minutes a day
        </span>
      </div>
      <div style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.4, marginBottom: 14 }}>
        {name ? `${name} so far this week` : 'So far this week'}, against a healthy guide of {pace.dailyGuide} a day for their age
      </div>

      {/* Tomorrow, which is the only part anyone can act on. */}
      {pace.suggestTomorrow !== null && (
        <div style={{
          background: '#fff', borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Aim for tomorrow
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, color: 'var(--ink)', lineHeight: 1.1 }}>
              {pace.suggestTomorrow} min
            </div>
          </div>
          <p style={{ flex: 1, minWidth: 0, fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
            {pace.remaining > 0
              ? `${pace.remaining} minutes left in the week, spread across the ${pace.daysLeft} ${pace.daysLeft === 1 ? 'day' : 'days'} to go.`
              : 'The week is already at its guide, so the days left want to be quiet ones.'}
          </p>
        </div>
      )}

      <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5, margin: '14px 0 0', fontWeight: 600 }}>
        {pace.line}
      </p>

      {/* Said plainly once, because a number with a limit next to it reads as a
          rule, and this is not one. */}
      <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '10px 0 0' }}>
        This is a budget, not a rule. A heavy Saturday does not break anything, it just makes the next few days a little lighter.
      </p>
    </div>
  )
}
