// "7 TO RESOLVE" HAS TO LAND ON THE SEVEN.
//
// Justin, 8 August 2026: "this should take you to the actual 5 moments then
// back to page." It did not, because the number and the link were reading two
// different tables: the count is open rows in `concerns`, and the link went to
// /dashboard/moments, which lists `daily_moments`, the general card library. So
// a parent tapped their five and landed on a browse page that did not contain
// them. That was fixed by pointing the row at the list on the pathway page,
// which is where their own worries actually are.
//
// Justin, 17 September 2026, on the same row: "the bit after devices is
// moments, clicking it does not take to moments outstanding?"
//
// Fixed twice, broken a third way. A later session gave the next step rail on
// the pathway page the SAME id, and two elements with one id is not a tie: the
// browser takes whichever comes first in the document, which was the rail. So
// the six week old fix was undone by an id rather than by a decision, and
// nothing in the repo noticed.
//
// THIS GUARD HOLDS THE THREE THINGS THAT MAKE THE LINK TRUE:
//
//   1. The passport's moments row points at the list, not at the library.
//   2. The list carries the anchor.
//   3. NOBODY ELSE DOES. That is the rule that was missing, and it is the only
//      one of the three that a careful person could break by accident while
//      doing something entirely reasonable.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SECTIONS = 'lib/pathway/passport-sections.ts'
const LIST = 'components/pathway/IsItWorkingReport.tsx'
const ANCHOR = 'working-on'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── 1. THE ROW POINTS AT THE LIST ───────────────────────────────────────────
const sections = read(SECTIONS)
if (sections) {
  const bare = code(sections)
  // A fixed window rather than a lazy match to the next brace: the row's own
  // detail line carries a ternary, so the first closing brace lands long
  // before the href and the check read an empty slice as a missing link.
  const row = bare.match(/key:\s*'moments'[\s\S]{0,900}/)
  if (!row) {
    fail.push(`${SECTIONS}: the moments row is gone from the passport sections.`)
  } else {
    if (!new RegExp(`href:\\s*'/dashboard/pathway#${ANCHOR}'`).test(row[0])) {
      fail.push(`${SECTIONS}: the moments row no longer links to /dashboard/pathway#${ANCHOR}. The number counts open rows in \`concerns\`, and that anchor is the only place a parent can see those rows. Anywhere else and the count and the destination are reading different tables again, which is the 8 August bug.`)
    }
    if (/\/dashboard\/moments/.test(row[0])) {
      fail.push(`${SECTIONS}: the moments row points at /dashboard/moments, which lists daily_moments, the general card library. The count is the parent's own concerns. That is two different tables and it is exactly what Justin tapped into on 8 August.`)
    }
  }
}

// ── 2. THE LIST CARRIES THE ANCHOR ──────────────────────────────────────────
const list = read(LIST)
if (list && !new RegExp(`id="${ANCHOR}"`).test(code(list))) {
  fail.push(`${LIST}: the ${ANCHOR} anchor is gone from the list of moments, so the passport's row scrolls nowhere and a parent lands at the top of a long page.`)
}

// ── 3. AND NOBODY ELSE DOES ─────────────────────────────────────────────────
//
// The whole point. Walked rather than hardcoded, because the next collision
// will be in a file this guard has never heard of.
const roots = ['app', 'components']
const hits = []
const walk = dir => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) { walk(full); continue }
    if (!/\.(tsx|ts)$/.test(entry)) continue
    const bare = code(readFileSync(full, 'utf8'))
    const n = (bare.match(new RegExp(`id="${ANCHOR}"`, 'g')) ?? []).length
    for (let i = 0; i < n; i++) hits.push(full)
  }
}
for (const r of roots) { try { walk(r) } catch { /* nothing to walk */ } }

if (hits.length > 1) {
  fail.push(`${ANCHOR} is used as an id ${hits.length} times: ${hits.join(', ')}. Two elements with one id is not a tie, the browser takes whichever is first in the document, and the passport's moments row then scrolls to whatever that happens to be. Give the other one its own name.`)
} else if (hits.length === 0 && list) {
  fail.push(`nothing renders id="${ANCHOR}" at all, so the passport's moments row is a link to nowhere.`)
}

if (fail.length) {
  console.error('check-moments-anchor: the moments row does not land on the moments\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log(`check-moments-anchor: the passport's moments row points at the list of moments, and exactly one element answers to #${ANCHOR}.`)
