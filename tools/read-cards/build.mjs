// Read cards: turns a deck JSON into an A4 PDF of A6 cue cards, four to a page,
// one idea per card, big type, so Justin can print them, cut them, and film one
// clip per card. Usage: node tools/read-cards/build.mjs deck.json out.pdf
// Deck shape: { title, printed, pieces: [ { id, title, platform, length, setup: [lines], cards: [ "text" | {text, direction} ] } ] }
import fs from 'node:fs';
import { chromium } from 'playwright';
const [,, deckPath, outPath] = process.argv;
const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const bad = /[—–]|(\s-\s)/;
const cards = [];
for (const p of deck.pieces) {
  const n = p.cards.length;
  cards.push({ kind: 'setup', eyebrow: `${p.id} · ${esc(p.platform)}`, title: p.title, lines: p.setup, foot: `${n} cards · ${p.length}` });
  p.cards.forEach((c, i) => {
    const text = typeof c === 'string' ? c : c.text;
    const dir = typeof c === 'string' ? '' : (c.direction || '');
    if (bad.test(text) || bad.test(dir)) throw new Error(`dash in ${p.id} card ${i+1}`);
    cards.push({ kind: 'line', eyebrow: `${p.id} · CARD ${i+1} OF ${n}`, title: p.title, text, dir, foot: i+1===n ? 'LAST CARD · stop, breathe, send the clips' : 'pause two seconds, then the next card' });
  });
}
const size = t => t.length > 260 ? 15 : t.length > 180 ? 17 : t.length > 110 ? 20 : 24;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4 portrait; margin: 8mm; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Nunito", "Avenir Next", "Helvetica Neue", Arial, sans-serif; color:#1a1a1a; background:#fff; }
.page { display:grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 6mm; height: 281mm; page-break-after: always; }
.page:last-child { page-break-after: auto; }
.card { border: 1.5px dashed #b9b2a4; border-radius: 10px; padding: 9mm 9mm 7mm; background:#fdfaf2; display:flex; flex-direction:column; position:relative; overflow:hidden; }
.eyebrow { font-family: "IBM Plex Mono", Menlo, monospace; font-size: 9.5pt; letter-spacing: .08em; text-transform: uppercase; color:#6b655a; margin-bottom: 4mm; }
.title { font-size: 10pt; color:#6b655a; margin-bottom: 3mm; }
.text { font-weight: 700; line-height: 1.3; flex: 1; }
.dir { font-family: "IBM Plex Mono", Menlo, monospace; font-size: 10pt; color:#8a6d00; background:#f7e7a8; display:inline-block; padding: 2px 8px; border-radius: 6px; margin-top: 4mm; align-self:flex-start; }
.setup .text { font-weight: 500; font-size: 12.5pt; line-height: 1.35; }
.setup .text li { margin-bottom: 2mm; }
.setup h2 { font-size: 16pt; margin: 0 0 3mm; }
.foot { font-family: "IBM Plex Mono", Menlo, monospace; font-size: 8.5pt; color:#9b948a; margin-top: 3mm; text-transform: uppercase; letter-spacing:.06em; }
.cover { grid-column: 1 / span 2; grid-row: 1 / span 2; border: 3px solid #1a1a1a; border-radius: 14px; background:#fdfaf2; padding: 14mm; }
.cover h1 { font-size: 30pt; margin:0 0 6mm; }
.cover p, .cover li { font-size: 13pt; line-height: 1.45; }
</style></head><body>`;
let out = html;
// cover page
out += `<div class="page"><div class="cover"><div class="eyebrow">GUIDED CHILDHOOD · READ CARDS · PRINTED ${esc(deck.printed)}</div><h1>${esc(deck.title)}</h1>${deck.cover.map(p=>`<p>${esc(p)}</p>`).join('')}<ol>${deck.pieces.map(p=>`<li><b>${esc(p.id)}</b> ${esc(p.title)} · ${esc(p.platform)} · ${esc(p.length)} · ${p.cards.length} cards</li>`).join('')}</ol></div></div>`;
for (let i = 0; i < cards.length; i += 4) {
  out += '<div class="page">';
  for (const c of cards.slice(i, i+4)) {
    if (c.kind === 'setup') out += `<div class="card setup"><div class="eyebrow">${c.eyebrow} · SETUP</div><h2>${esc(c.title)}</h2><div class="text"><ul>${c.lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul></div><div class="foot">${esc(c.foot)}</div></div>`;
    else out += `<div class="card"><div class="eyebrow">${c.eyebrow}</div><div class="title">${esc(c.title)}</div><div class="text" style="font-size:${size(c.text)}pt">${esc(c.text).replace(/\n/g,'<br>')}</div>${c.dir?`<div class="dir">${esc(c.dir)}</div>`:''}<div class="foot">${esc(c.foot)}</div></div>`;
  }
  out += '</div>';
}
out += '</body></html>';
fs.writeFileSync(outPath.replace(/\.pdf$/, '.html'), out);
const b = await chromium.launch({ channel: 'chrome' });
const pg = await b.newPage();
await pg.setContent(out, { waitUntil: 'load' });
await pg.pdf({ path: outPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
await b.close();
console.log('wrote', outPath, cards.length, 'cards on', Math.ceil(cards.length/4)+1, 'pages');
