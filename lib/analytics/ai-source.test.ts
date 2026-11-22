// Tests for the AI search tagging (lib/analytics/ai-source.ts) and how the
// PostHog policy carries it. Run: npm run posthog-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { aiSourceOf } from './ai-source'
import { cleanEvent } from './posthog-policy'

const HOST = 'www.guidedchildhood.com'
const ev = (event: string, properties: Record<string, unknown>) =>
  ({ uuid: 'u', event, properties }) as Parameters<typeof cleanEvent>[0]

test('the four named AI tools, and Copilot, are read from the referrer', () => {
  assert.equal(aiSourceOf('https://chatgpt.com/', ''), 'chatgpt')
  assert.equal(aiSourceOf('https://www.perplexity.ai/search/abc', ''), 'perplexity')
  assert.equal(aiSourceOf('https://gemini.google.com/app/123', ''), 'gemini')
  assert.equal(aiSourceOf('https://claude.ai/chat/xyz', ''), 'claude')
  assert.equal(aiSourceOf('https://copilot.microsoft.com/', ''), 'copilot')
})

test('utm_source works when the referrer is stripped', () => {
  assert.equal(aiSourceOf('', '?utm_source=chatgpt.com'), 'chatgpt')
  assert.equal(aiSourceOf(null, '?utm_source=perplexity'), 'perplexity')
  assert.equal(aiSourceOf(undefined, '?utm_source=Claude.ai&utm_medium=x'), 'claude')
})

test('everything else is not an AI visit', () => {
  assert.equal(aiSourceOf('https://www.google.com/search?q=x', ''), null)
  assert.equal(aiSourceOf('https://google.com/', '?utm_source=linkedin'), null)
  assert.equal(aiSourceOf('https://notchatgpt.com/', ''), null, 'a lookalike host is not ChatGPT')
  assert.equal(aiSourceOf('not a url', ''), null)
  assert.equal(aiSourceOf('', ''), null)
})

test('ai_source rides on a pageview and on our own events, and only a known value', () => {
  const page = cleanEvent(ev('$pageview', { $current_url: `https://${HOST}/guides`, ai_source: 'chatgpt' }), HOST)
  assert.equal(page?.properties.ai_source, 'chatgpt')
  const step = cleanEvent(ev('stage_check_step', { $current_url: `https://${HOST}/starter-pack`, step: 'q1', ai_source: 'claude' }), HOST)
  assert.equal(step?.properties.ai_source, 'claude')
  const odd = cleanEvent(ev('$pageview', { $current_url: `https://${HOST}/guides`, ai_source: 'https://chatgpt.com/c/secret' }), HOST)
  assert.ok(odd && !('ai_source' in odd.properties), 'a value that is not a short name is dropped')
})

test('ai_referral passes with a known source and is dropped without one', () => {
  assert.equal(cleanEvent(ev('ai_referral', { $current_url: `https://${HOST}/`, ai_source: 'gemini' }), HOST)?.properties.ai_source, 'gemini')
  assert.equal(cleanEvent(ev('ai_referral', { $current_url: `https://${HOST}/` }), HOST), null)
  assert.equal(cleanEvent(ev('ai_referral', { $current_url: `https://${HOST}/dashboard`, ai_source: 'gemini' }), HOST), null)
})
