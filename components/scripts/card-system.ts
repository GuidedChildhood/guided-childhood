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
  fontSize: 12.5,
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
  fontSize: 16,
}

// ── The script sheet ──────────────────────────────────────────────────────
//
// A script used to arrive as four separate white boxes stacked up, and four
// boxes read as four things to get through. It is one thing: the words for one
// moment. So it is now one sheet, and the steps are numbered blocks inside it
// divided by a dotted rule, the way a good worksheet is laid out.
//
// The sheet is butter. Every script, every stage. The stage colour lives in the
// numbered circles and the band tint only, an accent rather than a theme, so a
// parent who moves from a Foundation script to a Shaper one is still holding
// the same familiar sheet rather than being handed a different product.

export const sheet: CSSProperties = {
  background: '#fff',
  border: '1.5px solid rgba(201,154,40,0.32)',
  borderRadius: 22,
  boxShadow: '0 4px 0 rgba(201,154,40,0.16)',
  overflow: 'hidden',
}

// The band across the top, with the convex arc the daily deck cards use, so
// the two surfaces read as the same family.
export const sheetBand: CSSProperties = {
  background: 'var(--terracotta)',
  padding: '14px 20px 20px',
  borderRadius: '0 0 50% 50% / 0 0 30px 30px',
}

// What divides one step from the next. Never a hard line: a script is one
// continuous thing being read down, not a table of separate rows.
export const dottedRule: CSSProperties = {
  height: 0,
  borderTop: '2px dotted rgba(201,154,40,0.34)',
  margin: '20px 0',
}

// One body size for every supporting step, so nothing on the sheet looks more
// or less important than the step beside it. Only the words to say are bigger,
// because they are the only thing on the page a parent is going to say out loud.
export const sheetBody: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(19px, 4.6vw, 21px)',
  lineHeight: 1.6,
  color: 'var(--ink)',
  margin: 0,
}

export type StageAccent = { fill: string; ink: string; tint: string }

const STAGE_ACCENTS: Record<string, StageAccent> = {
  foundation:  { fill: 'var(--stage-1-bold)', ink: 'var(--stage-1-text)', tint: 'var(--stage-1)' },
  builder:     { fill: 'var(--stage-2-bold)', ink: 'var(--stage-2-text)', tint: 'var(--stage-2)' },
  explorer:    { fill: 'var(--stage-3-bold)', ink: 'var(--stage-3-text)', tint: 'var(--stage-3)' },
  shaper:      { fill: 'var(--stage-4-bold)', ink: 'var(--stage-4-text)', tint: 'var(--stage-4)' },
  independent: { fill: 'var(--stage-5-bold)', ink: 'var(--stage-5-text)', tint: 'var(--stage-5)' },
}

export function stageAccent(stageId: string): StageAccent {
  return STAGE_ACCENTS[stageId] ?? STAGE_ACCENTS.foundation
}

// The numbered circle in its stage colour, the one place the stage shows.
export function stageCircle(accent: StageAccent): CSSProperties {
  return {
    ...stepCircle,
    width: 30,
    height: 30,
    fontSize: 17,
    background: accent.fill,
    color: accent.ink,
    border: '1.5px solid rgba(26,26,46,0.10)',
  }
}
