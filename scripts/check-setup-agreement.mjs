// Do Home and the Setup Quest agree about whether setup is finished?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026, with three screenshots: "keeps saying set up all
// done then loops to one more thing then says done."
//
// Home said one more step. The Setup Quest, reading the same database one tap
// away, said all done. Tapping between them went round for ever.
//
// The cause is that there are TWO implementations of the same question:
//
//   lib/setup/flags.ts        getSetupState, used by the Setup Quest page
//   dashboard/page.tsx        a hand rolled copy of the same flags, used by
//                             Home, the road and the welcome card
//
// getSetupState opens with `const current = stamped ? null : ...`, where
// stamped is profiles.setup_completed_at, and that stamp is the entire
// guarantee that a finished setup never reopens. Home did not read the column
// at all. So any flag going false again put a stamped account back into setup
// on one page and not the other, which is a loop by construction.
//
// The two copies are not merged, deliberately: Home's object carries an
// `agreement` key the shared type does not have, and three other surfaces on
// that page read it. What has to hold is that both honour the stamp and both
// ask about the same steps. That is what this checks.
//
// Usage: node scripts/check-setup-agreement.mjs

import { readFileSync } from 'node:fs'

const read = p => readFileSync(new URL(p, import.meta.url), 'utf8')
const FLAGS = read('../lib/setup/flags.ts')
const STEPS = read('../lib/setup/steps.ts')
const HOME = read('../app/(dashboard)/dashboard/page.tsx')

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── BOTH READ THE STAMP ─────────────────────────────────────────────────────
check(
  'the shared state honours setup_completed_at',
  /stamped\s*\?\s*null/.test(FLAGS),
  'lib/setup/flags.ts',
)
check(
  'Home reads setup_completed_at from the profile',
  /setup_completed_at/.test(HOME.split('const setupStamped')[0] ?? ''),
  'it must be in the select, not just the destructure',
)
check(
  'Home refuses to reopen a stamped setup',
  /!setupStamped/.test(HOME),
  'the one line that was missing',
)

// ── AND THEY ASK ABOUT THE SAME STEPS ───────────────────────────────────────
//
// Home finds its next step with setupSteps.find over its own flags object. If
// that object ever stops covering a key in STEPS, `find` returns that step for
// everybody for ever, because undefined is falsy: a step nobody can ever tick.
const stepKeys = [...STEPS.matchAll(/^\s*key:\s*'(\w+)'/gm)].map(m => m[1])
check('the setup steps were found', stepKeys.length >= 4, stepKeys.join(', '))

const homeFlagsBlock = HOME.match(/const setupFlags = \{([\s\S]*?)\n  \}/)
const homeKeys = new Set([...(homeFlagsBlock?.[1] ?? '').matchAll(/^\s{4}(\w+):/gm)].map(m => m[1]))
check('Home\'s flags object was found', homeKeys.size > 0, [...homeKeys].join(', '))

for (const k of stepKeys) {
  check(`Home has a flag for the "${k}" step`, homeKeys.has(k), 'a missing key is a step nobody can tick')
}

// The shared type is the other half of the same promise.
const typeBlock = STEPS.match(/export type SetupFlags = \{([\s\S]*?)\n\}/)
const typeKeys = new Set([...(typeBlock?.[1] ?? '').matchAll(/^\s*(\w+):/gm)].map(m => m[1]))
for (const k of stepKeys) {
  check(`SetupFlags types the "${k}" step`, typeKeys.has(k))
}

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
