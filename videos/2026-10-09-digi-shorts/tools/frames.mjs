// Headless frame grabber for the built composition: seeks the paused GSAP
// timeline, puts every <video> at the frame HyperFrames would show (start,
// duration, media start), and tiles a contact sheet. The in app browser pane
// only paints while on screen, so this is how a cut is checked by eye.
//   node tools/frames.mjs --name a --every 1 [--from 0 --to 20] [times...]
import { mkdirSync, readFileSync, readdirSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const FILM = process.env.FILM_URL || 'http://localhost:4174/index.html'
const out = new URL('../renders/frames/', import.meta.url).pathname
mkdirSync(out, { recursive: true })
const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : d }
const name = opt('--name', 'all'), every = Number(opt('--every', 0)), from = Number(opt('--from', 0)), to = Number(opt('--to', 1e9)), cols = Number(opt('--cols', 6))
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const W = Number(html.match(/data-width="(\d+)"/)[1]), H = Number(html.match(/data-height="(\d+)"/)[1]), dur = Number(html.match(/data-duration="([\d.]+)"/)[1])
const times = every ? Array.from({ length: Math.floor((Math.min(dur, to) - from) / every) + 1 }, (_, i) => +(from + i * every).toFixed(2)) : argv.map(Number)
for (const f of readdirSync(out)) if (f.startsWith(name + '-')) unlinkSync(out + f)
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
await page.goto(FILM, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
for (const t of times) {
  await page.evaluate(async (t) => {
    window.__timelines.main.seek(t, false)
    const vids = [...document.querySelectorAll('video[data-start]')]
    await Promise.all(vids.map((v) => new Promise((res) => {
      const s = Number(v.dataset.start), d = Number(v.dataset.duration), m = Number(v.dataset.mediaStart || 0)
      const local = t - s
      if (local < 0 || local > d) { v.style.visibility = 'hidden'; return res() }
      v.style.visibility = 'visible'
      let target = m + local
      if (v.loop && v.duration) target = target % v.duration
      if (Math.abs(v.currentTime - target) < 0.01) return res()
      v.addEventListener('seeked', () => res(), { once: true }); v.currentTime = target
      setTimeout(res, 3000)
    })))
  }, t)
  await page.waitForTimeout(80)
  await page.screenshot({ path: `${out}${name}-${t.toFixed(2).padStart(6, '0')}.png` })
}
await browser.close()
const rows = Math.ceil(times.length / cols), tw = W >= H ? 480 : 270
execSync(`ffmpeg -v error -y -pattern_type glob -i '${out}${name}-*.png' -filter_complex "scale=${tw}:-2,tile=${cols}x${rows}:padding=4:margin=4:color=0x1A1A2E" -frames:v 1 -update 1 ${out}../sheet-${name}.png`)
console.log(`${times.length} frames at ${times[0]}..${times[times.length - 1]}s -> renders/sheet-${name}.png`)
