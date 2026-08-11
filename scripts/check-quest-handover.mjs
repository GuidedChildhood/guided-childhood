// Is the hand over panel's reassurance behind a door?
//
// Justin, 11 August 2026: "use this principle for each page, do not have the
// whole thing all down each page, just a one line explaining what it is and the
// ability to expand or reduce. I think this is best app practice."
//
// Three ticks about privacy are exactly right the first time a parent considers
// sending a link to their child, and exactly wallpaper on the fortieth visit to
// this board.
//
// QuestManager fetches everything itself and takes no props, so this panel was
// behind auth and had no fixture at all. /dev/quest-handover stubs the fetches
// the same way ref-status-board does, for the reason written on that file: a
// fixture that renders nothing certifies nothing.
//
// Usage: start the app, then node scripts/check-quest-handover.mjs [baseUrl]

import { chromium } from 'playwright'
const B = (process.argv[2] ?? 'http://localhost:3000') + '/dev/quest-handover'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let fails = 0
const check = (n, ok, d='') => { if(!ok) fails++; console.log(`${ok?'PASS':'FAIL'}  ${n}${d?'  '+d:''}`) }
const errs = []

const p = await b.newPage({ viewport: { width: 390, height: 844 } })
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
await p.goto(B, { waitUntil: 'networkidle' })
await p.waitForTimeout(900)
let t = await p.locator('body').innerText()

check('the hand over panel renders at all', /hand it to teo/i.test(t), t.slice(0, 80).replace(/\n/g,' '))

// The reassurance is behind a door, and the door still says the answer.
check('the three privacy ticks are not on screen',
  !/nothing to install/i.test(t))
check('but the line saying it is safe still is',
  /one private page, and it is safe/i.test(t))
check('and it carries its answer while closed', /private/i.test(t))

await p.locator('button', { hasText: /One private page/i }).first().click()
await p.waitForTimeout(250)
t = await p.locator('body').innerText()
check('opening it shows all three', /nothing to install/i.test(t) && /only your family holds the link/i.test(t) && /stars land only when you approve/i.test(t))

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: '/var/tmp/handover-390.png', fullPage: true })
await p.close()

const s = await b.newPage({ viewport: { width: 320, height: 700 } })
await s.goto(B, { waitUntil: 'networkidle' })
await s.waitForTimeout(700)
check('no sideways overflow at 320',
  !(await s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)))
await s.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'networkidle' })
await d.waitForTimeout(700)
await d.screenshot({ path: '/var/tmp/handover-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.slice(0,2).join(' | '))
console.log(`\n${fails===0?'all passed':fails+' failed'}`)
process.exit(fails?1:0)
