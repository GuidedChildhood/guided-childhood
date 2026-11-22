import { test } from 'node:test'
import assert from 'node:assert/strict'
import { momentFor, MOMENTS } from './moments'

test('files the scripts from the screenshot under the right moment', () => {
  assert.equal(momentFor({ title: 'The Just Five More Minutes Loop' }), 'turning-off')
  assert.equal(momentFor({ title: 'Phone constantly out at meals' }), 'meals')
  assert.equal(momentFor({ title: 'Impossible to wake after a late night' }), 'bedtime')
  assert.equal(momentFor({ title: 'Sharing the screen with a younger sibling' }), 'siblings')
  assert.equal(momentFor({ title: 'The Before School Phone Argument' }), 'mornings')
  assert.equal(momentFor({ title: 'Someone they do not know messaged them in a game' }), 'online')
  assert.equal(momentFor({ title: 'They say everyone else has a phone' }), 'phone')
  assert.equal(momentFor({ title: 'Lost the match and slammed the controller' }), 'feelings')
})

test('falls back to the category, then to nothing', () => {
  assert.equal(momentFor({ title: 'Homework done by AI', category: 'school-and-ai' }), null)
  assert.equal(momentFor({ title: 'A quiet one', category: 'gaming' }), 'turning-off')
})

test('eight moments, each with a label and a hint', () => {
  assert.equal(MOMENTS.length, 8)
  for (const m of MOMENTS) assert.ok(m.label && m.hint && m.emoji)
})
