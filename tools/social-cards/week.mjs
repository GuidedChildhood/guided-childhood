#!/usr/bin/env node
/**
 * The Sunday batch: one week of social posts, rendered and listed.
 *
 *   node tools/social-cards/week.mjs content/packs/2026-10-12-social-week
 *
 * The folder holds one deck JSON per post, named so they sort in posting
 * order (1-mon-orbit-asks.json, 3-wed-road-to-16.json). Each deck carries
 * the cards for tools/social-cards plus a "post" block:
 *
 *   "post": {
 *     "day": "Monday 12 October", "time": "19:30",
 *     "channels": ["Instagram", "Facebook"],
 *     "instagram": "the caption", "facebook": "the longer post text",
 *     "alt": "alt text", "first_comment": "optional",
 *     "date": "2026-10-12", "photo": "for a real photo post with no cards:
 *       what to photograph"
 *   }
 *
 * It renders every deck, then writes THIS-WEEK.md into the same folder: per
 * post, when, where, which files and the words to paste. That file is what
 * Justin opens, and because it lives under content/packs, `npm run ai-tells`
 * sweeps every caption for dashes and stock phrases before anything ships.
 *
 * It also builds the week page, tools/social-cards/out/_week/<folder>/page.html
 * with its images, which the social-week skill publishes to the one pinned
 * "GDC posts" page: today's post first, the cards, a copy button per caption.
 *
 * Nothing here posts. Posting stays Justin's (decided 5 October 2026: the
 * Sunday batch, he schedules it in Meta Business Suite).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs'
import { join, resolve, basename, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const dir = resolve(process.argv[2] || '')
if (!process.argv[2]) {
  console.error('Usage: node tools/social-cards/week.mjs content/packs/<monday>-social-week')
  process.exit(1)
}

mkdirSync(join(HERE, 'out'), { recursive: true })
const decks = readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => join(dir, f))
if (!decks.length) { console.error(`No decks in ${dir}`); process.exit(1) }

const r = spawnSync(process.execPath, [join(HERE, 'render.mjs'), ...decks], { stdio: 'inherit' })
if (r.status !== 0) process.exit(r.status || 1)

const DASH = /[‐-―−]/
const problems = []
const pagePosts = []
const PAGE = join(HERE, 'out', '_week', basename(dir))
rmSync(PAGE, { recursive: true, force: true })
mkdirSync(join(PAGE, 'img'), { recursive: true })
const out = [`# This week's posts`, '',
  `Rendered from \`${dir.replace(process.cwd() + '/', '')}\` by \`tools/social-cards/week.mjs\`.`,
  'Each post: the files to upload, in order, and the words to paste. Facebook gets card one only.', '']

for (const p of decks) {
  const deck = JSON.parse(readFileSync(p, 'utf8'))
  const name = deck.name || basename(p, '.json')
  const post = deck.post || {}
  mkdirSync(join(HERE, 'out', name), { recursive: true })
  const files = readdirSync(join(HERE, 'out', name)).filter((f) => f.endsWith('.png')).sort()
  for (const [k, v] of Object.entries(post)) if (typeof v === 'string' && DASH.test(v)) problems.push(`${name}: dash in ${k}`)
  for (const c of deck.cards) for (const v of Object.values(c)) if (typeof v === 'string' && DASH.test(v)) problems.push(`${name}: dash on card ${c.name || c.type}`)

  out.push(`## ${post.day || name}${post.time ? `, ${post.time}` : ''}`, '',
    `**Where:** ${(post.channels || ['Instagram', 'Facebook']).join(' and ')}  `,
    `**Files:** ${files.map((f) => `\`tools/social-cards/out/${name}/${f}\``).join(', ')}`, '')
  if (post.photo) out.push('**Real photo:** ' + post.photo, '')
  if (post.instagram) out.push('**Instagram caption**', '', post.instagram, '')
  if (post.facebook) out.push('**Facebook post**', '', post.facebook, '')
  if (post.first_comment) out.push('**First comment**', '', post.first_comment, '')
  if (post.alt) out.push('**Alt text**', '', post.alt, '')

  cpSync(join(HERE, 'out', name), join(PAGE, 'img', name), { recursive: true })
  pagePosts.push({ ...post, name, title: deck.cards[0]?.headline || deck.cards[0]?.quote || name,
    files: files.map((f) => `img/${name}/${f}`) })
}

const monday = basename(dir).replace(/-social-week$/, '')
const d = new Date(monday + 'T12:00:00Z')
// An optional second argument labels the page, e.g. "Sample week".
const week = (process.argv[3] ? process.argv[3] + ', ' : 'Week of ') +
  (isNaN(d) ? monday : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }))
writeFileSync(join(PAGE, 'page.html'), pageHTML(week, pagePosts))
console.log(`wrote ${join(PAGE, 'page.html').replace(process.cwd() + '/', '')} and ${pagePosts.reduce((n, p) => n + p.files.length, 0)} images`)

writeFileSync(join(dir, 'THIS-WEEK.md'), out.join('\n') + '\n')
console.log(`\nwrote ${join(dir, 'THIS-WEEK.md').replace(process.cwd() + '/', '')}`)
if (problems.length) {
  console.error(`\n${problems.length} dash(es) to fix:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

/* The page Justin opens each morning. Authored for the Artifact viewer: no
   html, head or body tags, tokens with a dark theme, nothing that needs a
   download link (long press an image to save it). */
function pageHTML(week, posts) {
  const data = JSON.stringify(posts).replace(/</g, '\\u003c')
  return `<title>GDC posts</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>
/* One column of posts in posting order; today's post lifted to the top. */
:root{
  --bg:#F9F8F6; --card:#FFFFFF; --fg:#1A1A2E; --soft:#52526A; --line:#EAEAF0;
  --gold:#EDC35F; --gold-dark:#C99A28; --done:#2F8F6B;
  --display:'Nunito',ui-rounded,system-ui,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1D1A12;--card:#2E2818;--fg:#FFF9E8;--soft:#CFC5A8;--line:#3E3726;--gold-dark:#EDC35F;--done:#5FC49B;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1D1A12;--card:#2E2818;--fg:#FFF9E8;--soft:#CFC5A8;--line:#3E3726;--gold-dark:#EDC35F;--done:#5FC49B;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--display);font-size:16px;line-height:1.45}
.wrap{max-width:760px;margin:0 auto;padding-inline:16px;padding-block:28px 64px;display:flex;flex-direction:column;gap:28px}
.eyebrow{font-family:var(--mono);font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-dark)}
h1{font-weight:900;font-size:clamp(28px,6vw,40px);line-height:1.05;letter-spacing:-.02em;margin:6px 0 0;text-wrap:balance}
.lede{color:var(--soft);font-weight:600;margin:8px 0 0;max-width:60ch}
.post{background:var(--card);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:16px;border:1px solid var(--line)}
.post.today{border:2px solid var(--gold);box-shadow:0 5px 0 var(--gold-dark)}
.head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px}
.when{font-weight:900;font-size:22px}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-family:var(--mono);font-weight:600;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;border-radius:8px;background:var(--bg);color:var(--soft)}
.chip.now{background:var(--gold);color:#1A1A2E}
.strip{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px}
.strip a{flex:none;width:min(62vw,240px);scroll-snap-align:start}
.strip img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:10px;border:1px solid var(--line)}
.hint{font-family:var(--mono);font-size:11px;color:var(--soft);letter-spacing:.06em}
.copy{display:flex;flex-direction:column;gap:8px}
.copy .top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.copy p{margin:0;white-space:pre-wrap;color:var(--fg);font-weight:600;background:var(--bg);border-radius:12px;padding:12px 14px;min-width:0;overflow-wrap:anywhere}
button{font-family:var(--display);font-weight:800;font-size:14px;border:0;border-radius:12px;padding:8px 14px;background:var(--gold);color:#1A1A2E;box-shadow:0 3px 0 var(--gold-dark);cursor:pointer}
button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--fg);outline-offset:2px}
label.done{display:flex;align-items:center;gap:10px;font-weight:800;color:var(--soft)}
label.done input{width:20px;height:20px;accent-color:var(--done)}
.post.is-done{opacity:.6}
@media (prefers-reduced-motion: reduce){*{scroll-behavior:auto}}
</style>
<div class="wrap">
  <header>
    <div class="eyebrow">${week}</div>
    <h1>This week's posts</h1>
    <p class="lede">Today's post is first. Swipe the cards, press and hold one to save it, copy the words, post. Facebook takes card one only.</p>
  </header>
  <main id="posts" style="display:flex;flex-direction:column;gap:20px"></main>
</div>
<script>
const POSTS = ${data};
const todayISO = new Date().toLocaleDateString('en-CA');
const esc = (t) => String(t || '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip = (t) => String(t || '').replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim();
let order = POSTS.map((p, i) => ({ ...p, i }));
const next = order.find((p) => p.date && p.date >= todayISO);
if (next) order = [next, ...order.filter((p) => p !== next)];
const key = (p) => 'gdc-posted-' + p.name;
const read = (k) => { try { return localStorage.getItem(k) === '1' } catch { return false } };
const write = (k, v) => { try { v ? localStorage.setItem(k, '1') : localStorage.removeItem(k) } catch {} };
const blocks = [['instagram', 'Instagram caption'], ['facebook', 'Facebook post'], ['first_comment', 'First comment'], ['alt', 'Alt text']];
document.getElementById('posts').innerHTML = order.map((p) => \`
  <section class="post \${p === next && p.date === todayISO ? 'today' : ''} \${read(key(p)) ? 'is-done' : ''}" data-name="\${esc(p.name)}">
    <div class="head"><div>\${p === next ? '<div class="eyebrow">' + (p.date === todayISO ? 'Today' : 'Next up') + '</div>' : ''}
      <div class="when">\${esc(p.day || p.name)}\${p.time ? ', ' + esc(p.time) : ''}</div></div>
      <div class="chips">\${(p.channels || ['Instagram', 'Facebook']).map((c) => '<span class="chip">' + esc(c) + '</span>').join('')}</div></div>
    <div class="strip">\${p.files.map((f, n) => '<a href="' + f + '" target="_blank" rel="noopener"><img src="' + f + '" alt="Card ' + (n + 1) + ' of ' + p.files.length + '"></a>').join('')}</div>
    \${p.photo ? '<div class="copy"><span class="eyebrow">Real photo</span><p>' + esc(p.photo) + '</p></div>' : ''}
    \${p.files.length ? '<div class="hint">' + p.files.length + ' card' + (p.files.length > 1 ? 's' : '') + ' · ' + esc(strip(p.title)) + '</div>' : ''}
    \${blocks.filter(([k]) => p[k]).map(([k, label]) => '<div class="copy"><div class="top"><span class="eyebrow">' + label + '</span><button type="button" data-copy="' + k + '">Copy</button></div><p>' + esc(p[k]) + '</p></div>').join('')}
    <label class="done"><input type="checkbox" id="done-\${esc(p.name)}" \${read(key(p)) ? 'checked' : ''}> Posted</label>
  </section>\`).join('');
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-copy]'); if (!b) return;
  const name = b.closest('.post').dataset.name, p = POSTS.find((x) => x.name === name), text = p[b.dataset.copy];
  try { await navigator.clipboard.writeText(text); b.textContent = 'Copied' }
  catch { const r = document.createRange(); r.selectNodeContents(b.closest('.copy').querySelector('p')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected' }
  setTimeout(() => { b.textContent = 'Copy' }, 1600);
});
document.addEventListener('change', (e) => {
  if (!e.target.matches('label.done input')) return;
  const sec = e.target.closest('.post'); write('gdc-posted-' + sec.dataset.name, e.target.checked); sec.classList.toggle('is-done', e.target.checked);
});
</script>
`
}
