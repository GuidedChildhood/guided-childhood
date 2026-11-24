// Captures the REAL schools screens for the teacher start film (cuts/schools-teacher-start.json)
// at phone width and 5x, the way tools/capture.mjs does. Run against a LOCAL schools
// dev server with a made up code (never a real school's):
//   SCHOOLS_ACCESS_CODES=demo-school-code SCHOOLS_ACCESS_SECRET=local-secret npx next dev -p 3100   (in schools/)
//   DEV=http://localhost:3100 CHROME=/path/to/chromium node tools/capture-schools.mjs
// It also prints where the lines the film highlights sit, in screen px.
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '../../../node_modules/playwright/index.mjs')
const DEV = process.env.DEV || 'http://localhost:3100'
const CODE = process.env.CODE || 'demo-school-code'
const out = new URL('../assets/captures/schools/', import.meta.url).pathname
const browser = await chromium.launch({ executablePath: process.env.CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: Number(process.env.DPR || 5) })
const p = await ctx.newPage()
const hide = () => p.addStyleTag({ content: 'nextjs-portal{display:none!important} *{caret-color:transparent!important}' })
const box = async (name, loc) => { const b = await loc.first().boundingBox(); console.log(`     ${name.padEnd(14)} x ${Math.round(b.x)} y ${Math.round(b.y)} w ${Math.round(b.width)} h ${Math.round(b.height)}`) }
const shot = async (name, h) => { await p.mouse.move(389, 843); await p.waitForTimeout(1200); await p.screenshot({ path: `${out}${name}.png`, clip: { x: 0, y: 0, width: 390, height: h } }); console.log(`ok   ${name}`) }

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

// 4. The classroom player, slide 1, the teacher script open.
await p.goto(`${DEV}${href}`, { waitUntil: 'networkidle' }); await hide(); await p.waitForTimeout(3000)
await box('script head', p.getByText('Teacher script', { exact: false }))
await shot('teach-slide1', 844)
await browser.close()
