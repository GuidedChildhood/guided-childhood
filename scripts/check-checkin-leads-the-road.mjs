// THE CHECK IN IS THE FIRST THING ON THE ROAD, EVERY DAY.
//
// Justin, 18 September 2026: "also didn't have check in as first thing to do?
// Maybe the 3 rule has messed it up as he had 7 things."
//
// The cap had nothing to do with it. That account had completed exactly one
// day, and one completed day makes today a LESSON day, so the lesson became
// the lead and walked to the front, which pushed the check in down the page.
// Working exactly as designed, and wrong to read.
//
// TWO THINGS WERE BEING DECIDED BY ONE SETTING: which rung is the day's one
// required tick, and which rung a parent's eye lands on first. The rotation
// owns the first. It must never own the second, because the check in is the
// thirty second habit and the thing every number in this product is measured
// from, and a day that opens with anything else is a day the habit competes
// for attention it should not have to.
//
// This guard holds the separation in both directions, which is the only way it
// stays true:
//
//   FIRST     the check in is moved to the front after the lead is placed
//   NOT LEAD  the rotation still chooses the tick, so this is not "fix" the
//             order by making the check in lead every day, which would quietly
//             delete lesson days, DiGi days and passport day
//   SETUP     setup keeps the very front while it is unfinished
//   BY FLAG   the day's done still finds the lead with .find, not by index,
//             or moving a rung in front of it would change what completes the
//             day
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const LOOP = 'lib/pathway/daily-tasks.ts'
const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const loop = code(read(LOOP))
if (loop) {
  // ── 1. THE MOVE HAPPENS ───────────────────────────────────────────────────
  if (!/const checkInIdx = tasks\.findIndex\(t => t\.key === 'checkin'\)/.test(loop)) {
    fail.push(`${LOOP}: nothing looks for the check in rung to put it first, so on a lesson, DiGi or passport day it sits below whatever the rotation chose and a parent opens the app to something other than the habit.`)
  }
  if (!/tasks\.splice\(front, 0, checkIn\)/.test(loop)) {
    fail.push(`${LOOP}: the check in rung is no longer moved to the front of the road.`)
  }
  // AFTER the lead placement, or the lead walks in front of it again.
  const leadAt = loop.indexOf('tasks.splice(insertAt, 0, lead)')
  const checkAt = loop.indexOf('tasks.splice(front, 0, checkIn)')
  if (leadAt >= 0 && checkAt >= 0 && checkAt < leadAt) {
    fail.push(`${LOOP}: the check in is moved to the front BEFORE the lead is placed, so the lead is then inserted in front of it and the check in is second again. Order of these two blocks is the whole fix.`)
  }

  // ── 2. THE ROTATION STILL OWNS THE TICK ───────────────────────────────────
  //
  // The lazy way to satisfy rule 1 is to make the check in the lead every day.
  // That reads the same on a connect day and silently deletes lesson days,
  // DiGi days and passport day, which is a rotation Justin designed on
  // 1 September and did not ask anyone to remove.
  if (!/const leadKey: TodayLoopTask\['key'\] =/.test(loop)) {
    fail.push(`${LOOP}: the lead is no longer chosen by its own expression.`)
  }
  if (/const leadKey: TodayLoopTask\['key'\] =\s*'checkin'/.test(loop)) {
    fail.push(`${LOOP}: the lead is hardcoded to the check in, so every day is a connect day. Putting the check in FIRST is not the same as making it the day's one tick, and collapsing the two throws away lesson days, DiGi days and passport day.`)
  }
  // Scoped to the lead expression ITSELF. `focus === 'lesson'` appears in three
  // other places in this file, deciding whether the lesson rung exists at all
  // and what the passport rung says, so a whole file search passes while the
  // rotation has been cut out of the one expression that uses it to choose.
  // Mutation testing found exactly that: two rules green over a broken file.
  const leadExpr = loop.match(/const leadKey: TodayLoopTask\['key'\] =[\s\S]*?: 'moment'/)?.[0] ?? ''
  if (!leadExpr) {
    fail.push(`${LOOP}: the lead expression could not be read, so nothing below can check that the rotation still chooses the day's tick.`)
  }
  for (const [focus, why] of [['lesson', 'lesson days'], ['digi', 'DiGi days'], ['passport', 'passport day']]) {
    if (leadExpr && !new RegExp(`focus === '${focus}'`).test(leadExpr)) {
      fail.push(`${LOOP}: the lead expression no longer reads focus === '${focus}', so ${why} no longer lead anything and the rotation has quietly become one kind of day.`)
    }
  }
  if (leadExpr && !/tasks\.some\(t => t\.key === 'checkin'\) \? 'checkin'/.test(leadExpr)) {
    fail.push(`${LOOP}: the check in is no longer the lead's fallback, so on a connect day nothing leads with it and the one tick lands on a moment instead.`)
  }

  // ── 3. SETUP KEEPS THE VERY FRONT ─────────────────────────────────────────
  if (!/const front = tasks\[0\]\?\.key === 'setup' \? 1 : 0/.test(loop)) {
    fail.push(`${LOOP}: the check in can now be placed above setup. A family who has not finished setting up has nothing to check in on, which is the rule from 17 August, and this is what keeps it.`)
  }

  // ── 4. THE DAY'S DONE STILL FINDS THE LEAD BY FLAG ────────────────────────
  //
  // Moving a rung in front of the lead is only safe while nothing reads the
  // lead by position. The moment something takes tasks[0], this change starts
  // deciding what completes the day, which it must never do.
  if (!/const lead = tasks\.find\(t => t\.lead\)/.test(loop)) {
    fail.push(`${LOOP}: the day's done no longer finds the lead by its flag. Read by index it would now pick the check in, so the day would complete on the wrong rung and the rotation would stop meaning anything.`)
  }
  if (/const lead = tasks\[0\]/.test(loop)) {
    fail.push(`${LOOP}: the lead is taken from the front of the road, which is the check in now and not what the rotation chose.`)
  }
}

if (fail.length) {
  console.error('check-checkin-leads-the-road FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log('check-checkin-leads-the-road: the check in opens every day, and the rotation still owns the tick.')
