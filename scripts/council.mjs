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
// ritual. So every check here is ARITHMETIC on the live scheme: a re-run only
// improves the score if the lessons actually changed. The judged checks live
// elsewhere, are never gated, and are never re-run for a better number
// (plans/2026-09-09-the-lesson-council.md).
//
// THE GATE IS A RATCHET, not a fixed 8.5. Justin, 9 September 2026: the best
// score ever reached becomes the floor, and the binary checks must be ten.
//
// A fixed number has one of two futures. Set it where we are and it certifies
// today's work for ever. Set it where we want to be and every build is red
// until we arrive, which teaches everyone to ignore it. A ratchet has neither
// problem: it is always exactly one step behind the best we have managed, so
// it can never be satisfied by standing still and can never be failed by
// standing still either. Only going backwards is red.
//
// The trap in a ratchet is the rules. Loosen a check and every score jumps,
// the floor rises to meet it, and the ratchet now certifies a weaker standard
// while looking like progress. So the baseline stores a fingerprint of
// council-checks.mjs. Change a rule and the ratchet ABSTAINS: it prints the
// new numbers, compares nothing, and waits for a human to run --rebaseline.
// Re-baselining is meant to be a decision somebody makes, in a commit, with
// the diff of the rule change sitting next to it.
//
// Usage: node scripts/council.mjs
//        node scripts/council.mjs --fixture path/to/scheme.json
//
// The live run needs SUPABASE_SERVICE_ROLE_KEY, same as lib/ops/health.ts. The
// fixture run needs nothing, and exists because the scoring rules are the part
// most likely to be wrong and a rule you cannot run is a rule you cannot argue
// with. A fixture is a saved copy of the same select below.

import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { checkProse, checkBlocks, checkEngagement, checkPassport, verdict, isRegression } from './council-checks.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const BASELINE = join(here, 'council-baseline.json')
const RULES = join(here, 'council-checks.mjs')

// Two decimal places is the whole precision of a score, so compare on that and
// never on a float. 10 * 122 / 213 is not a number worth trusting past 5.73.
const round2 = n => Math.round(n * 100) / 100

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

const rules = createHash('sha256').update(await readFile(RULES)).digest('hex').slice(0, 12)
let baseline = { rules: null, scores: {} }
try { baseline = JSON.parse(await readFile(BASELINE, 'utf8')) } catch { /* first run */ }

const rulesChanged = baseline.rules !== rules
const rebaseline = process.argv.includes('--rebaseline')

console.log(`\nTHE LESSON COUNCIL, counted checks, ${lessons.length} modules${fixture ? ` (fixture ${fixture})` : ''}\n`)

let slipped = 0
let unmet = 0
// `source` says where the floor came from. A floor set from a fixture is a
// floor set from a copy of the scheme, possibly an old one, so it is worth
// seeing in the file rather than inferring from a commit message.
const next = { rules, source: fixture ? 'fixture' : 'live', scores: {} }

for (const r of results) {
  const score = round2(r.score)
  const best = baseline.scores?.[r.key]?.best ?? null

  const v = verdict({ score, best, binary: r.binary, rulesChanged })
  if (isRegression(v)) slipped += 1
  if (v === 'UNMET') unmet += 1

  const floorText = r.binary ? 'must be 10.00' : best === null ? 'no floor yet' : `floor ${best.toFixed(2)}`
  console.log(`  ${v.padEnd(11)} ${score.toFixed(2).padStart(5)} / 10   ${r.name}`)
  console.log(`  ${''.padEnd(11)} ${''.padStart(5)}        ${r.detail}, ${floorText}`)
  for (const f of r.fails.slice(0, 5)) console.log(`  ${''.padEnd(19)}${JSON.stringify(f)}`)
  if (r.fails.length > 5) console.log(`  ${''.padEnd(19)}and ${r.fails.length - 5} more`)
  console.log('')

  next.scores[r.key] = {
    best: best === null ? score : Math.max(best, score),
    at: score >= (best ?? -1) ? new Date().toISOString().slice(0, 10) : baseline.scores[r.key].at,
  }
}

// A fixture can be stale, partial or hand edited, so on its own it reports and
// never ratchets: a floor set from an old copy of the scheme certifies work
// nobody has done. It may set a baseline only with --rebaseline, the same
// deliberate gesture a rule change needs, and the baseline then records that
// the floor came from a fixture rather than from the live scheme.
const mayWrite = rebaseline || (!fixture && !rulesChanged)

if (rulesChanged && !rebaseline) {
  console.log('The scoring rules changed, so nothing was compared and no floor moved.')
  console.log('Read the diff to council-checks.mjs, decide the new rules are honest, then:')
  console.log('  node scripts/council.mjs --rebaseline\n')
  process.exit(0)
}

if (unmet > 0) {
  console.log(`${unmet} binary check${unmet === 1 ? ' has' : 's have'} never reached ten. That is work still to do, not a regression.`)
}

if (slipped > 0) {
  console.log(`\n${slipped} check${slipped === 1 ? '' : 's'} went backwards. The floor is the best we have already managed.\n`)
  process.exit(1)
}

if (mayWrite) {
  const moved = Object.entries(next.scores).filter(([k, v]) => v.best !== baseline.scores?.[k]?.best)
  if (moved.length > 0 || rulesChanged) {
    await writeFile(BASELINE, JSON.stringify(next, null, 2) + '\n')
    console.log(rulesChanged
      ? 'Baseline rewritten against the new rules.\n'
      : `Ratchet turned: ${moved.map(([k, v]) => `${k} ${v.best.toFixed(2)}`).join(', ')}\n`)
  } else {
    console.log('Nothing moved. Nothing slipped.\n')
  }
} else if (fixture) {
  console.log('Fixture run: reported only, the floor was not touched.\n')
}
