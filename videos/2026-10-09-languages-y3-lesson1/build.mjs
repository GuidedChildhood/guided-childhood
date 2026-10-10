#!/usr/bin/env node
// Year 3 languages, Lesson 1: the teach along film. One beats file, two films.
//   node build.mjs --lang es          Spanish, full size 1920 by 1080
//   node build.mjs --lang fr --half   French, the half size draft
// Writes index.html (the composition HyperFrames checks and renders). One
// paused GSAP timeline; HyperFrames owns every sound. Nothing is timed by
// hand: each part runs from the measured speech in assets/audio/timing.json
// (tools/measure.mjs) and the Bloop clips' own speech in assets/clips/clips.json
// (tools/clips.mjs). "Your turn" pauses are windows with no audio at all.
// Guards, the build refuses to write a film that breaks them:
//   1. no dash of any kind in English on screen or spoken; target language
//      strings may keep a hyphen only inside a real compound word;
//   2. the banned phrases from .claude/skills/content-engine/ai-tells.md;
//   3. every target language word on screen or spoken is in that lesson's
//      spine words, its sound's example words or its grammar examples.
import { readFileSync, writeFileSync } from 'node:fs'

const argv = process.argv.slice(2)
const LANG = argv[argv.indexOf('--lang') + 1]
if (!['es', 'fr'].includes(LANG)) throw new Error('usage: node build.mjs --lang es|fr [--half]')
const HALF = argv.includes('--half')
const here = (p) => new URL('./' + p, import.meta.url)
const B = JSON.parse(readFileSync(here('beats.json'), 'utf8'))
const F = B.films[LANG]
const PT = F.parts
const P = B.pace
const TIM = JSON.parse(readFileSync(here('assets/audio/timing.json'), 'utf8'))
const CLIPS = JSON.parse(readFileSync(here('assets/clips/clips.json'), 'utf8'))
const SPINE = JSON.parse(readFileSync(new URL('../../' + F.spine, import.meta.url), 'utf8'))

// ── Guards ──────────────────────────────────────────────────────────────────
const fail = (m) => { console.error('BUILD REFUSED: ' + m); process.exit(1) }
const BANNED = ['it is worth noting', 'it is important to note', "in today's world", 'at the end of the day', 'that being said', 'having said that', 'with that in mind', 'let us dive', 'delve', 'leverage', 'game changer', 'unlock', 'seamlessly', 'in conclusion', 'i hope this helps', 'feel free to', 'great question', 'navigate the', 'in an era where', 'more than ever', 'the reality is', 'truth be told', 'when it comes to', 'plays a crucial role', 'here is the thing', 'let me explain', 'the key takeaway', 'here is why']
const ANY_DASH = /[-‐-―−﹘﹣－]/
const LONG_DASH = /[‐-―−﹘﹣－]/
function guardEn(s, where) {
  if (ANY_DASH.test(s)) fail(`dash in English ${where}: ${s}`)
  for (const b of BANNED) if (s.toLowerCase().includes(b)) fail(`banned phrase "${b}" in ${where}: ${s}`)
}
const lesson = SPINE.units[0].lessons[0]
const byId = (arr, id) => arr.find((x) => x.id === id)
const norm = (w) => w.normalize('NFC').toLowerCase().replace(/[¡!¿?,.«»:;" ]/g, '').trim()
const toks = (s) => s.split(/[\s ]+/).map(norm).filter(Boolean)
const ALLOWED = new Set()
for (const id of lesson.new_words) toks(byId(SPINE.words, id).word).forEach((w) => ALLOWED.add(w))
for (const id of lesson.sounds) { const s = byId(SPINE.sounds, id); s.examples.forEach((e) => toks(e).forEach((w) => ALLOWED.add(w))); s.grapheme.split(/[ ,]+/).forEach((g) => ALLOWED.add(norm(g))) }
for (const id of lesson.grammar) byId(SPINE.grammar, id).examples.forEach((e) => toks(e).forEach((w) => ALLOWED.add(w)))
const SOUNDS = lesson.sounds.flatMap((id) => byId(SPINE.sounds, id).grapheme.split(/[ ,]+/).filter(Boolean))
function guardTl(s, where) {
  if (LONG_DASH.test(s)) fail(`dash in target language ${where}: ${s}`)
  if (/(^|[^\p{L}])-|-($|[^\p{L}])/u.test(s)) fail(`hyphen outside a compound word in ${where}: ${s}`)
  for (const w of toks(s)) if (!ALLOWED.has(w)) fail(`"${w}" in ${where} is not a Lesson 1 word (${F.spine}): ${s}`)
}
Object.entries(B.shared_en).forEach(([k, v]) => guardEn(v, 'shared_en.' + k))
Object.entries(F.en).forEach(([k, v]) => guardEn(v, `films.${LANG}.en.${k}`))
Object.entries(F.tl).forEach(([k, v]) => guardTl(v, `films.${LANG}.tl.${k}`))
const TITLES = ['Bloop says hello', 'Today we will', 'The sound of the day', 'New words', 'Bloop asks, you answer', 'Sing it', 'Spot the sound', 'What we learned', 'Bloop says goodbye']
const LABELS = { turn: 'Your turn!', point: 'Point!', you: 'You', bloop: 'Bloop', means: 'Means', home: 'Job for home', homeHead: 'Teach someone at home tonight', listenClap: 'First time: listen and clap', singAlong: 'Now sing along!', ear: 'Listen' }
;[...TITLES, ...Object.values(LABELS), F.eyebrow].forEach((s, i) => guardEn(s, 'label ' + i))
PT.hello.show.forEach((s) => guardTl(s, 'hello.show'))
PT.bye.show.forEach((s) => guardTl(s, 'bye.show'))
PT.sound.sounds.forEach((s) => { guardTl(s.grapheme + (s.also ? ' ' + s.also : ''), 'sound.grapheme'); s.examples.forEach((e) => guardTl(e.show, 'sound.example')) })
PT.words.list.forEach((w) => { guardTl(w.show, 'words.show'); guardEn(w.meaning, 'words.meaning'); (w.after || []).forEach((a) => { if (a.show) guardTl(a.show, 'words.after'); if (a.label) guardEn(a.label, 'words.after.label') }) })
PT.ask.turns.forEach((x) => { if (x.bloopShow) guardTl(x.bloopShow, 'ask.bloop'); guardTl(x.answerShow, 'ask.answer') })
PT.sing.bars.flat().forEach((x) => guardTl(x.t, 'sing'))
PT.spot.questions.forEach((q) => q.options.forEach((o) => guardTl(o, 'spot.option')))
PT.learned.homeShow.forEach((s) => guardTl(s, 'learned.homeShow'))

// ── Helpers ─────────────────────────────────────────────────────────────────
const J = (o) => JSON.stringify(o)
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]))
const r3 = (x) => Math.round(x * 1000) / 1000
// Tweens are collected, then written in one pass so every fromTo after the
// first on a target gets immediateRender false (a stable baseline for seeks),
// and durations are floored a hair so back to back tweens never touch.
const TW = []
const dur = (b) => (b.duration > 0.01 ? { ...b, duration: Math.floor(b.duration * 1000) / 1000 - 0.002 } : b)
const fromTo = (sel, a, b, at) => TW.push({ k: 'fromTo', sel, a, b: dur(b), at: r3(at) })
const to = (sel, b, at) => TW.push({ k: 'to', sel, b: dur(b), at: r3(at) })
const set = (sel, a, at) => TW.push({ k: 'set', sel, a, at: r3(at) })
function writeTL() {
  const first = {}
  TW.forEach((x, i) => { if (x.k === 'fromTo' && (first[x.sel] == null || x.at < TW[first[x.sel]].at)) first[x.sel] = i })
  return TW.map((x, i) => {
    if (x.k === 'set') return `tl.set(${J(x.sel)},${J(x.a)},${x.at});`
    if (x.k === 'to') return `tl.to(${J(x.sel)},${J(x.b)},${x.at});`
    const b = first[x.sel] === i ? x.b : { ...x.b, immediateRender: false }
    return `tl.fromTo(${J(x.sel)},${J(x.a)},${J(b)},${x.at});`
  }).join('\n')
}
const fadeIn = (sel, at, d = 0.35, y = 18) => fromTo(sel, { opacity: 0, y }, { opacity: 1, y: 0, duration: d, ease: 'power2.out' }, at)
const fadeOut = (sel, at, d = 0.3) => to(sel, { opacity: 0, duration: d, ease: 'power2.in' }, at)
let uid = 0
const nid = (p) => `${p}${++uid}`

// The speech in a file: lead in trimmed, length from the first to the last sound.
function audioKey(k) {
  if (F.en[k] != null) return { key: `en/${LANG}_${k}`, text: F.en[k], lang: 'en' }
  if (B.shared_en[k] != null) return { key: `en/${k}`, text: B.shared_en[k], lang: 'en' }
  if (F.tl[k] != null) return { key: `${LANG}/${k}`, text: F.tl[k], lang: LANG }
  fail('no line for ' + k)
}
const speechOf = (k) => { const a = audioKey(k); const m = TIM[a.key]; if (!m) fail(`no audio for ${a.key}: run tools/fetch.sh then tools/measure.mjs`); return m.speech }

// Target language word, one span per letter so the build can light the sound
// of the day, fade the silent letters and gold the Spanish marks. French puts
// a space before ! and ?; it is held to the word with a no break space.
const FOLD = (c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
function litIndices(str, sounds = SOUNDS) {
  const chars = [...str], out = []
  chars.forEach((c, i) => {
    const f = FOLD(c)
    if (!sounds.includes(f)) return
    if (LANG === 'fr') {
      // i and y say /i/ unless they are part of oi, ai, ei, ui or a nasal in, im
      const prev = FOLD(chars[i - 1] || ''), next = FOLD(chars[i + 1] || '')
      if ('aeou'.includes(prev) && prev) return
      if ((next === 'n' || next === 'm') && !'aeiouy'.includes(FOLD(chars[i + 2] || 'x'))) return
    }
    out.push(i)
  })
  return out
}
const CHAR_W = (c) => (/[il!¡.,'íìjI|  ]/.test(c) ? 0.3 : /[mwMW]/.test(c) ? 0.92 : /[A-Z]/.test(c) ? 0.7 : /[¿?]/.test(c) ? 0.5 : 0.6)
const estW = (s, px) => [...s].reduce((a, c) => a + CHAR_W(c), 0) * px
function fitPx(s, maxW, max = 190, min = 140) {
  const chunks = s.replace(/ ([!?])/g, ' $1').split(' ')
  const widest = Math.max(...chunks.map((c) => estW(c, 1)))
  const one = estW(s.replace(/ ([!?])/g, ' $1'), 1)
  let px = Math.min(max, Math.floor(maxW / one))
  if (px < min) px = Math.max(min, Math.min(max, Math.floor(maxW / widest)))
  return px
}
function tlWord(id, s, { px, lit = [], silent = [], cls = '', style = '' } = {}) {
  const fixed = s.replace(/ ([!?])/g, ' $1')
  const chars = [...fixed]
  let html = '', i = 0
  const words = fixed.split(' ')
  words.forEach((w, wi) => {
    html += '<span class="wd">'
    for (const c of [...w]) {
      const k = []
      if (lit.includes(i)) k.push('lit')
      if (silent.includes(i)) k.push('sil')
      if (/[¡!¿?]/.test(c)) k.push('mk')
      html += `<span class="l ${k.join(' ')}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`
      i++
    }
    html += '</span>'
    if (wi < words.length - 1) { html += ' '; i++ }
  })
  void chars
  return `<div class="tlw ${cls}" id="${id}" style="font-size:${px}px;${style}">${html}</div>`
}
// Build a written word: letters rise one by one, then the sound lights.
function buildWord(id, s, at, { lit = [], silent = [] } = {}) {
  fromTo(`#${id}`, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at)
  fromTo(`#${id} .l`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.34, ease: 'back.out(2)', stagger: 0.06 }, at)
  const n = [...s].length
  const lightAt = at + 0.06 * n + 0.3
  if (lit.length) lightUp(id, lightAt)
  if (silent.length) to(`#${id} .sil`, { opacity: 0.22, duration: 0.4 }, lightAt + 0.3)
  return lightAt + 0.5
}
function lightUp(id, at, sel = '.lit') {
  fromTo(`#${id} ${sel}`, { color: '#1A1A2E', textShadow: '0 0 0px rgba(108,158,56,0)', backgroundSize: '0% 0.075em' },
    { color: '#6C9E38', textShadow: '0 0 30px rgba(108,158,56,0.55)', backgroundSize: '100% 0.075em', duration: 0.45, ease: 'power2.out' }, at)
}

// ── Sound and captions ──────────────────────────────────────────────────────
const AUD = [], CAPS = [], PAUSES = [], VIDS = []
let t = 0
function place(k, at, { track, vol = 1, ear = true } = {}) {
  const a = audioKey(k), m = TIM[a.key]
  if (!m) fail(`no audio for ${a.key}`)
  AUD.push({ id: nid('au'), src: m.file, at, dur: m.speech, lead: m.lead, track: track ?? (a.lang === 'en' ? 1 : 2), vol })
  if (a.lang === 'en') CAPS.push({ text: a.text, at, end: at + m.speech })
  else if (ear) earOn(at, m.speech)
  return m.speech
}
const en = (k, gap = P.gap) => { const at = t; t += place(k, t) + gap; return at }
const tl_ = (k, gap = P.gap, opts) => { const at = t; t += place(k, t, opts) + gap; return at }
const wait = (s) => { t += s }
// Words in a line for the pause length: French "Bonjour !" is one word, not two.
const nWords = (s) => s.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length

// The ear: a green badge that pulses while the native voice is speaking.
function earOn(at, d) {
  fromTo('#ear', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, at - 0.05)
  const reps = Math.max(1, Math.round(d / 0.18)) | 1
  fromTo('#ear i', { scaleY: 0.35 }, { scaleY: 1, duration: 0.18, ease: 'sine.inOut', stagger: 0.06, yoyo: true, repeat: reps }, at)
  to('#ear', { opacity: 0, duration: 0.2 }, at + d + 0.15)
}

// ── Bloop in the dock ───────────────────────────────────────────────────────
const G = '#bloop'
function hop(at) {
  to(G, { y: -46, scaleY: 1.06, scaleX: 0.95, duration: 0.2, ease: 'power2.out' }, at)
  to(G, { y: 0, scaleY: 0.9, scaleX: 1.08, duration: 0.18, ease: 'power2.in' }, at + 0.2)
  to(G, { scaleY: 1, scaleX: 1, duration: 0.3, ease: 'back.out(3)' }, at + 0.38)
}
function gesture(kind, at, d) {
  if (kind === 'wave') {
    fromTo('#hand', { opacity: 0, rotation: -10 }, { opacity: 1, rotation: 18, duration: 0.2 }, at)
    to('#hand', { rotation: -18, duration: 0.22, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at + 0.2)
    to('#hand', { opacity: 0, rotation: 0, duration: 0.2 }, at + 1.2)
    to(G, { rotation: -5, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, at)
  } else if (kind === 'sun') {
    fromTo('#sun', { opacity: 0, y: 140 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, at)
    to('#sun', { opacity: 0, duration: 0.4 }, at + Math.max(1.6, d))
    hop(at + 0.5)
  } else if (kind === 'nod') {
    to(G, { y: 12, scaleY: 0.94, duration: 0.16, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at)
  } else if (kind === 'shake') {
    to(G, { rotation: 7, x: 10, duration: 0.11, ease: 'sine.inOut' }, at)
    to(G, { rotation: -7, x: -10, duration: 0.22, yoyo: true, repeat: 2, ease: 'sine.inOut' }, at + 0.11)
    to(G, { rotation: 0, x: 0, duration: 0.15 }, at + 0.77)
  } else if (kind === 'bow') {
    to(G, { rotation: 13, duration: 0.3, ease: 'power2.out' }, at)
    to(G, { rotation: 0, duration: 0.4, ease: 'back.out(2)' }, at + 0.65)
  }
}
function talk(at, d) {
  const reps = Math.max(1, Math.floor(d / 0.13) - 1) | 1
  to(G, { scaleY: 1.04, scaleX: 0.98, duration: 0.13, yoyo: true, repeat: reps, ease: 'sine.inOut' }, at)
}
// A silent clip of Bloop in the dock (Listening or Celebrate), in a card.
let DOCK_CLIPS = ''
function dockClip(name, at, d, mode = 'mid') {
  const c = B.clips[name], id = nid('dc')
  DOCK_CLIPS += `<div class="dclip ${mode}" id="${id}"><video id="${id}v" src="${c.file}" muted playsinline data-start="${r3(at)}" data-duration="${r3(d)}" data-media-start="0.3" data-track-index="${10 + (uid % 2)}"></video></div>\n`
  VIDS.push({ at, end: at + d })
  fromTo(`#${id}`, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, at)
  to(`#${id}`, { opacity: 0, duration: 0.2 }, at + d - 0.2)
  to('#bloopwrap, #dock .plate', { opacity: 0, duration: 0.2 }, at - 0.05)
  to('#bloopwrap, #dock .plate', { opacity: 1, duration: 0.25 }, at + d - 0.1)
}

// ── Your turn: a silent window with a countdown ring ────────────────────────
let RINGS = ''
const RING_AT = {
  panel: { left: 1130, top: 380, size: 300, label: 'above' },
  low: { left: 1260, top: 545, size: 230, label: 'left' },
  you: { left: 1640, top: 560, size: 170, label: 'left' },
  dock: { left: 120, top: 570, size: 200, label: 'right' },
}
function pause(secs, where = 'panel', label = LABELS.turn) {
  const a = t, b = t + secs, id = nid('ring'), R = RING_AT[where], N = Math.ceil(secs - 0.05)
  PAUSES.push([a, b])
  const C = 2 * Math.PI * 100
  let nums = ''
  for (let v = N; v >= 1; v--) nums += `<b id="${id}n${v}">${v}</b>`
  RINGS += `<div class="ring lab-${R.label}" id="${id}" style="left:${R.left}px;top:${R.top}px;width:${R.size}px;height:${R.size}px">` +
    `<div class="rlabel" data-layout-allow-overflow style="font-size:${R.size > 200 ? 72 : 60}px">${esc(label)}</div>` +
    `<svg viewBox="0 0 240 240" width="${R.size}" height="${R.size}"><circle cx="120" cy="120" r="100" fill="#fff" stroke="#EFE6D2" stroke-width="20"/>` +
    `<circle class="prg" cx="120" cy="120" r="100" fill="none" stroke="#EDC35F" stroke-width="20" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" transform="rotate(-90 120 120)"/></svg>` +
    `<div class="rnum" style="font-size:${Math.round(R.size * 0.42)}px">${nums}</div></div>\n`
  fromTo(`#${id}`, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, a)
  fromTo(`#${id} .prg`, { strokeDashoffset: 0 }, { strokeDashoffset: C, duration: secs, ease: 'none' }, a)
  for (let v = N; v >= 1; v--) {
    const s = Math.max(a, b - v), e = b - v + 1
    fromTo(`#${id}n${v}`, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'back.out(2)' }, s)
    to(`#${id}n${v}`, { opacity: 0, duration: 0.1 }, Math.min(e, b) - 0.1)
  }
  to(`#${id}`, { opacity: 0, scale: 0.9, duration: 0.25 }, b)
  dockClip('listening', a, secs, where === 'dock' ? 'top' : 'mid')
  t = b + P.gap
  return a
}

// ── Parts ───────────────────────────────────────────────────────────────────
let HTML = ''
const PARTS = []
function partStart(n) { PARTS.push({ n, at: t }); return t }

// 1. Bloop says hello.
function clipPart(n, spec, clipName, before) {
  const s = partStart(n)
  const C = CLIPS[clipName]
  if (!C) fail(`clip ${clipName} missing: run tools/clips.mjs`)
  if (before) { wait(0.5); en(before) }
  const c0 = t + 0.3
  HTML += `<div class="part" id="p${n}">`
  const px = fitPx(spec.show.join(' '), 1700, 160, 140)
  const showIds = spec.show.map(() => nid('sw'))
  HTML += `<div class="cliprow" style="font-size:${px}px">${spec.show.map((w, i) => tlWord(showIds[i], w, { px, lit: litIndices(w) })).join('')}</div>`
  HTML += `<div class="bigcard" id="p${n}card"><div class="still"><div class="splate"></div><div class="sbloop"></div></div><video id="p${n}v" src="${C.file}" muted playsinline data-start="${r3(c0)}" data-duration="${r3(C.dur)}" data-track-index="9"></video></div>`
  HTML += '</div>\n'
  fadeIn(`#p${n}`, s, 0.4, 0)
  fadeIn(`#p${n}card`, s, 0.5, 30)
  set(`#p${n}card .still`, { opacity: 0 }, c0)
  const sayAt = c0 + C.speechAt
  const spoken = place(spec.say, sayAt, { ear: false })
  // Light each phrase as it is said, in proportion to the separate recordings.
  const parts = spec.sayParts || [spec.say]
  const lens = parts.map((k) => speechOf(k)), total = lens.reduce((a, b) => a + b, 0)
  let off = 0
  showIds.forEach((id, i) => {
    const w = spec.show[i]
    fromTo(`#${id} .l`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)', stagger: 0.04 }, sayAt + off * spoken)
    if (litIndices(w).length) lightUp(id, sayAt + off * spoken + 0.3)
    off += (lens[i] ?? 0) / total
  })
  t = c0 + C.dur
  set(`#p${n}card .still`, { opacity: 1 }, t)
  return { s }
}

function part1() {
  clipPart(1, { ...PT.hello, sayParts: LANG === 'es' ? ['hola', 'buenos'] : ['bonjour'] }, `hello-${LANG}`)
  wait(0.3)
  en(PT.hello.en)
  wait(0.4)
  fadeOut('#p1', t)
  wait(0.4)
}

// 2. Today we will.
function icanCards(prefix, keys) {
  return keys.map((k, i) => `<div class="ican" id="${prefix}${i}" style="top:${230 + i * 175}px"><span class="box"><svg viewBox="0 0 40 40" width="44" height="44"><path d="M9 21 L17 29 L31 12" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40"/></svg></span><span class="itext">${esc(F.en[k])}</span></div>`).join('')
}
function part2() {
  const s = partStart(2)
  HTML += `<div class="part" id="p2">${icanCards('ic', PT.today.ican)}</div>\n`
  set('#p2', { opacity: 1 }, s)
  hop(s + 0.1)
  en('today')
  PT.today.ican.forEach((k, i) => { fadeIn(`#ic${i}`, t - 0.1, 0.4, 24); en(k, 0.45) })
  wait(0.5)
  fadeOut('#p2', t)
  wait(0.4)
}

// 3. The sound of the day.
function part3() {
  const s = partStart(3)
  HTML += '<div class="part" id="p3">'
  set('#p3', { opacity: 1 }, s)
  PT.sound.sounds.forEach((snd, si) => {
    const gid = `snd${si}`, exIds = snd.examples.map(() => nid('ex'))
    const glyphs = [snd.grapheme, snd.also].filter(Boolean)
    HTML += `<div class="sset" id="${gid}"><div class="glyphs">${glyphs.map((g, gi) => `<div class="tlw glyph" id="${gid}g${gi}" style="font-size:${gi ? 240 : 300}px"><span class="wd"><span class="l lit">${esc(g)}</span></span></div>`).join('<span class="gsep" id="' + gid + 'sep">and</span>')}</div>`
    HTML += `<div class="exrow">${snd.examples.map((e, i) => tlWord(exIds[i], e.show, { px: 150, lit: litIndices(e.show, [snd.grapheme]), silent: e.silent || [] })).join('')}</div></div>`
    set(`#${gid}`, { opacity: 1 }, t)
    if (si === 0) en('sound_intro')
    buildWord(`${gid}g0`, snd.grapheme, t - 0.2, {})
    const introAt = en(snd.intro)
    if (snd.also) {
      const yAt = introAt + speechOf(snd.intro) * 0.62
      fadeIn(`#${gid}sep`, yAt, 0.3, 0)
      buildWord(`${gid}g1`, snd.also, yAt + 0.1, {})
      lightUp(`${gid}g1`, yAt + 0.4)
    }
    const sayAt = tl_(snd.say, 0.5)
    lightUp(`${gid}g0`, sayAt)
    fromTo(`#${gid}g0`, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }, sayAt)
    en('yourturn', 0.15)
    pause(P.soundPause, 'low')
    hop(t - 0.2)
    en(snd.tip)
    en('examples', 0.5)
    snd.examples.forEach((e, i) => {
      const at = t
      fromTo(`#${exIds[i]}`, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at)
      fromTo(`#${exIds[i]} .l`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.28, ease: 'back.out(2)', stagger: 0.04 }, at)
      tl_(e.say, 0.8)
      if (litIndices(e.show, [snd.grapheme]).length) lightUp(exIds[i], at + 0.25)
    })
    if (snd.outro) {
      const ex = snd.examples.findIndex((e) => e.silent)
      const at = en(snd.outro, 0.6)
      to(`#${exIds[ex]} .sil`, { opacity: 0.18, duration: 0.5 }, at + 1.2)
      fromTo(`#${exIds[ex]}`, { scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 }, at + 1.0)
    }
    wait(0.3)
    fadeOut(`#${gid}`, t)
    wait(0.4)
  })
  HTML += '</div>\n'
  set('#p3', { opacity: 0 }, t)
}

// 4. New words: the same routine for every word.
function part4() {
  const s = partStart(4)
  HTML += '<div class="part" id="p4">'
  set('#p4', { opacity: 1 }, s)
  en(PT.words.intro, 0.5)
  PT.words.list.forEach((w, wi) => {
    const gid = `wd${wi}`, wid = `${gid}w`
    const lit = w.lit || litIndices(w.show), px = fitPx(w.show, 1100, 190, 140)
    let after = ''
    ;(w.after || []).forEach((a, ai) => {
      if (!a.show) return
      const sub = !a.turn
      const apx = sub ? 140 : fitPx(a.show, 1100, 190, 140)
      after += tlWord(`${gid}a${ai}`, a.show, { px: apx, lit: litIndices(a.show), cls: sub ? 'sub' : 'main' })
      if (a.label) after += `<div class="chip alabel" id="${gid}a${ai}l"><span class="in">${esc(a.label)}</span></div>`
    })
    HTML += `<div class="wset" id="${gid}"><div class="chip" id="${gid}c"><span class="in"><span class="ch-k">${esc(LABELS.means)}</span>${esc(w.meaning)}</span></div>${tlWord(wid, w.show, { px, lit, silent: w.silent || [], cls: 'main' })}${after}</div>`
    set(`#${gid}`, { opacity: 1 }, t)
    const introAt = en(w.en)
    fadeIn(`#${gid}c`, introAt + 0.2, 0.4, 16)
    en('listen', 0.15)
    gesture(w.gesture, t, speechOf(w.say) * 2 + 2.5)
    tl_(w.say, 0.6)
    en('again', 0.15)
    if (w.gesture !== 'sun') gesture(w.gesture, t, 1)
    tl_(w.say, 0.5)
    en('yourturn', 0.15)
    pause(P.pause + P.pausePerExtraWord * (nWords(w.show) - 1), 'panel')
    hop(t - 0.25)
    if (wi === 0) en('build', 0.1)
    const built = buildWord(wid, w.show, t, { lit, silent: w.silent || [] })
    t = Math.max(t + P.buildHold, built)
    en('together', 0.15)
    gesture(w.gesture === 'sun' ? 'nod' : w.gesture, t, 1)
    const togAt = tl_(w.say, 0.6)
    fromTo(`#${wid}`, { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 }, togAt)
    ;(w.after || []).forEach((a, ai) => {
      if (a.mark) {
        const at = en(a.en, 0.4)
        fromTo(`#${wid} .mk`, { color: '#1A1A2E', scale: 1 }, { color: '#8F6D1C', scale: 1.25, duration: 0.35, ease: 'back.out(3)' }, at + 0.6)
        return
      }
      const aid = `${gid}a${ai}`
      if (a.turn) { fadeOut(`#${wid}`, t, 0.25); fadeOut(`#${gid}c`, t, 0.25); if (ai > 0 && w.after[ai - 1].turn) { fadeOut(`#${gid}a${ai - 1}`, t, 0.25); fadeOut(`#${gid}a${ai - 1}l`, t, 0.25) } }
      const at = en(a.en, 0.3)
      if (a.label) fadeIn(`#${aid}l`, at + 0.2, 0.35, 12)
      const sayAt = t
      buildWord(aid, a.show, sayAt - 0.2, { lit: litIndices(a.show) })
      if (LANG === 'es') fromTo(`#${aid} .mk`, { color: '#1A1A2E' }, { color: '#8F6D1C', duration: 0.3 }, sayAt + 0.4)
      tl_(a.say, 0.5)
      // the word is already on screen here, so the ring sits in the dock under Bloop
      if (a.turn) { en('yourturn', 0.15); pause(P.pause + P.pausePerExtraWord * (nWords(a.show) - 1), 'dock'); hop(t - 0.25); tl_(a.say, 0.5) }
    })
    wait(0.3)
    fadeOut(`#${gid}`, t)
    wait(0.4)
  })
  HTML += '</div>\n'
  set('#p4', { opacity: 0 }, t)
}

// 5. Bloop asks, you answer.
function part5() {
  const s = partStart(5)
  HTML += `<div class="part" id="p5"><div class="bubble bb" id="bb"><span class="who g">${esc(LABELS.bloop)}</span></div><div class="bubble yb" id="yb"><span class="who">${esc(LABELS.you)}</span></div>`
  set('#p5', { opacity: 1 }, s)
  fadeIn('#bb', s + 0.1, 0.4, 20)
  fadeIn('#yb', s + 0.25, 0.4, 20)
  en(PT.ask.intro, 0.5)
  PT.ask.turns.forEach((x, i) => {
    const bid = `bt${i}`, yid = `yt${i}`
    const bpx = x.bloopShow ? fitPx(x.bloopShow, 1040, 170, 140) : 0
    HTML += x.icon ? `<div class="btext icon" id="${bid}">${x.icon}</div>` : (x.bloopShow ? tlWord(bid, x.bloopShow, { px: bpx, lit: litIndices(x.bloopShow), cls: 'btext' }) : '')
    HTML += tlWord(yid, x.answerShow, { px: fitPx(x.answerShow, 1040, 170, 140), lit: litIndices(x.answerShow), cls: 'ytext' })
    const bloopSays = () => { const at = t; fadeIn(`#${bid}`, at, 0.3, 14); talk(at, speechOf(x.bloop)); tl_(x.bloop, 0.4) }
    if (x.cue) { const at = en(x.cue, 0.3); if (x.icon) fromTo(`#${bid}`, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, at + 0.3) }
    if (!x.youFirst && x.bloop) bloopSays()
    if (i === 0) en('yourturn', 0.15)
    pause(P.pause + P.pausePerExtraWord * (nWords(x.answerShow) - 1), 'you')
    const at = t
    fadeIn(`#${yid}`, at, 0.3, 14)
    tl_(x.answer || x.bloop, 0.4)
    if (x.youFirst) { bloopSays(); hop(t - 0.1) } else hop(at + 0.2)
    wait(0.5)
    fadeOut(`#${bid}`, t, 0.25); fadeOut(`#${yid}`, t, 0.25)
    wait(0.35)
  })
  HTML += '</div>\n'
  fadeOut('#p5', t)
  wait(0.4)
}

// 6. Sing it: our own chant, the beat composed in code, every word lit as sung.
let CHANT = null
function part6() {
  const s = partStart(6)
  const bars = PT.sing.bars
  let beat = 60 / P.chantBpm
  bars.forEach((bar) => bar.forEach((tok, k) => {
    const span = (bar[k + 1]?.beat ?? 4) - tok.beat
    beat = Math.max(beat, (speechOf(tok.say) + 0.06) / span)
  }))
  beat = Math.round(beat * 1000) / 1000
  const seq = []
  for (let r = 0; r < PT.sing.repeat; r++) bars.forEach((b, bi) => seq.push(bi))
  const roundLen = (seq.length + 1) * 4 * beat
  CHANT = { beat, bars: seq.length + 1, file: `assets/audio/${LANG}/chant-beat.wav`, len: roundLen + 0.8 }
  HTML += `<div class="part" id="p6"><div class="badge" id="sgb1"><span>${esc(LABELS.listenClap)}</span></div><div class="badge" id="sgb2"><span>${esc(LABELS.singAlong)}</span></div>`
  bars.forEach((bar, bi) => {
    const px = fitPx(bar.map((x) => x.t).join(' '), 1120, 170, 140)
    HTML += `<div class="sbar" id="sb${bi}" style="font-size:${px}px">${bar.map((x, k) => `<span class="tok" id="sb${bi}t${k}">${esc(x.t.replace(/ ([!?])/g, ' $1'))}</span>`).join(' ')}</div>`
  })
  HTML += `<div class="dots">${[0, 1, 2, 3].map((d) => `<i id="bd${d}"></i>`).join('')}</div></div>\n`
  set('#p6', { opacity: 1 }, s)
  fadeIn('#sgb1', s + 0.1, 0.3, 10)
  en('sing_listen', 0.6)
  for (let round = 0; round < 2; round++) {
    if (round === 1) {
      fadeOut('#sgb1', t, 0.2)
      fadeIn('#sgb2', t + 0.1, 0.3, 10)
      en('sing_join', 0.5)
    }
    const r0 = t
    AUD.push({ id: nid('beat'), src: CHANT.file, at: r0, dur: CHANT.len, lead: 0, track: 3, vol: 0.55 })
    for (let b = 0; b < CHANT.bars; b++) {
      const b0 = r0 + b * 4 * beat
      for (let d = 0; d < 4; d++) {
        const bt = b0 + d * beat
        fromTo(`#bd${d}`, { backgroundColor: '#EDC35F', scale: 1.35 }, { backgroundColor: '#E6DFCF', scale: 1, duration: beat * 0.85, ease: 'power2.out' }, bt)
        to(G, { y: -14, duration: beat * 0.3, ease: 'power2.out' }, bt)
        to(G, { y: 0, duration: beat * 0.5, ease: 'power2.in' }, bt + beat * 0.3)
      }
      if (b === 0) continue
      const bi = seq[b - 1], bar = bars[bi], end = b0 + 4 * beat
      fromTo(`#sb${bi}`, { opacity: 0 }, { opacity: 1, duration: 0.08 }, b0 - 0.08)
      to(`#sb${bi}`, { opacity: 0, duration: 0.08 }, end - 0.08)
      bar.forEach((tok, k) => {
        const at = b0 + tok.beat * beat
        place(tok.say, at, { ear: false })
        fromTo(`#sb${bi}t${k}`, { color: '#1A1A2E', scale: 1, backgroundSize: '0% 0.075em' }, { color: '#6C9E38', scale: 1.08, backgroundSize: '100% 0.075em', duration: 0.12, ease: 'power2.out' }, at)
        to(`#sb${bi}t${k}`, { color: '#1A1A2E', scale: 1, duration: 0.15 }, end - 0.2)
      })
    }
    t = r0 + roundLen + 0.4
  }
  const celeb = t
  dockClip('celebrate', celeb, 3.0)
  en('sing_done', 0.3)
  t = Math.max(t, celeb + 3.1)
  fadeOut('#p6', t)
  wait(0.4)
}

// 7. Spot the sound: hear a word, point to it, Bloop celebrates.
let SFX = []
function part7() {
  const s = partStart(7)
  HTML += '<div class="part" id="p7">'
  set('#p7', { opacity: 1 }, s)
  en('spot_intro', 0.5)
  PT.spot.questions.forEach((q, qi) => {
    const oid = (k) => `q${qi}o${k}`
    HTML += `<div class="qset" id="q${qi}">${q.options.map((o, k) => `<div class="opt" id="${oid(k)}" style="top:${190 + k * 220}px">${tlWord(oid(k) + 'w', o, { px: 140, lit: [] })}</div>`).join('')}</div>`
    set(`#q${qi}`, { opacity: 1 }, t)
    const sayAt = tl_(q.say, 0.3)
    q.options.forEach((o, k) => fadeIn(`#${oid(k)}`, sayAt + 0.3 + k * 0.15, 0.35, 20))
    t = Math.max(t, sayAt + 1.0)
    pause(P.spotPause, 'dock', LABELS.point)
    const rv = t
    q.options.forEach((o, k) => {
      if (k === q.answer) fromTo(`#${oid(k)}`, { backgroundColor: '#FFFFFF', borderColor: '#1A1A2E', scale: 1 }, { backgroundColor: '#FFF6DE', borderColor: '#6C9E38', scale: 1.04, duration: 0.35, ease: 'back.out(2)' }, rv)
      else to(`#${oid(k)}`, { opacity: 0.3, duration: 0.3 }, rv)
    })
    lightUp(`${oid(q.answer)}w`, rv, '.l')
    SFX.push({ file: 'assets/audio/sfx-chime.wav', at: rv, dur: 1.4, vol: 0.35 })
    dockClip('celebrate', rv, 2.9, 'top')
    tl_(q.say, 0.3)
    en(q.ok, 0.3)
    t = Math.max(t, rv + 3.0)
    fadeOut(`#q${qi}`, t, 0.3)
    wait(0.45)
  })
  HTML += '</div>\n'
  set('#p7', { opacity: 0 }, t)
}

// 8. What we learned, then the job for home.
function part8() {
  const s = partStart(8)
  const homeIds = PT.learned.homeShow.map(() => nid('hw'))
  HTML += `<div class="part" id="p8">${icanCards('lc', PT.learned.ican)}<div class="home" id="home"><div class="heb">${esc(LABELS.home)}</div><div class="hhead">${esc(LABELS.homeHead)}</div>${PT.learned.homeShow.map((w, i) => tlWord(homeIds[i], w, { px: fitPx(w, 1100, 150, 140), lit: litIndices(w), cls: 'hword' })).join('')}</div></div>\n`
  set('#p8', { opacity: 1 }, s)
  const la = en('learned', 0.4)
  PT.learned.ican.forEach((k, i) => fadeIn(`#lc${i}`, la + 0.3 + i * 0.15, 0.4, 20))
  PT.learned.ican.forEach((k, i) => {
    const at = en(k, 0.35)
    const tick = at + speechOf(k) - 0.2
    fromTo(`#lc${i} .box`, { backgroundColor: '#FFFFFF' }, { backgroundColor: '#6C9E38', duration: 0.25 }, tick)
    fromTo(`#lc${i} path`, { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, tick + 0.1)
    fromTo(`#lc${i}`, { scale: 1 }, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1 }, tick + 0.1)
  })
  hop(t)
  wait(0.6)
  PT.learned.ican.forEach((k, i) => fadeOut(`#lc${i}`, t, 0.3))
  wait(0.4)
  fadeIn('#home', t, 0.4, 20)
  const ha = en(PT.learned.home, 0.4)
  const hd = speechOf(PT.learned.home)
  homeIds.forEach((id, i) => buildWord(id, PT.learned.homeShow[i], ha + hd * (0.42 + i * 0.16), { lit: litIndices(PT.learned.homeShow[i]) }))
  wait(1.6)
  fadeOut('#p8', t)
  wait(0.4)
}

function part9() {
  clipPart(9, PT.bye, `bye-${LANG}`, 'bye_lead')
  wait(1.2)
}

// ── Run ─────────────────────────────────────────────────────────────────────
t = 0.3
part1(); part2(); part3(); part4(); part5(); part6(); part7(); part8(); part9()
const TOTAL = Math.round(t * 10) / 10

// Frame furniture: the header, the dock and the ear live across parts 2 to 8.
const d0 = PARTS.find((p) => p.n === 1).at, dIn = PARTS.find((p) => p.n === 2).at - 0.3, dOut = PARTS.find((p) => p.n === 9).at
fromTo('#hdr', { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 }, d0)
fadeIn('#dock', dIn, 0.5, 30)
fadeOut('#dock', dOut, 0.4)
PARTS.forEach((p, i) => {
  fromTo(`#pt${p.n}`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, p.at + 0.05)
  if (i < PARTS.length - 1) to(`#pt${p.n}`, { opacity: 0, duration: 0.2 }, PARTS[i + 1].at - 0.15)
  fromTo(`#pill${p.n}`, { backgroundColor: '#FFFFFF' }, { backgroundColor: '#EDC35F', duration: 0.3 }, p.at)
})
// Captions: each English line on screen while it is spoken, gone before the next.
CAPS.sort((a, b) => a.at - b.at)
let CAP_HTML = ''
CAPS.forEach((c, i) => {
  const id = `cap${i}`
  CAP_HTML += `<div class="cap" id="${id}"><span>${esc(c.text)}</span></div>`
  fromTo(`#${id}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, c.at - 0.05)
  const next = CAPS[i + 1]?.at ?? TOTAL
  to(`#${id}`, { opacity: 0, duration: 0.12 }, Math.min(c.end + 0.7, next - 0.2))
})

// ── Checks on the timing itself ─────────────────────────────────────────────
for (const [a, b] of PAUSES) for (const x of [...AUD, ...SFX]) {
  const xe = x.at + x.dur
  if (x.at < b - 0.01 && xe > a + 0.01) fail(`sound ${x.src} at ${x.at.toFixed(2)} runs into the Your turn pause ${a.toFixed(2)} to ${b.toFixed(2)}`)
}
const byTrack = {}
AUD.forEach((x) => (byTrack[x.track] ||= []).push(x))
for (const [tr, xs] of Object.entries(byTrack)) {
  xs.sort((a, b) => a.at - b.at)
  for (let i = 1; i < xs.length; i++) if (xs[i].at < xs[i - 1].at + xs[i - 1].dur - 0.01) fail(`track ${tr}: ${xs[i].src} at ${xs[i].at.toFixed(2)} overlaps ${xs[i - 1].src}`)
}

// ── Composed audio: the chant beat and the chime, written as WAV from code ──
function writeWav(path, data, sr = 44100) {
  const n = data.length, buf = Buffer.alloc(44 + n * 2)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28)
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40)
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(data[i] * 32767))), 44 + i * 2)
  writeFileSync(here(path), buf)
}
function chantBeat({ beat, bars, len }) {
  const sr = 44100, out = new Float32Array(Math.ceil(len * sr))
  let seed = 7
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1
  const add = (at, dur, fn) => { const s0 = Math.floor(at * sr); for (let i = 0; i < dur * sr && s0 + i < out.length; i++) out[s0 + i] += fn(i / sr) }
  // C, G, A minor, F: a warm round of four, one chord root a bar.
  const roots = [130.81, 98.0, 110.0, 87.31]
  for (let b = 0; b < bars; b++) for (let d = 0; d < 4; d++) {
    const at = (b * 4 + d) * beat
    if (b === 0) { add(at, 0.06, (x) => Math.sin(2 * Math.PI * (d === 0 ? 1760 : 1320) * x) * Math.exp(-x * 70) * 0.35); continue }
    const root = roots[(b - 1) % 4]
    if (d === 0 || d === 2) add(at, 0.25, (x) => Math.sin(2 * Math.PI * (55 + 70 * Math.exp(-x * 30)) * x) * Math.exp(-x * 14) * 0.55)
    if (d === 1 || d === 3) { let hp = 0, prev = 0; add(at, 0.16, (x) => { const n = rnd(); hp = 0.85 * (hp + n - prev); prev = n; const env = Math.exp(-x * 28) + 0.5 * Math.exp(-Math.max(0, x - 0.012) * 40) * (x > 0.012 ? 1 : 0); return hp * env * 0.22 }) }
    const f = d % 2 ? root * 1.5 : root
    add(at, beat * 0.9, (x) => (Math.sin(2 * Math.PI * f * x) + 0.35 * Math.sin(4 * Math.PI * f * x)) * Math.min(1, x * 60) * Math.exp(-x * 5) * 0.2)
  }
  return out
}
function chime() {
  const sr = 44100, d = 1.4, out = new Float32Array(Math.ceil(d * sr))
  for (let i = 0; i < out.length; i++) { const x = i / sr; out[i] = (Math.sin(2 * Math.PI * 880 * x) * Math.exp(-x * 4) + 0.6 * Math.sin(2 * Math.PI * 1318.5 * Math.max(0, x - 0.09)) * Math.exp(-Math.max(0, x - 0.09) * 4) * (x > 0.09 ? 1 : 0)) * 0.4 * Math.min(1, x * 200) }
  return out
}
writeWav(CHANT.file, chantBeat(CHANT))
writeWav('assets/audio/sfx-chime.wav', chime())

// ── Page ────────────────────────────────────────────────────────────────────
const W = HALF ? 960 : 1920, H = HALF ? 540 : 1080
let AUDIO = AUD.map((x) => `<audio id="${x.id}" src="${x.src}" data-start="${r3(x.at)}" data-duration="${r3(x.dur)}"${x.lead ? ` data-media-start="${r3(x.lead)}"` : ''} data-track-index="${x.track}" data-volume="${x.vol}"></audio>`).join('\n')
AUDIO += '\n' + SFX.map((x, i) => `<audio id="sfx${i}" src="${x.file}" data-start="${r3(x.at)}" data-duration="${x.dur}" data-track-index="4" data-volume="${x.vol}"></audio>`).join('\n')

const page = `<!DOCTYPE html>
<html lang="${LANG}"><head><meta charset="UTF-8"><meta name="viewport" content="width=${W}, height=${H}">
<title>${esc(F.language)} Year 3 Lesson 1</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:nunito;src:url("assets/fonts/nunito-latin-wght-normal.woff2") format("woff2");font-weight:200 1000;font-style:normal}
@font-face{font-family:plexMono;src:url("assets/fonts/ibm-plex-mono-latin-600-normal.woff2") format("woff2");font-weight:600;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#F9F8F6}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:#F9F8F6}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;transform:scale(${HALF ? 0.5 : 1});transform-origin:0 0;font-family:nunito,sans-serif;color:#1A1A2E;-webkit-font-smoothing:antialiased}
.part{position:absolute;inset:0;opacity:0}
#hdr{position:absolute;left:80px;right:80px;top:40px;height:110px;opacity:0}
.eyebrow{font-family:plexMono,monospace;font-weight:600;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#8F6D1C}
.ptitle{position:absolute;left:0;top:36px;font-size:46px;font-weight:900;letter-spacing:-.01em;opacity:0;white-space:nowrap}
#pills{position:absolute;right:110px;top:14px;display:flex;gap:10px}
#pills span{display:block;width:46px;height:16px;border-radius:8px;border:2.5px solid #1A1A2E;background:#fff}
#dock{position:absolute;left:60px;top:190px;width:600px;height:620px;opacity:0}
.plate{position:absolute;left:60px;top:70px;width:480px;height:480px;border-radius:50%;background:#FFF6DE;border:6px solid #EDC35F}
#sun{position:absolute;left:380px;top:20px;width:170px;height:170px;opacity:0}
#hand{position:absolute;left:440px;top:170px;font-size:110px;line-height:1;opacity:0;transform-origin:30% 90%}
#bloopwrap{position:absolute;left:90px;top:110px;width:420px;height:420px}
#bloop{display:block;width:420px;height:420px;transform-origin:50% 95%}
.dclip{position:absolute;left:0;width:600px;height:338px;border-radius:28px;overflow:hidden;border:4px solid #1A1A2E;box-shadow:0 6px 0 #1A1A2E;background:#F4EBD8;opacity:0}
.dclip.mid{top:141px}.dclip.top{top:0}
.dclip video{width:100%;height:100%;object-fit:cover;display:block}
#ear{position:absolute;left:1772px;top:88px;width:88px;height:88px;border-radius:50%;background:#6C9E38;display:flex;align-items:center;justify-content:center;gap:9px;opacity:0;box-shadow:0 5px 0 #4E7A26}
#ear i{display:block;width:10px;height:36px;border-radius:6px;background:#fff;transform-origin:50% 50%}
#ear i:nth-child(2){height:50px}
.tlw{font-weight:900;line-height:1.08;letter-spacing:-.01em;text-align:center;color:#1A1A2E}
.tlw .wd{white-space:nowrap;display:inline-block}
.tlw .l{display:inline-block;background-image:linear-gradient(#6C9E38,#6C9E38);background-repeat:no-repeat;background-position:50% 96%;background-size:0% 0.075em;padding-bottom:.04em}
.cliprow{position:absolute;left:60px;right:60px;top:150px;display:flex;justify-content:center;gap:.4em}
.bigcard{position:absolute;left:480px;top:330px;width:960px;height:540px;border-radius:36px;overflow:hidden;border:4px solid #1A1A2E;box-shadow:0 8px 0 #1A1A2E;background:#F4EBD8;opacity:0}
.bigcard video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.still{position:absolute;inset:0}
.splate{position:absolute;left:280px;top:40px;width:400px;height:400px;border-radius:50%;background:#FBE7A8}
.sbloop{position:absolute;left:300px;top:90px;width:360px;height:360px;background:url("assets/bloop.png") center/contain no-repeat}
.ican{position:absolute;left:720px;width:1140px;height:140px;display:flex;align-items:center;gap:34px;padding:0 40px;background:#fff;border:3px solid #1A1A2E;border-radius:28px;box-shadow:0 6px 0 #1A1A2E;opacity:0}
.ican .box{flex:0 0 76px;height:76px;border-radius:50%;border:4px solid #1A1A2E;display:flex;align-items:center;justify-content:center;background:#fff}
.itext{font-size:46px;font-weight:800;line-height:1.15}
.sset{position:absolute;inset:0;opacity:0}
.glyphs{position:absolute;left:700px;width:1160px;top:170px;height:360px;display:flex;align-items:center;justify-content:center;gap:60px}
.glyph{opacity:0}
.gsep{font-size:48px;font-weight:800;color:#65657C;opacity:0}
.exrow{position:absolute;left:700px;width:1160px;top:575px;display:flex;justify-content:center;gap:90px}
.exrow .tlw{opacity:0}
.wset{position:absolute;inset:0;opacity:0}
.chip{position:absolute;left:700px;width:1160px;top:190px;display:flex;justify-content:center;opacity:0}
.chip>span.in{display:flex;align-items:center;gap:18px;height:86px;padding:0 34px;border-radius:43px;background:#FFF6DE;border:3px solid #EDC35F;font-size:52px;font-weight:800;white-space:nowrap}
.ch-k{font-family:plexMono,monospace;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#8F6D1C}
.wset .tlw.main{position:absolute;left:700px;width:1160px;top:330px;opacity:0}
.wset .tlw.sub{position:absolute;left:700px;width:1160px;top:690px;opacity:0}
.alabel{top:190px}
.bubble{position:absolute;left:720px;width:1140px;border:4px solid #1A1A2E;border-radius:44px;box-shadow:0 7px 0 #1A1A2E;opacity:0}
.bb{top:180px;height:280px;background:#fff}
.bb:before{content:"";position:absolute;left:-34px;top:96px;border:18px solid transparent;border-right:20px solid #1A1A2E}
.yb{top:500px;height:300px;background:#FFF6DE}
.who{position:absolute;left:34px;top:18px;font-family:plexMono,monospace;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#76591A}
.who.g{color:#4E7A26}
.btext,.ytext{position:absolute;left:740px;width:1100px;opacity:0}
.btext{top:236px}.ytext{top:576px}
.btext.icon{font-size:170px;line-height:1;text-align:center;top:228px}
.ring{position:absolute;opacity:0}
.ring svg{position:absolute;inset:0}
.rnum{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;color:#1A1A2E}
.rnum b{position:absolute;opacity:0}
.rlabel{position:absolute;font-weight:900;white-space:nowrap;color:#1A1A2E}
.lab-above .rlabel{left:50%;bottom:100%;margin-bottom:14px;width:600px;margin-left:-300px;text-align:center}
.lab-left .rlabel{right:100%;top:50%;margin-right:36px;margin-top:-.62em}
.lab-right .rlabel{left:100%;top:50%;margin-left:30px;margin-top:-.62em}
.badge{position:absolute;left:700px;width:1160px;top:190px;display:flex;justify-content:center;opacity:0}
.badge>span{padding:14px 34px;border-radius:40px;background:#4E7A26;color:#fff;font-size:40px;font-weight:900;white-space:nowrap;box-shadow:0 5px 0 #34541A}
.sbar{position:absolute;left:720px;width:1120px;top:330px;font-weight:900;line-height:1.1;text-align:center;opacity:0}
.tok{display:inline-block;white-space:nowrap;background-image:linear-gradient(#EDC35F,#EDC35F);background-repeat:no-repeat;background-position:50% 94%;background-size:0% 0.075em}
.dots{position:absolute;left:700px;width:1160px;top:720px;display:flex;justify-content:center;gap:34px}
.dots i{display:block;width:40px;height:40px;border-radius:50%;background:#E6DFCF;border:3px solid #1A1A2E}
.qset{position:absolute;inset:0;opacity:0}
.opt{position:absolute;left:720px;width:1140px;height:190px;border-radius:34px;border:4px solid #1A1A2E;background:#fff;box-shadow:0 6px 0 #1A1A2E;display:flex;align-items:center;justify-content:center;opacity:0}
.home{position:absolute;left:720px;width:1140px;top:180px;opacity:0;text-align:center}
.heb{font-family:plexMono,monospace;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#8F6D1C}
.hhead{font-size:56px;font-weight:900;margin:8px 0 14px}
.hword{opacity:0;margin-bottom:6px}
#caps{position:absolute;left:0;right:0;bottom:34px;height:200px}
.cap{position:absolute;left:120px;right:120px;bottom:0;display:flex;justify-content:center;opacity:0}
.cap span{display:block;max-width:1640px;background:#fff;border:3px solid #1A1A2E;border-radius:26px;box-shadow:0 6px 0 #1A1A2E;padding:20px 44px;font-size:46px;font-weight:700;line-height:1.25;text-align:center}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL.toFixed(1)}" data-width="${W}" data-height="${H}" data-fps="30">
<div id="stage">
<div id="hdr"><div class="eyebrow">${esc(F.eyebrow)}</div>${TITLES.map((x, i) => `<div class="ptitle" id="pt${i + 1}">${esc(x)}</div>`).join('')}<div id="pills">${TITLES.map((x, i) => `<span id="pill${i + 1}"></span>`).join('')}</div></div>
<div id="dock"><div class="plate"></div><svg id="sun" viewBox="0 0 100 100"><g stroke="#EDC35F" stroke-width="6" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="50" y1="8" x2="50" y2="18" transform="rotate(${a} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="24" fill="#EDC35F"/></svg><div id="bloopwrap"><img id="bloop" src="assets/bloop.png" alt="Bloop"></div><div id="hand">👋</div>
${DOCK_CLIPS}</div>
${HTML}
${RINGS}
<div id="ear"><i></i><i></i><i></i></div>
<div id="caps">${CAP_HTML}</div>
</div>
${AUDIO}
</div>
<script>
var tl = gsap.timeline({ paused: true });
${writeTL()}
window.__timelines["main"] = tl;
</script></body></html>`
writeFileSync(here('index.html'), page)
console.log(`${F.language}: ${TOTAL}s (${Math.floor(TOTAL / 60)}m ${Math.round(TOTAL % 60)}s), ${AUD.length} sounds, ${PAUSES.length} Your turn pauses, ${CAPS.length} captions, chant beat ${CHANT.beat}s, ${HALF ? 'half size 960x540' : 'full size 1920x1080'}`)
PARTS.forEach((p, i) => console.log(`  ${p.n}. ${TITLES[p.n - 1].padEnd(24)} ${p.at.toFixed(1).padStart(6)}s  ${((PARTS[i + 1]?.at ?? TOTAL) - p.at).toFixed(1)}s`))
writeFileSync(here(`renders/pauses-${LANG}.json`), JSON.stringify(PAUSES.map(([a, b]) => [r3(a), r3(b)])))
