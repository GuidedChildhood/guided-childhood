// Is the Planet Friends poster actually big enough for the child holding it?
//
// Justin, 11 August 2026: "this printable is not good enough, needs to be
// bigger, and images of exact Planet Friends bigger, and this is for under 10s
// I would say."
//
// A screenshot cannot answer that question. The sheet is laid out in
// millimetres and printed at a width no screen uses, so the only honest test is
// a real PDF at real A4 and a ruler held against what came out of it. That is
// what this does: prints the fixture, counts the pages, and measures the room
// each Planet Friend actually gets in millimetres.
//
// It also guards the thing that made the sheet bad in the first place, which
// was not one bad number but words. Three lines of adult small print under a
// picture is what squeezed the picture, so the copy checks below are load
// bearing, not tidiness.
//
// Usage, with the app running on :3000
//   node scripts/check-friends-poster.mjs        (or BASE=http://localhost:3001)

import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

// A4 at 96dpi, with no @page margin, because the sheet asks for margin 0 and
// paints its own. This is the width the printer lays the page out at, which is
// not any screen width, which is the whole reason this file exists.
const PAGE_W = 794
const PAGE_H = 1123
const MM = 96 / 25.4        // css px per millimetre
const px = mm => mm * MM
const mm = p => p / MM

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: PAGE_W, height: PAGE_H } })

// MEASURE IN PRINT MEDIA, and this is the whole reason the first run of this
// file reported a 184mm wide sheet on 210mm paper.
//
// Two zooms sit between the layout and the screen. globals.css puts zoom 1.07
// on the body, and the sheet zooms itself down again in steps so an A4 fits
// across a phone. Both are inside @media screen, so neither one reaches the
// printer, and both of them move what getBoundingClientRect hands back. A ruler
// held against the screen is therefore measuring the preview, not the paper.
//
// It also makes the two numbers comparable: scrollHeight is layout pixels and
// ignores zoom, getBoundingClientRect does not, so on screen the overflow check
// was comparing a zoomed box against an unzoomed content height and failing a
// sheet that fits perfectly well.
await page.emulateMedia({ media: 'print' })

/**
 * Put real character art in the boxes, because the CDN is not reachable here.
 *
 * A picture that failed to load measures zero however much room the layout gave
 * it, so without this the one thing Justin actually asked about cannot be
 * measured at all. The stand in is a REAL Planet Friend, the vendored Pebble the
 * star chart already prints, rather than a square drawn here: aspect ratio is
 * the whole question when a picture is told to fit inside a box. These are drawn
 * tall, 656 by 859, so they cap on the height of the box and never on its width,
 * and a square stub would have measured a fit the real art never gets.
 *
 * Swapped on the element rather than intercepted on the wire. Route interception
 * left the requests failing in this sandbox, and same origin art out of /public
 * simply loads.
 */
const withRealArt = () => page.evaluate(() => Promise.all(
  [...document.querySelectorAll('.fp-card img')].map(img => new Promise(done => {
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
    img.src = '/printables/friends/pebble.png'
  })),
))

/** Print, and count the pages that actually came out. */
async function pdfPages() {
  // preferCSSPageSize so the component's own @page rule decides the paper.
  const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true })
  return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
}

/**
 * How much room each Planet Friend gets, in millimetres.
 *
 * The WRAPPER is measured rather than the img, deliberately. The art is on the
 * CDN and not every environment can reach it, and a picture that failed to load
 * measures zero however much space the layout gave it. The wrapper is the space
 * the layout gave it, which is the number that decides how big the character
 * prints.
 */
const artBoxes = () => page.evaluate(() =>
  [...document.querySelectorAll('.fp-card img')].map(img => {
    const box = img.parentElement.getBoundingClientRect()
    return { w: box.width, h: box.height, drawn: img.getBoundingClientRect().height }
  }))

const sheetBox = () => page.evaluate(() => {
  const el = document.querySelector('.fp-sheet')
  const r = el.getBoundingClientRect()
  return { w: r.width, h: r.height, scroll: el.scrollHeight }
})

const sheetText = () => page.evaluate(() => document.querySelector('.fp-sheet').innerText)

async function load(days) {
  await page.goto(`${BASE}/dev/friends-poster?days=${days}&name=Teo`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
}

// ── NOTHING EARNED YET, which is the sheet most families print first ────────
await load(0)

const box = await sheetBox()
check('the sheet is one A4 wide', Math.abs(box.w - px(210)) < 2, `${mm(box.w).toFixed(1)}mm`)
check('and exactly one A4 tall', Math.abs(box.h - px(297)) < 2, `${mm(box.h).toFixed(1)}mm`)
// A height, not a min height. If anything inside grows past the paper this is
// where it shows up, before it becomes a second sheet at somebody's printer.
check('and nothing inside it overflows the paper',
  box.scroll <= box.h + 2, `content ${mm(box.scroll).toFixed(1)}mm in ${mm(box.h).toFixed(1)}mm`)

check('one page of paper, not two', await pdfPages() === 1)

// ── THE ACTUAL COMPLAINT ────────────────────────────────────────────────────
//
// The old sheet gave every character a fixed 30mm square, which is 113px here.
// 30mm is a matchbox. A child cutting a character out and sticking it on a wall
// needs something nearer the size of their hand, and a child colouring one in
// needs room to stay inside the lines.
const art = await artBoxes()
check('all five Planet Friends are on the sheet', art.length === 5, String(art.length))
const smallest = Math.min(...art.map(a => a.h))
check('every Planet Friend gets at least 40mm of height',
  smallest >= px(40), `smallest ${mm(smallest).toFixed(1)}mm`)
check('which is a clear step up from the 30mm it used to be',
  smallest >= px(30) * 1.3, `${(mm(smallest) / 30).toFixed(2)}x taller, ${((mm(smallest) / 30) ** 2).toFixed(2)}x the area`)
check('and at least 60mm of width to be drawn in',
  Math.min(...art.map(a => a.w)) >= px(60), `${mm(Math.min(...art.map(a => a.w))).toFixed(1)}mm`)

// The room is one thing, filling it is another. maxWidth and maxHeight only cap
// a picture, so a character that came out smaller than its box would pass every
// check above and still print small.
await withRealArt()
const drawn = Math.min(...(await artBoxes()).map(a => a.drawn))
check('and the character actually fills the room it is given',
  drawn >= smallest - 1, `drawn ${mm(drawn).toFixed(1)}mm in ${mm(smallest).toFixed(1)}mm`)
check('which is a real Planet Friend over 40mm on the paper',
  drawn >= px(40), `${mm(drawn).toFixed(1)}mm`)

// Same size every one of them. A cut out sheet where the characters come out at
// different sizes reads as a jumble rather than a set.
const spread = Math.max(...art.map(a => a.h)) - smallest
check('and they are all the same size as each other', spread < 1, `${mm(spread).toFixed(2)}mm apart`)

// ── UNDER 10s, which is the other half of what he said ──────────────────────
const t0 = await sheetText()
check('a locked Friend says how far off it is', /2 more full days/i.test(t0), '')
check('and what to do about it today', /colour me in/i.test(t0))
// "Costs 22 full days" over "22 MORE FULL DAYS" was the same fact twice, in an
// accountant's voice, taking two of the four lines that squeezed the picture.
check('and never prices itself like an invoice', !/costs \d+/i.test(t0))
check('the how to is on the sheet, not just in the parent app',
  /cut out/i.test(t0) && /stick up/i.test(t0))
check('and the day count is there to be proud of', /0\s*full days done/i.test(t0.replace(/\n/g, ' ')))

// ── HOUSE RULES ─────────────────────────────────────────────────────────────
check('no dashes anywhere in the copy', !/[-–—]/.test(t0), (t0.match(/.{0,24}[-–—].{0,24}/) || [''])[0])

// ── PART WAY THROUGH ────────────────────────────────────────────────────────
await load(22)
const t22 = await sheetText()
check('three home at 22 days', (t22.match(/Home with you/g) || []).length === 3,
  String((t22.match(/Home with you/g) || []).length))
check('an earned Friend says what it is for', /helps with/i.test(t22))
check('and the two still coming say how far', /16 more full days/i.test(t22) && /36 more full days/i.test(t22))
check('still one page with three pictures swapped for colour', await pdfPages() === 1)
const art22 = await artBoxes()
check('and the pictures are still the full size',
  Math.min(...art22.map(a => a.h)) >= px(40), `${mm(Math.min(...art22.map(a => a.h))).toFixed(1)}mm`)
check('no dashes at 22 days', !/[-–—]/.test(t22))

// ── ONE DAY OFF, the singular ───────────────────────────────────────────────
await load(1)
const t1 = await sheetText()
check('one day left is a day, not days', /1 more full day\b/i.test(t1))
check('and one day done is a day too', /1\s*full day done/i.test(t1.replace(/\n/g, ' ')))

// ── THE WHOLE FAMILY HOME ───────────────────────────────────────────────────
await load(58)
const t58 = await sheetText()
check('all five home at 58 days', (t58.match(/Home with you/g) || []).length === 5)
check('and the sheet says so', /nobody else has done this but you/i.test(t58))
check('with nothing left asking to be coloured in', !/colour me in/i.test(t58))
check('still one page', await pdfPages() === 1)
const b58 = await sheetBox()
check('and still one A4 with the longest words on it',
  b58.scroll <= b58.h + 2, `content ${mm(b58.scroll).toFixed(1)}mm`)
check('no dashes at 58 days', !/[-–—]/.test(t58))

// ── THE LONGEST NAME A PARENT MIGHT TYPE ────────────────────────────────────
//
// The title is the biggest thing on the sheet and the one input a parent
// controls, so it is the one thing that can push the header down into the grid.
// It did: "Alexandrina's Planet Friends" wrapped to two lines and took every
// Planet Friend from 42.6mm to 37.5mm, so a child with a long name printed
// smaller characters than a child with a short one.
const baseline = Math.min(...art.map(a => a.h))
for (const long of ['Alexandrina', 'Konstantina Wilhelmina', 'A']) {
  await page.goto(`${BASE}/dev/friends-poster?days=22&name=${encodeURIComponent(long)}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const bLong = await sheetBox()
  check(`"${long}" does not push the sheet off the paper`,
    bLong.scroll <= bLong.h + 2, `content ${mm(bLong.scroll).toFixed(1)}mm`)
  const artLong = await artBoxes()
  const smallestLong = Math.min(...artLong.map(a => a.h))
  // Not "still big enough" but "exactly the same". The name a parent typed must
  // not be able to change how big their child's Planet Friends print.
  check(`and every child gets the same size Friends whatever they are called`,
    Math.abs(smallestLong - baseline) < 1,
    `${mm(smallestLong).toFixed(1)}mm against ${mm(baseline).toFixed(1)}mm`)
  // Two ways a pinned title can go wrong, and both are silent. Sideways it
  // ellipsises a child's own name off the poster. Upwards it clips the tops of
  // the letters against the hidden overflow, which is what a 17.5mm line box
  // did to Nunito at the 15mm step: 71px of ink into 66px of room.
  const fit = await page.evaluate(() => {
    const h = document.querySelector('.fp-sheet h1')
    return { overW: h.scrollWidth - h.clientWidth, overH: h.scrollHeight - h.clientHeight }
  })
  check(`and the whole title fits on one line, uncut`,
    fit.overW <= 1 && fit.overH <= 1, `over by ${fit.overW}px across, ${fit.overH}px down`)
}

await browser.close()
console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
