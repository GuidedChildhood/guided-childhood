// The Etsy photo set for the packs the Passport names, 2000 by 2000, built
// from each pack's listing/images.html, which sets window.LISTING and loads
// this file. Rendered by build-pack.mjs <pack> listing.
//
// THE CANVA LOOK (Justin, 6 November 2026): "the cover images and images on
// Etsy look more AI than Canva, the goal is to look like I designed them in
// Canva". So the photo set is flat and hand made in feel: soft paper colours,
// a serif headline (DM Serif Display) with a handwritten note (Caveat), the
// real pages lying flat with a soft shadow and a strip of washi tape, little
// flat sparkles, and a ticked feature bar. No rendered characters, no thick
// ink outlines, no hard offset shadows, no 3D road. The friends still appear
// where they are printed on the pages themselves.
//
// Every page shown is still the real page render from images/preview, never
// a redraw (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 8.3).
//
// window.LISTING = {
//   name, eyebrow, headline (html), sub, friend (no longer drawn),
//   cover: [page, page], pages: [...every page number], chips: [...],
//   closeUp: { page, eyebrow, title, points: [[label, line] x3] },
//   pageCount, phone: [...screen file names] (optional),
//   steps: [[title, line] x4], stepsFoot,
//   noSticker: true (optional, a pack with no Passport page: slot 4 is left out),
//   fourth: [title, line] (optional, the fourth format card when there is no phone),
//   note (optional): the handwritten line on the cover, default "instant download!",
//   phoneTitle (optional, slot 7's headline when the pack does not live on the fridge),
// }
//
// A CARD DECK (Say This) shows cards, not A4 sheets, because a fan of real
// cards reads as a deck. Optional, and each one is a real card render from
// images/cards (build-pack.mjs, cards: true), never a redraw:
//   stickerLine, phoneCount        override slot 4's line and slot 5's count
//   coverCards: [deck no. x3]       slot 1 fans these fronts, the last on top
//   insideCards: [deck no. ...]     slot 2 shows these fronts, insideTitle heads it
//   closeUp.card: deck no.          slot 3 shows that card's front and back
(() => {
const L = window.LISTING
const pv = n => `../images/preview/page-${String(n).padStart(2, '0')}.png`
const card = (n, side = 'front') => `../images/cards/card-${String(n).padStart(2, '0')}-${side}.png`

// VARIETY, so the shop never looks like one template (Justin, 6 November
// 2026). Each product gets one of five paper themes and one of three cover
// layouts, picked from its name so it is stable between builds. Set
// L.theme or L.layout to choose by hand, and give neighbouring products in
// the shop different ones. bg is the paper for each slot in order: cover,
// inside, close up, sticker, formats, how it works, phone, fridge.
const THEMES = {
  butter: { accent: '#F6E2A6', spark: '#C9962B', tape: 'rgba(246,226,166,0.85)', bg: ['#FBF6EC', '#E7EEDF', '#F8E6DC', '#FBF6EC', '#F6E2A6', '#FBF6EC', '#E3EDF3', '#E3EDF3'] },
  sage: { accent: '#CFE3C4', spark: '#6E9460', tape: 'rgba(207,227,196,0.9)', bg: ['#F4F7EF', '#FBF6EC', '#E7EEDF', '#F4F7EF', '#CFE3C4', '#FBF6EC', '#F8E6DC', '#F8E6DC'] },
  blush: { accent: '#F4CFC0', spark: '#C7714F', tape: 'rgba(244,207,192,0.9)', bg: ['#FCF3EE', '#F8E6DC', '#FBF6EC', '#FCF3EE', '#F4CFC0', '#FBF6EC', '#E7EEDF', '#E7EEDF'] },
  sky: { accent: '#C8DDEB', spark: '#4F82A6', tape: 'rgba(200,221,235,0.9)', bg: ['#F1F6F9', '#E3EDF3', '#FBF6EC', '#F1F6F9', '#C8DDEB', '#FBF6EC', '#F8E6DC', '#FBF6EC'] },
  lilac: { accent: '#DDD3EE', spark: '#7D64AA', tape: 'rgba(221,211,238,0.9)', bg: ['#F6F3FA', '#ECE6F5', '#FBF6EC', '#F6F3FA', '#DDD3EE', '#FBF6EC', '#E7EEDF', '#E3EDF3'] },
}
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
const T = THEMES[L.theme] || Object.values(THEMES)[hash(L.name) % 5]
const LAYOUT = L.layout || ['clipboard', 'clipboard-left', 'stack'][hash(L.name + ' cover') % 3]

// Soft paper colours, with the theme's accent and sparkle colour.
const C = { ink: '#2E2A26', soft: '#6F675E', gold: T.spark, cream: '#FBF6EC', butter: T.accent, sage: '#E7EEDF', blush: '#F8E6DC', sky: '#E3EDF3', white: '#FFFFFF' }

document.head.insertAdjacentHTML('beforeend', '<link href="../../listing-fonts/fonts.css" rel="stylesheet">')
const css = `
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;background:#bbb;color:${C.ink};}
  .frame{width:2000px;height:2000px;position:relative;overflow:hidden;background:${C.cream};display:flex;flex-direction:column;align-items:center;padding:150px 130px 130px;margin-bottom:40px;}
  .serif{font-family:'DM Serif Display',Georgia,serif;font-weight:400;letter-spacing:-1px;}
  .hand{font-family:'Caveat',cursive;font-weight:700;}
  .tag{font-weight:800;font-size:34px;letter-spacing:0.14em;text-transform:uppercase;background:${C.butter};color:${C.ink};border-radius:999px;padding:16px 38px;}
  h1{font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:128px;line-height:1.02;letter-spacing:-1px;text-align:center;margin-top:34px;}
  .sub{font-weight:600;font-size:48px;color:${C.soft};text-align:center;margin-top:30px;line-height:1.35;}
  .paper{background:#fff;display:block;border-radius:6px;box-shadow:0 2px 4px rgba(46,42,38,0.08),0 28px 60px rgba(46,42,38,0.16);}
  .chip{font-weight:800;font-size:38px;background:#fff;border-radius:999px;padding:20px 44px;box-shadow:0 10px 26px rgba(46,42,38,0.10);}
  .foot{position:absolute;bottom:64px;left:0;right:0;text-align:center;font-weight:700;font-size:30px;letter-spacing:0.12em;text-transform:uppercase;color:#A39A8F;}`
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)

// Small flat four point sparkles, the kind dropped on from an elements panel.
const spark = (x, y, s, col = C.gold, rot = 0) => `<svg viewBox="0 0 100 100" style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${rot}deg);z-index:4;"><path d="M50 0 C55 38 62 45 100 50 C62 55 55 62 50 100 C45 62 38 55 0 50 C38 45 45 38 50 0Z" fill="${col}"/></svg>`
const dot = (x, y, s, col) => `<span style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:${col};z-index:1;"></span>`
// A strip of washi tape across a page's top edge.
const tape = (x, y, w, rot, col = T.tape) => `<span style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:70px;background:${col};transform:rotate(${rot}deg);z-index:6;box-shadow:0 2px 6px rgba(46,42,38,0.08);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.25) 0 14px,transparent 14px 28px);"></span>`
// A hand drawn arrow for the handwritten note.
const arrow = (x, y, w, rot, flip = false) => `<svg viewBox="0 0 200 120" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg)${flip ? ' scaleX(-1)' : ''};z-index:7;"><path d="M10 20 C 70 10, 140 30, 170 95" stroke="${C.ink}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M140 82 L172 100 L180 64" stroke="${C.ink}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const tick = `<svg viewBox="0 0 40 40" style="width:46px;height:46px;flex-shrink:0;"><circle cx="20" cy="20" r="20" fill="${C.butter}"/><path d="M11 21 L18 28 L30 13" stroke="${C.ink}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const wordmark = (size = 34) => `<span style="font-weight:800;font-size:${size}px;letter-spacing:0.18em;text-transform:uppercase;color:${C.ink};">Guided Childhood</span>`
// A flat kraft clipboard holding the real page, the most used mockup element.
const clipboard = (src, style, w) => `<div style="${style}width:${w + 90}px;padding:120px 45px 50px;border-radius:40px;background:#C89E6C;background-image:linear-gradient(135deg,rgba(255,255,255,0.10),rgba(0,0,0,0.06));box-shadow:0 30px 70px rgba(46,42,38,0.22);">
  <span style="position:absolute;left:50%;top:22px;transform:translateX(-50%);width:300px;height:110px;border-radius:26px;background:linear-gradient(#E9E7E3,#BDB9B2);box-shadow:0 6px 12px rgba(46,42,38,0.25);z-index:2;"></span>
  <span style="position:absolute;left:50%;top:50px;transform:translateX(-50%);width:120px;height:40px;border-radius:20px;background:#C89E6C;z-index:3;"></span>
  <img src="${src}" style="display:block;width:${w}px;background:#fff;border-radius:4px;box-shadow:0 2px 6px rgba(46,42,38,0.15);">
</div>`
// Round fridge magnets.
const magnet = (x, y, col) => `<span style="position:absolute;left:${x}px;top:${y}px;width:96px;height:96px;border-radius:50%;background:${col};box-shadow:0 8px 16px rgba(46,42,38,0.22), inset 0 -8px 0 rgba(0,0,0,0.08);z-index:6;"></span>`
// Flat icons for the formats cards.
const ICON = {
  paper: `<svg viewBox="0 0 60 60" width="84" height="84"><path d="M16 6h20l12 12v36H16z" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M36 6v12h12" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M23 30h18M23 38h18M23 46h11" stroke="${C.gold}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  ink: `<svg viewBox="0 0 60 60" width="84" height="84"><path d="M30 6 C 40 20, 47 29, 47 38 a17 17 0 0 1 -34 0 C 13 29, 20 20, 30 6z" fill="${C.butter}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 60 60" width="84" height="84"><rect x="17" y="5" width="26" height="50" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><path d="M26 47h8" stroke="${C.gold}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  sticker: `<svg viewBox="0 0 60 60" width="84" height="84"><circle cx="30" cy="30" r="23" fill="${C.butter}" stroke="${C.ink}" stroke-width="3.5"/><path d="M20 31 L27 38 L41 23" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}
const fr = (name, bg, inner, centre = false) => `<div class="frame" data-name="${name}" style="background:${bg};${centre ? 'justify-content:center;padding-bottom:220px;' : ''}">${inner}<div class="foot">Instant download · Guided Childhood</div></div>`
const out = []

// 1 · Cover.
const head = L.headSize ? Math.round(L.headSize * 0.95) : 140
const cover = L.coverCards
  ? L.coverCards.map((n, i) => `<img class="paper" src="${card(n)}" style="position:absolute;z-index:${2 + i};right:${[640, 90, 340][i]}px;top:${[470, 470, 330][i]}px;width:560px;border-radius:30px;transform:rotate(${[-8, 7, -1][i]}deg);">`).join('') + tape(1180, 300, 260, -6)
  : LAYOUT === 'stack'
    ? `<img class="paper" src="${pv(L.cover[1])}" style="position:absolute;z-index:2;right:430px;top:470px;width:600px;transform:rotate(-6deg);">
       <img class="paper" src="${pv(L.cover[0])}" style="position:absolute;z-index:3;right:110px;top:300px;width:820px;transform:rotate(4deg);">
       ${tape(1270, 268, 300, 6)}`
    : LAYOUT === 'clipboard-left'
      ? `<img class="paper" src="${pv(L.cover[1])}" style="position:absolute;z-index:2;left:30px;top:470px;width:640px;transform:rotate(-9deg);">
         ${clipboard(pv(L.cover[0]), 'position:absolute;z-index:3;left:110px;top:250px;transform:rotate(-3deg);', 840)}`
      : `<img class="paper" src="${pv(L.cover[1])}" style="position:absolute;z-index:2;right:30px;top:470px;width:640px;transform:rotate(9deg);">
         ${clipboard(pv(L.cover[0]), 'position:absolute;z-index:3;right:110px;top:250px;transform:rotate(3deg);', 840)}`
// The words sit on the side the product is not on.
const left = LAYOUT === 'clipboard-left' && !L.coverCards
const textX = left ? 1090 : 130
out.push(`<div class="frame" data-name="01-cover" style="padding:0;display:block;background:${T.bg[0]};">
  <div style="position:absolute;${left ? 'left' : 'right'}:-160px;top:180px;width:1260px;height:1380px;border-radius:640px 640px 120px 120px;background:${C.butter};opacity:0.55;z-index:0;"></div>
  ${dot(left ? 1860 : 110, 1460, 26, C.butter)}${dot(left ? 90 : 1880, 120, 34, C.blush)}${dot(960, 140, 20, C.sage)}
  ${spark(left ? 1080 : 840, left ? 1180 : 300, 70)}${spark(left ? 60 : 1830, 1280, 90, C.gold, 12)}${spark(left ? 1820 : 150, left ? 300 : 1180, 54, C.gold, -10)}
  <div style="position:absolute;left:${textX}px;top:130px;z-index:5;">${wordmark(30)}</div>
  <div style="position:absolute;left:${textX}px;top:300px;z-index:5;width:${left ? 780 : 820}px;">
    <span class="tag fit" style="white-space:nowrap;display:inline-block;max-width:100%;">${L.eyebrow}</span>
    <div class="serif fit" style="font-size:${head}px;line-height:1.0;margin-top:48px;color:${C.ink};">${L.headline}</div>
    <div style="font-weight:600;font-size:46px;color:${C.soft};margin-top:44px;line-height:1.35;">${L.sub}</div>
    <div class="hand" style="font-size:78px;color:${C.gold};margin-top:56px;transform:rotate(-4deg);transform-origin:left;">${L.note || 'instant download!'}</div>
  </div>
  ${left ? arrow(870, 1020, 220, 6, true) : arrow(700, 1020, 220, -6)}
  ${cover}
  <div style="position:absolute;left:130px;right:130px;bottom:250px;z-index:8;background:#fff;border-radius:999px;box-shadow:0 14px 40px rgba(46,42,38,0.10);display:flex;justify-content:space-around;align-items:center;padding:34px 40px;">
    ${(L.coverTicks || ['Print at home', 'A4 + US Letter', 'Ink friendly']).map(t => `<span style="display:flex;align-items:center;gap:18px;font-weight:800;font-size:40px;">${tick}${t}</span>`).join('')}
  </div>
</div>`)

// 1b · On the fridge: the hero page held by magnets on a flat fridge door,
// the in use photo every best selling chart listing carries.
const fridgePage = L.fridgePage || (L.cover && L.cover[0])
if (fridgePage) out.push(`<div class="frame" data-name="01b-on-the-fridge" style="padding:0;display:block;background:${T.bg[7]};">
  <div style="position:absolute;left:280px;top:110px;width:1440px;height:2100px;border-radius:70px;background:linear-gradient(90deg,#F7F7F4,#EDEDE8);box-shadow:0 30px 80px rgba(46,42,38,0.16);"></div>
  <span style="position:absolute;left:370px;top:330px;width:46px;height:640px;border-radius:23px;background:linear-gradient(90deg,#D9D8D2,#C4C2BB);box-shadow:0 8px 16px rgba(46,42,38,0.16);"></span>
  <img class="paper" src="${pv(fridgePage)}" style="position:absolute;left:560px;top:300px;width:1020px;transform:rotate(-1.5deg);z-index:5;">
  ${magnet(640, 250, C.butter)}${magnet(1450, 230, '#B9D3C2')}
  <span style="position:absolute;left:1480px;top:1530px;width:330px;padding:34px 30px;background:#FFF3B0;transform:rotate(5deg);box-shadow:0 14px 26px rgba(46,42,38,0.16);z-index:7;" class="hand"><span style="font-size:58px;line-height:1.05;color:${C.ink};">${L.fridgeNote || 'proud of you!'}</span></span>
  ${spark(150, 260, 80, '#fff')}${spark(1830, 760, 70, C.gold, 15)}
  <div class="hand" style="position:absolute;left:120px;bottom:300px;z-index:8;font-size:96px;color:${C.ink};transform:rotate(-6deg);width:560px;line-height:1;">${L.fridgeLine || 'lives on the fridge all week'}</div>
</div>`)

// 2 · What is inside: every page, as rendered.
const cols = L.pages.length > 10 ? 7 : L.pages.length > 8 ? 5 : 4
out.push(fr('02-whats-inside', T.bg[1], `
  ${spark(190, 170, 60)}${spark(1740, 220, 80, C.gold, 15)}
  <span class="tag" style="background:#fff;">What's inside</span>
  <h1>${L.insideTitle || `${L.pageCount} pages, ready to print`}</h1>
  ${L.insideCards ? `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:34px;margin-top:80px;width:1700px;">
    ${L.insideCards.map((n, i) => `<img class="paper" src="${card(n)}" style="width:100%;border-radius:20px;transform:rotate(${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg);">`).join('')}
  </div>` : `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:40px;margin-top:90px;width:${cols === 4 ? 1500 : 1760}px;align-items:start;">
    ${L.pages.map((n, i) => `<img class="paper" src="${pv(n)}" style="width:100%;border-radius:4px;transform:rotate(${[-1.5, 1, -0.5, 1.5, -1, 0.5, 1.2][i % 7]}deg);">`).join('')}
  </div>`}
  <div style="display:flex;gap:26px;margin-top:80px;flex-wrap:wrap;justify-content:center;">
    ${L.chips.map(c => `<span class="chip">${c}</span>`).join('')}
  </div>`, true))

// 3 · A page close up, with what it does.
const K = L.closeUp
out.push(fr('03-close-up', T.bg[2], `
  ${spark(1780, 160, 70)}${spark(120, 1700, 60, C.gold, 20)}
  <div style="display:flex;gap:100px;align-items:center;height:100%;width:100%;">
    ${K.card ? `<div style="position:relative;width:960px;height:1100px;flex-shrink:0;">
      <img class="paper" src="${card(K.card, 'back')}" style="position:absolute;left:330px;top:120px;width:620px;border-radius:32px;transform:rotate(5deg);">
      <img class="paper" src="${card(K.card)}" style="position:absolute;left:0;top:40px;width:620px;border-radius:32px;transform:rotate(-4deg);">
    </div>` : `<div style="position:relative;flex-shrink:0;">${tape(330, -30, 300, -3)}<img class="paper" src="${pv(K.page)}" style="width:960px;transform:rotate(-2deg);"></div>`}
    <div style="flex:1;">
      <span class="tag" style="background:#fff;">${K.eyebrow}</span>
      <div class="serif" style="font-size:100px;line-height:1.04;margin-top:34px;">${K.title}</div>
      <div style="display:flex;flex-direction:column;gap:46px;margin-top:70px;">
        ${K.points.map(([a, b], i) => `<div style="display:flex;gap:30px;align-items:flex-start;">
          <span class="serif" style="flex-shrink:0;width:92px;height:92px;border-radius:50%;background:${C.butter};display:flex;align-items:center;justify-content:center;font-size:56px;">${i + 1}</span>
          <div><div style="font-weight:800;font-size:44px;line-height:1.2;">${a}</div><div style="font-weight:600;font-size:38px;color:${C.soft};line-height:1.3;margin-top:6px;">${b}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>`))

// 4 · The Passport sticker: the pack's last page, as rendered.
if (!L.noSticker) out.push(fr('04-passport-sticker', T.bg[3], `
  ${spark(140, 150, 70)}${spark(1780, 1520, 90, C.gold, 14)}
  <span class="tag">The Guided Childhood Passport</span>
  <h1>Do it, tick it,<br>stick it on</h1>
  <div class="sub">${L.stickerLine || `Your ${L.noun} comes with its own sticker for the ${L.stage} page.`}</div>
  <div style="position:relative;margin-top:80px;transform:rotate(1.5deg);">${tape(520, -28, 300, 2)}<div class="paper" style="width:1360px;height:880px;overflow:hidden;"><img src="${pv(L.pageCount)}" style="width:1360px;display:block;"></div></div>
  <div class="hand" style="font-size:74px;margin-top:70px;transform:rotate(-2deg);">${L.stickerNote || 'cut it out and stick it in your Passport'}</div>`))

// 5 · Formats.
const formats = [['A4', `Full colour PDF, ${L.pageCount} pages`, 'paper'], ['US Letter', 'Sized for Letter paper, nothing cut off', 'paper'], ['Ink friendly', 'The same pages, light on ink', 'ink']]
formats.push(L.phone ? ['Phone', `${L.phoneCount || L.phone.length} screens, 1080 by 1920`, 'phone'] : [...(L.fourth || ['Sticker page', 'Your Passport sticker, last page']), 'sticker'])
out.push(fr('05-formats', T.bg[4], `
  ${spark(170, 210, 70, '#fff')}${spark(1730, 1500, 90, '#fff', 18)}
  <span class="tag" style="background:#fff;">Instant download</span>
  <h1>Every format you need</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:110px;width:1500px;">
    ${formats.map(([a, b, ic]) => `<div style="background:#fff;border-radius:36px;box-shadow:0 18px 44px rgba(46,42,38,0.10);padding:56px 60px 64px;">${ICON[ic] || ICON.paper}<div class="serif" style="font-size:86px;line-height:1;margin-top:20px;">${a}</div><div style="font-weight:600;font-size:40px;color:${C.soft};margin-top:20px;line-height:1.3;">${b}</div></div>`).join('')}
  </div>
  <div class="hand" style="font-size:76px;color:${C.ink};margin-top:100px;transform:rotate(-2deg);">${L.formatsFoot || 'Nothing is posted. Print as often as you like.'}</div>`, true))

// 6 · How it works.
out.push(fr('06-how-it-works', T.bg[5], `
  ${spark(200, 190, 60)}${spark(1720, 200, 80, C.gold, 10)}
  <span class="tag">How it works</span>
  <h1>${L.stepsTitle}</h1>
  <div style="display:flex;gap:40px;margin-top:130px;width:100%;">
    ${L.steps.map(([a, b], i) => `<div style="flex:1;background:${i + 1 === L.steps.length ? C.butter : '#fff'};border-radius:36px;box-shadow:0 16px 40px rgba(46,42,38,0.08);padding:60px 36px;text-align:center;min-height:600px;display:flex;flex-direction:column;align-items:center;">
      <span class="serif" style="width:120px;height:120px;border-radius:50%;background:${i + 1 === L.steps.length ? '#fff' : C.butter};display:flex;align-items:center;justify-content:center;font-size:70px;">${i + 1}</span>
      <div class="serif" style="font-size:${a.length > 7 ? 64 : 76}px;margin-top:34px;line-height:1.05;">${a}</div>
      <div style="font-weight:600;font-size:40px;color:${C.soft};line-height:1.3;margin-top:24px;">${b}</div>
    </div>`).join('')}
  </div>
  <div class="hand" style="font-size:74px;color:${C.ink};margin-top:100px;text-align:center;transform:rotate(-1.5deg);">${L.stepsFoot}</div>`, true))

// 7 · Phone version, where the pack has one.
if (L.phone) out.push(fr('07-phone-version', T.bg[6], `
  ${spark(210, 220, 70, '#fff')}${spark(1700, 1560, 90, C.gold, 15)}
  <span class="tag" style="background:#fff;">Phone version included</span>
  <h1>${L.phoneTitle || 'On the fridge and<br>on the phone'}</h1>
  <div style="display:flex;gap:64px;margin-top:100px;">
    ${L.phone.map((n, i, a) => `<div style="width:470px;height:836px;border-radius:64px;background:${C.ink};padding:16px;box-shadow:0 30px 60px rgba(46,42,38,0.18);transform:rotate(${a.length === 2 ? [-3, 3][i] : [-4, 0, 4][i]}deg);"><img src="../phone/${n}.png" style="width:100%;height:100%;border-radius:50px;display:block;"></div>`).join('')}
  </div>`))

document.body.insertAdjacentHTML('beforeend', out.join('\n'))
// Shrink any headline or tag that would spill past its column, so a long
// product name never runs under the pages.
document.querySelectorAll('.fit').forEach(el => {
  let s = parseFloat(getComputedStyle(el).fontSize)
  while (el.scrollWidth > el.clientWidth + 1 && s > 24) { s -= 2; el.style.fontSize = s + 'px' }
})
})()
