// The Happy News marks, for paper. The same drawings as the app's
// components/kid/HappyNewsBits.tsx (same geometry, same strokes), written as
// SVG strings because the print engine has no React. The colours are the boho
// theme's: the house rainbow warmed into clay, mustard, sage, rose and sky.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PUB } from '../engine/library'

export const BOHO = {
  ink: '#2E2818', clay: '#C8694A', mustard: '#E9B44C', sage: '#A9BA94', rose: '#EFC3B5', sky: '#9FC2C7',
  dusk: '#3B2C40', sand: '#F7EEE1', linen: '#FFFBF4', clayInk: '#8F4128',
} as const

/** The painted masthead rainbow: thick square ended bands. */
export function rainbow(width = 200, bands: string[] = [BOHO.clay, BOHO.mustard, BOHO.sage, BOHO.sky, BOHO.rose]) {
  const step = 13, stroke = 13
  return `<svg viewBox="0 0 200 100" width="${width}" height="${width / 2}" aria-hidden="true" style="display:block">${bands.map((c, i) =>
    `<path d="M ${step + i * step} 100 A ${100 - step - i * step} ${100 - step - i * step} 0 0 1 ${200 - step - i * step} 100" fill="none" stroke="${c}" stroke-width="${stroke}" stroke-linecap="butt"/>`).join('')}</svg>`
}

/** A twelve point burst with a word on it. */
export function burst(text: string, size = '24mm', color: string = BOHO.mustard, rotate = 10) {
  const pts: string[] = []
  for (let i = 0; i < 24; i++) {
    const r = i % 2 === 0 ? 50 : 40, a = (Math.PI * 2 * i) / 24 - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return `<span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:${size};height:${size};transform:rotate(${rotate}deg)"><svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><polygon points="${pts.join(' ')}" fill="${color}" stroke="${BOHO.ink}" stroke-width="2.5" stroke-linejoin="round"/></svg><span style="position:relative;font:900 calc(${size} * 0.26)/1 var(--font-letter);font-variation-settings:'SOFT' 100,'WONK' 1;color:${BOHO.ink};text-align:center">${text}</span></span>`
}

export const smiley = (size = '5mm', color: string = BOHO.mustard) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><circle cx="12" cy="12" r="11" fill="${color}"/><circle cx="8.6" cy="10" r="1.6" fill="${BOHO.ink}"/><circle cx="15.4" cy="10" r="1.6" fill="${BOHO.ink}"/><path d="M7.5 14.2 Q12 18.6 16.5 14.2" fill="none" stroke="${BOHO.ink}" stroke-width="1.9" stroke-linecap="round"/></svg>`

export const star = (size = '5mm', color: string = BOHO.mustard) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" fill="${color}" stroke="${BOHO.ink}" stroke-width="1.6" stroke-linejoin="round"/></svg>`

export const wavy = (color: string = BOHO.ink) =>
  `<svg class="wavy" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`

// Our own drawings, recoloured into the boho palette: the ink warms to
// espresso, the night to dusk, the sage and blue to their earthy cousins.
// One map, used for the art and for our icons alike.
const SWAP: [RegExp, string][] = [
  [/#14142A/gi, '#2A1F2E'], [/#2C2E4E/gi, '#5A3F55'], [/fill="#1A1A2E"/gi, 'fill="#3B2C40"'], [/#1A1A2E/gi, '#2E2818'],
  [/#C9DBD2/gi, '#C3D0B4'], [/#8FB3A2/gi, '#9DB08A'], [/#6F9A86/gi, '#7E9670'], [/#E8F0EE/gi, '#EEF1E6'],
  [/#3E86BC/gi, '#7FA7A6'], [/#EDC35F/gi, '#E9B44C'], [/#8A8FA3/gi, '#B39C86'], [/#D7DAE2/gi, '#E8DCCB'],
]
export const bohoSwap = (svg: string) => SWAP.reduce((s, [re, to]) => s.replace(re, to), svg)

// The app's own drawn icons, rendered from HappyIcon.tsx
// (library/export-happy-icons.mjs). Our icon names map onto theirs where the
// app draws the same idea; anything unmapped keeps the newspaper's own icon.
let HAPPY_ICONS: Record<string, string> | null = null
export function happyIcons(): Record<string, string> {
  if (!HAPPY_ICONS) HAPPY_ICONS = JSON.parse(readFileSync(join(PUB, 'library', 'happy-icons.json'), 'utf8')).icons
  return HAPPY_ICONS as Record<string, string>
}
export const HAPPY_FOR: Record<string, string> = {
  create: 'make', learn: 'read', connect: 'friends', watch: 'tv', game: 'games', leaf: 'sprout',
  heart: 'heart', search: 'magnifier', clock: 'time', share: 'tell', animal: 'paw', ball: 'ball',
  paint: 'paint', music: 'music', star: 'star', pencil: 'homework', thumb: 'cheer',
  make: 'make', tree: 'tree', magnifier: 'magnifier', compass: 'compass', calendar: 'calendar', sun: 'sun', tv: 'tv', cheer: 'cheer', read: 'read', eye: 'eye', friends: 'friends', time: 'time',
  scratch: 'games', 
}

// ── THE HAPPY NEWS SYSTEM (theme "happy") ───────────────────────────────────
// Justin, 15 October 2026: The Guided Planet and The Planet Post read as one
// family, so the paper wears the same Guided Childhood Happy News design system
// (shared/happy-news.ts, the Claude Design system the Planet Post is built
// from): white stock, ink edges, crayon fills, Nunito 900. Stated here once
// for the print engine, which cannot import the app's TypeScript paths.
export const HN = {
  ink: '#1A1A2E', inkSoft: '#52526A', butter: '#EDC35F', butterLt: '#FEF7E0',
  coral: '#E5734B', green: '#2E7D5A', sky: '#4B9CE5', pink: '#F9CFD9',
} as const
export const CRAYON = {
  butter: '#F4D072', sky: '#8EC3F0', coral: '#F2957A', green: '#93CFA8', pink: '#F2A0C4', teal: '#7FCFC6',
} as const

/** The masthead rainbow in the house colours, the band order the Planet Post paints. */
export const happyRainbow = (width = 200) => rainbow(width, [HN.coral, HN.butter, HN.green, HN.sky, HN.pink])

// Our own drawings, moved onto crayon: the sage greens become crayon green and
// the house green, the butter becomes crayon butter, the cream and pale tints
// become paper. The night skies and the ink stay, so a drawing still reads as
// ours, now coloured the way the Planet Post's are.
const HAPPY_SWAP: [RegExp, string][] = [
  [/#C9DBD2/gi, CRAYON.green], [/#8FB3A2/gi, HN.green], [/#6F9A86/gi, HN.green], [/#E8F0EE/gi, HN.butterLt],
  [/#3E86BC/gi, HN.sky], [/#EDC35F/gi, CRAYON.butter], [/#8A8FA3/gi, CRAYON.sky], [/#FFF6DE/gi, HN.butterLt],
  [/#F9F8F6/gi, '#FFFFFF'],
]
export const happySwap = (svg: string) => HAPPY_SWAP.reduce((s, [re, to]) => s.replace(re, to), svg)
