// Does the Planet Friend beside the road actually rotate, and never collide?
//
// Justin, 13 August 2026: "we need actual Planet Friend characters to rotate
// services and pop up on the daily pathway. Every 2 days we can have a new one
// explaining why to click and do." Then: "note DiGi star is also a character."
//
// That second note is why this exists. With five Friends and six services the
// two counts shared no factor and the pairs drifted on their own. Adding DiGi
// made it six and six, and six into six is a LOCK: without the lap step every
// character would present the same service for ever, and DiGi would be the
// school calendar until the heat death of the universe. That is a silent
// failure, it looks fine for the first twelve days, so it wants a test rather
// than a careful read.
//
// Usage: node --experimental-strip-types scripts/check-friend-rotation.mjs

import { pairFor } from '../lib/pathway/rotation.ts'
import { PLANETS } from '../lib/pathway/planets.ts'
import { readFileSync } from 'node:fs'

// The cast is read as text rather than imported, because friend-of-the-day
// pulls in the app's module aliases and this has to run on plain node with no
// bundler. The arithmetic is what can silently break; the cast is a list.
const src = readFileSync('lib/pathway/friend-of-the-day.ts', 'utf8')
const CAST_LENGTH = 1 + (readFileSync('lib/content/stage-characters.ts', 'utf8').match(/stageId: \d/g) ?? []).length

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// Midday so a clock change can never move the day underneath the test.
const day = n => new Date(Date.UTC(2026, 0, 5 + n, 12, 0, 0))

check('DiGi is in the cast', src.includes("key: 'digi'"))
check('and so are all five stage Friends', CAST_LENGTH === 6, `${CAST_LENGTH} in the cast`)
check('DiGi has art to draw', /cutout: '\/digi-squad\/DiGi-star/.test(src))

const N = CAST_LENGTH
const S = PLANETS.length

// ── EVERYBODY GETS A TURN ───────────────────────────────────────────────────

const overACycle = Array.from({ length: N }, (_, i) => pairFor(i, N, S).castIndex)
check('every cast member appears within one cycle',
  new Set(overACycle).size === N, overACycle.join(' '))

// ── AND THE PAIRS DO NOT LOCK, WHICH IS THE WHOLE POINT ─────────────────────
//
// Six characters and six services would pin every pairing for ever without the
// lap step, and it looks perfectly fine for the first twelve days.

const pairs = new Set()
for (let slot = 0; slot < N * S; slot++) {
  const p = pairFor(slot, N, S)
  pairs.add(`${p.castIndex}/${p.serviceIndex}`)
}
check('every character presents every service over the full cycle',
  pairs.size === N * S, `${pairs.size} of ${N * S} pairings`)

// The specific regression, named: cast member 0 is DiGi.
const digiServices = new Set()
for (let slot = 0; slot < N * S; slot++) {
  const p = pairFor(slot, N, S)
  if (p.castIndex === 0) digiServices.add(p.serviceIndex)
}
check('DiGi is not stuck on one service for ever',
  digiServices.size === S, `${digiServices.size} of ${S} services`)

// ── NEVER THE SAME THING THE ROAD IS ALREADY ASKING FOR ─────────────────────

let collisions = 0
for (let slot = 0; slot < 120; slot++) {
  const plain = pairFor(slot, N, S)
  const avoided = pairFor(slot, N, S, plain.serviceIndex)
  if (avoided.serviceIndex === plain.serviceIndex) collisions++
}
check('a colliding service is always stepped past', collisions === 0, `${collisions} collisions`)

// A slot before the anchor is a negative number and JavaScript's % keeps the
// sign, which would index off the front of the array.
const back = pairFor(-3, N, S)
check('a date before the anchor still lands inside the cast',
  back.castIndex >= 0 && back.castIndex < N && back.serviceIndex >= 0 && back.serviceIndex < S,
  `${back.castIndex}/${back.serviceIndex}`)

// Every service needs a short label and a line, or the coin draws a character
// with nothing under it. That is the failure a parent actually sees.
check('every service has a short label and a reason',
  PLANETS.every(p => p.short && p.line && p.href))

// The five Friend files have to exist, because a missing one is an empty
// circle on the screen a parent opens every morning.
for (const name of ['pebble', 'bloop', 'orbit', 'nova', 'cosmo']) {
  let ok = true
  try { readFileSync(`public/digi-squad/friends/${name}.png`) } catch { ok = false }
  check(`${name} has art on disk`, ok)
}

console.log(failures === 0 ? '\nAll good.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
