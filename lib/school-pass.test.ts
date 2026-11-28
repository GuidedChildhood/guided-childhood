import { test } from 'node:test'
import assert from 'node:assert/strict'
import { schoolPassOpens, passIsLive, SCHOOL_PASS_SCRIPTS, SCHOOL_PASS_DIGI } from './school-pass'

test('the pass opens home, lessons, homework, the chart, the calendar, and the metered taste', () => {
  for (const p of ['/dashboard', '/dashboard/lessons', '/dashboard/lessons/12', '/dashboard/homework', '/dashboard/quests/timer',
    '/dashboard/school', '/dashboard/printables/sheet/star-chart', '/dashboard/scripts/4', '/dashboard/digi', '/dashboard/setup']) {
    assert.equal(schoolPassOpens(p), true, p)
  }
})

test('everything else still needs the membership', () => {
  for (const p of ['/dashboard/devices', '/dashboard/pathway', '/dashboard/passport', '/dashboard/checkin', '/dashboard/lessonsx', '/dashboard/digix', '/k/abc']) {
    assert.equal(schoolPassOpens(p), false, p)
  }
})

test('a pass is live through its last day and not after', () => {
  assert.equal(passIsLive('2027-07-31', '2027-07-31'), true)
  assert.equal(passIsLive('2027-07-31', '2027-08-01'), false)
  assert.equal(passIsLive('2027-07-31', '2026-11-27T10:00:00.000Z'), true)
  assert.equal(passIsLive(null, '2026-11-27'), false)
  assert.equal(passIsLive('soon', '2026-11-27'), false)
})

test('the taste is ten of each, as Justin chose', () => {
  assert.equal(SCHOOL_PASS_SCRIPTS, 10)
  assert.equal(SCHOOL_PASS_DIGI, 10)
})
