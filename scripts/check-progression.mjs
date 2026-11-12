#!/usr/bin/env node
// THE PROGRESSION GUARD (11 November 2026).
//
// shared/schools-progression.ts says which year each lesson is suggested for
// and which earlier lessons it builds on. Both are printed for a subject lead
// (/hub/progression, /hub/year-plan), so both are claims, and a claim about
// order is exactly the kind that rots when a lesson is added or moved. This
// holds the file to the manifest and to the lessons themselves:
//
//   1. every lesson in the scheme has a suggested year, inside its key stage
//   2. every link names a real lesson
//   3. NOTHING IS PLACED BEFORE WHAT IT BUILDS ON: an earlier year, or the
//      same year and earlier in the scheme's order
//   4. THE LESSON AGREES: an earlier lesson that a lesson's own prior
//      knowledge lines name by number is linked here, so the map cannot say
//      less than the teacher notes do
//   5. no year group is left with nothing, and none is given more than four
//
// Text only, no imports, so it runs under plain node.
// Run: node scripts/check-progression.mjs
import { readFileSync } from 'node:fs'

let failed = 0
const ok = (name, cond, detail = '') => { if (cond) return; failed += 1; console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`) }

const manifest = readFileSync('shared/schools-curriculum.ts', 'utf8')
const order = [...manifest.matchAll(/moduleId: '([^']+)', keyStage: '([^']+)'/g)].map(m => ({ id: m[1], ks: m[2] }))
const src = readFileSync('shared/schools-progression.ts', 'utf8')
const block = name => src.slice(src.indexOf(`export const ${name}`), src.indexOf('\n}\n', src.indexOf(`export const ${name}`)))
const years = Object.fromEntries([...block('SUGGESTED_YEAR').matchAll(/'([^']+)': (\d+),/g)].map(m => [m[1], Number(m[2])]))
const links = Object.fromEntries([...block('BUILDS_ON').matchAll(/^\s*'([^']+)': \[([^\]]*)\],/gm)].map(m => [m[1], [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1])]))
const yearsOf = Object.fromEntries([...block('YEARS_OF').matchAll(/(\w+): \[([\d, ]+)\]/g)].map(m => [m[1], m[2].split(',').map(Number)]))

ok('the manifest was read', order.length >= 30, `${order.length} lessons found`)
const pos = new Map(order.map((m, i) => [m.id, i]))

for (const { id, ks } of order) {
  ok(`${id} has a suggested year`, Number.isInteger(years[id]))
  ok(`${id} is suggested inside ${ks}`, (yearsOf[ks] ?? []).includes(years[id]), `year ${years[id]} is not one of ${JSON.stringify(yearsOf[ks])}`)
}
for (const id of Object.keys(years)) ok(`${id} is a lesson in the scheme`, pos.has(id))

for (const [id, list] of Object.entries(links)) {
  ok(`${id} is a lesson in the scheme`, pos.has(id))
  for (const before of list) {
    ok(`${id} builds on a real lesson`, pos.has(before), before)
    if (!pos.has(before) || !pos.has(id)) continue
    const sooner = years[before] < years[id] || (years[before] === years[id] && pos.get(before) < pos.get(id))
    ok(`${id} is placed after ${before}, which it builds on`, sooner, `${before} is suggested for year ${years[before]}, ${id} for year ${years[id]}`)
  }
}

// 4. The lesson's own prior knowledge lines.
const short = new Map(order.map(m => [m.id.match(/^(?:eyfs|ks\d)-\d\d/)?.[0], m.id]))
for (const { id } of order) {
  const lesson = JSON.parse(readFileSync(`content/modules/${id}.json`, 'utf8'))
  const named = [...new Set(JSON.stringify(lesson.teacher_notes?.prior_knowledge ?? '').match(/\b(?:eyfs|ks[1-5])-\d\d\b/g) ?? [])]
  for (const n of named) {
    const full = short.get(n)
    ok(`${id} names ${n} in its prior knowledge, and ${n} is a lesson`, !!full)
    if (full && full !== id) ok(`${id} names ${n} in its prior knowledge, so the map links them`, (links[id] ?? []).includes(full))
  }
}

// 5. Every year has something to teach, and no year is overloaded.
for (const [ks, list] of Object.entries(yearsOf)) for (const y of list) {
  const n = order.filter(m => years[m.id] === y).length
  ok(`year ${y} (${ks}) has between one and four lessons`, n >= 1 && n <= 4, `${n} lessons`)
}

if (failed) { console.error(`\n${failed} progression check${failed === 1 ? '' : 's'} failed.`); process.exit(1) }
console.log(`PASS  ${order.length} lessons each have a year inside their key stage, and none is placed before what it builds on`)
