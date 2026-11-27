import { test } from 'node:test'
import assert from 'node:assert/strict'
import { codeFromTyped } from './link'

test('a typed school code comes out as the link code, however it was typed', () => {
  assert.equal(codeFromTyped('st-marys-c-of-e-primary'), 'st-marys-c-of-e-primary')
  assert.equal(codeFromTyped('  St Marys C of E Primary. '), 'st-marys-c-of-e-primary')
  assert.equal(codeFromTyped('https://www.guidedchildhood.com/s/oldfield-park-junior?x=1'), 'oldfield-park-junior')
  assert.equal(codeFromTyped('guidedchildhood.com/s/Oldfield-Park-Junior'), 'oldfield-park-junior')
})

test('nothing usable is null', () => {
  assert.equal(codeFromTyped(''), null)
  assert.equal(codeFromTyped('ab'), null)
  assert.equal(codeFromTyped(null), null)
  assert.equal(codeFromTyped('!!!'), null)
})
