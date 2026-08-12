// Does every answer a parent can give at onboarding have words on the pathway?
//
// The focus strip names the one thing a family is working on. Before they have
// flagged a concern, that name comes from the challenge they picked on the way
// in. If the id they picked is missing from the map, the label is empty, the
// strip returns null, and the strip simply is not there. No error, no warning,
// nothing in a log. The only way to find it is to be that family.
//
// That happened: moving the map between files dropped four of the six live ids
// and invented two that nothing writes. This is the check that would have
// caught it in a second, which is why it exists now rather than a comment
// saying "keep these in step".
//
// Usage: node --experimental-strip-types scripts/check-focus-labels.mjs

import { readFileSync } from 'node:fs'
import { CHALLENGE_LABELS } from '../lib/pathway/challenge-labels.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const onboarding = readFileSync(new URL('../app/onboarding/page.tsx', import.meta.url), 'utf8')

// The ids a parent can actually end up with, read from the source of truth
// rather than restated here, because a second copy is the bug all over again.
const challengesBlock = onboarding.match(/const CHARLENGES|const CHALLENGES\s*=\s*\[([\s\S]*?)\]/)
const liveIds = [...(challengesBlock?.[1] ?? '').matchAll(/id:\s*'([a-z_]+)'/g)].map(m => m[1])

const oldBlock = onboarding.match(/const OLD_TO_NEW_CHALLENGE[^{]*\{([\s\S]*?)\}/)
const legacyIds = [...(oldBlock?.[1] ?? '').matchAll(/^\s*([a-z_]+):/gm)].map(m => m[1])

check('the onboarding challenges were found', liveIds.length === 6, `${liveIds.length}: ${liveIds.join(', ')}`)
check('the legacy ids were found', legacyIds.length > 0, legacyIds.join(', '))

// ── EVERY LIVE ID HAS A LABEL ───────────────────────────────────────────────
//
// The one that matters. A parent picks one of these six, and every one of them
// has to produce a strip.
for (const id of liveIds) {
  check(`${id} is in the map`, id in CHALLENGE_LABELS)
}

// something_else is the deliberate exception: it maps to an empty string
// because "Something else" tells a parent nothing. Every other live id must
// carry real words.
for (const id of liveIds.filter(i => i !== 'something_else')) {
  const label = CHALLENGE_LABELS[id] ?? ''
  check(`${id} has words a parent would read`, label.length > 3, `"${label}"`)
}

// ── THE LEGACY IDS STILL RESOLVE ────────────────────────────────────────────
//
// Rows written before OLD_TO_NEW_CHALLENGE still carry the old id, and those
// families should not lose their strip because we renamed something.
for (const id of legacyIds) {
  check(`legacy ${id} still resolves`, id in CHALLENGE_LABELS)
}

// ── AND NOTHING INVENTED ────────────────────────────────────────────────────
//
// A key nothing writes is dead weight that reads as coverage. Both of the two
// invented last time (bedtime, homework) looked entirely plausible sitting in
// the map, which is exactly why they survived review.
const known = new Set([...liveIds, ...legacyIds])
for (const id of Object.keys(CHALLENGE_LABELS)) {
  check(`${id} is an id something actually writes`, known.has(id))
}

// ── THE HOUSE RULE ──────────────────────────────────────────────────────────
for (const [id, label] of Object.entries(CHALLENGE_LABELS)) {
  check(`${id}: no dashes`, !/[-–—]/.test(label), label)
}

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
