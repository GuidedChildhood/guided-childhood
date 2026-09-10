// A rung on the daily road must read the field that means the thing it claims.
//
// Justin, 10 September 2026, with the path on his phone: "moments has update
// today and scripts and haven't read one yet or ticked a moment."
//
// He was right twice, for two different reasons, and neither could fail a
// typecheck because both read a real column off a real row.
//
//  MOMENT  momentDone read daily_sessions.completed_at. That column means THE
//          DAY finished, and since the rotation a day can finish on a lesson,
//          a DiGi question or a passport look. /api/daily/day-done writes it
//          and says in its own comment that it "never claims cards were
//          completed, because none were". The rung claimed it anyway. His row:
//          completed_at 08:30, cards_completed 0, Moment green.
//
//  SCRIPT  scriptDone counted any script_completions row from today, and did
//          not even SELECT status. lib/pathway/script-status.ts exists to stop
//          exactly this and says why: one definition, imported by the road and
//          the passport both, "because the two of them disagreeing about how
//          far a family has got is the bug here that would cost us their trust
//          in both at the same time". The passport excluded `opened`. The road
//          did not.
import { readFileSync } from 'node:fs'

const fails = []
const src = readFileSync('lib/pathway/daily-tasks.ts', 'utf8')

// ── The moment rung reads cards, never the day's own completion ────────────
const momentLines = src
  .split('\n')
  .map((line, i) => ({ line, n: i + 1 }))
  .filter(({ line }) => /const momentDone\s*=/.test(line))

if (momentLines.length === 0) {
  fails.push('No momentDone in daily-tasks.ts. If the rung moved, move this check with it.')
}
for (const { line, n } of momentLines) {
  if (/session[?.]*\.completed_at/.test(line)) {
    fails.push(`daily-tasks.ts:${n} momentDone reads session.completed_at again. That column means the DAY finished, which since the rotation can happen on a lesson, a DiGi question or a passport look. A moment is cards_completed, or a moment_completions row.`)
  }
}
if (!/const deckMoment = \(session\?\.cards_completed \?\? 0\) > 0/.test(src)) {
  fails.push('daily-tasks.ts no longer derives the deck moment from cards_completed.')
}

// ── The script rung uses the one shared definition ─────────────────────────
if (!/import \{ countsTowardPathway \} from '@\/lib\/pathway\/script-status'/.test(src)) {
  fails.push('daily-tasks.ts does not import countsTowardPathway. The road and the passport must read one definition of a script that counts; script-status.ts is that definition.')
}
if (!/countsTowardPathway\(r\.status\)/.test(src)) {
  fails.push('The script rung no longer filters today\'s rows through countsTowardPathway, so merely opening a script ticks the road while the passport ignores it.')
}
// It cannot filter on a column it never asked for.
const scriptSelects = [...src.matchAll(/from\('script_completions'\)\.select\('([^']*)'\)/g)]
if (scriptSelects.length === 0) {
  fails.push('No script_completions select found in daily-tasks.ts.')
}
for (const m of scriptSelects) {
  if (!m[1].includes('status')) {
    fails.push(`A script_completions select in daily-tasks.ts asks for "${m[1]}" with no status column, so countsTowardPathway can only ever see undefined. This is how the rung ticked on an opened script for weeks.`)
  }
}

// ── The passport rung lands on the job, not the record of it ───────────────
if (!/const nextPassportJob\s*=/.test(src)) {
  fails.push('daily-tasks.ts no longer works out the next open passport section, so the rung is back to sending a parent to the book instead of the job.')
}
if (!/withChildOn\(nextPassportJob\.href\)/.test(src)) {
  fails.push('The passport rung does not route to the open section\'s own href on ordinary days.')
}
// A section href can carry a #fragment, and appending ?child= after a hash
// makes it part of the anchor rather than a query param.
if (!/const withChildOn = /.test(src)) {
  fails.push('withChildOn is gone. A route with a #fragment needs the child inserted before the hash, or the page opens on the wrong child and does not scroll.')
}

if (fails.length) {
  console.error('\nRung truth: ' + fails.length + ' problem' + (fails.length === 1 ? '' : 's') + '\n')
  for (const f of fails) console.error('  ✗ ' + f + '\n')
  process.exit(1)
}
console.log('Rung truth: the moment rung reads cards, the script rung reads the shared rule with the status column, and the passport rung lands on the job.')
