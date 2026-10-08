// Headless frame grabber: seeks the paused GSAP timeline at the times given
// and saves a PNG of each, then a contact sheet. The in app browser pane only
// paints while it is on screen, so this is how the film is checked by eye.
//   node tools/frames.mjs 0.6 3.7 7.4 ...      (defaults to one frame a second)
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
import { mkdirSync, existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
const FILM = process.env.FILM_URL || 'http://localhost:4173/index.html'
const out = new URL('../renders/frames/', import.meta.url).pathname
mkdirSync(out, { recursive: true })
import { readdirSync, unlinkSync } from 'node:fs'
const total = 46.9
const argv = process.argv.slice(2)
const ni = argv.indexOf('--name'); const name = ni >= 0 ? argv.splice(ni, 2)[1] : 'all'
const ei = argv.indexOf('--every'); const every = ei >= 0 ? Number(argv.splice(ei, 2)[1]) : 0
const fromI = argv.indexOf('--from'); const from = fromI >= 0 ? Number(argv.splice(fromI, 2)[1]) : 0
const toI = argv.indexOf('--to'); const to = toI >= 0 ? Number(argv.splice(toI, 2)[1]) : Infinity
const dur = Number((readFileSync(new URL('../index.html', import.meta.url), 'utf8').match(/data-duration="([\d.]+)"/) || [])[1] || total)
const times = every ? Array.from({ length: Math.floor((Math.min(dur, to) - from) / every) + 1 }, (_, i) => +(from + i * every).toFixed(2)) : (argv.length ? argv.map(Number) : Array.from({ length: Math.ceil(total) }, (_, i) => i + 0.5))
for (const f of readdirSync(out)) if (f.startsWith(name + '-')) unlinkSync(out + f)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 })
await page.goto(FILM, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)
for (const t of times) {
  await page.evaluate((t) => { window.__timelines.main.seek(t, false) }, t)
  await page.waitForTimeout(60)
  await page.screenshot({ path: `${out}${name}-${t.toFixed(1).padStart(5, '0')}.png` })
}
await browser.close()
const cols = Math.min(5, times.length), rows = Math.ceil(times.length / cols)
execSync(`ffmpeg -v error -y -pattern_type glob -i '${out}${name}-*.png' -filter_complex "scale=476:268,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='%{eif\\:n\\:d}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.5,tile=${cols}x${rows}:padding=4:margin=4:color=#1A1A2E" -update 1 ${out}../sheet-${name}.png`)
console.log(`${times.length} frames, renders/sheet-${name}.png (${cols}x${rows}); frame n is times[n]`)
