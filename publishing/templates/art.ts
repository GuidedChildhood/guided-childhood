// THE GUIDED PLANET'S OWN DRAWINGS.
//
// Every art slot in an issue has a vector default drawn here, so an edition is
// complete and printable before a single image is generated, and a Higgsfield
// job that fails or is rejected can never hold a page back. Generated
// environments, once Justin approves them, replace a default by dropping a file
// into issues/<NNN>/assets/approved/<slot>.png (templates/index.ts decides).
//
// THE ILLUSTRATION RULES (publishing/design/DESIGN-SYSTEM.md section 6), which
// every function below keeps:
//   1. Ink line, round caps, one weight per drawing (1.6 to 2.2 units).
//   2. Flat fills from the palette only. The one gradient allowed is the night.
//   3. One gold detail per drawing, the gold pathway, never more.
//   4. No faces of real children, no screens with invented interfaces, no
//      words inside a picture except a map's place labels.
//   5. Characters are never drawn here. They are the approved cutouts, placed
//      by the templates on top of the art.
//
// Stars and scatter use a seeded generator, so the same issue prints the same
// sky every time and a visual regression test can compare pages pixel for pixel.

import { bohoSwap, HAPPY_FOR, happyIcons } from './happy'

const INK = '#1A1A2E'
const CREAM = '#F9F8F6'
const BUTTER = '#EDC35F'
const GOLD = '#C99A28'
const SAGE = '#C9DBD2'
const SAGE_DEEP = '#8FB3A2'
const SAGE_PALE = '#E8F0EE'
const BLUE = '#8A8FA3'
const ESPRESSO = '#2E2818'
const PAPER = '#FFFFFF'
const TINT = '#FFF6DE'

export function seeded(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

const stars = (n: number, w: number, h: number, seed: number, opts: { maxR?: number; colour?: string; avoid?: (x: number, y: number) => boolean } = {}) => {
  const r = seeded(seed)
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, size = r()
    if (opts.avoid?.(x, y)) continue
    const rad = 0.35 + size * (opts.maxR ?? 1.4)
    const op = (0.35 + r() * 0.65).toFixed(2)
    if (size > 0.93) {
      // a four point twinkle for the brightest few
      const k = rad * 3.2
      out += `<path d="M${x} ${y - k}Q${x} ${y} ${x + k} ${y}Q${x} ${y} ${x} ${y + k}Q${x} ${y} ${x - k} ${y}Q${x} ${y} ${x} ${y - k}Z" fill="${opts.colour ?? BUTTER}" opacity="${op}"/>`
    } else {
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}" fill="${opts.colour ?? CREAM}" opacity="${op}"/>`
    }
  }
  return out
}

// The International Space Station, as a simplified silhouette: the long truss,
// four pairs of solar wings, the modules at the middle. Drawn centred on 0,0
// at roughly 200 units wide. An illustration, never a technical drawing.
export function iss(scale = 1, rotate = -8, fill = CREAM, wing = BUTTER) {
  const wingPair = (x: number) => `
    <g transform="translate(${x} 0)">
      <rect x="-9" y="-58" width="18" height="44" rx="1.5" fill="${wing}" stroke="${INK}" stroke-width="1.4"/>
      <rect x="-9" y="14" width="18" height="44" rx="1.5" fill="${wing}" stroke="${INK}" stroke-width="1.4"/>
      ${[-48, -38, -28, 24, 34, 44].map(y => `<line x1="-9" x2="9" y1="${y}" y2="${y}" stroke="${GOLD}" stroke-width="1"/>`).join('')}
      <line x1="0" x2="0" y1="-58" y2="58" stroke="${GOLD}" stroke-width="1"/>
      <rect x="-2" y="-14" width="4" height="28" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>
    </g>`
  return `<g transform="translate(0 0) rotate(${rotate}) scale(${scale})">
    <rect x="-104" y="-3.5" width="208" height="7" rx="2" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>
    ${[-86, -64, 64, 86].map(wingPair).join('')}
    <rect x="-24" y="-12" width="48" height="24" rx="6" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>
    <rect x="-8" y="-30" width="16" height="60" rx="6" fill="${fill}" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="5" fill="${BUTTER}" stroke="${INK}" stroke-width="1.2"/>
    <rect x="-40" y="16" width="12" height="18" rx="1.5" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
    <rect x="28" y="-34" width="12" height="18" rx="1.5" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
  </g>`
}

// The Guided Planet itself: a soft round world with gentle hills, the way it
// appears on every cover. `y` is where its top edge sits.
function planetHorizon(w: number, h: number, top: number) {
  const cx = w / 2, R = w * 1.15
  return `
    <defs>
      <clipPath id="ph-clip"><circle cx="${cx}" cy="${top + R}" r="${R}"/></clipPath>
    </defs>
    <circle cx="${cx}" cy="${top + R}" r="${R + 10}" fill="${BUTTER}" opacity=".18"/>
    <circle cx="${cx}" cy="${top + R}" r="${R + 4}" fill="${BUTTER}" opacity=".28"/>
    <g clip-path="url(#ph-clip)">
      <rect x="0" y="${top}" width="${w}" height="${h - top}" fill="${SAGE}"/>
      <path d="M0 ${top + 70} C ${w * .22} ${top + 30}, ${w * .42} ${top + 92}, ${w * .62} ${top + 60} S ${w * .92} ${top + 40}, ${w} ${top + 74} L ${w} ${h} L 0 ${h} Z" fill="${SAGE_DEEP}"/>
      <path d="M0 ${top + 128} C ${w * .3} ${top + 96}, ${w * .5} ${top + 150}, ${w * .76} ${top + 118} S ${w} ${top + 120}, ${w} ${top + 130} L ${w} ${h} L 0 ${h} Z" fill="#6F9A86"/>
      ${[0.12, 0.2, 0.33, 0.8, 0.9].map((f, i) => tree(w * f, top + 64 + (i % 2) * 18 + (f > .5 ? -6 : 8), 0.9 + (i % 3) * 0.18)).join('')}
    </g>
    <circle cx="${cx}" cy="${top + R}" r="${R}" fill="none" stroke="${INK}" stroke-width="2"/>`
}

function tree(x: number, y: number, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <line x1="0" y1="0" x2="0" y2="14" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="0" cy="-6" r="10" fill="${SAGE_PALE}" stroke="${INK}" stroke-width="1.6"/>
  </g>`
}

// ── COVER ───────────────────────────────────────────────────────────────────
// Night over the Guided Planet. The ISS crosses the upper sky, trailed by the
// one gold pathway, and the hill on the right is where Bloop stands looking up.
export function coverNight(w = 600, h = 860) {
  const issX = w * 0.3, issY = h * 0.43
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#14142A"/><stop offset=".55" stop-color="${INK}"/><stop offset="1" stop-color="#2C2E4E"/>
      </linearGradient>
      <radialGradient id="glow" cx=".3" cy=".43" r=".38">
        <stop offset="0" stop-color="${BUTTER}" stop-opacity=".22"/><stop offset="1" stop-color="${BUTTER}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#night)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${stars(260, w, h * 0.78, 7, { avoid: (x, y) => Math.hypot(x - issX, y - issY) < 70 })}
    <path d="M ${w * 0.02} ${h * 0.58} C ${w * 0.12} ${h * 0.5}, ${w * 0.2} ${h * 0.46}, ${issX - 40} ${issY + 10}" fill="none" stroke="${BUTTER}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
    <g transform="translate(${issX} ${issY})">${iss(0.62, -12)}</g>
    <circle cx="${w * 0.84}" cy="${h * 0.3}" r="22" fill="${TINT}" stroke="${INK}" stroke-width="2"/>
    <circle cx="${w * 0.84 + 8}" cy="${h * 0.3 - 5}" r="4" fill="${BUTTER}" opacity=".6"/>
    <circle cx="${w * 0.84 - 7}" cy="${h * 0.3 + 7}" r="2.6" fill="${BUTTER}" opacity=".6"/>
    ${planetHorizon(w, h, h * 0.72)}
  </svg>`
}

// ── PAGE 2, THE MAP OF THE GUIDED PLANET ───────────────────────────────────
export function worldMap(w = 400, h = 320) {
  const cx = w / 2, cy = h / 2 - 4, R = 104
  const place = (x: number, y: number, label: string, body: string) => `
    <g transform="translate(${x} ${y})">${body}
      <g transform="translate(0 30)">
        <rect x="${-label.length * 2.7 - 7}" y="-8" width="${label.length * 5.4 + 14}" height="16" rx="8" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
        <text x="0" y="3.6" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="8.4" letter-spacing=".6" fill="${INK}">${label}</text>
      </g>
    </g>`
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${INK}"/>
    ${stars(90, w, h, 21)}
    <circle cx="${cx}" cy="${cy}" r="${R + 9}" fill="${BUTTER}" opacity=".16"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="${SAGE}" stroke="${INK}" stroke-width="2"/>
    <path d="M ${cx - R + 8} ${cy - 20} C ${cx - 60} ${cy - 54}, ${cx - 10} ${cy - 10}, ${cx + 30} ${cy - 40} S ${cx + 90} ${cy - 30}, ${cx + R - 6} ${cy - 8}" fill="none" stroke="${SAGE_DEEP}" stroke-width="16" stroke-linecap="round" opacity=".7"/>
    <path d="M ${cx - R + 20} ${cy + 46} C ${cx - 40} ${cy + 20}, ${cx + 20} ${cy + 70}, ${cx + R - 24} ${cy + 40}" fill="none" stroke="${SAGE_DEEP}" stroke-width="14" stroke-linecap="round" opacity=".55"/>
    <path d="M ${cx - 70} ${cy - 46} C ${cx - 30} ${cy - 70}, ${cx + 40} ${cy - 66}, ${cx + 64} ${cy - 40} C ${cx + 86} ${cy - 12}, ${cx + 70} ${cy + 30}, ${cx + 40} ${cy + 56} C ${cx + 4} ${cy + 80}, ${cx - 60} ${cy + 70}, ${cx - 74} ${cy + 30}" fill="none" stroke="${BUTTER}" stroke-width="3.2" stroke-dasharray="1 8" stroke-linecap="round"/>
    ${place(cx - 70, cy - 64, 'OBSERVATORY', emblemBody('observatory', 1.25))}
    ${place(cx + 58, cy - 66, 'MAKER DISTRICT', emblemBody('maker', 1.25))}
    ${place(cx - 92, cy - 2, 'FAMILY EXPLORER', emblemBody('explorer', 1.25))}
    ${place(cx + 90, cy - 4, 'THINKING FOREST', emblemBody('forest', 1.25))}
    ${place(cx - 56, cy + 56, 'RESEARCH ROOM', emblemBody('research', 1.25))}
    ${place(cx + 54, cy + 56, 'CONNECTION GARDEN', emblemBody('garden', 1.25))}
  </svg>`
}

// ── THE SIX DESTINATION EMBLEMS ─────────────────────────────────────────────
// Each destination's mark, drawn on a 24 unit grid centred on 0,0. Used on the
// tag that heads every page and as the landmarks on the map.
function emblemBody(d: string, s = 1) {
  const g = (inner: string) => `<g transform="scale(${s})" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`
  switch (d) {
    case 'observatory': return g(`<path d="M-11 9 V1 A11 11 0 0 1 11 1 V9 Z" fill="${PAPER}"/><path d="M-1 -10 L9 -4" stroke-width="3.4"/><rect x="-14" y="9" width="28" height="4" rx="1" fill="${BUTTER}"/><circle cx="0" cy="1" r="2" fill="${BUTTER}"/>`)
    case 'maker': return g(`<rect x="-12" y="-2" width="24" height="14" rx="2" fill="${PAPER}"/><path d="M-12 -2 L-6 -9 L0 -2 L6 -9 L12 -2" fill="${BUTTER}"/><circle cx="0" cy="5" r="3.4" fill="${BUTTER}"/><circle cx="0" cy="5" r="1" fill="${INK}"/>`)
    case 'forest': return g(`<path d="M-6 12 V4 M6 12 V2" /><path d="M-6 -10 L-13 4 H1 Z" fill="${SAGE}"/><path d="M6 -12 L-1 2 H13 Z" fill="${SAGE_PALE}"/><circle cx="6" cy="-3" r="1.6" fill="${BUTTER}"/>`)
    case 'garden': return g(`<path d="M-6 12 C -6 4, 6 4, 6 -2 M6 12 C 6 6, -6 6, -6 -2"/><circle cx="-6" cy="-6" r="4.4" fill="${BUTTER}"/><circle cx="6" cy="-6" r="4.4" fill="${PAPER}"/><circle cx="-6" cy="-6" r="1.4" fill="${INK}"/><circle cx="6" cy="-6" r="1.4" fill="${INK}"/>`)
    case 'research': return g(`<path d="M-12 -8 H-1 V10 H-12 Z" fill="${PAPER}"/><path d="M-1 -8 H8 V2" fill="none"/><circle cx="6" cy="5" r="5" fill="${TINT}"/><path d="M10 9 L14 13" stroke-width="2.6"/><path d="M-9 -3 H-4 M-9 1 H-4 M-9 5 H-4"/>`)
    case 'explorer': return g(`<circle cx="0" cy="0" r="12" fill="${PAPER}"/><path d="M0 -8 L3 0 L0 8 L-3 0 Z" fill="${BUTTER}"/><circle cx="0" cy="0" r="1.4" fill="${INK}"/>`)
    default: return ''
  }
}
export const emblem = (d: string) => `<svg viewBox="-16 -16 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${emblemBody(d)}</svg>`

// ── PAGE 3, CODE IN ORBIT ───────────────────────────────────────────────────
// Earth's curve, the ISS on its dotted orbit, and an Astro Pi style computer
// with its 8 by 8 light grid showing a little pixel picture.
export function codeInOrbit(w = 420, h = 260) {
  const pic = [
    '..GGGG..', '.G....G.', 'G.Y..Y.G', 'G......G', 'G.Y..Y.G', 'G..YY..G', '.G....G.', '..GGGG..',
  ]
  const cell = 9.5
  const leds = pic.flatMap((row, y) => [...row].map((c, x) => {
    const col = c === 'G' ? '#7FC45A' : c === 'Y' ? BUTTER : '#2C2E4E'
    return `<rect x="${x * cell}" y="${y * cell}" width="${cell - 1.6}" height="${cell - 1.6}" rx="1.4" fill="${col}"/>`
  })).join('')
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${INK}"/>
    ${stars(120, w, h * 0.7, 33)}
    <ellipse cx="${w * 0.5}" cy="${h * 1.9}" rx="${w * 1.2}" ry="${h * 1.2}" fill="none" stroke="${BUTTER}" stroke-width="2.4" stroke-dasharray="1 7" stroke-linecap="round"/>
    <circle cx="${w * 0.5}" cy="${h * 2.15}" r="${h * 1.42}" fill="#3E86BC" stroke="${INK}" stroke-width="2"/>
    <path d="M ${w * 0.08} ${h * 0.86} C ${w * 0.2} ${h * 0.8}, ${w * 0.3} ${h * 0.9}, ${w * 0.42} ${h * 0.84} S ${w * 0.6} ${h * 0.82}, ${w * 0.7} ${h * 0.88}" fill="none" stroke="${SAGE}" stroke-width="18" stroke-linecap="round"/>
    <g transform="translate(${w * 0.3} ${h * 0.3})">${iss(0.5, 8)}</g>
    <g transform="translate(${w * 0.64} ${h * 0.18})">
      <rect x="-10" y="-10" width="${8 * cell + 20}" height="${8 * cell + 34}" rx="10" fill="#D7DAE2" stroke="${INK}" stroke-width="2"/>
      <rect x="-3" y="-3" width="${8 * cell + 6}" height="${8 * cell + 6}" rx="4" fill="#14142A"/>
      ${leds}
      <circle cx="${8 * cell - 4}" cy="${8 * cell + 13}" r="4" fill="${BLUE}" stroke="${INK}" stroke-width="1.4"/>
      <rect x="0" y="${8 * cell + 10}" width="26" height="6" rx="3" fill="${BLUE}" stroke="${INK}" stroke-width="1.2"/>
    </g>
  </svg>`
}

// ── PAGE 4, THE MAKER DISTRICT SKYLINE ─────────────────────────────────────
export function makerSkyline(w = 420, h = 150) {
  const r = seeded(4)
  const house = (x: number, bw: number, bh: number, roof: 'saw' | 'pitch' | 'flat', fill: string) => {
    const y = h - 22 - bh
    const roofPath = roof === 'saw'
      ? `M${x} ${y} L${x + bw / 3} ${y - 12} L${x + bw / 3} ${y} L${x + 2 * bw / 3} ${y - 12} L${x + 2 * bw / 3} ${y} L${x + bw} ${y - 12} L${x + bw} ${y}`
      : roof === 'pitch' ? `M${x - 3} ${y} L${x + bw / 2} ${y - 16} L${x + bw + 3} ${y} Z` : ''
    const wins = Array.from({ length: Math.floor(bw / 13) }, (_, i) =>
      `<rect x="${x + 5 + i * 13}" y="${y + 9}" width="7" height="9" rx="1.5" fill="${r() > 0.4 ? BUTTER : PAPER}" stroke="${INK}" stroke-width="1.2"/>`).join('')
    return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${fill}" stroke="${INK}" stroke-width="1.8"/>
      ${roofPath ? `<path d="${roofPath}" fill="${fill}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` : ''}${wins}`
  }
  const gear = (x: number, y: number, rad: number) => {
    const teeth = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return `<rect x="${-3}" y="${-rad - 5}" width="6" height="7" rx="1" transform="rotate(${(a * 180) / Math.PI})" fill="${BUTTER}" stroke="${INK}" stroke-width="1.4"/>`
    }).join('')
    return `<g transform="translate(${x} ${y})">${teeth}<circle r="${rad}" fill="${BUTTER}" stroke="${INK}" stroke-width="1.6"/><circle r="${rad * 0.38}" fill="${TINT}" stroke="${INK}" stroke-width="1.4"/></g>`
  }
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${TINT}"/>
    <circle cx="${w * 0.86}" cy="34" r="18" fill="${BUTTER}" stroke="${INK}" stroke-width="1.8"/>
    ${house(18, 64, 54, 'saw', PAPER)}${house(90, 46, 78, 'pitch', SAGE_PALE)}${house(144, 72, 48, 'flat', PAPER)}
    ${house(226, 52, 70, 'pitch', PAPER)}${house(286, 80, 44, 'saw', SAGE_PALE)}${house(374, 40, 60, 'flat', PAPER)}
    ${gear(182, 52, 12)}
    <path d="M 0 ${h - 22} H ${w}" stroke="${INK}" stroke-width="2"/>
    <path d="M 0 ${h - 10} H ${w}" stroke="${GOLD}" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/>
  </svg>`
}

// ── SMALL ICONS ─────────────────────────────────────────────────────────────
// One family of 32 unit icons for cards, lists and the four kinds of screen
// time. Same line, same fills, so a page of six icons reads as one set.
// Which icon family draws: the newspaper's own, or (in the boho theme) the
// app's Happy News set wherever it draws the same idea. Set once per render by
// templates/index.ts renderIssue.
let ICONS: 'house' | 'happy' = 'house'
export const useIconFamily = (f: 'house' | 'happy') => { ICONS = f }

export function icon(name: string, size = 32) {
  if (ICONS === 'happy') {
    const mapped = HAPPY_FOR[name]
    if (mapped && happyIcons()[mapped]) return happyIcons()[mapped].replace('width="64" height="64"', `width="${size}" height="${size}"`)
    return bohoSwap(houseIcon(name, size))
  }
  return houseIcon(name, size)
}

function houseIcon(name: string, size = 32) {
  const s = (inner: string) => `<svg viewBox="0 0 32 32" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`
  switch (name) {
    case 'create': return s(`<path d="M7 25 L9 18 L21 6 L26 11 L14 23 Z" fill="${BUTTER}"/><path d="M18 9 L23 14"/><path d="M7 25 L12 24"/>`)
    case 'learn': return s(`<path d="M5 9 C 10 7, 14 8, 16 10 C 18 8, 22 7, 27 9 V 24 C 22 22, 18 23, 16 25 C 14 23, 10 22, 5 24 Z" fill="${PAPER}"/><path d="M16 10 V25"/><circle cx="23" cy="6" r="2.4" fill="${BUTTER}"/>`)
    case 'connect': return s(`<path d="M4 8 H18 V17 H10 L6 21 V17 H4 Z" fill="${BUTTER}"/><path d="M14 13 H28 V22 H26 V26 L22 22 H14 Z" fill="${PAPER}"/>`)
    case 'watch': return s(`<rect x="4" y="7" width="24" height="17" rx="4" fill="${PAPER}"/><path d="M13 11 L20 15.5 L13 20 Z" fill="${BUTTER}"/><path d="M11 28 H21"/>`)
    case 'air': return s(`<path d="M5 12 H19 A4 4 0 1 0 15 8"/><path d="M5 18 H24 A4 4 0 1 1 20 22"/><circle cx="25" cy="10" r="2.6" fill="${BUTTER}"/>`)
    case 'game': return s(`<path d="M8 11 H24 A5 5 0 0 1 29 16 V20 A4 4 0 0 1 22 22 L20 20 H12 L10 22 A4 4 0 0 1 3 20 V16 A5 5 0 0 1 8 11 Z" fill="${PAPER}"/><path d="M9 15 V19 M7 17 H11"/><circle cx="22" cy="16" r="1.6" fill="${BUTTER}"/><circle cx="25" cy="19" r="1.6" fill="${BUTTER}"/>`)
    case 'robot': return s(`<rect x="7" y="10" width="18" height="15" rx="4" fill="${PAPER}"/><circle cx="12.5" cy="17" r="2" fill="${BUTTER}"/><circle cx="19.5" cy="17" r="2" fill="${BUTTER}"/><path d="M16 10 V6"/><circle cx="16" cy="5" r="1.6" fill="${BUTTER}"/><path d="M4 16 V20 M28 16 V20"/>`)
    case 'touch': return s(`<rect x="5" y="9" width="22" height="15" rx="3" fill="${PAPER}"/>${[0, 1, 2].map(i => `<circle cx="${11 + i * 5}" cy="14" r="1.4" fill="${INK}"/><circle cx="${11 + i * 5}" cy="19" r="1.4" fill="${i === 1 ? INK : BUTTER}"/>`).join('')}`)
    case 'leaf': return s(`<path d="M6 26 C 6 12, 14 6, 26 6 C 26 18, 20 26, 6 26 Z" fill="${SAGE}"/><path d="M6 26 L18 14"/>`)
    case 'star': return s(`<path d="M16 4 L19.5 12 L28 12.6 L21.5 18 L23.6 26.4 L16 21.8 L8.4 26.4 L10.5 18 L4 12.6 L12.5 12 Z" fill="${BUTTER}"/>`)
    case 'planet': return s(`<circle cx="16" cy="16" r="8" fill="${SAGE}"/><ellipse cx="16" cy="16" rx="14" ry="4.6" transform="rotate(-18 16 16)"/><circle cx="25" cy="7" r="1.6" fill="${BUTTER}"/>`)
    case 'code': return s(`<path d="M11 10 L5 16 L11 22"/><path d="M21 10 L27 16 L21 22"/><path d="M18 7 L14 25" stroke="${GOLD}"/>`)
    case 'chip': return s(`<rect x="8" y="8" width="16" height="16" rx="3" fill="${PAPER}"/><rect x="12" y="12" width="8" height="8" rx="1.5" fill="${BUTTER}"/>${[11, 16, 21].map(p => `<path d="M${p} 4 V8 M${p} 24 V28 M4 ${p} H8 M24 ${p} H28"/>`).join('')}`)
    case 'scratch': return s(`<path d="M6 20 C 6 12, 12 7, 18 8 C 25 9, 27 16, 24 21 C 21 26, 11 27, 6 20 Z" fill="${BUTTER}"/><circle cx="14" cy="15" r="1.6" fill="${INK}"/><circle cx="20" cy="15" r="1.6" fill="${INK}"/><path d="M13 20 Q 17 23 21 20"/>`)
    case 'telescope': return s(`<path d="M6 14 L22 8 L24 13 L8 19 Z" fill="${PAPER}"/><path d="M22 8 L26 6.5 L28 11.5 L24 13" fill="${BUTTER}"/><path d="M14 17 L10 27 M14 17 L18 27"/>`)
    case 'museum': return s(`<path d="M4 12 L16 5 L28 12 Z" fill="${BUTTER}"/><path d="M6 12 H26 M7 25 H25 M5 28 H27"/>${[9, 14, 18, 23].map(x => `<path d="M${x} 14 V24"/>`).join('')}`)
    case 'heart': return s(`<path d="M16 26 C 6 19, 4 14, 6 10 C 8 6, 13 6, 16 10 C 19 6, 24 6, 26 10 C 28 14, 26 19, 16 26 Z" fill="${BUTTER}"/>`)
    case 'search': return s(`<circle cx="13" cy="13" r="7" fill="${PAPER}"/><path d="M18 18 L26 26" stroke-width="3"/>`)
    case 'thumb': return s(`<path d="M10 14 L15 5 C 17 5, 18 7, 17.5 9 L16.5 13 H24 C 26 13, 27 15, 26.5 17 L24.5 24 C 24 26, 22.5 27, 21 27 H10 Z" fill="${BUTTER}"/><rect x="5" y="14" width="5" height="13" rx="1.5" fill="${PAPER}"/>`)
    case 'skip': return s(`<path d="M7 9 L17 16 L7 23 Z" fill="${PAPER}"/><path d="M17 9 L27 16 L17 23 Z" fill="${PAPER}"/><path d="M28 8 V24"/>`)
    case 'clock': return s(`<circle cx="16" cy="16" r="11" fill="${PAPER}"/><path d="M16 9 V16 L21 19"/><circle cx="16" cy="16" r="1.4" fill="${BUTTER}"/>`)
    case 'share': return s(`<circle cx="8" cy="16" r="3.4" fill="${BUTTER}"/><circle cx="24" cy="8" r="3.4" fill="${PAPER}"/><circle cx="24" cy="24" r="3.4" fill="${PAPER}"/><path d="M11 14.5 L21 9.5 M11 17.5 L21 22.5"/>`)
    case 'animal': return s(`<circle cx="16" cy="18" r="8" fill="${BUTTER}"/><circle cx="9" cy="9" r="3.6" fill="${BUTTER}"/><circle cx="23" cy="9" r="3.6" fill="${BUTTER}"/><circle cx="13" cy="17" r="1.2" fill="${INK}"/><circle cx="19" cy="17" r="1.2" fill="${INK}"/><path d="M14 21 Q16 23 18 21"/>`)
    case 'ball': return s(`<circle cx="16" cy="16" r="11" fill="${PAPER}"/><path d="M16 10 L21 13.5 L19 19.5 H13 L11 13.5 Z" fill="${INK}"/><path d="M16 10 V5 M21 13.5 L26 12 M19 19.5 L22 25 M13 19.5 L10 25 M11 13.5 L6 12"/>`)
    case 'paint': return s(`<path d="M6 22 C 4 14, 10 6, 18 6 C 26 6, 28 12, 25 15 C 22 18, 19 15, 18 19 C 17 23, 22 25, 17 26 C 12 27, 7 25, 6 22 Z" fill="${PAPER}"/><circle cx="12" cy="13" r="2" fill="${BUTTER}"/><circle cx="18" cy="11" r="2" fill="${SAGE_DEEP}"/><circle cx="11" cy="19" r="2" fill="${BLUE}"/>`)
    case 'music': return s(`<path d="M12 24 V8 L26 5 V21"/><circle cx="9" cy="24" r="3.4" fill="${BUTTER}"/><circle cx="23" cy="21" r="3.4" fill="${BUTTER}"/>`)
    case 'cake': return s(`<rect x="6" y="15" width="20" height="11" rx="2" fill="${PAPER}"/><path d="M6 19 C 9 21, 12 17, 16 19 C 20 21, 23 17, 26 19" /><path d="M16 15 V9"/><path d="M16 5 C 18 7, 17 9, 16 9 C 15 9, 14 7, 16 5 Z" fill="${BUTTER}"/>`)
    case 'rocket': return s(`<path d="M16 3 C 22 8, 23 16, 20 23 H12 C 9 16, 10 8, 16 3 Z" fill="${PAPER}"/><circle cx="16" cy="12" r="2.6" fill="${BUTTER}"/><path d="M12 23 L8 27 L10 20 M20 23 L24 27 L22 20"/><path d="M14 26 L16 30 L18 26" stroke="${GOLD}"/>`)
    case 'house': return s(`<path d="M5 15 L16 6 L27 15 V27 H5 Z" fill="${PAPER}"/><rect x="13" y="19" width="6" height="8" fill="${BUTTER}"/>`)
    case 'pencil': return s(`<path d="M6 26 L8 19 L21 6 L26 11 L13 24 Z" fill="${PAPER}"/><path d="M21 6 L26 11 L24 13 L19 8 Z" fill="${BUTTER}"/>`)
    default: return s(`<circle cx="16" cy="16" r="10" fill="${BUTTER}"/>`)
  }
}

// ── PAGE 7, THE CONNECTION GARDEN ──────────────────────────────────────────
// Two homes on two hills, a long way apart, and a line of flowers and a
// tin can telephone carrying a friendship across the valley.
export function friendshipValley(w = 420, h = 200) {
  const home = (x: number, y: number, flip: boolean) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
    <path d="M-20 0 V-26 L0 -42 L20 -26 V0 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M-24 -24 L0 -45 L24 -24" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    <rect x="-12" y="-24" width="10" height="10" rx="1.5" fill="${BUTTER}" stroke="${INK}" stroke-width="1.4"/>
    <rect x="4" y="-16" width="9" height="16" rx="1.5" fill="${SAGE}" stroke="${INK}" stroke-width="1.4"/>
  </g>`
  const flower = (x: number, y: number, c: string) => `<g transform="translate(${x} ${y})"><path d="M0 0 V10" stroke="${INK}" stroke-width="1.4"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4.4" rx="2.6" ry="4" transform="rotate(${a})" fill="${c}" stroke="${INK}" stroke-width="1"/>`).join('')}<circle r="2" fill="${INK}"/></g>`
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${SAGE_PALE}"/>
    <circle cx="${w * 0.5}" cy="40" r="20" fill="${TINT}" stroke="${INK}" stroke-width="1.8"/>
    <path d="M0 ${h * 0.62} C ${w * 0.12} ${h * 0.48}, ${w * 0.26} ${h * 0.5}, ${w * 0.36} ${h * 0.7} C ${w * 0.44} ${h * 0.86}, ${w * 0.56} ${h * 0.86}, ${w * 0.64} ${h * 0.7} C ${w * 0.74} ${h * 0.5}, ${w * 0.88} ${h * 0.48}, ${w} ${h * 0.6} V ${h} H 0 Z" fill="${SAGE}" stroke="${INK}" stroke-width="1.8"/>
    ${home(w * 0.14, h * 0.56, false)}${home(w * 0.86, h * 0.55, true)}
    <path d="M ${w * 0.2} ${h * 0.36} Q ${w * 0.5} ${h * 0.02}, ${w * 0.8} ${h * 0.36}" fill="none" stroke="${GOLD}" stroke-width="2.6" stroke-dasharray="1 7" stroke-linecap="round"/>
    <g transform="translate(${w * 0.2} ${h * 0.36}) rotate(-30)"><path d="M-5 -6 H5 L7 6 H-7 Z" fill="${BUTTER}" stroke="${INK}" stroke-width="1.4"/></g>
    <g transform="translate(${w * 0.8} ${h * 0.36}) rotate(30)"><path d="M-5 -6 H5 L7 6 H-7 Z" fill="${BUTTER}" stroke="${INK}" stroke-width="1.4"/></g>
    ${[[0.3, 0.8, BUTTER], [0.38, 0.88, PAPER], [0.46, 0.93, BUTTER], [0.54, 0.93, PAPER], [0.62, 0.88, BUTTER], [0.7, 0.8, PAPER]].map(([x, y, c]) => flower(w * (x as number), h * (y as number), c as string)).join('')}
  </svg>`
}

// ── PAGE 8, THE RECOMMENDATION MACHINE ─────────────────────────────────────
// What you did goes in at the top as signals; a guess about what you will
// watch next comes out of the bottom. Labels are the only words: this is a
// diagram, and diagrams are allowed their labels.
export function recommendationMachine(w = 360, h = 300) {
  const token = (x: number, y: number, ic: string, label: string) => `<g transform="translate(${x} ${y})">
    <rect x="-34" y="-17" width="68" height="34" rx="12" fill="${PAPER}" stroke="${INK}" stroke-width="1.6"/>
    <g transform="translate(-30 -12) scale(.75)">${houseIcon(ic).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
    <text x="9" y="4" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="8" fill="${INK}">${label}</text>
  </g>`
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${SAGE_PALE}"/>
    ${token(60, 34, 'clock', 'WATCHED')}${token(140, 24, 'thumb', 'LIKED')}${token(220, 24, 'skip', 'SKIPPED')}${token(300, 34, 'search', 'SEARCHED')}
    <path d="M 70 62 L 150 104 M 140 52 L 168 102 M 220 52 L 192 102 M 290 62 L 210 104" stroke="${INK}" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
    <path d="M 120 100 H 240 L 214 136 H 146 Z" fill="${BUTTER}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="100" y="136" width="160" height="88" rx="16" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
    <circle cx="140" cy="168" r="13" fill="${SAGE}" stroke="${INK}" stroke-width="1.6"/>
    <path d="M140 157 V168 L148 173" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <circle cx="220" cy="168" r="13" fill="${SAGE}" stroke="${INK}" stroke-width="1.6"/>
    <path d="M211 168 H229 M220 159 V177" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="124" y="194" width="112" height="12" rx="6" fill="${SAGE_PALE}" stroke="${INK}" stroke-width="1.4"/>
    <rect x="124" y="194" width="70" height="12" rx="6" fill="${BUTTER}" stroke="${INK}" stroke-width="1.4"/>
    <path d="M 180 224 V 246" stroke="${INK}" stroke-width="2"/>
    <path d="M 172 240 L 180 250 L 188 240" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="110" y="254" width="140" height="36" rx="12" fill="${INK}"/>
    <path d="M 132 264 L 144 272 L 132 280 Z" fill="${BUTTER}"/>
    <text x="196" y="276" text-anchor="middle" font-family="IBM Plex Mono" font-weight="700" font-size="9" fill="${CREAM}">NEXT UP?</text>
  </svg>`
}

// ── PAGE 10 AND 11 HEADERS ─────────────────────────────────────────────────
export function explorerTrail(w = 420, h = 110) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <rect width="${w}" height="${h}" fill="${ESPRESSO}"/>
    ${stars(70, w, h, 55, { colour: TINT, maxR: 1 })}
    <path d="M 10 ${h - 26} C ${w * 0.2} ${h - 70}, ${w * 0.4} ${h - 8}, ${w * 0.6} ${h - 50} S ${w * 0.9} ${h - 40}, ${w - 10} ${h - 70}" fill="none" stroke="${BUTTER}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
    ${[[0.08, 0.7], [0.3, 0.56], [0.52, 0.66], [0.72, 0.5], [0.94, 0.34]].map(([x, y], i) => `<g transform="translate(${w * x} ${h * y})"><circle r="11" fill="${i === 4 ? BUTTER : TINT}" stroke="${INK}" stroke-width="1.6"/><text y="4" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="11" fill="${INK}">${i + 1}</text></g>`).join('')}
  </svg>`
}

export const ART: Record<string, (w?: number, h?: number) => string> = {
  'cover-night': coverNight,
  'world-map': worldMap,
  'code-in-orbit': codeInOrbit,
  'maker-skyline': makerSkyline,
  'friendship-valley': friendshipValley,
  'recommendation-machine': recommendationMachine,
  'explorer-trail': explorerTrail,
}
