// Early reminders for homework and projects, checked against the cases.
// Run: node --experimental-strip-types scripts/check-school-lead-up.mjs
import assert from 'node:assert/strict'
import { defaultLeadDays, leadDays, showFrom, toGo, leadMessage, daysBetween } from '../lib/school/lead-up.ts'

const added = '2026-11-19'
assert.equal(daysBetween(added, '2026-12-01'), 12)
assert.deepEqual(defaultLeadDays('homework', '2026-12-01', added), [7, 3], 'twelve days out: a week before and three days before')
assert.deepEqual(defaultLeadDays('homework', '2026-11-24', added), [3], 'five days out: three days before only')
assert.deepEqual(defaultLeadDays('homework', '2026-11-21', added), [], 'two days out: night before only')
assert.deepEqual(defaultLeadDays('kit', '2026-12-01', added), [], 'kit is a thing to bring, not work over days')

const project = { kind: 'homework', due_date: '2026-12-01', created_at: '2026-11-19T13:40:00Z' }
assert.equal(showFrom(project, added), '2026-11-24', 'the Anderson shelter shows on the bell a week before, not the day it is snapped')
assert.equal(showFrom({ ...project, remind_days: [3] }, added), '2026-11-28', 'a parent who keeps only three days before sees it then')
assert.equal(showFrom({ ...project, remind_days: [] }, added), '2026-11-29', 'both turned off: two days out, like any dated item')
assert.equal(showFrom({ kind: 'event', due_date: '2026-12-01' }, added), '2026-11-29')
assert.equal(showFrom({ kind: 'notice', due_date: null }, added), null, 'undated always shows')
assert.deepEqual(leadDays({ ...project, remind_days: [7, 1, 99] }, added), [7], 'only real choices survive')

assert.equal(toGo('2026-12-01', added), '12 days to go')
assert.equal(toGo('2026-11-20', added), 'tomorrow')
for (const m of [leadMessage('Anderson shelter project', 7, '2026-12-01', 'parent', 'Teo'), leadMessage('Anderson shelter project', 3, '2026-12-01', 'child')]) {
  assert.ok(!/[–—]/.test(m), 'no dashes')
}
assert.match(leadMessage('Anderson shelter project', 7, '2026-12-01', 'parent', 'Teo'), /Teo is due in a week \(Tue 1 Dec\)/)

console.log('check-school-lead-up ok: a week and three days before when there is room, the bell waits for the first reminder, choices respected')

// One letter, one item per piece of work.
const { mergeNearDuplicates: validateItems } = await import('../lib/school/merge-items.ts')
const merged = validateItems([
  { kind: 'homework', title: 'Build an Anderson shelter model', detail: 'Use a shoebox.', due_date: '2026-12-01' },
  { kind: 'homework', title: 'Hand in Anderson shelter project', detail: 'Bring it to class.', due_date: '2026-12-01' },
  { kind: 'kit', title: 'Bring PE kit', detail: null, due_date: '2026-12-01' },
  { kind: 'homework', title: 'Times tables practice', detail: null, due_date: '2026-12-01' },
])
assert.equal(merged.length, 3, 'the two Anderson shelter items are one')
assert.match(merged[0].detail, /shoebox.*class/)
console.log('check-school-lead-up ok: one letter, one item per piece of work')
