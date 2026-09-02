// The Planter Friends rules, checked against the design.
//
// lib/planter/logic.ts is pure and import free so it can run here under
// node's type stripping with no build. Every rule in
// plans/planter-friends-architecture.md section 3.1 and 3.3 that can be
// stated as a number is stated here, so a change to the toy that breaks
// the loop fails before it reaches a child.
//
// Usage: node --experimental-strip-types scripts/check-planter-logic.mjs

import assert from 'node:assert/strict'
import {
  TIERS, GROWTH, SLEEPY_AT, TICK_CAP_SECONDS,
  tierFor, newGarden, applyEvent, reconcile, moodOf, restOverlay, bedtimePhase, nightKeyFor, minutesLeft, addMinutes,
} from '../lib/planter/logic.ts'

const T0 = '2026-09-02T15:00:00.000Z'
const at = (min) => addMinutes(T0, min)
const starters = (tier) => (tier === 1 ? [{ id: 'p1', species: 'sunny', name: 'Sunny' }] : [{ id: 'p1', species: 'sunny', name: 'Sunny' }, { id: 'p2', species: 'daisy', name: 'Pip' }])
let passed = 0
const check = (name, f) => { f(); passed += 1; console.log(`ok    ${name}`) }

check('tier from date of birth: 3 to 5 is Tier 1, 6 to 9 Tier 2, 10 plus Tier 3', () => {
  const now = new Date('2026-09-02T12:00:00Z')
  assert.equal(tierFor('2023-01-15', null, now), 1)
  assert.equal(tierFor('2020-09-03', null, now), 1)   // turns six tomorrow
  assert.equal(tierFor('2020-09-02', null, now), 2)   // six today
  assert.equal(tierFor('2017-01-01', null, now), 2)
  assert.equal(tierFor('2016-09-01', null, now), 3)
  assert.equal(tierFor(null, '4-7', now), 1)
  assert.equal(tierFor(null, '8-10', now), 2)
  assert.equal(tierFor(null, '11-13', now), 3)
})

check('a new garden owes nothing: full energy, stage 1, the passed night already applied', () => {
  const g = newGarden(1, T0, starters(1), '2026-09-02')
  assert.equal(g.plants.length, 1)
  assert.equal(g.plants[0].energy, 100)
  assert.equal(g.plants[0].growthStage, 1)
  assert.equal(g.lastNightAppliedOn, '2026-09-02')
  assert.deepEqual(reconcile(g, T0, '2026-09-02'), g)
})

check('play drains: a Tier 1 plant is sleepy after 12 minutes and drained at 15', () => {
  let g = newGarden(1, T0, starters(1), null)
  for (let m = 1; m <= 12; m++) g = applyEvent(g, { kind: 'tick' }, at(m))
  assert.equal(moodOf(g.plants[0]), 'sleepy')
  assert.ok(g.plants[0].energy <= SLEEPY_AT && g.plants[0].energy > 0)
  for (let m = 13; m <= 15; m++) g = applyEvent(g, { kind: 'tick' }, at(m))
  assert.equal(g.plants[0].energy, 0)
  assert.equal(moodOf(g.plants[0]), 'tired')
})

check('a tick drains at most the cap, so a child who was away is not drained for the absence', () => {
  let g = newGarden(1, T0, starters(1), null)
  g = applyEvent(g, { kind: 'tick' }, at(60))
  const perSecond = 100 / TIERS[1].playMinutes / 60
  assert.ok(Math.abs(g.plants[0].energy - (100 - TICK_CAP_SECONDS * perSecond)) < 0.05)
  // And reconcile after a long gap resets the clock without draining.
  const r = reconcile(g, at(200), null)
  assert.equal(r.energyTickedAt, at(200))
  assert.equal(r.plants[0].energy, g.plants[0].energy)
})

check('Tier 2 shade slows the drain by a fifth, Tier 1 shade does nothing', () => {
  let a = newGarden(2, T0, starters(2), null)
  a = applyEvent(a, { kind: 'shade', plantId: 'p1', on: true }, T0)
  a = applyEvent(a, { kind: 'tick' }, at(1))
  const shaded = 100 - a.plants[0].energy, open = 100 - a.plants[1].energy
  assert.ok(Math.abs(shaded / open - 0.8) < 0.01)
  let b = newGarden(1, T0, starters(1), null)
  b = applyEvent(b, { kind: 'shade', plantId: 'p1', on: true }, T0)
  b = applyEvent(b, { kind: 'tick' }, at(1))
  assert.ok(Math.abs((100 - b.plants[0].energy) - 100 / 15) < 0.01)
})

check('the nap: fifteen real minutes, the screen rests, growth lands only when it closes', () => {
  let g = newGarden(1, T0, starters(1), null)
  g = applyEvent(g, { kind: 'nap_start', plantId: 'p1' }, T0)
  assert.equal(g.plants[0].cooldown.reason, 'nap')
  assert.equal(g.plants[0].cooldown.endsAt, at(15))
  assert.equal(moodOf(g.plants[0]), 'asleep')
  assert.equal(restOverlay(g), 'nursery')
  assert.equal(minutesLeft(g.plants[0].cooldown, at(6)), 9)
  // Ticks during a nap drain nothing.
  const during = applyEvent(g, { kind: 'tick' }, at(5))
  assert.equal(during.plants[0].energy, 100)
  // Not over yet at fourteen minutes, whatever the device says.
  assert.equal(reconcile(g, at(14), null).plants[0].cooldown.reason, 'nap')
  const done = reconcile(g, at(15), null)
  assert.equal(done.plants[0].cooldown, null)
  assert.equal(done.plants[0].growthProgress, GROWTH.nap)
  assert.equal(done.plants[0].grewWhileAway, GROWTH.nap)
  assert.equal(done.plants[0].energy, 100)
})

check('a grown up yes wakes the plants early and pays by the minutes slept', () => {
  let g = newGarden(1, T0, starters(1), null)
  g = applyEvent(g, { kind: 'nap_start', plantId: 'p1' }, T0)
  g = applyEvent(g, { kind: 'wake_all' }, at(6))
  assert.equal(g.plants[0].cooldown, null)
  assert.equal(g.plants[0].energy, 100)
  assert.equal(g.plants[0].growthProgress, Math.round(GROWTH.nap * 6 / 15))
})

check('the sunlight mission: three minutes, the ambient wait: fifteen, and only a drained plant rests by itself', () => {
  let g = newGarden(2, T0, starters(2), null)
  g = applyEvent(g, { kind: 'sunlight_start', plantId: 'p1' }, T0)
  assert.equal(g.plants[0].cooldown.endsAt, at(3))
  assert.equal(moodOf(g.plants[0]), 'sunbathing')
  // A plant with energy left does not start an ambient rest.
  g = applyEvent(g, { kind: 'ambient_start', plantId: 'p2' }, T0)
  assert.equal(g.plants[1].cooldown, null)
  for (let m = 1; m <= 20; m++) g = applyEvent(g, { kind: 'tick' }, at(m))
  assert.equal(g.plants[1].energy, 0)
  g = applyEvent(g, { kind: 'ambient_start', plantId: 'p2' }, at(20))
  assert.equal(g.plants[1].cooldown.reason, 'ambient')
  assert.equal(g.plants[1].cooldown.endsAt, at(35))
  // One plant napping and one resting is the ambient overlay, not the nursery.
  const both = reconcile(g, at(21), null)
  assert.equal(both.plants[0].cooldown, null)
  assert.equal(restOverlay(both), null)
  const bothResting = applyEvent(both, { kind: 'nap_start', plantId: 'p1' }, at(21))
  assert.equal(restOverlay(bothResting), 'ambient')
})

check('growth carries over stages and stops at the seedhead', () => {
  let g = newGarden(1, T0, starters(1), null)
  for (let i = 0; i < 30; i++) {
    g = applyEvent(g, { kind: 'nap_start', plantId: 'p1' }, at(i * 20))
    g = reconcile(g, at(i * 20 + 15), null)
  }
  assert.equal(g.plants[0].growthStage, 5)
  assert.equal(g.plants[0].growthProgress, 0)
})

check('the night lands once per London date, never twice, never for a garden that did not exist', () => {
  let g = newGarden(1, T0, starters(1), '2026-09-02')
  g = reconcile(g, at(60), '2026-09-02')
  assert.equal(g.plants[0].growthProgress, 0)
  g = reconcile(g, at(16 * 60), '2026-09-03')
  assert.equal(g.plants[0].growthProgress, GROWTH.night)
  assert.equal(g.lastNightAppliedOn, '2026-09-03')
  g = reconcile(g, at(17 * 60), '2026-09-03')
  assert.equal(g.plants[0].growthProgress, GROWTH.night)
  assert.equal(g.plants[0].energy, 100)
})

check('bedtime phase: wind down thirty minutes before, bedtime across midnight, day otherwise, no window at 16 plus', () => {
  const start = 19 * 60, end = 7 * 60
  assert.equal(bedtimePhase(12 * 60, start, end), 'day')
  assert.equal(bedtimePhase(18 * 60 + 29, start, end), 'day')
  assert.equal(bedtimePhase(18 * 60 + 30, start, end), 'winddown')
  assert.equal(bedtimePhase(18 * 60 + 59, start, end), 'winddown')
  assert.equal(bedtimePhase(19 * 60, start, end), 'bedtime')
  assert.equal(bedtimePhase(23 * 60 + 59, start, end), 'bedtime')
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

console.log(`\nPASS  ${passed} checks. The loop ends itself, growth happens while the child is away, and the night lands once.`)
