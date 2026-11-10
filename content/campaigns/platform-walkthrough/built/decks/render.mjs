#!/usr/bin/env node
// Renders a walkthrough campaign deck (an HTML file of .page sections, each
// 1080 x 1350) to one PNG a page and, with --pdf, a document for LinkedIn.
//
//   node content/campaigns/platform-walkthrough/built/decks/render.mjs 02-schools <out-folder> [--pdf]
//
// Free to run: Playwright and the fonts already in app/fonts. Nothing here
// calls an image or video model.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const [deck, outArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (!deck || !outArg) { console.error('usage: render.mjs <deck> <out-folder> [--pdf]'); process.exit(1) }
const out = resolve(outArg); mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(join(HERE, `${deck}.html`)).href)
await page.evaluate(() => document.fonts.ready)
await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 10000 })

// A page whose words or pictures run past its own edge is a failed render,
// so say so instead of saving a clipped card.
const spill = await page.evaluate(() => [...document.querySelectorAll('.page')].flatMap((p) => {
  const pr = p.getBoundingClientRect()
  return [...p.querySelectorAll('.body, .quote, .win, .foot')].filter((e) => {
    const r = e.getBoundingClientRect(); return r.bottom > pr.bottom - 20 || r.right > pr.right - 40
  }).map((e) => `${p.dataset.name}: ${e.className} ends ${Math.round(e.getBoundingClientRect().bottom - pr.top)}px`)
}))
if (spill.length) { console.error('SPILL\n  ' + spill.join('\n  ')); }

for (const el of await page.locator('.page').all()) {
  const name = await el.getAttribute('data-name')
  await el.screenshot({ path: join(out, `${name}.png`) })
  console.log(`  ${name}.png`)
}
if (process.argv.includes('--pdf')) {
  await page.addStyleTag({ content: '@page{size:1080px 1350px;margin:0} body{background:none}' })
  await page.pdf({ path: join(out, 'carousel.pdf'), width: '1080px', height: '1350px', printBackground: true })
  console.log('  carousel.pdf')
}
await browser.close()
process.exit(spill.length ? 1 : 0)
