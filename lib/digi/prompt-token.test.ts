// Tests for the sealed DiGi question (lib/digi/prompt-token.ts).
// Run: npm run digi-handoff-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sealDigiPrompt, openDigiPrompt, digiPromptHref, resealDigiHref } from './prompt-token'

const WORDS = 'Olga asked to keep her phone till nine. Can we talk it through?'

test('a sealed question opens for the parent it was sealed for, and only them', () => {
  const t = sealDigiPrompt('parent-a', WORDS, 'draft')
  assert.ok(!t.includes('Olga'))
  assert.deepEqual(openDigiPrompt(t, 'parent-a'), { text: WORDS, mode: 'draft' })
  assert.equal(openDigiPrompt(t, 'parent-b'), null)
})

test('a tampered, foreign or empty token opens nothing', () => {
  const t = sealDigiPrompt('parent-a', WORDS)
  const flipped = t.slice(0, -3) + (t.at(-3) === 'A' ? 'B' : 'A') + t.slice(-2)
  for (const bad of [flipped, 'v1.abc', 'd1.', '', null, undefined, 'd1.' + 'x'.repeat(4000)]) {
    assert.equal(openDigiPrompt(bad, 'parent-a'), null, String(bad).slice(0, 20))
  }
})

test('the href keeps the child and device and carries no words', () => {
  const href = digiPromptHref('parent-a', WORDS, { child: 'c-1', device: 'ipad' })
  const url = new URL(href, 'https://x.invalid')
  assert.equal(url.pathname, '/dashboard/digi')
  assert.equal(url.searchParams.get('child'), 'c-1')
  assert.equal(url.searchParams.get('device'), 'ipad')
  assert.equal(url.searchParams.get('q'), null)
  assert.ok(!decodeURIComponent(href).includes('Olga'))
  assert.deepEqual(openDigiPrompt(url.searchParams.get('p'), 'parent-a'), { text: WORDS, mode: 'send' })
})

test('an old card href with words is resealed; anything else is left alone', () => {
  const oldQ = `/dashboard/digi?child=c-1&q=${encodeURIComponent(WORDS)}`
  const sealedQ = resealDigiHref(oldQ, 'parent-a')!
  assert.ok(!decodeURIComponent(sealedQ).includes('Olga'))
  const q = new URL(sealedQ, 'https://x.invalid').searchParams
  assert.equal(q.get('child'), 'c-1')
  assert.deepEqual(openDigiPrompt(q.get('p'), 'parent-a'), { text: WORDS, mode: 'send' })

  const oldAsk = `/dashboard/digi?ask=${encodeURIComponent(WORDS)}`
  const a = new URL(resealDigiHref(oldAsk, 'parent-a')!, 'https://x.invalid').searchParams
  assert.equal(openDigiPrompt(a.get('p'), 'parent-a')?.mode, 'draft')

  for (const href of ['/dashboard/lessons', '/dashboard/digi', '/dashboard/digi?child=c-1', '/dashboard/digi-history?q=x']) {
    assert.equal(resealDigiHref(href, 'parent-a'), href)
  }
  assert.equal(resealDigiHref(null, 'parent-a'), null)
})
