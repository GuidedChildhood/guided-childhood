// Does the tutor lesson actually fit on a phone?
//
// The deck contract is checked without a browser in check-tutor-deck.mjs. This
// is the other half, and it is the half CLAUDE.md insists on: mobile and
// desktop looked at before anything is called done. A child reads this on a
// phone in bed, so 390 is the real size and 1280 is the courtesy.
//
// What it walks: /dev/tutor-lesson, the fixture deck in the child's player, at
// both widths, tapping through every slide. It fails on a horizontal scroll, on
// a console error, and on a dash anywhere in the rendered text, which is the
// house rule that no amount of prompting has ever guaranteed on its own.
//
// Usage, with the app running on :3000
//   node scripts/check-tutor-layout.mjs        (or BASE=http://localhost:3001)

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT = process.env.SHOTS || '/tmp/tutor-shots'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: EXE })

for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1280, 900]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  // Which request failed, not just that one did. A bare "failed to load
  // resource" in the console names nothing, and the answer is usually the
  // sandbox proxy refusing an outbound font rather than anything we wrote.
  const failedRequests = []
  page.on('requestfailed', r => failedRequests.push(`${r.url()}  ${r.failure()?.errorText ?? ''}`))

  await page.goto(`${BASE}/dev/tutor-lesson`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/tutor-${name}-open.png`, fullPage: true })

  check(`${name}: the lesson renders`,
    (await page.locator('text=/twins/i').count()) > 0)

  // Walk the whole deck. A slide that only breaks on slide seven is the one
  // nobody finds, because nobody taps that far by hand.
  let worstOverflow = 0
  let slides = 0
  const dashHits = []

  for (let i = 0; i < 20; i++) {
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (overflow > worstOverflow) worstOverflow = overflow

    // A dash between two words, or standing alone as punctuation. Hyphenated
    // URLs and the like are not in a child's lesson, so anything found here is
    // the real thing.
    const found = await page.evaluate(() => {
      const t = document.body.innerText
      return (t.match(/\w[-–—]\w|\s[-–—]\s/g) ?? []).slice(0, 4)
    })
    dashHits.push(...found)

    // On a question slide the forward control is there but it is disabled and
    // reads "Pick an answer to continue", so answer it. This is worth spelling
    // out: the first version of this check matched that button on the word
    // continue, clicked a disabled button, gave up, and reported five happy
    // slides out of ten. A walk that stops at the first question is a check
    // that passes by not looking, and the question slides are the ones with the
    // most on them, which makes them the ones most likely to break at 390.
    const next = page.locator('button:visible', { hasText: /next|continue|start|go on|finish|done/i }).first()
    if (!(await next.count())) break

    const stuck = /pick an answer/i.test((await next.innerText().catch(() => '')) || '')
      || await next.isDisabled().catch(() => false)
    if (stuck) {
      // Whatever the options say. A generated deck's wording is unknown by
      // definition, so an option is defined as a visible button that is not
      // part of the furniture.
      const option = page.locator('button:visible').filter({
        hasNotText: /back|next|continue|start|go on|finish|done|quests|pick an answer|sound/i,
      }).first()
      if (!(await option.count())) break
      await option.click({ timeout: 2000 }).catch(() => {})
      await page.waitForTimeout(700)
    }
    // A short timeout on purpose. The default is thirty seconds, and a button
    // that is present but covered burns all thirty of them per slide, which
    // turns a two minute check into twenty and looks exactly like a hang. If it
    // is not clickable in two seconds the deck has ended, so stop.
    const clicked = await next.click({ timeout: 2000 }).then(() => true).catch(() => false)
    if (!clicked) break
    await page.waitForTimeout(420)
    slides++
    if (i === 3 || i === 7) await page.screenshot({ path: `${OUT}/tutor-${name}-slide${i}.png`, fullPage: true })
  }

  check(`${name}: nothing scrolls sideways`, worstOverflow <= 1, `${worstOverflow}px`)
  check(`${name}: the deck advances`, slides >= 4, `${slides} slides`)
  check(`${name}: no dashes in anything a child reads`, dashHits.length === 0, JSON.stringify(dashHits.slice(0, 4)))
  // Only requests to our own origin count. The sandbox this runs in refuses
  // outbound connections, so a Google font or a telemetry ping fails here and
  // would fail nowhere else, and a check that cries wolf every run gets
  // ignored on the run that matters.
  // ERR_ABORTED is the page being closed mid poll, not a broken request.
  const ourFailures = failedRequests.filter(u => u.startsWith(BASE) && !u.includes('ERR_ABORTED'))
  check(`${name}: nothing of ours failed to load`, ourFailures.length === 0, ourFailures[0] ?? '')
  const ourErrors = errors.filter(e => !/ERR_TUNNEL_CONNECTION_FAILED|ERR_PROXY|net::ERR_/.test(e))
  check(`${name}: no console errors`, ourErrors.length === 0, ourErrors[0] ?? '')
  if (failedRequests.length > ourFailures.length) {
    console.log(`      (${failedRequests.length - ourFailures.length} outbound request(s) blocked by the sandbox, ignored: ${failedRequests.find(u => !u.startsWith(BASE))})`)
  }

  await page.close()
}

await browser.close()
console.log(`\nScreenshots in ${OUT}`)
console.log(`${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
