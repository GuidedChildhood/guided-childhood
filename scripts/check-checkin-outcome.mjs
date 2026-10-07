// One tap, one message. Every row of the check in's outcome table, run.
//
// The card used to speak from four places after a tap and two of them
// disagreed for a month (7 October 2026). lib/concerns/outcome.ts is now the
// only voice, so this is where its promises are held: a five is sorted only
// when the resting rule would rest it, a low score always brings help, and
// nothing it says carries a dash.
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-checkin-outcome.mjs

import { readFileSync } from 'node:fs'
import { checkinOutcome, TOP, ATTENTION_BAND, BAND_WORDS } from '../lib/concerns/outcome.ts'
import { SILVER_RUN, TOP_BAND } from '../lib/concerns/resting.ts'
import { bandOf } from '../lib/concerns/bands.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const o = (band, lastBand = null, topRun = 0) => checkinOutcome({ band, lastBand, topRun })
const say = r => `${r.kind}: "${r.line}" / "${r.next}" [${r.actions.join(', ')}]`

// ── THE TABLE ───────────────────────────────────────────────────────────────
check('TOP is the band a top score lands in', TOP === bandOf(TOP_BAND) && TOP === 5, String(TOP))

const second = o(5, 5, SILVER_RUN - 1)
check('a five that completes the run rests the worry', second.kind === 'rest', say(second))
check('and says sorted', /^Sorted!/.test(second.line) && (SILVER_RUN === 1 ? /a great day/ : new RegExp(`${['', 'one', 'two', 'three'][SILVER_RUN]} great days`)).test(second.line), second.line)
check('and says it is off the list, checked in a week, and a moment brings it back',
  /^Off your list\./.test(second.next) && /a week that it held/.test(second.next) && /log it as a moment/.test(second.next), second.next)
check('with no buttons', second.actions.length === 0)

// With a rule of one (7 October 2026) every five is sorted and "nearly" never
// shows; with a longer run the first five is a win with a finish line. Both
// are held, so the function stays right if the number moves again.
const first = o(5, null, 0)
const afterLow = o(5, 2, 0)
if (SILVER_RUN > 1) {
  check('a first ever five is nearly, not sorted', first.kind === 'nearly', say(first))
  check('and says great day', first.line === 'Great day.', first.line)
  check('and says one more is needed', /^One more like this and it comes off your list\.$/.test(first.next), first.next)
  check('with no buttons', first.actions.length === 0)
  check('a five after a low score is also nearly', afterLow.kind === 'nearly', say(afterLow))
} else {
  check('a first ever five is sorted under a rule of one', first.kind === 'rest', say(first))
  check('a five after a low score is sorted too', afterLow.kind === 'rest', say(afterLow))
  check('and nothing ever says one more is needed', !/one more like this/i.test(first.next + afterLow.next))
}

for (let run = 0; run <= SILVER_RUN + 1; run++) {
  const r = o(5, 5, run)
  const should = run + 1 >= SILVER_RUN ? 'rest' : 'nearly'
  check(`a five with a run of ${run} before it reads ${should}, exactly as resting.ts counts`, r.kind === should, say(r))
}

const up = o(4, 2, 0)
check('four after hard going keeps, and names both words', up.kind === 'keep' && up.line === 'Getting there, up from hard going.', say(up))
check('and says it stays on the list and is asked again', /^Stays on your list\./.test(up.next) && /ask again/.test(up.next), up.next)
check('with no buttons', up.actions.length === 0)
const down = o(3, 4, 0)
check('three after getting there says down from', down.kind === 'keep' && down.line === 'Up and down, down from getting there.', say(down))
const held = o(4, 4, 0)
check('four after four says same as last time', held.kind === 'keep' && held.line === 'Getting there, same as last time.', say(held))
const firstMid = o(3, null, 0)
check('a first ever three says first one logged', firstMid.kind === 'keep' && firstMid.line === 'Up and down. First one logged.', say(firstMid))
const dipToFour = o(4, 5, 0)
check('a dip from five to four is still keep, no buttons', dipToFour.kind === 'keep' && dipToFour.actions.length === 0, say(dipToFour))

for (const [band, lastBand, why] of [[2, 4, 'a dip to two'], [1, 1, 'a steady one'], [2, null, 'a first ever two'], [1, 5, 'a fall from five'], [2, 2, 'a second two in a row']]) {
  const r = o(band, lastBand, 0)
  check(`${why} gets special attention`, r.kind === 'attention', say(r))
  check(`  and both help buttons, DiGi first`, r.actions.join(',') === 'digi,script', r.actions.join(','))
}
const low = o(2, 4, 0)
check('attention thanks them for telling us', low.line === 'Tough one. Thank you for telling us.', low.line)
check('and promises help tonight', /on it with you/.test(low.next) && /help for tonight/.test(low.next), low.next)
check('the attention band is one or two', ATTENTION_BAND === 2)

// ── THE SHAPE ───────────────────────────────────────────────────────────────
const every = []
for (let band = 1; band <= 5; band++) for (const last of [null, 1, 2, 3, 4, 5]) for (const run of [0, 1, 2]) every.push(o(band, last, run))
check('every outcome has exactly one line and one next', every.every(r => r.line.length > 0 && r.next.length > 0))
check('no line is longer than a breath', every.every(r => r.line.length <= 60), String(Math.max(...every.map(r => r.line.length))))
check('no next is longer than two short sentences', every.every(r => r.next.length <= 100), String(Math.max(...every.map(r => r.next.length))))
check('no dashes anywhere', every.every(r => !/[-–—]/.test(r.line + r.next)))
check('only the four kinds', every.every(r => ['rest', 'nearly', 'keep', 'attention'].includes(r.kind)))
check('buttons only on attention', every.every(r => (r.actions.length > 0) === (r.kind === 'attention')))
check('a score out of range is clamped, not crashed', o(0).kind === 'attention' && o(9).kind !== undefined)
check('the five words are the ones the card has always used',
  BAND_WORDS.join(' | ') === 'Really tough | Hard going | Up and down | Getting there | Going great', BAND_WORDS.join(' | '))

// ── THE CARD SPEAKS FROM HERE AND NOWHERE ELSE ──────────────────────────────
const card = readFileSync('components/daily/ConcernCheckIn.tsx', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
check('the card calls checkinOutcome', /checkinOutcome\(/.test(card))
check('the card no longer carries its own sorted message', !/That is sorted/.test(card) && !/drop it off your check in/.test(card))
check('the card no longer carries its own four star message', !/Nearly there/.test(card))
check('the card no longer carries its own verdict line', !/function verdictLine/.test(card))
check('the card reads the rule from resting.ts', /from '@\/lib\/concerns\/resting'/.test(card))
const outcome = readFileSync('lib/concerns/outcome.ts', 'utf8').replace(/^\s*\/\/.*$/gm, '')
// A declaration, not a comparison: `SILVER_RUN === 1` is the function reading
// the rule, `const SILVER_RUN =` would be it carrying a copy.
check('outcome.ts carries no copy of SILVER_RUN or TOP_BAND', !/(const|let|var)\s+SILVER_RUN\s*=/.test(outcome) && !/(const|let|var)\s+TOP_BAND\s*=/.test(outcome))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
