// Writes the two printed Passport films from one script, so the Etsy square
// and the social vertical tell the same story with the same real pages:
//
//   node videos/2026-11-05-printed-passport/build.mjs
//
// then render each project (see README.md). Every page, sticker and Friend is
// the real render from content/printables/guided-childhood-passport (copied
// into each project's assets/), never a generated booklet or hand: the
// physical proof does not exist yet, and a render passed off as a photo would
// be the one thing a parent could fairly call us out on.
//
// THE STORY, both cuts: the named cover lands, the book opens onto Pebble's
// spread (the cover swings round the spine and its back is page 4, the way a
// real book opens), the three boxes tick, the stamp sticker presses into the
// ring, the sticker sheet arrives, and the close. The Etsy cut closes on the
// book itself, because Etsy listing videos must not send a buyer off Etsy.
// The social cut opens on a text hook and closes on the stage check line,
// per .claude/skills/silent-ugc. Both are silent: Etsy strips sound, and the
// silent format carries everything in the words on screen.
//
// THE PAGE GEOMETRY. Positions on a page are millimetres on the trimmed A6
// (105 by 148), measured off printed.html with Playwright on 5 November 2026:
// the tick boxes on page 4 and the stamp ring on page 5.

import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '../../content/printables/guided-childhood-passport')
const PV = join(SRC, 'images/preview/printed')
const BOXES = [43.43, 69.15, 86.67].map(y => ({ x: 11.36, y }))
const RING = { x: 52.5, y: 36.38, d: 44 }
const STICKER_D = 31 // the sticker image is the 31 mm kiss cut square
const A6 = { w: 105, h: 148 }

const C = { cream: '#F9F8F6', page: '#FFFCF3', ink: '#1A1A2E', soft: '#52526A', burg: '#571C2A', gold: '#EDC35F', goldDark: '#C99A28', butterLt: '#FFF6DE' }
const FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo']

const FILMS = {
  'etsy-square': {
    W: 1080, H: 1080, dur: 12,
    page: 430, bookTop: 300,
    scenes: { cover: [0, 2.6], spread: [2.6, 5], stickers: [7.6, 2.2], end: [9.8, 2.2] },
    coverTitle: ['The Passport,', 'printed and posted'], titleSize: 70, titleTop: 92,
    spreadTitles: ['A spread for every stage', 'Then the stamp goes in'], spreadTitleTop: 150, spreadSize: 52,
    stickersTitle: 'Real stickers in the envelope',
    end: 'etsy',
  },
  'social-vertical': {
    W: 1080, H: 1920, dur: 14.4,
    page: 500, bookTop: 520,
    scenes: { cover: [0, 3], spread: [3, 5.4], stickers: [8.4, 2.8], end: [11.2, 3.2] },
    coverTitle: ['A stamp for learning it.', 'Not for turning', 'a year older.'], titleSize: 80, titleTop: 210,
    spreadTitles: ['Talk. Do. Check.', 'Then the stamp goes in.'], spreadTitleTop: 220, spreadSize: 60,
    stickersTitle: 'Printed and posted, with real stickers',
    end: 'stage-check',
  },
}

const fontCss = `font-family:'Nunito',sans-serif;`
const mono = `font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;`
const road = (W, H, d, id) => `<svg id="${id}" data-layout-ignore viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0;width:${W}px;height:${H}px;"><path id="${id}-p" d="${d}" fill="none" stroke="${C.gold}" stroke-width="44" stroke-linecap="round"/><path id="${id}-dash" d="${d}" fill="none" stroke="${C.butterLt}" stroke-width="4" stroke-dasharray="22 20" stroke-linecap="round"/></svg>`
const scene = (id, f, body, script) => `<template>
  <style>
    #root{position:absolute;inset:0;overflow:hidden;background:${C.cream};${fontCss}color:${C.ink};}
    #root .mono{${mono}}
    #root img{display:block;}
  </style>
  <div id="root" data-composition-id="${id}" data-width="${f.W}" data-height="${f.H}">
${body}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
${script}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`
// One title line block, words blurring in one after another.
const words = (id, text, size, top, W, extra = '') => `<div id="${id}" style="position:absolute;left:60px;right:60px;top:${top}px;text-align:center;font-weight:900;font-size:${size}px;line-height:1.06;letter-spacing:-0.02em;${extra}">${text.split('\n').map(l => l.split(' ').map(w => `<span class="w" style="display:inline-block;margin:0 ${size * 0.12}px;">${w}</span>`).join('')).join('<br>')}</div>`
const wordsIn = (id, at) => `    tl.fromTo("#${id} .w", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, ease: "power4.out", stagger: 0.08 }, ${at});`
const wordsOut = (id, at) => `    tl.to("#${id}", { opacity: 0, filter: "blur(8px)", duration: 0.2, ease: "power2.in" }, ${at});`

function build(name, f) {
  const out = join(HERE, name)
  mkdirSync(join(out, 'compositions'), { recursive: true })
  mkdirSync(join(out, 'assets'), { recursive: true })
  for (const a of ['p01-named.png', 'p04.png', 'p05.png', 'p17.png', 'sticker-01.png']) copyFileSync(join(PV, a), join(out, 'assets', a))
  for (const k of FRIENDS) copyFileSync(join(SRC, 'images/friends', `${k}.png`), join(out, 'assets', `${k}.png`))
  copyFileSync(join(SRC, 'images/DiGi-star-3d.png'), join(out, 'assets', 'digi.png'))

  const { W, H, page: PW } = f
  const PH = Math.round(PW * A6.h / A6.w)
  const mm = PW / A6.w
  const cx = W / 2
  const top = f.bookTop
  const roadD = `M -40 ${H - 150} C ${W * 0.3} ${H - 230}, ${W * 0.55} ${H - 60}, ${W * 0.78} ${H - 150} S ${W + 40} ${H - 210}, ${W + 80} ${H - 180}`

  // ── COVER ─────────────────────────────────────────────────────────────
  const [cs, cd] = f.scenes.cover
  writeFileSync(join(out, 'compositions/cover.html'), scene('cover', f, `
    ${road(W, H, roadD, 'cover-road')}
    ${words('cover-title', f.coverTitle.join('\n'), f.titleSize, f.titleTop, W)}
    <div id="cover-book" style="position:absolute;left:${cx - PW / 2}px;top:${top}px;width:${PW}px;height:${PH}px;">
      <img src="assets/p01-named.png" style="width:${PW}px;height:${PH}px;border-radius:8px;box-shadow:0 26px 50px rgba(26,26,46,0.28);">
    </div>
    <img id="cover-pebble" src="assets/pebble.png" style="position:absolute;left:${cx - PW / 2 - PW * 0.42}px;top:${top + PH - PW * 0.5}px;width:${PW * 0.55}px;height:${PW * 0.55}px;object-fit:contain;">`,
  // Frame 0 is the thumbnail and the hook, so the line and the book are
  // already there: only the road, Pebble and a small settle move.
  `    tl.fromTo("#cover-road-p", { strokeDasharray: 3000, strokeDashoffset: 3000 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0);
    tl.fromTo("#cover-road-dash", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 1.2);
    tl.fromTo("#cover-book", { y: 16, scale: 1.03 }, { y: 0, scale: 1, duration: 1.0, ease: "expo.out" }, 0);
    tl.fromTo("#cover-pebble", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)" }, 0.9);
    ${wordsOut('cover-title', cd - 0.35)}
    tl.to("#cover-pebble", { x: -60, opacity: 0, duration: 0.25, ease: "power3.in" }, ${cd - 0.35});
    tl.to("#cover-road", { opacity: 0, duration: 0.3, ease: "power2.in" }, ${cd - 0.35});`))

  // ── SPREAD: the cover swings open onto Pebble, ticks, the stamp ───────
  const [ss, sd] = f.scenes.spread
  const ring = { x: cx + RING.x * mm, y: top + RING.y * mm }
  const sticker = STICKER_D * mm
  const tick = (b, i) => `<svg id="tick-${i}" viewBox="0 0 24 24" style="position:absolute;left:${cx - PW + b.x * mm - 22}px;top:${top + b.y * mm - 26}px;width:44px;height:44px;"><path id="tick-${i}-p" d="M4 13 L10 19 L21 5" fill="none" stroke="${C.goldDark}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const t1 = f.spreadTitles[0], t2 = f.spreadTitles[1]
  writeFileSync(join(out, 'compositions/spread.html'), scene('spread', f, `
    <div id="spread-rig" style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;">
      <img src="assets/p05.png" style="position:absolute;left:${cx}px;top:${top}px;width:${PW}px;height:${PH}px;border-radius:0 8px 8px 0;box-shadow:0 26px 50px rgba(26,26,46,0.24);">
      <div id="gutter" style="position:absolute;left:${cx - 50}px;top:${top}px;width:100px;height:${PH}px;background:linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(42,31,20,0.14) 48%,rgba(42,31,20,0.2) 50%,rgba(42,31,20,0.14) 52%,rgba(0,0,0,0) 100%);"></div>
      <div id="flap" data-layout-allow-overflow style="position:absolute;left:${cx}px;top:${top}px;width:${PW}px;height:${PH}px;transform-style:preserve-3d;transform-origin:0% 50%;">
        <img src="assets/p01-named.png" style="position:absolute;inset:0;width:${PW}px;height:${PH}px;border-radius:0 8px 8px 0;backface-visibility:hidden;">
        <img src="assets/p04.png" style="position:absolute;inset:0;width:${PW}px;height:${PH}px;border-radius:8px 0 0 8px;backface-visibility:hidden;transform:rotateY(180deg);box-shadow:0 26px 50px rgba(26,26,46,0.24);">
      </div>
      ${BOXES.map(tick).join('\n      ')}
      <img id="stamp" src="assets/sticker-01.png" style="position:absolute;left:${ring.x - sticker / 2}px;top:${ring.y - sticker / 2}px;width:${sticker}px;height:${sticker}px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.18));">
    </div>
    ${words('spread-t1', t1, f.spreadSize, f.spreadTitleTop, W)}
    ${words('spread-t2', t2, f.spreadSize, f.spreadTitleTop, W)}`,
  `    tl.fromTo("#spread-rig", { x: ${-PW / 2} }, { x: 0, duration: 1.1, ease: "power2.inOut" }, 0.1);
    tl.fromTo("#gutter", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.6);
    tl.fromTo("#flap", { rotationY: 0, transformPerspective: ${PW * 5} }, { rotationY: -180, transformPerspective: ${PW * 5}, duration: 1.1, ease: "power2.inOut" }, 0.1);
${wordsIn('spread-t1', 0.9)}
    ${[0, 1, 2].map(i => `tl.fromTo("#tick-${i}-p", { strokeDasharray: 40, strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.28, ease: "power2.out" }, ${(1.95 + i * 0.3).toFixed(2)});`).join('\n    ')}
    ${wordsOut('spread-t1', 2.75)}
${wordsIn('spread-t2', 2.95)}
    tl.fromTo("#stamp", { scale: 1.7, rotation: 14, opacity: 0, y: -40 }, { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" }, 3.35);
    tl.fromTo("#spread-rig", { scale: 1 }, { scale: 1.012, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "${ring.x}px ${ring.y}px" }, 3.77);
    ${wordsOut('spread-t2', sd - 0.3)}
    tl.to("#spread-rig", { x: ${-W * 0.6}, opacity: 0, duration: 0.35, ease: "power3.in" }, ${sd - 0.35});`))

  // ── STICKERS ──────────────────────────────────────────────────────────
  const [ks, kd] = f.scenes.stickers
  const sheetW = Math.round(PW * 0.92), sheetH = Math.round(sheetW * A6.h / A6.w)
  const coverW = Math.round(PW * 0.84), coverH = Math.round(coverW * A6.h / A6.w)
  writeFileSync(join(out, 'compositions/stickers.html'), scene('stickers', f, `
    ${words('stk-title', f.stickersTitle, f.spreadSize, f.spreadTitleTop, W)}
    <div id="stk-sheet" style="position:absolute;left:${cx - sheetW + 40}px;top:${top + 20}px;width:${sheetW}px;height:${sheetH}px;">
      <img src="assets/p17.png" style="width:${sheetW}px;height:${sheetH}px;border-radius:8px;box-shadow:0 26px 50px rgba(26,26,46,0.24);">
    </div>
    <div id="stk-cover" style="position:absolute;left:${cx - 20}px;top:${top + 80}px;width:${coverW}px;height:${coverH}px;">
      <img src="assets/p01-named.png" style="width:${coverW}px;height:${coverH}px;border-radius:8px;box-shadow:0 26px 50px rgba(26,26,46,0.28);">
    </div>`,
  `    tl.fromTo("#stk-sheet", { x: ${W * 0.6}, rotation: 8, opacity: 0 }, { x: 0, rotation: -4, opacity: 1, duration: 0.7, ease: "expo.out" }, 0);
    tl.fromTo("#stk-cover", { x: ${W * 0.6}, rotation: 12, opacity: 0 }, { x: 0, rotation: 5, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.18);
${wordsIn('stk-title', 0.3)}
    ${wordsOut('stk-title', kd - 0.3)}
    tl.to(["#stk-sheet", "#stk-cover"], { y: 30, opacity: 0, duration: 0.3, ease: "power3.in", stagger: 0.05 }, ${kd - 0.32});`))

  // ── END ───────────────────────────────────────────────────────────────
  const [es, ed] = f.scenes.end
  let endBody, endScript
  if (f.end === 'etsy') {
    const bw = Math.round(PW * 0.86), bh = Math.round(bw * A6.h / A6.w)
    endBody = `
    ${road(W, H, roadD, 'end-road')}
    <div id="end-book" style="position:absolute;left:${cx - bw / 2}px;top:${150}px;width:${bw}px;height:${bh}px;">
      <img src="assets/p01-named.png" style="width:${bw}px;height:${bh}px;border-radius:8px;box-shadow:0 26px 50px rgba(26,26,46,0.28);">
    </div>
    <div id="end-line" class="mono" style="position:absolute;left:0;right:0;top:${150 + bh + 44}px;text-align:center;font-size:32px;color:${C.soft};">Made to order · Ages 4 to 16</div>`
    endScript = `    tl.fromTo("#end-book", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" }, 0);
    tl.fromTo("#end-road-p", { strokeDasharray: 3000, strokeDashoffset: 3000 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0);
    tl.fromTo("#end-road-dash", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.75);
    tl.fromTo("#end-line", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, 0.12);`
  } else {
    const fr = 150
    endBody = `
    ${road(W, H, roadD, 'end-road')}
    ${words('end-q', 'What stage is\nyour child?', 104, 300, W)}
    <div id="end-sub" style="position:absolute;left:0;right:0;top:${300 + 250}px;text-align:center;font-weight:800;font-size:56px;color:${C.soft};">Three questions, no sign up.</div>
    <div id="end-friends" style="position:absolute;left:0;right:0;top:${760}px;display:flex;justify-content:center;gap:22px;">
      ${FRIENDS.map((k, i) => `<img id="end-f${i}" src="assets/${k}.png" style="width:${fr}px;height:${fr}px;object-fit:contain;">`).join('\n      ')}
    </div>
    <img id="end-digi" src="assets/digi.png" style="position:absolute;left:${cx - 90}px;top:${960}px;width:180px;height:180px;object-fit:contain;">
    <div id="end-url" class="mono" style="position:absolute;left:0;right:0;top:${1190}px;text-align:center;font-size:34px;color:${C.soft};">guidedchildhood.com</div>`
    endScript = `${wordsIn('end-q', 0.05)}
    tl.fromTo("#end-road-p", { strokeDasharray: 3000, strokeDashoffset: 3000 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0);
    tl.fromTo("#end-road-dash", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.85);
    tl.fromTo("#end-sub", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, 0.55);
    tl.fromTo("#end-friends img", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.07 }, 0.75);
    tl.fromTo("#end-digi", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, 1.15);
    tl.fromTo("#end-url", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 0.8);`
  }
  writeFileSync(join(out, 'compositions/end.html'), scene('end', f, endBody, endScript))

  // ── ROOT ──────────────────────────────────────────────────────────────
  const host = (id, [start, dur], i) => `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-track-index="${i}" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`
  writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <!-- Written by ../build.mjs: edit there and rebuild, or edit here and carry the change back. -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:${C.cream};}
      #bg{position:absolute;inset:0;background:${C.cream};}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${f.dur}" data-width="${W}" data-height="${H}">
      <div id="bg"></div>
${host('cover', f.scenes.cover, 1)}
${host('spread', f.scenes.spread, 2)}
${host('stickers', f.scenes.stickers, 3)}
${host('end', f.scenes.end, 4)}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`)
  console.log('built', name)
}

for (const [name, f] of Object.entries(FILMS)) build(name, f)
