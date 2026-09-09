// Does every colour the app asks for actually exist?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// `--butter` was used sixteen times and defined nowhere the app imports. It
// lived in four standalone HTML files under content/ and tools/, which are
// artwork, not code. So every `background: var(--butter)` was an unresolved
// custom property, and an unresolved custom property does not fall back to
// something sensible: it makes the WHOLE declaration invalid at computed value
// time. The element painted nothing. The child's jobs and week screens, the
// printables sheet and five ref pages rendered on whatever happened to be
// behind them, for weeks.
//
// Nothing errored. Nothing logged. Typescript was perfectly happy, because a
// colour is a string. The wiring check did not see it, because the import
// graph was fine. The only way to find it was to open a browser and read
// getComputedStyle, which is exactly the kind of thing nobody does on a
// Tuesday.
//
// So it gets a check that runs on every push. Sweeping for the one token found
// five more in the same state (--butter-dark, --butter-lt, --sage,
// --coral-dark, --gold-hover), which is the argument for the check rather than
// for the one line fix.
//
// ── WHAT COUNTS AS DEFINED ──────────────────────────────────────────────────
//
// Three ways, and all three are legitimate, so all three pass:
//
//   1. a global stylesheet the app imports (shared/tokens.css, app/globals.css,
//      schools/app/schools.css)
//   2. the same file that uses it, for a token scoped to one component, whether
//      in an inline <style> block or a style={{ '--x': ... }} prop
//   3. a fallback at the call site, `var(--x, #EDC35F)`, which is what the
//      declaration will use and is a deliberate belt and braces
//
// next/font sets --font-nunito and --font-ibm-plex-mono on the root element
// from Javascript, so those are named as known-good rather than found.
//
// Usage: node scripts/check-tokens.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOTS = ['app', 'components', 'lib', 'shared', 'schools']
const GLOBAL_SHEETS = ['shared/tokens.css', 'app/globals.css', 'schools/app/schools.css']

/** Set on the root element by next/font, never written in CSS. */
const SET_AT_RUNTIME = new Set(['--font-nunito', '--font-ibm-plex-mono'])

function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.next' || e.startsWith('.')) continue
    const p = join(dir, e)
    let st
    try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) walk(p, out)
    else if (['.ts', '.tsx', '.css'].includes(extname(e))) out.push(p)
  }
  return out
}

const files = ROOTS.flatMap(r => walk(r))
const read = new Map()
for (const f of files) {
  try { read.set(f, readFileSync(f, 'utf8')) } catch { /* unreadable is not our problem */ }
}

/** Every custom property a file DEFINES, in CSS or as a JSX style key. */
function definedIn(src) {
  const names = new Set()
  for (const m of src.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) names.add(m[1])
  for (const m of src.matchAll(/['"](--[a-zA-Z0-9-]+)['"]\s*:/g)) names.add(m[1])
  return names
}

const globallyDefined = new Set(SET_AT_RUNTIME)
for (const sheet of GLOBAL_SHEETS) {
  const src = read.get(sheet)
  if (src) for (const n of definedIn(src)) globallyDefined.add(n)
}

// A token defined in ANY .css file the app can reach counts too: a component
// stylesheet is as real as the token file.
for (const [f, src] of read) {
  if (extname(f) === '.css') for (const n of definedIn(src)) globallyDefined.add(n)
}

const failures = []
for (const [f, src] of read) {
  const local = definedIn(src)
  for (const m of src.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*(,)?/g)) {
    const [, name, hasFallback] = m
    if (hasFallback) continue
    if (globallyDefined.has(name) || local.has(name)) continue
    // `var(--stage-${n})` and friends: the name is built at runtime, so the
    // literal text here is a fragment and never a token anybody defines.
    if (src.slice(m.index, m.index + m[0].length + 2).includes('${')) continue
    const line = src.slice(0, m.index).split('\n').length
    failures.push({ name, file: f, line })
  }
}

const byToken = new Map()
for (const x of failures) {
  if (!byToken.has(x.name)) byToken.set(x.name, [])
  byToken.get(x.name).push(x)
}

console.log(`${globallyDefined.size} tokens defined globally, ${files.length} files read\n`)
if (byToken.size === 0) {
  console.log('PASS  every var(--token) resolves, or carries a fallback')
  process.exit(0)
}

for (const [name, uses] of [...byToken].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`FAIL  ${name} is used ${uses.length} time${uses.length === 1 ? '' : 's'} with no definition and no fallback`)
  for (const u of uses.slice(0, 6)) console.log(`        ${u.file}:${u.line}`)
  if (uses.length > 6) console.log(`        ...and ${uses.length - 6} more`)
}
console.log(`\n${byToken.size} undefined token${byToken.size === 1 ? '' : 's'}.`)
console.log('An unresolved var makes the whole declaration invalid, so this is')
console.log('not a wrong colour, it is no colour. Define it in shared/tokens.css')
console.log('(alias an existing house colour, never invent a new hex) or give the')
console.log('call site a fallback.')
process.exit(1)
