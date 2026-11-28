import { test } from 'node:test'
import assert from 'node:assert/strict'
import { comebackVerdict, comebackToken, comebackTokenValid, comebackUrl, COMEBACK_DAYS } from './comeback'

const NOW = Date.parse('2026-11-28T12:00:00Z')
const DAY = 86400000
const id = '11111111-2222-3333-4444-555555555555'

test('a lapsed family gets seven days from now', () => {
  const v = comebackVerdict({ subscription_status: null, trial_ends_at: new Date(NOW - 10 * DAY).toISOString(), created_at: null }, false, NOW, 4)
  assert.equal(v.grant, true)
  if (v.grant) assert.equal(Date.parse(v.trialEndsAt), NOW + COMEBACK_DAYS * DAY)
})

test('a cancelled subscriber counts as lapsed', () => {
  const v = comebackVerdict({ subscription_status: 'canceled', trial_ends_at: new Date(NOW - DAY).toISOString(), created_at: null }, false, NOW, 4)
  assert.equal(v.grant, true)
})

test('once per family', () => {
  const v = comebackVerdict({ subscription_status: null, trial_ends_at: new Date(NOW - DAY).toISOString(), created_at: null }, true, NOW, 4)
  assert.deepEqual(v, { grant: false, reason: 'used' })
})

test('never for a paying member', () => {
  for (const s of ['active', 'past_due', 'trialing']) {
    const v = comebackVerdict({ subscription_status: s, trial_ends_at: null, created_at: null }, false, NOW, 4)
    assert.deepEqual(v, { grant: false, reason: 'paying' })
  }
})

test('not while the free days are still running', () => {
  const v = comebackVerdict({ subscription_status: null, trial_ends_at: new Date(NOW + DAY).toISOString(), created_at: null }, false, NOW, 4)
  assert.deepEqual(v, { grant: false, reason: 'still_free' })
})

test('no trial date falls back to sign up plus the trial', () => {
  const fresh = comebackVerdict({ subscription_status: null, trial_ends_at: null, created_at: new Date(NOW - DAY).toISOString() }, false, NOW, 4)
  assert.deepEqual(fresh, { grant: false, reason: 'still_free' })
  const old = comebackVerdict({ subscription_status: null, trial_ends_at: null, created_at: new Date(NOW - 30 * DAY).toISOString() }, false, NOW, 4)
  assert.equal(old.grant, true)
})

test('the link token is checked, and is not the unsubscribe or ask token', () => {
  assert.equal(comebackTokenValid(id, comebackToken(id)), true)
  assert.equal(comebackTokenValid(id, comebackToken('99999999-2222-3333-4444-555555555555')), false)
  assert.equal(comebackTokenValid(id, 'x'.repeat(32)), false)
  assert.equal(comebackTokenValid('not-a-uuid', comebackToken('not-a-uuid')), false)
  assert.match(comebackUrl(id), /\/api\/comeback\?u=.+&k=[0-9a-f]{32}$/)
})

// A fake database that keeps the one rule the real one does: the claim row is
// unique per family.
function fakeDb(profile: { subscription_status: string | null; trial_ends_at: string | null; created_at: string | null } | null, opts: { failWrite?: boolean } = {}) {
  const claims = new Set<string>()
  const state = { profile, claims }
  const db = {
    async profile() { return state.profile },
    async used(u: string) { return claims.has(u) },
    async claim(u: string) { if (claims.has(u)) return false; claims.add(u); return true },
    async setTrialEnd(_u: string, iso: string) { if (opts.failWrite) return false; state.profile = { ...state.profile!, trial_ends_at: iso }; return true },
    async unclaim(u: string) { claims.delete(u) },
  }
  return { db, state }
}

test('the grant opens the week, and a second tap is refused', async () => {
  const { grantComeback, checkComeback } = await import('./comeback')
  const { db, state } = fakeDb({ subscription_status: null, trial_ends_at: new Date(NOW - 5 * DAY).toISOString(), created_at: null })
  assert.deepEqual(await checkComeback(db, id, NOW, 4), { kind: 'offer' })
  const first = await grantComeback(db, id, NOW, 4)
  assert.equal(first.kind, 'granted')
  assert.equal(Date.parse(state.profile!.trial_ends_at!), NOW + 7 * DAY)
  // Inside the new week the family is in free days, so a second tap finds it used.
  assert.deepEqual(await grantComeback(db, id, NOW, 4), { kind: 'refused', reason: 'used' })
  // And after the week ends it is still used, never a second week.
  assert.deepEqual(await grantComeback(db, id, NOW + 10 * DAY, 4), { kind: 'refused', reason: 'used' })
})

test('two devices at once grant one week', async () => {
  const { grantComeback } = await import('./comeback')
  const { db } = fakeDb({ subscription_status: null, trial_ends_at: new Date(NOW - 5 * DAY).toISOString(), created_at: null })
  const [a, b] = await Promise.all([grantComeback(db, id, NOW, 4), grantComeback(db, id, NOW, 4)])
  assert.deepEqual([a.kind, b.kind].sort(), ['granted', 'refused'])
})

test('a failed write hands the chance back', async () => {
  const { grantComeback } = await import('./comeback')
  const { db, state } = fakeDb({ subscription_status: null, trial_ends_at: new Date(NOW - 5 * DAY).toISOString(), created_at: null }, { failWrite: true })
  assert.deepEqual(await grantComeback(db, id, NOW, 4), { kind: 'failed' })
  assert.equal(state.claims.has(id), false)
})

test('an unknown account grants nothing', async () => {
  const { grantComeback } = await import('./comeback')
  const { db } = fakeDb(null)
  assert.deepEqual(await grantComeback(db, id, NOW, 4), { kind: 'missing' })
})
