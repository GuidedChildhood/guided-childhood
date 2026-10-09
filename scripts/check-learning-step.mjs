// The weekly lesson is not one of the five a day (plan v10, item 1.6).
//
// ── WHERE THIS CAME FROM ────────────────────────────────────────────────────
//
// Justin, 15 September 2026: "did a lesson and showed updating in passport but
// did not come off the 5 per day jobs?" Teo's day read ["jobs","quiz",
// "balance","ask"], he passed a LESSON, and the day refused it silently because
// `lesson` was not one of the four. The fix then was a stand in: a lesson and
// the quiz counted as one learning step.
//
// ── WHAT REPLACED IT, 9 OCTOBER 2026 ────────────────────────────────────────
//
// The lessons plan made the lesson the week's own thing: one a week, on the
// week card and the child's list, marked on the server, paid once. A day that
// draws it is a day a child may not be able to finish (this week's is done, or
// next week's is paced), and a child who cannot finish the day can never earn
// the streak. So pickDay never draws `lesson` or `quiz`, nothing stands in for
// anything, and a refused step is still logged so the next surprise is visible
// without a screenshot.
//
// This guard RUNS the real pickDay and stepForToday rather than describing
// them, because a guard that reimplements the thing it guards proves nothing
// (14 September 2026, plans/decisions.md).
//
// Node builtins plus --experimental-strip-types. No database.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pickDay, stepForToday } from '../lib/kid/five-a-day.ts'

const ROOT = process.cwd()
const problems = []
const ok = []

// Every stage, a year of days, a handful of children: the day never draws the
// weekly lesson or the quiz.
const children = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6']
let drawn = 0
let days = 0
for (const stage of [1, 2, 3, 4, 5]) {
  for (const child of children) {
    for (let d = 0; d < 366; d += 3) {
      const day = new Date(Date.UTC(2026, 8, 1) + d * 86400000).toISOString().slice(0, 10)
      const steps = pickDay(child, day, {}, stage)
      days += 1
      if (steps.includes('lesson') || steps.includes('quiz')) drawn += 1
    }
  }
}
if (drawn > 0) problems.push(`pickDay drew the weekly lesson or the quiz on ${drawn} of ${days} days. The lesson is the week's own thing (plan v10, item 1.6).`)
else ok.push(`no lesson or quiz on any of ${days} days across five stages`)

// Nothing stands in for anything: a step lands on itself.
for (const step of ['lesson', 'quiz', 'printable', 'move', 'reading']) {
  const got = stepForToday(step, ['jobs', 'quiz', 'balance', 'ask'])
  if (got !== step) problems.push(`stepForToday('${step}') mapped onto "${got}". Nothing stands in for another step any more.`)
}
if (!problems.length) ok.push('every step lands on itself')

const store = readFileSync(join(ROOT, 'lib/kid/day-store.ts'), 'utf8')
if (!/console\.warn\(/.test(store)) {
  problems.push('lib/kid/day-store.ts no longer warns when it refuses a step. A refusal that says nothing is why the 15 September case took a founder with a screenshot to find.')
} else {
  ok.push('a refused step is logged, so the next one is visible without a screenshot')
}
if (/lessonAlreadyThisWeek/.test(store)) problems.push('lib/kid/day-store.ts asks whether this week\'s lesson is done again; the day never draws it')

if (problems.length > 0) {
  console.error('check-learning-step FAILED\n')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log('check-learning-step ok: the weekly lesson is the week\'s own thing, never one of the five')
for (const line of ok) console.log('  ' + line)
