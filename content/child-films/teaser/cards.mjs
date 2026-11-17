// Cards for the Instagram teaser of the five DiGi films: node cards.mjs
// Words are set in HTML in the house fonts (brand/GDC_SOCIAL_VISUAL_SYSTEM.md
// section 5). Everything a person reads sits inside y 285 to 1550.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const { chromium } = createRequire(import.meta.url)('playwright')
const here = path.dirname(new URL(import.meta.url).pathname)
const root = path.resolve(here, '../../..')
const out = path.join(here, 'work')
const films = JSON.parse(fs.readFileSync(path.join(here, 'films.json'), 'utf8'))
const font = f => pathToFileURL(path.join(root, 'app/fonts', f)).href
const lockup = pathToFileURL(path.join(here, '../1.3-release-test/work/lockup.png')).href
const css = `
@font-face{font-family:Nunito;src:url(${font('nunito-latin-wght-normal.woff2')});font-weight:200 1000}
@font-face{font-family:Plex;src:url(${font('ibm-plex-mono-latin-600-normal.woff2')});font-weight:600}
*{box-sizing:border-box;margin:0}
body{font-family:Nunito;color:#1A1A2E;background:#F9F8F6;width:1080px;height:1920px}
.eye{font-family:Plex;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#C99A28}
.h{font-weight:900;letter-spacing:-.02em;line-height:1.05}
.b{font-weight:700;color:#52526A}
.pill{font-weight:800;background:#EDC35F;border-radius:16px;box-shadow:0 5px 0 #C99A28;display:inline-block}
`
const hook = `<style>${css}</style>
<div style="height:1920px;display:flex;flex-direction:column;justify-content:center;padding:0 90px">
  <img src="${lockup}" style="height:96px;align-self:flex-start">
  <div class="eye" style="font-size:30px;margin-top:80px">New on YouTube, free</div>
  <div class="h" style="font-size:112px;margin-top:24px">Five films to watch with your 4 to 7 year old</div>
  <div class="b" style="font-size:46px;margin-top:36px">Here is what is in each one.</div>
</div>`
// Frame for one film: the picture goes in at x 90, y 640, 900 by 506.
const frame = f => `<style>${css}</style>
<div style="height:1920px;padding:0 90px">
  <div class="eye" style="font-size:30px;padding-top:330px">Film ${f.n} of 5</div>
  <div class="h" style="font-size:${f.title.length > 26 ? 66 : 80}px;margin-top:18px;height:180px">${f.title}</div>
  <div style="position:absolute;left:84px;top:634px;width:912px;height:518px;border-radius:28px;border:6px solid #EDC35F"></div>
  <div style="position:absolute;left:90px;top:1200px;width:900px">
    <div class="h" style="font-size:54px;line-height:1.18">&ldquo;${f.line}&rdquo;</div>
    <div class="b" style="font-size:34px;margin-top:22px">DiGi, in the film</div>
  </div>
</div>`
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
const shot = async (html, name) => {
  const f = path.join(out, '_page.html'); fs.writeFileSync(f, html)
  await page.goto(pathToFileURL(f).href); await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(out, name) })
}
await shot(hook, 'hook.png')
for (const f of films) await shot(frame(f), `frame-${f.n}.png`)
await browser.close()
console.log('cards drawn')
