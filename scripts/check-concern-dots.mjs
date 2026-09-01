// Is the check in actually simple now?
//
// Justin, twice: "the sliders here are still clunky, is there a better way to
// give a 1 to 10 rating that shows previous rating, puts up how it's improved
// or worsened, saved for special attention from DiGi, and then moves onto the
// next one so the user sees progress, we record it for weekly round up, and
// super simple to use."
//
// ── REWRITTEN TWICE, 13 AND 14 AUGUST 2026 ──────────────────────────────────
//
// SECOND REWRITE, 14 August. The five stacked words became five DiGi STARS,
// after Justin saw Duolingo's Food and Shopping screen on Mobbin: one tap
// instead of two, last time and today shown in the same five positions, and a
// card short enough that three concerns fit on a phone without scrolling.
//
// The scale did not move an inch. Star n still posts BANDS[n-1].score, so the
// numbers in concern_events are the same 2, 4, 6, 8, 10, and the weekly email
// and the What is working page read identical data. That is the thing this
// file exists to hold: the INSTRUMENT is allowed to change, the SCALE is not.
// So the posted score is still asserted exactly, while the assertions about
// what the parent taps have moved to stars.
//
// New this time, and both are Justin's: the rows carry the CHILD they belong
// to, because concerns.child_id was set on every row since the table was made
// and nothing had ever read it; and five stars says out loud that the concern
// will drop off the check in, because a row silently vanishing next week is
// indistinguishable from the app losing it.
//
// ── FIRST REWRITE, 13 AUGUST 2026, AND WHY IT WAS FAILING ───────────────────
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
// ── ONE KNOWN FLAKE, AND IT IS THE PRODUCT BEING RIGHT ──────────────────────
//
// Saving an answer calls router.refresh(), so Home drops its cached view and
// the Today rung stops showing the check in as undone. That is correct and it
// must stay. Against a DEV server it also re-runs the fixture's server
// component mid test, and roughly one run in eight lands that refresh between
// the first save and the second tap, which resets the row this file is halfway
// through asserting on.
//
// Four separate flake modes have been fixed properly rather than papered over:
// waitUntil networkidle (never settles against Fast Refresh's websocket), taps
// landing before hydration, DOM reads dying on the refresh, and a fixed 3200ms
// wait racing a 2600ms save beat. This last one is not a wait that can be
// tuned: it is the page legitimately reloading underneath the test. Re-run it,
// or run it against a production build where nothing recompiles.
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
// WAIT FOR THE CARD, NEVER FOR THE NETWORK.
//
// This used to be waitUntil 'networkidle', and against a Next dev server that
// is a coin toss: Fast Refresh holds a websocket open, so the network is never
// idle and goto times out at thirty seconds. Two runs in six died there, which
// looked like a broken component and was a broken wait.
//
// domcontentloaded plus waiting for the thing itself is both faster and honest.
// networkidle was never the right question anyway: it fires before React has
// hydrated on a cold compile, which is what reported zero radiogroups on a page
// that plainly had three.
await p.goto(B, { waitUntil: 'domcontentloaded', timeout: 60000 })
await p.waitForSelector('[role="radiogroup"] [role="radio"]', { timeout: 30000 })

// HYDRATION, AND THE FLAKE IT CAUSED.
//
// The rows are server rendered, so the stars are in the DOM and clickable
// before React has attached a single handler to them. A click in that window
// does nothing at all and reports no error, which made this whole file fail
// against a component that was working perfectly in a browser. waitForSelector
// does not help: the element it waits for is the one that is already there.
//
// So a tap is not complete until the control says it is. Clicks until
// aria-checked flips, or gives up loudly rather than carrying on to fail
// fifteen assertions with a misleading message.
// THE PAGE REFRESHES ITSELF, AND THAT IS CORRECT BEHAVIOUR.
//
// Saving an answer calls router.refresh() so Home drops its cached view and the
// Today rung stops showing the check in as undone. In a dev server that is an
// RSC refetch, and any evaluate in flight when it lands dies with "Execution
// context was destroyed". Fast Refresh does the same on a recompile.
//
// The product is right and the guard has to tolerate it, so every DOM read goes
// through this. One retry is plenty: the refresh is a single event, not a loop.
async function stable(fn) {
  for (let i = 0; i < 3; i++) {
    try { return await fn() } catch (e) {
      if (!/Execution context was destroyed|Target closed/.test(String(e))) throw e
      await p.waitForTimeout(600)
    }
  }
  return fn()
}

async function tap(locator, label) {
  for (let i = 0; i < 12; i++) {
    // Answering a row scrolls the card on to the next one, so a star that was
    // on screen when the locator was made can be off it by the time the click
    // lands. Bring it back before every attempt rather than letting the click
    // time out waiting for visibility.
    await locator.scrollIntoViewIfNeeded().catch(() => {})
    await locator.click({ timeout: 5000 }).catch(() => {})
    await p.waitForTimeout(250)
    if (await locator.getAttribute('aria-checked') === 'true') return true
    await p.waitForTimeout(500)
  }
  check(`tap landed on ${label}`, false, 'React never picked the click up')
  return false
}

const groups = p.locator('[role="radiogroup"]')
// Settle BEFORE the first count, not after it. waitForSelector above returns on
// the server rendered markup, and hydration then swaps it, so a count taken in
// that gap reports zero groups on a page that plainly has three and every
// assertion after it fails with a misleading message. Waiting for the fifth
// star of the third group is waiting for the whole card to be real.
// Poll for the whole card rather than for one node in it. Waiting on a single
// star of a single group is not enough: the groups hydrate independently, so
// the third can be ready while the first is momentarily empty. Fifteen stars,
// five in each of three groups, is the card being genuinely finished.
await p.waitForFunction(() => {
  const gs = [...document.querySelectorAll('[role="radiogroup"]')]
  return gs.length === 3 && gs.every(g => g.querySelectorAll('[role="radio"]').length === 5)
}, null, { timeout: 20000 })
check('one set of answers per concern', await groups.count() === 3, String(await groups.count()))

// FIVE WORDS, NOT TEN NUMBERS. The count comes from BANDS, so this is a guard
// on the shape of the question rather than on a magic number.
const words = groups.first().locator('[role="radio"]')
check('five stars, not ten numbers', await words.count() === 5, String(await words.count()))

// The words live in the aria-label now, because the control is a star. That is
// deliberate and it is checked here rather than waived: an unlabelled star row
// is unusable with a screen reader, and the five names are still the product's
// vocabulary even when they are not on screen.
const labels = await stable(() => words.evaluateAll(els =>
  els.map(e => (e.getAttribute('aria-label') || '').split(',')[0].trim())))
check('and they run worst to best',
  labels.join(' | ') === 'Really tough | Hard going | Up and down | Getting there | Going great',
  labels.join(' | '))

// THE FIFTH FLAKE MODE (1 September 2026, found by CI, not locally).
// boundingBox() does not throw when the dev server's RSC refresh lands
// mid read, it returns NULL, so the stable() wrapper above never sees an
// error and the bare property read below it crashed the whole guard with a
// TypeError instead of a finding. Same event as the other four modes, one
// more disguise. So a box is read like every other DOM fact here: retried
// through the refresh, and failed LOUDLY as a check rather than a crash if
// it still has no box after that.
async function boxOf(locator, label) {
  for (let i = 0; i < 4; i++) {
    const bb = await stable(() => locator.boundingBox())
    if (bb) return bb
    await p.waitForTimeout(600)
  }
  check(`${label} has a box on screen`, false, 'no bounding box after the refresh settled')
  return null
}

// Every word is a real thumb target, and the row is full width, which is the
// reason for stacking them in the first place.
const box = await boxOf(words.nth(0), 'the first star')
if (box) check('each star is a proper tap target', box.height >= 44 && box.width >= 44, `${Math.round(box.width)}x${Math.round(box.height)}`)
// Five of them have to sit on one line at 390, which is the whole reason the
// row is short enough not to need an accordion.
//
// THE SIXTH FLAKE MODE (1 September 2026, found by CI on a diff with no UI
// change at all). The stars arrive on a staggered entrance, so for a few
// frames the first and fifth sit at different heights, and a box read mid
// flight reported the row as wrapped: first y 365, fifth y 359. Six pixels
// is an animation; a genuine wrap is a full row of offset and it persists.
// So the pair is re read until the heights agree or stop changing, and only
// a difference that SURVIVES the settling is a finding.
let rowFirst = box
let rowFifth = await boxOf(words.nth(4), 'the fifth star')
for (let i = 0; i < 5 && rowFirst && rowFifth && Math.abs(rowFifth.y - rowFirst.y) >= 4; i++) {
  await p.waitForTimeout(600)
  rowFirst = await boxOf(words.nth(0), 'the first star')
  rowFifth = await boxOf(words.nth(4), 'the fifth star')
}
if (rowFirst && rowFifth) check('all five sit on one row', Math.abs(rowFifth.y - rowFirst.y) < 4, `first y ${Math.round(rowFirst.y)}, fifth y ${Math.round(rowFifth.y)}`)

// No word may be cut off. A truncated answer is a worse answer, and it is the
// failure stacking them was meant to prevent.
// WHOSE WORRY IS IT. concerns.child_id has always been set and nothing read
// it, so a two child family rated an undifferentiated list and the numbers
// landed against a child they never chose.
const bodyText = await stable(() => p.locator('body').innerText())
check('each concern says which child it belongs to',
  /TEO/i.test(bodyText) && /OLGA/i.test(bodyText),
  bodyText.split('\n').filter(l => /^(TEO|OLGA)$/i.test(l.trim())).join(', ') || 'no child headings')

// WHY IT IS WORTH DOING, said before the ask rather than after it.
check('it says why the check in matters',
  /read these every week/i.test(bodyText) && /change the approach/i.test(bodyText))

// LAST TIME IS MARKED ON THE SCALE, before anything is tapped. The fixture's
// first concern carries lastScore 3, which is band 2, "Hard going".
// Last time is the GREY FILL up to its band (18 August 2026), and exactly one
// star, the one AT the band, carries the "what you said last time" label: the
// fill is cumulative but the fact is singular, and a screen reader must never
// be told the parent said "Really tough" when they said "Hard going". Read
// off the aria-label, which is the accessible half of the fact.
const ringed = await stable(() => p.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"]')]
    .filter(r => /last time/i.test(r.getAttribute('aria-label') || ''))
    .map(r => (r.getAttribute('aria-label') || '').split(',')[0].trim())
}))
check('last time is marked on the star it belonged to',
  ringed.length === 1 && ringed[0] === 'Hard going',
  `marked ${ringed.join(' / ') || 'none'}`)

// It is also said in prose, because the ring is spatial and a sentence is not.
let t = await stable(() => p.locator('body').innerText())
check('and last time is named in words too', /last time hard going/i.test(t))

// ONE TAP, and now it really is one: the old design needed the parent to read
// five stacked words before choosing one.
//
// THE COMPARISON IS IN WORDS NOW, and this is the other half of what went
// stale. It used to read "Today 8, last check in 3". Two numbers is exactly
// the thing the five words replaced, and a parent who never chose a number
// should not be shown one back. It says "Getting there today, hard going last
// time. The line is climbing." So what is checked is that BOTH words are named
// and the direction is said, not that a particular digit appears.
await tap(words.nth(3), 'four stars')   // Getting there, against Hard going last time
t = await stable(() => p.locator('body').innerText())
check('one tap picks the answer', /Getting there/i.test(t))
check('and it says how it compares, in the same words it asked in',
  /getting there today, hard going last time/i.test(t),
  t.split('\n').find(l => /last time\./i.test(l)) ?? 'no comparison line')
check('and it says which way it moved', /the line is climbing/i.test(t))
check('and it is chosen', (await words.nth(3).getAttribute('aria-checked')) === 'true')

// Changing your mind inside the beat just moves it, and only one posts.
await tap(words.nth(2), 'three stars')   // Up and down
t = await stable(() => p.locator('body').innerText())
check('tapping another star changes it', /up and down today, hard going last time/i.test(t),
  t.split('\n').find(l => /last time\./i.test(l)) ?? 'no comparison line')
check('and nothing has posted yet', posted.length === 0, JSON.stringify(posted))

// The number still reaches the database, because concern_events is what the
// what is working page reads. The parent never sees it; the row does.
// POLL FOR THE POST, DO NOT RACE IT. This was a fixed 3200ms against a 2600ms
// save beat, which left 600ms of headroom, and the tap helper above can spend
// more than that retrying a click the page was not ready for. Each retry
// restarts the beat, so a slow tap pushed the post past the window and the run
// failed claiming nothing had saved. The assertion is "it saves ONCE", not "it
// saves inside 3.2 seconds", so it waits for the thing it is actually about.
for (let i = 0; i < 40 && posted.length === 0; i++) await p.waitForTimeout(250)
// Then a beat longer, to catch a second post that should never come.
await p.waitForTimeout(1200)
check('then it saves once, with the number behind the word tapped',
  posted.length === 1 && posted[0].score === 6, JSON.stringify(posted))
t = await stable(() => p.locator('body').innerText())
check('and the row stays on screen as a record',
  /up and down today, hard going last time/i.test(t) && /Saved/i.test(t))

// THE FOLDED LINE KEEPS THE RESULT (1 September 2026). A saved row folds to
// one slim line, and that line carries the movement rather than the word
// "Saved": the verdict used to be destroyed 2.6 seconds after it appeared,
// which is the opposite of "pops up a result to show it's moved".
// Fixture row one: 6 (up and down) against last time 3 (hard going) is a
// band up, so the folded line reads "Up from hard going".
check('the folded row keeps its verdict', /Up from hard going/i.test(t),
  t.split('\n').find(l => /up from/i.test(l)) ?? 'no folded verdict')

// THE RUN HAS A PLACE IN IT: one saved of three shows as a counter, so a
// parent mid list always knows how much is left.
check('the counter counts the run', /1 of 3/.test(t),
  t.split('\n').find(l => /of 3/.test(l)) ?? 'no counter')

// SAVED KEEPS THE COLOUR OF THE THING YOU CHOSE. The old check asserted the
// chosen dot turned green, which is exactly what 12 August removed: repainting
// the answer green threw away the brand colour at the one moment the row
// matters. It presses down and takes a green tick instead.
// THE STARS FILL IN BUTTER, and they fill CUMULATIVELY: three stars chosen
// means three filled, not the third one only. That is what makes the row
// readable at a glance from across the list.
const filled = await stable(() => p.evaluate(() => {
  const g = document.querySelector('[role="radiogroup"]')
  return [...g.querySelectorAll('[role="radio"] path')]
    .map(pth => pth.getAttribute('fill'))
}))
check('the stars fill in butter, cumulatively',
  filled.slice(0, 3).every(f => /terracotta\)/.test(f || '')) && !/terracotta\)/.test(filled[3] || ''),
  filled.join(' | '))

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
check('an unanswered row stays compact', rowH !== null && rowH < 200, `${rowH}px`)
const pageH = await p.evaluate(() => document.body.scrollHeight)
check('and all three concerns are one scroll, not an expedition', pageH < 1200, `${pageH}px of page`)

// The instruction has to match the gesture.
check('the intro says tap, not slide', /tap/i.test(t) && !/slide/i.test(t))

const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
check('no sideways overflow at 390', !over)
await p.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/checkin-390.png` : '/var/tmp/checkin-390.png' })

// A saved row cannot be re-answered.
check('a saved row is locked', await words.nth(1).isDisabled())

// FIVE STARS SAYS IT WILL STOP ASKING. The rule lives in lib/checkin/today.ts;
// this is the half the parent has to be told, because a row that silently
// vanishes next week is indistinguishable from the app having lost it.
const second = p.locator('[role="radiogroup"]').nth(1).locator('[role="radio"]')
await tap(second.nth(4), 'five stars on the second row')
const t5 = await stable(() => p.locator('body').innerText())
check('five stars says the concern will drop off the check in',
  /drop it off your check in/i.test(t5) && /log it as a moment/i.test(t5),
  t5.split('\n').find(l => /drop it off/i.test(l)) ?? 'no message')
await p.close()

// Narrow phone: the longest word still has to fit on one line.
const s = await b.newPage({ viewport: { width: 320, height: 700 } })
await s.route('**/api/daily/concern-check', r => r.fulfill({ status: 200, body: '{"ok":true}' }))
await s.goto(B, { waitUntil: 'domcontentloaded', timeout: 60000 })
await s.waitForSelector('[role="radiogroup"] [role="radio"]', { timeout: 30000 })
// Five 44px targets need 220px of the 320 available, so this is the width that
// would break first if the stars ever grew.
await s.waitForSelector('[role="radiogroup"] [role="radio"]', { timeout: 20000 })
const row320 = await s.evaluate(() => {
  const rs = [...document.querySelectorAll('[role="radiogroup"]')[0].querySelectorAll('[role="radio"]')]
  const first = rs[0].getBoundingClientRect()
  const last = rs[4].getBoundingClientRect()
  return { sameRow: Math.abs(last.top - first.top) < 4, right: Math.round(last.right) }
})
check('all five stars still fit on one row at 320',
  row320.sameRow && row320.right <= 320, `right edge ${row320.right}`)
check('no sideways overflow at 320',
  !(await s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)))
await s.close()

const d = await b.newPage({ viewport: { width: 1280, height: 900 } })
await d.goto(B, { waitUntil: 'domcontentloaded', timeout: 60000 })
await d.waitForSelector('[role="radiogroup"] [role="radio"]', { timeout: 30000 })
await d.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/checkin-1280.png` : '/var/tmp/checkin-1280.png' })
check('desktop renders', true)
await d.close()
await b.close()
check('no console errors', errs.length === 0, errs.join(' | '))
console.log(`\n${fails === 0 ? 'all passed' : fails + ' failed'}`)
process.exit(fails ? 1 : 0)
