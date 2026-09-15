// A lesson and the daily quiz are one objective, and the day counts either.
//
// Justin, 15 September 2026: "did a lesson and showed updating in passport but
// did not come off the 5 per day jobs?"
//
// ── WHAT ACTUALLY HAPPENED, FROM THE LIVE ROWS ──────────────────────────────
//
// Teo's day that morning was ["jobs","quiz","balance","ask"]. He passed a
// LESSON. lesson_completions recorded passed:true at 09:40:29 and the passport
// counted it correctly. kid_days still read done:["jobs"], last written at
// 09:34:58, six minutes BEFORE the pass.
//
// markStep refused, because `lesson` was not one of today's four, and it
// refused SILENTLY: it returns ok:false and markStepQuietly only logs a throw.
// So the day did not move and nothing anywhere said why. The same shape as the
// JSONB count that read as an honest zero for a month.
//
// The refusal was right by the old rule and wrong for the child, who had been
// sent at that lesson by the mission row on their own home screen.
//
// ── THE RULE ────────────────────────────────────────────────────────────────
//
// A lesson and the daily quiz are one objective wearing two faces: learn one
// thing today. The pool picks whichever, and a child cannot know which face
// today wore before they start. So a pass on either lands the day's learning
// step. Justin's call: "count it, they are the same objective."
//
// This guard RUNS the real stepForToday rather than describing it, because a
// guard that reimplements the thing it guards proves nothing (14 September
// 2026, plans/decisions.md).
//
//   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-learning-step.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { stepForToday } from '../lib/kid/day-store.ts'

const ROOT = process.cwd()
const problems = []
const ok = []

const QUIZ_DAY = ['jobs', 'quiz', 'balance', 'ask']
const LESSON_DAY = ['jobs', 'lesson', 'balance', 'ask']

// ── The pair counts both ways ───────────────────────────────────────────────
const cases = [
  ['lesson', QUIZ_DAY, 'quiz', 'a passed lesson on a quiz day lands the quiz, which is the exact case Justin hit'],
  ['quiz', LESSON_DAY, 'lesson', 'a passed quiz on a lesson day lands the lesson'],
  ['quiz', QUIZ_DAY, 'quiz', 'the quiz still lands itself'],
  ['lesson', LESSON_DAY, 'lesson', 'a lesson still lands itself'],
]
for (const [step, day, want, why] of cases) {
  const got = stepForToday(step, day)
  if (got !== want) problems.push(`stepForToday('${step}', [${day.join(',')}]) gave "${got}", wanted "${want}": ${why}`)
  else ok.push(why)
}

// ── And NOTHING else is loosened ────────────────────────────────────────────
//
// The whole point of the old refusal is that a stale tab cannot complete a day
// it was never shown. That has to survive.
for (const step of ['printable', 'move', 'reading', 'homework', 'kind']) {
  const got = stepForToday(step, QUIZ_DAY)
  if (QUIZ_DAY.includes(got)) {
    problems.push(`stepForToday('${step}', [${QUIZ_DAY.join(',')}]) mapped onto "${got}". Only the lesson and quiz pair may stand in for each other; anything else must still be refused or a stale tab could complete a day it was never shown.`)
  }
}
if (!problems.length) ok.push('no step outside the lesson and quiz pair can stand in for another')

// ── The refusal is no longer silent ─────────────────────────────────────────
const store = readFileSync(join(ROOT, 'lib/kid/day-store.ts'), 'utf8')
if (!/console\.warn\(/.test(store)) {
  problems.push('lib/kid/day-store.ts no longer warns when it refuses a step. A refusal that says nothing is why this took a founder with a screenshot to find: the day simply did not move.')
} else {
  ok.push('a refused step is logged, so the next one is visible without a screenshot')
}

if (problems.length > 0) {
  console.error('check-learning-step FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for the live rows this came from.')
  process.exit(1)
}
console.log('check-learning-step ok: the day counts a lesson or the quiz, and nothing else stands in')
for (const line of ok) console.log('  ' + line)
