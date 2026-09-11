// The three questions come first, and the account comes last.
//
// Every advert we run promises "Three questions. No sign up." (app/page.tsx).
// For two months the second screen of the funnel was Create your account, with
// a name, an email and a password, before a single question about the child.
// Nothing failed, nothing went red, and THE-STORY puts the entire route to
// 4,000 a month through this one page.
//
// It got that way honestly: commit 619150bc front loaded the account in July to
// stop the child being asked about twice. That goal was right. The order was
// not, and the same goal is served by asking once at the END.
//
// So these four rules are held here, because each of them is one edit from
// quietly reversing and none of them would break a build:
//
//   1. The opening screen goes to the first QUESTION.
//   2. The reveal offers to make the account, rather than assuming one.
//   3. The account BLOCKS on an email and a password, and nothing else.
//   4. Nothing writes the account through before the account exists.
//
// Usage: node scripts/check-starter-order.mjs

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

const code = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => (l.trim().startsWith('//') ? '' : l)).join('\n')

const page = code(readFileSync('app/(marketing)/starter-pack/page.tsx', 'utf8'))
const reveal = code(readFileSync('app/(marketing)/starter-pack/ResultScreen.tsx', 'utf8'))

// ── 1. The opening screen goes to a question ───────────────────────────────
const steps = page.match(/type Step = [^\n]*/)
if (!steps) {
  fails.push('The step machine is gone from the starter pack.')
} else if (/'details'/.test(steps[0])) {
  fails.push("The 'details' step is back. That is the account screen in front of the questions, and it breaks the promise every advert makes: \"Three questions. No sign up.\"")
} else {
  ok.push('there is no account screen in front of the questions')
}

const intro = page.match(/onClick=\{\(\) => setStep\('[a-z0-9]+'\)\}\s*\n\s*className="btn btn-gold"/)
if (!intro) {
  fails.push('Could not find the opening button on the intro screen, so its destination cannot be held.')
} else if (!/setStep\('q1'\)/.test(intro[0])) {
  fails.push(`The opening button no longer goes to the first question. It goes to ${intro[0].match(/setStep\('([a-z0-9]+)'\)/)?.[1]}.`)
} else {
  ok.push('the opening button goes straight to the first question')
}

// ── 2. The reveal offers the account ───────────────────────────────────────
if (!/onJoin=\{/.test(page)) {
  fails.push('The reveal is no longer given onJoin, so a parent with no account has nothing to tap but a dashboard they cannot reach.')
} else if (!/accountMade/.test(page)) {
  fails.push('Nothing tracks whether the account exists, so the reveal would offer to make a second one.')
} else {
  ok.push('the reveal offers to save the pathway when there is no account')
}

if (!/onJoin\?\s*:/.test(reveal)) {
  fails.push('ResultScreen no longer accepts onJoin, so the reveal cannot be the place the account is asked for.')
} else {
  ok.push('and the reveal knows how to ask')
}

// ── 3. Two things can BLOCK, and only two ──────────────────────────────────
//
// This used to count the boxes and demand exactly two, on the evidence that an
// email only form beats name and email by 12 to 18 points. That evidence is
// real, and it is about REQUIRED fields.
//
// What the old rule missed is that the name does not go away when you stop
// asking for it. handle_new_user (migration 001) writes
// split_part(email, '@', 1) into profiles.full_name instead, so the welcome
// greeted Justin as "justin+1234", on the funnel every CTA in the product
// points at. Justin, 11 September 2026, asked directly whether the starter
// pack should collect a first name: "yes".
//
// So the rule is what it was always protecting: nothing beyond an email and a
// password may stand between a convinced parent and the product. An optional
// box cannot, a required one can, and the difference is not visible in a count
// of placeholders. It is visible in submitAccount, which is the only thing
// that can refuse to go on.
const account = page.match(/\{step === 'account' && \([\s\S]*?\n        \)\}/)
const submit = page.match(/async function submitAccount\(\)[\s\S]*?\n  \}/)
if (!account) {
  fails.push('The account step is gone from the starter pack.')
} else if (!submit) {
  fails.push('submitAccount is gone, so nothing can be held about what the account step refuses to go on.')
} else {
  const fields = [...account[0].matchAll(/placeholder="([^"]+)"/g)].map(m => m[1])
  // Every early return in submitAccount is a thing that can stop a parent.
  // Reading the guards rather than counting them, because what matters is
  // WHICH field each one is about.
  const gates = [...submit[0].matchAll(/if \(([^)]*(?:\([^)]*\))?[^)]*)\)\s*\{[\s\S]{0,200}?return/g)].map(m => m[1])
  const nameGate = gates.find(g => /\bname\b/.test(g) && !/childName|clean|email|password/i.test(g))
  if (nameGate) {
    fails.push(`submitAccount refuses to continue on the name (${nameGate.trim()}). The name is asked for, never required: this is the last screen between a convinced parent and the product, and a form that will not submit costs more than a missing name, which the greeting already copes with (lib/email/parent-name).`)
  } else if (fields.length > 3) {
    fails.push(`The account step asks for ${fields.length} things (${fields.join(', ')}). Three is the ceiling: an email, a password and a first name they may skip.`)
  } else {
    ok.push(`the account blocks on an email and a password only (${fields.length} boxes: ${fields.join(', ')})`)
  }
}

// ── 4. Nothing is written through before there is an account ───────────────
const timeAnswer = page.match(/function selectTimeCommitment[\s\S]*?\n  \}/)
if (!timeAnswer) {
  fails.push('The time question handler is gone.')
} else if (/finishSetup\(\)/.test(timeAnswer[0])) {
  fails.push('finishSetup runs when the time question is answered, before any account exists. It writes the profile, starts the trial and creates the child, and there is nobody to write it against.')
} else {
  ok.push('nothing is written through before the account exists')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
