#!/usr/bin/env node
// The DiGi launch film. Builds index.html from beats.json: six scenes, every
// screen drawn in code from the real components (DigiChat, DigiScriptNudge,
// ConcernCheckIn's faces, TodayPathBig, PrintBrand's logo), DiGi from the
// star SVG with its eyes, brows and smile as their own layers so they can
// act. One paused GSAP timeline, HyperFrames owns the audio.
//   node build.mjs          full size, 1920 by 1080
//   node build.mjs --half   the draft, 960 by 540, same composition scaled
// Guards: no dash of any kind in any on screen string, a few of the banned
// phrases from content-engine/ai-tells.md, and every scene must sum to the
// length the brief sets once scenes 3 and 4 are slowed by 10 percent.
import { readFileSync, writeFileSync } from 'node:fs'
const HALF = process.argv.includes('--half')
const B = JSON.parse(readFileSync(new URL('./beats.json', import.meta.url), 'utf8'))

// ── Guards ──────────────────────────────────────────────────────────────────
const SKIP_KEYS = new Set(['file', 'id', 'kind', 'tone', 'url'])
const BANNED = ['it is worth noting', 'game changer', 'unlock', 'seamlessly', 'delve', 'leverage', 'in today', 'at the end of the day', 'let us dive', 'navigate the']
function walk(v, path = '') {
  if (typeof v === 'string') {
    if (SKIP_KEYS.has(path.split('.').pop())) return
    if (/[–—−]/.test(v) || /\s-\s/.test(v) || /\w-\w/.test(v)) throw new Error(`dash in ${path}: ${v}`)
    for (const b of BANNED) if (v.toLowerCase().includes(b)) throw new Error(`banned phrase "${b}" in ${path}: ${v}`)
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], path ? `${path}.${k}` : k)
}
walk(B)

// ── Time ────────────────────────────────────────────────────────────────────
let clock = 0
for (const sc of B.scenes) { sc.f = B.slow[sc.id] || 1; sc.start = clock; sc.dur = sc.len * sc.f; clock += sc.dur }
const TOTAL = Math.round(clock * 10) / 10
const s2 = B.scenes.find((s) => s.id === 's2')
if (Math.abs(s2.start - B.music.kickAt) > 0.01) throw new Error(`Introducing starts at ${s2.start}, the music kick is at ${B.music.kickAt}`)

// ── Helpers ─────────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]))
const J = (o) => JSON.stringify(o)
const hw = (text) => text.split(/\s+/).map((w) => `<span class="hw">${esc(w)}</span>`).join(' ')
const TL = []
const fromTo = (sel, a, b, at) => TL.push(`tl.fromTo(${J(sel)},${J(a)},${J(b)},${at.toFixed(3)});`)
const to = (sel, b, at) => TL.push(`tl.to(${J(sel)},${J(b)},${at.toFixed(3)});`)
const set = (sel, a, at) => TL.push(`tl.set(${J(sel)},${J(a)},${at.toFixed(3)});`)
const SFX = []
const SFX_DUR = { 'sfx-send': 0.42, 'sfx-pop': 0.16, 'sfx-tap': 0.05, 'sfx-dots': 0.7, 'sfx-chime': 1.4, 'sfx-tink': 0.73, 'sfx-whoosh': 0.6, 'sfx-land': 0.3, 'sfx-notify': 0.51, 'sfx-shimmer': 0.9 }
const sfx = (name, at, vol = 0.6) => { if (at >= 0 && at < TOTAL) SFX.push({ name, at, vol }) }

const STAR_PTS = '200,62 238,165 345,165 263,228 293,338 200,272 107,338 137,228 55,165 162,165'
function star(id, size, cls = '') {
  return `<svg id="${id}" class="star ${cls}" viewBox="0 0 400 430" width="${size}" height="${Math.round(size * 1.075)}" style="overflow:visible;display:block">` +
    `<g class="body" filter="url(#ds)"><polygon points="${STAR_PTS}" fill="url(#cg)" stroke="url(#cg)" stroke-width="44" stroke-linejoin="round"/></g>` +
    `<ellipse cx="184" cy="155" rx="94" ry="80" fill="url(#hl)" clip-path="url(#sc)"/><ellipse cx="200" cy="355" rx="88" ry="30" fill="url(#bounce)" clip-path="url(#sc)"/>` +
    `<g class="face"><path class="brow browL" d="M 163 207 Q 173 199 183 207" stroke="#6B4500" stroke-width="3.5" stroke-linecap="round" fill="none"/>` +
    `<path class="brow browR" d="M 217 207 Q 227 199 237 207" stroke="#6B4500" stroke-width="3.5" stroke-linecap="round" fill="none"/>` +
    `<g class="eye eyeL"><circle cx="173" cy="226" r="12.5" fill="#18120A"/><circle cx="168" cy="220" r="4" fill="#fff"/></g>` +
    `<g class="eye eyeR"><circle cx="227" cy="226" r="12.5" fill="#18120A"/><circle cx="222" cy="220" r="4" fill="#fff"/></g>` +
    `<path class="smile" d="M 183 248 Q 200 264 217 248" stroke="#6B4500" stroke-width="3.5" stroke-linecap="round" fill="none"/></g></svg>`
}
const LOGO_BARS = [5, 9, 14, 8]
function logo(size, word = false, wordPx = 0) {
  const r = size * 7 / 24, barW = size * 2.2 / 24, gap = size * 1.8 / 24, stackH = size * 11 / 24
  const bars = LOGO_BARS.map((h) => `<span style="width:${barW.toFixed(1)}px;height:${(h / 14 * stackH).toFixed(1)}px;background:#fff;border-radius:${Math.max(1, size / 24).toFixed(1)}px;display:inline-block"></span>`).join('')
  return `<span class="logo"><span class="mark" style="width:${size}px;height:${size}px;border-radius:${r.toFixed(1)}px"><span class="bars" style="gap:${gap.toFixed(1)}px;height:${stackH.toFixed(1)}px">${bars}</span></span>${word ? `<span class="word" style="font-size:${wordPx}px">Guided Childhood</span>` : ''}</span>`
}
function face5(id, size) {
  return `<svg id="${id}" class="face5" width="${size}" height="${size}" viewBox="0 0 40 40" style="overflow:visible;display:block"><circle cx="20" cy="20" r="17.5" fill="#EDC35F" stroke="#1A1A2E" stroke-width="2.2"/><path d="M11 16.5 Q14 12.5 17 16.5" fill="none" stroke="#1A1A2E" stroke-width="2.1" stroke-linecap="round"/><path d="M23 16.5 Q26 12.5 29 16.5" fill="none" stroke="#1A1A2E" stroke-width="2.1" stroke-linecap="round"/><path d="M12.5 23 Q20 34 27.5 23 Z" fill="#1A1A2E" stroke="#1A1A2E" stroke-width="2.2" stroke-linejoin="round"/><circle cx="13" cy="10.5" r="2.4" fill="#fff" fill-opacity="0.85"/></svg>`
}
const ICON = {
  mic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" stroke-width="2.4" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="#1A1A2E"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  send: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
}
function phone(id, screen, status = true) {
  return `<div id="${id}" class="phone"><div class="bezel"></div><div class="screen"><div class="island"></div>${status ? '<div class="status"><span>9:41</span><span class="sig"><i></i><i></i><i></i><i></i></span><span class="batt"><b></b></span></div>' : ''}<div class="content" style="top:${status ? 54 : 0}px">${screen}</div></div></div>`
}
function scriptCard(id, c) {
  return `<div class="scard" id="${id}"><div class="srow"><span class="sstar">${star(id + '-s', 26)}</span><div><div class="seyebrow">${esc(c.eyebrow)}</div><div class="stitle">${esc(c.title)}</div></div></div><div class="sbtns"><span class="sbtn">${esc(c.button)}</span><span class="snot">${esc(c.dismiss)}</span></div></div>`
}
function chatScreen(id, msgs) {
  let body = ''
  msgs.forEach((m, i) => {
    const mid = `${id}-m${i}`
    if (m.role === 'user') body += `<div class="msg user" id="${mid}"><div class="ub">${esc(m.text)}</div></div>`
    else if (m.cont) body += `<div class="msg digi cont" id="${mid}"><p>${esc(m.text)}</p></div>`
    else body += `<div class="msg digi" id="${mid}"><div class="drow">${star(mid + '-s', 26)}<span class="dname">DiGi</span></div><div class="dots" id="${mid}-dots"><i></i><i></i><i></i></div><div class="dbody"><p>${esc(m.text)}</p>${m.card ? scriptCard(mid + '-c', m.card) : ''}</div></div>`
  })
  return `<div class="chat"><div class="chead"><div class="cavatar">${star(id + '-hs', 36)}</div><div><div class="eyebrow">${esc(B.family.child)} · Stage ${B.family.stage}</div><div class="h1row"><h1>DiGi</h1><span class="aloud">🔈 Aloud</span></div></div></div>` +
    `<div class="cmsgs"><p class="welcome">Let's make today a little easier.</p>${body}</div>` +
    `<div class="cinput"><div class="hfrow"><span class="hf">🎧 Hands free</span></div><div class="pill"><span class="ph">Type or tap the mic</span><span class="mic">🎙️</span><span class="send">${ICON.send}</span></div><p class="disc">DiGi is a guide, not a crisis line, and can make mistakes. In an emergency call 999, or Samaritans on 116 123.</p></div></div>`
}
function lockScreen(id, L) {
  return `<div class="lock"><div class="ldate">${esc(L.date)}</div><div class="ltime">${esc(L.time)}</div><div class="lnoti" id="${id}-n"><div class="nicon">${logo(40)}</div><div class="ntext"><div class="nhead"><span class="napp">${esc(L.app)}</span><span class="nwhen">${esc(L.when)}</span></div><div class="ntitle">${esc(L.title)}</div><div class="nbody">${esc(L.body)}</div></div></div><div class="lbar"></div></div>`
}
function homeScreen(child) {
  const nodes = [['Check in', 'now', 0], ['Tonight', '', 68], ['Moment', '', -64], ['Script', '', 56], ['Lesson', '', -40]]
  const glyph = ['✓', '☾', '◷', '❝', '▤']
  const cx = 187, step = 84
  let path = '', dots = ''
  nodes.forEach(([label, st, dx], i) => {
    const x = cx + dx, y = 30 + i * step
    if (i < nodes.length - 1) {
      const nx = cx + nodes[i + 1][2], ny = y + step
      path += `<path d="M${x} ${y} C ${x} ${y + step / 2}, ${nx} ${ny - step / 2}, ${nx} ${ny}" fill="none" stroke="${i === 0 ? '#FEF08A' : '#EAEAF0'}" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/>`
    }
    dots += `<div class="hnode ${st}" style="left:${x - 28}px;top:${y - 28}px">${glyph[i]}${st === 'now' ? '<i class="ring"></i>' : ''}<span class="hlabel">${esc(label)}</span></div>`
  })
  return `<div class="home"><div class="htop"><span class="hbrand">${logo(22)}<span>Guided Childhood</span></span><span class="hday">Day 12</span></div>` +
    `<div class="hcard"><h2>Today with ${esc(child)}</h2><p class="hsub">One tick makes today count: check in. The rest is extra, not homework.</p>` +
    `<div class="hrow"><span>Today · do this next</span><span>10 min</span></div>` +
    `<div class="hchips"><span class="hchip">5 min<small>A quick day</small></span><span class="hchip on">10 min<small>The usual</small></span><span class="hchip">15 min<small>Room to go deep</small></span></div>` +
    `<div class="hpath"><svg width="374" height="400" viewBox="0 0 374 400" style="position:absolute;left:0;top:0">${path}</svg>${dots}</div></div>` +
    `<div class="htabs"><span class="on">Today</span><span>Tracker</span><span>DiGi</span><span>Passport</span></div></div>`
}
function banner(id, N) {
  return `<div class="banner" id="${id}"><div class="bicon">${logo(64)}</div><div class="btext"><div class="bhead"><span class="napp">${esc(N.app)}</span><span class="nwhen">${esc(N.when)}</span></div><div class="btitle">${esc(N.title)}</div><div class="bbody">${esc(N.body)}</div><span class="bact" id="${id}-act">${esc(N.action)}</span></div></div>`
}
// The chat choreography: a user line pops in with the send swoosh; a DiGi
// line shows the star and three dots first, then the words pop in.
function chatTL(id, msgs, s, f) {
  msgs.forEach((m, i) => {
    const mid = `#${id}-m${i}`, at = s + m.at * f
    if (m.at === 0) { set(`${mid}, ${mid} .dbody`, { opacity: 1 }, s); return }
    if (m.role === 'user') {
      fromTo(mid, { opacity: 0, scale: 0.88, y: 10, transformOrigin: '100% 100%' }, { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'back.out(2)' }, at)
      sfx('sfx-send', at, 0.5)
    } else if (m.cont) {
      fromTo(mid, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, at)
      sfx('sfx-pop', at, 0.45)
    } else {
      const dots = (m.dots || 0.6) * f, ds = at - dots
      set(mid, { opacity: 1 }, ds)
      fromTo(`${mid}-dots`, { opacity: 0 }, { opacity: 1, duration: 0.15 }, ds)
      to(`${mid}-dots i`, { y: -5, duration: 0.18, ease: 'sine.inOut', stagger: { each: 0.11, repeat: Math.max(1, Math.round(dots / 0.5)), yoyo: true } }, ds + 0.05)
      sfx('sfx-dots', ds, 0.3)
      to(`${mid}-dots`, { opacity: 0, duration: 0.08 }, at - 0.08)
      fromTo(`${mid} .dbody`, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, at)
      sfx('sfx-pop', at, 0.5)
      if (m.card) { fromTo(`${mid}-c`, { opacity: 0, scale: 0.9, transformOrigin: '50% 0%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, at + 0.3); sfx('sfx-pop', at + 0.3, 0.35) }
    }
  })
}
const blinks = (sel, times) => times.forEach((t) => { to(`${sel} .eye`, { scaleY: 0.06, duration: 0.07, transformOrigin: '50% 50%' }, t); to(`${sel} .eye`, { scaleY: 1, duration: 0.1 }, t + 0.09) })
const sceneIn = (id, s) => fromTo(`#${id}`, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' }, s)
const sceneOut = (id, e) => to(`#${id}`, { opacity: 0, duration: 0.4, ease: 'power2.in' }, e - 0.4)

// ── Scenes ──────────────────────────────────────────────────────────────────
let html = ''
for (const sc of B.scenes) {
  const s = sc.start, e = sc.start + sc.dur, f = sc.f, id = sc.id
  const T = (rel) => s + rel * f
  if (sc.kind === 'coldopen') {
    html += `<div id="${id}" class="scene"><div class="bg" id="${id}-bg"></div><div class="cam" id="${id}-cam"><div class="pwrap" style="left:745px;top:98px">${phone(id + '-phone', chatScreen(id, sc.chat))}</div></div></div>\n`
    sceneIn(id, s)
    // The bubble alone on white, then the camera pulls back and the phone,
    // its header and its input fade in around it.
    set(`#${id}-cam`, { scale: 3.1, transformOrigin: '989px 318px', x: -29, y: 222 }, s)
    set(`#${id}-phone .bezel, #${id}-phone .status, #${id}-phone .island, #${id} .chead, #${id} .welcome, #${id} .cinput`, { opacity: 0 }, s)
    to(`#${id}-m0`, { y: -7, duration: 0.85, ease: 'sine.inOut', yoyo: true, repeat: 1 }, s + 0.1)
    const pb = T(sc.pullBackAt)
    to(`#${id}-cam`, { scale: 1, x: 0, y: 0, duration: 1.4, ease: 'power3.inOut' }, pb)
    to(`#${id}-cam`, { scale: 1.3, transformOrigin: '960px 470px', duration: 4.3, ease: 'power1.inOut' }, pb + 1.5)
    to(`#${id}-bg`, { backgroundColor: '#F9F8F6', duration: 1.0 }, pb + 0.3)
    to(`#${id}-phone .bezel, #${id}-phone .status, #${id}-phone .island, #${id} .chead, #${id} .welcome, #${id} .cinput`, { opacity: 1, duration: 0.6 }, pb + 0.5)
    sfx('sfx-whoosh', pb, 0.4)
    chatTL(id, sc.chat, s, f)
    blinks(`#${id}-hs`, [s + 3.0, s + 6.2])
    sceneOut(id, e)
  }
  if (sc.kind === 'introducing') {
    const tagWords = sc.tagline.split(/\s+/), shimWords = sc.shimmer.split(/\s+/)
    const idx = sc.tagline.indexOf(sc.shimmer); if (idx < 0) throw new Error('shimmer phrase not in tagline')
    const before = sc.tagline.slice(0, idx).trim(), after = sc.tagline.slice(idx + sc.shimmer.length).trim()
    const tag = `${before ? hw(before) + ' ' : ''}<span class="shimwrap"><span class="shimbase">${hw(sc.shimmer)}</span><span class="shimglow" id="${id}-glow" aria-hidden="true">${esc(sc.shimmer)}</span></span>${after ? ' ' + hw(after) : ''}`
    html += `<div id="${id}" class="scene cream"><div class="intro" id="${id}-intro">${esc(sc.intro)}</div><div class="lockup" id="${id}-lockup">${star(id + '-star', 300)}<div class="bigname" id="${id}-name">${esc(sc.name)}</div></div><div class="tagline" id="${id}-tag">${tag}</div></div>\n`
    sceneIn(id, s)
    fromTo(`#${id}-intro`, { opacity: 0, filter: 'blur(14px)', y: 16 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.55, ease: 'power2.out' }, s)
    set(`#${id}-star .eye`, { scaleY: 0.05, transformOrigin: '50% 50%' }, s)
    fromTo(`#${id}-star`, { y: -760 }, { y: 0, duration: 0.7, ease: 'power2.in' }, s + 0.5)
    to(`#${id}-star`, { scaleX: 1.2, scaleY: 0.78, duration: 0.09, transformOrigin: '50% 92%' }, s + 1.2)
    to(`#${id}-star`, { scaleX: 0.94, scaleY: 1.08, duration: 0.14 }, s + 1.29)
    to(`#${id}-star`, { scaleX: 1, scaleY: 1, duration: 0.22, ease: 'power2.out' }, s + 1.43)
    sfx('sfx-land', s + 1.2, 0.6)
    to(`#${id}-star .eye`, { scaleY: 1, duration: 0.18, ease: 'back.out(2)' }, s + 1.55)
    to(`#${id}-star .eye`, { x: -9, duration: 0.2, ease: 'power2.inOut' }, s + 1.85)
    to(`#${id}-star .eye`, { x: 9, duration: 0.22, ease: 'power2.inOut' }, s + 2.25)
    to(`#${id}-star .eye`, { x: 0, duration: 0.2, ease: 'power2.inOut' }, s + 2.65)
    fromTo(`#${id}-name`, { opacity: 0, filter: 'blur(18px)', x: -24 }, { opacity: 1, filter: 'blur(0px)', x: 0, duration: 0.5, ease: 'power2.out' }, s + 2.7)
    sfx('sfx-pop', s + 2.75, 0.5)
    to(`#${id}-lockup`, { y: -70, duration: 0.6, ease: 'power2.inOut' }, s + 3.3)
    fromTo(`#${id}-tag .hw`, { opacity: 0, filter: 'blur(12px)', y: 10 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.07 }, s + 3.5)
    set(`#${id}-glow`, { backgroundPosition: '120% 0', opacity: 0 }, s)
    to(`#${id}-glow`, { opacity: 1, duration: 0.2 }, s + 4.5)
    to(`#${id}-glow`, { backgroundPosition: '-40% 0', duration: 0.9, ease: 'power2.inOut' }, s + 4.5)
    to(`#${id}-tag .shimbase .hw`, { color: '#C99A28', duration: 0.5 }, s + 4.9)
    to(`#${id}-glow`, { opacity: 0, duration: 0.3 }, s + 5.2)
    sfx('sfx-shimmer', s + 4.5, 0.35)
    blinks(`#${id}-star`, [s + 3.9, s + 5.0])
    sceneOut(id, e)
  }
  if (sc.kind === 'comeback') {
    const PX = 1130, PY = 98
    html += `<div id="${id}" class="scene cream"><div class="homeback" id="${id}-back">${homeScreen(B.family.child)}</div><div class="hl" id="${id}-head">${hw(sc.headline)}</div>` +
      `<div class="cam" id="${id}-cam"><div class="pwrap" id="${id}-pa" style="left:${PX}px;top:${PY}px">${phone(id + '-phoneA', lockScreen(id, sc.lock), false)}</div>` +
      `<div class="pwrap" id="${id}-pb" style="left:${PX}px;top:${PY}px">${phone(id + '-phoneB', chatScreen(id + 'c', sc.chat))}</div></div><div class="veil" id="${id}-veil"></div></div>\n`
    sceneIn(id, s)
    fromTo(`#${id}-head .hw`, { opacity: 0, filter: 'blur(14px)', y: 12 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, s + 0.1)
    set(`#${id}-pb, #${id}-back`, { opacity: 0 }, s)
    fromTo(`#${id}-pa`, { y: 760 }, { y: 0, duration: 1.0, ease: 'power3.out' }, T(sc.riseAt))
    sfx('sfx-whoosh', T(sc.riseAt), 0.35)
    const nAt = T(sc.notifyAt)
    fromTo(`#${id}-n`, { opacity: 0, y: -34, scale: 0.92, transformOrigin: '50% 0%' }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, nAt)
    sfx('sfx-notify', nAt, 0.55)
    const z = T(sc.zoomAt), zEnd = z + 0.85
    to(`#${id}-cam`, { scale: 3.6, transformOrigin: `${PX + 215}px ${PY + 14 + 352}px`, duration: 0.85, ease: 'power3.in' }, z)
    to(`#${id}-head`, { opacity: 0, duration: 0.4 }, z)
    sfx('sfx-whoosh', z + 0.2, 0.5)
    to(`#${id}-veil`, { opacity: 1, duration: 0.25 }, zEnd - 0.25)
    set(`#${id}-pa`, { opacity: 0 }, zEnd)
    set(`#${id}-pb`, { opacity: 1 }, zEnd)
    set(`#${id}-cam`, { scale: 1.7, transformOrigin: `${PX + 215}px 470px` }, zEnd)
    to(`#${id}-cam`, { scale: 1.26, duration: 0.7, ease: 'power3.out' }, zEnd)
    to(`#${id}-veil`, { opacity: 0, duration: 0.35 }, zEnd + 0.05)
    to(`#${id}-back`, { opacity: 0.3, duration: 0.8 }, zEnd)
    chatTL(id + 'c', sc.chat, s, f)
    blinks(`#${id}c-hs`, [zEnd + 1.2, zEnd + 3.4])
    sceneOut(id, e)
  }
  if (sc.kind === 'remembers') {
    const PX = 745, PY = 150
    const cards = sc.cards.map((c, i) => `<div class="mcard" id="${id}-c${i}" style="left:${(c.x / 100 * 1920).toFixed(0)}px;top:${(c.y / 100 * 1080).toFixed(0)}px">${esc(c.text)}${c.chip ? `<br><span class="chip ${c.tone}">${esc(c.chip)}</span>` : ''}</div>`).join('')
    html += `<div id="${id}" class="scene cream"><div class="hl" id="${id}-head">${hw(sc.headline)}</div><div class="cloud" id="${id}-cloud">${cards}</div>` +
      `<div class="cam" id="${id}-cam"><div class="pwrap" id="${id}-pw" style="left:${PX}px;top:${PY}px">${phone(id + '-phoneH', homeScreen(B.family.child))}</div>` +
      `<div class="pwrap" id="${id}-pwc" style="left:${PX}px;top:${PY}px">${phone(id + '-phoneC', chatScreen(id + 'c', sc.chat))}</div></div>` +
      banner(id + '-banner', sc.banner) + `<div class="ripple" id="${id}-ripple"></div>` +
      `<svg class="finger" id="${id}-finger" viewBox="0 0 120 240" width="130" height="260"><path d="M34 240 L34 70 Q34 22 60 22 Q86 22 86 70 L86 240 Z" fill="#F2C7A3"/><path d="M44 38 Q60 26 76 38 L76 64 Q60 72 44 64 Z" fill="#F9DECB"/></svg>` +
      `<div class="veil" id="${id}-veil"></div></div>\n`
    sceneIn(id, s)
    fromTo(`#${id}-head .hw`, { opacity: 0, filter: 'blur(14px)', y: 12 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, s + 0.1)
    set(`#${id}-pw, #${id}-pwc, #${id}-finger`, { opacity: 0 }, s)
    sc.cards.forEach((c, i) => {
      const at = T(sc.burstAt) + i * 0.06
      fromTo(`#${id}-c${i}`, { opacity: 0, scale: 0, xPercent: -50, yPercent: -50, x: (50 - c.x) * 7, y: (50 - c.y) * 5, rotation: c.r * 4 }, { opacity: 1, scale: 1, x: 0, y: 0, rotation: c.r, duration: 0.65, ease: 'back.out(1.5)' }, at)
      to(`#${id}-c${i}`, { y: 9, duration: 1.3 + (i % 3) * 0.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, at + 0.7)
    })
    sfx('sfx-whoosh', T(sc.burstAt), 0.5); sfx('sfx-pop', T(sc.burstAt) + 0.25, 0.4); sfx('sfx-pop', T(sc.burstAt) + 0.55, 0.3)
    to(`#${id}-cloud`, { filter: 'blur(16px)', opacity: 0.28, duration: 0.8, ease: 'power2.inOut' }, T(sc.blurAt))
    set(`#${id}-pw`, { opacity: 1 }, T(sc.riseAt))
    fromTo(`#${id}-pw`, { y: 820 }, { y: 0, duration: 1.0, ease: 'power3.out' }, T(sc.riseAt))
    sfx('sfx-whoosh', T(sc.riseAt), 0.35)
    const bAt = T(sc.bannerAt)
    fromTo(`#${id}-banner`, { opacity: 0, y: 360 }, { opacity: 1, y: 0, duration: 0.75, ease: 'back.out(1.3)' }, bAt)
    sfx('sfx-notify', bAt + 0.1, 0.6)
    const tAt = T(sc.tapAt)
    fromTo(`#${id}-finger`, { opacity: 0, x: 240, y: 300 }, { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, tAt - 0.55)
    to(`#${id}-finger`, { scale: 0.93, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: '50% 0%' }, tAt)
    to(`#${id}-banner-act`, { scale: 0.94, duration: 0.09, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, tAt)
    fromTo(`#${id}-ripple`, { opacity: 0.55, scale: 0.2 }, { opacity: 0, scale: 1.8, duration: 0.5, ease: 'power2.out' }, tAt)
    sfx('sfx-tap', tAt, 0.7)
    to(`#${id}-finger`, { opacity: 0, x: 180, y: 240, duration: 0.4, ease: 'power2.in' }, tAt + 0.25)
    const oAt = T(sc.openAt)
    to(`#${id}-banner`, { scale: 3.4, opacity: 0, duration: 0.6, ease: 'power3.in', transformOrigin: '75% 70%' }, oAt)
    sfx('sfx-whoosh', oAt, 0.5)
    to(`#${id}-head`, { opacity: 0, duration: 0.4 }, oAt)
    to(`#${id}-veil`, { opacity: 1, duration: 0.25 }, oAt + 0.35)
    set(`#${id}-pw, #${id}-cloud`, { opacity: 0 }, oAt + 0.6)
    set(`#${id}-pwc`, { opacity: 1 }, oAt + 0.6)
    set(`#${id}-cam`, { scale: 1.4, transformOrigin: '960px 540px' }, oAt + 0.6)
    to(`#${id}-cam`, { scale: 1.15, duration: 0.7, ease: 'power3.out' }, oAt + 0.6)
    to(`#${id}-veil`, { opacity: 0, duration: 0.35 }, oAt + 0.65)
    chatTL(id + 'c', sc.chat, s, f)
    const w = T(sc.winkAt)
    to(`#${id}-cam`, { scale: 2.4, transformOrigin: `${PX + 14 + 38}px ${PY + 14 + 54 + 28}px`, duration: 0.55, ease: 'power2.inOut' }, w - 0.6)
    to(`#${id}c-hs`, { rotation: -9, duration: 0.14, yoyo: true, repeat: 1, transformOrigin: '50% 60%' }, w)
    to(`#${id}c-hs .eyeR`, { scaleY: 0.06, duration: 0.09, transformOrigin: '50% 50%' }, w)
    to(`#${id}c-hs .eyeR`, { scaleY: 1, duration: 0.16, ease: 'back.out(2)' }, w + 0.3)
    sfx('sfx-tink', w, 0.35)
    sceneOut(id, e)
  }
  if (sc.kind === 'number') {
    const wordsArr = sc.headline.split(/\s+/)
    const head = wordsArr.map((w) => {
      if (w !== sc.faceWord) return `<span class="hw">${esc(w)}</span>`
      const li = sc.faceLetter
      return `<span class="hw">${esc(w.slice(0, li))}<span class="oslot"><span class="olet" id="${id}-o">${esc(w[li])}</span><span class="oface" id="${id}-face">${face5(id + '-f5', 88)}</span></span>${esc(w.slice(li + 1))}</span>`
    }).join(' ')
    const floats = sc.float.map((c, i) => `<div class="fcard ${c.kind}" id="${id}-fc${i}" style="left:${[1620, 1700, 1600][i]}px;top:${[230, 480, 690][i]}px">${c.kind === 'digi' ? star(id + '-fcs', 34) : ''}<span>${esc(c.text)}</span></div>`).join('')
    html += `<div id="${id}" class="scene cream"><div class="pan" id="${id}-pan"><div class="hl hl5" id="${id}-head">${head}</div><div class="bigstar" id="${id}-bigstar">${star(id + '-star', 250)}</div>${floats}</div></div>\n`
    sceneIn(id, s)
    fromTo(`#${id}-head .hw`, { opacity: 0, filter: 'blur(16px)', y: 14 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.09 }, s + 0.1)
    set(`#${id}-face`, { opacity: 0 }, s)
    set(`#${id}-star .eye`, { x: 7, y: -6 }, s)
    fromTo(`#${id}-bigstar`, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, s + 0.6)
    const fAt = T(sc.faceAt)
    to(`#${id}-o`, { scale: 0, opacity: 0, duration: 0.22, ease: 'power2.in', transformOrigin: '50% 50%' }, fAt)
    fromTo(`#${id}-face`, { opacity: 0, scale: 0, rotation: -200 }, { opacity: 1, scale: 1, rotation: 360, duration: 0.75, ease: 'back.out(1.4)', transformOrigin: '50% 50%' }, fAt + 0.08)
    sfx('sfx-tink', fAt + 0.1, 0.55)
    sc.jumpAt.forEach((j, k) => {
      const at = T(j)
      to(`#${id}-face`, { y: -78, duration: 0.24, ease: 'power2.out', yoyo: true, repeat: 1 }, at)
      to(`#${id}-face`, { scaleX: 1.12, scaleY: 0.86, duration: 0.08, yoyo: true, repeat: 1 }, at + 0.46)
      to(`#${id}-star .eye`, { y: -12, duration: 0.24, yoyo: true, repeat: 1 }, at)
      sfx('sfx-tink', at, 0.4)
    })
    const pAt = T(sc.panAt)
    to(`#${id}-pan`, { x: -330, duration: 1.0, ease: 'power2.inOut' }, pAt)
    to(`#${id}-star .eye`, { x: 11, y: -4, duration: 0.7, ease: 'power2.inOut' }, pAt + 0.2)
    sfx('sfx-whoosh', pAt, 0.4)
    sc.float.forEach((c, i) => {
      const at = T(c.at)
      fromTo(`#${id}-fc${i}`, { opacity: 0, scale: 0.8, y: 30, rotation: c.tilt || 0 }, { opacity: 1, scale: 1, y: 0, rotation: c.tilt || 0, duration: 0.5, ease: 'back.out(1.6)' }, at)
      sfx(c.kind === 'butter' ? 'sfx-chime' : 'sfx-pop', at, c.kind === 'butter' ? 0.55 : 0.45)
    })
    to(`#${id}-star .eye`, { x: 4, y: 0, duration: 0.5 }, T(sc.float[2].at) + 0.6)
    blinks(`#${id}-star`, [s + 1.6, T(sc.float[1].at) + 0.4])
    sceneOut(id, e)
  }
  if (sc.kind === 'end') {
    html += `<div id="${id}" class="scene cream"><div class="flip"><div class="front" id="${id}-front">${star(id + '-star', 230)}<div class="col"><div class="bigname">${esc(sc.name)}</div><div class="sub">${esc(sc.sub)}</div></div></div>` +
      `<div class="back" id="${id}-back">${logo(132, true, 108)}<div class="line6" id="${id}-line">${esc(sc.line)}</div><div class="url6" id="${id}-url">${esc(sc.url)}</div><svg class="path6" viewBox="0 0 760 40"><path id="${id}-pathline" d="M4 26 C 150 4, 380 34, 756 12" fill="none" stroke="#EDC35F" stroke-width="9" stroke-linecap="round"/></svg></div></div></div>\n`
    sceneIn(id, s)
    fromTo(`#${id}-front`, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, s + 0.15)
    sfx('sfx-pop', s + 0.2, 0.45)
    blinks(`#${id}-star`, [s + 1.3])
    const fl = T(sc.flipAt)
    set(`#${id}-back`, { opacity: 0, rotationY: 90 }, s)
    to(`#${id}-front`, { rotationY: -90, duration: 0.45, ease: 'power2.in', transformOrigin: '50% 50%' }, fl)
    sfx('sfx-whoosh', fl, 0.45)
    set(`#${id}-back`, { opacity: 1 }, fl + 0.45)
    to(`#${id}-back`, { rotationY: 0, duration: 0.6, ease: 'back.out(1.3)', transformOrigin: '50% 50%' }, fl + 0.45)
    sfx('sfx-land', fl + 0.5, 0.4)
    fromTo(`#${id}-line`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, fl + 1.0)
    fromTo(`#${id}-url`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, fl + 1.35)
    set(`#${id}-pathline`, { strokeDasharray: 820, strokeDashoffset: 820 }, s)
    to(`#${id}-pathline`, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, fl + 1.45)
    sfx('sfx-shimmer', fl + 1.45, 0.25)
  }
}

// ── Sound ───────────────────────────────────────────────────────────────────
const m = B.music
const lane = [{ t: 0, v: 0 }, { t: m.fadeIn, v: m.vol }, { t: m.fadeOutFrom, v: m.vol }, { t: TOTAL, v: 0 }]
let audio = `<audio id="music" src="assets/${m.file}" data-audio-group="music" data-start="0" data-duration="${TOTAL.toFixed(2)}" data-track-index="4" data-automation='${J({ version: 1, lanes: [{ target: 'volume', points: lane }] })}'></audio>\n`
SFX.sort((a, b) => a.at - b.at).forEach((c, i) => {
  audio += `<audio id="sfx-${i + 1}" src="assets/${c.name}.mp3" data-audio-group="sfx" data-start="${c.at.toFixed(2)}" data-duration="${SFX_DUR[c.name]}" data-track-index="${5 + (i % 4)}" data-volume="${c.vol}"></audio>\n`
})

// ── Page ────────────────────────────────────────────────────────────────────
const W = HALF ? 960 : 1920, H = HALF ? 540 : 1080
const page = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${W}, height=${H}">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js" crossorigin="anonymous"></script>
<style>
@font-face{font-family:nunito;src:url("assets/fonts/captured-nunito_latin_wght_normal-s.p.1wzrasd95pxo_.woff2")format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/captured-ibm_plex_mono_latin_600_normal-s.p.30e0eqd5fxn92.woff2")format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#F9F8F6}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#F9F8F6}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;transform:scale(${HALF ? 0.5 : 1});transform-origin:0 0;font-family:nunito,sans-serif;color:#1A1A2E;-webkit-font-smoothing:antialiased}
.scene{position:absolute;inset:0;opacity:0;overflow:hidden}
.scene.cream{background:#F9F8F6}
.bg{position:absolute;inset:0;background:#fff}
.cam,.pan{position:absolute;inset:0}
.veil{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
.pwrap{position:absolute;width:430px;height:884px}
.phone{position:relative;width:430px;height:884px;border-radius:66px}
.bezel{position:absolute;inset:0;border-radius:66px;background:#0E0E12;box-shadow:0 40px 80px rgba(26,26,46,.22),inset 0 0 0 2px #2b2b34}
.screen{position:absolute;left:14px;top:14px;right:14px;bottom:14px;border-radius:52px;overflow:hidden;background:#fff}
.island{position:absolute;top:12px;left:50%;margin-left:-60px;width:120px;height:34px;border-radius:20px;background:#0E0E12;z-index:6}
.status{position:absolute;left:0;right:0;top:0;height:54px;display:flex;justify-content:space-between;align-items:center;padding:16px 30px 0;font-weight:700;font-size:16px;z-index:5}
.sig{display:inline-flex;gap:2px;align-items:flex-end;margin-left:auto;margin-right:8px}.sig i{display:block;width:4px;background:#1A1A2E;border-radius:1px}.sig i:nth-child(1){height:5px}.sig i:nth-child(2){height:8px}.sig i:nth-child(3){height:11px}.sig i:nth-child(4){height:14px}
.batt{display:inline-block;width:27px;height:13px;border:2px solid #1A1A2E;border-radius:4px;position:relative}.batt b{position:absolute;left:2px;top:2px;bottom:2px;width:17px;background:#1A1A2E;border-radius:1px}
.content{position:absolute;left:0;right:0;bottom:0}
/* The DiGi chat, as DigiChat.tsx draws it at 390 wide */
.chat{position:absolute;inset:0;display:flex;flex-direction:column;background:#fff}
.chead{display:flex;align-items:center;gap:10px;padding:10px 20px;border-bottom:2px solid #1A1A2E;background:#fff;flex-shrink:0}
.cavatar{width:36px;height:36px;flex-shrink:0}
.eyebrow{font-family:plexMono,monospace;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#65657C;margin-bottom:1px}
.h1row{display:flex;align-items:center;gap:8px}.chead h1{font-size:17px;font-weight:900;line-height:1}
.aloud{font-size:12px;font-weight:700;border:2px solid #1A1A2E;border-radius:100px;padding:3px 9px;background:#fff;line-height:1}
.cmsgs{flex:1;padding:14px 20px 0;overflow:hidden}
.welcome{text-align:center;font-weight:800;font-size:17px;color:#52526A;margin:0 0 12px}
.msg{opacity:0}
.msg.user{display:flex;justify-content:flex-end;margin-bottom:18px}
.ub{max-width:84%;background:#DCE7FB;color:#1B2A4A;border-radius:20px;padding:12px 18px;font-size:19px;line-height:1.45;font-weight:800}
.msg.digi{position:relative;margin-bottom:20px}.msg.digi.cont{margin-top:-14px}
.drow{display:flex;align-items:center;gap:8px;margin-bottom:11px}.dname{font-weight:800;font-size:17px}
.dots{position:absolute;top:37px;left:0;display:inline-flex;gap:5px;align-items:center;background:#F9F8F6;border-radius:100px;padding:10px 14px;opacity:0}
.dots i{width:7px;height:7px;border-radius:50%;background:#AEAEC0;display:block}
.dbody{opacity:0}
.dbody p,.msg.cont p{font-size:16px;line-height:1.55;color:#1A1A2E;margin:0 0 6px;font-weight:500}
.cinput{padding:10px 20px 12px;border-top:2px solid #1A1A2E;background:#fff;flex-shrink:0}
.hfrow{display:flex;justify-content:flex-end;margin-bottom:6px}
.hf{display:inline-flex;align-items:center;gap:6px;border:2px solid #1A1A2E;border-radius:100px;padding:5px 12px;font-weight:700;font-size:15px;background:#fff;line-height:1.2}
.disc{font-size:14px;line-height:1.35;color:#65657C;text-align:center;margin-top:9px;font-weight:500}
.pill{display:flex;align-items:center;gap:8px;background:#F9F8F6;border:2px solid #EDC35F;border-radius:26px;padding:6px 6px 6px 18px}
.ph{flex:1;font-size:19px;color:#65657C;padding:9px 0;font-weight:500}
.mic,.send{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mic{background:#fff;border:2px solid #1A1A2E;font-size:20px}.send{background:#EEEEF2}
/* The script card, as DigiScriptNudge.tsx draws it */
.scard{background:#fff;border:2px solid #1A1A2E;border-radius:20px;padding:12px 16px;box-shadow:0 4px 0 #1A1A2E;margin:2px 0 8px;opacity:0}
.srow{display:flex;align-items:center;gap:11px;margin-bottom:12px}
.sstar{width:40px;height:40px;border-radius:50%;background:#FEF7E0;border:2px solid #1A1A2E;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.seyebrow{font-family:plexMono,monospace;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#C99A28}
.stitle{font-weight:900;font-size:19px;line-height:1.2;margin-top:2px}
.sbtns{display:flex;gap:8px;align-items:center}
.sbtn{background:#EDC35F;border-radius:14px;padding:7px 15px;font-weight:800;font-size:16px;box-shadow:0 4px 0 #C99A28}
.snot{margin-left:auto;font-family:plexMono,monospace;font-size:12px;font-weight:600;color:#65657C}
/* The lock screen */
.lock{position:absolute;inset:0;background:linear-gradient(180deg,#FFF6DE 0%,#F9F8F6 58%,#EEE4CF 100%)}
.ldate{position:absolute;top:86px;left:0;right:0;text-align:center;font-size:22px;font-weight:600;color:#52526A}
.ltime{position:absolute;top:110px;left:0;right:0;text-align:center;font-size:98px;font-weight:400;letter-spacing:-.02em;line-height:1.1}
.lnoti{position:absolute;left:14px;right:14px;top:300px;background:rgba(255,255,255,.94);border-radius:22px;padding:12px 14px;display:flex;gap:12px;box-shadow:0 10px 28px rgba(26,26,46,.14);opacity:0}
.nicon{flex-shrink:0}.ntext{flex:1;min-width:0}
.nhead,.bhead{display:flex;justify-content:space-between;align-items:baseline}
.napp{font-family:plexMono,monospace;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#52526A}
.nwhen{font-size:13px;color:#65657C;font-weight:600}
.ntitle{font-weight:800;font-size:17px;margin-top:3px}.nbody{font-size:16px;line-height:1.35;font-weight:500}
.lbar{position:absolute;bottom:10px;left:50%;margin-left:-70px;width:140px;height:5px;border-radius:3px;background:#1A1A2E;opacity:.55}
/* Home, as TodayPathBig.tsx draws it */
.home{position:absolute;inset:0;background:#F1EFEA;padding:12px 14px}
.htop{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.hbrand{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:16px}
.hday{font-family:plexMono,monospace;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:#EDC35F;border:2px solid #1A1A2E;border-radius:100px;padding:4px 10px}
.hcard{background:#fff;border:2px solid #1A1A2E;border-radius:20px;padding:18px 16px 10px;box-shadow:0 4px 0 #1A1A2E}
.hcard h2{font-weight:900;font-size:22px;letter-spacing:-.01em;line-height:1.2;margin:0 0 3px}
.hsub{font-size:16px;color:#52526A;line-height:1.45;margin:0 0 12px;font-weight:500}
.hrow{display:flex;justify-content:space-between;font-family:plexMono,monospace;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#65657C;margin-bottom:8px}
.hchips{display:flex;gap:8px;margin-bottom:10px}
.hchip{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 6px 9px;border-radius:14px;border:2px solid #1A1A2E;background:#fff;box-shadow:0 4px 0 #1A1A2E;font-size:16px;font-weight:900;color:#65657C;line-height:1}
.hchip.on{background:#EDC35F;color:#1A1A2E}.hchip small{font-size:12px;font-weight:500;color:#65657C}
.hpath{position:relative;height:400px}
.hnode{position:absolute;width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid #1A1A2E;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#1A1A2E}
.hnode.now{background:#EDC35F;box-shadow:0 4px 0 #1A1A2E}
.hnode .ring{position:absolute;inset:-8px;border:3px solid #EDC35F;border-radius:50%;opacity:.5}
.hlabel{position:absolute;top:60px;left:50%;width:110px;margin-left:-55px;text-align:center;font-size:13px;font-weight:800}
.htabs{position:absolute;left:0;right:0;bottom:0;height:78px;background:#fff;border-top:2px solid #1A1A2E;display:flex;justify-content:space-around;align-items:center;font-size:13px;font-weight:800;color:#65657C}
.htabs .on{color:#1A1A2E;border-bottom:3px solid #EDC35F;padding-bottom:3px}
.homeback{position:absolute;left:1144px;top:110px;width:402px;height:856px;transform:scale(1.65);transform-origin:50% 50%;filter:blur(16px);opacity:0}
/* Headlines */
.hl{position:absolute;font-weight:900;letter-spacing:-.015em;line-height:1.06;color:#1A1A2E}
.hw{display:inline-block;opacity:0;filter:blur(14px);will-change:transform,opacity,filter}
#s3-head{left:120px;top:120px;font-size:84px;width:820px}
#s4-head{left:0;right:0;top:66px;text-align:center;font-size:84px}
.hl5{left:0;right:0;top:380px;text-align:center;font-size:106px;letter-spacing:-.02em}
.oslot{position:relative;display:inline-block}.olet{display:inline-block}
.oface{position:absolute;left:50%;top:50%;margin:-42px 0 0 -44px;opacity:0}
.bigstar{position:absolute;left:960px;top:650px}
/* Introducing */
.intro{position:absolute;left:0;right:0;top:170px;text-align:center;font-size:52px;font-weight:700;color:#52526A;opacity:0}
.lockup{position:absolute;left:0;right:0;top:300px;display:flex;justify-content:center;align-items:center;gap:48px}
.bigname{font-size:210px;font-weight:900;letter-spacing:-.035em;line-height:1;opacity:0}
.tagline{position:absolute;left:0;right:0;top:812px;text-align:center;font-size:62px;font-weight:800;letter-spacing:-.012em;line-height:1.15}
.tagline .hw{margin-right:.02em}
.shimwrap{position:relative;display:inline-block}
.shimglow{position:absolute;left:0;top:0;white-space:nowrap;color:transparent;-webkit-background-clip:text;background-clip:text;background-image:linear-gradient(100deg,rgba(237,195,95,0) 30%,#EDC35F 50%,rgba(237,195,95,0) 70%);background-size:220% 100%;background-repeat:no-repeat;opacity:0;pointer-events:none}
/* Memory cards and the big notification */
.cloud{position:absolute;inset:0}
.mcard{position:absolute;background:#fff;border:2px solid #1A1A2E;border-radius:16px;padding:14px 20px;font-weight:800;font-size:25px;line-height:1.25;box-shadow:0 5px 0 #1A1A2E;max-width:370px;opacity:0;white-space:normal}
.chip{display:inline-block;margin-top:9px;font-family:plexMono,monospace;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;border-radius:100px;padding:5px 10px;line-height:1}
.chip.worry{background:#FBE9E9;color:#B64837}.chip.resting{background:#FFF6DE;color:#7A5A0E}.chip.agreed{background:#E8F4EE;color:#2D5016}.chip.worked{background:#DCEBF7;color:#1F4E6E}
.banner{position:absolute;left:440px;top:620px;width:1040px;background:rgba(255,255,255,.97);border:2px solid #1A1A2E;border-radius:28px;box-shadow:0 10px 0 #1A1A2E,0 34px 70px rgba(26,26,46,.18);padding:26px 30px;display:flex;gap:24px;opacity:0;z-index:4}
.bicon{flex-shrink:0}.btext{flex:1}
.btitle{font-weight:900;font-size:30px;margin-top:4px}.bbody{font-size:27px;line-height:1.35;margin-top:6px;font-weight:500}
.bact{display:inline-block;align-self:center;flex-shrink:0;margin-left:14px;background:#EDC35F;border:2px solid #1A1A2E;border-radius:16px;padding:12px 22px;font-weight:800;font-size:22px;box-shadow:0 5px 0 #C99A28}
.finger{position:absolute;left:1290px;top:712px;z-index:6;opacity:0;filter:drop-shadow(0 10px 14px rgba(26,26,46,.25))}
.ripple{position:absolute;left:1295px;top:662px;width:120px;height:120px;border-radius:50%;border:4px solid #1A1A2E;opacity:0;z-index:5}
/* Watches the number move */
.fcard{position:absolute;opacity:0;border:2px solid #1A1A2E;border-radius:20px;padding:22px 28px;font-weight:800;font-size:31px;line-height:1.3;width:540px;box-shadow:0 6px 0 #1A1A2E;background:#fff}
.fcard.butter{background:#EDC35F}
.fcard.sky{background:#DCE7FB;color:#1B2A4A;font-size:46px;font-weight:900;letter-spacing:.02em;width:auto;white-space:nowrap}
.fcard.digi{display:flex;gap:14px;align-items:flex-start}
/* End card */
.flip{position:absolute;inset:0;perspective:1800px}
.front{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:44px;backface-visibility:hidden;opacity:0}
.front .col{display:flex;flex-direction:column}.front .bigname{opacity:1;font-size:176px}
.front .sub{font-size:40px;font-weight:700;color:#52526A;margin-top:6px}
.back{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;padding:330px 0 0 432px;backface-visibility:hidden;opacity:0}
.logo{display:inline-flex;align-items:center;gap:26px}
.logo .mark{display:inline-flex;align-items:center;justify-content:center;background:#EDC35F;flex-shrink:0}
.logo .bars{display:inline-flex;align-items:flex-end}
.logo .word{font-weight:800;letter-spacing:-.02em;line-height:1;white-space:nowrap}
.line6{font-size:40px;font-weight:800;margin:50px 0 0 158px;opacity:0}
.url6{font-family:plexMono,monospace;font-size:26px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#52526A;margin:16px 0 0 158px;opacity:0}
.path6{position:absolute;left:590px;top:640px;width:760px;height:40px}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(1)}" data-width="${W}" data-height="${H}" data-fps="30">
<div id="stage">
<svg width="0" height="0" style="position:absolute;left:0;top:0" aria-hidden="true"><defs>
<radialGradient id="cg" cx="44%" cy="36%" r="62%"><stop offset="0%" stop-color="#FFFEF4"/><stop offset="15%" stop-color="#FFF3C0"/><stop offset="55%" stop-color="#F5CD3A"/><stop offset="100%" stop-color="#D4A318"/></radialGradient>
<radialGradient id="hl" cx="40%" cy="28%" r="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.78)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<radialGradient id="bounce" cx="50%" cy="100%" r="40%"><stop offset="0%" stop-color="rgba(240,185,20,0.22)"/><stop offset="100%" stop-color="rgba(240,185,20,0)"/></radialGradient>
<filter id="ds" x="-32%" y="-22%" width="164%" height="168%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#C08B0A" flood-opacity="0.22"/></filter>
<clipPath id="sc"><polygon points="${STAR_PTS}"/></clipPath>
</defs></svg>
${html}</div>
${audio}</div>
<script>
window.__timelines = window.__timelines || {};
var tl = window.__timelines["main"] = gsap.timeline({ paused: true });
${TL.join('\n')}
</script></body></html>`
writeFileSync(new URL('./index.html', import.meta.url), page)
console.log(`built ${B.scenes.length} scenes, ${TOTAL}s, ${SFX.length} sound cues, ${HALF ? 'half size 960x540' : 'full size 1920x1080'}`)
B.scenes.forEach((sc) => console.log(`  ${sc.id}  ${sc.start.toFixed(1).padStart(5)}s  ${sc.dur.toFixed(1)}s  ${sc.kind}`))
