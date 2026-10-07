#!/usr/bin/env node
// Builds index.html from beats.json. Two columns on one clock: the child's
// brain left to the feed (left) and DiGi on the same minutes (right).
// Readability rule (Justin, 6 October 2026): big text, few words, held long
// enough to read. Hold = max(minHold, words / 2.2 + 1.5) seconds. The build
// refuses a card over the word cap or any dash in copy.
import { readFileSync, writeFileSync } from 'node:fs'
const B = JSON.parse(readFileSync(new URL('./beats.json', import.meta.url), 'utf8'))
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const esc = (s) => String(s || '').replace(/[&<>]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))
const mark = (text, phrase) => {
  const t = esc(text || ''); if (!phrase) return t
  const p = esc(phrase); const i = t.indexOf(p); if (i < 0) throw new Error(`mark "${phrase}" not in "${text}"`)
  return t.slice(0, i) + `<span class="mk"><i></i><b>${p}</b></span>` + t.slice(i + p.length)
}
const span = (s, cls) => (s || '').split(/\s+/).filter(Boolean).map((w) => `<span class="${cls}">${esc(w)}</span>`).join('\n')
for (const beat of B.beats) for (const side of ['left', 'right']) {
  const c = beat[side]; if (!c) continue
  for (const k of ['head', 'body', 'tag']) if (/[–—-]/.test(c[k] || '') && !/^[A-Za-z]+-[a-z]+$/.test(c[k] || '')) throw new Error(`dash in ${side} ${k} of beat ${beat.id}: ${c[k]}`)
  if (words(c.head) > B.rules.maxHeadWords) throw new Error(`headline over ${B.rules.maxHeadWords} words in ${side} of ${beat.id}`)
  if (words(c.body) > B.rules.maxBodyWords) throw new Error(`body over ${B.rules.maxBodyWords} words in ${side} of ${beat.id}`)
}
let t = 0
const starts = B.beats.map((beat) => {
  // Both cards must be read, one after the other, so the hold covers the sum.
  const wl = beat.left ? words(beat.left.head) + words(beat.left.body) : 0
  const wr = beat.right ? words(beat.right.head) + words(beat.right.body) : 0
  const hold = Math.max(beat.hold || B.rules.minHold, (wl + wr) / B.rules.wordsPerSecond + 1.5)
  beat.rightDelay = beat.rightDelay ?? Math.max(1.6, wl / B.rules.wordsPerSecond * 0.6 + 0.8)
  const s = t; t += hold; return { s, d: hold }
})
const total = Math.ceil(t * 2) / 2
let html = '', tl = ''
B.beats.forEach((beat, i) => {
  const { s, d } = starts[i]
  const track = i % 2
  const L = beat.left, R = beat.right
  html += `<div id="${beat.id}" class="beat${beat.cta ? ' cta' : ''}">`
  if (beat.cta) {
    html += `<div class="field"></div><div class="eyebrow eyebrow-top">GUIDED CHILDHOOD</div><img id="${beat.id}-star" class="star" src="assets/digi-cut.png" alt=""><div class="headline big">${esc(beat.head)}</div><div class="subline big">${esc(beat.body)}</div><div class="url">${esc(beat.url)}</div>`
  } else {
    html += `<div class="col left">`
    if (L.video) html += `<video id="${beat.id}-lv" src="assets/${L.video}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-track-index="${track}" style="transform-origin:${L.zoom || '50% 50%'}"></video>`
    if (L.hl) {
      const h = L.hl
      html += `<div class="hl ${h.shape}" id="${beat.id}-hl" style="left:${h.l}%;top:${h.t}%;width:${h.w}%;height:${h.h}%"></div><div class="ptr" id="${beat.id}-ptr" style="left:${h.l + h.w / 2}%;top:${h.t + h.h}%"></div>`
    }
    html += `<div class="card" id="${beat.id}-lc">${L.tag ? `<div class="tag">${esc(L.tag)}</div>` : ''}<div class="headline">${mark(L.head, L.mark)}</div>${L.body ? `<div class="body">${esc(L.body)}</div>` : ''}${L.src ? `<div class="src">${esc(L.src)}</div>` : ''}</div></div>`
    html += `<div class="col right">`
    if (R.video) html += `<video id="${beat.id}-rv" src="assets/${R.video}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-track-index="${track + 2}"></video>`
    else html += `<div class="cream"></div><img class="digi ${R.digi || 'corner'}" src="assets/digi-cut.png" alt="">`
    html += `<div class="card ${R.kind || ''}" id="${beat.id}-rc">${R.tag ? `<div class="tag">${esc(R.tag)}</div>` : ''}<div class="headline">${mark(R.head, R.mark)}</div>${R.body ? `<div class="body">${esc(R.body)}</div>` : ''}${R.src ? `<div class="src">${esc(R.src)}</div>` : ''}</div></div>`
    html += `<div class="divider"></div><div class="clock"><span class="clk">${esc(beat.clock)}</span></div><div class="colhead lh">LEFT TO THE FEED</div><div class="colhead rh">WITH DIGI</div>`
  }
  html += `</div>\n`
  const e = s + d
  tl += `tl.fromTo("#${beat.id}",{opacity:0},{opacity:1,duration:0.5,ease:"power2.out"},${s.toFixed(2)});\n`
  tl += `tl.to("#${beat.id}",{opacity:0,duration:0.4,ease:"power2.in"},${(e - 0.4).toFixed(2)});\n`
  if (beat.cta) {
    tl += `tl.fromTo("#${beat.id} .headline.big",{y:18,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + 0.5).toFixed(2)});\ntl.fromTo("#${beat.id} .subline.big",{y:10,opacity:0},{y:0,opacity:1,duration:0.5,ease:"power3.out"},${(s + 1.3).toFixed(2)});\ntl.fromTo("#${beat.id} .url",{y:10,opacity:0},{y:0,opacity:1,duration:0.4},${(s + 2.2).toFixed(2)});\n`
  } else {
    const zoomTo = L.zoomTo || (L.hl ? 1.18 : 1.08)
    tl += `tl.fromTo("#${beat.id} video",{scale:1},{scale:${zoomTo},duration:${d.toFixed(2)},ease:"power1.inOut"},${s.toFixed(2)});\n`
    tl += `tl.fromTo("#${beat.id} .clock",{scale:0.6,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"back.out(2.2)"},${(s + 0.1).toFixed(2)});\n`
    tl += `tl.fromTo("#${beat.id} .divider",{scaleY:0},{scaleY:1,duration:0.5,ease:"power3.out",transformOrigin:"50% 0%"},${s.toFixed(2)});\n`
    if (L.hl) {
      const hs = s + (L.hlAt ?? 1.0)
      tl += `tl.fromTo("#${beat.id}-hl",{scale:1.35,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"back.out(1.8)"},${hs.toFixed(2)});\n`
      tl += `tl.to("#${beat.id}-hl",{boxShadow:"0 0 46px rgba(212,96,10,0.55)",duration:0.7,ease:"sine.inOut",yoyo:true,repeat:${Math.max(1, Math.floor((d - 2) / 0.7))}},${(hs + 0.4).toFixed(2)});\n`
      tl += `tl.fromTo("#${beat.id}-ptr",{height:0,opacity:0},{height:"${Math.max(6, 100 - (L.hl.t + L.hl.h) - 44)}%",opacity:1,duration:0.5,ease:"power2.out"},${(hs + 0.3).toFixed(2)});\n`
    }
    if (L.mark) tl += `tl.to("#${beat.id}-lc .mk i",{scaleX:1,duration:0.45,ease:"power2.out"},${(s + 1.3).toFixed(2)});\n`
    tl += `tl.fromTo("#${beat.id}-lc",{y:28,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + 0.4).toFixed(2)});\n`
    const rd = beat.rightDelay ?? 1.6
    tl += `tl.fromTo("#${beat.id}-rc",{y:28,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + rd).toFixed(2)});\n`
    if (R.mark) tl += `tl.to("#${beat.id}-rc .mk i",{scaleX:1,duration:0.45,ease:"power2.out"},${(s + rd + 0.7).toFixed(2)});\n`
  }
})
// Sound. The score runs the whole film with a fade in, a dip under the
// morning so the birdsong reads, and a fade out. Effects sit on their beats.
let audio = ''
if (B.music) {
  const m = B.music, fadeOut = total - 3.5
  const morning = starts[B.beats.findIndex((b) => b.id === 's6')]
  const lane = [{ t: 0, v: 0 }, { t: 1.8, v: m.vol }, { t: morning.s - 0.5, v: m.vol }, { t: morning.s + 1.2, v: m.vol * 0.6 }, { t: morning.s + morning.d - 1, v: m.vol * 0.6 }, { t: morning.s + morning.d + 1, v: m.vol }, { t: fadeOut, v: m.vol }, { t: total, v: 0 }]
  audio += `<audio id="music" src="assets/${m.file}" data-audio-group="music" data-start="0" data-duration="${total.toFixed(2)}" data-track-index="4" data-automation='${JSON.stringify({ version: 1, lanes: [{ target: 'volume', points: lane }] })}'></audio>\n`
}
let sfxN = 0
B.beats.forEach((beat, i) => {
  const cues = [...(beat.sfx || [])]
  if (i > 0) cues.push({ file: 'sfx-whoosh.mp3', at: 0, vol: 0.55 })
  if (beat.left && beat.left.hl) cues.push({ file: 'sfx-pulse.mp3', at: beat.left.hlAt ?? 1.0, vol: 0.6 })
  if (beat.left && beat.left.mark) cues.push({ file: 'sfx-marker.mp3', at: 1.3, vol: 0.35 })
  if (beat.right && beat.right.mark) cues.push({ file: 'sfx-marker.mp3', at: 'rightmark', vol: 0.35 })
  if (beat.cta) cues.push({ file: 'sfx-riser.mp3', at: -2.4, vol: 0.5 })
  for (const f of cues) {
    const at = f.at === 'right' ? beat.rightDelay : f.at === 'rightmark' ? beat.rightDelay + 0.7 : f.at
    const dur = { 'sfx-tv-on.mp3': 3, 'sfx-countdown.mp3': 2, 'sfx-clock.mp3': 5, 'sfx-morning.mp3': 5, 'sfx-chime.mp3': 2, 'sfx-whoosh.mp3': 2, 'sfx-pulse.mp3': 2, 'sfx-riser.mp3': 3, 'sfx-marker.mp3': 1 }[f.file] || 3
    if (starts[i].s + at < 0) continue
    audio += `<audio id="sfx-${++sfxN}" src="assets/${f.file}" data-audio-group="sfx" data-start="${(starts[i].s + at).toFixed(2)}" data-duration="${dur}" data-track-index="${5 + (sfxN % 4)}" data-volume="${f.vol}"></audio>\n`
  }
})
const page = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:#1A1A2E;container-type:size;font-family:nunito,sans-serif;color:#1A1A2E}
.beat{position:absolute;inset:0;opacity:0;overflow:hidden}
.col{position:absolute;top:0;bottom:0;width:50%;overflow:hidden}
.col.left{left:0;background:#0F1322}.col.right{right:0;background:#FFFBEE}
.col video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform-origin:50% 50%}
.cream{position:absolute;inset:0;background:#FFFBEE}
.digi{position:absolute;object-fit:contain}
.digi.corner{right:3cqw;top:11cqh;width:13cqw;height:13cqw}
.digi.big{left:50%;transform:translateX(-50%);top:12cqh;width:22cqw;height:22cqw}
.divider{position:absolute;left:50%;top:0;bottom:0;width:6px;margin-left:-3px;background:#1A1A2E}
.clock{position:absolute;left:50%;top:3.2cqh;transform:translateX(-50%);background:#EDC35F;color:#1A1A2E;border:3px solid #1A1A2E;border-radius:14px;box-shadow:0 5px 0 #C99A28;padding:0.55cqw 1.4cqw;font-family:plexMono,monospace;font-weight:600;font-size:1.6cqw;letter-spacing:0.12em;text-transform:uppercase;z-index:3}
.colhead{position:absolute;top:4.4cqh;font-family:plexMono,monospace;font-weight:600;font-size:1.05cqw;letter-spacing:0.18em;text-transform:uppercase;z-index:3}
.colhead.lh{left:3cqw;color:#FFFBEE;opacity:0.85}.colhead.rh{right:3cqw;color:#52526A}
.card{position:absolute;left:3cqw;right:3cqw;bottom:6cqh;padding:1.9cqw 2.2cqw 2.1cqw;background:rgba(255,251,238,0.96);border:3px solid #1A1A2E;border-radius:22px;box-shadow:0 6px 0 #C99A28;opacity:0}
.col.right .card{background:#FFFBEE}
.col.right .card.answer{background:#1A1A2E;color:#FFFBEE;border-color:#1A1A2E;box-shadow:0 6px 0 #C99A28}
.col.right .card.answer .headline{color:#FFFBEE}.col.right .card.answer .body{color:#E8DFC8}.col.right .card.answer .tag{color:#F6DC8A}.col.right .card.answer .src{color:#F0EADA}
.tag{font-family:plexMono,monospace;font-weight:600;font-size:1.0cqw;letter-spacing:0.16em;text-transform:uppercase;color:#7A5C0E;margin-bottom:0.8cqw}
.headline{font-size:${B.rules.headPx / 19.2}cqw;font-weight:900;line-height:1.06;letter-spacing:-0.01em}
.body{margin-top:0.9cqw;font-size:${B.rules.bodyPx / 19.2}cqw;font-weight:650;line-height:1.3;color:#3A3A52}
.src{margin-top:1.0cqw;font-family:plexMono,monospace;font-weight:600;font-size:1.05cqw;letter-spacing:0.08em;color:#52526A}
.hw,.sw{display:inline-block;margin-right:0.07em;will-change:transform,opacity}
.hl{position:absolute;border:4px solid #D4600A;background:rgba(212,96,10,0.22);border-radius:26px;opacity:0;box-shadow:0 0 0 rgba(212,96,10,0);z-index:2}
.hl.circle{border-radius:50%}
.ptr{position:absolute;width:4px;height:0;background:#D4600A;transform:translateX(-50%);opacity:0;z-index:2}
.ptr::after{content:"";position:absolute;left:50%;bottom:-8px;width:18px;height:18px;border-radius:50%;background:#D4600A;transform:translateX(-50%)}
.mk{position:relative;display:inline-block;white-space:nowrap}
.mk i{position:absolute;left:-0.12em;right:-0.12em;top:0.08em;bottom:0.02em;background:rgba(212,96,10,0.32);border-radius:0.18em;transform:scaleX(0);transform-origin:left center;z-index:0}
.mk b{position:relative;z-index:1;font-weight:inherit}
.col.right .mk i{background:rgba(237,195,95,0.6)}
.card.answer .mk i{background:rgba(237,195,95,0.35)}
.field{position:absolute;inset:0;background:#FFFBEE}
.eyebrow-top{position:absolute;top:6cqh;left:0;right:0;text-align:center;font-family:plexMono,monospace;font-weight:600;font-size:1.1cqw;letter-spacing:0.14em;text-transform:uppercase;color:#52526A}
.star{position:absolute;top:18cqh;left:9cqw;width:30cqw;height:30cqw;object-fit:contain}
.cta .headline.big{position:absolute;top:24cqh;left:46cqw;right:6cqw;font-size:4.4cqw}
.cta .subline.big{position:absolute;top:56cqh;left:46cqw;right:7cqw;font-size:2.2cqw;font-weight:600;line-height:1.3;color:#52526A}
.url{position:absolute;top:71cqh;left:46cqw;font-size:1.6cqw;font-family:plexMono,monospace;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:#EDC35F;padding:0.7cqw 1.6cqw;border:3px solid #1A1A2E;border-radius:16px;box-shadow:0 5px 0 #C99A28;opacity:0}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total.toFixed(1)}" data-width="1920" data-height="1080">
${html}${audio}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`
writeFileSync(new URL('./index.html', import.meta.url), page)
console.log(`built ${B.beats.length} beats, ${total}s`)
B.beats.forEach((b, i) => console.log(`  ${b.id.padEnd(6)} ${starts[i].s.toFixed(1).padStart(5)}s  hold ${starts[i].d.toFixed(1)}s  ${b.clock || 'CTA'}`))
