// What moves the pathway, and what does not.
//
// Justin, 10 August 2026, twice: "it doesn't update if I read it", and then
// "once read through needs to update pathway."
//
// This is the rule that has now been changed twice in opposite directions, so
// it gets a check rather than a comment. Migration 157 stopped opening from
// counting, for a good reason. Migration 183 lets READING count, for a good
// reason. The distinction between the two is the whole thing, and it is exactly
// the kind of distinction that erodes silently the next time somebody touches
// the filter.
//
// Usage: node --experimental-strip-types scripts/check-script-progress.mjs

import { COUNTS_TOWARD_PATHWAY } from '../lib/pathway/script-status.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── The rule ────────────────────────────────────────────────────────────────
check('a page that merely rendered counts for nothing', !COUNTS_TOWARD_PATHWAY.has('opened'))
check('reading it through counts', COUNTS_TOWARD_PATHWAY.has('read'))
check('using it counts', COUNTS_TOWARD_PATHWAY.has('used'))
check('and so does saying it does not apply', COUNTS_TOWARD_PATHWAY.has('not_needed'))

// The set is exactly these three. A fourth status added later should have to
// come here and make the decision on purpose rather than inherit it from a
// "not opened" test that quietly says yes to everything new.
check('nothing else has been let in', COUNTS_TOWARD_PATHWAY.size === 3,
  [...COUNTS_TOWARD_PATHWAY].join(', '))

// ── Percentages a parent would recognise ────────────────────────────────────
const pct = rows => {
  const done = rows.filter(r => COUNTS_TOWARD_PATHWAY.has(r)).length
  return Math.round((done / rows.length) * 100)
}
check('browsing five and reading none is nought per cent',
  pct(['opened', 'opened', 'opened', 'opened', 'opened']) === 0)
check('reading all five is a hundred',
  pct(['read', 'read', 'read', 'read', 'read']) === 100)
check('reading one of five is twenty',
  pct(['read', 'opened', 'opened', 'opened', 'opened']) === 20,
  `${pct(['read', 'opened', 'opened', 'opened', 'opened'])}%`)
check('a mixed week adds up honestly',
  pct(['used', 'read', 'not_needed', 'opened', 'opened']) === 60,
  `${pct(['used', 'read', 'not_needed', 'opened', 'opened'])}%`)

// ── The thing 157 was written to stop, still stopped ────────────────────────
//
// Ten scripts opened and closed without being read is a parent browsing, and it
// must still be worth nothing. This is the assertion that would have caught the
// regression if 183 had been implemented as "count everything".
const browsed = Array.from({ length: 10 }, () => 'opened')
check('a browse through ten still moves nothing', pct(browsed) === 0)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
