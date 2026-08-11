// Does DiGi offer the school pages at the right moment, and stay quiet the rest
// of the time?
//
// Justin, 11 August 2026: "DiGi prompts now and again, not too often,
// especially when tired questions or homework questions are asked in DiGi."
//
// "Not too often" is what most of these checks are about. The chip earns its
// place by being relevant, so the ones that matter most are the ones asserting
// it does NOT appear.
//
// Usage: node --experimental-strip-types scripts/check-school-chip.mjs

import { schoolChipFor } from '../lib/digi/school-chip.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const kindOf = s => schoolChipFor(s)?.kind ?? null

// ── Homework, the most specific and the most urgent ─────────────────────────
const homework = [
  'he has homework on column addition and I have no idea how they teach it now',
  'the spellings are impossible this week',
  'she cannot do her times tables and we both end up shouting',
  'what is this new method on the maths sheet',
  'revision for the SATs is taking over the house',
]
for (const q of homework) check(`homework: "${q.slice(0, 40)}..."`, kindOf(q) === 'homework', String(kindOf(q)))

// ── The wider school question ───────────────────────────────────────────────
const school = [
  'what are they learning in year 4 this term',
  'his teacher said he is falling behind and I do not know where to start',
  'parents evening is next week and I want to ask something useful',
  'she says she is bored in class every day',
]
for (const q of school) check(`school: "${q.slice(0, 40)}..."`, kindOf(q) === 'school', String(kindOf(q)))

// ── The tired morning, which Justin named specifically ──────────────────────
check('a child exhausted every school morning is a school question',
  kindOf('he is absolutely shattered every morning before school and it is a fight') === 'school')
check('and it reads the other way round too',
  kindOf('school mornings are awful, she is so tired she cannot function') === 'school')

// ── NOT TOO OFTEN, which is most of the point ───────────────────────────────
//
// Every one of these is a real thing a parent asks DiGi, and on none of them
// would a curriculum chip be anything but clutter.
const quiet = [
  'he will not come off the tablet at bedtime',
  'she wants Snapchat and everyone in her class has it',
  'how do I talk to him about what he saw online',
  'my daughter has stopped talking to me',
  'we had a huge row about the phone and I handled it badly',
  'I am tired of arguing about screens',       // the parent is tired, not the child
  'is Roblox safe for a 9 year old',
  'thanks',
  'ok',
  '',
]
for (const q of quiet) check(`quiet on: "${q || '(empty)'}"`, schoolChipFor(q) === null, String(kindOf(q)))

// ── Whole words only ────────────────────────────────────────────────────────
//
// The Right Now situation map already carries a comment about a fragment match
// serving a misinformation script for a sibling fight. Same trap, checked here
// before it can happen again.
check('"latest" does not match the word test',
  schoolChipFor('what is the latest advice on screen time before bed') === null)
check('"Saturday" does not match SATs',
  schoolChipFor('every Saturday turns into a battle about the console') === null)

// ── Homework beats the general school question when both are present ────────
check('homework wins over school when both appear',
  kindOf('his teacher set homework on fractions and I cannot follow it') === 'homework')

// ── Where they land ─────────────────────────────────────────────────────────
check('homework opens the decoder tab',
  schoolChipFor('the homework sheet makes no sense').href === '/dashboard/learning?tab=homework')
check('school opens the learning page itself',
  schoolChipFor('what are they learning in year 4 this term').href === '/dashboard/learning')

// ── House rules ─────────────────────────────────────────────────────────────
const labels = [...homework, ...school].map(q => schoolChipFor(q)?.label ?? '')
check('no dashes in any chip label', labels.every(l => !/[-–—]/.test(l)))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
