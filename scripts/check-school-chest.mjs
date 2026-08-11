// School sits beside the road, and must never read as a step on it.
//
// Justin, 11 August 2026, asking the question directly: "is it time critical it
// becomes a relevant for age step stone on the pathway to check what your child
// is doing next at school, and when they click it it updates the pathway? Or is
// it next to have a chest equivalent showing next to the pathway diagram, that
// does not have to be done but invites you to see the new curriculum checker,
// homework decoder helper?"
//
// It is the chest. The five stones on that road are STAGES, years wide each,
// and a school term measured in weeks does not belong on that scale. Stones
// also gate, so a curriculum checker as a stone would be a thing a parent could
// be BEHIND on, which is the fastest way to make somebody avoid a page that is
// only ever useful. His own phrasing settles it: "does not have to be done".
//
// So the sharpest check in here is the one asserting the words step, stage,
// task, to do and complete appear nowhere in it.
//
// Usage: start the app, then node scripts/check-school-chest.mjs [baseUrl]

import { chromium } from 'playwright'
const B = (process.argv[2] ?? 'http://localhost:3000') + '/dev/school-chest'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let fails = 0
const check = (n, ok, d='') => { if(!ok) fails++; console.log(`${ok?'PASS':'FAIL'}  ${n}${d?'  '+d:''}`) }
const errs = []

const p = await b.newPage({ viewport: { width: 390, height: 844 } })
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
await p.goto(B, { waitUntil: 'networkidle' })
await p.waitForTimeout(400)
let t = await p.locator('body').innerText()

check('it sits beside the road, not on it', /beside the road/i.test(t))
check('it wears the beta tag', /Beta/i.test(t))
check('it names the year and term when we know them', /Year 4, Autumn term/.test(t))
check('and names the child when we do not', /Teo's class is working on/.test(t))
check('and still works with no name at all', /your child's class is working on/.test(t))

// THE WHOLE POINT: it must never read as a task.
check('it says there is nothing to finish', /nothing to finish/i.test(t))
check('and never calls itself a step, stage or task',
  !/\bstep\b|\bstage\b|\btask\b|\bto do\b|\bcomplete\b/i.test(t),
  (t.match(/\bstep\b|\bstage\b|\btask\b|\bto do\b|\bcomplete\b/i) ?? [''])[0])

// Both ways in, and the decoder by name.
const hrefs = await p.$$eval('a', as => as.map(a => a.getAttribute('href')))
check('it opens the learning page', hrefs.includes('/dashboard/learning'))
check('and the homework decoder by name', hrefs.includes('/dashboard/learning?tab=homework') && /homework help/i.test(t))

// It changes when opened, which was Justin's other half.
check('it starts closed', /what school is doing next/i.test(t))
await p.evaluate(() => window.localStorage.setItem('gc.schoolchest.opened', '1'))
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(300)
t = await p.locator('body').innerText()
check('and remembers being opened', /school, whenever you want it/i.test(t))
check('and offers to go back in', /open it again/i.test(t))

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: '/var/tmp/chest-390.png', fullPage: true })
await p.close()

const s = await b.newPage({ viewport: { width: 320, height: 700 } })
await s.goto(B, { waitUntil: 'networkidle' })
await s.waitForTimeout(300)
check('no sideways overflow at 320',
  !(await s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)))
await s.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'networkidle' })
await d.waitForTimeout(300)
await d.screenshot({ path: '/var/tmp/chest-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.join(' | '))
console.log(`\n${fails===0?'all passed':fails+' failed'}`)
process.exit(fails?1:0)
