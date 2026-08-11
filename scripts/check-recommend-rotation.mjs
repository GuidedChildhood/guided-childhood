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

import { chooseScript, eligibleScripts as guard, scoreScript } from '../lib/pathway/recommend-pick.ts'

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

// ── THE COIN TOSS THAT PICKED A COMING OUT SCRIPT ───────────────────────────
//
// Justin, 11 August 2026, screenshot of his own Scripts page: "Recommended
// next: They have told you they are gay, bi or trans."
//
// This is the real account, read off the database that morning. Shaper stage,
// free plan, so the pool is the five free shaper scripts. 3300 was set aside
// and 3301 and 10 were used, so two survive: 3303, a child coming out, and
// 3304, coming home hours late. The family's live concerns were morning screen
// time, ending screen time and gaming, none of which has a free script at that
// stage, so both survivors scored zero and the rotation picked between them.

const FREE_SHAPER = [
  { sort_order: 3303, category: 'mood-confidence' },  // they have come out
  { sort_order: 3304, category: 'family-rules' },     // came home hours late
]
const GUARDED = new Set([3300, 3303])
// What his account actually scored: screen time and gaming, both real, neither
// mood-confidence.
// Read off his account: gaming and routines led, and mood and confidence was
// live too, on an open concern called "evening neediness".
const HIS_SCORES = { 'screen-time': 110, gaming: 120, 'everyday-routines': 120, 'mood-confidence': 110 }
const scoreOf = c => HIS_SCORES[c] ?? 0

const left = guard(FREE_SHAPER, GUARDED)
check('a coming out script is not offered as the next thing to read',
  !left.some(s => s.sort_order === 3303), left.map(s => s.sort_order).join(', '))
check('and the ordinary script beside it still is',
  left.some(s => s.sort_order === 3304))

// THE VERSION OF THIS RULE THAT DID NOT WORK, kept as a test because it is the
// trap anyone rewriting this will fall into. The first attempt let a flagged
// script through when its own CATEGORY carried a score. That family had an open
// concern called "evening neediness", which files under mood and confidence,
// and so does a child coming out. Category is eight shelves wide and every one
// of these scripts is a specific event, so no category score is ever evidence.
check('a mood signal is still not evidence a child has come out',
  !guard(FREE_SHAPER, GUARDED).some(s => s.sort_order === 3303),
  `his real mood-confidence score that morning was ${scoreOf('mood-confidence')}`)

// Nothing flagged means nothing filtered, which is the state of the world until
// migration 185 runs.
check('an unmigrated database behaves exactly as before',
  guard(FREE_SHAPER, new Set()).length === 2)

// The guard must never be the thing that empties the board on its own: an
// unflagged script always survives whatever its score.
check('an unflagged script survives a zero score',
  guard([{ sort_order: 999, category: 'staying-safe' }], GUARDED).length === 1)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
