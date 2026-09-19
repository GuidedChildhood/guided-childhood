#!/usr/bin/env node
// THE AUDIT, AS AN EXIT CODE.
//
// Justin, 19 September 2026, after reading GDC_SCHOOLS_2026_COMPLIANCE_AUDIT.md:
// "make sure everything is covered abd that it passes the audit".
//
// A markdown audit goes stale the moment someone edits a slide. So the audit
// became this. It holds shared/schools-rshe-2026.ts, the fifty seven statutory
// requirements, to the lessons that claim to teach them.
//
// THE RULES
//   1. ids are unique and shaped RSHE-<P|S>-<STRAND>-<n>
//   2. every module id named by a requirement exists in the curriculum manifest
//   3. FULL needs at least one module AND at least one evidence phrase
//   4. BY_DESIGN needs a note saying where the requirement belongs instead
//   5. GAP claims no modules. You cannot point at a lesson for something you
//      do not teach, which is exactly the mistake the audit found
//   6. PARTIAL and GAP both need a note naming the missing clause
//   7. the evidence attestation is current: the hash in
//      scripts/fixtures/rshe-evidence.json matches the committed data, and it
//      recorded no failures
//   8. the ratchet: outstanding (PARTIAL + GAP) never rises, and GAP never
//      rises. Both numbers live in this file and only ever come down
//   9. no dashes in our own copy. `text` is quoted statutory wording and is
//      exempt, because editing a quotation to satisfy a house style rule
//      would break the audit trail
//
// Usage: node scripts/check-rshe-coverage.mjs

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA = path.join(ROOT, 'shared/schools-rshe-2026.ts')
const MANIFEST = path.join(ROOT, 'shared/schools-curriculum.ts')
const FIXTURE = path.join(ROOT, 'scripts/fixtures/rshe-evidence.json')

// THE RATCHET. These are the numbers on the day the guard was written. They
// come down as lessons land and they never go up. A pull request that raises
// either one fails here rather than in front of a school.
const MAX_OUTSTANDING = 33   // PARTIAL + GAP
const MAX_GAP = 9

let bad = 0
const fail = (rule, detail) => { bad++; console.error(`  FAIL ${rule}\n       ${detail}`) }

const src = fs.readFileSync(DATA, 'utf8')
const manifest = fs.readFileSync(MANIFEST, 'utf8')
const moduleIds = new Set([...manifest.matchAll(/moduleId: '([^']+)'/g)].map(m => m[1]))

// Parse the requirement objects out of the generated file. Deliberately a
// regex over the source rather than an import: this guard must run under plain
// node with no TypeScript loader, the way the other guards in CI do.
const blocks = src.split(/\n  \{\n/).slice(1)
const reqs = blocks.map(b => {
  const one = k => (b.match(new RegExp(`${k}: '((?:[^'\\\\]|\\\\.)*)'`)) || [, ''])[1].replace(/\\'/g, "'")
  const list = k => {
    const m = b.match(new RegExp(`${k}: \\[([^\\]]*)\\]`))
    return m ? [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'")) : []
  }
  return {
    id: one('id'), phase: one('phase'), strand: one('strand'), verdict: one('verdict'),
    text: one('text'), note: one('note'), kcsie: one('kcsie'),
    modules: list('modules'), evidence: list('evidence'),
  }
}).filter(r => r.id)

console.log(`check-rshe-coverage: ${reqs.length} requirements`)
if (reqs.length !== 57) fail('parse', `expected 57 requirements, parsed ${reqs.length}. The generator or this parser has drifted.`)

// 1. ids
const seen = new Set()
for (const r of reqs) {
  if (seen.has(r.id)) fail('1 unique id', `${r.id} appears twice`)
  seen.add(r.id)
  if (!/^RSHE-[PS]-[A-Z]{2,4}-\d{1,2}$/.test(r.id)) fail('1 id shape', `${r.id} is not RSHE-<P|S>-<STRAND>-<n>`)
}

for (const r of reqs) {
  // 2. modules exist
  for (const m of r.modules) {
    if (!moduleIds.has(m)) fail('2 module exists', `${r.id} names ${m}, which is not in the curriculum manifest`)
  }
  // 3. FULL is backed
  if (r.verdict === 'FULL') {
    if (!r.modules.length) fail('3 FULL is backed', `${r.id} is FULL with no module`)
    if (!r.evidence.length) fail('3 FULL is backed', `${r.id} is FULL with no evidence phrase`)
  }
  // 4. BY_DESIGN explains itself
  if (r.verdict === 'BY_DESIGN' && r.note.length < 40) {
    fail('4 BY_DESIGN explains itself', `${r.id} has no note saying where the requirement belongs instead`)
  }
  // 5. GAP claims nothing
  if (r.verdict === 'GAP' && r.modules.length) {
    fail('5 GAP claims nothing', `${r.id} is a GAP but names ${r.modules.join(', ')}. A gap cannot point at a lesson.`)
  }
  // 6. the work in progress says what is missing
  if ((r.verdict === 'PARTIAL' || r.verdict === 'GAP') && r.note.length < 20) {
    fail('6 name the missing clause', `${r.id} is ${r.verdict} with no note naming what is missing`)
  }
  // 9. no dashes in our own copy
  for (const [field, v] of [['note', r.note], ['strand', r.strand]]) {
    if (/[–—]/.test(v)) fail('9 no dashes', `${r.id} ${field} contains an em or en dash`)
  }
}

// 7. the attestation is current
const fx = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'))
const trip = []
for (const r of reqs) {
  for (const e of r.evidence) trip.push(`${r.id}|${[...r.modules].sort().join(',')}|${e.toLowerCase()}`)
}
trip.sort()
const hash = crypto.createHash('sha256').update(trip.join('\n')).digest('hex')
if (hash !== fx.requirementsHash) {
  fail('7 attestation is current',
    `the evidence in the data module no longer matches what was checked against production.\n` +
    `       committed hash ${fx.requirementsHash.slice(0, 16)}, data module ${hash.slice(0, 16)}.\n` +
    `       Run: npm run rshe-evidence, execute the SQL it prints against production,\n` +
    `       then update scripts/fixtures/rshe-evidence.json with the result.`)
}
if (fx.failures.length) {
  fail('7 attestation is clean', `${fx.failures.length} evidence phrases were not found in production: ${fx.failures.slice(0, 5).join(', ')}`)
}
if (fx.pairsChecked !== trip.length) {
  fail('7 attestation is complete', `fixture checked ${fx.pairsChecked} pairs, the data module has ${trip.length}`)
}

// 8. the ratchet
const n = v => reqs.filter(r => r.verdict === v).length
const counts = { FULL: n('FULL'), PARTIAL: n('PARTIAL'), GAP: n('GAP'), BY_DESIGN: n('BY_DESIGN') }
const outstanding = counts.PARTIAL + counts.GAP
console.log(`  FULL ${counts.FULL}  PARTIAL ${counts.PARTIAL}  GAP ${counts.GAP}  BY_DESIGN ${counts.BY_DESIGN}`)
console.log(`  outstanding ${outstanding} (ceiling ${MAX_OUTSTANDING})   gaps ${counts.GAP} (ceiling ${MAX_GAP})`)
if (outstanding > MAX_OUTSTANDING) {
  fail('8 ratchet', `outstanding rose to ${outstanding}, ceiling is ${MAX_OUTSTANDING}. Coverage may only improve.`)
}
if (counts.GAP > MAX_GAP) {
  fail('8 ratchet', `gaps rose to ${counts.GAP}, ceiling is ${MAX_GAP}. Coverage may only improve.`)
}
if (outstanding < MAX_OUTSTANDING || counts.GAP < MAX_GAP) {
  console.log(`  ratchet can tighten: set MAX_OUTSTANDING=${outstanding} and MAX_GAP=${counts.GAP} in this file`)
}

if (bad) {
  console.error(`\ncheck-rshe-coverage: ${bad} failure${bad === 1 ? '' : 's'}`)
  process.exit(1)
}
console.log('check-rshe-coverage: pass')
