// The educator workspace design language, in one place, so every page
// speaks the same premium dialect: warm authority, layered soft shadows,
// mono eyebrows, chunky brand buttons. Import these, do not re invent them.

import type { CSSProperties } from 'react'

export const eyebrow: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// The premium surface: white on cream, generous radius, a tight highlight
// over a wide soft teal drop. This is what reads as expensive.
export const panel: CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: '24px',
  padding: 'clamp(18px, 2.5vw, 26px)',
  boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
}

// A soft inner row inside a panel (list items, sub cards).
export const innerRow: CSSProperties = {
  background: 'var(--warm)', border: '1px solid var(--border)',
  borderRadius: '16px', padding: '14px 16px',
}

export const input: CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
  fontSize: '15px', background: '#fff', color: 'var(--ink)',
}

export const label: CSSProperties = {
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', color: 'var(--ink)',
}

export const btnGold: CSSProperties = {
  display: 'inline-block', padding: '12px 22px', borderRadius: '16px',
  background: 'var(--gold)', color: 'var(--ink)', border: 'none',
  boxShadow: '0 5px 0 var(--gold-hover, #E3B53A)', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
}

export const btnGreen: CSSProperties = {
  display: 'inline-block', padding: '12px 22px', borderRadius: '16px',
  background: 'var(--green-lt)', color: 'var(--green-dark)',
  border: '2px solid var(--green-dark)', boxShadow: '0 5px 0 var(--green-dark)',
  cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
}

export const btnQuiet: CSSProperties = {
  display: 'inline-block', padding: '10px 16px', borderRadius: '12px',
  background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
  cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
}

// The section heading pattern: a green mono eyebrow above the block.
export const sectionEyebrow: CSSProperties = {
  ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px',
}

export const h1: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900,
  fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: 'var(--ink)',
  letterSpacing: '-0.02em', lineHeight: 1.12,
}
