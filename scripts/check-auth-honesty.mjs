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

import { readFileSync } from 'node:fs'

// Every screen that calls Supabase auth from the browser.
const SCREENS = [
  'app/(auth)/login/LoginForm.tsx',
  'app/(auth)/signup/page.tsx',
  'app/(auth)/forgot-password/page.tsx',
  'app/(marketing)/starter-pack/page.tsx',
]

const AUTH_CALL = /supabase\.auth\.(signUp|signInWithPassword|resetPasswordForEmail|signInWithOtp)\(/

const fails = []
const ok = []

for (const file of SCREENS) {
  let src
  try { src = readFileSync(file, 'utf8') } catch {
    fails.push(`${file} is listed here and does not exist. Either it moved, in which case fix this list, or a way into an account has gone.`)
    continue
  }
  if (!AUTH_CALL.test(src)) {
    fails.push(`${file} no longer calls Supabase auth. If the call moved, the guard has to follow it.`)
    continue
  }
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
