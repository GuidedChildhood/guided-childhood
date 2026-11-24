import pw from '/home/user/guided-childhood/node_modules/playwright/index.js'
import { writeFileSync, mkdirSync } from 'node:fs'
const [,, mode, out] = process.argv            // mode: v (1080x1920) or h (1920x1080)
mkdirSync(out, { recursive: true })
const V = mode === 'v'
const vp = V ? { width: 405, height: 720 } : { width: 960, height: 540 }
const BAND_TOP = V ? 92 : 28, BAND_H = V ? 72 : 64, PAD = V ? 178 : 104
const base = 'http://localhost:3100'
const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: V ? 8 / 3 : 2 })
const p = await ctx.newPage()
let n = 0; const list = []
const hold = (words, fresh) => Math.max(1.4, 0.6 + words / 3.3) + (fresh ? 0.5 : 0)
async function frame(dur) { if (!dur.keepMouse) {}
 const f = `${out}/f${String(n++).padStart(4, '0')}.png`; await p.screenshot({ path: f }); list.push([f, dur]) }
async function film(caption) {
  await p.evaluate(({ caption, BAND_TOP, BAND_H, PAD, V }) => {
    let st = document.getElementById('film-style')
    if (!st) { st = document.createElement('style'); st.id = 'film-style'; document.head.appendChild(st) }
    st.textContent = `html{scroll-behavior:auto!important} body{padding-top:${PAD}px!important; background:var(--cream)!important}
      #film-top{position:fixed;inset:0 0 auto 0;height:${PAD}px;background:var(--cream);z-index:99998}
      #film-band{position:fixed;left:${V ? 16 : 40}px;right:${V ? 16 : 40}px;top:${BAND_TOP}px;min-height:${BAND_H}px;display:flex;align-items:center;justify-content:center;text-align:center;background:var(--butter, #F4D35E);color:var(--ink);border-radius:18px;box-shadow:0 5px 0 var(--ink);font-family:var(--font-display);font-weight:900;font-size:${V ? 20 : 24}px;line-height:1.2;padding:10px 18px;z-index:99999}
      #film-tap{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:999px;border:4px solid var(--ink);background:rgba(244,211,94,.45);z-index:99999;pointer-events:none}
      nextjs-portal{display:none!important}`
    let top = document.getElementById('film-top'); if (!top) { top = document.createElement('div'); top.id = 'film-top'; document.body.appendChild(top) }
    let band = document.getElementById('film-band'); if (!band) { band = document.createElement('div'); band.id = 'film-band'; document.body.appendChild(band) }
    band.textContent = caption
  }, { caption, BAND_TOP, BAND_H, PAD, V })
}
async function center(sel) { await p.locator(sel).first().evaluate(e => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(250) }
async function tap(sel) {
  const el = p.locator(sel).first(); await center(sel)
  const bb = await el.boundingBox()
  await p.evaluate(({ x, y }) => { const t = document.createElement('div'); t.id = 'film-tap'; t.style.left = x + 'px'; t.style.top = y + 'px'; document.body.appendChild(t) }, { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 })
  await frame(0.35)
  await p.evaluate(() => document.getElementById('film-tap')?.remove())
  await el.click()
}
const settle = async () => { await p.waitForLoadState('networkidle'); await p.mouse.move(vp.width - 2, vp.height - 2); await p.waitForTimeout(700) }

// 1. The door
await p.goto(base + '/unlock', { waitUntil: 'networkidle' }); await p.waitForTimeout(600)
await film('Not an online safety specialist? Watch this.')
await p.locator('#code').evaluate(e => e.blur())
await frame(hold(7, true))
await film('1. Your school code')
await center('#code')
await frame(1.0)
await p.click('#code')
for (const ch of 'demo-school-code') { await p.keyboard.type(ch); await frame(0.06) }
await frame(0.5)
await tap('button[type=submit]')
await p.waitForURL(/\/start/); await settle()

// 2. The year
await film('2. Pick your year')
await center('a[href="/start?stage=KS2"]')
await frame(hold(4, true))
await tap('a[href="/start?stage=KS2"]')
await p.waitForURL(/stage=KS2/); await settle()

// 3. Teach
await film('3. Press Teach')
await center('a.btn-gold')
await frame(hold(3, true) + 0.6)
await tap('a.btn-gold')
await p.waitForURL(/\/teach\//); await settle(); await p.waitForTimeout(3500)

// 4. The player
await film('The words to say are on every slide.')
await frame(hold(8, true) + 0.8)

// 5. End card
await p.evaluate(({ V }) => {
  const d = document.createElement('div'); d.id = 'film-end'
  d.innerHTML = `<div style="font-family:var(--font-mono);font-size:${V ? 12 : 14}px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-muted)">Guided Childhood Schools</div>
  <div style="font-family:var(--font-display);font-weight:900;font-size:${V ? 34 : 46}px;line-height:1.12;color:var(--ink);margin:14px 0 10px;max-width:${V ? 340 : 700}px">The online side of RSHE, ready to teach.</div>
  <div style="font-family:var(--font-body);font-size:${V ? 17 : 20}px;color:var(--ink-soft);margin-bottom:26px">Two lessons free for a term.</div>
  <div style="display:inline-block;background:var(--butter, #F4D35E);color:var(--ink);border-radius:16px;box-shadow:0 5px 0 var(--ink);font-family:var(--font-display);font-weight:900;font-size:${V ? 17 : 22}px;padding:${V ? '12px 18px' : '14px 24px'}">schools.guidedchildhood.com/pilot</div>
  <div style="font-family:var(--font-body);font-size:${V ? 14 : 16}px;color:var(--ink-muted);margin-top:22px">No card. No contract. No pupil data.</div>`
  Object.assign(d.style, { position: 'fixed', inset: '0', zIndex: 100000, background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' })
  document.body.appendChild(d)
}, { V })
await p.waitForTimeout(300)
await frame(3.6)

await b.close()
const txt = list.map(([f, d]) => `file '${f}'\nduration ${d.toFixed(3)}`).join('\n') + `\nfile '${list.at(-1)[0]}'\n`
writeFileSync(`${out}/list.txt`, txt)
console.log('frames', list.length, 'seconds', list.reduce((t, [, d]) => t + d, 0).toFixed(1))
