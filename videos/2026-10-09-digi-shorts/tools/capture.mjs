// Captures the REAL product screens for the DiGi shorts. The ref-* preview
// pages render the live components with made up data and 404 in production,
// so they are captured from the local dev server at phone width and three
// times the pixel density, which keeps phone text sharp when the camera
// zooms in. The live home page is captured too, for the backdrop.
//   DEV=http://localhost:51026 node tools/capture.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const DEV = process.env.DEV || 'http://localhost:51026'
const out = new URL('../assets/captures/', import.meta.url).pathname
const PHONE = { width: 390, height: 844 }
const shots = [
  // name, url, viewport, full page
  ['digi-empty', `${DEV}/ref-digi-chat?kids=1`, PHONE, false],
  ['digi-chat', `${DEV}/ref-digi-chat?kids=1&chat=1`, PHONE, false],
  ['today-path', `${DEV}/ref-today-path`, PHONE, true],
  ['today-path-done', `${DEV}/ref-today-path?done=1`, PHONE, true],
  ['kid-path', `${DEV}/ref-kid-path`, PHONE, true],
  ['kid-today', `${DEV}/ref-kid-today`, PHONE, true],
  ['kid-home', `${DEV}/ref-kid-home`, PHONE, true],
  ['timer-nudge', `${DEV}/ref-timer-nudge`, PHONE, true],
  ['time-tiers', `${DEV}/ref-time-tiers`, PHONE, true],
  ['balance', `${DEV}/ref-balance`, PHONE, true],
  ['your-screens', `${DEV}/ref-your-screens`, PHONE, true],
  ['ask-first', `${DEV}/ref-ask-first`, PHONE, true],
  ['checkin-ack', `${DEV}/ref-checkin-acknowledge`, PHONE, true],
  ['baseline-checkin', `${DEV}/ref-baseline-checkin`, PHONE, true],
  ['day-tick', `${DEV}/ref-day-tick`, PHONE, true],
  ['needs-you', `${DEV}/ref-needs-you`, PHONE, true],
  ['passport-book', `${DEV}/ref-passport-book`, PHONE, true],
  ['watch-stages', `${DEV}/ref-watch-stages`, PHONE, true],
  ['home-live-desktop', 'https://www.guidedchildhood.com/', { width: 1440, height: 900 }, false],
  ['home-live-desktop-full', 'https://www.guidedchildhood.com/', { width: 1440, height: 900 }, true],
  ['home-live-phone', 'https://www.guidedchildhood.com/', PHONE, true],
]
const only = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
for (const [name, url, vp, full] of shots) {
  if (only.length && !only.includes(name)) continue
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 3 })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)
    // The Next dev badge and error overlay are not the product.
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
    // Let GSAP entrances and any idle bounce settle.
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${out}${name}.png`, fullPage: full })
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    console.log(`ok   ${name.padEnd(24)} ${vp.width}x${full ? h : vp.height}`)
  } catch (e) { console.log(`FAIL ${name.padEnd(24)} ${String(e.message).split('\n')[0]}`) }
  await page.close()
}
await browser.close()
