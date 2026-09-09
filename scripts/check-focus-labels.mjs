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

// The ids a parent can actually end up with, read from the source of truth
// rather than restated here, because a second copy is the bug all over again.
//
// They moved out of the wizard into lib/onboarding/worries.ts on 8 September
// 2026, for the same reason the labels below live in their own file: a list
// inside a page can only be read by a browser with a session. The block is
// read to the closing bracket in column one rather than to the first ] it
// meets, because the declaration carries a type annotation containing [].
const worriesFile = readFileSync(new URL('../lib/onboarding/worries.ts', import.meta.url), 'utf8')
const challengesBlock = worriesFile.match(/const WORRIES\b[^=]*=\s*\[([\s\S]*?)\n\]/)
const liveIds = [...(challengesBlock?.[1] ?? '').matchAll(/id:\s*'([a-z_]+)'/g)].map(m => m[1])

const oldBlock = worriesFile.match(/const LEGACY_TO_WORRY[^{]*\{([\s\S]*?)\n\}/)
const legacyIds = [...(oldBlock?.[1] ?? '').matchAll(/^\s*([a-z_]+):/gm)].map(m => m[1])

// Nine worries plus something_else since 8 September 2026. Asserted as a floor
// and not an exact number, so adding a tenth worry does not fail the build for
// the crime of being a tenth worry; the per id checks below are the real test.
check('the onboarding challenges were found', liveIds.length >= 6, `${liveIds.length}: ${liveIds.join(', ')}`)
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
// Rows written before LEGACY_TO_WORRY still carry the old id, and those
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

// ── THE TICK MUST REACH THE CHECK IN ────────────────────────────────────────
//
// The other half of the promise, and the one that has actually broken twice.
// A worry with a tile but no slug in ONBOARDING_TO_SLUG is a tick that goes
// nowhere: no concern row, so the family's first check in opens on "All done
// for today" with nothing on it. Both times, nothing failed and nobody could
// see it. lib/concerns/baseline is read as text for the same reason the labels
// are: no imports, no React, no session.
const baseline = readFileSync(new URL('../lib/concerns/baseline.ts', import.meta.url), 'utf8')
const slugBlock = baseline.match(/const ONBOARDING_TO_SLUG[^=]*=\s*\{([\s\S]*?)\n\}/)
const slugMap = Object.fromEntries(
  [...(slugBlock?.[1] ?? '').matchAll(/^\s*([a-z_]+):\s*'([a-z-]+)'/gm)].map(m => [m[1], m[2]]),
)
const labelBlock = baseline.match(/const LABEL[^=]*=\s*\{([\s\S]*?)\n\}/)
const slugLabels = new Set(
  [...(labelBlock?.[1] ?? '').matchAll(/^\s*'([a-z-]+)':/gm)].map(m => m[1]),
)

check('the slug map was found', Object.keys(slugMap).length > 0, `${Object.keys(slugMap).length} keys`)

// something_else is the one deliberate exception, and it is deliberate in
// lib/concerns/baseline too: a catch all is a picker, not a rateable thing.
for (const id of liveIds.filter(i => i !== 'something_else')) {
  const slug = slugMap[id]
  check(`${id} becomes a concern`, Boolean(slug), slug ?? 'NO SLUG: this tick would go nowhere')
  if (slug) check(`${id} has a name on the check in row`, slugLabels.has(slug), slug)
}

// ── AND THE TICK MUST REACH THE PATHWAY ─────────────────────────────────────
//
// Added 9 September 2026, when the public quiz started asking the worries
// directly instead of its own six. The reveal a parent sees seconds later
// reads stage.challengeActions[challenge], so a worry with no key in
// WORRY_TO_CHALLENGE falls through to the stage's generic action and the
// promise that we matched their answer quietly stops being true. Same failure
// shape as the slug map: silent, and only visible to that family.
const challengeBlock = worriesFile.match(/const WORRY_TO_CHALLENGE[^{]*\{([\s\S]*?)\n\}/)
const challengeMapIds = new Set(
  [...(challengeBlock?.[1] ?? '').matchAll(/^\s*([a-z_]+):/gm)].map(m => m[1]),
)
check('the pathway map was found', challengeMapIds.size > 0, `${challengeMapIds.size} keys`)
for (const id of liveIds) {
  check(`${id} opens a pathway`, challengeMapIds.has(id))
}

// ── AND THE TICK MUST REACH THE SCRIPTS ─────────────────────────────────────
//
// CHALLENGE_TO_CATEGORY filters the recommended scripts. A missing key does
// not error, it matches zero rows and falls through to plain sort order, which
// looks exactly like a parent who has read everything. something_else is the
// deliberate exception: a catch all cannot honestly pick a category.
const mapFile = readFileSync(new URL('../lib/content/challenge-map.ts', import.meta.url), 'utf8')
const catBlock = mapFile.match(/const CHALLENGE_TO_CATEGORY[^{]*\{([\s\S]*?)\n\}/)
const catIds = new Set([...(catBlock?.[1] ?? '').matchAll(/^\s*([a-z_]+):/gm)].map(m => m[1]))
check('the scripts category map was found', catIds.size > 0, `${catIds.size} keys`)
for (const id of liveIds.filter(i => i !== 'something_else')) {
  check(`${id} matches a scripts category`, catIds.has(id))
}

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
