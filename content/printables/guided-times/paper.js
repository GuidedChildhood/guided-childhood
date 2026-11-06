// THE GUIDED TIMES: lays out an issue (window.ISSUE) as twelve 740 by 1000
// pages inside #pages. The same pages print to A4 and US Letter, fill the
// screen PDF and are lifted whole into the page turning reader.
//
// Drawn things are drawn here in SVG (the masthead snow, the tree, the
// ladder, the maze), in the Happy News hand: thick ink, flat crayon fills
// with class="fill" so the ink friendly version can empty them. The Planet
// Friends and DiGi are the approved art, placed and never redrawn
// (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 15).
(() => {
const I = window.ISSUE
// THE FREE TASTER (6 November 2026, Justin: free on Instagram for an email,
// as a taster, never the whole paid issue). print.html?edition=taster draws
// four pages: the front, the ID card, the puzzles and a closing page that
// gives the six step plan, the answers, and where the full issue is.
const TASTER = new URLSearchParams(location.search).get('edition') === 'taster'
const ART = window.GT_ART || '../images'
const INK = '#1A1A2E'
const C = { butter: '#F4D072', sky: '#8EC3F0', coral: '#F2957A', green: '#93CFA8', paper: '#FEF7E0', pink: '#F2A0C4', teal: '#7FCFC6', holly: '#C8483A', pine: '#2E7D5A', snow: '#EAF3FB' }
const NAMES = { pebble: 'Pebble', bloop: 'Bloop', orbit: 'Orbit', nova: 'Nova', cosmo: 'Cosmo', digi: 'DiGi' }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── Art ─────────────────────────────────────────────────────────────────
const art = (who, mood = 'happy') => who === 'digi' ? `${ART}/DiGi-star-3d.png` : `${ART}/friends/${who}-${mood}.png`
const img = (who, mood, size, style = '') =>
  `<img class="art" src="${art(who, mood)}" alt="${NAMES[who]}${who === 'digi' ? ', the gold star' : ''}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:contain;${style}">`
const plate = (who, mood, size, tint = '') =>
  `<span class="plate ${tint}" style="width:${size}px;height:${size}px">${img(who, mood, Math.round(size * 0.84))}</span>`

// ── Drawn bits ──────────────────────────────────────────────────────────
function burst(size, text, color = C.holly, fg = '#fff', pts = 12) {
  const p = []
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? 50 : 41, a = (Math.PI * 2 * i) / (pts * 2) - Math.PI / 2
    p.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return `<span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;flex-shrink:0">
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" style="position:absolute;inset:0" aria-hidden="true"><polygon class="fill" points="${p.join(' ')}" fill="${color}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/></svg>
    <span class="d burst-t" style="position:relative;color:${fg};font-size:${Math.round(size * 0.15)}px;text-align:center;line-height:1;max-width:${size * 0.66}px">${text}</span></span>`
}
const wavy = (color = INK) => `<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" style="display:block;width:100%;height:10px"><path d="M0 6 Q 12.5 0 25 6 T 50 6 T 75 6 T 100 6 T 125 6 T 150 6 T 175 6 T 200 6" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/></svg>`
const star = (size, color = C.butter) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" style="display:block;flex-shrink:0"><path class="fill" d="M12 2.4 l2.85 6.15 6.75 .68 -5.05 4.5 1.45 6.62 -6 -3.5 -6 3.5 1.45 -6.62 -5.05 -4.5 6.75 -.68z" fill="${color}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`
function flake(size, sw = 2.2) {
  const arms = [0, 60, 120].map(a => `<g transform="rotate(${a} 12 12)"><path d="M12 2v20M12 5l-3-3M12 5l3-3M12 19l-3 3M12 19l3 3"/></g>`).join('')
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" style="display:block;flex-shrink:0" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round">${arms}</svg>`
}
const tree = (w) => `<svg viewBox="0 0 120 160" width="${w}" height="${w * 1.333}" aria-hidden="true" style="display:block">
  <rect class="fill" x="50" y="128" width="20" height="24" rx="3" fill="#B98A5A" stroke="${INK}" stroke-width="4"/>
  <path class="fill" d="M60 8 L104 70 H82 L112 112 H86 L114 132 H6 L34 112 H8 L38 70 H16 Z" fill="${C.green}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
  <circle class="fill" cx="44" cy="96" r="6" fill="${C.coral}" stroke="${INK}" stroke-width="3"/><circle class="fill" cx="78" cy="88" r="6" fill="${C.sky}" stroke="${INK}" stroke-width="3"/>
  <circle class="fill" cx="58" cy="60" r="5.5" fill="${C.pink}" stroke="${INK}" stroke-width="3"/><circle class="fill" cx="88" cy="120" r="6" fill="${C.butter}" stroke="${INK}" stroke-width="3"/><circle class="fill" cx="32" cy="122" r="6" fill="${C.sky}" stroke="${INK}" stroke-width="3"/>
  <path class="fill" d="M60 0 l4.6 9.4 10.4 1.1 -7.8 6.9 2.2 10.2 -9.4 -5.4 -9.4 5.4 2.2 -10.2 -7.8 -6.9 10.4 -1.1z" fill="${C.butter}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></svg>`
const present = (w, fill = C.coral, ribbon = C.butter) => `<svg viewBox="0 0 100 92" width="${w}" height="${w * 0.92}" aria-hidden="true" style="display:block">
  <rect class="fill" x="8" y="34" width="84" height="54" rx="5" fill="${fill}" stroke="${INK}" stroke-width="4.5"/>
  <rect class="fill" x="4" y="22" width="92" height="16" rx="4" fill="${fill}" stroke="${INK}" stroke-width="4.5"/>
  <rect class="fill" x="43" y="22" width="14" height="66" fill="${ribbon}" stroke="${INK}" stroke-width="3.5"/>
  <path class="fill" d="M50 22 C 30 2, 14 14, 30 22 Z M50 22 C 70 2, 86 14, 70 22 Z" fill="${ribbon}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`
const basket = (w) => `<svg viewBox="0 0 120 80" width="${w}" height="${w * 0.667}" aria-hidden="true" style="display:block">
  <rect class="fill" x="34" y="8" width="52" height="40" rx="6" fill="${C.sky}" stroke="${INK}" stroke-width="4"/>
  <path d="M48 26q5-4 10 0M62 26q5-4 10 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <path class="fill" d="M8 36 H112 L102 76 H18 Z" fill="${C.butter}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M26 46 L30 68 M46 46 L48 68 M66 46 L66 68 M84 46 L82 68 M100 46 L94 68" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <text x="98" y="16" font-family="Nunito" font-weight="900" font-size="15" fill="${INK}">z</text><text x="106" y="8" font-family="Nunito" font-weight="900" font-size="11" fill="${INK}">z</text></svg>`

const ICONS = {
  tag: `<path class="fill" d="M10 30 L30 10 H62 V42 L42 62 Z" fill="${C.butter}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><circle cx="50" cy="22" r="5" fill="#fff" stroke="${INK}" stroke-width="3.5"/><path d="M24 40 L40 24" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  basket: `<rect class="fill" x="22" y="6" width="28" height="22" rx="4" fill="${C.sky}" stroke="${INK}" stroke-width="3.5"/><path class="fill" d="M6 24 H66 L60 56 H12 Z" fill="${C.butter}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M20 32 L23 50 M36 32 V50 M52 32 L49 50" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  key: `<circle class="fill" cx="22" cy="36" r="14" fill="${C.butter}" stroke="${INK}" stroke-width="4.5"/><circle cx="22" cy="36" r="4.5" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M35 36 H64 M54 36 V46 M62 36 V44" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  three: `<rect class="fill" x="4" y="22" width="18" height="18" rx="5" fill="${C.coral}" stroke="${INK}" stroke-width="3.5"/><rect class="fill" x="27" y="22" width="18" height="18" rx="5" fill="${C.green}" stroke="${INK}" stroke-width="3.5"/><rect class="fill" x="50" y="22" width="18" height="18" rx="5" fill="${C.sky}" stroke="${INK}" stroke-width="3.5"/>`,
  hand: `<path class="fill" d="M24 62 C 14 54 10 44 10 36 V24 a5 5 0 0 1 10 0 V14 a5 5 0 0 1 10 0 V10 a5 5 0 0 1 10 0 V14 a5 5 0 0 1 10 0 V40 C 50 52 44 60 36 64 Z" fill="${C.pink}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
  house: `<path class="fill" d="M10 34 L36 10 L62 34 V64 H10 Z" fill="${C.coral}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><rect class="fill" x="29" y="42" width="14" height="22" fill="${C.butter}" stroke="${INK}" stroke-width="3.5"/><path d="M4 38 L36 8 L68 38" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  clock: `<circle class="fill" cx="36" cy="36" r="27" fill="${C.paper}" stroke="${INK}" stroke-width="4.5"/><path d="M36 18 V36 L48 44" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
}
const icon = (k, size = 52) => `<svg viewBox="0 0 72 72" width="${size}" height="${size}" aria-hidden="true" style="display:block;flex-shrink:0">${ICONS[k]}</svg>`

// ── Page furniture ──────────────────────────────────────────────────────
const folio = n => `<div class="gt-folio">${wavy()}<div class="row mono"><span>The Guided Times · Issue ${I.number} · ${TASTER ? 'Free taster' : I.month}</span><span>guidedchildhood.com</span><span>${TASTER ? (n ? `Page ${n} of the full issue` : 'The free taster') : `Page ${n}`}</span></div></div>`
const head = (section, tint = C.pine) => `<div class="gt-head"><span class="d name">The Guided Times</span>${flake(14)}<span class="mono muted">${I.edition} · ${I.month}</span><span class="mono sec" style="background:${tint};color:#fff;border-radius:999px;padding:3px 10px" >${section}</span></div><div class="gt-head-rule"></div>`
const page = (n, inner, opts = {}) => `<section class="gt-page" id="p${n}" data-page="${n}" aria-label="Page ${n}">${opts.noHead ? '' : head(opts.section || '', opts.tint)}<div class="gt-body">${inner}</div>${folio(n)}</section>`
const ribbon = (t, fill = 'f-butter', size = 30, rot = -1) => `<h2 class="d ribbon ${fill}" style="font-size:${size}px;transform:rotate(${rot}deg)">${t}</h2>`
const line = (label, size = 15, extra = '') => `<div class="line" style="font-size:${size}px;${extra}">${label ? `<span class="lab">${label}</span>` : ''}<span class="dots"></span></div>`
const gu = (t = 'For grown ups') => `<span class="gu">${star(12)}${t}</span>`

// ── Puzzles, generated once from a seed so the answers always match ──────
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296 }
function wordSearch(words, seed, N = 10) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const r = rng(seed + attempt * 101), g = Array.from({ length: N }, () => Array(N).fill('')), hits = []
    const dirs = [[0, 1], [1, 0], [1, 1]] // across, down, diagonal: the three a six year old can find
    let ok = true
    for (const w of [...words].sort((a, b) => b.length - a.length)) {
      let placed = false
      for (let t = 0; t < 300 && !placed; t++) {
        const [dr, dc] = dirs[Math.floor(r() * dirs.length)]
        const r0 = Math.floor(r() * (N - dr * (w.length - 1))), c0 = Math.floor(r() * (N - dc * (w.length - 1)))
        let fits = true
        for (let i = 0; i < w.length; i++) { const ch = g[r0 + dr * i][c0 + dc * i]; if (ch && ch !== w[i]) { fits = false; break } }
        if (!fits) continue
        for (let i = 0; i < w.length; i++) { g[r0 + dr * i][c0 + dc * i] = w[i]; hits.push(`${r0 + dr * i},${c0 + dc * i}`) }
        placed = true
      }
      if (!placed) { ok = false; break }
    }
    if (!ok) continue
    const fillers = 'BCDFGHJMNPRUVWXYZ'
    for (const row of g) for (let c = 0; c < N; c++) if (!row[c]) row[c] = fillers[Math.floor(r() * fillers.length)]
    return { grid: g, hits: new Set(hits) }
  }
  throw new Error('word search would not fit')
}
function maze(W, H, seed) {
  const r = rng(seed), seen = Array.from({ length: H }, () => Array(W).fill(false))
  const walls = Array.from({ length: H }, () => Array.from({ length: W }, () => ({ n: 1, e: 1, s: 1, w: 1 })))
  const stack = [[0, 0]]; seen[0][0] = true
  const D = { n: [0, -1, 's'], s: [0, 1, 'n'], e: [1, 0, 'w'], w: [-1, 0, 'e'] }
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const opts = Object.entries(D).filter(([, [dx, dy]]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < W && ny < H && !seen[ny][nx] })
    if (!opts.length) { stack.pop(); continue }
    const [k, [dx, dy, back]] = opts[Math.floor(r() * opts.length)]
    walls[y][x][k] = 0; walls[y + dy][x + dx][back] = 0; seen[y + dy][x + dx] = true; stack.push([x + dx, y + dy])
  }
  // the route, for the answers
  const prev = {}, q = [[0, 0]], key = (x, y) => x + ',' + y; prev[key(0, 0)] = null
  while (q.length) {
    const [x, y] = q.shift(); if (x === W - 1 && y === H - 1) break
    for (const [k, [dx, dy]] of Object.entries(D)) { if (walls[y][x][k]) continue; const nx = x + dx, ny = y + dy; if (key(nx, ny) in prev) continue; prev[key(nx, ny)] = [x, y]; q.push([nx, ny]) }
  }
  const path = []; let cur = [W - 1, H - 1]; while (cur) { path.unshift(cur); cur = prev[key(...cur)] }
  return { walls, path, W, H }
}
function mazeSvg(m, cell, { solution = false, sw = 4 } = {}) {
  const { walls, W, H } = m, P = sw, d = []
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const X = P + x * cell, Y = P + y * cell, w = walls[y][x]
    if (w.n && !(x === 0 && y === 0)) d.push(`M${X} ${Y}h${cell}`)
    if (w.w) d.push(`M${X} ${Y}v${cell}`)
    if (y === H - 1 && w.s) d.push(`M${X} ${Y + cell}h${cell}`)
    if (x === W - 1 && w.e && !(y === H - 1)) d.push(`M${X + cell} ${Y}v${cell}`)
  }
  const route = solution ? `<polyline points="${m.path.map(([x, y]) => `${P + x * cell + cell / 2},${P + y * cell + cell / 2}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="${sw * 0.8}" stroke-dasharray="${sw * 1.2} ${sw}" stroke-linecap="round" stroke-linejoin="round"/>` : ''
  return `<svg viewBox="0 0 ${W * cell + P * 2} ${H * cell + P * 2}" width="${W * cell + P * 2}" height="${H * cell + P * 2}" aria-hidden="true" style="display:block"><path d="${d.join('')}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round"/>${route}</svg>`
}
const code = msg => msg.split(' ').map(w => w.split('').map(ch => ch.charCodeAt(0) - 64))

// ── PAGE 1, THE FRONT ───────────────────────────────────────────────────
function front() {
  const f = I.front
  const friends = [['pebble', 'happy'], ['bloop', 'wave'], ['orbit', 'happy'], ['nova', 'wave'], ['cosmo', 'happy']]
  const sr = rng(41)
  const snow = Array.from({ length: 34 }, () => { const r = sr; return `<circle cx="${(r() * 680).toFixed(0)}" cy="${(r() * 150).toFixed(0)}" r="${(2 + r() * 2.6).toFixed(1)}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>` }).join('')
  return page(1, `
    <header style="text-align:center">
      <div style="display:flex;justify-content:space-between;align-items:flex-end" class="mono">
        <span style="text-align:left">No. ${I.number}<br>${I.month}</span>
        <span>Guided Childhood News</span>
        <span style="text-align:right">${I.ages.split(',')[0]}<br>Print, read, do</span>
      </div>
      <h1 class="d" style="font-size:76px;letter-spacing:-0.045em;line-height:0.95;margin:4px 0 2px;display:flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap">${flake(24, 2.6)}The Guided Times${flake(24, 2.6)}</h1>
      <div class="b" style="font-size:16px">Happy news for growing up with screens</div>
      <div style="border-top:5px solid ${INK};border-bottom:1.5px solid ${INK};height:9px;margin-top:8px"></div>
      <div class="mono dateline" style="background:${C.pine};color:#fff;padding:5px 10px;margin-top:4px;display:flex;justify-content:space-between;border-radius:4px"><span>${I.edition}</span><span>${I.theme}</span><span>guidedchildhood.com</span></div>
    </header>

    <div class="mono muted" style="margin-top:12px">Front page news</div>
    <h2 class="d" style="font-size:46px;letter-spacing:-0.035em;margin:2px 0 10px">${f.headline}</h2>

    <div class="box f-snow" style="position:relative;height:226px;flex-shrink:0;overflow:hidden">
      <svg viewBox="0 0 680 212" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">${snow}
        <path class="fill" d="M0 168 Q 120 140 250 158 T 480 150 T 680 156 V212 H0 Z" fill="#fff" stroke="${INK}" stroke-width="3"/></svg>
      <div style="position:absolute;left:14px;bottom:20px">${tree(118)}</div>
      <div style="position:absolute;left:112px;bottom:14px">${present(56, C.coral, C.butter)}</div>
      <div style="position:absolute;left:150px;bottom:12px">${present(40, C.sky, C.pink)}</div>
      <div style="position:absolute;left:196px;right:30px;bottom:14px;display:flex;justify-content:space-between;align-items:flex-end">
        ${friends.map(([k, m], i) => `<div style="display:flex;flex-direction:column;align-items:center">${img(k, m, [86, 92, 86, 96, 92][i])}<span class="d" style="font-size:12px;margin-top:-8px;background:#fff;border:2px solid ${INK};border-radius:999px;padding:1px 9px">${NAMES[k]}</span></div>`).join('')}
      </div>
      <div style="position:absolute;right:10px;top:6px;transform:rotate(9deg)">${burst(96, f.burst)}</div>
    </div>
    <div class="small muted" style="margin:6px 2px 0">The Planet Friends, ready for a cosy Christmas. One Friend for every stage of growing up.</div>

    <div style="display:flex;gap:18px;margin-top:12px;flex:1 1 auto;min-height:0">
      <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:12px">
        <div class="cols2" style="font-size:16.5px">${(TASTER ? I.taster.frontParas : f.paras).map((p, i) => `<p class="${i === 0 ? 'dropcap' : ''}">${p}</p>`).join('')}</div>
        <div style="display:flex;gap:12px;margin-top:auto">
          <div class="box thin" style="flex:1.3 1 0;padding:10px 12px;display:flex;gap:10px;align-items:center">
            ${plate(f.quote.by, 'happy', 58, 'f-coral')}
            <div><div class="d" style="font-size:15px;line-height:1.2">“${f.quote.text}”</div><div class="mono muted" style="margin-top:4px;font-size:10px">${NAMES[f.quote.by]}, the Friend for 16 and up</div></div>
          </div>
          <div class="box thin f-paper" style="flex:1 1 0;padding:10px 12px">
            <div style="display:flex;align-items:center;gap:6px">${flake(16)}<span class="mono">${f.weather.title}</span></div>
            <div class="small b" style="margin-top:4px">${f.weather.line}</div>
          </div>
        </div>
      </div>
      <nav class="box f-paper" style="width:212px;flex-shrink:0;padding:10px 12px">
        <div class="mono" style="margin-bottom:5px">${TASTER ? 'In the full issue' : 'Inside today'}</div>
        ${I.inside.map(([n, t]) => `<a ${TASTER ? '' : `href="#p${n}" data-goto="${n}"`} style="display:flex;align-items:baseline;gap:8px;text-decoration:none;color:inherit;padding:2px 0;border-bottom:1.5px dotted #C9C9D6"><span class="d" style="font-size:16px;width:22px;flex-shrink:0">${n}</span><span class="b" style="font-size:13.5px;line-height:1.2">${t}</span></a>`).join('')}
      </nav>
    </div>`, { noHead: true })
}

// ── PAGE 2, THE EDITOR AND THE NEWS IN BRIEF ────────────────────────────
function editor() {
  const e = I.editor, cm = I.comic
  return page(2, `
    <div style="display:flex;gap:16px;align-items:stretch">
      <div class="box f-paper" style="flex:1 1 0;padding:14px 16px;display:flex;gap:14px;align-items:center">
        ${plate('digi', '', 104, 'f-butter')}
        <div>
          <div class="mono muted">A letter from the editor</div>
          <h2 class="d" style="font-size:24px;margin:3px 0 6px">${e.hello}</h2>
          ${e.paras.map(p => `<p style="font-size:14.5px;margin-bottom:5px">${p}</p>`).join('')}
          <div class="d" style="font-size:17px;transform:rotate(-2deg);display:inline-block;margin-top:2px">${e.signoff}</div>
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:10px;margin:16px 0 8px">${ribbon('News in brief', 'f-sky', 26)}<span class="mono muted">From around the planet</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:3px solid ${INK};border-bottom:3px solid ${INK}">
      ${I.briefs.map((b, i) => `<article style="display:flex;gap:10px;padding:10px ${i % 2 ? '0 10px 14px' : '14px 10px 0'};${i % 2 ? '' : `border-right:1.5px solid ${INK};`}${i < 2 ? `border-bottom:1.5px solid ${INK};` : ''}">
        ${plate(b.by, b.mood, 60)}
        <div><h3 class="d" style="font-size:18px;margin-bottom:3px">${b.head}</h3><p class="small">${b.text}</p></div>
      </article>`).join('')}
    </div>

    <div style="display:flex;gap:12px;margin-top:14px">
      ${I.facts.map((t, i) => `<div class="box thin ${i ? 'f-pink' : 'f-butter'} flood" style="flex:1 1 0;padding:9px 12px;display:flex;gap:10px;align-items:center">
        <span class="d" style="font-size:34px;line-height:1">?</span><div><div class="mono">Did you know?</div><div class="small b">${t}</div></div></div>`).join('')}
    </div>

    <div style="margin-top:14px;flex:1 1 auto;min-height:0;display:flex;flex-direction:column">
      <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px"><span class="d" style="font-size:22px">${cm.title}</span><span class="mono muted">The comic strip</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex:1 1 auto;min-height:0">
        ${cm.panels.map((p, i) => `<div class="box thin" style="position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:8px">
          <div class="b" style="position:absolute;left:8px;right:8px;top:8px;font-size:13.5px;line-height:1.25;background:#fff;border:2.5px solid ${INK};border-radius:14px 14px 14px 4px;padding:6px 8px">${p.say}</div>
          <span class="mono" style="position:absolute;left:8px;bottom:5px;font-size:10px">${i + 1}</span>
          <div style="display:flex;align-items:flex-end;gap:2px">${p.who === 'digi' ? img('digi', '', 92) : img(p.who, p.mood, 104)}${p.basket ? basket(54) : ''}${i === 0 ? present(44, C.sky, C.coral) : ''}</div>
        </div>`).join('')}
      </div>
    </div>`, { section: 'From the editor' })
}

// ── PAGES 3 AND 4, THE FEATURE SPREAD ───────────────────────────────────
function plan() {
  const p = I.plan
  return page(3, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(p.kicker, 'f-green', 26)}<span class="mono muted">The big feature · pages 3 and 4</span></div>
    <h2 class="d" style="font-size:38px;letter-spacing:-0.03em;margin:12px 0 6px">${p.headline}</h2>
    <p style="font-size:16px">${p.intro}</p>
    <ol style="list-style:none;margin:12px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:12px 16px">
      ${p.steps.map((s, i) => `<li class="box thin" style="padding:10px 12px;display:flex;flex-direction:column;gap:6px">
        <div style="display:flex;align-items:center;gap:10px">${icon(s.icon, 46)}<span class="stepno">${i + 1}</span><h3 class="d" style="font-size:19px;line-height:1.1">${s.head}</h3></div>
        <p style="font-size:14.5px">${s.text}</p>${s.write ? line('', 15, 'min-height:34px') : ''}
      </li>`).join('')}
    </ol>
    <div style="margin-top:14px;display:flex;align-items:stretch;gap:6px">
      ${p.morning.map((m, i) => `${i ? `<svg viewBox="0 0 30 30" width="22" height="22" aria-hidden="true" style="align-self:center;flex-shrink:0"><path d="M4 15h20M16 7l8 8-8 8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}<div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px">
        <div style="height:74px;display:flex;align-items:flex-end">${m.who ? img(m.who, m.mood, 74) : m.draw === 'present' ? present(62, C.coral, C.butter) : basket(80)}</div>
        <div class="d" style="font-size:15px;line-height:1.1">${m.head}</div><div class="small muted b" style="line-height:1.2">${m.when}</div></div>`).join('')}
    </div>
    <div class="box f-paper" style="margin-top:auto;padding:12px 14px;display:flex;gap:12px;align-items:center">
      ${plate('digi', '', 64, 'f-butter')}
      <div>${gu(p.grownUps.title)}<p class="small" style="margin-top:5px">${p.grownUps.text}</p></div>
    </div>`, { section: 'The big feature', tint: C.pine })
}
function idCard() {
  const c = I.idCard
  return page(4, `
    <div class="box" style="padding:0;overflow:hidden">
      <div class="flood" style="background:${C.pine};color:#fff;padding:10px 16px;display:flex;align-items:center;gap:10px;border-bottom:3px solid ${INK}">
        ${star(26)}<h2 class="d" style="font-size:28px;color:inherit">${c.title}</h2><span class="mono" style="margin-left:auto;color:inherit">Fill it in together</span>
      </div>
      <div style="display:flex;gap:16px;padding:14px 16px 8px">
        <div style="width:190px;flex-shrink:0;display:flex;flex-direction:column;gap:8px">
          <div style="height:200px;border:3px dashed ${INK};border-radius:12px;display:flex;align-items:flex-end;justify-content:center;padding:8px"><span class="b small muted" style="text-align:center">Draw your new screen here</span></div>
          <div class="b small">It is a: <span class="muted">(circle one)</span></div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${c.kinds.map(k => `<span class="pill">${k}</span>`).join('')}</div>
        </div>
        <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column">
          ${c.lines.map(l => line(l, 16)).join('')}
          <div class="b" style="font-size:16px;margin-top:10px">${c.apps}</div>
          ${[1, 2, 3].map(n => `<div style="display:flex;align-items:flex-end;gap:8px"><span class="stepno" style="margin-bottom:6px">${n}</span>${line('', 15, 'flex:1;min-height:40px')}</div>`).join('')}
        </div>
      </div>
      <div style="padding:6px 16px 14px;display:flex;gap:16px;align-items:center;border-top:1.5px solid ${INK};margin-top:6px">
        <span class="b" style="font-size:15px;white-space:nowrap">${c.protected.title}:</span>
        ${c.protected.items.map(t => `<span style="display:inline-flex;align-items:center;gap:6px" class="b small"><span class="tick"></span>${t}</span>`).join('')}
      </div>
    </div>

    <div class="box f-snow" style="margin-top:16px;flex:1 1 auto;min-height:0;position:relative;padding:12px 16px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:10px"><span class="d" style="font-size:22px">${c.draw}</span><span class="mono muted" style="margin-left:auto">Where will it charge tonight?</span></div>
      <div style="flex:1 1 auto;margin-top:8px;border:3px dashed ${INK};border-radius:12px;background:#fff"></div>
      <div style="position:absolute;right:26px;bottom:24px">${basket(110)}</div>
      <div style="position:absolute;left:28px;bottom:22px">${img('bloop', 'thinking', 104)}</div>
    </div>

    <div style="display:flex;gap:24px;margin-top:10px">${line('My name', 15, 'flex:1')}${line('Grown up', 15, 'flex:1')}</div>`, { section: 'The big feature', tint: C.pine })
}

// ── PAGE 5, THE BIG QUESTION ────────────────────────────────────────────
function bigQuestion() {
  const q = I.bigQuestion
  const side = (s, fill, tag) => `<div class="box ${fill}" style="flex:1 1 0;padding:10px 12px;display:flex;flex-direction:column;gap:6px">
    <div style="display:flex;align-items:center;gap:10px">${plate(s.by, s.mood, 60)}<div><span class="mono">${tag}</span><h3 class="d" style="font-size:22px">${s.head}</h3><span class="mono muted" style="font-size:10px">says ${NAMES[s.by]}</span></div></div>
    ${s.points.map(t => `<div style="display:flex;gap:8px;align-items:flex-start;background:#fff;border:2.5px solid ${INK};border-radius:12px;padding:5px 9px">${star(16)}<span class="b" style="font-size:14px;line-height:1.28">${t}</span></div>`).join('')}
  </div>`
  return page(5, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(q.kicker, 'f-coral', 26)}<span class="mono muted">Read both sides, then vote</span></div>
    <h2 class="d" style="font-size:36px;letter-spacing:-0.03em;margin:10px 0 5px">${q.question}</h2>
    <p style="font-size:15.5px;margin-bottom:10px">${q.intro}</p>
    <div style="display:flex;gap:14px">${side(q.yes, 'f-sky', 'Side one')}${side(q.no, 'f-butter', 'Side two')}</div>
    <div style="display:flex;align-items:center;gap:12px;margin:10px 0 0">${img(q.middle.by, q.middle.mood, 74)}
      <div class="b" style="flex:1;font-size:15.5px;background:#fff;border:3px solid ${INK};border-radius:18px 18px 18px 4px;padding:9px 14px;box-shadow:3px 4px 0 ${INK}">${q.middle.text}<span class="mono muted" style="display:block;margin-top:3px;font-size:10px">${NAMES[q.middle.by]} has a middle idea</span></div></div>
    <div class="box" style="margin-top:12px;padding:8px 14px">
      <div style="display:flex;align-items:baseline;gap:10px"><span class="d" style="font-size:21px">${q.vote.title}</span><span class="small muted b">Everyone writes their name, then ticks one box.</span></div>
      <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:14px">
        <tr><td class="small muted b">Names</td>${[1, 2, 3, 4, 5].map(() => `<td style="height:30px;border-bottom:2.5px dotted var(--write);width:86px"></td>`).join('')}</tr>
        ${q.vote.options.map(o => `<tr><td class="b" style="padding:3px 0;font-size:15px">${o}</td>${[1, 2, 3, 4, 5].map(() => `<td style="text-align:center;padding:3px 0"><span class="tick" style="width:22px;height:22px"></span></td>`).join('')}</tr>`).join('')}
      </table>
    </div>
    <div style="margin-top:8px;flex:1 1 auto;display:flex;flex-direction:column;justify-content:flex-end">
      <div class="b" style="font-size:16px">${q.decide}</div>${line('', 15, 'min-height:40px')}${line('', 15, 'min-height:40px')}
      <div class="d" style="font-size:15px;margin-top:8px;display:flex;align-items:center;gap:8px">${star(20, C.coral)}${q.tip}</div>
    </div>`, { section: 'The big question', tint: C.holly })
}

// ── PAGE 6, THE APP DESK ────────────────────────────────────────────────
function appDesk() {
  const a = I.apps
  const tints = [C.green, C.green, C.butter, C.butter, C.coral]
  const phone = `<svg viewBox="0 0 120 210" width="92" height="161" aria-hidden="true" style="display:block;flex-shrink:0">
    <rect class="fill" x="6" y="4" width="108" height="202" rx="18" fill="${C.sky}" stroke="${INK}" stroke-width="5"/>
    <rect x="16" y="20" width="88" height="160" rx="8" fill="#fff" stroke="${INK}" stroke-width="3.5"/>
    <text x="60" y="40" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="12" fill="${INK}">Today’s jobs</text>
    ${[0, 1, 2].map(i => `<rect x="24" y="${50 + i * 30}" width="72" height="22" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="34" cy="${61 + i * 30}" r="5" class="fill" fill="${i < 2 ? C.green : '#fff'}" stroke="${INK}" stroke-width="2"/><rect x="44" y="${58 + i * 30}" width="${[34, 28, 38][i]}" height="5" rx="2.5" fill="${INK}"/><path class="fill" d="M86 ${53 + i * 30} l2.3 4.9 5.3.6 -4 3.6 1.1 5.3 -4.7 -2.7 -4.7 2.7 1.1 -5.3 -4 -3.6 5.3 -.6z" fill="${C.butter}" stroke="${INK}" stroke-width="1.6"/>`).join('')}
    <rect class="fill" x="24" y="144" width="72" height="26" rx="13" fill="${C.butter}" stroke="${INK}" stroke-width="2.5"/><text x="60" y="161" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="10" fill="${INK}">10 min earned</text>
    <circle cx="60" cy="193" r="5" fill="${INK}"/></svg>`
  return page(6, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(a.kicker, 'f-sky', 26)}<span class="mono muted">Apps, games and age labels</span></div>
    <h2 class="d" style="font-size:36px;letter-spacing:-0.03em;margin:10px 0 4px">${a.headline}</h2>
    <p style="font-size:16px">${a.intro}</p>
    <div style="display:flex;gap:14px;align-items:center;margin:12px 0 4px">
      ${a.pegi.map((n, i) => `<span class="flood" style="width:62px;height:62px;border:3px solid ${INK};border-radius:12px;background:${tints[i]};display:inline-flex;align-items:center;justify-content:center;box-shadow:3px 4px 0 ${INK}"><span class="d" style="font-size:30px">${n}</span></span>`).join('')}
      <p class="b" style="flex:1;font-size:14.5px;line-height:1.35">${a.pegiLine}</p>
    </div>
    <div style="display:flex;gap:14px;margin-top:12px">
      <div class="box f-paper" style="flex:1.25 1 0;padding:12px 14px">
        <h3 class="d" style="font-size:18px;margin-bottom:4px">${a.questions.title}</h3>
        ${a.questions.items.map((t, i) => `<div style="display:flex;gap:9px;align-items:center;padding:3px 0"><span class="stepno">${i + 1}</span><span class="b" style="font-size:15px;line-height:1.25">${t}</span></div>`).join('')}
        <p class="small b" style="margin-top:8px;padding-top:7px;border-top:1.5px solid ${INK}">${a.social}</p>
      </div>
      <div class="box" style="flex:1 1 0;padding:12px 14px">
        <h3 class="d" style="font-size:20px">${a.check.title}</h3>
        ${a.check.lines.map(l => line(l, 14.5, 'min-height:40px')).join('')}
        ${a.check.yesno.map(l => `<div style="display:flex;align-items:center;gap:8px;margin-top:9px"><span class="b" style="font-size:14.5px;flex:1">${l}</span><span class="pill">Yes</span><span class="pill">No</span></div>`).join('')}
        <div style="display:flex;align-items:center;gap:8px;margin-top:10px"><span class="b" style="font-size:14.5px;flex:1">${a.check.verdict}</span>${a.check.options.map(o => `<span class="pill">${o}</span>`).join('')}</div>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;gap:12px;align-items:flex-start">
      ${plate('digi', '', 58, 'f-butter')}
      <div style="flex:1"><span class="d" style="font-size:20px">${a.dear.title}</span>
        <p class="b" style="font-size:14px;margin-top:2px;font-style:italic">${a.dear.letter} <span class="muted" style="font-style:normal">${a.dear.from}</span></p>
        <p style="font-size:14px;margin-top:3px">${a.dear.reply}</p></div>
    </div>
    <div class="box f-green" style="margin-top:auto;padding:10px 16px;display:flex;gap:16px;align-items:center">
      ${phone}
      <div style="flex:1">
        ${gu()}
        <h3 class="d" style="font-size:22px;margin:5px 0 4px">${a.ours.title}</h3>
        <p style="font-size:14px;line-height:1.4">${a.ours.text}</p>
        <p class="d" style="font-size:16px;margin-top:4px">${a.ours.url}</p>
      </div>
    </div>`, { section: 'The app desk', tint: '#2E6F8E' })
}

// ── PAGE 7, THE HOMEWORK HELPER ─────────────────────────────────────────
function homework() {
  const h = I.homework
  const rungs = h.ladder.length
  const ladder = `<svg viewBox="0 0 70 360" width="62" height="318" aria-hidden="true" style="display:block;flex-shrink:0">
    <path d="M12 6 V354 M58 6 V354" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    ${Array.from({ length: rungs }, (_, i) => `<path d="M12 ${330 - i * 70} H58" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('')}</svg>`
  return page(7, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(h.kicker, 'f-teal', 26)}<span class="mono muted">For school nights, and the holidays</span></div>
    <div style="display:flex;gap:16px;margin-top:12px">
      <div style="flex:1 1 0;min-width:0">
        <h2 class="d" style="font-size:36px;letter-spacing:-0.03em;margin-bottom:10px">${h.headline}</h2>
        <div style="display:flex;gap:12px">
          ${ladder}
          <ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column-reverse;justify-content:space-between;height:318px;flex:1">
            ${h.ladder.map((t, i) => `<li style="display:flex;gap:8px;align-items:center"><span class="stepno">${i + 1}</span><span class="b" style="font-size:15px;line-height:1.25">${t}</span></li>`).join('')}
          </ol>
        </div>
        <div class="mono muted" style="margin-top:4px">Start at the bottom and climb</div>
      </div>
      <div style="width:250px;flex-shrink:0;display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:center">${img(h.by, 'thinking', 118)}</div>
        <div class="box f-paper" style="padding:10px 12px">
          <h3 class="d" style="font-size:19px;margin-bottom:5px">${h.spot.title}</h3>
          ${h.spot.items.map(t => `<div style="display:flex;gap:8px;align-items:center;padding:3px 0"><span class="tick"></span><span class="b small">${t}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="box f-pink" style="margin-top:14px;padding:10px 14px;display:flex;gap:12px;align-items:center">
      ${plate('orbit', 'thinking', 58)}
      <div><h3 class="d" style="font-size:19px">${h.ai.title}</h3><p class="small b" style="margin-top:2px">${h.ai.text}</p></div>
    </div>
    <div class="box" style="margin-top:14px;padding:12px 14px;flex:1 1 auto;min-height:0;display:flex;gap:16px">
      <div style="flex:1 1 0">
        ${gu()}
        <h3 class="d" style="font-size:21px;margin:6px 0 6px">${h.table.title}</h3>
        <p class="small">${h.table.note}</p>
        <p class="small b" style="margin-top:8px">${h.holiday}</p>
      </div>
      <table style="width:260px;flex-shrink:0;border-collapse:collapse;font-size:14px;align-self:center">
        ${h.table.rows.map(([y, m], i) => `<tr style="${i % 2 ? '' : `background:${C.paper}`}" class="${i % 2 ? '' : 'flood'}"><td class="b" style="padding:6px 8px;border-bottom:1.5px solid ${INK}">${y}</td><td style="padding:6px 8px;border-bottom:1.5px solid ${INK};text-align:right;font-weight:800">${m}</td></tr>`).join('')}
      </table>
    </div>`, { section: 'The homework helper', tint: '#2A8C82' })
}

// ── PAGE 8, THE GOOD SITES GUIDE ────────────────────────────────────────
function sites() {
  const s = I.sites
  const card = (x, tint) => `<div class="box thin" style="padding:0;overflow:hidden;display:flex;flex-direction:column">
    <div class="flood" style="background:${tint};border-bottom:2.5px solid ${INK};padding:5px 9px;display:flex;align-items:center;gap:5px">
      <span style="width:8px;height:8px;border-radius:50%;border:2px solid ${INK};background:#fff"></span><span style="width:8px;height:8px;border-radius:50%;border:2px solid ${INK};background:#fff"></span>
      <span style="flex:1;margin-left:5px;background:#fff;border:2px solid ${INK};border-radius:999px;padding:1px 9px;font-family:var(--mono);font-weight:600;font-size:11.5px;letter-spacing:0.02em">${x.url}</span></div>
    <div style="padding:7px 10px 9px"><h3 class="d" style="font-size:18px">${x.name}</h3><p class="small" style="margin-top:2px">${x.text}</p></div></div>`
  return page(8, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(s.kicker, 'f-butter', 26)}<span class="mono muted">Checked by Orbit</span></div>
    <div style="display:flex;align-items:center;gap:12px;margin:10px 0 4px">
      <div style="flex:1"><h2 class="d" style="font-size:33px;letter-spacing:-0.03em">${s.headline}</h2><p style="font-size:15.5px;margin-top:5px">${s.intro}</p></div>
      ${img(s.by, 'wave', 92)}
    </div>
    <div class="mono" style="margin:8px 0 6px">For children</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">${s.kids.map((x, i) => card(x, [C.sky, C.coral, C.green, C.butter, C.pink][i])).join('')}
      <div class="box thin f-paper" style="padding:9px 11px"><h3 class="d" style="font-size:17px;margin-bottom:4px">${s.check.title}</h3>${s.check.items.map(t => `<div style="display:flex;gap:7px;align-items:center;padding:2px 0"><span class="tick" style="width:17px;height:17px"></span><span class="b small">${t}</span></div>`).join('')}</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin:10px 0 6px">${gu()}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${s.grownUps.map(x => card(x, C.teal)).join('')}</div>
    <div class="box thin f-sky" style="margin-top:14px;padding:9px 14px;display:flex;gap:10px;align-items:center">${plate('orbit', 'thinking', 50)}<p class="b" style="font-size:14.5px">${s.tip}</p></div>
    <div style="margin-top:auto">${line(s.fave, 16)}</div>`, { section: 'The good sites guide', tint: '#B88A1B' })
}

// ── PAGE 9, PUZZLES ─────────────────────────────────────────────────────
function puzzles() {
  const P = I.puzzles, ws = wordSearch(P.wordSearch.words, P.wordSearch.seed), mz = maze(9, 6, P.maze.seed), cd = code(P.code.message)
  window.GT_SOLVED = { ws, mz }
  return page(9, `
    <div class="box" style="padding:12px 14px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">${plate('orbit', 'thinking', 62, 'f-sky')}<div><div class="mono muted">${P.kicker}</div>${ribbon(P.realOrPretend.headline, 'f-sky', 26)}</div></div>
      <p style="font-size:15px;margin-bottom:8px">${P.realOrPretend.intro}</p>
      ${P.realOrPretend.messages.map((m, i) => `<div style="display:flex;align-items:center;gap:12px;margin-top:7px">
        <span class="d" style="font-size:24px;width:18px">${i + 1}</span>
        <div class="f-paper" style="flex:1;border:2.5px solid ${INK};border-radius:14px 14px 14px 4px;padding:6px 12px"><div class="mono muted" style="font-size:10px">From: ${m.from}</div><div class="b" style="font-size:14.5px">${m.text}</div></div>
        <div style="display:flex;flex-direction:column;gap:4px">${['Real', 'Pretend'].map(x => `<span class="pill">${x}</span>`).join('')}</div></div>`).join('')}
    </div>
    <div style="display:flex;gap:14px;margin-top:14px;flex:1 1 auto;min-height:0">
      <div class="box f-paper" style="padding:10px 12px;display:flex;flex-direction:column">
        <h3 class="d" style="font-size:18px;margin-bottom:6px">${P.wordSearch.headline}</h3>
        <div style="display:grid;grid-template-columns:repeat(10,31px);background:#fff;border:2.5px solid ${INK};border-radius:8px;padding:6px">
          ${ws.grid.flat().map(ch => `<span class="d" style="width:31px;height:34px;display:flex;align-items:center;justify-content:center;font-size:18px">${ch}</span>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 10px;margin-top:10px">${P.wordSearch.words.map(w => `<span class="b" style="display:inline-flex;align-items:center;gap:6px;font-size:15px"><span class="tick" style="width:16px;height:16px;border-radius:3px"></span>${w.toLowerCase()}</span>`).join('')}</div>
      </div>
      <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:14px">
        <div class="box" style="padding:10px 12px">
          <h3 class="d" style="font-size:18px">${P.code.headline}</h3>
          <p class="small" style="margin:3px 0 8px">${P.code.intro}</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px 14px">${cd.map(w => `<div style="display:flex;gap:4px">${w.map(n => `<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><span class="blank" style="width:26px;height:30px"></span><span class="b" style="font-size:12.5px">${n}</span></div>`).join('')}</div>`).join('')}</div>
        </div>
        <div class="box f-snow" style="padding:10px 12px;flex:1 1 auto;display:flex;flex-direction:column">
          <h3 class="d" style="font-size:18px;margin-bottom:6px">${P.maze.headline}</h3>
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:2px">
            <div style="display:flex;align-items:center;gap:6px;align-self:flex-start;margin-left:2px"><svg viewBox="0 0 40 56" width="28" height="40" aria-hidden="true"><rect class="fill" x="4" y="4" width="32" height="48" rx="6" fill="${C.sky}" stroke="${INK}" stroke-width="4"/><circle cx="15" cy="22" r="2.4" fill="${INK}"/><circle cx="25" cy="22" r="2.4" fill="${INK}"/><path d="M14 31q6 5 12 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/></svg><span class="mono" style="font-size:10px">Start here</span></div>
            <div style="background:#fff;border-radius:8px">${mazeSvg(mz, 26)}</div>
            <div style="display:flex;align-items:center;gap:6px;align-self:flex-end"><span class="mono" style="font-size:10px">Bed</span>${basket(52)}</div>
          </div>
        </div>
      </div>
    </div>`, { section: 'Puzzles', tint: '#2E6F8E' })
}

// ── PAGE 10, MAKE AND DO ────────────────────────────────────────────────
function make() {
  const m = I.make, b = m.bingo, tints = ['f-sky', 'f-butter', 'f-green', 'f-pink']
  return page(10, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(m.kicker, 'f-pink', 26)}<span class="mono muted">Screen free fun for the holidays</span></div>
    <div style="display:flex;align-items:flex-end;gap:12px;margin:10px 0 8px">
      <div style="flex:1"><h2 class="d" style="font-size:38px;letter-spacing:-0.03em">${b.headline}</h2><p style="font-size:15px;margin-top:4px">${b.intro}</p></div>
      ${img('pebble', 'happy', 92)}
    </div>
    <div class="box" style="padding:8px;display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:94px;gap:6px">
      ${b.squares.map((t, i) => `<div class="${tints[(i + Math.floor(i / 4)) % 4]}" style="border:2.5px solid ${INK};border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:6px;text-align:center"><span class="b" style="font-size:14.5px;line-height:1.15">${t}</span><span class="circ" style="width:20px;height:20px;border-width:2.5px"></span></div>`).join('')}
    </div>
    <div style="display:flex;gap:16px;margin-top:16px;flex:1 1 auto;min-height:0">
      <div style="width:210px;flex-shrink:0">
        <h3 class="d" style="font-size:21px;line-height:1.1;margin-bottom:8px">${m.hanger.headline}</h3>
        ${m.hanger.steps.map((t, i) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:7px"><span class="stepno">${i + 1}</span><span class="b small">${t}</span></div>`).join('')}
      </div>
      <div style="flex:1 1 0;position:relative;border:2.5px solid ${INK};border-radius:8px;display:flex;flex-direction:column">
        <span class="scissors" style="left:-9px;top:-11px">✂</span>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:8px;transform:rotate(180deg)"><svg viewBox="0 0 100 100" width="62" height="62" aria-hidden="true"><circle class="fill" cx="50" cy="50" r="19" fill="${C.butter}" stroke="${INK}" stroke-width="5"/><path d="M50 8v14M50 78v14M8 50h14M78 50h14M20 20l10 10M70 70l10 10M20 80l10-10M70 30l10-10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/></svg><span class="d" style="font-size:26px;text-align:center;line-height:1.05">${m.hanger.back}</span></div>
        <div style="border-top:2.5px dashed #6B6B80;position:relative"><span class="mono muted" style="position:absolute;right:8px;top:-9px;background:#fff;font-size:9px;padding:0 4px">fold</span></div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:12px;padding:8px">${basket(80)}<span class="d" style="font-size:26px;text-align:center;line-height:1.05">${m.hanger.front}</span></div>
      </div>
    </div>`, { section: 'Make and do', tint: '#B5487A' })
}

// ── PAGE 11, THE SHOP ───────────────────────────────────────────────────
function shop() {
  const s = I.shop
  const ads = s.ads.filter(a => a.live)
  const feature = ads.find(a => a.feature), rest = ads.filter(a => !a.feature)
  const thumb = a => a.img
    ? `<div style="width:96px;height:132px;flex-shrink:0;border:2.5px solid ${INK};border-radius:6px;overflow:hidden;background:#fff;transform:rotate(-2deg);box-shadow:3px 4px 0 ${INK}"><img class="art" src="${ART}/shop/${a.img}.png" alt="${a.name}, the first page" style="width:100%;height:100%;object-fit:cover;object-position:top"></div>`
    : `<div style="width:96px;flex-shrink:0;display:flex;justify-content:center">${a.draw === 'house' ? icon('house', 80) : present(80, C.coral, C.butter)}</div>`
  const ad = (a, i) => `<div class="box thin" style="padding:10px 12px;display:flex;gap:12px;align-items:center;position:relative">
    ${thumb(a)}<div style="min-width:0"><div class="mono muted" style="font-size:10px">${a.ages}</div><h3 class="d" style="font-size:18px;line-height:1.1;margin:2px 0 4px">${a.name}</h3><p class="small">${a.line}</p></div></div>`
  return page(11, `
    <div style="display:flex;align-items:center;gap:10px">${ribbon(s.kicker, 'f-coral', 26)}<span class="mono muted">Small ads</span></div>
    <h2 class="d" style="font-size:34px;letter-spacing:-0.03em;margin:10px 0 4px">${s.headline}</h2>
    <p style="font-size:15px;margin-bottom:12px">${s.intro}</p>
    ${feature ? `<div class="box f-paper" style="padding:14px 16px;display:flex;gap:18px;align-items:center;position:relative">
      <div style="width:150px;height:206px;flex-shrink:0;border:3px solid ${INK};border-radius:8px;overflow:hidden;transform:rotate(-3deg);box-shadow:4px 5px 0 ${INK};background:#fff"><img class="art" src="${ART}/shop/${feature.img}.png" alt="${feature.name}, the cover" style="width:100%;height:100%;object-fit:cover;object-position:top"></div>
      <div style="flex:1"><div class="mono muted">${feature.ages} · Start here</div><h3 class="d" style="font-size:28px;margin:4px 0 6px">${feature.name}</h3><p style="font-size:15.5px">${feature.line}</p>
        <div style="display:flex;gap:6px;margin-top:10px">${['pebble', 'bloop', 'orbit', 'nova', 'cosmo'].map(k => plate(k, 'happy', 44)).join('')}</div></div>
      <div style="position:absolute;right:10px;bottom:10px;transform:rotate(8deg)">${burst(92, 'Start here!', C.butter, '#1A1A2E')}</div>
    </div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">${rest.map(ad).join('')}</div>
    <div style="margin-top:14px;display:flex;align-items:center;gap:10px;justify-content:center" class="b">${star(22)}<span style="font-size:15px">${s.sticker}</span>${star(22)}</div>
    <div class="flood" style="margin-top:auto;background:${C.pine};color:#fff;border:3px solid ${INK};border-radius:14px;padding:12px 16px;display:flex;align-items:center;gap:14px">
      ${star(34)}<div><div class="mono" style="color:inherit">Find them all</div><div class="d" style="font-size:24px;color:inherit">${I.shopUrl}</div></div>
      <div class="b small" style="margin-left:auto;max-width:210px;color:inherit">Instant downloads. Print at home as many times as your family needs.</div>
    </div>`, { section: 'The shop', tint: C.holly })
}

// ── PAGE 12, THE BACK PAGE ──────────────────────────────────────────────
function back() {
  const b = I.back, P = I.puzzles, { ws, mz } = window.GT_SOLVED
  const mini = `<div style="display:grid;grid-template-columns:repeat(10,11px);border:1.5px solid var(--answer);padding:2px">${ws.grid.flat().map((ch, i) => `<span style="width:11px;height:11px;font-size:8.5px;font-weight:900;display:flex;align-items:center;justify-content:center;${ws.hits.has(`${Math.floor(i / 10)},${i % 10}`) ? 'background:#D8D8E4;color:#1A1A2E' : 'color:#B0B0C0'}">${ch}</span>`).join('')}</div>`
  return page(12, `
    <div class="box" style="padding:14px 18px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">${plate(b.promise.by, 'happy', 66, 'f-butter')}<h2 class="d" style="font-size:32px">${b.promise.headline}</h2></div>
      ${b.promise.lines.map(l => line(l, 15.5)).join('')}
      <div style="display:flex;gap:24px">${line('My name', 15, 'flex:1')}${line('Grown up', 15, 'flex:1')}</div>
    </div>

    <div style="display:flex;gap:14px;margin-top:16px">
      <div class="box f-snow" style="flex:1 1 0;padding:10px 14px;display:flex;gap:12px;align-items:center">
        <div style="flex:1"><div class="mono">${b.next.kicker}</div><p class="b" style="font-size:15px;margin-top:4px">${b.next.line}</p></div>
        ${burst(78, `Issue ${I.nextIssue.number}`, C.sky, '#1A1A2E')}
      </div>
    </div>

    <div class="flood" style="margin-top:16px;border:3px solid ${INK};border-radius:14px;background:${C.butter};padding:12px 16px;display:flex;gap:12px;align-items:center">
      ${img('digi', '', 64)}<div><p class="d" style="font-size:19px;line-height:1.2">${b.gift}</p><p class="small b" style="margin-top:4px">${b.review}</p></div>
    </div>

    <div class="box" style="margin-top:16px;flex:1 1 auto;min-height:0;padding:8px 14px;display:flex;gap:14px;align-items:center;overflow:hidden">
      <div style="width:200px;flex-shrink:0"><div class="d" style="font-size:22px;line-height:1.1">${b.colour.title}</div><p class="small b" style="margin-top:6px">${b.colour.line}</p></div>
      <div class="colour" style="flex:1;display:flex;align-items:flex-end;justify-content:center;gap:4px;height:100%">${tree(88)}${present(64, '#fff', '#fff')}${present(46, '#fff', '#fff')}${basket(88)}</div>
    </div>
    <div class="upside" style="margin-top:auto;padding-top:12px;display:flex;gap:18px;align-items:flex-start">
      <div style="flex:1 1 0;min-width:0">
        <div class="mono" style="font-size:10px;color:inherit;margin-bottom:3px">Orbit’s answers</div>
        ${P.realOrPretend.answers.map(a => `<div style="font-size:12.5px;line-height:1.35">${a}</div>`).join('')}
        <div style="font-size:12.5px;line-height:1.35;margin-top:3px">The code says: ${P.code.message.toLowerCase()}. Stop, close it, and tell a grown up.</div>
      </div>
      ${mini}
      <div style="opacity:0.75">${mazeSvg(mz, 11, { solution: true, sw: 1.6 })}</div>
    </div>`, { section: 'The back page', tint: C.pine })
}

// ── THE TASTER'S CLOSING PAGE ───────────────────────────────────────────
function tasterEnd() {
  const t = I.taster, P = I.puzzles, { ws, mz } = window.GT_SOLVED
  const mini = `<div style="display:grid;grid-template-columns:repeat(10,11px);border:1.5px solid var(--answer);padding:2px">${ws.grid.flat().map((ch, i) => `<span style="width:11px;height:11px;font-size:8.5px;font-weight:900;display:flex;align-items:center;justify-content:center;${ws.hits.has(`${Math.floor(i / 10)},${i % 10}`) ? 'background:#D8D8E4;color:#1A1A2E' : 'color:#B0B0C0'}">${ch}</span>`).join('')}</div>`
  return `<section class="gt-page" id="taster-end" data-page="end" aria-label="The free taster, closing page">${head('Free taster', C.pine)}<div class="gt-body">
    <div style="display:flex;align-items:center;gap:10px">${ribbon(t.planTitle, 'f-green', 26)}<span class="mono muted">${t.planKicker}</span></div>
    <p style="font-size:15.5px;margin:10px 0 8px">${t.planIntro}</p>
    <ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 14px">
      ${I.plan.steps.map((s, i) => `<li class="box thin" style="padding:8px 10px;display:flex;gap:9px;align-items:center">${icon(s.icon, 38)}<span class="stepno">${i + 1}</span><span class="d" style="font-size:16px;line-height:1.1">${s.head}</span></li>`).join('')}
    </ol>
    <div class="box f-paper" style="margin-top:16px;padding:12px 14px">
      <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><h2 class="d" style="font-size:24px">${t.fullTitle}</h2><span class="small b">${t.fullLine}</span></div>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin-top:10px">
        ${[2, 3, 5, 6, 7, 8, 10, 11].map(n => `<div style="border:2px solid ${INK};border-radius:4px;overflow:hidden;background:#fff"><img class="art" src="images/thumbs/page-${String(n).padStart(2, '0')}.png" alt="Page ${n} of the full issue" style="display:block;width:100%"></div>`).join('')}
      </div>
      <div class="flood" style="margin-top:12px;background:${C.pine};color:#fff;border:2.5px solid ${INK};border-radius:12px;padding:9px 14px;display:flex;align-items:center;gap:12px">${star(26)}<div><div class="mono" style="color:inherit">${t.whereKicker}</div><div class="d" style="font-size:20px;color:inherit">${t.where}</div></div></div>
    </div>
    <div class="box" style="margin-top:14px;padding:10px 14px;display:flex;gap:12px;align-items:center">
      ${plate('digi', '', 56, 'f-butter')}<div><div class="d" style="font-size:18px">${t.stageTitle}</div><p class="small b" style="margin-top:2px">${t.stageLine}</p></div>
    </div>
    <div class="upside" style="margin-top:auto;padding-top:12px;display:flex;gap:18px;align-items:flex-start">
      <div style="flex:1 1 0;min-width:0">
        <div class="mono" style="font-size:10px;color:inherit;margin-bottom:3px">Orbit’s answers</div>
        ${P.realOrPretend.answers.map(a => `<div style="font-size:12.5px;line-height:1.35">${a}</div>`).join('')}
        <div style="font-size:12.5px;line-height:1.35;margin-top:3px">The code says: ${P.code.message.toLowerCase()}. Stop, close it, and tell a grown up.</div>
      </div>
      ${mini}
      <div style="opacity:0.75">${mazeSvg(mz, 11, { solution: true, sw: 1.6 })}</div>
    </div>
  </div>${folio(0)}</section>`
}

const ORDER = TASTER ? [front, idCard, puzzles, tasterEnd] : [front, editor, plan, idCard, bigQuestion, appDesk, homework, sites, puzzles, make, shop, back]
document.getElementById('pages').innerHTML = ORDER.map(fn => fn()).join('')
document.title = TASTER ? `The Guided Times, Issue ${I.number}: the free taster` : `The Guided Times, Issue ${I.number}: ${I.edition}, ${I.month}`
})()
