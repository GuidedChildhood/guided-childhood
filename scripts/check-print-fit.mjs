// Does the game pack actually print one sheet per page?
//
// Justin, 10 August 2026, with a photo of the iOS print sheet: "this print pack
// has messy pages that don't fit." Page 4 of 7 was nearly empty.
//
// Nothing we had could have caught that. Screenshots are taken at a screen
// width, and a printer lays the page out at about 718px, where text rewraps and
// a card grid loses a column. So this asks the only question that matters and
// asks it of a real PDF: how many pages came out, for how many sheets.
//
// Usage, with the app running on :3000
//   node scripts/check-print-fit.mjs            (or BASE=http://localhost:3001)
//
// The fixture is /dev/craft-anchors, which renders the real component on a
// route that is not behind auth.

import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

// A4 less the 10mm @page margin the pack asks for, in CSS px at 96dpi. The
// viewport is set to this so what is on screen is what the printer will see.
const PAGE_W = 718
const PAGE_H = 1047

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: PAGE_W, height: PAGE_H } })
await page.goto(`${BASE}/dev/craft-anchors`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

/** Print, and count the pages that actually came out. */
async function pages() {
  // preferCSSPageSize so the component's own @page rule decides the paper.
  // Without it Playwright prints a full bleed A4 of its own and the count is
  // not the one a family would get.
  const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true })
  return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
}

const sheetCount = () => page.locator('.craft-sheet').count()
const clickText = re => page.evaluate(
  pattern => {
    const btn = [...document.querySelectorAll('button')].find(b => new RegExp(pattern, 'i').test((b.textContent || '').trim()))
    if (btn) btn.click()
    return !!btn
  },
  re,
)

// ── One age band at a time, which is the everyday print ─────────────────────
for (const band of ['4 to 7', '8 to 10', '11 to 13', 'The whole family']) {
  await clickText(`^${band}$`)
  await page.waitForTimeout(300)
  await clickText('^print this pack')
  await page.waitForTimeout(300)
  const [n, p] = [await sheetCount(), await pages()]
  check(`${band}: one page per sheet`, p === n, `${p} pages for ${n} sheets`)
}

// ── The whole offline pack, which is where it went wrong ────────────────────
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await clickText('print the whole')
await page.waitForTimeout(1200)
const all = await sheetCount()
const allPages = await pages()
check('whole pack: one page per sheet', allPages === all, `${allPages} pages for ${all} sheets`)
check('whole pack is the whole pack', all >= 13, `${all} sheets`)

// ── The shrink is only used where it is needed, and never past the floor ────
const fits = await page.evaluate(() =>
  [...document.querySelectorAll('.craft-sheet')].map(el => Number(el.style.getPropertyValue('--fit') || 1)))
check('sheets that fit are left alone', fits.some(f => f === 1), `${fits.filter(f => f === 1).length} of ${fits.length} untouched`)
check('nothing is shrunk below readable', fits.every(f => f >= 0.6), `smallest ${Math.min(...fits)}`)

// A sheet is scaled DOWN or not at all. Anything above 1 would be a bug in the
// measuring, and would print off the edge of the paper.
check('nothing is scaled up', fits.every(f => f <= 1))

// ── THE PASSPORT ZINE: ONE SHEET IN, ONE PAGE OUT ───────────────────────────
//
// Justin, 16 September 2026: the printed passport "needs to be premium and
// ability to print and put together". It could not be printed at all, and it
// took a real PDF to see it: the A4 sheet came out at 317.8mm by 224.7mm and
// spilled onto two pages, because the dashboard shell's 1.07 zoom applies on
// paper as well as on screen. Every number here is measured off the page in
// print media, not read off the source.
//
// /ref-passport-zine renders the real component with made up numbers and now
// carries the real route's print block, which is what makes it measurable
// without a login.
const zine = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await zine.goto(`${BASE}/ref-passport-zine`, { waitUntil: 'networkidle' })
await zine.emulateMedia({ media: 'print' })
await zine.waitForTimeout(800)

const sheet = await zine.evaluate(() => {
  const el = document.querySelector('section[aria-label*="passport"]')
  if (!el) return null
  const r = el.getBoundingClientRect()
  const mm = px => +(px * (25.4 / 96)).toFixed(2)
  return { w: mm(r.width), h: mm(r.height), bodyZoom: String(getComputedStyle(document.body).zoom) }
})
if (!sheet) {
  check('the passport sheet renders at all', false, 'no sheet found on /ref-passport-zine')
} else {
  // A4 landscape, to a tenth of a millimetre. The margin is zero on purpose:
  // a zine folds on the paper's own quarters, so the sheet IS the paper and
  // the safe area is held inside the panels.
  check('passport sheet is a true A4 landscape',
    Math.abs(sheet.w - 297) < 0.5 && Math.abs(sheet.h - 210) < 0.5,
    `${sheet.w} by ${sheet.h}mm`)
  check('the 1.07 zoom is off on paper', sheet.bodyZoom === '1', `body zoom ${sheet.bodyZoom}`)
}

const zinePdf = await zine.pdf({ printBackground: true, preferCSSPageSize: true })
const zinePages = (zinePdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
check('one sheet in, one page out', zinePages === 1, `${zinePages} pages`)

await browser.close()
console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
