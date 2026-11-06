// The Etsy photo set for a bundle, 2000 by 2000, built from the bundle's
// listing/images.html, which sets window.BUNDLE and loads this file. Rendered
// by build-pack.mjs <bundle> listing.
//
// A bundle has no pages of its own. Every picture here is a real page render
// from the packs it holds (content/printables/<pack>/images/preview), so a
// change to a pack flows into the bundle's photos on the next build. Same
// frame, type and gold pathway as listing-images.js.
//
// window.BUNDLE = {
//   name, eyebrow, headline (html), sub, friend ('orbit', 'digi', ...),
//   packs: [{ dir, name, line, pages, show: [page, page], cover (page, default 1) }],
//   steps: [[title, line] x4], stepsTitle, stepsFoot,
// }
(() => {
const B = window.BUNDLE
const LOGO_BARS = [5, 9, 14, 8]
const pv = (dir, n) => `../../${dir}/images/preview/page-${String(n).padStart(2, '0')}.png`
const art = k => k === 'digi' ? '../images/DiGi-star-3d.png' : `../images/friends/${k}.png`

document.head.insertAdjacentHTML('beforeend', `<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;background:#bbb;color:#1A1A2E;}
  .frame{width:2000px;height:2000px;position:relative;overflow:hidden;background:#F9F8F6;display:flex;flex-direction:column;align-items:center;padding:130px 120px 110px;margin-bottom:40px;}
  .mono{font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;}
  .eyebrow{font-size:36px;color:#C99A28;}
  h1{font-weight:900;font-size:122px;line-height:1.0;letter-spacing:-3px;text-align:center;margin-top:26px;}
  .sub{font-weight:700;font-size:50px;color:#52526A;text-align:center;margin-top:28px;line-height:1.3;}
  .page{border:6px solid #1A1A2E;border-radius:22px;box-shadow:0 16px 0 #1A1A2E;background:#fff;display:block;}
  .foot{position:absolute;bottom:60px;left:0;right:0;text-align:center;font-size:28px;color:#8888A0;}
</style>`)

const fr = (name, inner) => `<div class="frame" data-name="${name}">${inner}<div class="foot mono">Instant download · Guided Childhood</div></div>`
const logo = (h = 84) => `<div style="display:flex;align-items:center;gap:${h * 0.28}px;">
  <span style="width:${h}px;height:${h}px;border-radius:${h * 0.26}px;background:#EDC35F;display:flex;align-items:flex-end;justify-content:center;gap:${h * 0.07}px;padding-bottom:${h * 0.2}px;">${LOGO_BARS.map(b => `<i style="display:block;width:${h * 0.1}px;height:${b / 16 * h * 0.62}px;background:#fff;border-radius:${h * 0.05}px;"></i>`).join('')}</span>
  <span style="font-weight:800;font-size:${h * 0.5}px;color:#1A1A2E;">Guided Childhood</span></div>`
const road = d => `<svg viewBox="0 0 2000 2000" style="position:absolute;inset:0;width:2000px;height:2000px;z-index:1;"><path d="${d}" fill="none" stroke="#EDC35F" stroke-width="74" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFF6DE" stroke-width="7" stroke-dasharray="34 30" stroke-linecap="round"/></svg>`
const pill = t => `<span class="mono" style="font-size:30px;background:#fff;border:5px solid #1A1A2E;border-radius:999px;box-shadow:0 7px 0 #1A1A2E;padding:16px 34px;color:#1A1A2E;letter-spacing:0.12em;">${t}</span>`
const out = []
const P = B.packs
const total = P.reduce((a, p) => a + p.pages, 0)

// 1 · Cover: every pack's own cover, fanned, the headline, one friend.
const fan = P.map((p, i) => {
  const n = P.length, spread = n > 3 ? 210 : 260, off = i + (1 + (-n)) / 2
  const x = 1120 + off * spread, rot = off * 7
  return `<img src="${pv(p.dir, p.cover || 1)}" class="page" style="position:absolute;z-index:${8 + (-i)};left:${x - 280}px;top:${560 + Math.abs(off) * 40}px;width:560px;transform:rotate(${rot}deg);">`
}).join('')
out.push(`<div class="frame" data-name="01-cover" style="padding:0;display:block;">
  ${road('M -60 1700 C 420 1580, 760 1820, 1180 1680 S 1820 1420, 2080 1500')}
  <div style="position:absolute;left:130px;top:130px;z-index:8;width:1760px;">
    <div class="mono" style="font-size:34px;color:#C99A28;">${B.eyebrow}</div>
    <div style="font-weight:900;font-size:${B.headSize || 130}px;line-height:0.98;letter-spacing:-4px;margin-top:30px;">${B.headline}</div>
  </div>
  ${fan}
  <img src="${art(B.friend)}" style="position:absolute;z-index:9;left:90px;top:1300px;width:420px;height:420px;object-fit:contain;">
  <div style="position:absolute;z-index:9;left:130px;bottom:110px;">${logo(84)}</div>
  <div style="position:absolute;z-index:9;right:120px;bottom:120px;">${pill(`${P.length} packs in one download`)}</div>
</div>`)

// 2 · What is inside: one row per pack, its cover and a line.
out.push(fr('02-whats-inside', `
  <div class="mono eyebrow">What is inside</div>
  <h1>${P.length} packs, ${total} pages</h1>
  <div style="display:flex;flex-direction:column;gap:${P.length > 3 ? 30 : 50}px;margin-top:70px;width:1600px;">
    ${P.map(p => `<div style="display:flex;gap:50px;align-items:center;background:#fff;border:6px solid #1A1A2E;border-radius:36px;box-shadow:0 12px 0 #1A1A2E;padding:${P.length > 3 ? 22 : 34}px 44px;">
      <img src="${pv(p.dir, p.cover || 1)}" style="height:${P.length > 3 ? 200 : 290}px;border:4px solid #1A1A2E;border-radius:12px;">
      <div><div style="font-weight:900;font-size:${P.length > 3 ? 54 : 66}px;line-height:1.05;">${p.name}</div>
      <div style="font-weight:700;font-size:${P.length > 3 ? 34 : 40}px;color:#52526A;margin-top:12px;line-height:1.3;">${p.line}</div>
      <div class="mono" style="font-size:26px;color:#C99A28;margin-top:14px;">${p.pages} pages</div></div>
    </div>`).join('')}
  </div>`))

// 3 onwards · One frame per pack: two real pages from inside it.
P.forEach((p, i) => out.push(fr(`0${3 + i}-${p.dir}`, `
  <div class="mono eyebrow">Pack ${i + 1} of ${P.length}</div>
  <h1>${p.name}</h1>
  <div class="sub">${p.line}</div>
  <div style="display:flex;gap:70px;margin-top:120px;align-items:flex-start;">
    ${p.show.map((n, j) => `<img class="page" src="${pv(p.dir, n)}" style="width:${p.wide ? 1300 : 820}px;transform:rotate(${j ? 2.5 : -2.5}deg);">`).join('')}
  </div>`)))

// Formats, then how it works.
const k = 3 + P.length
out.push(fr(`${String(k).padStart(2, '0')}-formats`, `
  <div class="mono eyebrow">Instant download</div>
  <h1>Every format you need</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:110px;width:1500px;">
    ${[['A4', 'Full colour PDFs, every pack'], ['US Letter', 'Sized for Letter paper, nothing cut off'], ['Ink friendly', 'The same pages, light on ink'], B.fourth].map(([a, b]) => `<div style="background:#fff;border:6px solid #1A1A2E;border-radius:40px;box-shadow:0 14px 0 #1A1A2E;padding:60px 56px;"><div style="font-weight:900;font-size:84px;">${a}</div><div style="font-weight:700;font-size:40px;color:#52526A;margin-top:14px;line-height:1.3;">${b}</div></div>`).join('')}
  </div>
  <div class="sub" style="margin-top:110px;">Nothing is posted. Print as often as your family needs.</div>`))
out.push(fr(`${String(k + 1).padStart(2, '0')}-how-it-works`, `
  <div class="mono eyebrow">How it works</div>
  <h1>${B.stepsTitle}</h1>
  <div style="display:flex;gap:36px;margin-top:140px;width:100%;">
    ${B.steps.map(([a, b], i) => `<div style="flex:1;background:${i + 1 === B.steps.length ? '#FFF6DE' : '#fff'};border:6px solid #1A1A2E;border-radius:40px;box-shadow:0 14px 0 #1A1A2E;padding:56px 34px;text-align:center;min-height:620px;display:flex;flex-direction:column;align-items:center;">
      <div class="mono" style="font-size:40px;color:#C99A28;">${i + 1}</div>
      <div style="font-weight:900;font-size:${a.length > 7 ? 66 : 80}px;margin-top:20px;line-height:1.05;">${a}</div>
      <div style="font-weight:700;font-size:40px;color:#52526A;line-height:1.3;margin-top:24px;">${b}</div>
      ${i + 1 === B.steps.length ? '<img src="../images/DiGi-star-3d.png" style="width:200px;height:200px;margin-top:auto;">' : ''}
    </div>`).join('')}
  </div>
  <div class="sub" style="margin-top:110px;">${B.stepsFoot}</div>`))

document.body.insertAdjacentHTML('beforeend', out.join('\n'))
})()
