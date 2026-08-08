import Link from 'next/link'
import type { Catchup } from '@/lib/pathway/catchup'

// THE FIRST THING A RETURNING PARENT SEES.
//
// Justin, 8 August 2026, on the app going stale: "how we keep them coming back
// to feel they are getting real use, feedback, enjoyment, seeing their child
// progress."
//
// So this sits above the day's pathway, and only for someone who has been away.
// The order is the whole argument: what your child DID, then what is waiting for
// you, then the day's tasks. A parent who has not looked since Friday should be
// met by their child's week before they are handed another list.
//
// It is not a dashboard. Four lines at most, plain sentences, no chart, no
// score, no streak, and never a word about how long they have been gone. A
// product about screen time that guilts people into opening it more has lost the
// argument before it starts.
//
// And it disappears. Nothing happened means no card, and a parent who is here
// every day never sees it at all, which is the point: it is news, and news you
// have already read is clutter.

export default function CatchupCard({ catchup, childName }: {
  catchup: Catchup
  childName?: string | null
}) {
  const { days, lines, waiting } = catchup

  // "since Friday" reads better than "in 3 days" for a short gap, and worse for
  // a long one, where the day count is the useful fact.
  const when = days <= 6
    ? `since ${new Date(catchup.since).toLocaleDateString('en-GB', { weekday: 'long' })}`
    : `in the last ${days} days`

  return (
    <section
      aria-label="What happened while you were away"
      style={{
        background: 'var(--cream)', border: '1.5px solid var(--border)',
        borderRadius: 20, padding: '18px 17px', marginBottom: 16,
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
      }}>
        While you were away
      </span>

      {lines.length > 0 && (
        <>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'var(--text-xl)', color: 'var(--ink)',
            lineHeight: 1.15, letterSpacing: '-0.02em', margin: '5px 0 12px',
          }}>
            Here is what {childName ?? 'your child'} got up to {when}
          </h2>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lines.map(l => (
              <li key={l.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span aria-hidden style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2, flexShrink: 0 }}>{l.emoji}</span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 700,
                  color: 'var(--ink)', lineHeight: 1.4,
                }}>
                  {l.text}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Waiting sits UNDER the news and behind a rule, never blended into it.
          A request dressed as good news is how a warm card becomes another
          demand, and the demand is the thing that made the page tiring. */}
      {waiting.length > 0 && (
        <div style={{
          marginTop: lines.length > 0 ? 14 : 8,
          paddingTop: lines.length > 0 ? 12 : 0,
          borderTop: lines.length > 0 ? '1.5px solid var(--border)' : 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
          }}>
            Waiting for you
          </span>
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {waiting.map(l => (
              <li key={l.key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span aria-hidden style={{ fontSize: 'var(--text-md)', lineHeight: 1.3, flexShrink: 0 }}>{l.emoji}</span>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                  {l.text}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/quests"
            style={{
              display: 'inline-block', marginTop: 11,
              background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
              borderRadius: 13, padding: '10px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}
          >
            Take a look
          </Link>
        </div>
      )}
    </section>
  )
}
