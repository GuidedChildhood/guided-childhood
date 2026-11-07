// Tests for the links in our emails that have to know who they were sent to
// (lib/email/link-token.ts, lib/email/index.ts, lib/email/school-letters.ts).
// The rule under test: no name or email address ever travels in a URL.
// Run: npm run privacy-links-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sealEmail, openEmail } from './link-token'
import { leadUnsubscribeUrl, starterCtaUrl, leadUnsubscribeToken, starterCtaToken } from './index'
import { schoolLetter, licenceLink, type LetterboxRow } from './school-letters'

process.env.CRON_SECRET = 'test-secret'

const ADDR = 'Sam.Head+pilot@school.sch.uk'

const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'))

function assertNoPersonalData(url: string, ...values: string[]) {
  const decoded = decodeURIComponent(url).toLowerCase()
  for (const v of values) {
    for (const part of [v, ...v.split(/[\s@]+/)].filter(p => p.length > 2)) {
      assert.ok(!decoded.includes(part.toLowerCase()), `"${part}" is readable in ${url}`)
    }
  }
}

test('a sealed address opens back to the same address, lower cased', () => {
  assert.equal(openEmail(sealEmail(ADDR, 'unsub'), 'unsub'), ADDR.toLowerCase())
  assert.equal(openEmail(sealEmail(`  ${ADDR}  `, 'cta'), 'cta'), ADDR.toLowerCase())
})

test('the token is opaque and different on every send', () => {
  const a = sealEmail(ADDR, 'unsub')
  const b = sealEmail(ADDR, 'unsub')
  assert.notEqual(a, b)
  assertNoPersonalData(a, ADDR)
  assert.match(a, /^v1\.[A-Za-z0-9_-]+$/, 'url safe without encoding')
})

test('a stop token is not a starter token, and the other way round', () => {
  assert.equal(openEmail(sealEmail(ADDR, 'unsub'), 'cta'), null)
  assert.equal(openEmail(sealEmail(ADDR, 'cta'), 'unsub'), null)
})

test('anything we did not mint opens nothing', () => {
  const good = sealEmail(ADDR, 'unsub')
  const body = good.slice(3)
  const flipped = body.slice(0, -2) + (body.at(-2) === 'A' ? 'B' : 'A') + body.at(-1)
  for (const bad of [`v1.${flipped}`, 'v1.', 'v2' + good.slice(2), good.slice(3), '', null, undefined, 'v1.' + 'A'.repeat(700), ADDR]) {
    assert.equal(openEmail(bad as string, 'unsub'), null, String(bad))
  }
})

test('a token minted under another secret opens nothing', () => {
  const token = sealEmail(ADDR, 'unsub')
  process.env.CRON_SECRET = 'a-different-secret'
  try {
    assert.equal(openEmail(token, 'unsub'), null)
  } finally {
    process.env.CRON_SECRET = 'test-secret'
  }
})

test('the stop link and the starter link carry no address', () => {
  for (const url of [leadUnsubscribeUrl(ADDR), starterCtaUrl(ADDR)]) {
    assertNoPersonalData(url, ADDR)
    assert.ok(!/[?&](e|email)=/.test(url), url)
  }
  const t = new URL(leadUnsubscribeUrl(ADDR)).searchParams.get('t')
  assert.equal(openEmail(t, 'unsub'), ADDR.toLowerCase())
  const c = new URL(starterCtaUrl(ADDR)).searchParams.get('t')
  assert.equal(openEmail(c, 'cta'), ADDR.toLowerCase())
})

test('the old signed shapes still verify, for links already in inboxes', () => {
  // The routes still honour ?e=&k=; these are the checks they make.
  assert.match(leadUnsubscribeToken(ADDR), /^[0-9a-f]{32}$/)
  assert.equal(leadUnsubscribeToken(ADDR), leadUnsubscribeToken(ADDR.toLowerCase()))
  assert.notEqual(leadUnsubscribeToken(ADDR), starterCtaToken(ADDR))
})

const PILOT: LetterboxRow = {
  school_name: 'St Example CE Primary',
  band: 'pilot',
  contact_name: 'Sam Headteacher',
  email: ADDR,
  po_number: 'PILOT',
  notes: 'Pilot request · Head · Primary',
  prefill_token: '3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d',
}

test('the pilot letter links to the licence with its token, and no name or email', () => {
  const letter = schoolLetter(PILOT)
  assert.ok(letter)
  const links = hrefs(letter.html)
  for (const url of links) assertNoPersonalData(url, PILOT.school_name, PILOT.contact_name, PILOT.email)
  assert.ok(links.includes('https://schools.guidedchildhood.com/pricing?pilot=3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d'), links.join('\n'))
  // Everything else in the letter is as it was: the greeting and the school.
  assert.match(letter.html, /Hello Sam,/)
  assert.match(letter.html, /turn the pilot into a licence/)
  assert.equal(letter.subject, 'Your pilot request for St Example CE Primary')
})

test('a pilot row read before migration 387 links to the plain pricing page', () => {
  for (const prefill_token of [undefined, null, '', 'not-a-token', 'x" onclick="alert(1)']) {
    const letter = schoolLetter({ ...PILOT, prefill_token })
    assert.ok(letter)
    assert.ok(hrefs(letter.html).includes('https://schools.guidedchildhood.com/pricing'))
  }
  assert.equal(licenceLink('3F2B8C1E-9A4D-4C7B-8E21-5D6F7A8B9C0D'), 'https://schools.guidedchildhood.com/pricing?pilot=3f2b8c1e-9a4d-4c7b-8e21-5d6f7a8b9c0d')
})

test('no school letter puts the contact in a link', () => {
  for (const band of ['pilot', 'taster', 'workshop', 'primary_small', 'founding_primary']) {
    const letter = schoolLetter({ ...PILOT, band, po_number: 'PO-1234' })
    if (!letter) continue
    for (const url of hrefs(letter.html)) assertNoPersonalData(url, PILOT.contact_name, PILOT.email, PILOT.school_name)
  }
})
