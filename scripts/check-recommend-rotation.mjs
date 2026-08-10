// Does the recommended script ever change?
//
// Justin, 10 August 2026, on the Scripts tab: "just the logic on the scripts
// bit recommends, and make sure relevant for family history, child age, and not
// always repeated."
//
// The card said "They have told you they are gay, bi or trans" and would have
// said it every morning for ever. Not because anything matched, but because
// nothing did: every signal the recommender has is a category, a family with no
// concerns and no devices listed scores every script zero, and the old loop
// then kept whichever script happened to sort first.
//
// This is the same class of bug as the daily look back card, and the same thing
// makes it invisible: the code is correct on any single day. It is only wrong
// across days, and nothing tested across days.
//
// Usage: node --experimental-strip-types scripts/check-recommend-rotation.mjs

import { chooseScript, scoreScript } from '../lib/pathway/recommend-pick.ts'

const S = (sort_order, category) => ({ sort_order, category })
const POOL = [S(1, 'mood-confidence'), S(2, 'screen-time'), S(3, 'gaming'), S(4, 'family-rules')]
const NONE = { scoreOfCategory: () => 0, opened: new Set(), returned: new Set() }
const BASE = 20300

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── A family we know nothing about: rotate rather than repeat ───────────────
const fortnight = Array.from({ length: 14 }, (_, i) => chooseScript(POOL, { ...NONE, dayIndex: BASE + i }).sort_order)
check('rotates when nothing distinguishes them', new Set(fortnight).size === POOL.length,
  `saw ${new Set(fortnight).size} of ${POOL.length}: ${[...new Set(fortnight)].join(', ')}`)
check('never the same two days running', fortnight.every((v, i) => i === 0 || v !== fortnight[i - 1]))
check('the same day gives the same answer',
  chooseScript(POOL, { ...NONE, dayIndex: BASE }).sort_order === chooseScript(POOL, { ...NONE, dayIndex: BASE }).sort_order)

// ── A family who has raised something: that wins, and keeps winning ─────────
const concerned = { ...NONE, scoreOfCategory: c => (c === 'gaming' ? 140 : 0) }
const week = Array.from({ length: 7 }, (_, i) => chooseScript(POOL, { ...concerned, dayIndex: BASE + i }).sort_order)
check('a real signal wins every day', week.every(v => v === 3), `saw ${[...new Set(week)].join(', ')}`)
check('and is not shuffled away for variety', new Set(week).size === 1)

// Two categories carrying signal: the stronger one, not the rotation.
const twoSignals = { ...NONE, scoreOfCategory: c => (c === 'gaming' ? 140 : c === 'screen-time' ? 50 : 0) }
check('the stronger signal beats the weaker',
  chooseScript(POOL, { ...twoSignals, dayIndex: BASE }).sort_order === 3)

// Equal signals DO rotate between themselves, which is the point: two topics a
// family raised the same number of times are genuinely equal, and picking the
// lower sort order every morning is a coin toss pretending to be a decision.
const equalSignals = { ...NONE, scoreOfCategory: c => (c === 'gaming' || c === 'screen-time' ? 110 : 0) }
const pair = new Set(Array.from({ length: 6 }, (_, i) => chooseScript(POOL, { ...equalSignals, dayIndex: BASE + i }).sort_order))
check('two equal signals share the slot', pair.size === 2 && pair.has(2) && pair.has(3), `saw ${[...pair].join(', ')}`)

// ── Opened and returned still count ─────────────────────────────────────────
const opened = { ...NONE, opened: new Set([1, 2, 4]) }
const afterOpens = Array.from({ length: 5 }, (_, i) => chooseScript(POOL, { ...opened, dayIndex: BASE + i }).sort_order)
check('an unseen script beats three already glanced at', afterOpens.every(v => v === 3))
check('a glanced at script still scores above nothing',
  scoreScript(S(9, 'gaming'), { ...NONE, scoreOfCategory: () => 100, opened: new Set([9]) }) >
  scoreScript(S(8, null), NONE))
check('a returning script gets its nudge',
  scoreScript(S(7, null), { ...NONE, returned: new Set([7]) }) === 15)

// ── Edges ───────────────────────────────────────────────────────────────────
check('one script is simply that script', chooseScript([S(5, null)], { ...NONE, dayIndex: BASE }).sort_order === 5)
check('a negative day number does not fall off the end',
  POOL.some(s => s.sort_order === chooseScript(POOL, { ...NONE, dayIndex: -3 }).sort_order))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
