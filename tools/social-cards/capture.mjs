#!/usr/bin/env node
/**
 * Captures a real screen for an ad card, the same way every time: 390 points
 * wide at three times the pixels, straight from the live public page. Nothing
 * is edited afterwards; a card shows a crop of this file and never a redraw
 * (visual system section 1, ad studio phase 3).
 *
 *   node tools/social-cards/capture.mjs say <script id> <name>
 *
 * `say` captures the public script page (/say/<id>), the sheet only, inside
 * its own 2.5px ink edge, so no page margin or shadow comes with it. It
 * writes content/ads/screens/<name>.png and prints the crop the ad council
 * settled on (20 October 2026): one continuous run from SAY THIS to the end
 * of its quote, so the words read in the feed and the title does not repeat
 * the headline. In the capture's own points, ready for a deck.
 *
 * The window is 390 wide and very tall, so the page's sticky button sits
 * below the sheet instead of over it. Nothing is hidden and nothing is edited;
 * the width, which is what sets the layout, is a phone's.
 *
 * Only public pages. Never a signed in family (ad studio phase 3).
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '../..')
const SITE = 'https://www.guidedchildhood.com' // lib/config/site.ts SITE_URL
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')) }

const [kind, id, name] = process.argv.slice(2)
if (kind !== 'say' || !/^[0-9a-f-]{36}$/.test(id || '') || !/^[a-z0-9-]+$/.test(name || '')) {
  console.error('usage: node tools/social-cards/capture.mjs say <script uuid> <name>')
  process.exit(1)
}

const browser = await chromium.launch().catch(() => chromium.launch(existsSync(CHROME) ? { executablePath: CHROME } : { executablePath: '/opt/pw-browsers/chromium' }))
const page = await browser.newPage({ viewport: { width: 390, height: 2600 }, deviceScaleFactor: 3 })
const res = await page.goto(`${SITE}/say/${id}`, { waitUntil: 'networkidle' })
if (!res || !res.ok()) { console.error(`the page answered ${res?.status()}`); process.exit(1) }
await page.evaluate(() => document.fonts.ready)

// The sheet is the element with the header band as its first child.
const marks = await page.evaluate(() => {
  const band = [...document.querySelectorAll('p')].find((p) => p.textContent.startsWith('A script from Guided Childhood'))
  const sheet = band.parentElement.parentElement
  sheet.setAttribute('data-capture', 'sheet')
  const s = sheet.getBoundingClientRect()
  const border = parseFloat(getComputedStyle(sheet).borderTopWidth)
  const y = (el) => el.getBoundingClientRect()
  const labels = [...sheet.querySelectorAll('span')]
  const sayHead = labels.find((x) => x.textContent === 'Say this')
  const notHead = labels.find((x) => x.textContent === 'Not this')
  const notBlock = notHead.parentElement.parentElement
  const divider = notBlock.previousElementSibling
  return {
    width: s.width, height: s.height, border,
    sayTop: y(sayHead).top - s.top,
    endSay: y(divider).top - s.top,
    say: sheet.querySelector('blockquote').textContent,
    title: sheet.querySelector('h1').textContent,
    ages: band.textContent,
  }
})

const out = join(ROOT, 'content/ads/screens', `${name}.png`)
await page.locator('[data-capture="sheet"]').screenshot({ path: out })
await browser.close()

// Crops sit inside the sheet's own edge; the card draws the edge outside.
const b = marks.border
const w = Math.round((marks.width - 2 * b) * 10) / 10
const r = (n) => Math.round(n * 10) / 10
const top = r(marks.sayTop - 22)
const crop = [r(b), top, w, r(marks.endSay - 8 - top)]
console.log(`content/ads/screens/${name}.png  ${Math.round(marks.width)} by ${Math.round(marks.height)} points`)
console.log(`  title       ${marks.title}`)
console.log(`  header      ${marks.ages}`)
console.log(`  say this    ${marks.say}`)
console.log(`  "screen": { "image": "content/ads/screens/${name}.png", "points": ${r(marks.width)}, "crop": ${JSON.stringify(crop)} }`)
