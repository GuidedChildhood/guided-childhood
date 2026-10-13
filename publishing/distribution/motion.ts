// THE COVER REVEAL, MADE IN CODE.
//
// The animated cover is the real cover: the same HTML that printed page 1,
// with its layers (masthead, sky, headline, Bloop, teasers) brought in one
// after another. Each frame is the layout at a fixed moment, screenshotted by
// Chromium and stitched by ffmpeg. Zero credits, and Bloop is the approved
// cutout, so there is nothing to drift.
//
// Motion follows the house rules: subtle fade ups and staggered reveals, the
// same easing as the app's GSAP defaults (power2.out), nothing that spins,
// bounces or flashes. GSAP itself is not used here because there is no app
// page to run it in; CSS keyframes driven frame by frame give the same curve
// and a deterministic file. The station glides with the CSS translate
// property, not transform, because on an SVG group transform would replace the
// group's own position instead of adding to it.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { pad3 } from '../engine/html'
import type { Issue } from '../engine/schema'
import { buildHtml, qrMap } from '../pdf-engine/render'

const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const FPS = 24
const SECONDS = 8

const KEYFRAMES = `
@keyframes up { from { opacity: 0; transform: translateY(14mm) } to { opacity: 1; transform: none } }
@keyframes down { from { opacity: 0; transform: translateY(-10mm) } to { opacity: 1; transform: none } }
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rise { from { opacity: 0; transform: translateY(40mm) } to { opacity: 1; transform: none } }
@keyframes glide { from { translate: -160px 0 } to { translate: 0 0 } }
[data-anim] { animation-fill-mode: both; animation-timing-function: cubic-bezier(.22,.61,.36,1); }
[data-anim="masthead"] { animation-name: down; animation-duration: .9s; animation-delay: .2s }
[data-anim="sky"] { animation-name: fade; animation-duration: 1.4s; animation-delay: .8s }
[data-anim="sky"] svg > g:nth-of-type(1) { animation: glide 5s cubic-bezier(.22,.61,.36,1) 1s both }
[data-anim="headline"] { animation-name: up; animation-duration: 1s; animation-delay: 2.2s }
[data-anim="friend"] { animation-name: rise; animation-duration: 1.2s; animation-delay: 3.2s }
[data-anim="teasers"] > * { animation: up .8s cubic-bezier(.22,.61,.36,1) both }
${[0, 1, 2, 3].map(i => `[data-anim="teasers"] > *:nth-child(${i + 1}) { animation-delay: ${4.4 + i * 0.25}s }`).join('\n')}
.stage-tag { animation: fade .8s ease both 6s }
`

export async function renderMotion(issue: Issue, _coverPng: string, outDir: string) {
  if (!hasFfmpeg()) { writeFileSync(join(outDir, 'README.md'), 'ffmpeg was not available, so the cover reveal was not rendered. Install ffmpeg and run the package again.\n'); return }
  const html = await buildHtml(issue, 'download', 0, await qrMap(issue))
  // Keep only the cover, then frame it for each shape.
  const cover = html.slice(html.indexOf('<section class="page" data-page="1"'), html.indexOf('</section>', html.indexOf('data-page="1"')) + 10)
  const head = html.slice(0, html.indexOf('<body'))
  const shapes = [
    { name: '9x16', w: 1080, h: 1920 },
    { name: '1x1', w: 1080, h: 1080 },
    { name: '16x9', w: 1920, h: 1080 },
  ]
  const browser = await chromium.launch(existsSync(EXEC) ? { executablePath: EXEC } : {})
  for (const s of shapes) {
    const tab = await browser.newPage({ viewport: { width: s.w, height: s.h } })
    const pageH = 297 * 96 / 25.4, pageW = 210 * 96 / 25.4
    const scale = Math.min((s.h * 0.86) / pageH, (s.w * 0.86) / pageW)
    const doc = `${head.replace('</head>', `<style>${KEYFRAMES}
      html,body{margin:0;width:${s.w}px;height:${s.h}px;overflow:hidden;background:#1A1A2E}
      .stage{position:absolute;left:50%;top:${s.h > s.w ? 46 : 50}%;transform:translate(-50%,-50%) scale(${scale.toFixed(4)});}
      .stage .page{margin:0;box-shadow:0 30px 80px rgba(0,0,0,.45)}
      .stage-tag{position:absolute;left:0;right:0;bottom:${Math.round(s.h * 0.035)}px;text-align:center;font:600 ${Math.round(s.w / 40)}px/1 'IBM Plex Mono';letter-spacing:.14em;text-transform:uppercase;color:#EDC35F}
    </style></head>`)}<body><div class="stage">${cover}</div>${s.h > s.w ? `<p class="stage-tag">Free to print · Issue ${pad3(issue.number)}</p>` : ''}</body></html>`
    const tmp = join(outDir, `.motion-${s.name}.html`)
    writeFileSync(tmp, doc)
    await tab.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
    await tab.evaluate(() => document.fonts.ready)
    await tab.evaluate(() => document.getAnimations().forEach(a => a.pause()))
    const frames = join(outDir, `.frames-${s.name}`)
    rmSync(frames, { recursive: true, force: true })
    mkdirSync(frames, { recursive: true })
    for (let f = 0; f < FPS * SECONDS; f++) {
      const t = (f / FPS) * 1000
      await tab.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms }), t)
      await tab.screenshot({ path: join(frames, `f${String(f).padStart(4, '0')}.png`) })
    }
    const out = join(outDir, `cover-reveal-${s.name}.mp4`)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out])
    rmSync(frames, { recursive: true, force: true })
    rmSync(tmp)
    await tab.close()
  }
  await browser.close()
  return readdirSync(outDir).filter(f => f.endsWith('.mp4'))
}

function hasFfmpeg() {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true } catch { return false }
}
