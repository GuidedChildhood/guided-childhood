// Can a child get back to their quests from a printable?
//
// Justin, 11 August 2026, holding page 1 of 9 of Word Fishing with nothing on
// the screen but the pack: "nav back to quests from print."
//
// The single image sheets had been fixed on 9 August and came out of a window
// we write ourselves, with a way back on top. The PDF packs took a different
// door: window.open straight to the file, which lands a child in the browser's
// own viewer. That viewer is somebody else's screen, and inside the installed
// app there is no address bar and no tab to go back to, so a nine page pack was
// a nine page dead end. Nothing tested that door because nothing tested any of
// them but the one that was already fixed.
//
// The document functions are pure strings, so most of this needs no browser.
// The last block opens the real popup, because a document that reads correctly
// and does not open is not a way back.
//
// Usage, with the app running on :3000
//   node scripts/check-print-window.mjs        (or BASE=http://localhost:3001)

import { chromium } from 'playwright'
import { printSheetHtml, printPackHtml } from '../lib/kid/print-sheet.ts'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const PDF = '/printables/word-fishing-colourin.pdf'
const IMG = 'https://cdn.example/sheet.png'

// ── EVERY DOOR CARRIES THE WAY BACK, which is the whole complaint ───────────
for (const [what, html] of [
  ['a single sheet', printSheetHtml(IMG, 'Word Fishing')],
  ['a built pack', printPackHtml(PDF, 'Word Fishing')],
]) {
  check(`${what} has a way back to quests`, /My quests/.test(html))
  check(`${what} closes the window rather than guessing a route`,
    /id="gc-back"[^>]*onclick="window\.close\(\)"/.test(html))
  check(`${what} says whose sheet it is`, /<title>Word Fishing<\/title>/.test(html))
  // A toolbar that printed would be a worse bug than the one this fixes.
  check(`${what} keeps its own furniture off the paper`,
    /@media print\{[^}]*\.bar[^}]*display:none/.test(html))
  // The words a child reads, and only those. The stylesheet has to come out
  // first or every font-family and every -webkit- prefix reads as a dash.
  const copy = (html.replace(/<style>[\s\S]*?<\/style>/g, '').match(/>([^<>]+)</g) || []).join(' ')
  check(`${what} has no dashes in the copy`, !/[-–—]/.test(copy),
    (copy.match(/.{0,20}[-–—].{0,20}/) || [''])[0])
}

// ── THE PACK, which is the one that was wrong ───────────────────────────────
const pack = printPackHtml(PDF, 'Word Fishing')
check('the pack is framed in a window we own, not handed away',
  /<iframe[^>]+class="pack"[^>]+src="\/printables\/word-fishing-colourin\.pdf#/.test(pack))
// Asks the viewer to fit the page across the frame. Only that the request is
// made can be checked here: the viewer belongs to the browser, and the headless
// Chromium this runs in ignores the fragment even at top level, so whether it
// is honoured is a question for a real phone.
check('and it asks the viewer to fit the page across the screen',
  /#view=FitH/.test(pack))
// A frame is the one thing here a phone is allowed to refuse. Some mobile
// browsers show page one of a framed PDF and nothing else, and a child cannot
// be left holding one page of nine, so the way out sits in the bar from the
// start rather than appearing after something has gone wrong.
check('and there is still a way to the whole pack if the frame refuses it',
  /id="gc-open"[^>]+href="\/printables\/word-fishing-colourin\.pdf"/.test(pack))
check('and the child is told the rest of it is there', /every page of this one is here/i.test(pack))
// A percentage height would resolve against a body with no height of its own.
check('the frame is given a real height', /height:calc\(100vh/.test(pack))

// ── AND NOTHING CAN BE INJECTED THROUGH A TITLE ─────────────────────────────
const nasty = printPackHtml('/x.pdf" onload="alert(1)', '<script>alert(1)</script>')
check('a hostile url cannot break out of its attribute', !/onload="alert/.test(nasty))
check('and a hostile title cannot become a tag', !/<script>alert/.test(nasty))

// ── IT ACTUALLY OPENS ───────────────────────────────────────────────────────
const browser = await chromium.launch({ executablePath: EXE })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await ctx.newPage()
await page.goto(`${BASE}/dev/printable-covers`, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const [popup] = await Promise.all([
  page.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
  page.click('#gc-print-hero'),
])
check('tapping Print it opens a window', popup !== null)
if (popup) {
  await popup.waitForTimeout(900)
  check('and the way back is on it', await popup.locator('#gc-back').count() === 1)
  check('and it is a real tappable size on a phone',
    (await popup.locator('#gc-back').boundingBox())?.height >= 40,
    `${Math.round((await popup.locator('#gc-back').boundingBox())?.height ?? 0)}px`)
  check('and the pack is in the window', await popup.locator('#gc-pack').count() === 1)
  check('and the pack fills the screen under the bar',
    ((await popup.locator('#gc-pack').boundingBox())?.height ?? 0) > 500,
    `${Math.round((await popup.locator('#gc-pack').boundingBox())?.height ?? 0)}px`)
  check('and the way out of the frame is reachable too',
    await popup.locator('#gc-open').count() === 1)
  // The bar sits at the top of a 390px phone without wrapping to two rows.
  const barH = (await popup.locator('.bar').boundingBox())?.height ?? 0
  check('and the bar is one row on a phone', barH < 80, `${Math.round(barH)}px`)
}

// ── THE COVERS, which is the other half of what he asked for ────────────────
//
// "Make sure all printables are higher quality." Every cover was rendered 794
// square out of a page that is A4 portrait, so a third of the sheet was gone
// before the file was saved, and the card then cropped it a second time. What
// survived both cuts was a title and the top inch of a picture.
const covers = await page.evaluate(() => [...document.querySelectorAll('.gc-cover img')].map(i => {
  const box = i.getBoundingClientRect()
  return { w: box.width, h: box.height, nw: i.naturalWidth, nh: i.naturalHeight, fit: getComputedStyle(i).objectFit }
}))
check('every cover is on the page', covers.length >= 5, String(covers.length))
check('and none of them is cropped', covers.every(c => c.fit === 'contain'),
  [...new Set(covers.map(c => c.fit))].join(', '))
check('and every tile is the shape of a sheet of paper rather than a square',
  covers.every(c => c.h / c.w > 1.3), covers.map(c => (c.h / c.w).toFixed(2)).join(' '))
const loaded = covers.filter(c => c.nw > 0)
check('and the artwork loads', loaded.length === covers.length, `${loaded.length} of ${covers.length}`)
// naturalWidth here is what next/image SERVED, not what is on disk: it resizes
// to the tile, so this can only prove the cover is not being upscaled into its
// own frame. Whether the file behind it is a whole A4 page at a decent size is
// the source question, and scripts/build-printable-previews.py --check is what
// asks it, of the files rather than of one rendering of them.
// Measured against the LAYOUT size rather than the painted one. globals.css
// puts zoom 1.07 on the body, so every box in the app reports 7 percent larger
// than the pixels next/image was asked for, and comparing the two directly
// would fail every image in the product rather than a cover.
check('and nothing is stretched up to fill its tile',
  loaded.every(c => c.nh >= Math.floor(c.h / 1.07) - 1),
  loaded.map(c => `${c.nh} served for ${Math.round(c.h / 1.07)}`).join(', '))
check('and every cover is the shape of a whole A4 page, not a square crop',
  loaded.every(c => Math.abs(c.nh / c.nw - 843 / 596) < 0.03),
  loaded.map(c => `${c.nw}x${c.nh}`).join(' '))

await browser.close()
console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
