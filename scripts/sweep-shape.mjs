// The shape sweep: hand typed borders, drop shadows and corner radii become
// the shape tokens in shared/tokens.css.
//
// Sunday 13 September 2026. Colour and type were already tokens; shape was
// typed from memory 1,700 times. This turns the four spellings of the ink
// drop shadow and the eleven radii into eight tokens, mechanically, so the
// whole platform can be re dressed by editing eight lines.
//
// Only EXACT whole values move. A radius of '14px 18px 18px 14px' is a
// deliberate asymmetric shape and stays. A 10px radius on a progress bar is
// not a card and stays. border-radius: 50% is a circle and stays.
//
//   node scripts/sweep-shape.mjs --dry            counts only
//   node scripts/sweep-shape.mjs app components   applies to those roots
//
// Session one (parents) ran it over app, components and shared/components.
// Session two (schools) should run it over schools/app and schools/components.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const roots = args.filter(a => !a.startsWith('--'))
if (roots.length === 0) roots.push('app', 'components', 'shared/components')

const RADIUS = { 16: 'btn', 100: 'pill', 999: 'pill', 18: 'card', 20: 'card', 22: 'card', 24: 'card', 12: 'tile', 13: 'tile', 14: 'tile' }
const LIFT = { 4: 'lift', 5: 'lift-deep', 2: 'lift-press', 3: 'lift' }

const counts = {}
const bump = k => { counts[k] = (counts[k] ?? 0) + 1 }

function sweep(src, file) {
  let s = src
  // The ink edge, as a whole quoted value or a whole CSS value.
  s = s.replace(/(['"])2px solid var\(--ink\)\1/g, (m, q) => { bump('edge'); return `${q}var(--edge)${q}` })
  s = s.replace(/:\s*2px solid var\(--ink\);/g, () => { bump('edge'); return ': var(--edge);' })
  // The ink lifts. Allowed as the first item of a longer shadow list, because
  // var() substitutes text and the rest of the list survives.
  s = s.replace(/(?<=['":\s])0 ([2345])px 0 var\(--ink\)(?=['",;])/g, (m, px) => { bump(`lift ${px}px`); return `var(--${LIFT[px]})` })
  // Radii: exact whole values, quoted or bare, in JSX style objects.
  s = s.replace(/borderRadius:\s*(?:'(\d+)px'|"(\d+)px"|(\d+))(?=\s*[,}\n)])/g, (m, a, b, c) => {
    const n = a ?? b ?? c
    const t = RADIUS[n]
    if (!t) return m
    bump(`radius ${n}`)
    return `borderRadius: 'var(--radius-${t})'`
  })
  // Radii in CSS.
  s = s.replace(/border-radius:\s*(\d+)px;/g, (m, n) => {
    const t = RADIUS[n]
    if (!t) return m
    bump(`radius ${n}`)
    return `border-radius: var(--radius-${t});`
  })
  return s
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (/node_modules|\.next/.test(p)) continue
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|css)$/.test(name)) out.push(p)
  }
  return out
}

let touched = 0
for (const root of roots) {
  for (const f of walk(root)) {
    // The token file defines the shapes; sweeping it would eat the definitions.
    if (f.endsWith('shared/tokens.css')) continue
    const src = readFileSync(f, 'utf8')
    const out = sweep(src, f)
    if (out !== src) {
      touched += 1
      if (!DRY) writeFileSync(f, out)
    }
  }
}

console.log(`${DRY ? 'would touch' : 'touched'} ${touched} files in ${roots.join(', ')}`)
for (const [k, v] of Object.entries(counts).sort()) console.log(`  ${k.padEnd(14)} ${v}`)
