#!/usr/bin/env node
// Captures the public pages of the live schools site for the schools posts.
// Nothing here needs a school code: every page is on the open list in
// schools/lib/access.ts. A crop runs from one line of text to another, so it
// still lands when the page grows a paragraph.
//
//   node content/campaigns/platform-walkthrough/built/decks/capture-schools.mjs [name ...]
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '../screens-schools'); mkdirSync(OUT, { recursive: true })
const SITE = 'https://schools.guidedchildhood.com'
const STAGES = [['eyfs', 'EYFS Reception'], ['ks1', 'KS1 Years 1 and 2'], ['ks2', 'KS2 Years 3 to 6'], ['ks3', 'KS3 Years 7 to 9'], ['ks4', 'KS4 Years 10 and 11'], ['ks5', 'KS5 Years 12 and 13']]

// name, path, start text, end text, [pad above start, pad below end], optional wait in ms
const SHOTS = [
  ...STAGES.map(([k, h]) => [`map-${k}`, '/curriculum', h, null, [0, 0]]),
  ['dsl-head', '/hub/dsl', 'Safeguarding crosswalk', 'The PSHE Association advises', [46, 26], 0, [226, 830]],
  ['dsl-school', '/hub/dsl', 'Make this page your school', 'Save on this screen', [40, 60], 0, [226, 830]],
  ['dsl-note', '/hub/dsl', 'Private like a toothbrush', 'Who is on the other side?', [34, -40], 0, [226, 830]],
  ['pilot', '/pilot', 'Teach it for a term. Decide after.', 'At the end of the term you carry on', [56, 28], 0, [96, 580]],
  ['rshe-head', '/hub/rshe-mapping', 'Statutory coverage, requirement by requirement', 'Honesty note', [46, -12], 0, [146, 780]],
  ['rshe-count', '/hub/rshe-mapping', 'What this scheme teaches, requirement by requirement', 'PRIMARY · RELATIONSHIPS EDUCATION', [30, -14], 3500, [146, 990]],
  ['rshe-row', '/hub/rshe-mapping', 'PRIMARY · RELATIONSHIPS EDUCATION', 'RSHE-P-OSA-2', [16, -22], 3500, [146, 990]],
]

const only = process.argv.slice(2)
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })).newPage()
const box = (text) => page.evaluate((text) => {
  const want = text.toLowerCase(); let best = null
  for (const el of document.querySelectorAll('body *')) {
    const t = (el.innerText || '').trim().toLowerCase(); if (!t.startsWith(want)) continue
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue
    if (!best || r.width * r.height < best.a) best = { a: r.width * r.height, top: r.top + scrollY, bottom: r.bottom + scrollY }
  }
  return best
}, text)
let at = ''
for (const [name, path, start, end, [above, below], wait, col] of SHOTS) {
  if (only.length && !only.includes(name)) continue
  if (at !== path) { await page.goto(SITE + path, { waitUntil: 'networkidle', timeout: 60000 }); await page.waitForTimeout(wait || 1000); at = path }
  let top, bottom
  if (end === null) {
    // A key stage on the map: its heading down to the foot of its first row of lesson cards.
    const r = await page.evaluate((h) => {
      const sec = [...document.querySelectorAll('section')].find((s) => (s.querySelector('h2')?.innerText || '').trim().replace(/\s+/g, ' ') === h)
      if (!sec) return null
      const links = [...sec.querySelectorAll('a')].filter((a) => /lesson|unlock|teach/i.test(a.innerText)).map((a) => a.getBoundingClientRect())
      const first = Math.min(...links.map((l) => l.top))
      // Start at the cards, not the paragraph above them: the post writes its own line for each stage.
      // The card is the first box around a lesson title that also holds the friend's picture.
      const card = (h) => { let e = h; while (e.parentElement && e !== sec && !e.querySelector('img')) e = e.parentElement; return e.getBoundingClientRect().top }
      const heads = [...sec.querySelectorAll('h3')].map(card)
      return { top: Math.min(...heads) + scrollY - 14, bottom: Math.max(...links.filter((l) => l.top < first + 40).map((l) => l.bottom)) + scrollY + 34 }
    }, start)
    if (!r) { console.log(`FAIL ${name}`); continue }
    top = r.top - above; bottom = r.bottom
  } else {
    const a = await box(start), b = await box(end)
    if (!a || !b) { console.log(`FAIL ${name}: ${!a ? start : end}`); continue }
    top = a.top - above; bottom = (below < 0 ? b.top + below : b.bottom + below)
  }
  // Numbers that count up only do it once they are on screen.
  if (wait) { await page.evaluate((y) => window.scrollTo(0, y - 80), top); await page.waitForTimeout(wait) }
  const [x, w] = col || [96, 1088]
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true, clip: { x, y: Math.max(0, top), width: w, height: bottom - top } })
  console.log(`ok   ${name.padEnd(12)} 1088 x ${Math.round(bottom - top)}`)
}
// The opening panel of a safeguarding flagged lesson, on the free one.
if (!only.length || only.includes('flagged')) {
  await page.setViewportSize({ width: 1280, height: 760 })
  await page.goto(SITE + '/teach/ks3-12-misinfo-deepfakes', { waitUntil: 'networkidle' }); await page.waitForTimeout(1000)
  const a = await box('For you, before the class sees slide 1'), b = await box('Start the lesson')
  if (a && b) { await page.screenshot({ path: join(OUT, 'flagged.png'), fullPage: true, clip: { x: 60, y: a.top - 40, width: 1160, height: b.bottom + 44 - (a.top - 40) } }); console.log('ok   flagged') } else console.log('FAIL flagged')
}
await browser.close()
