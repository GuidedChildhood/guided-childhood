import { readFileSync } from 'node:fs'
import { STEPS, STEP_ORDER, stepsFor, lessonState, TAUGHT_NO_DATE } from '../shared/schools-progress.ts'

// THE LESSON TRACKER'S CONTRACT.
//
// Built 16 September 2026 (plans/2026-09-16-lesson-tracker-plan.md). The
// tracker's whole value is that a green tick is evidence, so every rule here
// guards the thing that would turn it back into a form.
//
// Run with: node --experimental-strip-types scripts/check-lesson-tracker.mjs

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

/**
 * The file with its comments removed.
 *
 * Rule 7 below bans pupil data, and every one of these files EXPLAINS at
 * length that there is no register here and why. A rule that could not tell
 * the explanation from the thing would quietly push us to stop explaining,
 * which is the opposite of what this codebase wants.
 */
const codeOnly = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

let failed = 0
const ok = (name, detail = '') => console.log(`PASS  ${name}${detail ? `  ${detail}` : ''}`)
const bad = (name, why) => { failed++; console.log(`FAIL  ${name}\n      ${why}`) }
const check = (name, cond, why) => cond ? ok(name) : bad(name, why)

// ── 1. Every automatic row has a real detector behind it ──────────────────
//
// THE RULE THE META PANEL SETS. Its ticks are believable because every row is
// machine checked. A row moved from the teacher's block into the automatic
// one without a detector would look identical and mean nothing, and nothing
// else in the codebase would go red.
const signals = read('schools/components/tracker/signals.tsx')
const player = read('schools/components/tracker/TrackedPlayer.tsx')
const taughtMem = read('shared/schools-taught.ts')
const wiredIn = signals + player + taughtMem
const DETECTOR = {
  read: /markStep\(moduleId, 'read'\)/,
  lookback: /markStep\((nextModuleId|moduleId), 'lookback'\)/,
  pack: /step="pack"/,
  record: /step="record"/,
  board: /markStep\(moduleId, 'board'\)/,
  taught: /markStep\(moduleId, 'taught'\)/,
  // The passport step is not written by the tracker at all: the passport beat
  // already wrote it, and lessonState reads it from there.
  passport: /export function markTaught/,
}
const packs = read('schools/app/print/[module]/page.tsx')
const records = read('schools/app/print/[module]/record/page.tsx')
const haystack = wiredIn + packs + records
for (const id of STEP_ORDER) {
  const def = STEPS[id]
  if (def.kind !== 'auto') continue
  const re = DETECTOR[id]
  check(`the "${id}" row has a detector`, !!re && re.test(haystack),
    'an automatic row with no signal behind it is a green tick that means nothing')
}

// ── 2. The two teacher rows say so ────────────────────────────────────────
const yours = STEP_ORDER.filter(id => STEPS[id].kind === 'yours')
check('exactly two rows are the teacher’s word', yours.length === 2,
  `found ${yours.length}: ${yours.join(', ')}. Moving a row into or out of that block is a decision, not a tweak.`)
for (const id of yours) {
  check(`"${id}" admits we cannot see it`, /cannot see/.test(STEPS[id].signal),
    'the panel promises these two are a teacher’s word; the model has to agree')
}

// ── 3. Every claim is in the past tense, with a why ───────────────────────
//
// The half people skip, and the reason the panel reads as help rather than
// nagging. A row with a claim and no why is an instruction.
for (const id of STEP_ORDER) {
  const d = STEPS[id]
  check(`"${id}" carries a why`, d.why.length > 20 && /\.$/.test(d.why),
    'one sentence saying why it matters, ending in a full stop')
  check(`"${id}" has no dash in its copy`, !/[—–−]/.test(d.claim + d.why),
    'house rule: no dashes in any copy, ever')
}

// ── 4. The tick is computed, never stored ─────────────────────────────────
const model = read('shared/schools-progress.ts')
check('nothing stores a completed flag', !/'complete'|"complete":|completeStep|markComplete/.test(model),
  'a tick a teacher can award themselves proves nothing to a subject lead, which is the reason it exists')
const full = { hasRecord: true, hasPassportPage: true, dslRequired: true, hasPrevious: true }
const every = {}
for (const d of stepsFor(full)) every[d.id] = '2026-09-16T09:00:00Z'
const done = lessonState('m', full, { m: every }, ['m'])
check('complete is true only when every applicable step is', done.complete, 'nine of nine should be complete')
const minusOne = { ...every }
delete minusOne.board
check('one missing step takes the tick away',
  !lessonState('m', full, { m: minusOne }, ['m']).complete,
  'the tick goes if one row is untasked, which is what makes it a record')

// ── 5. One truth per fact: the passport step is not stored twice ──────────
check('the passport step reads the taught memory',
  lessonState('m', full, {}, ['m']).steps.find(s => s.id === 'passport')?.doneAt === TAUGHT_NO_DATE,
  'the passport beat already wrote this; a second copy is the bug that arrives three weeks later')
check('the passport step is empty without it',
  lessonState('m', full, {}, []).steps.find(s => s.id === 'passport')?.doneAt === null,
  'nothing else may tick the passport row')

// ── 6. Which rows apply is read, never hardcoded per module ───────────────
const shapes = read('schools/lib/tracker.ts')
check('applicability comes from the row and the manifest',
  /teacher_notes|iCan/.test(shapes) && /CURRICULUM/.test(shapes) && !/ks[1-5]-\d\d/.test(shapes),
  'a per module list is a list somebody has to remember to edit')
const bare = stepsFor({ hasRecord: false, hasPassportPage: false, dslRequired: false, hasPrevious: false })
check('a lesson with no record, page, DSL or predecessor drops four rows', bare.length === 5,
  `got ${bare.length}. The optional four are record, passport, dsl and lookback.`)

// ── 7. No field anywhere can hold a child's name ──────────────────────────
//
// The promise the data processing agreement is written on. The tracker
// records that a LESSON was delivered, never who was in the room.
for (const [name, src] of [
  ['the memory', codeOnly(model)],
  ['the roll up', codeOnly(read('schools/app/hub/tracker/HubTracker.tsx'))],
  ['the panel', codeOnly(read('schools/components/tracker/TrackerPanel.tsx'))],
  ['the shape helper', codeOnly(read('schools/lib/tracker.ts'))],
  ['the tracker page', codeOnly(read('schools/app/hub/tracker/page.tsx'))],
]) {
  // Identifiers, not prose. Every one of these files EXPLAINS in words that
  // there is no register here, and a rule that cannot tell the explanation
  // from the thing would force us to stop explaining.
  check(`${name} names no pupil`,
    !/\b(pupilName|childName|pupil_name|child_name|classList|class_list|attendance|attendees|registerPupil|pupils\s*[:=])/.test(src),
    'an attendance register is a different product with a different legal footing')
}

// ── 8. Every surface that shows the memory says what it is ────────────────
for (const [name, src] of [
  ['the panel', read('schools/components/tracker/TrackerPanel.tsx')],
  ['the tracker page', read('schools/app/hub/tracker/page.tsx')],
]) {
  check(`${name} says it is this screen only`, /this screen only/.test(src),
    'the honest cost is stated on the page rather than discovered on a second laptop')
}
check('the tracker page offers a way to forget it', /clearProgress/.test(read('schools/app/hub/tracker/HubTracker.tsx')),
  'the same courtesy the passport hub already gives')

console.log(failed === 0 ? '\ncheck-lesson-tracker: ok' : `\ncheck-lesson-tracker: ${failed} failed`)
process.exit(failed === 0 ? 0 : 1)
