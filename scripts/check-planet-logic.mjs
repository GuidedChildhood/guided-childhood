// The Planet Friends rules, checked against the design.
//
// lib/planet/logic.ts is pure and import free so it can run here under
// node's type stripping with no build. Every rule in
// plans/planet-friends-architecture.md section 3.1, 3.3 and 5 that can be
// stated as a number is stated here, so a change to the toy that breaks
// the loop fails before it reaches a child.
//
// Usage: node --experimental-strip-types scripts/check-planet-logic.mjs

import assert from 'node:assert/strict'
import {
  TIERS, GROWTH, SLEEPY_AT, TICK_CAP_SECONDS, ACTIVE_BY_TIER, FRIEND_MIN_AGE, BOARD_SIZE,
  tierFor, childAgeFor, isGrownUp, newHome, applyEvent, reconcile, moodOf, restOverlay, bedtimePhase, nightKeyFor, minutesLeft, addMinutes, boardFor,
  PICTURE_TOKENS, CODE_WORDS, codeModeFor, makeCode, withChildAnswers,
} from '../lib/planet/logic.ts'

// The mission mechanics, stated here rather than imported from the registry
// so this file stays free of app imports.
const DEFS = {
  plant_seed: { key: 'plant_seed', tiers: [1, 2], proof: 'grownup_tap', reward: 'dome' },
  leaf_walk: { key: 'leaf_walk', tiers: [1, 2], proof: 'grownup_tap', reward: 'flag' },
  stretch: { key: 'stretch', tiers: [1, 2], proof: 'timer', timerMinutes: 5, reward: 'ring' },
  water_plant: { key: 'water_plant', tiers: [1, 2], proof: 'grownup_tap', reward: 'pool' },
  spider_legs: { key: 'spider_legs', tiers: [2], proof: 'code', answer: ['8'], reward: 'moon' },
  do_lesson: { key: 'do_lesson', tiers: [2], proof: 'lesson', reward: 'star' },
  moonflower_card: { key: 'moonflower_card', tiers: [2, 3], proof: 'code', perChild: true, reward: 'moonflower' },
}

const T0 = '2026-09-02T15:00:00.000Z'
const at = (min) => addMinutes(T0, min)
let passed = 0
const check = (name, f) => { f(); passed += 1; console.log(`ok    ${name}`) }

check('age and tier from date of birth: 3 to 5 is Tier 1, 6 to 9 Tier 2, 10 plus Tier 3; a band reads as its floor', () => {
  const now = new Date('2026-09-02T12:00:00Z')
  assert.equal(childAgeFor('2023-01-15', null, now), 3)
  assert.equal(tierFor('2023-01-15', null, now), 1)
  assert.equal(tierFor('2020-09-03', null, now), 1)   // turns six tomorrow
  assert.equal(tierFor('2020-09-02', null, now), 2)   // six today
  assert.equal(tierFor('2016-09-01', null, now), 3)
  assert.equal(childAgeFor(null, '8-10', now), 8)
  assert.equal(tierFor(null, '4-7', now), 1)
  assert.equal(tierFor(null, '8-10', now), 2)
  assert.equal(tierFor(null, '11-13', now), 3)
})

check('the cast is babies until the child reaches each Friend\'s age, then grows up alongside them', () => {
  assert.equal(isGrownUp('pebble', 3), false)
  assert.equal(isGrownUp('pebble', 4), true)
  assert.equal(isGrownUp('bloop', 7), false)
  assert.equal(isGrownUp('bloop', 8), true)
  assert.equal(isGrownUp('cosmo', 15), false)
  assert.equal(isGrownUp('cosmo', 16), true)
  assert.deepEqual(Object.values(FRIEND_MIN_AGE), [4, 8, 11, 13, 16])
  assert.deepEqual(ACTIVE_BY_TIER[1], ['pebble'])
  assert.deepEqual(ACTIVE_BY_TIER[2], ['pebble', 'bloop'])
})

check('a new planet owes nothing: full starlight, stage 1, the passed night already applied', () => {
  const h = newHome(1, T0, '2026-09-02')
  assert.equal(h.friends.length, 1)
  assert.equal(h.friends[0].energy, 100)
  assert.equal(h.growthStage, 1)
  assert.equal(h.lastNightAppliedOn, '2026-09-02')
  assert.deepEqual(reconcile(h, T0, '2026-09-02'), h)
})

check('play drains starlight: a Tier 1 Friend is sleepy after 12 minutes and drained at 15', () => {
  let h = newHome(1, T0, null)
  for (let m = 1; m <= 12; m++) h = applyEvent(h, { kind: 'tick' }, at(m))
  assert.equal(moodOf(h.friends[0]), 'sleepy')
  assert.ok(h.friends[0].energy <= SLEEPY_AT && h.friends[0].energy > 0)
  for (let m = 13; m <= 15; m++) h = applyEvent(h, { kind: 'tick' }, at(m))
  assert.equal(h.friends[0].energy, 0)
  assert.equal(moodOf(h.friends[0]), 'tired')
})

check('a tick drains at most the cap, so a child who was away is not drained for the absence', () => {
  let h = newHome(1, T0, null)
  h = applyEvent(h, { kind: 'tick' }, at(60))
  const perSecond = 100 / TIERS[1].playMinutes / 60
  assert.ok(Math.abs(h.friends[0].energy - (100 - TICK_CAP_SECONDS * perSecond)) < 0.05)
  const r = reconcile(h, at(200), null)
  assert.equal(r.energyTickedAt, at(200))
  assert.equal(r.friends[0].energy, h.friends[0].energy)
})

check('a Tier 2 cloud slows the drain by a fifth, a Tier 1 cloud does nothing', () => {
  let a = newHome(2, T0, null)
  a = applyEvent(a, { kind: 'cloud', friend: 'pebble', on: true }, T0)
  a = applyEvent(a, { kind: 'tick' }, at(1))
  const shaded = 100 - a.friends[0].energy, open = 100 - a.friends[1].energy
  assert.ok(Math.abs(shaded / open - 0.8) < 0.01)
  let b = newHome(1, T0, null)
  b = applyEvent(b, { kind: 'cloud', friend: 'pebble', on: true }, T0)
  b = applyEvent(b, { kind: 'tick' }, at(1))
  assert.ok(Math.abs((100 - b.friends[0].energy) - 100 / 15) < 0.01)
})

check('the pod: fifteen real minutes, the planet rests, growth lands on the planet only when it closes', () => {
  let h = newHome(1, T0, null)
  h = applyEvent(h, { kind: 'nap_start', friend: 'pebble' }, T0)
  assert.equal(h.friends[0].cooldown.reason, 'nap')
  assert.equal(h.friends[0].cooldown.endsAt, at(15))
  assert.equal(moodOf(h.friends[0]), 'asleep')
  assert.equal(restOverlay(h), 'pods')
  assert.equal(minutesLeft(h.friends[0].cooldown, at(6)), 9)
  const during = applyEvent(h, { kind: 'tick' }, at(5))
  assert.equal(during.friends[0].energy, 100)
  assert.equal(reconcile(h, at(14), null).friends[0].cooldown.reason, 'nap')
  const done = reconcile(h, at(15), null)
  assert.equal(done.friends[0].cooldown, null)
  assert.equal(done.growthProgress, GROWTH.nap)
  assert.equal(done.grewWhileAway, GROWTH.nap)
  assert.equal(done.friends[0].energy, 100)
})

check('a grown up yes wakes the Friends early and pays by the minutes slept', () => {
  let h = newHome(1, T0, null)
  h = applyEvent(h, { kind: 'nap_start', friend: 'pebble' }, T0)
  h = applyEvent(h, { kind: 'wake_all' }, at(6))
  assert.equal(h.friends[0].cooldown, null)
  assert.equal(h.friends[0].energy, 100)
  assert.equal(h.growthProgress, Math.round(GROWTH.nap * 6 / 15))
})

check('real sunshine: three minutes; the slow orbit: fifteen; and only a drained Friend rests by itself', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'sunlight_start', friend: 'pebble' }, T0)
  assert.equal(h.friends[0].cooldown.endsAt, at(3))
  assert.equal(moodOf(h.friends[0]), 'sunbathing')
  h = applyEvent(h, { kind: 'ambient_start', friend: 'bloop' }, T0)
  assert.equal(h.friends[1].cooldown, null)
  for (let m = 1; m <= 20; m++) h = applyEvent(h, { kind: 'tick' }, at(m))
  assert.equal(h.friends[1].energy, 0)
  h = applyEvent(h, { kind: 'ambient_start', friend: 'bloop' }, at(20))
  assert.equal(h.friends[1].cooldown.reason, 'ambient')
  assert.equal(h.friends[1].cooldown.endsAt, at(35))
  const both = reconcile(h, at(21), null)
  assert.equal(both.friends[0].cooldown, null)
  assert.equal(restOverlay(both), null)
  const bothResting = applyEvent(both, { kind: 'nap_start', friend: 'pebble' }, at(21))
  assert.equal(restOverlay(bothResting), 'orbit')
})

check('the planet grows through its stages and stops at the moon', () => {
  let h = newHome(1, T0, null)
  for (let i = 0; i < 30; i++) {
    h = applyEvent(h, { kind: 'nap_start', friend: 'pebble' }, at(i * 20))
    h = reconcile(h, at(i * 20 + 15), null)
  }
  assert.equal(h.growthStage, 5)
  assert.equal(h.growthProgress, 0)
})

check('the night lands once per London date, never twice, never for a planet that did not exist', () => {
  let h = newHome(1, T0, '2026-09-02')
  h = reconcile(h, at(60), '2026-09-02')
  assert.equal(h.growthProgress, 0)
  h = reconcile(h, at(16 * 60), '2026-09-03')
  assert.equal(h.growthProgress, GROWTH.night)
  assert.equal(h.lastNightAppliedOn, '2026-09-03')
  h = reconcile(h, at(17 * 60), '2026-09-03')
  assert.equal(h.growthProgress, GROWTH.night)
  assert.equal(h.friends[0].energy, 100)
})

check('bedtime phase: wind down thirty minutes before, bedtime across midnight, day otherwise, no window at 16 plus', () => {
  const start = 19 * 60, end = 7 * 60
  assert.equal(bedtimePhase(12 * 60, start, end), 'day')
  assert.equal(bedtimePhase(18 * 60 + 29, start, end), 'day')
  assert.equal(bedtimePhase(18 * 60 + 30, start, end), 'winddown')
  assert.equal(bedtimePhase(19 * 60, start, end), 'bedtime')
  assert.equal(bedtimePhase(0, start, end), 'bedtime')
  assert.equal(bedtimePhase(6 * 60 + 59, start, end), 'bedtime')
  assert.equal(bedtimePhase(7 * 60, start, end), 'day')
  assert.equal(bedtimePhase(3 * 60, null, null), 'day')
})

check('the night key is today once the window has ended, yesterday before that, none without a window', () => {
  assert.equal(nightKeyFor('2026-09-02', 8 * 60, 7 * 60), '2026-09-02')
  assert.equal(nightKeyFor('2026-09-02', 6 * 60, 7 * 60), '2026-09-01')
  assert.equal(nightKeyFor('2026-03-01', 1, 7 * 60), '2026-02-28')
  assert.equal(nightKeyFor('2026-09-02', 8 * 60, null), null)
})

check('the board: one mission at Tier 1, three at Tier 2, missions under way first, landed ones gone', () => {
  const defs = Object.values(DEFS)
  let h1 = newHome(1, T0, null)
  assert.equal(boardFor(h1, defs).length, BOARD_SIZE[1])
  assert.equal(boardFor(h1, defs).length, 1)
  let h2 = newHome(2, T0, null)
  assert.deepEqual(boardFor(h2, defs), ['plant_seed', 'leaf_walk', 'stretch'])
  h2 = applyEvent(h2, { kind: 'mission_start', key: 'stretch' }, T0, DEFS)
  assert.equal(boardFor(h2, defs)[0], 'stretch')
  h2 = applyEvent(h2, { kind: 'mission_start', key: 'plant_seed' }, T0, DEFS)
  h2 = applyEvent(h2, { kind: 'mission_claim', key: 'plant_seed' }, at(1), DEFS)
  h2 = applyEvent(h2, { kind: 'mission_approve', key: 'plant_seed' }, at(2), DEFS)
  h2 = applyEvent(h2, { kind: 'mission_seen', key: 'plant_seed' }, at(3), DEFS)
  assert.ok(!boardFor(h2, defs).includes('plant_seed'))
  assert.equal(boardFor(h2, defs).length, 3)
  // A Tier 1 planet never sees a Tier 2 mission.
  h1 = applyEvent(h1, { kind: 'mission_start', key: 'spider_legs' }, T0, DEFS)
  assert.equal(h1.missions.length, 0)
})

check('a timer mission lands only when the real minutes are up, and pays its reward once', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'stretch' }, T0, DEFS)
  assert.equal(h.missions[0].timerEndsAt, at(5))
  h = applyEvent(h, { kind: 'mission_claim', key: 'stretch' }, at(3), DEFS)
  assert.equal(h.missions[0].status, 'doing')
  h = applyEvent(h, { kind: 'mission_claim', key: 'stretch' }, at(5), DEFS)
  assert.equal(h.missions[0].status, 'approved')
  assert.deepEqual(h.rewards, ['ring'])
  h = applyEvent(h, { kind: 'mission_seen', key: 'stretch' }, at(6), DEFS)
  assert.equal(h.missions[0].status, 'done')
  assert.deepEqual(h.rewards, ['ring'])
})

check('a code mission lands on the right answer and stays put on a wrong one, with no count of tries', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'spider_legs' }, T0, DEFS)
  h = applyEvent(h, { kind: 'mission_claim', key: 'spider_legs', code: ['7'] }, at(1), DEFS)
  assert.equal(h.missions[0].status, 'doing')
  h = applyEvent(h, { kind: 'mission_claim', key: 'spider_legs', code: ['8'] }, at(2), DEFS)
  assert.equal(h.missions[0].status, 'approved')
  assert.deepEqual(h.rewards, ['moon'])
})

check('a grown up mission waits as claimed, a yes lands it, a not now puts it back on the board', () => {
  let h = newHome(1, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'leaf_walk' }, T0, DEFS)
  h = applyEvent(h, { kind: 'mission_claim', key: 'leaf_walk' }, at(1), DEFS)
  assert.equal(h.missions[0].status, 'claimed')
  const no = applyEvent(h, { kind: 'mission_notnow', key: 'leaf_walk' }, at(2), DEFS)
  assert.equal(no.missions[0].status, 'notnow')
  assert.deepEqual(no.rewards, [])
  const again = applyEvent(no, { kind: 'mission_start', key: 'leaf_walk' }, at(3), DEFS)
  assert.equal(again.missions[0].status, 'doing')
  const yes = applyEvent(h, { kind: 'mission_approve', key: 'leaf_walk' }, at(2), DEFS)
  assert.equal(yes.missions[0].status, 'approved')
  assert.deepEqual(yes.rewards, ['flag'])
})

check('a planet saved before the missions existed is filled in, not broken', () => {
  const old = { ...newHome(1, T0, null) }
  delete old.missions
  delete old.rewards
  const fixed = reconcile(old, T0, null)
  assert.deepEqual(fixed.missions, [])
  assert.deepEqual(fixed.rewards, [])
})

check('a code card: pictures before 8 and letters from 8, three different pictures or one real word', () => {
  assert.equal(codeModeFor(7), 'pictures')
  assert.equal(codeModeFor(8), 'letters')
  const pick = (n) => (n * 7 + 3) % n
  const pics = makeCode('pictures', pick)
  assert.equal(pics.length, 3)
  assert.equal(new Set(pics).size, 3)
  for (const t of pics) assert.ok(PICTURE_TOKENS.includes(t))
  const word = makeCode('letters', pick)
  assert.equal(word.length, 4)
  assert.ok(CODE_WORDS.includes(word.join('')))
})

check('a card mission lands only with the answer the server made for this child, and stays put without one', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'moonflower_card' }, T0, DEFS)
  // No card printed yet: nothing to check against, so nothing lands.
  const none = applyEvent(h, { kind: 'mission_claim', key: 'moonflower_card', code: ['star', 'moon', 'rocket'] }, at(1), DEFS)
  assert.equal(none.missions.find(m => m.key === 'moonflower_card').status, 'doing')
  const defs = withChildAnswers(DEFS, { moonflower_card: ['star', 'moon', 'rocket'], stretch: ['x'] })
  assert.equal(defs.stretch.answer, undefined, 'only a card mission takes a child answer')
  const wrong = applyEvent(h, { kind: 'mission_claim', key: 'moonflower_card', code: ['moon', 'star', 'rocket'] }, at(1), defs)
  assert.equal(wrong.missions.find(m => m.key === 'moonflower_card').status, 'doing')
  const right = applyEvent(h, { kind: 'mission_claim', key: 'moonflower_card', code: ['star', 'moon', 'rocket'] }, at(1), defs)
  assert.equal(right.missions.find(m => m.key === 'moonflower_card').status, 'approved')
  assert.ok(right.rewards.includes('moonflower'))
})

console.log(`\nPASS  ${passed} checks. The loop ends itself, the planet grows while the child is away, the cast grows up with them, and the night lands once.`)
