// Screens rest an hour BEFORE bed, and a tap cannot set it to now.
//
// Justin, 16 September 2026: "I thought screen times were recommended not
// right up to bedtime? As light affects sleep, so surely the recommended is
// much before bedtime?"
//
// Two separate faults behind that, and neither is visible to a typecheck.
//
// ── 1. OUR OWN ADVICE DISAGREED WITH OUR OWN DEFAULT ────────────────────────
//
// DiGi's weekly plan has always offered "Screens down an hour before <child>'s
// bed" and called it one of the clearest levers in the evidence for better
// sleep. The bedtime defaults started AT the typical bedtime for the band, so
// the setting a family actually lives by contradicted the advice we gave them.
// The defaults are now bedtime minus an hour.
//
// ── 2. A TAP COULD SET IT TO NOW ────────────────────────────────────────────
//
// On Justin's own account bedtime_start saved as 09:57, the minute he was
// looking at the screen, leaving a thirteen year old with screens resting for
// 21 hours a day. He had not typed a time. He had tapped the field.
//
// An `<input type="time">` that saves onChange writes on every scroll of the
// picker, and iOS opens that picker at the current time. There is no undo on
// that screen and nobody reads a bedtime window until a child cannot start
// anything, so the damage is silent for days.
//
//   node scripts/check-screens-rest.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const TIERS = 'lib/quests/time-tiers.ts'
const CARD = 'components/quests/TimeTiersCard.tsx'

// ── 1. THE DEFAULT IS AN HOUR BEFORE THE TYPICAL BEDTIME ────────────────────
//
// Checked as VALUES rather than as a string, so a future edit that nudges one
// band back to bedtime is caught even though it compiles perfectly.
const BED_BY_BAND = { '4-7': 19, '8-10': 20, '11-13': 21, '13-15': 22 }
const tiers = read(TIERS)
if (tiers === null) {
  problems.push(`${TIERS} is gone, so the file that decides when a child's screens rest cannot be checked`)
} else {
  const block = tiers.match(/DEFAULT_BEDTIME[^=]*=\s*\{([\s\S]*?)\n\}/)
  if (!block) {
    problems.push(`${TIERS} no longer declares DEFAULT_BEDTIME, so a family with no row gets no screens rest window at all`)
  } else {
    const bad = []
    for (const [band, bedHour] of Object.entries(BED_BY_BAND)) {
      const m = block[1].match(new RegExp(`'${band}'\\s*:\\s*\\{\\s*start:\\s*'(\\d{2}):(\\d{2})'`))
      if (!m) { bad.push(`${band} has no start time`); continue }
      const startHour = Number(m[1])
      if (startHour !== bedHour - 1) {
        bad.push(`${band} rests from ${m[1]}:${m[2]}, but the typical bedtime for that band is ${bedHour}:00, so it should be ${String(bedHour - 1).padStart(2, '0')}:00`)
      }
    }
    if (bad.length > 0) {
      problems.push(
        `${TIERS} no longer rests screens an hour before bed: ${bad.join('; ')}. DiGi's weekly plan tells this same parent "screens down an hour before bed", so a default that starts AT bedtime makes the product contradict itself, and the setting is the half a family lives by.`,
      )
    } else {
      ok.push('every age band rests its screens an hour before that age\'s typical bedtime')
    }
  }
}

// ── 2. THE TIME FIELDS COMMIT ON BLUR, NOT ON EVERY CHANGE ──────────────────
const card = read(CARD)
if (card === null) {
  problems.push(`${CARD} is gone, so the screen a parent sets a bedtime on cannot be checked`)
} else if (/onChange=\{e => e\.target\.value && save\(/.test(card)) {
  problems.push(
    `${CARD} saves a time input on every change again. iOS opens that picker at the CURRENT time and fires a change on every scroll, so tapping the field to look at it writes now as the bedtime. That is exactly how Justin's account ended up resting screens from 09:57.`,
  )
} else if (!/onBlur=\{/.test(card) || !/draftStart/.test(card)) {
  problems.push(
    `${CARD} no longer holds the time picker's value until the field is let go, so a half scrolled time can be written as though it were chosen`,
  )
} else {
  ok.push('a bedtime is written when the field is let go, never while the picker is being scrolled')
}

// ── 3. AND THERE IS A WAY BACK ──────────────────────────────────────────────
//
// The fix above stops it happening. This is the other half: a family who
// already has a wrong window, or who simply wants the advice back, needs one
// tap rather than a puzzle about what the right number was.
if (card && !/guideBedtime/.test(card)) {
  problems.push(
    `${CARD} no longer offers the window for the child's age, so a parent who has set a wrong bedtime has no way back to the recommendation except guessing it`,
  )
} else if (card) {
  ok.push('a parent can put the age\'s window back in one tap')
}

if (problems.length > 0) {
  console.error('check-screens-rest FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note above DEFAULT_BEDTIME in lib/quests/time-tiers.ts.')
  process.exit(1)
}
console.log('check-screens-rest ok: screens rest an hour before bed, and a tap cannot set it to now')
for (const line of ok) console.log('  ' + line)
