// Run: npm run posthog-test (it runs this file too)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { speedBeforeSend } from './speed-policy'

const v = (url: string) => ({ type: 'vital' as const, url })

test('a public page is kept, without its query string', () => {
  assert.deepEqual(speedBeforeSend(v('https://www.guidedchildhood.com/is-roblox-safe-for-9-year-old?utm_source=school&x=1')),
    v('https://www.guidedchildhood.com/is-roblox-safe-for-9-year-old'))
  assert.ok(speedBeforeSend(v('https://www.guidedchildhood.com/')))
  assert.ok(speedBeforeSend(v('https://www.guidedchildhood.com/app-safety-guide')))
})

test('private pages and junk never leave', () => {
  assert.equal(speedBeforeSend(v('https://www.guidedchildhood.com/dashboard/digi?q=Olga')), null)
  assert.equal(speedBeforeSend(v('https://www.guidedchildhood.com/k/abc123')), null)
  assert.equal(speedBeforeSend(v('not a url')), null)
})
