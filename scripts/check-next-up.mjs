// Does the daily lead actually rotate, and does every family get one?
//
// Justin, 12 August 2026: "lets rework these tidy all into the 5 a day next to
// green and updates to lead a to do every day that works." The test he set is
// whether a parent can open the app and say out loud what they are doing
// today, so the two failures that matter are the same card every day, and no
// card at all.
//
// pickNextUp is pure, so both can be checked over a whole month for nothing.
//
// Usage: node --experimental-strip-types scripts/check-next-up.mjs

import { pickNextUp, ROTATION, dayIndex, isShopDay } from '../lib/home/next-up.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// A family with everything live, so every rotation item applies and the walk
// never has to skip. This is the case that proves the cycle length.
const busy = {
  childName: 'Teo', stageName: 'Explorer',
  jobsStatus: 'on_track', noQuestsYet: false,
  lessonsLeft: 20, lessonsPassed: 3, lessonsTotal: 23,
  watchTogetherLeft: 2, balanceAmber: true,
  schoolWaiting: 1, hasSchool: true,
  deviceCount: 4, devicesSetUp: 2,
  focusLabel: 'Bedtime screens', focusImproving: false,
  concernsLive: 3, scriptHref: '/dashboard/scripts/12',
  // They have checked in, which is what puts anything on the passport worth
  // being sent to look at. See the passport item in next-up.ts.
  hasCheckedIn: true,
}

// The opposite: day one, nothing set up, nothing flagged, no school, no
// devices. Most items do not apply, which is where the walk forward earns its
// keep and where "no card at all" would show up.
const brandNew = {
  ...busy,
  jobsStatus: undefined, noQuestsYet: false,
  lessonsLeft: 0, lessonsPassed: 0, lessonsTotal: 0,
  watchTogetherLeft: 0, balanceAmber: false,
  schoolWaiting: 0, hasSchool: false,
  deviceCount: 0, devicesSetUp: 0,
  focusLabel: null, focusImproving: false,
  concernsLive: 0, scriptHref: '/dashboard/scripts',
  hasCheckedIn: false,
}

// 5 January 2026, the anchor. Deliberately a month whose 12th falls inside the
// first cycle, so the shop day is exercised rather than avoided.
const day = n => new Date(Date.UTC(2026, 0, 5 + n, 12, 0, 0))

// ── EVERY FAMILY GETS A CARD, EVERY DAY ─────────────────────────────────────

let missing = 0
for (const s of [busy, brandNew]) {
  for (let d = 0; d < 60; d++) {
    const card = pickNextUp(s, day(d))
    if (!card || !card.title || !card.href) missing++
  }
}
check('every family gets a card on every one of 60 days', missing === 0, `${missing} blank`)

// ── AND IT IS NOT THE SAME CARD EVERY DAY ───────────────────────────────────
//
// This is the fault the rotation was written to fix: a four branch if chain
// where the first match won for ever, so one sentence sat under Today for
// weeks.

// One CONTIGUOUS cycle with no shop day in it.
//
// Filtering shop days out of a fixed window is the wrong test and it fails
// honestly: the day index picks the position, so a day the shop takes is a
// position the rotation never lands on, and one item silently loses that
// month's turn. That is the real, accepted cost of a monthly tier, and it is
// once a month per item per year. What must still be true is that a clear run
// of days shows all eleven, which is what this measures.
const cycleStart = (() => {
  for (let start = 0; start < 60; start++) {
    if (Array.from({ length: ROTATION.length }, (_, i) => day(start + i)).every(d => !isShopDay(d))) return start
  }
  throw new Error('no clear cycle in 60 days, which cannot happen with a monthly tier')
})()
const cycleDays = Array.from({ length: ROTATION.length }, (_, i) => day(cycleStart + i))
const busyKeys = cycleDays.map(d => pickNextUp(busy, d).key)
check('a busy family sees every rotation item across one cycle',
  new Set(busyKeys).size === ROTATION.length,
  `${new Set(busyKeys).size} of ${ROTATION.length}`)

check('and never the same card two days running',
  busyKeys.every((k, i) => i === 0 || k !== busyKeys[i - 1]))

// The two moved off the pathway on 13 August are genuinely in the cycle. They
// are the reason for the change, so a rotation that silently never reaches
// them would be the change not landing.
check('Your focus gets its turn', busyKeys.includes('focus'), busyKeys.join(' '))

// ── THE SHOP IS MONTHLY, AND ONLY FOR A FAMILY WITH A PASSPORT ──────────────
//
// A shop pitch to somebody whose passport is a cover and five zeros sells a
// personalised booklet of nothing, so it carries the same gate the passport
// nudge does.
const shopDays = Array.from({ length: 90 }, (_, d) => day(d))
  .filter(d => pickNextUp(busy, d).key === 'shop')
check('the shop comes up roughly once a month, not once a cycle',
  shopDays.length === 3, `${shopDays.length} in 90 days`)
check('and every one of those is the 12th',
  shopDays.every(d => isShopDay(d)))
check('a family who has never checked in is never sent to the passport',
  Array.from({ length: 60 }, (_, d) => pickNextUp(brandNew, day(d)).key)
    .every(k => k !== 'passport' && k !== 'shop'))
check('a real need still beats the monthly shop',
  pickNextUp({ ...busy, jobsStatus: 'pending' }, day(7)).key === 'jobs-pending')
check('the concern queue gets its turn', busyKeys.includes('concern-queue'))

// ── A REAL NEED STILL WINS ──────────────────────────────────────────────────
//
// Rotation is for suggestions. Jobs actually waiting is the state of their
// day, and burying that under "have you looked at the passport" would be the
// rotation working against the product.

const waiting = { ...busy, jobsStatus: 'pending' }
check('jobs waiting jump the queue on every day of a cycle',
  Array.from({ length: ROTATION.length }, (_, d) => pickNextUp(waiting, day(d)).key)
    .every(k => k === 'jobs-pending'))

// ── PROGRESS ON ONE THING DOES NOT RESHUFFLE THE OTHERS ─────────────────────
//
// The subtle one the file warns about: filtering to what applies and then
// taking the modulo would mean finishing the devices silently moved which day
// everything else falls on. The walk forward is what avoids that.

const finishedDevices = { ...busy, devicesSetUp: 4 }
const unchanged = Array.from({ length: 30 }, (_, d) =>
  pickNextUp(busy, day(d)).key === 'devices-setup'
  || pickNextUp(busy, day(d)).key === pickNextUp(finishedDevices, day(d)).key)
check('finishing the devices leaves every other day where it was',
  unchanged.every(Boolean))

// The focus card must land on the script the loop already chose, or Home and
// the loop send a parent to two different places for the same words.
const focusDay = Array.from({ length: ROTATION.length }, (_, d) => pickNextUp(busy, day(d)))
  .find(c => c.key === 'focus')
check('the focus card uses the loop\'s own script href',
  focusDay?.href === '/dashboard/scripts/12', focusDay?.href)

// The day index has to turn over at London midnight, not UTC, or the card
// changes in the middle of a British summer evening.
check('the day turns over on the London date',
  dayIndex(new Date('2026-07-01T23:30:00Z')) === dayIndex(new Date('2026-07-01T12:00:00Z')) + 1)

console.log(failures === 0 ? '\nAll good.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
