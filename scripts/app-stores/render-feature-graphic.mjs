// Renders app-stores/feature-graphic.html to the 1024 x 500 PNG Google Play
// asks for (24 bit, no alpha). Run: node scripts/app-stores/render-feature-graphic.mjs
import path from 'node:path'
import sharp from 'sharp'

const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1024, height: 500 }, deviceScaleFactor: 1 })
await page.goto('file://' + path.resolve('app-stores/feature-graphic.html'))
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1024, height: 500 } })
await sharp(png).flatten({ background: '#FEF7E0' }).png().toFile('app-stores/screenshots/play-feature-graphic.png')
await browser.close()
console.log('app-stores/screenshots/play-feature-graphic.png')
