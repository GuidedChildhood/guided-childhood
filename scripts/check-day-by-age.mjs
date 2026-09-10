// A five year old and a fourteen year old must not be handed the same day.
//
// The Passport brief says it twice: "DO NOT hard-code the same checklist for
// every age" and "Use the existing age/stage pathway as the source of truth."
// pickDay took a child id and a date and nothing else, so for months every
// child of every age drew from one twelve row pool at one length.
//
// This runs the real function rather than reading the source, because the thing
// that matters is not that a STAGE_DAY table exists but that a day actually
// comes out different, finishable, and stable.
import { pickDay, stepsPerDay, STEPS } from '../lib/kid/five-a-day.ts'

const fails = []
const STAGES = [1, 2, 3, 4, 5]
const DAYS = ['2026-09-10', '2026-09-11', '2026-09-12', '2026-01-02', '2026-06-30']
const KIDS = ['a1b2', 'c3d4', 'e5f6', 'deadbeef']

// ── 1. Every stage produces the length it promises, for every child and day ──
for (const stage of STAGES) {
  const want = stepsPerDay(stage)
  for (const kid of KIDS) {
    for (const day of DAYS) {
      const got = pickDay(kid, day, undefined, stage)
      if (got.length !== want) {
        fails.push(`Stage ${stage} gave ${got.length} steps (${got.join(', ')}) for ${kid} on ${day}, but stepsPerDay says ${want}. A child who cannot finish the day can never earn the streak and has no way of knowing why.`)
      }
      if (new Set(got).size !== got.length) {
        fails.push(`Stage ${stage} repeated a step for ${kid} on ${day}: ${got.join(', ')}.`)
      }
      for (const k of got) {
        if (!STEPS[k]) fails.push(`Stage ${stage} produced an unknown step "${k}".`)
      }
    }
  }
}

// ── 2. Foundation is genuinely a different day ──────────────────────────────
if (stepsPerDay(1) >= stepsPerDay(2)) {
  fails.push('Foundation is no shorter than Builder. Four to seven year olds got the same length of day as everyone else, which is the thing the brief forbids.')
}

// ── 3. The age exclusions actually exclude ──────────────────────────────────
// Homework and times tables are not four to seven expectations, and a colouring
// and doing sheet at fourteen is a message about how old we think they are.
const NEVER = { 1: ['homework', 'maths'], 4: ['printable'], 5: ['printable'] }
for (const [stage, banned] of Object.entries(NEVER)) {
  for (const kid of KIDS) {
    for (const day of DAYS) {
      const got = pickDay(kid, day, undefined, Number(stage))
      for (const b of banned) {
        if (got.includes(b)) {
          fails.push(`Stage ${stage} drew "${b}" for ${kid} on ${day}, and it is excluded at that age.`)
        }
      }
    }
  }
}

// ── 4. Stable: the same child on the same day always gets the same day ──────
for (const stage of STAGES) {
  const a = pickDay('same-kid', '2026-09-10', undefined, stage).join(',')
  const b = pickDay('same-kid', '2026-09-10', undefined, stage).join(',')
  if (a !== b) fails.push(`Stage ${stage} is not stable: two calls for one child and one date disagreed. A child could reroll a half finished day by refreshing.`)
}

// ── 5. It still moves day to day ────────────────────────────────────────────
for (const stage of STAGES) {
  const seen = new Set(DAYS.map(d => pickDay('mover', d, undefined, stage).join(',')))
  if (seen.size < 2) fails.push(`Stage ${stage} gave the identical day across ${DAYS.length} different dates. The rotation is the thing that stops this being a chore list.`)
}

// ── 6. availability still wins, and cannot make a day unfinishable ──────────
for (const stage of STAGES) {
  const got = pickDay('gated', '2026-09-10', { lesson: false, printable: false, quiz: false }, stage)
  for (const k of ['lesson', 'printable', 'quiz']) {
    if (got.includes(k)) fails.push(`Stage ${stage} drew "${k}" after the caller said it was unavailable.`)
  }
  if (got.length === 0) fails.push(`Stage ${stage} produced an empty day once three rows were unavailable.`)
}

if (fails.length) {
  console.error('\nDay by age: ' + fails.length + ' problem' + (fails.length === 1 ? '' : 's') + '\n')
  for (const f of fails) console.error('  ✗ ' + f + '\n')
  process.exit(1)
}
console.log(`Day by age: stages 1 to 5 give ${STAGES.map(stepsPerDay).join('/')} steps, the age exclusions hold, each day is stable and each stage still rotates.`)
