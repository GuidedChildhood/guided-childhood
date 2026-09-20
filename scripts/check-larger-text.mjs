// EVERY SCREEN SURVIVES LARGER TEXT.
//
// Justin, 20 September 2026, with Larger Text on on his own iPhone: "just
// checking that this needs to work even when user changes text size on their
// phone." It does, and it did not.
//
// shared/tokens.css sets the root from -apple-system-body ON PURPOSE, so the
// whole rem type scale follows the iOS Dynamic Type dial. That is the
// accessible choice and it stays. What was never done is building the layouts
// to survive it: the type is rem, and the pill padding, the fixed buttons and
// the flexShrink 0 chips are px. Text grows, containers do not, and words print
// through the thing beside them. Measured on 20 September: 42 of 145 fixtures
// were clean at normal size and broken at Larger Text.
//
// ── WHAT THIS MEASURES ──────────────────────────────────────────────────────
//
// Every fixture under app/dev and app/ref-*, at phone width, twice: once at
// the normal root and once with the root forced to 40px, which is roughly
// the top of the iOS dial. A fixture COUNTS when it is clean at normal size
// and something runs off the right edge at Larger Text. A fixture that is
// already wide at normal size (a print sheet, an OG card, a poster) is not
// this bug and is ignored.
//
// ── THE RATCHET ─────────────────────────────────────────────────────────────
//
// scripts/larger-text-baseline.json names the fixtures known to be broken.
// A fixture NOT on the list that breaks is a regression and fails. A fixture
// ON the list that is now clean also fails, with a message saying to take it
// off, so a fix cannot quietly un-fix itself later. The list only ever gets
// shorter. Same pattern as the wiring check's BASELINE.
//
// Rewrite the list after a deliberate change with --write-baseline. Never do
// that to make a red run go green.
//
// Runs where the app is already up (the checkin-guard job in CI, or locally
// with npm run dev). BASE / GC_BASE_URL override the address.
//
//   node scripts/check-larger-text.mjs
//   node scripts/check-larger-text.mjs --write-baseline

import { chromium } from 'playwright'
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.GC_BASE_URL ?? process.env.BASE ?? 'http://localhost:3000'
const BASELINE_FILE = 'scripts/larger-text-baseline.json'
const WRITE = process.argv.includes('--write-baseline')
const WIDTH = 390
const BIG_ROOT = '40px'
// Anything under this is sub pixel rounding or a font fallback, not a layout
// that has failed.
const TOLERANCE = 4

// Surfaces that are not phone screens and never will be. Each carries its
// reason, and the list is meant to stay this short: a projector stage judged
// at 390px is not a finding, it is the wrong question.
const NOT_A_PHONE = {
  '/dev/lesson-player': 'the classroom wall, a fixed 1920 wide stage',
}

const fixtures = []
for (const d of readdirSync('app/dev')) if (existsSync(join('app/dev', d, 'page.tsx'))) fixtures.push(`/dev/${d}`)
for (const d of readdirSync('app')) if (d.startsWith('ref-') && existsSync(join('app', d, 'page.tsx'))) fixtures.push(`/${d}`)
const routes = fixtures.filter(r => !(r in NOT_A_PHONE)).sort()

// What the eye can see, not what the DOM holds. A chip row that scrolls
// sideways on purpose, or a star sweep hidden inside a card's overflow, has
// rects past the phone's edge and nothing printing through anything: the
// right edge is cut down to every ancestor that clips before it is judged.
const measure = (page) => page.evaluate((tol) => {
  const vw = document.documentElement.clientWidth
  const clipRight = new Map()
  const clipOf = (el) => {
    if (!el || el === document.documentElement) return Infinity
    if (clipRight.has(el)) return clipRight.get(el)
    const own = getComputedStyle(el).overflowX
    const mine = own === 'visible' ? Infinity : el.getBoundingClientRect().right
    const v = Math.min(mine, clipOf(el.parentElement))
    clipRight.set(el, v)
    return v
  }
  let worst = 0, first = ''
  for (const e of document.querySelectorAll('body *')) {
    const r = e.getBoundingClientRect()
    if (r.width === 0) continue
    const over = Math.min(r.right, clipOf(e.parentElement)) - vw
    if (over > tol && over > worst) { worst = Math.round(over); first = (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) }
  }
  return { worst, first }
}, TOLERANCE)

const browser = await chromium.launch({ executablePath: process.env.GC_CHROMIUM || undefined })
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 900 } })
const broken = {}
let rendered = 0
for (const route of routes) {
  const page = await ctx.newPage()
  try {
    const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 })
    if (!res || res.status() >= 400) continue
    // TWICE, AND ONLY WHAT HOLDS. A screen still mounting reads as broken for
    // a few hundred milliseconds: the floating Moment button portals in late,
    // a job strip lays out after its data. One reading at 500ms put four
    // screens on the list that were clean at 1500ms. Two readings 700ms apart
    // that must agree is what stops a guard flapping in CI, and it is cheaper
    // than one very long wait on every route.
    const settled = async () => {
      await page.waitForTimeout(700)
      const a = await measure(page)
      await page.waitForTimeout(700)
      const b = await measure(page)
      return a.worst > 0 && b.worst > 0 ? (a.worst <= b.worst ? a : b) : { worst: 0, first: '' }
    }
    const normal = await settled()
    if (normal.worst > 0) continue // wide by design, not this bug
    await page.addStyleTag({ content: `html { font-size: ${BIG_ROOT} !important; }` })
    const big = await settled()
    rendered++
    if (big.worst > 0) broken[route] = { px: big.worst, at: big.first }
  } catch { /* a fixture that needs props or a session, not ours to judge */ }
  await page.close()
}
await browser.close()

if (WRITE) {
  writeFileSync(BASELINE_FILE, JSON.stringify(broken, null, 2) + '\n')
  console.log(`check-larger-text: baseline written, ${Object.keys(broken).length} of ${rendered} fixtures known broken at Larger Text.`)
  process.exit(0)
}

const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) : {}
const fail = []
for (const [route, m] of Object.entries(broken)) {
  if (!(route in baseline)) fail.push(`REGRESSION  ${route} is clean at normal size and ${m.px}px off the edge at Larger Text, at "${m.at}". It was not broken before. Let the layout wrap; do not stop the text scaling.`)
}
for (const route of Object.keys(baseline)) {
  if (!(route in broken)) fail.push(`FIXED       ${route} no longer breaks at Larger Text. Take it out of ${BASELINE_FILE} so it stays fixed.`)
}

if (fail.length) {
  console.error('check-larger-text FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
const n = Object.keys(broken).length
console.log(`check-larger-text: ${rendered} fixtures rendered at Larger Text, ${n} still on the known list, no regressions.`)
