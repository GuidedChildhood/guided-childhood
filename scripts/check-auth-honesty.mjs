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
