// Every new table in public says who may reach it.
//
// Supabase, email of 23 September 2026: from 30 October 2026, existing projects
// stop granting the Data API access to NEW tables in the public schema by
// default. A table created after that date with no GRANT exists in Postgres but
// is invisible to supabase-js, and every read of it answers 42501 permission
// denied. This app reaches every table through supabase-js, so a migration
// written the way 143 of our 145 table creating migrations were written (no
// grant, relying on the default) would ship a feature that silently cannot load
// or save anything.
//
// Existing tables are untouched: checked on the live database on 24 September
// 2026, all 115 public tables grant select to authenticated and all 115 have
// row level security on. So this looks forward only. Migrations up to and
// including BASELINE predate the change and are left alone.
//
// The rule, per new table created in public:
//   1. a GRANT naming that table (to authenticated, and to anon if the public
//      pages read it), and
//   2. row level security enabled on it.
// Grants and RLS are separate layers. The grant decides whether a role can
// touch the table at all; RLS decides which rows. A grant without RLS would
// expose every row, which is the failure the Supabase change exists to stop.
//
// Node builtins only, so it runs in the guards job with nothing installed.
//
//   node scripts/check-migration-grants.mjs

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'supabase/migrations'
const BASELINE = 347

const problems = []
for (const file of readdirSync(DIR).filter(f => f.endsWith('.sql')).sort()) {
  const num = Number(file.split('_')[0])
  if (!Number.isFinite(num) || num <= BASELINE) continue
  const sql = readFileSync(join(DIR, file), 'utf8')
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  const created = [...sql.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?([a-z_][a-z0-9_]*)"?\s*\(/gi)]
    // A table named with any other schema is not in public.
    .filter(m => !/create\s+table\s+(?:if\s+not\s+exists\s+)?(?!public\.)[a-z_]+\./i.test(m[0]))
    .map(m => m[1].toLowerCase())
  for (const t of new Set(created)) {
    const name = `(?:public\\.)?"?${t}"?`
    if (!new RegExp(`grant\\s+[^;]*\\bon\\s+(?:table\\s+)?${name}\\s+to\\b`, 'i').test(sql)) {
      problems.push(`${file}: creates public.${t} with no GRANT. From 30 October 2026 supabase-js cannot see it. Add, for example:\n      grant select, insert, update, delete on public.${t} to authenticated;`)
    }
    if (!new RegExp(`alter\\s+table\\s+${name}\\s+enable\\s+row\\s+level\\s+security`, 'i').test(sql)) {
      problems.push(`${file}: creates public.${t} without enabling row level security. A grant without RLS exposes every row:\n      alter table public.${t} enable row level security;`)
    }
  }
}

if (problems.length > 0) {
  console.error('check-migration-grants FAILED\n')
  for (const p of problems) console.error(`  ${p}\n`)
  console.error('Supabase stops granting new public tables to the Data API by default on 30 October 2026. See the comment at the top of this file.')
  process.exit(1)
}
console.log(`check-migration-grants ok: every public table created after migration ${BASELINE} is granted and has RLS.`)
