import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextUp, whenWords, countLine, addDays, weekdayOf } from './next-up'

const TODAY = '2026-11-23' // a Monday
const item = (id: string, over: Record<string, unknown> = {}) => ({ id, kind: 'event', title: id, ...over })

test('every open item lands in exactly one list', () => {
  const items = [
    item('late', { due_date: '2026-11-20' }),
    item('today', { due_date: TODAY }),
    item('friday', { due_date: '2026-11-27' }),
    item('next week', { due_date: '2026-11-30' }),
    item('no date'),
    item('pe', { recurs_weekday: 4 }),
  ]
  const n = nextUp(items, TODAY)
  assert.equal(n.overdue.length + n.soon.length + n.later.length + n.undated.length, items.length)
  assert.deepEqual(n.overdue.map(e => e.item.id), ['late'])
  assert.deepEqual(n.soon.map(e => e.item.id), ['today', 'friday'])
  assert.deepEqual(n.later.map(e => e.item.id), ['pe', 'next week'])
  assert.deepEqual(n.undated.map(e => e.item.id), ['no date'])
})

test('a routine shows on its day and the day before, not all week', () => {
  const monday = nextUp([item('mon', { recurs_weekday: 1 }), item('tue', { recurs_weekday: 2 }), item('wed', { recurs_weekday: 3 })], TODAY)
  assert.deepEqual(monday.soon.map(e => e.item.id), ['mon', 'tue'])
  assert.equal(monday.soon[1].dateIso, '2026-11-24')
})

test('a routine ticked for today waits a week, and a resting one goes to later', () => {
  const ticked = nextUp([item('mon', { recurs_weekday: 1, cleared_on: TODAY })], TODAY)
  assert.equal(ticked.soon.length, 0)
  assert.equal(ticked.later[0].days, 7)
  const held = nextUp([item('mon', { recurs_weekday: 1 })], TODAY, () => true)
  assert.equal(held.soon.length, 0)
})

test('sooner comes first, and a time breaks a tie', () => {
  const n = nextUp([
    item('b', { due_date: TODAY, due_time: '15:00' }),
    item('a', { due_date: TODAY, due_time: '09:00' }),
  ], TODAY)
  assert.deepEqual(n.soon.map(e => e.item.id), ['a', 'b'])
})

test('the words and the count', () => {
  assert.equal(whenWords(0), 'Today')
  assert.equal(whenWords(1), 'Tomorrow')
  assert.equal(whenWords(4), 'In 4 days')
  assert.equal(whenWords(-1), 'Yesterday')
  assert.equal(whenWords(-3), '3 days late')
  assert.equal(countLine(nextUp([], TODAY)), 'Nothing in the next 7 days. Nothing overdue.')
  assert.equal(countLine(nextUp([item('x', { due_date: TODAY }), item('y', { due_date: '2026-11-01' })], TODAY)), '1 overdue. 1 thing in the next 7 days.')
  assert.equal(addDays('2026-11-30', 1), '2026-12-01')
  assert.equal(weekdayOf(TODAY), 1)
})
