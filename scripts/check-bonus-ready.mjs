// Does the Friend beside the road ever recommend an empty page?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026, with the daily path on his phone and Orbit standing
// beside it holding "Their week": "this image showing Orbit first week, it is
// the rotation bonuses... this week shouldn't be on the first week as no
// relevant info."
//
// The bonus is a character stepping out of the road to recommend ONE thing.
// That is a promise that the thing is there. "See their week honestly" on day
// two opens on a week that has not happened, so the first thing the product
// ever personally recommends to a new family is its emptiest page.
//
// The fix is a `needsDays` on the service and a familyDays argument on the
// rotation. Both halves are easy to drop: a new reporting page added without
// needsDays, or a caller that forgets to pass the age, and the bonus is back to
// recommending an empty week with nothing going red.
//
// Usage: node --experimental-strip-types scripts/check-bonus-ready.mjs

// planets.ts and rotation.ts are both deliberately import free so they can be
// checked here without the app's module aliases. friend-of-the-day is NOT: it
// reaches for @/lib/..., which only resolves inside Next. So the rule under
// test lives in planets.ts and the wiring around it is checked as source.
import { PLANETS, readyServices } from '../lib/pathway/planets.ts'
import { pairFor } from '../lib/pathway/rotation.ts'
import { STAGE_CHARACTERS } from '../lib/content/stage-characters.ts'
import { readFileSync } from 'node:fs'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE ONE THAT REPORTS HAS TO SAY SO ──────────────────────────────────────
const balance = PLANETS.find(p => p.key === 'balance')
check('the balance service still exists', !!balance)
check(
  'and it is held back for a week',
  (balance?.needsDays ?? 0) >= 7,
  'its whole content is a week of recorded time',
)

// ── A NEW FAMILY IS NEVER OFFERED IT ────────────────────────────────────────
//
// Every two day slot for the first fortnight, which is more than a full turn
// of the rotation, so this covers the whole cycle rather than one lucky day.
// The same two steps friendOfTheDay takes: narrow the pool by age, then pick
// from it.
//
// CAST_LEN is DERIVED, not typed in. Writing 5 here by hand made this script
// report that an established family never sees the balance service, which sent
// me looking for a rotation bug that did not exist: the real cast is DiGi plus
// the five stage characters, and at six the coverage is even. A guard that
// hardcodes a number the app computes will eventually fail for its own reasons
// rather than the product's, which is worse than no guard.
const CAST_LEN = 1 + STAGE_CHARACTERS.length
const pick = (slot, familyDays) => {
  const pool = readyServices(familyDays)
  const { serviceIndex } = pairFor(slot, CAST_LEN, pool.length)
  return pool[serviceIndex]
}
for (let day = 0; day < 14; day++) {
  const service = pick(Math.floor(day / 2), day)
  const tooEarly = (service.needsDays ?? 0) > day
  check(
    `day ${day}: offers "${service.short}", which is ready`,
    !tooEarly,
    tooEarly ? 'a page with nothing in it, recommended by name' : '',
  )
}

// ── AND AN ESTABLISHED FAMILY STILL SEES EVERYTHING ─────────────────────────
//
// The filter must narrow the pool for a new family and nobody else, or a
// service quietly disappears from the rotation for good.
const seen = new Set()
for (let slot = 0; slot < 120; slot++) seen.add(pick(slot, 400).key)
check(
  'an old family still meets every service',
  seen.size === PLANETS.length,
  `${seen.size} of ${PLANETS.length}`,
)

// ── THE CALLER ACTUALLY PASSES THE AGE ──────────────────────────────────────
//
// The filter is opt in: friendOfTheDay(now, key) with no third argument keeps
// the old behaviour on purpose, so the dev harness is unaffected. That makes
// Home the single place this can silently regress.
const fotd = readFileSync(new URL('../lib/pathway/friend-of-the-day.ts', import.meta.url), 'utf8')
check(
  'the rotation narrows the pool before picking',
  /readyServices\(familyDays\)/.test(fotd),
  'the rule is useless if the picker ignores it',
)
check(
  'and picks from that pool, not the full list',
  /pool\.length/.test(fotd) && /pool\[serviceIndex\]/.test(fotd),
)

const home = readFileSync(new URL('../app/(dashboard)/dashboard/page.tsx', import.meta.url), 'utf8')
check(
  'Home works out how old the family is',
  /familyDays/.test(home),
)
check(
  'and hands it to the rotation',
  /friendOfTheDay\([\s\S]{0,80}?familyDays\s*\)/.test(home),
  'without it the gate does nothing at all',
)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
