// Does the look back card actually rotate?
//
// The bug it replaces was invisible to every check we had, because the code was
// correct in isolation: "read the latest completion" does exactly what it says.
// It was only wrong across DAYS, and nothing tested across days.
//
// So this simulates a month.
//
// Usage: node --experimental-strip-types scripts/check-review-pick.mjs

import { pickReview, agoLabel } from '../lib/pathway/review-pick.ts'

const DAY = 86400000
const today = Date.parse('2026-08-10T09:00:00Z')
const ago = d => new Date(today - d * DAY).toISOString()

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── The exact shape Justin hit: several completed, none marked as failing ────
const history = [
  { script_sort_order: 101, completed_at: ago(1) },
  { script_sort_order: 102, completed_at: ago(9) },
  { script_sort_order: 103, completed_at: ago(20) },
  { script_sort_order: 104, completed_at: ago(41) },
]

const base = Math.floor(today / DAY)
const month = Array.from({ length: 28 }, (_, i) => pickReview(history, base + i).sortOrder)
const distinct = new Set(month)

check('rotates across 28 days', distinct.size === history.length,
  `saw ${distinct.size} of ${history.length}: ${[...distinct].join(', ')}`)
check('never the same two days running',
  month.every((v, i) => i === 0 || v !== month[i - 1]))
check('cycles rather than drifting',
  month.slice(0, history.length).join() === month.slice(history.length, history.length * 2).join(),
  month.slice(0, 8).join(' '))
check('same day gives the same answer',
  pickReview(history, base).sortOrder === pickReview(history, base).sortOrder)

// ── A problem outranks the rotation, every day, on purpose ──────────────────
const withFailure = history.map(h => h.script_sort_order === 103 ? { ...h, worked: 'no' } : h)
const failDays = Array.from({ length: 7 }, (_, i) => pickReview(withFailure, base + i))
check('a script that did not work wins', failDays.every(p => p.sortOrder === 103))
check('and says why', failDays.every(p => p.reason === 'did-not-work'))

// A failure must NOT become the new permanent card. This is the trap the first
// version of the rule fell into: it rebuilt the pin it was meant to remove.
const oldFailure = history.map(h => h.script_sort_order === 104 ? { ...h, worked: 'no' } : h)
check('an old failure does not pin the card forever',
  new Set(Array.from({ length: 14 }, (_, i) => pickReview(oldFailure, base + i).sortOrder)).size > 1,
  '104 failed 41 days ago, outside the 30 day window')

const twoFailures = history.map(h =>
  h.script_sort_order === 103 || h.script_sort_order === 102 ? { ...h, worked: 'no' } : h)
check('several failures rotate between themselves',
  new Set(Array.from({ length: 8 }, (_, i) => pickReview(twoFailures, base + i).sortOrder)).size === 2)

// ── A flagged topic outranks the rotation but not a failure ─────────────────
const flagged = pickReview(history, base, n => n === 102)
check('a flagged topic wins over rotation', flagged.sortOrder === 102 && flagged.reason === 'flagged')
const flaggedVsFailure = pickReview(withFailure, base, n => n === 102)
check('but a failure still beats a flag', flaggedVsFailure.sortOrder === 103)

// ── Edges ───────────────────────────────────────────────────────────────────
check('no completions gives nothing', pickReview([], base) === null)
const one = pickReview([history[0]], base)
check('one completion does not pretend to rotate', one.reason === 'only-one' && one.total === 1)

// ── The words for how long ago ──────────────────────────────────────────────
const now = new Date(today)
check('ago reads like a person', [
  [agoLabel(ago(0), now), 'earlier today'],
  [agoLabel(ago(1), now), 'yesterday'],
  [agoLabel(ago(3), now), '3 days ago'],
  [agoLabel(ago(9), now), 'last week'],
  [agoLabel(ago(41), now), '6 weeks ago'],
].every(([got, want]) => got === want),
  [0, 1, 3, 9, 41].map(d => `${d}d="${agoLabel(ago(d), now)}"`).join(' '))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
