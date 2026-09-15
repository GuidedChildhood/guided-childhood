// There is one way to create an account, and both doors write the same thing.
//
// Justin, 15 September 2026: "I set up a new user yesterday and seemed the
// starter pack, which I think linked from an email, was a different way in, it
// seemed clearer. Can you investigate what this is and why 2 different sign
// ins?" Then, once he had the answer: "a yes to one door but the best designed
// door", and, importantly, "don't rewire what we have though as this may break
// it."
//
// ── WHAT WAS ACTUALLY WRONG ─────────────────────────────────────────────────
//
// Two account creation routes, and only one advertised:
//
//   /starter-pack  three questions about the child, a personalised reveal, then
//                  email and password at the END. Asks the time commitment.
//                  Every advert, marketing page, site header and email.
//
//   /signup        name, email and password first, then the /onboarding wizard.
//                  Never asked the time question. Linked from exactly ONE place
//                  in the product, the "New here?" line under the login form.
//
// The damage was not cosmetic. A /signup parent had no time budget on record,
// so DiGi's system prompt read "Daily time this parent committed to at signup:
// not specified" and its advice was sized to nobody. And the two doors wrote
// DIFFERENT VOCABULARIES into onboarding_answers.challenge: the starter pack a
// ChallengeId (the six keys the pathway content is authored against), the
// wizard a raw worry id. Nothing looked broken because the two lookup maps that
// matter were widened to accept both, but lib/content/stages.ts still types
// challengeActions as Partial<Record<ChallengeId, string>>, so the next reader
// written against the type the field claims to be gets nothing, silently, for
// every parent who came the other way.
//
// ── WHAT THIS GUARD ENFORCES ────────────────────────────────────────────────
//
//   1. /signup redirects rather than rendering a second sign up form.
//   2. Nothing links to /signup as a place to start.
//   3. Both writers of onboarding_answers.challenge put a ChallengeId there.
//
// None of it is visible to a typecheck: a second form is valid code, a link is
// a string, and challenge is typed as whatever the object literal puts in it.
//
//   node scripts/check-one-door.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

// ── 1. The second door is closed ────────────────────────────────────────────
const signup = read('app/(auth)/signup/page.tsx')
if (signup === null) {
  problems.push('app/(auth)/signup/page.tsx is gone entirely. A dead link from anywhere still pointing at it would 404 rather than land on the real door, so the redirect should stay.')
} else if (!/redirect\(/.test(signup)) {
  problems.push('app/(auth)/signup/page.tsx no longer redirects, so there are two ways to create an account again. The second one does not ask the time question, so DiGi sizes its advice to nobody for everyone who comes that way.')
} else if (!/starter-pack/.test(signup)) {
  problems.push('app/(auth)/signup/page.tsx redirects somewhere that is not /starter-pack')
} else if (/useState|<form|<input/.test(signup)) {
  problems.push('app/(auth)/signup/page.tsx redirects but still carries a form, so the second door is half open')
} else {
  ok.push('/signup redirects to /starter-pack and renders no form of its own')
}

// ── 2. Nothing sends a new parent to it ─────────────────────────────────────
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
const files = ['app', 'components', 'lib', 'schools'].flatMap(r => walk(join(ROOT, r)))
const SIGNUP_LINK = /(?:href|redirectTo)\s*=\s*[{"']\s*["'`]?\/signup\b/
const linkers = []
for (const file of files) {
  const rel = file.replace(ROOT + '/', '')
  if (rel === 'app/(auth)/signup/page.tsx') continue
  if (SIGNUP_LINK.test(strip(readFileSync(file, 'utf8')))) linkers.push(rel)
}
if (linkers.length > 0) {
  problems.push(`these send a parent at /signup rather than the one door: ${linkers.join(', ')}. It redirects, so nothing breaks, but a bounce is not a design.`)
} else {
  ok.push(`no link anywhere points a new parent at /signup (${files.length} files checked)`)
}

// ── 3. Both doors write a ChallengeId, not two vocabularies ─────────────────
const worries = read('lib/onboarding/worries.ts')
const wizard = read('app/onboarding/page.tsx')
const starter = read('app/(marketing)/starter-pack/page.tsx')

if (!worries || !/export function challengeFor/.test(worries)) {
  problems.push('lib/onboarding/worries.ts no longer exports challengeFor, which is the one map from a parent\'s worry to a pathway ChallengeId')
} else if (!wizard || !/challenge:\s*challengeFor\(/.test(wizard)) {
  problems.push('app/onboarding/page.tsx writes onboarding_answers.challenge without challengeFor, so it is putting a raw worry id in a field everything else reads as a ChallengeId. The readers that survive today do so only because two lookup maps were widened to accept both.')
} else if (!starter || !/challengeFor\(/.test(starter)) {
  problems.push('app/(marketing)/starter-pack/page.tsx no longer derives a ChallengeId')
} else {
  ok.push('both doors write onboarding_answers.challenge through challengeFor')
}

// ── 4. Nobody is left without a time budget ─────────────────────────────────
if (wizard && /timeCommitment:\s*timeCommitment\s*\?\?\s*null/.test(wizard)) {
  problems.push('app/onboarding/page.tsx writes timeCommitment as null again. DiGi reads that field straight into its prompt and says "not specified", so its advice stops being capped to the minutes the parent actually has.')
} else if (wizard && !/timeCommitment/.test(wizard)) {
  problems.push('app/onboarding/page.tsx no longer writes timeCommitment at all')
} else {
  ok.push('the wizard never writes a null time budget, so DiGi is never told "not specified"')
}

if (problems.length > 0) {
  console.error('check-one-door FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for what the two doors cost a family.')
  process.exit(1)
}
console.log('check-one-door ok: one way in, and both writers agree')
for (const line of ok) console.log('  ' + line)
