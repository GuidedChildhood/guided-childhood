// Captures the real "Their time, three kinds" card for beat 5 of the parent
// film, from the ref-time-tiers fixture on the local dev server. The card's
// one data route is stubbed with made up settings (bedtime 18:30 to 07:00),
// so what is filmed is the real component with its real copy.
import { createRequire } from 'node:module'
import path from 'node:path'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(new URL(import.meta.url).pathname)
const port = process.argv[2] || '3000'
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
await page.route('**/api/quests/time/settings**', r => r.fulfill({ json: {
  coreMinutesDaily: 20, bedtimeStart: '18:30', bedtimeEnd: '07:00', protectMealtimes: true,
  protectSchoolHours: true, starMinutes: 5, ageBand: '4-7', guideBedtime: { start: '18:30', end: '07:00' }, guideDailyMinutes: 60 } }))
await page.goto(`http://localhost:${port}/ref-time-tiers`, { waitUntil: 'networkidle', timeout: 120000 })
await page.waitForSelector('details summary', { timeout: 60000 })
await page.evaluate(() => { document.querySelector('details').open = true })
await page.waitForTimeout(600)
const box = await page.locator('details').boundingBox()
await page.screenshot({ path: path.join(here, 'pics', 'screen-time-tiers.png'), fullPage: true })
console.log('captured', JSON.stringify(box))
await browser.close()
