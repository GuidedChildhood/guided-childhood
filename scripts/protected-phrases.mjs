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
// TWO KINDS OF HOLD. A computing phrase must be in every module it names. An
// RSHE phrase must be in at least one of its requirement's modules, which is
// the coverage guard's own test, so a phrase that another listed lesson also
// carries today may be reworded here without breaking the claim, while one
// that only this lesson carries must stay. The list says which is which,
// reading the other lessons' files to find out.
//
// Usage: node scripts/protected-phrases.mjs <module_id> [--json]

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const [, , moduleId, flag] = process.argv
if (!moduleId) { console.error('usage: node scripts/protected-phrases.mjs <module_id> [--json]'); process.exit(2) }

const unq = s => s.replace(/\\'/g, "'").replace(/\\u2019/g, '’')
const textOf = {}
const slidesText = id => {
  if (textOf[id] !== undefined) return textOf[id]
  const p = path.join(ROOT, 'content/modules', `${id}.json`)
  textOf[id] = fs.existsSync(p) ? JSON.stringify(JSON.parse(fs.readFileSync(p, 'utf8')).slides).toLowerCase() : null
  return textOf[id]
}
const carries = (id, phrase) => { const t = slidesText(id); return t === null ? null : t.includes(phrase.toLowerCase()) }

const out = []
const rshe = fs.readFileSync(path.join(ROOT, 'shared/schools-rshe-2026.ts'), 'utf8')
for (const b of rshe.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  if (!mods.includes(moduleId)) continue
  const evs = [...(b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => unq(m[1]))
  for (const phrase of evs) {
    const here = carries(moduleId, phrase)
    const elsewhere = mods.filter(m => m !== moduleId && carries(m, phrase) === true)
    const unknown = mods.filter(m => m !== moduleId && carries(m, phrase) === null)
    out.push({ id, phrase, source: 'RSHE 2026', mode: 'any', here, elsewhere, unknown })
  }
}
const comp = fs.readFileSync(path.join(ROOT, 'shared/schools-computing-pos.ts'), 'utf8')
for (const b of comp.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  for (const p of b.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)) {
    const mods = [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1])
    if (mods.includes(moduleId)) out.push({ id, phrase: unq(p[1]), source: 'computing programme of study', mode: 'all', here: carries(moduleId, unq(p[1])), elsewhere: [], unknown: [] })
  }
}

if (flag === '--json') { console.log(JSON.stringify(out)); process.exit(0) }
// A lesson whose file is not exported cannot be shown to carry a phrase, so
// it does not count as another carrier: unknown is treated as absent here.
const must = out.filter(o => o.here && (o.mode === 'all' || o.elsewhere.length === 0))
const may = out.filter(o => o.here && !must.includes(o))
const absent = out.filter(o => !o.here)
console.log(`${moduleId}: ${out.length} attested phrase(s) name this lesson.`)
console.log(`\nMUST STAY in these slides (${must.length}): no other exported lesson carries them, or the computing map holds every named lesson to them.`)
for (const o of must) console.log(`  "${o.phrase}"  (${o.id}, ${o.source}${o.unknown.length ? '; not checked: ' + o.unknown.join(', ') : ''})`)
console.log(`\nMAY BE REWORDED here (${may.length}): another lesson on the same requirement carries the phrase today, so the claim holds without this one.`)
for (const o of may) console.log(`  "${o.phrase}"  (${o.id}; also in ${o.elsewhere.join(', ')}${o.unknown.length ? '; not checked: ' + o.unknown.join(', ') : ''})`)
if (absent.length) {
  console.log(`\nNOT IN THIS LESSON (${absent.length}): named on the requirement, carried by another of its lessons. Do not add them here to be safe; they are not this lesson's job.`)
  for (const o of absent) console.log(`  "${o.phrase}"  (${o.id}; in ${o.elsewhere.join(', ') || 'none of the exported files'}${o.unknown.length ? '; not checked: ' + o.unknown.join(', ') : ''})`)
}
