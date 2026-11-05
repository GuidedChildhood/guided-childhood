// Builds one of the Etsy packs the Passport names: the PDFs, the page
// previews, the phone screens and the listing photo set.
//
//   node content/printables/build-pack.mjs <pack> [print|phone|listing|app]
//
// <pack> is calm-down-kit, starter-pack, star-chart, earn-your-screen-time or
// family-phone-agreement. Needs playwright-core and a Chrome: the system
// Chrome on this Mac and the main checkout's playwright-core, unless CHROME
// and PW_CORE say otherwise (same as the Passport's build-passport.mjs).
//
// US LETTER IS THE A4 PAGE AT 94 PERCENT, CENTRED. These packs are laid out
// in millimetres on a 210 by 296 sheet, and Letter is 6mm wider and 18mm
// shorter, so the sheet is scaled to Letter's height and centred across its
// width rather than reflowed. Every page keeps its layout and nothing is cut.
//
// THE APP EDITION IS THE SAME SOURCE WITHOUT ITS LAST PAGE. `app` writes the
// copies the app library and /starter-pack serve from public/printables: the
// colour edition, and the ink friendly one as the "Colour in" download, both A4
// and both without the [data-finish] sheet (../pack-finish.js), which offers an
// Etsy buyer the /etsy-bonus gift and asks for an Etsy review. A family in the
// app has neither to do. Page one becomes the library card, at 1400 on the long
// edge like scripts/build-printable-previews.py, so the card is the sheet. The
// app keys are older than these folders, hence the map. `app` is never part of
// a plain build: run it on purpose after the Etsy edition is signed off.
//
// THE STAR CHART HAS NO SOURCE OF ITS OWN. It is the Starter Pack's
// print.html with body.edition-star-chart, which shows only the sheets marked
// data-star-chart, so a change to the pack's chart flows straight through.

import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const PW = process.env.PW_CORE ?? '/Users/justinphillips/guided-childhood/node_modules/playwright-core'
const { chromium } = require(PW)
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const PACKS = {
  'calm-down-kit': { file: 'calm-down-kit', app: 'calm-down-corner' },
  'starter-pack': { file: 'starter-pack', app: 'starter-pack' },
  // No app edition: the app's own star chart builder is the in app version.
  'star-chart': { file: 'star-reward-chart', source: 'starter-pack', edition: 'star-chart' },
  'earn-your-screen-time': { file: 'earn-your-screen-time', app: 'earn-your-screen-time' },
  'family-phone-agreement': { file: 'family-phone-agreement', app: 'family-phone-agreement' },
}

const pack = process.argv[2]
const only = process.argv[3]
if (!PACKS[pack]) {
  console.error('Usage: node build-pack.mjs <' + Object.keys(PACKS).join('|') + '> [print|phone|listing|app]')
  process.exit(1)
}
const cfg = PACKS[pack]
const DIR = join(ROOT, pack)
const SRC = join(ROOT, cfg.source ?? pack)

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined })
const ready = async page => {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.images].every(i => i.complete))
  await page.waitForTimeout(400)
}
const open = async (page, file) => {
  await page.goto('file://' + file)
  if (cfg.edition) await page.evaluate(e => document.body.classList.add('edition-' + e), cfg.edition)
  await ready(page)
}
const fresh = dir => {
  mkdirSync(dir, { recursive: true })
  for (const f of readdirSync(dir)) if (f.endsWith('.png')) rmSync(join(dir, f))
}

if (!only || only === 'print') {
  mkdirSync(join(DIR, 'product'), { recursive: true })
  const page = await browser.newPage()
  await open(page, join(SRC, 'print.html'))
  const pdf = async (name, ink, letter) => {
    await page.evaluate(ink => document.body.classList.toggle('ink', ink), ink)
    await page.waitForTimeout(200)
    const opts = letter
      ? { width: '215.9mm', height: '279.4mm', scale: 0.94, margin: { left: '9.2mm', top: '0mm', right: '0mm', bottom: '0mm' } }
      : { format: 'A4' }
    await page.pdf({ path: join(DIR, 'product', name), printBackground: true, ...opts })
    console.log('pdf', name)
  }
  await pdf(`${cfg.file}-A4.pdf`, false, false)
  await pdf(`${cfg.file}-USLetter.pdf`, false, true)
  await pdf(`${cfg.file}-A4-ink-friendly.pdf`, true, false)

  // Page previews, used for the check by eye and for the listing photos.
  fresh(join(DIR, 'images/preview'))
  const pv = await browser.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: 2 })
  await open(pv, join(SRC, 'print.html'))
  const sheets = pv.locator('.sheet:visible')
  const n = await sheets.count()
  for (let i = 0; i < n; i++) await sheets.nth(i).screenshot({ path: join(DIR, 'images/preview', `page-${String(i + 1).padStart(2, '0')}.png`) })
  console.log('previews', n)
}

if ((!only || only === 'phone') && existsSync(join(DIR, 'phone.html'))) {
  fresh(join(DIR, 'phone'))
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
  await open(page, join(DIR, 'phone.html'))
  const screens = page.locator('.screen')
  const n = await screens.count()
  for (let i = 0; i < n; i++) {
    const id = await screens.nth(i).getAttribute('data-name')
    await screens.nth(i).screenshot({ path: join(DIR, 'phone', `${id}.png`) })
  }
  console.log('phone', n)
}

if ((!only || only === 'listing') && existsSync(join(DIR, 'listing/images.html'))) {
  fresh(join(DIR, 'listing/images'))
  const page = await browser.newPage({ viewport: { width: 2000, height: 2000 } })
  await page.goto('file://' + join(DIR, 'listing/images.html'))
  await ready(page)
  const frames = page.locator('.frame')
  const n = await frames.count()
  for (let i = 0; i < n; i++) {
    const id = await frames.nth(i).getAttribute('data-name')
    await frames.nth(i).screenshot({ path: join(DIR, 'listing/images', `${id}.png`) })
  }
  console.log('listing images', n)
}

if (only === 'app') {
  if (!cfg.app) throw new Error(`${pack} has no app edition`)
  const OUT = join(ROOT, '../../public/printables')
  const strip = async page => {
    await open(page, join(SRC, 'print.html'))
    await page.evaluate(() => document.querySelectorAll('[data-finish]').forEach(s => s.remove()))
  }
  const page = await browser.newPage()
  await strip(page)
  for (const [suffix, ink] of [['colour', false], ['colourin', true]]) {
    await page.evaluate(ink => document.body.classList.toggle('ink', ink), ink)
    await page.waitForTimeout(200)
    await page.pdf({ path: join(OUT, `${cfg.app}-${suffix}.pdf`), printBackground: true, format: 'A4' })
    console.log('app pdf', `${cfg.app}-${suffix}.pdf`)
  }
  // The sheet is 296mm tall, about 1119 CSS pixels, so this scale lands on 1400.
  const pv = await browser.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: 1400 / 1119 })
  await strip(pv)
  await pv.locator('.sheet:visible').first().screenshot({ path: join(OUT, `${cfg.app}.png`) })
  console.log('app card', `${cfg.app}.png`)
}

await browser.close()
