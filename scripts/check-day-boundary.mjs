// Does the product agree with the family about what day it is?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "check that this refreshes each day", and, with the
// Setup Quest and the check in side by side, "it says done today under one that
// is to do today."
//
// Two faults, one root. The check in decided what "today" was with
// `new Date().toISOString().split('T')[0]`, which is the date in UTC. The
// server runs in UTC and every family using this runs on UK time, so from late
// March to late October they are an hour apart, and the hour falls in exactly
// the wrong place:
//
//   00:30 Tuesday is stored as 23:30 Monday UTC, so Tuesday's check in counts
//   as Monday's and the parent gets asked again a few hours later.
//
//   Between midnight and 1am the server still reads Monday, so a parent who
//   finished Monday is told they are done for a day that has already started.
//
// lib/time/london exists for exactly this and six other files already used it.
// The check in, the one part of the product whose whole job is knowing what day
// it is, was the one that did not.
//
// The second half of the check is the Setup Quest's finished card, which was
// static: it told every parent the first thing today was the check in and
// offered a Start today's check in button, whether or not it was already done.
// That is the same shape as the setup loop of earlier the same day, two
// surfaces reading one truth and only one of them looking it up.
//
// Usage: node scripts/check-day-boundary.mjs

import { readFileSync } from 'node:fs'

const read = p => { try { return readFileSync(p, 'utf8') } catch { return '' } }

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE DAILY LOOP USES THE FAMILY'S CLOCK ──────────────────────────────────
//
// Only the files that decide whether a DAY has turned over. Plenty of other
// places format a UTC date for a log line or an id, and those are fine.
const DAILY = [
  'lib/checkin/today.ts',
  'lib/checkin/done-today.ts',
]
for (const f of DAILY) {
  const src = read(f)
  check(`${f} was found`, src.length > 0)
  check(
    `${f} asks London what day it is`,
    /londonNow\(\)\.dateStr|ukToday\(/.test(src),
    'a UK family and a UTC server disagree for one hour every summer night',
  )
  check(
    `${f} does not decide the day in UTC`,
    !/const today = new Date\(\)\.toISOString\(\)\.split/.test(src),
    'this is the exact line that shipped the bug',
  )
}

// ── AND THE TWO SURFACES AGREE ABOUT THE CHECK IN ───────────────────────────
const quest = read('components/setup/SetupQuest.tsx')
const page = read('app/(dashboard)/dashboard/setup/page.tsx')

check(
  'the finished card takes the check in state',
  /function AllDone\(\{\s*checkInDone/.test(quest),
  'it used to be static and always said the check in was waiting',
)
check(
  'the finished card says something different when it is done',
  /checkInDone\s*\?/.test(quest),
  'one truth, two sentences',
)
check(
  'the setup page actually looks it up',
  /getTodayCheckIn/.test(page) && /checkInDone/.test(page),
  'a prop nobody passes is a default nobody notices',
)
check(
  'and hands it to the quest',
  /checkInDone=\{checkInDone\}/.test(page),
)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
