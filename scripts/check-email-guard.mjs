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
import { MIN_DAYS_BETWEEN_PROGRAMME_EMAILS, normaliseAddress, dueAgain, leadTeaserDay, leadTeaserWindowDays } from '../lib/email/floor.ts'

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

// The lead teasers sit on the floor, not against it (23 November 2026): the
// first a floor after the day 1 nurture, each a floor apart, and the window
// long enough for all eight and the founder close. Before, the window closed
// after about four and the rest never went.
check('the first lead teaser is a floor after the day 1 nurture', leadTeaserDay(0) === 1 + MIN_DAYS_BETWEEN_PROGRAMME_EMAILS, String(leadTeaserDay(0)))
check('lead teasers are exactly a floor apart', leadTeaserDay(5) - leadTeaserDay(4) === MIN_DAYS_BETWEEN_PROGRAMME_EMAILS)
check('the window holds all eight teasers and the founder close', leadTeaserWindowDays(8) > leadTeaserDay(8), `${leadTeaserWindowDays(8)} days, founder close on day ${leadTeaserDay(8)}`)
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
  // A parent's homework help request, sent to the hello@ inbox, not to them.
  'app/api/learning/help-request/route.ts': 'operational',
  // One email to Justin per new account, never to the parent.
  'lib/ops/signup-alert.ts': 'operational',
  'app/api/cron/digi-insights/route.ts': 'operational',
  'app/api/cron/digi-quality/route.ts': 'operational',
  // What teachers would change, to Justin (migration 403).
  'app/api/cron/lesson-changes/route.ts': 'operational',
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
  // The heads up before one of the six heaviest lessons a child started alone
  // (Justin, sync plan C, October 2026). The lesson opens 48 hours later
  // whether or not the parent has read it, so a floor that held this note for
  // six days would let the lesson open first, which is the one thing the note
  // exists to prevent. At most once per heavy lesson per child, ever, because
  // it only goes when the mission row is first created. Listed 23 November
  // 2026, when the guard was found failing on it.
  'app/k/[token]/school/[lessonId]/route.ts': 'transactional',
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
  // And since 13 November 2026 the taster series (series): five emails a
  // parent asked for by ticking the box on a free page. "Yes, daily for the series".
  //
  // Since 16 November 2026 the topic email course rides the same kind: seven
  // emails on one problem, asked for by name on the stage check result page
  // (decision of 16 November, PR 1573). The cron sends days 2 to 7.
  'app/api/email/cron/route.ts': 'series and transactional and trial',
  // Day 1 of that course, sent the moment the parent presses "Start the seven
  // emails". The press is the consent and names what follows. Skips the floor,
  // never the stop link. Listed 23 November 2026.
  'app/api/course/route.ts': 'series',
  // The "what stopped you" asks (Justin, 16 November 2026, "skip the rule"):
  // three to an account and two to a lead, ever, held below. Kind 'ask' was
  // added that day without this guard learning the word, so the file opted out
  // invisibly for a week. Listed 23 November 2026.
  'app/api/cron/stalled-ask/route.ts': 'ask',
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

const emailIndex = readFileSync('lib/email/index.ts', 'utf8')
const kindUnion = emailIndex.match(/export type EmailKind = ([^\n]+)/)?.[1] ?? ''
const ALL_KINDS = [...kindUnion.matchAll(/'([a-z]+)'/g)].map(m => m[1])
const OPT_OUT_KINDS = ALL_KINDS.filter(k => k !== 'programme')
check('the email kinds are read from the type', ALL_KINDS.includes('programme') && OPT_OUT_KINDS.length >= 4, ALL_KINDS.join(', '))
const OPT_OUT_KIND = new RegExp(`'(${OPT_OUT_KINDS.join('|')})'`, 'g')

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
  //
  // Every kind but programme is an opt out, and the list is read from the type
  // itself so a sixth kind cannot be added without this check seeing it. That
  // is how 'ask' slipped past for a week in November 2026: the kind was added
  // to lib/email/index.ts and this pattern still named only the first four.
  const kinds = [...source.matchAll(OPT_OUT_KIND)].map(m => m[1])
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
  // The kinds that skip the floor but must still be stopped by an unsubscribe
  // and must still count towards the weekly floor. Read from the code: the
  // condition that guards maySendProgramme, and the one that guards
  // recordProgrammeSend, have to name the same kinds, and between them every
  // kind that is not transactional or operational.
  const ON_THE_ADDRESS = OPT_OUT_KINDS.filter(k => k !== 'transactional' && k !== 'operational')
  const condKinds = re => {
    const m = idx.match(re)
    return m ? [...m[1].matchAll(/kind === '([a-z]+)'/g)].map(x => x[1]).sort().join(',') : ''
  }
  const expected = ['programme', ...ON_THE_ADDRESS].sort().join(',')
  const guarded = condKinds(/if \(((?:kind === '[a-z]+'(?: \|\| )?)+)\) \{\s*const verdict = await maySendProgramme/)
  const recorded = condKinds(/if \(((?:kind === '[a-z]+'(?: \|\| )?)+)\) await recordProgrammeSend/)
  check('trial mail still passes the suppression check', guarded.includes('trial'), guarded)
  check('and so does every kind that skips the floor', guarded === expected, `${guarded} vs ${expected}`)
  check('and only the floor is lifted for it',
    /floor: kind === 'programme'/.test(idx) && /if \(floor && !dueAgain/.test(guard))
  check('suppression is read before the floor',
    guard.indexOf('suppressed_at) return') < guard.indexOf('if (floor && !dueAgain'))
  check('and a trial send is recorded so the weekly programme counts on from it',
    recorded === expected, `${recorded} vs ${expected}`)

  const cron = readFileSync('app/api/email/cron/route.ts', 'utf8')
  // Six since 27 November 2026: Justin said yes to the day one "open their app
  // tonight" email, the only trial email about the child's side.
  const TRIAL_KEYS = ['welcome', 'open-their-app', 'day2-stage', 'day3-tour', 'day4-digi', 'trial-ending']
  // Every deliver( call that passes trialKind or 'trial', by its email key.
  // The body may not run on into the next deliver( call: a send with no kind
  // sitting just above a trial send was read as a trial send itself (28
  // November 2026, when the win back moved above the welcome).
  const onClock = [...cron.matchAll(/deliver\(profile\.id, profile\.email!?, '([a-z0-9-]+)'(?:(?!deliver\()[\s\S])*?\), '[A-Za-z0-9]+', (trialKind|'trial')\)/g)].map(m => m[1])
  check('the trial clock carries exactly the six agreed emails',
    onClock.length === TRIAL_KEYS.length && TRIAL_KEYS.every(k => onClock.includes(k)), onClock.join(', '))
  check('trialKind falls back to programme outside the free days',
    /const trialKind: EmailKind = trialClock \? 'trial' : 'programme'/.test(cron))
  check('on the last day trial ending runs before Pass A so a drip cannot take its slot',
    /if \(trialEndingDue && trialEndingLeft <= 1\) await sendTrialEnding\(\)/.test(cron)
      && cron.indexOf('trialEndingLeft <= 1) await sendTrialEnding') < cron.indexOf('// ── Pass A'))
}

// ── THE TASTER SERIES: FIVE EMAILS, ONLY TO A TICKED BOX ────────────────────
//
// Justin, 13 November 2026: "Yes, daily for the series". The series skips the
// floor for its five days, so it must stay exactly five emails, sent only to an
// address that ticked the box on the free page, and nowhere else in the cron.
{
  const cron = readFileSync('app/api/email/cron/route.ts', 'utf8')
  const nurture = readFileSync('lib/magnets/taster-nurture.ts', 'utf8')
  const keys = [...nurture.matchAll(/export const SERIES_([A-Z_0-9]+)_KEY = '([a-z0-9-]+)'/g)].map(m => m[2])
  check('the series is exactly five agreed emails',
    keys.length === 5 && ['series-1', 'series-2', 'series-3', 'series-stage', 'series-full-pack'].every(k => keys.includes(k)), keys.join(', '))
  // Two places, each a series somebody asked for: the taster block (the
  // ticked box) and the topic course block (the start row a parent's own
  // press wrote). A third is a new series nobody has agreed yet.
  const seriesSends = [...cron.matchAll(/kind: [^,}\n]*'series'/g)].length
  check('the series kind is sent from two places in the cron, the taster and the course', seriesSends === 2, String(seriesSends))
  check('the taster only when the box was ticked',
    /const onSeries = lead\.marketing_consent === true/.test(cron) && /kind: onSeries \? 'series' : 'programme'/.test(cron))
  // The course block: only from a start row, never to a lead who stopped, and
  // only the day the course says is due.
  const courseAt = cron.indexOf('// THE TOPIC EMAIL COURSES')
  const courseBlock = courseAt < 0 ? '' : cron.slice(courseAt, cron.indexOf('\n  }\n', courseAt))
  check('the course only from the start row a parent pressed for',
    /\.like\('email_key', 'course:%:start'\)/.test(courseBlock) && /kind: 'series'/.test(courseBlock))
  check('and never to a lead who clicked stop or withdrew consent',
    /l\.unsubscribed_at \|\| l\.marketing_consent === false/.test(courseBlock) && /if \(stopped\.has\(/.test(courseBlock)
      && /if \(!leadRows\) rows\.length = 0/.test(courseBlock))
  check('and only the day the course says is due', /const day = courseDayDue\(/.test(courseBlock))

  // The course route sends day 1 and nothing else.
  const courseRoute = readFileSync('app/api/course/route.ts', 'utf8')
  check('the course route sends day 1 only',
    [...courseRoute.matchAll(/sendEmail\(\{/g)].length === 1 && /courseEmailFor\(email, course, 1\)/.test(courseRoute))

  // A course is a week. Seven emails was the agreed shape, so a longer one is a
  // new decision, not a new entry.
  const registry = readFileSync('lib/courses/registry.ts', 'utf8')
  const { COURSES, COURSE_WINDOW_DAYS } = await import('../lib/courses/registry.ts')
  check('every course is the agreed seven emails',
    COURSES.length > 0 && COURSES.every(c => c.days.length === 7), COURSES.map(c => `${c.slug} ${c.days.length}`).join(', '))
  check('and a course cannot run on past its window',
    COURSE_WINDOW_DAYS <= 21 && /ageDays > COURSE_WINDOW_DAYS\) return null/.test(registry), String(COURSE_WINDOW_DAYS))
}

// ── THE ASKS: THREE TO AN ACCOUNT, TWO TO A LEAD, EVER ──────────────────────
//
// Justin, 16 November 2026, "skip the rule". What makes skipping the floor
// safe is the cap, so the cap is what this holds.
{
  const asks = readFileSync('lib/asks/stalled.ts', 'utf8')
  const askRoute = readFileSync('app/api/cron/stalled-ask/route.ts', 'utf8')
  const stepsBlock = asks.match(/export const ASK_STEPS = \[([\s\S]*?)\] as const/)?.[1] ?? ''
  const steps = [...stepsBlock.matchAll(/key: '([a-z0-9-]+)'/g)].map(m => m[1])
  check('an account is asked at most three times', steps.join(',') === 'ask-1,ask-2,ask-3', steps.join(', '))
  check('and askDue knows no fourth',
    /if \(sent\['ask-3'\] === undefined\)[^\n]*\n\s*return null/.test(asks))
  check('a lead is asked at most twice',
    /'lead-ask-1' \| 'lead-ask-2' \| null/.test(asks))
  check('the ask kind is sent only from the stalled ask cron, twice',
    [...askRoute.matchAll(/kind: 'ask'/g)].length === 2)
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
