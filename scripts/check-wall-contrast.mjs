#!/usr/bin/env node
// NOTHING ON A CLASSROOM WALL IS BELOW WCAG AA.
//
// The sister guard, check-wall-scale.mjs, reads the source and holds every
// projector font size to the ISO 9241 legibility floor. Size was only half the
// problem. plans/kids-player-design.md has asked for "a higher contrast variant
// of the tokens" for classroom mode since the player was designed, and the
// eyebrows that got bigger on 9 September were still rendering at 2.43:1, which
// is a label made larger and left just as washed out.
//
// WHY THIS ONE RENDERS INSTEAD OF READING THE SOURCE.
//
// A source reading contrast check was written first, as a table of token pairs
// in shared/wall-scale.ts, and it was wrong three separate ways that only a
// browser could see:
//
//   1. A background-image is invisible to backgroundColor. The lesson title
//      card sits on a dark teal gradient, so the table read white on cream and
//      called 1.06:1 on the one slide that was never in any danger.
//   2. CSS opacity composites a GROUP. A done cycle row at 0.6 fades its text
//      AND its background together and the table cannot see either.
//   3. A token alias resolves where it is DECLARED. --coral-dark is
//      var(--terracotta-dark) on :root, so re-pointing --terracotta-dark on the
//      player does not move it, and the share counter stayed at 2.58:1 while
//      the table said it had been fixed.
//
// So this walks the rendered player, composites every text node the way the
// browser does, and applies the WCAG 1.4.3 threshold for the size it actually
// renders at. It found seven real failures on the first honest run, including
// a widget eyebrow at 1.57:1 and DiGi's entire closing block invisible under
// prefers-reduced-motion.
//
// It needs the app running, same as scripts/check-mobile-overflow.mjs, and no
// database: /dev/lesson-player carries a fixture deck covering all fifteen
// slide types and all six interactive components.
import { chromium } from 'playwright'

const BASE = process.env.GC_BASE_URL ?? 'http://localhost:3000'
const SLIDES = Number(process.env.GC_WALL_SLIDES ?? 21)

// The probe runs inside the page. Everything it needs is defined in here.
const probe = () => {
  const px = v => parseFloat(v) || 0
  const parse = c => {
    const m = (c || '').match(/[\d.]+/g)
    if (!m) return null
    return { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 }
  }
  const WHITE = { r: 255, g: 255, b: 255, a: 1 }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  const lerp = (from, to, t) => over({ ...to, a: t }, from)
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  // A gradient is a RANGE of backdrops, so every stop is a candidate and the
  // worst one is the answer: text has to clear AA everywhere it lands.
  const layers = n => {
    const cs = getComputedStyle(n)
    const own = parse(cs.backgroundColor) ?? { ...WHITE, a: 0 }
    const img = cs.backgroundImage || 'none'
    if (img === 'none') return [own]
    const stops = (img.match(/rgba?\([^)]*\)/g) ?? []).map(parse).filter(Boolean)
    if (!stops.length) return [own]
    return stops.map(s => over(own, s))
  }

  // Walking the chain outermost first: each element's own background paints
  // over what is behind it, then the whole group fades by its opacity.
  const paintedFor = (chain, choice) => {
    let behind = WHITE
    let bg = WHITE
    const fades = []
    for (const [i, n] of chain.entries()) {
      const cs = getComputedStyle(n)
      const o = cs.opacity === '' ? 1 : px(cs.opacity)
      behind = bg
      const inner = over(choice[i], behind)
      bg = lerp(behind, inner, o)
      fades.push({ behind, o, inner })
    }
    const cs = getComputedStyle(chain[chain.length - 1])
    let text = over(parse(cs.color) ?? { r: 0, g: 0, b: 0, a: 1 }, fades[fades.length - 1].inner)
    for (let i = fades.length - 1; i >= 0; i--) text = lerp(fades[i].behind, text, fades[i].o)
    return { text, bg }
  }

  const painted = el => {
    const chain = []
    for (let n = el; n; n = n.parentElement) chain.unshift(n)
    const opts = chain.map(layers)
    let combos = [[]]
    for (const o of opts) {
      const next = []
      for (const c of combos) for (const v of o) next.push([...c, v])
      combos = next.length > 24 ? next.slice(0, 24) : next
    }
    let worst = null
    for (const c of combos) {
      const p = paintedFor(chain, c)
      const r = ratio(p.text, p.bg)
      if (!worst || r < worst.r) worst = { ...p, r }
    }
    return worst
  }

  const rgb = c => `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`
  const out = []
  for (const el of document.querySelectorAll('.gc-lesson-player *')) {
    const text = [...el.childNodes]
      .filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim()
    if (!text) continue
    const box = el.getBoundingClientRect()
    if (!box.width || !box.height) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || (cs.clipPath || '').includes('inset(50%)')) continue
    // The interactive widgets are scaled with CSS zoom to fit the wall, and
    // getComputedStyle reports the UNZOOMED font size (measured: 429px stayed
    // 429px at zoom 1, 1.5 and 2.5). Judging a 36px glyph as 15px would apply
    // the small text threshold to large text, which is stricter than WCAG and
    // still wrong. The painted size is what the room reads.
    let zoom = 1
    for (let n = el; n; n = n.parentElement) zoom *= px(getComputedStyle(n).zoom) || 1
    const size = px(cs.fontSize) * zoom
    const weight = +cs.fontWeight || 400
    const p = painted(el)
    // WCAG 1.4.3: 3:1 for large text (18.66px bold, or 24px), else 4.5:1.
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    out.push({
      text: text.slice(0, 46), size: Math.round(size * 10) / 10,
      need: large ? 3 : 4.5, ratio: Math.round(p.r * 100) / 100,
      colour: rgb(p.text), on: rgb(p.bg),
    })
  }
  return out
}

const browser = await chromium.launch({
  // The pinned playwright and the browser on the box do not always agree in a
  // container. GC_CHROMIUM lets a session point at the one it has.
  ...(process.env.GC_CHROMIUM ? { executablePath: process.env.GC_CHROMIUM } : {}),
})
// Reduced motion, deliberately. The player honours the setting and renders
// every reveal at its final state, which removes the race with GSAP instead of
// guessing a wait long enough for it: a word caught mid fade reads as cream on
// cream and libels the colour. It is also the setting that exposed DiGi's
// closing block never becoming visible at all.
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })

const failures = []
let nodes = 0
let unsettled = 0
for (let i = 0; i < SLIDES; i++) {
  await page.goto(`${BASE}/dev/lesson-player?projector=1&slide=${i}`, { waitUntil: 'networkidle' })
  const settled = await page.waitForFunction(() =>
    [...document.querySelectorAll('.gc-lesson-player [data-reveal]')]
      .every(e => parseFloat(getComputedStyle(e).opacity) > 0.98),
    null, { timeout: 12000 }).then(() => true).catch(() => false)
  if (!settled) unsettled++
  await page.waitForTimeout(300)
  for (const r of await page.evaluate(probe)) {
    nodes++
    if (r.ratio < r.need) failures.push({ slide: i, ...r })
  }
}
await browser.close()

if (unsettled) {
  console.error(`check-wall-contrast: ${unsettled} slide(s) never settled, readings are not trustworthy`)
  process.exit(1)
}
if (!nodes) {
  console.error('check-wall-contrast: no text found in the player. Is the fixture rendering?')
  process.exit(1)
}

if (failures.length) {
  console.error(`\ncheck-wall-contrast: ${failures.length} of ${nodes} text nodes are below WCAG AA on the wall.\n`)
  const seen = new Map()
  for (const f of failures) {
    const k = `${f.colour} on ${f.on} @${f.size}px`
    const p = seen.get(k) ?? { n: 0, slides: [] }
    seen.set(k, { n: p.n + 1, ratio: f.ratio, need: f.need, eg: f.text, slides: [...new Set([...p.slides, f.slide])] })
  }
  for (const [k, v] of [...seen].sort((a, c) => a[1].ratio - c[1].ratio)) {
    console.error(`  ${v.ratio.toFixed(2)}:1 (needs ${v.need})  ${k}`)
    console.error(`     x${v.n} on slide(s) ${v.slides.join(', ')}   "${v.eg}"`)
  }
  console.error('\nThe classroom variant lives in WALL_CONTRAST (shared/wall-scale.ts).')
  console.error('An alias token resolves where it is declared, so re-pointing a token')
  console.error('does not move its aliases: name the real token at the call site.\n')
  process.exit(1)
}

console.log(`check-wall-contrast: ${nodes} text nodes on the wall, all clear of WCAG AA.`)
