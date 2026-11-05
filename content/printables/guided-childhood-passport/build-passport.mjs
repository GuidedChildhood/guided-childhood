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
}

await browser.close()
