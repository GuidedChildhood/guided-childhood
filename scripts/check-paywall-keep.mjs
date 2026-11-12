#!/usr/bin/env node
// The ask quotes the family's own history (lib/paywall/what-you-keep.ts).
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-paywall-keep.mjs

import { keepsItems, bestMove, EMPTY_KEEP } from '../lib/paywall/what-you-keep.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const mv = (label, start, end, extra = {}) => ({
  concernId: label, label, status: 'open', childName: null,
  points: [{ at: '2026-11-01', score: start }, { at: '2026-11-12', score: end }],
  startScore: start, endScore: end, weeks: 1, observed: true, recurrences: 0, used: [], ...extra,
})

check('a rise is quoted', /went from 2 to 4/.test(bestMove([mv('Bedtime screens', 2, 4)], null) ?? ''))
check('a slip is never the reason to pay', bestMove([mv('Bedtime screens', 4, 2)], null) === null)
check('a hold is never quoted', bestMove([mv('Bedtime screens', 3, 3)], null) === null)
check('one score is not a line', bestMove([{ ...mv('Bedtime', 2, 4), points: [{ at: 'x', score: 2 }] }], null) === null)
check('the tracked worry wins', /Mood/.test(bestMove([mv('Bedtime', 1, 5), mv('Mood', 2, 3)], 'Mood') ?? ''))
check('else the biggest rise', /Bedtime/.test(bestMove([mv('Mood', 2, 3), mv('Bedtime', 1, 5)], null) ?? ''))
check('a named child leads the line', /^Teo: /.test(bestMove([mv('Bedtime', 2, 4, { childName: 'Teo' })], null) ?? ''))

const items = keepsItems({ ...EMPTY_KEEP, moved: 'Bedtime screens went from 2 to 4', scriptsWorked: 2, scriptsOpened: 5 })
check('the movement leads the list', items[0] === 'Bedtime screens went from 2 to 4')
check('scripts that worked replace scripts opened', items.some(i => /2 scripts you marked as working/.test(i)) && !items.some(i => /opened/.test(i)))
check('an empty family gets no invented line', keepsItems(EMPTY_KEEP).length === 0)
check('no dashes in any line', items.every(i => !/[–—]|\s-\s/.test(i)))

if (failures) { console.error(`\n${failures} failed`); process.exit(1) }
console.log('\ncheck-paywall-keep ok')
