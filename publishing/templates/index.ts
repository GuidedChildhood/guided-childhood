// THE PAGE TEMPLATES.
//
// One function per template named in schema.ts. Each takes a page of the issue
// and the render context and returns that page's HTML. The layout lives here
// and only here: an issue file names a template and fills its fields, so the
// second edition (and the twentieth) is a new JSON file, not a new layout.
//
// Every text container that could overflow carries class "frame" so the
// validator can measure it. Nothing here hard codes an issue's words.

import { DESTINATIONS, PAGE_COUNT, type Activity, type ArtSlot, type Destination, type FriendRef, type Issue, type Page } from '../engine/schema'
import { blocks, citeMap, esc, pad3, plain, refsBox, rich, type CiteMap } from '../engine/html'
import { ART, emblem, icon } from './art'

export type RenderContext = {
  issue: Issue
  friendSrc: (f: FriendRef) => string                 // a URL the browser can load
  approvedArt: (slot: string) => string | null        // an approved generated picture, if any
  qr: (url: string) => string                         // the QR as inline SVG
  ink: boolean                                        // the print friendly ink saver
}

const destTag = (d: Destination) =>
  `<span class="dest dest-${d}">${emblem(d)}${esc(DESTINATIONS[d].name)}</span>`

function runhead(ctx: RenderContext, label: string) {
  const i = ctx.issue
  return `<header class="runhead"><span class="mark">${planetGlyph(12)} The Guided Planet</span><span>${esc(label)}</span><span>Issue ${pad3(i.number)} · ${esc(i.month)}</span></header>`
}

function folio(ctx: RenderContext, n: number, d?: Destination) {
  return `<footer class="folio"><span>${d ? esc(DESTINATIONS[d].name) : esc(ctx.issue.edition)}</span><span class="num">${n}</span><span>Page ${n} of ${PAGE_COUNT}</span></footer>`
}

const groundFor = (d: Destination | undefined, ctx: RenderContext) => {
  if (ctx.ink) return 'ground-paper'
  switch (d) {
    case 'observatory': return 'ground-night'
    case 'maker': return 'ground-butter'
    case 'forest': return 'ground-sage'
    case 'garden': return 'ground-sage'
    case 'research': return 'ground-blue'
    default: return ''
  }
}

function pageShell(ctx: RenderContext, p: Page, inner: string, opts: { ground?: string; head?: string; noFolio?: boolean } = {}) {
  const d = 'destination' in p ? p.destination : undefined
  const ground = opts.ground ?? groundFor(d, ctx)
  const label = p.template === 'cover' ? 'Cover' : ('headline' in p ? plain(p.headline) : '')
  return `<section class="page ${ground}" data-page="${p.n}" data-template="${p.template}" aria-label="Page ${p.n}: ${esc(label)}">
  <div class="trim">
    ${ctx.issue.sample ? '<div class="sample-mark" aria-hidden="true"></div>' : ''}
    <div class="safe">${opts.head ?? ''}${inner}</div>
    ${opts.noFolio ? '' : folio(ctx, p.n, d)}
  </div>
</section>`
}

// The paper's mark: a small round planet with a gold ring. The back of the
// ring is drawn first and the front last, so the ring really goes round.
export function planetGlyph(size = 14, ring = '#EDC35F') {
  const e = 'transform="rotate(-20 16 16)"'
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M1.5 16 A14.5 4.8 0 0 1 30.5 16" ${e} fill="none" stroke="#1A1A2E" stroke-width="4.2" stroke-linecap="round"/>
    <path d="M1.5 16 A14.5 4.8 0 0 1 30.5 16" ${e} fill="none" stroke="${ring}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="16" r="8.6" fill="#C9DBD2" stroke="#1A1A2E" stroke-width="1.8"/>
    <path d="M10.4 12.6 C 13 11.4, 15.6 13.6, 18.6 12.2" fill="none" stroke="#8FB3A2" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M30.5 16 A14.5 4.8 0 0 1 1.5 16" ${e} fill="none" stroke="#1A1A2E" stroke-width="4.2" stroke-linecap="round"/>
    <path d="M30.5 16 A14.5 4.8 0 0 1 1.5 16" ${e} fill="none" stroke="${ring}" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`
}

function art(ctx: RenderContext, a: ArtSlot, style: string, w?: number, h?: number) {
  const approved = ctx.approvedArt(a.slot)
  if (approved) return `<figure class="art" style="${style}" data-slot="${esc(a.slot)}" data-source="approved"><img src="${approved}" alt="${esc(a.alt)}"></figure>`
  const draw = a.vector ? ART[a.vector] : undefined
  if (!draw) throw new Error(`art slot ${a.slot} has no approved file and no vector default`)
  let svg = draw(w, h)
  if (ctx.ink) svg = inkSaver(svg)
  return `<figure class="art" style="${style}" data-slot="${esc(a.slot)}" data-source="vector" role="img" aria-label="${esc(a.alt)}">${svg}</figure>`
}

// The ink saver: dark skies become paper, and their stars become ink. Line
// and fill colours that already print light stay as they are.
function inkSaver(svg: string) {
  return svg
    .replace(/fill="url\(#night\)"/g, 'fill="#FFFFFF"')
    .replace(/fill="url\(#glow\)"/g, 'fill="none"')
    .replace(/<rect width="(\d+)" height="(\d+)" fill="#(1A1A2E|2E2818)"\/>/g, '<rect width="$1" height="$2" fill="#FFFFFF"/>')
    .replace(/fill="#F9F8F6" opacity/g, 'fill="#8A8FA3" opacity')
    .replace(/fill="#FFF6DE" opacity/g, 'fill="#8A8FA3" opacity')
    .replace(/fill="#3E86BC"/g, 'fill="#DCEBF7"')
    .replace(/fill="#14142A"/g, 'fill="#FFFFFF"')
}

function friend(ctx: RenderContext, f: FriendRef, size: string, extra = '') {
  return `<img class="friend-img" src="${ctx.friendSrc(f)}" alt="" style="width:${size};height:${size};${extra}" data-friend="${f.id}-${f.pose}">`
}

function says(ctx: RenderContext, f: FriendRef | undefined, text: string | undefined, cites?: CiteMap, size = '25mm') {
  if (!f || !text) return ''
  const name = f.id === 'digi' ? 'DiGi' : f.id[0].toUpperCase() + f.id.slice(1)
  return `<div class="friend-says">${friend(ctx, f, size)}<p class="bubble frame"><span class="who">${esc(name)} says</span>${rich(text, cites)}</p></div>`
}

// ── ACTIVITIES ──────────────────────────────────────────────────────────────

function activity(a: Activity, cites?: CiteMap, compact = false): string {
  const head = (offline = true) => `<div style="display:flex;align-items:center;gap:2.5mm;margin-bottom:2mm"><span class="tag">${icon('pencil', 11)} Activity</span>${offline ? '<span class="tag offline">No screen needed</span>' : ''}</div>`
  switch (a.kind) {
    case 'pixel-grid':
      return `<div class="activity" data-activity="pixel-grid">
        ${head()}
        <div style="display:grid;grid-template-columns:${compact ? '44mm' : '62mm'} 1fr;gap:5mm;align-items:start">
          <div><div class="pixgrid" aria-label="An empty 8 by 8 grid to colour">${'<span></span>'.repeat(64)}</div>
          <p class="small mono" style="margin-top:1.5mm;font-size:6.6pt;letter-spacing:.06em">64 SQUARES · 8 ACROSS · 8 DOWN</p></div>
          <div class="frame"><h3 class="h3">${rich(a.title, cites)}</h3><p class="small" style="margin-top:1.2mm;color:var(--ink)">${rich(a.intro, cites)}</p>
            <ol class="steps">${a.steps.map(s => `<li>${rich(s, cites)}</li>`).join('')}</ol>
            <div class="swatches">${a.palette.map(c => `<span class="swatch"><i style="background:${c.hex}"></i>${esc(c.name)}</span>`).join('')}</div>
          </div>
        </div>
      </div>`
    case 'blueprint':
      return `<div class="activity blueprint" data-activity="blueprint" style="flex:1;display:flex;flex-direction:column;padding:0;overflow:hidden;border-style:solid;border-width:.5mm">
        <div style="padding:4mm 4.5mm 3mm;border-bottom:.35mm solid var(--ink);background:var(--paper)">${head()}<h3 class="h2">${rich(a.title, cites)}</h3><p class="small" style="margin-top:1.2mm;color:var(--ink)">${rich(a.intro, cites)}</p></div>
        <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:0;background:
          linear-gradient(#DCE6F2 .25mm, transparent .25mm) 0 0/5mm 5mm, linear-gradient(90deg, #DCE6F2 .25mm, transparent .25mm) 0 0/5mm 5mm, #F7FAFD">
          ${a.prompts.map((pr, i) => `<div class="frame" style="padding:3mm 3.5mm;border-right:${i % 2 === 0 ? '.3mm dashed #9AA9C2' : '0'};border-bottom:.3mm dashed #9AA9C2;${i === 0 ? 'grid-column:span 2;' : ''}">
            <p class="mono" style="font:700 6.8pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--grey-blue-ink)">${String(i + 1).padStart(2, '0')} · ${esc(pr.label)}</p>
            <p class="small" style="margin-top:1mm">${rich(pr.hint, cites)}</p></div>`).join('')}
        </div>
      </div>`
    case 'postcard':
      return `<div class="activity" data-activity="postcard" style="padding:0;border-width:.5mm">
        <div style="display:grid;grid-template-columns:1fr 1fr;min-height:58mm">
          <div style="padding:3.5mm 4mm;border-right:.35mm dashed var(--ink-muted);display:flex;flex-direction:column">
            ${head()}<h3 class="h3">${rich(a.title, cites)}</h3><p class="small frame" style="margin-top:1mm;color:var(--ink)">${rich(a.intro, cites)}</p>
            <div style="flex:1;margin-top:2.5mm;border:.35mm dashed #B9B5AB;border-radius:10px;display:flex;align-items:center;justify-content:center;min-height:20mm"><span class="small mono" style="font-size:6.6pt;letter-spacing:.1em;text-transform:uppercase">${esc(a.front)}</span></div>
          </div>
          <div style="padding:3.5mm 4mm;position:relative">
            <div style="position:absolute;right:4mm;top:3.5mm;width:15mm;height:18mm;border:.4mm dashed var(--ink-muted);border-radius:2mm;display:flex;align-items:center;justify-content:center">${icon('heart', 18)}</div>
            <p class="mono" style="font:700 6.6pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)">Dear</p>
            <div class="lines" style="gap:6mm;padding-top:5mm;margin-right:20mm">${'<i></i>'.repeat(2)}</div>
            <div class="lines" style="gap:6mm;padding-top:6mm">${'<i></i>'.repeat(3)}</div>
            <p class="small" style="margin-top:2mm;font-size:7.6pt">${a.lines.map(l => rich(l, cites)).join(' · ')}</p>
          </div>
        </div>
      </div>`
    case 'card-game': {
      const cards = a.cards.map(c => `<div style="border:.4mm solid var(--ink);border-radius:3mm;background:var(--paper);padding:2mm 1.5mm;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1mm">
          ${icon(c.icon, 26)}<span style="font:800 7.6pt/1.1 var(--font-display)">${esc(c.label)}</span><span class="mono" style="font:600 5.6pt/1 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-muted)">${esc(c.topic)}</span></div>`).join('')
      return `<div data-activity="card-game" style="display:grid;grid-template-columns:1fr 1fr;gap:5mm;flex:1;min-height:0">
        <div class="frame" style="display:flex;flex-direction:column;gap:3mm">
          <div class="card" style="background:var(--tint-butter);border-color:var(--deep-gold)">
            <p class="eyebrow">Players · ${esc(a.players)}</p>
            <p class="small" style="color:var(--ink)"><b>You need:</b> ${a.youNeed.map(y => esc(y)).join(', ')}.</p>
          </div>
          <div><h3 class="h3">Set up</h3><ol class="steps">${a.setup.map(s => `<li>${rich(s, cites)}</li>`).join('')}</ol></div>
          <div><h3 class="h3">Play five rounds</h3><ol class="steps">${a.rounds.map(s => `<li>${rich(s, cites)}</li>`).join('')}</ol></div>
          <div class="card"><p class="eyebrow">Then talk about it</p><ul style="margin:0;padding-left:4mm">${a.talk.map(t => `<li class="small" style="color:var(--ink);margin-top:.8mm">${rich(t, cites)}</li>`).join('')}</ul></div>
        </div>
        <div style="display:flex;flex-direction:column;min-height:0">
          <div class="cutline" style="margin-top:0;background:var(--sage)"></div>
          <p class="mono" style="font:700 6.6pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;margin:1mm 0 2mm">Cut out the ${a.cards.length} video cards</p>
          <div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:1fr;gap:2mm;border:.45mm dashed var(--ink-muted);border-radius:4mm;padding:2mm;background:var(--paper)">${cards}</div>
          <div class="card" style="margin-top:3mm;padding:2.5mm 3mm">
            <p class="eyebrow" style="color:var(--ink-soft)">The Algorithm's notebook</p>
            <div style="display:grid;grid-template-columns:22mm repeat(5,1fr);font:600 6.6pt/1 var(--font-mono);text-transform:uppercase;letter-spacing:.06em">
              <span></span>${[1, 2, 3, 4, 5].map(r => `<span style="text-align:center;padding:1mm 0;border-left:.25mm solid var(--rule)">Round ${r}</span>`).join('')}
              ${['Watched', 'Skipped', 'My guess'].map(l => `<span style="padding:2.4mm 0;border-top:.25mm solid var(--rule)">${l}</span>${'<span style="border-top:.25mm solid var(--rule);border-left:.25mm solid var(--rule)"></span>'.repeat(5)}`).join('')}
            </div>
          </div>
        </div>
      </div>`
    }
    case 'week':
      return `<div data-activity="week" style="display:flex;flex-direction:column;flex:1;min-height:0"><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2.4mm;flex:1;min-height:0">
        ${a.days.map((d, i) => `<div class="card frame" style="padding:2.6mm 2.4mm;display:flex;flex-direction:column;gap:1.6mm;${i === 6 ? 'background:var(--tint-butter);border-color:var(--deep-gold)' : ''}">
          <p class="mono" style="font:700 6.4pt/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--gold-ink)">${esc(d.day)}</p>
          <p style="font:900 10.4pt/1.08 var(--font-display)">${rich(d.title, cites)}</p>
          <p style="font:600 7.9pt/1.36 var(--font-body);color:var(--ink-soft)">${rich(d.task, cites)}</p>
          <div class="lines" style="gap:6mm;padding-top:2mm;flex:1;align-content:start" aria-hidden="true">${'<i></i>'.repeat(5)}</div>
          <div style="margin-top:auto;display:flex;flex-direction:column;gap:1.4mm">
            ${d.offline ? '<span class="pill" style="font-size:5.6pt;padding:1mm 1.6mm;text-align:center">Offline</span>' : '<span class="pill" style="font-size:5.6pt;padding:1mm 1.6mm;text-align:center;background:var(--butter)">Together</span>'}
            <span style="display:flex;justify-content:center;gap:1.4mm">${'<i style="width:5mm;height:5mm;border:.35mm solid var(--ink);border-radius:999px;display:inline-block;background:var(--paper)"></i>'.repeat(3)}</span>
          </div>
        </div>`).join('')}
      </div>${a.reflect?.length ? `
      <div class="card" style="margin-top:3.5mm;display:grid;grid-template-columns:repeat(${a.reflect.length},1fr);gap:5mm">
        ${a.reflect.map(r => `<div><p class="eyebrow" style="color:var(--ink)">${rich(r, cites)}</p><div class="lines" style="gap:6.5mm;padding-top:3mm">${'<i></i>'.repeat(3)}</div></div>`).join('')}
      </div>` : ''}</div>`
    case 'passport':
      return `<div data-activity="passport" style="background:var(--passport);color:#F3E3B5;border-radius:6mm;padding:5mm 6mm;position:relative;box-shadow:0 1.6mm 0 #3E1220">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4mm">
          <div><p style="font:700 6.8pt/1 var(--font-mono);letter-spacing:.2em;text-transform:uppercase;color:#E9C977">Planet Passport</p>
            <h3 style="font:900 17pt/1.05 var(--font-display);color:#F7E7B9;margin-top:1.5mm">${rich(a.title, cites)}</h3>
            <p style="font:600 8.8pt/1.38 var(--font-body);color:#F1DDB0;margin-top:1.5mm;max-width:100mm">${rich(a.intro, cites)}</p></div>
          <div style="flex:none;width:30mm;border:.4mm solid #E9C977;border-radius:3mm;padding:2mm;text-align:center">
            <p style="font:600 5.8pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:#E9C977">Explorer</p>
            <div style="border-bottom:.3mm solid #E9C977;height:7mm"></div>
            <p style="font:600 5.4pt/1.2 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:#E9C977;margin-top:1mm">First name only</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(${a.stamps.length},1fr);gap:3mm;margin-top:4mm">
          ${a.stamps.map(s => `<div style="aspect-ratio:1;border:.45mm dashed #E9C977;border-radius:999px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2mm">
            <span style="font:900 7.8pt/1.08 var(--font-display);color:#F7E7B9">${esc(s.label)}</span>
            <span style="font:600 5.4pt/1 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:#E9C977;margin-top:1mm">Page ${s.page}</span></div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:6mm;margin-top:3mm">
          ${['Signed off by a grown up', 'Date'].map(l => `<div><div style="border-bottom:.35mm solid #E9C977;height:7.5mm"></div><p style="font:600 5.8pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:#E9C977;margin-top:1.4mm">${l}</p></div>`).join('')}
        </div>
      </div>`
  }
}

// ── 1. COVER ───────────────────────────────────────────────────────────────

function cover(ctx: RenderContext, p: Extract<Page, { template: 'cover' }>) {
  const i = ctx.issue
  const night = !ctx.ink
  const fg = night ? 'var(--cream)' : 'var(--ink)'
  const inner = `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column">
      <div style="padding:9mm 12mm 0;background:var(--cream)" data-anim="masthead">
        <div style="display:flex;justify-content:space-between;font:600 var(--t-eyebrow)/1 var(--font-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft)">
          <span>A paper from The Guided Digital Childhood</span><span>guidedchildhood.com</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;align-items:end;margin-top:4mm">
          <div>
            <p style="font:900 27pt/1 var(--font-display);letter-spacing:-.01em;color:var(--ink);margin-left:1.2mm">The Guided</p>
            <h1 style="font:900 104pt/.82 var(--font-display);letter-spacing:-.045em;color:var(--ink);margin-top:-1mm">Planet</h1>
          </div>
          <div style="text-align:right;padding-bottom:2.5mm;display:flex;flex-direction:column;align-items:flex-end;gap:3mm">
            ${planetGlyph(68)}
            <p style="font:700 9.2pt/1.3 var(--font-body);color:var(--ink-soft);max-width:52mm">${esc(i.tagline)}</p>
          </div>
        </div>
        <div style="margin-top:4mm;border-top:.7mm solid var(--ink);border-bottom:.3mm solid var(--ink);padding:2mm 0 1.8mm;display:flex;justify-content:space-between;font:600 var(--t-eyebrow)/1 var(--font-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ink)">
          <span>Issue ${pad3(i.number)}</span><span>${esc(i.month)}</span><span>${esc(i.edition)}</span><span>For readers ${esc(i.readingAge)} and their grown ups</span><span>Free</span>
        </div>
      </div>
      <div style="position:relative;flex:1;margin:0 calc(-1 * var(--bleed)) calc(-1 * var(--bleed))">
        <div data-anim="sky" style="position:absolute;inset:0">${art(ctx, p.art, 'position:absolute;inset:0;border-radius:0', 600, 700)}</div>
        <div data-anim="headline" style="position:absolute;left:12mm;top:9mm;width:118mm" data-bg="${night ? '#1A1A2E' : '#FFFFFF'}">
          <h2 style="font:900 44pt/.94 var(--font-display);letter-spacing:-.03em;color:${fg};text-wrap:balance">${esc(p.headline)}</h2>
          <p style="font:600 12.4pt/1.38 var(--font-body);color:${night ? 'rgba(249,248,246,.9)' : 'var(--ink-soft)'};margin-top:4mm;max-width:96mm">${rich(p.deck)}</p>
        </div>
        <div data-anim="friend" style="position:absolute;right:6mm;bottom:41mm">${friend(ctx, p.friend, '78mm')}</div>
        <div data-anim="teasers" style="position:absolute;left:12mm;right:12mm;bottom:12mm;display:grid;grid-template-columns:repeat(${p.teasers.length},1fr);gap:3mm">
          ${p.teasers.map(t => `<div class="frame" style="background:var(--cream);border:.35mm solid var(--ink);border-radius:12px;padding:2.6mm 3mm;box-shadow:0 1.2mm 0 var(--ink)">
            <span style="font:700 6.6pt/1 var(--font-mono);letter-spacing:.14em;color:var(--gold-ink)">PAGE ${t.page}</span>
            <p style="font:800 9pt/1.2 var(--font-display);margin-top:1.2mm;color:var(--ink)">${esc(t.text)}</p></div>`).join('')}
        </div>
      </div>
    </div>`
  return `<section class="page" data-page="1" data-template="cover" aria-label="Page 1: Cover">
  <div class="trim">${i.sample ? '<div class="sample-mark" aria-hidden="true"></div>' : ''}${inner}</div>
</section>`
}

// ── 2. WELCOME ─────────────────────────────────────────────────────────────

function welcome(ctx: RenderContext, p: Extract<Page, { template: 'welcome' }>) {
  const inner = `
    <div class="grid-12 grow" style="row-gap:5mm">
      <div style="grid-column:span 7;display:flex;flex-direction:column">
        <p class="eyebrow">From the editor's desk</p>
        <h1 class="h1">${esc(p.headline)}</h1>
        <div class="body kid frame welcome-letter" style="margin-top:4mm">${blocks(p.letter, undefined, { lead: true })}</div>

        <div style="margin-top:3mm;border-top:.35mm solid var(--ink);padding-top:2mm">
          <p style="font:900 12pt/1.1 var(--font-display)">${esc(p.signoff.name)}</p>
          <p class="mono" style="font:600 var(--t-eyebrow)/1.3 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin-top:1mm">${esc(p.signoff.role)}</p>
        </div>
        ${p.howTo?.length ? `<div class="card frame" style="margin-top:4mm;background:var(--tint-butter);border-color:var(--deep-gold);padding:3mm 3.5mm">
          <p class="eyebrow">How to use this paper</p>
          <ul style="list-style:none;margin:0;padding:0;display:grid;gap:2mm">${p.howTo.map(h => `<li style="display:grid;grid-template-columns:8mm 1fr;gap:2mm;align-items:center;font:700 9pt/1.35 var(--font-body)">${icon(h.icon, 26)}<span>${esc(h.text)}</span></li>`).join('')}</ul>
        </div>` : ''}
      </div>
      <div style="grid-column:span 5;display:flex;flex-direction:column;gap:4mm">
        ${art(ctx, p.map, 'height:84mm', 400, 320)}
        <p class="small mono" style="font-size:6.6pt;letter-spacing:.08em;text-transform:uppercase;margin-top:-2mm">Your map: six places to explore, every issue</p>
        <div class="card frame" style="padding:3mm 3.5mm">
          <p class="eyebrow">Inside this issue</p>
          <ol style="list-style:none;margin:0;padding:0;display:grid;gap:1.25mm">
            ${p.inside.map(x => `<li style="display:grid;grid-template-columns:6mm 5.5mm 1fr;align-items:center;gap:1.6mm;font:700 8.4pt/1.2 var(--font-body)">
              <span class="mono" style="font:700 8pt/1 var(--font-mono);color:var(--gold-ink)">${x.page}</span><span style="width:5.5mm;height:5.5mm">${emblem(x.destination)}</span><span>${esc(x.title)}</span></li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
    <div style="margin-top:4mm" class="welcome-bloop">${says(ctx, p.friend, p.bloopSays, undefined, '42mm')}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, 'Welcome') })
}

// ── FEATURE (used by the space story, the friendship story and more) ───────

function feature(ctx: RenderContext, p: Extract<Page, { template: 'feature' }>) {
  const cites = citeMap(p.refs)
  const facts = p.facts?.length ? `<aside class="facts frame">
      <p class="eyebrow">Fact file</p>
      <dl>${p.facts.map(f => `<div><dt>${rich(f.value, cites)}</dt><dd>${rich(f.label, cites)}${f.note ? `<span class="note">${rich(f.note, cites)}</span>` : ''}</dd></div>`).join('')}</dl>
    </aside>` : p.aside ? `<aside class="card frame" style="background:var(--paper)">
      <p class="eyebrow">${esc(p.aside.label)}</p>
      <ul style="margin:0;padding-left:4mm;display:grid;gap:1.6mm">${p.aside.items.map(i => `<li style="font:700 9pt/1.38 var(--font-body)">${rich(i, cites)}</li>`).join('')}</ul>
    </aside>` : ''
  const inner = `
    ${art(ctx, p.art, `height:${p.artHeight ?? 62}mm;flex:none`, 420, Math.round(420 * (p.artHeight ?? 62) / 186))}
    <div style="margin-top:4.5mm;display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
    <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
    <p class="standfirst">${rich(p.standfirst, cites)}</p>
    <div class="grid-12" style="margin-top:4mm;flex:1;min-height:0">
      <div class="body kid frame cols-2" style="grid-column:span ${facts ? 8 : 12}">${blocks(p.body, cites, { lead: true })}${p.pull ? `<p class="pull">${rich(p.pull, cites)}</p>` : ''}</div>
      ${facts ? `<div style="grid-column:span 4;display:flex;flex-direction:column;gap:3mm">${facts}${says(ctx, p.friend, p.friendSays, cites, '20mm')}</div>` : ''}
    </div>
    ${!facts && p.friend ? `<div style="margin-top:3mm">${says(ctx, p.friend, p.friendSays, cites, '22mm')}</div>` : ''}
    ${p.activity ? `<div style="margin-top:4mm">${activity(p.activity, cites, true)}</div>` : ''}
    <div style="margin-top:3mm">${refsBox(p.refs, ctx.issue.sources)}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, DESTINATIONS[p.destination].short) })
}

// ── SHOWCASE (young inventors) ─────────────────────────────────────────────

function showcase(ctx: RenderContext, p: Extract<Page, { template: 'showcase' }>) {
  const cites = citeMap(p.refs)
  const inner = `
    <div style="display:grid;grid-template-columns:1fr 62mm;gap:5mm;align-items:end">
      <div>
        <div style="display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
        <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
        <p class="standfirst">${rich(p.standfirst, cites)}</p>
      </div>
      ${p.facts?.length ? `<aside class="facts frame" style="padding:3.2mm 4mm"><p class="eyebrow">${esc(p.factsLabel ?? 'Fact file')}</p><dl style="gap:2mm">${p.facts.map(f => `<div><dt style="font-size:15pt">${rich(f.value, cites)}</dt><dd>${rich(f.label, cites)}</dd></div>`).join('')}</dl></aside>` : ''}
    </div>
    ${art(ctx, p.art, 'height:30mm;margin-top:4mm;flex:none', 420, 90)}
    <div class="body kid frame" style="margin-top:4mm">${blocks(p.body, cites)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:3.5mm;margin-top:4mm;flex:1;min-height:0">
      ${p.projects.map(pr => `<article class="card frame" style="display:flex;flex-direction:column;gap:1.6mm">
        <div style="display:flex;align-items:center;gap:2.5mm">${icon(pr.icon, 34)}<div><h2 class="h3" style="font-size:12.4pt">${esc(pr.name)}</h2>
        <p class="mono" style="font:600 6.6pt/1.2 var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin-top:.6mm">By ${esc(pr.maker)} · ${esc(pr.where)}</p></div></div>
        <p style="font:600 9.2pt/1.4 var(--font-body)">${rich(pr.what, cites)}</p>
        <p style="font:700 8.6pt/1.35 var(--font-body);color:var(--gold-ink);margin-top:auto">${rich(pr.why, cites)}</p>
      </article>`).join('')}
    </div>
    <div style="margin-top:3mm">${refsBox(p.refs, ctx.issue.sources)}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, DESTINATIONS[p.destination].short) })
}

// ── ACTIVITY PAGE (design your invention, become the algorithm) ────────────

function activityPage(ctx: RenderContext, p: Extract<Page, { template: 'activity' }>) {
  const cites = citeMap(p.refs)
  const inner = `
    <div style="display:grid;grid-template-columns:1fr auto;gap:4mm;align-items:end">
      <div>
        <div style="display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
        <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
        <p class="standfirst">${rich(p.standfirst, cites)}</p>
      </div>
      ${p.friend ? `<div style="width:66mm">${says(ctx, p.friend, p.friendSays, cites, '24mm')}</div>` : ''}
    </div>
    <div style="margin-top:5mm;flex:1;min-height:0;display:flex;flex-direction:column">${activity(p.activity, cites)}</div>
    ${p.tips?.length ? `<div class="card frame" style="margin-top:3.5mm;display:grid;grid-template-columns:auto 1fr;gap:3mm;align-items:start;padding:3mm 3.6mm">
      <span class="tag" style="display:inline-flex;background:var(--butter);font:700 6.6pt/1 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;padding:1.5mm 2.4mm;border-radius:999px">${esc(p.tipsLabel ?? 'Tips')}</span>
      <ul style="margin:0;padding-left:4mm;display:grid;grid-template-columns:1fr 1fr;column-gap:6mm;row-gap:1mm">${p.tips.map(t => `<li style="font:600 8.4pt/1.36 var(--font-body)">${rich(t, cites)}</li>`).join('')}</ul>
    </div>` : ''}
    ${p.refs.length ? `<div style="margin-top:3mm">${refsBox(p.refs, ctx.issue.sources)}</div>` : ''}`
  return pageShell(ctx, p, inner, { head: runhead(ctx, DESTINATIONS[p.destination].short) })
}

// ── RESEARCH ROOM ──────────────────────────────────────────────────────────

function research(ctx: RenderContext, p: Extract<Page, { template: 'research' }>) {
  const cites = citeMap(p.refs)
  const inner = `
    <div style="display:flex;align-items:center;gap:3mm">${destTag('research')}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
    <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
    <p class="standfirst">${rich(p.standfirst, cites)}</p>
    <div style="display:grid;grid-template-columns:repeat(${p.kinds.length},1fr);gap:3mm;margin-top:4.5mm">
      ${p.kinds.map(k => `<div class="card frame" style="padding:3.2mm;display:flex;flex-direction:column;gap:1.5mm">
        ${icon(k.icon, 30)}<h2 class="h3">${esc(k.name)}</h2>
        <p style="font:600 7.8pt/1.35 var(--font-body);color:var(--ink-soft)">${rich(k.examples, cites)}</p>
        <p style="font:700 8.2pt/1.36 var(--font-body);margin-top:auto;border-top:.25mm solid var(--rule);padding-top:1.5mm">${rich(k.says, cites)}</p>
      </div>`).join('')}
    </div>
    <div class="rsum" style="margin-top:4.5mm">
      <div class="row"><div class="k">What the research found</div><div class="v body frame">${blocks(p.found, cites)}</div></div>
      <div class="row"><div class="k">What it cannot tell us yet</div><div class="v body frame">${blocks(p.cannot, cites)}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 60mm;gap:4mm;margin-top:4mm;flex:1;min-height:0;align-items:start">
      <div class="card frame" style="background:var(--tint-butter);border-color:var(--deep-gold);padding:3mm 3.6mm">
        <p class="eyebrow">Talk about it together</p>
        <ol class="steps" style="margin-top:1.5mm">${p.askTogether.map(q => `<li>${rich(q, cites)}</li>`).join('')}</ol>
      </div>
      ${says(ctx, p.friend, p.friendSays, cites, '17mm')}
    </div>
    <div style="margin-top:3mm">${refsBox(p.refs, ctx.issue.sources)}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, 'The Research Room') })
}

// ── INVESTIGATION (Bloop investigates) ─────────────────────────────────────

function investigation(ctx: RenderContext, p: Extract<Page, { template: 'investigation' }>) {
  const cites = citeMap(p.refs)
  const inner = `
    <div style="display:grid;grid-template-columns:1fr 46mm;gap:4mm;align-items:end">
      <div>
        <div style="display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
        <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
        <p class="standfirst">${rich(p.standfirst, cites)}</p>
      </div>
      ${friend(ctx, p.friend, '46mm')}
    </div>
    <div style="display:grid;grid-template-columns:76mm 1fr;gap:5mm;margin-top:4mm;flex:1;min-height:0">
      <div style="display:flex;flex-direction:column;gap:3mm">
        ${art(ctx, p.art, 'height:72mm;flex:none;border:.35mm solid var(--ink)', 360, 300)}
        <p class="bubble frame" style="box-shadow:0 1.2mm 0 var(--ink)"><span class="who">Bloop's verdict</span>${rich(p.friendSays, cites)}</p>
        <div class="body frame">${blocks(p.body, cites)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:2.6mm;min-height:0">
        ${p.clues.map((c, i) => `<div class="card frame" style="display:grid;grid-template-columns:10mm 1fr;gap:2.5mm;padding:3mm 3.4mm">
          <span style="width:10mm;height:10mm;border-radius:999px;background:var(--ink);color:var(--butter);font:900 8pt/1 var(--font-display);display:flex;align-items:center;justify-content:center;text-align:center">CLUE<br>${i + 1}</span>
          <div><h2 class="h3">${rich(c.title, cites)}</h2><p style="font:600 8.9pt/1.4 var(--font-body);margin-top:.8mm">${rich(c.text, cites)}</p></div></div>`).join('')}
        <div class="card frame" style="background:var(--tint-butter);border-color:var(--deep-gold);padding:3mm 3.4mm">
          <p class="eyebrow">Try this, no account needed</p>
          <ul style="margin:0;padding-left:4mm">${p.tryThis.map(t => `<li style="font:600 8.8pt/1.38 var(--font-body);margin-top:.8mm">${rich(t, cites)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
    <div style="margin-top:3mm">${refsBox(p.refs, ctx.issue.sources)}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, 'Bloop investigates') })
}

// ── LIST (five good things) ────────────────────────────────────────────────

function list(ctx: RenderContext, p: Extract<Page, { template: 'list' }>) {
  const cites = citeMap(p.refs)
  const inner = `
    ${art(ctx, p.art, 'height:15mm;flex:none', 420, 34)}
    <div style="display:grid;grid-template-columns:1fr auto;gap:4mm;align-items:end;margin-top:4mm">
      <div>
        <div style="display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">${esc(p.eyebrow)}</span></div>
        <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1>
        <p class="standfirst">${rich(p.standfirst, cites)}</p>
      </div>
      ${p.friend ? `<div style="width:74mm">${says(ctx, p.friend, p.friendSays, cites, '22mm')}</div>` : ''}
    </div>
    <ol style="list-style:none;margin:3.5mm 0 0;padding:0;display:grid;gap:2.2mm">
      ${p.items.map((it, i) => `<li class="card frame" style="display:grid;grid-template-columns:10mm 1fr 46mm;gap:3.5mm;align-items:start;padding:2.4mm 3.4mm">
        <span style="font:900 24pt/1 var(--font-display);color:var(--gold-ink)">${i + 1}</span>
        <div><div style="display:flex;align-items:center;gap:2mm">${icon(it.icon, 22)}<h2 class="h3" style="font-size:12.6pt">${esc(it.name)}</h2></div>
          <p style="font:600 8.9pt/1.38 var(--font-body);margin-top:1mm">${rich(it.what, cites)}</p>
          <p style="font:700 8.4pt/1.36 var(--font-body);color:var(--gold-ink);margin-top:1mm">${rich(it.why, cites)}</p></div>
        <dl style="margin:0;display:grid;gap:1.1mm;font:600 7.3pt/1.3 var(--font-body);color:var(--ink-soft);border-left:.3mm solid var(--rule);padding-left:3mm">
          ${([['Who for', it.who], ['Account', it.account], ...(it.offline ? [['Offline', it.offline]] : [])] as [string, string][]).map(([k, v]) => `<div style="display:grid;grid-template-columns:15mm 1fr;gap:1.5mm"><dt class="mono" style="font:700 5.8pt/1.6 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink)">${k}</dt><dd style="margin:0">${rich(v, cites)}</dd></div>`).join('')}
          <div><dd class="mono" style="margin:0;font:500 6.2pt/1.2 var(--font-mono);color:var(--ink-muted);word-break:break-all">${esc(it.url.replace(/^https?:\/\//, ''))}</dd></div>
        </dl>
      </li>`).join('')}
    </ol>
    ${p.grownUps ? `<p class="small frame" style="margin-top:3mm;color:var(--ink)"><b>For grown ups.</b> ${rich(p.grownUps, cites)}</p>` : ''}
    <div style="margin-top:auto;padding-top:2.5mm" class="refs-two">${refsBox(p.refs, ctx.issue.sources)}</div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, 'The Family Explorer') })
}

// ── PASSPORT AND NEXT ISSUE ────────────────────────────────────────────────

function passport(ctx: RenderContext, p: Extract<Page, { template: 'passport' }>) {
  const inner = `
    <div style="display:grid;grid-template-columns:1fr auto;gap:4mm;align-items:end">
      <div><div style="display:flex;align-items:center;gap:3mm">${destTag(p.destination)}<span class="eyebrow" style="margin:0">Cut out and keep</span></div>
      <h1 class="h1" style="margin-top:2.5mm">${esc(p.headline)}</h1><p class="standfirst">${rich(p.standfirst)}</p></div>
      ${friend(ctx, p.friend, '34mm')}
    </div>
    <div class="cutline" style="background:var(--cream);margin-top:3mm"></div>
    <div style="margin-top:2mm">${activity(p.activity)}</div>
    <div class="cutline" style="background:var(--cream);margin-top:4mm"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:2.5mm">
      <div class="card frame" style="background:var(--ink);color:var(--cream);border-color:var(--ink);display:flex;flex-direction:column">
        <p class="eyebrow" style="color:var(--butter)">Next month · ${esc(p.next.month)}</p>
        <h2 class="h2" style="color:var(--cream);margin-top:1mm">${esc(p.next.edition)}</h2>
        <ul style="margin:2.5mm 0 0;padding-left:4mm">${p.next.teasers.map(t => `<li style="font:600 9pt/1.4 var(--font-body);margin-top:1mm;color:rgba(249,248,246,.9)">${rich(t)}</li>`).join('')}</ul>
        <div style="margin-top:auto;padding-top:3mm;display:flex;gap:2mm;align-items:center">${planetGlyph(18)}<span class="mono" style="font:600 6.6pt/1.3 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:rgba(249,248,246,.75)">A little more wonder. A lot more understanding.</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:3mm">
        <div class="card frame">
          <p class="eyebrow">Every source in this issue</p>
          <div class="qr"><div class="code" data-qr="${esc(p.sourcesUrl)}">${ctx.qr(p.sourcesUrl)}</div>
          <p class="label">Each page lists where its facts came from. The full list, with links, is online.<span class="mono">${esc(p.sourcesUrl.replace(/^https?:\/\//, ''))}</span></p></div>
        </div>
        <div class="card frame" style="background:var(--tint-butter);border-color:var(--deep-gold)">
          <p class="eyebrow">For grown ups</p>
          <div class="qr"><div class="code" data-qr="${esc(p.grownUps.url)}">${ctx.qr(p.grownUps.url)}</div>
          <p class="label">${rich(p.grownUps.line)}<span style="display:block;font:900 10pt/1.25 var(--font-display);margin-top:1.4mm">${esc(p.grownUps.cta)}</span><span class="mono">${esc(p.grownUps.url.replace(/^https?:\/\//, '').replace(/\?.*$/, ''))}</span></p></div>
        </div>
      </div>
    </div>
    <div style="margin-top:auto;padding-top:2.5mm;padding-bottom:1mm;border-top:.7mm solid var(--ink);display:grid;grid-template-columns:auto 1fr auto;gap:5mm;align-items:center">
      <div><p style="font:900 9pt/1 var(--font-display)">The Guided</p><p style="font:900 20pt/1.05 var(--font-display);letter-spacing:-.04em">Planet</p></div>
      <p class="small frame" style="color:var(--ink);font-size:7.8pt">${esc(ctx.issue.colophon ?? '')}</p>
      <p class="mono" style="font:600 var(--t-eyebrow)/1.5 var(--font-mono);letter-spacing:.14em;text-transform:uppercase;text-align:right;color:var(--ink-soft)">Issue ${pad3(ctx.issue.number)}<br>${esc(ctx.issue.month)}<br>Free to print and share</p>
    </div>`
  return pageShell(ctx, p, inner, { head: runhead(ctx, 'Planet Passport') })
}

export function renderPage(ctx: RenderContext, p: Page): string {
  switch (p.template) {
    case 'cover': return cover(ctx, p)
    case 'welcome': return welcome(ctx, p)
    case 'feature': return feature(ctx, p)
    case 'showcase': return showcase(ctx, p)
    case 'activity': return activityPage(ctx, p)
    case 'research': return research(ctx, p)
    case 'investigation': return investigation(ctx, p)
    case 'list': return list(ctx, p)
    case 'passport': return passport(ctx, p)
  }
}

// The whole issue as one HTML document, ready for Chromium to print.
export function renderIssue(ctx: RenderContext, css: string, opts: { bleedMm: number }): string {
  const i = ctx.issue
  const pages = i.pages.map(p => renderPage(ctx, p)).join('\n')
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>The Guided Planet, Issue ${pad3(i.number)}: ${esc(i.edition)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${css}
:root { --bleed: ${opts.bleedMm}mm; }
</style>
</head>
<body${ctx.ink ? ' class="ink"' : ''}>
${pages}
</body>
</html>`
}
