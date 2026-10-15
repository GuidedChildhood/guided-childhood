// The read sheet for the talking head reels, in the Kitchen Cut style
// (STYLE.md). One source, two outputs: READ-SHEET.md for the repo and
// READ-SHEET.pdf to print or read from a tablet beside the phone. Every line
// is one breath; the badge says which angle or insert it is.
//   node read-sheet.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_DIR || '/opt/node-tools/node_modules/playwright/index.mjs')
import { writeFileSync } from 'node:fs'

const here = new URL('.', import.meta.url).pathname
const root = new URL('../../', import.meta.url).pathname

// kind: A (front, eye level), B (close, 45 degrees), INSERT (hands and
// objects, filmed once), SCREEN (real app screen), END (the still ending).
// cut: what the edit does on this line. say: the words, said exactly.
const REELS = [
  {
    n: 1, story: 24, title: 'Why the settings didn’t stop the arguments', secs: 40,
    lines: [
      { kind: 'A', say: 'I set up every parental control we had.', cut: 'Freeze frame name card' },
      { kind: 'B', say: 'Every single one.', cut: 'Jump cut' },
      { kind: 'INSERT', shot: 'Thumb switching toggles off in Screen Time', cut: 'Three clicks' },
      { kind: 'A', say: 'The arguments carried on exactly the same.' },
      { kind: 'INSERT', shot: 'Bedroom door shut hard, from the landing', cut: 'Smash cut, door slam' },
      { kind: 'B', say: 'Because settings decide what the screen can do.' },
      { kind: 'B', say: 'They don’t decide how it ends.' },
      { kind: 'A', say: 'And the fight is nearly always at the ending.' },
      { kind: 'A', say: 'So here’s what to try tonight.', cut: 'Speed ramp in' },
      { kind: 'B', say: 'Not at the screen. In a calm moment.' },
      { kind: 'B', say: 'Ask them one question. What ends it?' },
      { kind: 'INSERT', shot: 'TV switched off / kitchen timer twisted / plate put on the table', cut: 'Time jump, three hits' },
      { kind: 'A', say: 'The end of the episode. The kitchen timer. Or tea on the table.' },
      { kind: 'B', say: 'They pick. That’s the deal.' },
      { kind: 'A', say: 'And you don’t add a warning on top.' },
      { kind: 'SCREEN', shot: 'The script card in the app', cut: 'Gold line jump' },
      { kind: 'END', say: 'What stage is your child? Three questions, no sign up.' },
    ],
  },
  {
    n: 2, story: 5, title: 'When they say everyone else has it', secs: 40,
    lines: [
      { kind: 'A', say: '“But everyone else is allowed.”', cut: 'Freeze frame name card' },
      { kind: 'B', say: 'You’ve got about one sentence before that’s a row.' },
      { kind: 'INSERT', shot: 'Phone put face down on the kitchen table', cut: 'Smash cut, one thud' },
      { kind: 'A', say: 'So make the first one about the feeling.' },
      { kind: 'B', say: 'Not the phone.', cut: 'Jump cut' },
      { kind: 'A', say: '“It’s hard being the only one without it.”' },
      { kind: 'B', say: 'Then split it in two.' },
      { kind: 'A', say: 'Belonging is one question. The phone is another.' },
      { kind: 'B', say: 'Is there another way in while you wait?' },
      { kind: 'INSERT', shot: 'Family tablet on the sofa / football in the hall / shoes by the front door', cut: 'Time jump, three hits' },
      { kind: 'A', say: 'And if the answer is not yet, give it a reason.' },
      { kind: 'B', say: 'And a date.', cut: 'Jump cut' },
      { kind: 'A', say: 'A no with a date is easier to live with than a no.', cut: 'Gold underline' },
      { kind: 'SCREEN', shot: 'The everyone else moment in the app', cut: 'Gold line jump' },
      { kind: 'END', say: 'What stage is your child? Three questions, no sign up.' },
    ],
  },
  {
    n: 3, story: 10, title: 'The iPhone setup is the easy bit', secs: 40,
    lines: [
      { kind: 'A', say: 'If you’ve spent an hour in Screen Time…', cut: 'Freeze frame name card' },
      { kind: 'INSERT', shot: 'Tea poured / tea gone cold / lamp switched on / clock', cut: 'Time jump, four hits, speed ramp' },
      { kind: 'B', say: '…and you’re still not sure you got it right.' },
      { kind: 'A', say: 'You’re not doing it wrong. It’s complicated.' },
      { kind: 'B', say: 'Here’s the order I’d do it in.' },
      { kind: 'A', say: 'One. Lock it down. Everything off.', cut: 'Number pop' },
      { kind: 'INSERT', shot: 'Thumb switching toggles off in Screen Time', cut: 'Three clicks' },
      { kind: 'B', say: 'Two. Let one thing back in at a time.', cut: 'Number pop' },
      { kind: 'A', say: 'Three. The bit most guides skip.', cut: 'Number pop' },
      { kind: 'B', say: 'Decide now what they need to show before the next thing comes back.' },
      { kind: 'SCREEN', shot: 'The first phone ladder in the app', cut: 'Gold line jump' },
      { kind: 'A', say: 'Settings decide today.' },
      { kind: 'B', say: 'What they can handle decides the next few years.' },
      { kind: 'END', say: 'What stage is your child? Three questions, no sign up.' },
    ],
  },
]

// The inserts, filmed once and reused. Hands and objects only.
const INSERTS = [
  'Bedroom door shut hard, filmed from the landing',
  'Phone put face down on the kitchen table',
  'Your own phone: thumb switching Screen Time toggles off (or a screen recording)',
  'TV switched off with the remote',
  'Kitchen timer twisted',
  'Plate put down on the table',
  'Tea poured into a mug, then the same mug gone cold',
  'Lamp switched on',
  'Clock on the wall',
  'Family tablet lying on the sofa, screen off',
  'Football in the hall',
  'Shoes by the front door',
]

const BADGE = {
  A: ['A', 'Front, eye level'], B: ['B', 'Close, side on'], INSERT: ['INSERT', 'Hands and objects'],
  SCREEN: ['SCREEN', 'App screen, added in the edit'], END: ['END', 'Angle A, still, to camera'],
}

// Markdown, for the repo.
let md = `# Read sheet: the Kitchen Cut versions of reels 24, 5 and 10

Generated by \`read-sheet.mjs\` (the PDF is \`READ-SHEET.pdf\`). The style is in
\`STYLE.md\`. Say each line in one breath. Film every A line and every END line
in setup A, then every B line in setup B. Inserts are filmed once from the list
at the end. SCREEN lines are added in the edit; say nothing for them.

Every fix is the app's own wording: free script 9671 (the stopping point), the
"everyone else has a phone" moment, and the first phone setup page. Your scene
in each is from the GREEN list in \`content/brand-story/founder-context.md\`.
`
for (const r of REELS) {
  md += `\n## Reel ${r.n} (story ${r.story}). Title card: ${r.title.toUpperCase()}\n\nAbout ${r.secs} seconds.\n\n| # | Angle | Say or film | Edit |\n|---|---|---|---|\n`
  r.lines.forEach((l, i) => {
    md += `| ${i + 1} | ${l.kind} | ${l.say ? l.say : `*${l.shot}*`} | ${l.cut || ''} |\n`
  })
}
md += `\n## The inserts, filmed once\n\nTwo seconds each, steady, good light. Hands and objects only, no faces.\n\n${INSERTS.map(s => `- ${s}`).join('\n')}\n`
writeFileSync(`${here}READ-SHEET.md`, md)

// The PDF: big type, one reel per page, a badge per line.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const css = `
@font-face{font-family:Nunito;src:url(file://${root}app/fonts/nunito-latin-wght-normal.woff2) format('woff2');font-weight:200 1000;}
@font-face{font-family:Plex;src:url(file://${root}app/fonts/ibm-plex-mono-latin-600-normal.woff2) format('woff2');font-weight:600;}
@page{size:A4;margin:13mm 15mm;}
:root{--cream:#F9F8F6;--ink:#1A1A2E;--soft:#52526A;--gold:#EDC35F;--goldd:#C99A28;--butter:#FFF6DE;--teal:#2E2818;}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Nunito,sans-serif;color:var(--ink);background:#fff;font-size:13pt;line-height:1.35;}
section{page-break-after:always;}
section:last-child{page-break-after:auto;}
.eyebrow{font-family:Plex;font-weight:600;font-size:9pt;letter-spacing:.14em;text-transform:uppercase;color:var(--goldd);}
h1{font-weight:900;font-size:30pt;line-height:1.05;letter-spacing:-.02em;margin:6px 0 10px;}
h2{font-weight:900;font-size:17pt;margin:18px 0 8px;}
p{margin:0 0 8px;color:var(--soft);}
.u{background-image:linear-gradient(var(--gold),var(--gold));background-repeat:no-repeat;background-size:100% 6px;background-position:0 92%;}
ol.how{margin:6px 0 0 20px;} ol.how li{margin:0 0 7px;}
.row{display:flex;gap:12px;align-items:flex-start;padding:6px 0;border-bottom:1px solid #ECE9E2;break-inside:avoid;}
.num{font-family:Plex;font-weight:600;font-size:9pt;color:var(--soft);width:18px;padding-top:7px;flex:none;}
.badge{flex:none;width:64px;text-align:center;font-family:Plex;font-weight:600;font-size:9pt;letter-spacing:.08em;
  border:2px solid var(--ink);border-radius:9px;padding:5px 0;margin-top:2px;}
.b-A{background:var(--gold);} .b-B{background:#fff;} .b-INSERT{background:var(--ink);color:#fff;}
.b-SCREEN{background:#DCEBF7;} .b-END{background:var(--gold);box-shadow:0 3px 0 var(--goldd);}
.say{font-weight:800;font-size:17pt;line-height:1.2;letter-spacing:-.01em;}
.shot{font-weight:600;font-size:13pt;font-style:italic;color:var(--soft);}
.cut{font-family:Plex;font-weight:600;font-size:8.5pt;letter-spacing:.06em;text-transform:uppercase;color:var(--goldd);margin-top:3px;}
.title{background:var(--butter);border:2px solid var(--ink);border-radius:14px;box-shadow:0 4px 0 var(--ink);padding:12px 16px;margin:4px 0 12px;}
.title b{font-weight:900;font-size:16pt;}
.key{display:flex;flex-wrap:wrap;gap:8px 14px;margin:8px 0 4px;font-size:10.5pt;color:var(--soft);}
.key span{display:flex;gap:6px;align-items:center;}
.key .badge{width:auto;padding:2px 7px;margin:0;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;margin-top:8px;}
.grid div{font-size:12pt;padding:8px 10px;border:1.5px solid #E2DED5;border-radius:10px;}
.foot{margin-top:14px;font-size:10pt;color:var(--soft);}
`
const key = Object.entries(BADGE).map(([k, [lab, txt]]) => `<span><i class="badge b-${k}">${lab}</i>${txt}</span>`).join('')
let html = `<section>
  <div class="eyebrow">Guided Childhood · Read sheet · 15 October 2026</div>
  <h1>Three reels in the <span class="u">Kitchen Cut</span></h1>
  <p>His skeleton: a title card on top, you to camera, one fix in 40 seconds, big captions. Our cutting: two angles that swap every line, a freeze frame name card, smash cut inserts with one sound, time jumps, and a gold line that carries you to the app.</p>
  <h2>How to film</h2>
  <ol class="how">
    <li><b>Setup A.</b> Phone portrait at eye level, an arm's length away, window light in front of you. Read every <b>A</b> and <b>END</b> line, top to bottom.</li>
    <li><b>Setup B.</b> Move the phone closer and 45 degrees to one side, a little lower. Read every <b>B</b> line.</li>
    <li><b>One breath per line.</b> Pause two seconds between lines. Stumble? Say it again and carry on. The edit cuts the rest.</li>
    <li><b>Say nothing for INSERT and SCREEN lines.</b> Inserts come from the list on the last page; screens are added in the edit.</li>
    <li><b>The last line is always the same, word for word,</b> still and to camera.</li>
    <li><b>Send everything over.</b> Do not trim on the phone.</li>
  </ol>
  <h2>The badges</h2>
  <div class="key">${key}</div>
  <p class="foot">Never on camera: a child's face or name, a real child's screen, fear, a statistic as the hook. One fix per reel. The style is written down in STYLE.md so every reel after these looks the same.</p>
</section>`
for (const r of REELS) {
  html += `<section>
    <div class="eyebrow">Reel ${r.n} of 3 · Story ${r.story} · About ${r.secs} seconds</div>
    <div class="title"><span class="eyebrow">Title card on screen the whole time</span><br><b>${esc(r.title)}</b></div>
    ${r.lines.map((l, i) => `<div class="row"><div class="num">${i + 1}</div><div class="badge b-${l.kind}">${BADGE[l.kind][0]}</div><div>
      ${l.say ? `<div class="say">${esc(l.say)}</div>` : `<div class="shot">${esc(l.shot)}</div>`}
      ${l.cut ? `<div class="cut">${esc(l.cut)}</div>` : ''}</div></div>`).join('')}
  </section>`
}
html += `<section>
  <div class="eyebrow">Filmed once, used in all three</div>
  <h1>The inserts</h1>
  <p>Two seconds each, phone steady, good light. Hands and objects only, no faces. These are the smash cuts and the time jumps.</p>
  <div class="grid">${INSERTS.map(s => `<div>${esc(s)}</div>`).join('')}</div>
</section>`

const file = `${here}work/read-sheet.html`
writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`)
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`file://${file}`)
await page.evaluate(() => document.fonts.ready)
if (!(await page.evaluate(() => document.fonts.check('800 20px Nunito')))) throw new Error('Nunito did not load')
await page.pdf({ path: `${here}READ-SHEET.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true })
await browser.close()
console.log('wrote READ-SHEET.md and READ-SHEET.pdf')
