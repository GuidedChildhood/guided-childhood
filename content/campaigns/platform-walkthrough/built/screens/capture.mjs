#!/usr/bin/env node
// Captures the real parent and child screens the walkthrough carousels use.
//
// Every screen is a reference preview page (app/ref-*), which renders the live
// component with made up data and 404s in production, so this runs against the
// local dev server. The film family's names are swapped in before any pixel is
// drawn, exactly as the film tools do it, and the Next dev badge is hidden
// because it is not the product.
//
//   DEV=http://localhost:3000 node content/campaigns/platform-walkthrough/built/screens/capture.mjs [name ...]
//   ... --map <page>   prints where every line of text sits on a page, for framing
//   ... --full <page> <out.png>   one full page still at 3x, for the film engine
//
// A crop is named by the text it starts at and the text it ends at, never by
// a pixel count, so a screen that grows a line still crops in the right place.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')

const HERE = dirname(fileURLToPath(import.meta.url))
const DEV = process.env.DEV || 'http://localhost:3000'
const TOOLS = join(HERE, '../../../../../videos/2026-10-09-digi-shorts/tools/')
// The fixtures' own made up names are brought into the one film family too.
const NAMES = { ...JSON.parse(readFileSync(TOOLS + 'names.json', 'utf8')), Gus: 'Sam', Ivy: 'Ava' }
const NAMES_JS = readFileSync(TOOLS + 'names.js', 'utf8')

// name, page, [start text, offset from its top], [end text, offset from its bottom]
const SHOTS = [
  ['devices', 'ref-your-screens', ['The screens in your home', -30], ['+ Add a device', 34]],
  ['script-say', 'ref-script-deck', ['1 of 4', -34], ['NEXT', 26]],
  ['checkin-heard', 'ref-checkin-acknowledge', ['Heard.', -46], ['Wanting a phone like her friends', 44]],
  ['checkin-first', 'ref-baseline-checkin', ['WHERE THINGS ARE NOW', -34], ['Bedtime screens', 150]],
  ['checkin-faces', 'ref-baseline-checkin', ['STILL ON THE LIST', -34], ['Mood after screens', 150]],
  ['star-chart', 'ref-star-chart-sheet', ["Ava's star chart", -46], ['Feed the dog before school', 26]],
  ['keepsake', 'ref-shop', ['The printed passport', -40], ['Add to basket', 36]],
  ['stage-result', 'ref-reveal', ["Sam's pathway", -88], ['You told us', 150]],
  ['jobs-board', 'ref-job-board', ["On Ava's board", -30], ['Bed', 150]],
  ['jobs-status', 'ref-status-board', ['Where every job is', -30], ['Say yes', 40]],
  ['school-week', 'ref-school-card', ['This week', -22], ['Pay for the Warwick Castle trip', 70]],
  ['homework', 'ref-learning-year', ['At school', -30], ['It ended in tears', 110]],
  ['homework-stuck', 'ref-learning-year', ['Stuck on tonight', -30], ['Coming up, in about', 26]],
  ['kid-jobs', 'ref-kid-jobs', ['Do these jobs', -30], ['One hour of outside play', 96]],
  ['kid-pitch', 'ref-kid-suggest', ['Ask for a job', -22], ['Got a quest idea?', 150]],
  ['kid-five', 'ref-kid-five', ['Your five for today', -22], ['Phones down together', 80]],
  ['sticker-book', 'ref-sticker-book', ['MY STICKER BOOK', -24], ['Cosmo', 110]],
  ['kid-week', 'ref-kid-week', ['This week', -10], ['Add to today', 40]],
]

const args = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
async function open(path, dpr = 3) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr })
  await page.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
  await page.goto(`${DEV}/${path}`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
  await page.waitForTimeout(2500)
  return page
}
// Where a line of text sits: the smallest element whose own text starts with it.
const find = (page, text) => page.evaluate((text) => {
  let best = null
  for (const el of document.querySelectorAll('body *')) {
    // innerText follows text-transform, and a button may lead with an icon,
    // so compare without case and without any leading symbols.
    const t = (el.innerText || '').trim().replace(/^[^A-Za-z0-9]+/, '').toLowerCase()
    if (!t.startsWith(text.replace(/^[^A-Za-z0-9]+/, '').toLowerCase())) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    if (!best || r.width * r.height < best.a) best = { a: r.width * r.height, top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right }
  }
  return best
}, text)

if (args[0] === '--map') {
  const page = await open(args[1], 1)
  const rows = await page.evaluate(() => {
    const out = []
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      const t = n.nodeValue.trim(); if (!t) continue
      const r = n.parentElement.getBoundingClientRect(); if (!r.width) continue
      out.push([Math.round(r.top + scrollY), Math.round(r.left), Math.round(r.width), Math.round(r.height), t.slice(0, 70)])
    }
    return out
  })
  for (const r of rows) console.log(String(r[0]).padStart(5), String(r[1]).padStart(4), String(r[2]).padStart(4), String(r[3]).padStart(3), r[4])
} else if (args[0] === '--full') {
  const page = await open(args[1])
  await page.screenshot({ path: args[2], fullPage: true })
  console.log('full', args[1], await page.evaluate(() => document.documentElement.scrollHeight))
} else {
  for (const [name, path, start, end] of SHOTS) {
    if (args.length && !args.includes(name)) continue
    const page = await open(path)
    const a = await find(page, start[0]), b = await find(page, end[0])
    if (!a || !b) { console.log(`FAIL ${name}: ${!a ? start[0] : end[0]} is not on ${path}`); await page.close(); continue }
    const y = Math.max(0, a.top + start[1]), h = b.bottom + end[1] - y
    await page.screenshot({ path: join(HERE, `${name}.png`), fullPage: true, clip: { x: 0, y, width: 390, height: h } })
    console.log(`ok   ${name.padEnd(16)} 390 x ${Math.round(h)}${h > 840 ? '  (taller than the phone frame)' : ''}`)
    await page.close()
  }
}
await browser.close()
