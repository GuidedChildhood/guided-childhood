// Where does this text sit on the phone? Loads a scene's page exactly as the
// recorder does (names, swaps, storage, scroll), optionally runs its actions
// up to a time, and prints each text's box in phone CSS px (390 wide), which is
// what the cut file's camera focus points use.
//   node tools/where.mjs scenes/followup.json [--at 6000] "Did you get to try it?" "Getting there, up from"
import { readFileSync } from 'node:fs'
const { chromium } = await import('/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const argv = process.argv.slice(2); const S = JSON.parse(readFileSync(argv.shift(), 'utf8'))
const ai = argv.indexOf('--at'); const AT = ai >= 0 ? Number(argv.splice(ai, 2)[1]) : 0
const DEV = process.env.DEV || 'http://localhost:3000'
const NAMES = { ...JSON.parse(readFileSync(new URL('./names.json', import.meta.url), 'utf8')), ...(S.swap || {}) }
const NAMES_JS = readFileSync(new URL('./names.js', import.meta.url), 'utf8')
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const p = await b.newPage({ viewport: { width: 390, height: S.height || 844 } })
await p.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
if (S.storage) await p.addInitScript((kv) => { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)) }, S.storage)
await p.addInitScript((stubs) => { const real = window.fetch.bind(window); window.fetch = async (i, init) => { const u = String(i instanceof Request ? i.url : i); const s = stubs.find((x) => u.includes(x.match) && (!x.method || (init?.method || 'GET') === x.method)); if (!s) return real(i, init); await new Promise((r) => setTimeout(r, s.delayMs || 0)); return new Response(s.body, { status: 200, headers: { 'Content-Type': 'text/plain' } }) } }, S.stubs || [])
await p.goto(DEV + S.url, { waitUntil: 'networkidle', timeout: 120000 })
await p.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
await p.waitForTimeout(1500)
if (S.scrollY) await p.evaluate((y) => window.scrollTo(0, y), S.scrollY)
if (S.scrollTo) await p.evaluate(({ text, offset }) => { const el = [...document.querySelectorAll('p,h1,h2,h3,h4,div,span')].find((e) => e.children.length === 0 && e.textContent.trim().startsWith(text)); if (!el) return; let sc = el.parentElement; while (sc && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement; const t = sc || document.scrollingElement; t.scrollTo({ top: el.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0) + t.scrollTop - (offset || 0), behavior: 'instant' }) }, S.scrollTo)
for (const a of (S.actions || []).filter((a) => a.at <= AT && (a.do === 'tap' || a.do === 'click'))) {
  await p.evaluate(({ sel, nth, text }) => { let els = [...document.querySelectorAll(sel)]; if (text) els = els.filter((e) => e.textContent.trim().includes(text)); els[nth || 0]?.click() }, { sel: a.selector, nth: a.nth || 0, text: a.text || null })
  await p.waitForTimeout(1200)
}
await p.waitForTimeout(1600)
for (const t of argv) {
  if (t.startsWith('~')) {
    // A substring inside a paragraph: every line box of that run of text.
    const rects = await p.evaluate((q) => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const i = n.nodeValue.indexOf(q); if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + q.length); const rs = [...r.getClientRects()].filter((b) => b.width > 0); if (rs.length) return rs.map((b) => [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]) } } return null }, t.slice(1))
    console.log(JSON.stringify(t).padEnd(48), rects ? rects.map((r) => `x ${r[0]}..${r[2]} y ${r[1]}..${r[3]}`).join(' | ') : 'not found'); continue
  }
  const r = await p.evaluate((t) => { const el = [...document.querySelectorAll('body *')].filter((e) => e.textContent.includes(t)).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] }, t)
  console.log(JSON.stringify(t).padEnd(48), r ? `x ${r[0]}..${r[2]}  y ${r[1]}..${r[3]}  centre ${Math.round((r[0] + r[2]) / 2)},${Math.round((r[1] + r[3]) / 2)}` : 'not found')
}
await b.close()
