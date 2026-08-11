// Does finishing one subject's sheet leak onto the next one?
//
// Justin, 11 August 2026, screenshot of the Reading tab: "we did the maths as
// tricky and it confirmed, and reading??? So they need to be separate."
//
// The subject tabs are links, so switching them is a Next navigation, but
// LearningSheet lands back in the same position in the same tree and React keeps
// its state. The finished card came over with it, and the tick list still held
// MATHS objective ids against READING objectives, so nothing matched and the card
// told a parent their child had flagged nothing as tricky minutes after they had.
//
// Runs against /dev/learning-sheet-tabs, which has a ?bug=1 mode that drops the
// key on purpose, so this proves it can SEE the fault as well as prove the fix.
//
// Usage: start the app, then node scripts/check-sheet-tabs.mjs [baseUrl]

import { chromium } from 'playwright'
const B = (process.argv[2] ?? 'http://localhost:3000') + '/dev/learning-sheet-tabs'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let fails = 0
const check = (n, ok, d='') => { if(!ok) fails++; console.log(`${ok?'PASS':'FAIL'}  ${n}${d?'  '+d:''}`) }

// Walk a parent through the exact thing Justin did: finish maths with one
// objective flagged as tricky, then tap Reading.
async function run(url) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } })
  await p.route('**/api/learning/complete', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, id: 'res-1', stars: 5, flagged: 1 }) }))
  await p.route('**/api/learning/make-quest', r => r.fulfill({ status: 200, body: '{}' }))
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(300)

  // Tick the first objective as tricky, then finish.
  await p.locator('button', { hasText: /Tap if tricky/ }).first().click()
  await p.waitForTimeout(150)
  const finish = p.locator('button').filter({ hasText: /Done|Finish|Save|stars/i }).last()
  await finish.click()
  await p.waitForTimeout(700)
  const afterMaths = await p.locator('body').innerText()

  await p.locator('a[data-subject="reading"]').click()
  await p.waitForTimeout(900)
  const onReading = await p.locator('body').innerText()
  await p.close()
  return { afterMaths, onReading }
}

// ── The fix ────────────────────────────────────────────────────────────────
const fixed = await run(B)
check('maths finishes and says a tricky one was flagged',
  /All done/.test(fixed.afterMaths) && !/did not flag anything as tricky/.test(fixed.afterMaths))
check('and reading is a FRESH sheet, not the maths result',
  !/All done/.test(fixed.onReading), fixed.onReading.split('\n').slice(0,3).join(' / '))
check('and reading never claims nothing was flagged',
  !/did not flag anything as tricky/.test(fixed.onReading))
// Case insensitive, and that is not laziness. These labels are uppercased by
// CSS text-transform, and innerText returns what is RENDERED, so a case
// sensitive match here silently fails against a page that is perfectly correct.
check('reading shows reading objectives to work through',
  /tap if tricky/i.test(fixed.onReading))
check('and they are the READING ones, not the maths ones',
  /retrieve and record information/i.test(fixed.onReading) && !/multiples of 6/.test(fixed.onReading))

// ── The same walk with the key removed, to prove the check can see the bug ──
const broken = await run(B + '?bug=1')
check('WITHOUT the key the maths result leaks onto reading',
  /All done/.test(broken.onReading), 'this is the fault Justin screenshotted')
check('and it is the exact wrong sentence he saw',
  /did not flag anything as tricky/.test(broken.onReading))

await b.close()
console.log(`\n${fails===0?'all passed':fails+' failed'}`)
process.exit(fails?1:0)
