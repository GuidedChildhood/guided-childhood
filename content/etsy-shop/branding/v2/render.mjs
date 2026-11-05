// Renders the v2 Etsy branding from etsy-v2.html at 2x:
// banner 3360 x 840, icons 1000 x 1000, listing cover 3000 x 2250.
// Run from the repo root: node content/etsy-shop/branding/v2/render.mjs
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')) }

const dir = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1800, height: 2400 } })
await page.goto(pathToFileURL(path.join(dir, 'etsy-v2.html')).href)
await page.evaluate(() => document.fonts.ready)
await page.waitForLoadState('networkidle')

const shots = [
  ['#banner', 'etsy-banner-v2.png'],
  ['#iconA', 'etsy-icon-v2-logo.png'],
  ['#iconB', 'etsy-icon-v2-digi.png'],
  ['#cover', 'etsy-listing-cover-starter-pack.png'],
]
for (const [sel, out] of shots) {
  await page.locator(sel).screenshot({ path: path.join(dir, out) })
  console.log('wrote', out)
}
await browser.close()
