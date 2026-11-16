// Draws the end cards, the thumbnail and the vertical frame and captions for
// the 1.3 release test. Words are set in HTML in the house fonts, never
// inside a picture (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 5).
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(new URL(import.meta.url).pathname)
const root = path.resolve(here, '../../..')
const out = path.join(here, 'work')
const font = f => pathToFileURL(path.join(root, 'app/fonts', f)).href
const img = f => pathToFileURL(path.join(out, f)).href

const css = `
@font-face{font-family:Nunito;src:url(${font('nunito-latin-wght-normal.woff2')});font-weight:200 1000}
@font-face{font-family:Plex;src:url(${font('ibm-plex-mono-latin-600-normal.woff2')});font-weight:600}
*{box-sizing:border-box;margin:0}
body{font-family:Nunito;color:#1A1A2E;background:#F9F8F6}
.eye{font-family:Plex;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C99A28}
.h{font-weight:900;letter-spacing:-.02em;line-height:1.04}
.b{font-weight:700;color:#52526A}
.url{font-weight:800;background:#EDC35F;border-radius:16px;box-shadow:0 5px 0 #C99A28;display:inline-block}
.lock{display:flex;align-items:center;gap:.5em;font-weight:800}
`
// The lockup is the approved file drawn from shared/brand.ts, never redrawn here.
// build.sh copies it into work/ with its flat ground made clear, so it sits on our cream.
const lockup = pathToFileURL(path.join(out, 'lockup.png')).href
const lock = px => `<img src="${lockup}" style="height:${px * 3}px">`

const endCard = (w, h, s) => `<style>${css}</style>
<div style="width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${90 * s}px">
  ${lock(40 * s)}
  <div class="eye" style="font-size:${24 * s}px;margin-top:${70 * s}px">Free, for parents</div>
  <div class="h" style="font-size:${92 * s}px;margin-top:${22 * s}px">What stage is<br>your child?</div>
  <div class="b" style="font-size:${40 * s}px;margin-top:${28 * s}px">Three questions, no sign up.</div>
  <div class="url" style="font-size:${40 * s}px;padding:${20 * s}px ${40 * s}px;margin-top:${56 * s}px">guidedchildhood.com/starter-pack</div>
</div>`

const thumb = `<style>${css}</style>
<div style="width:1280px;height:720px;display:flex;align-items:center;padding:60px;gap:40px">
  <div style="flex:1">
    <div class="eye" style="font-size:24px">Watch together, ages 4 to 7</div>
    <div class="h" style="font-size:88px;margin-top:18px">The internet<br>remembers</div>
    <div class="b" style="font-size:38px;margin-top:22px">Stop. Ask. Then share.</div>
    <div style="margin-top:40px">${lock(30)}</div>
  </div>
  <img src="${img('ellie.png')}" style="width:560px;height:315px;object-fit:cover;border-radius:28px;border:6px solid #EDC35F">
</div>`

// Vertical frame: the film sits in the middle, the hook above it, and the
// caption below. Everything a person reads stays inside y 285 to 1550.
const vFrame = `<style>${css}</style>
<div style="width:1080px;height:1920px;position:relative">
  <div style="position:absolute;top:300px;left:90px;right:90px">
    <div class="eye" style="font-size:30px">Watch together, ages 4 to 7</div>
    <div class="h" style="font-size:76px;margin-top:18px">How to tell a five year old the internet remembers</div>
  </div>
  <div style="position:absolute;top:1470px;left:90px">${lock(34)}</div>
</div>`

const cap = t => `<style>${css} body{background:transparent}</style>
<div style="width:900px;height:260px;display:flex;align-items:flex-start;justify-content:flex-start">
  <div style="font-weight:800;font-size:52px;line-height:1.18">${t}</div>
</div>`

const browser = await chromium.launch()
const shot = async (html, w, h, file, transparent = false) => {
  const p = await browser.newPage({ viewport: { width: w, height: h } })
  // Loaded from a file, because a page set from a string cannot read the
  // local fonts and pictures.
  const tmp = path.join(out, '_page.html')
  fs.writeFileSync(tmp, '<!doctype html><meta charset="utf-8">' + html)
  await p.goto(pathToFileURL(tmp).href)
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: path.join(out, file), omitBackground: transparent })
  await p.close()
}
await shot(endCard(1920, 1080, 1.25), 1920, 1080, 'end-16x9.png')
await shot(endCard(1080, 1920, 1.05), 1080, 1920, 'end-9x16.png')
await shot(thumb, 1280, 720, 'thumbnail.png')
await shot(vFrame, 1080, 1920, 'v-frame.png')
const caps = JSON.parse(fs.readFileSync(path.join(out, 'captions.json'), 'utf8'))
for (const [i, c] of caps.entries()) await shot(cap(c.t), 900, 260, `cap-${String(i).padStart(2, '0')}.png`, true)
await browser.close()
console.log('cards drawn', caps.length)
