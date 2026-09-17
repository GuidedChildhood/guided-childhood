// What reaches a child's phone is decided in ONE place.
//
// Justin, 17 September 2026: "can DiGi be clever enough to determine if a
// reminder should also add to child's app, eg PE dress code for the day, or
// payment just for parent?"
//
// It can, and it already did: kit, events and homework are the child's own
// business and go through by default; payments, deadlines and plain notices
// never do unless a grown up sends that one item deliberately. A child cannot
// pay for the trip, and telling them about it only hands them a worry.
//
// WHY THIS GUARD EXISTS. lib/school/child-items.ts opens by saying the rule
// lived inline and was pulled out because "written twice it would drift, and
// the way it would drift is a payment reminder appearing on a nine year old's
// phone". On 17 September 2026 it was written FOUR times: once there, and again
// inline in each of the three reminder crons. They still agreed, so nothing had
// broken yet, and nothing would have gone red on the day they stopped agreeing.
//
// A comment cannot hold a rule in one place. This can.
//
// Usage: node --experimental-strip-types scripts/check-child-kinds.mjs

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { CHILD_KINDS, isChildVisible } from '../lib/school/child-items.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE RULE ITSELF, RUN RATHER THAN READ ───────────────────────────────────
//
// Behaviour, not spelling. A one off that nobody sent, which is what every
// freshly extracted school action is, whether it came from an email, a photo
// or a paste.
const fresh = kind => ({ kind, recurs_weekday: null, sent_to_child: false, auto_send_to_child: false })

for (const kind of ['kit', 'event', 'homework']) {
  check(`a ${kind} reminder reaches the child on its own`, isChildVisible(fresh(kind)))
}
for (const kind of ['payment', 'deadline', 'notice']) {
  check(`a ${kind} reminder NEVER reaches the child on its own`, !isChildVisible(fresh(kind)))
}

// The grown up can still send one deliberately, which is the whole point of the
// second half of the rule.
check('a payment sent on purpose does reach them',
  isChildVisible({ kind: 'payment', recurs_weekday: null, sent_to_child: true }))
check('a weekly payment routine reaches them only when ticked',
  isChildVisible({ kind: 'payment', recurs_weekday: 3, auto_send_to_child: true })
  && !isChildVisible({ kind: 'payment', recurs_weekday: 3, auto_send_to_child: false }))

// An unknown kind must fail closed. If the extractor ever invents one, a
// child's phone is the wrong place to find out.
check('an unknown kind does not reach the child', !isChildVisible(fresh('something-new')))

// The membership itself, so widening it is a decision somebody makes on
// purpose rather than a line that slips into a diff.
check('the set is exactly kit, event and homework',
  CHILD_KINDS.size === 3 && ['kit', 'event', 'homework'].every(k => CHILD_KINDS.has(k)),
  [...CHILD_KINDS].join(', '))

// ── AND IT IS DEFINED IN EXACTLY ONE FILE ───────────────────────────────────

const OWNER = 'lib/school/child-items.ts'
const roots = ['app', 'lib', 'components']
const offenders = []

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) { walk(path); continue }
    if (!/\.tsx?$/.test(path)) continue
    if (path === OWNER) continue
    // A local binding of the name, however it is spelled: const, let or var.
    if (/\b(?:const|let|var)\s+CHILD_KINDS\b/.test(readFileSync(path, 'utf8'))) offenders.push(path)
  }
}
for (const root of roots) walk(root)

check('CHILD_KINDS is defined nowhere but its owner', offenders.length === 0,
  offenders.length ? `redefined in ${offenders.join(', ')}. Import it from ${OWNER} instead.` : '')

// The three reminder crons are the ones that got it wrong, so they are named.
for (const cron of [
  'app/api/school/remind/route.ts',
  'app/api/school/morning/route.ts',
  'app/api/school/soon/route.ts',
]) {
  const src = readFileSync(cron, 'utf8')
  const usesIt = /\bCHILD_KINDS\b/.test(src)
  const importsIt = /import\s*\{[^}]*\bCHILD_KINDS\b[^}]*\}\s*from\s*'@\/lib\/school\/child-items'/.test(src)
  check(`${cron} imports the rule rather than retyping it`, !usesIt || importsIt)
}

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
