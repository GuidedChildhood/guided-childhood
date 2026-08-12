// Does the check in learning loop read a week honestly?
//
// Justin, 12 August 2026: "we must make sure that the check in data goes onto
// digi brain. Digi must learn what we did when the rating goes up ... like
// natural selection we need to examine what works and why from data."
//
// The comparison that decides up, down or flat, the sentence the brain files,
// and the situation guesser that finally wires getRatedForSituation are all
// pure, so this throws the awkward cases at them without a token.
//
// Usage: node --experimental-strip-types scripts/check-checkin-shifts.mjs

import { computeShift, weekAverage, shiftSummary, MOVE_THRESHOLD } from '../lib/digi/checkin-shift.ts'
import { inferSituation } from '../lib/digi/situation.ts'
import { TIME_BANDS } from '../lib/digi/outcomes.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const week = (ws, scores = {}) => ({
  week_start: ws,
  mood_score: null, sleep_score: null, social_score: null, screen_mood_score: null, open_communication: null,
  ...scores,
})
const FULL = { mood_score: 3, sleep_score: 3, social_score: 3, screen_mood_score: 3, open_communication: 3 }

// ── The average ─────────────────────────────────────────────────────────────
check('an empty week has no average', weekAverage(week('2026-08-10')) === null)
check('a quick check in week averages its one score', weekAverage(week('2026-08-10', { mood_score: 4 })) === 4)
check('a full week averages all five', weekAverage(week('2026-08-10', FULL)) === 3)

// ── Up, down, flat ──────────────────────────────────────────────────────────
check('a missing side is unknown, not flat', computeShift(week('2026-08-10'), week('2026-08-03', FULL)) === null)
check('a real rise reads as up',
  computeShift(week('2026-08-10', { ...FULL, mood_score: 5, sleep_score: 5 }), week('2026-08-03', FULL))?.direction === 'up')
check('a real fall reads as down',
  computeShift(week('2026-08-10', { ...FULL, mood_score: 1, sleep_score: 1 }), week('2026-08-03', FULL))?.direction === 'down')
// One dimension ticking one notch moves the average by exactly 0.2, which is
// under the threshold. Weather, not movement.
check('one notch on one dimension is flat',
  computeShift(week('2026-08-10', { ...FULL, mood_score: 4 }), week('2026-08-03', FULL))?.direction === 'flat')
check('the threshold is a quarter point', MOVE_THRESHOLD === 0.25)
// Mood up two, sleep down two: the average says nothing changed, and calling
// that a rise or a fall would be lying about somebody's week.
check('offsetting moves read as flat',
  computeShift(week('2026-08-10', { ...FULL, mood_score: 5, sleep_score: 1 }), week('2026-08-03', FULL))?.direction === 'flat')
// A quick check in week (mood only) against a full week compares what both
// have, and the dimensions only carry what is present on both sides.
const quickVsFull = computeShift(week('2026-08-10', { mood_score: 5 }), week('2026-08-03', FULL))
check('quick against full still compares', quickVsFull !== null)
check('dimensions only hold what both weeks have', Object.keys(quickVsFull?.dimensions ?? {}).length === 1)

// ── The sentence the brain files ────────────────────────────────────────────
const up = computeShift(week('2026-08-10', { ...FULL, mood_score: 5, sleep_score: 5 }), week('2026-08-03', FULL))
const sUp = shiftSummary('Teo', up, [{ kind: 'script', detail: 'used the script "The bedtime handover" and said it worked' }], true)
check('a rise names the child and the numbers', sUp.includes("Teo's wellbeing rating rose") && sUp.includes('out of 5'))
check('a rise names what the family did', sUp.includes('The bedtime handover'))
check('the loudest dimension is called out', sUp.includes('went up from 3 to 5'))
check('no dashes in the summary', !/[—–]/.test(sUp) && !/\s-\s/.test(sUp))

const down = computeShift(week('2026-08-10', { ...FULL, mood_score: 1, sleep_score: 1 }), week('2026-08-03', FULL))
const sDownPlan = shiftSummary('', down, [], true)
check('a fall with a plan and no actions says so', sDownPlan.includes('agreed plan but nothing else was recorded'))
const sQuiet = shiftSummary('Alma', computeShift(week('2026-08-10', FULL), week('2026-08-03', FULL)), [], false)
check('a quiet flat week is honest about it', sQuiet.includes('held steady') && sQuiet.includes('Nothing was recorded'))

// ── The situation guesser that wires getRatedForSituation ───────────────────
check('tiktok lands on social_media', inferSituation('She keeps asking for TikTok').topic === 'social_media')
check('fortnite lands on gaming, not screen_time', inferSituation('He will not come off Fortnite').topic === 'gaming')
check('a bedtime battle carries its time band', inferSituation('every bedtime is a battle over the tablet').time_band === 'bedtime')
check('mornings before school read as morning', inferSituation('the school run is chaos, he is on the TV before school').time_band === 'morning')
check('a phone question lands on devices', inferSituation('should she have her own phone').topic === 'devices')
check('no signal means no topic, never a guess', inferSituation('thank you, that helped a lot').topic === null)
// The slugs must stay inside the closed list the schedule_followup tool uses,
// or the eq('topic') match in getRatedForSituation returns nothing forever.
const TOOL_TOPICS = new Set(['screen_time', 'gaming', 'social_media', 'sleep', 'mood', 'anxiety', 'safety', 'school', 'siblings', 'routines', 'devices', 'friendship', 'content', 'ai'])
const probes = ['tiktok', 'fortnite', 'sleep', 'anxious', 'meltdown', 'groomed', 'homework', 'sister', 'friend', 'chatgpt', 'inappropriate videos', 'morning routine', 'screen time', 'phone']
for (const p of probes) {
  const t = inferSituation(p).topic
  if (t !== null) check(`"${p}" maps into the tool's own topic list`, TOOL_TOPICS.has(t), t)
}
// And every band the guesser can emit is a band the table knows.
const bands = new Set(TIME_BANDS)
for (const p of ['morning', 'after school', 'bedtime', 'this evening', 'at the weekend']) {
  const b = inferSituation(p).time_band
  if (b !== null) check(`"${p}" maps into TIME_BANDS`, bands.has(b), b)
}

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
