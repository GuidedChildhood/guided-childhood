// Is the From school card a card again, or still a page?
//
// Justin, 11 August 2026, with a screenshot of it filling a whole phone: "on
// the home page things like this need to be shrunk behind an expandable tab,
// otherwise it makes the home page messy. Use this principle for each page, do
// not have the whole thing all down each page, just a one line explaining what
// it is and the ability to expand or reduce. I think this is best app practice."
//
// Two things were permanently on screen that should not have been: the
// section's own heading, which the fold above it on Home already said, and a
// four line explanation of the feature, which is onboarding copy that stops
// being news after one read.
//
// The measurement at the end is the point. 1974px before, and the fold rule is
// only worth anything if the number moves.
//
// Usage: start the app, then node scripts/check-school-card-fold.mjs [baseUrl]

import { chromium } from 'playwright'
const B = (process.argv[2] ?? 'http://localhost:3000') + '/ref-school-card'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let fails = 0
const check = (n, ok, d='') => { if(!ok) fails++; console.log(`${ok?'PASS':'FAIL'}  ${n}${d?'  '+d:''}`) }
const errs = []

const p = await b.newPage({ viewport: { width: 390, height: 844 } })
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
await p.goto(B, { waitUntil: 'networkidle' })
await p.waitForTimeout(500)
let t = await p.locator('body').innerText()

// THE MANUAL IS BEHIND A DOOR.
check('the four line explanation is not on screen',
  !/Kit days, payments and deadlines/.test(t))
check('but there is a line saying where it went', /how this works/i.test(t))
check('and the line carries what it is about', /forwarded emails/i.test(t))

// And it opens.
await p.locator('button', { hasText: /How this works/i }).first().click()
await p.waitForTimeout(250)
t = await p.locator('body').innerText()
check('opening it shows the explanation', /Kit days, payments and deadlines/.test(t))
check('and the test button lives in there now', /send a test/i.test(t))

// The week fold still says its answer while closed.
const weekBtn = p.locator('button', { hasText: /^This week/i }).first()
check('the week has its own line', await weekBtn.count() > 0)
const weekRow = await weekBtn.innerText()
check('and the closed row still says how many are due', /\d+ due/.test(weekRow), weekRow.replace(/\n/g, ' '))

// The card is dramatically shorter than it was.
const h = await p.evaluate(() => Math.round(document.body.scrollHeight))
check('the whole card fits in about a screen and a half', h < 1250, `${h}px`)

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: '/var/tmp/fold-390.png', fullPage: true })
await p.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'networkidle' })
await d.waitForTimeout(300)
await d.screenshot({ path: '/var/tmp/fold-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.join(' | '))
console.log(`\n${fails===0?'all passed':fails+' failed'}`)
process.exit(fails?1:0)
