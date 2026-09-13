// The parent's habit, Duolingo grade, held by rules that run.
//
// Justin, 13 September 2026: "use top agents to make sure we have Duolingo
// habit forming for parents, and do not stop until that works." An audit of
// the loop against Duolingo's published playbook found the evening reminder
// went to everyone at 21:00 whatever their day looked like, no time was ever
// chosen or learned, the parent's milestones were never named, and nothing
// measured whether the habit was forming. These rules hold the fixes.
//
//   A. The evening line: the wind down when today is done, "still open" with
//      the streak when it is not, and never a word of loss (lose, lost, break,
//      broken, miss, behind, guilt) in any line. Run for real.
//   B. The reminder time: a chosen time wins, otherwise learned as an hour
//      after when this parent usually finishes (five samples or more, clamped
//      to the evening, half hours), otherwise 21:00. Run for real.
//   C. The habit numbers over a simulated month: day done rate, streak
//      buckets, who came back a week later. Run for real.
//   D. The cron sends the evening per parent (userId) after reading who is
//      done today from the same four tables the streak reads, and no evening
//      broadcast is left in the check in list.
//   E. Migration 298 adds reminder_minutes, the settings control exists, and
//      the day done screen names the parent's milestones.
//
// Run:
//   node --experimental-strip-types scripts/check-habit-loop.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── A, B, C: run the real functions ──────────────────────────────────────────
const probe = `
import { eveningLine, reminderTargetMinutes, dueNow, roundToHalfHour, REMINDER_DEFAULT } from './lib/push/evening.ts'
import { habitMetrics, currentStreak } from './lib/home/habit-metrics.ts'
import { milestoneFor, PARENT_MILESTONES } from './lib/pathway/parent-milestones.ts'
const lines = {
  done: eveningLine({ done: true, streakCount: 12, childName: 'Alma' }),
  open12: eveningLine({ done: false, streakCount: 12, childName: 'Alma' }),
  open0: eveningLine({ done: false, streakCount: 0, childName: null }),
}
const targets = {
  chosen: reminderTargetMinutes(19 * 60 + 30, [20 * 60, 20 * 60, 20 * 60, 20 * 60, 20 * 60]),
  chosenClamped: reminderTargetMinutes(23 * 60, []),
  learned: reminderTargetMinutes(null, [19 * 60 + 20, 19 * 60 + 40, 19 * 60 + 30, 19 * 60 + 10, 19 * 60 + 25, 19 * 60 + 35]),
  learnedLate: reminderTargetMinutes(null, [22 * 60, 22 * 60 + 30, 22 * 60, 22 * 60, 22 * 60]),
  learnedEarly: reminderTargetMinutes(null, [8 * 60, 8 * 60, 8 * 60, 8 * 60, 8 * 60]),
  tooFew: reminderTargetMinutes(null, [19 * 60, 19 * 60]),
  none: reminderTargetMinutes(null, []),
  due: [dueNow(21 * 60 + 5, 21 * 60), dueNow(21 * 60 + 25, 21 * 60), dueNow(20 * 60 + 55, 21 * 60)],
}
// A simulated month for six families, today 2026-09-30.
const today = '2026-09-30'
const day = n => { const d = new Date('2026-09-30T00:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10) }
const rows = []
const add = (u, days) => { for (const n of days) rows.push({ user_id: u, session_date: day(n) }) }
add('a', [0,1,2,3,4,5,6,7,8,9])           // ten in a row, ends today
add('b', [1,2,3,4,5,6,7])                 // seven in a row, ended yesterday
add('c', [0])                             // one day, today
add('d', [10, 11, 12])                    // did days two weeks ago, none since (did not come back)
add('e', [9, 3])                          // did a day 9 days ago and came back this week
add('f', Array.from({ length: 35 }, (_, i) => i))  // thirty five in a row
const metrics = habitMetrics(rows, today)
const streaks = { a: currentStreak(new Set(rows.filter(r => r.user_id === 'a').map(r => r.session_date)), today), b: currentStreak(new Set(rows.filter(r => r.user_id === 'b').map(r => r.session_date)), today), d: currentStreak(new Set(rows.filter(r => r.user_id === 'd').map(r => r.session_date)), today) }
const milestones = { seven: milestoneFor(7)?.title ?? null, eight: milestoneFor(8), thirty: milestoneFor(30)?.title ?? null, all: PARENT_MILESTONES.map(m => m.line + ' ' + m.title).join(' ') }
console.log(JSON.stringify({ lines, targets, metrics, streaks, milestones }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`the probe could not run the real code: ${(r.stderr || '').trim().split('\n').slice(-3).join(' ')}`)
} else {
  const { lines, targets, metrics, streaks, milestones } = JSON.parse(r.stdout.trim().split('\n').pop())
  const LOSS = /\b(lose|lost|losing|break|broken|breaking|miss|missed|missing|behind|guilt|guilty|let .* down)\b/i
  // A
  if (lines.done.title !== 'Evening wind down') problems.push(`A: a finished day does not get the wind down: ${lines.done.title}`)
  else ok.push('A: a finished day gets the wind down')
  if (!/still open/i.test(lines.open12.title) || !/12 days/.test(lines.open12.body) || !/Alma/.test(lines.open12.body)) problems.push(`A: an open day with a streak does not say still open with the number and the child: ${JSON.stringify(lines.open12)}`)
  else ok.push('A: an open day names the streak and the child')
  if (!/still open/i.test(lines.open0.title) || /\d+ days/.test(lines.open0.body)) problems.push(`A: an open day with no streak names a number: ${JSON.stringify(lines.open0)}`)
  else ok.push('A: an open day with no streak asks for one tap, no number')
  const all = Object.values(lines).map(l => `${l.title} ${l.body}`).join(' ')
  if (LOSS.test(all)) problems.push(`A: loss language in the evening line: ${all.match(LOSS)[0]}`)
  else ok.push('A: no loss language in any evening line')
  if (/[—–]/.test(all)) problems.push('A: a dash in the evening line')
  // B
  if (targets.chosen !== 19 * 60 + 30) problems.push(`B: a chosen time does not win: ${targets.chosen}`)
  else ok.push('B: a chosen time wins over the learned one')
  if (targets.chosenClamped !== 22 * 60) problems.push(`B: a chosen time past 22:00 is not clamped: ${targets.chosenClamped}`)
  else ok.push('B: a chosen time is clamped to the evening')
  if (targets.learned !== 20 * 60 + 30) problems.push(`B: six finishes around 19:30 do not learn 20:30: ${targets.learned}`)
  else ok.push('B: the time is learned as an hour after the usual finish, on the half hour')
  if (targets.learnedLate !== 21 * 60 + 30 || targets.learnedEarly !== 18 * 60) problems.push(`B: the learned time is not clamped to the evening: ${targets.learnedLate} ${targets.learnedEarly}`)
  else ok.push('B: the learned time stays in the evening')
  if (targets.tooFew !== REMINDER_DEFAULT_CHECK(targets.none) || targets.none !== 21 * 60) problems.push(`B: too few samples or none does not fall back to 21:00: ${targets.tooFew} ${targets.none}`)
  else ok.push('B: fewer than five finishes falls back to 21:00')
  if (targets.due.join() !== 'true,false,true') problems.push(`B: the due window is wrong: ${targets.due}`)
  else ok.push('B: due within ten minutes of the target, once per half hour')
  // C
  if (metrics.dayDoneFamilies7d !== 5) problems.push(`C: day done this week should count five of six families: ${metrics.dayDoneFamilies7d}`)
  else ok.push('C: day done this week counts the families who finished a day')
  if (metrics.dayDoneRate7d !== 83) problems.push(`C: day done rate should be 83: ${metrics.dayDoneRate7d}`)
  else ok.push('C: the day done rate is the share of families who ever finished a day')
  // Five families did a day 7 to 13 days ago (a, b, d, e, f); four of them
  // did one this week; d did not. Four of five is 80.
  if (metrics.returnedD7 !== 80) problems.push(`C: came back should be 80 (four of the five who did a day a week ago, d did not): ${metrics.returnedD7}`)
  else ok.push('C: came back a week later reads the right cohort')
  const b = metrics.streakBuckets
  if (b.one !== 1 || b.two_to_six !== 0 || b.week_plus !== 2 || b.month_plus !== 1 || metrics.perfectWeeks !== 3) problems.push(`C: the streak buckets are wrong: ${JSON.stringify(b)} perfect ${metrics.perfectWeeks}`)
  else ok.push('C: streak buckets and perfect weeks read the simulated month right')
  if (streaks.a !== 10 || streaks.b !== 7 || streaks.d !== 0) problems.push(`C: current streak is wrong: ${JSON.stringify(streaks)}`)
  else ok.push('C: a streak ending yesterday still stands, one ending earlier is over')
  if (milestones.seven !== 'A perfect week' || milestones.eight !== null || milestones.thirty !== 'A whole month') problems.push(`C: milestones are wrong: ${JSON.stringify(milestones)}`)
  else ok.push('C: the perfect week and the month are named on the day, not around it')
  if (LOSS.test(milestones.all)) problems.push(`C: loss language in a milestone: ${milestones.all.match(LOSS)[0]}`)
  else ok.push('C: no loss language in the milestones')
}
function REMINDER_DEFAULT_CHECK(none) { return none }

// ── D: the cron ───────────────────────────────────────────────────────────────
const cron = strip(readFileSync('app/api/push/cron/route.ts', 'utf8'))
if (/slot:\s*'evening'[\s\S]{0,200}hour:\s*21/.test(cron) || /hour:\s*21,\s*minute:\s*0/.test(cron)) problems.push('D: the evening broadcast at 21:00 is still in the check in list')
else ok.push('D: no evening broadcast in the check in list')
const pass = cron.slice(cron.indexOf('async function runEveningPass'), cron.indexOf('async function handler'))
if (!pass) problems.push('D: runEveningPass is gone')
else {
  for (const t of ['daily_sessions', 'moment_completions', 'quest_ticks', 'digi_feedback']) {
    if (!pass.includes(`'${t}'`)) problems.push(`D: the evening pass no longer reads ${t} for who is done today`)
  }
  if (!/sendPush\(\{[^}]*userId:\s*user/.test(pass)) problems.push('D: the evening pass does not send per parent (userId)')
  else ok.push('D: the evening is sent per parent')
  if (!/eveningLine\(\{\s*done:\s*isDone/.test(pass)) problems.push('D: the evening pass does not pass whether today is done to the line')
  else ok.push('D: the line is chosen from whether today is done')
  if (!/reminderTargetMinutes\(/.test(pass) || !/dueNow\(/.test(pass)) problems.push('D: the evening pass does not use the per parent target')
  else ok.push('D: each parent is reminded at their own target')
  if (!/runEveningPass\(nowMinutes\)/.test(cron.slice(cron.indexOf('async function handler')))) problems.push('D: the handler no longer runs the evening pass')
  else ok.push('D: the handler runs the evening pass on every run')
}

// ── E: the column, the control, the milestone beat ────────────────────────────
const mig = readFileSync('supabase/migrations/298_reminder_time_and_gap_scripts.sql', 'utf8')
if (!/add column if not exists reminder_minutes int/.test(mig) || !/between 1020 and 1320/.test(mig)) problems.push('E: migration 298 does not add reminder_minutes with the evening check')
else ok.push('E: migration 298 adds reminder_minutes, evening only')
const prompt = strip(readFileSync('components/push/PushPrompt.tsx', 'utf8'))
if (!/\/api\/push\/reminder-time/.test(prompt)) problems.push('E: the settings control for the reminder time is missing')
else ok.push('E: the reminder time can be chosen in settings')
const flow = strip(readFileSync('components/daily/DayCompleteFlow.tsx', 'utf8'))
if (!/milestoneFor\(streakCount\)/.test(flow) || !/milestone\s*\?\s*milestone\.title/.test(flow)) problems.push('E: the day done screen does not name the milestone')
else ok.push('E: the day done screen names the milestone reached today')
const pulse = strip(readFileSync('app/api/admin/product-pulse/route.ts', 'utf8'))
if (!/habitMetrics\(/.test(pulse) || !/daily_sessions/.test(pulse)) problems.push('E: the product pulse does not report the habit from daily_sessions')
else ok.push('E: the product pulse reports the habit')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log('\nall passed')
