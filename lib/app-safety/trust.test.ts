// Tests for the free check and the page addresses. Run: npm run app-safety-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkTrust, type CheckApp } from './trust'
import { gapFor } from './ages'
import { parseSegment, appPath, agePath } from './content'

const TIKTOK: CheckApp = { name: 'TikTok', minAge: 13, rule: 'TikTok sets its own minimum age at 13', firstControl: 'Family Pairing', hasUnderAgeOption: false, underAgeText: '' }

test('never a verdict and never a score: five letters, each a status and a step', () => {
  const r = checkTrust(TIKTOK, { age: 9, use: 'lots', worries: ['strangers', 'sleep'] })
  assert.equal(r.letters.length, 5)
  for (const l of r.letters) {
    assert.ok(['start', 'work', 'ok'].includes(l.status))
    assert.ok(l.step.length > 40, `${l.id} has a real step`)
    assert.doesNotMatch(l.step, /\b(?:yes|no)\b[,.]?$|\bnot ready\b|\bready\b|\bsafe\b|\d+\s*(?:%|out of|\/)/i, `${l.id} gives no verdict or score`)
    assert.doesNotMatch(l.step, /[‐-―]|\s-\s/, `${l.id} has no dashes`)
  }
})

test('connection leads when the parent fears they would not be told', () => {
  const r = checkTrust(TIKTOK, { age: 14, use: 'most-days', worries: ['secret', 'strangers'] })
  assert.equal(r.lead, 'relationships')
})

test('a nine year old on TikTok every day starts with timing only when nothing else is a start', () => {
  const r = checkTrust(TIKTOK, { age: 9, use: 'most-days', worries: [] })
  assert.equal(r.letters.find(l => l.id === 'timing')?.status, 'start')
  assert.equal(r.lead, 'timing')
})

test('the step names the app and its own control', () => {
  const r = checkTrust(TIKTOK, { age: 13, use: 'sometimes', worries: ['strangers'] })
  assert.match(r.letters.find(l => l.id === 'upstream')!.step, /Family Pairing/)
})

test('gap bands', () => {
  assert.equal(gapFor(6, 13), 'well-under')
  assert.equal(gapFor(10, 13), 'under')
  assert.equal(gapFor(12, 13), 'nearly')
  assert.equal(gapFor(13, 13), 'at')
  assert.equal(gapFor(15, 13), 'past')
  assert.equal(gapFor(8, 5), 'designed-for')
})

test('addresses round trip, and nothing else parses', () => {
  assert.deepEqual(parseSegment(appPath('youtube-kids').slice(1)), { slug: 'youtube-kids', age: null })
  assert.deepEqual(parseSegment(agePath('character-ai', 11).slice(1)), { slug: 'character-ai', age: 11 })
  for (const s of ['tiktok', 'is-tiktok', 'is-tiktok-safe-for-nine-year-old', 'guides']) assert.equal(parseSegment(s), null, s)
})
