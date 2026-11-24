#!/usr/bin/env node
// Writes the three cuts of the teacher film, version 3 (24 November 2026):
//   cuts/schools-teacher-start.json        vertical 1080 by 1920, nine shots
//   cuts/schools-teacher-start-h.json      horizontal 1920 by 1080, its own layout (words left, object right)
//   cuts/schools-teacher-start-short.json  vertical, shots 5 and 8 dropped, for LinkedIn and TikTok
// Storyboard and spec: plans/2026-11-24-teacher-film-walkthrough-research.md.
// The shots are stage shots (tools/stage3.mjs): real captures inside a phone, a
// classroom board or A4 paper. Every camera focus point is worked out here from
// the capture's own CSS px (printed by tools/capture-schools.mjs), so a new
// capture means new numbers here and nowhere else.
// Run: node tools/make-teacher-v3.mjs, then sh tools/render-both.sh <cut...>
import { writeFileSync } from 'node:fs'

const CAP = 'captures/schools/'
// Where things sit in each capture, CSS px (from tools/capture-schools.mjs).
const AT = {
  minutes: { x: 14, y: 609, w: 282, h: 50 },          // lesson-hero: "69 minutes · 29 slides · 3 interactive"
  script: { x: 49, y: 715, w: 264, h: 30 },           // board-teach-slide1: "Settle everyone with this slide up."
  lead: { x: 143, y: 329, w: 305, h: 36 },            // board-before-slide1: "Mrs Hale, the office by the hall"
  leadArea: { cx: 300, cy: 322 },
  tea: { x: 11, y: 451, w: 252, h: 30, cx: 136 },              // print-sheet6: "Can you teach me the cool down lap?"
  teaMask: [518, 533],                                // print-sheet6: fade out below the Ask at tea box
  mapRow: { cx: 640, cy: 1150 },                      // laptop-rshe-mapping: the first requirement and its lessons
}

// Geometry, the same formulas as tools/stage3.mjs.
const geo = (o) => {
  const b = o.kind === 'phone' ? Math.round(o.w * 0.046) : o.kind === 'board' ? Math.round(o.w * 0.023) : 0
  const pad = o.kind === 'paper' ? Math.round(o.w * 0.045) : 0
  const sw = o.kind === 'paper' ? o.w - pad * 2 : o.w
  return { b, pad, sw, OW: o.kind === 'paper' ? o.w : o.w + 2 * b, OH: o.kind === 'paper' ? Math.round(o.w * 1.414) : o.h + 2 * b }
}
// Film point of a capture point (cx, cy CSS px) inside object o showing a page srcW wide, scrolled by top.
const film = (o, srcW, cx, cy, top = 0) => { const g = geo(o), k = g.sw / srcW; return { fx: o.x + g.b + g.pad + cx * k, fy: o.y + g.b + g.pad + (cy - top) * k } }

const DUR = { hook: 3.9, lesson: 5.2, steps: 4.0, script: 4.7, safe: 3.6, pack: 3.3, note: 5.0, map: 4.3, end: 6.0 }

function cut(L, { short = false } = {}) {
  const { W, H } = L
  const V = W < H
  const shots = []
  const cam = (t, s, fx, fy, px, py, dur, ease) => ({ t, s, fx, fy, px, py, dur, ease })
  const centre = (s, t = 0, dur, ease) => cam(t, s, L.dev.cx, L.dev.cy, L.dev.cx, L.dev.cy, dur, ease)

  // 1. The problem, in the teacher's own words, the brand in by second one.
  shots.push({
    id: 'hook', stage: true, dur: DUR.hook, bg: 'teal', enter: 'none', exit: 'none', drift: 6,
    words: [
      { kind: 'eyebrow', text: 'The problem', ...L.hookEye, t0: 0 },
      { kind: 'pill', text: 'I teach Year 4, not online safety.', ...L.hookPill, t0: 0, instant: true, typedFrom: 3, typed: 0.12, typeAt: 0.2 },
      { kind: 'brand', ...L.hookBrand, t0: 0.6, size: 64 },
    ],
    sfx: [{ name: 'sfx-tap', at: 0.3, vol: 0.12 }, { name: 'sfx-pop', at: 0.6, vol: 0.2 }],
  })

  // 2. The lesson page: the minutes and slides line, as the page prints it.
  const phone = { id: 'phone', kind: 'phone', ...L.phone }
  const pm = film(phone, 390, AT.minutes.x + 135, AT.minutes.y + 25)
  shots.push({
    id: 'lesson', stage: true, dur: DUR.lesson, bg: 'cream', enter: 'none', exit: 'none', veil: L.veil,
    cam: [centre(1), centre(1.06, 0, 1.2, 'power3.out'), cam(1.3, L.zoom.minutes, pm.fx, pm.fy, L.focus.x, L.focus.y, 1.0, 'power2.inOut'), centre(1.06, 4.45, 0.75, 'power2.inOut')],
    objs: [{ ...phone, enter: { t: 0, dur: 0.9, ease: 'power3.out', from: { y: 90, rotationX: 2, opacity: 0 } },
      pages: [{ src: CAP + 'lesson-hero.png', srcW: 390, top: 0, glows: [{ ...AT.minutes, t0: 2.0 }] }] }],
    words: [
      { kind: 'eyebrow', text: 'A made up school. Real screens.', ...L.eye, t0: 0.15 },
      { kind: 'head', lines: L.lines.lesson, ...L.head, t0: 0.3 },
    ],
    sfx: [{ name: 'sfx-whoosh', at: 0, vol: 0.12 }, { name: 'sfx-tink', at: 2.0, vol: 0.12 }],
  })

  // 3. Code, year, Teach: the same phone, its screen sliding on twice.
  shots.push({
    id: 'steps', stage: true, dur: DUR.steps, bg: 'cream', enter: 'none', exit: 'lift', veil: L.veil,
    cam: [centre(1.06), centre(1.1, 0.2, 3.4, 'power1.inOut')],
    objs: [{ ...phone, pages: [
      { src: CAP + 'unlock-code.png', srcW: 390, top: 0, glows: [{ x: 46, y: 517, w: 297, h: 67, t0: 0.25, t1: 1.2 }], taps: [{ x: 194, y: 617, t: 0.95 }] },
      { src: CAP + 'start-year.png', srcW: 390, top: 0, t: 1.3, taps: [{ x: 194, y: 506, t: 2.3 }] },
      { src: CAP + 'start-lesson.png', srcW: 390, top: 0, t: 2.65, taps: [{ x: 194, y: 489, t: 3.5 }] },
    ] }],
    words: [{ kind: 'chips', ...L.chips, t0: 0.1, items: [{ n: 1, text: 'School code', at: 0.4 }, { n: 2, text: 'Your year', at: 1.45 }, { n: 3, text: 'Teach', at: 2.8 }] }],
    sfx: [{ name: 'sfx-pop', at: 0.4, vol: 0.25 }, { name: 'sfx-pop', at: 1.45, vol: 0.25 }, { name: 'sfx-pop', at: 2.8, vol: 0.25 }, { name: 'sfx-whoosh', at: 3.7, vol: 0.12 }],
  })

  // 4. The classroom board: the words to say, under the slide.
  const board = { id: 'board', kind: 'board', ...L.board }
  const ps = film(board, 1280, AT.script.x + AT.script.w / 2, AT.script.y + 15)
  shots.push({
    id: 'script', stage: true, dur: DUR.script, bg: 'cream', enter: 'rise', exit: short ? 'lift' : 'none', veil: L.veil,
    cam: [centre(1), centre(1.05, 0, 1.2, 'power3.out'), cam(1.3, L.zoom.script, ps.fx, ps.fy, L.focus.x, L.focus.y, 1.0, 'power2.inOut'), centre(1.05, 4.0, 0.7, 'power2.inOut')],
    objs: [{ ...board, enter: { t: 0, dur: 1.0, ease: 'power3.out', from: { rotationX: 2, y: 30 } },
      pages: [{ src: CAP + 'board-teach-slide1.png', srcW: 1280, top: 0, glows: [{ ...AT.script, t0: 2.1 }] }] }],
    words: [{ kind: 'head', lines: L.lines.script, ...L.head, t0: 0.25 }],
    sfx: [{ name: 'sfx-tink', at: 2.1, vol: 0.12 }],
  })

  // 5. A safeguarding flagged lesson opens on the lead, before slide 1.
  const pl = film(board, 1280, AT.leadArea.cx, AT.leadArea.cy)
  if (!short) shots.push({
    id: 'safe', stage: true, dur: DUR.safe, bg: 'cream', enter: 'none', exit: 'lift', veil: L.veil,
    cam: [centre(1.05), cam(0.55, L.zoom.lead, pl.fx, pl.fy, L.focus.x, L.focus.y, 1.0, 'power2.inOut')],
    objs: [{ ...board, pages: [
      { src: CAP + 'board-teach-slide1.png', srcW: 1280, top: 0 },
      { src: CAP + 'board-before-slide1.png', srcW: 1280, top: 0, t: 0.05, trans: 'fade', dur: 0.4, glows: [{ ...AT.lead, t0: 1.5 }] },
    ] }],
    words: [{ kind: 'head', lines: L.lines.safe, ...L.head, t0: 0.2 }],
    sfx: [{ name: 'sfx-tink', at: 1.5, vol: 0.12 }, { name: 'sfx-whoosh', at: 3.3, vol: 0.12 }],
  })

  // 6. The pack prints: Sheets 1, 3 and 5 drop in as paper, fanned.
  const P = L.paper
  const sheet = (id, src, dx, dy, rot, z) => ({ id, kind: 'paper', w: P.w, x: P.x + dx, y: P.y + dy, rot, z, pages: [{ src: CAP + src, srcW: 740, top: 0 }] })
  const fan = [sheet('s1', 'print-sheet1.png', -P.spread, 22, -4, 1), sheet('s3', 'print-sheet3.png', 0, 0, 0, 2), sheet('s5', 'print-sheet5.png', P.spread, 24, 3.5, 3)]
  shots.push({
    id: 'pack', stage: true, dur: DUR.pack, bg: 'cream', enter: 'fade', exit: 'none', drift: 6,
    cam: [centre(1), centre(1.04, 0.3, 2.8, 'power2.out')],
    objs: fan.map((o, k) => ({ ...o, enter: { t: 0.05 + k * 0.12, dur: 0.8, ease: 'back.out(1.4)', from: { y: -180, rotation: o.rot + (k - 1) * 7, opacity: 0 } } })),
    words: [{ kind: 'head', lines: L.lines.pack, ...L.head, t0: 0.2 }],
    sfx: fan.map((_, k) => ({ name: 'sfx-land', at: 0.55 + k * 0.12, vol: 0.14 })),
  })

  // 7. The note home, cropped to its Ask at tea question (never the home code block).
  const note = { id: 's6', kind: 'paper', w: P.w, x: P.x, y: P.y - 14, rot: 0, z: 5 }
  const pt = film(note, 740, AT.tea.cx, AT.tea.y + 15)
  shots.push({
    id: 'note', stage: true, dur: DUR.note, bg: 'cream', enter: 'none', exit: 'lift', veil: L.veil,
    cam: [centre(1.04), cam(1.15, L.zoom.tea, pt.fx, pt.fy, L.focus.x, L.focus.y, 1.2, 'power3.out')],
    objs: [
      ...fan.map((o) => ({ ...o, moves: [{ t: 0.05, dur: 0.8, ease: 'power3.out', x: -P.push, y: 10, scale: 0.97, filter: 'blur(3px)' }] })),
      { ...note, enter: { t: 0.05, dur: 0.85, ease: 'power3.out', from: { x: P.slideFrom, rotation: 9, y: 30 } },
        pages: [{ src: CAP + 'print-sheet6.png', srcW: 740, top: 0, mask: AT.teaMask, glows: [{ ...AT.tea, t0: 2.2 }] }] },
    ],
    words: [
      { kind: 'eyebrow', text: 'Sheet 6, the parent note', ...L.eye, t0: 0.15 },
      { kind: 'head', lines: L.lines.note, ...L.head, t0: 0.3 },
    ],
    sfx: [{ name: 'sfx-whoosh', at: 0.05, vol: 0.14 }, { name: 'sfx-tink', at: 2.2, vol: 0.12 }],
  })

  // 8. For the PSHE lead: the RSHE mapping, read like a document on the board.
  const pr = film(board, 1280, AT.mapRow.cx, AT.mapRow.cy, 560)
  if (!short) shots.push({
    id: 'map', stage: true, dur: DUR.map, bg: 'cream', enter: 'rise', exit: 'lift', veil: L.veil,
    cam: [centre(1), centre(1.04, 0, 1.2, 'power3.out'), cam(1.5, L.zoom.map, pr.fx, pr.fy, L.focus.x, L.focus.y, 1.3, 'power2.inOut')],
    objs: [{ ...board, enter: { t: 0, dur: 1.0, ease: 'power3.out', from: { rotationX: 2, y: 30 } },
      pages: [{ src: CAP + 'laptop-rshe-mapping.png', srcW: 1280, top: 0, pans: [{ t: 1.5, dur: 1.3, top: 560 }] }] }],
    words: [
      { kind: 'eyebrow', text: 'For your PSHE lead', ...L.eye, t0: 0.15 },
      { kind: 'head', lines: L.lines.map, ...L.head, t0: 0.3 },
    ],
    sfx: [{ name: 'sfx-whoosh', at: 1.5, vol: 0.1 }],
  })

  // 9. The end card: the pilot offer exactly as the pilot page makes it.
  shots.push({
    id: 'end', stage: true, dur: DUR.end, bg: 'teal', enter: 'dissolve', enterDur: 0.5, drift: 0,
    words: [
      { kind: 'digi', ...L.digi, t0: 0.2 },
      { kind: 'end', ...L.end, t0: 0.35, brand: true, tagline: 'One plan for screens, phones and AI.', line: 'Two lessons free for a term.', sub: 'No card. No contract. No pupil data.', button: 'Request a pilot', url: 'schools.guidedchildhood.com/pilot', slate: 'A made up school. Real screens.', pressAt: 3.4 },
    ],
    sfx: [{ name: 'sfx-shimmer', at: 0.25, vol: 0.18 }, { name: 'sfx-land', at: 1.0, vol: 0.2 }, { name: 'sfx-tap', at: 3.4, vol: 0.35 }],
  })

  const T = Math.round(shots.reduce((a, s) => a + s.dur, 0) * 100) / 100
  return {
    name: L.name + (short ? '-short' : ''), w: W, h: H, css: L.css || '',
    music: { file: 'music-leberch.mp3', mediaStart: 12.3, lane: [[0, 0], [1.0, 0.2], [3.8, 0.16], [4.3, 0.3], [T - 3, 0.3], [T, 0]] },
    shots,
  }
}

// ── Vertical 1080 by 1920: words in y 220 to 640, the object below, 64px clear at the sides ──
const VERT = {
  name: 'schools-teacher-start', W: 1080, H: 1920,
  dev: { cx: 540, cy: 1200 }, focus: { x: 540, y: 1210 },
  veil: { h: 780, solid: 74 },
  eye: { x: 90, y: 238, w: 900 }, head: { x: 70, y: 300, w: 940 },
  lines: {
    lesson: ['The lesson is', 'already written.'],
    script: ['The words to say,', 'under every slide.'],
    safe: ['A sensitive lesson?', 'Your safeguarding lead', 'comes first.'],
    pack: ['The whole pack prints.', 'Ready to photocopy.'],
    note: ['And a note goes home.'],
    map: ['Every online RSHE', 'requirement, mapped', 'to a lesson.'],
  },
  hookEye: { x: 90, y: 560, w: 900 }, hookPill: { x: 100, y: 640, w: 880 }, hookBrand: { x: 90, y: 1190, w: 900 },
  chips: { x: 90, y: 236, w: 900, stack: true, size: 50 },
  phone: { w: 410, h: 887, x: 316, y: 742 },
  board: { w: 956, h: 598, x: 40, y: 860 },
  paper: { w: 640, x: 220, y: 740, spread: 70, push: 34, slideFrom: 700 },
  zoom: { minutes: 2.8, script: 3.6, lead: 2.4, tea: 4.0, map: 1.55 },
  digi: { x: 420, y: 236, size: 240 },
  end: { x: 60, y: 560, w: 960 },
  css: '.w3-pill{max-width:880px}',
}

// ── Horizontal 1920 by 1080: words in a left column, the object to the right ──
const HORZ = {
  name: 'schools-teacher-start-h', W: 1920, H: 1080,
  dev: { cx: 1350, cy: 545 }, focus: { x: 1390, y: 560 },
  veil: { w: 1060, solid: 78 },
  eye: { x: 120, y: 340, w: 720, align: 'left' }, head: { x: 116, y: 392, w: 720, align: 'left' },
  lines: {
    lesson: ['The lesson is', 'already written.'],
    script: ['The words to say,', 'under every slide.'],
    safe: ['A sensitive lesson?', 'Your safeguarding', 'lead comes first.'],
    pack: ['The whole pack', 'prints. Ready', 'to photocopy.'],
    note: ['And a note', 'goes home.'],
    map: ['Every online RSHE', 'requirement,', 'mapped to a lesson.'],
  },
  hookEye: { x: 160, y: 300, w: 1600 }, hookPill: { x: 160, y: 380, w: 1600 }, hookBrand: { x: 160, y: 700, w: 1600 },
  chips: { x: 120, y: 330, w: 680, align: 'left', stack: true, size: 50 },
  phone: { w: 416, h: 900, x: 1123, y: 76 },
  board: { w: 1040, h: 650, x: 806, y: 196 },
  paper: { w: 520, x: 1090, y: 150, spread: 70, push: 34, slideFrom: 620 },
  zoom: { minutes: 2.4, script: 2.9, lead: 2.1, tea: 3.4, map: 1.3 },
  digi: { x: 250, y: 330, size: 380 },
  end: { x: 760, y: 150, w: 1060, align: 'left' },
  css: '.w3-pill{max-width:1600px}.w3-eye{font-size:26px}.w3-head{font-size:74px}.w3-end .e-line{margin-top:40px;font-size:88px}.w3-end .e-btn{margin-top:44px}.w3-end .e-slate{margin-top:30px}',
}

const out = (c) => { writeFileSync(new URL(`../cuts/${c.name}.json`, import.meta.url), JSON.stringify(c, null, 1) + '\n'); console.log(`wrote cuts/${c.name}.json  ${c.shots.length} shots  ${c.shots.reduce((a, s) => a + s.dur, 0).toFixed(1)}s`) }
out(cut(VERT)); out(cut(HORZ)); out(cut(VERT, { short: true }))
