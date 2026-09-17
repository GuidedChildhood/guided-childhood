// A DURATION IS NOT A CLOCK.
//
// Justin, 16 September 2026, with a photo of the Home trial banner reading
// "Free days end in 22:27": "the English is not right here if we are giving
// a time".
//
// Right, and the cost is bigger than the grammar. 22:27, in mono, with a
// colon, is the shape of a TIME OF DAY. A parent reads it as twenty seven
// minutes past ten tonight and concludes the trial dies at bedtime. They
// actually had most of a day left. The one number on the one card that decides
// whether a family pays could be read as its own opposite, and both readings
// look equally correct.
//
// So the last day says how long is left IN WORDS, with the units out loud, and
// this guard holds the three things that made the old version unreadable:
//
//   1. No clock punctuation in the banner. No mono numerals, no colon between
//      two numbers, no zero padding.
//   2. The sentence comes from timeLeftWords, one place, so a future edit
//      cannot quietly reinvent the format inline.
//   3. timeLeftWords actually names its units, and never overstates: it floors,
//      so a parent is never told they have longer than they do.
//
// A typecheck cannot see any of this. `{h}:{pad(m)}` is perfectly valid code.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const FILE = 'components/home/TrialCountdown.tsx'

const fail = []
let src = ''
try { src = readFileSync(FILE, 'utf8') } catch { fail.push(`${FILE} is missing`) }

// The comments in that file quote the old broken string in full, so they come
// out before anything is read as code. A guard that passes on its own
// explanation is not a guard.
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

if (src) {
  // ── 1. THE SENTENCE ITSELF, RUN RATHER THAN READ ──────────────────────────
  //
  // Reading the source for the words "hour" and "minute" is not enough, and
  // mutation testing proved it twice: the local variable is called `hours`, so
  // a plain name check matched the code's own identifier; and with the units
  // stripped from ONE branch the other branch still carried the words, so the
  // file looked fine while a parent under an hour out saw a bare number.
  //
  // So the function is lifted out and actually called. What a parent reads is
  // the only thing worth holding.
  const fn = code.match(/function timeLeftWords\s*\([\s\S]*?\n\}/)
  if (!fn) {
    fail.push(`${FILE}: timeLeftWords is gone. It is the one place the remaining time is turned into words, and without it the next edit writes the format inline again, which is how "22:27" got here.`)
  } else {
    let says = null
    try {
      // The type annotations come off so plain node can build it. Nothing else
      // about the body is touched.
      const js = fn[0].replace(/\(\s*msLeft\s*:\s*number\s*\)\s*:\s*string/, '(msLeft)')
      says = new Function(`${js}; return timeLeftWords`)()
    } catch (err) {
      fail.push(`${FILE}: timeLeftWords could not be run on its own (${err.message}). It has to stay a plain function of the milliseconds left, so what a parent reads can be checked rather than guessed at.`)
    }

    if (says) {
      const MIN = 60_000, HOUR = 3_600_000
      const cases = [
        // [ms left, what the sentence must contain, what it must never contain ]
        [22 * HOUR + 27 * MIN, /\bhours\b/, 'the case Justin photographed, which read "22:27"'],
        [2 * HOUR + 40 * MIN, /\bhours\b.*\bminutes\b/, 'a couple of hours out, when the minutes still matter'],
        [1 * HOUR, /\b1 hour\b/, 'exactly one hour, which must not say "1 hours"'],
        [27 * MIN, /\bminutes\b/, 'under an hour, when minutes are the only unit left'],
        [1 * MIN, /\b1 minute\b/, 'the last minute, which must not say "1 minutes"'],
        [0, /less than a minute/, 'nothing left at all'],
      ]
      for (const [ms, must, why] of cases) {
        const out = String(says(ms))
        if (!must.test(out)) {
          fail.push(`${FILE}: with ${Math.round(ms / MIN)} minutes left the banner says "${out}", which does not match ${must}. That is ${why}.`)
        }
        if (/\d\s*:\s*\d/.test(out)) {
          fail.push(`${FILE}: with ${Math.round(ms / MIN)} minutes left the banner says "${out}". A colon between two numbers is a time of day, which is the exact misreading this replaced.`)
        }
      }
      // AND IT MUST NEVER OVERSTATE. Telling a family they have longer than
      // they do is the one error on this card that cannot be called harmless.
      const overstated = []
      for (let m = 1; m <= 24 * 60; m++) {
        const out = String(says(m * MIN + 30_000))
        const hrs = Number((out.match(/(\d+)\s*hours?/) || [])[1] || 0)
        const mins = Number((out.match(/(\d+)\s*minutes?/) || [])[1] || 0)
        if (hrs * 60 + mins > m) overstated.push(`${m} minutes left reads "${out}"`)
      }
      if (overstated.length) {
        fail.push(`${FILE}: the banner overstates how long is left in ${overstated.length} of 1440 cases, for example ${overstated[0]}. It has to floor, so a parent is never told they have longer than they really do.`)
      }
    }
  }

  // ── 2. THE BANNER USES IT ─────────────────────────────────────────────────
  if (!/timeLeftWords\(\s*msLeft\s*\)/.test(code)) {
    fail.push(`${FILE}: the last day banner does not call timeLeftWords(msLeft), so whatever it is showing is not the sentence this guard checks.`)
  }

  // ── 3. NO CLOCK IN THE BANNER ─────────────────────────────────────────────
  //
  // The exact shape that shipped: two interpolations with a colon between
  // them, drawn in the mono face. Either half alone is enough to bring the
  // misreading back, so both are held.
  if (/padStart\(\s*2\s*,\s*'0'\s*\)/.test(code)) {
    fail.push(`${FILE}: a number is being zero padded to two digits. Nothing in a duration needs a leading zero; padding exists to make something look like a clock.`)
  }
  const banner = code.match(/free days end in[\s\S]{0,220}/i)
  if (!banner) {
    fail.push(`${FILE}: the last day line no longer says when the free days end. It is the sentence the whole card exists for.`)
  } else {
    // Scoped to the banner, and to a colon sitting between two values ON ONE
    // LINE. The file's own props are destructured as `}: {` across a line
    // break, which is TypeScript, not a clock: checking the whole file failed
    // on that the first time this guard ran.
    if (/\{[^{}\n]*\}[ \t]*:[ \t]*\{/.test(banner[0])) {
      fail.push(`${FILE}: two values with a colon between them are back in the last day line. That is the shape of a time of day, which is exactly the misreading Justin photographed: "22:27" looks like half past ten at night, not twenty two hours.`)
    }
    if (/var\(--font-mono\)/.test(banner[0])) {
      fail.push(`${FILE}: the remaining time is drawn in the mono face. Mono numerals are half of what made this read as a clock rather than a sentence.`)
    }
  }
}

// ── 4. NO DASHES, HOUSE RULE ────────────────────────────────────────────────
if (src) {
  const dashes = src.match(/[‐-―−]/g)
  if (dashes) {
    fail.push(`${FILE}: ${dashes.length} dash character${dashes.length === 1 ? '' : 's'} in the file. No dashes in any copy, ever.`)
  }
}

if (fail.length) {
  console.error('check-trial-countdown-words: the trial banner is showing a clock again\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-trial-countdown-words: the last day says how long is left in words, floored, and nothing on the card is punctuated like a time of day.')
