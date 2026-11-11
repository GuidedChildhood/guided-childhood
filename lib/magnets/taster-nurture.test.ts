// Tests for the free tasters (11 November 2026): the ruling (a taster is never
// the whole pack), the files every page and email names, the copy rules, and
// the nurture schedule that has to fit three emails into a week under the one
// a week floor.
// Run: npm run tasters-test

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import {
  tasterEmailDue, TASTER_STAGE_KEY, TASTER_FULL_PACK_KEY, TASTER_NURTURE_WINDOW_DAYS,
} from './taster-nurture'
import { dueAgain } from '../email/floor'
import { cleanUtmValue } from '../../shared/utm'

type Row = {
  slug: string; title: string; ages: string; agesMin: number; agesMax: number; url: string
  status: string; holdReason?: string; etsyListing: string | null; inApp: boolean; source: string
  pages: number[]; pageCount: number; blurb: string; pageNotes: { h: string; b: string }[]
}
const rows: Row[] = JSON.parse(readFileSync('content/printables/free-tasters.json', 'utf8')).tasters

test('every taster row has what the Saturday engine reads', () => {
  assert.ok(rows.length >= 30, `only ${rows.length} tasters`)
  const slugs = new Set<string>()
  for (const t of rows) {
    assert.match(t.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, t.slug)
    assert.ok(!slugs.has(t.slug), `${t.slug} twice`)
    slugs.add(t.slug)
    assert.equal(t.url, `https://www.guidedchildhood.com/free/${t.slug}`)
    assert.ok(['live', 'no-listing', 'hold'].includes(t.status), `${t.slug}: status ${t.status}`)
    if (t.status === 'hold') assert.ok(t.holdReason, `${t.slug}: a hold says why`)
    if (t.status === 'live') assert.ok(t.etsyListing, `${t.slug}: live means a listing is live`)
    if (t.status === 'no-listing') assert.equal(t.etsyListing, null, t.slug)
    if (t.etsyListing) assert.match(t.etsyListing, /^\d{10}$/, t.slug)
    assert.ok(t.ages && t.agesMin <= t.agesMax, t.slug)
    assert.equal(typeof t.inApp, 'boolean', t.slug)
  }
})

test('the old free pages keep their own routes', () => {
  for (const taken of ['planet-post', 'guided-times']) assert.ok(!rows.some(t => t.slug === taken), taken)
})

test('a taster is two or three pages and always fewer than half the pack', () => {
  for (const t of rows) {
    assert.ok(t.pages.length >= 2 && t.pages.length <= 3, `${t.slug}: ${t.pages.length} pages`)
    assert.ok(t.pages.length * 2 < t.pageCount, `${t.slug}: ${t.pages.length} of ${t.pageCount} is too much`)
    assert.equal(new Set(t.pages).size, t.pages.length, t.slug)
    assert.ok(t.pages.every(n => n >= 1 && n <= t.pageCount), t.slug)
    assert.equal(t.pageNotes.length, t.pages.length, `${t.slug}: one note per page`)
  }
})

test('every file a page or an email names is built and in public', () => {
  for (const t of rows) {
    assert.ok(existsSync(t.source), `${t.slug}: source ${t.source}`)
    assert.ok(existsSync(`public/printables/free/tasters/${t.slug}-taster-a4.pdf`), `${t.slug}: taster pdf`)
    for (let i = 1; i <= t.pages.length; i++) {
      assert.ok(existsSync(`public/printables/free/tasters/${t.slug}-taster-p${i}.png`), `${t.slug}: preview ${i}`)
    }
  }
})

test('no dash and no outcome promise in the words a parent reads', () => {
  const words = rows.flatMap(t => [t.title, t.blurb, t.ages, t.holdReason ?? '', ...t.pageNotes.flatMap(n => [n.h, n.b])])
  for (const w of words) {
    assert.ok(!/[–—−]|\s-\s/.test(w), `dash in: ${w}`)
    assert.ok(!/\b(guarantee|proven to|will make your child|transform)/i.test(w), `outcome claim in: ${w}`)
  }
})

test('the stage check comes the next morning and the full pack a week on, not before', () => {
  const none = new Set<string>()
  assert.equal(tasterEmailDue(0, none), null)
  assert.equal(tasterEmailDue(0.4, none), null)
  assert.equal(tasterEmailDue(0.5, none), TASTER_STAGE_KEY)
  const stage = new Set([TASTER_STAGE_KEY])
  assert.equal(tasterEmailDue(3, stage), null)
  assert.equal(tasterEmailDue(6.4, stage), null)
  assert.equal(tasterEmailDue(6.5, stage), TASTER_FULL_PACK_KEY)
  assert.equal(tasterEmailDue(8, new Set([TASTER_STAGE_KEY, TASTER_FULL_PACK_KEY])), null)
})

test('a stage check held back by the floor still comes before the full pack', () => {
  assert.equal(tasterEmailDue(9, new Set()), TASTER_STAGE_KEY)
})

test('after the window the taster nurture stops', () => {
  assert.equal(tasterEmailDue(TASTER_NURTURE_WINDOW_DAYS + 1, new Set()), null)
})

// The real thing: the cron at 08:00 every morning, a few seconds of jitter
// either way, and the one a week floor from lib/email/floor.ts. A Saturday
// afternoon taster must get the stage check on Sunday and the full pack within
// eight days of the claim, whatever the jitter does.
test('a Saturday taster gets three emails inside eight days under the real floor', () => {
  const DAY = 86400000
  for (const claimHour of [9, 14, 21]) {
    for (const jitter of [-20, 0, 20]) {
      const claim = Date.UTC(2026, 10, 14, claimHour) // Saturday 14 November 2026
      const sent = new Set<string>()
      // The taster email itself is transactional, so the floor never counts it.
      let last: number | null = null
      const log: { key: string; day: number }[] = []
      for (let d = 1; d <= 10; d++) {
        const run = Date.UTC(2026, 10, 14 + d, 8) + jitter * 1000 * (d % 2 ? 1 : -1)
        const due = tasterEmailDue((run - claim) / DAY, sent)
        if (!due) continue
        if (!dueAgain(last === null ? null : new Date(last).toISOString(), run)) continue
        sent.add(due); last = run; log.push({ key: due, day: (run - claim) / DAY })
      }
      assert.equal(log.length, 2, `claim ${claimHour}:00 jitter ${jitter}: ${JSON.stringify(log)}`)
      assert.equal(log[0].key, TASTER_STAGE_KEY)
      assert.ok(log[0].day < 1.5, `stage check on day ${log[0].day}`)
      assert.ok(log[1].day <= 8, `full pack on day ${log[1].day}`)
    }
  }
})

test('the src a Saturday post carries is kept, and an email address is not', () => {
  assert.equal(cleanUtmValue('ig'), 'ig')
  assert.equal(cleanUtmValue('1114-calm-kit'), '1114-calm-kit')
  assert.equal(cleanUtmValue('sam@example.com'), null)
  assert.equal(cleanUtmValue('07700900123'), null)
})

test('the gate posts attribution in the body, never the email in an address', () => {
  const gate = readFileSync('components/marketing/MagnetGate.tsx', 'utf8')
  assert.match(gate, /body: JSON\.stringify\(\{ email: clean, slug, \.\.\.pageAttribution\(\) \}\)/)
  assert.ok(!/[?&]email=/.test(gate))
  const api = readFileSync('app/api/magnet/route.ts', 'utf8')
  assert.match(api, /from\('free_download_events'\)\.insert/)
  assert.match(api, /cleanUtmValue\(body\.src\)/)
})
