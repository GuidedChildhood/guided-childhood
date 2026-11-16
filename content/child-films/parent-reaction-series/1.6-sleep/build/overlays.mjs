// Draws every word that sits on the 1.6 films as transparent PNGs, in the
// house fonts, from work/overlays.json (written by build.py overlays). Also
// the end cards, the product end card and the YouTube thumbnail.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(new URL(import.meta.url).pathname)
const root = path.resolve(here, '../../../../..')
const work = path.join(here, 'work'); const ov = path.join(work, 'ov'); fs.mkdirSync(ov, { recursive: true })
const font = f => pathToFileURL(path.join(root, 'app/fonts', f)).href
const lockSrc = path.join(root, 'content/brand-assets/guided-childhood-lockup-1600x600.png')
const lockup = path.join(work, 'lockup.png')
if (!fs.existsSync(lockup)) {
  const { execFileSync } = await import('node:child_process')
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', lockSrc, '-vf', 'colorkey=0xF9F8F6:0.06:0.02,crop=iw:ih*0.5:0:ih*0.25', lockup])
}
const LOCK = pathToFileURL(lockup).href
const css = `
@font-face{font-family:Nunito;src:url(${font('nunito-latin-wght-normal.woff2')});font-weight:200 1000}
@font-face{font-family:Plex;src:url(${font('ibm-plex-mono-latin-600-normal.woff2')});font-weight:600}
*{box-sizing:border-box;margin:0}
body{font-family:Nunito;color:#1A1A2E;background:transparent}
.eye{font-family:Plex;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C99A28}
.h{font-weight:900;letter-spacing:-.02em;line-height:1.06}
.b{font-weight:700;color:#52526A;line-height:1.3}
.cap{position:absolute;font-weight:800;line-height:1.2;color:#1A1A2E}
.pill{position:absolute;font-weight:900;letter-spacing:-.01em;background:#F9F8F6;color:#1A1A2E;border-radius:999px;padding:.28em .9em;box-shadow:0 6px 0 #C99A28;white-space:nowrap}
.card{position:absolute;background:#F9F8F6;border-radius:28px;box-shadow:0 8px 0 #C99A28,0 18px 40px rgba(26,26,46,.18)}
.url{font-weight:800;background:#EDC35F;border-radius:16px;box-shadow:0 5px 0 #C99A28;display:inline-block}
`
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const page = await browser.newPage()
const shot = async (body, w, h, file, transparent = true) => {
  await page.setViewportSize({ width: w, height: h })
  const tmp = path.join(work, '_page.html')
  fs.writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css}</style><div style="position:relative;width:${w}px;height:${h}px;overflow:hidden">${body.replaceAll('LOCKUP', LOCK)}</div>`)
  await page.goto(pathToFileURL(tmp).href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(ov, file), omitBackground: transparent })
}
const specs = JSON.parse(fs.readFileSync(path.join(work, 'overlays.json'), 'utf8'))
for (const s of specs) await shot(s.html, s.W, s.H, s.file)

const endCard = (w, h, s) => `<div style="width:${w}px;height:${h}px;background:#F9F8F6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${90 * s}px">
  <img src="LOCKUP" style="height:${120 * s}px">
  <div class="eye" style="font-size:${24 * s}px;margin-top:${70 * s}px">Free, for parents</div>
  <div class="h" style="font-size:${92 * s}px;margin-top:${22 * s}px">What stage is<br>your child?</div>
  <div class="b" style="font-size:${40 * s}px;margin-top:${28 * s}px">Three questions, no sign up.</div>
  <div class="url" style="font-size:${40 * s}px;padding:${20 * s}px ${40 * s}px;margin-top:${56 * s}px">guidedchildhood.com/starter-pack</div></div>`
await shot(endCard(1920, 1080, 1.25), 1920, 1080, 'end-16x9.png', false)
await shot(endCard(1080, 1920, 1.05), 1080, 1920, 'end-9x16.png', false)
await shot(`<div style="width:1080px;height:1920px;background:#F9F8F6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px">
  <div class="eye" style="font-size:28px">Watch together</div>
  <div class="h" style="font-size:96px;margin-top:24px">Pick a time to<br>watch it together</div>
  <div class="b" style="font-size:42px;margin-top:30px">Screens go to bed first. A few minutes, on the sofa.</div>
  <div class="url" style="font-size:46px;padding:26px 52px;margin-top:64px">Book a watch together time</div></div>`, 1080, 1920, 'book-9x16.png', false)
await shot(`<div style="width:1280px;height:720px;position:relative;background:#F9F8F6">
  <img src="${pathToFileURL(path.join(here, 'pics/p22.png')).href}" style="position:absolute;inset:0;width:1280px;height:720px;object-fit:cover">
  <div style="position:absolute;left:60px;top:150px;width:600px">
    <div class="eye" style="font-size:24px">Watch together, ages 4 to 7</div>
    <div class="h" style="font-size:94px;margin-top:16px">Screens go to bed first</div>
    <div style="margin-top:34px"><img src="LOCKUP" style="height:78px"></div></div></div>`, 1280, 720, 'thumbnail.png', false)
await browser.close()
console.log('drawn', specs.length + 4)
