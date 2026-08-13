// Is the check in actually simple now?
//
// Justin, twice: "the sliders here are still clunky, is there a better way to
// give a 1 to 10 rating that shows previous rating, puts up how it's improved
// or worsened, saved for special attention from DiGi, and then moves onto the
// next one so the user sees progress, we record it for weekly round up, and
// super simple to use."
//
// ── REWRITTEN 13 AUGUST 2026, AND WHY IT WAS FAILING ────────────────────────
//
// This file used to assert TEN DOTS IN A ROW, and check that all ten fitted
// across a 390 phone. That was the honest reading of "a 1 to 10 rating" and it
// shipped passing. On 12 August the row of ten was deliberately replaced by
// FIVE STACKED FULL WIDTH WORDS, because ten numbers on a phone is a row of
// targets a thumb cannot hit cleanly and, worse, a number is not an answer a
// parent has. "Up and down" is. The component was right and the check was
// stale, so it failed for a day looking like a broken card.
//
// The sentence it guards has not changed at all, so neither has this file's
// job. Only the instrument did. What is checked below is the whole of Justin's
// sentence against the five words: the previous rating shown, the comparison
// said out loud, one post per concern carrying the number actually chosen, the
// row left on screen as the record, and a hand over to the next one.
//
// Two things are deliberately NOT asserted, because they are what changed and
// naming them stops this file drifting back:
//   - No count of ten. Five bands, and BANDS in the component is the source of
//     that number.
//   - Nothing about a row of targets fitting side by side. They are stacked, so
//     the width question is now whether the LONGEST WORD survives 320 without
//     being truncated, which is the thing that would actually break.
//
// Usage: start the app, then node scripts/check-concern-dots.mjs [baseUrl]

import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const B = (process.argv[2] ?? process.env.BASE ?? 'http://localhost:3000') + '/dev/concern-scale'

// The container's chromium, when it is there. Otherwise Playwright's own, so
// this runs on Justin's Mac as well as in CI rather than only in one of them.
const CONTAINER_CHROME = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch(existsSync(CONTAINER_CHROME) ? { executablePath: CONTAINER_CHROME } : {})

let fails = 0
const check = (n, ok, d = '') => { if (!ok) fails++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${n}${d ? '  ' + d : ''}`) }
const errs = []

const p = await b.newPage({ viewport: { width: 390, height: 844 } })
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
const posted = []
await p.route('**/api/daily/concern-check', async r => {
  posted.push(JSON.parse(r.request().postData() ?? '{}'))
  await r.fulfill({ status: 200, body: '{"ok":true}' })
})
await p.goto(B, { waitUntil: 'networkidle' })
// networkidle fires before React has hydrated on a cold compile, and the first
// run of this rewrite reported zero radiogroups on a page that plainly had
// three. Wait for the thing itself rather than for the network to go quiet.
await p.waitForSelector('[role="radiogroup"] [role="radio"]', { timeout: 20000 })
await p.waitForTimeout(300)

const groups = p.locator('[role="radiogroup"]')
check('one set of answers per concern', await groups.count() === 3, String(await groups.count()))

// FIVE WORDS, NOT TEN NUMBERS. The count comes from BANDS, so this is a guard
// on the shape of the question rather than on a magic number.
const words = groups.first().locator('[role="radio"]')
check('five words, not ten numbers', await words.count() === 5, String(await words.count()))

// First line only: the ringed one also carries a LAST TIME marker underneath.
const labels = (await words.allInnerTexts()).map(t => t.trim().split('\n')[0].trim())
check('and they run worst to best',
  labels.join(' | ') === 'Really tough | Hard going | Up and down | Getting there | Going great',
  labels.join(' | '))

// Every word is a real thumb target, and the row is full width, which is the
// reason for stacking them in the first place.
const box = await words.nth(0).boundingBox()
check('each word is a proper tap target', box.height >= 44, `${Math.round(box.width)}x${Math.round(box.height)}`)
check('and it runs the full width of the card', box.width >= 250, `${Math.round(box.width)}px wide`)

// No word may be cut off. A truncated answer is a worse answer, and it is the
// failure stacking them was meant to prevent.
const truncated = await p.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"]')]
    .map(r => [...r.querySelectorAll('span')].find(s => s.textContent.trim().length > 3))
    .filter(Boolean)
    .filter(s => s.scrollWidth > s.clientWidth + 1)
    .map(s => s.textContent.trim())
})
check('no word is truncated at 390', truncated.length === 0, truncated.join(', '))

// LAST TIME IS MARKED ON THE SCALE, before anything is tapped. The fixture's
// first concern carries lastScore 3, which is band 2, "Hard going".
const ringed = await p.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"]')]
    .filter(r => getComputedStyle(r).borderStyle === 'dotted')
    // textContent runs the LAST TIME marker straight onto the label with no
    // separator, so this matches on the opening rather than on equality.
    .map(r => r.textContent.trim())
})
check('last time is ringed on the word it belonged to',
  ringed.length === 1 && ringed[0].startsWith('Hard going'),
  `ringed ${ringed.join(' / ') || 'none'}`)

// It is also said in prose, because the ring is spatial and a sentence is not.
let t = await p.locator('body').innerText()
check('and last time is named in words too', /last time you said hard going/i.test(t))

// ONE TAP. No press, no aim, no release.
//
// THE COMPARISON IS IN WORDS NOW, and this is the other half of what went
// stale. It used to read "Today 8, last check in 3". Two numbers is exactly
// the thing the five words replaced, and a parent who never chose a number
// should not be shown one back. It says "Getting there today, hard going last
// time. The line is climbing." So what is checked is that BOTH words are named
// and the direction is said, not that a particular digit appears.
await words.nth(3).click()   // Getting there, against Hard going last time
await p.waitForTimeout(250)
t = await p.locator('body').innerText()
check('one tap picks the answer', /Getting there/i.test(t))
check('and it says how it compares, in the same words it asked in',
  /getting there today, hard going last time/i.test(t),
  t.split('\n').find(l => /last time\./i.test(l)) ?? 'no comparison line')
check('and it says which way it moved', /the line is climbing/i.test(t))
check('and it is chosen', (await words.nth(3).getAttribute('aria-checked')) === 'true')

// Changing your mind inside the beat just moves it, and only one posts.
await words.nth(2).click()   // Up and down
await p.waitForTimeout(250)
t = await p.locator('body').innerText()
check('tapping another word changes it', /up and down today, hard going last time/i.test(t),
  t.split('\n').find(l => /last time\./i.test(l)) ?? 'no comparison line')
check('and nothing has posted yet', posted.length === 0, JSON.stringify(posted))

// The number still reaches the database, because concern_events is what the
// what is working page reads. The parent never sees it; the row does.
await p.waitForTimeout(3200)
check('then it saves once, with the number behind the word tapped',
  posted.length === 1 && posted[0].score === 6, JSON.stringify(posted))
t = await p.locator('body').innerText()
check('and the row stays on screen as a record',
  /up and down today, hard going last time/i.test(t) && /Saved/i.test(t))

// SAVED KEEPS THE COLOUR OF THE THING YOU CHOSE. The old check asserted the
// chosen dot turned green, which is exactly what 12 August removed: repainting
// the answer green threw away the brand colour at the one moment the row
// matters. It presses down and takes a green tick instead.
const savedLook = await p.evaluate(() => {
  const r = document.querySelector('[role="radiogroup"] [role="radio"][aria-checked="true"]')
  if (!r) return { bg: 'no chosen row found', transform: 'none' }
  const cs = getComputedStyle(r)
  return { bg: cs.backgroundColor, transform: cs.transform }
})
check('the saved answer keeps the butter, it does not turn green',
  /237, *195, *95/.test(savedLook.bg), savedLook.bg)
check('and it presses down to show it landed', savedLook.transform !== 'none', savedLook.transform)

// And it hands over to the next unanswered one.
const scrolled = await p.evaluate(() => window.scrollY)
check('the page moved on to the next concern', scrolled > 0, `scrollY ${scrolled}`)

// SHORT ROWS. Five stacked rows are taller than one row of dots was, so this
// number moved with the design. What has to stay true is that all three
// concerns are still one ordinary scroll, not an expedition.
const rowH = await p.evaluate(() => {
  const g = document.querySelectorAll('[role="radiogroup"]')[1]
  return g?.parentElement ? Math.round(g.parentElement.getBoundingClientRect().height) : null
})
check('an unanswered row stays compact', rowH !== null && rowH < 460, `${rowH}px`)
const pageH = await p.evaluate(() => document.body.scrollHeight)
check('and all three concerns are one scroll, not an expedition', pageH < 1900, `${pageH}px of page`)

// The instruction has to match the gesture.
check('the intro says tap, not slide', /tap/i.test(t) && !/slide/i.test(t))

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/checkin-390.png` : '/var/tmp/checkin-390.png' })

// A saved row cannot be re-answered.
check('a saved row is locked', await words.nth(1).isDisabled())
await p.close()

// Narrow phone: the longest word still has to fit on one line.
const s = await b.newPage({ viewport: { width: 320, height: 700 } })
await s.route('**/api/daily/concern-check', r => r.fulfill({ status: 200, body: '{"ok":true}' }))
await s.goto(B, { waitUntil: 'networkidle' })
await s.waitForTimeout(300)
const cut320 = await s.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"]')]
    .map(r => [...r.querySelectorAll('span')].find(x => x.textContent.trim().length > 3))
    .filter(Boolean)
    .filter(x => x.scrollWidth > x.clientWidth + 1)
    .map(x => x.textContent.trim())
})
check('no word is truncated at 320', cut320.length === 0, cut320.join(', '))
check('no sideways overflow at 320',
  !(await s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)))
await s.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'networkidle' })
await d.waitForTimeout(300)
await d.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/checkin-1280.png` : '/var/tmp/checkin-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.join(' | '))
console.log(`\n${fails === 0 ? 'all passed' : fails + ' failed'}`)
process.exit(fails ? 1 : 0)
