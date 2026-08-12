// After answering one concern, can you see the next question?
//
// Justin, 12 August 2026, with a photograph of the next title sliced off by the
// status bar: "when I click a line it's good but it scrolls down and puts the
// next one at the top where I can't see it. It just needs to go to the next
// one."
//
// The hand over was scrolling with block: 'center'. A concern row is a title, a
// history line, a question, ten targets and two labels, which on a 390 wide
// phone is taller than the screen. Centring a thing taller than the viewport
// pushes its top off the top, and the first casualty is the one line the parent
// needs, which is WHICH concern is being asked about.
//
// The check is the thing he actually did: tap a number, then look at where the
// next question's title ended up. It fails if that title is above the fold, and
// it fails at 390 rather than only on a desktop where the rows happen to fit,
// because fitting on desktop is exactly how this shipped.
//
// Usage, with the app running on :3000
//   node scripts/check-concern-handover.mjs        (or BASE=http://localhost:3001)

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT = process.env.SHOTS || '/tmp/concern-shots'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: EXE })

// 390 is the phone in his hand. 1280 is the width this shipped passing.
for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1280, 900]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(`${BASE}/dev/concern-scale`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(800)

  const titles = ['Online safety', 'Staying asleep', 'Phone handover fight']

  // Answer the first one. The save beat is 2.6s, and the hand over fires when
  // it lands, so the wait is the real thing rather than an arbitrary pause.
  await page.getByRole('radio', { name: /^7 out of 10/ }).first().click()
  await page.waitForTimeout(3600)
  await page.screenshot({ path: `${OUT}/handover-${name}-1.png`, fullPage: false })

  // Where did the next question's title end up?
  const secondTitle = page.getByText(titles[1], { exact: true }).first()
  const box = await secondTitle.boundingBox()

  check(`${name}: the next question has a title on screen`, !!box)
  if (box) {
    // Above zero means it is off the top of the viewport, which is the bug.
    check(`${name}: its title is not scrolled off the top`, box.y >= 0, `y=${Math.round(box.y)}`)
    // And it has to be genuinely readable, not one pixel of descender showing.
    check(`${name}: and it is fully visible`, box.y >= 0 && box.y + box.height <= height,
      `y=${Math.round(box.y)} h=${Math.round(box.height)} viewport=${height}`)
    // The question it belongs to should be visible under it, or the parent has
    // the heading and nothing to answer.
    const dots = page.getByRole('radiogroup', { name: /Staying asleep/ })
    const dotBox = await dots.boundingBox()
    check(`${name}: with its answer row under it`,
      !!dotBox && dotBox.y >= 0 && dotBox.y + dotBox.height <= height,
      dotBox ? `y=${Math.round(dotBox.y)}` : 'not found')
  }

  // And the one just answered stays put above, because the whole point of
  // locking a row is leaving the before and after on screen.
  const first = page.getByText(titles[0], { exact: true }).first()
  const firstBox = await first.boundingBox()
  check(`${name}: the answered one is still above it, not thrown away`,
    !firstBox || firstBox.y < (box?.y ?? height))

  await page.close()
}

await browser.close()
console.log(`\nScreenshots in ${OUT}`)
console.log(`${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
