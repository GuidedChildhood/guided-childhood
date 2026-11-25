// School dates land in the right year, checked against the calendar that broke it.
// Run: node --experimental-strip-types scripts/check-school-years.mjs
import assert from 'node:assert/strict'
import { fixYears, yearFromWeekday } from '../lib/school/fix-years.ts'

const today = '2026-11-25'
// The model said 2027; 3 February is a Tuesday in 2026, so the words name 2026.
assert.equal(yearFromWeekday('Parents evening on Tuesday 3 February.', '2027-02-03', today), '2026-02-03')
// A printed year is kept, even when it is in the past.
assert.equal(yearFromWeekday('Poetry Performance on Wednesday 26 November 2025, 14:00.', '2025-11-26', today), '2025-11-26')
// Already the right weekday: untouched.
assert.equal(yearFromWeekday('Anderson shelter due Tuesday 1 December.', '2026-12-01', today), '2026-12-01')
// A weekday that fits a year still to come moves forward to it.
assert.equal(yearFromWeekday('Sports day on Thursday 17 June.', '2026-06-17', today), '2027-06-17')
// The text is about another day: leave the model's date alone.
assert.equal(yearFromWeekday('Letters went home on Monday 2 November.', '2026-12-01', today), null)
// No weekday written: nothing to go on.
assert.equal(yearFromWeekday('Bring wellies on 3 December.', '2026-12-03', today), null)

const out = fixYears([
  { title: 'Attend Reception parents evening', detail: 'Parents evening on Tuesday 3 February.', due_date: '2027-02-03' },
  { title: 'Attend Poetry Performance', detail: 'On Wednesday 26 November 2025.', due_date: '2025-11-26' },
  { title: 'Hand in project', detail: 'Due Tuesday 1 December.', due_date: '2026-12-01' },
  { title: 'Check ClassDojo', detail: null, due_date: null },
], today)
assert.deepEqual(out.map(o => [o.due_date, o.past === true]), [['2026-02-03', true], ['2025-11-26', true], ['2026-12-01', false], [null, false]])

console.log('check-school-years ok: a written weekday decides the year, a printed year is kept, passed dates are marked')
