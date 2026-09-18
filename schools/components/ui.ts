// The educator workspace design language, in one place, so every page
// speaks the same premium dialect: warm authority, layered soft shadows,
// mono eyebrows, chunky brand buttons. Import these, do not re invent them.
//
// 18 September 2026: this file said "do not re invent them" and then invented
// twelve of its own sizes, because it is a .ts and the two sweeps that put the
// schools app on the type, space and shape scales both globbed .tsx. The one
// file whose whole job is to stop other files improvising was the last one
// still improvising. It reads from the scales now.

import type { CSSProperties } from 'react'

export const eyebrow: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// The premium surface: white on cream, generous radius, a tight highlight
// over a wide soft teal drop. This is what reads as expensive.
export const panel: CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
  padding: 'clamp(18px, 2.5vw, 26px)',
  boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
}

// A soft inner row inside a panel (list items, sub cards).
export const innerRow: CSSProperties = {
  background: 'var(--warm)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-btn)', padding: 'var(--space-3) var(--space-4)',
}

export const input: CSSProperties = {
  width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-tile)',
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-md)', background: '#fff', color: 'var(--ink)',
}

export const label: CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
}

export const btnGold: CSSProperties = {
  display: 'inline-block', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-btn)',
  background: 'var(--gold)', color: 'var(--ink)', border: 'none',
  boxShadow: '0 5px 0 var(--gold-hover, #E3B53A)', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
}

export const btnGreen: CSSProperties = {
  display: 'inline-block', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-btn)',
  background: 'var(--green-lt)', color: 'var(--green-dark)',
  border: '2px solid var(--green-dark)', boxShadow: '0 5px 0 var(--green-dark)',
  cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
}

export const btnQuiet: CSSProperties = {
  display: 'inline-block', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-tile)',
  background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
  cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
}

// The section heading pattern: a green mono eyebrow above the block.
export const sectionEyebrow: CSSProperties = {
  ...eyebrow, color: 'var(--green-dark)', marginBottom: 'var(--space-3)',
}

export const h1: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900,
  fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: 'var(--ink)',
  letterSpacing: '-0.02em', lineHeight: 1.12,
}
