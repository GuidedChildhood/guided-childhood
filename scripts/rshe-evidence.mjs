#!/usr/bin/env node
// PRINT THE SQL THAT CHECKS EVERY COVERAGE CLAIM AGAINST PRODUCTION.
//
// The guard (check-rshe-coverage.mjs) will not let shared/schools-rshe-2026.ts
// claim a requirement is taught unless someone has run this query against the
// live lessons and recorded the result. This script builds that query from
// whatever the data module currently says, so the check always tests the
// current claims rather than an older set.
//
// It returns one TOTAL row and one row per phrase that was NOT found. Zero
// failures means every claim is backed by words that are really on a slide.
//
// Usage: npm run rshe-evidence

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const src = fs.readFileSync(path.join(ROOT, 'shared/schools-rshe-2026.ts'), 'utf8')

const rows = []
for (const b of src.split(/\n  \{\n/).slice(1)) {
  const id = (b.match(/id: '([^']+)'/) || [])[1]
  if (!id) continue
  const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  const evs = [...(b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)]
    .map(m => m[1].replace(/\\'/g, "'"))
  if (mods.length && evs.length) rows.push({ id, mods, evs })
}

const q = s => "'" + s.replace(/'/g, "''") + "'"
const values = rows.flatMap(r =>
  r.evs.map(e => ` (${q(r.id)}, ${q(e)}, array[${r.mods.map(q).join(',')}])`))

console.log(`-- ${values.length} phrase checks across ${rows.length} requirements`)
console.log(`-- Run against production. Zero failure rows means every claim holds.`)
console.log(`with probe(rid, phrase, mods) as (values\n${values.join(',\n')}\n),`)
console.log(`sl as (select l.module_id, lower(l.slides::text) as txt from schools.school_lessons l),`)
console.log(`res as (select p.rid, p.phrase, count(sl.module_id) as hits`)
console.log(` from probe p left join sl on sl.module_id = any(p.mods) and position(lower(p.phrase) in sl.txt) > 0`)
console.log(` group by p.rid, p.phrase)`)
console.log(`select 'TOTAL' as rid, count(*)::text as phrase, sum(case when hits=0 then 1 else 0 end)::text as hits from res`)
console.log(`union all select rid, phrase, hits::text from res where hits = 0 order by 1;`)
