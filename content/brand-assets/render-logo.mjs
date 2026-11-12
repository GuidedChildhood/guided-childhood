import { chromium } from '/home/user/guided-childhood/node_modules/playwright/index.mjs'
import { readFileSync } from 'node:fs'
// Run: node content/brand-assets/render-logo.mjs <dir holding nunito.woff2> content/brand-assets
const [S, OUT] = process.argv.slice(2)
const font = readFileSync(`${S}/nunito.woff2`).toString('base64')
// shared/brand.ts: LOGO_GOLD #EDC35F, LOGO_BARS [5, 9, 14, 8]; geometry from PrintBrandHeader (24px square, 7px radius, bars 2.2 wide, 1.8 gap, stack 11 high, height (h/14)*11)
const BARS = [5, 9, 14, 8]
const mark = (k) => `<span style="width:${24*k}px;height:${24*k}px;background:#EDC35F;border-radius:${7*k}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">
  <span style="display:inline-flex;align-items:flex-end;gap:${1.8*k}px;height:${11*k}px">${BARS.map(h => `<span style="width:${2.2*k}px;height:${(h/14)*11*k}px;background:#fff;border-radius:${1*k}px;display:inline-block"></span>`).join('')}</span></span>`
const page = (w, h, body) => `<!doctype html><html><head><style>
@font-face{font-family:Nunito;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:200 1000}
html,body{margin:0;width:${w}px;height:${h}px;background:#F9F8F6}
.c{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center}
</style></head><body><div class="c">${body}</div></body></html>`
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const shots = [
  // Pinterest crops the profile picture to a circle: the mark sits well inside it.
  ['guided-childhood-profile-1000.png', 1000, 1000, mark(27)],
  ['guided-childhood-lockup-1600x600.png', 1600, 600, `<span style="display:inline-flex;align-items:center;gap:56px">${mark(12)}<span style="font-family:Nunito;font-weight:900;font-size:132px;color:#1A1A2E;letter-spacing:-0.02em">Guided Childhood</span></span>`],
]
for (const [name, w, h, body] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.setContent(page(w, h, body))
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: `${OUT}/${name}` })
}
await b.close()
