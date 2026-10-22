// Tests for the gum SEO wrapper (scripts/seo-gum.mjs).
// Run: node --test scripts/seo-gum.test.mjs
//
// gum itself is replaced by a fake binary (GUM_BIN) that records the argv it
// was given and answers with canned Search Console JSON, so the tests check
// the exact call we send without a Google login. Output goes to a temporary
// SEO_DIR on a fixed SEO_TODAY.

import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { windows, analyse, findRows, sitemapUrls, pull, report, main } from './seo-gum.mjs'

const CONFIG = new URL('../content/seo/config.json', import.meta.url).pathname

let dir
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'seo-gum-'))
  process.env.SEO_DIR = dir
  process.env.SEO_TODAY = '2026-10-21'
  copyFileSync(CONFIG, join(dir, 'config.json'))
})

/**
 * A fake gum that logs its argv to calls.jsonl and prints `answer`. A refusal
 * goes to stderr with exit 1, which is what the real binary does.
 */
function fakeGum(answer) {
  const bin = join(dir, 'gum')
  writeFileSync(bin, `#!/usr/bin/env node
const fs = process.getBuiltinModule('fs')
fs.appendFileSync(${JSON.stringify(join(dir, 'calls.jsonl'))}, JSON.stringify(process.argv.slice(2)) + '\\n')
process[${answer.error_code ? "'stderr'" : "'stdout'"}].write(${JSON.stringify(JSON.stringify(answer))})
process.exit(${answer.error_code ? 1 : 0})
`)
  chmodSync(bin, 0o755)
  process.env.GUM_BIN = bin
  return () => readFileSync(join(dir, 'calls.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l))
}

test('windows end three days back and do not overlap', () => {
  const w = windows('2026-10-21')
  assert.deepEqual(w.current, { startDate: '2026-09-21', endDate: '2026-10-18' })
  assert.deepEqual(w.previous, { startDate: '2026-08-24', endDate: '2026-09-20' })
})

test('findRows finds rows bare or inside an envelope', () => {
  assert.equal(findRows({ rows: [1] }).length, 1)
  assert.equal(findRows({ body: { rows: [1, 2] } }).length, 2)
  assert.equal(findRows({ nothing: true }).length, 0)
})

test('sitemapUrls reads both sitemap sources, home page as the bare host', () => {
  const config = JSON.parse(readFileSync(CONFIG, 'utf8'))
  const parents = sitemapUrls(config.properties[0])
  assert.ok(parents.includes('https://www.guidedchildhood.com'))
  assert.ok(parents.includes('https://www.guidedchildhood.com/starter-pack'))
  const schools = sitemapUrls(config.properties[1])
  assert.ok(schools.includes('https://schools.guidedchildhood.com'))
  assert.ok(schools.includes('https://schools.guidedchildhood.com/curriculum'))
})

test('analyse finds striking distance, CTR gaps, new queries and unseen sitemap pages', () => {
  const H = 'https://www.guidedchildhood.com'
  const current = [
    ['when should my child get a phone', `${H}/passport`, 2, 120, 11.2],
    ['screen time arguments', `${H}/scripts`, 1, 90, 4.1],
    ['guided childhood', `${H}/`, 30, 60, 1.0],
    ['tiny query', `${H}/free`, 0, 3, 12],
  ]
  const previous = [['guided childhood', `${H}/`, 20, 40, 1.2], ['screen time arguments', `${H}/scripts`, 3, 150, 5]]
  const a = analyse(current, previous, [H, `${H}/scripts`, `${H}/evidence`], { minImpressions: 10 })

  assert.deepEqual(a.striking.map(x => x.key), ['when should my child get a phone'])
  assert.equal(a.striking[0].top, `${H}/passport`)
  // Position 4 usually earns about 7 percent; 1 in 90 is well under half.
  assert.deepEqual(a.ctrGaps.map(x => x.key), ['screen time arguments'])
  assert.deepEqual(a.newQueries.map(x => x.key), ['when should my child get a phone', 'tiny query'])
  assert.deepEqual(a.neverShown, [`${H}/evidence`])
  assert.equal(a.falling[0].key, `${H}/scripts`)
  assert.equal(a.totals.clicks, 33)
})

test('pull sends a read with the body nested, filtered to each app, and writes one file', () => {
  const calls = fakeGum({ rows: [{ keys: ['phone contract for kids', 'https://www.guidedchildhood.com/scripts'], clicks: 1, impressions: 40, ctr: 0.025, position: 9.34 }] })
  const file = pull()
  const sent = calls()
  // Two properties times two windows.
  assert.equal(sent.length, 4)
  const [verb, op, flag, json] = sent[0]
  assert.equal(verb, 'read')
  assert.equal(op, 'searchconsole.searchanalytics.query')
  assert.equal(flag, '--args')
  const args = JSON.parse(json)
  assert.equal(args.siteUrl, 'sc-domain:guidedchildhood.com')
  assert.deepEqual(args.body.dimensions, ['query', 'page'])
  assert.equal(args.body.startDate, '2026-09-21')
  assert.equal(args.body.dimensionFilterGroups[0].filters[0].expression, 'https://www.guidedchildhood.com/')
  assert.ok(!sent.some(a => a.includes('--allow-write')))

  const saved = JSON.parse(readFileSync(file, 'utf8'))
  assert.deepEqual(saved.properties.parents.current[0], ['phone contract for kids', 'https://www.guidedchildhood.com/scripts', 1, 40, 9.3])

  const md = readFileSync(report(file), 'utf8')
  assert.match(md, /phone contract for kids/)
  assert.doesNotMatch(md, /[–—]/, 'no dashes in the report copy')
})

test('a refused call surfaces how to fix it', () => {
  fakeGum({ error_code: 'SCOPE_MISSING', how_to_fix: 'See gum describe' })
  assert.throws(() => pull(), /SCOPE_MISSING\. Not logged in to Search Console\. On the Mac: gum login --service searchconsole/)
  fakeGum({ error_code: 'RATE_LIMITED', how_to_fix: 'Wait a minute' })
  assert.throws(() => pull(), /RATE_LIMITED\. Wait a minute/)
})

test('submit refuses without --allow-write and sends a write with it', () => {
  const calls = fakeGum({})
  assert.equal(main(['submit']), 1)
  assert.equal(main(['submit', '--allow-write']), 0)
  const sent = calls()
  assert.equal(sent.length, 2)
  assert.equal(sent[0][0], 'write')
  assert.ok(sent[0].includes('--allow-write'))
  assert.equal(JSON.parse(sent[1][3]).feedpath, 'https://schools.guidedchildhood.com/sitemap.xml')
})
