// The timeline's arithmetic, checked against a calendar.
// Usage: node --experimental-strip-types scripts/check-pace.mjs

import { stagePace, paceLine, weeksUntilExit } from '../lib/pathway/pace.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const NOW = new Date(Date.UTC(2026, 7, 18))
const dobAge = (years, extraDays = 0) => new Date(Date.UTC(2026 - years, 7, 18 - extraDays))

// A twelve year old Explorer: 13th birthday in a year, 52 weeks.
check('weeks to the 13th birthday of a 12 year old is about 52',
  Math.abs(weeksUntilExit(dobAge(12), 13, NOW) - 52) <= 1, String(weeksUntilExit(dobAge(12), 13, NOW)))

// 40 items, 52 weeks: one a fortnight fills it (40*2=80 > 52 fails... 52 >= 40 so week).
const p1 = stagePace(3, 40, dobAge(12), NOW)
check('40 left with a year reads one a week', p1.kind === 'week', p1.kind)

// 10 items, 52 weeks: 52 >= 43.3 so one a month.
const p2 = stagePace(3, 10, dobAge(12), NOW)
check('10 left with a year reads one a month', p2.kind === 'month', p2.kind)

// 76 items, 8 months (~34 weeks): beyond, and the line says the truth.
const p3 = stagePace(3, 76, dobAge(12, 130), NOW)
check('76 left with 8 months reads beyond', p3.kind === 'beyond', p3.kind)
check('beyond names months and never predicts a close',
  paceLine(p3, 'Teo', 3).includes('page never closes'))

// The stated rhythm always fits: at the fortnight boundary, items*2 weeks fill.
const boundary = stagePace(2, 20, dobAge(9, -0), NOW)
check('a stated rhythm never falls short of the page',
  boundary.kind !== 'fortnight' || boundary.weeksLeft >= 20 * 2)

// No birthday: honest, no invented dates.
const p4 = stagePace(2, 30, null, NOW)
check('no birthday reads unknown, no invented date', p4.kind === 'unknown')
check('unknown line offers settings, not a guess', paceLine(p4, 'Teo', 2).includes('settings'))

// Aged out: page stays open.
const p5 = stagePace(1, 40, dobAge(12), NOW)
check('aged past reads past and stays open', p5.kind === 'past')

// Stage five has no clock.
const p6 = stagePace(5, 40, dobAge(16), NOW)
check('Independent reads open, no clock', p6.kind === 'open')

// Nearly done beats every clock.
check('3 left reads few whatever the calendar says', stagePace(3, 3, dobAge(12, 300), NOW).kind === 'few')
check('0 left reads stamped', stagePace(3, 0, dobAge(12), NOW).kind === 'stamped')

// No dashes in any line, ever.
const kinds = [p1, p2, p3, p4, p5, p6, { kind: 'stamped' }, { kind: 'few', left: 2 }]
check('no dash in any pace line', kinds.every(p => !/[-–—]/.test(paceLine(p, 'Teo', 3))))

console.log(failures === 0 ? '\nall passed' : `\n${failures} FAILED`)
process.exit(failures === 0 ? 0 : 1)
