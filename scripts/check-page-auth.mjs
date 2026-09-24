// Every tap asks "who is this" without a trip to the auth server.
//
// Justin, 24 September 2026: "DiGi and navigating is still slow."
//
// The 13 September fix moved the middleware and the dashboard layout onto
// sessionUser (a signature check, no network) and left sixty seven dashboard
// pages still opening with supabase.auth.getUser(), a round trip to
// /auth/v1/user before the page could run its own queries. The auth server log
// counted 1,504 of those calls in one day on a product with one person testing
// it. DiGi paid the same toll: digi_latency.auth_ms, median 130ms, before a
// single piece of context was gathered.
//
// A new page copies the page next to it, so one getUser() slipping back in is
// how this becomes sixty seven again. This fails the build when it does.
//
// Browser components are exempt: they run in the parent's browser, never on a
// navigation's server path, and they have no sessionUser to call.
//
// Node builtins only, so it runs in the guards job with nothing installed.
//
//   node scripts/check-page-auth.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['app/(dashboard)']
// Routes a parent waits on every time, outside the dashboard tree.
const HOT_ROUTES = ['app/api/digi/route.ts']

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}

const isClient = (src) => /^\s*['"]use client['"]/.test(src)

const problems = []
for (const file of [...ROOTS.flatMap(r => walk(r)), ...HOT_ROUTES]) {
  const src = readFileSync(file, 'utf8')
  if (isClient(src)) continue
  if (/\.auth\.getUser\(\s*\)/.test(src)) {
    problems.push(
      `${file}: calls supabase.auth.getUser(), a round trip to the auth server on every visit. ` +
      `Use sessionUser(supabase) from lib/supabase/session.ts, which checks the token locally.`,
    )
  }
}

if (problems.length > 0) {
  console.error('check-page-auth FAILED\n')
  for (const p of problems) console.error(`  ${p}\n`)
  console.error('Every page a parent taps into should start its own queries straight away. See lib/supabase/session.ts.')
  process.exit(1)
}
console.log('check-page-auth ok: every dashboard page and DiGi check the session locally.')
