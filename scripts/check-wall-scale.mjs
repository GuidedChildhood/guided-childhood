#!/usr/bin/env node
//
// THE WALL SCALE GUARD: nothing renders below the legibility floor on a
// classroom wall.
//
// This is the third time the projector has been wrong, and each time it passed
// every other check we have:
//
//   1. Five slide types shipped at phone size because they took no `projector`
//      prop. Fixed by routing every size through `room()`.
//   2. The teach route passed `teacherView` but not `projector`, so `room()`
//      chose the small branch everywhere. Fixed by passing `projector`.
//   3. `room()` never said what the BIG value should be, so every site picked
//      its own and most picked too small: body, options and diagram steps at
//      18 to 24px against a 40px floor, and title, objective and keywords with
//      no projector branch at all.
//
// None of those could fail a typecheck, a test or a health check. They are all
// the same shape of bug: a number that is legal, renders fine on a laptop, and
// is unreadable from the back of a classroom. Only reading the source catches
// it, so this reads the source.
//
// ISO 9241-303 sets minimum legible cap height at 16 arc minutes, which on a
// two metre image with the back row at eight metres is about 50px on a 1920
// canvas, 40px absolute floor (research/2026-09-09-lesson-quality-council.md).
//
// No database, no build, no browser. Runs in the wiring workflow.

import { readFile } from 'node:fs/promises'

const FLOOR_PX = 40           // what every child must be able to read
const ASIDE_FLOOR_PX = 24     // chrome the class does not read from the back
const REM = 16

const files = [
  'shared/components/LessonPlayer.tsx',
  'shared/components/AnimatedIntro.tsx',
  'schools/app/teach/[module]/page.tsx',
]

const fails = []
const note = (file, line, why) => fails.push(`${file}:${line}  ${why}`)

// WHAT A CLASSROOM ACTUALLY RENDERS, on the 1920 by 1080 canvas the ISO
// numbers are for. Not the upper bound of the clamp: the first version of this
// guard read the third argument and called it the answer, which stopped being
// true the moment the middle term learned about viewport height. A guard that
// reads one term of a three term expression is guessing.
const WALL_W = 1920
const WALL_H = 1080

const term = t => {
  const s = t.trim()
  let m = s.match(/^([\d.]+)vw$/); if (m) return Number(m[1]) * WALL_W / 100
  m = s.match(/^([\d.]+)vh$/); if (m) return Number(m[1]) * WALL_H / 100
  m = s.match(/^([\d.]+)rem$/); if (m) return Number(m[1]) * REM
  m = s.match(/^([\d.]+)px$/); if (m) return Number(m[1])
  m = s.match(/^min\((.+)\)$/); if (m) return Math.min(...m[1].split(',').map(term))
  m = s.match(/^max\((.+)\)$/); if (m) return Math.max(...m[1].split(',').map(term))
  return null
}

// Split on commas that are not inside a nested call, so min(4.4vw, 6vh) stays
// one argument.
const args = inner => {
  const out = []
  let depth = 0, cur = ''
  for (const ch of inner) {
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (ch === ',' && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  out.push(cur)
  return out
}

const px = value => {
  const v = value.replace(/^'|'$/g, '').trim()
  const clamp = v.match(/^clamp\((.+)\)$/)
  if (clamp) {
    const [lo, mid, hi] = args(clamp[1]).map(term)
    if ([lo, mid, hi].some(n => n === null)) return null
    return Math.min(Math.max(lo, mid), hi)   // what clamp() means
  }
  return term(v) // a bare rem or px renders at that value everywhere
}

// ── 1. The scale itself still clears the floor ───────────────────────
const scale = await readFile('shared/wall-scale.ts', 'utf8')
for (const role of ['question', 'display', 'title', 'body']) {
  const m = scale.match(new RegExp(`${role}:\\s*('[^']+')`))
  if (!m) { note('shared/wall-scale.ts', 0, `WALL.${role} is missing`); continue }
  const size = px(m[1])
  if (size === null) { note('shared/wall-scale.ts', 0, `WALL.${role} is not a size this guard can read: ${m[1]}`); continue }
  if (size < FLOOR_PX) {
    note('shared/wall-scale.ts', 0, `WALL.${role} renders at ${size}px, below the ${FLOOR_PX}px floor`)
  }
}
const aside = px((scale.match(/aside:\s*('[^']+')/) ?? [])[1] ?? '')
if (aside !== null && aside < ASIDE_FLOOR_PX) {
  note('shared/wall-scale.ts', 0, `WALL.aside renders at ${aside}px, below ${ASIDE_FLOOR_PX}px`)
}

// ── 2. No projector branch renders a literal below the floor ─────────
// Catches `room(projector, '1.35rem', ...)` and `projector ? '20px' : ...`,
// which is exactly how every one of the three bugs above looked in the diff.
for (const file of files) {
  const src = await readFile(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    // ONLY the value attached to fontSize. The first version of this guard
    // scanned the whole line and flagged a marginBottom of '22px' because a
    // fontSize happened to sit on the same line. A guard that cries wolf gets
    // switched off, which would leave the wall exactly where it started.
    for (const m of line.matchAll(/fontSize:\s*(room\(projector,\s*|projector\s*\?\s*)('[^']+')/g)) {
      const size = px(m[2])
      if (size !== null && size < FLOOR_PX) {
        note(file, i + 1, `projector fontSize ${m[2]} is ${size}px, below the ${FLOOR_PX}px floor. Use a WALL role.`)
      }
    }
  })
}

// ── 3. Every slide type has a projector branch ───────────────────────
// The bug that keeps coming back. A `case 'x':` whose body sets a fontSize but
// never mentions `projector` is a slide type rendering at phone size on a wall.
const player = await readFile('shared/components/LessonPlayer.tsx', 'utf8')
const switchAt = player.indexOf('function SlideBody(')
const cases = [...player.slice(switchAt).matchAll(/^\s*case '([a-z]+)':/gm)]
for (const [n, c] of cases.entries()) {
  const from = switchAt + c.index
  const to = n + 1 < cases.length ? switchAt + cases[n + 1].index : player.indexOf('\n}', from)
  const body = player.slice(from, to)
  // A case that delegates to a Block component is fine if it passes projector.
  const delegates = /<[A-Z]\w+Block\b|<Interactive\b|<AnimatedIntro\b/.test(body)
  const aware = /projector/.test(body)
  if (!aware && (/fontSize/.test(body) || delegates)) {
    note('shared/components/LessonPlayer.tsx', player.slice(0, from).split('\n').length,
      `case '${c[1]}' renders text but never mentions projector, so it ships at phone size on a wall`)
  }
}

if (fails.length) {
  console.error('\nWALL SCALE: something on the classroom wall is too small to read.\n')
  for (const f of fails) console.error('  ' + f)
  console.error(`\n${fails.length} problem${fails.length === 1 ? '' : 's'}. See shared/wall-scale.ts.\n`)
  process.exit(1)
}
console.log('wall scale: every projector size is at or above the legibility floor')
