#!/usr/bin/env node
// THE SCALE RATCHET: the schools app may not grow new off scale type or space.
//
// On 18 September 2026 the schools app carried 487 fontSize call sites in 57
// distinct values, 104 distinct padding values and 39 distinct gap values.
// Most of the type already read from --text-*; almost none of the space read
// from anything, because until that day there was no spacing scale to read.
//
// WHY A RATCHET AND NOT A ZERO. A guard that demands zero on the day it lands
// fails on 104 paddings, and a guard that fails the moment it is written is a
// guard someone comments out by Friday. This one records what was true when it
// was written and fails only when the number goes UP. The number can only
// fall, every batch that touches a page brings it down, and nobody has to fix
// all of it in one afternoon to keep the build green.
//
// WHAT IS NOT COUNTED, and why each one is a real exception rather than a
// convenience:
//   - Print sheets, which measure in mm against a physical A4 sheet and have
//     their own fit guard. A ladder built for a screen has no authority there.
//   - clamp() and calc(), which are responsive decisions rather than values.
//     A page band that breathes with the viewport is not an off scale gap.
//   - 0, 100%, auto and the like, which are not sizes.
//   - The projector, which is shared/wall-scale.ts and a different instrument.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'schools'
// The SHEETS, not the print room. /print and /print/passport are screens a
// teacher browses and they are policed like any other page; what is exempt is
// the artwork that goes through a printer and measures itself in millimetres.
const PRINT = ['QuizSheet', 'print/kit', 'print/[module]', 'print/passport/[stage]']

// The counts on the day the ratchet was written. Lower these as batches land;
// never raise them. A raise means the app got less consistent, which is the
// one thing this file exists to stop.
const CEILING = { font: 10, padding: 70, gap: 0 }

const files = []
;(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    if (statSync(p).isDirectory()) { if (e !== 'node_modules' && e !== '.next') walk(p) }
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) files.push(p)
  }
})(ROOT)

const RAW = /^-?\d*\.?\d+(px|rem|em)$/
const offScale = { font: new Map(), padding: new Map(), gap: new Map() }

for (const f of files) {
  if (PRINT.some(p => f.includes(p))) continue
  const src = readFileSync(f, 'utf8')
  for (const [prop, key] of [['fontSize', 'font'], ['padding', 'padding'], ['gap', 'gap']]) {
    const re = new RegExp(`${prop}: '([^']+)'`, 'g')
    for (const m of src.matchAll(re)) {
      const v = m[1]
      if (v.includes('var(') || v.includes('clamp(') || v.includes('calc(') || v.includes('%')) continue
      // a multi value shorthand is off scale if ANY of its parts is a raw size
      if (!v.split(/\s+/).some(part => RAW.test(part))) continue
      const at = offScale[key].get(v) || []
      at.push(f.replace('schools/', ''))
      offScale[key].set(v, at)
    }
  }
}

let failed = false
for (const key of ['font', 'padding', 'gap']) {
  const n = offScale[key].size
  const cap = CEILING[key]
  const verdict = n > cap ? 'FAIL' : n < cap ? 'BETTER' : 'PASS'
  if (n > cap) failed = true
  console.log(`${verdict.padEnd(6)} ${key.padEnd(8)} ${n} distinct off scale values (ceiling ${cap})`)
  if (n > cap) {
    for (const [v, at] of [...offScale[key].entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 12)) {
      console.log(`         ${v.padEnd(22)} ${at.length}x  ${at[0]}`)
    }
  }
  if (n < cap) console.log(`         lower CEILING.${key} to ${n} in this file so it cannot drift back up`)
}

if (failed) {
  console.log('\nNew off scale values. Read them from shared/tokens.css (--space-1 to 7,')
  console.log('--text-xs to 3xl) or shared/page-scale.ts (PAGE.hero, page, section, lead).')
  process.exit(1)
}
console.log('\nPASS  the schools app did not grow a new off scale value')
