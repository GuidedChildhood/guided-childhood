// THE MONTHLY REVIEW REPORTS WHAT MOVED, NOT JUST MINUTES.
//
// Justin, 18 September 2026: "we report a monthly review [showing] these have
// all progressed by email and PWA saying [the] monthly email summary is in,
// and that the results also [summarise] the child's progress and passport
// progress."
//
// Measured before this was built, across every family: 23 worries have reached
// done and 134 are still being chased. That is the number the review exists to
// make visible, and it is why this is worth guarding: an email that quietly
// drops back to minutes only is an email that stops answering the question the
// parent actually has.
//
// THE RULE THAT MATTERS MOST IS THE ONE THAT LOOKS LIKE A DETAIL. A child with
// no timer run used to be dropped from the email, and a family where nobody ran
// one got no email at all. That was correct while this was only about minutes
// and is wrong now, because the parent who never starts a timer is exactly the
// parent whose worries are the only reason they are here.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const ROUTE = 'app/api/email/monthly/route.ts'
const PROGRESS = 'lib/email/month-progress.ts'
const TEMPLATE = 'lib/email/templates.ts'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── 1. THE READER ───────────────────────────────────────────────────────────
const progress = code(read(PROGRESS))
if (progress) {
  // review.md 4a: the five stars are five bands and the server compares BANDS,
  // never raw numbers. Comparing 8 against 7 would call a rounding a result.
  if (!/Math\.ceil\(score \/ 2\)/.test(progress)) {
    fail.push(`${PROGRESS}: the month no longer compares bands. The five stars are five bands and star n posts the top of its band, so a raw number comparison reports a rounding as a result.`)
  }
  // A worry first asked about on the 20th did not improve from zero.
  // Pinned to the FIND, not to the phrase. `created_at < from` also appears in
  // the guard two lines below it, so a loose match stayed green with the
  // baseline read deleted. Mutation testing found exactly that.
  if (!/scored\.find\(r => r\.created_at < from\)/.test(progress)) {
    fail.push(`${PROGRESS}: nothing reads the score from BEFORE the month, so a worry first asked about mid month is reported as having improved from nothing.`)
  }
  if (!/r\.created_at >= from/.test(progress)) {
    fail.push(`${PROGRESS}: resting is no longer scoped to events inside the month, so a worry that rested in March is reported again every month for ever.`)
  }
}

// ── 2. THE ROUTE ────────────────────────────────────────────────────────────
const route = code(read(ROUTE))
if (route) {
  if (!/buildMonthProgress\(/.test(route)) {
    fail.push(`${ROUTE}: the monthly review no longer reads what moved, so it is back to being an email about minutes only.`)
  }
  // THE ONE THAT MATTERS. A bare `continue` here drops the whole child.
  if (!/if \(!progressWorthSending\(progress\)\) continue/.test(route)) {
    fail.push(`${ROUTE}: a child with no logged screen time is dropped from the review again. A family who never runs a timer then gets no email at all, and they are exactly the family whose worries are the only reason they are here.`)
  }
  if (!/pace: null/.test(route)) {
    fail.push(`${ROUTE}: a child with no minutes no longer gets a block without a pace, so the progress they did make goes unreported.`)
  }
  // The push, and only on a real send.
  if (!/sendPush\(/.test(route)) {
    fail.push(`${ROUTE}: no push when the summary lands. Justin asked for email AND the PWA saying the summary is in.`)
  }
  if (!/if \(result === 'sent'\) \{[\s\S]{0,900}?sendPush\(/.test(route)) {
    fail.push(`${ROUTE}: the push is not gated on the email actually sending. A push about a summary that was throttled or failed sends a parent looking for something that is not there.`)
  }
  if (!/audience: 'parents'/.test(route)) {
    fail.push(`${ROUTE}: the monthly push is not addressed to parents. This is a review of a child written for an adult and it must never reach the child's own device.`)
  }
}

// ── 3. THE EMAIL ────────────────────────────────────────────────────────────
const template = code(read(TEMPLATE))
if (template) {
  // The RENDERED heading, not the phrase. It also appears in a doc comment on
  // the type, and comments are stripped before this runs, so a loose match
  // would pass on a template that had lost the block entirely.
  if (!/>What moved this month<\/div>/.test(template)) {
    fail.push(`${TEMPLATE}: the review no longer carries a what moved block.`)
  }
  if (!/if \(!pace\) \{/.test(template)) {
    fail.push(`${TEMPLATE}: the block assumes every child has a minutes figure, so a child with no timer run would render a zero or throw. Nothing logged is not a zero minute month.`)
  }
  // The foot has to match what is actually in the email.
  if (!/anyPace \? '\/dashboard\/stats' : '\/dashboard\/pathway'/.test(template)) {
    fail.push(`${TEMPLATE}: the button always points at the screen time page. On an email to a family who never ran a timer that is a button to an empty screen.`)
  }
  if (!/anyPace$|anyPace\s*\?/m.test(template)) {
    fail.push(`${TEMPLATE}: the closing paragraph no longer depends on there being minutes in the email, so a review with no minutes closes with a paragraph about budgets.`)
  }
}

// ── 4. NO DASHES, ANYWHERE A PARENT READS ──────────────────────────────────
for (const [path, src] of [[PROGRESS, progress], [ROUTE, route]]) {
  if (src && /[–—]/.test(src.replace(/[─│┌┐└┘├┤┬┴┼]/g, ''))) {
    fail.push(`${path}: an en dash or em dash reached the copy. House rule, no dashes ever.`)
  }
}

if (fail.length) {
  console.error('check-monthly-review FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log('check-monthly-review: the month reports what moved, reaches families with no timer, and pushes only on a real send.')
