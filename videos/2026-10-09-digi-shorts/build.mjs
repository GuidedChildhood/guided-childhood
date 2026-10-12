#!/usr/bin/env node
// The DiGi shorts engine. Builds index.html (HyperFrames, one paused GSAP
// timeline) from a cut file: node build.mjs cuts/<name>.json
//
// The idea: the product is never redrawn. Every phone screen is a real
// recording (tools/record.mjs) or a real capture (tools/capture.mjs) of the
// live component, laid on a "screen" layer 390 CSS px wide. A camera frames
// any point of that screen at a scale S (film px per screen px), so a 17 px
// line of UI reads at 44 to 72 px on a 1080 wide vertical frame, which is the
// UX lens's readability rule. The camera moves, then holds still while a line
// is read. Text overlays are only for the hook, eyebrows and the end card.
//
// Guards: no dash in any on screen string, no gold text, every shot's screen
// source exists, and the cut's runtime is the sum of its shots.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const CUT = process.argv[2]; if (!CUT) { console.error('usage: node build.mjs cuts/<name>.json [--half]'); process.exit(1) }
const HALF = process.argv.includes('--half')
const C = JSON.parse(readFileSync(CUT, 'utf8'))
const W = C.w || 1080, H = C.h || 1920
const SW = 390, SH = C.screenH || 844
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))
const J = (o) => JSON.stringify(o)
const TL = []; const SFX = []
const at = (x) => Number(x).toFixed(3)
const fromTo = (sel, a, b, t) => TL.push(`tl.fromTo(${J(sel)},${J(a)},${J(b)},${at(t)});`)
const to = (sel, b, t) => TL.push(`tl.to(${J(sel)},${J(b)},${at(t)});`)
const set = (sel, a, t) => TL.push(`tl.set(${J(sel)},${J(a)},${at(t)});`)

// ── Guards ──────────────────────────────────────────────────────────────────
const TEXT_KEYS = new Set(['text', 'eyebrow', 'line', 'sub', 'title', 'url', 'button', 'label', 'body'])
;(function walk(v, path) {
  if (typeof v === 'string' && TEXT_KEYS.has(path.split('.').pop())) {
    if (/[–—−]/.test(v) || /\s-\s/.test(v)) throw new Error(`dash in ${path}: ${v}`)
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], path ? `${path}.${k}` : k)
})(C, '')

// ── Camera: frame screen point (fx, fy) at frame point (px, py), scale S ────
const camXY = (k) => ({ x: (k.px ?? W / 2) - k.fx * k.S, y: (k.py ?? H / 2) - k.fy * k.S, scale: k.S })

let clock = 0, html = '', vtrack = 0
for (const [i, sh] of C.shots.entries()) {
  const id = sh.id || `s${i}`
  const s = clock, d = sh.dur, e = s + d
  sh.start = s
  const keys = sh.cam || [{ t: 0, S: 2.6, fx: SW / 2, fy: SH / 2 }]
  const k0 = camXY(keys[0])
  let screen = ''
  if (sh.src) {
    const src = `assets/${sh.src}`
    if (!existsSync(new URL(src, import.meta.url))) throw new Error(`missing screen source ${src}`)
    const h = sh.srcH || SH
    if (/\.(mp4|webm|mov)$/.test(sh.src)) {
      screen = `<video id="${id}-v" class="scr" src="${src}" muted playsinline data-start="${at(s)}" data-duration="${at(d)}"${sh.mediaStart ? ` data-media-start="${at(sh.mediaStart)}"` : ''} data-track-index="${vtrack++ % 2}" style="width:${SW}px;height:${h}px"></video>`
    } else {
      screen = `<img id="${id}-v" class="scr" src="${src}" alt="" style="width:${SW}px;height:auto">`
    }
  }
  const bezel = sh.bezel ? `<div class="bezel" style="width:${SW + 28}px;height:${SH + 28}px"></div>` : ''
  html += `<div id="${id}" class="shot${sh.ground === 'white' ? ' white' : ''}">` +
    `<div id="${id}-cam" class="cam">${bezel}<div class="screenbox${sh.bezel ? ' framed' : ''}" style="width:${SW}px;height:${sh.clipH || SH}px">${screen}${(sh.inScreen || []).map((o, j) => `<div id="${id}-in${j}" class="inscreen ${o.cls || ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`).join('')}</div></div>`
  for (const [j, o] of (sh.overlays || []).entries()) {
    const style = `left:${o.x ?? 90}px;top:${o.y}px;width:${o.w ?? W - 180}px;text-align:${o.align || 'center'}`
    if (o.kind === 'pill') html += `<div id="${id}-o${j}" class="ov pillwrap" style="${style}"><span class="pill">${esc(o.text)}</span></div>`
    else if (o.kind === 'digi') html += `<div id="${id}-o${j}" class="ov digi" style="left:${o.x}px;top:${o.y}px;width:${o.size}px;height:${o.size}px"><video id="${id}-o${j}-v" src="assets/digi/digi-idle-dc3673e0.mp4" muted playsinline loop data-start="${at(s + (o.t0 || 0))}" data-duration="${at((o.t1 ?? d) - (o.t0 || 0))}" data-track-index="2"></video></div>`
    else if (o.kind === 'end') html += `<div id="${id}-o${j}" class="ov endcard" style="top:${o.y}px">${C.logoHtml || ''}<div class="end-line">${esc(o.line)}</div><div class="end-sub">${esc(o.sub)}</div><div class="end-btn">${esc(o.button)}</div><div class="end-url">${esc(o.url)}</div></div>`
    else html += `<div id="${id}-o${j}" class="ov ${o.kind || 'line'}" style="${style}">${o.kind === 'hook' ? esc(o.text).split(' ').map((w) => `<span class="hw">${w}</span>`).join(' ') : esc(o.text)}</div>`
  }
  html += `</div>\n`

  // Shot in and out.
  const fade = sh.fadeIn ?? 0.25
  if (i === 0) set(`#${id}`, { opacity: 1 }, s); else fromTo(`#${id}`, { opacity: 0 }, { opacity: 1, duration: fade, ease: 'power1.out' }, s)
  if (i < C.shots.length - 1) to(`#${id}`, { opacity: 0, duration: sh.fadeOut ?? 0.2, ease: 'power1.in' }, e - (sh.fadeOut ?? 0.2))
  // Camera.
  set(`#${id}-cam`, { x: k0.x, y: k0.y, scale: k0.scale, transformOrigin: '0 0' }, s)
  for (const k of keys.slice(1)) {
    const c = camXY(k)
    to(`#${id}-cam`, { x: c.x, y: c.y, scale: c.scale, duration: k.dur ?? 0.7, ease: k.ease || 'power3.inOut' }, s + k.t)
  }
  // The hold drift: at most 1.5 percent, linear, never while a line moves.
  for (const k of keys.filter((k) => k.drift)) {
    const c = camXY({ ...k, S: k.S * (1 + k.drift) })
    to(`#${id}-cam`, { x: c.x, y: c.y, scale: c.scale, duration: k.holdFor, ease: 'none' }, s + k.t + (k.dur ?? 0.7))
  }
  // Overlays.
  for (const [j, o] of (sh.overlays || []).entries()) {
    const sel = `#${id}-o${j}`, t0 = s + (o.t0 || 0), t1 = s + (o.t1 ?? d)
    if (o.kind === 'hook') fromTo(`${sel} .hw`, { opacity: 0, y: 14, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.06, ease: 'power2.out' }, t0)
    else fromTo(sel, { opacity: 0, y: o.kind === 'digi' ? 40 : 12 }, { opacity: 1, y: 0, duration: 0.45, ease: o.kind === 'digi' ? 'back.out(1.6)' : 'power2.out' }, t0)
    if (o.t1 != null) to(sel, { opacity: 0, duration: 0.3 }, t1 - 0.3)
  }
  // In screen highlights: the gold underline, drawn left to right.
  for (const [j, o] of (sh.inScreen || []).entries()) {
    fromTo(`#${id}-in${j}`, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', transformOrigin: '0 50%' }, s + o.t0)
    if (o.t1 != null) to(`#${id}-in${j}`, { opacity: 0, duration: 0.25 }, s + o.t1)
  }
  for (const f of sh.sfx || []) SFX.push({ name: f.name, at: s + f.at, vol: f.vol ?? 0.5 })
  clock = e
}
const TOTAL = Math.round(clock * 100) / 100

// ── Sound ───────────────────────────────────────────────────────────────────
let audio = ''
if (C.music) {
  const m = C.music
  const lane = [{ t: 0, v: 0 }, { t: m.fadeIn ?? 1.5, v: m.vol }, { t: Math.max(2, TOTAL - (m.fadeOutTail ?? 3)), v: m.vol }, { t: TOTAL, v: 0 }]
  audio += `<audio id="music" src="assets/${m.file}" data-audio-group="music" data-start="0" data-duration="${at(TOTAL)}"${m.mediaStart ? ` data-media-start="${at(m.mediaStart)}"` : ''} data-track-index="4" data-automation='${J({ version: 1, lanes: [{ target: 'volume', points: lane }] })}'></audio>\n`
}
const SFX_DUR = { 'sfx-send': 0.42, 'sfx-pop': 0.16, 'sfx-tap': 0.05, 'sfx-dots': 0.7, 'sfx-chime': 1.4, 'sfx-tink': 0.73, 'sfx-whoosh': 0.6, 'sfx-land': 0.3, 'sfx-notify': 0.51, 'sfx-shimmer': 0.9 }
SFX.sort((a, b) => a.at - b.at).forEach((c, i) => {
  audio += `<audio id="sfx-${i + 1}" src="assets/sfx/${c.name}.mp3" data-audio-group="sfx" data-start="${at(c.at)}" data-duration="${SFX_DUR[c.name] || 1}" data-track-index="${5 + (i % 4)}" data-volume="${c.vol}"></audio>\n`
})

const OW = HALF ? W / 2 : W, OH = HALF ? H / 2 : H
const page = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${OW}, height=${OH}">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${OW}px;height:${OH}px;overflow:hidden;background:#FDF6DE}
#root{position:relative;width:${OW}px;height:${OH}px;overflow:hidden}
#stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;transform:scale(${HALF ? 0.5 : 1});transform-origin:0 0;font-family:nunito,sans-serif;color:#1A1A2E;-webkit-font-smoothing:antialiased}
/* The home page's own hero ground, from app/page.tsx */
.ground{position:absolute;inset:0;background:radial-gradient(ellipse 90% 130% at 88% 45%,#FAEDC2,#FDF6DE 42%,#FFFBEE 72%)}
.shot{position:absolute;inset:0;opacity:0;overflow:hidden}
.shot.white{background:#fff}
.cam{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.screenbox{position:relative;overflow:hidden;background:#fff;box-shadow:0 40px 90px rgba(122,90,14,0.22)}
.screenbox.framed{border-radius:44px;position:absolute;left:14px;top:14px}
.bezel{position:absolute;left:0;top:0;border-radius:58px;background:#0E0E12;box-shadow:0 40px 90px rgba(122,90,14,0.28),inset 0 0 0 2px #2b2b34}
.scr{display:block}
.inscreen.underline{position:absolute;background:#EDC35F;border-radius:3px;transform:scaleX(0)}
.ov{position:absolute;opacity:0}
.eyebrow{font-family:plexMono,monospace;font-weight:600;font-size:32px;letter-spacing:.14em;text-transform:uppercase;color:#7A5A0E}
.hook{font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.03em}
.hook .hw{display:inline-block;opacity:0}
.title{font-weight:900;font-size:80px;line-height:1.04;letter-spacing:-.02em}
.support{font-weight:700;font-size:52px;line-height:1.22;color:#3A3A52}
.lifted{font-weight:800;font-size:70px;line-height:1.18}
.pillwrap{display:flex;justify-content:center}
.pill{display:inline-block;max-width:900px;background:#DCE7FB;color:#1B2A4A;border-radius:44px;padding:30px 40px;font-weight:800;font-size:72px;line-height:1.3;text-align:left}
.digi video{width:100%;height:100%;object-fit:cover;-webkit-mask-image:radial-gradient(circle at 50% 50%,#000 52%,transparent 70%);mask-image:radial-gradient(circle at 50% 50%,#000 52%,transparent 70%)}
.endcard{left:0;right:0;display:flex;flex-direction:column;align-items:center;text-align:center}
.end-line{font-weight:900;font-size:96px;line-height:1.04;letter-spacing:-.025em;max-width:920px;margin-top:40px}
.end-sub{font-weight:700;font-size:56px;color:#3A3A52;margin-top:22px}
.end-btn{margin-top:54px;background:#EDC35F;border-radius:22px;padding:30px 54px;font-weight:800;font-size:60px;box-shadow:0 7px 0 #C99A28}
.end-url{font-family:plexMono,monospace;font-weight:600;font-size:42px;letter-spacing:.06em;color:#3A3A52;margin-top:34px}
.logo{display:inline-flex;align-items:center;gap:30px}.logo .mark{display:inline-flex;align-items:center;justify-content:center;background:#EDC35F}.logo .bars{display:inline-flex;align-items:flex-end}.logo .word{font-weight:800;letter-spacing:-.02em;white-space:nowrap}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${at(TOTAL)}" data-width="${OW}" data-height="${OH}" data-fps="30">
<div id="stage"><div class="ground"></div>
${html}</div>
${audio}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${TL.join('\n')}
</script></body></html>`
writeFileSync(new URL('./index.html', import.meta.url), page)
console.log(`built ${C.shots.length} shots, ${TOTAL}s, ${SFX.length} sound cues, ${OW}x${OH}`)
C.shots.forEach((sh) => console.log(`  ${(sh.id || '').padEnd(14)} ${sh.start.toFixed(1).padStart(5)}s  ${sh.dur.toFixed(1)}s`))
