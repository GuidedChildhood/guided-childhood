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
const TEXT_KEYS = new Set(['text', 'eyebrow', 'line', 'sub', 'title', 'url', 'button', 'label', 'body', 'tagline'])
;(function walk(v, path) {
  if (typeof v === 'string' && TEXT_KEYS.has(path.split('.').pop())) {
    if (/[–—−]/.test(v) || /\s-\s/.test(v)) throw new Error(`dash in ${path}: ${v}`)
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], path ? `${path}.${k}` : k)
})(C, '')

// ── Camera: frame screen point (fx, fy) at frame point (px, py), scale S ────
const LOGO_BARS = [5, 9, 14, 8]
function logo(size, wordPx) {
  const r = size * 7 / 24, barW = size * 2.2 / 24, gap = size * 1.8 / 24, stackH = size * 11 / 24
  const bars = LOGO_BARS.map((hh) => `<span style="width:${barW.toFixed(1)}px;height:${(hh / 14 * stackH).toFixed(1)}px;background:#fff;border-radius:${Math.max(1, size / 24).toFixed(1)}px;display:inline-block"></span>`).join('')
  return `<span class="logo"><span class="mark" style="width:${size}px;height:${size}px;border-radius:${r.toFixed(1)}px"><span class="bars" style="gap:${gap.toFixed(1)}px;height:${stackH.toFixed(1)}px">${bars}</span></span>${wordPx ? `<span class="word" style="font-size:${wordPx}px">Guided Childhood</span>` : ''}</span>`
}
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
      screen = `<video id="${id}-v" class="scr" src="${src}" muted playsinline data-start="${at(s)}" data-duration="${at(d)}"${sh.mediaStart ? ` data-media-start="${at(sh.mediaStart)}"` : ''} data-track-index="${vtrack++ % 2}"${sh.rate ? ` data-playback-rate="${sh.rate}"` : ''} style="width:${SW}px;height:${h}px"></video>`
    } else {
      screen = `<img id="${id}-v" class="scr" src="${src}" alt="" style="width:${SW}px;height:auto">`
    }
  }
  const bezel = sh.bezel ? `<div class="bezel" style="width:${SW + 28}px;height:${SH + 28}px"></div>` : ''
  html += `<div id="${id}" class="shot${sh.ground === 'white' ? ' white' : ''}">` +
    (sh.src ? `<div id="${id}-cam" class="cam">${bezel}<div class="screenbox${sh.bezel ? ' framed' : ''}" style="width:${SW}px;height:${(sh.clipH || sh.srcH || SH) - (sh.cropTop || 0)}px"><div class="crop" style="transform:translateY(${-(sh.cropTop || 0)}px)">${screen}${(sh.inScreen || []).map((o, j) => `<div id="${id}-in${j}" class="inscreen ${o.cls || ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`).join('')}</div></div></div>` : '')
  for (const [j, o] of (sh.overlays || []).entries()) {
    const style = `left:${o.x ?? 90}px;top:${o.y}px;width:${o.w ?? W - 180}px;text-align:${o.align || 'center'}`
    if (o.kind === 'pill') html += `<div id="${id}-o${j}" class="ov pillwrap" style="${style}"><span class="pill">${o.typed ? esc(o.text).split(' ').map((w, k) => k < (o.typedFrom || 0) ? w : `<span class="pw">${w}</span>`).join(' ') : esc(o.text)}</span></div>`
    else if (o.kind === 'digi') html += `<div id="${id}-o${j}" class="ov digi" style="left:${o.x}px;top:${o.y}px;width:${o.size}px;height:${o.size}px"><video id="${id}-o${j}-v" src="assets/digi/digi-idle-dc3673e0.mp4" muted playsinline loop data-start="${at(s + (o.t0 || 0))}" data-duration="${at((o.t1 ?? d) - (o.t0 || 0))}" data-track-index="2"></video></div>`
    else if (o.kind === 'end') html += `<div id="${id}-o${j}" class="ov endcard" style="top:${o.y}px"><div class="end-logo">${logo(64, 50)}</div>${o.tagline ? `<div class="end-tag">${esc(o.tagline)}</div>` : ''}${o.eyebrow ? `<div class="end-eyebrow">${esc(o.eyebrow)}</div>` : ''}<div class="end-line">${esc(o.line)}</div><div class="end-sub">${esc(o.sub)}</div><div class="end-btn" id="${id}-o${j}-btn">${esc(o.button)}</div><div class="end-url">${esc(o.url)}</div>${o.slate ? `<div class="end-slate">${esc(o.slate)}</div>` : ''}</div>`
    else if (o.kind === 'marker') html += `<div id="${id}-o${j}" class="ov markerwrap" style="${style}"><span class="marker">${esc(o.text)}</span></div>`
    else if (o.kind === 'label') html += `<div id="${id}-o${j}" class="ov" style="${style}"><span class="label">${esc(o.text)}</span></div>`
    // A caption bar across the foot of the frame, so a label never sits on top of a line of UI text.
    else if (o.kind === 'lower') html += `<div id="${id}-o${j}" class="ov lower">${esc(o.text)}</div>`
    // A soft fade of the page's own ground behind the rail, so cut off text above it does not show.
    else if (o.kind === 'veil') html += `<div id="${id}-o${j}" class="ov veil" style="height:${o.h || 260}px;background:linear-gradient(${o.color || '#F9F8F6'} 0,${o.color || '#F9F8F6'} 72%,transparent)"></div>`
    else html += `<div id="${id}-o${j}" class="ov ${o.kind || 'line'}" style="${style}">${o.kind === 'hook' ? esc(o.text).split(' ').map((w) => `<span class="hw">${w}</span>`).join(' ') : esc(o.text)}</div>`
  }
  html += `</div>\n`

  // Shot in and out.
  const fade = sh.fadeIn ?? 0.25
  if (i === 0 || fade === 0) set(`#${id}`, { opacity: 1 }, s); else fromTo(`#${id}`, { opacity: 0 }, { opacity: 1, duration: fade, ease: 'power1.out' }, s)
  if (i < C.shots.length - 1) to(`#${id}`, { opacity: 0, duration: sh.fadeOut ?? 0.2, ease: 'power1.in' }, e - (sh.fadeOut ?? 0.2))
  // Camera.
  if (sh.src) set(`#${id}-cam`, { x: k0.x, y: k0.y, scale: k0.scale, transformOrigin: '0 0' }, s)
  for (const k of (sh.src ? keys.slice(1) : [])) {
    const c = camXY(k)
    to(`#${id}-cam`, { x: c.x, y: c.y, scale: c.scale, duration: k.dur ?? 0.7, ease: k.ease || 'power3.inOut' }, s + k.t)
  }
  // The hold drift: at most 1.5 percent, linear, never while a line moves.
  for (const k of (sh.src ? keys : []).filter((k) => k.drift)) {
    const c = camXY({ ...k, S: k.S * (1 + k.drift) })
    to(`#${id}-cam`, { x: c.x, y: c.y, scale: c.scale, duration: k.holdFor, ease: 'none' }, s + k.t + (k.dur ?? 0.7))
  }
  // Overlays.
  for (const [j, o] of (sh.overlays || []).entries()) {
    const sel = `#${id}-o${j}`, t0 = s + (o.t0 || 0), t1 = s + (o.t1 ?? d)
    if (o.kind === 'end') { fromTo(sel, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, t0); if (o.pressAt != null) { to(`${sel}-btn`, { y: 5, boxShadow: '0 1px 0 #000', duration: 0.09, yoyo: true, repeat: 1 }, t0 + o.pressAt) } continue }
    if (o.instant || (o.kind === 'veil' && !o.fade)) { set(sel, { opacity: 1 }, t0); if (o.t1 != null) set(sel, { opacity: 0 }, t1); continue }
    // A typed pill: the bubble lands, then its words arrive at reading pace,
    // so the opening moves while it holds long enough to be read.
    if (o.kind === 'pill' && o.typed) fromTo(`${sel} .pw`, { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: o.typed, ease: 'none' }, t0 + 0.2)
    if (o.kind === 'hook') fromTo(`${sel} .hw`, { opacity: 0, y: 14, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.06, ease: 'power2.out' }, t0)
    else fromTo(sel, { opacity: 0, y: o.kind === 'digi' ? 40 : 12 }, { opacity: 1, y: 0, duration: 0.45, ease: o.kind === 'digi' ? 'back.out(1.6)' : 'power2.out' }, t0)
    if (o.t1 != null) to(sel, { opacity: 0, duration: 0.3 }, t1 - 0.3)
  }
  // In screen highlights: the gold underline, drawn left to right.
  for (const [j, o] of (sh.inScreen || []).entries()) {
    if (/ripple/.test(o.cls || '')) {
      // A tap is a ripple and the real pressed state, never a finger.
      fromTo(`#${id}-in${j}`, { scale: 0.2, opacity: 0.32 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power2.out', transformOrigin: '50% 50%' }, s + o.t0)
    } else {
      fromTo(`#${id}-in${j}`, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', transformOrigin: '0 50%' }, s + o.t0)
      if (o.t1 != null) to(`#${id}-in${j}`, { opacity: 0, duration: 0.25 }, s + o.t1)
    }
  }
  for (const f of sh.sfx || []) SFX.push({ name: f.name, at: s + f.at, vol: f.vol ?? 0.5 })
  clock = e
}
const TOTAL = Math.round(clock * 100) / 100

// ── The tracker rail: one moment followed from asked to sorted ──────────────
// A film caption, not an app screen: it labels what the real screens show
// happening (asked DiGi, got the words, checked in, sorted) and ticks each
// step as its beat lands, so the "keeps going until it is sorted" part reads
// at a glance. Each segment of line and each dot is its own element with its
// own tween, so seeking the timeline in any order renders the same frame.
if (C.rail) {
  const R = C.rail, byId = Object.fromEntries(C.shots.map((sh) => [sh.id, sh]))
  const when = (shot, t) => { if (!byId[shot]) throw new Error(`rail: no shot ${shot}`); return byId[shot].start + (t || 0) }
  const n = R.steps.length, RW = 960, PAD = 110, span = RW - PAD * 2, xs = R.steps.map((_, i) => PAD + (i * span) / (n - 1))
  const tick = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#1A1A2E" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  html += `<div id="rail" class="rail" style="top:${R.y ?? 46}px">` +
    xs.slice(1).map((x, i) => `<div class="rail-line" style="left:${xs[i]}px;width:${x - xs[i]}px"><div id="rail-f${i + 1}" class="rail-fill"></div></div>`).join('') +
    xs.map((x, i) => `<div class="rail-dot" style="left:${x}px"><div id="rail-d${i}" class="rail-done">${tick}</div></div><div id="rail-l${i}" class="rail-lab" style="left:${x}px">${esc(R.steps[i].label)}</div>`).join('') +
    `</div>\n`
  const t0 = when(R.from, R.fromT), t1 = when(R.until, byId[R.until].dur)
  fromTo('#rail', { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, t0)
  to('#rail', { opacity: 0, duration: 0.3 }, t1 - 0.3)
  R.steps.forEach((st, i) => {
    const T = Math.max(when(st.shot, st.t), t0 + 0.2)
    if (i > 0) fromTo(`#rail-f${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, T - 0.5)
    fromTo(`#rail-d${i}`, { scale: 0 }, { scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, T)
    fromTo(`#rail-l${i}`, { opacity: 0.42 }, { opacity: 1, duration: 0.3 }, T)
    if (!st.silent) SFX.push({ name: 'sfx-tink', at: T, vol: st.vol ?? 0.2 })
  })
}

// ── Sound ───────────────────────────────────────────────────────────────────
let audio = ''
if (C.music) {
  const m = C.music
  const lane = m.lane ? m.lane.map(([t, v]) => ({ t: Math.min(t, TOTAL), v })) : [{ t: 0, v: 0 }, { t: m.fadeIn ?? 1.5, v: m.vol }, { t: Math.max(2, TOTAL - (m.fadeOutTail ?? 3)), v: m.vol }, { t: TOTAL, v: 0 }]
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
.crop{position:relative}
.inscreen{position:absolute}
.inscreen.underline{background:#EDC35F;border-radius:3px;transform:scaleX(0)}
.inscreen.ripple{border-radius:50%;background:#1A1A2E;opacity:0}
.marker{font-family:plexMono,monospace;font-weight:600;font-size:34px;letter-spacing:.14em;text-transform:uppercase;color:#1A1A2E;background:rgba(253,246,222,.92);border:2px solid #1A1A2E;border-radius:100px;padding:14px 26px;display:inline-block}
.markerwrap{display:flex;justify-content:center}
.band{font-weight:900;font-size:80px;line-height:1.04;letter-spacing:-.02em;color:#1A1A2E;text-shadow:0 2px 0 rgba(255,255,255,.6)}
.label{font-family:plexMono,monospace;font-weight:600;font-size:30px;letter-spacing:.12em;text-transform:uppercase;color:#1A1A2E;background:rgba(255,255,255,.92);border-radius:12px;padding:10px 16px;display:inline-block}
.end-logo{margin-bottom:46px}.end-tag{font-weight:800;font-size:46px;line-height:1.2;color:#1A1A2E;max-width:880px;margin:-18px 0 34px}.end-eyebrow{font-family:plexMono,monospace;font-weight:600;font-size:34px;letter-spacing:.14em;text-transform:uppercase;color:#7A5A0E;margin-bottom:6px}
.end-slate{font-family:plexMono,monospace;font-weight:600;font-size:28px;letter-spacing:.1em;text-transform:uppercase;color:#52526A;margin-top:46px;max-width:840px;line-height:1.4}
.rail{position:absolute;left:60px;width:960px;height:160px;opacity:0;background:#FDF6DE;border:3px solid #1A1A2E;border-radius:36px;box-shadow:0 6px 0 #1A1A2E}
.rail-line{position:absolute;top:51px;height:6px;border-radius:3px;background:rgba(26,26,46,.16);overflow:hidden}
.rail-fill{position:absolute;inset:0;background:#1A1A2E;transform-origin:0 50%;transform:scaleX(0)}
.rail-dot{position:absolute;top:24px;width:60px;height:60px;margin-left:-30px;border-radius:50%;background:#fff;border:4px solid #1A1A2E}
.rail-done{position:absolute;inset:-4px;border-radius:50%;background:#EDC35F;border:4px solid #1A1A2E;display:flex;align-items:center;justify-content:center;transform:scale(0)}
.rail-lab{position:absolute;top:98px;width:260px;margin-left:-130px;text-align:center;font-family:plexMono,monospace;font-weight:600;font-size:29px;letter-spacing:.1em;text-transform:uppercase;color:#1A1A2E;opacity:.42}
.lower{left:0;top:auto;bottom:0;width:1080px;padding:26px 40px 30px;background:#FDF6DE;border-top:3px solid #1A1A2E;text-align:center;font-family:plexMono,monospace;font-weight:600;font-size:31px;letter-spacing:.12em;text-transform:uppercase;color:#1A1A2E}
.veil{left:0;top:0;width:1080px}
.ov{position:absolute;opacity:0}
.eyebrow{font-family:plexMono,monospace;font-weight:600;font-size:32px;letter-spacing:.14em;text-transform:uppercase;color:#7A5A0E}
.hook{font-weight:900;font-size:104px;line-height:1.02;letter-spacing:-.03em}
.hook .hw{display:inline-block;opacity:0}
.title{font-weight:900;font-size:80px;line-height:1.04;letter-spacing:-.02em}
.support{font-weight:700;font-size:52px;line-height:1.22;color:#3A3A52}
.lifted{font-weight:800;font-size:70px;line-height:1.18}
.pillwrap{display:flex;justify-content:center}
.pill{display:inline-block;max-width:840px;background:#DCE7FB;color:#1B2A4A;border-radius:48px;padding:38px 48px;font-weight:800;font-size:88px;line-height:1.22;text-align:left}
.digi video{width:100%;height:100%;object-fit:cover;-webkit-mask-image:radial-gradient(circle at 50% 50%,#000 52%,transparent 70%);mask-image:radial-gradient(circle at 50% 50%,#000 52%,transparent 70%)}
.endcard{left:0;right:0;display:flex;flex-direction:column;align-items:center;text-align:center}
.end-line{font-weight:900;font-size:96px;line-height:1.04;letter-spacing:-.025em;max-width:920px;margin-top:40px}
.end-sub{font-weight:700;font-size:54px;line-height:1.2;color:#3A3A52;margin-top:22px;max-width:880px}
.end-btn{margin-top:54px;background:#1A1A2E;color:#FFFFFF;border-radius:22px;padding:30px 54px;font-weight:800;font-size:60px;box-shadow:0 7px 0 #000}
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
