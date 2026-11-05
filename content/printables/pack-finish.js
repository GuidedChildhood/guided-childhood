// The last page of every pack the Passport names: the pack's own Passport
// sticker, then the free gift at guidedchildhood.com/etsy-bonus.
//
// Justin, 5 November 2026: the Passport is the system. Its stage pages name
// these packs in a "Go further" strip, a family does the pack, ticks it on
// the page and sticks the pack's sticker on. So every pack ends with that
// sticker, for the page (or pages) it sits on in the pack map
// (plans/2026-11-05-passport-system-plan.md).
//
// The stage colours, inks and soft grounds are the Passport's own
// (passport-data.js, from lib/pathway/passport-print-style.ts), so a sticker
// matches the page it lands on. The art is the approved cutouts, copied into
// each pack's images/ folder.
//
// THE GIFT IS WHAT /etsy-bonus REALLY GIVES. That page hands every printable
// buyer the Starter Pack for an email (app/(marketing)/etsy-bonus/page.tsx).
// The packs used to promise an animated breathing pause, a mini lesson and a
// chart, none of which the page gives. A Starter Pack buyer already has the
// pack, so their line offers a copy kept in their inbox to reprint.
//
// Usage, in a pack's print.html, where its last sheet goes:
//   <div class="sheet" data-finish='{"pack":"The Calm Down Corner Kit","noun":"kit","pages":[["pebble","talk"]]}'></div>
//   <script src="../pack-finish.js"></script>
// Optional: "gift":"copy" for the Starter Pack, "thanks" for the review line.
// For a pack on three or more pages (Say This sits on all five): "where"
// replaces the list of pages, "each" replaces the tick and stick sentence,
// and the stickers go in one column per page. "app" adds one line about the
// app above the gift: what it holds, never a link or a price (Etsy rules).
(() => {
const STAGES = {
  pebble: { friend: 'Pebble', ages: '4 to 7', colour: '#EDC35F', ink: '#7A5A0E', soft: '#FBEED0' },
  bloop: { friend: 'Bloop', ages: '8 to 10', colour: '#2F8F6B', ink: '#3F5E1E', soft: '#E4F0D4' },
  orbit: { friend: 'Orbit', ages: '11 to 12', colour: '#2E6F8E', ink: '#1F4E6E', soft: '#DCEBF7' },
  nova: { friend: 'Nova', ages: '13 to 15', colour: '#7A5CC0', ink: '#4A2F73', soft: '#ECE3F7' },
  cosmo: { friend: 'Cosmo', ages: '16 and up', colour: '#D4600A', ink: '#8F4A12', soft: '#FBE4D0' },
}
const PART = { talk: 'the talk', doing: 'the doing', check: 'the check' }

const css = `
  .pf-mono{font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;}
  .pf-cut{border:0.35mm dashed rgba(26,26,46,0.45);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .pf-card{background:#fff;border:2.5px solid #1A1A2E;border-radius:16px;box-shadow:0 5px 0 #1A1A2E;}
  body.ink .pf-fill{fill:#fff !important;}
  body.ink .pf-flood{background:#fff !important;}
  body.ink .pf-card{box-shadow:none;}
`
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)

const arc = (id, d, txt, fill, size) => `<path id="${id}" d="${d}" fill="none"/>
  <text font-family="IBM Plex Mono" font-weight="600" font-size="${size}" letter-spacing="${(size * 0.2).toFixed(2)}" fill="${fill}" text-anchor="middle"><textPath href="#${id}" startOffset="50%">${txt}</textPath></text>`
// Arc text shrinks to fit: the top arc is about 116 units long and a mono
// capital takes about 0.8 of its size with the tracking.
const fit = (txt, room) => Math.min(6.6, room / (txt.length * 0.8)).toFixed(2)

let uid = 0
const bigSticker = (s, pack, d) => {
  const id = 'pf' + uid++
  const top = pack.toUpperCase().replace(/^THE /, '')
  const bottom = `${s.friend.toUpperCase()} PAGE · ${s.ages.toUpperCase()}`
  return `<div class="pf-cut" style="width:${d + 4}mm;height:${d + 4}mm;">
    <svg viewBox="0 0 100 100" style="width:${d}mm;height:${d}mm;transform:rotate(-6deg);">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="${s.colour}" stroke-width="3.2" class="pf-fill"/>
      <circle cx="50" cy="50" r="30.5" fill="${s.soft}" stroke="${s.colour}" stroke-width="0.8" stroke-dasharray="1.6 1.4" class="pf-fill"/>
      ${arc(id + 't', 'M 13 50 A 37 37 0 0 1 87 50', top, s.ink, fit(top, 112))}
      ${arc(id + 'b', 'M 11 50 A 39 39 0 0 0 89 50', bottom, s.ink, fit(bottom, 118))}
      <circle cx="12.5" cy="50" r="1.3" fill="${s.colour}"/><circle cx="87.5" cy="50" r="1.3" fill="${s.colour}"/>
      <image href="images/friends/${s.key}.png" x="30" y="21" width="40" height="40"/>
      <text x="50" y="70.5" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="7" fill="${s.ink}">We did it</text>
    </svg></div>`
}
const smallSticker = (s, d) => `<div class="pf-cut" style="width:${d + 2}mm;height:${d + 2}mm;">
    <svg viewBox="0 0 100 100" style="width:${d}mm;height:${d}mm;">
      <circle cx="50" cy="50" r="46" fill="${s.soft}" stroke="${s.colour}" stroke-width="7" class="pf-fill"/>
      <image href="images/friends/${s.key}.png" x="14" y="10" width="72" height="72"/>
      <circle cx="78" cy="76" r="15" fill="#EDC35F" stroke="#fff" stroke-width="3" class="pf-fill"/>
      <path d="M71 76 l5 5 l9 -10" fill="none" stroke="#1A1A2E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></div>`

const finish = (el, o) => {
  const pages = o.pages.map(([key, part]) => ({ ...STAGES[key], key, part }))
  const page = p => `the ${p.friend} page (ages ${p.ages})`
  let where = pages.every(p => p.part === pages[0].part)
    ? `${pages.map(page).join(' or ')}, under ${PART[pages[0].part]}`
    : pages.map(p => `${page(p)}, under ${PART[p.part]}`).join(', or ')
  if (o.where) where = o.where
  const one = pages.length === 1
  const many = pages.length > 2
  const gift = o.gift === 'copy'
    ? `Pop your email in at the address below and we will keep a copy of this pack in your inbox, so it is always there to print again, plus a short, warm welcome from me.`
    : `As a thank you, the full Guided Childhood Starter Pack is yours free: the star chart, the jobs that earn the stars, and a whole booklet of things to do away from a screen. Pop your email in at the address below and it is yours.`

  el.innerHTML = `
  <div class="pf-mono" style="font-size:8.5pt;color:#C99A28;margin-top:2mm;">The Guided Childhood Passport</div>
  <div style="font-weight:900;font-size:26pt;line-height:1.05;letter-spacing:-0.4px;margin-top:2.5mm;color:#1A1A2E;">Your Passport sticker${one ? '' : 's'}</div>
  <p style="margin-top:3mm;font-size:10.5pt;line-height:1.55;color:#52526A;max-width:170mm;">
    ${o.pack} belongs on ${where}, in the Guided Childhood Passport. ${o.each || `When your family has used the ${o.noun}, tick it in the Go further strip on that page, then cut out the sticker and stick it on.`} The big one fits the stage page and the small one fits the fold out passport.
  </p>
  <div class="pf-card pf-flood" style="margin-top:6mm;padding:6mm 6mm 5mm;background:#FFFCF3;display:flex;flex-direction:column;gap:5mm;">
    ${many
      ? `<div style="display:flex;justify-content:space-between;">${pages.map(p => `<div style="display:flex;flex-direction:column;align-items:center;gap:3mm;">${bigSticker(p, o.pack, 30)}${smallSticker(p, 15)}</div>`).join('')}</div>`
      : pages.map(p => `<div style="display:flex;align-items:center;justify-content:space-around;">
      ${bigSticker(p, o.pack, one ? 58 : 46)}${smallSticker(p, one ? 24 : 20)}${smallSticker(p, one ? 24 : 20)}
    </div>`).join('')}
    <div class="pf-mono" style="font-size:6.5pt;color:#8888A0;text-align:center;">Print this page on sticker paper, or on plain paper with a glue stick</div>
  </div>
  ${o.app ? `<p style="margin-top:4mm;font-size:10.5pt;line-height:1.55;color:#1A1A2E;font-weight:700;">${o.app}</p>` : ''}
  <p style="margin-top:4mm;font-size:9.5pt;line-height:1.5;color:#52526A;">No Passport yet? Look for the Guided Childhood Passport in the same Etsy shop: five stage pages for ages 4 to 16, each one stamped when the talk, the doing and the check are done.</p>

  <div style="margin-top:auto;border-top:0.35mm dashed rgba(26,26,46,0.3);padding-top:6mm;display:flex;gap:7mm;align-items:center;">
    <img src="images/DiGi-star-3d.png" alt="DiGi, the golden star" style="width:30mm;height:30mm;flex-shrink:0;">
    <div>
      <div class="pf-mono" style="font-size:8pt;color:#C99A28;">A free gift for your family</div>
      <p style="margin-top:2mm;font-size:10.5pt;line-height:1.55;color:#52526A;">${gift}</p>
      <div class="pf-card pf-flood" style="display:inline-block;margin-top:4mm;padding:3mm 7mm;background:#FFF6DE;box-shadow:0 4px 0 #1A1A2E;">
        <span class="pf-mono" style="font-size:12pt;letter-spacing:1px;text-transform:none;color:#1A1A2E;">guidedchildhood.com/etsy-bonus</span>
      </div>
    </div>
  </div>
  <p style="margin-top:6mm;margin-bottom:6mm;font-size:9pt;line-height:1.5;color:#52526A;">Made by Justin at Guided Childhood, a dad who got tired of the screen time fight. ${o.thanks}</p>
  <div class="footer"><span>guidedchildhood.com</span><span>Thank you · Justin, DiGi and the Planet Friends</span></div>`
}

document.querySelectorAll('[data-finish]').forEach(el => finish(el, JSON.parse(el.dataset.finish)))
})()
