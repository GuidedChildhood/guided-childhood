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
    if (L.video) html += `<video id="${beat.id}-lv" src="assets/${L.video}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-track-index="${track}"></video>`
    html += `<div class="card" id="${beat.id}-lc">${L.tag ? `<div class="tag">${esc(L.tag)}</div>` : ''}<div class="headline">${esc(L.head)}</div>${L.body ? `<div class="body">${esc(L.body)}</div>` : ''}${L.src ? `<div class="src">${esc(L.src)}</div>` : ''}</div></div>`
    html += `<div class="col right">`
    if (R.video) html += `<video id="${beat.id}-rv" src="assets/${R.video}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-track-index="${track + 2}"></video>`
    else html += `<div class="cream"></div><img class="digi ${R.digi || 'corner'}" src="assets/digi-cut.png" alt="">`
    html += `<div class="card ${R.kind || ''}" id="${beat.id}-rc">${R.tag ? `<div class="tag">${esc(R.tag)}</div>` : ''}<div class="headline">${esc(R.head)}</div>${R.body ? `<div class="body">${esc(R.body)}</div>` : ''}${R.src ? `<div class="src">${esc(R.src)}</div>` : ''}</div></div>`
    html += `<div class="divider"></div><div class="clock"><span class="clk">${esc(beat.clock)}</span></div><div class="colhead lh">LEFT TO THE FEED</div><div class="colhead rh">WITH DIGI</div>`
  }
  html += `</div>\n`
  const e = s + d
  tl += `tl.fromTo("#${beat.id}",{opacity:0},{opacity:1,duration:0.5,ease:"power2.out"},${s.toFixed(2)});\n`
  tl += `tl.to("#${beat.id}",{opacity:0,duration:0.4,ease:"power2.in"},${(e - 0.4).toFixed(2)});\n`
  if (beat.cta) {
    tl += `tl.fromTo("#${beat.id} .headline.big",{y:18,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + 0.5).toFixed(2)});\ntl.fromTo("#${beat.id} .subline.big",{y:10,opacity:0},{y:0,opacity:1,duration:0.5,ease:"power3.out"},${(s + 1.3).toFixed(2)});\ntl.fromTo("#${beat.id} .url",{y:10,opacity:0},{y:0,opacity:1,duration:0.4},${(s + 2.2).toFixed(2)});\n`
  } else {
    tl += `tl.fromTo("#${beat.id} video",{scale:1},{scale:1.05,duration:${d.toFixed(2)},ease:"none"},${s.toFixed(2)});\n`
    tl += `tl.fromTo("#${beat.id}-lc",{y:28,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + 0.4).toFixed(2)});\n`
    const rd = beat.rightDelay ?? 1.6
    tl += `tl.fromTo("#${beat.id}-rc",{y:28,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + rd).toFixed(2)});\n`
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
.field{position:absolute;inset:0;background:#FFFBEE}
.eyebrow-top{position:absolute;top:6cqh;left:0;right:0;text-align:center;font-family:plexMono,monospace;font-weight:600;font-size:1.1cqw;letter-spacing:0.14em;text-transform:uppercase;color:#52526A}
.star{position:absolute;top:18cqh;left:9cqw;width:30cqw;height:30cqw;object-fit:contain}
.cta .headline.big{position:absolute;top:24cqh;left:46cqw;right:6cqw;font-size:4.4cqw}
.cta .subline.big{position:absolute;top:56cqh;left:46cqw;right:7cqw;font-size:2.2cqw;font-weight:600;line-height:1.3;color:#52526A}
.url{position:absolute;top:71cqh;left:46cqw;font-size:1.6cqw;font-family:plexMono,monospace;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:#EDC35F;padding:0.7cqw 1.6cqw;border:3px solid #1A1A2E;border-radius:16px;box-shadow:0 5px 0 #C99A28;opacity:0}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total.toFixed(1)}" data-width="1920" data-height="1080">
${html}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`
writeFileSync(new URL('./index.html', import.meta.url), page)
console.log(`built ${B.beats.length} beats, ${total}s`)
B.beats.forEach((b, i) => console.log(`  ${b.id.padEnd(6)} ${starts[i].s.toFixed(1).padStart(5)}s  hold ${starts[i].d.toFixed(1)}s  ${b.clock || 'CTA'}`))
