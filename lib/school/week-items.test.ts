import { test } from 'node:test'
import assert from 'node:assert/strict'
import { schoolItemsForWeek } from './week-items'

const WEEK = '2026-11-16' // a Monday

test('places a dated item on its day and child', () => {
  const items = schoolItemsForWeek([{ title: 'Spellings', kind: 'homework', due_date: '2026-11-18', child_id: 'b', recurs_weekday: null }], WEEK, ['a', 'b'])
  assert.deepEqual(items, [{ day: 2, child: 1, text: 'Due: Spellings' }])
})

test('puts a weekly kit day on every printed week', () => {
  const items = schoolItemsForWeek([{ title: 'PE kit', kind: 'kit', due_date: null, child_id: 'a', recurs_weekday: 4 }], WEEK, ['a'])
  assert.deepEqual(items, [{ day: 3, child: 0, text: 'PE kit' }])
})

test('leaves out weekends, other weeks and closed items', () => {
  const items = schoolItemsForWeek([
    { title: 'Party', kind: 'event', due_date: '2026-11-21', child_id: null, recurs_weekday: null },
    { title: 'Trip', kind: 'event', due_date: '2026-11-24', child_id: null, recurs_weekday: null },
    { title: 'Old', kind: 'event', due_date: '2026-11-17', child_id: null, recurs_weekday: null, status: 'done' },
    { title: 'Swim', kind: 'kit', due_date: null, child_id: null, recurs_weekday: 0 },
  ], WEEK, [])
  assert.deepEqual(items, [])
})

test('sends an unknown child to the family column', () => {
  const items = schoolItemsForWeek([{ title: 'Non uniform day', kind: 'event', due_date: '2026-11-20', child_id: 'zzz', recurs_weekday: null }], WEEK, ['a'])
  assert.equal(items[0].day, 4)
  assert.equal(items[0].child, null)
})
