// Is the daily screen guide still a guide, and is the base still below it?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Two numbers now drive every screen on the platform that talks about time: the
// GUIDE, which is the ceiling the evidence in lib/quests/screen-balance supports
// for an age, and the BASE, two thirds of it, which is what a child starts the
// day holding before a single star.
//
// The relationship between them is the whole product argument, and it is the
// kind of thing a well meaning edit breaks without noticing. Nudge BASE_SHARE
// to 1 and the stars stop meaning anything. Nudge it past 1 and the base is
// above the ceiling, so the product recommends more screen than its own
// evidence supports, on a marketing page, next to a citation. Raise a band's
// dailyMins past what the sources say and the citation stops being true.
//
// None of that fails typechecking: they are all just numbers.
//
// It reads the constants as text rather than importing them, because the module
// imports through the @/ alias, which only resolves inside Next.
//
// Usage: node scripts/check-screen-guide.mjs

import { readFileSync } from 'node:fs'

const SRC = readFileSync(new URL('../lib/quests/screen-balance.ts', import.meta.url), 'utf8')

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

// ── THE NUMBERS ─────────────────────────────────────────────────────────────
const bandBlock = SRC.match(/const BAND: Record<string, BandGuide> = \{([\s\S]*?)\n\}/)
const bands = [...(bandBlock?.[1] ?? '').matchAll(/'([\d+-]+)':\s*\{[^}]*dailyMins:\s*(\d+)/g)]
  .map(m => ({ band: m[1], guide: Number(m[2]) }))

const shareM = SRC.match(/export const BASE_SHARE = (\d+)\s*\/\s*(\d+)/)
const share = shareM ? Number(shareM[1]) / Number(shareM[2]) : NaN

check('the age guides were found', bands.length >= 5, bands.map(b => `${b.band}:${b.guide}`).join(' '))
check('BASE_SHARE was found', Number.isFinite(share), String(share))

// ── THE BASE IS A REAL FRACTION OF THE GUIDE ────────────────────────────────
check('the base is below the guide', share > 0 && share < 1, `share ${share.toFixed(3)}`)
check('the base is at least half the guide', share >= 0.5, 'below half and the day opens on almost nothing')

// The rounding in baseDailyMinutes, reproduced so the assertions below are
// about the number a family actually sees.
const baseOf = guide => Math.round((guide * share) / 5) * 5

for (const { band, guide } of bands) {
  const base = baseOf(guide)
  check(`${band}: base ${base} is under the guide ${guide}`, base < guide)
  check(`${band}: base ${base} lands on a round five`, base % 5 === 0)
}

// ── THE GAP HAS TO BE A REAL DAY'S WORK, AND NO MORE ────────────────────────
//
// Five minutes a star is the shipped default (STAR_MINUTES), and on the live
// product the average job is worth 1.8 stars. So a gap of three to ten stars is
// somewhere between two and six jobs: worth doing, and possible before bed.
// Outside that range the mechanic stops being motivating in one direction or
// stops being reachable in the other.
const STAR_MINUTES = 5
for (const { band, guide } of bands) {
  const stars = (guide - baseOf(guide)) / STAR_MINUTES
  check(`${band}: the gap is ${stars} stars, a real day and not a fantasy`, stars >= 3 && stars <= 10)
}

// ── WE NEVER SUGGEST MORE THAN IS ACTUALLY RECORDED ─────────────────────────
//
// Ofcom Children's Passive Online Measurement, 2026 wave: eight to fourteens
// average 3h36m a day on phone, tablet and computer. The point of the product
// is to sit below what is happening, so if a guide ever climbs past the
// measured average we have quietly become a description instead of a plan.
const OFCOM_2026_AVERAGE_MINS = 216
for (const { band, guide } of bands) {
  check(`${band}: the guide ${guide} stays under the recorded ${OFCOM_2026_AVERAGE_MINS}`, guide < OFCOM_2026_AVERAGE_MINS)
}

// ── THE CEILING IS STILL A CEILING ──────────────────────────────────────────
//
// dayAllowance caps earned minutes at the gap. Without the cap a child rich in
// stars could be recommended four hours because they tidied their room a lot,
// which is the exact failure the guide exists to prevent.
check(
  'dayAllowance still caps what stars can add at the guide',
  /Math\.min\(earnedMins,\s*guide - base\)/.test(SRC),
  'the cap in dayAllowance',
)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
