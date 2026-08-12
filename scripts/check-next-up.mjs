// Does what next actually move, and does a real need still beat the rotation?
//
// Justin: "are we rotating what's next between review quests, guide watch time,
// check watch balance, check school reminders, check device settings, check all
// devices added and set up, add any new devices, lessons, passport?"
//
// We were not, and the reason nobody spotted it is that the old chain looked
// correct: four sensible branches, first match wins. It was correct on the day
// it was written and then never changed again for a family whose first branch
// kept matching. That is what these checks are for: not "does it pick something
// sensible today" but "does it still pick something different in a fortnight".
//
// Usage: node --experimental-strip-types scripts/check-next-up.mjs

import { pickNextUp, ROTATION, dayIndex } from '../lib/home/next-up.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const day = (iso) => new Date(`${iso}T12:00:00Z`)

/** A family with nothing urgent and everything available, so the rotation is
 *  free to show all nine. */
const settled = {
  childName: 'Teo', stageName: 'Builder',
  jobsStatus: 'on_track', noQuestsYet: false,
  lessonsLeft: 3, lessonsPassed: 5, lessonsTotal: 8,
  watchTogetherLeft: 2, balanceAmber: false,
  schoolWaiting: 0, hasSchool: true,
  deviceCount: 4, devicesSetUp: 2,
}

// ── A REAL NEED STILL WINS ──────────────────────────────────────────────────
//
// The half of the old behaviour that was RIGHT, and the thing a rotation is
// most likely to break. Jobs waiting today is not a suggestion.
for (const iso of ['2026-08-12', '2026-08-13', '2026-08-14', '2026-09-01']) {
  const card = pickNextUp({ ...settled, jobsStatus: 'pending' }, day(iso))
  check(`${iso}: jobs pending beats the rotation`, card.key === 'jobs-pending', card.key)
}
check('a family with no quests at all is told to set them',
  pickNextUp({ ...settled, noQuestsYet: true, jobsStatus: undefined }, day('2026-08-12')).key === 'no-quests')
check('and jobs pending outranks even that',
  pickNextUp({ ...settled, noQuestsYet: true, jobsStatus: 'pending' }, day('2026-08-12')).key === 'jobs-pending')

// ── IT ACTUALLY ROTATES ─────────────────────────────────────────────────────
//
// The whole complaint. Over nine days a settled family must see nine different
// cards, and never the same one two mornings running.
{
  const keys = []
  for (let d = 0; d < 9; d++) {
    keys.push(pickNextUp(settled, new Date(day('2026-08-12').getTime() + d * 86400000)).key)
  }
  check('nine days give nine different cards', new Set(keys).size === 9, keys.join(' '))
  let repeats = 0
  for (let d = 0; d < 30; d++) {
    const a = pickNextUp(settled, new Date(day('2026-08-12').getTime() + d * 86400000)).key
    const b = pickNextUp(settled, new Date(day('2026-08-12').getTime() + (d + 1) * 86400000)).key
    if (a === b) repeats++
  }
  check('never the same card two mornings running, over a month', repeats === 0, `${repeats} repeats`)
  check('and every one of the nine gets a turn',
    new Set(keys).size === ROTATION.length, `${keys.length} of ${ROTATION.length}`)
}

// ── IT DOES NOT CHANGE HALFWAY THROUGH A DAY ────────────────────────────────
//
// A parent who opens Home at breakfast and again at bedtime must get the same
// card, or the thing they meant to come back to is gone.
{
  const morning = pickNextUp(settled, new Date('2026-08-12T06:30:00Z'))
  const evening = pickNextUp(settled, new Date('2026-08-12T21:45:00Z'))
  check('breakfast and bedtime agree', morning.key === evening.key, `${morning.key} / ${evening.key}`)
}

// ── NOTHING IRRELEVANT IS EVER OFFERED ──────────────────────────────────────
//
// Offering the guide to somebody who has watched all of it, or "finish setting
// up your devices" to somebody who has, is worse than saying nothing: it tells
// a parent the app is not paying attention.
{
  const done = { ...settled, watchTogetherLeft: 0, lessonsLeft: 0, deviceCount: 0, devicesSetUp: 0, hasSchool: false }
  const keys = new Set()
  for (let d = 0; d < 30; d++) {
    keys.add(pickNextUp(done, new Date(day('2026-08-12').getTime() + d * 86400000)).key)
  }
  check('a finished family is never offered the guide', !keys.has('guide'))
  check('nor lessons it has passed', !keys.has('lessons'))
  check('nor school it does not use', !keys.has('school'))
  check('nor settings for devices it has not added', !keys.has('device-settings'))
  check('nor finishing a set up with nothing in it', !keys.has('devices-setup'))
  check('but still gets something every day', keys.size > 0, [...keys].join(' '))
  check('and it still moves', keys.size > 1, `${keys.size} distinct`)
}

// ── PROGRESS ON ONE THING DOES NOT RESHUFFLE THE REST ───────────────────────
//
// The reason the day picks a slot in the FULL nine and then walks forward,
// rather than filtering first. Filtering first means finishing the guide
// silently moves every other item onto a different day.
{
  const before = pickNextUp({ ...settled }, day('2026-08-14'))
  const after = pickNextUp({ ...settled, watchTogetherLeft: 0 }, day('2026-08-14'))
  // The guide's own day is the one that has to change; a day that landed on
  // something else must be untouched.
  const guideDay = [...Array(9)].map((_, d) => new Date(day('2026-08-12').getTime() + d * 86400000))
    .find(dt => pickNextUp(settled, dt).key === 'guide')
  const otherDays = [...Array(9)].map((_, d) => new Date(day('2026-08-12').getTime() + d * 86400000))
    .filter(dt => pickNextUp(settled, dt).key !== 'guide')
  const moved = otherDays.filter(dt =>
    pickNextUp(settled, dt).key !== pickNextUp({ ...settled, watchTogetherLeft: 0 }, dt).key)
  check('finishing the guide moves nothing else', moved.length === 0, `${moved.length} moved`)
  check('and the guide day itself gets something else',
    !!guideDay && pickNextUp({ ...settled, watchTogetherLeft: 0 }, guideDay).key !== 'guide')
  check('an unrelated day is stable', before.key === after.key || before.key === 'guide')
}

// ── A CLOCK SET WRONG STILL RETURNS A CARD ──────────────────────────────────
for (const iso of ['2025-06-01', '2020-01-01']) {
  const card = pickNextUp(settled, day(iso))
  check(`${iso} still returns a real card`, !!card && !!card.key && !!card.href, card?.key)
}
check('the day index goes negative before the anchor, which is handled',
  dayIndex(day('2025-06-01')) < 0, String(dayIndex(day('2025-06-01'))))

// ── EVERY CARD IS WELL FORMED, IN EVERY STATE ───────────────────────────────
//
// Walked across the states that change the copy, because a template that reads
// well with 4 devices can read "1 films left" with one.
const STATES = [
  settled,
  { ...settled, childName: null, jobsStatus: 'none' },
  { ...settled, watchTogetherLeft: 1, deviceCount: 1, devicesSetUp: 0, lessonsLeft: 1, lessonsPassed: 7 },
  { ...settled, balanceAmber: true, schoolWaiting: 3 },
  { ...settled, deviceCount: 0, devicesSetUp: 0 },
]
for (const s of STATES) {
  for (const item of ROTATION) {
    if (!item.applies(s)) continue
    const c = item.build(s)
    check(`${c.key}: has a title`, c.title.length > 3, c.title)
    check(`${c.key}: has a line`, c.line.length > 10)
    check(`${c.key}: goes into the app`, c.href.startsWith('/dashboard/'), c.href)
    check(`${c.key}: no dashes`, !/[-–—]/.test(`${c.title} ${c.line} ${c.eyebrow}`), `${c.title} ${c.line}`)
    check(`${c.key}: no stray plural`, !/\b1 (films|lessons left|devices)\b/.test(c.line), c.line)
  }
}

// ── THE GREETING KNOWS WHEN TO GO QUIET ─────────────────────────────────────
//
// coversJobs is what stops DiGi saying "Teo has jobs to do" one line above a
// card saying the same thing. It must be true only on the cards that ARE about
// jobs, or Home goes silent about jobs on a day nothing else mentions them.
for (const item of ROTATION) {
  const c = item.build(settled)
  const aboutJobs = c.href.startsWith('/dashboard/quests')
  check(`${c.key}: coversJobs matches what the card is about`, c.coversJobs === aboutJobs,
    `coversJobs=${c.coversJobs} href=${c.href}`)
}

check('no two rotation entries share a key',
  new Set(ROTATION.map(i => i.key)).size === ROTATION.length)
check('there are nine of them, as asked', ROTATION.length === 9, String(ROTATION.length))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
