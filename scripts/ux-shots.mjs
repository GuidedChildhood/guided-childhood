// The before and after camera for a look and feel pass.
//
// Justin, 11 September 2026, on the whole platform UX run: "the best UX you can
// see" for parents, and for schools text "that fits well on phones, on
// projectors, on the laptops." A pass that changes how everything looks needs
// evidence it got better and did not quietly break a screen nobody opened.
//
// So this walks a named set of routes at the three widths that matter and
// writes a PNG per route per width. Run it once before touching anything, once
// after, and put the two folders side by side.
//
//   390  the iPhone in a parent's hand
//   1024 a laptop, and the width a school projector usually mirrors
//   1920 a full desktop, and where a teacher's board actually lives
//
// Usage, with a production server running (next dev does not hydrate here)
//   npx next build && npx next start -p 3200
//   node scripts/ux-shots.mjs before      -> .ux-shots/before/<width>/<route>.png
//   node scripts/ux-shots.mjs after       -> .ux-shots/after/...
//
// Routes come from app/dev, which is where the real components render without
// a login, plus the marketing pages anyone can reach. Pass route names to
// narrow it: node scripts/ux-shots.mjs after today-path worries

import { chromium } from 'playwright'
import { readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.BASE || 'http://localhost:3200'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const label = process.argv[2] || 'before'
const only = process.argv.slice(3)

const WIDTHS = [390, 1024, 1920]

// Fixed size reference sheets, not screens. Shooting them at three widths says
// nothing, because they are the same picture three times.
const NOT_A_SCREEN = new Set(['/ref-og-card', '/ref-curriculum-sheet', '/ref-friends-poster'])

const routes = [
  '/', '/join', '/starter-pack',
  ...readdirSync('app/dev', { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => `/dev/${d.name}`),
].filter(r => !NOT_A_SCREEN.has(r))
  .filter(r => only.length === 0 || only.some(o => r.endsWith(`/${o}`)))

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-proxy-server'] })
let shot = 0
let missed = 0

for (const width of WIDTHS) {
  const dir = join('.ux-shots', label, String(width))
  mkdirSync(dir, { recursive: true })
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 })
      // Long enough for the staggered reveals to land, so an after shot is not
      // a half faded copy of a before shot.
      await page.waitForTimeout(900)
      const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
      await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true })
      shot++
    } catch {
      missed++
      console.error(`  missed ${width} ${route}`)
    }
    await page.close()
  }
}

await browser.close()
console.log(`${shot} shots into .ux-shots/${label}, ${missed} missed`)
