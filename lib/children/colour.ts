// ── ONE CHILD, ONE COLOUR, EVERYWHERE ───────────────────────────────────────
//
// Justin, 18 August 2026: "make kids' name buttons a colour of the stage for
// each child, with clear text of the name" and "coloured names that stick
// through the platform."
//
// The point is the STICKING. A colour that means Olgie on the switcher and
// nothing on the setup page is decoration; a colour that means Olgie wherever
// her name appears is a second way of reading, and a parent moving fast reads
// it before they read the letters. So the mapping lives here, once, and every
// surface that draws a child's name asks this rather than picking a colour.
//
// The pairs come from shared/tokens.css and follow the rule in
// DESIGN_SYSTEM.md: a bold band is a background, and the matching text token is
// the only colour ever set on top of one. That is what keeps a name readable at
// speed, which is the entire reason for colouring it.
//
// Colour is never the ONLY signal. Every caller keeps the name in words, and
// the switcher also weights the chosen pill heavier, so nothing here is load
// bearing for somebody who cannot separate two pastels.

export type ChildColour = {
  /** Card grounds and quiet washes. */
  tint: string
  /** Bands, discs and the active pill. Text goes on it only as `text`. */
  bold: string
  /** The only colour ever set on top of `bold`. */
  text: string
}

const BY_STAGE: Record<number, ChildColour> = {
  1: { tint: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { tint: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { tint: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { tint: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { tint: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

// 9-11 is in here because the live database carries it alongside 8-10: an older
// band that never got migrated. Left mapped rather than cleaned up, because a
// child on it would otherwise silently fall to the default and change colour.
const BAND_STAGE: Record<string, number> = {
  '4-7': 1, '8-10': 2, '9-11': 2, '11-13': 3, '13-15': 4, '16+': 5,
}

/**
 * This child's colours, from their age band.
 *
 * Falls back to stage 3, the middle of the road, when the band is missing or
 * unknown. A child with no age band yet still gets a stable colour rather than
 * no colour, so the page does not change appearance the moment a birthday
 * is filled in.
 */
export function childColour(ageBand: string | null | undefined): ChildColour {
  return BY_STAGE[BAND_STAGE[ageBand ?? ''] ?? 3] ?? BY_STAGE[3]
}

/** The initial for a name disc. A question mark when there is no real name. */
export function childInitial(name: string | null | undefined): string {
  const n = (name ?? '').trim()
  return n && n !== 'Your child' ? n[0].toUpperCase() : '?'
}
