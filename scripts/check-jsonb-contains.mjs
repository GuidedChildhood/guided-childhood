// A .contains() on a JSONB column must be given JSON, never an array.
//
// Justin, 14 September 2026, looking at "Balanced screens, Fresh Air, 0 of 1
// days" on his child's home and asking whether the rows link up and sync. They
// did. The number was the problem: it had been 0 for every child since the day
// it shipped, and nothing anywhere said so.
//
// ── THE SHAPE OF THE BUG ────────────────────────────────────────────────────
//
// lib/stickers/book.ts counted days outside with:
//
//     .from('kid_days').contains('done', ['move'])
//
// `kid_days.done` is JSONB (migration 134). Handed an ARRAY, postgrest-js
// takes its Array.isArray branch and serialises a POSTGRES ARRAY LITERAL:
//
//     cs.{move}        ->   done @> '{move}'
//
// Run against the live database that is not a miss, it is an error:
//
//     ERROR 22P02: invalid input syntax for type json, Token "move" is invalid
//
// And supabase-js RETURNS errors rather than throwing, so `count` came back
// null, `count ?? 0` handed back a confident 0, and the try/catch never fired.
// A broken query that is indistinguishable from an honest zero.
//
// Handed a STRING the same method passes it through untouched, so
// `JSON.stringify(['move'])` reaches Postgres as `done @> '["move"]'` and
// matches. That is the only correct form for a JSONB column.
//
// It cost three stickers that no child could ever earn, and it pinned the
// child's whole balance objective on a row that could never move.
//
// ── WHY A GUARD AND NOT JUST A FIX ──────────────────────────────────────────
//
// Nothing in the toolchain can see this. It typechecks (contains takes
// `string | readonly unknown[] | Record<string, unknown>`, so both forms are
// valid TypeScript), it builds, and at runtime it fails silently. The only
// witness is the database, and only if somebody looks. The three other
// .contains calls in this repo are on real text[] columns where the array form
// is correct, so a reader has three good examples and one trap.
//
//   node --experimental-strip-types scripts/check-jsonb-contains.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

// ── Which columns are JSONB, straight from the migrations ───────────────────
const MIG = join(ROOT, 'supabase', 'migrations')
const jsonbColumns = new Set()
let migrations = []
try { migrations = readdirSync(MIG).filter(f => f.endsWith('.sql')) } catch { /* no migrations */ }
for (const f of migrations) {
  const sql = readFileSync(join(MIG, f), 'utf8')
    .replace(/--.*$/gm, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
  // `name jsonb ...` in a create table, and `add column [if not exists] name jsonb`
  for (const m of sql.matchAll(/(?:add\s+column\s+(?:if\s+not\s+exists\s+)?)?\b([a-z_][a-z0-9_]*)\s+jsonb\b/gi)) {
    jsonbColumns.add(m[1].toLowerCase())
  }
}

if (jsonbColumns.size === 0) {
  problems.push('could not read any jsonb column from supabase/migrations, so this guard would pass by accident')
}

// ── Every .contains() in our own code ───────────────────────────────────────
const ROOTS = ['app', 'components', 'lib', 'schools']
function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx?|mjs|js)$/.test(name)) out.push(full)
  }
  return out
}
const files = ROOTS.flatMap(r => walk(join(ROOT, r)))

// .contains('column', <arg…   we only need the column and the first character
// of the argument to tell an array literal from anything else.
const CALL = /\.contains\(\s*['"]([a-z_][a-z0-9_]*)['"]\s*,\s*(.)/gi
let checked = 0

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
  for (const m of code.matchAll(CALL)) {
    const column = m[1].toLowerCase()
    const firstChar = m[2]
    checked++
    if (!jsonbColumns.has(column)) continue
    // On a JSONB column an array literal is the bug. A string (a quote or a
    // JSON.stringify call) is the fix.
    if (firstChar === '[') {
      const rel = file.replace(ROOT + '/', '')
      problems.push(
        `${rel}: .contains('${column}', [...]) on a JSONB column. postgrest-js sends the Postgres array literal cs.{...}, ` +
        `which Postgres rejects with "invalid input syntax for type json", and supabase-js returns that error rather than ` +
        `throwing it, so the count comes back null and reads as an honest zero. Pass JSON instead: ` +
        `.contains('${column}', JSON.stringify([...])).`,
      )
    }
  }
}

if (checked === 0) problems.push('found no .contains() calls at all, so this guard is not looking at anything')

if (problems.length > 0) {
  console.error('check-jsonb-contains FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why this fails silently and why tsc cannot see it.')
  process.exit(1)
}
ok.push(`${checked} contains() call${checked === 1 ? '' : 's'} checked against ${jsonbColumns.size} jsonb columns`)
console.log('check-jsonb-contains ok: no JSONB column is filtered with an array literal')
for (const line of ok) console.log('  ' + line)
