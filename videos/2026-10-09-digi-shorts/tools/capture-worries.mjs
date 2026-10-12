// The stage check's real worry step (app/(marketing)/starter-pack, step q2),
// captured twice at 5x: before any tile is ticked, and after the five the hero
// names are ticked by real clicks. The page is too animation heavy to step in
// virtual time, so the film cuts between these two real stills.
import { readFileSync } from 'node:fs'
const { chromium } = await import('/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const DEV = process.env.DEV || 'http://localhost:3000'
const out = new URL('../assets/captures/', import.meta.url).pathname
const NAMES_JS = readFileSync(new URL('./names.js', import.meta.url), 'utf8')
const NAMES = JSON.parse(readFileSync(new URL('./names.json', import.meta.url), 'utf8'))
const TILES = ['Coming off screens', 'Asking for a phone', 'Controller fights', 'Bedtime screens', 'What they come across online']
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 5 })
await p.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
await p.addInitScript(() => localStorage.setItem('gc_starter_progress', JSON.stringify({ step: 'q2', ageBand: '8-10', picks: [], feeling: null, timeCommitment: null })))
await p.goto(DEV + '/starter-pack', { waitUntil: 'networkidle', timeout: 120000 })
await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2500)
await p.screenshot({ path: out + 'worries-before.png' })
const boxes = []
for (const t of TILES) {
  const r = await p.evaluate((t) => { const el = [...document.querySelectorAll('button')].find((e) => e.textContent.trim().includes(t)); if (!el) return null; el.click(); const r = el.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)] }, t)
  boxes.push([t, r]); await p.waitForTimeout(700)
}
await p.waitForTimeout(1200)
await p.screenshot({ path: out + 'worries-after.png' })
console.log(JSON.stringify(boxes))
await b.close()
