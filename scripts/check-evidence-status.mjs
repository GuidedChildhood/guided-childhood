// Every source row in a lesson's "Where the claims come from" panel shows what
// was written about it: one of the three badges, or the checker's own note.
//
// Found 23 September 2026: the lesson page knew three status words and drew
// anything else as "Mechanism, no figure". Four September lessons had written
// their verification notes into that field, so 24 notes never reached a
// teacher, and a source ks4-29 says it DEMOTED and deliberately does not use
// was badged as though it backed the lesson. shared/evidence-status.ts now
// decides badge or note in one place. This holds three things to it:
//
//   1. every row in content/modules has a claim, a source and a status, and
//      the helper shows each note exactly as written, nothing dropped
//   2. every file that renders evidence_base goes through the helper
//   3. no renderer carries badge words of its own, which is how the three
//      word switch came back last time it was copied
//
//   node --experimental-strip-types scripts/check-evidence-status.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { evidenceStatus, EVIDENCE_BADGE } from '../shared/evidence-status.ts'

let bad = 0
const say = (okay, msg) => { console.log(`${okay ? 'ok  ' : 'FAIL'} ${msg}`); if (!okay) bad += 1 }
const text = v => typeof v === 'string' && v.trim().length > 0

// 1. The rows.
let rows = 0, notes = 0, lessons = 0
for (const f of readdirSync('content/modules').filter(f => f.endsWith('.json')).sort()) {
  const m = JSON.parse(readFileSync(`content/modules/${f}`, 'utf8'))
  const eb = m.teacher_notes?.evidence_base
  if (eb == null || (Array.isArray(eb) && eb.length === 0)) continue
  if (!Array.isArray(eb)) { say(false, `${f}: evidence_base is not a list`); continue }
  lessons += 1
  eb.forEach((e, i) => {
    rows += 1
    const where = `${m.module_id} evidence row ${i}`
    if (!text(e?.claim)) say(false, `${where} has no claim`)
    if (!text(e?.source)) say(false, `${where} has no source`)
    if (!text(e?.status)) { say(false, `${where} has no status, so the page cannot say whether it was checked`); return }
    const st = evidenceStatus(e.status)
    if (st.kind === 'note') {
      notes += 1
      if (st.note !== e.status.trim()) say(false, `${where}: the note shown is not the note written`)
    } else if (st.badge !== EVIDENCE_BADGE[e.status.trim()]) {
      say(false, `${where}: status ${e.status} does not map to its own badge`)
    }
  })
}
say(rows > 0, `${rows} evidence rows in ${lessons} lessons, ${notes} written as notes, every one shown as written`)

// 2 and 3. The renderers.
const renderers = execSync("git ls-files 'schools/**/*.tsx' 'shared/**/*.tsx' 'app/**/*.tsx'", { encoding: 'utf8' })
  .split('\n').filter(Boolean)
  .filter(f => /evidence_base/.test(readFileSync(f, 'utf8')))
say(renderers.length > 0, `found ${renderers.length} file(s) that render evidence_base`)
for (const f of renderers) {
  const src = readFileSync(f, 'utf8')
  say(/from '@gc\/shared\/evidence-status'/.test(src) && /evidenceStatus\(/.test(src), `${f} decides each row through evidenceStatus()`)
  const own = Object.values(EVIDENCE_BADGE).filter(w => src.includes(`'${w}'`) || src.includes(`>${w}<`))
  say(own.length === 0, `${f} carries no badge words of its own${own.length ? ` (found ${own.join(', ')})` : ''}`)
  say(/kind === 'note'/.test(src), `${f} draws a note when the status is one`)
}

if (bad) { console.error(`\n${bad} problem(s)`); process.exit(1) }
console.log('\nevery source note reaches the page')
