import { writeFileSync, readFileSync } from 'node:fs'

const b64 = f => readFileSync(f).toString('base64')
const NUNITO = b64('nunito-latin.woff2')     // variable weight axis, covers 600 and 900
const PLEX   = b64('plexmono-latin.woff2')   // IBM Plex Mono 600

// ── The 57 requirements, every one ticked. 19 by 3 is the only clean
//    factoring of 57, which is why the grid is that shape.
const COLS = 19, ROWS = 3, S = 20, GAP = 5
let cells = '', n = 0
for (let r = 0; r < ROWS && n < 57; r++) {
  for (let c = 0; c < COLS && n < 57; c++) {
    const x = c * (S + GAP), y = r * (S + GAP)
    cells += `<rect x="${x}" y="${y}" width="${S}" height="${S}" rx="5" fill="var(--butter)" stroke="var(--ink)" stroke-width="1.6"/>`
    cells += `<path d="M ${x + 5.4} ${y + 10.2} L ${x + 8.6} ${y + 13.6} L ${x + 14.8} ${y + 6.4}" fill="none" stroke="var(--ink)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>\n`
    n++
  }
}
const gridW = COLS * (S + GAP) - GAP, gridH = ROWS * (S + GAP) - GAP

// ── The pile. Ten blocks of guidance resting on each other, splaying to the
//    left as it rises, running off the bottom so it reads taller than the page.
let pile = ''
for (let i = 9; i >= 0; i--) {                     // drawn from the bottom up
  const h = 40, pitch = 41
  const w = 176 + i * 11
  const x = 128 - i * 13 + (i % 3 === 1 ? 14 : 0)  // leans left, wobbles
  const y = i * pitch
  const face = i % 2 ? '#DEE0E7' : '#CFD1DC'
  pile += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${face}" stroke="var(--ink)" stroke-width="2.6"/>`
  for (let l = 0; l < 2; l++)
    pile += `<rect x="${x + 17}" y="${y + 12 + l * 10}" width="${(w * (l ? 0.28 : 0.5)).toFixed(0)}" height="4" rx="2" fill="var(--cold)" opacity="0.72"/>`
  if (i % 2 === 0) pile += `<rect x="${x + w - 8}" y="${y + 8}" width="26" height="11" rx="3.5" fill="#B6B9C8" stroke="var(--ink)" stroke-width="2"/>`
  if (i === 3 || i === 7) pile += `<rect x="${x + w - 8}" y="${y + 22}" width="20" height="10" rx="3.5" fill="#B6B9C8" stroke="var(--ink)" stroke-width="2"/>`
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Guided Childhood Schools, LinkedIn Featured banner</title>
<style>
  /* Fonts embedded rather than linked, so the render can never quietly fall
     back to a system face. That is exactly what happened on the first pass. */
  @font-face { font-family: 'Nunito'; font-weight: 400 1000; font-style: normal;
    src: url(data:font/woff2;base64,${NUNITO}) format('woff2'); font-display: block; }
  @font-face { font-family: 'IBM Plex Mono'; font-weight: 600; font-style: normal;
    src: url(data:font/woff2;base64,${PLEX}) format('woff2'); font-display: block; }

  /* House tokens, copied from shared/tokens.css. Nothing invented. */
  :root {
    --cream: #F9F8F6; --ink: #1A1A2E; --butter: #EDC35F;
    --gold-dk: #C99A28; --espresso: #2E2818; --cold: #8A8FA3;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; }
  .banner { position: relative; width: 1200px; height: 627px;
            background: var(--cream); overflow: hidden;
            font-family: 'Nunito', sans-serif; }

  .cold-wash { position: absolute; inset: 0 720px 0 0; background: var(--cold);   opacity: 0.13; }
  .warm-wash { position: absolute; inset: 0 0 0 480px; background: var(--butter); opacity: 0.17; }
  /* the door: one hard ink edge, with the light landing only on its right */
  .seam  { position: absolute; top: 0; left: 474px; width: 5px;  height: 627px; background: var(--ink); }
  .light { position: absolute; top: 0; left: 479px; width: 11px; height: 627px; background: var(--butter); }

  .label { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 14px;
           letter-spacing: 0.17em; text-transform: uppercase; color: var(--espresso); }

  /* ── left, what the law makes a school teach ── */
  .left { position: absolute; left: 88px; top: 62px; width: 356px; }
  .left h1 { margin-top: 22px; font-weight: 900; font-size: 42px; line-height: 1.06;
             letter-spacing: -0.024em; color: var(--ink); }
  .pile { position: absolute; left: 62px; top: 268px; }

  /* ── right, the scheme that teaches it ── */
  .mark { position: absolute; left: 548px; top: 62px; }
  .card { position: absolute; left: 548px; top: 157px; width: 564px;
          background: var(--cream); border: 2px solid var(--ink);
          border-radius: 16px; box-shadow: 0 5px 0 var(--gold-dk);
          padding: 36px 40px 38px; }
  .card h2 { font-weight: 900; font-size: 62px; line-height: 1;
             letter-spacing: -0.03em; color: var(--ink); }
  .card p  { margin-top: 14px; font-weight: 600; font-size: 25px; color: var(--ink); opacity: 0.8; }
  .card hr { margin: 28px 0; border: 0; height: 2px; background: var(--ink); opacity: 0.12; }
  .card svg { display: block; margin: 0 auto; }
</style>
</head>
<body>
<div class="banner">
  <div class="cold-wash"></div>
  <div class="warm-wash"></div>
  <div class="seam"></div>
  <div class="light"></div>

  <div class="left">
    <div class="label">Statutory RSHE guidance</div>
    <h1>57 online and digital requirements</h1>
  </div>
  <svg class="pile" width="380" height="420" viewBox="0 0 380 420" fill="none">${pile}</svg>

  <div class="label mark">Guided Childhood Schools</div>
  <div class="card">
    <h2>All 57 taught</h2>
    <p>29 lessons, Reception to Year 13</p>
    <hr>
    <svg width="${gridW}" height="${gridH}" viewBox="0 0 ${gridW} ${gridH}" fill="none">${cells}</svg>
  </div>
</div>
</body>
</html>`

writeFileSync('banner.html', html)
console.log('squares', n, '| grid', gridW + 'x' + gridH, '| html KB', Math.round(html.length / 1024))
