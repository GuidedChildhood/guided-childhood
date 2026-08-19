// Screenshots of /ref-application for the reshape review. Not a check script.
import { chromium } from 'playwright'
const base = process.env.BASE ?? 'http://localhost:58591'
const out = process.env.OUT ?? '/tmp'
const browser = await chromium.launch()
for (const [name, url, w, h] of [
  ['application-375', `${base}/ref-application`, 375, 900],
  ['application-behind-375', `${base}/ref-application?behind=1`, 375, 900],
  ['application-done-375', `${base}/ref-application?done=1`, 375, 900],
  ['application-1280', `${base}/ref-application`, 1280, 800],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  await page.close()
  console.log(name)
}
await browser.close()
