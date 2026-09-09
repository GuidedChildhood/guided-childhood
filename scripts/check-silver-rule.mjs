// When does a worry stop being asked about, and when does it come back?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "we include the issues in daily check up until
// silver". The rule that answers this reads two maps built from the same
// query in five different files, and on 9 September it changed from "the last
// score" to "how many good scores are on the end of the run".
//
// Both maps are Map<string, number>, so every one of those five call sites
// went on typechecking perfectly while passing the WRONG map, and the only
// visible symptom would have been families quietly never being asked about
// bedtime again. That is precisely the class of bug this repo keeps finding
// six weeks late, so the rule gets a test that runs on every push.
//
// Usage: node --experimental-strip-types scripts/check-silver-rule.mjs

import { restingConcernIds, TOP_BAND, SILVER_RUN, WEEKLY_DAYS, rungOf } from '../lib/concerns/resting.ts'
import { readScores } from '../lib/concerns/scores.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const NOW = new Date('2026-09-09T12:00:00Z')
const daysAgo = n => new Date(NOW.getTime() - n * 86400000).toISOString()

/** Scores newest first, as the database returns them. */
function build(scores, { raisedDaysAgo = 99 } = {}) {
  const events = scores.map((score, i) => ({ concern_id: 'c1', score, created_at: daysAgo(i + 1) }))
  const read = readScores(events, TOP_BAND)
  const concerns = [{ id: 'c1', last_flagged_at: daysAgo(raisedDaysAgo) }]
  return { resting: restingConcernIds(concerns, read.topRun, read.lastAt, NOW), read }
}

const asks = scores => !build(scores).resting.has('c1')

// ── THE LADDER ──────────────────────────────────────────────────────────────
check('a worry with no score at all is asked', asks([]))
check('one bad day is asked', asks([3]))
check('one good day is STILL asked', asks([10]), 'the whole point of silver')
check('a good day after a bad one is asked', asks([10, 4]))
check(`${SILVER_RUN} good days in a row rests it`, !asks([10, 9]))
check('three good days in a row rests it', !asks([10, 10, 10]))
check('a dip after two good days brings it straight back', asks([5, 10, 10]))
check('a top score at exactly the band counts', !asks([TOP_BAND, TOP_BAND]))
check('one below the band does not', asks([TOP_BAND - 1, TOP_BAND]))

// ── IT COMES BACK WEEKLY ────────────────────────────────────────────────────
//
// build() dates the newest score one day ago, so a run is always recent. To
// age it, push the whole run back past the week.
const aged = days => {
  const events = [10, 10].map((score, i) => ({ concern_id: 'c1', score, created_at: daysAgo(days + i) }))
  const read = readScores(events, TOP_BAND)
  return !restingConcernIds([{ id: 'c1', last_flagged_at: daysAgo(99) }], read.topRun, read.lastAt, NOW).has('c1')
}
check('a silver worry is not asked the next day', !aged(1))
check(`a silver worry is not asked after ${WEEKLY_DAYS - 1} days`, !aged(WEEKLY_DAYS - 1))
check(`a silver worry IS asked again after ${WEEKLY_DAYS} days`, aged(WEEKLY_DAYS))
check('and after a fortnight', aged(14))

// ── AND THE WAY BACK ────────────────────────────────────────────────────────
check(
  'raising it again through a moment or DiGi brings it back at once',
  !build([10, 10], { raisedDaysAgo: 0 }).resting.has('c1'),
)
check(
  'a raise from BEFORE the good news does not',
  build([10, 10], { raisedDaysAgo: 30 }).resting.has('c1'),
)

// ── THE BASE, WHICH IS WHAT THE REPORT MEASURES FROM ────────────────────────
//
// Newest first in, so the first score is the LAST row. Getting this backwards
// would have every report saying a family had gone backwards.
const r = readScores(
  [{ concern_id: 'c1', score: 9, created_at: daysAgo(1) },
   { concern_id: 'c1', score: 6, created_at: daysAgo(4) },
   { concern_id: 'c1', score: 2, created_at: daysAgo(30) }],
  TOP_BAND,
)
check('the base is the FIRST score they ever gave', r.first.get('c1') === 2, String(r.first.get('c1')))
check('the last score is the most recent', r.last.get('c1') === 9, String(r.last.get('c1')))
check('the count is every score', r.count.get('c1') === 3, String(r.count.get('c1')))
check('the run counts only the unbroken end', r.topRun.get('c1') === 1, String(r.topRun.get('c1')))

// A skipped day is not a bad day: a null score must not break the run.
const skipped = readScores(
  [{ concern_id: 'c1', score: 10, created_at: daysAgo(1) },
   { concern_id: 'c1', score: null, created_at: daysAgo(2) },
   { concern_id: 'c1', score: 10, created_at: daysAgo(3) }],
  TOP_BAND,
)
check('a skipped day does not break the run', skipped.topRun.get('c1') === 2, String(skipped.topRun.get('c1')))

// ── THE RUNGS A REPORT NAMES ────────────────────────────────────────────────
check('never scored reads as new', rungOf(0, false) === 'new')
check('scored but not there yet reads as working', rungOf(1, true) === 'working')
check('two in a row reads as silver', rungOf(SILVER_RUN, true) === 'silver')

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
