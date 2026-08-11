// Does a dip on the weekly check in actually change what we offer?
//
// Justin, 11 August 2026, on the same recommended card for a third day:
// "shouldn't we have a better script that relates to dips on check in or
// previous moments, can we make sure it puts the most relevant script for the
// user and rotates them as we have a lot?"
//
// wellbeing_checks has held five scores out of five, per child, per week, since
// migration 001. The recommender had never read one of them. A parent marking
// sleep at two out of five for a month was being offered scripts on the
// strength of owning a tablet.
//
// Usage: node --experimental-strip-types scripts/check-checkin-dips.mjs

import { dipsFrom } from '../lib/pathway/checkin-dips.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const week = (n, scores) => ({ week_start: `2026-08-${String(24 - n * 7).padStart(2, '0')}`, ...scores })
const FINE = { mood_score: 4, sleep_score: 4, social_score: 4, screen_mood_score: 4, open_communication: 4 }

// ── Silence when there is nothing wrong ─────────────────────────────────────
check('no check ins means no signal', dipsFrom([]).length === 0)
check('a family scoring well is left alone', dipsFrom([week(0, FINE)]).length === 0)
// Three out of five is the middle of the scale. Reading it as a cry for help
// would hand every family a mood script for ever.
check('a middling three is not a dip',
  dipsFrom([week(0, { ...FINE, mood_score: 3 })]).length === 0)

// ── A dip is heard, and pointed at the right shelf ──────────────────────────
const sleep = dipsFrom([week(0, { ...FINE, sleep_score: 2 })])
check('a low sleep score is a dip', sleep.length === 1)
check('and sleep points at screen time', sleep[0]?.category === 'screen-time',
  `got ${sleep[0]?.category}`)
check('and it says so in the parent\'s own words', /Sleep was low on your last check in/.test(sleep[0]?.reason ?? ''),
  sleep[0]?.reason)

const mood = dipsFrom([week(0, { ...FINE, mood_score: 1 })])
check('mood points at mood and confidence', mood[0]?.category === 'mood-confidence')
const social = dipsFrom([week(0, { ...FINE, social_score: 2 })])
check('friendships point at social media', social[0]?.category === 'social-media')
const talk = dipsFrom([week(0, { ...FINE, open_communication: 2 })])
check('a child who has stopped talking is not treated as a danger',
  talk[0]?.category === 'mood-confidence', `got ${talk[0]?.category}`)

// ── Worse and longer outrank better and shorter ─────────────────────────────
const one = dipsFrom([week(0, { ...FINE, mood_score: 1 })])[0].score
const two = dipsFrom([week(0, { ...FINE, mood_score: 2 })])[0].score
check('one out of five outranks two out of five', one > two, `${one} vs ${two}`)

const run = dipsFrom([
  week(0, { ...FINE, sleep_score: 2 }),
  week(1, { ...FINE, sleep_score: 2 }),
  week(2, { ...FINE, sleep_score: 2 }),
])[0]
check('three low weeks outrank one', run.score > two, `${run.score} vs ${two}`)
check('and the copy says it has been a run', /three of your recent check ins/.test(run.reason), run.reason)

// ── The band it sits in, which is the whole ranking argument ────────────────
//
// A concern scores 110 at its weakest and a device scores 50. A dip has to land
// between them: a family SAYING something is wrong outranks a family MEASURING
// it, and both outrank owning a console.
const all = [1, 2].flatMap(s => [1, 2, 3].map(w =>
  dipsFrom(Array.from({ length: w }, (_, i) => week(i, { ...FINE, mood_score: s })))[0].score))
check('every dip outranks a device', all.every(v => v > 50), `lowest ${Math.min(...all)}`)
check('and no dip outranks a raised concern', all.every(v => v <= 110), `highest ${Math.max(...all)}`)

// ── Only the last month is consulted ────────────────────────────────────────
const old = dipsFrom([
  week(0, FINE), week(1, FINE), week(2, FINE), week(3, FINE),
  week(4, { ...FINE, mood_score: 1 }),
])
check('a bad week two months ago is not this week\'s problem', old.length === 0)

// ── Several dips come back strongest first ──────────────────────────────────
const many = dipsFrom([week(0, { mood_score: 2, sleep_score: 1, social_score: 2, screen_mood_score: 4, open_communication: 4 })])
check('several dips are all reported', many.length === 3, many.map(d => d.category).join(', '))
check('strongest first', many[0].score >= many[1].score && many[1].score >= many[2].score)
check('the worst score leads', many[0].category === 'screen-time', `got ${many[0].category}`)

// ── House rules ─────────────────────────────────────────────────────────────
check('no dashes in any reason', many.every(d => !/[-–—]/.test(d.reason)))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
