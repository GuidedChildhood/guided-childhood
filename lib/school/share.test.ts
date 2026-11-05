// Tests for the school parent share link: the gate between what a link shows
// anybody and what needs an account, and the licence rule on what a school can
// share (shared/parent-share.ts, lib/school/share.ts, schools/lib/share-rule.ts).
// Run: npm run share-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  schoolShareRef, signParentShare, readParentShare, readShareCookie, shareCookieValue, parentSharePath,
} from '../../shared/parent-share'
import { shareTeaser, shareFull } from './share'
import { canShareLesson } from '../../schools/lib/share-rule'
import { PILOT_SET } from '../../schools/lib/pilot'

const SECRET = 'test-secret-not-a-real-one'
const MODULE = 'ks2-06-how-algorithms-work'

async function link(moduleId = MODULE, code = 'stmarys-2026', secret = SECRET) {
  const ref = (await schoolShareRef(code, secret))!
  return { ref, token: (await signParentShare(moduleId, ref, secret))! }
}

test('a school gets one stable ref that is not its code', async () => {
  const a = await schoolShareRef('stmarys-2026', SECRET)
  assert.match(a!, /^[0-9a-f]{8}$/)
  assert.equal(await schoolShareRef(' StMarys-2026 ', SECRET), a)
  assert.notEqual(await schoolShareRef('kingsoak-2026', SECRET), a)
  assert.ok(!a!.includes('stmarys'))
  assert.equal(await schoolShareRef('stmarys-2026', ''), null)
})

test('a signed link opens its lesson and names its school', async () => {
  const { ref, token } = await link()
  const share = await readParentShare(MODULE, token, SECRET)
  assert.deepEqual(share, { moduleId: MODULE, ref, token })
  assert.equal(parentSharePath(MODULE, token), `/from-school/${MODULE}/${token}`)
})

test('an edited link opens nothing', async () => {
  const { ref, token } = await link()
  // Another lesson under the same signature: the licence would be a free account.
  assert.equal(await readParentShare('ks4-15-manipulation-persuasion', token, SECRET), null)
  // Another school's ref under this signature.
  const other = (await schoolShareRef('kingsoak-2026', SECRET))!
  assert.equal(await readParentShare(MODULE, `${other}.${token.split('.')[1]}`, SECRET), null)
  // A flipped character, a short signature, junk.
  const sig = token.split('.')[1]
  const flipped = `${ref}.${sig.slice(0, -1)}${sig.endsWith('0') ? '1' : '0'}`
  for (const bad of [flipped, `${ref}.${sig.slice(0, 8)}`, ref, '', 'x.y', `${token}.extra`]) {
    assert.equal(await readParentShare(MODULE, bad, SECRET), null, bad)
  }
  // Signed under another secret, or opened with none: fails closed.
  assert.equal(await readParentShare(MODULE, token, 'another-secret'), null)
  assert.equal(await readParentShare(MODULE, token, ''), null)
  assert.equal(await signParentShare(MODULE, ref, ''), null)
  // A module id that is not one.
  assert.equal(await readParentShare('../../etc', token, SECRET), null)
})

test('the cookie the start route sets is verified again, never trusted', async () => {
  const { ref, token } = await link()
  assert.deepEqual(await readShareCookie(shareCookieValue(MODULE, token), SECRET), { moduleId: MODULE, ref, token })
  const other = (await schoolShareRef('kingsoak-2026', SECRET))!
  assert.equal(await readShareCookie(`${MODULE}:${other}.0011223344556677`, SECRET), null)
  assert.equal(await readShareCookie(`${MODULE}:${token}`, 'another-secret'), null)
  assert.deepEqual(await readShareCookie(encodeURIComponent(shareCookieValue(MODULE, token)), SECRET), { moduleId: MODULE, ref, token })
  for (const bad of [undefined, null, '', 'nocolon', `:${token}`]) assert.equal(await readShareCookie(bad, SECRET), null, String(bad))
})

const ROW = {
  title: 'How algorithms work',
  year_band: 'Year 4',
  single_action_outcome: 'Spot when an app is choosing for you',
  parent_note: {
    taught: 'Apps choose what comes next.',
    family_question: 'What did the app choose for you today?',
    try_this: 'TRY',
    listen_for: 'LISTEN',
    then_ask: 'THEN',
    say_this: 'SAY',
    passport: 'PASSPORT',
  },
}

test('the teaser shows exactly the title, what was learned and the question', () => {
  const teaser = shareTeaser(ROW)
  assert.deepEqual(teaser, {
    title: 'How algorithms work',
    yearBand: 'Year 4',
    learned: 'Apps choose what comes next.',
    askAtHome: 'What did the app choose for you today?',
  })
  // Nothing behind the account leaks into it.
  const shown = JSON.stringify(teaser)
  for (const hidden of ['TRY', 'LISTEN', 'THEN', 'SAY', 'PASSPORT']) assert.ok(!shown.includes(hidden), hidden)
})

test('the full note carries the rest, and a bad shape prints nothing', () => {
  assert.deepEqual(shareFull(ROW), { tryThis: 'TRY', listenFor: 'LISTEN', thenAsk: 'THEN', sayThis: 'SAY', passport: 'PASSPORT' })
  assert.deepEqual(shareFull({ parent_note: 'a sentence' }), { tryThis: null, listenFor: null, thenAsk: null, sayThis: null, passport: null })
  assert.equal(shareTeaser({ ...ROW, parent_note: null }).learned, 'Spot when an app is choosing for you')
})

test('the licence decides which lessons a school can share', () => {
  const licence = { tier: 'licence' } as const
  assert.ok(canShareLesson(licence, MODULE))
  assert.ok(canShareLesson(licence, 'ks4-15-manipulation-persuasion'))
  for (const phase of ['primary', 'secondary', 'post16', 'all_through'] as const) {
    const pilot = { tier: 'pilot', phase } as const
    for (const m of PILOT_SET[phase]) assert.ok(canShareLesson(pilot, m), `${phase} ${m}`)
  }
  // A primary pilot cannot share a secondary lesson, or any lesson outside its two.
  assert.ok(!canShareLesson({ tier: 'pilot', phase: 'primary' }, 'ks3-24-is-it-doing-my-thinking'))
  assert.ok(!canShareLesson({ tier: 'pilot', phase: 'primary' }, 'ks2-10-not-in-the-pilot'))
})
