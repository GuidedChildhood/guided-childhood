#!/usr/bin/env node
/**
 * "Ready, one worry at a time": the series template, v2.
 *
 * Justin, 12 October, on episode one: too quick, not clear how DiGi helps,
 * text on the left and the right at once, show the timeline from the
 * problem to the plan to how it is delivered to sorted. The research behind
 * this version (plans/2026-10-12-ready-series-plan.md): Google's "Parisian
 * Love" and Chrome's "Dear Sophie" let one screen carry the story while time
 * moves on, and Mayer's principles say one thing to look at, a fixed signal,
 * one segment per beat, slow enough to read.
 *
 * So every beat has exactly one focus: the footage, OR the DiGi chat, OR one
 * real product screen (a still capture or a screen recording of the real
 * child app), never two. Words live in one place only, a caption under the
 * focus. A timeline strip in the same place on every beat shows the four
 * stages (The worry, DiGi's plan, How it works, Sorted) and a day stamp says
 * when we are ("Night 1, 9:14pm", "Night 5", "Ten years on").
 *
 *   node build.mjs <episode.json>              16:9
 *   node build.mjs <episode.json> --vertical   9:16
 *
 * Beats (each needs step 1 to 4 and a stamp, except end):
 *   hook    { clip, quote, source }             the worry, quoted, over the footage
 *   shot    { clip, line }                       footage full frame, one caption
 *   chat    { me?, digi?: [..], plan?: true }    the DiGi chat full frame; a plan
 *                                                shows DiGi's lines as numbered steps
 *                                                written "Tonight: the words"
 *   screen  { screen, y, h, line }               one REAL product screen, still (png)
 *           { rec, off, line }                   or a screen recording (mp4, 390 wide)
 *   end     {}                                   the logo and the stage check
 * Optional on any beat: d (seconds), off (clip offset), origin (push in point).
 *
 * The build refuses: a dash, a caption over eight words, a DiGi line over
 * eighteen words, a beat shorter than its words take to read at 2.6 words a
 * second, a beat without a step and a stamp.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const epPath = resolve(process.argv[2] || '')
const V = process.argv.includes('--vertical')
const EP = JSON.parse(readFileSync(epPath, 'utf8'))
const DIR = dirname(epPath)
const W = V ? 1080 : 1920, H = V ? 1920 : 1080, X = 0.6, WPS = 2.6
const STEPS = ['The worry', "DiGi's plan", 'How it works', 'Sorted']
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))

// ---------- the rules ----------
for (const b of EP.beats) {
  const all = [b.quote, b.source, b.line, b.stamp, b.me, ...(b.digi || [])].filter(Boolean)
  for (const s of all) if (/[–—]/.test(s)) throw new Error(`dash in ${b.kind}: ${s}`)
  if (b.line && words(b.line) > 8) throw new Error(`caption over eight words: ${b.line}`)
  for (const m of b.digi || []) if (words(m) > 18) throw new Error(`DiGi line over eighteen words: ${m}`)
  if (b.kind !== 'end' && (!b.step || !b.stamp)) throw new Error(`${b.kind} beat needs a step and a stamp`)
}
const need = (b) => {
  if (b.kind === 'hook') return 1.2 + words(b.quote) / WPS + 1.6
  if (b.kind === 'chat') return 1.4 + (words(b.me) + (b.digi || []).reduce((n, m) => n + words(m), 0)) / WPS + (b.me ? 2.2 : 0) + (b.digi || []).length * 0.5 + 1.2
  if (b.kind === 'screen') return 1.6 + words(b.line) / WPS + 2.8
  if (b.kind === 'end') return 5
  return 1.4 + words(b.line) / WPS + 2.0
}
for (const b of EP.beats) {
  const n = Math.max(b.kind === 'end' ? 5 : 5.2, need(b))
  if (b.d && b.d < n - 0.05) throw new Error(`${b.kind} beat of ${b.d}s needs ${n.toFixed(1)}s to read`)
  b.d = b.d || Math.round(n * 10) / 10
}

// ---------- assets ----------
mkdirSync(join(DIR, 'assets', 'fonts'), { recursive: true })
copyFileSync(join(HERE, 'assets', 'digi-cut.png'), join(DIR, 'assets', 'digi-cut.png'))
for (const f of ['captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2', 'captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2']) copyFileSync(join(HERE, 'assets', 'fonts', f), join(DIR, 'assets', 'fonts', f))
for (const b of EP.beats) if (b.screen) copyFileSync(join(HERE, 'screens', b.screen), join(DIR, 'assets', b.screen))
for (const b of EP.beats) if (b.rec) copyFileSync(join(HERE, 'recordings', b.rec), join(DIR, 'assets', b.rec))

// ---------- timing ----------
let t = 0
const starts = EP.beats.map((b, i) => { const s = i === 0 ? 0 : t - X; t = s + b.d; return s })
const TOTAL = Math.round(t * 10) / 10

// ---------- composition ----------
const logo = (size) => {
  const bars = [5, 9, 14, 8], bw = size * 0.12, gap = size * 0.06, base = size * 0.78
  const x0 = (size - (bars.length * bw + (bars.length - 1) * gap)) / 2
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.24}" fill="#EDC35F"/>${bars.map((h, i) => { const bh = (h / 16) * size * 0.56; return `<rect x="${(x0 + i * (bw + gap)).toFixed(1)}" y="${(base - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="#FFFFFF"/>` }).join('')}</svg>`
}
let html = '', tl = '', vid = 0
const video = (src, s, d, off, origin, cls = '') => `<video id="v${vid++}" class="${cls}" src="assets/${src}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-media-start="${(off || 0).toFixed(2)}" data-track-index="${vid % 2}" style="transform-origin:${origin || '50% 45%'}"></video>`
const textIn = (sel, at) => `tl.fromTo("${sel}",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${at.toFixed(2)});\n`
const strip = (b, id) => `<div class="strip" id="${id}-s"><div class="steps">${STEPS.map((n, k) => `<span class="st${k + 1 === b.step ? ' on' : ''}${k + 1 < b.step ? ' done' : ''}"><i>${k + 1 < b.step ? '✓' : k + 1}</i>${esc(n)}</span>`).join('')}</div><div class="stamp">${esc(b.stamp)}</div></div>`

EP.beats.forEach((b, i) => {
  const s = starts[i], e = s + b.d, id = `b${i}`
  tl += `tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:${i === 0 ? 0.8 : X},ease:"sine.inOut"},${s.toFixed(2)});\n`
  if (i < EP.beats.length - 1) tl += `tl.to("#${id}",{opacity:0,duration:0.01},${e.toFixed(2)});\n`

  if (b.kind === 'end') {
    html += `<div id="${id}" class="beat end"><div class="lockup" id="${id}-l">${logo(V ? 120 : 132)}<span class="word">Guided Childhood</span></div>
      <div class="cta" id="${id}-c">What stage is your child?<br>Three questions, no sign up.</div><div class="url" id="${id}-u">guidedchildhood.com/starter-pack</div></div>\n`
    tl += `tl.fromTo("#${id}-l",{opacity:0,y:18,scale:0.96},{opacity:1,y:0,scale:1,duration:1.0,ease:"expo.out"},${(s + 0.3).toFixed(2)});
tl.fromTo("#${id}-c",{opacity:0,y:12},{opacity:1,y:0,duration:0.9,ease:"expo.out"},${(s + 1.0).toFixed(2)});
tl.fromTo("#${id}-u",{opacity:0},{opacity:1,duration:0.8},${(s + 1.6).toFixed(2)});\n`
    return
  }

  html += `<div id="${id}" class="beat ${b.kind}">`
  if (b.kind === 'hook' || b.kind === 'shot') {
    html += video(b.clip, s, b.d, b.off, b.origin) + `<div class="scrim${b.kind === 'hook' ? ' deep' : ''}"></div>`
    tl += `tl.fromTo("#${id} video",{scale:1},{scale:1.06,duration:${b.d.toFixed(2)},ease:"none"},${s.toFixed(2)});\n`
  } else {
    html += `<div class="ground"></div>`
  }
  html += strip(b, id)
  tl += `tl.fromTo("#${id}-s .stamp",{opacity:0,x:-12},{opacity:1,x:0,duration:0.6,ease:"expo.out"},${(s + 0.2).toFixed(2)});\n`
  if (i === 0 || EP.beats[i - 1].step !== b.step) tl += `tl.fromTo("#${id}-s .st.on",{scale:0.85},{scale:1,duration:0.5,ease:"back.out(2)"},${(s + 0.3).toFixed(2)});\n`

  if (b.kind === 'hook') {
    html += `<div class="quote" id="${id}-q"><div class="qm">“</div><div class="qt">${esc(b.quote)}</div><div class="qs">${esc(b.source)}</div></div>`
    tl += textIn(`#${id}-q`, s + 0.6) + `tl.fromTo("#${id}-q .qs",{opacity:0},{opacity:1,duration:0.6},${(s + 1.6).toFixed(2)});\n`
  }
  if (b.kind === 'shot') {
    html += `<div class="caption" id="${id}-c">${esc(b.line)}</div>`
    tl += textIn(`#${id}-c`, s + 1.0)
  }
  if (b.kind === 'chat') {
    html += `<div class="chatbox" id="${id}-p"><div class="ph-head"><img src="assets/digi-cut.png" alt=""><span>DiGi</span></div>`
    if (b.me) html += `<div class="me" id="${id}-me">${esc(b.me)}</div><div class="dots" id="${id}-dots"><i></i><i></i><i></i></div>`
    ;(b.digi || []).forEach((m, n) => {
      const cut = m.indexOf(': ')
      const lead = b.plan && cut > 0 ? m.slice(0, cut) : '', rest = b.plan && cut > 0 ? m.charAt(cut + 2).toUpperCase() + m.slice(cut + 3) : m
      html += `<div class="dg${b.plan ? ' step' : ''}" id="${id}-d${n}">${b.plan ? `<b class="num">${n + 1}</b><span>${lead ? `<b>${esc(lead)}.</b> ` : ''}${esc(rest)}</span>` : esc(m)}</div>`
    })
    html += `</div>`
    let a = s + 0.4
    tl += `tl.fromTo("#${id}-p",{opacity:0,y:30,scale:0.97},{opacity:1,y:0,scale:1,duration:0.7,ease:"expo.out"},${a.toFixed(2)});\n`
    if (b.me) {
      tl += `tl.fromTo("#${id}-me",{opacity:0,y:14,scale:0.94},{opacity:1,y:0,scale:1,duration:0.5,ease:"back.out(1.6)"},${(a + 0.5).toFixed(2)});\n`
      const typing = a + 0.9 + words(b.me) / WPS
      tl += `tl.fromTo("#${id}-dots",{opacity:0},{opacity:1,duration:0.2},${typing.toFixed(2)});
tl.fromTo("#${id}-dots i",{y:0},{y:-6,duration:0.25,yoyo:true,repeat:5,stagger:0.12,ease:"sine.inOut"},${typing.toFixed(2)});
tl.to("#${id}-dots",{opacity:0,height:0,margin:0,padding:0,duration:0.2},${(typing + 1.4).toFixed(2)});\n`
      a = typing + 1.5
    } else a += 0.8
    ;(b.digi || []).forEach((m, n) => { tl += `tl.fromTo("#${id}-d${n}",{opacity:0,y:12},{opacity:1,y:0,duration:0.55,ease:"power2.out"},${a.toFixed(2)});\n`; a += words(m) / WPS + 0.5 })
  }
  if (b.kind === 'screen') {
    const maxH = V ? 1180 : 740
    if (b.rec) {
      // a screen recording of the real child app, 390 x 844 at phone ratio
      const pw = Math.round((maxH - 28) * 390 / 844)
      html += `<div class="phone" id="${id}-p" style="width:${pw}px;margin-left:-${pw / 2}px"><div class="crop" style="aspect-ratio:390/844">${video(b.rec, s, b.d, b.off, '50% 0%', 'rec')}</div></div>`
    } else {
      const cropH = b.h || 1500, y = b.y || 0
      const pw = Math.min(V ? 760 : 560, Math.round((maxH - 28) * 1170 / cropH))
      html += `<div class="phone" id="${id}-p" style="width:${pw}px;margin-left:-${pw / 2}px"><div class="crop" style="aspect-ratio:1170/${cropH}"><img src="assets/${esc(b.screen)}" style="top:${(-y / cropH * 100).toFixed(3)}%" alt=""></div></div>`
    }
    html += `<div class="caption" id="${id}-c">${esc(b.line)}</div>`
    tl += `tl.fromTo("#${id}-p",{opacity:0,y:50,scale:0.95},{opacity:1,y:0,scale:1,duration:0.9,ease:"expo.out"},${(s + 0.3).toFixed(2)});
tl.to("#${id}-p",{y:-8,duration:${(b.d - 1.4).toFixed(2)},ease:"sine.inOut"},${(s + 1.2).toFixed(2)});\n` + textIn(`#${id}-c`, s + 1.4)
  }
  html += `</div>\n`
})
html += `<div class="vignette" id="vig"></div>`
if (EP.music) html += `<audio id="music" src="assets/${EP.music}" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="4" data-volume="${EP.musicVolume || 0.8}"></audio>`
const endIdx = EP.beats.findIndex((b) => b.kind === 'end'), endAt = endIdx >= 0 ? starts[endIdx] : TOTAL
tl += `tl.to("#vig",{opacity:0,duration:${X}},${endAt.toFixed(2)});\ntl.to({}, {duration:${TOTAL}}, 0);\n`

// one caption place: under the focus, centred. one strip place: the top.
const L = V
  ? { stripTop: 70, cap: 'bottom:200px', capSize: 58, chatW: 900, chatTop: 300, phoneTop: 250, quoteTop: 620, qt: 70, word: 76, cta: 46, chatFont: 36 }
  : { stripTop: 34, cap: 'bottom:60px', capSize: 50, chatW: 1000, chatTop: 140, phoneTop: 122, quoteTop: 300, qt: 66, word: 92, cta: 44, chatFont: 33 }
const css = `
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#1A1712;font-family:nunito,sans-serif}
.beat{position:absolute;inset:0;opacity:0;overflow:hidden}
.beat > video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ground{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,#3A2F22 0%,#1A1712 75%)}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 60%,rgba(0,0,0,0.62) 100%)}
.scrim.deep{background:rgba(8,5,0,0.5)}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(10,6,0,0.35) 100%);z-index:8}
.strip{position:absolute;left:0;right:0;top:${L.stripTop}px;display:flex;${V ? 'flex-direction:column;align-items:center;gap:18px' : 'justify-content:space-between;align-items:center;padding:0 56px'};z-index:7}
.steps{display:flex;gap:${V ? 8 : 10}px}
.st{display:flex;align-items:center;gap:8px;padding:8px ${V ? 12 : 16}px 8px 8px;border-radius:999px;background:rgba(255,251,238,0.14);color:rgba(255,251,238,0.62);font-weight:700;font-size:${V ? 20 : 22}px;transform-origin:center}
.st i{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:rgba(255,251,238,0.2);font-style:normal;font-family:plexMono,monospace;font-size:16px}
.st.done{color:rgba(255,251,238,0.88)}.st.done i{background:#2F8F6B;color:#fff}
.st.on{background:#EDC35F;color:#1A1A2E}.st.on i{background:#1A1A2E;color:#EDC35F}
.stamp{font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.12em;text-transform:uppercase;color:#1A1A2E;background:#FFFBEE;border:3px solid #1A1A2E;border-radius:14px;padding:8px 18px;box-shadow:0 5px 0 #C99A28;opacity:0}
.caption{position:absolute;left:0;right:0;${L.cap};text-align:center;z-index:6;font-weight:800;font-size:${L.capSize}px;line-height:1.15;color:#FFFBEE;letter-spacing:-0.01em;padding:0 80px;text-shadow:0 3px 0 rgba(0,0,0,0.2),0 14px 40px rgba(0,0,0,0.6);opacity:0}
.screen .caption{${V ? 'bottom:200px' : 'bottom:36px'};font-size:${V ? 56 : 46}px}
.quote{position:absolute;left:140px;right:140px;top:${L.quoteTop}px;text-align:center;z-index:6;opacity:0}
.quote .qm{font-weight:900;font-size:150px;line-height:0.6;color:#EDC35F}
.quote .qt{font-weight:800;font-size:${L.qt}px;line-height:1.15;color:#FFFBEE;text-shadow:0 4px 0 rgba(0,0,0,0.2),0 18px 50px rgba(0,0,0,0.7)}
.quote .qs{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:24px;letter-spacing:0.18em;text-transform:uppercase;color:#EDC35F;opacity:0}
.chatbox{position:absolute;left:50%;top:${L.chatTop}px;width:${L.chatW}px;margin-left:-${L.chatW / 2}px;z-index:6;opacity:0;background:#F9F8F6;border:3px solid #1A1A2E;border-radius:36px;box-shadow:0 8px 0 #1A1A2E,0 40px 90px rgba(0,0,0,0.45);padding:26px 36px 34px}
.ph-head{display:flex;align-items:center;gap:14px;padding-bottom:18px;margin-bottom:22px;border-bottom:2px solid #EDE6D6;font-weight:800;font-size:32px;color:#1A1A2E}
.ph-head img{width:52px;height:52px;object-fit:contain}
.me{margin-left:${V ? 80 : 180}px;background:#F0F9FF;border:2px solid #1A1A2E;box-shadow:0 4px 0 #1A1A2E;border-radius:18px;padding:18px 24px;font-weight:600;font-size:${L.chatFont}px;line-height:1.3;color:#1A1A2E;opacity:0}
.dots{display:inline-flex;gap:8px;margin-top:22px;padding:12px 18px;background:#FFF6DE;border-radius:999px;opacity:0;overflow:hidden}
.dots i{display:block;width:12px;height:12px;border-radius:50%;background:#C99A28;opacity:0.6}
.dg{margin-top:18px;font-weight:600;font-size:${L.chatFont}px;line-height:1.36;color:#1A1A2E;opacity:0}
.dg.step{display:flex;gap:18px;align-items:flex-start;padding:16px 20px;border-radius:18px;background:#FFF6DE}
.dg.step .num{flex:none;display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:#EDC35F;border:2px solid #1A1A2E;font-weight:900;font-size:26px}
.dg.step b{font-weight:900}
.phone{position:absolute;left:50%;top:${L.phoneTop}px;z-index:6;opacity:0;background:#F9F8F6;border:3px solid #1A1A2E;border-radius:44px;box-shadow:0 8px 0 #1A1A2E,0 40px 90px rgba(0,0,0,0.5);padding:14px;overflow:hidden}
.phone .crop{position:relative;width:100%;overflow:hidden;border-radius:32px;background:#F9F8F6}
.phone .crop img{position:absolute;left:0;width:100%;height:auto}
.phone .crop video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.end{background:#F9F8F6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.lockup{display:flex;align-items:center;gap:30px;opacity:0}
.word{font-weight:800;font-size:${L.word}px;color:#1A1A2E;letter-spacing:-0.01em}
.end .cta{margin-top:50px;font-weight:700;font-size:${L.cta}px;line-height:1.3;color:#1A1A2E;opacity:0}
.end .url{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.08em;color:#C99A28;opacity:0}
`
writeFileSync(join(DIR, 'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${W}, height=${H}"><title>${esc(EP.title)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-width="${W}" data-height="${H}">
${html}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`)

// the guide score follows the four stages: the voice joins at DiGi's plan,
// the lift runs through how it works, the warm return lands on sorted
const firstOf = (k) => starts[EP.beats.findIndex((b) => b.step === k)]
const score = { len: TOTAL, voice: +firstOf(2).toFixed(2), lift: +firstOf(3).toFixed(2), hush: +(firstOf(4) - 0.6).toFixed(2), ret: +firstOf(4).toFixed(2), hold: +endAt.toFixed(2) }
writeFileSync(join(DIR, 'score.json'), JSON.stringify(score))
console.log(`${EP.title}: ${EP.beats.length} beats, ${TOTAL}s, ${V ? '9:16' : '16:9'}`)
EP.beats.forEach((b, i) => console.log(`  ${b.kind.padEnd(7)} ${starts[i].toFixed(1).padStart(5)}s  ${String(b.d).padStart(4)}s  ${b.step ? STEPS[b.step - 1].padEnd(13) : ''.padEnd(13)} ${b.stamp || ''}`))
