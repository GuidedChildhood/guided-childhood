#!/usr/bin/env node
/**
 * "Ready", the Guided Childhood brand advert, v2 of the rough cut.
 *
 * Justin, 12 October: add the DiGi chat as pop ups when the dad asks, and
 * motion graphics that say why each section matters (her age, the star
 * system and helping round the house, guidance and education rather than a
 * ban). Every caption is a claim the product makes, checked against
 * THE-STORY.md sections 1, 3 and 6 and digi/07-trust-framework.md:
 *   jobs earn stars, stars become minutes at the child's rate (5 by default),
 *   protected time no star can buy, the child pitches her own quests,
 *   ten minutes a day, the open door, the ban is a deadline not a plan.
 * The DiGi chat is drawn the way the real one is (DigiChat.tsx): my bubbles
 * pale sky with a 2px ink edge and a 0 4px 0 ink shadow, DiGi plain ink on
 * the cream canvas with the star in the header, three dots while typing.
 *
 *   node build.mjs           writes index.html and score.json
 *   node tools/guide-score.mjs assets/guide-score.wav "$(cat score.json)"
 */
import { writeFileSync } from 'node:fs'

const W = 1920, H = 1080, X = 0.6
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))

// Each beat: the shot, how long it holds, and what rides on it.
const BEATS = [
  { f: 's01', d: 7.4, off: 0.3, o: '55% 45%', cap: { at: 1.4, age: 'Age 6', line: 'Bedtime. The TV goes back on.' } },
  { f: 's02-slow', d: 11.4, off: 0.2, o: '45% 40%', chat: { at: 0.8, me: 'She has put the TV back on again. Third night running. What do I do?',
      digi: ['Tonight, sit with her for the last five minutes, then off together.', 'Tomorrow, start a star chart. Jobs earn stars, stars earn screen time, and bedtime stays protected.'] } },
  { f: 's03', d: 6.6, off: 0.6, o: '50% 40%', cap: { at: 0.9, age: 'The star quest', line: 'Jobs around the house earn stars.' } },
  { f: 's04', d: 7.0, off: 0.6, o: '50% 50%', chips: { at: 0.6, items: ['+1 star · fed the dog', '+1 star · set the table', '1 star = 5 minutes of screen time'] } },
  { f: 's05', d: 6.8, off: 0.6, o: '50% 45%', cap: { at: 1.0, age: 'Protected time', line: 'No star can buy bedtime.' } },
  { f: 's06', d: 6.2, off: 1.0, o: '55% 40%', cap: { at: 0.8, age: 'Age 8', line: 'She pitches her own quests.' } },
  { f: 's07', d: 6.2, off: 1.0, o: '50% 40%', cap: { at: 0.8, age: 'Age 9', line: 'Ten minutes a day, learning together.' } },
  { f: 's08', d: 6.2, off: 1.2, o: '45% 45%', cap: { at: 0.8, age: 'Year after year', line: 'A star at a time, the habits stick.' } },
  { f: 's09-slow', d: 11.0, off: 0.3, o: '50% 45%', cap: { at: 0.6, age: 'Age 12', line: 'She comes to you, not around you.' },
      chat: { at: 4.6, me: 'She showed me a horrible message from a group chat. What do I say?',
      digi: ['Thank her for coming to you first. That is the win.', 'Then ask what she thinks it means, before you decide anything.'] } },
  { f: 's10', d: 8.4, off: 0.0, o: '45% 45%', cap: { at: 0.8, age: 'Age 15', line: 'The chart has gone. The habits stayed.' },
      cap2: { at: 4.6, age: 'Guidance, not a ban', line: 'A ban is a deadline. This is a plan.' } },
  { f: 's11', d: 8.0, off: 0.0, o: '50% 50%', cap: { at: 1.4, age: 'Age 16', line: 'Her own phone. And she is ready.' } },
  { f: 's12', d: 8.0, off: 0.0, o: '50% 50%' },
  { f: 's13', d: 7.8, off: 0.2, o: '50% 50%', line: { at: 2.0 } },
]
const CARD = 6.4

for (const b of BEATS) for (const c of [b.cap, b.cap2]) if (c) {
  if (/[–—]/.test(c.line + c.age)) throw new Error(`dash in ${b.f}`)
  if (words(c.line) > 9) throw new Error(`caption over 9 words in ${b.f}: ${c.line}`)
}

let t = 0
const starts = BEATS.map((b, i) => { const s = i === 0 ? 0 : t - X; t = s + b.d; return s })
const CARD_AT = t - 0.4, TOTAL = Math.round((CARD_AT + CARD) * 10) / 10

let html = '', tl = ''
const capHtml = (id, c) => `<div class="cap" id="${id}"><div class="age">${esc(c.age)}</div><div class="cl">${esc(c.line)}</div></div>`
const capIn = (id, at, out) => `tl.fromTo("#${id}",{opacity:0,y:16,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${at.toFixed(2)});
tl.fromTo("#${id} .age",{opacity:0,x:-10},{opacity:1,x:0,duration:0.5,ease:"power2.out"},${(at + 0.15).toFixed(2)});
tl.to("#${id}",{opacity:0,y:-8,filter:"blur(6px)",duration:0.45,ease:"power2.in"},${out.toFixed(2)});
`
BEATS.forEach((b, i) => {
  const s = starts[i], e = s + b.d
  html += `<div id="w${i}" class="shot"><video id="v${i}" src="assets/${b.f}.mp4" muted playsinline data-start="${s.toFixed(2)}" data-duration="${b.d.toFixed(2)}" data-media-start="${b.off.toFixed(2)}" data-track-index="${i % 2}" style="transform-origin:${b.o}"></video></div>\n`
  tl += `tl.fromTo("#w${i}",{opacity:0},{opacity:1,duration:${i === 0 ? 1.2 : X},ease:"sine.inOut"},${s.toFixed(2)});
tl.fromTo("#v${i}",{scale:1.0},{scale:1.07,duration:${b.d.toFixed(2)},ease:"none"},${s.toFixed(2)});
tl.to("#w${i}",{opacity:0,duration:0.01},${e.toFixed(2)});
`
  if (b.cap) { html += capHtml(`c${i}`, b.cap); tl += capIn(`c${i}`, s + b.cap.at, b.cap2 ? s + b.cap2.at - 0.6 : (b.chat ? s + b.chat.at - 0.5 : e - 0.7)) }
  if (b.cap2) { html += capHtml(`d${i}`, b.cap2); tl += capIn(`d${i}`, s + b.cap2.at, e - 0.7) }
  if (b.chips) {
    html += `<div class="chips" id="k${i}">${b.chips.items.map((c, n) => `<div class="chip${n === b.chips.items.length - 1 ? ' rate' : ''}" id="k${i}-${n}"><span class="st">★</span>${esc(c.replace(/^\+1 star · /, ''))}${c.startsWith('+1') ? '<span class="plus">+1</span>' : ''}</div>`).join('')}</div>`
    b.chips.items.forEach((c, n) => {
      const at = s + b.chips.at + n * 1.5
      tl += `tl.fromTo("#k${i}-${n}",{opacity:0,x:40,scale:0.9},{opacity:1,x:0,scale:1,duration:0.5,ease:"back.out(1.8)"},${at.toFixed(2)});\n`
    })
    tl += `tl.to("#k${i}",{opacity:0,duration:0.4},${(e - 0.7).toFixed(2)});\n`
  }
  if (b.chat) {
    const c = b.chat, a = s + c.at
    html += `<div class="phone" id="p${i}"><div class="ph-head"><img src="assets/digi-cut.png" alt=""><span>DiGi</span></div>
      <div class="me" id="p${i}-me">${esc(c.me)}</div>
      <div class="dots" id="p${i}-dots"><i></i><i></i><i></i></div>
      ${c.digi.map((m, n) => `<div class="dg" id="p${i}-d${n}">${esc(m)}</div>`).join('')}</div>`
    tl += `tl.fromTo("#p${i}",{opacity:0,y:40,scale:0.96},{opacity:1,y:0,scale:1,duration:0.7,ease:"expo.out"},${a.toFixed(2)});
tl.fromTo("#p${i}-me",{opacity:0,y:14,scale:0.92},{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.6)"},${(a + 0.5).toFixed(2)});
tl.fromTo("#p${i}-dots",{opacity:0},{opacity:1,duration:0.2},${(a + 2.4).toFixed(2)});
tl.fromTo("#p${i}-dots i",{y:0},{y:-6,duration:0.25,yoyo:true,repeat:5,stagger:0.12,ease:"sine.inOut"},${(a + 2.4).toFixed(2)});
tl.to("#p${i}-dots",{opacity:0,height:0,margin:0,padding:0,duration:0.2},${(a + 3.6).toFixed(2)});
`
    c.digi.forEach((m, n) => {
      const at = a + 3.7 + n * 2.6
      tl += `tl.fromTo("#p${i}-d${n}",{opacity:0,y:10},{opacity:1,y:0,duration:0.5,ease:"power2.out"},${at.toFixed(2)});\n`
    })
    tl += `tl.to("#p${i}",{opacity:0,y:20,duration:0.45,ease:"power2.in"},${(e - 0.6).toFixed(2)});\n`
  }
  if (b.line) {
    html += `<div class="line" id="line"><div id="l1">Eventually the controls come off.</div><div id="l2">What I want left behind is judgement.</div></div>`
    tl += `tl.fromTo("#l1",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:1.1,ease:"power2.out"},${(s + b.line.at).toFixed(2)});
tl.fromTo("#l2",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:1.1,ease:"power2.out"},${(s + b.line.at + 1.8).toFixed(2)});
tl.to("#line",{opacity:0,duration:0.6},${(CARD_AT - 0.3).toFixed(2)});
`
  }
})

const logo = (size) => {
  const bars = [5, 9, 14, 8], bw = size * 0.12, gap = size * 0.06, base = size * 0.78
  const x0 = (size - (bars.length * bw + (bars.length - 1) * gap)) / 2
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size * 0.24}" fill="#EDC35F"/>${bars.map((h, i) => { const bh = (h / 16) * size * 0.56; return `<rect x="${(x0 + i * (bw + gap)).toFixed(1)}" y="${(base - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="#FFFFFF"/>` }).join('')}</svg>`
}
html += `
<div class="vignette"></div>
<div class="bars top"></div><div class="bars bottom"></div>
<div class="card" id="card">
  <div class="lockup" id="lockup">${logo(132)}<span class="word">Guided Childhood</span></div>
  <div class="cta" id="cta">What stage is your child? Three questions, no sign up.</div>
  <div class="url" id="url">guidedchildhood.com/starter-pack</div>
</div>
<audio id="score" src="assets/guide-score.mp3" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="4" data-volume="0.85"></audio>
`
tl += `tl.fromTo("#card",{opacity:0},{opacity:1,duration:0.8,ease:"sine.inOut"},${CARD_AT.toFixed(2)});
tl.fromTo("#lockup",{opacity:0,y:18,scale:0.96},{opacity:1,y:0,scale:1,duration:1.0,ease:"expo.out"},${(CARD_AT + 0.5).toFixed(2)});
tl.fromTo("#cta",{opacity:0,y:12},{opacity:1,y:0,duration:0.9,ease:"expo.out"},${(CARD_AT + 1.4).toFixed(2)});
tl.fromTo("#url",{opacity:0},{opacity:1,duration:0.8},${(CARD_AT + 2.0).toFixed(2)});
tl.to({}, {duration:${TOTAL}}, 0);
`

const css = `
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#0B0A08;font-family:nunito,sans-serif}
.shot{position:absolute;inset:0;opacity:0;overflow:hidden}
.shot video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(10,6,0,0.42) 100%);z-index:2}
.bars{position:absolute;left:0;right:0;height:72px;background:#000;z-index:5}
.bars.top{top:0}.bars.bottom{bottom:0}
.cap{position:absolute;left:96px;bottom:128px;z-index:6;opacity:0;padding:22px 30px 24px;border-radius:22px;background:rgba(20,16,10,0.42);backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);border:1px solid rgba(255,255,255,0.22);border-top-color:rgba(255,255,255,0.45);box-shadow:inset 0 1px 0 rgba(255,255,255,0.5),0 18px 50px rgba(0,0,0,0.35)}
.cap .age{font-family:plexMono,monospace;font-weight:600;font-size:22px;letter-spacing:0.2em;text-transform:uppercase;color:#EDC35F;margin-bottom:10px}
.cap .cl{font-weight:800;font-size:52px;line-height:1.1;color:#FFFBEE;letter-spacing:-0.01em;text-shadow:0 8px 26px rgba(0,0,0,0.35)}
.chips{position:absolute;right:96px;top:150px;z-index:6;display:flex;flex-direction:column;align-items:flex-end;gap:18px}
.chip{display:flex;align-items:center;gap:14px;padding:16px 26px;border-radius:999px;background:#FFFBEE;border:3px solid #1A1A2E;box-shadow:0 5px 0 #C99A28;font-weight:800;font-size:34px;color:#1A1A2E;opacity:0}
.chip .st{color:#EDC35F;font-size:38px;text-shadow:0 0 1px #C99A28}
.chip .plus{margin-left:6px;font-family:plexMono,monospace;font-weight:600;font-size:24px;color:#FFFBEE;background:#2F8F6B;border-radius:999px;padding:4px 12px}
.chip.rate{background:#EDC35F}
.phone{position:absolute;right:110px;top:120px;width:600px;z-index:6;opacity:0;background:#F9F8F6;border:3px solid #1A1A2E;border-radius:34px;box-shadow:0 8px 0 #1A1A2E,0 30px 80px rgba(0,0,0,0.4);padding:22px 28px 30px}
.ph-head{display:flex;align-items:center;gap:12px;padding-bottom:16px;margin-bottom:18px;border-bottom:2px solid #EDE6D6;font-weight:800;font-size:28px;color:#1A1A2E}
.ph-head img{width:44px;height:44px;object-fit:contain}
.me{margin-left:70px;background:#F0F9FF;border:2px solid #1A1A2E;box-shadow:0 4px 0 #1A1A2E;border-radius:16px;padding:16px 20px;font-weight:600;font-size:28px;line-height:1.3;color:#1A1A2E;opacity:0}
.dots{display:inline-flex;gap:8px;margin-top:20px;padding:12px 18px;background:#FFF6DE;border-radius:999px;opacity:0;overflow:hidden}
.dots i{display:block;width:12px;height:12px;border-radius:50%;background:#C99A28;opacity:0.6}
.dg{margin-top:16px;font-weight:600;font-size:29px;line-height:1.35;color:#1A1A2E;opacity:0}
.line{position:absolute;left:0;right:0;bottom:150px;text-align:center;z-index:6;color:#FFFBEE;font-weight:800;font-size:54px;line-height:1.25;text-shadow:0 2px 0 rgba(0,0,0,0.25),0 12px 40px rgba(0,0,0,0.65)}
.line div{opacity:0}
.card{position:absolute;inset:0;background:#F9F8F6;z-index:7;opacity:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.lockup{display:flex;align-items:center;gap:34px;opacity:0}
.word{font-weight:800;font-size:92px;color:#1A1A2E;letter-spacing:-0.01em}
.cta{margin-top:54px;font-weight:700;font-size:44px;color:#1A1A2E;opacity:0}
.url{margin-top:26px;font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.08em;color:#C99A28;opacity:0}
`

writeFileSync('index.html', `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080"><title>Ready</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-width="${W}" data-height="${H}">
${html}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}</script></body></html>`)

// Music sections follow the story: the voice joins when the years start to
// pass (age 8), the lift runs twelve to fifteen, the hush is the box, the
// melody returns for the card, the hold is the charger and the end card.
const idx = (f) => BEATS.findIndex((b) => b.f === f)
const score = { len: TOTAL, voice: +starts[idx('s06')].toFixed(1), lift: +starts[idx('s09-slow')].toFixed(1), hush: +starts[idx('s11')].toFixed(1), ret: +starts[idx('s12')].toFixed(1), hold: +starts[idx('s13')].toFixed(1) }
writeFileSync('score.json', JSON.stringify(score))
console.log(`built ${BEATS.length} beats, ${TOTAL}s`, JSON.stringify(score))
BEATS.forEach((b, i) => console.log(`  ${b.f.padEnd(9)} ${starts[i].toFixed(1).padStart(5)}s  ${b.d}s`))
