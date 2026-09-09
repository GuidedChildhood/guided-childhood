#!/usr/bin/env node
//
// THE LESSON COUNCIL: the counted checks.
//
// Justin, 9 September 2026: ten agents, each testing its findings, each scoring
// at least 8.5 out of 10, reiterating until they pass.
//
// WHY THIS IS A SCRIPT AND NOT AN AGENT. An agent that scores its own work and
// re-runs until it hits 8.5 will hit 8.5. Same model, same judgement, and the
// loop condition tells it which answer ends the loop. The score would be a
// ritual. So every check in this file is ARITHMETIC on the live scheme: a
// re-run only improves the score if the lessons actually changed. The judged
// checks live elsewhere, are never gated, and are never re-run for a better
// number (plans/2026-09-09-the-lesson-council.md).
//
// Usage: node scripts/council.mjs
//        node scripts/council.mjs --fixture path/to/scheme.json
//
// The live run needs SUPABASE_SERVICE_ROLE_KEY, same as lib/ops/health.ts. The
// fixture run needs nothing, and exists because the scoring rules are the part
// most likely to be wrong and a rule you cannot run is a rule you cannot argue
// with. A fixture is a saved copy of the same select below.

import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { checkProse, checkBlocks, checkEngagement, checkPassport } from './council-checks.mjs'

const GATE = 8.5

const fixtureAt = process.argv.indexOf('--fixture')
const fixture = fixtureAt === -1 ? null : process.argv[fixtureAt + 1]

let lessons
if (fixture) {
  lessons = JSON.parse(await readFile(fixture, 'utf8'))
} else {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    console.error('council: needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY,')
    console.error('or a saved scheme via --fixture. Without either this would print a passing')
    console.error('score against no data, which is the exact failure the council exists to')
    console.error('prevent. Stopping instead.')
    process.exit(2)
  }
  const db = createClient(url, key, { auth: { persistSession: false }, db: { schema: 'schools' } })
  const { data, error } = await db
    .from('school_lessons')
    .select('module_id, key_stage, slides, teacher_notes')
    .order('sort_order', { ascending: true })
  if (error) { console.error('council: could not read the scheme:', error.message); process.exit(2) }
  lessons = data ?? []
}

if (!Array.isArray(lessons) || lessons.length === 0) {
  console.error('council: read zero modules. Refusing to score nothing.')
  process.exit(2)
}

const results = [checkProse(lessons), checkBlocks(lessons), checkEngagement(lessons), checkPassport(lessons)]

console.log(`\nTHE LESSON COUNCIL, counted checks, ${lessons.length} modules${fixture ? ` (fixture ${fixture})` : ''}\n`)
let failed = 0
for (const r of results) {
  const s = r.score.toFixed(2)
  const verdict = r.score >= GATE ? 'PASS' : 'BELOW GATE'
  if (r.score < GATE) failed += 1
  console.log(`  ${verdict.padEnd(11)} ${s.padStart(5)} / 10   ${r.name}`)
  console.log(`  ${''.padEnd(11)} ${''.padStart(5)}        ${r.detail}`)
  for (const f of r.fails.slice(0, 5)) {
    console.log(`  ${''.padEnd(19)}${JSON.stringify(f)}`)
  }
  if (r.fails.length > 5) console.log(`  ${''.padEnd(19)}and ${r.fails.length - 5} more`)
  console.log('')
}
console.log(`${results.length - failed} of ${results.length} at or above the ${GATE} gate.\n`)
// Deliberately exit 0. This reports a standard we are working towards, and a
// red build every commit until we reach it would train everyone to ignore it.
