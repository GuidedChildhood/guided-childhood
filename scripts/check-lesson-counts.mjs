#!/usr/bin/env node
// A LESSON MAY NOT COUNT A SCHEME THAT DOES NOT EXIST (21 September 2026).
//
// DiGi closed ks5-20 with "Twenty modules, and here is where they were all
// heading" for months after the scheme stopped having twenty modules. It was
// written when there were 21 and this was the 20th of them, and then four
// modules were added, and then four more, and the sentence stayed. Nothing
// caught it, because a number inside a slide is content in the database, and
// every count guard we had watched the pages instead.
//
// That is the whole reason this exists. check-curriculum-honesty.mjs holds the
// marketing pages to MODULE_COUNT, and the pages have been right for months.
// The wall was wrong the entire time, in front of the one audience that cannot
// check: a class who have no idea how many modules there are supposed to be.
//
// THE RULE. If a lesson states a number of modules, it must be a number that
// is true from where that lesson stands:
//
//   * the scheme total, for a line about the whole programme, or
//   * the lesson's own position in the order the scheme teaches, for a line
//     counting what led here, which is the construction ks5-20 uses.
//
// Anything else is a stale count and fails. The check is deliberately narrow:
// only a number immediately followed by "modules", spelled out or in digits.
// A count of anything else in a lesson is a curriculum claim rather than a
// statement about the scheme, and the rubric and the contract cover those.
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const MODULES = 'content/modules'
const MANIFEST = 'shared/schools-curriculum.ts'
const LIST = process.argv.includes('--list')

let failed = 0
const fail = (msg, detail = '') => {
  failed += 1
  console.error(`  FAIL  ${msg}${detail ? `\n        ${detail}` : ''}`)
}

// The order the scheme teaches, read as text for the same reason
// check-lesson-minutes.mjs reads it as text: no TypeScript loader in the way.
const order = [...readFileSync(MANIFEST, 'utf8').matchAll(/moduleId: '([^']+)'/g)].map(m => m[1])
if (order.length < 2) {
  console.error('FAIL  the manifest order could not be read')
  process.exit(1)
}
const total = order.length

// Spelled out numbers, one or two words, plus bare digits. "twenty eight" is
// two words and unhyphenated, because rule 4 forbids a dash anywhere in copy.
const UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }
const WORD = [...UNITS, ...Object.keys(TENS)].join('|')
const COUNT = new RegExp(`\\b((?:${WORD})(?:\\s+(?:${WORD}))?|\\d{1,3})\\s+modules\\b`, 'gi')

const value = raw => {
  const t = raw.trim().toLowerCase()
  if (/^\d+$/.test(t)) return Number(t)
  const parts = t.split(/\s+/)
  let n = 0
  for (const p of parts) {
    if (p in TENS) n += TENS[p]
    else if (UNITS.includes(p)) n += UNITS.indexOf(p)
    else return null
  }
  return n
}

// Every string a class or a teacher can read. The slides are the wall; the
// teacher notes and the parent note go home on paper, so they count too.
const strings = m => {
  const out = []
  const walk = v => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(m.slides); walk(m.teacher_notes); walk(m.parent_note)
  return out
}

const rows = []
for (const f of readdirSync(MODULES).filter(f => f.endsWith('.json')).sort()) {
  const m = JSON.parse(readFileSync(join(MODULES, f), 'utf8'))
  const id = m.module_id
  const position = order.indexOf(id) + 1
  if (position < 1) { fail(`${id} has a lesson file and no manifest row, so its position cannot be checked`); continue }

  for (const s of strings(m)) {
    for (const hit of s.matchAll(COUNT)) {
      const n = value(hit[1])
      const ok = n === total || n === position
      rows.push({ id, position, said: hit[0].trim(), n, ok })
      if (!ok) {
        fail(
          `${id} states ${JSON.stringify(hit[0].trim())}`,
          `it is number ${position} of ${total}, so the only true counts here are ${position} or ${total}\n        in: ${JSON.stringify(s.length > 150 ? `${s.slice(0, 150)}...` : s)}`,
        )
      }
    }
  }
}

if (LIST) {
  console.log('lesson                                      pos    says            ok')
  for (const r of rows) console.log(`${r.id.padEnd(42)} ${String(r.position).padStart(3)}    ${r.said.padEnd(15)} ${r.ok ? 'yes' : 'NO'}`)
  console.log(`\n${rows.length} stated module count(s) across ${total} lessons`)
}

if (failed) {
  console.error(`\nFAIL  ${failed} lesson(s) count a scheme that does not exist.`)
  process.exit(1)
}
console.log(`lesson counts: ${rows.length} stated module count(s), every one true from where it is spoken`)
