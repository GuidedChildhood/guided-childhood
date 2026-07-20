import type { CSSProperties } from 'react'

// One disciplined card grammar for the script detail page. Every box is the
// same white 20px radius card with the same 1.5px border and the same shallow
// ledge shadow, so the page reads as one calm system instead of a pile of
// competing styles. Fewer, better boxes.

export const card: CSSProperties = {
  background: 'var(--white, #FFFFFF)',
  border: '1.5px solid var(--border)',
  borderRadius: 20,
  boxShadow: '0 4px 0 rgba(26,26,46,0.05)',
}

// One internal padding for every card on the page.
export const cardPad = 'clamp(20px, 5vw, 24px)'

// The mono eyebrow every section label wears, always the same size.
export const eyebrow: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

// The numbered step circle, one size and one butter fill everywhere so the
// six steps read as one sequence down the page.
export const stepCircle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  flexShrink: 0,
  background: 'var(--terracotta)',
  color: '#3A2C0C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 14,
}
