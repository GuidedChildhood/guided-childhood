// The planet rotation, checked as arithmetic rather than by waiting six weeks.
//
// The card claims three things a parent could catch us on: that it changes
// every week, that it shows all six before it repeats, and that the copy is
// short enough to read in a glance. All three are properties of the data, so
// all three are checkable here.
//
// Usage: node --experimental-strip-types scripts/check-pathway-planets.mjs

import { PLANETS, weekNumber, planetOfTheWeek } from '../lib/pathway/planets.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const day = (iso) => new Date(`${iso}T12:00:00Z`)

// ── THE ANCHOR IS THE MONDAY IT SAYS IT IS ──────────────────────────────────
check('the anchor is a Monday', day('2026-01-05').getUTCDay() === 1)
check('week 0 starts on the anchor', weekNumber(day('2026-01-05')) === 0, String(weekNumber(day('2026-01-05'))))
check('and it is still week 0 on the Sunday', weekNumber(day('2026-01-11')) === 0, String(weekNumber(day('2026-01-11'))))
check('the next Monday is week 1', weekNumber(day('2026-01-12')) === 1, String(weekNumber(day('2026-01-12'))))

// ── IT CHANGES EVERY WEEK, AND ONLY ON THE WEEK BOUNDARY ────────────────────
//
// The point of the feature. A planet that held for two weeks would be a parent
// opening the app on a Tuesday and seeing the same card they ignored last week.
{
  let held = 0
  let changedMidWeek = 0
  for (let w = 0; w < 40; w++) {
    const monday = new Date(day('2026-01-05').getTime() + w * 7 * 86400000)
    const nextMonday = new Date(monday.getTime() + 7 * 86400000)
    if (planetOfTheWeek(monday) === planetOfTheWeek(nextMonday)) held++
    // Every day inside the week must give the same answer as its Monday.
    for (let d = 1; d < 7; d++) {
      const inWeek = new Date(monday.getTime() + d * 86400000)
      if (planetOfTheWeek(inWeek) !== planetOfTheWeek(monday)) changedMidWeek++
    }
  }
  check('a different planet every single week over 40 weeks', held === 0, `${held} repeats`)
  check('and it never changes mid week', changedMidWeek === 0, `${changedMidWeek} mid week changes`)
}

// ── ALL SIX SHOW BEFORE ANY REPEATS ─────────────────────────────────────────
{
  const seen = new Set()
  for (let w = 0; w < PLANETS.length; w++) {
    seen.add(planetOfTheWeek(new Date(day('2026-01-05').getTime() + w * 7 * 86400000)))
  }
  check('every planet gets a turn in one cycle', seen.size === PLANETS.length, `${seen.size} of ${PLANETS.length}`)
}

// ── A CLOCK SET WRONG STILL RENDERS A CARD ──────────────────────────────────
//
// A date before the anchor gives a negative week number, and a plain modulo in
// JavaScript would return a negative index. PLANETS[-2] is undefined, and the
// card would read a title off undefined and take the whole pathway down.
for (const iso of ['2025-12-01', '2024-06-15', '2020-01-01']) {
  const idx = planetOfTheWeek(day(iso))
  check(`${iso} still lands on a real planet`, Number.isInteger(idx) && idx >= 0 && idx < PLANETS.length, String(idx))
}

// ── THE COPY IS SHORT ENOUGH TO BE READ IN A GLANCE ─────────────────────────
//
// Four to six words is the Wanderlog heading, and the reason is the two second
// glance: past six words a parent is reading rather than deciding. The line
// under it gets one sentence. Both are easy to creep past later, so they are
// held here rather than in a comment.
for (const p of PLANETS) {
  const words = p.title.trim().split(/\s+/).length
  check(`${p.key}: heading is 4 to 6 words`, words >= 4 && words <= 6, `${words} words, "${p.title}"`)
  check(`${p.key}: one line under it`, p.line.length <= 58, `${p.line.length} chars`)
  check(`${p.key}: goes somewhere in the app`, p.href.startsWith('/dashboard/'), p.href)
  check(`${p.key}: the drawing has words for a screen reader`, p.alt.length > 10)
}

// ── THE HOUSE RULE ──────────────────────────────────────────────────────────
//
// No dashes in any copy, ever. Hyphenated words included: this is parent facing
// copy and there is always a way to write it without one.
for (const p of PLANETS) {
  const text = `${p.title} ${p.line} ${p.alt}`
  check(`${p.key}: no dashes`, !/[-–—]/.test(text), text)
}

// ── AND THEY ARE ALL DIFFERENT THINGS ───────────────────────────────────────
check('no two planets point at the same page', new Set(PLANETS.map(p => p.href)).size === PLANETS.length)
check('no two planets share a key', new Set(PLANETS.map(p => p.key)).size === PLANETS.length)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
