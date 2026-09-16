// Every way into an account tells the truth about why it failed.
//
// Justin, 10 September 2026, with the starter pack signup: "cant log in". The
// screen said **Failed to fetch**, which is what Chrome calls a request that
// died before it left the machine. Supabase's own logs show no signup arriving,
// so the app was right that it failed and wrong about everything else: it
// showed a browser internal to a person trying to buy the product.
//
// The cause is documented at the top of lib/supabase/client.ts and it has
// happened before. NEXT_PUBLIC values are baked in at build time, so a build
// made without them points at placeholder.supabase.co for ever. On 2 August
// that told Justin his password was wrong. The login form was fixed then. The
// other three ways in were not, and one of them is the first screen a new
// customer ever sees.
//
// So this holds all four to the same two rules:
//
//   1. Check whether this build is connected before asking it anything.
//   2. Never show a raw fetch failure as though it were an answer.
//
// A fifth way in will be written one day, and it will be written by somebody
// who has never seen placeholder.supabase.co.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// ── THE LIST FINDS ITSELF (15 September 2026) ───────────────────────────────
//
// This used to be four hardcoded paths, and the note above already knew the
// problem with that: "a fifth way in will be written one day, and it will be
// written by somebody who has never seen placeholder.supabase.co." A fixed list
// cannot see a fifth door, and it goes red when a door legitimately CLOSES.
//
// It went red for the second reason today. /signup became a redirect to
// /starter-pack, so it stopped calling Supabase auth and the list said a way in
// had gone missing. That is the guard doing its job and asking a fair question,
// and deleting the entry would have answered it by making the guard smaller.
//
// So the rule is stated the way it was always meant: ANY file that calls
// Supabase auth from the browser obeys the two rules, whoever writes it and
// wherever they put it. A door that closes simply stops matching. A fifth door
// is covered the moment it is written.
//
// MUST_EXIST keeps the guard honest in the other direction: if a refactor left
// nothing calling auth at all, a scan would find zero files and pass happily.
// These three are the ways in that have to keep existing.
const MUST_EXIST = [
  'app/(auth)/login/LoginForm.tsx',
  'app/(auth)/forgot-password/page.tsx',
  'app/(marketing)/starter-pack/page.tsx',
]

// ANY receiver, not one named `supabase`.
//
// This used to read /supabase\.auth\.(...)/, which only matched a client stored
// in a variable spelled exactly "supabase". That was survivable while the list
// of doors was hardcoded. Now the list is discovered, the pattern IS the list:
// a door that writes `const s = createClient()` would simply never be found,
// and would pass by being invisible. Mutation tested with exactly that shape.
const AUTH_CALL = /\.auth\s*\.\s*(signUp|signInWithPassword|resetPasswordForEmail|signInWithOtp)\s*\(/

function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full)
  }
  return out
}

const ROOT = process.cwd()
const fails = []
const ok = []

// Every file that actually calls it, found rather than remembered.
const SCREENS = ['app', 'components']
  .flatMap(r => walk(join(ROOT, r)))
  .filter(f => AUTH_CALL.test(readFileSync(f, 'utf8')))
  .map(f => f.replace(ROOT + '/', ''))

for (const must of MUST_EXIST) {
  if (!SCREENS.includes(must)) {
    fails.push(`${must} no longer calls Supabase auth. That is one of the ways into an account, so either it moved (fix MUST_EXIST) or a door has gone.`)
  }
}
if (SCREENS.length === 0) {
  fails.push('nothing in app/ or components/ calls Supabase auth, so this guard is not looking at anything')
}

for (const file of SCREENS) {
  const src = readFileSync(join(ROOT, file), 'utf8')
  const configured = /isSupabaseConfigured\(\)/.test(src)
  const translated = /networkAuthMessage\(/.test(src)
  if (!configured) fails.push(`${file} calls Supabase auth without asking isSupabaseConfigured() first. On a build with no NEXT_PUBLIC variables it will blame the person typing.`)
  if (!translated) fails.push(`${file} shows Supabase's error without passing it through networkAuthMessage(). A dead fetch is not an answer about somebody's account.`)
  if (configured && translated) ok.push(`${file.split('/').pop()} checks the build and translates a dead fetch`)
}

// ── RULE THREE: A SIGNUP THAT SUCCEEDS AND IS NOT A SIGNUP ──────────────────
//
// Added 16 September 2026. The two rules above are about a request that never
// landed. This one is about a request that landed and lied politely.
//
// Supabase answers a signup for an address that ALREADY EXISTS with a user
// object and no error, so a stranger cannot probe which emails have accounts
// here. Every error branch in every door is therefore skipped. In the starter
// pack the consequence was not a wrong message but a false promise: no error
// and no session, so the flow fell through to its confirmation screen and told
// the parent to check their email for a message Supabase had just decided not
// to send.
//
// The empty identities array is the only signal the browser gets.
//
// Discovered, not listed, in the spirit of the block at the top of this file:
// any door that calls signUp obeys this, including the fifth one nobody has
// written yet. Doors that only sign people IN are not asked, since they never
// create anything.
//
// Comments are stripped before testing. The first version of this rule
// searched the file for the word "identities" and PASSED against a mutation
// that had gutted the check and left this paragraph standing, which is exactly
// the failure a guard exists to prevent.
const strip = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1')

const SIGNUP_CALL = /\.auth\s*\.\s*signUp\s*\(/

for (const file of SCREENS) {
  const src = strip(readFileSync(join(ROOT, file), 'utf8'))
  if (!SIGNUP_CALL.test(src)) continue
  if (!/identities\s*(\?\.|\.)\s*length/.test(src)) {
    fails.push(`${file} calls signUp and never tests data.user.identities.length. Supabase returns NO error when the address already exists, so without that test a parent who already has an account is told nothing true: in the starter pack they are told to check an email that was never sent.`)
  } else {
    ok.push(`${file.split('/').pop()} spots an address that already has an account, which Supabase will not error about`)
  }
}

// The helper itself has to keep covering every browser's wording. Chrome says
// one thing, Firefox another, Safari a third, and a guard that only knew
// Chrome's would have passed the day Justin opened it on his phone.
const helper = readFileSync('lib/supabase/client.ts', 'utf8')
for (const phrase of ['failed to fetch', 'networkerror', 'load failed']) {
  if (!helper.toLowerCase().includes(phrase)) {
    fails.push(`networkAuthMessage no longer matches "${phrase}". That is one browser's way of saying the request never landed.`)
  }
}
if (!fails.some(f => f.includes('networkAuthMessage no longer matches'))) {
  ok.push('the helper still covers Chrome, Firefox and Safari')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
