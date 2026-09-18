import Link from 'next/link'

// THE CAP HAS TO READ AS "WE ARE ON IT", NOT AS "WE DROPPED THE REST".
//
// Justin, 18 September 2026: "so how do we deal with more than 3 so users know
// we are on it?"
//
// The real check in page needs a session, so this is the two blocks that answer
// him, lifted verbatim, at the numbers that make them hardest: one child called
// Timbotee with seven worries, three asked today and four waiting. Both the
// waiting case and the genuinely finished case are on the page together, which
// is the only way to see that the second does not read as a demotion of the
// first.
function Card({ waiting, childName }: { waiting: number; childName: string | null }) {
  const rows = 3
  return (
    <div style={{ background: 'var(--cream)', padding: '20px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
          Today · first thing
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 6px' }}>
          {childName ? `How is it going with ${childName}?` : 'How is it going?'}
        </h1>

        {waiting > 0 && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            {rows} today. The other {waiting === 1 ? 'one' : waiting} we are tracking for{' '}
            {childName ?? 'them'} {waiting === 1 ? 'comes' : 'come'} round over the next few days, longest
            unasked first, so nothing gets dropped.
          </p>
        )}

        <div style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '26px 22px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 6px' }}>
            {waiting > 0 ? "That is today's check in done" : 'All done for today'}
          </p>
          {waiting > 0 && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
              {waiting} more {waiting === 1 ? 'is' : 'are'} on {childName ?? 'their'}
              {childName ? "'s" : ''} tracker. We are still on {waiting === 1 ? 'it' : 'those'} and will ask
              over the next few days, longest unasked first, so nothing gets dropped.
            </p>
          )}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
            {waiting > 0 ? '' : 'Nothing is waiting on you. '}Did anything else happen today? Add it and it
            goes on the tracker with the rest, and the next check in will ask how that one is going too.
          </p>
          <p style={{ margin: '0 0 18px' }}>
            <Link href="/dashboard/daily" style={{ display: 'inline-flex', padding: '12px 20px', background: '#fff', color: 'var(--ink)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>
              Add something that happened
            </Link>
          </p>
          <Link href="/dashboard" style={{ display: 'inline-flex', padding: '12px 20px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 'var(--radius-tile)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
              Back to today
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RefCheckInWaiting() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', paddingBottom: 40 }}>
      <p className="eyebrow" style={{ padding: '18px 20px 0', margin: 0 }}>Four waiting their turn</p>
      <Card waiting={4} childName="Timbotee" />
      <p className="eyebrow" style={{ padding: '18px 20px 0', margin: 0 }}>One waiting, the singular</p>
      <Card waiting={1} childName="Timbotee" />
      <p className="eyebrow" style={{ padding: '18px 20px 0', margin: 0 }}>Nothing waiting, genuinely finished</p>
      <Card waiting={0} childName="Timbotee" />
      <p className="eyebrow" style={{ padding: '18px 20px 0', margin: 0 }}>No name for the child</p>
      <Card waiting={4} childName={null} />
    </div>
  )
}
