// Tests for Free Saturday (13 November 2026): /free/this-week opens the right
// taster at the right moment, the schedule only ever names a promoted taster,
// and nothing repeats inside eight weeks.
// Run: npm run tasters-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { thisWeeksSlug, londonDate, nextSaturdayFor, type FreeSaturday } from './free-saturday'

const saturdays: FreeSaturday[] = JSON.parse(readFileSync('content/printables/free-saturdays.json', 'utf8')).saturdays
const tasters: { slug: string; status: string }[] = JSON.parse(readFileSync('content/printables/free-tasters.json', 'utf8')).tasters

test('every scheduled date is a Saturday, in order, once', () => {
  let prev = ''
  for (const s of saturdays) {
    assert.equal(new Date(`${s.date}T12:00:00Z`).getUTCDay(), 6, `${s.date} is not a Saturday`)
    assert.ok(s.date > prev, `${s.date} out of order`)
    prev = s.date
    assert.ok(s.why && !/[–—−]|\s-\s/.test(s.why), `${s.date}: a reason, and no dash`)
  }
})

test('the schedule only names promoted tasters', () => {
  for (const s of saturdays.filter(x => x.slug)) {
    const t = tasters.find(x => x.slug === s.slug)
    assert.ok(t, `${s.slug} is not a taster`)
    assert.notEqual(t!.status, 'hold', `${s.slug} is on hold`)
  }
})

test('no taster comes round again within eight weeks', () => {
  const seen = new Map<string, string>()
  for (const s of saturdays.filter(x => x.slug)) {
    const last = seen.get(s.slug!)
    if (last) {
      const weeks = (Date.parse(s.date) - Date.parse(last)) / (7 * 86400000)
      assert.ok(weeks >= 8, `${s.slug} again after ${weeks} weeks`)
    }
    seen.set(s.slug!, s.date)
  }
})

test('this week means the latest Saturday on or before today', () => {
  assert.equal(thisWeeksSlug(saturdays, '2026-11-13'), null)
  assert.equal(thisWeeksSlug(saturdays, '2026-11-14'), 'christmas-countdown')
  assert.equal(thisWeeksSlug(saturdays, '2026-11-20'), 'christmas-countdown')
  // 21 November is the reserved Paris post: the countdown stays live.
  assert.equal(thisWeeksSlug(saturdays, '2026-11-24'), 'christmas-countdown')
  assert.equal(thisWeeksSlug(saturdays, '2026-11-28'), 'first-phone-kit')
  assert.equal(thisWeeksSlug(saturdays, '2027-03-01'), saturdays.filter(s => s.slug).at(-1)!.slug)
})

test('the switch happens at midnight London time, not UTC', () => {
  // 23:30 UTC on Friday 13 November is still Friday in London (GMT in winter).
  assert.equal(londonDate(new Date('2026-11-13T23:30:00Z')), '2026-11-13')
  assert.equal(londonDate(new Date('2026-11-14T00:30:00Z')), '2026-11-14')
  // In summer, 23:30 UTC is already the next day in London.
  assert.equal(londonDate(new Date('2027-06-04T23:30:00Z')), '2027-06-05')
})

test('the engine can find the next Saturday for a taster', () => {
  assert.equal(nextSaturdayFor(saturdays, 'first-phone-kit', '2026-11-13'), '2026-11-28')
  assert.equal(nextSaturdayFor(saturdays, 'first-phone-kit', '2026-11-29'), null)
})

test('the weekly link carries only the post, never the person', () => {
  const route = readFileSync('app/(marketing)/free/this-week/route.ts', 'utf8')
  assert.match(route, /cleanUtmValue\(req\.nextUrl\.searchParams\.get\('src'\)\)/)
  assert.match(route, /utmQuery\(readUtm\(req\.nextUrl\.searchParams\)\)/)
  assert.match(route, /'Cache-Control', 'no-store'/)
})
