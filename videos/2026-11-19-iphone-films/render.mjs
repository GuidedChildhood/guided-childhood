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
// Taps logged by the recorder: each one inside a segment's window becomes a ripple on the control and a tap sound.
import { existsSync } from 'node:fs'
const cues = []; { let acc = 0
  for (const s of film.segs) {
    const f = join(HERE, 'renders/rec', s.rec, 'taps.json')
    s.taps = (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : []).map((t) => ({ ...t, lt: t.at - s.from })).filter((t) => t.lt >= 0 && t.lt < s.dur)
    for (const t of s.taps) cues.push({ name: 'sfx-tap', at: acc + t.lt, vol: 0.5 })
    for (const c of s.sfx || []) cues.push({ ...c, at: acc + c.at })
    acc += s.dur }
  for (const c of film.endSfx || []) cues.push({ ...c, at: acc + c.at }) }
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
// Sound (24 November 2026): a tap on every tap, the film's own cues, and a quiet
// music bed. The "-taps-only" file keeps the taps and drops the bed, for Instagram, where
// the trending track is added in the app and would clash with a baked one.
const SND = join(HERE, '../2026-10-09-digi-shorts/assets')
// Two files when the film has a music bed: the full mix, and one with the taps but no bed.
for (const noMusic of film.music ? [false, true] : [true]) {
  const ins = cues.map((c) => `-i ${SND}/sfx/${c.name}.mp3`).join(' ')
  let fc = cues.map((c, i) => `[${i + 2}:a]aresample=48000,adelay=${Math.round(c.at * 1000)}:all=1,volume=${c.vol ?? 0.4}[s${i}];`).join('')
  const bed = noMusic ? '[1:a]anull[bed];' : `[1:a]atrim=start=${film.music.from || 0},asetpts=PTS-STARTPTS,volume=${film.music.vol ?? 0.16},afade=t=in:d=1,afade=t=out:st=${(total - 2).toFixed(2)}:d=2[bed];`
  fc += bed + '[bed]' + cues.map((_, i) => `[s${i}]`).join('') + `amix=inputs=${cues.length + 1}:normalize=0:duration=longest,atrim=end=${total.toFixed(2)}[a]`
  const src1 = noMusic ? '-f lavfi -i anullsrc=r=48000:cl=stereo' : `-i ${SND}/${film.music.file}`
  const mp4n = noMusic && film.music ? mp4.replace('.mp4', '-taps-only.mp4') : mp4
  execSync(`ffmpeg -v error -y -framerate 30 -i ${out}/f-%05d.jpg ${src1} ${ins} -filter_complex "${fc}" -map 0:v -map "[a]" -t ${total.toFixed(2)} -vf format=yuv420p -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 160k -movflags +faststart ${mp4n}`)
}
console.log(`${film.name}: ${N} frames, ${total.toFixed(1)}s -> out/${film.name}.mp4`)
