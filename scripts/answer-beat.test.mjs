#!/usr/bin/env node
// THE ANSWER BEAT'S OWN TESTS.
//
// No database, no browser, no secrets, so this runs in CI beside the
// governance tests. The beat is pure state for exactly this reason: the rules
// below are the ones that could reverse in a single careless edit with nothing
// going red, and every one of them is about what a class sees at the moment
// they get something wrong.
//
// The rule that matters most is the third: a wrong first pick must NOT reveal
// the answer. The whole point of the retry is the thirty seconds of arguing
// before the teacher taps again, and that only happens while the answer is
// still hidden.

import { answerBeat } from '../shared/lesson-slides.ts'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

// Three options, the right one at display index 1.
const THREE = (tries) => answerBeat(1, 3, tries)
// A true or false slide, right answer at index 0.
const TWO = (tries) => answerBeat(0, 2, tries)

// ── Nothing tapped yet ──────────────────────────────────────────────
{
  const s = THREE([])
  ok('untouched: not settled', s.settled === false)
  ok('untouched: not retrying', s.retrying === false)
  ok('untouched: every option idle', s.states.every(x => x === 'idle'), s.states.join(','))
}

// ── Right first time ────────────────────────────────────────────────
{
  const s = THREE([1])
  ok('right first: settles', s.settled === true)
  ok('right first: no retry offered', s.retrying === false)
  ok('right first: the answer reads right', s.states[1] === 'right')
  ok('right first: the others go dead', s.states[0] === 'dead' && s.states[2] === 'dead', s.states.join(','))
}

// ── Wrong first time: THE ONE THAT MATTERS ──────────────────────────
{
  const s = THREE([0])
  ok('wrong first: does NOT settle', s.settled === false)
  ok('wrong first: offers the retry', s.retrying === true)
  ok('wrong first: the answer STAYS HIDDEN', s.states[1] === 'idle',
    `state was "${s.states[1]}", which hands the class the answer before anybody reconsiders`)
  ok('wrong first: the tapped one reads wrong', s.states[0] === 'wrong')
  ok('wrong first: the untapped one is still live', s.states[2] === 'idle')
}

// ── Right on the second go ──────────────────────────────────────────
{
  const s = THREE([0, 1])
  ok('right second: settles', s.settled === true)
  ok('right second: retry is over', s.retrying === false)
  ok('right second: the answer reads right', s.states[1] === 'right')
  ok('right second: the first mistake still reads wrong', s.states[0] === 'wrong',
    'the class should still see which one they tried and why it failed')
}

// ── Wrong twice ─────────────────────────────────────────────────────
{
  const s = THREE([0, 2])
  ok('wrong twice: settles', s.settled === true)
  ok('wrong twice: the answer is revealed anyway', s.states[1] === 'right',
    'nobody leaves the slide without seeing the right answer and its reasoning')
  ok('wrong twice: both mistakes read wrong', s.states[0] === 'wrong' && s.states[2] === 'wrong')
}

// ── True or false gets no retry ─────────────────────────────────────
{
  const s = TWO([1])
  ok('two options: a wrong pick settles immediately', s.settled === true,
    'with one option left a retry is a forced tap that gives the answer away')
  ok('two options: no retry offered', s.retrying === false)
  ok('two options: the answer is revealed with its reasoning', s.states[0] === 'right')
  ok('two options: the mistake reads wrong', s.states[1] === 'wrong')
}
{
  const s = TWO([0])
  ok('two options: right first still settles', s.settled === true)
  ok('two options: right first reads right', s.states[0] === 'right')
}

// ── The right answer is never marked wrong ──────────────────────────
// Cheap, and it is the failure that would be hardest to spot by eye: a class
// tapping the correct option and being told it is wrong.
{
  const every = [[], [0], [1], [2], [0, 1], [0, 2], [1, 0], [2, 1], [1, 2], [2, 0]]
  const bad = every.filter(t => THREE(t).states[1] === 'wrong')
  ok('the right answer is never styled as wrong', bad.length === 0,
    `broke on: ${bad.map(t => `[${t}]`).join(' ')}`)
}

if (failed) {
  console.error(`\n${failed} answer beat test${failed === 1 ? '' : 's'} failed`)
  process.exit(1)
}
console.log('answer beat: all tests passed')
