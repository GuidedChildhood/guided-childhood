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

import { schoolTakesTheTop, londonDayOfWeek, SCHOOL_SPOTLIGHT_DOW } from '../lib/home/school-spotlight.ts'

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

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
