// Renders the free printables to the files parents download.
//
//   npx next dev -p 3100   (in another terminal)
//   node scripts/render-free-printables.mjs [http://localhost:3100]
//
// For each issue it writes, into public/printables/free/:
//   <slug>-a4.pdf, <slug>-letter.pdf          colour, four pages
//   <slug>-ink-a4.pdf, <slug>-ink-letter.pdf  ink saver, line art to colour
//   <slug>-booklet-a4.pdf                     A5 booklet: duplex, flip on the
//                                             short edge, fold once
//   <slug>-p1.png ... -p4.png                 the page previews for /free
//
// Chromium's print to PDF from app/print-free, with the fonts the app already
// serves, so the PDF carries Nunito and IBM Plex Mono embedded and every line
// stays vector. The pdf-lib magnet route only has Helvetica, which is why
// these are rendered rather than generated. See
// plans/2026-10-13-free-printables-lead-magnets-plan.md.

import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:3100'
const OUT = 'public/printables/free'
const ISSUES = ['planet-post-1']
const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: EXEC })
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } })

async function load(url) {
  await page.goto(url, { waitUntil: 'load', timeout: 240000 })
  await page.evaluate(() => document.fonts.ready)
  // Every image (the Planet Friends) decoded before the page is printed.
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 30000 })
}

for (const slug of ISSUES) {
  const files = [
    { name: `${slug}-a4.pdf`, q: 'paper=a4' },
    { name: `${slug}-letter.pdf`, q: 'paper=letter' },
    { name: `${slug}-ink-a4.pdf`, q: 'paper=a4&ink=1' },
    { name: `${slug}-ink-letter.pdf`, q: 'paper=letter&ink=1' },
    { name: `${slug}-booklet-a4.pdf`, q: 'paper=a4&layout=booklet' },
  ]
  for (const f of files) {
    await load(`${BASE}/print-free/${slug}?${f.q}`)
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: `${OUT}/${f.name}`, preferCSSPageSize: true, printBackground: true })
    await page.emulateMedia({ media: 'screen' })
    console.log('wrote', f.name)
  }
  await page.setViewportSize({ width: 740, height: 1000 })
  for (const n of [1, 2, 3, 4]) {
    await load(`${BASE}/print-free/${slug}?page=${n}`)
    await page.locator('#planet-post-only').screenshot({ path: `${OUT}/${slug}-p${n}.png` })
    console.log('wrote', `${slug}-p${n}.png`)
  }
  await page.setViewportSize({ width: 1200, height: 1000 })
}
await browser.close()
