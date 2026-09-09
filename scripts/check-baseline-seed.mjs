// What does a parent's sign up answer actually become at their first check in?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// This is the join that has broken silently three times, and every time the
// symptom was the same: a family opens their first check in and it is either
// empty or asking about worries they never chose. It cannot be caught by
// typechecking, because every version of the bug was well typed. It can only
// be caught by asking what comes out the other end.
//
//   14 Aug 2026  three of six ids had no slug, so no rows at all
//    8 Sep 2026  three questions parents arrive with had no tile
//    9 Sep 2026  the quiz wrote ONE id to the profile and marked setup
//                complete, so the wizard that writes the whole list was
//                skipped and two of a parent's three worries were replaced
//                with stock starters
//
// It reproduces the mapping half of seedBaselineConcerns (the half with no
// database in it) and asserts on the rows. The database half, the guards and
// the insert, is not reachable without a session and is not the part that has
// ever been wrong.
//
// Usage: node --experimental-strip-types scripts/check-baseline-seed.mjs

import { ONBOARDING_TO_SLUG, LABEL, STARTER_SLUGS } from '../lib/concerns/baseline.ts'
import { WORRIES, CATCH_ALL_ID } from '../lib/onboarding/worries.ts'

const otherSlug = raw => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

function slugsFor(answers) {
  const named = [...(answers.challenges ?? []), ...(answers.challenge ? [answers.challenge] : [])]
  const mapped = Array.from(new Set(named.map(c => ONBOARDING_TO_SLUG[String(c)]).filter(Boolean)))
  const ownWords = (answers.challenge_other ?? '').trim().slice(0, 80)
  const own = ownWords ? otherSlug(ownWords) : ''
  const topUp = ch => { const out = [...ch]; for (const s of STARTER_SLUGS) { if (out.length >= STARTER_SLUGS.length) break; if (!out.includes(s)) out.push(s) } return out }
  const slugs = own ? [own, ...mapped.filter(m => m !== own)] : topUp(mapped)
  return slugs.map(s => ({ slug: s, label: s === own ? ownWords : LABEL[s] ?? s }))
}

const all = WORRIES.map(w => w.id)
const cases = [
  ['three ticked, the old way (only `challenge` reached the profile)', { challenge: 'bedtime_screens' }],
  ['three ticked, wired', { challenges: ['bedtime_screens', 'ai_chatbots', 'controller_fights'], challenge: 'bedtime_screens' }],
  ['all nine plus something else', { challenges: all, challenge_other: 'Getting off the Switch at teatime' }],
  ['ONLY something else', { challenges: [CATCH_ALL_ID], challenge_other: 'Sneaking the iPad at 6am' }],
  ['something else ticked, nothing typed', { challenges: [CATCH_ALL_ID] }],
  ['nothing at all', {}],
]
let bad = 0
for (const [name, answers] of cases) {
  const rows = slugsFor(answers)
  console.log(`\n${name}\n  ${rows.length} row(s): ${rows.map(r => `${r.slug} ("${r.label}")`).join(', ') || 'NONE'}`)
  for (const r of rows) {
    if (!r.label || r.label === r.slug) { console.log(`  FAIL ${r.slug} has no words a parent would read`); bad++ }
  }
}
// Every live tile must produce a row.
for (const id of all.filter(i => i !== CATCH_ALL_ID)) {
  const rows = slugsFor({ challenges: [id] })
  if (!rows.length) { console.log(`FAIL ${id} produced no row`); bad++ }
}
console.log(`\n${bad === 0 ? 'all passed' : bad + ' failed'}`)
process.exit(bad === 0 ? 0 : 1)
