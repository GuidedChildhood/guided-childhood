import type { CSSProperties } from 'react'

// One disciplined card grammar for the script pages. Every box is the same
// white card with the same ink edge and the same hard ink ledge, so the page
// reads as one bold system instead of a pile of competing styles. Fewer,
// better boxes.
//
// THE FINISH. Justin, 2 September 2026, with the child's Printed! screen in
// his hand: "make sure the scripts and cards on parent screen have this
// finish you did on kids app, looks super good, but use our chosen colours.
// Looks great how it fills the screen." The child's print page is a 2.5px
// ink edge, a hard ink ledge under everything, Nunito 900 set big, and a full
// width colour band for a state. That finish is now this file, in the
// parent's own tokens: butter for the thing to tap, ink for every edge and
// ledge, retro green for a state that has landed, the stage pastels for the
// accent. The parent keeps its calmer register (no smiley dots, no stickers);
// the energy comes from the edges, the ledges and the type.

/** The one edge. Every card, chip and button wears it. */
export const INK_EDGE = '2px solid var(--ink)'

export const card: CSSProperties = {
  background: 'var(--white, #FFFFFF)',
  border: INK_EDGE,
  borderRadius: 20,
  boxShadow: '0 4px 0 var(--ink)',
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
  width: 30,
  height: 30,
  borderRadius: '50%',
  flexShrink: 0,
  background: 'var(--terracotta)',
  color: 'var(--ink)',
  border: INK_EDGE,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-display)',
  fontWeight: 900,
  fontSize: 15,
}

// ── The script sheet ──────────────────────────────────────────────────────
//
// A script used to arrive as four separate white boxes stacked up, and four
// boxes read as four things to get through. It is one thing: the words for one
// moment. So it is one sheet, and the steps are numbered blocks inside it
// divided by a dotted rule, the way a good worksheet is laid out.
//
// The band across the top is butter with an ink edge under it, the shape of
// the child's print bar. The stage colour lives in the numbered circles only,
// an accent rather than a theme, so a parent who moves from a Foundation
// script to a Shaper one is still holding the same familiar sheet.

export const sheet: CSSProperties = {
  background: '#fff',
  border: '2.5px solid var(--ink)',
  borderRadius: 22,
  boxShadow: '0 5px 0 var(--ink)',
  overflow: 'hidden',
}

export const sheetBand: CSSProperties = {
  background: 'var(--terracotta)',
  padding: '16px 20px',
  borderBottom: '2.5px solid var(--ink)',
}

// What divides one step from the next. Never a hard line: a script is one
// continuous thing being read down, not a table of separate rows.
export const dottedRule: CSSProperties = {
  height: 0,
  borderTop: '2.5px dotted rgba(26,26,46,0.28)',
  margin: '22px 0',
}

// One body size for every supporting step, so nothing on the sheet looks more
// or less important than the step beside it. Only the words to say are bigger,
// because they are the only thing on the page a parent is going to say out loud.
// Set big enough to fill a phone screen the way the child's pages do.
export const sheetBody: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(20px, 5vw, 22px)',
  fontWeight: 500,
  lineHeight: 1.5,
  color: 'var(--ink)',
  margin: 0,
}

// ── The bold pieces every script surface shares ─────────────────────────

/**
 * A full width colour band for a state, the child's Printed! bar: green for
 * something that has landed (read, used), butter for the thing in front of
 * you, ink for a quiet dark note. White words on green and ink, ink on butter.
 */
export function band(tone: 'green' | 'butter' | 'ink'): CSSProperties {
  const fill = tone === 'green' ? 'var(--retro-green)' : tone === 'butter' ? 'var(--terracotta)' : 'var(--deep-teal)'
  return {
    background: fill,
    color: tone === 'butter' ? 'var(--ink)' : '#fff',
    border: '2.5px solid var(--ink)',
    borderRadius: 20,
    padding: '16px 18px',
    boxShadow: '0 5px 0 var(--ink)',
  }
}

/**
 * The button. Butter for the one thing to do, white for the second thing,
 * green for done. Ink edge, ink ledge, Nunito 900, the child's button exactly.
 */
export function chunky(tone: 'butter' | 'white' | 'green' | 'quiet' = 'butter', size: 'md' | 'lg' = 'md'): CSSProperties {
  const fill = tone === 'butter' ? 'var(--terracotta)' : tone === 'green' ? 'var(--retro-green)' : tone === 'white' ? '#fff' : 'transparent'
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: size === 'lg' ? '15px 20px' : '12px 18px',
    borderRadius: 16,
    background: fill,
    color: tone === 'green' ? '#fff' : 'var(--ink)',
    border: tone === 'quiet' ? '2px solid rgba(26,26,46,0.25)' : INK_EDGE,
    boxShadow: tone === 'quiet' ? 'none' : '0 4px 0 var(--ink)',
    fontFamily: 'var(--font-display)', fontWeight: 900,
    fontSize: size === 'lg' ? 'var(--text-md)' : 'var(--text-base)',
    lineHeight: 1.15, textDecoration: 'none', cursor: 'pointer',
    boxSizing: 'border-box',
  }
}

/** The chip: a pill with an ink edge, butter and a ledge when it is the one that is on. */
export function pill(on: boolean): CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 15px', borderRadius: 100, whiteSpace: 'nowrap',
    background: on ? 'var(--terracotta)' : '#fff',
    color: 'var(--ink)',
    border: INK_EDGE,
    boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
    textDecoration: 'none',
  }
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
    background: accent.fill,
    color: accent.ink,
  }
}
