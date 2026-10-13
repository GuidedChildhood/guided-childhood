// Films a REAL product screen frame by frame with Playwright's fake clock: the
// page's timers, Date and animation frames advance exactly 1/30 s per frame,
// then Playwright takes an ordinary screenshot. Same determinism as the CDP
// virtual time recorder (tools/record.mjs) without its screenshot hangs, and
// no iframe, because Playwright's own screenshots honour its viewport.
// CSS animations and transitions run on the real clock between frames unless
// the scene sets "anims": true, which pins each one to fake clock time.
//   node tools/record2.mjs scenes/<name>.json        (same scene format)
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const S = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const DEV = process.env.DEV || 'http://localhost:3000'
const FPS = 30, W = 390, H = S.height || 844, DPR = Number(process.env.DPR || S.dpr || 3)
const root = new URL('../', import.meta.url).pathname
const dir = `${root}renders/rec/${S.name}/`
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); mkdirSync(`${root}assets/rec`, { recursive: true })
const NAMES = { ...JSON.parse(readFileSync(new URL('./names.json', import.meta.url), 'utf8')), ...(S.swap || {}) }
const NAMES_JS = readFileSync(new URL('./names.js', import.meta.url), 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR })
await page.addInitScript({ content: `window.__FILM_NAMES__ = ${JSON.stringify(NAMES)};\n${NAMES_JS}` })
if (S.storage) await page.addInitScript((kv) => { for (const [k, v] of Object.entries(kv)) try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)) } catch {} }, S.storage)
await page.addInitScript((stubs) => {
  const real = window.fetch.bind(window)
  window.fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input)
    const s = stubs.find((x) => url.includes(x.match) && (!x.method || (init?.method || 'GET') === x.method))
    if (!s) return real(input, init)
    const enc = new TextEncoder(); const parts = s.wordMs ? s.body.split(/(\s+)/) : [s.body]
    const body = new ReadableStream({ async start(c) {
      await new Promise((r) => setTimeout(r, s.delayMs || 0))
      for (const p of parts) { c.enqueue(enc.encode(p)); if (s.wordMs && !/^\s+$/.test(p)) await new Promise((r) => setTimeout(r, s.wordMs)) }
      c.close() } })
    return new Response(body, { status: s.status || 200, headers: { 'Content-Type': s.json ? 'application/json' : 'text/plain; charset=utf-8', 'X-Messages-Used-Today': '1' } })
  }
}, S.stubs || [])
await page.clock.install({ time: new Date('2026-10-12T19:00:00Z') })
// Without a pause the fake clock also flows in real time, so a frame that takes
// 100 ms to screenshot would add 100 ms of page time. Paused, it moves only on runFor.
await page.clock.pauseAt(new Date('2026-10-12T19:00:00.100Z'))
await page.goto(`${DEV}${S.url}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
// Let the page hydrate on the fake clock.
for (let i = 0; i < 60; i++) { await page.clock.runFor(50); await page.waitForTimeout(30) }
await page.evaluate(() => document.fonts.ready)
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' + (S.css || '') })
if (S.scrollY) await page.evaluate((y) => window.scrollTo(0, y), S.scrollY)
if (S.scrollTo) await page.evaluate(({ text, offset }) => { const el = [...document.querySelectorAll('p,h1,h2,h3,h4,div,span')].find((e) => e.children.length === 0 && e.textContent.trim().startsWith(text)); if (!el) return; let sc = el.parentElement; while (sc && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement; const t = sc || document.scrollingElement; t.scrollTo({ top: el.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0) + t.scrollTop - (offset || 0), behavior: 'instant' }) }, S.scrollTo)
if (S.preAdvanceMs) await page.clock.runFor(S.preAdvanceMs)
for (let i = 0; i < 20; i++) { await page.clock.runFor(50); await page.waitForTimeout(20) }

const events = []
for (const a of S.actions || []) {
  if (a.do === 'type') [...a.text].forEach((ch, i) => events.push({ at: a.at + i * (a.charMs || 45), do: 'char', ch, selector: a.selector }))
  else events.push(a)
}
events.sort((a, b) => a.at - b.at)
const N = Math.round(S.seconds * FPS)
let ei = 0, focused = null, tween = null
// CSS transitions and keyframes run on the real clock, so a 700 ms card flip
// would be over in four slow screenshots. With "anims" on, every animation is
// paused the moment it appears and set by hand to fake clock time each frame.
if (S.anims) await page.evaluate(() => { window.__syncAnims = () => { const now = performance.now(); for (const a of document.getAnimations()) { if (a.__t0 === undefined) { a.__t0 = now; a.pause() } a.currentTime = now - a.__t0 } } })
for (let f = 0; f < N; f++) {
  const now = (f * 1000) / FPS
  while (ei < events.length && events[ei].at <= now) {
    const e = events[ei++]
    if (e.do === 'char') {
      if (focused !== e.selector) { await page.evaluate((sel) => document.querySelector(sel).focus(), e.selector); focused = e.selector }
      await page.keyboard.insertText(e.ch)
    } else if (e.do === 'press') await page.keyboard.press(e.key)
    else if (e.do === 'tap' || e.do === 'click') {
      const { x, y } = await page.evaluate(({ sel, nth, text }) => { let els = [...document.querySelectorAll(sel)]; if (text) els = els.filter((el) => el.textContent.trim().includes(text)); const r = els[nth || 0].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { sel: e.selector, nth: e.nth || 0, text: e.text || null })
      await page.mouse.click(x, y)
    } else if (e.do === 'scroll') {
      // A page scroll eased over frames (smooth scrolling runs on the real clock).
      tween = { from: await page.evaluate(() => window.scrollY), to: e.to, f0: f, n: Math.round(((e.ms || 800) * FPS) / 1000) }
    } else if (e.do === 'scrollChat') {
      await page.evaluate(() => { const u = document.querySelector('[data-role="user"]'); let el = u && u.parentElement; while (el && !(getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight)) el = el.parentElement; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }) })
    }
  }
  if (tween) { const k = Math.min(1, (f - tween.f0 + 1) / tween.n), ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; await page.evaluate((y) => window.scrollTo(0, y), tween.from + (tween.to - tween.from) * ease); if (k >= 1) tween = null }
  await page.clock.runFor(1000 / FPS)
  if (S.anims) await page.evaluate(() => window.__syncAnims())
  await page.waitForTimeout(8)
  // A busy machine (another render running) can stall one screenshot; the
  // page clock is paused, so trying again films the same frame.
  for (let tries = 0; ; tries++) {
    try { await page.screenshot({ path: `${dir}f-${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92, timeout: 60000 }); break }
    catch (e) { if (tries >= 2) throw e; console.log(`frame ${f}: screenshot retry ${tries + 1}`) }
  }
  if (f % 60 === 0) console.log(`frame ${f}/${N}`)
}
await browser.close()
const out = `${root}assets/rec/${S.name}.mp4`
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}f-%05d.jpg -vf "format=yuv420p" -c:v libx264 -crf 14 -preset slow ${out}`)
console.log(`${S.name}: ${N} frames, ${S.seconds}s -> assets/rec/${S.name}.mp4`)
process.exit(0)
