// The free printables keep their promises (13 October 2026).
//
// Each free printable is a magnet in lib/magnets/registry.ts whose files ship
// in public/printables/free, rendered by scripts/render-free-printables.mjs.
// This checks what a parent would otherwise find broken: every file the
// download and the email name is really there, the page previews the /free
// page shows exist, the words carry no dash (the house rule), and the
// newspaper's QR code and page lead to the stage check with its source on.

import { readFileSync, existsSync } from 'node:fs'

let failures = 0
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failures++
}

const reg = readFileSync('lib/magnets/registry.ts', 'utf8')
const block = reg.slice(reg.indexOf("'planet-post-1': {"))
const hrefs = [...block.matchAll(/'(\/printables\/free\/[^']+)'/g)].map(m => m[1])
check('the Planet Post magnet names its A4 file and four more', hrefs.length >= 5)
for (const h of hrefs) check(`${h} is in public`, existsSync(`public${h}`))
for (const n of [1, 2, 3, 4]) check(`page ${n} preview exists`, existsSync(`public/printables/free/planet-post-1-p${n}.png`))

const issue = readFileSync('lib/printables/free/planet-post.ts', 'utf8')
const strings = [...issue.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1]).filter(t => /\s/.test(t))
const dashed = strings.filter(t => /\s[-–—]\s|–|—/.test(t))
check(`no dash in the newspaper's words${dashed.length ? `: ${dashed[0]}` : ''}`, dashed.length === 0)
check('the QR code leads to the stage check with its source', /url: 'https:\/\/www\.guidedchildhood\.com\/starter-pack\?src=planet-post-1'/.test(issue))
const grid = [...issue.matchAll(/^\s+'([A-Z]{10})',$/gm)].map(m => m[1])
check('the word search is ten rows of ten', grid.length === 10)
const words = ['FOOTBALL', 'PUZZLE', 'GARDEN', 'DANCE', 'BAKE', 'READ', 'DRAW', 'BIKE']
const cols = Array.from({ length: 10 }, (_, c) => grid.map(r => r[c]).join(''))
const missing = words.filter(w => !grid.some(r => r.includes(w)) && !cols.some(c => c.includes(w)))
check(`every word is in the word search${missing.length ? ` (missing ${missing.join(', ')})` : ''}`, missing.length === 0)

const page = readFileSync('app/(marketing)/free/planet-post/page.tsx', 'utf8')
check('the page gates the download on the Planet Post magnet', /<MagnetGate\s+slug="planet-post-1"/.test(page))
check('the page ends at the stage check', /href="\/starter-pack\?src=planet-post-1"/.test(page))
check('the print route never serves the live site', /VERCEL_ENV === 'production'\) notFound\(\)/.test(readFileSync('app/print-free/[slug]/page.tsx', 'utf8')))

// The fixes from the 14 October critique and accessibility audit, held.
const layout = readFileSync('components/printables/news/PlanetPost.tsx', 'utf8')
check('no message bubble is coloured by its place in the list (the colour gave the answer away)', !/i === \d+ \? CRAYON/.test(layout))
check('the Friends line up uses the approved waving stills', /moods\?\.wave/.test(layout))
check('the PDFs are rendered tagged, so screen readers can read them', /tagged: true/.test(readFileSync('scripts/render-free-printables.mjs', 'utf8')))

if (failures) { console.error(`\n${failures} free printable check(s) failed`); process.exit(1) }
console.log('\nFree printables: every file there, every word clean')
