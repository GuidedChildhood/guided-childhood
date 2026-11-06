// Captures the store screenshots from the REAL app, never a mocked screen.
//
// Phone shots (Google Play, and the Microsoft Store's mobile slot) come from
// the ref- preview pages, which render the live components with sample data
// and 404 in production, so they are taken from a local dev server. Those
// fixtures carry Justin's children's real names, so the same name swap the
// DiGi shorts use (videos/2026-10-09-digi-shorts/tools/names.*) runs in the
// page before anything is drawn. No real family appears in any store image.
//
// Desktop shots (Microsoft Store) come from the live public site.
//
// Play wants 24 bit PNG or JPEG, no alpha, the long side at most twice the
// short. 1080 x 1920 phone and 1920 x 1080 desktop satisfy both stores.
//
// Run: npm run dev, then  DEV=http://localhost:3000 node scripts/app-stores/capture-store-screens.mjs [name...]
import fs from 'node:fs'
import sharp from 'sharp'

const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const DEV = process.env.DEV || 'http://localhost:3000'
const LIVE = 'https://www.guidedchildhood.com'
const OUT = 'app-stores/screenshots'
const NAMES_DIR = 'videos/2026-10-09-digi-shorts/tools'

// 405 x 720 CSS pixels at 8/3 density is exactly 1080 x 1920.
const PHONE = { viewport: { width: 405, height: 720 }, dpr: 8 / 3, dir: 'phone' }
const DESKTOP = { viewport: { width: 1280, height: 720 }, dpr: 1.5, dir: 'desktop' }

const shots = [
  // name, url, device, options: scroll (px, or 'end'), swap (extra names for
  // this shot only), wait ('load' for pages that keep a request open)
  ['01-today', `${DEV}/ref-today-path`, PHONE, {}],
  // The fixture asks about a boy and the reply says "he", so this one shot
  // swaps to a name that reads either way rather than the series' Ava.
  ['02-digi', `${DEV}/ref-digi-chat?kids=1&chat=1`, PHONE, { scroll: 'end', swap: { Teo: 'Sam' } }],
  ['03-script-deck', `${DEV}/ref-script-deck`, PHONE, {}],
  ['04-checkin', `${DEV}/ref-baseline-checkin`, PHONE, {}],
  ['05-child-home', `${DEV}/ref-kid-home`, PHONE, { wait: 'load' }],
  ['06-child-jobs', `${DEV}/ref-kid-jobs`, PHONE, {}],
  ['d1-home', `${LIVE}/`, DESKTOP, {}],
  ['d2-kids-app', `${LIVE}/kids-app`, DESKTOP, {}],
  ['d3-starter-pack', `${LIVE}/starter-pack`, DESKTOP, {}],
]

const only = process.argv.slice(2)
const NAMES = JSON.parse(fs.readFileSync(`${NAMES_DIR}/names.json`, 'utf8'))
const NAMES_JS = fs.readFileSync(`${NAMES_DIR}/names.js`, 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })

for (const [name, url, dev, opt] of shots) {
  if (only.length && !only.includes(name)) continue
  const page = await browser.newPage({ viewport: dev.viewport, deviceScaleFactor: dev.dpr, isMobile: dev === PHONE, hasTouch: dev === PHONE })
  await page.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify({ ...NAMES, ...(opt.swap || {}) })};\n${NAMES_JS}` })
  try {
    await page.goto(url, { waitUntil: opt.wait || 'networkidle', timeout: 120000 })
    await page.evaluate(() => document.fonts.ready)
    // The Next dev badge is not the product, and neither is a cookie banner.
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
    // The ref- pages label their sections "Reference · ..." for us; that
    // label is fixture chrome, not the product, so it is hidden.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        if (!el.children.length && /^reference\b/i.test(el.textContent.trim())) el.style.visibility = 'hidden'
      }
    })
    if (opt.scroll) await page.evaluate((y) => window.scrollTo(0, y === 'end' ? document.documentElement.scrollHeight : y), opt.scroll)
    await page.waitForTimeout(2500)
    // Again just before the shot: the dev indicator mounts late.
    await page.evaluate(() => document.querySelectorAll('nextjs-portal, [data-nextjs-toast], [data-next-badge-root]').forEach((e) => e.remove()))
    fs.mkdirSync(`${OUT}/${dev.dir}`, { recursive: true })
    const png = await page.screenshot({ fullPage: false })
    await sharp(png).flatten({ background: '#FFFFFF' }).jpeg({ quality: 90 }).toFile(`${OUT}/${dev.dir}/${name}.jpg`)
    console.log(`ok   ${dev.dir}/${name}.jpg`)
  } catch (e) {
    console.log(`FAIL ${name} ${String(e.message).split('\n')[0]}`)
  }
  await page.close()
}
await browser.close()
