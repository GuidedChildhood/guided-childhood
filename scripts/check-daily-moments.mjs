// Does flagging a moment actually lead anywhere?
//
// The end of day tagger says, in so many words: "Tap anything that happened. We
// will show you the right scripts tomorrow." That is a promise, and it is kept
// by one lookup: the moment key becomes a concerns.slug, and the recommender
// scores a script category from that slug. A key with no mapping scores zero,
// the promise quietly is not kept, and nothing anywhere says so.
//
// Justin, 11 August 2026: "we should have struggle to come off device, and TV
// first thing morning, phones in car, at restaurant, walking in street, as
// moments need to solve."
//
// Usage: node --experimental-strip-types scripts/check-daily-moments.mjs

import { DAILY_MOMENTS, DAILY_MOMENT_GROUPS, dailyMomentLabel } from '../lib/content/daily-moments.ts'
import { CONCERN_TO_CATEGORY } from '../lib/content/signal-map.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const keys = DAILY_MOMENTS.map(m => m.key)

// ── The five Justin asked for are there ─────────────────────────────────────
const ASKED = {
  come_off: 'struggle to come off a device',
  tv_morning: 'TV first thing in the morning',
  phone_car: 'phones in the car',
  phone_out: 'phones at a restaurant',
  phone_street: 'phones walking in the street',
}
for (const [key, what] of Object.entries(ASKED)) {
  check(`${what} is a moment`, keys.includes(key), key)
}

// ── The promise: every moment reaches a script category ─────────────────────
const unmapped = keys.filter(k => !CONCERN_TO_CATEGORY[k])
check('every moment leads to scripts', unmapped.length === 0,
  unmapped.length ? `no category for: ${unmapped.join(', ')}` : `${keys.length} moments`)

// And the screen ones reach the RIGHT place, which is the whole point. A parent
// flagging the handover fight and being handed a packed lunch script would be
// worse than being handed nothing.
check('coming off a device leads to screen time', CONCERN_TO_CATEGORY.come_off === 'screen-time')
check('TV first thing leads to screen time', CONCERN_TO_CATEGORY.tv_morning === 'screen-time')
check('phones in the car lead to screen time', CONCERN_TO_CATEGORY.phone_car === 'screen-time')
check('phones out to eat lead to the family deal', CONCERN_TO_CATEGORY.phone_out === 'family-rules')
// A child walking into a road while looking down is not a screen time problem.
check('phones in the street lead to staying safe', CONCERN_TO_CATEGORY.phone_street === 'staying-safe')

// ── The timeline holds together ─────────────────────────────────────────────
const grouped = DAILY_MOMENT_GROUPS.flatMap(g => g.keys)
check('every moment appears on the timeline', keys.every(k => grouped.includes(k)),
  keys.filter(k => !grouped.includes(k)).join(', '))
check('no moment appears twice', new Set(grouped).size === grouped.length)
check('every timeline key is a real moment', grouped.every(k => keys.includes(k)),
  grouped.filter(k => !keys.includes(k)).join(', '))
check('every moment has a label the feedback API can read',
  keys.every(k => typeof dailyMomentLabel(k) === 'string'))
check('every moment has an icon, since most have no artwork yet',
  DAILY_MOMENTS.every(m => typeof m.icon === 'string' && m.icon.length > 0))

// ── No dashes, house rule ───────────────────────────────────────────────────
check('no dashes in any label',
  DAILY_MOMENTS.every(m => !/[-–—]/.test(m.label)),
  DAILY_MOMENTS.filter(m => /[-–—]/.test(m.label)).map(m => m.label).join(', '))
check('no dashes in any group name',
  DAILY_MOMENT_GROUPS.every(g => !/[-–—]/.test(g.name)))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
