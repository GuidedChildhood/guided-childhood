// The two founder gates, the hash binding, the audit trail and idempotent
// publishing, against the real workflow on a throwaway file store.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FileStore } from '../engine/store'
import { authorise, authorisationFor, current, decideStory, GateError, transition, type Actor } from '../engine/workflow'

const routine: Actor = { kind: 'automation', id: 'test-routine' }
const justin: Actor = { kind: 'founder', id: 'justin' }
const fresh = () => new FileStore(mkdtempSync(join(tmpdir(), 'planet-')))

async function toReview(store: FileStore, n = 1) {
  await transition(store, n, 'RESEARCHED', routine)
  await transition(store, n, 'VERIFIED', routine)
  await transition(store, n, 'EDITORIAL_REVIEW', routine, { storiesHash: 'proposal-a' })
}
async function toProof(store: FileStore, n = 1) {
  await toReview(store, n)
  await transition(store, n, 'APPROVED', justin, { storiesHash: 'proposal-a', reviewedHash: 'proposal-a' })
  await transition(store, n, 'DESIGNING', routine)
  await transition(store, n, 'PROOF_READY', routine, { contentHash: 'c1', pdfHash: 'p1', renderOk: true })
}

test('the routine cannot open either founder gate', async () => {
  const store = fresh()
  await toReview(store)
  await assert.rejects(transition(store, 1, 'APPROVED', routine, { storiesHash: 'proposal-a' }), GateError)
  const s = fresh()
  await toProof(s)
  await assert.rejects(transition(s, 1, 'FINAL_APPROVED', routine, { contentHash: 'c1', pdfHash: 'p1' }), GateError)
})

test('a refused move is recorded in the audit trail', async () => {
  const store = fresh()
  await toReview(store)
  await assert.rejects(transition(store, 1, 'APPROVED', routine, { storiesHash: 'proposal-a' }))
  const ev = await store.events(1)
  assert.equal(ev.at(-1)?.action, 'refused')
  assert.equal(ev.filter(e => e.action === 'transition').length, 3)
})

test('states cannot be skipped, even by the founder', async () => {
  const store = fresh()
  await assert.rejects(transition(store, 1, 'PROOF_READY', justin, { contentHash: 'c', pdfHash: 'p', renderOk: true }), GateError)
  await assert.rejects(transition(store, 1, 'PUBLISHED', justin), GateError)
})

test('approval one refuses a stale screen, and records a changed selection', async () => {
  const store = fresh()
  await toReview(store)
  await assert.rejects(transition(store, 1, 'APPROVED', justin, { storiesHash: 'mine', reviewedHash: 'an-old-proposal' }), /changed since/)
  await transition(store, 1, 'APPROVED', justin, { storiesHash: 'justins-own-selection', reviewedHash: 'proposal-a' })
  assert.equal((await current(store, 1)).storiesHash, 'justins-own-selection')
})

test('story decisions happen only at editorial review, and only by the founder', async () => {
  const store = fresh()
  await assert.rejects(decideStory(store, 1, 'c01', 'approved', justin), /editorial review/)
  await toReview(store)
  await assert.rejects(decideStory(store, 1, 'c01', 'approved', routine), /founder/)
  await decideStory(store, 1, 'c01', 'rejected', justin, 'not this month')
  assert.deepEqual((await store.storyDecisions(1)).c01, { decision: 'rejected', note: 'not this month' })
})

test('a proof needs a clean render', async () => {
  const store = fresh()
  await toReview(store)
  await transition(store, 1, 'APPROVED', justin, { storiesHash: 'proposal-a' })
  await transition(store, 1, 'DESIGNING', routine)
  await assert.rejects(transition(store, 1, 'PROOF_READY', routine, { contentHash: 'c', pdfHash: 'p', renderOk: false }), /render report/)
})

test('approval two binds the exact proof, and publication the exact files', async () => {
  const store = fresh()
  await toProof(store)
  await assert.rejects(transition(store, 1, 'FINAL_APPROVED', justin, { contentHash: 'c1', pdfHash: 'a-different-pdf' }), /different proof/)
  await transition(store, 1, 'FINAL_APPROVED', justin, { contentHash: 'c1', pdfHash: 'p1' })
  await assert.rejects(transition(store, 1, 'PUBLISHED', justin, { contentHash: 'c2-edited-after', pdfHash: 'p1' }), /changed since final approval/)
  await assert.rejects(transition(store, 1, 'PUBLISHED', justin, { contentHash: 'c1', pdfHash: 'p2' }), /not the PDF that was approved/)
  await transition(store, 1, 'PUBLISHED', justin, { contentHash: 'c1', pdfHash: 'p1' })
  assert.equal((await current(store, 1)).state, 'PUBLISHED')
})

test('asking for revisions after approval voids the approval', async () => {
  const store = fresh()
  await toProof(store)
  await transition(store, 1, 'FINAL_APPROVED', justin, { contentHash: 'c1', pdfHash: 'p1' })
  await transition(store, 1, 'DESIGNING', justin, { note: 'one more change' })
  const s = await current(store, 1)
  assert.equal(s.approvedPdfHash, undefined)
  assert.equal(s.approvedContentHash, undefined)
})

test('the routine can publish only under an authorisation for this PDF and channel', async () => {
  const store = fresh()
  await toProof(store)
  await assert.rejects(authorise(store, 1, ['website'], justin), /final approval/)
  await transition(store, 1, 'FINAL_APPROVED', justin, { contentHash: 'c1', pdfHash: 'p1' })
  await assert.rejects(authorise(store, 1, ['website'], routine), /founder/)
  await authorise(store, 1, ['website', 'drive'], justin)
  assert.equal((await authorisationFor(store, 1, 'website', 'p1'))?.id, 'justin')
  assert.equal(await authorisationFor(store, 1, 'mailchimp', 'p1'), null)
  assert.equal(await authorisationFor(store, 1, 'website', 'some-other-pdf'), null)
})

test('the routine opens next month only after final approval, in week one, and never writes over a real issue', async () => {
  const { openNextIssue, isOpen } = await import('../automation/cycle')
  assert.equal(openNextIssue('PROOF_READY', new Date(Date.UTC(2026, 10, 2))), null, 'not before the last issue is approved')
  assert.equal(openNextIssue('FINAL_APPROVED', new Date(Date.UTC(2026, 10, 20))), null, 'not after the first week')
  assert.equal(isOpen(2), false, 'the sample Issue 002 is not an edition until its month opens it')
})
