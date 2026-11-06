// The Etsy photo set for the packs the Passport names, 2000 by 2000, built
// from each pack's listing/images.html, which sets window.LISTING and loads
// this file. Rendered by build-pack.mjs <pack> listing.
//
// Copied from the Passport's listing/images.html (PR 1407), per
// brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 8.3: every page shown is the real
// page render from images/preview, never a redraw. Slot 1 is the printable
// format: big headline, the real page, one character, the gold pathway, the
// logo mark drawn from shared/brand.ts. The character is an approved cutout.
//
// window.LISTING = {
//   name, eyebrow, headline (html), sub, friend ('pebble' or 'digi'),
//   cover: [page, page], pages: [...every page number], chips: [...],
//   closeUp: { page, eyebrow, title, points: [[label, line] x3] },
//   pageCount, phone: [...screen file names] (optional),
//   steps: [[title, line] x4], stepsFoot,
//   noSticker: true (optional, a pack with no Passport page: slot 4 is left out),
//   fourth: [title, line] (optional, the fourth format card when there is no phone),
// }
//
// A CARD DECK (Say This) shows cards, not A4 sheets of four, because a fan of
// real cards reads as a deck. Optional, and each one is a real card render
// from images/cards (build-pack.mjs, cards: true), never a redraw:
//   stickerLine, phoneCount        override slot 4's line and slot 5's count
//   coverCards: [deck no. x3]       slot 1 fans these fronts, the last on top
//   insideCards: [deck no. ...]     slot 2 shows these fronts, insideTitle heads it
//   closeUp.card: deck no.          slot 3 shows that card's front and back
(() => {
const L = window.LISTING
const LOGO_BARS = [5, 9, 14, 8]
const pv = n => `../images/preview/page-${String(n).padStart(2, '0')}.png`
const card = (n, side = 'front') => `../images/cards/card-${String(n).padStart(2, '0')}-${side}.png`
const art = k => k === 'digi' ? '../images/DiGi-star-3d.png' : `../images/friends/${k}.png`

const css = `
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;background:#bbb;color:#1A1A2E;}
  .frame{width:2000px;height:2000px;position:relative;overflow:hidden;background:#F9F8F6;display:flex;flex-direction:column;align-items:center;padding:130px 120px 110px;margin-bottom:40px;}
  .mono{font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;}
  .eyebrow{font-size:36px;color:#C99A28;}
  h1{font-weight:900;font-size:122px;line-height:1.0;letter-spacing:-3px;text-align:center;margin-top:26px;}
  .sub{font-weight:700;font-size:50px;color:#52526A;text-align:center;margin-top:28px;line-height:1.3;}
  .page{border:7px solid #1A1A2E;border-radius:26px;box-shadow:0 20px 0 #1A1A2E;background:#fff;display:block;}
  .pill{font-weight:800;font-size:40px;background:#fff;border:5px solid #1A1A2E;border-radius:999px;box-shadow:0 8px 0 #1A1A2E;padding:20px 44px;}
  .foot{position:absolute;bottom:60px;left:0;right:0;text-align:center;font-size:28px;color:#8888A0;}`
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)

const fr = (name, inner, centre = false) => `<div class="frame" data-name="${name}" style="${centre ? 'justify-content:center;padding-bottom:200px;' : ''}">${inner}<div class="foot mono">Instant download · Guided Childhood</div></div>`
const logo = (h = 84) => `<div style="display:flex;align-items:center;gap:${h * 0.28}px;">
  <span style="width:${h}px;height:${h}px;border-radius:${h * 0.26}px;background:#EDC35F;display:flex;align-items:flex-end;justify-content:center;gap:${h * 0.07}px;padding-bottom:${h * 0.2}px;">${LOGO_BARS.map(b => `<i style="display:block;width:${h * 0.1}px;height:${b / 16 * h * 0.62}px;background:#fff;border-radius:${h * 0.05}px;"></i>`).join('')}</span>
  <span style="font-weight:800;font-size:${h * 0.5}px;color:#1A1A2E;">Guided Childhood</span></div>`
// The gold pathway, the brand's one signature device.
const road = d => `<svg viewBox="0 0 2000 2000" style="position:absolute;inset:0;width:2000px;height:2000px;z-index:1;"><path d="${d}" fill="none" stroke="#EDC35F" stroke-width="74" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFF6DE" stroke-width="7" stroke-dasharray="34 30" stroke-linecap="round"/></svg>`
const pill = t => `<span class="mono" style="font-size:30px;background:#fff;border:5px solid #1A1A2E;border-radius:999px;box-shadow:0 7px 0 #1A1A2E;padding:16px 34px;color:#1A1A2E;letter-spacing:0.12em;">${t}</span>`
const underline = w => `<svg viewBox="0 0 400 24" preserveAspectRatio="none" style="display:block;width:${w}px;height:26px;margin-top:6px;"><path d="M4 16 C 120 6, 260 4, 396 12" stroke="#EDC35F" stroke-width="16" fill="none" stroke-linecap="round"/></svg>`
const out = []

// 1 · Cover: the printable format.
out.push(`<div class="frame" data-name="01-cover" style="padding:0;display:block;">
  ${road('M -60 1690 C 420 1560, 760 1820, 1180 1660 S 1820 1380, 2080 1460')}
  <div style="position:absolute;left:130px;top:150px;z-index:3;width:900px;">
    <div class="mono" style="font-size:34px;color:#C99A28;display:flex;align-items:center;gap:16px;"><span style="width:16px;height:16px;border-radius:50%;background:#EDC35F;display:inline-block;"></span>${L.eyebrow}</div>
    <div style="font-weight:900;font-size:${L.headSize || 140}px;line-height:0.98;letter-spacing:-4px;margin-top:34px;color:#1A1A2E;">${L.headline}</div>
    ${underline(520)}
    <div style="font-weight:700;font-size:46px;color:#52526A;margin-top:40px;line-height:1.3;">${L.sub}</div>
  </div>
  ${L.coverCards ? L.coverCards.map((n, i) => `<img src="${card(n)}" style="position:absolute;z-index:${2 + i};right:${[640, 70, 330][i]}px;top:${[440, 440, 290][i]}px;width:560px;border:6px solid #1A1A2E;border-radius:36px;box-shadow:0 18px 0 #1A1A2E;transform:rotate(${[-11, 10, -2][i]}deg);">`).join('') : `
  <img src="${pv(L.cover[1])}" style="position:absolute;z-index:2;right:300px;top:330px;width:640px;border:6px solid #1A1A2E;border-radius:22px;box-shadow:0 18px 0 #1A1A2E;transform:rotate(-6deg);background:#fff;">
  <img src="${pv(L.cover[0])}" style="position:absolute;z-index:2;right:100px;top:250px;width:760px;border:6px solid #1A1A2E;border-radius:22px;box-shadow:0 18px 0 #1A1A2E;transform:rotate(5deg);background:#fff;">`}
  <img src="${art(L.friend)}" style="position:absolute;z-index:5;left:${L.friend === 'digi' ? 280 : 250}px;top:${L.friend === 'digi' ? 1230 : 1180}px;width:${L.friend === 'digi' ? 420 : 520}px;height:${L.friend === 'digi' ? 420 : 520}px;object-fit:contain;">
  <div style="position:absolute;z-index:6;left:130px;bottom:110px;">${logo(84)}</div>
  <div style="position:absolute;z-index:6;right:120px;bottom:120px;">${pill('Instant download')}</div>
</div>`)

// 2 · What is inside: every page, as rendered.
const cols = L.pages.length > 10 ? 7 : L.pages.length > 8 ? 5 : 4
out.push(fr('02-whats-inside', `
  <div class="mono eyebrow">What is inside</div>
  <h1>${L.insideTitle || `${L.pageCount} pages, ready to print`}</h1>
  ${L.insideCards ? `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:30px;margin-top:70px;width:1700px;">
    ${L.insideCards.map(n => `<img src="${card(n)}" style="width:100%;border:4px solid #1A1A2E;border-radius:20px;box-shadow:0 8px 0 #1A1A2E;">`).join('')}
  </div>` : `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:34px;margin-top:80px;width:${cols === 4 ? 1500 : 1760}px;align-items:start;">
    ${L.pages.map(n => `<img class="page" src="${pv(n)}" style="width:100%;border-width:4px;border-radius:14px;box-shadow:0 10px 0 #1A1A2E;">`).join('')}
  </div>`}
  <div style="display:flex;gap:24px;margin-top:70px;flex-wrap:wrap;justify-content:center;">
    ${L.chips.map(c => `<span class="pill">${c}</span>`).join('')}
  </div>`, true))

// 3 · A page close up, with what it does.
const C = L.closeUp
out.push(fr('03-close-up', `
  <div style="display:flex;gap:90px;align-items:center;height:100%;width:100%;">
    ${C.card ? `<div style="position:relative;width:960px;height:1100px;flex-shrink:0;">
      <img src="${card(C.card, 'back')}" style="position:absolute;left:330px;top:120px;width:620px;border:6px solid #1A1A2E;border-radius:38px;box-shadow:0 18px 0 #1A1A2E;transform:rotate(5deg);">
      <img src="${card(C.card)}" style="position:absolute;left:0;top:40px;width:620px;border:6px solid #1A1A2E;border-radius:38px;box-shadow:0 18px 0 #1A1A2E;transform:rotate(-5deg);">
    </div>` : `<img class="page" src="${pv(C.page)}" style="width:960px;transform:rotate(-2.5deg);">`}
    <div style="flex:1;">
      <div class="mono eyebrow">${C.eyebrow}</div>
      <div style="font-weight:900;font-size:96px;line-height:1.02;letter-spacing:-2px;margin-top:24px;">${C.title}</div>
      <div style="display:flex;flex-direction:column;gap:30px;margin-top:60px;">
        ${C.points.map(([a, b]) => `<div style="background:#fff;border:5px solid #1A1A2E;border-radius:30px;padding:30px 36px;"><div class="mono" style="font-size:26px;color:#C99A28;">${a}</div><div style="font-weight:800;font-size:40px;line-height:1.25;margin-top:8px;">${b}</div></div>`).join('')}
      </div>
    </div>
  </div>`))

// 4 · The Passport sticker: the pack's last page, as rendered.
if (!L.noSticker) out.push(fr('04-passport-sticker', `
  <div class="mono eyebrow">The Guided Childhood Passport</div>
  <h1>Do it, tick it,<br>stick it on</h1>
  <div class="sub">${L.stickerLine || `Your ${L.noun} comes with its own sticker for the ${L.stage} page.`}</div>
  <img class="page" src="${pv(L.pageCount)}" style="width:880px;margin-top:56px;">`))

// 5 · Formats.
const formats = [['A4', `Full colour PDF, ${L.pageCount} pages`], ['US Letter', 'Sized for Letter paper, nothing cut off'], ['Ink friendly', 'The same pages, light on ink']]
formats.push(L.phone ? ['Phone', `${L.phoneCount || L.phone.length} screens, 1080 by 1920`] : (L.fourth || ['Sticker page', 'Your Passport sticker, last page']))
out.push(fr('05-formats', `
  <div class="mono eyebrow">Instant download</div>
  <h1>Every format you need</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:110px;width:1500px;">
    ${formats.map(([a, b]) => `<div style="background:#fff;border:6px solid #1A1A2E;border-radius:40px;box-shadow:0 14px 0 #1A1A2E;padding:60px 56px;"><div style="font-weight:900;font-size:84px;">${a}</div><div style="font-weight:700;font-size:40px;color:#52526A;margin-top:14px;line-height:1.3;">${b}</div></div>`).join('')}
  </div>
  <div class="sub" style="margin-top:110px;">${L.formatsFoot || 'Nothing is posted. Print as often as your family needs.'}</div>`, true))

// 6 · How it works.
out.push(fr('06-how-it-works', `
  <div class="mono eyebrow">How it works</div>
  <h1>${L.stepsTitle}</h1>
  <div style="display:flex;gap:36px;margin-top:140px;width:100%;">
    ${L.steps.map(([a, b], i) => `<div style="flex:1;background:${i + 1 === L.steps.length ? '#FFF6DE' : '#fff'};border:6px solid #1A1A2E;border-radius:40px;box-shadow:0 14px 0 #1A1A2E;padding:56px 34px;text-align:center;min-height:620px;display:flex;flex-direction:column;align-items:center;">
      <div class="mono" style="font-size:40px;color:#C99A28;">${i + 1}</div>
      <div style="font-weight:900;font-size:${a.length > 7 ? 66 : 80}px;margin-top:20px;line-height:1.05;">${a}</div>
      <div style="font-weight:700;font-size:40px;color:#52526A;line-height:1.3;margin-top:24px;">${b}</div>
      ${i + 1 === L.steps.length ? '<img src="../images/DiGi-star-3d.png" style="width:200px;height:200px;margin-top:auto;">' : ''}
    </div>`).join('')}
  </div>
  <div class="sub" style="margin-top:110px;">${L.stepsFoot}</div>`, true))

// 7 · Phone version, where the pack has one.
if (L.phone) out.push(fr('07-phone-version', `
  <div class="mono eyebrow">Phone version included</div>
  <h1>On the fridge and<br>on the phone</h1>
  <div style="display:flex;gap:60px;margin-top:90px;">
    ${L.phone.map((n, i, a) => `<div style="width:470px;height:836px;border-radius:64px;background:#1A1A2E;padding:18px;box-shadow:0 20px 0 rgba(26,26,46,0.25);transform:rotate(${a.length === 2 ? [-3, 3][i] : [-4, 0, 4][i]}deg);"><img src="../phone/${n}.png" style="width:100%;height:100%;border-radius:48px;display:block;"></div>`).join('')}
  </div>`))

document.body.insertAdjacentHTML('beforeend', out.join('\n'))
})()
