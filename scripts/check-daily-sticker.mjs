// The daily sticker is granted once, on the day it was earned, in one write.
//
// Justin, 10 September 2026: "daily sticker go with your idea." The idea, from
// the audit he approved first, has three properties that are easy to state and
// easy to break later without anything failing a typecheck:
//
//   1. IT LATCHES ON THE DAY'S OWN ROW. The unique (child_id, day) index that
//      migration 134 created is what stops a day paying twice. Move the award
//      to its own table and that guarantee has to be rebuilt from scratch.
//
//   2. IT IS WRITTEN IN THE SAME UPDATE AS completed_at. A second write could
//      fail on its own, and then a child has a day that completed and a sticker
//      that never came, with nothing anywhere to reconcile it.
//
//   3. BOTH HOMES READ ONE FUNCTION. Two screens counting the same thing from
//      the same table is how they come to disagree. That is not hypothetical
//      here: two rungs on the daily path did exactly that and both had to be
//      fixed on the morning this was built.

import { readFileSync, readdirSync } from 'node:fs'

const fails = []
const ok = []

// Comments are not code. An earlier guard on this repo stayed green because the
// comment explaining a prop outlived the prop itself, so every test below runs
// against the source with its comments taken out.
function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(l => (l.trim().startsWith('//') ? '' : l))
    .join('\n')
}

// ── 1. The column exists and is on kid_days ────────────────────────────────
const migrations = readdirSync('supabase/migrations')
const sticker = migrations.find(f => /^284_/.test(f))
if (!sticker) {
  fails.push('Migration 284 is gone. The daily sticker column lives there.')
} else {
  const sql = readFileSync(`supabase/migrations/${sticker}`, 'utf8')
  if (!/alter table public\.kid_days/.test(sql) || !/sticker_awarded_at/.test(sql)) {
    fails.push('Migration 284 no longer adds sticker_awarded_at to kid_days. The unique (child_id, day) index on that table is the whole idempotency guarantee.')
  } else {
    ok.push('the sticker latches on kid_days, where the unique day index already is')
  }
}

// ── 2. One write, and guarded ──────────────────────────────────────────────
const store = code(readFileSync('lib/kid/day-store.ts', 'utf8'))

// The award must sit in the same `patch` object that carries completed_at, and
// must be conditioned on not having been awarded already.
if (!/patch\.sticker_awarded_at\s*=/.test(store)) {
  fails.push('day-store no longer writes sticker_awarded_at into the patch. If it moved to its own update, a failed second write leaves a completed day with no sticker.')
} else if (!/!row\.sticker_awarded_at/.test(store)) {
  fails.push('The sticker write is no longer guarded on !row.sticker_awarded_at, so replaying a call on an awarded day pays it again.')
} else {
  ok.push('the sticker is written in the completion patch, guarded against paying twice')
}

// A second `.from('kid_days').update(` carrying the sticker would be the
// separate write this guard exists to prevent.
const updates = [...store.matchAll(/\.from\('kid_days'\)\s*\.update\(/g)].length
if (updates > 1) {
  fails.push(`day-store makes ${updates} separate kid_days updates. The sticker must ride the one that sets completed_at, not a write of its own.`)
} else {
  ok.push('one kid_days update carries the whole completion')
}

// ── 3. Both Homes read the one function ────────────────────────────────────
const shared = 'lib/kid/today-state.ts'
let state
try { state = code(readFileSync(shared, 'utf8')) } catch {
  fails.push(`${shared} is gone. It is the single reading both Homes render.`)
}
if (state) {
  // complete must be the STORED column, never a recount of done against steps.
  if (/complete:\s*dayComplete\(/.test(state)) {
    fails.push('today-state recomputes `complete` with dayComplete instead of reading completed_at. A day that landed must stay landed even when the step pool changes.')
  } else if (!/complete:\s*!!row\.completed_at/.test(state)) {
    fails.push('today-state no longer reads completed_at for `complete`. That column exists precisely so the answer is stored rather than recounted.')
  } else {
    ok.push('today-state reads the stored completed_at, never a recount')
  }

  const parentHome = code(readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8'))
  if (!/readTodayState\(/.test(parentHome)) {
    fails.push("The parent's Home no longer reads readTodayState, so it is either not showing the child's day or counting it for itself.")
  } else {
    ok.push("the parent's Home reads the shared function")
  }
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
