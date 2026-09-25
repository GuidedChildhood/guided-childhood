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
  'app/api/cron/platform-watch/route.ts': 'operational',       // platform changes to review
  'app/api/devices/family/route.ts': 'operational',            // an unlisted device, no family details
  // The school's own confirmation of the invoice they asked for, and the lead
  // note to us. Listed 25 September 2026 when the guard was found failing on
  // these four files: each had shipped without coming here first.
  'app/api/cron/invoice-requests/route.ts': 'both',
  // A parent is waiting for this one right now.
  'app/api/magnet/route.ts': 'transactional',            // the file they just asked for
  'app/api/school/remind/route.ts': 'transactional',     // a reminder they set up, about tomorrow
  'app/api/school/connect/email-me/route.ts': 'transactional', // the connect steps they just asked us to email
  'app/api/stripe/webhook/route.ts': 'both',             // their receipt, and the fulfilment desk
  // The welcome used to be here, exempt from the floor because it goes out
  // thirty seconds after signing up. It sends as programme now, on Justin's
  // correction of 13 August: the rule is one email a week from all systems,
  // and a welcome is a real email in a real inbox. Exempting it meant the
  // programme fired the next morning and a brand new parent got two emails in
  // two days. This list is the record of what is deliberately outside the
  // floor, so an entry for a file that no longer opts out is a lie about the
  // policy, and this check is right to say so.
  // The past due card warning (transactional), and since 25 September 2026
  // the trial clock (trial): the welcome, days two to four and the trial
  // ending note, inside the free days only. Justin: "yes, on the trial clock".
  'app/api/email/cron/route.ts': 'transactional and trial',
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
  const kinds = [...source.matchAll(/'(operational|transactional|trial)'/g)].map(m => m[1])
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

// ── THE TRIAL CLOCK SKIPS THE FLOOR, NEVER THE UNSUBSCRIBE ──────────────────
//
// 'trial' mail exists so the free days' emails can land on their days. What
// it must never do is reach somebody who asked us to stop, and it must never
// grow past the five emails Justin agreed on 25 September 2026.
{
  const idx = readFileSync('lib/email/index.ts', 'utf8')
  const guard = readFileSync('lib/email/address-guard.ts', 'utf8')
  check('trial mail still passes the suppression check',
    /kind === 'programme' \|\| kind === 'trial'\) \{\s*const verdict = await maySendProgramme/.test(idx))
  check('and only the floor is lifted for it',
    /floor: kind === 'programme'/.test(idx) && /if \(floor && !dueAgain/.test(guard))
  check('suppression is read before the floor',
    guard.indexOf('suppressed_at) return') < guard.indexOf('if (floor && !dueAgain'))
  check('and a trial send is recorded so the weekly programme counts on from it',
    /kind === 'programme' \|\| kind === 'trial'\) await recordProgrammeSend/.test(idx))

  const cron = readFileSync('app/api/email/cron/route.ts', 'utf8')
  const TRIAL_KEYS = ['welcome', 'day2-stage', 'day3-tour', 'day4-digi', 'trial-ending']
  // Every deliver( call that passes trialKind or 'trial', by its email key.
  const onClock = [...cron.matchAll(/deliver\(profile\.id, profile\.email!?, '([a-z0-9-]+)'[\s\S]*?\), '[A-Za-z0-9]+', (trialKind|'trial')\)/g)].map(m => m[1])
  check('the trial clock carries exactly the five agreed emails',
    onClock.length === TRIAL_KEYS.length && TRIAL_KEYS.every(k => onClock.includes(k)), onClock.join(', '))
  check('trialKind falls back to programme outside the free days',
    /const trialKind: EmailKind = trialClock \? 'trial' : 'programme'/.test(cron))
  check('on the last day trial ending runs before Pass A so a drip cannot take its slot',
    /if \(trialEndingDue && trialEndingLeft <= 1\) await sendTrialEnding\(\)/.test(cron)
      && cron.indexOf('trialEndingLeft <= 1) await sendTrialEnding') < cron.indexOf('// ── Pass A'))
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
