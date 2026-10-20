// No new hand typed colours. The old ones may stay until someone is there anyway.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// shared/tokens.css is the one place a colour is decided. Change --ink there
// and both apps move together, which is the point. A hex typed straight into a
// component does not move. The review board on 13 October 2026 counted about
// 1,400 of them across app and components: some are a token spelled by hand
// ('#fff' for --white, '#1A1A2E' for --ink), some are colours the palette has
// never heard of, and every one is a place the next palette change misses.
//
// Rewriting 1,400 values in one go would touch three hundred files for no
// visible gain and collide with every open branch. So this is a ratchet, not a
// sweep: scripts/hex-baseline.json records what is there today, per file and
// per value, and the guard fails only when a file holds MORE of a value than
// the baseline allows. Old code is left alone. New code reaches for var().
//
// ── THE RULE ────────────────────────────────────────────────────────────────
//
// A hex colour literal in app, components, shared, schools/app or
// schools/components counts, in .tsx, .ts and .css, except:
//
//   - shared/tokens.css, which is where colours are supposed to be written
//   - a fallback inside var(--token, #hex), which the token guard already
//     treats as a deliberate belt and braces
//   - comments
//   - a line carrying `hex-ok:` with a reason, for the places a custom
//     property cannot reach: an ImageResponse (OG images, app icons), an
//     email body, a canvas, a PDF. The reason is the point; a bare hex-ok
//     with nothing after it does not count.
//
// When the guard fails it names the token the value already is, if it is one,
// so the fix is usually a find and replace on one line.
//
// ── ONLY EVER SHORTER ───────────────────────────────────────────────────────
//
// Fewer hex than the baseline passes and says so. `--update` writes the lower
// counts back and drops files that reach zero. It never raises a count and
// never adds a file, so the baseline can only shrink: a new hex can only get
// in by editing the JSON by hand, in a diff a reviewer reads.
//
// Usage: node scripts/check-hex-ratchet.mjs [--update]

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BASELINE = join(ROOT, 'scripts/hex-baseline.json')
const DIRS = ['app', 'components', 'shared', 'schools/app', 'schools/components']
const SKIP_FILES = new Set(['shared/tokens.css'])
const EXT = /\.(tsx|ts|css)$/
const UPDATE = process.argv.includes('--update')

function* walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (EXT.test(name) && !name.endsWith('.d.ts')) yield p
  }
}

// Comments out, keeping the newlines so line numbers still point at the code.
function stripComments(src) {
  return src
    // A block comment opens at a line start or after a space, a brace, a paren,
    // a comma or a semicolon, so 'image/*' in a string is not mistaken for one.
    .replace(/(^|[\s{(,;])\/\*[\s\S]*?\*\//gm, (m, pre) => pre + m.slice(pre.length).replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/gm, (m, pre) => pre + ' '.repeat(m.length - pre.length))
}

// #abc, #abcd, #aabbcc, #aabbccdd, standing on its own. The lookbehind keeps
// out HTML entities (&#123;) and anything glued to a word.
const HEX = /(?<![&\w#])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g
const FALLBACK = /var\(\s*--[\w-]+\s*,\s*#[0-9a-fA-F]{3,8}\s*\)/g

export function countHex(src) {
  const counts = {}
  const lines = stripComments(src).split('\n')
  const raw = src.split('\n')
  const firstLine = {}
  lines.forEach((line, i) => {
    if (/hex-ok:\s*\S/.test(raw[i])) return
    const clean = line.replace(FALLBACK, '')
    for (const m of clean.matchAll(HEX)) {
      const v = '#' + m[1].toLowerCase()
      counts[v] = (counts[v] ?? 0) + 1
      firstLine[v] ??= i + 1
    }
  })
  return { counts, firstLine }
}

// What each hex already is, so the failure can say "write var(--ink)".
function tokenNames() {
  const css = readFileSync(join(ROOT, 'shared/tokens.css'), 'utf8')
  const map = {}
  for (const m of css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{3,8})\b/g)) {
    const v = m[2].toLowerCase()
    map[v] ??= m[1]
  }
  const expand = v => v.length === 4 ? '#' + [...v.slice(1)].map(c => c + c).join('') : v
  for (const v of Object.keys(map)) map[expand(v)] ??= map[v]
  map['#fff'] ??= map['#ffffff']
  return map
}

const current = {}
const where = {}
for (const dir of DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file)
    if (SKIP_FILES.has(rel)) continue
    const { counts, firstLine } = countHex(readFileSync(file, 'utf8'))
    if (Object.keys(counts).length) { current[rel] = counts; where[rel] = firstLine }
  }
}

const total = o => Object.values(o).reduce((a, c) => a + Object.values(c).reduce((x, y) => x + y, 0), 0)

if (!existsSync(BASELINE)) {
  if (!process.argv.includes('--init')) {
    console.error('No scripts/hex-baseline.json. Run with --init once to record today.')
    process.exit(1)
  }
  writeFileSync(BASELINE, JSON.stringify(sortKeys(current), null, 1) + '\n')
  console.log(`Recorded ${total(current)} hex values across ${Object.keys(current).length} files.`)
  process.exit(0)
}

function sortKeys(o) {
  return Object.fromEntries(Object.keys(o).sort().map(k => [k,
    typeof o[k] === 'object' ? Object.fromEntries(Object.keys(o[k]).sort().map(j => [j, o[k][j]])) : o[k]]))
}

const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'))
const tokens = tokenNames()
const over = []
let slack = 0

for (const [file, counts] of Object.entries(current)) {
  for (const [hex, n] of Object.entries(counts)) {
    const allowed = baseline[file]?.[hex] ?? 0
    if (n > allowed) {
      const token = tokens[hex]
      over.push(`${file}:${where[file][hex]}  ${hex} x${n - allowed} new${token ? `  (that is ${token}, write var(${token}))` : '  (not a token: pick the nearest one in shared/tokens.css)'}`)
    }
  }
}
for (const [file, counts] of Object.entries(baseline)) {
  for (const [hex, n] of Object.entries(counts)) slack += Math.max(0, n - (current[file]?.[hex] ?? 0))
}

if (UPDATE) {
  const next = {}
  for (const [file, counts] of Object.entries(baseline)) {
    for (const [hex, n] of Object.entries(counts)) {
      const keep = Math.min(n, current[file]?.[hex] ?? 0)
      if (keep > 0) (next[file] ??= {})[hex] = keep
    }
  }
  writeFileSync(BASELINE, JSON.stringify(sortKeys(next), null, 1) + '\n')
  console.log(`Baseline lowered by ${slack}. It now holds ${total(next)} across ${Object.keys(next).length} files.`)
  if (!over.length) process.exit(0)
}

if (over.length) {
  console.error(`Hex ratchet: ${over.length} new hand typed colour${over.length === 1 ? '' : 's'}\n`)
  for (const o of over) console.error('  ' + o)
  console.error(`\nColours live in shared/tokens.css. Write var(--token) instead. Where a custom`)
  console.error(`property cannot reach (an OG image, an email, a canvas), put "hex-ok: <why>"`)
  console.error(`on the line. See the header of scripts/check-hex-ratchet.mjs.`)
  process.exit(1)
}

console.log(`Hex ratchet: no new hand typed colours. ${total(current)} old ones left across ${Object.keys(current).length} files.` +
  (slack ? ` ${slack} fewer than the baseline: run with --update to lock that in.` : ''))
