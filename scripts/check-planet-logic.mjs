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
  STARTER_PARTS, STARTER_OUTFITS, PLOTS_BY_STAGE, plotsFor, boxParts, boxOutfits, grow,
  PHOTOS_MAX, whereIs, atHome, drainMultiplier, charging, batteryNow, dockAllDevices,
  PLANET_ORDER, PLANETS, planetOf, landingRoom, planetOpen, openPlanets, newPlanets, lessonsToNextPlanet, lessonsToOpen, orbitAngle, planetSign, shownPlanets, keyTurned,
  isSelf, isWhere, SELF_SKINS, SELF_HAIRS, SELF_HAIR_COLOURS, SELF_SUITS,
} from '../lib/planet/logic.ts'

// The mission mechanics, stated here rather than imported from the registry
// so this file stays free of app imports.
const DEFS = {
  plant_seed: { key: 'plant_seed', tiers: [1, 2], proof: 'grownup_tap', reward: 'rocket' },
  leaf_walk: { key: 'leaf_walk', tiers: [1, 2], proof: 'grownup_tap', reward: 'rover' },
  stretch: { key: 'stretch', tiers: [1, 2], proof: 'timer', timerMinutes: 5, reward: 'swing' },
  water_plant: { key: 'water_plant', tiers: [1, 2], proof: 'grownup_tap', reward: 'trampoline' },
  spider_legs: { key: 'spider_legs', tiers: [2], proof: 'code', answer: ['8'], reward: 'moon' },
  do_lesson: { key: 'do_lesson', tiers: [2], proof: 'lesson', reward: 'dish' },
  comet_card: { key: 'comet_card', tiers: [2, 3], proof: 'code', perChild: true, reward: 'comet' },
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
  assert.deepEqual(h.rewards.filter(r => !STARTER_PARTS.includes(r)), ['swing'])
  h = applyEvent(h, { kind: 'mission_seen', key: 'stretch' }, at(6), DEFS)
  assert.equal(h.missions[0].status, 'done')
  assert.deepEqual(h.rewards.filter(r => !STARTER_PARTS.includes(r)), ['swing'])
})

check('a code mission lands on the right answer and stays put on a wrong one, with no count of tries', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'spider_legs' }, T0, DEFS)
  h = applyEvent(h, { kind: 'mission_claim', key: 'spider_legs', code: ['7'] }, at(1), DEFS)
  assert.equal(h.missions[0].status, 'doing')
  h = applyEvent(h, { kind: 'mission_claim', key: 'spider_legs', code: ['8'] }, at(2), DEFS)
  assert.equal(h.missions[0].status, 'approved')
  assert.deepEqual(h.rewards.filter(r => !STARTER_PARTS.includes(r)), ['moon'])
})

check('a grown up mission waits as claimed, a yes lands it, a not now puts it back on the board', () => {
  let h = newHome(1, T0, null)
  h = applyEvent(h, { kind: 'mission_start', key: 'leaf_walk' }, T0, DEFS)
  h = applyEvent(h, { kind: 'mission_claim', key: 'leaf_walk' }, at(1), DEFS)
  assert.equal(h.missions[0].status, 'claimed')
  const no = applyEvent(h, { kind: 'mission_notnow', key: 'leaf_walk' }, at(2), DEFS)
  assert.equal(no.missions[0].status, 'notnow')
  assert.deepEqual(no.rewards.filter(r => !STARTER_PARTS.includes(r)), [])
  const again = applyEvent(no, { kind: 'mission_start', key: 'leaf_walk' }, at(3), DEFS)
  assert.equal(again.missions[0].status, 'doing')
  const yes = applyEvent(h, { kind: 'mission_approve', key: 'leaf_walk' }, at(2), DEFS)
  assert.equal(yes.missions[0].status, 'approved')
  assert.deepEqual(yes.rewards.filter(r => !STARTER_PARTS.includes(r)), ['rover'])
})

check('a planet saved before the missions existed is filled in, not broken', () => {
  const old = { ...newHome(1, T0, null) }
  delete old.missions
  delete old.rewards
  const fixed = reconcile(old, T0, null)
  assert.deepEqual(fixed.missions, [])
  assert.deepEqual(fixed.rewards.filter(r => !STARTER_PARTS.includes(r)), [])
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
  h = applyEvent(h, { kind: 'mission_start', key: 'comet_card' }, T0, DEFS)
  // No card printed yet: nothing to check against, so nothing lands.
  const none = applyEvent(h, { kind: 'mission_claim', key: 'comet_card', code: ['star', 'moon', 'rocket'] }, at(1), DEFS)
  assert.equal(none.missions.find(m => m.key === 'comet_card').status, 'doing')
  const defs = withChildAnswers(DEFS, { comet_card: ['star', 'moon', 'rocket'], stretch: ['x'] })
  assert.equal(defs.stretch.answer, undefined, 'only a card mission takes a child answer')
  const wrong = applyEvent(h, { kind: 'mission_claim', key: 'comet_card', code: ['moon', 'star', 'rocket'] }, at(1), defs)
  assert.equal(wrong.missions.find(m => m.key === 'comet_card').status, 'doing')
  const right = applyEvent(h, { kind: 'mission_claim', key: 'comet_card', code: ['star', 'moon', 'rocket'] }, at(1), defs)
  assert.equal(right.missions.find(m => m.key === 'comet_card').status, 'approved')
  assert.ok(right.rewards.includes('comet'))
})

check('a new planet has the starters in its box, and a saved one from before the build gets them too', () => {
  const h = newHome(1, T0, null)
  assert.deepEqual(boxParts(h), STARTER_PARTS)
  assert.deepEqual(boxOutfits(h), STARTER_OUTFITS)
  const old = { ...newHome(2, T0, null), rewards: ['dome', 'flag', 'moon'] }
  delete old.build
  const fixed = reconcile(old, T0, null)
  assert.deepEqual(fixed.rewards, ['bench', 'lamp', 'flag', 'moon'], 'the garden is let go, the starters arrive, what was earned stays')
  assert.deepEqual(fixed.build.placed, [])
})

check('a part goes only where it belongs, once, on a free slot, inside the plots', () => {
  let h = { ...newHome(1, T0, null), growthStage: 0 }
  assert.equal(plotsFor(0), 3)
  assert.equal(plotsFor(9), PLOTS_BY_STAGE[5])
  const same = applyEvent(h, { kind: 'part_place', part: 'flag', slot: 'sky1' }, T0)
  assert.equal(same.build.placed.length, 0, 'a flag does not go in the sky')
  const notOwned = applyEvent(h, { kind: 'part_place', part: 'rocket', slot: 'g1' }, T0)
  assert.equal(notOwned.build.placed.length, 0, 'a part not in the box cannot be placed')
  h = applyEvent(h, { kind: 'part_place', part: 'flag', slot: 'g1' }, T0)
  assert.deepEqual(h.build.placed, [{ part: 'flag', slot: 'g1' }])
  const twice = applyEvent(h, { kind: 'part_place', part: 'flag', slot: 'g2' }, T0)
  assert.equal(twice.build.placed.length, 1, 'a part is on the planet once')
  const taken = applyEvent(h, { kind: 'part_place', part: 'bench', slot: 'g1' }, T0)
  assert.equal(taken.build.placed.length, 1, 'a slot holds one part')
  h = applyEvent(h, { kind: 'part_place', part: 'bench', slot: 'g2' }, T0)
  h = applyEvent(h, { kind: 'part_place', part: 'lamp', slot: 'g3' }, T0)
  h = { ...h, rewards: [...h.rewards, 'rocket'] }
  const full = applyEvent(h, { kind: 'part_place', part: 'rocket', slot: 'g4' }, T0)
  assert.equal(full.build.placed.length, 3, 'bare rock has room for three')
  const moved = applyEvent(h, { kind: 'part_move', part: 'flag', slot: 'g5' }, T0)
  assert.equal(moved.build.placed.find(p => p.part === 'flag').slot, 'g5')
  const back = applyEvent(moved, { kind: 'part_remove', part: 'flag' }, T0)
  assert.equal(back.build.placed.length, 2)
  assert.ok(boxParts(back).includes('flag'), 'a part taken off is back in the box')
})

check('an outfit has one wearer, a Friend wears one, and growth drops its gifts in the box', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'outfit_set', friend: 'pebble', outfit: 'party_hat' }, T0)
  assert.equal(h.build.wearing.pebble, 'party_hat')
  const notOwned = applyEvent(h, { kind: 'outfit_set', friend: 'bloop', outfit: 'crown' }, T0)
  assert.equal(notOwned.build.wearing.bloop, undefined, 'a crown not yet earned cannot be worn')
  h = applyEvent(h, { kind: 'outfit_set', friend: 'bloop', outfit: 'party_hat' }, T0)
  assert.equal(h.build.wearing.bloop, 'party_hat')
  assert.equal(h.build.wearing.pebble, undefined, 'the hat moved to Bloop')
  h = applyEvent(h, { kind: 'outfit_set', friend: 'bloop', outfit: null }, T0)
  assert.equal(h.build.wearing.bloop, undefined)
  const grown = grow({ ...h, growthStage: 1, growthProgress: 90 }, 220)
  assert.equal(grown.growthStage, 4)
  assert.ok(grown.rewards.includes('star') && grown.rewards.includes('ring'), 'stages 2 and 3 gave the star and the ring')
  assert.ok(grown.build.outfits.includes('cape'), 'stage 4 gave the cape')
  assert.ok(!grown.build.outfits.includes('crown'), 'the crown waits for the moon')
})


// ── The Den (slice 3a) ───────────────────────────────────────────────────────

check('the Den: a fresh world puts every phone full on the shelf, nobody holding anything, everyone outdoors, the fridge full', () => {
  const h = newHome(2, T0, null)
  assert.deepEqual(Object.keys(h.world.devices).sort(), ['phone_bloop', 'phone_pebble'])
  assert.equal(h.world.devices.phone_pebble.at, 'shelf')
  assert.equal(h.world.devices.phone_pebble.battery, 100)
  assert.deepEqual(h.world.held, {})
  assert.equal(whereIs(h, 'pebble'), 'outdoors')
  assert.deepEqual(atHome(h, 'fridge'), ['apple', 'toast', 'juice', 'cake'])
  assert.deepEqual(atHome(h, 'toybox'), ['teddy', 'ball', 'book'])
  const { world: _w, ...old } = h
  void _w
  const fixed = reconcile(old, T0, null)
  assert.equal(fixed.world.devices.phone_pebble.at, 'shelf', 'a save from before the Den gets a world')
  const joined = reconcile({ ...h, friends: [...h.friends, { key: 'orbit', energy: 100, cooldown: null, cloud: false }] }, T0, null)
  assert.equal(joined.world.devices.phone_orbit.at, 'shelf', 'a Friend who joins later gets a phone')
})

check('a Friend walks room to room, never while resting, and nowhere that is not a room', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'kitchen' }, T0)
  assert.equal(whereIs(h, 'pebble'), 'kitchen')
  assert.equal(whereIs(h, 'bloop'), 'outdoors')
  const nowhere = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'attic' }, T0)
  assert.equal(whereIs(nowhere, 'pebble'), 'kitchen')
  const napping = applyEvent(h, { kind: 'nap_start', friend: 'pebble' }, T0)
  const stuck = applyEvent(napping, { kind: 'room_move', friend: 'pebble', where: 'bedroom' }, T0)
  assert.equal(whereIs(stuck, 'pebble'), 'kitchen', 'a resting Friend stays put')
  const out = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'outdoors' }, T0)
  assert.equal(whereIs(out, 'pebble'), 'outdoors')
})

check('a thing is in exactly one place: a spot of its zone, a hand, or where it lives', () => {
  let h = newHome(2, T0, null)
  const onFloor = applyEvent(h, { kind: 'thing_place', thing: 'apple', room: 'kitchen', spot: 'k_f1' }, T0)
  assert.equal(onFloor.world.placed.length, 0, 'food goes on a table, not the floor')
  h = applyEvent(h, { kind: 'thing_place', thing: 'apple', room: 'kitchen', spot: 'k_t1' }, T0)
  assert.deepEqual(h.world.placed, [{ thing: 'apple', room: 'kitchen', spot: 'k_t1' }])
  assert.ok(!atHome(h, 'fridge').includes('apple'), 'the apple left the fridge')
  const taken = applyEvent(h, { kind: 'thing_place', thing: 'toast', room: 'kitchen', spot: 'k_t1' }, T0)
  assert.equal(taken.world.placed.length, 1, 'a spot holds one thing')
  h = applyEvent(h, { kind: 'thing_place', thing: 'apple', room: 'living', spot: 'l_t1' }, T0)
  assert.equal(h.world.placed.length, 1, 'moving a thing moves it')
  assert.equal(h.world.placed[0].room, 'living')
  h = applyEvent(h, { kind: 'thing_home', thing: 'apple' }, T0)
  assert.equal(h.world.placed.length, 0)
  assert.ok(atHome(h, 'fridge').includes('apple'), 'back in the fridge')
  h = applyEvent(h, { kind: 'thing_place', thing: 'flag', room: 'kitchen', spot: 'k_f1' }, T0)
  assert.equal(h.world.placed.length, 1, 'a part comes indoors from the box')
  assert.ok(!boxParts(h).includes('flag'), 'a part in a room is not in the box')
  const outside = applyEvent(h, { kind: 'part_place', part: 'flag', slot: 'g1' }, T0)
  assert.equal(outside.build.placed.length, 0, 'a part in the kitchen is not on the planet too')
  const ringIn = applyEvent({ ...h, rewards: [...h.rewards, 'ring'] }, { kind: 'thing_place', thing: 'ring', room: 'living', spot: 'l_w1' }, T0)
  assert.equal(ringIn.world.placed.length, 1, 'the ring stays outside')
  const star = applyEvent({ ...h, rewards: [...h.rewards, 'star'] }, { kind: 'thing_place', thing: 'star', room: 'bedroom', spot: 'b_w1' }, T0)
  assert.equal(star.world.placed.length, 2, 'a sky part hangs on a wall')
  const homeAgain = applyEvent(star, { kind: 'thing_home', thing: 'flag' }, T0)
  assert.ok(boxParts(homeAgain).includes('flag'), 'a part taken off a room spot is back in the box')
})

check('food is given, eaten in the hand and gone until the fridge restocks tomorrow', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'thing_give', thing: 'cake', friend: 'pebble' }, T0)
  assert.equal(h.world.held.pebble, 'cake')
  h = applyEvent(h, { kind: 'thing_give', thing: 'apple', friend: 'pebble' }, T0)
  assert.equal(h.world.held.pebble, 'apple', 'one thing per hand')
  assert.ok(atHome(h, 'fridge').includes('cake'), 'the cake went back to the fridge')
  const nothing = applyEvent(h, { kind: 'eat', friend: 'bloop' }, T0)
  assert.equal(nothing.world.eaten.apple, undefined, 'Bloop has nothing to eat')
  h = applyEvent(h, { kind: 'eat', friend: 'pebble' }, T0)
  assert.equal(h.world.held.pebble, undefined)
  assert.equal(h.world.eaten.apple, '2026-09-02')
  assert.ok(!atHome(h, 'fridge').includes('apple'), 'eaten is gone')
  const again = applyEvent(h, { kind: 'thing_give', thing: 'apple', friend: 'pebble' }, T0)
  assert.equal(again.world.held.pebble, undefined, 'an eaten apple cannot be given')
  const resting = applyEvent(applyEvent(h, { kind: 'thing_give', thing: 'teddy', friend: 'bloop' }, T0), { kind: 'nap_start', friend: 'bloop' }, T0)
  assert.equal(resting.world.held.bloop, undefined, 'a Friend puts its teddy away before a rest')
  assert.ok(atHome(resting, 'toybox').includes('teddy'))
  const tomorrow = reconcile(h, addMinutes(T0, 24 * 60), null)
  assert.ok(atHome(tomorrow, 'fridge').includes('apple'), 'the fridge restocks the next day')
})

check('the MoonPhone: its owner takes it, photos fill the gallery, the hand drains double, flat means the shelf', () => {
  let h = newHome(2, T0, null)
  const wrong = applyEvent(h, { kind: 'thing_give', thing: 'phone_bloop', friend: 'pebble' }, T0)
  assert.equal(wrong.world.held.pebble, undefined, 'a phone goes only to its owner')
  h = applyEvent(h, { kind: 'thing_give', thing: 'phone_pebble', friend: 'pebble' }, T0)
  assert.equal(h.world.held.pebble, 'phone_pebble')
  assert.equal(h.world.devices.phone_pebble.at, 'hand')
  assert.equal(drainMultiplier(h, 'pebble'), 2)
  assert.equal(drainMultiplier(h, 'bloop'), 1)
  for (let i = 0; i < 8; i++) h = applyEvent(h, { kind: 'snap', friend: 'pebble' }, T0)
  assert.equal(h.world.devices.phone_pebble.photos, PHOTOS_MAX, 'six frames, then full')
  const t1 = applyEvent(h, { kind: 'tick' }, at(1))
  const pebble = t1.friends.find(f => f.key === 'pebble'), bloop = t1.friends.find(f => f.key === 'bloop')
  assert.equal(Math.round((100 - pebble.energy) * 100) / 100, 10, 'Tier 2: 5 a minute, doubled in the hand')
  assert.equal(Math.round((100 - bloop.energy) * 100) / 100, 5)
  assert.equal(t1.world.devices.phone_pebble.battery, 95, 'the battery runs down at the base rate')
  let flat = { ...h, world: { ...h.world, devices: { ...h.world.devices, phone_pebble: { ...h.world.devices.phone_pebble, battery: 2 } } } }
  flat = applyEvent(flat, { kind: 'tick' }, at(1))
  assert.equal(flat.world.devices.phone_pebble.at, 'shelf', 'flat: on the shelf by itself')
  assert.equal(flat.world.held.pebble, undefined)
  assert.equal(flat.world.devices.phone_pebble.chargedAt, at(6), 'five real minutes')
  assert.ok(charging(flat.world.devices.phone_pebble, at(2)))
  const early = applyEvent(flat, { kind: 'thing_give', thing: 'phone_pebble', friend: 'pebble' }, at(2))
  assert.equal(early.world.held.pebble, undefined, 'still charging: nobody can pick it up')
  assert.equal(batteryNow(flat.world.devices.phone_pebble, at(1)), 0)
  assert.equal(batteryNow(flat.world.devices.phone_pebble, at(3.5)), 50)
  const done = reconcile(flat, at(6), null)
  assert.equal(done.world.devices.phone_pebble.battery, 100)
  assert.equal(done.world.devices.phone_pebble.chargedAt, null)
  assert.equal(done.world.devices.phone_pebble.photos, 0, 'a full charge clears the gallery')
  const later = applyEvent(done, { kind: 'thing_give', thing: 'phone_pebble', friend: 'pebble' }, at(6))
  assert.equal(later.world.held.pebble, 'phone_pebble')
})

check('a sleepy Friend, a rest, and the wind down all put the phone on the shelf by themselves', () => {
  let h = newHome(2, T0, null)
  h = applyEvent(h, { kind: 'thing_give', thing: 'phone_pebble', friend: 'pebble' }, T0)
  h = applyEvent(h, { kind: 'thing_give', thing: 'phone_bloop', friend: 'bloop' }, T0)
  let sleepy = { ...h, friends: h.friends.map(f => (f.key === 'pebble' ? { ...f, energy: SLEEPY_AT + 5 } : f)) }
  sleepy = applyEvent(sleepy, { kind: 'tick' }, at(1))
  assert.equal(sleepy.world.devices.phone_pebble.at, 'shelf', 'sleepy Pebble put the phone away')
  assert.equal(sleepy.world.devices.phone_bloop.at, 'hand', 'Bloop is still playing')
  const napped = applyEvent(h, { kind: 'nap_start', friend: 'bloop' }, T0)
  assert.equal(napped.world.devices.phone_bloop.at, 'shelf', 'into the pod means the phone on the shelf first')
  assert.ok(napped.friends.find(f => f.key === 'bloop').cooldown)
  const evening = dockAllDevices(h, T0)
  assert.equal(evening.world.devices.phone_pebble.at, 'shelf')
  assert.equal(evening.world.devices.phone_bloop.at, 'shelf')
  assert.deepEqual(evening.world.held, {})
  assert.equal(evening.world.devices.phone_pebble.chargedAt, null, 'a full phone needs no charge')
  const table = applyEvent(h, { kind: 'thing_place', thing: 'phone_pebble', room: 'kitchen', spot: 'k_t1' }, T0)
  assert.equal(table.world.devices.phone_pebble.at, 'placed', 'a phone can be put down on a table')
  assert.equal(table.world.held.pebble, undefined)
  const docked = applyEvent(table, { kind: 'device_dock', device: 'phone_pebble' }, T0)
  assert.equal(docked.world.placed.length, 0)
  assert.equal(docked.world.devices.phone_pebble.at, 'shelf')
})


// ── The star system (slice 3b) ───────────────────────────────────────────────

check('the whole catalogue orbits: every planet of design 7.5, and only a planet with rooms can open', () => {
  let h = newHome(2, T0, null)
  assert.deepEqual(PLANET_ORDER, ['home', 'school', 'playground', 'port', 'wild', 'observatory', 'cafe', 'starnet', 'ice', 'volcano', 'rainbow'])
  assert.equal(shownPlanets(h).length, 11, 'Tier 2 sees the whole catalogue')
  assert.equal(shownPlanets(newHome(1, T0, null)).length, 9, 'Tier 1 has no Star Cafe and no StarNet')
  assert.deepEqual(openPlanets(h), ['home'], 'a new planet has the home planet only')
  assert.ok(keyTurned(h, { kind: 'stage', stage: 1 }), 'the Space Port key is turned from the start')
  assert.equal(planetOpen(h, 'port'), false, 'but with no rooms drawn it stays a far away one')
  assert.equal(planetSign('port'), 'later')
  assert.equal(landingRoom('port'), null)
  assert.equal(planetSign('school'), 'lesson')
  assert.equal(planetSign('playground'), 'lesson')
  assert.equal(planetOf('kitchen'), 'home')
  assert.equal(planetOf('classroom'), 'school')
  assert.equal(planetOf('playground'), 'playground')
  assert.equal(landingRoom('school'), 'classroom')
  for (const p of PLANET_ORDER) assert.ok(PLANETS[p].opens.length >= 1 && PLANETS[p].tiers.length >= 2, `${p} has a key and a tier`)
})

check('the planets open by lessons passed, any one of a planet\'s keys, and the count is the server\'s', () => {
  let h = newHome(2, T0, null)
  assert.deepEqual(lessonsToNextPlanet(h), { planet: 'school', lessons: 1 })
  assert.equal(lessonsToOpen(h, 'playground'), 2)
  h = { ...h, lessonsPassed: 1 }
  assert.deepEqual(openPlanets(h), ['home', 'school'], 'the first lesson opens Moonbase School')
  assert.deepEqual(lessonsToNextPlanet(h), { planet: 'playground', lessons: 1 })
  h = { ...h, lessonsPassed: 2 }
  assert.deepEqual(openPlanets(h), ['home', 'school', 'playground'], 'the second opens the Playground')
  assert.equal(lessonsToNextPlanet(h), null, 'nothing with rooms is waiting on a lesson')
  assert.equal(lessonsToOpen(h, 'school'), null, 'an open planet needs no more lessons')
  assert.equal(planetOpen({ ...h, lessonsPassed: undefined }, 'school'), false, 'an older save reads as no lessons passed')
  const grown = { ...newHome(2, T0, null), growthStage: 3 }
  assert.deepEqual(openPlanets(grown), ['home', 'school', 'playground'], 'growing the planet is the other key to both')
  const landed = { ...newHome(2, T0, null), missions: [{ key: 'rocket_launch', status: 'approved', startedAt: T0, timerEndsAt: null, claimedAt: T0, approvedAt: T0 }] }
  assert.ok(keyTurned(landed, { kind: 'mission', key: 'rocket_launch' }), 'a landed mission turns a mission key')
  assert.ok(!keyTurned(newHome(2, T0, null), { kind: 'mission', key: 'rocket_launch' }))
  assert.equal(planetOpen({ ...newHome(1, T0, null), lessonsPassed: 9 }, 'cafe'), false, 'the Star Cafe is never open at Tier 1')
})

check('the rocket lands only on an open planet, and a landing makes it visited, not new', () => {
  let h = { ...newHome(2, T0, null), lessonsPassed: 1 }
  const shut = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'playground' }, T0)
  assert.equal(whereIs(shut, 'pebble'), 'outdoors', 'the Playground is not open yet')
  assert.deepEqual(newPlanets(h), ['school'], 'Moonbase School is open and new')
  h = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'classroom' }, T0)
  assert.equal(whereIs(h, 'pebble'), 'classroom')
  assert.deepEqual(h.world.visited, ['school'])
  assert.deepEqual(newPlanets(h), [], 'landed, so not new any more')
  h = { ...h, lessonsPassed: 2 }
  assert.deepEqual(newPlanets(h), ['playground'])
  const home = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'outdoors' }, T0)
  assert.equal(whereIs(home, 'pebble'), 'outdoors', 'flying home is always open')
})

check('a planet dragged along its orbit stays where the child left it', () => {
  let h = newHome(2, T0, null)
  assert.equal(orbitAngle(h, 'school'), 325, 'the catalogue place until it is moved')
  h = applyEvent(h, { kind: 'orbit_move', planet: 'school', angle: 45.7 }, T0)
  assert.equal(orbitAngle(h, 'school'), 46)
  h = applyEvent(h, { kind: 'orbit_move', planet: 'school', angle: -30 }, T0)
  assert.equal(orbitAngle(h, 'school'), 330, 'angles wrap')
  h = applyEvent(h, { kind: 'orbit_move', planet: 'ice', angle: 200 }, T0)
  assert.equal(orbitAngle(h, 'ice'), 200, 'a far away planet can be moved too')
  const nowhere = applyEvent(h, { kind: 'orbit_move', planet: 'pluto', angle: 10 }, T0)
  assert.deepEqual(nowhere.world.orbits, h.world.orbits)
  const nan = applyEvent(h, { kind: 'orbit_move', planet: 'playground', angle: Number.NaN }, T0)
  assert.equal(orbitAngle(nan, 'playground'), 80)
})

check('travel (slice 3b): the away rooms are places, a resting Friend stays put, and the other build\'s places are mended', () => {
  let h = newHome(2, T0, null)
  assert.ok(isWhere('classroom') && isWhere('playground'), 'the away rooms are places')
  assert.ok(!isWhere('moonbase') && !isWhere('school'), 'a planet is not a place, and an unknown word is not')
  h = { ...h, lessonsPassed: 1 }
  h = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'classroom' }, T0)
  assert.equal(whereIs(h, 'pebble'), 'classroom')
  assert.equal(whereIs(h, 'bloop'), 'outdoors', 'only the traveller moved')
  const napping = applyEvent(h, { kind: 'nap_start', friend: 'bloop' }, T0)
  const stuck = applyEvent(napping, { kind: 'room_move', friend: 'bloop', where: 'classroom' }, T0)
  assert.equal(whereIs(stuck, 'bloop'), 'outdoors', 'a resting Friend does not travel')
  const home = applyEvent(h, { kind: 'room_move', friend: 'pebble', where: 'outdoors' }, T0)
  assert.equal(whereIs(home, 'pebble'), 'outdoors', 'and back again')
  // A save written by PR 984 for one afternoon put a Friend at 'school' and had no visited list.
  const old = reconcile({ ...h, world: { ...h.world, where: { pebble: 'school', bloop: 'attic' }, visited: ['school', 'park'] } }, T0, null)
  assert.equal(whereIs(old, 'pebble'), 'classroom', 'the classroom by its old name is the classroom')
  assert.equal(whereIs(old, 'bloop'), 'outdoors', 'an unknown place comes home')
  assert.deepEqual(old.world.visited, ['school'], 'a planet the catalogue does not have is forgotten')
})

check('the self (slice 3b): built by the child, guarded against a stale client, kept through reconcile', () => {
  let h = newHome(2, T0, null)
  assert.equal(h.self, null, 'nobody starts with a figure')
  const me = { skin: 3, hair: 1, hairColour: 5, suit: 2 }
  assert.ok(isSelf(me))
  h = applyEvent(h, { kind: 'self_set', self: me }, T0)
  assert.deepEqual(h.self, me)
  const bad = applyEvent(h, { kind: 'self_set', self: { skin: SELF_SKINS.length, hair: 0, hairColour: 0, suit: 0 } }, T0)
  assert.deepEqual(bad.self, me, 'an index off the end changes nothing')
  const junk = applyEvent(h, { kind: 'self_set', self: { skin: 'brown', hair: 0, hairColour: 0, suit: 0 } }, T0)
  assert.deepEqual(junk.self, me, 'junk changes nothing')
  const changed = applyEvent(h, { kind: 'self_set', self: { ...me, suit: SELF_SUITS.length - 1 } }, T0)
  assert.equal(changed.self.suit, SELF_SUITS.length - 1, 'changed any time')
  const old = reconcile({ ...h, self: undefined }, T0, null)
  assert.equal(old.self, null, 'a save from before the self reads as none')
  const mangled = reconcile({ ...h, self: { skin: 99 } }, T0, null)
  assert.equal(mangled.self, null, 'a mangled self reads as none, never drawn wrong')
  assert.ok(SELF_SKINS.length >= 6 && SELF_HAIRS.length >= 6 && SELF_HAIR_COLOURS.length >= 6, 'real choice at every tab')
})

console.log(`\nPASS  ${passed} checks. The loop ends itself, the planet grows while the child is away, the cast grows up with them, and the night lands once.`)
