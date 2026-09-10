// One tap sign in stays config driven, and the answers survive the round trip.
//
// Justin, 10 September 2026: "Go ahead with Apple and google". Five properties
// hold this together and every one of them can be reversed in a single edit
// with nothing failing a typecheck.
//
//   1. THE PROVIDER LIST IS CONFIG. Hardcode ['google','apple'] and a deploy
//      whose Supabase has neither switched on shows two buttons that answer
//      "Unsupported provider" on the last screen before a parent pays us.
//
//   2. NO PROVIDER, NO BUTTON. The early return is what makes property 1 worth
//      anything. Without it an unset config draws an empty rule and a gap.
//
//   3. THE PENDING BLOB CARRIES THE BIRTHDAY AND THE CHILD'S NAME. The three
//      older keys do not: gc_starter_answers has neither, and the one that
//      holds the birthday is deleted at the reveal. Drop either and a parent
//      coming back from Google is asked their child's birthday a second time,
//      which is the double asking the July front loading set out to end.
//
//   4. THE RETURN CHECKS FOR A SESSION. /auth/callback sends a failed exchange
//      to /login, so landing here signed out should not happen. That is exactly
//      the case that writes a child row against nobody if nothing looks.
//
//   5. ONE WRITE THROUGH, TWO CALLERS. Two copies of the code that creates a
//      family's first child row is how they come to disagree.

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

// Comments are not code. A guard on this repo once stayed green because the
// comment explaining a prop outlived the prop, so every test runs on the source
// with its comments taken out.
function code(path) {
  return readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(l => (l.trim().startsWith('//') ? '' : l))
    .join('\n')
}

// ── 1. The provider list is read from config ───────────────────────────────
const providers = code('lib/auth/providers.ts')
if (!/process\.env\.NEXT_PUBLIC_AUTH_PROVIDERS/.test(providers)) {
  fails.push('lib/auth/providers.ts no longer reads NEXT_PUBLIC_AUTH_PROVIDERS. The list of providers has to be config: a button for a provider Supabase has not been given credentials for answers "Unsupported provider" when a parent taps it.')
} else {
  ok.push('the provider list is read from config, not written into the code')
}

// enabledProviders must FILTER by what was asked for. A version that returns
// KNOWN regardless is the hardcoded list wearing the config's clothes.
const enabled = providers.slice(providers.indexOf('export function enabledProviders'))
if (!/asked\.includes\(/.test(enabled)) {
  fails.push('enabledProviders no longer filters the known providers by what config asked for, so every provider is on whatever the environment says.')
} else {
  ok.push('enabledProviders returns only what config asked for')
}

// ── 2. Nothing configured, nothing drawn ───────────────────────────────────
const buttons = code('components/auth/ProviderButtons.tsx')
if (!/providers\.length === 0\)\s*return null/.test(buttons)) {
  fails.push('ProviderButtons no longer returns null when no provider is enabled. An unconfigured deployment would draw an empty "or" rule, or worse a button that cannot work.')
} else {
  ok.push('no provider configured means no button drawn')
}

// The marks must be inline. A logo pulled from a CDN puts a third party on our
// signup screen and breaks when they move it.
if (/<img[^>]+src=["'`]https?:/.test(buttons)) {
  fails.push('ProviderButtons loads a logo over the network. Both marks are inline SVG on purpose: a third party script or image on the signup screen is a third party watching the signup screen.')
} else {
  ok.push('both provider marks are inline, nothing fetched')
}

// ── 3. The blob carries what the old keys lose ─────────────────────────────
const finish = code('lib/starter/finish-setup.ts')
// Look inside the type itself, not the whole file: `p.dob` used further down
// would satisfy a loose search while the field it reads had been renamed away.
const typeStart = finish.indexOf('export type PendingSetup')
const typeBlock = typeStart === -1 ? '' : finish.slice(typeStart, finish.indexOf('}', typeStart))
if (!typeBlock) fails.push('PendingSetup, the shape that travels through the provider round trip, is gone from lib/starter/finish-setup.ts.')
for (const field of ['dob', 'childName']) {
  if (!new RegExp(`\\b${field}\\s*:`).test(typeBlock)) {
    fails.push(`PendingSetup no longer carries ${field}. gc_starter_answers has never held it and gc_starter_progress is deleted at the reveal, so a parent returning from Google would be asked for it a second time.`)
  } else {
    ok.push(`the pending blob carries ${field}, which the older keys lose`)
  }
}

const starter = code('app/(marketing)/starter-pack/page.tsx')
// The blob has to be written BEFORE the browser leaves, which is what
// onBeforeRedirect is for. Written anywhere else it is written too late.
if (!/onBeforeRedirect=\{\(\) => keepPendingSetup\(/.test(starter)) {
  fails.push('The starter pack no longer saves the answers in onBeforeRedirect. Anything written after signInWithOAuth resolves is written after the browser has already gone.')
} else {
  ok.push('the answers are saved before the browser leaves for the provider')
}

// ── 4. The return checks for a session before writing ──────────────────────
const returnBlock = starter.slice(starter.indexOf("get('finish')"))
const writeAt = returnBlock.indexOf('writeStarterSetup(')
const guardAt = returnBlock.indexOf('if (!user)')
if (writeAt === -1) {
  fails.push('The provider return no longer calls writeStarterSetup, so a parent who signed in with Google arrives with none of their answers written.')
} else if (guardAt === -1 || guardAt > writeAt) {
  fails.push('The provider return writes the setup without first checking a session exists. /auth/callback sends a failed exchange to /login, so this is the path that writes a child row against nobody.')
} else {
  ok.push('the provider return checks for a session before it writes anything')
}

// ── 5. One write through, two callers ──────────────────────────────────────
// The starter page must not have grown its own copy back.
if (/await supabase\.from\('children'\)\.insert\(/.test(starter)) {
  fails.push("The starter pack creates a child row itself again. That code lives in lib/starter/finish-setup.ts precisely so the password path and the provider path cannot drift apart.")
} else {
  ok.push('the child row is created in one place, called from both ways in')
}

const callers = [...starter.matchAll(/writeStarterSetup\(/g)].length
if (callers < 2) {
  fails.push(`The starter pack calls writeStarterSetup ${callers} time(s). Both ways in need it: the password path when the session appears, and the provider return when the parent lands back.`)
} else {
  ok.push('both ways in call the one write through')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
