#!/usr/bin/env node
/**
 * Captures a real screen for an ad card, the same way every time: 390 points
 * wide at three times the pixels, straight from the live public page. Nothing
 * is edited afterwards; a card shows a crop of this file and never a redraw
 * (visual system section 1, ad studio phase 3).
 *
 *   node tools/social-cards/capture.mjs say <script id> <name> [--width 390] [--lines N]
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
 * --width picks another real phone width (360 to 430) when the line breaks at
 * 390 would make a short crop end mid sentence. --lines N also prints a crop
 * from SAY THIS down to the end of the quote's Nth line, for a card that shows
 * only the opening of the words (round 1, the simple mid match card).
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

const argv = process.argv.slice(2)
const flag = (k, d) => { const i = argv.indexOf(k); return i > -1 ? Number(argv[i + 1]) : d }
const WIDTH = flag('--width', 390)
const LINES = flag('--lines', 0)
const [kind, id, name] = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'))
if (kind !== 'say' || !/^[0-9a-f-]{36}$/.test(id || '') || !/^[a-z0-9-]+$/.test(name || '')) {
  console.error('usage: node tools/social-cards/capture.mjs say <script uuid> <name>')
  process.exit(1)
}

const browser = await chromium.launch().catch(() => chromium.launch(existsSync(CHROME) ? { executablePath: CHROME } : { executablePath: '/opt/pw-browsers/chromium' }))
const page = await browser.newPage({ viewport: { width: WIDTH, height: 2600 }, deviceScaleFactor: 3 })
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
    lineEnds: (() => {
      const q = sheet.querySelector('blockquote'); const out = []
      const walker = document.createTreeWalker(q, NodeFilter.SHOW_TEXT); let n
      while ((n = walker.nextNode())) {
        const re = /\S+/g; let m
        while ((m = re.exec(n.data))) {
          const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length)
          const rc = r.getBoundingClientRect(); const top = rc.top - s.top
          const l = out.find((l) => Math.abs(l.top - top) < 4)
          if (l) { l.bottom = Math.max(l.bottom, rc.bottom - s.top); l.words.push(m[0]) } else out.push({ top, bottom: rc.bottom - s.top, words: [m[0]] })
        }
      }
      return out.map((l) => ({ bottom: l.bottom, text: l.words.join(' ') }))
    })(),
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
if (LINES) {
  const end = marks.lineEnds[LINES - 1]
  console.log(`  the first ${LINES} lines: ${marks.lineEnds.slice(0, LINES).map((l) => l.text).join(' / ')}`)
  console.log(`  "screen": { "image": "content/ads/screens/${name}.png", "points": ${r(marks.width)}, "crop": ${JSON.stringify([r(b), top, w, r(end.bottom + 3 - top)])} }`)
}
