#!/usr/bin/env node
// THE PHRASES A LESSON MUST KEEP, printed for whoever is about to edit it.
//
// The RSHE map (shared/schools-rshe-2026.ts) and the computing map
// (shared/schools-computing-pos.ts) hold every coverage claim to short
// phrases that must appear in the named lessons' slides, and the two guards
// test them on production. A reviewer proposing a rewrite needs the list
// before it writes, not a failed attestation afterwards, and
// scripts/gen-review-batch.mjs refuses any batch that loses one anyway.
//
// Usage: node scripts/protected-phrases.mjs <module_id> [--json]

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const [, , moduleId, flag] = process.argv
if (!moduleId) { console.error('usage: node scripts/protected-phrases.mjs <module_id> [--json]'); process.exit(2) }

const unq = s => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’')
const out = []
const rshe = fs.readFileSync(path.join(ROOT, 'shared/schools-rshe-2026.ts'), 'utf8')
for (const b of rshe.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  if (!mods.includes(moduleId)) continue
  const evs = [...(b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => unq(m[1]))
  for (const phrase of evs) out.push({ id, phrase, source: 'RSHE 2026' })
}
const comp = fs.readFileSync(path.join(ROOT, 'shared/schools-computing-pos.ts'), 'utf8')
for (const b of comp.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  for (const p of b.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)) {
    const mods = [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1])
    if (mods.includes(moduleId)) out.push({ id, phrase: unq(p[1]), source: 'computing programme of study' })
  }
}

if (flag === '--json') { console.log(JSON.stringify(out)); process.exit(0) }
console.log(`${moduleId}: ${out.length} protected phrase(s). Each must still appear, case insensitive, somewhere in the slides after any edit.`)
for (const o of out) console.log(`  "${o.phrase}"  (${o.id}, ${o.source})`)
