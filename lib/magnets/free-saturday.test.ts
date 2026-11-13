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
  // 14 November is the Planet Post and 21 November is Paris: no taster yet.
  assert.equal(thisWeeksSlug(saturdays, '2026-11-14'), null)
  assert.equal(thisWeeksSlug(saturdays, '2026-11-27'), null)
  assert.equal(thisWeeksSlug(saturdays, '2026-11-28'), 'christmas-countdown')
  assert.equal(thisWeeksSlug(saturdays, '2026-12-04'), 'christmas-countdown')
  assert.equal(thisWeeksSlug(saturdays, '2026-12-05'), 'first-phone-kit')
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
  assert.equal(nextSaturdayFor(saturdays, 'first-phone-kit', '2026-11-13'), '2026-12-05')
  assert.equal(nextSaturdayFor(saturdays, 'first-phone-kit', '2026-12-06'), null)
})

test('the weekly link carries only the post, never the person', () => {
  const route = readFileSync('app/(marketing)/free/this-week/route.ts', 'utf8')
  assert.match(route, /cleanUtmValue\(req\.nextUrl\.searchParams\.get\('src'\)\)/)
  assert.match(route, /utmQuery\(readUtm\(req\.nextUrl\.searchParams\)\)/)
  assert.match(route, /'Cache-Control', 'no-store'/)
})

// PECR (13 November 2026, migration 396): the download never depends on the
// tips box, the box starts unticked, an empty box never undoes a yes, and every
// lead programme skips a no while keeping the stop filter if 396 is missing.
test('the tips box is optional, unticked, and never gates the download', () => {
  const gate = readFileSync('components/marketing/MagnetGate.tsx', 'utf8')
  assert.match(gate, /useState\(false\)/)
  assert.match(gate, /type="checkbox"/)
  assert.match(gate, /consent: tips/)
  assert.match(gate, /Free, just your email\. The printable comes either way\./)
  assert.ok(!/required/.test(gate.slice(gate.indexOf('type="checkbox"') - 200, gate.indexOf('type="checkbox"') + 300)), 'the box must not be required')
  const api = readFileSync('app/api/magnet/route.ts', 'utf8')
  assert.match(api, /body\.consent === true/)
  assert.match(api, /\.update\(\{ marketing_consent: false \}\)[\s\S]{0,80}\.is\('marketing_consent', null\)/)
})

test('every lead programme skips a no, and keeps the stop filter before 396', () => {
  const cron = readFileSync('app/api/email/cron/route.ts', 'utf8')
  for (const q of ['tasterQuery', 'nurtureQuery', 'teaserQuery']) {
    assert.match(cron, new RegExp(`${q}\\(\\)\\.is\\('unsubscribed_at', null\\)\\.not\\('marketing_consent', 'is', false\\)`), `${q} skips a no`)
    assert.match(cron, new RegExp(`= await ${q}\\(\\)\\.is\\('unsubscribed_at', null\\)\\)`), `${q} keeps the stop filter on its fallback`)
  }
})

// The taster series (13 November 2026, "Yes, daily for the series").
import { seriesEmailDue, seriesPageNumber, SERIES_ORDER } from './taster-nurture'

test('the series runs in order, one a day, and stops after five', () => {
  const sent = new Set<string>()
  assert.equal(seriesEmailDue(0.3, sent), null)
  const got: string[] = []
  // A Saturday 14:00 claim, the cron at 08:00 each morning.
  for (let d = 1; d <= 9; d++) {
    const due = seriesEmailDue(d - 0.25, sent)
    if (due) { sent.add(due); got.push(`${d}:${due}`) }
  }
  assert.deepEqual(got, ['1:series-1', '2:series-2', '3:series-3', '4:series-stage', '5:series-full-pack'])
})

test('a failed day never bunches two emails together', () => {
  // series-1 failed on day 1; on day 3 only series-1 is due, never two.
  assert.equal(seriesEmailDue(2.75, new Set()), 'series-1')
  assert.equal(seriesEmailDue(2.75, new Set(['series-1'])), 'series-2')
})

test('the first three are page emails, then the stage check and the pack', () => {
  assert.deepEqual(SERIES_ORDER.map(k => seriesPageNumber(k)), [1, 2, 3, null, null])
})

test('every taster has a subject and a tip for each page, with no dash', () => {
  const rows: { slug: string; pages: number[]; series?: { subject: string; tip: string }[]; pageNotes: { h: string; b: string }[] }[] =
    JSON.parse(readFileSync('content/printables/free-tasters.json', 'utf8')).tasters
  for (const t of rows) {
    if (t.series) assert.equal(t.series.length, t.pages.length, `${t.slug}: one series email per page`)
    for (let n = 0; n < t.pages.length; n++) {
      const s = t.series?.[n] ?? { subject: t.pageNotes[n].h, tip: t.pageNotes[n].b }
      for (const w of [s.subject, s.tip]) {
        assert.ok(w && !/[–—−]|\s-\s/.test(w), `${t.slug} page ${n + 1}: ${w}`)
        assert.ok(!/\b(guarantee|proven to|will make your child|transform)/i.test(w), `${t.slug}: outcome claim in ${w}`)
      }
    }
  }
  // The first six Saturday packs carry their own words.
  for (const slug of ['christmas-countdown', 'first-phone-kit', 'holiday-screen-deal', 'screens-at-grannys', 'say-this', 'screen-reset-journal']) {
    assert.ok(rows.find(t => t.slug === slug)?.series, `${slug} has its own series`)
  }
})

test('the series goes only to a ticked box, as its own kind, and tells them it is coming', () => {
  const cron = readFileSync('app/api/email/cron/route.ts', 'utf8')
  assert.match(cron, /const onSeries = lead\.marketing_consent === true/)
  assert.match(cron, /kind: onSeries \? 'series' : 'programme'/)
  const idx = readFileSync('lib/email/index.ts', 'utf8')
  assert.match(idx, /floor: kind === 'programme'/)
  const api = readFileSync('app/api/magnet/route.ts', 'utf8')
  assert.match(api, /seriesNext: Boolean\(taster\) && body\.consent === true/)
  const page = readFileSync('app/(marketing)/free/[slug]/page.tsx', 'utf8')
  assert.match(page, /Also send me the 5 day series/)
})
