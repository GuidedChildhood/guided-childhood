// Does every lesson's paper pack print one sheet per page?
//
// The pack (schools/app/print/[module]/page.tsx) is a run of A4 sheets, each a
// PrintSheet of at least 268mm. A sheet whose words run past the printable
// height of the page spills onto a second sheet of paper, the footer lands
// alone at the top of it, and every sheet after it is one page out. On 9
// October 2026 nine of the 34 packs did that (ks1-02, ks1-03, ks1-33, ks3-22,
// ks3-24, ks3-34, ks4-17, ks4-28, ks4-29), and four more parent notes did once
// the QR block was printed as production prints it, and nothing in CI could
// have said so: whether a paragraph wraps to a fourth line is decided by the
// browser's font metrics and nowhere else.
//
// So this asks a real PDF, the same way check-print-fit.mjs asks it of the
// parents app's game pack: print the pack, count the pages, compare with the
// sheets. It also reads how much room each sheet's words leave, so a sheet
// that fits by four pixels is visible before a lesson edit tips it over.
//
// IT IS NOT IN CI, AND WHAT IS. It needs a browser and the schools app, and
// the wiring job has neither. CI runs check-print-kit.mjs instead, which reads
// scripts/print-pack-fit-baseline.json: the room this script measured on each
// growing sheet, beside the characters that sheet printed. A lesson edit that
// adds more words than the measured room can take, or any change to the kit
// or the pack page, fails there and points here. Then:
//
//   node scripts/check-print-pack-fit.mjs --write-baseline
//
// which measures every pack again and, only if every one fits, writes the new
// record to commit. The record is always measured as a school that has typed
// its safeguarding lead (LEAD, below), the taller of the two teacher sheets.
//
// SETUP, once per checkout (no real database keys are needed):
//
//   schools/.env.local
//     NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54399
//     SUPABASE_SERVICE_ROLE_KEY=local
//     SCHOOLS_ACCESS_CODES=localtest
//     SCHOOLS_ACCESS_SECRET=any-local-secret
//   npm --prefix schools run dev            (the schools app on :3100)
//
// This script then serves content/modules/*.json on :54399 as
// schools.school_lessons itself (a stand in for PostgREST, enough for the pack
// page's one read), each row with a home code as every production lesson has
// (migration 230), because the parent note prints its QR block only when
// there is one. If something already answers on that port it is used instead.
// The cookie for the school access gate is minted from the two SCHOOLS_ values.
//
// Usage
//   node scripts/check-print-pack-fit.mjs                 every module in content/modules
//   node scripts/check-print-pack-fit.mjs ks4-17 ks1-02   just these (prefix match)
//   node scripts/check-print-pack-fit.mjs --write-baseline
//   BASE=http://localhost:3100 CHROME=/path/to/chrome     to point elsewhere
//   LEAD=1      as a school that has typed its safeguarding lead
//   VERBOSE=1   every sheet's spare px, not just the tightest
//
// The default browser is the system Chrome on a Mac; anywhere else, CHROME=
// a Chromium (Playwright's own, after `npx playwright install chromium`).

import { chromium } from 'playwright'
import { createHmac } from 'node:crypto'
import { createServer } from 'node:http'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { BASELINE, layoutHash, packWords } from './lib/print-pack-words.mjs'

const BASE = process.env.BASE || 'http://localhost:3100'
const EXE = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const args = process.argv.slice(2)
const WRITE = args.includes('--write-baseline')
const LEAD = WRITE || !!process.env.LEAD

// The printable area of the pack's own @page rule (schools/app/schools.css:
// A4, 12mm top and bottom, 14mm each side), in CSS px at 96dpi. The viewport
// is the printable width, so the heights read on screen are the ones the
// printer lays out.
const PX_PER_MM = 96 / 25.4
const PAGE_W = Math.floor((210 - 28) * PX_PER_MM)
const PAGE_H = Math.floor((297 - 24) * PX_PER_MM)

function env(name) {
  if (process.env[name]) return process.env[name]
  const file = 'schools/.env.local'
  if (!existsSync(file)) return ''
  const line = readFileSync(file, 'utf8').split('\n').find(l => l.startsWith(`${name}=`))
  return line ? line.slice(name.length + 1).trim() : ''
}

// Mirrors issueToken in schools/lib/access.ts: code|expires|hmac.
const secret = env('SCHOOLS_ACCESS_SECRET')
const code = env('SCHOOLS_ACCESS_CODES').split(',')[0]?.trim().toLowerCase()
if (!secret || !code) {
  console.error('check-print-pack-fit: set SCHOOLS_ACCESS_SECRET and SCHOOLS_ACCESS_CODES (env or schools/.env.local) to pass the gate. Setup is in the header of this file.')
  process.exit(2)
}
const payload = `${code}|${Date.now() + 86_400_000}`
const token = `${payload}|${createHmac('sha256', secret).update(payload).digest('hex')}`

const files = readdirSync('content/modules').filter(f => f.endsWith('.json')).sort()
const lessons = Object.fromEntries(files.map(f => {
  const l = JSON.parse(readFileSync(`content/modules/${f}`, 'utf8'))
  return [l.module_id, l]
}))
const wanted = args.filter(a => !a.startsWith('--'))
const modules = Object.keys(lessons).filter(m => !wanted.length || wanted.some(w => m.startsWith(w)))

// The stand in for schools.school_lessons, on the port schools/.env.local
// points the app at.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const rows = Object.values(lessons).map((l, i) => {
  const { row, ...rest } = l
  const homeCode = 'HOME-' + [0, 1, 2, 3].map(k => ALPHABET[(i * 7 + k * 11) % 32]).join('')
  return { ...row, ...rest, home_code: homeCode }
})
let standIn = null
const dbUrl = env('NEXT_PUBLIC_SUPABASE_URL')
if (/^http:\/\/(127\.0\.0\.1|localhost):\d+/.test(dbUrl)) {
  const port = Number(new URL(dbUrl).port)
  standIn = createServer((req, res) => {
    const u = new URL(req.url, 'http://x')
    let out = u.pathname.endsWith('/school_lessons') ? rows : []
    for (const [k, v] of u.searchParams) {
      const eq = /^eq\.(.*)$/.exec(v)
      if (eq && !['select', 'order', 'limit', 'offset'].includes(k)) out = out.filter(r => String(r[k]) === eq[1])
    }
    const single = (req.headers.accept || '').includes('vnd.pgrst.object')
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(single ? (out[0] ?? null) : out))
  })
  await new Promise(done => {
    standIn.once('error', () => { standIn = null; done() }) // already served
    standIn.listen(port, '127.0.0.1', done)
  })
}

const browser = await chromium.launch({ executablePath: EXE })
const context = await browser.newContext({ viewport: { width: PAGE_W, height: PAGE_H } })
await context.addCookies([{ name: 'gc_schools_access', value: token, url: BASE }])
// LEAD prints as a school that has typed its safeguarding lead on the Hub
// (shared/schools-your-school.ts): the teacher one pager of every flagged
// lesson then carries one more paragraph, and it must still fit. A full,
// ordinary entry, not the field maximums.
if (LEAD) {
  await context.addInitScript(() => localStorage.setItem('gc.schools.your-school', JSON.stringify({
    leadName: 'Mrs Adebayo-Richardson', leadWhere: 'the safeguarding office beside the main reception',
    deputyName: 'Mr Fitzgerald, deputy head', reportRoute: 'on CPOMS before the end of the school day', policyTitle: 'Child protection and safeguarding policy 2026',
  })))
}
const page = await context.newPage()

let failures = 0
const record = {}
for (const id of modules) {
  const res = await page.goto(`${BASE}/print/${id}`, { waitUntil: 'networkidle', timeout: 120_000 })
  if (!res || res.status() !== 200) { failures++; console.log(`FAIL  ${id}  status ${res?.status()}`); continue }
  await page.emulateMedia({ media: 'print' })
  // Fonts decide the wrap, so nothing is measured before they are in.
  await page.evaluate(() => document.fonts.ready)
  // A sheet is at least 268mm tall, so its own height hides how much room
  // its words leave. The words' height is read instead: from the top of the
  // sheet to the foot of the last thing in it, plus the footer.
  const sheets = await page.evaluate(() =>
    [...document.querySelectorAll('main > section')].map(s => {
      const [body, footer] = s.children
      const top = s.getBoundingClientRect().top
      const bottom = Math.max(top, ...[...body.querySelectorAll('*')].map(e => e.getBoundingClientRect().bottom))
      return {
        words: Math.ceil(bottom - top + footer.getBoundingClientRect().height),
        footer: (footer.textContent ?? '').split('·').pop()?.trim(),
      }
    }))
  const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true })
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
  await page.emulateMedia({ media: 'screen' })
  const ok = pages === sheets.length
  if (!ok) failures++
  const spare = sheets.map((s, i) => ({ i: i + 1, left: PAGE_H - s.words, ...s })).sort((a, b) => a.left - b.left)
  const tight = spare[0]
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}  ${pages} pages for ${sheets.length} sheets  tightest: sheet ${tight.i} (${tight.footer}) ${tight.left >= 0 ? `${tight.left}px spare` : `${-tight.left}px over`}`)
  if (!ok) for (const s of spare.filter(s => s.left < 0)) console.log(`        sheet ${s.i} (${s.footer}) needs ${s.words}px, ${-s.left}px past the ${PAGE_H}px page`)
  if (process.env.VERBOSE) console.log(`        ${sheets.map((s, i) => `${i + 1}:${PAGE_H - s.words}`).join('  ')}`)

  // The three sheets that grow with the lesson: the one pager first, the
  // cards and the parent note last (page.tsx).
  const words = packWords(lessons[id])
  const room = s => PAGE_H - s.words
  record[id] = {
    teacher: { chars: words.teacher, spare: room(sheets[0]) },
    cards: { chars: words.cards, spare: room(sheets[sheets.length - 2]) },
    parent: { chars: words.parent, spare: room(sheets[sheets.length - 1]) },
  }
}
await browser.close()
standIn?.close()

if (failures) { console.error(`\n${failures} pack${failures === 1 ? '' : 's'} print more pages than sheets.${WRITE ? ' Nothing written.' : ''}`); process.exit(1) }
console.log(`\nprint pack fit: ${modules.length} packs, one page per sheet${LEAD ? ', with a safeguarding lead typed' : ''}.`)

if (WRITE) {
  // A subset run keeps the other lessons' records, but only while the layout
  // they were measured on is still the layout.
  const hash = layoutHash()
  const before = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null
  const kept = before && before.layout === hash ? before.lessons : {}
  const lessonsOut = Object.fromEntries(Object.entries({ ...kept, ...record }).sort(([a], [b]) => a.localeCompare(b)))
  const missing = Object.keys(lessons).filter(m => !lessonsOut[m])
  if (missing.length) { console.error(`Not written: the layout changed, so every pack needs measuring, and ${missing.length} were not (${missing.slice(0, 3).join(', ')}...). Run with no module names.`); process.exit(1) }
  writeFileSync(BASELINE, JSON.stringify({ layout: hash, measured: new Date().toISOString().slice(0, 10), pageHeight: PAGE_H, lessons: lessonsOut }, null, 2) + '\n')
  console.log(`Wrote ${BASELINE}.`)
}
