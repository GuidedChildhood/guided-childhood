#!/usr/bin/env node
/**
 * "Ready", the Guided Childhood brand advert. Rough cut on Seedance drafts,
 * timed to the guide score (tools/guide-score.mjs) and the John Lewis curve
 * in plans/2026-10-09-ready-advert-treatment.md:
 *   0 to 26   piano alone: the fight, the question, the first star
 *   26 to 52  the voice joins: years pass in the same kitchen
 *   52 to 64  the lift: twelve, then fifteen
 *   64 to 72  near silence: the box, the phone
 *   72 to 82  the melody returns: the first gold star given back
 *   82 to 90  the charger, the line, the brand, the stage check
 * No dialogue, no voiceover. Words only at the end.
 *
 *   node build.mjs     writes index.html
 */
import { writeFileSync } from 'node:fs'

const W = 1920, H = 1080, X = 0.6 // cross fade
// [file, start in film, length on screen, source offset, push origin]
const SHOTS = [
  ['s01', 0.0, 7.4, 0.3, '55% 45%'],   // 9pm, the TV back on, dad in the doorway
  ['s02', 6.8, 7.4, 0.4, '45% 40%'],   // dad alone, the star glows on his phone
  ['s03', 13.6, 6.4, 0.6, '50% 40%'],  // the chart goes up, the first star
  ['s04', 19.4, 6.8, 0.6, '50% 50%'],  // jobs, another star
  ['s05', 25.6, 6.8, 0.6, '50% 45%'],  // the TV ends, she switches it off, upstairs
  ['s06', 31.8, 6.0, 1.0, '55% 40%'],  // eight, her own quest on a sticky note
  ['s07', 37.2, 6.0, 1.0, '50% 40%'],  // nine, the sofa, laughing
  ['s08', 42.6, 6.0, 1.2, '45% 45%'],  // the chart fills through the seasons
  ['s09', 48.0, 7.8, 0.2, '50% 45%'],  // twelve, the message, she brings it down
  ['s10', 55.2, 8.0, 0.0, '45% 45%'],  // fifteen, laying the table unasked
  ['s11', 62.6, 8.0, 0.0, '50% 50%'],  // sixteen, the box, the phone
  ['s12', 70.0, 8.0, 0.0, '50% 50%'],  // the card slid back, the first gold star
  ['s13', 77.4, 7.6, 0.2, '50% 50%'],  // the phone on the kitchen charger, goodnight
]
const LINE_AT = 79.6
const CARD_AT = 84.6, TOTAL = 90.0

let html = '', tl = ''
SHOTS.forEach(([f, s, d, off, origin], i) => {
  html += `<div id="w-${f}" class="shot"><video id="v-${f}" src="assets/${f}.mp4" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-media-start="${off.toFixed(2)}" data-track-index="${i % 2}" style="transform-origin:${origin}"></video></div>\n`
  tl += `tl.fromTo("#w-${f}",{opacity:0},{opacity:1,duration:${i === 0 ? 1.2 : X},ease:"sine.inOut"},${s.toFixed(2)});\n`
  tl += `tl.fromTo("#v-${f}",{scale:1.0},{scale:1.07,duration:${d.toFixed(2)},ease:"none"},${s.toFixed(2)});\n`
  tl += `tl.to("#w-${f}",{opacity:0,duration:0.01},${(s + d).toFixed(2)});\n`
})

const logo = (size) => {
  const bars = [5, 9, 14, 8], bw = size * 0.12, gap = size * 0.06, base = size * 0.78
  const x0 = (size - (bars.length * bw + (bars.length - 1) * gap)) / 2
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.24}" fill="#EDC35F"/>${bars.map((h, i) => { const bh = (h / 16) * size * 0.56; return `<rect x="${(x0 + i * (bw + gap)).toFixed(1)}" y="${(base - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="#FFFFFF"/>` }).join('')}</svg>`
}

html += `
<div class="vignette"></div>
<div class="bars top"></div><div class="bars bottom"></div>
<div class="line" id="line"><div id="l1">Eventually the controls come off.</div><div id="l2">What I want left behind is judgement.</div></div>
<div class="card" id="card">
  <div class="lockup" id="lockup">${logo(132)}<span class="word">Guided Childhood</span></div>
  <div class="cta" id="cta">What stage is your child? Three questions, no sign up.</div>
  <div class="url" id="url">guidedchildhood.com/starter-pack</div>
</div>
<audio id="score" src="assets/guide-score.mp3" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="4" data-volume="0.9"></audio>
`
tl += `tl.fromTo("#l1",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:1.1,ease:"power2.out"},${LINE_AT.toFixed(2)});
tl.fromTo("#l2",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:1.1,ease:"power2.out"},${(LINE_AT + 1.8).toFixed(2)});
tl.to("#line",{opacity:0,duration:0.6},${(CARD_AT - 0.3).toFixed(2)});
tl.fromTo("#card",{opacity:0},{opacity:1,duration:0.8,ease:"sine.inOut"},${CARD_AT.toFixed(2)});
tl.fromTo("#lockup",{opacity:0,y:18,scale:0.96},{opacity:1,y:0,scale:1,duration:1.0,ease:"expo.out"},${(CARD_AT + 0.5).toFixed(2)});
tl.fromTo("#cta",{opacity:0,y:12},{opacity:1,y:0,duration:0.9,ease:"expo.out"},${(CARD_AT + 1.4).toFixed(2)});
tl.fromTo("#url",{opacity:0},{opacity:1,duration:0.8},${(CARD_AT + 2.0).toFixed(2)});
tl.to({}, {duration:${TOTAL}}, 0);
`

writeFileSync('index.html', `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080"><title>Ready</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#0B0A08;font-family:nunito,sans-serif}
.shot{position:absolute;inset:0;opacity:0;overflow:hidden}
.shot video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(10,6,0,0.42) 100%)}
.bars{position:absolute;left:0;right:0;height:72px;background:#000;z-index:5}
.bars.top{top:0}.bars.bottom{bottom:0}
.line{position:absolute;left:0;right:0;bottom:150px;text-align:center;z-index:6;color:#FFFBEE;font-weight:800;font-size:54px;line-height:1.25;text-shadow:0 2px 0 rgba(0,0,0,0.25),0 12px 40px rgba(0,0,0,0.65)}
.line div{opacity:0}
.card{position:absolute;inset:0;background:#F9F8F6;z-index:7;opacity:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.lockup{display:flex;align-items:center;gap:34px;opacity:0}
.word{font-weight:800;font-size:92px;color:#1A1A2E;letter-spacing:-0.01em}
.cta{margin-top:54px;font-weight:700;font-size:44px;color:#1A1A2E;opacity:0}
.url{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.08em;color:#C99A28;opacity:0}
</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-width="${W}" data-height="${H}">
${html}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`)
console.log(`built ${SHOTS.length} shots, ${TOTAL}s`)
