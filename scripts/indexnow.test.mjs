// Tests for the IndexNow ping. Run: npm run indexnow-test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { HOST, KEY, parseSitemap, pick, payload } from './indexnow.mjs'

const XML = `<?xml version="1.0" encoding="UTF-8"?><urlset>
<url><loc>https://www.guidedchildhood.com</loc></url>
<url><loc>https://www.guidedchildhood.com/is-roblox-safe</loc><lastmod>2026-11-22T00:00:00.000Z</lastmod></url>
<url><loc>https://www.guidedchildhood.com/guides/x</loc><lastmod>2026-10-01</lastmod></url>
<url><loc>https://elsewhere.example/page</loc><lastmod>2026-11-22</lastmod></url>
</urlset>`

test('the sitemap is read with its dates', () => {
  const e = parseSitemap(XML)
  assert.equal(e.length, 4)
  assert.deepEqual(e[1], { loc: 'https://www.guidedchildhood.com/is-roblox-safe', lastmod: '2026-11-22' })
  assert.equal(e[0].lastmod, null)
})

test('only our own pages, and by default only the recently changed ones', () => {
  const e = parseSitemap(XML)
  assert.deepEqual(pick(e, { today: '2026-11-23' }), ['https://www.guidedchildhood.com/is-roblox-safe'])
  assert.equal(pick(e, { all: true }).length, 3, 'never another host')
  assert.equal(pick(e, { today: '2026-12-30' }).length, 0)
})

test('the key file is served from public/ and matches the payload', () => {
  assert.match(KEY, /^[a-f0-9]{32}$/)
  const file = new URL(`../public/${KEY}.txt`, import.meta.url)
  assert.ok(existsSync(file), 'public/<key>.txt must exist, or every ping is refused with 403')
  assert.equal(readFileSync(file, 'utf8').trim(), KEY)
  const p = payload(['https://www.guidedchildhood.com/a'])
  assert.equal(p.host, HOST)
  assert.equal(p.keyLocation, `https://${HOST}/${KEY}.txt`)
})
