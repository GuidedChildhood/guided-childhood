// Who gets the day one "open their app tonight" email. Run: npm run awaiting-app-test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { childrenAwaitingApp, type FamilyHandover, type ChildHandover } from './settled'
import { openTheirAppEmail } from '../email/templates'

const kid = (id: string, over: Partial<ChildHandover> = {}): ChildHandover =>
  ({ id, name: id, ageBand: '11-13', noPhone: false, noPhoneAt: null, useMode: null, ...over })
const fam = (children: ChildHandover[], choice: string | null = null): FamilyHandover => ({ choice, children })

test('a linked child who has never opened the app is waiting', () => {
  const f = fam([kid('a'), kid('b')])
  assert.deepEqual(childrenAwaitingApp(f, [{ child_id: 'a', last_seen_at: null }, { child_id: 'b', last_seen_at: null }]).map(c => c.id), ['a', 'b'])
})

test('a child who has opened it is not', () => {
  const f = fam([kid('a'), kid('b')])
  assert.deepEqual(childrenAwaitingApp(f, [{ child_id: 'a', last_seen_at: '2026-11-27T18:00:00Z' }]).map(c => c.id), ['b'])
})

test('no device, paper, co view and the youngest band are never asked', () => {
  assert.equal(childrenAwaitingApp(fam([kid('a', { noPhone: true })]), []).length, 0)
  assert.equal(childrenAwaitingApp(fam([kid('a')], 'paper'), []).length, 0)
  assert.equal(childrenAwaitingApp(fam([kid('a', { useMode: 'coview' })]), []).length, 0)
  assert.equal(childrenAwaitingApp(fam([kid('a', { ageBand: '4-7' })]), []).length, 0)
})

test('the email names the children and carries no dash', () => {
  const e = openTheirAppEmail({ childNames: ['Mia', 'Leo'], unsubscribe: 'https://x/u' })
  assert.match(e.subject, /Mia and Leo/)
  assert.match(e.html, /dashboard\/quests\?share=1/)
  assert.doesNotMatch(e.subject + e.html.replace(/<[^>]+>/g, ''), /\s[–—-]\s/)
  const one = openTheirAppEmail({ childNames: ['Your child'], unsubscribe: 'https://x/u' })
  assert.match(one.subject, /their app/)
})
