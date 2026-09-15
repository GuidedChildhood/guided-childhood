// The red number recounts when you answer the thing it is counting.
//
// Justin, 15 September 2026, with a photo of his Quests tab: "not sure why one
// red warning on parent quest here?" The badge said 1. The board directly
// underneath it said "0 Waiting on you". I read the live database for that
// account: no pending tick, no pending pitch, no pending printable. All three
// sources of that number were zero while the number said one.
//
// ── WHY IT WAS WRONG, WHICH IS NOT WHAT IT LOOKS LIKE ───────────────────────
//
// The badge was never wrong about the data. It was wrong about WHEN.
//
// The tab bar lives in app/(dashboard)/dashboard/layout.tsx and its count is
// computed there, on the server. The board lives in the page. Answering
// something on the board updates the page and leaves the layout exactly as it
// was last rendered, so the number sat at its old value until a full reload.
//
// A badge is a promise that something needs you. One that keeps counting a job
// you have already approved teaches a parent that the numbers mean nothing,
// which is the same lesson a previous round of this bug taught (see the note in
// the dashboard layout about three red circles counting three different
// things).
//
// ── THE TWO HALVES, AND THE ONE THAT WAS MISSING ────────────────────────────
//
// gc:notifs-changed already existed. Everything that CLEARS one of these fires
// it: the approve path, the printables confirm, manage jobs. Two things
// listened, and the tab bar was not one of them.
//
// And one firer was missing too: deciding a pitched idea (decideAsk) changed a
// row that the badge counts and told nobody.
//
// So this guard holds both ends:
//
//   1. Every place that resolves a counted row fires gc:notifs-changed.
//   2. The tab bar listens for it and refreshes, so the layout recounts.
//
// Neither is visible to a typecheck or a build: an event nobody hears is
// perfectly valid code, and the symptom is a number that is merely old.
//
//   node scripts/check-badge-truth.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const EVENT = 'gc:notifs-changed'

// ── 1. The badge counts these three, and the layout is where it is counted ──
const layout = read('app/(dashboard)/dashboard/layout.tsx')
if (layout === null) {
  problems.push('app/(dashboard)/dashboard/layout.tsx is gone, so the badge this guard protects has no source')
} else {
  const counts = ['quest_ticks', 'quest_requests', 'printable_completions'].filter(t => layout.includes(t))
  if (counts.length !== 3) {
    problems.push(`the layout's badge counts ${counts.length} of the three queues (${counts.join(', ') || 'none'}). If one has moved, the guard below is checking the wrong resolvers.`)
  } else if (!/pendingAsks/.test(layout)) {
    problems.push('the layout no longer computes pendingAsks, so the badge is fed from somewhere this guard cannot see')
  } else {
    ok.push('the layout counts all three queues into pendingAsks')
  }
}

// ── 2. The tab bar listens and refreshes ────────────────────────────────────
const bar = read('components/dashboard/MobileTabBar.tsx')
if (bar === null) {
  problems.push('components/dashboard/MobileTabBar.tsx is missing')
} else if (!bar.includes('NOTIFS_CHANGED_EVENT') && !bar.includes(EVENT)) {
  problems.push(
    `the tab bar does not listen for ${EVENT}. Its count comes from the layout, so without this it keeps showing the number from whenever the layout last rendered: a parent approves a job and the red badge goes on counting it until a full reload.`,
  )
} else if (!/router\s*\.\s*refresh\s*\(/.test(bar)) {
  problems.push('the tab bar hears the event but never calls router.refresh(), so the layout never recounts and the badge does not move')
} else if (!/addEventListener\(/.test(bar) || !/removeEventListener\(/.test(bar)) {
  problems.push('the tab bar\'s listener is not both added and removed, which leaks one per mount')
} else {
  ok.push('the tab bar listens for the event and refreshes, so the layout recounts')
}

// ── 3. Everything that resolves a counted row says so ───────────────────────
//
// Each entry is a file that writes one of the three queues to a resolved state.
// A resolver that does not fire the event leaves every listener stale.
const RESOLVERS = [
  ['components/quests/QuestBoard.tsx', 'approving a ticked job, and deciding a pitched idea'],
  ['components/quests/PrintablesToConfirm.tsx', 'confirming a finished printable'],
  ['app/(dashboard)/dashboard/quests/manage/ManageJobs.tsx', 'answering from the manage list'],
]
for (const [rel, what] of RESOLVERS) {
  const src = read(rel)
  if (src === null) { problems.push(`${rel} is missing, so ${what} happens somewhere this guard is not looking`); continue }
  if (!src.includes(EVENT)) {
    problems.push(`${rel} never fires ${EVENT}, so ${what} leaves the red badge counting something already dealt with.`)
  } else {
    ok.push(`${rel.split('/').pop()} fires the event`)
  }
}

// The board resolves TWO kinds (a tick and a pitch) and both must say so. One
// dispatch in the file is not proof of that: the pitch path was the half that
// was missing.
const board = read('components/quests/QuestBoard.tsx')
if (board) {
  const fires = (board.match(/gc:notifs-changed/g) || []).length
  if (fires < 2) {
    problems.push(`components/quests/QuestBoard.tsx fires ${EVENT} ${fires} time(s). It resolves two counted things, a ticked job and a pitched idea, and both have to tell the listeners.`)
  } else {
    ok.push('the board fires the event from both the tick path and the pitch path')
  }
}

if (problems.length > 0) {
  console.error('check-badge-truth FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why a stale badge is worse than no badge.')
  process.exit(1)
}
console.log('check-badge-truth ok: the red number recounts when a parent answers')
for (const line of ok) console.log('  ' + line)
