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
  ['ask-popup-bedtime', `${DEV}/ref-ask-popup?bedtime=1`, PHONE, true],
  ['ask-popup', `${DEV}/ref-ask-popup`, PHONE, true],
  ['ask-first-child', `${DEV}/ref-ask-first?view=child`, PHONE, true],
  ['ask-first-parent', `${DEV}/ref-ask-first?view=parent`, PHONE, true],
  ['ask-first-timer', `${DEV}/ref-ask-first?view=timer`, PHONE, true],
  ['script-rehearse', `${DEV}/ref-script-premium?view=chat`, PHONE, true],
  ['script-premium', `${DEV}/ref-script-premium`, PHONE, true],
  ['kid-path-claimed', `${DEV}/ref-kid-path?claimed=1`, PHONE, true],
  ['kid-jobs-waiting', `${DEV}/ref-kid-jobs?waiting=1`, PHONE, true],
  ['kid-today-holiday', `${DEV}/ref-kid-today?holiday=ready`, PHONE, true],
  ['passport-stage2', `${DEV}/ref-passport-book?stage=2`, PHONE, true],
  ['reveal', `${DEV}/ref-reveal`, PHONE, true],
  // The live home page for the backdrop: the hero only (the full page at 5x
  // is 80,000 px tall and crashes Chrome). name, url, viewport, full, dpr, clipH
  ['home-hero-1920', 'https://www.guidedchildhood.com/', { width: 1920, height: 1080 }, false, 2],
  ['home-hero-phone', 'https://www.guidedchildhood.com/', PHONE, false, 3, 1900],
]
const only = process.argv.slice(2)
const NAMES = JSON.parse((await import('node:fs')).readFileSync(new URL('./names.json', import.meta.url), 'utf8'))
const NAMES_JS = (await import('node:fs')).readFileSync(new URL('./names.js', import.meta.url), 'utf8')
const addNames = (pg) => pg.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
for (const [name, url, vp, full, dpr, clipH] of shots) {
  if (only.length && !only.includes(name)) continue
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: dpr || Number(process.env.DPR || 5) })
  await addNames(page)
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)
    // The Next dev badge and error overlay are not the product.
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
    // Let GSAP entrances and any idle bounce settle.
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `${out}${name}.png`, fullPage: full || !!clipH, ...(clipH ? { clip: { x: 0, y: 0, width: vp.width, height: clipH } } : {}) })
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    console.log(`ok   ${name.padEnd(24)} ${vp.width}x${full ? h : vp.height}`)
  } catch (e) { console.log(`FAIL ${name.padEnd(24)} ${String(e.message).split('\n')[0]}`) }
  await page.close()
}
await browser.close()
