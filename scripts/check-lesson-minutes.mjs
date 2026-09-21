#!/usr/bin/env node
// THE PUBLISHED LENGTH IS THE REAL LENGTH (21 September 2026).
//
// The curriculum map is public and now prints how long each lesson runs, so
// that number is a claim made to a buyer before they have seen anything. This
// holds it to the only thing that can settle it: the sum of every slide's
// minutes in content/modules, whose files are hash proved equal to the
// production rows by scripts/module-string-hash.mjs.
//
// WHY THIS EXISTS RATHER THAN A COMMENT ASKING PEOPLE TO REMEMBER. The scheme
// has already been here. A comment on the old faces list claimed the lines
// could never drift from the lessons, and three of six went stale in one
// commit. A number on a card drifts the same way and is worse, because a head
// who plans a fifty minute period around it finds out in the room.
//
// It also refuses the reverse failure: a lesson file with no manifest row, or
// a manifest row with no lesson file, means the map is selling a different
// scheme from the one that ships.
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const MODULES = 'content/modules'
const MANIFEST = 'shared/schools-curriculum.ts'

let failed = 0
const fail = (msg, detail = '') => {
  failed += 1
  console.error(`  FAIL  ${msg}${detail ? `\n        ${detail}` : ''}`)
}

// The real length of every lesson that ships.
const real = new Map()
for (const f of readdirSync(MODULES).filter(f => f.endsWith('.json'))) {
  const m = JSON.parse(readFileSync(join(MODULES, f), 'utf8'))
  const slides = m.slides || []
  const total = slides.reduce((a, s) => a + (Number(s.minutes) || 0), 0)
  real.set(m.module_id, { total, slides: slides.length, timing: m.teacher_notes?.timing || '' })
}

// What the manifest publishes. Read as text rather than imported, because this
// guard must run with no TypeScript loader in the way.
const src = readFileSync(MANIFEST, 'utf8')
const published = new Map()
for (const m of src.matchAll(/n: (\d+), moduleId: '([^']+)',[^\n]*?minutes: (\d+),/g)) {
  published.set(m[2], Number(m[3]))
}

// Every row carries a figure at all.
for (const m of src.matchAll(/n: (\d+), moduleId: '([^']+)',([^\n]*)/g)) {
  if (!/minutes: \d+,/.test(m[3])) fail(`manifest row ${m[2]} publishes no length`)
}

for (const [id, say] of published) {
  const r = real.get(id)
  if (!r) { fail(`the map sells ${id}, which has no lesson file`, 'every published module needs a file in content/modules'); continue }
  if (say !== r.total) {
    fail(`${id} is published as ${say} minutes and runs ${r.total}`,
      `${r.slides} slides sum to ${r.total}. Re run scripts/check-lesson-minutes.mjs --fix after any change to a lesson's minutes.`)
  }
}

for (const id of real.keys()) {
  if (!published.has(id)) fail(`${id} ships but the map does not sell it`, 'a lesson with no manifest row is invisible to a buyer')
}

// The timing string inside the lesson must agree too, because the teacher sees
// that one on the prep sheet while the buyer saw the card.
for (const [id, r] of real) {
  const stated = Number((r.timing.match(/^(\d+)/) || [])[1])
  if (Number.isFinite(stated) && stated !== r.total) {
    fail(`${id} teacher notes say ${stated} minutes and the slides run ${r.total}`)
  }
}

if (process.argv.includes('--list')) {
  const rows = [...real.entries()].sort((a, b) => b[1].total - a[1].total)
  for (const [id, r] of rows) console.log(`  ${String(r.total).padStart(3)} min  ${r.slides} slides  ${id}`)
  const totals = rows.map(r => r[1].total).sort((a, b) => a - b)
  console.log(`\n  ${rows.length} lessons, ${totals[0]} to ${totals[totals.length - 1]} minutes, median ${totals[Math.floor(totals.length / 2)]}`)
}

if (failed) {
  console.error(`\n${failed} problem(s). The published length must be the sum of the slides, or the map is selling a lesson that does not exist.`)
  process.exit(1)
}
console.log(`PASS  ${published.size} lessons publish the length their slides actually run`)
