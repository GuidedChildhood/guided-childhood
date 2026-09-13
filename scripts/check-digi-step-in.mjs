// DiGi steps in on judgement, under a cap that is code.
//
// Justin, 13 September 2026, approving the recommendation: DiGi may step in
// unasked "at most twice a week, and never two days running", and stepping in
// moves "from the calendar to the moment". Five rules hold that, importing the
// real config rather than reading its text, because a guard its own
// documentation satisfies is not a guard:
//
//   A. The cap is config with a default of two, and stepInAllowed enforces
//      both the weekly count and the never two days running rule.
//   B. The reader checks the cap BEFORE the model is called.
//   C. The reader writes a visible card only when the model said speak. A no
//      is recorded as a dismissed row and nothing else.
//   D. Every kind the reader can write is one the table accepts.
//   E. The drumbeat is gone: no routine cadence trigger anywhere in the brain
//      or the prompts route.
//
//   node --experimental-strip-types scripts/check-digi-step-in.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []

// ── A: the cap and the two rules, from the real function ────────────────────
const probe = `
import { DIGI_STEP_IN_PER_WEEK, stepInAllowed } from './lib/config/digi.ts'
const now = new Date('2026-09-13T09:00:00Z')
const d = (daysAgo, hour = 9) => new Date(now.getTime() - daysAgo * 86400000).toISOString().replace('T09', 'T' + String(hour).padStart(2, '0'))
const out = {
  cap: DIGI_STEP_IN_PER_WEEK,
  fresh: stepInAllowed([], now),
  twoInWeek: stepInAllowed([d(3), d(5)], now),
  oneOld: stepInAllowed([d(3), d(9)], now),
  yesterday: stepInAllowed([d(1)], now),
  today: stepInAllowed([d(0, 7)], now),
  twoDaysAgo: stepInAllowed([d(2)], now),
  off: stepInAllowed([], now, 0),
}
console.log(JSON.stringify(out))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd(), env: { ...process.env, DIGI_STEP_IN_PER_WEEK: '' } })
if (r.status !== 0) {
  problems.push(`A: the probe could not run the real config: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  const o = JSON.parse(r.stdout.trim().split('\n').pop())
  const checks = [
    [o.cap === 2, 'A: the default cap is two a week'],
    [o.fresh.ok === true, 'A: a family DiGi has never spoken to may be spoken to'],
    [o.twoInWeek.ok === false && o.twoInWeek.reason === 'cap', 'A: two in the last seven days is the cap'],
    [o.oneOld.ok === true, 'A: a step in older than a week no longer counts'],
    [o.yesterday.ok === false && o.yesterday.reason === 'consecutive', 'A: never the day after a step in'],
    [o.today.ok === false && o.today.reason === 'consecutive', 'A: never twice in a day'],
    [o.twoDaysAgo.ok === true, 'A: two days after is allowed'],
    [o.off.ok === false && o.off.reason === 'off', 'A: a cap of zero turns stepping in off'],
  ]
  for (const [pass, label] of checks) (pass ? ok : problems).push(pass ? label : `${label}: NOT so`)
}

// ── B, C, D: the reader, read as code with comments blanked ─────────────────
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const moment = blank(readFileSync('lib/digi/moment.ts', 'utf8'))

const capAt = moment.indexOf('stepInAllowed(')
const modelAt = moment.indexOf('await callModel(')
if (capAt === -1 || modelAt === -1 || capAt > modelAt) problems.push('B: the reader does not check the cap before calling the model')
else ok.push('B: the cap is checked before the model is called')

// The visible insert (no status, so it is pending) must sit after the quiet
// gate, and the quiet gate must write a dismissed row and return.
const quietAt = moment.indexOf('if (!decision.speak)')
const visibleAt = moment.search(/from\('digi_prompts'\)\.insert\(\{\s*user_id: userId, child_id: kid\.id, kind, title, body, href, source/)
const quietBlock = quietAt === -1 ? '' : moment.slice(quietAt, quietAt + 700)
if (quietAt === -1 || visibleAt === -1 || quietAt > visibleAt) problems.push('C: the visible card is not gated on the model saying speak')
else if (!/status: 'dismissed'/.test(quietBlock) || !/return \{ ok: false/.test(quietBlock)) problems.push('C: a quiet decision must be recorded as a dismissed row and return without a card')
else ok.push('C: a card is written only when the model said speak; a no is a dismissed row')

const TABLE_KINDS = ['watch_for', 'tip', 'parent_care', 'new_research', 'celebration', 'school', 'follow_up', 'stage_arrival', 'insight']
const kindsMatch = moment.match(/STEP_IN_KINDS = \[([^\]]+)\]/)
const kinds = kindsMatch ? [...kindsMatch[1].matchAll(/'([a-z_]+)'/g)].map(m => m[1]) : []
const bad = kinds.filter(k => !TABLE_KINDS.includes(k))
if (kinds.length === 0) problems.push('D: STEP_IN_KINDS not found in the reader')
else if (bad.length > 0) problems.push(`D: the reader may write a kind the table rejects: ${bad.join(', ')}`)
else ok.push('D: every kind the reader can write is one the table accepts')
if (!/kind: 'tip', status: 'dismissed'/.test(moment)) problems.push('D: the quiet row must use a kind the table accepts')

// ── E: no drumbeat anywhere ─────────────────────────────────────────────────
for (const f of ['lib/digi/brain.ts', 'app/api/digi/prompts/route.ts']) {
  const src = blank(readFileSync(f, 'utf8'))
  if (/Routine cadence/.test(src) || /parent wellbeing check due/.test(src)) problems.push(`E: ${f} still carries the routine cadence drumbeat`)
}
if (!problems.some(p => p.startsWith('E:'))) ok.push('E: the drumbeat is gone from the brain and the prompts route')

if (problems.length > 0) {
  console.error('check-digi-step-in FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-digi-step-in ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
