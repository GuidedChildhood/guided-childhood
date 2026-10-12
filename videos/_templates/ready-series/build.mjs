#!/usr/bin/env node
/**
 * "Ready, one worry at a time": the series template.
 *
 * One parent worry per episode, about forty seconds, the same family as the
 * hero film. An episode is a beats file; this script writes the composition.
 *
 *   node build.mjs ../../2026-10-12-ready-ep1/episode.json            16:9
 *   node build.mjs ../../2026-10-12-ready-ep1/episode.json --vertical  9:16
 *
 * Beat kinds, in the order an episode usually runs (plans/2026-10-12-ready-series-plan.md):
 *   hook    { clip, quote, source }            the worry, quoted, under four seconds
 *   shot    { clip, age, line }                a moment with a caption
 *   chat    { clip, me, digi: [..] }           the DiGi chat, drawn like the real one
 *   screen  { clip, screen, y, h, line, tag }  a REAL product screen in a phone, over the
 *                                              blurred clip; y and h crop the capture (px
 *                                              at 3x density), never a mock up
 *   payoff  { clip, age, line }                the same family, older, doing it themselves
 *   end     {}                                 the logo and the stage check
 * Each beat may set d (seconds) and off (source offset). Clips live in the
 * episode's assets/; screens come from this template's screens/ (captured
 * from the running app by tools/capture.mjs) and are copied in by the build.
 *
 * Rules the build refuses: a dash anywhere, a caption over nine words, a DiGi
 * line over twenty two words, a beat shorter than its words need to be read.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const epPath = resolve(process.argv[2] || '')
const V = process.argv.includes('--vertical')
const EP = JSON.parse(readFileSync(epPath, 'utf8'))
const DIR = dirname(epPath)
const W = V ? 1080 : 1920, H = V ? 1920 : 1080, X = 0.5, WPS = 3.4
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))

// ---------- the rules ----------
const text = (b) => [b.quote, b.source, b.age, b.line, b.tag, b.me, ...(b.digi || [])].filter(Boolean)
for (const b of EP.beats) {
  for (const s of text(b)) if (/[–—]/.test(s)) throw new Error(`dash in ${b.kind}: ${s}`)
  if (b.line && words(b.line) > 9) throw new Error(`caption over nine words: ${b.line}`)
  for (const m of b.digi || []) if (words(m) > 22) throw new Error(`DiGi line over 22 words: ${m}`)
}
const need = (b) => {
  if (b.kind === 'hook') return words(b.quote) / WPS + 1.8
  if (b.kind === 'chat') return 3.6 + (words(b.me) + (b.digi || []).reduce((n, m) => n + words(m), 0)) / WPS + 1.0
  if (b.kind === 'screen') return 2.4 + words(b.line) / WPS + 1.6
  if (b.kind === 'end') return 4.5
  return 1.2 + words(b.line) / WPS + 1.4
}
for (const b of EP.beats) {
  const n = need(b)
  if (b.d && b.d < n - 0.05) throw new Error(`${b.kind} beat of ${b.d}s needs ${n.toFixed(1)}s to read`)
  b.d = b.d || Math.round(n * 10) / 10
}

// ---------- assets ----------
mkdirSync(join(DIR, 'assets'), { recursive: true })
for (const f of ['digi-cut.png']) if (!existsSync(join(DIR, 'assets', f))) copyFileSync(join(HERE, 'assets', f), join(DIR, 'assets', f))
for (const b of EP.beats) if (b.screen) copyFileSync(join(HERE, 'screens', b.screen), join(DIR, 'assets', b.screen))
if (!existsSync(join(DIR, 'assets', 'fonts'))) {
  mkdirSync(join(DIR, 'assets', 'fonts'), { recursive: true })
  for (const f of ['captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2', 'captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2']) copyFileSync(join(HERE, 'assets', 'fonts', f), join(DIR, 'assets', 'fonts', f))
}

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
const video = (b, s, d, cls = '') => `<video id="v${vid++}" class="${cls}" src="assets/${b.clip}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-media-start="${(b.off || 0).toFixed(2)}" data-track-index="${vid % 2}" style="transform-origin:${b.origin || '50% 45%'}"></video>`
const capIn = (sel, at) => `tl.fromTo("${sel}",{opacity:0,y:16,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${at.toFixed(2)});\n`
const out = (sel, at) => `tl.to("${sel}",{opacity:0,duration:0.4,ease:"power2.in"},${at.toFixed(2)});\n`

EP.beats.forEach((b, i) => {
  const s = starts[i], e = s + b.d, id = `b${i}`
  tl += `tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:${i === 0 ? 0.8 : X},ease:"sine.inOut"},${s.toFixed(2)});\n`
  if (i < EP.beats.length - 1) tl += `tl.to("#${id}",{opacity:0,duration:0.01},${e.toFixed(2)});\n`
  if (b.kind === 'end') {
    tl += `tl.to(".vignette",{opacity:0,duration:${X}},${s.toFixed(2)});\n`
    html += `<div id="${id}" class="beat end"><div class="lockup" id="${id}-l">${logo(V ? 120 : 132)}<span class="word">Guided Childhood</span></div>
      <div class="cta" id="${id}-c">What stage is your child?<br>Three questions, no sign up.</div><div class="url" id="${id}-u">guidedchildhood.com/starter-pack</div></div>\n`
    tl += `tl.fromTo("#${id}-l",{opacity:0,y:18,scale:0.96},{opacity:1,y:0,scale:1,duration:1.0,ease:"expo.out"},${(s + 0.3).toFixed(2)});
tl.fromTo("#${id}-c",{opacity:0,y:12},{opacity:1,y:0,duration:0.9,ease:"expo.out"},${(s + 1.0).toFixed(2)});
tl.fromTo("#${id}-u",{opacity:0},{opacity:1,duration:0.8},${(s + 1.6).toFixed(2)});\n`
    return
  }
  const blurBg = b.kind === 'screen' || b.kind === 'chat'
  html += `<div id="${id}" class="beat">${video(b, s, b.d, blurBg ? 'soft' : '')}<div class="scrim${blurBg ? ' strong' : ''}${b.kind === 'hook' ? ' hookscrim' : ''}"></div>`
  tl += `tl.fromTo("#${id} video",{scale:1},{scale:1.07,duration:${b.d.toFixed(2)},ease:"none"},${s.toFixed(2)});\n`
  if (b.kind === 'hook') {
    html += `<div class="hook" id="${id}-q"><div class="qm">“</div><div class="qt">${esc(b.quote)}</div><div class="qs">${esc(b.source)}</div></div>`
    tl += capIn(`#${id}-q`, s + 0.4) + `tl.fromTo("#${id}-q .qs",{opacity:0},{opacity:1,duration:0.5},${(s + 1.2).toFixed(2)});\n` + out(`#${id}-q`, e - 0.5)
  }
  if (b.kind === 'shot' || b.kind === 'payoff') {
    html += `<div class="cap${b.kind === 'payoff' ? ' payoff' : ''}" id="${id}-c"><div class="age">${esc(b.age)}</div><div class="cl">${esc(b.line)}</div></div>`
    tl += capIn(`#${id}-c`, s + 0.9) + out(`#${id}-c`, e - 0.5)
  }
  if (b.kind === 'chat') {
    html += `<div class="phone chat" id="${id}-p"><div class="ph-head"><img src="assets/digi-cut.png" alt=""><span>DiGi</span></div>
      <div class="me" id="${id}-me">${esc(b.me)}</div><div class="dots" id="${id}-dots"><i></i><i></i><i></i></div>
      ${b.digi.map((m, n) => `<div class="dg" id="${id}-d${n}">${esc(m)}</div>`).join('')}</div>`
    const a = s + 0.4
    tl += `tl.fromTo("#${id}-p",{opacity:0,y:50,scale:0.95},{opacity:1,y:0,scale:1,duration:0.7,ease:"expo.out"},${a.toFixed(2)});
tl.fromTo("#${id}-me",{opacity:0,y:14,scale:0.92},{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.6)"},${(a + 0.5).toFixed(2)});
tl.fromTo("#${id}-dots",{opacity:0},{opacity:1,duration:0.2},${(a + 1.0 + words(b.me) / WPS).toFixed(2)});
tl.fromTo("#${id}-dots i",{y:0},{y:-6,duration:0.25,yoyo:true,repeat:5,stagger:0.12,ease:"sine.inOut"},${(a + 1.0 + words(b.me) / WPS).toFixed(2)});
tl.to("#${id}-dots",{opacity:0,height:0,margin:0,padding:0,duration:0.2},${(a + 2.2 + words(b.me) / WPS).toFixed(2)});\n`
    let at = a + 2.3 + words(b.me) / WPS
    b.digi.forEach((m, n) => { tl += `tl.fromTo("#${id}-d${n}",{opacity:0,y:10},{opacity:1,y:0,duration:0.5,ease:"power2.out"},${at.toFixed(2)});\n`; at += words(m) / WPS + 0.4 })
  }
  if (b.kind === 'screen') {
    const cropH = b.h || 1500, y = b.y || 0
    html += `<div class="phone screen" id="${id}-p"><div class="crop" style="aspect-ratio:1170/${cropH}"><img src="assets/${esc(b.screen)}" style="top:${(-y / cropH * 100).toFixed(3)}%;height:auto" alt=""></div></div>
      <div class="cap side" id="${id}-c">${b.tag ? `<div class="age">${esc(b.tag)}</div>` : ''}<div class="cl">${esc(b.line)}</div></div>`
    tl += `tl.fromTo("#${id}-p",{opacity:0,y:80,rotate:-2,scale:0.94},{opacity:1,y:0,rotate:0,scale:1,duration:0.9,ease:"expo.out"},${(s + 0.3).toFixed(2)});
tl.to("#${id}-p",{y:-10,duration:${(b.d - 1.6).toFixed(2)},ease:"sine.inOut"},${(s + 1.2).toFixed(2)});\n` + capIn(`#${id}-c`, s + 1.1) + out(`#${id}-c`, e - 0.5)
  }
  html += `</div>\n`
})
html += `<div class="vignette"></div>${V ? '' : '<div class="bars top"></div><div class="bars bottom"></div>'}`
if (EP.music) html += `<audio id="music" src="assets/${EP.music}" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="4" data-volume="${EP.musicVolume || 0.8}"></audio>`
tl += `tl.to({}, {duration:${TOTAL}}, 0);\n`

const L = V ? {
  cap: 'left:64px;right:64px;bottom:250px', capSize: 60, side: 'left:64px;right:64px;top:180px;bottom:auto',
  phone: 'left:50%;top:auto;bottom:420px;width:620px;margin-left:-310px', chat: 'left:60px;right:60px;top:300px;width:auto',
  hook: 'left:80px;right:80px;top:640px', qt: 72, word: 76, cta: 46,
} : {
  cap: 'left:96px;bottom:128px', capSize: 52, side: 'left:96px;top:50%;bottom:auto;transform:translateY(-50%);max-width:700px',
  phone: 'right:180px;top:110px;width:520px', chat: 'right:110px;top:120px;width:600px',
  hook: 'left:180px;right:180px;top:300px', qt: 64, word: 92, cta: 44,
}
const css = `
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#0B0A08;font-family:nunito,sans-serif}
.beat{position:absolute;inset:0;opacity:0;overflow:hidden}
.beat video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.beat video.soft{filter:blur(6px) brightness(0.8);transform:scale(1.05)}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,0.45) 100%)}
.scrim.strong{background:rgba(12,8,2,0.28)}
.scrim.hookscrim{background:radial-gradient(ellipse at center,rgba(8,5,0,0.62) 0%,rgba(8,5,0,0.35) 70%)}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(10,6,0,0.4) 100%);z-index:8}
.bars{position:absolute;left:0;right:0;height:60px;background:#000;z-index:9}.bars.top{top:0}.bars.bottom{bottom:0}
.hook{position:absolute;${L.hook};text-align:center;opacity:0;z-index:6}
.hook .qm{font-weight:900;font-size:160px;line-height:0.6;color:#EDC35F}
.hook .qt{font-weight:800;font-size:${L.qt}px;line-height:1.15;color:#FFFBEE;text-shadow:0 4px 0 rgba(0,0,0,0.2),0 18px 50px rgba(0,0,0,0.7)}
.hook .qs{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:24px;letter-spacing:0.18em;text-transform:uppercase;color:#EDC35F;opacity:0}
.cap{position:absolute;${L.cap};z-index:6;opacity:0;padding:22px 30px 24px;border-radius:22px;background:rgba(20,16,10,0.44);backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);border:1px solid rgba(255,255,255,0.22);border-top-color:rgba(255,255,255,0.45);box-shadow:inset 0 1px 0 rgba(255,255,255,0.5),0 18px 50px rgba(0,0,0,0.35)}
.cap.side{${L.side}}
.cap.payoff{background:rgba(237,195,95,0.22);border-color:rgba(237,195,95,0.6)}
.cap .age{font-family:plexMono,monospace;font-weight:600;font-size:22px;letter-spacing:0.2em;text-transform:uppercase;color:#EDC35F;margin-bottom:10px}
.cap .cl{font-weight:800;font-size:${L.capSize}px;line-height:1.12;color:#FFFBEE;letter-spacing:-0.01em}
.phone{position:absolute;${L.phone};z-index:6;opacity:0;background:#F9F8F6;border:3px solid #1A1A2E;border-radius:44px;box-shadow:0 8px 0 #1A1A2E,0 40px 90px rgba(0,0,0,0.45);overflow:hidden}
.phone.screen{padding:14px}
.phone .crop{position:relative;width:100%;overflow:hidden;border-radius:32px;background:#F9F8F6}
.phone .crop img{position:absolute;left:0;width:100%}
.phone.chat{${L.chat};padding:22px 28px 30px}
.ph-head{display:flex;align-items:center;gap:12px;padding-bottom:16px;margin-bottom:18px;border-bottom:2px solid #EDE6D6;font-weight:800;font-size:28px;color:#1A1A2E}
.ph-head img{width:44px;height:44px;object-fit:contain}
.me{margin-left:70px;background:#F0F9FF;border:2px solid #1A1A2E;box-shadow:0 4px 0 #1A1A2E;border-radius:16px;padding:16px 20px;font-weight:600;font-size:30px;line-height:1.3;color:#1A1A2E;opacity:0}
.dots{display:inline-flex;gap:8px;margin-top:20px;padding:12px 18px;background:#FFF6DE;border-radius:999px;opacity:0;overflow:hidden}
.dots i{display:block;width:12px;height:12px;border-radius:50%;background:#C99A28;opacity:0.6}
.dg{margin-top:16px;font-weight:600;font-size:31px;line-height:1.35;color:#1A1A2E;opacity:0}
.end{background:#F9F8F6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.lockup{display:flex;align-items:center;gap:30px;opacity:0}
.word{font-weight:800;font-size:${L.word}px;color:#1A1A2E;letter-spacing:-0.01em}
.end .cta{margin-top:50px;font-weight:700;font-size:${L.cta}px;line-height:1.3;color:#1A1A2E;opacity:0}
.end .url{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.08em;color:#C99A28;opacity:0}
`
const outName = 'index.html' // one composition per folder; build and render each orientation in turn
writeFileSync(join(DIR, outName), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${W}, height=${H}"><title>${esc(EP.title)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-width="${W}" data-height="${H}">
${html}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`)
console.log(`${EP.title}: ${EP.beats.length} beats, ${TOTAL}s, ${V ? '9:16' : '16:9'} -> ${outName}`)
EP.beats.forEach((b, i) => console.log(`  ${b.kind.padEnd(7)} ${starts[i].toFixed(1).padStart(5)}s  ${b.d}s  ${b.clip || ''}`))
