// A green tick on today's road means the parent did it TODAY.
//
// Justin, 16 September 2026, looking at his own road: "Quests seem to be
// updated on today but haven't done it yet today?"
//
// He was right and the database agreed: four jobs set on the tenth, nothing
// waiting, nothing ticked today, and the rung green. It went green on
// `anyQuests && questsWaiting === 0`, and neither half is scoped to today.
//
// The reasoning behind that was not silly. With an empty approval queue there
// genuinely is nothing to do, and inventing a tap to clear it would be
// busywork. What it broke was what a TICK means on a road where every other
// rung is today's: one rung green from last week turns a tick into two claims
// a parent cannot tell apart, and once one tick is unreliable the others stop
// being believed. It is the rule Justin set on 13 August about the check in,
// applied to the rung next door: "just looking at the check in is not enough
// to tick it off."
//
// So there are three states, and this guard keeps them apart. None of it
// shows up as a type error, because `done: true` is always valid code.
//
//   node scripts/check-today-tick.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const ENGINE = 'lib/pathway/daily-tasks.ts'
const BIG = 'components/daily/TodayPathBig.tsx'
const STRIP = 'components/daily/TodayPathStrip.tsx'

// ── 1. THE QUESTS TICK IS EARNED TODAY ──────────────────────────────────────
const engine = read(ENGINE)
if (engine === null) {
  problems.push(`${ENGINE} is gone, so the file that decides what today's road claims is somewhere this guard cannot see`)
} else if (/done: anyQuests && questsWaiting === 0/.test(engine)) {
  problems.push(
    `${ENGINE} has gone back to ticking Quests on "jobs exist and nothing is waiting". Neither half is today, so the road tells a parent they did something today when the last thing they did was last week. That is the exact bug Justin reported on 16 September.`,
  )
} else if (!/questsActedToday/.test(engine)) {
  problems.push(
    `${ENGINE} no longer works out whether the parent actually moved their quests today, so the Quests tick cannot be honest about it`,
  )
} else if (!/done: questsActedToday/.test(engine)) {
  problems.push(
    `${ENGINE} computes questsActedToday but does not use it as the Quests tick, so the tick is claiming something other than what the parent did today`,
  )
} else {
  ok.push('the Quests tick is earned by approving, answering or writing something today')
}

// ── 2. AND "NOTHING OWED" IS ITS OWN STATE, NOT A TICK ──────────────────────
//
// The half of the old behaviour that WAS right: a parent with an empty queue
// should not be nagged. Losing `clear` would either bring back the false tick
// or leave the rung permanently open, and an unfinishable step trains a family
// to ignore the whole road.
if (engine && !/clear: anyQuests && questsWaiting === 0/.test(engine)) {
  problems.push(
    `${ENGINE} no longer marks an empty quest queue as clear. Without it the rung either lies (a tick for nothing) or nags for ever (an open step with nothing to do in it), and both are worse than what is there now.`,
  )
} else if (engine) {
  ok.push('an empty queue settles the rung without claiming the parent acted')
}

// ── 3. BOTH ROADS READ IT THE SAME WAY ──────────────────────────────────────
//
// The big road and the strip draw the same day. If one treats a clear rung as
// finished and the other does not, a parent gets two different answers about
// their own day depending on which screen they are looking at, which is the
// fault this codebase has had to fix more than once.
for (const rel of [BIG, STRIP]) {
  const src = read(rel)
  if (src === null) {
    problems.push(`${rel} is gone, so one of the two surfaces that draw today's road cannot be checked`)
    continue
  }
  if (!/const settled = /.test(src) || !/t\.done \|\| !!t\.clear/.test(src)) {
    problems.push(
      `${rel} no longer treats a clear rung as settled, so Quests becomes the current step with nothing in it to do, and the day can never complete`,
    )
  } else if (!/isClearNode/.test(src)) {
    problems.push(
      `${rel} knows a rung is settled but draws it exactly like a done one, which puts the false tick straight back on the screen`,
    )
  } else if (/isDoneNode = task\.done \|\| /.test(src)) {
    problems.push(
      `${rel} folds clear into isDoneNode, so a settled rung paints the green tick again. The tick has to stay on task.done alone.`,
    )
  } else {
    ok.push(`${rel.split('/').pop()} settles the rung without ticking it`)
  }
}

// ── THE TEN MINUTES ARE CONFIRMED, CLEARLY (25 September 2026) ──────────────
// Justin: "clear confirmation they have done their 10 mins and confirming what
// happens next." The day counting used to be a small box under the whole path.
// DayTickFlow is the confirmation; it must open on the lead landing, from the
// facts the day-done post returns, and survive a remount of the card.
{
  const big = read('components/daily/TodayPathBig.tsx')
  const flow = read('components/daily/DayTickFlow.tsx')
  if (!big || !flow) problems.push('TodayPathBig or DayTickFlow is gone, so nothing confirms the day counted')
  else if (!/<DayTickFlow/.test(big) || !/\{tickFlow\}/.test(big)) problems.push('TodayPathBig no longer renders DayTickFlow, so the ten minutes landing is confirmed in a small box at the foot of the card again')
  else if (!/setTickFacts\(f\)/.test(big) || !/sessionStorage\.setItem\(tickKey/.test(big)) problems.push('DayTickFlow is no longer opened from the day-done reply and held in sessionStorage, so a re render of Home loses it after one frame')
  else if (!/What happens next/.test(flow)) problems.push('DayTickFlow no longer says what happens next')
  else ok.push('the ten minutes landing opens DayTickFlow: done, the streak, what happens next')
}

if (problems.length > 0) {
  console.error('check-today-tick FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the clear note on TodayLoopTask in lib/pathway/daily-tasks.ts for why there are three states.')
  process.exit(1)
}
console.log('check-today-tick ok: a green tick on today\'s road was earned today')
for (const line of ok) console.log('  ' + line)
