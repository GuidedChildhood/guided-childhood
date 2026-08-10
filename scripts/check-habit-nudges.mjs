// Do the nudges stay quiet when there is nothing to say?
//
// Justin asked for "little pop ups, not intrusive or annoying", and the only
// way a nudge earns that is by being silent most of the time. So the first
// thing this checks is silence: a family doing everything right, and a family
// doing nothing at all, both see nothing.
//
// Then it runs a month, because the last three bugs in this repo were the same
// shape and none of them was visible on a single day.
//
// Usage: node --experimental-strip-types scripts/check-habit-nudges.mjs

import { pickHabitNudge, snoozeDays } from '../lib/home/habit-nudges.ts'

const QUIET = {
  activeQuests: 3,
  everTimed: true,
  screenDaysThisWeek: 5,
  waitingTicks: 0,
  waitingOldestDays: 0,
  bankedStars: 0,
  bankedIdleDays: 0,
  offlineDaysThisFortnight: 2,
}

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── Silence is the default ──────────────────────────────────────────────────
check('a family doing it well is left alone', pickHabitNudge(QUIET) === null)
check('a family with no jobs at all is left alone',
  pickHabitNudge({ ...QUIET, activeQuests: 0, everTimed: false, screenDaysThisWeek: 0, offlineDaysThisFortnight: 0 }) === null)

// A brand new family: jobs set up, one day of screens, timer never touched.
// Nothing yet, because one day is not a habit and we would be guessing.
check('one day of screens is not enough to say anything',
  pickHabitNudge({ ...QUIET, everTimed: false, screenDaysThisWeek: 1, offlineDaysThisFortnight: 0 }) === null)

// ── Each rule fires on its own facts ────────────────────────────────────────
const timer = pickHabitNudge({ ...QUIET, everTimed: false, screenDaysThisWeek: 3 })
check('the timer nudge fires when it never has been', timer?.key === 'timer')

const waiting = pickHabitNudge({ ...QUIET, waitingTicks: 3, waitingOldestDays: 2 })
check('a job waiting on a yes fires', waiting?.key === 'waiting-yes')
check('and counts them correctly', waiting?.line.startsWith('3 jobs are'), waiting?.line)
const one = pickHabitNudge({ ...QUIET, waitingTicks: 1, waitingOldestDays: 1 })
check('one job reads as one job', one?.line.startsWith('1 job is'), one?.line)

check('a tick from this morning does not fire yet',
  pickHabitNudge({ ...QUIET, waitingTicks: 2, waitingOldestDays: 0 }) === null)

const offline = pickHabitNudge({ ...QUIET, screenDaysThisWeek: 6, offlineDaysThisFortnight: 0 })
check('a fortnight with nothing offline fires', offline?.key === 'offline')
check('but not for a family barely using screens',
  pickHabitNudge({ ...QUIET, screenDaysThisWeek: 2, offlineDaysThisFortnight: 0 }) === null)

const unspent = pickHabitNudge({ ...QUIET, bankedStars: 8, bankedIdleDays: 6 })
check('stars sitting unspent fire', unspent?.key === 'unspent')
check('stars earned yesterday do not',
  pickHabitNudge({ ...QUIET, bankedStars: 8, bankedIdleDays: 1 }) === null)

// ── Only one, and the right one ─────────────────────────────────────────────
const everything = {
  activeQuests: 3, everTimed: false, screenDaysThisWeek: 6,
  waitingTicks: 2, waitingOldestDays: 3,
  bankedStars: 9, bankedIdleDays: 7,
  offlineDaysThisFortnight: 0,
}
const all = pickHabitNudge(everything)
check('a family with four problems gets one card', !!all && typeof all.key === 'string')
check('and it is the one with a child waiting on it', all?.key === 'waiting-yes')

// Snoozing the top one hands over to the next, rather than going silent for the
// day. A parent who dismissed "say yes" has not dismissed the timer.
const afterSnooze = pickHabitNudge(everything, new Set(['waiting-yes']))
check('snoozing one lets the next through', afterSnooze?.key === 'timer')
const afterTwo = pickHabitNudge(everything, new Set(['waiting-yes', 'timer']))
check('and the next after that', afterTwo?.key === 'offline')
const afterAll = pickHabitNudge(everything, new Set(['waiting-yes', 'timer', 'offline', 'unspent']))
check('snoozing all of them means silence', afterAll === null)

// ── Every card teaches, not just prods ──────────────────────────────────────
const cards = [timer, waiting, offline, unspent].filter(Boolean)
check('every card carries the method', cards.every(c => c.why.length > 40), `${cards.length} cards`)
check('every card has one thing to do', cards.every(c => c.cta && c.href.startsWith('/dashboard')))
check('no dashes in any of the copy',
  cards.every(c => !/[-–—]/.test(`${c.eyebrow} ${c.line} ${c.why} ${c.cta}`)),
  cards.map(c => c.key).join(', '))

// ── Backing off ─────────────────────────────────────────────────────────────
check('not now means at least a couple of days', snoozeDays(0) === 2)
check('and each one after that means it more', [4, 8, 14, 14].every((v, i) => snoozeDays(i + 1) === v),
  [0, 1, 2, 3, 4, 5, 9].map(n => `${n}:${snoozeDays(n)}`).join(' '))
check('but it never goes away for good', snoozeDays(99) === 14)

// ── A month, one visit a day, dismissing every card that appears ────────────
//
// THE FAILURE THIS IS WRITTEN AGAINST, and it caught it. A family with a job
// waiting on a yes has that fact true every single morning, so a flat one day
// snooze brought the identical card back thirty times in thirty days. That is
// not a nudge, it is the thing Justin has already complained about twice.
const seen = []
const until = new Map()
const dismissals = new Map()
for (let day = 0; day < 30; day++) {
  const suppressed = new Set([...until].filter(([, d]) => d > day).map(([k]) => k))
  const nudge = pickHabitNudge(everything, suppressed)
  if (!nudge) { seen.push(null); continue }
  seen.push(nudge.key)
  const n = (dismissals.get(nudge.key) ?? 0)
  dismissals.set(nudge.key, n + 1)
  until.set(nudge.key, day + snoozeDays(n))
}
const shown = seen.filter(Boolean)
check('a month of ignoring is not a month of one card', new Set(shown).size > 1,
  `saw ${[...new Set(shown)].join(', ')}`)
check('never two of the same on consecutive days',
  shown.every((v, i) => i === 0 || v !== shown[i - 1]))
check('and it quietens down rather than keeping up the pace',
  seen.slice(20).filter(Boolean).length < seen.slice(0, 10).filter(Boolean).length,
  `${seen.slice(0, 10).filter(Boolean).length} in the first ten days, ${seen.slice(20).filter(Boolean).length} in the last ten`)
// The property that matters is not a count, it is that the gap GROWS. Five
// appearances spread 2, 4, 8 and 14 days apart is a card backing off; five in
// five days is a card nagging, and a bare count cannot tell them apart.
for (const key of new Set(shown)) {
  const days = seen.map((v, i) => (v === key ? i : -1)).filter(i => i >= 0)
  const gaps = days.slice(1).map((d, i) => d - days[i])
  check(`${key} backs off rather than keeping asking`,
    gaps.every((g, i) => i === 0 || g >= gaps[i - 1]),
    `days ${days.join(', ')}`)
}

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
