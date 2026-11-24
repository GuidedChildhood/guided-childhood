// Captures the REAL schools screens for the teacher start film
// (cuts/schools-teacher-start*.json) at 5x, the way tools/capture.mjs does. Run
// against a LOCAL schools dev server with a made up code (never a real school's):
//   SCHOOLS_ACCESS_CODES=demo-school-code SCHOOLS_ACCESS_SECRET=local-secret npx next dev -p 3100   (in schools/)
//   DEV=http://localhost:3100 CHROME=/path/to/chromium node tools/capture-schools.mjs
// It also prints where the lines the film highlights sit, in CSS px of each
// capture, for the cut's glow and tap boxes.
//
// Version 3 (24 November 2026, plans/2026-11-24-teacher-film-walkthrough-research.md)
// adds: the lesson page hero (phone), the classroom player and the ks2-08
// safeguarding screen at 1280 by 800 (they sit in a board frame in the film),
// print Sheets 1, 3, 5 and 6 as A4 paper (print media, 794 CSS px wide), and the
// RSHE mapping page at laptop width. The safeguarding lead is made up and lives
// in this browser's localStorage only, the way the Hub stores it.
//
// Sheet 6 is filmed only down to its Ask at tea box (the film fades the rest of
// the sheet), and the stand in database has no home code, so the home code block
// is never in a frame (plans/2026-11-24-school-home-bridge-audit.md, finding 1).
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '../../../node_modules/playwright/index.mjs')
const DEV = process.env.DEV || 'http://localhost:3100'
const CODE = process.env.CODE || 'demo-school-code'
const DPR = Number(process.env.DPR || 5)
const out = new URL('../assets/captures/schools/', import.meta.url).pathname
const browser = await chromium.launch({ executablePath: process.env.CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR })
await ctx.addInitScript(() => {
  try { localStorage.setItem('gc.schools.your-school', JSON.stringify({ leadName: 'Mrs Hale', leadWhere: 'the office by the hall', deputyName: 'Mr Reed', reportRoute: '', policyTitle: '' })) } catch {}
})
const p = await ctx.newPage()
const hide = () => p.addStyleTag({ content: 'nextjs-portal{display:none!important} *{caret-color:transparent!important}' })
const box = async (name, loc, oy = 0) => { const b = await loc.first().boundingBox(); console.log(`     ${name.padEnd(16)} x ${Math.round(b.x)} y ${Math.round(b.y - oy)} w ${Math.round(b.width)} h ${Math.round(b.height)}`) }
const shot = async (name, h, w = 390) => { await p.mouse.move(w - 1, 2); await p.waitForTimeout(1200); await p.screenshot({ path: `${out}${name}.png`, clip: { x: 0, y: 0, width: w, height: h }, fullPage: true }); console.log(`ok   ${name}`) }

// 1. The code door, with the made up code typed in.
await p.goto(`${DEV}/unlock`, { waitUntil: 'networkidle' }); await hide()
await p.fill('#code', CODE)
await box('code field', p.locator('#code')); await box('open button', p.locator('button[type=submit]'))
await shot('unlock-code', 760)
await p.click('button[type=submit]'); await p.waitForURL(/\/start/); await p.waitForLoadState('networkidle'); await hide()

// 2. Which year.
await box('ks2 card', p.locator('a[href="/start?stage=KS2"]'))
await shot('start-year', 700)

// 3. The first lesson card.
await p.goto(`${DEV}/start?stage=KS2`, { waitUntil: 'networkidle' }); await hide()
await box('lesson title', p.locator('h2, h3').filter({ hasText: 'Screen routines' }))
await box('teach button', p.locator('a.btn-gold'))
await shot('start-lesson', 800)
const href = await p.locator('a.btn-gold').first().getAttribute('href')

// 4. The classroom player, slide 1, the teacher script open (v2's phone width still).
await p.goto(`${DEV}${href}`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(3000)
await box('script head', p.getByText('Teacher script', { exact: false }))
await shot('teach-slide1', 844)

// 5. The lesson page hero: title, the minutes and slides line, Teach this lesson (v3).
await p.goto(`${DEV}/lesson/ks2-04-screen-routines`, { waitUntil: 'networkidle' }); await hide()
await box('lesson h1', p.locator('h1'))
await box('minutes line', p.getByText(/\d+ minutes · \d+ slides/i))
await box('teach button', p.getByText('Teach this lesson'))
await shot('lesson-hero', 844)

// 6. The player and the safeguarding screen at a classroom display's shape (v3, board frame).
await p.setViewportSize({ width: 1280, height: 800 })
await p.goto(`${DEV}/teach/ks2-04-screen-routines`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(7000)
await box('script first', p.getByText('Settle everyone with this slide up', { exact: false }))
await shot('board-teach-slide1', 800, 1280)
await p.goto(`${DEV}/teach/ks2-08-kind-safe-online`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(3000)
await box('lead line', p.getByText('Mrs Hale, the office by the hall'))
await box('lead label', p.getByText('Your safeguarding lead'))
await shot('board-before-slide1', 800, 1280)

// 7. The RSHE mapping, open to read, at laptop width (v3, the lead's shot).
await p.goto(`${DEV}/hub/rshe-mapping`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(1500)
await box('mapping h1', p.locator('h1'))
await box('first taught in', p.getByText('Taught in').first())
await shot('laptop-rshe-mapping', 1400, 1280)

// 8. The paper pack as printed: A4 is 794 CSS px wide at 96 dpi (v3).
await p.setViewportSize({ width: 794, height: 1123 })
await p.emulateMedia({ media: 'print' })
await p.goto(`${DEV}/print/ks2-04-screen-routines`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(2000)
const sheets = p.locator('section')
const n = await sheets.count()
const want = { 'teacher one pager': 'print-sheet1', 'worksheet': 'print-sheet3', 'start and end of lesson': 'print-sheet5', 'goes home': 'print-sheet6' }
for (let i = 0; i < n; i++) {
  const s = sheets.nth(i); const t = (await s.innerText()).toLowerCase()
  const hit = Object.entries(want).find(([k]) => t.includes(k))
  if (!hit) continue
  const name = hit[1]; delete want[hit[0]]
  const b = await s.boundingBox()
  if (name === 'print-sheet6') {
    console.log('     sheet x', Math.round(b.x)); await box('tea box', s.getByText('Ask at tea').locator('..'), b.y)
    await box('tea question', s.getByText('Can you teach me the cool down lap?'), b.y)
    await box('passport box', s.getByText('The passport').locator('..'), b.y)
  }
  await s.screenshot({ path: `${out}${name}.png` }); console.log(`ok   ${name} ${Math.round(b.width)} by ${Math.round(b.height)}`)
}
if (Object.keys(want).length) console.log('MISSING sheets:', Object.keys(want))
await browser.close()
