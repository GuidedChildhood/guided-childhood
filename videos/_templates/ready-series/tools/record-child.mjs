#!/usr/bin/env node
// Screen records the REAL child app at phone size for the series. Look and
// scroll only: nothing is tapped, because a tap ticks a real job or starts a
// real timer on a real family's account. The child's name may show; crop or
// blur it before a recording goes in a film.
//   node tools/record-child.mjs <child url> recordings/
import { chromium } from 'playwright'
import { renameSync, readdirSync } from 'node:fs'
const [url, out = 'recordings/'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, recordVideo: { dir: out, size: { width: 780, height: 1688 } } })
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(3500)
await page.screenshot({ path: out + 'child-home.png', fullPage: true })
const h = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < h - 844; y += 6) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(16) }
await page.waitForTimeout(2000)
for (let y = h - 844; y > 0; y -= 12) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(16) }
await page.waitForTimeout(1500)
await ctx.close(); await browser.close()
const f = readdirSync(out).filter((x) => x.endsWith('.webm')).sort().pop()
renameSync(out + f, out + 'child-home.webm')
console.log('recorded', out + 'child-home.webm', 'page height', h)
