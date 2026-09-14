// The two checks that run on every tap verify the session locally, and they
// answer null for anything that is not a verified, signed in parent.
//
// Justin, 13 September 2026, on the review recommendation to verify the
// session in the middleware locally rather than with a round trip to the auth
// server on every navigation: yes, as its own small PR. Three rules hold it,
// running the real helper against fake auth answers rather than reading its
// text, because a guard its own documentation satisfies is not a guard:
//
//   A. sessionUser maps a verified token to { id, email } and answers null
//      for an error, no claims, no subject, or an expired token; a token
//      with no email still signs in, with email null.
//   B. The middleware and the dashboard layout use sessionUser and never
//      call auth.getUser() themselves, so the per tap cost cannot creep back.
//   C. The helper trusts nothing it did not verify: it calls auth.getClaims()
//      and never decodes a token by hand.
//
//   node --experimental-strip-types scripts/check-session-check.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []

// ── A: the real helper, against fake auth answers ───────────────────────────
const probe = `
import { sessionUser } from './lib/supabase/session.ts'
const fake = (answer) => ({ auth: { getClaims: async () => answer } })
const out = {
  good: await sessionUser(fake({ data: { claims: { sub: 'u1', email: 'a@b.c', exp: 9e9 } }, error: null })),
  noEmail: await sessionUser(fake({ data: { claims: { sub: 'u2', exp: 9e9 } }, error: null })),
  error: await sessionUser(fake({ data: null, error: { message: 'Auth session missing!' } })),
  expired: await sessionUser(fake({ data: null, error: { message: 'invalid JWT: token is expired', code: 'bad_jwt' } })),
  noSub: await sessionUser(fake({ data: { claims: { email: 'a@b.c' } }, error: null })),
  emptySub: await sessionUser(fake({ data: { claims: { sub: '' } }, error: null })),
  noClaims: await sessionUser(fake({ data: {}, error: null })),
  errorWithClaims: await sessionUser(fake({ data: { claims: { sub: 'u3', email: 'a@b.c' } }, error: { message: 'signature invalid', code: 'bad_jwt' } })),
}
console.log(JSON.stringify(out))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`A: the probe could not run the real helper: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  const o = JSON.parse(r.stdout.trim().split('\n').pop())
  const checks = [
    [o.good && o.good.id === 'u1' && o.good.email === 'a@b.c', 'A: a verified token becomes { id, email }'],
    [o.noEmail && o.noEmail.id === 'u2' && o.noEmail.email === null, 'A: a token with no email still signs in, email null'],
    [o.error === null, 'A: an auth error is nobody'],
    [o.expired === null, 'A: an expired token is nobody'],
    [o.noSub === null && o.emptySub === null, 'A: a token with no subject is nobody'],
    [o.noClaims === null, 'A: no claims is nobody'],
    [o.errorWithClaims === null, 'A: claims that arrive with an error are nobody, however plausible they look'],
  ]
  for (const [pass, label] of checks) (pass ? ok : problems).push(pass ? label : `${label}: NOT so`)
}

// ── B: the two per tap callers ──────────────────────────────────────────────
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
for (const f of ['middleware.ts', 'app/(dashboard)/dashboard/layout.tsx']) {
  const src = blank(readFileSync(f, 'utf8'))
  if (!/sessionUser\(supabase\)/.test(src)) problems.push(`B: ${f} does not use sessionUser`)
  else if (/auth\.getUser\(/.test(src)) problems.push(`B: ${f} still calls auth.getUser() on every tap`)
  else ok.push(`B: ${f} verifies the session locally`)
}

// ── C: verified, never decoded by hand ──────────────────────────────────────
const helper = blank(readFileSync('lib/supabase/session.ts', 'utf8'))
if (!/auth\.getClaims\(\)/.test(helper)) problems.push('C: the helper does not verify through auth.getClaims()')
else if (/atob\(|Buffer\.from\(|jwtDecode|jwt_decode|\.split\('\.'\)/.test(helper)) problems.push('C: the helper decodes a token by hand instead of verifying it')
else ok.push('C: the helper verifies through auth.getClaims() and never decodes a token by hand')

if (problems.length > 0) {
  console.error('check-session-check FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-session-check ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
