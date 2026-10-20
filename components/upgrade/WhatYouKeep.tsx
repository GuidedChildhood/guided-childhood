import { keepsHeading, keepsItems, type WhatYouKeep as Keep } from '@/lib/paywall/what-you-keep'

// What this family keeps, in its own rows, at the moment it is asked to pay.
// The data and the rules for every line are in lib/paywall/what-you-keep.ts.
//
// Presentational and propped, like TwoDoors, so /ref-choose and
// /ref-upgrade-block can draw a full family and an empty one with no database.
//
// THE EMPTY STATE IS HONEST. A family that has done nothing yet is told that,
// with the one next step, rather than shown a list of zeros or a list of
// things they have not got. Pass fallback null to draw nothing at all.

export default function WhatYouKeep({
  keep,
  fallback,
}: {
  keep: Keep
  /** What to say when there is nothing of theirs to name yet. */
  fallback: string | null
}) {
  const items = keepsItems(keep)
  if (!items.length && !fallback) return null

  return (
    <div style={{
      background: 'var(--tint-sage)', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-card)', padding: '16px 18px', marginBottom: '22px',
    }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em', margin: '0 0 8px',
      }}>
        {keepsHeading(keep)}
      </p>
      {items.length ? (
        <>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '6px' }}>
            {items.map(item => (
              <li key={item} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ color: 'var(--retro-green-dark)', fontWeight: 800, lineHeight: 1.45, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45 }}>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>
            All of it is saved, and it carries straight on when you join.
          </p>
        </>
      ) : (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
          {fallback}
        </p>
      )}
    </div>
  )
}
