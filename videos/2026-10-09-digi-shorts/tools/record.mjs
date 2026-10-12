// Films a REAL product screen in deterministic virtual time: the ref-* preview
// page renders the live component with made up data, the page is paused, and
// every frame is one 1/30 s step of virtual time followed by a screenshot, so
// typing, the thinking messages, a streaming reply and every CSS animation
// land on exact frames and nothing is dropped. Only the server is stood in
// for (window.fetch for the routes named in "stubs"), because the preview has
// no account behind it. Reply text must be rail faithful and labelled
// illustrative wherever it appears.
//
//   node tools/record.mjs scenes/<name>.json
//
// scene: { name, url, seconds, stubs: [{ match, body, delayMs, wordMs, status }],
//          actions: [{ at, do: type|press|click|tap|scroll|wait, selector, text, charMs, key, y, x }] }
// Writes assets/rec/<name>.mp4 at 1170 by 2532, 30 fps.
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const S = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const DEV = process.env.DEV || 'http://localhost:51458'
const FPS = 30, W = 390, H = S.height || 844, DPR = 3
// Measured 9 October 2026: a CDP capture under virtual time always loses the
// bottom 87 px of the viewport, whatever its size, so the page is given 90 px
// more than the phone and the phone is captured whole at 3x: 1170 by 2532.
const K = 1, PAD = 90
const root = new URL('../', import.meta.url).pathname
const dir = `${root}renders/rec/${S.name}/`
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); mkdirSync(`${root}assets/rec`, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage({ viewport: { width: W, height: H + PAD }, deviceScaleFactor: DPR })
await page.addInitScript((stubs) => {
  const real = window.fetch.bind(window)
  window.fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input)
    const s = stubs.find((x) => url.includes(x.match) && (!x.method || (init?.method || 'GET') === x.method))
    if (!s) return real(input, init)
    const enc = new TextEncoder()
    const parts = s.wordMs ? s.body.split(/(\s+)/) : [s.body]
    const body = new ReadableStream({
      async start(c) {
        await new Promise((r) => setTimeout(r, s.delayMs || 0))
        for (const p of parts) { c.enqueue(enc.encode(p)); if (s.wordMs && !/^\s+$/.test(p)) await new Promise((r) => setTimeout(r, s.wordMs)) }
        c.close()
      },
    })
    return new Response(body, { status: s.status || 200, headers: { 'Content-Type': s.json ? 'application/json' : 'text/plain; charset=utf-8', 'X-Messages-Used-Today': '1' } })
  }
}, S.stubs || [])
// Chrome will not make a window narrower than 500 px, and a second CDP session
// does not see Playwright's viewport emulation, so the page lives in an iframe
// exactly W by H: inside it the app sees a true phone viewport, breakpoints,
// vh and dvh included.
await page.goto(`${DEV}/api/version`)
await page.setContent(`<style>html,body{margin:0;background:#fff;overflow:hidden}</style><iframe id="f" src="${DEV}${S.url}" style="position:fixed;left:0;top:0;width:${W}px;height:${H}px;border:0;transform:scale(${K});transform-origin:0 0"></iframe>`)
let fr = null
for (let i = 0; i < 240 && !fr; i++) { await page.waitForTimeout(500); fr = page.frames().find((f) => f !== page.mainFrame() && f.url().startsWith(DEV)) }
await fr.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {})
await fr.evaluate(() => document.fonts.ready)
await fr.addStyleTag({ content: 'nextjs-portal{display:none!important}' + (S.css || '') })
if (S.scrollY) await fr.evaluate((y) => window.scrollTo(0, y), S.scrollY)
await page.waitForTimeout(S.settleMs ?? 2500)

const cdp = await page.context().newCDPSession(page)
// No device metrics override on this session: it fights Playwright's own and hangs virtual time. The clip scale gives the 3x pixels.
// A step that never returns is logged and skipped rather than hanging the take.
const within = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r('timeout'), ms))])
const step = (ms) => within(new Promise((res) => { cdp.once('Emulation.virtualTimeBudgetExpired', res); cdp.send('Emulation.setVirtualTimePolicy', { policy: 'advance', budget: ms }) }), 8000)
await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pause' })

// Expand typing into one keystroke event per character on its own frame.
const events = []
for (const a of S.actions || []) {
  if (a.do === 'type') [...a.text].forEach((ch, i) => events.push({ at: a.at + i * (a.charMs || 45), do: 'char', ch, selector: a.selector }))
  else events.push(a)
}
events.sort((a, b) => a.at - b.at)
const N = Math.round(S.seconds * FPS)
let ei = 0, focused = null
for (let f = 0; f < N; f++) {
  const now = (f * 1000) / FPS
  while (ei < events.length && events[ei].at <= now) {
    const e = events[ei++]
    if (e.do === 'char') {
      if (focused !== e.selector) { await fr.evaluate((sel) => document.querySelector(sel).focus(), e.selector); focused = e.selector }
      await cdp.send('Input.insertText', { text: e.ch })
    } else if (e.do === 'press') await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: e.key, code: e.key, windowsVirtualKeyCode: e.key === 'Enter' ? 13 : 0, text: e.key === 'Enter' ? '\r' : undefined }).then(() => cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: e.key, code: e.key, windowsVirtualKeyCode: e.key === 'Enter' ? 13 : 0 }))
    else if (e.do === 'click' || e.do === 'tap') {
      // No Playwright locator here: it waits for an animation frame, and none comes while virtual time is paused.
      const { x, y } = await fr.evaluate(({ sel, nth, text }) => {
        let els = [...document.querySelectorAll(sel)]
        if (text) els = els.filter((el) => el.textContent.trim().includes(text))
        const r = els[nth || 0].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
      }, { sel: e.selector, nth: e.nth || 0, text: e.text || null }).then((p) => ({ x: p.x * K, y: p.y * K }))
      for (const type of ['mousePressed', 'mouseReleased']) await cdp.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
    } else if (e.do === 'scroll') await fr.evaluate(({ y, sel }) => (sel ? document.querySelector(sel) : window).scrollTo({ top: y, behavior: 'instant' }), { y: e.y, sel: e.selector || null })
  }
  if ((await step(1000 / FPS)) === 'timeout') console.log(`step timed out at frame ${f}`)
  const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W * K, height: H * K, scale: DPR / K }})
  writeFileSync(`${dir}f-${String(f).padStart(5, '0')}.jpg`, Buffer.from(shot.data, 'base64'))
}
await within(browser.close(), 5000)
const out = `${root}assets/rec/${S.name}.mp4`
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}f-%05d.jpg -vf "format=yuv420p" -c:v libx264 -crf 14 -preset slow ${out}`)
const dims = execSync(`ffprobe -v error -show_entries stream=width,height -of csv=p=0 ${out}`).toString().trim()
console.log(`${S.name}: ${N} frames, ${S.seconds}s, ${dims} -> assets/rec/${S.name}.mp4`)
process.exit(0)
