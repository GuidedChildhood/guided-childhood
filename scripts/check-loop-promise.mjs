// DOES A PARENT UNDERSTAND THAT WE KEEP HELPING?
//
// Justin, 8 October 2026, looking at the check in: "review that a user will
// understand that we will keep helping with these issues, and keep adding any
// raised in DiGi, and check common issues age related with devices, so always
// on top of issues, solutions, getting your child ready as they go; the
// research loop and the system and the emails all focus on this approach."
//
// The review found the promise kept in the code and only half said on the
// screen. These are the lines that say it, one per surface, and this guard
// holds them so a copy pass cannot quietly turn the list back into a chore.
//
//   A. DiGi: the tool rule and the tool reply agree. A worry told to DiGi goes
//      on the check in AND the parent is told once. The reply used to say
//      "do not mention it", which the model obeyed.
//   B. The check in: the one intro line carries the promise before any tap,
//      and the row tally says "on your list", never "still open".
//   C. The fix of the week says it is the problems parents hit at this age,
//      in order, so the age loop is visible.
//   D. The week later card says a "Not really" earns a different approach and
//      counts for every family on the same worry.
//   E. The weekly email says, every week, that open worries stay on the check
//      in and we keep offering the next approach; the cron passes the count.
//   F. Notifications says what it is in the loop and that the tracker holds a
//      skipped item.
//   G. The Sunday suggestion is told what is still open and what worked for
//      other families on it.
//   H. None of those lines carries a dash.
//
// Usage: node scripts/check-loop-promise.mjs

import { readFileSync } from 'node:fs'

const ok = [], problems = []
const check = (pass, label) => (pass ? ok : problems).push(label)
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = (f) => strip(readFileSync(f, 'utf8'))

// A
const tools = read('lib/digi/tools.ts')
check(/A WORRY TOLD TO YOU GOES ON THE TRACKER[\s\S]*Tell them once, in plain words, that it is on their check in now/.test(tools), 'A: the DiGi rule says tell the parent once that it is on their check in')
const concernReply = tools.match(/return '([^']*on their daily check in now[^']*)'/)
check(!!concernReply && /Tell the parent once/.test(concernReply[1]), 'A: the concern tool reply tells DiGi to say it is on their check in')
check(/return 'Saved\. Do not mention it to the parent\.'/.test(tools), 'A: a plain memory is still saved quietly')
const replyAt = tools.indexOf("on their daily check in now"), quietAt = tools.indexOf("return 'Saved. Do not mention it to the parent.'"), raiseAt = tools.indexOf('await raiseConcern(ctx.supabase')
check(raiseAt > -1 && raiseAt < replyAt && replyAt < quietAt, 'A: the concern reply follows the ledger write and precedes the quiet reply')

// B
const checkin = read('components/daily/ConcernCheckIn.tsx')
check(/One tap each\. Going great and it comes off your list; anything less stays on it and we keep working on it with you\./.test(checkin), 'B: the intro line carries the promise before any tap')
check(!/One tap each[^`']*DiGi/.test(checkin), 'B: the intro line never asks for DiGi (Justin, 8 October: not on each check in)')
check(/great days in a row and it comes off your list; anything less stays on it and we keep working on it with you/.test(checkin), 'B: the longer run variant carries it too')
check(/times, still on your list`/.test(checkin) && !/times, still open`/.test(checkin), 'B: the row tally says on your list, not still open')

// C
const fix = read('components/home/IssueOfTheWeek.tsx')
check(/The problems parents hit at \$\{BAND_LABEL\[pick\.band\] \?\? pick\.band\}, in the order they come\. One a week, so you are ahead of them\./.test(fix), 'C: the fix of the week says what it is, by age, in order')
check(/You have done every one for/.test(fix), 'C: the kept up state says every one for the age is done')

// D
const prompts = read('components/digi/DigiPrompts.tsx')
check(/Not really is the most useful answer here\. It gets you a different approach next, and it counts for every family on the same worry\./.test(prompts), 'D: the week later card says what a Not really does')

// E
const templates = read('lib/email/templates.ts')
check(/openWorries\?: number \| null/.test(templates) && /still open on \$\{childLabel\}'s check in\. We keep asking, and keep offering the next approach, until each one rests\./.test(templates), 'E: the weekly email carries the promise every week')
const cron = read('app/api/cron/weekly-review/route.ts')
check(/\.in\('status', \['open', 'improving'\]\)/.test(cron) && /momentum, openWorries \}\)/.test(cron), 'E: the Sunday cron counts the open worries and passes them')

// F
const notifications = read('app/(dashboard)/dashboard/notifications/page.tsx')
check(/DiGi's check backs, the worries that need a word tonight, and what came up today\. Skip one and the tracker still holds it\./.test(notifications), 'F: Notifications says what it is in the loop')

// G
const weekly = read('lib/digi/weekly-review.ts')
check(/getProvenSolutions\(/.test(weekly) && /Worries still open on their daily check in/.test(weekly), 'G: the Sunday suggestion is told what is still open and what worked')
check(/say plainly that it is what worked for other families with a child this age\. Never invent a pattern\./.test(weekly), 'G: the suggestion may only use a real pattern and must say whose it is')
const genAt = weekly.indexOf('await gatherOpenWorries('), bodyAt = weekly.indexOf('await generateReview(stats, reflections, open)')
check(genAt > -1 && bodyAt > genAt, 'G: the open worries are gathered before the review is written')

// I: once a week, the Sunday check in asks for anything new to track, and it lands on the tracker
const sunday = read('components/digi/SundayCheckIn.tsx')
check(/Anything else we should keep an eye on\?/.test(sunday) && /other: other\.trim\(\) \|\| null/.test(sunday), 'I: the Sunday check in asks for anything else to keep an eye on and sends it')
const weeklyRoute = read('app/api/wellbeing/weekly/route.ts')
check(/raiseConcern\(supabase, user\.id, childId, \{ slug, label: other, source: 'checkin' \}\)/.test(weeklyRoute), 'I: the Sunday route raises it on the tracker in the parent\'s own words')

// H
const lines = [
  'One tap each. Going great and it comes off your list; anything less stays on it and we keep working on it with you.',
  'The problems parents hit at', 'in the order they come. One a week, so you are ahead of them.',
  'Not really is the most useful answer here. It gets you a different approach next, and it counts for every family on the same worry.',
  'We keep asking, and keep offering the next approach, until each one rests.',
  "DiGi's check backs, the worries that need a word tonight, and what came up today. Skip one and the tracker still holds it.",
  'Saved, and it is on their daily check in now. Tell the parent once, in plain words, that it is on their check in, then give one method to try.',
  'Anything else we should keep an eye on?', 'In your own words, optional. It goes on the daily check in.',
]
check(lines.every(l => !/[–—]/.test(l) && !/\s-\s/.test(l)), 'H: no dashes in any promise line')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log(`\n${ok.length} checks, the loop promise is said on every surface`)
