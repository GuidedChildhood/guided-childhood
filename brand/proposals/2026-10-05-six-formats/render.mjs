// Renders each <section class="card"> in proposal.html to a 1080 x 1350 PNG.
//   node brand/proposals/2026-10-05-six-formats/render.mjs
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')) }
const HERE = dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 } })
await page.goto(pathToFileURL(join(HERE, 'proposal.html')).href)
await page.evaluate(() => document.fonts.ready)
for (const el of await page.$$('section.card')) {
  const id = await el.getAttribute('id')
  await el.screenshot({ path: join(HERE, `${id}.png`) })
  console.log(id)
}
await browser.close()
