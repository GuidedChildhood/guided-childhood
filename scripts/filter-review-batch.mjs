#!/usr/bin/env node
// PARK THE SHOULDS. APPLY THE MUSTS. (21 September 2026)
//
// The deep review leaves, per lesson, a verified file of accepted edits. Across
// the first 17 lessons that was 503 accepted edits, 311 of them to the wall a
// child reads, and only 67 of those were must severity. Justin, on reading the
// numbers: "we are confident in the school curriculum so let's make the review
// less often as we don't need to keep changing often."
//
// He is right, and the severities already say which is which:
//
//   must    a factual error, a line that could frighten or shame a child, a
//           question with no single defensible right answer, feedback that
//           does not say why, a script that contradicts the wall, a protected
//           phrase at risk, an accessibility fail. Not opinions, and they are
//           on a classroom wall.
//   should  a clear win on a rubric check. Real, and a change to a lesson that
//           is already good.
//   polish  voice and rhythm only.
//
// So this reads the verified files and writes a filtered copy where only the
// musts stay accepted. NOTHING IS DELETED: every should and polish edit is
// carried through with its text, its reason and its severity intact, flipped to
// accept false with a reason saying it was parked rather than rejected. A later
// term can flip them back by rerunning with --severity should.
//
// Feed the OUTPUT directory to scripts/gen-review-batch.mjs, which applies
// accepted edits only and is the only road to production.
//
// Usage: node scripts/filter-review-batch.mjs <verified-dir> <out-dir> [--severity must|should|polish]
//        --severity names the LOWEST severity that stays accepted. Default must.

import fs from 'node:fs'
import path from 'node:path'

const rank = { must: 0, should: 1, polish: 2 }

// Accepts --severity should and --severity=should. Walked rather than found,
// because indexOf returns -1 when the flag is absent and argv[-1 + 1] is the
// node binary, which is how the first version of this read "/usr/bin/node" as
// a severity.
const argv = process.argv.slice(2)
const positional = []
let floorArg = 'must'
for (let i = 0; i < argv.length; i += 1) {
  const a = argv[i]
  if (a.startsWith('--severity=')) { floorArg = a.slice('--severity='.length); continue }
  if (a === '--severity') { floorArg = argv[i + 1] ?? ''; i += 1; continue }
  if (a.startsWith('--')) continue
  positional.push(a)
}
const [inDir, outDir] = positional

if (!inDir || !outDir) {
  console.error('usage: node scripts/filter-review-batch.mjs <verified-dir> <out-dir> [--severity must|should|polish]')
  process.exit(1)
}
if (!(floorArg in rank)) { console.error(`--severity must be one of: ${Object.keys(rank).join(', ')}`); process.exit(1) }
const floor = rank[floorArg]

fs.mkdirSync(outDir, { recursive: true })

const PARKED = `parked by the once a term policy of 21 September 2026: real, but not a must, and the scheme is one we are confident in. Rerun scripts/filter-review-batch.mjs with a lower severity floor to take it.`

let kept = 0, parked = 0, alreadyRejected = 0
const perSeverity = {}
const rows = []

for (const f of fs.readdirSync(inDir).filter(f => f.endsWith('.json')).sort()) {
  const v = JSON.parse(fs.readFileSync(path.join(inDir, f), 'utf8'))
  let k = 0, p = 0
  for (const e of v.edits || []) {
    if (!e.accept) { alreadyRejected += 1; continue }
    const sev = e.severity || 'polish'
    perSeverity[sev] = (perSeverity[sev] || 0) + 1
    if ((rank[sev] ?? 2) <= floor) { k += 1; kept += 1; continue }
    // Parked, not rejected. The text and the reviewer's reason stay.
    e.accept = false
    e.parked = true
    e.reason = `${PARKED}${e.reason ? ` Verifier accepted it: ${e.reason}` : ''}`
    p += 1; parked += 1
  }
  rows.push({ id: v.module_id, kept: k, parked: p })
  fs.writeFileSync(path.join(outDir, f), JSON.stringify(v, null, 2) + '\n')
}

console.log(`lesson                                     keeps  parks`)
for (const r of rows) console.log(`${String(r.id).padEnd(42)} ${String(r.kept).padStart(5)}  ${String(r.parked).padStart(5)}`)
console.log('')
console.log(`${rows.length} lesson(s) read from ${inDir}`)
console.log(`  accepted by the verifiers, by severity: ${Object.entries(perSeverity).map(([s, n]) => `${s} ${n}`).join(', ')}`)
console.log(`  ${kept} kept accepted (severity ${floorArg} and above), ${parked} parked, ${alreadyRejected} already rejected by a verifier`)
console.log(`  written to ${outDir}`)
console.log(`\nNext: node scripts/gen-review-batch.mjs ${outDir} <first-number> <slug> --dry`)
