import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseItemArray } from './parse-items'

test('a whole list reads as it is', () => {
  assert.deepEqual(parseItemArray('Here: [{"kind":"event","title":"Inset day"}]'), [{ kind: 'event', title: 'Inset day' }])
})

test('a list cut off mid item keeps every finished item', () => {
  const cut = '[{"kind":"event","title":"Inset day","due_date":"2026-12-04"},{"kind":"event","title":"Carol concert","due_date":"2026-12-15"},{"kind":"kit","title":"Bring a'
  assert.equal(parseItemArray(cut).length, 2)
})

test('brackets and braces inside a title do not confuse it', () => {
  const text = '[{"kind":"notice","title":"Wear red [or pink] {any}","detail":"He said \\"yes\\""},{"kind":"kit","title":"PE'
  const items = parseItemArray(text) as { title: string }[]
  assert.equal(items.length, 1)
  assert.equal(items[0].title, 'Wear red [or pink] {any}')
})

test('no list at all is an empty list', () => {
  assert.deepEqual(parseItemArray('Nothing to add.'), [])
  assert.deepEqual(parseItemArray('[]'), [])
})
