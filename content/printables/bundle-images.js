// The Etsy photo set for a bundle, 2000 by 2000, built from the bundle's
// listing/images.html, which sets window.BUNDLE and loads this file. Rendered
// by build-pack.mjs <bundle> listing.
//
// A bundle has no pages of its own. Every picture here is a real page render
// from the packs it holds (content/printables/<pack>/images/preview), so a
// change to a pack flows into the bundle's photos on the next build.
//
// THE CANVA LOOK, the same as listing-images.js (Justin, 6 November 2026):
// soft paper colours, a serif headline with a handwritten note, real pages
// lying flat with a soft shadow and washi tape, flat sparkles and icons. No
// rendered characters, ink outlines, hard shadows or 3D road.
//
// window.BUNDLE = {
//   name, eyebrow, headline (html), sub, friend (no longer drawn),
//   packs: [{ dir, name, line, pages, show: [page, page], cover (page, default 1) }],
//   steps: [[title, line] x4], stepsTitle, stepsFoot, fourth: [title, line],
//   note (optional): the handwritten line on the cover,
// }
(() => {
const B = window.BUNDLE
const pv = (dir, n) => `../../${dir}/images/preview/page-${String(n).padStart(2, '0')}.png`
// The same five paper themes as listing-images.js; set B.theme per bundle.
const THEMES = {
  butter: { accent: '#F6E2A6', spark: '#C9962B', tape: 'rgba(246,226,166,0.85)', bg: ['#FBF6EC', '#E7EEDF', '#F6E2A6', '#FBF6EC'], packs: ['#F8E6DC', '#E3EDF3', '#FBF6EC', '#E7EEDF'] },
  sage: { accent: '#CFE3C4', spark: '#6E9460', tape: 'rgba(207,227,196,0.9)', bg: ['#F4F7EF', '#FBF6EC', '#CFE3C4', '#FBF6EC'], packs: ['#E7EEDF', '#F8E6DC', '#FBF6EC', '#E3EDF3'] },
  blush: { accent: '#F4CFC0', spark: '#C7714F', tape: 'rgba(244,207,192,0.9)', bg: ['#FCF3EE', '#F8E6DC', '#F4CFC0', '#FBF6EC'], packs: ['#FBF6EC', '#E7EEDF', '#F8E6DC', '#E3EDF3'] },
  sky: { accent: '#C8DDEB', spark: '#4F82A6', tape: 'rgba(200,221,235,0.9)', bg: ['#F1F6F9', '#E3EDF3', '#C8DDEB', '#FBF6EC'], packs: ['#FBF6EC', '#F8E6DC', '#E3EDF3', '#E7EEDF'] },
  lilac: { accent: '#DDD3EE', spark: '#7D64AA', tape: 'rgba(221,211,238,0.9)', bg: ['#F6F3FA', '#ECE6F5', '#DDD3EE', '#FBF6EC'], packs: ['#FBF6EC', '#E7EEDF', '#F6F3FA', '#E3EDF3'] },
}
const T = THEMES[B.theme] || THEMES.butter
const C = { ink: '#2E2A26', soft: '#6F675E', gold: T.spark, cream: '#FBF6EC', butter: T.accent, sage: '#E7EEDF', blush: '#F8E6DC', sky: '#E3EDF3' }

document.head.insertAdjacentHTML('beforeend', '<link href="../../listing-fonts/fonts.css" rel="stylesheet">')
document.head.insertAdjacentHTML('beforeend', `<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;background:#bbb;color:${C.ink};}
  .frame{width:2000px;height:2000px;position:relative;overflow:hidden;background:${C.cream};display:flex;flex-direction:column;align-items:center;padding:150px 130px 130px;margin-bottom:40px;}
  .serif{font-family:'DM Serif Display',Georgia,serif;font-weight:400;letter-spacing:-1px;}
  .hand{font-family:'Caveat',cursive;font-weight:700;}
  .tag{font-weight:800;font-size:34px;letter-spacing:0.14em;text-transform:uppercase;background:${C.butter};color:${C.ink};border-radius:999px;padding:16px 38px;}
  h1{font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:120px;line-height:1.02;letter-spacing:-1px;text-align:center;margin-top:34px;}
  .sub{font-weight:600;font-size:46px;color:${C.soft};text-align:center;margin-top:28px;line-height:1.35;max-width:1600px;}
  .paper{background:#fff;display:block;border-radius:6px;box-shadow:0 2px 4px rgba(46,42,38,0.08),0 28px 60px rgba(46,42,38,0.16);}
  .foot{position:absolute;bottom:64px;left:0;right:0;text-align:center;font-weight:700;font-size:30px;letter-spacing:0.12em;text-transform:uppercase;color:#A39A8F;}
</style>`)

const spark = (x, y, s, col = C.gold, rot = 0) => `<svg viewBox="0 0 100 100" style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${rot}deg);z-index:4;"><path d="M50 0 C55 38 62 45 100 50 C62 55 55 62 50 100 C45 62 38 55 0 50 C38 45 45 38 50 0Z" fill="${col}"/></svg>`
const tape = (x, y, w, rot) => `<span style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:70px;background:${T.tape};transform:rotate(${rot}deg);z-index:12;box-shadow:0 2px 6px rgba(46,42,38,0.08);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.25) 0 14px,transparent 14px 28px);"></span>`
const tick = `<svg viewBox="0 0 40 40" style="width:46px;height:46px;flex-shrink:0;"><circle cx="20" cy="20" r="20" fill="${C.butter}"/><path d="M11 21 L18 28 L30 13" stroke="${C.ink}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON = {
  paper: `<svg viewBox="0 0 60 60" width="84" height="84"><path d="M16 6h20l12 12v36H16z" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M36 6v12h12" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M23 30h18M23 38h18M23 46h11" stroke="${C.gold}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  ink: `<svg viewBox="0 0 60 60" width="84" height="84"><path d="M30 6 C 40 20, 47 29, 47 38 a17 17 0 0 1 -34 0 C 13 29, 20 20, 30 6z" fill="${C.butter}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 60 60" width="84" height="84"><rect x="17" y="5" width="26" height="50" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><path d="M26 47h8" stroke="${C.gold}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
}
const fr = (name, bg, inner) => `<div class="frame" data-name="${name}" style="background:${bg};">${inner}<div class="foot">Instant download · Guided Childhood</div></div>`
const out = []
const P = B.packs
const total = P.reduce((a, p) => a + p.pages, 0)

// 1 · Cover: every pack's own cover, fanned on paper, the headline above.
const fan = P.map((p, i) => {
  const n = P.length, spread = n > 3 ? 300 : 380, off = i - (n - 1) / 2
  const x = 1000 + off * spread, rot = off * 6
  return `<img src="${pv(p.dir, p.cover || 1)}" class="paper" style="position:absolute;z-index:${8 - Math.abs(Math.round(off * 2))};left:${x - 320}px;top:${520 + Math.abs(off) * 50}px;width:640px;transform:rotate(${rot}deg);">`
}).join('')
out.push(`<div class="frame" data-name="01-cover" style="padding:0;display:block;background:${T.bg[0]};">
  <div style="position:absolute;left:170px;right:170px;top:440px;height:1700px;border-radius:700px 700px 0 0;background:${C.butter};opacity:0.55;"></div>
  ${spark(170, 690, 80)}${spark(1760, 760, 90, C.gold, 14)}
  <div style="position:absolute;left:0;right:0;top:140px;z-index:10;text-align:center;">
    <span class="tag">${B.eyebrow}</span>
    <div class="serif" style="font-size:${Math.round((B.headSize || 130) * 0.78)}px;line-height:1.0;margin-top:40px;">${B.headline.replace(/<br>/g, ' ')}</div>
  </div>
  ${fan}
  ${tape(860, 460, 280, -3)}
  <div class="hand" style="position:absolute;right:150px;top:420px;z-index:13;font-size:76px;color:${C.gold};transform:rotate(-6deg);">${B.note || `${P.length} packs, one download!`}</div>
  <div style="position:absolute;left:130px;right:130px;bottom:250px;z-index:14;background:#fff;border-radius:999px;box-shadow:0 14px 40px rgba(46,42,38,0.10);display:flex;justify-content:space-around;align-items:center;padding:34px 40px;">
    ${[`${P.length} packs`, `${total} pages`, 'A4 + US Letter'].map(t => `<span style="display:flex;align-items:center;gap:18px;font-weight:800;font-size:40px;">${tick}${t}</span>`).join('')}
  </div>
</div>`)

// 2 · What is inside: one row per pack, its cover and a line.
const big = P.length <= 3
out.push(fr('02-whats-inside', T.bg[1], `
  ${spark(180, 170, 60)}${spark(1740, 220, 80, C.gold, 15)}
  <span class="tag" style="background:#fff;">What's inside</span>
  <h1>${P.length} packs, ${total} pages</h1>
  <div style="display:flex;flex-direction:column;gap:${big ? 44 : 28}px;margin-top:70px;width:1600px;">
    ${P.map(p => `<div style="display:flex;gap:50px;align-items:center;background:#fff;border-radius:36px;box-shadow:0 16px 40px rgba(46,42,38,0.08);padding:${big ? 34 : 22}px 44px;">
      <img class="paper" src="${pv(p.dir, p.cover || 1)}" style="height:${big ? 290 : 200}px;border-radius:4px;transform:rotate(-2deg);">
      <div><div class="serif" style="font-size:${big ? 68 : 56}px;line-height:1.05;">${p.name}</div>
      <div style="font-weight:600;font-size:${big ? 40 : 34}px;color:${C.soft};margin-top:12px;line-height:1.3;">${p.line}</div>
      <div style="font-weight:800;font-size:28px;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-top:14px;">${p.pages} pages</div></div>
    </div>`).join('')}
  </div>`))

// 3 onwards · One frame per pack: two real pages from inside it.
const BG = T.packs
P.forEach((p, i) => out.push(fr(`0${3 + i}-${p.dir}`, BG[i % BG.length], `
  ${spark(170, 180, 70)}${spark(1760, 1560, 80, C.gold, 12)}
  <span class="tag" style="background:#fff;">Pack ${i + 1} of ${P.length}</span>
  <h1>${p.name}</h1>
  <div class="sub">${p.line}</div>
  <div style="position:relative;display:flex;gap:70px;margin-top:100px;align-items:flex-start;">
    ${tape(p.wide ? 520 : 280, -26, 260, -3)}
    ${p.show.map((n, j) => `<img class="paper" src="${pv(p.dir, n)}" style="width:${p.wide ? 1300 : 780}px;transform:rotate(${j ? 2 : -2}deg);">`).join('')}
  </div>`)))

// Formats, then how it works.
const k = 3 + P.length
const four = B.fourth || ['Phone', 'Screens from the packs, 1080 by 1920']
out.push(fr(`${String(k).padStart(2, '0')}-formats`, T.bg[2], `
  ${spark(170, 210, 70, '#fff')}${spark(1730, 1500, 90, '#fff', 18)}
  <span class="tag" style="background:#fff;">Instant download</span>
  <h1>Every format you need</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:110px;width:1500px;">
    ${[['A4', 'Full colour PDFs, every pack', 'paper'], ['US Letter', 'Sized for Letter paper, nothing cut off', 'paper'], ['Ink friendly', 'The same pages, light on ink', 'ink'], [four[0], four[1], /phone/i.test(four[0]) ? 'phone' : 'paper']].map(([a, b, ic]) => `<div style="background:#fff;border-radius:36px;box-shadow:0 18px 44px rgba(46,42,38,0.10);padding:56px 60px 64px;">${ICON[ic]}<div class="serif" style="font-size:86px;line-height:1;margin-top:20px;">${a}</div><div style="font-weight:600;font-size:40px;color:${C.soft};margin-top:20px;line-height:1.3;">${b}</div></div>`).join('')}
  </div>
  <div class="hand" style="font-size:76px;margin-top:100px;transform:rotate(-2deg);">Nothing is posted. Print as often as you like.</div>`))
out.push(fr(`${String(k + 1).padStart(2, '0')}-how-it-works`, T.bg[3], `
  ${spark(200, 190, 60)}${spark(1720, 200, 80, C.gold, 10)}
  <span class="tag">How it works</span>
  <h1>${B.stepsTitle}</h1>
  <div style="display:flex;gap:40px;margin-top:120px;width:100%;">
    ${B.steps.map(([a, b], i) => `<div style="flex:1;background:${i + 1 === B.steps.length ? C.butter : '#fff'};border-radius:36px;box-shadow:0 16px 40px rgba(46,42,38,0.08);padding:60px 36px;text-align:center;min-height:600px;display:flex;flex-direction:column;align-items:center;">
      <span class="serif" style="width:120px;height:120px;border-radius:50%;background:${i + 1 === B.steps.length ? '#fff' : C.butter};display:flex;align-items:center;justify-content:center;font-size:70px;">${i + 1}</span>
      <div class="serif" style="font-size:${a.length > 7 ? 64 : 76}px;margin-top:34px;line-height:1.05;">${a}</div>
      <div style="font-weight:600;font-size:40px;color:${C.soft};line-height:1.3;margin-top:24px;">${b}</div>
    </div>`).join('')}
  </div>
  <div class="hand" style="font-size:72px;margin-top:100px;text-align:center;transform:rotate(-1.5deg);">${B.stepsFoot}</div>`))

document.body.insertAdjacentHTML('beforeend', out.join('\n'))
})()
