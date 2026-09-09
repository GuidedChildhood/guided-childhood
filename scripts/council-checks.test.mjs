#!/usr/bin/env node
//
// The council's own checks, run against fixtures. Usage: node scripts/council-checks.test.mjs
//
// Both bugs found in the scoring rules so far were in code that could not run
// without production credentials, and both were found by reading rather than by
// failing. This is the file that would have failed instead.

import { strict as assert } from 'node:assert'
import { checkProse, checkBlocks, checkEngagement, checkPassport, verdict, isRegression } from './council-checks.mjs'

let ran = 0
const test = (name, fn) => { fn(); ran += 1; console.log(`  ok  ${name}`) }
const lesson = (key_stage, slides, teacher_notes = null) =>
  [{ module_id: 'test', key_stage, slides, teacher_notes }]

console.log('\ncouncil checks\n')

// ── What is on the wall ──────────────────────────────────────────────
test('a concept slide is prose, heading and body together', () => {
  const r = checkProse(lesson('KS1', [{ type: 'concept', heading: 'One two three', body: 'four five six seven eight nine ten' }]))
  assert.equal(r.detail, '1 of 1 slides within the age ceiling')
  assert.equal(r.score, 10)
})

test('a concept slide one word over its ceiling fails', () => {
  const r = checkProse(lesson('KS1', [{ type: 'concept', heading: 'a b c', body: 'd e f g h i j k l m' }]))
  assert.equal(r.score, 0)
  assert.equal(r.fails[0].words, 13)
})

test('a choice slide is measured, which is the bug this replaced', () => {
  // The old check counted only heading/body/text/caption, so all 105 choice
  // slides in the scheme scored zero words and passed.
  const slide = { type: 'choice', question: 'a b c d e f g h i j k l m', options: [{ text: 'yes' }, { text: 'no' }] }
  const r = checkBlocks(lesson('KS1', [slide]))
  assert.equal(r.detail, '2 of 3 blocks within the age ceiling')
  assert.equal(r.fails[0].words, 13)
})

test('a choice slide contributes nothing to prose', () => {
  const r = checkProse(lesson('KS1', [{ type: 'choice', question: 'a b c', options: [{ text: 'yes' }] }]))
  assert.equal(r.detail, '0 of 0 slides within the age ceiling')
})

test('blocks are measured one at a time, never summed', () => {
  // Four options of ten words each is forty words on the wall, and every one of
  // them passes, because a child reads one option at a time to decide.
  const ten = 'a b c d e f g h i j'
  const r = checkBlocks(lesson('KS1', [{ type: 'choice', question: 'pick', options: [1, 2, 3, 4].map(() => ({ text: ten })) }]))
  assert.equal(r.score, 10)
  assert.equal(r.detail, '5 of 5 blocks within the age ceiling')
})

test('a slide type nobody mapped fails loudly instead of passing', () => {
  const r = checkProse(lesson('KS1', [{ type: 'hologram', heading: 'hi' }]))
  assert.equal(r.score, 0)
  assert.equal(r.fails[0].words, 'UNKNOWN TYPE')
})

test('a scenario is exempt, because a fake post has to look real', () => {
  const wordy = { type: 'scenario', text: Array(60).fill('x').join(' '), handle: 'someone' }
  assert.equal(checkProse(lesson('EYFS', [wordy])).detail, '0 of 0 slides within the age ceiling')
  assert.equal(checkBlocks(lesson('EYFS', [wordy])).detail, '0 of 0 blocks within the age ceiling')
})

test('an absent optional field is not an empty block', () => {
  const r = checkBlocks(lesson('KS2', [{ type: 'discussion', prompt: 'talk about it' }])) // no lookFor
  assert.equal(r.detail, '1 of 1 blocks within the age ceiling')
})

test('the ceiling rises with the key stage', () => {
  const slide = { type: 'concept', heading: 'h', body: Array(24).fill('w').join(' ') } // 25 words
  assert.equal(checkProse(lesson('KS1', [slide])).score, 0)
  assert.equal(checkProse(lesson('KS2', [slide])).score, 10)
})

// ── Engagement ───────────────────────────────────────────────────────
test('a passive stretch over four minutes fails, and the action slide ends it', () => {
  const r = checkEngagement(lesson('KS2', [
    { type: 'concept', minutes: 3 }, { type: 'concept', minutes: 3 },  // 6, fails
    { type: 'choice' },
    { type: 'concept', minutes: 2 },                                    // 2, passes
  ]))
  assert.equal(r.detail, '1 of 2 stretches within 4 minutes')
  assert.equal(r.fails[0].minutes, 6)
})

test('a run of zero minute slides is not a stretch', () => {
  const r = checkEngagement(lesson('KS2', [{ type: 'concept' }, { type: 'concept' }]))
  assert.equal(r.detail, '0 of 0 stretches within 4 minutes')
})

// ── Passport ─────────────────────────────────────────────────────────
test('a module without a passport stage fails', () => {
  assert.equal(checkPassport(lesson('KS2', [], { cycles: [] })).score, 0)
  // 'Planet Friends 1' used to pass here, because the check only asked whether
  // the field was truthy. It is not a stage the passport has, so it fails now.
  assert.equal(checkPassport(lesson('KS2', [], { passport_stage: 'builder' })).score, 10)
})

test('passport is the binary check', () => {
  assert.equal(checkPassport(lesson('KS2', [])).binary, true)
  assert.equal(checkProse(lesson('KS2', [])).binary, false)
})

// ── The ratchet ──────────────────────────────────────────────────────
test('the floor is the best ever reached, so standing still is fine', () => {
  assert.equal(verdict({ score: 5.73, best: 5.73, binary: false, rulesChanged: false }), 'HELD')
})

test('going backwards is the only red', () => {
  assert.equal(verdict({ score: 5.72, best: 5.73, binary: false, rulesChanged: false }), 'SLIPPED')
  assert.equal(verdict({ score: 5.74, best: 5.73, binary: false, rulesChanged: false }), 'RATCHET UP')
})

test('a binary check under ten is unmet, not slipped, until it has been ten', () => {
  // Unbuilt work is not a regression. Making it red on every build is how a
  // gate teaches people to ignore it.
  assert.equal(verdict({ score: 0, best: 0, binary: true, rulesChanged: false }), 'UNMET')
  assert.equal(isRegression('UNMET'), false)
  assert.equal(verdict({ score: 10, best: 0, binary: true, rulesChanged: false }), 'HELD')
})

test('a binary check that reached ten and fell back IS a regression', () => {
  assert.equal(verdict({ score: 9.52, best: 10, binary: true, rulesChanged: false }), 'SLIPPED')
  assert.equal(isRegression('SLIPPED'), true)
})

test('changed rules compare nothing, so a loosened check cannot raise the floor', () => {
  assert.equal(verdict({ score: 10, best: 5.73, binary: false, rulesChanged: true }), 'NO FLOOR')
  assert.equal(verdict({ score: 0, best: 5.73, binary: false, rulesChanged: true }), 'NO FLOOR')
})

test('a check with no history yet is not a failure', () => {
  assert.equal(verdict({ score: 0, best: null, binary: false, rulesChanged: false }), 'FIRST RUN')
})


// ── Passport, after migration 277 ────────────────────────────────────
test('an invented passport stage fails rather than passing on truthiness', () => {
  // The first version accepted any truthy string, so a typo would have scored
  // ten out of ten while nothing could ever award it.
  const bad = [{ module_id: 'x', key_stage: 'KS2', slides: [], teacher_notes: { passport_stage: 'buidler' } }]
  assert.equal(checkPassport(bad).score, 0)
  assert.equal(checkPassport(bad).fails[0].passport_stage, 'buidler')
})

test('a sixth form module that sits after the passport counts as knowing', () => {
  const ks5 = [{ module_id: 'x', key_stage: 'KS5', slides: [], teacher_notes: { passport_stage: 'after' } }]
  assert.equal(checkPassport(ks5).score, 10)
})

console.log(`\n${ran} passed\n`)
