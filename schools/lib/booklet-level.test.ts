// Run: npm run booklet-level-test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { itemsFor, parseLevel, startedReason, wordBox, INCLUSION_CARDS } from './booklet-level'

const items = Array.from({ length: 6 }, (_, i) => ({ n: i + 1, item: `Card ${i + 1}` }))

test('a level is read safely, Expected by default', () => {
  assert.equal(parseLevel('adapted'), 'adapted')
  assert.equal(parseLevel(['inclusion']), 'inclusion')
  assert.equal(parseLevel('<script>'), 'expected')
  assert.equal(parseLevel(undefined), 'expected')
})

test('Inclusion keeps the first four cards, the others keep all', () => {
  assert.equal(itemsFor('inclusion', items).length, INCLUSION_CARDS)
  assert.equal(itemsFor('adapted', items).length, 6)
  assert.equal(itemsFor('expected', items).length, 6)
})

test('an Adapted reason starts the sentence, and keeps a card’s own stem', () => {
  assert.equal(startedReason({ n: 1, item: 'x' }), 'I think this because')
  assert.equal(startedReason({ n: 1, item: 'x', stem: 'A safe thing to do is...' }), 'A safe thing to do is')
})

test('the word box puts verdicts first, drops repeats and stops at eight', () => {
  const box = wordBox(['Share it', 'Keep it'], [{ word: 'private' }, { word: 'share it' }, ...Array.from({ length: 9 }, (_, i) => ({ word: `w${i}` }))])
  assert.deepEqual(box.slice(0, 3), ['Share it', 'Keep it', 'private'])
  assert.equal(box.length, 8)
})
