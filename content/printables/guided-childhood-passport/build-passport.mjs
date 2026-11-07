// Builds the Guided Childhood Passport printable from print.html, phone.html
// and listing/images.html.
//
//   node content/printables/guided-childhood-passport/build-passport.mjs [print|phone|listing]
//
// Needs playwright-core and a Chrome. The worktree has no node_modules, so
// PW_CORE can point at any checkout's copy; Chrome is the system one on this
// Mac unless CHROME says otherwise.
//
// THE PAPER SIZE IS SWAPPED, NOT SCALED. The fold out sheet must be the whole
// of the paper or its creases move, so US Letter gets its own @page block and
// body.letter sizes rather than an A4 page shrunk to fit.

import { createRequire } from 'node:module'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const DIR = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const PW = process.env.PW_CORE ?? '/Users/justinphillips/guided-childhood/node_modules/playwright-core'
const { chromium } = require(PW)
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const only = process.argv[2]
const SLUG = 'guided-childhood-passport'

const PAGE = {
  a4: '@page { size: A4; margin: 0; } @page land { size: A4 landscape; margin: 0; }',
  letter: '@page { size: letter; margin: 0; } @page land { size: letter landscape; margin: 0; }',
}

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined })
const ready = async page => {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.images].every(i => i.complete))
  await page.waitForTimeout(400)
}

if (!only || only === 'print') {
  mkdirSync(join(DIR, 'product'), { recursive: true })
  mkdirSync(join(DIR, 'images/preview/check'), { recursive: true })
  const page = await browser.newPage()
  await page.goto('file://' + join(DIR, 'print.html'))
  await ready(page)
  const variant = async (paper, ink, name) => {
    await page.evaluate(([css, paper, ink]) => {
      document.getElementById('pagesize').textContent = css
      document.body.classList.toggle('letter', paper === 'letter')
      document.body.classList.toggle('ink', ink)
    }, [PAGE[paper], paper, ink])
    await page.waitForTimeout(200)
    await page.pdf({ path: join(DIR, 'product', name), preferCSSPageSize: true, printBackground: true })
    console.log('pdf', name)
  }
  await variant('a4', false, `${SLUG}-A4.pdf`)
  await variant('letter', false, `${SLUG}-USLetter.pdf`)
  await variant('a4', true, `${SLUG}-A4-ink-saver.pdf`)

  // Page previews for checking by eye and for the listing images. A4 colour.
  const pv = await browser.newPage({ viewport: { width: 1300, height: 1300 }, deviceScaleFactor: 2 })
  await pv.goto('file://' + join(DIR, 'print.html'))
  await ready(pv)
  const sheets = pv.locator('.sheet, .zine')
  const n = await sheets.count()
  for (let i = 0; i < n; i++) await sheets.nth(i).screenshot({ path: join(DIR, 'images/preview', `page-${String(i + 1).padStart(2, '0')}.png`) })
  // The ink saver and the US Letter fold out sheet as well, so both get looked at.
  await pv.evaluate(() => document.body.classList.add('ink'))
  for (let i = 0; i < n; i++) await sheets.nth(i).screenshot({ path: join(DIR, 'images/preview/check', `ink-page-${String(i + 1).padStart(2, '0')}.png`) })
  await pv.evaluate(() => { document.body.classList.remove('ink'); document.body.classList.add('letter') })
  for (let i = 0; i < n; i++) await sheets.nth(i).screenshot({ path: join(DIR, 'images/preview/check', `letter-page-${String(i + 1).padStart(2, '0')}.png`) })
  console.log('previews', n)
}

if (!only || only === 'phone') {
  mkdirSync(join(DIR, 'phone'), { recursive: true })
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
  await page.goto('file://' + join(DIR, 'phone.html'))
  await ready(page)
  const screens = page.locator('.screen')
  const n = await screens.count()
  for (let i = 0; i < n; i++) {
    const id = await screens.nth(i).getAttribute('data-name')
    await screens.nth(i).screenshot({ path: join(DIR, 'phone', `${id}.png`) })
  }
  console.log('phone', n)
}

// The printed edition's listing photos, from the printed previews above.
if (only === 'printed-listing') {
  mkdirSync(join(DIR, 'listing/images/printed'), { recursive: true })
  const page = await browser.newPage({ viewport: { width: 2000, height: 2000 } })
  await page.goto('file://' + join(DIR, 'listing/printed-images.html'))
  await ready(page)
  const frames = page.locator('.frame')
  const n = await frames.count()
  for (let i = 0; i < n; i++) {
    const id = await frames.nth(i).getAttribute('data-name')
    await frames.nth(i).screenshot({ path: join(DIR, 'listing/images/printed', `${id}.png`) })
  }
  console.log('printed listing images', n)
}

if (!only || only === 'listing') {
  mkdirSync(join(DIR, 'listing/images'), { recursive: true })
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
  // Real life photos: Pebble's page (page 4) on the kitchen table and the
  // fridge, by ../scene-composite.mjs, named 01c and 01d to sit with the cover.
  for (const [i, s] of ['table-oak', 'fridge-cream'].entries()) {
    execFileSync(process.execPath, [join(DIR, '..', 'scene-composite.mjs'), s, join(DIR, 'images/preview/page-04.png'), join(DIR, 'listing/images', `01${'cd'[i]}-real-${s}.jpg`)], { stdio: 'inherit' })
  }
}

// THE PRINTED EDITION (printed.html). The blank booklet and the sticker
// sheet for Mixam and the sticker printer, page previews for checking, and,
// with --name, one order's booklet:
//
//   node build-passport.mjs printed --name "Alma"
//
// The name goes in through window.PASSPORT_NAME before the page script runs,
// never through the URL, and the order's file lands in printed/orders/, which
// is gitignored: a child's name is order data, not repo content.
if (only === 'printed') {
  const nameAt = process.argv.indexOf('--name')
  const name = nameAt > 0 ? (process.argv[nameAt + 1] ?? '').trim() : ''
  const out = join(DIR, 'printed')
  mkdirSync(join(out, 'orders'), { recursive: true })
  mkdirSync(join(DIR, 'images/preview/printed'), { recursive: true })
  const open = async (viewport) => {
    const page = await browser.newPage(viewport ? { viewport, deviceScaleFactor: 3 } : undefined)
    await page.addInitScript(n => { window.PASSPORT_NAME = n }, name)
    await page.goto('file://' + join(DIR, 'printed.html'))
    await ready(page)
    return page
  }
  const page = await open()
  // The sticker files are one page by definition; pageRanges stops Chrome
  // adding a stray blank second page in the cut line mode.
  const pdf = async (cls, file) => {
    await page.evaluate(c => { document.body.className = c }, cls)
    await page.waitForTimeout(200)
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, ...(cls.startsWith('stickers') ? { pageRanges: '1' } : {}) })
    console.log('pdf', file.replace(DIR + '/', ''))
  }
  if (name) {
    const safe = name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'order'
    await pdf('book', join(out, 'orders', `${SLUG}-printed-A6-${safe}.pdf`))
  } else {
    await pdf('book', join(out, `${SLUG}-printed-A6-booklet.pdf`))
    await pdf('stickers', join(out, `${SLUG}-printed-A6-stickers.pdf`))
    await pdf('stickers cut', join(out, `${SLUG}-printed-A6-stickers-cutline.pdf`))
    // Previews at 3x, trimmed to the A6 page (the 3 mm bleed cropped off),
    // so the listing photos and the films show the book as it is cut.
    const pv = await open({ width: 600, height: 800 })
    const pgs = pv.locator('.pg')
    const n = await pgs.count()
    const MM = 96 / 25.4
    for (let i = 0; i < n; i++) {
      const box = await pgs.nth(i).boundingBox()
      const clip = { x: box.x + 3 * MM, y: box.y + 3 * MM, width: box.width - 6 * MM, height: box.height - 6 * MM }
      await pgs.nth(i).scrollIntoViewIfNeeded()
      const b2 = await pgs.nth(i).boundingBox()
      await pv.screenshot({ path: join(DIR, 'images/preview/printed', `p${String(i + 1).padStart(2, '0')}.png`), clip: { ...clip, x: b2.x + 3 * MM, y: b2.y + 3 * MM } })
    }
    // Each sticker on its own with a clear background, for the listing photos
    // and the films to press into a ring.
    await pv.evaluate(() => { document.body.style.background = 'transparent'; document.querySelector('.pg.sheet').style.background = 'transparent' })
    const cuts = pv.locator('.pg.sheet .cut, .pg.sheet .labelcut')
    const c = await cuts.count()
    for (let i = 0; i < c; i++) await cuts.nth(i).screenshot({ path: join(DIR, 'images/preview/printed', `sticker-${String(i + 1).padStart(2, '0')}.png`), omitBackground: true })
    // The cover with a sample name, for the listing and the films. Never a
    // real child's name in a public asset.
    const named = await browser.newPage({ viewport: { width: 600, height: 800 }, deviceScaleFactor: 3 })
    await named.addInitScript(() => { window.PASSPORT_NAME = 'Sam' })
    await named.goto('file://' + join(DIR, 'printed.html'))
    await ready(named)
    const cb = await named.locator('.pg').first().boundingBox()
    await named.screenshot({ path: join(DIR, 'images/preview/printed', 'p01-named.png'), clip: { x: cb.x + 3 * MM, y: cb.y + 3 * MM, width: cb.width - 6 * MM, height: cb.height - 6 * MM } })
    console.log('printed previews', n, 'stickers', c)
  }
}

await browser.close()
