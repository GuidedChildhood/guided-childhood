#!/usr/bin/env node
/**
 * Renders carousel.html (beside this file) to 01.png ... 07.png at 1080 by 1350,
 * then contact-sheet.png with all seven in a grid. Local only, no credits.
 *
 *   node content/brand-story/weeks/2026-11-09/carousel-ladder/render.mjs
 *
 * It refuses to write PNGs if Nunito or IBM Plex Mono did not load (a fallback
 * face), and reports any text box outside the 88px margins or clipped.
 */
import { createRequire } from 'node:module'
import { writeFileSync, unlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
let chromium
for (const p of ['playwright', '/Users/justinphillips/guided-childhood/node_modules/playwright', '/opt/node22/lib/node_modules/playwright']) {
  try { ({ chromium } = require(p)); break } catch {}
}
if (!chromium) { console.error('Playwright not found'); process.exit(1) }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } })
await page.goto(pathToFileURL(join(HERE, 'carousel.html')).href)
await page.waitForFunction(() => window.RENDERED === true)

const fonts = await page.evaluate(() => ({
  nunito900: document.fonts.check('900 96px Nunito'),
  plexMono600: document.fonts.check('600 22px "IBM Plex Mono"'),
  faces: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
}))
console.log('fonts', JSON.stringify(fonts))
if (!fonts.faces.every((f) => f.endsWith('loaded')) || !fonts.nunito900 || !fonts.plexMono600) {
  console.error('A font did not load. Not rendering.')
  process.exit(1)
}

// Every text box inside the 88px margin, nothing scrolled or clipped.
const problems = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('.card').forEach((card, i) => {
    const cr = card.getBoundingClientRect()
    card.querySelectorAll('.top, .zone > *, .foot, .label, .passport, img.friend').forEach((el) => {
      const r = el.getBoundingClientRect()
      const m = el.matches('img.friend, .passport, .label') ? 34 : 88 // art may sit in the grid crop margin's edge, not past it
      const L = r.left-cr.left, R = cr.right-r.right, T = r.top-cr.top, B = cr.bottom-r.bottom
      if (L < m-1 || R < m-1 || T < 0 || B < 0) out.push(`card ${i + 1} ${el.className || el.tagName}: L${L|0} R${R|0} T${T|0} B${B|0}`)
      if (el.scrollWidth > el.clientWidth + 1 && !el.matches('img')) out.push(`card ${i + 1} ${el.className}: overflows its box`)
    })
    // the words must end above the art
    const zone = card.querySelector('.zone').getBoundingClientRect()
    card.querySelectorAll('img.friend, .passport').forEach((a) => {
      const r = a.getBoundingClientRect()
      const overlapX = Math.min(zone.right, r.right)-Math.max(zone.left, r.left)
      const lastText = [...card.querySelectorAll('.zone > *')].map((e) => e.getBoundingClientRect().bottom).reduce((x, y) => Math.max(x, y))
      if (overlapX > 0 && r.top < lastText-4) out.push(`card ${i + 1}: art overlaps the words (art top ${r.top-zone.top | 0}, text bottom ${lastText-zone.top | 0})`)
    })
  })
  return out
})
console.log(problems.length ? 'LAYOUT PROBLEMS\n' + problems.join('\n') : 'layout: every box inside its margin')

const cards = await page.locator('.card').all()
for (let i = 0; i < cards.length; i++) {
  const file = join(HERE, `${String(i + 1).padStart(2, '0')}.png`)
  await cards[i].screenshot({ path: file })
  console.log('  ' + file.replace(HERE + '/', ''))
}

// Contact sheet: four across, three below, on cream.
const sheet = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#EDEAE3;}
.g{display:grid;grid-template-columns:repeat(4,360px);gap:24px;padding:40px;width:max-content;}
img{width:360px;height:450px;display:block;border-radius:10px;box-shadow:0 6px 18px rgba(26,26,46,.12);}
</style></head><body><div class="g">${cards.map((_, i) => `<img src="${String(i + 1).padStart(2, '0')}.png">`).join('')}</div></body></html>`
const sheetPath = join(HERE, '.contact-sheet.html')
writeFileSync(sheetPath, sheet)
const sp = await browser.newPage({ viewport: { width: 1600, height: 1100 } })
await sp.goto(pathToFileURL(sheetPath).href)
await sp.evaluate(() => Promise.all([...document.images].map((im) => im.complete || new Promise((r) => { im.onload = r }))))
await sp.locator('.g').screenshot({ path: join(HERE, 'contact-sheet.png') })
unlinkSync(sheetPath)
console.log('  contact-sheet.png')

await browser.close()
