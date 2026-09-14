import type { ReactNode } from 'react'
import { HAPPY, RainbowArc, StarShape } from '@/components/kid/HappyNewsBits'

// The masthead on the child's week page.
//
// Justin, 14 September 2026, two reference screenshots from The Happy
// Newspaper site. The second is the paper's own front: a painted rainbow
// rising over a pale yellow ground, the paper lying on it at a tilt, and the
// paper's name lettered over a big sun yellow disc. That is the masthead
// shape, and it is what the top of Jonny's week is now: a pale butter card,
// the rainbow painted across the top, a white sheet lying on it at a slight
// tilt with the name over a butter sun disc, and the child's own Planet
// Friend on the right on a white plate. The words are on the white sheet,
// never on the rainbow, which is what keeps them readable at any width.
// The lettering is Nunito 900, ours; the rainbow is our five bands, drawn in
// the kit, never the artwork.
//
// Shared by the real page and the fixture so the two cannot drift.

export default function KidWeekMasthead({ title, sub, friend, kicker, corner }: {
  title: string
  sub: string
  friend: { name: string; img: string }
  /** A small mono line above the title on the sheet: the greeting on the home. */
  kicker?: string
  /** Something to sit in the top right corner over the rainbow: the home's sound switch. */
  corner?: ReactNode
}) {
  return (
    <div data-week-masthead style={{
      position: 'relative', overflow: 'hidden',
      background: HAPPY.butterLt, border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)',
      boxShadow: `0 5px 0 ${HAPPY.ink}`, padding: '52px 14px 14px', marginBottom: 16,
    }}>
      {/* The rainbow, painted across the top and cropped by the card, the way
          the paper's photo crops it. */}
      <RainbowArc painted width={360} style={{ position: 'absolute', left: '-6%', top: -12, width: '112%', height: 'auto' }} />
      {corner
        ? <span style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>{corner}</span>
        : <span aria-hidden style={{ position: 'absolute', right: 12, top: 10 }}><StarShape size={14} color={HAPPY.coral} /></span>}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* The sheet: white, ink edged, a touch of tilt, the name over the sun. */}
        <div data-week-sheet style={{
          position: 'relative', flex: 1, minWidth: 0, background: '#fff', border: `2px solid ${HAPPY.ink}`,
          borderRadius: 10, boxShadow: `3px 4px 0 ${HAPPY.ink}`, padding: '14px 14px 13px 16px',
          transform: 'rotate(-1.5deg)', overflow: 'hidden',
        }}>
          <span aria-hidden style={{ position: 'absolute', left: -14, top: -16, width: 74, height: 74, borderRadius: '50%', background: HAPPY.butter }} />
          {kicker && (
            <p data-masthead-kicker style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 3px' }}>
              {kicker}
            </p>
          )}
          <h1 style={{
            position: 'relative', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.55rem, 6.4vw, 2rem)',
            letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, color: HAPPY.ink,
          }}>
            {title}
          </h1>
          <p style={{ position: 'relative', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: '7px 0 0' }}>
            {sub}
          </p>
        </div>
        <span style={{ position: 'relative', width: 78, height: 78, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', border: `2px solid ${HAPPY.ink}`, boxShadow: `0 3px 0 ${HAPPY.ink}` }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={friend.img} alt={friend.name} width={60} height={60} style={{ position: 'relative', width: 60, height: 60, objectFit: 'contain', display: 'block' }} />
        </span>
      </div>
    </div>
  )
}
