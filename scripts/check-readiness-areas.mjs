// The four things must count everything the family is taught.
//
// Justin, 13 September 2026: the passport is "updated based on progression
// through the areas we have agreed need to be met", and a child comes out
// "AI literate, safe and ready for the future we think AI will give us."
//
// The audit that day found three ways the reading was quietly wrong:
//
//   1. Five lesson categories matched no area (bullying, information,
//      ownership, relationships, reputation): 36 lessons, a third of the
//      library, counting toward none of the four things. And `ai_safety` fell
//      through to Safe because an underscore is a word character.
//   2. The child's own AI modules (`ai_lessons`) counted toward nothing.
//   3. The age an area starts at was written four times, and three of the four
//      said AI comes at 11 while the lessons hub offered "What is AI?" to a
//      five year old.
//
// So this guard holds four rules, importing the real code rather than reading
// its text, because a guard its own documentation satisfies is not a guard:
//
//   A. Every category the library carries lands in an area through the real
//      literacyAreaFor, and lands in the RIGHT area for the ones that matter.
//   B. countAreaLessons puts an AI module pass in the AI area, and a parent
//      lesson pass in its category's area, by the `${source}:${id}` key.
//   C. AREA_START is the only start rule: nothing else in app, components or
//      lib declares a start stage for the four keys in a literal.
//   D. The behaviour line reaches the book only through the parent's page,
//      and the book draws it only when not read only.
//
//   node --experimental-strip-types scripts/check-readiness-areas.mjs
//
// The probe runs the real TypeScript through scripts/lib/ts-resolve.mjs.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []

// ── A and B: run the real functions ──────────────────────────────────────────
//
// The categories are the ones in the live `lessons` table on 13 September
// 2026, parent audience, plus the AI module marker the lessons hub uses. A new
// category that lands nowhere fails rule A the day it is added to this list,
// and the list is the thing to extend when the library grows.
const probe = `
import { literacyAreaFor, AREA_START, AREA_ORDER } from './lib/content/literacy.ts'
import { countAreaLessons } from './lib/pathway/readiness-areas.ts'
const expect = {
  ai_safety: 'ai', 'chatbots and ai': 'ai', 'deepfakes and ai': 'ai', information: 'ai',
  bullying: 'safe', online_risks: 'safe', privacy: 'safe', safety: 'safe',
  identity: 'social', ownership: 'social', relationships: 'social', reputation: 'social', 'social media': 'social',
  screen_habits: 'balance', wellbeing: 'balance', ai_literacy: 'ai',
}
const landed = {}
for (const c of Object.keys(expect)) landed[c] = literacyAreaFor(c)?.key ?? null
const counted = countAreaLessons(
  [
    { id: 'L1', stage_id: 'foundation', category: 'safety', audience: 'parent', status: 'live' },
    { id: 'L2', stage_id: 'foundation', category: 'bullying', audience: 'parent', status: 'live' },
    // A parent STUB and a live TEACHER lesson: each must be dropped by its own
    // filter, so that neither filter can quietly cover for the other.
    { id: 'L3', stage_id: 'foundation', category: 'wellbeing', audience: 'parent', status: 'stub' },
    { id: 'L5', stage_id: 'foundation', category: 'wellbeing', audience: 'teacher', status: 'live' },
    { id: 'L4', stage_id: 'explorer', category: 'social media', audience: 'parent', status: 'live' },
  ],
  [{ id: 'A1', audience: 'age_7' }, { id: 'A2', audience: 'age_7' }, { id: 'A3', audience: 'age_11' }],
  new Set(['lesson:L1', 'ai_lesson:A1', 'lesson:L3', 'lesson:L5']),
)
console.log(JSON.stringify({ landed, counted, start: AREA_START, order: AREA_ORDER }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`the probe could not run the real code: ${(r.stderr || '').trim().split('\n').slice(-3).join(' ')}`)
} else {
  const out = JSON.parse(r.stdout.trim().split('\n').pop())
  const expect = {
    ai_safety: 'ai', 'chatbots and ai': 'ai', 'deepfakes and ai': 'ai', information: 'ai',
    bullying: 'safe', online_risks: 'safe', privacy: 'safe', safety: 'safe',
    identity: 'social', ownership: 'social', relationships: 'social', reputation: 'social', 'social media': 'social',
    screen_habits: 'balance', wellbeing: 'balance', ai_literacy: 'ai',
  }
  const wrong = Object.entries(expect).filter(([c, k]) => out.landed[c] !== k)
  if (wrong.length > 0) {
    problems.push(`A: ${wrong.map(([c, k]) => `${c} lands in ${out.landed[c] ?? 'nothing'}, should be ${k}`).join('; ')}`)
  } else {
    ok.push('A: every library category lands in its area')
  }
  const s1 = out.counted.byStage[1]
  const s3 = out.counted.byStage[3]
  const row = (rows, k) => rows.find(a => a.key === k) ?? { done: -1, total: -1 }
  const checks = [
    [row(s1, 'ai').total === 2 && row(s1, 'ai').done === 1, 'B: the AI modules for age 7 count in stage 1 AI (2 total, 1 passed)'],
    [row(s3, 'ai').total === 1 && row(s3, 'ai').done === 0, 'B: the AI module for age 11 counts in stage 3 AI'],
    [row(s1, 'safe').total === 2 && row(s1, 'safe').done === 1, 'B: safety and bullying both count in stage 1 Safe, one passed'],
    [row(s1, 'balance').total === 0, 'B: a stub and a teacher lesson count nowhere, even when passed'],
    [row(s3, 'social').total === 1, 'B: social media counts in stage 3 Social'],
    [out.counted.allTime.ai === 1 && out.counted.allTime.safe === 1, 'B: all time passes count per area'],
  ]
  for (const [pass, label] of checks) (pass ? ok : problems).push(label)
  if (out.start.ai !== 1) problems.push('C: AREA_START.ai is not 1. The AI modules for 4 to 7 exist and the area must start on page one.')
  if (out.start.social !== 3) problems.push('C: AREA_START.social is not 3. Social readiness starts at 11, before any account exists.')
}

// ── C: one start rule ────────────────────────────────────────────────────────
//
// Any literal that assigns a start stage to the four keys outside
// lib/content/literacy.ts is a second copy, and the second copy is how three
// of four surfaces said 11 while the hub said 4.
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}
const copies = []
for (const f of [...walk('app'), ...walk('components'), ...walk('lib')]) {
  if (f.endsWith('lib/content/literacy.ts')) continue
  const src = readFileSync(f, 'utf8')
  if (/\bai:\s*[1-5]\s*,\s*social:\s*[1-5]/.test(src) || /startStage:\s*[0-9]/.test(src) || /stageNum\s*>=\s*3\s*\?\s*\[\s*'ai'/.test(src)) {
    copies.push(f)
  }
}
if (copies.length > 0) problems.push(`C: a start stage for the four things is written as a literal outside lib/content/literacy.ts: ${copies.join(', ')}`)
else ok.push('C: AREA_START is the only start rule')

// ── D: the behaviour line stays on the parent's book ────────────────────────
const book = readFileSync('components/pathway/PassportBook.tsx', 'utf8')
const kid = readFileSync('components/kid/KidPassport.tsx', 'utf8')
if (!/\{!readOnly && improved && /.test(book)) {
  problems.push('D: PassportBook draws the behaviour line without the !readOnly gate. The child reads this component too.')
} else ok.push('D: the book draws the behaviour line only when not read only')
if (/improved=/.test(kid)) {
  problems.push("D: KidPassport passes improved into the book. That is an adult's note about the child.")
} else ok.push("D: the child's page never passes the behaviour line")

if (problems.length > 0) {
  console.error('check-readiness-areas FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-readiness-areas ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
