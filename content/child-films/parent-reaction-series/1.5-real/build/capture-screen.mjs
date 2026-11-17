// Captures the real Book a time panel, open on its three suggested times, for
// beat 6 of the 1.5 parent film. From the ref-watch-booking fixture on the
// local dev server: the real component with made up data ("Bumble").
import { createRequire } from 'node:module'
import path from 'node:path'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(new URL(import.meta.url).pathname)
const port = process.argv[2] || '3000'
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
await page.goto(`http://localhost:${port}/ref-watch-booking`, { waitUntil: 'networkidle', timeout: 180000 })
await page.getByRole('button', { name: 'Book a time' }).first().click()
await page.getByRole('button', { name: /^Before tea/ }).first().click()
await page.waitForTimeout(400)
// The Next dev badge is not part of the product.
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
const panel = page.locator('main > div > div').first()
await panel.screenshot({ path: path.join(here, 'pics', 'screen.png') })
console.log('captured')
await browser.close()
