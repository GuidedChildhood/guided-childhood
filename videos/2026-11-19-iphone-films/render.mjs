#!/usr/bin/env node
// Renders an iPhone service film: films/<name>.json through compose.html, one
// screenshot a frame at 30 fps, then ffmpeg. Free: no image or video model.
//   node render.mjs films/<name>.json [--frames 0,60,120]   (stills only, for checking)
import { readFileSync, readdirSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || join(HERE, '../../node_modules/playwright/index.mjs'))
const film = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8'))
for (const s of film.segs) s.frames = readdirSync(join(HERE, 'renders/rec', s.rec)).filter((f) => f.endsWith('.jpg')).length
const total = film.segs.reduce((a, s) => a + s.dur, 0) + (film.end || 4)
const only = process.argv.includes('--frames') ? process.argv[process.argv.indexOf('--frames') + 1].split(',').map(Number) : null
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] })
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(join(HERE, 'compose.html')).href)
await page.evaluate((f) => { window.FILM = f; if (f.url) document.getElementById('url').textContent = f.url }, film)
await page.evaluate(() => document.fonts.ready)
const out = join(HERE, 'renders/frames', film.name); rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })
const N = Math.round(total * 30)
const list = only || [...Array(N).keys()]
for (const f of list) {
  await page.evaluate((t) => window.seek(t), f / 30)
  await page.waitForFunction(() => [...document.images].filter((i) => i.style.display !== 'none' && i.src).every((i) => i.complete && i.naturalWidth > 0))
  await page.screenshot({ path: join(out, `f-${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 })
  if (!only && f % 150 === 0) console.log(`frame ${f}/${N}`)
}
await browser.close()
if (only) { console.log(`stills in renders/frames/${film.name}`); process.exit(0) }
mkdirSync(join(HERE, 'out'), { recursive: true })
const mp4 = join(HERE, 'out', `${film.name}.mp4`)
// A silent stereo track, so every platform treats it as a normal video; the trending sound is added in the app.
execSync(`ffmpeg -v error -y -framerate 30 -i ${out}/f-%05d.jpg -f lavfi -i anullsrc=r=48000:cl=stereo -shortest -vf format=yuv420p -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 128k -movflags +faststart ${mp4}`)
console.log(`${film.name}: ${N} frames, ${total.toFixed(1)}s -> out/${film.name}.mp4`)
