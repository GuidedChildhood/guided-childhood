// When does the school card come to the top of Home?
//
// Justin, 12 August 2026: "this is just the alert calendar for school tasks.
// Make sure this is in rotation to top once a week."
//
// Two rules, and the second is the one that matters:
//   once a week    the habit. A parent looks at the week ahead on a Sunday, and
//                  a card about Tuesday's PE kit is worth something then and
//                  much less on Wednesday.
//   anything due   the exception, and it overrides the day. A deadline a school
//                  has already sent is not something to sit on until Sunday.
//
// Pure arithmetic on a date, so it is checked here rather than by waiting six
// days to see what happens.
//
// Usage: node --experimental-strip-types scripts/check-school-spotlight.mjs

import { schoolTakesTheTop, londonDayOfWeek, SCHOOL_SPOTLIGHT_DOW, countWaitingToday, londonToday } from '../lib/home/school-spotlight.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// A known week. 9 August 2026 is a Sunday.
const sunday = new Date('2026-08-09T10:00:00Z')
const monday = new Date('2026-08-10T10:00:00Z')
const wednesday = new Date('2026-08-12T10:00:00Z')
const saturday = new Date('2026-08-15T10:00:00Z')

check('the day maths agrees with the calendar', londonDayOfWeek(sunday) === 0, String(londonDayOfWeek(sunday)))
check('and Wednesday is a Wednesday', londonDayOfWeek(wednesday) === 3, String(londonDayOfWeek(wednesday)))

// ── ONCE A WEEK, WITH NOTHING WAITING ───────────────────────────────────────
check('Sunday lifts it to the top', schoolTakesTheTop(0, sunday))
for (const [name, d] of [['Monday', monday], ['Wednesday', wednesday], ['Saturday', saturday]]) {
  check(`${name} leaves it where it lives`, !schoolTakesTheTop(0, d))
}
// Exactly one day, not two, which is what "once a week" has to mean.
const lifted = [0, 1, 2, 3, 4, 5, 6]
  .map(n => new Date(sunday.getTime() + n * 86400000))
  .filter(d => schoolTakesTheTop(0, d))
check('exactly one day in seven', lifted.length === 1, `${lifted.length} days`)
check('and it is the day the constant names', londonDayOfWeek(lifted[0]) === SCHOOL_SPOTLIGHT_DOW)

// ── ANYTHING WAITING BEATS THE DAY ──────────────────────────────────────────
//
// The whole point of the card is a deadline a school has already sent. Holding
// that until Sunday because the calendar says so would be the feature working
// against itself.
for (const [name, d] of [['Sunday', sunday], ['Monday', monday], ['Wednesday', wednesday], ['Saturday', saturday]]) {
  check(`${name} with one due lifts it`, schoolTakesTheTop(1, d))
}
check('and five due certainly lifts it', schoolTakesTheTop(5, wednesday))

// ── IT MOVES, IT DOES NOT DUPLICATE ─────────────────────────────────────────
//
// Home rendered the card in one place; the page now picks a position from this
// one boolean and renders it once either way. Checked here as the property that
// makes that safe: the answer is a single boolean, so there is no state in
// which both positions are true.
check('the answer is one boolean, so both places can never draw it',
  typeof schoolTakesTheTop(0, wednesday) === 'boolean')

// ── WHAT COUNTS AS WAITING, WHICH IS WHERE THE BUG WAS ──────────────────────
//
// The lift above was being handed the raw number of OPEN ROWS, and a weekly
// routine is one open row for ever. So a single "PE kit, every Tuesday" made
// the exception permanently true and the card sat at the top of Home seven days
// a week. These are the cases that distinguish a row from a thing that is
// actually waiting on somebody today.

const routine = (weekday, extra = {}) => ({ recurs_weekday: weekday, due_date: null, cleared_on: null, ...extra })
const oneOff = (dueDate, extra = {}) => ({ recurs_weekday: null, due_date: dueDate, cleared_on: null, ...extra })

// Wednesday 12 August 2026. Weekdays are 0 for Sunday, matching recurs_weekday.
const wed = wednesday
check('the fixture day is a Wednesday', londonDayOfWeek(wed) === 3)
check('and londonToday agrees with it', londonToday(wed) === '2026-08-12', londonToday(wed))

// A weekly routine, the case that broke it.
check('a Tuesday routine is not waiting on a Wednesday', countWaitingToday([routine(2)], wed) === 0)
check('a Wednesday routine IS waiting on a Wednesday', countWaitingToday([routine(3)], wed) === 1)
check('and so the card does not take the top on a Wednesday for a Tuesday routine',
  !schoolTakesTheTop(countWaitingToday([routine(2)], wed), wed))
// The whole complaint, stated as the property: one routine must not pin the
// card to the top of Home every day of the week.
{
  const lifted = [0, 1, 2, 3, 4, 5, 6]
    .map(n => new Date(sunday.getTime() + n * 86400000))
    .filter(d => schoolTakesTheTop(countWaitingToday([routine(2)], d), d))
  // Sunday (the spotlight day) and Tuesday (its own day). Not all seven.
  check('one weekly routine lifts the card on two days, not seven', lifted.length === 2, `${lifted.length} days`)
}

// Cleared for today. It comes back next week, it is not waiting now.
check('a routine cleared today is not waiting',
  countWaitingToday([routine(3, { cleared_on: '2026-08-12' })], wed) === 0)
check('but one cleared last week is waiting again',
  countWaitingToday([routine(3, { cleared_on: '2026-08-05' })], wed) === 1)

// Held for the holidays. The card already greys these and says so; the count
// has to agree with the card or the top of Home shouts about nothing.
check('a holiday held routine is not waiting',
  countWaitingToday([routine(3)], wed, () => true) === 0)
check('and it does not lift the card mid August',
  !schoolTakesTheTop(countWaitingToday([routine(3)], wed, () => true), wed))

// One offs. A dated one is waiting on its day and after it, never before.
check('a one off due today is waiting', countWaitingToday([oneOff('2026-08-12')], wed) === 1)
check('an overdue one off is waiting', countWaitingToday([oneOff('2026-08-01')], wed) === 1)
check('a one off due next week is not', countWaitingToday([oneOff('2026-08-20')], wed) === 0)
check('a one off with no date is waiting, somebody typed it on purpose',
  countWaitingToday([oneOff(null)], wed) === 1)

// And they add up.
check('a mixed list counts only what is waiting',
  countWaitingToday([routine(2), routine(3), oneOff('2026-08-20'), oneOff('2026-08-01')], wed) === 2)
check('an empty list is zero', countWaitingToday([], wed) === 0)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
