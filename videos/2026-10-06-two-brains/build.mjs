#!/usr/bin/env node
/**
 * Two brains, one clock, v5. Sequential structure: her brain full frame,
 * the turn, DiGi full frame on the same minutes, one side by side at the
 * morning, the stage check. Glass text over a scrim, never a solid box.
 *
 *   node build.mjs            writes index.html from beats.json
 *
 * Readability is enforced here: a headline over the word cap or a body over
 * its cap refuses to build, and every beat is held long enough to read it.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const B = JSON.parse(readFileSync('beats.json', 'utf8'))
const W = 1920, H = 1080
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))
const mark = (text, phrase) => {
  const t = esc(text || ''); if (!phrase) return t
  const p = esc(phrase); const i = t.indexOf(p); if (i < 0) throw new Error(`mark "${phrase}" not in "${text}"`)
  return t.slice(0, i) + `<span class="mk"><i></i><b>${p}</b></span>` + t.slice(i + p.length)
}
for (const b of B.beats) {
  const all = JSON.stringify(b)
  if (/[–—]/.test(all)) throw new Error(`dash in ${b.id}`)
  if (b.head && words(b.head) > B.rules.headWords) throw new Error(`${b.id} headline over ${B.rules.headWords} words: "${b.head}"`)
  if (b.body && words(b.body) > B.rules.bodyWords) throw new Error(`${b.id} body over ${B.rules.bodyWords} words: "${b.body}"`)
  if (b.line && words(b.line) > 10) throw new Error(`${b.id} line too long`)
}

// ---------- timing ----------
let t = 0
const starts = []
for (const b of B.beats) {
  const w = words(b.head) + words(b.body) + words(b.line)
  const hold = Math.max(b.hold || B.rules.minHold, w / B.rules.wordsPerSecond + 1.4)
  starts.push({ s: t, d: hold }); t += hold
}
const TOTAL = t

// ---------- html ----------
const vid = (id, file, s, d, track, extra = '') =>
  `<video id="${id}" src="assets/${file}" muted playsinline data-start="${s.toFixed(2)}" data-duration="${d.toFixed(2)}" data-track-index="${track}" ${extra}></video>`

let html = '', tl = ''
const clockHtml = (id, text) => `<div class="clock" id="${id}-clock">${esc(text)}</div>`
const panel = (id, b, cls = '') => `
  <div class="glass ${cls}" id="${id}-panel">
    ${b.tag ? `<div class="tag">${esc(b.tag)}</div>` : ''}
    <div class="head">${mark(b.head, b.mark && (b.head || '').includes(b.mark) ? b.mark : null)}</div>
    ${b.body ? `<div class="body">${mark(b.body, b.mark && !(b.head || '').includes(b.mark) ? b.mark : null)}</div>` : ''}
    ${b.src ? `<div class="src">${esc(b.src)}</div>` : ''}
  </div>`
const panelIn = (id, s) => `tl.fromTo("#${id}-panel",{y:36,opacity:0,filter:"blur(14px)"},{y:0,opacity:1,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${s.toFixed(2)});
tl.fromTo("#${id}-panel .head",{y:22,opacity:0,filter:"blur(10px)"},{y:0,opacity:1,filter:"blur(0px)",duration:0.7,ease:"expo.out"},${(s + 0.15).toFixed(2)});
tl.fromTo("#${id}-panel .body",{y:14,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},${(s + 0.55).toFixed(2)});
tl.fromTo("#${id}-panel .src",{opacity:0},{opacity:1,duration:0.5},${(s + 0.9).toFixed(2)});
tl.to("#${id}-panel .mk i",{scaleX:1,duration:0.45,ease:"power2.out"},${(s + 1.0).toFixed(2)});
`
const panelOut = (id, e) => `tl.to("#${id}-panel",{opacity:0,filter:"blur(10px)",duration:0.35,ease:"power2.in"},${(e - 0.4).toFixed(2)});\n`
const clockIn = (id, s) => `tl.fromTo("#${id}-clock",{scale:0.6,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"back.out(2.2)"},${(s + 0.1).toFixed(2)});\n`

B.beats.forEach((b, i) => {
  const { s, d } = starts[i], e = s + d
  const track = (i % 2) * 2
  if (i < B.beats.length - 1) tl += `tl.to("#${b.id}",{opacity:0,duration:0.01},${e.toFixed(2)});\n` // alternate base tracks so neighbours can cross fade

  if (b.kind === 'hook') {
    html += `<div id="${b.id}" class="beat">
      ${vid(`${b.id}-v`, b.video, s, d, track)}
      <div class="scrim"></div>
      <div class="bigclock" id="${b.id}-big">${esc(b.clock)}</div>
      <div class="line" id="${b.id}-line">${esc(b.line)}</div>
    </div>`
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.6},${s.toFixed(2)});
tl.fromTo("#${b.id}-v",{scale:1.08},{scale:1,duration:${d.toFixed(2)},ease:"power1.out"},${s.toFixed(2)});
tl.fromTo("#${b.id}-big",{scale:1.25,opacity:0,filter:"blur(18px)"},{scale:1,opacity:1,filter:"blur(0px)",duration:1.1,ease:"expo.out"},${(s + 0.4).toFixed(2)});
tl.fromTo("#${b.id}-line",{y:20,opacity:0,filter:"blur(8px)"},{y:0,opacity:1,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${(s + 1.6).toFixed(2)});
tl.to("#${b.id}-big, #${b.id}-line",{opacity:0,filter:"blur(10px)",duration:0.4},${(e - 0.5).toFixed(2)});
`
  }

  if (b.kind === 'brain') {
    const blur = b.video.replace('.mp4', '-blur.jpg')
    const h = b.hl
    html += `<div id="${b.id}" class="beat">
      <img class="bg" src="assets/${blur}" alt="">
      <div class="stage">${vid(`${b.id}-v`, b.video, s, d, track + 1, `class="sq" style="transform-origin:${b.zoom || '50% 50%'}"`)}
        ${h ? `<div class="hl ${h.shape || ''}" id="${b.id}-hl" style="left:${h.l}%;top:${h.t}%;width:${h.w}%;height:${h.h}%"></div>` : ''}
      </div>
      <div class="eyebrow">LEFT TO THE FEED</div>${clockHtml(b.id, b.clock)}
      ${panel(b.id, b, 'right')}
    </div>`
    const hs = s + (b.hlAt ?? 1.0)
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.5},${s.toFixed(2)});
tl.fromTo("#${b.id}-v",{scale:1},{scale:${b.zoomTo || 1.16},duration:${d.toFixed(2)},ease:"power1.inOut"},${s.toFixed(2)});
${clockIn(b.id, s)}${h ? `tl.fromTo("#${b.id}-hl",{scale:1.35,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"back.out(1.8)"},${hs.toFixed(2)});
tl.to("#${b.id}-hl",{boxShadow:"0 0 46px rgba(212,96,10,0.55)",duration:0.7,ease:"sine.inOut",yoyo:true,repeat:${Math.max(1, Math.floor((e - hs - 1) / 0.7))}},${(hs + 0.4).toFixed(2)});
` : ''}${panelIn(b.id, s + 0.9)}${panelOut(b.id, e)}`
  }

  if (b.kind === 'turn') {
    const blur = b.video.replace('.mp4', '-blur.jpg')
    html += `<div id="${b.id}" class="beat">
      <img class="bg" src="assets/${blur}" alt="">
      <div class="stage" id="${b.id}-stage">${vid(`${b.id}-v`, b.video, s, d, track + 1, 'class="sq"')}</div>
      <div class="eyebrow">LEFT TO THE FEED</div>${clockHtml(b.id, b.clock)}
      ${panel(b.id, b, 'centre question')}
    </div>`
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.5},${s.toFixed(2)});
${clockIn(b.id, s)}tl.to("#${b.id}-clock",{x:-6,duration:0.06,yoyo:true,repeat:5},${(s + 0.9).toFixed(2)});
tl.to("#${b.id}-clock",{backgroundColor:"#52526A",color:"#FFFBEE",borderColor:"#52526A",duration:0.3},${(s + 1.3).toFixed(2)});
tl.to("#${b.id}-stage",{scale:0.28,x:56,y:${H - Math.round(H * 0.28) - 56},duration:1.1,ease:"expo.inOut"},${(s + 1.5).toFixed(2)});
${panelIn(b.id, s + 2.4)}tl.fromTo("#${b.id}-panel .mw",{opacity:0},{opacity:1,duration:0.05,stagger:0.07},${(s + 2.7).toFixed(2)});
${panelOut(b.id, e)}`
  }

  if (b.kind === 'think' || b.kind === 'digi') {
    html += `<div id="${b.id}" class="beat digi">
      ${vid(`${b.id}-v`, b.video, s, d, track, 'class="bg full"')}
      <div class="scrim soft"></div>
      <div class="eyebrow right">WITH DIGI</div>${clockHtml(b.id, b.clock)}
      ${b.tile ? `<div class="tile" id="${b.id}-tile">${vid(`${b.id}-tv`, b.tile, s, d, track + 1)}<div class="tilelabel">LEFT TO THE FEED</div></div>` : ''}`
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.5},${s.toFixed(2)});
tl.fromTo("#${b.id}-v",{scale:1},{scale:1.06,duration:${d.toFixed(2)},ease:"none"},${s.toFixed(2)});
${clockIn(b.id, s)}${b.tile ? `tl.fromTo("#${b.id}-tile",{x:-40,opacity:0},{x:0,opacity:1,duration:0.6,ease:"expo.out"},${(s + 0.3).toFixed(2)});\n` : ''}`
    if (b.kind === 'think') {
      const T = b
      html += `<div class="glow" id="${b.id}-glow" style="left:${T.target.x}%;top:${T.target.y}%"></div>`
      T.streams.forEach((st, k) => {
        html += `<div class="slabel ${st.color}" id="${b.id}-sl-${k}">${esc(st.label)}</div>`
        st.items.forEach((it, n) => { html += `<div class="chip ${st.color}" id="${b.id}-ch-${k}-${n}">${esc(it)}</div>` })
      })
      let t0 = s + 0.8
      T.streams.forEach((st, k) => {
        const n = st.items.length, step = 0.28, flight = 0.8
        tl += `tl.fromTo("#${b.id}-sl-${k}",{y:-10,opacity:0,filter:"blur(8px)"},{y:0,opacity:1,filter:"blur(0px)",duration:0.4,ease:"expo.out"},${t0.toFixed(2)});\n`
        st.items.forEach((it, m) => {
          const left = m % 2 === 0
          const x0 = left ? 0.08 * W : 0.56 * W, y0 = H * (0.36 + 0.09 * (m % 5))
          const x1 = T.target.x / 100 * W - 160, y1 = T.target.y / 100 * H - 20
          const at = t0 + 0.4 + m * step
          tl += `tl.fromTo("#${b.id}-ch-${k}-${m}",{x:${x0.toFixed(0)},y:${(y0 + 30).toFixed(0)},opacity:0,scale:0.85},{y:${y0.toFixed(0)},opacity:1,scale:1,duration:0.3,ease:"back.out(1.6)"},${at.toFixed(2)});
tl.to("#${b.id}-ch-${k}-${m}",{x:${x1.toFixed(0)},y:${y1.toFixed(0)},scale:0.15,opacity:0,duration:${flight},ease:"power2.in"},${(at + 0.55).toFixed(2)});
`
        })
        const end = t0 + 0.4 + (n - 1) * step + 0.55 + flight
        tl += `tl.fromTo("#${b.id}-glow",{boxShadow:"0 0 60px 40px rgba(237,195,95,0)"},{boxShadow:"0 0 110px 80px rgba(237,195,95,0.6)",duration:0.25,ease:"power2.out",yoyo:true,repeat:1},${(end - 0.2).toFixed(2)});
tl.to("#${b.id}-sl-${k}",{opacity:0,duration:0.3},${(end - 0.1).toFixed(2)});
`
        t0 = end + 0.1
      })
      b._streamsEnd = t0
    } else {
      html += panel(b.id, b, 'right answer')
      tl += panelIn(b.id, s + 0.8) + panelOut(b.id, e)
    }
    html += `</div>`
  }

  if (b.kind === 'morning') {
    html += `<div id="${b.id}" class="beat morning">
      <div class="cream"></div>
      <div class="half l" id="${b.id}-l">${vid(`${b.id}-lv`, b.left, s, d, track)}<div class="half-label">${esc(b.leftLabel)}</div></div>
      <div class="half r" id="${b.id}-r">${vid(`${b.id}-rv`, b.right, s, d, track + 1)}<div class="half-label butter">${esc(b.rightLabel)}</div></div>
      ${clockHtml(b.id, b.clock)}
      ${panel(b.id, b, 'bottom')}
    </div>`
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.5},${s.toFixed(2)});
${clockIn(b.id, s)}tl.fromTo("#${b.id}-l",{x:-60,opacity:0},{x:0,opacity:1,duration:0.8,ease:"expo.out"},${(s + 0.3).toFixed(2)});
tl.fromTo("#${b.id}-r",{x:60,opacity:0},{x:0,opacity:1,duration:0.8,ease:"expo.out"},${(s + 0.6).toFixed(2)});
${panelIn(b.id, s + 2.6)}${panelOut(b.id, e)}`
  }

  if (b.kind === 'cta') {
    html += `<div id="${b.id}" class="beat cta">
      <div class="cream"></div><div class="eyebrow">GUIDED CHILDHOOD</div>
      <img id="${b.id}-star" class="star" src="assets/digi-cut.png" alt="">
      <div class="ctatext" id="${b.id}-text"><div class="head ink">${esc(b.head)}</div><div class="body ink">${esc(b.body)}</div><div class="url">${esc(b.url)}</div></div>
    </div>`
    tl += `tl.fromTo("#${b.id}",{opacity:0},{opacity:1,duration:0.6},${s.toFixed(2)});
tl.fromTo("#${b.id}-star",{scale:0.7,opacity:0},{scale:1,opacity:1,duration:0.9,ease:"back.out(1.6)"},${(s + 0.3).toFixed(2)});
tl.fromTo("#${b.id}-text > *",{y:24,opacity:0,filter:"blur(8px)"},{y:0,opacity:1,filter:"blur(0px)",duration:0.7,ease:"expo.out",stagger:0.18},${(s + 0.7).toFixed(2)});
`
  }
})

// ---------- sound ----------
let audio = `<audio id="music" src="assets/${B.music.file}" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="8" data-volume="${B.music.vol}" data-automation='{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0},{"t":2,"v":1},{"t":${(TOTAL - 7).toFixed(1)},"v":1},{"t":${(TOTAL - 5.5).toFixed(1)},"v":0.55},{"t":${(TOTAL - 0.8).toFixed(1)},"v":0.55},{"t":${TOTAL.toFixed(1)},"v":0}]}]}'></audio>\n`
let n = 0
const durs = { 'sfx-tv-on.mp3': 3, 'sfx-countdown.mp3': 2, 'sfx-clock.mp3': 5, 'sfx-morning.mp3': 5, 'sfx-chime.mp3': 2, 'sfx-whoosh.mp3': 2, 'sfx-pulse.mp3': 2, 'sfx-riser.mp3': 3, 'sfx-marker.mp3': 1 }
B.beats.forEach((b, i) => {
  const { s, d } = starts[i]
  const cues = [...(b.sfx || [])]
  if (i > 0) cues.push({ file: 'sfx-whoosh.mp3', at: 0, vol: 0.5 })
  if (b.hl) cues.push({ file: 'sfx-pulse.mp3', at: b.hlAt ?? 1.0, vol: 0.6 })
  if (b.kind === 'think') { let t0 = 0.8; for (const st of b.streams) { cues.push({ file: 'sfx-whoosh.mp3', at: t0, vol: 0.3 }); t0 += 0.4 + (st.items.length - 1) * 0.28 + 0.55 + 0.8 + 0.1 } }
  if (b.kind === 'cta') cues.push({ file: 'sfx-riser.mp3', at: -2.4, vol: 0.5 })
  if (b.kind === 'turn') cues.push({ file: 'sfx-chime.mp3', at: 2.5, vol: 0.5 })
  for (const c of cues) {
    const at = s + c.at; if (at < 0) continue
    audio += `<audio id="sfx-${n}" src="assets/${c.file}" data-start="${at.toFixed(2)}" data-duration="${Math.min(durs[c.file] || 3, TOTAL - at).toFixed(2)}" data-track-index="${9 + (n % 4)}" data-volume="${c.vol}"></audio>\n`
    n++
  }
})

// ---------- page ----------
const css = `
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#0B0B14;font-family:nunito,sans-serif;container-type:size}
.beat{position:absolute;inset:0;opacity:0}
video{position:absolute;object-fit:cover}
video.bg,img.bg{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
video.full{left:0;top:0;width:${W}px;height:${H}px}
.stage{position:absolute;left:0;top:0;width:${H}px;height:${H}px;transform-origin:0 0}
.stage video.sq{left:0;top:0;width:${H}px;height:${H}px;box-shadow:24px 0 60px rgba(0,0,0,0.45);border-radius:0}
#turn-stage{border-radius:22px;overflow:hidden}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.05) 30%,rgba(0,0,0,0.62) 100%)}
.scrim.soft{background:linear-gradient(90deg,rgba(0,0,0,0) 40%,rgba(20,16,8,0.28) 100%)}
.cream{position:absolute;inset:0;background:#FFFBEE}
.eyebrow{position:absolute;left:48px;top:40px;font-family:plexMono,monospace;font-weight:600;font-size:20px;letter-spacing:0.22em;color:rgba(255,251,238,0.75)}
.eyebrow.right{left:auto;right:48px;color:#1A1A2E;background:rgba(255,251,238,0.7);padding:6px 12px;border-radius:8px;top:34px}
.cta .eyebrow{color:#52526A;left:50%;transform:translateX(-50%)}
.clock{position:absolute;left:50%;top:36px;transform:translateX(-50%);font-family:plexMono,monospace;font-weight:600;font-size:30px;letter-spacing:0.08em;color:#1A1A2E;background:#EDC35F;border:3px solid #1A1A2E;border-radius:14px;padding:8px 22px;box-shadow:0 6px 0 #C99A28;opacity:0}
.bigclock{position:absolute;left:50%;top:30%;transform:translateX(-50%);font-family:plexMono,monospace;font-weight:600;font-size:150px;letter-spacing:0.06em;color:#FFFBEE;text-shadow:0 4px 0 rgba(0,0,0,0.25),0 20px 60px rgba(0,0,0,0.6);opacity:0}
.line{position:absolute;left:50%;top:60%;transform:translateX(-50%);width:1400px;text-align:center;font-weight:800;font-size:64px;color:#FFFBEE;text-shadow:0 2px 0 rgba(0,0,0,0.3),0 14px 40px rgba(0,0,0,0.6);opacity:0}
.glass{position:absolute;padding:40px 48px 36px;border-radius:28px;background:rgba(20,18,34,0.46);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);border:1px solid rgba(255,255,255,0.22);border-top-color:rgba(255,255,255,0.5);box-shadow:inset 0 1.5px 0 rgba(255,255,255,0.6),0 24px 70px rgba(0,0,0,0.45);opacity:0;color:#FFFBEE}
.glass.right{left:${H + 100}px;top:50%;transform:translateY(-50%);width:${W - H - 160}px}
.glass.answer{left:auto;right:80px;top:50%;transform:translateY(-50%);width:820px}
.glass.centre{left:50%;top:48%;transform:translate(-50%,-50%);width:1040px;text-align:left}
.glass.bottom{left:50%;bottom:60px;transform:translateX(-50%);width:1500px;padding:30px 44px 28px;background:rgba(26,26,46,0.82)}
.tag{font-family:plexMono,monospace;font-weight:600;font-size:19px;letter-spacing:0.2em;text-transform:uppercase;color:#EDC35F;margin-bottom:20px}
.head{font-weight:900;font-size:60px;line-height:1.08;letter-spacing:-0.01em;background:linear-gradient(180deg,#FFFFFF 0%,#FFFBEE 55%,rgba(255,251,238,0.74) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 10px 30px rgba(0,0,0,0.35)}
.glass.bottom .head{font-size:50px}
.body{margin-top:18px;font-weight:600;font-size:34px;line-height:1.35;color:rgba(255,251,238,0.92)}
.src{margin-top:18px;font-family:plexMono,monospace;font-weight:600;font-size:18px;letter-spacing:0.08em;color:rgba(255,251,238,0.82)}
.mk{position:relative;display:inline-block;white-space:nowrap}
.mk i{position:absolute;left:-0.1em;right:-0.1em;top:0.1em;bottom:0.04em;background:rgba(237,195,95,0.42);border-radius:0.18em;transform:scaleX(0);transform-origin:left center;z-index:0}
.mk b{position:relative;z-index:1;font-weight:inherit}
.head .mk b{background:none;-webkit-text-fill-color:#FFFBEE;color:#FFFBEE}
.hl{position:absolute;border:4px solid #D4600A;background:rgba(212,96,10,0.2);border-radius:26px;opacity:0;z-index:2}
.hl.circle{border-radius:50%}
.tile{position:absolute;left:56px;bottom:56px;width:300px;height:300px;border-radius:22px;overflow:hidden;border:3px solid rgba(255,255,255,0.7);box-shadow:0 18px 50px rgba(0,0,0,0.45);opacity:0}
.tile video{left:0;top:0;width:300px;height:300px}
.tilelabel{position:absolute;left:0;right:0;bottom:0;padding:8px 0;text-align:center;font-family:plexMono,monospace;font-weight:600;font-size:14px;letter-spacing:0.2em;color:#FFFBEE;background:rgba(0,0,0,0.5)}
.glow{position:absolute;width:0;height:0;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none}
.slabel{position:absolute;left:56px;top:110px;max-width:640px;font-family:plexMono,monospace;font-weight:600;font-size:22px;line-height:1.3;letter-spacing:0.16em;text-transform:uppercase;color:#1A1A2E;opacity:0;padding:10px 18px;border-radius:12px;background:rgba(255,251,238,0.92);border:2px solid #1A1A2E}
.slabel.butter{color:#6A4E08}.slabel.coral{color:#7A3406}.slabel.green{color:#1D5A42}
.chip{position:absolute;left:0;top:0;padding:14px 24px;background:rgba(255,251,238,0.94);border:2.5px solid #1A1A2E;border-radius:14px;box-shadow:0 5px 0 #C99A28;font-weight:800;font-size:30px;line-height:1.15;color:#1A1A2E;white-space:nowrap;opacity:0;max-width:800px;overflow:hidden;text-overflow:ellipsis}
.chip.butter{background:#FEF7E0;border-color:#C99A28}.chip.coral{background:#FBE9DC;border-color:#D4600A}.chip.green{background:#E8F0EE;border-color:#2F8F6B}
.morning .half{position:absolute;top:110px;width:${Math.round((W - 3 * 56) / 2)}px;height:${H - 110 - 330}px;border-radius:26px;overflow:hidden;box-shadow:0 20px 60px rgba(26,26,46,0.25);opacity:0}
.morning .half.l{left:56px}.morning .half.r{right:56px}
.morning .half video{left:0;top:0;width:100%;height:100%}
.half-label{position:absolute;left:24px;top:22px;font-family:plexMono,monospace;font-weight:600;font-size:20px;letter-spacing:0.2em;text-transform:uppercase;color:#FFFBEE;background:rgba(26,26,46,0.78);padding:10px 18px;border-radius:12px}
.half-label.butter{color:#1A1A2E;background:#EDC35F}
.cta .star{position:absolute;left:220px;top:50%;transform:translateY(-50%);width:460px;opacity:0}
.ctatext{position:absolute;left:800px;top:50%;transform:translateY(-50%);width:960px}
.head.ink{background:none;-webkit-text-fill-color:#1A1A2E;color:#1A1A2E;text-shadow:none;font-size:72px}
.body.ink{color:#52526A;font-size:36px;margin-top:28px}
.url{display:inline-block;margin-top:36px;font-family:plexMono,monospace;font-weight:600;font-size:26px;letter-spacing:0.08em;color:#1A1A2E;background:#EDC35F;border:3px solid #1A1A2E;border-radius:14px;padding:14px 26px;box-shadow:0 6px 0 #C99A28}
`

writeFileSync('index.html', `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080"><title>Two brains, one clock</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-width="${W}" data-height="${H}">
${html}
${audio}
</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${tl}
</script></body></html>`)

console.log(`built ${B.beats.length} beats, ${TOTAL.toFixed(1)}s`)
B.beats.forEach((b, i) => console.log(`  ${b.id.padEnd(8)} ${starts[i].s.toFixed(1).padStart(5)}s  hold ${starts[i].d.toFixed(1)}s  ${b.clock || 'CTA'}`))
