import { test } from 'node:test'
import assert from 'node:assert/strict'
import { askDue, askToken, askTokenValid, ASK_QUESTIONS } from './stalled'

const ID = '17203aa7-0ea2-49ca-a085-a8dbcb0d5c0d'

test('nothing is asked in the first two days', () => {
  assert.equal(askDue(2, {}), null)
  assert.equal(askDue(3, {}), 'ask-1')
})

test('each ask waits on the one before it, then silence', () => {
  assert.equal(askDue(6, { 'ask-1': 3 }), null)
  assert.equal(askDue(7, { 'ask-1': 4 }), 'ask-2')
  assert.equal(askDue(13, { 'ask-1': 10, 'ask-2': 6 }), null)
  assert.equal(askDue(14, { 'ask-1': 11, 'ask-2': 7 }), 'ask-3')
  assert.equal(askDue(90, { 'ask-1': 80, 'ask-2': 70, 'ask-3': 60 }), null)
})

test('a token opens only its own parent, and an unsubscribe shaped one opens nothing', () => {
  assert.equal(askTokenValid(ID, askToken(ID)), true)
  assert.equal(askTokenValid('27203aa7-0ea2-49ca-a085-a8dbcb0d5c0d', askToken(ID)), false)
  assert.equal(askTokenValid(ID, 'x'.repeat(32)), false)
  assert.equal(askTokenValid(ID, null), false)
})

test('question one is a tap and every key is unique', () => {
  assert.ok((ASK_QUESTIONS[0].options ?? []).length >= 4)
  assert.equal(new Set(ASK_QUESTIONS.map(q => q.key)).size, ASK_QUESTIONS.length)
})
