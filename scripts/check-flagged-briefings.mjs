// Every safeguarding flagged module has a staff briefing, and no briefing
// names a module that is not flagged.
//
// The schools review of 13 September 2026 found four answers to one question
// on four pages: the policy text said five modules carried extra care, the CPD
// and induction pages said ten, the DSL crosswalk computed twelve from the
// live rows, and the manifest flagged six. The CPD page also claimed every
// flagged module had a briefing while two (M22, M23) had none.
//
// One source now: `dsl: true` in shared/schools-curriculum.ts, set to match
// the rows whose dsl_note.required is true, and FLAGGED_MODULES computed from
// it. Every page prints that count. This guard holds the briefings to it.
//
//   node scripts/check-flagged-briefings.mjs

import { readFileSync } from 'node:fs'

const manifest = readFileSync('shared/schools-curriculum.ts', 'utf8')
const cpd = readFileSync('schools/app/hub/cpd/page.tsx', 'utf8')

// Each manifest entry starts with `n: <number>`; a flagged one carries `dsl: true` before the next `n:`.
const flagged = new Set()
for (const m of manifest.matchAll(/\bn: (\d+), moduleId: '([^']+)'([\s\S]*?)(?=\bn: \d+, moduleId:|\n\]\s*$|\nexport )/g)) {
  if (/\bdsl: true\b/.test(m[3])) flagged.add(Number(m[1]))
}
const briefed = new Set([...cpd.matchAll(/module: 'M(\d\d) /g)].map(m => Number(m[1])))

let bad = 0
const say = (okay, msg) => { console.log(`${okay ? 'ok  ' : 'FAIL'} ${msg}`); if (!okay) bad += 1 }
say(flagged.size > 0, `manifest flags ${flagged.size} modules`)
for (const n of [...flagged].sort((a, b) => a - b)) say(briefed.has(n), `M${String(n).padStart(2, '0')} flagged has a briefing`)
for (const n of [...briefed].sort((a, b) => a - b)) say(flagged.has(n), `M${String(n).padStart(2, '0')} briefing is for a flagged module`)
// The hand written counts are gone: no page may say how many are flagged in words or digits.
for (const file of ['schools/app/hub/cpd/page.tsx', 'schools/app/hub/induction/page.tsx', 'schools/app/hub/policy/page.tsx', 'schools/app/hub/faq/page.tsx', 'schools/app/hub/dsl/page.tsx']) {
  const src = readFileSync(file, 'utf8')
  say(!/\b(five|ten|twelve|\d+) (safeguarding flagged )?modules (are|carry|have)\b/i.test(src.replace(/\{[^}]*\}/g, '')), `${file} carries no hand written flagged count`)
}
if (bad) { console.error(`\n${bad} problem(s)`); process.exit(1) }
console.log('\nflagged modules and briefings agree')
