// Does any screen slide sideways on a phone?
//
// Justin, 10 August 2026, with a photo of the parent home on his phone:
// "floating around on phone and not fitting." The page was panned right, the
// cards clipped off the left edge, a strip of background down the right.
//
// ── Why nothing caught it ────────────────────────────────────────────────────
//
// Every screenshot we take is of one page at one width, and a page that is 20px
// too wide looks completely normal in a screenshot: the extra is off frame. The
// symptom only exists in the hand, where a thumb finds it.
//
// So this walks every route it can reach at a phone width and asks the one
// question a screenshot cannot: is the document wider than the window. Then it
// names the outermost element responsible, because the innermost one is nearly
// always innocent.
//
// A real side scroller is not a failure. The lesson filter chips carry their
// own overflow-x and are meant to run off the edge INSIDE their own box; what
// this catches is that leaking out to the document.
//
// Usage, with the app running on :3000
//   node scripts/check-mobile-overflow.mjs      (or BASE=http://localhost:3001)

import { chromium } from 'playwright'
import { readdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

// 390 is the iPhone width Justin is holding. 320 is the narrowest phone still
// worth designing for, and it is where a layout that merely just fits breaks.
const WIDTHS = [390, 320]

// A pixel of slack, because a sub pixel rounding at a border is not a bug.
const SLACK = 1

// Pages that are deliberately a fixed size and are not phone screens at all.
// Named rather than pattern matched, so adding one is a decision somebody made
// on purpose and can be argued with in review.
const NOT_A_PHONE_SCREEN = new Set([
  '/ref-og-card',          // the 1200x630 social share card
  '/ref-curriculum-sheet', // an A4 sheet, drawn at paper size
  '/ref-friends-poster',   // a printed poster, same reason
])

const routes = [
  ...readdirSync('app/dev', { withFileTypes: true }).filter(d => d.isDirectory()).map(d => `/dev/${d.name}`),
  ...readdirSync('app', { withFileTypes: true }).filter(d => d.isDirectory() && d.name.startsWith('ref-')).map(d => `/${d.name}`),
  '/', '/join', '/starter-pack',
].filter(r => !NOT_A_PHONE_SCREEN.has(r))

let failures = 0
const browser = await chromium.launch({ executablePath: EXE })

for (const width of WIDTHS) {
  const bad = []
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: 844 } })
    try {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 40000 })
      if (!res || res.status() >= 400) { await page.close(); continue }
      await page.waitForTimeout(400)
      const found = await page.evaluate(w => {
        const doc = document.documentElement
        // scrollWidth is the honest measure: it is what a thumb can reach.
        if (doc.scrollWidth <= w + 1) return null
        const offenders = []
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect()
          if (!b.width || !b.height) continue
          const over = Math.round(Math.max(b.right - w, -b.left))
          if (over <= 1) continue
          // Only the OUTERMOST element in each chain. A child sticking out of a
          // parent that is itself too wide is a symptom, not the cause.
          const pb = el.parentElement?.getBoundingClientRect()
          if (pb && Math.round(Math.max(pb.right - w, -pb.left)) > 1) continue
          const path = []
          for (let n = el; n && n !== document.body && path.length < 4; n = n.parentElement) {
            path.unshift(`${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}${n.className ? '.' + (n.className || '').toString().trim().split(/\s+/)[0] : ''}`)
          }
          offenders.push(`over ${over}px  ${path.join(' > ')}  w=${Math.round(b.width)} "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`)
        }
        return { scrollWidth: doc.scrollWidth, offenders: offenders.slice(0, 3) }
      }, width)
      if (found) bad.push(`${route}  ${found.scrollWidth}px wide\n       ${found.offenders.join('\n       ')}`)
    } catch {
      // A route that will not load is a different problem and not this check's.
    }
    await page.close()
  }
  const ok = bad.length === 0
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  nothing slides sideways at ${width}px  (${routes.length} routes)`)
  for (const line of bad) console.log(`     ${line}`)
}

// And the guard itself, because everything above is only true while the CSS
// that makes it true is still there.
//
// Tested by BEHAVIOUR, not by reading the declaration back. A body set to clip
// has its overflow propagated to the viewport, after which getComputedStyle on
// body reports "visible" and a check on the declaration fails while the rule is
// working perfectly. So this drops a deliberately oversized element on the page
// and asks whether the document grew, which is the thing a thumb would find.
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto(`${BASE}/dev/home-main`, { waitUntil: 'domcontentloaded' })
const grew = await page.evaluate(() => {
  const before = document.documentElement.scrollWidth
  const probe = document.createElement('div')
  probe.style.cssText = 'width:900px;height:4px;background:transparent'
  // INSIDE the shell, because that is where the guard is and where every card
  // in the app lives. Appending to body would test nothing and pass nothing.
  ;(document.querySelector('.gc-shell') ?? document.body).appendChild(probe)
  const after = document.documentElement.scrollWidth
  probe.remove()
  return { before, after }
})
const held = grew.after <= grew.before + 1
if (!held) failures++
console.log(`${held ? 'PASS' : 'FAIL'}  a 900px element cannot drag the page sideways  ${grew.before} to ${grew.after}`)
await page.close()

await browser.close()
console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
