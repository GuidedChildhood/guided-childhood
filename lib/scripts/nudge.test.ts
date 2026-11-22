import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nudgeAllowed, pickScript, pushLine } from './nudge'

const now = new Date('2026-11-22T18:00:00Z')
const ago = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString()

test('two a week at most, never two within 20 hours', () => {
  assert.equal(nudgeAllowed([], now), true)
  assert.equal(nudgeAllowed([ago(30)], now), true)
  assert.equal(nudgeAllowed([ago(10)], now), false)
  assert.equal(nudgeAllowed([ago(30), ago(60)], now), false)
  assert.equal(nudgeAllowed([ago(30), ago(200)], now), true)
})

test('pinned first, never one that did not land, then the oldest sent', () => {
  const c = [{ sort_order: 1, say: 'a' }, { sort_order: 2, say: 'b' }, { sort_order: 3, say: 'c' }]
  assert.equal(pickScript(c, [3], [])?.sort_order, 3)
  assert.equal(pickScript(c, [3], [{ script_sort_order: 3, sent_at: ago(5), worked: 'not_this_time' }])?.sort_order, 1)
  assert.equal(pickScript(c, [], [{ script_sort_order: 1, sent_at: ago(5), worked: null }, { script_sort_order: 2, sent_at: ago(50), worked: null }])?.sort_order, 3)
  assert.equal(pickScript([], [], []), null)
})

test('push line cuts at a word', () => {
  assert.equal(pushLine('short one'), 'short one')
  assert.ok(pushLine('word '.repeat(60)).endsWith('...'))
  assert.ok(pushLine('word '.repeat(60)).length <= 143)
})
