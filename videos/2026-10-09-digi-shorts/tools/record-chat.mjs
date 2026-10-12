// Films the REAL DiGi chat (app/(dashboard)/dashboard/digi/DigiChat.tsx, on the
// ref-digi-chat preview page) in real time: a parent's question is typed into
// the real box, the real thinking messages rotate (ThinkingReassurance, every
// 2.2 seconds), and the reply streams in through the real renderer. Only the
// server is stood in for: window.fetch for /api/digi returns the reply text as
// a stream, because the preview page has no account and no model behind it.
// The reply text must be a rail faithful answer, labelled illustrative.
//
//   node tools/record-chat.mjs scenes/bedtime.json
//
// scenes/*.json: { "name", "question", "reply", "thinkMs", "wordMs", "typeMs",
//                  "holdMs", "url" }
// Writes renders/rec/<name>/f-<n>.jpg and assets/rec/<name>.mp4 (30 fps).
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/Users/justinphillips/guided-childhood/node_modules/playwright/index.mjs')
const S = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const DEV = process.env.DEV || 'http://localhost:51458'
const root = new URL('../', import.meta.url).pathname
const dir = `${root}renders/rec/${S.name}/`
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); mkdirSync(`${root}assets/rec`, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--window-size=600,1000'] })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
await page.addInitScript(({ reply, thinkMs, wordMs }) => {
  const real = window.fetch.bind(window)
  window.fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input)
    if (url.endsWith('/api/digi') && (init?.method || 'GET') === 'POST') {
      const enc = new TextEncoder()
      const words = reply.split(/(\s+)/)
      const body = new ReadableStream({
        async start(c) {
          await new Promise((r) => setTimeout(r, thinkMs))
          for (const w of words) { c.enqueue(enc.encode(w)); await new Promise((r) => setTimeout(r, /\s/.test(w) ? 0 : wordMs)) }
          c.close()
        },
      })
      return new Response(body, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Messages-Used-Today': '1' } })
    }
    return real(input, init)
  }
}, { reply: S.reply, thinkMs: S.thinkMs ?? 6600, wordMs: S.wordMs ?? 70 })
await page.goto(`${DEV}${S.url || '/ref-digi-chat?kids=1'}`, { waitUntil: 'networkidle', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' })
await page.waitForTimeout(1500)

const cdp = await page.context().newCDPSession(page)
const frames = []
cdp.on('Page.screencastFrame', async (f) => {
  frames.push({ t: f.metadata.timestamp, data: f.data })
  try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }) } catch {}
})
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 94, everyNthFrame: 1 })
await page.waitForTimeout(800)
const box = page.locator('textarea').first()
await box.click()
await page.waitForTimeout(300)
await box.pressSequentially(S.question, { delay: S.typeMs ?? 45 })
await page.waitForTimeout(500)
await page.keyboard.press('Enter')
const total = (S.thinkMs ?? 6600) + S.reply.split(/\s+/).length * (S.wordMs ?? 70) + (S.holdMs ?? 3000)
await page.waitForTimeout(total)
await cdp.send('Page.stopScreencast')
await browser.close()

// Constant 30 fps from the timestamped frames.
const t0 = frames[0].t
let list = ''
frames.forEach((f, i) => {
  const name = `f-${String(i).padStart(5, '0')}.jpg`
  writeFileSync(dir + name, Buffer.from(f.data, 'base64'))
  const next = frames[i + 1] ? frames[i + 1].t : f.t + 0.5
  list += `file '${name}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`
})
list += `file 'f-${String(frames.length - 1).padStart(5, '0')}.jpg'\n`
writeFileSync(dir + 'list.txt', list)
const out = `${root}assets/rec/${S.name}.mp4`
execSync(`ffmpeg -v error -y -f concat -safe 0 -i ${dir}list.txt -vf "fps=30,scale=1170:-2,format=yuv420p" -c:v libx264 -crf 14 -preset slow ${out}`)
console.log(`${S.name}: ${frames.length} frames over ${(frames[frames.length - 1].t - t0).toFixed(1)}s -> assets/rec/${S.name}.mp4`)
