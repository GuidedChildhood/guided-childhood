// Tests for where a parent lands after signing up or signing in
// (lib/auth/safe-next.ts, lib/starter/next.ts). Run: npm run share-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { safeNext, safeStarterNext, packStarterNext, unpackStarterNext, STARTER_NEXT_MAX_AGE_MS } from './safe-next'

test('a same site path comes back whole, query and hash kept', () => {
  assert.equal(safeNext('/dashboard/agreement'), '/dashboard/agreement')
  assert.equal(safeNext('/dashboard/setup#share'), '/dashboard/setup#share')
  assert.equal(safeNext('/from-school/ks2-06-how-algorithms-work/1a2b3c4d.0011223344556677'), '/from-school/ks2-06-how-algorithms-work/1a2b3c4d.0011223344556677')
  assert.equal(safeNext('/dashboard/lessons?home=7K3F'), '/dashboard/lessons?home=7K3F')
})

test('anything that could leave the site is refused', () => {
  for (const bad of [
    '//evil.example', '//evil.example/dashboard', '/\\evil.example', '\\\\evil.example',
    'https://evil.example', 'http:/evil.example', '@evil.example', 'evil.example',
    'javascript:alert(1)', '/\t/evil.example', '/\n/evil.example', ' //evil.example',
    '', '   ', null, undefined, 42, {}, '/' + 'a'.repeat(600),
  ]) assert.equal(safeNext(bad), null, String(bad))
})

test('the callback can no longer be aimed at another host', () => {
  // The old code: `${origin}${next}`. With next=@evil.example that is another host.
  const origin = 'https://www.guidedchildhood.com'
  assert.equal(new URL(`${origin}@evil.example`).host, 'evil.example')
  const next = safeNext('@evil.example') ?? '/dashboard'
  assert.equal(new URL(`${origin}${next}`).host, 'www.guidedchildhood.com')
})

test('the starter pack only sends a new account to the places it names', () => {
  assert.equal(safeStarterNext('/dashboard/setup#share'), '/dashboard/setup#share')
  assert.equal(safeStarterNext('/dashboard/agreement'), '/dashboard/agreement')
  assert.equal(safeStarterNext('/dashboard'), '/dashboard')
  assert.equal(safeStarterNext('/from-school/ks1-03-real-pretend-computer/1a2b3c4d.0011223344556677'), '/from-school/ks1-03-real-pretend-computer/1a2b3c4d.0011223344556677')
  assert.equal(safeStarterNext('/home-code/7K3F'), '/home-code/7K3F')
  for (const bad of ['/api/account/delete', '/dashboards', '/from-school', '/login', '/', '//evil.example', 'https://evil.example']) {
    assert.equal(safeStarterNext(bad), null, bad)
  }
})

test('the kept next survives a round trip and expires', () => {
  const now = 1_800_000_000_000
  const packed = packStarterNext('/dashboard/agreement', now)
  assert.equal(unpackStarterNext(packed, now + 1000), '/dashboard/agreement')
  assert.equal(unpackStarterNext(packed, now + STARTER_NEXT_MAX_AGE_MS + 1), null)
  // A value somebody wrote into localStorage by hand is checked again.
  assert.equal(unpackStarterNext(JSON.stringify({ next: '//evil.example', at: now }), now), null)
  assert.equal(unpackStarterNext('not json', now), null)
  assert.equal(unpackStarterNext(null, now), null)
})
