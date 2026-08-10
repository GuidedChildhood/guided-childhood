// Does the balance page agree with itself?
//
// Justin ticked the first of his five a day on the child app and the balance
// screen said 0 stars in one card and 10 stars in the next. Both sums were right
// about their own question. Nothing could see that they disagreed, because they
// lived twenty lines apart in the middle of a server component.
//
// Usage: node --experimental-strip-types scripts/check-today-split.mjs

import { splitToday } from '../lib/quests/today-split.ts'

const CHILD = 'child-1'
const due = [
  { id: 'q1', stars: 10 },
  { id: 'q2', stars: 3 },
  { id: 'q3', stars: 2 },
  { id: 'q4', stars: 1 },
]

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── Exactly what Justin did: one job ticked, nothing approved yet ───────────
const justin = splitToday(due, [{ quest_id: 'q1', child_id: CHILD, status: 'pending' }], CHILD)
check('a ticked job is not in the bank yet', justin.earned === 0, `earned ${justin.earned}`)
check('and it is not silently lost either', justin.waiting === 10, `waiting ${justin.waiting}`)
check('the rest is still there to be had', justin.stillToEarn === 6, `still ${justin.stillToEarn}`)
// The whole bug in one line: the two numbers used to be the same number.
check('banked and waiting are never the same count', justin.earned !== justin.waiting)

// ── A grown up says yes ─────────────────────────────────────────────────────
const approved = splitToday(due, [{ quest_id: 'q1', child_id: CHILD, status: 'approved' }], CHILD)
check('a yes moves it into the bank', approved.earned === 10 && approved.waiting === 0)

// ── The three states never overlap, and always add up ───────────────────────
const mixed = splitToday(due, [
  { quest_id: 'q1', child_id: CHILD, status: 'approved' },
  { quest_id: 'q2', child_id: CHILD, status: 'pending' },
  { quest_id: 'q3', child_id: CHILD, status: 'rejected' },
], CHILD)
check('banked, waiting and to do add up to the day',
  mixed.earned + mixed.waiting + mixed.stillToEarn === 16,
  `${mixed.earned} + ${mixed.waiting} + ${mixed.stillToEarn}`)
check('a rejected tick goes back to outstanding', mixed.stillToEarn === 3, `still ${mixed.stillToEarn}`)
check('no job is counted twice',
  [...mixed.approvedIds].every(id => !mixed.waitingIds.has(id)))

// A quest cannot be both. If a tick was somehow written twice, the yes wins,
// because showing "waiting" for something already approved would send a child
// to ask for a yes they already have.
const twice = splitToday(due, [
  { quest_id: 'q1', child_id: CHILD, status: 'pending' },
  { quest_id: 'q1', child_id: CHILD, status: 'approved' },
], CHILD)
check('a double tick resolves to the yes', twice.earned === 10 && twice.waiting === 0)

// ── Whole family jobs, which carry no child id ──────────────────────────────
const family = splitToday(due, [{ quest_id: 'q2', child_id: null, status: 'approved' }], CHILD)
check('a whole family tick counts for this child', family.earned === 3)
const sibling = splitToday(due, [{ quest_id: 'q2', child_id: 'child-2', status: 'approved' }], CHILD)
check("a sibling's tick does not", sibling.earned === 0 && sibling.stillToEarn === 16)

// ── Edges ───────────────────────────────────────────────────────────────────
const none = splitToday([], [], CHILD)
check('no jobs is zero of everything', none.earned === 0 && none.waiting === 0 && none.stillToEarn === 0)
const unstarred = splitToday([{ id: 'q9', stars: 0 }], [{ quest_id: 'q9', child_id: CHILD, status: 'pending' }], CHILD)
check('a job with no stars set is worth one', unstarred.waiting === 1)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
