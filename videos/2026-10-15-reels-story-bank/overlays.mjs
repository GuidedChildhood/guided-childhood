// Renders the text layers for the three silent reels (stories 24, 5, 10 of
// content/packs/2026-10-14-reels-story-bank). Every word on screen is set in
// HTML with the self hosted Nunito and IBM Plex Mono, never inside a
// generated image (GDC_SOCIAL_VISUAL_SYSTEM section 5). Transparent 1080 by
// 1920 PNGs; build.sh lays them over the plates and the real app recordings.
//   node overlays.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/opt/node-tools/node_modules/playwright/index.mjs')
import { mkdirSync, writeFileSync } from 'node:fs'

const here = new URL('.', import.meta.url).pathname
const root = new URL('../../', import.meta.url).pathname
const out = `${here}assets/overlays/`
mkdirSync(out, { recursive: true })

// The hooks, verbatim from the story bank. The gold underline sits under the
// turn of each line: one gold detail per frame.
const HOOKS = {
  hook24: { pre: 'You did every setting.', turn: 'The arguments did not get the memo.' },
  hook05: { pre: '\u201cBut everyone else is allowed.\u201d', turn: 'You have one sentence before it becomes a row.' },
  hook10: { pre: 'An hour in Screen Time settings.', turn: 'Still not sure you got it right.' },
}

// The product beats. Captions label what the real screen shows, nothing more.
const BEATS = {
  beatDigi: { line: 'Tell it what went wrong today.', note: 'Example family. Illustrative reply.' },
  beatScript: { line: 'Get the words to say tonight.', note: 'A real script from the app.' },
  beatCheck: { line: 'Check in until it is sorted.', note: 'This parent’s own rating.' },
}

const css = `
@font-face{font-family:Nunito;src:url(file://${root}app/fonts/nunito-latin-wght-normal.woff2) format('woff2');font-weight:200 1000;}
@font-face{font-family:Plex;src:url(file://${root}app/fonts/ibm-plex-mono-latin-600-normal.woff2) format('woff2');font-weight:600;}
:root{--cream:#F9F8F6;--ink:#1A1A2E;--ink-soft:#52526A;--gold:#EDC35F;--gold-dark:#C99A28;--butter:#FFF6DE;}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;background:transparent;font-family:Nunito,sans-serif;color:var(--ink);}
.hook{position:absolute;left:64px;right:64px;top:250px;background:rgba(249,248,246,.94);border-radius:36px;
  padding:52px 56px 58px;box-shadow:0 10px 0 rgba(26,26,46,.12);}
.hook p{text-wrap:balance;font-weight:900;font-size:72px;line-height:1.08;letter-spacing:-.02em;}
.hook p + p{margin-top:22px;}
.turn{background-image:linear-gradient(var(--gold),var(--gold));background-repeat:no-repeat;
  background-size:100% 14px;background-position:0 92%;}
.band{position:absolute;left:64px;right:64px;top:200px;}
.band p{font-weight:900;font-size:66px;line-height:1.08;letter-spacing:-.02em;}
.band small{display:block;margin-top:18px;font-family:Plex;font-weight:600;font-size:24px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink-soft);}
.end{position:absolute;inset:0;background:var(--cream);display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;padding:0 90px 260px;}
.end img{width:300px;height:300px;object-fit:contain;margin-bottom:56px;}
.end h1{text-wrap:balance;font-weight:900;font-size:96px;line-height:1.04;letter-spacing:-.025em;}
.end h2{margin-top:30px;font-weight:700;font-size:52px;color:var(--ink-soft);}
.pill{margin-top:64px;background:var(--gold);color:var(--ink);font-weight:900;font-size:44px;padding:28px 56px;
  border-radius:20px;box-shadow:0 7px 0 var(--gold-dark);}
.foot{position:absolute;left:0;right:0;bottom:330px;display:flex;align-items:center;justify-content:center;gap:16px;}
.mark{width:46px;height:46px;border-radius:13px;background:var(--gold);box-shadow:0 4px 0 var(--gold-dark);
  display:flex;align-items:flex-end;justify-content:center;gap:4px;padding-bottom:10px;}
.mark b{display:block;width:5px;border-radius:3px;background:#fff;}
.word{font-weight:800;font-size:30px;}
`
const MARK = `<div class="mark"><b style="height:9px"></b><b style="height:16px"></b><b style="height:24px"></b><b style="height:14px"></b></div>`

const pages = {}
for (const [k, h] of Object.entries(HOOKS)) {
  pages[k] = `<div class="hook"><p>${h.pre}</p><p><span class="turn">${h.turn}</span></p></div>`
}
for (const [k, b] of Object.entries(BEATS)) {
  pages[k] = `<div class="band"><p>${b.line}</p><small>${b.note}</small></div>`
}
pages.endcard = `<div class="end"><img src="file://${root}public/digi-squad/DiGi-star-3d.png" alt="">
  <h1>What stage is your child?</h1><h2>Three questions, no sign up.</h2>
  <div class="pill">Link in bio</div></div>
  <div class="foot">${MARK}<span class="word">Guided Childhood</span></div>`

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined })
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } })
for (const [name, body] of Object.entries(pages)) {
  // Loaded from disk, not setContent: a blank page may not read file:// fonts.
  const file = `${out}_${name}.html`
  writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`)
  await page.goto(`file://${file}`)
  await page.evaluate(() => document.fonts.ready)
  const ok = await page.evaluate(() => document.fonts.check('900 40px Nunito'))
  if (!ok) throw new Error(`Nunito did not load for ${name}`)
  await page.screenshot({ path: `${out}${name}.png`, omitBackground: name !== 'endcard' })
  console.log('wrote', name)
}
await browser.close()
