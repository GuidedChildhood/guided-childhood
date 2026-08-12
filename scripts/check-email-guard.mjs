// One email a week, from all systems.
//
// Justin, 12 August 2026, after thirty copies of one email landed in his inbox:
// "we must be careful only to send one once per week from all systems."
//
// Two halves, and this file checks both.
//
// THE FLOOR ITSELF is a pure decision about a timestamp, checked below without
// a database. It is the thing standing between a parent and the morning five
// leads got a nurture and a teaser 1.1 seconds apart.
//
// THE CLASSIFICATION is the half that rots. Every sendEmail call site has to
// say what kind of email it is, and the default is deliberately the cautious
// one, so the risk is not that somebody forgets. The risk is that somebody
// marks a drip as transactional to get it past the floor, and nobody notices
// for a month. So this walks every call site in the repo and prints the ones
// that opt out, with the file they are in, and fails if a new opt out appears
// that is not on the list below.
//
// Usage: node --experimental-strip-types scripts/check-email-guard.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { MIN_DAYS_BETWEEN_PROGRAMME_EMAILS, normaliseAddress, dueAgain } from '../lib/email/floor.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE FLOOR ───────────────────────────────────────────────────────────────
//
// Six days rather than seven, and the missing day earns its place. The weekly
// digest runs on a cron, so consecutive weeks land a few seconds either side of
// the same time. At seven days a digest that ran at 08:20:37 last Monday and
// 08:20:31 this Monday is suppressed by six seconds, and the digest in this
// codebase has already been silently killed once by exactly that kind of thing.
const days = n => n * 86400000
const NOW = Date.UTC(2026, 7, 12, 8, 0, 0)
const wouldSend = sinceMs => dueAgain(new Date(NOW - sinceMs).toISOString(), NOW)

check('one a week is what he asked for', MIN_DAYS_BETWEEN_PROGRAMME_EMAILS === 6, String(MIN_DAYS_BETWEEN_PROGRAMME_EMAILS))
check('a second email 1.1 seconds later is turned away', !wouldSend(1100))
check('and so is one the next morning', !wouldSend(days(1)))
check('and one five days later', !wouldSend(days(5)))
check('six days later it goes', wouldSend(days(6)))
check('a week later it certainly goes', wouldSend(days(7)))
// The boundary case that matters, spelled out: a weekly digest that drifts a
// few seconds earlier week on week must not suppress itself.
check('a weekly digest running six seconds early still goes', wouldSend(days(7) - 6000))

// Never written to before, so nothing is holding them back. Inventing a last
// send to justify silence is how a programme dies quietly.
check('an address we have never emailed is due', dueAgain(null, NOW))
check('and so is one with a timestamp nobody can parse', dueAgain('not a date', NOW))

// ── THE ADDRESS ─────────────────────────────────────────────────────────────
//
// A suppression under one spelling has to hold under every other, or a parent
// who asked to be forgotten is forgotten only in lowercase.
check('addresses normalise', normaliseAddress('  Justin@Example.COM ') === 'justin@example.com')
check('and an already clean one is unchanged', normaliseAddress('a@b.com') === 'a@b.com')

// NOT stripping gmail dots or plus aliases, and that is deliberate rather than
// an oversight. It is what made thirty four correct sends look like one email
// thirty four times, so it is tempting. But plus addressing is a real, separate
// address at most providers, two different people can genuinely hold
// name+a@ and name+b@ at a company domain, and collapsing them would mean one
// person's unsubscribe silently gagging somebody else's mail. A confusing
// inbox is a smaller problem than that.
check('a plus alias stays its own address',
  normaliseAddress('a+one@gmail.com') !== normaliseAddress('a+two@gmail.com'))

// ── WHO OPTS OUT OF THE FLOOR ───────────────────────────────────────────────
//
// Every call site that is not programme mail, with the reason it is allowed.
// Adding to this list should feel like a decision, which is the point of
// having to come here to make it.
const ALLOWED_OPT_OUTS = {
  // Ours, not a parent's. Nobody to unsubscribe and nothing to throttle.
  'app/api/admin/digi-insights/route.ts': 'operational',
  'app/api/cron/digi-insights/route.ts': 'operational',
  'app/api/cron/digi-quality/route.ts': 'operational',
  'app/api/cron/health-alert/route.ts': 'operational',
  'app/api/cron/device-guide-refresh/route.ts': 'operational',
  'app/api/cron/knowledge-refresh/route.ts': 'operational',
  'app/api/cron/script-refresh/route.ts': 'operational',
  'app/api/cron/legal-watch/route.ts': 'operational',
  'app/api/scripts/request/route.ts': 'operational',
  'app/api/keepsakes/interest/route.ts': 'operational',
  'app/api/keepsakes/interest/test/route.ts': 'operational',
  // A parent is waiting for this one right now.
  'app/api/magnet/route.ts': 'transactional',            // the file they just asked for
  'app/api/school/remind/route.ts': 'transactional',     // a reminder they set up, about tomorrow
  'app/api/stripe/webhook/route.ts': 'both',             // their receipt, and the fulfilment desk
  'app/api/onboarding/digi/route.ts': 'transactional',   // welcome, thirty seconds after signing up
  'app/api/email/cron/route.ts': 'transactional',        // the past due card warning only
}

const EXT = new Set(['.ts', '.tsx'])
function walk(path, out = []) {
  let stat
  try { stat = statSync(path) } catch { return out }
  if (stat.isFile()) {
    if (EXT.has(path.slice(path.lastIndexOf('.')))) out.push(path)
    return out
  }
  if (path.includes('node_modules') || path.includes('.next') || path.includes('.claude')) return out
  for (const entry of readdirSync(path)) walk(join(path, entry), out)
  return out
}

const optOuts = new Map()
let callSites = 0
for (const file of [...walk('app'), ...walk('lib')]) {
  const source = readFileSync(file, 'utf8')
  if (!source.includes('sendEmail(')) continue
  // Count call sites, ignoring the definition itself.
  const calls = source.match(/sendEmail\(\{/g) ?? []
  if (file.endsWith('lib/email/index.ts')) continue
  callSites += calls.length
  // Any mention of the two opt out kinds, not only `kind: 'x'`. The first
  // version of this looked for the object property alone and missed the past
  // due warning, which opts out by passing 'transactional' positionally to a
  // local deliver helper. A detector that only sees one spelling of an opt out
  // is a detector that reports a clean sheet while an opt out sits in the file.
  const kinds = [...source.matchAll(/'(operational|transactional)'/g)].map(m => m[1])
  if (kinds.length > 0) optOuts.set(file, [...new Set(kinds)].sort().join(' and '))
}

console.log(`\nRead ${callSites} sendEmail call sites. ${optOuts.size} files opt out of the floor.`)
for (const [file, kinds] of [...optOuts].sort()) {
  const expected = ALLOWED_OPT_OUTS[file]
  const ok = expected !== undefined
  check(`  ${file} (${kinds})`, ok, ok ? '' : 'NOT ON THE LIST. If this is really not programme mail, add it to ALLOWED_OPT_OUTS with a reason.')
}

// And the list must not rot the other way either: an entry for a file that no
// longer opts out is a stale permission sitting there waiting to excuse
// something it was never meant to.
for (const file of Object.keys(ALLOWED_OPT_OUTS)) {
  check(`  ${file} still opts out`, optOuts.has(file), optOuts.has(file) ? '' : 'stale entry, remove it')
}

// ── AND THE DEFAULT IS THE SAFE ONE ─────────────────────────────────────────
const indexSource = readFileSync('lib/email/index.ts', 'utf8')
check('an unmarked send is treated as programme mail',
  /const kind = params\.kind \?\? 'programme'/.test(indexSource))
check('the floor is checked before the send, not after',
  indexSource.indexOf('maySendProgramme') < indexSource.indexOf('client().emails.send'))
check('and a throttle is reported as skipped rather than as an error',
  /skipped: verdict\.reason/.test(indexSource))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
