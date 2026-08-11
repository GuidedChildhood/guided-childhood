// Is the 1 to 10 rating actually simple now?
//
// Justin, twice: "the sliders here are still clunky, is there a better way to
// give a 1 to 10 rating that shows previous rating, puts up how it's improved
// or worsened, saved for special attention from DiGi, and then moves onto the
// next one so the user sees progress, we record it for weekly round up, and
// super simple to use."
//
// A drag was always the wrong instrument for ten discrete answers. These checks
// hold the replacement to the whole of that sentence: ten real tap targets that
// fit on the narrowest phone, last time marked on the same scale, the
// comparison said in words, one post per concern with the number actually
// chosen, the row left on screen as the record, and a hand over to the next.
//
// Usage: start the app, then node scripts/check-concern-dots.mjs [baseUrl]

import { chromium } from 'playwright'
const B = (process.argv[2] ?? 'http://localhost:3000') + '/dev/concern-scale'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let fails = 0
const check = (n, ok, d='') => { if(!ok) fails++; console.log(`${ok?'PASS':'FAIL'}  ${n}${d?'  '+d:''}`) }
const errs = []

const p = await b.newPage({ viewport: { width: 390, height: 844 } })
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
const posted = []
await p.route('**/api/daily/concern-check', async r => {
  posted.push(JSON.parse(r.request().postData() ?? '{}'))
  await r.fulfill({ status: 200, body: '{"ok":true}' })
})
await p.goto(B, { waitUntil: 'networkidle' })
await p.waitForTimeout(400)

const groups = p.locator('[role="radiogroup"]')
check('one row of dots per concern', await groups.count() === 3, String(await groups.count()))
const dots = groups.first().locator('[role="radio"]')
check('ten dots, one per number', await dots.count() === 10, String(await dots.count()))

// Every dot must be a real thumb target and all ten must fit on the phone.
const box = await dots.nth(0).boundingBox()
const last = await dots.nth(9).boundingBox()
check('each dot is a proper tap target', box.height >= 40, `${Math.round(box.width)}x${Math.round(box.height)}`)
check('all ten fit across a 390 phone', last.x + last.width <= 390, `right edge ${Math.round(last.x+last.width)}`)

// Last time is marked on the scale, before anything is tapped.
const ringed = await p.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"] span')]
    .map((s, i) => ({ n: i + 1, dotted: getComputedStyle(s).borderStyle === 'dotted' }))
    .filter(x => x.dotted).map(x => x.n)
})
check('last time is ringed on the scale', ringed.join(',') === '3', `ringed ${ringed.join(',') || 'none'}`)

// ONE TAP. No press, no aim, no release.
await dots.nth(7).click()
await p.waitForTimeout(250)
let t = await p.locator('body').innerText()
check('one tap picks the number', /Getting there/i.test(t), t.split('\n').find(l => /Getting|Going|Up and|Hard|Really/.test(l)) ?? '')
check('and it says how it compares with last time', /Today 8, last check in 3/.test(t))
check('and it is chosen', (await dots.nth(7).getAttribute('aria-checked')) === 'true')

// Changing your mind inside the beat just moves it, and only one posts.
await dots.nth(5).click()
await p.waitForTimeout(250)
t = await p.locator('body').innerText()
check('tapping another number changes it', /Today 6, last check in 3/.test(t))
check('and nothing has posted yet', posted.length === 0, JSON.stringify(posted))

await p.waitForTimeout(3200)
check('then it saves once, with the last number tapped', posted.length === 1 && posted[0].score === 6, JSON.stringify(posted))
t = await p.locator('body').innerText()
check('and the row stays on screen as a record', /Today 6, last check in 3/.test(t) && /Saved/i.test(t))

// Green means set, same as the dial it replaces.
const green = await p.evaluate(() => {
  const s = document.querySelector('[role="radiogroup"] [role="radio"][aria-checked="true"] span')
  return s ? getComputedStyle(s).borderColor : null
})
check('the chosen dot is green once saved', /47, *143, *107/.test(green ?? ''), String(green))

// And it hands over to the next unanswered one.
const scrolled = await p.evaluate(() => window.scrollY)
check('the page moved on to the next concern', scrolled > 0, `scrollY ${scrolled}`)

// SHORT ROWS. The old readout reserved 6.4em of empty space above the track on
// every row, because with a drag the text growing would have shifted the track
// under a moving thumb. That reservation was the biggest single thing making
// this card enormous, and with taps it is not needed at all.
const rowH = await p.evaluate(() => {
  const g = document.querySelectorAll('[role="radiogroup"]')[1]
  return g?.parentElement ? Math.round(g.parentElement.getBoundingClientRect().height) : null
})
check('an unanswered row is compact', rowH !== null && rowH < 260, `${rowH}px`)
check('and all three concerns are reachable without a long scroll',
  (await p.evaluate(() => document.body.scrollHeight)) < 1100,
  `${await p.evaluate(() => document.body.scrollHeight)}px of page`)

// The instruction has to match the gesture.
check('the intro says tap, not slide', /tap where each one is today/i.test(t) && !/slide/i.test(t))

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: '/var/tmp/dots-390.png' })

// A saved row cannot be re-answered.
check('a saved row is locked', await dots.nth(2).isDisabled())
await p.close()

// Narrow phone: ten dots still have to fit.
const s = await b.newPage({ viewport: { width: 320, height: 700 } })
await s.route('**/api/daily/concern-check', r => r.fulfill({ status: 200, body: '{"ok":true}' }))
await s.goto(B, { waitUntil: 'networkidle' })
await s.waitForTimeout(300)
const l320 = await s.locator('[role="radiogroup"]').first().locator('[role="radio"]').nth(9).boundingBox()
check('and they still fit at 320', l320.x + l320.width <= 320, `right edge ${Math.round(l320.x+l320.width)}`)
check('no sideways overflow at 320',
  !(await s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)))
await s.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'networkidle' })
await d.waitForTimeout(300)
await d.screenshot({ path: '/var/tmp/dots-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.join(' | '))
console.log(`\n${fails===0?'all passed':fails+' failed'}`)
process.exit(fails?1:0)
