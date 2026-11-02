// Tests for what PostHog is allowed to see (lib/analytics/posthog-policy.ts).
// Run: npm run posthog-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isTrackedPath, cleanUrl, cleanEvent } from './posthog-policy'

const HOST = 'www.guidedchildhood.com'
const ev = (event: string, properties: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
  ({ uuid: 'u', event, properties, ...extra }) as Parameters<typeof cleanEvent>[0]

test('only the public pages are tracked', () => {
  for (const p of ['/', '/starter-pack', '/starter-pack/', '/free/planet-post', '/scripts?x=1']) assert.ok(isTrackedPath(p), p)
  for (const p of ['/k/abc123', '/home-code/ZX9', '/r/CODE', '/m/1', '/dashboard', '/onboarding', '/auth/callback', '/login', '/starter-packs', null]) {
    assert.ok(!isTrackedPath(p), String(p))
  }
})

test('URLs keep utm and ref, lose everything else', () => {
  assert.equal(cleanUrl(`https://${HOST}/starter-pack?utm_source=linkedin&school=ABC123&ref=jp`, HOST), `https://${HOST}/starter-pack?utm_source=linkedin&ref=jp`)
  assert.equal(cleanUrl('/starter-pack?video=tok', HOST), '/starter-pack')
  // A private page of ours shrinks to the bare host, or to nothing as a path.
  assert.equal(cleanUrl(`https://${HOST}/k/childtoken?x=1`, HOST), `https://${HOST}`)
  assert.equal(cleanUrl('/k/childtoken', HOST), '')
  // Somebody else's referrer keeps where it came from, not its query.
  assert.equal(cleanUrl('https://www.google.com/search?q=my+childs+name', HOST), 'https://www.google.com/search')
  assert.equal(cleanUrl('$direct', HOST), '$direct')
})

test('an event on a child page or the dashboard is dropped', () => {
  assert.equal(cleanEvent(ev('$pageview', { $current_url: `https://${HOST}/k/childtoken` }), HOST), null)
  assert.equal(cleanEvent(ev('$pageview', { $current_url: `https://${HOST}/dashboard` }), HOST), null)
  assert.equal(cleanEvent(ev('$pageview', {}), HOST), null, 'no page, no event')
})

test('a public pageview passes with every URL cleaned, $set_once included', () => {
  const out = cleanEvent(ev('$pageview', {
    $current_url: `https://${HOST}/starter-pack?utm_source=fb&school=ABC`,
    $referrer: `https://${HOST}/k/childtoken`,
    $prev_pageview_pathname: '/home-code/ZX9',
    $browser: 'Safari',
  }, { $set_once: { $initial_current_url: `https://${HOST}/starter-pack?video=tok` } }), HOST)
  assert.ok(out)
  assert.equal(out.properties.$current_url, `https://${HOST}/starter-pack?utm_source=fb`)
  assert.equal(out.properties.$referrer, `https://${HOST}`)
  assert.equal(out.properties.$prev_pageview_pathname, '')
  assert.equal(out.properties.$browser, 'Safari')
  assert.equal(out.$set_once?.$initial_current_url, `https://${HOST}/starter-pack`)
})

test('our own events carry only their named properties', () => {
  const at = { $current_url: `https://${HOST}/starter-pack` }
  const out = cleanEvent(ev('stage_check_step', { ...at, step: 'q2', childName: 'Ava', email: 'a@b.com', token: 'phc_key', distinct_id: 'anon' }), HOST)
  assert.ok(out)
  assert.equal(out.properties.step, 'q2')
  // PostHog refuses an event without these two (found in the browser run).
  assert.equal(out.properties.token, 'phc_key')
  assert.equal(out.properties.distinct_id, 'anon')
  assert.equal(out.properties.childName, undefined)
  assert.equal(out.properties.email, undefined)
  assert.equal(cleanEvent(ev('stage_check_step', { ...at, step: 'Ava' }), HOST), null, 'a step must be a real step')
  assert.ok(cleanEvent(ev('account_created', at), HOST))
})

test('events nobody named are dropped, autocapture included', () => {
  const at = { $current_url: `https://${HOST}/starter-pack` }
  assert.equal(cleanEvent(ev('$autocapture', { ...at, $el_text: 'Ava' }), HOST), null)
  assert.equal(cleanEvent(ev('$exception', at), HOST), null)
  assert.equal(cleanEvent(ev('anything_new', at), HOST), null)
})

test('link clicks carry a cleaned destination and a safe label, never text', () => {
  const at = { $current_url: `https://${HOST}/` }
  const out = cleanEvent(ev('link_click', { ...at, to: `https://${HOST}/starter-pack?school=ABC&utm_source=fb`, label: 'home-hero', text: 'Start Ava\'s plan' }), HOST)
  assert.ok(out)
  assert.equal(out.properties.to, `https://${HOST}/starter-pack?utm_source=fb`)
  assert.equal(out.properties.label, 'home-hero')
  assert.equal(out.properties.text, undefined)
  // A click towards a private page keeps only that it left for our own site.
  assert.equal(cleanEvent(ev('link_click', { ...at, to: '/k/childtoken' }), HOST)?.properties.to, '')
  // Somebody else's site: where, not the query.
  assert.equal(cleanEvent(ev('link_click', { ...at, to: 'https://www.instagram.com/p/x?igsh=abc' }), HOST)?.properties.to, 'https://www.instagram.com/p/x')
  // A label that is not a plain slug is refused, so free text cannot ride in on it.
  assert.equal(cleanEvent(ev('link_click', { ...at, to: '/', label: 'Ava Smith' }), HOST), null)
  // And a click on a private page is still dropped like everything else there.
  assert.equal(cleanEvent(ev('link_click', { $current_url: `https://${HOST}/dashboard`, to: '/' }), HOST), null)
})
