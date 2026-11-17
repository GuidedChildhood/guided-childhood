#!/usr/bin/env node
// Captures the real screens for the "New in the app" walkthrough posts.
//
// Same rules as content/campaigns/platform-walkthrough/built/screens/capture.mjs:
// reference and dev fixture pages only (they render the live component with
// made up data and 404 in production), the film family's names swapped in
// before any pixel is drawn (videos/2026-10-09-digi-shorts/tools/names.json),
// and the Next dev badge hidden. A shot is named by the text inside the card it
// frames, never by pixels, so a card that grows a line still crops right.
//
//   DEV=http://localhost:3100 node content/campaigns/new-in-the-app/screens/capture.mjs [name ...]
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '../../../..')
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || join(ROOT, 'node_modules/playwright/index.mjs'))
const DEV = process.env.DEV || 'http://localhost:3000'
const TOOLS = join(ROOT, 'videos/2026-10-09-digi-shorts/tools/')
const NAMES = { ...JSON.parse(readFileSync(TOOLS + 'names.json', 'utf8')), Jonny: 'Ava', Gus: 'Sam', Ivy: 'Ava' }
const NAMES_JS = readFileSync(TOOLS + 'names.js', 'utf8')

// name, page, text inside the card, optional steps to run first
const SHOTS = [
  ['snap', 'dev/school-catch', 'Snap it and DiGi reads it'],
  ['letterbox', 'dev/school-letterbox', 'Let DiGi catch'],
  ['school-week', 'dev/school-week', 'This week', { region: ['This week', 'THU'] }],
  ['kid-week', 'dev/kid-school-week', 'This week', { region: ['This week', 'Most of this comes from'] }],
  ['watch-book', 'ref-watch-booking', 'Watch it together later'],
  ['watch-booked', 'ref-watch-booking', 'Booked for today'],
  ['watch-home', 'ref-watch-booking', 'With Ava, today at 5pm'],
  ['watch-child', 'ref-watch-booking', 'Watch it with Mum'],
  ['worries', 'starter-pack', 'What would you like help with?', { flow: 'worries' }],
]

const want = process.argv.slice(2)
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
  .catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }))

// The bordered card that holds a line of text: the smallest element whose own
// text starts with it, then up to the first ancestor with a real border.
const cardBox = (page, text) => page.evaluate((text) => {
  const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').replace(/^[^A-Za-z0-9]+/, '').toLowerCase()
  let best = null
  for (const el of document.querySelectorAll('body *')) {
    if (!norm(el.innerText).startsWith(norm(text))) continue
    const r = el.getBoundingClientRect(); if (!r.width) continue
    if (!best || r.width * r.height < best.getBoundingClientRect().width * best.getBoundingClientRect().height) best = el
  }
  let el = best
  while (el && el !== document.body) {
    const cs = getComputedStyle(el)
    if (parseFloat(cs.borderTopWidth) >= 1.5 && parseFloat(cs.borderTopLeftRadius) >= 8) break
    el = el.parentElement
  }
  const r = (el || best).getBoundingClientRect()
  return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height }
}, text)

const textTop = (page, text, bottom) => page.evaluate(([text, bottom]) => {
  const norm = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase()
  let best = null
  for (const el of document.querySelectorAll('body *')) {
    if (!norm(el.innerText).startsWith(norm(text))) continue
    const r = el.getBoundingClientRect(); if (!r.width) continue
    if (!best || r.width * r.height < best.a) best = { a: r.width * r.height, y: (bottom ? r.top : r.top) + scrollY }
  }
  return best?.y
}, [text, bottom])

for (const [name, path, text, opts = {}] of SHOTS) {
  if (want.length && !want.includes(name)) continue
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
  await page.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
  await page.goto(`${DEV}/${path}`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
  if (opts.flow === 'worries') {
    // Start, pick an age, then open the whole grid of twelve.
    await page.getByRole('button', { name: /Start, it is free/ }).click()
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: /^9$/ }).first().click().catch(() => {})
    await page.waitForTimeout(400)
    const next = page.getByRole('button', { name: /Next|Continue/ }).first()
    if (await next.isVisible().catch(() => false)) await next.click()
    await page.waitForTimeout(1200)
    const more = page.getByRole('button', { name: /more|all/i }).first()
    if (await more.isVisible().catch(() => false)) { await more.click(); await page.waitForTimeout(600) }
    const top = await textTop(page, text)
    const end = await textTop(page, 'This is just the start')
    await page.screenshot({ path: join(HERE, `${name}.png`), fullPage: true, clip: { x: 0, y: Math.max(0, top - 24), width: 390, height: end - top + 10 } })
    console.log(`  ${name}.png`)
    await page.close(); continue
  }
  await page.waitForTimeout(2000)
  let clip
  if (opts.region) {
    const a = await textTop(page, opts.region[0]); const b = await textTop(page, opts.region[1])
    clip = { x: 0, y: a - 16, width: 390, height: b - a + 4 }
  } else {
    const b = await cardBox(page, text)
    clip = { x: Math.max(0, b.x - 10), y: Math.max(0, b.y - 10), width: Math.min(390, b.w + 20), height: b.h + 22 }
  }
  await page.screenshot({ path: join(HERE, `${name}.png`), fullPage: true, clip })
  console.log(`  ${name}.png`)
  await page.close()
}
await browser.close()
