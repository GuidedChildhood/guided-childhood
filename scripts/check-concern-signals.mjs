// Does a concern a family raised actually reach a shelf of scripts?
//
// Justin, 11 August 2026, on his recommended card reading "They have told you
// they are gay, bi or trans" while his own open concerns were morning screen
// time, ending screen time and gaming.
//
// The fixtures below are not invented. Every slug in this file was read off the
// live concerns table that morning, which is the only reason the gap was
// visible at all: the fixed vocabulary in CONCERN_TO_CATEGORY and the
// vocabulary the product actually writes had drifted apart for months without
// anything failing.
//
// Usage: node --experimental-strip-types scripts/check-concern-signals.mjs

import { categoryForConcern, CONCERN_TO_CATEGORY } from '../lib/content/signal-map.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const isCat = (slug, label, want) =>
  check(`${slug} points at ${want}`, categoryForConcern(slug, label) === want,
    `got ${categoryForConcern(slug, label)}`)

// ── The Right Now keys, the loudest signal on the platform ──────────────────
//
// rightnow-bedtime and rightnow-something-else led the whole concerns table on
// nine flags each, ahead of every mapped slug, and none of them scored.
isCat('rightnow-tv-off', 'TV or screen turned off', 'screen-time')
isCat('rightnow-phone-handover', 'Phone handover fight', 'screen-time')
isCat('rightnow-bedtime', 'Bedtime battle', 'screen-time')
isCat('rightnow-wont-get-up', 'Will not get up, late night before', 'screen-time')
isCat('rightnow-morning-tv', 'Morning TV, will not get ready', 'screen-time')
isCat('rightnow-sibling-fight', 'Sibling fight over device', 'screen-time')
isCat('rightnow-homework', 'Homework refusal', 'screen-time')

// The two that mean "not one of the seven" carry no fixed category, so they
// have to be read from the words the parent actually typed.
check('rightnow-something-else is not pinned to a category by its slug',
  !('rightnow-something-else' in CONCERN_TO_CATEGORY))
isCat('rightnow-custom', 'using switch too much', 'gaming')
isCat('rightnow-custom', 'wont get off the tablet', 'screen-time')

// ── The free text slugs DiGi invents mid conversation ───────────────────────
//
// Three of these are the words "screen time" with the hyphen in a different
// place, and all three scored zero.
isCat('morning-screen-time', 'Morning screen time', 'screen-time')
isCat('screen-time-endings', 'Ending screen time', 'screen-time')
isCat('after-school-tv', 'After school TV', 'screen-time')
isCat('online-safety', 'Online safety', 'staying-safe')
isCat('ai-deepfake-literacy', 'AI and deepfakes', 'school-and-ai')
isCat('evening-neediness', 'Evening neediness', 'mood-confidence')
isCat('open-communication-teen', 'Talking to a teenager', 'mood-confidence')
// Sleep wins over mood when a slug carries both, which is the same judgement
// the exact table makes for the bare slug 'sleep'. Written down because the
// first version of the keyword list got this backwards: mood matched first and
// a family whose sleep had gone would have been offered a confidence script.
isCat('sleep-mood-dip', 'Sleep and mood', 'screen-time')

// Nothing, and that is the right answer rather than a gap. "Very active child"
// is not a screen worry, a mood worry or a safety worry, and filing it as one
// to avoid an empty result would put a wrong script in front of a parent. It
// falls through to the family's other signals, which is what should happen.
check('a real concern that is not about any of our eight shelves scores nothing',
  categoryForConcern('high-energy-activity', 'Very active child') === null,
  String(categoryForConcern('high-energy-activity', 'Very active child')))

// ── The exact table still wins, because it holds the judgements ─────────────
//
// A keyword pass would send both of these somewhere reasonable and wrong.
// Sleep belongs in screen time on this platform because a sleep problem is
// almost always a device in a bedroom, and friendship belongs in social media
// because at these ages falling out happens in group chats.
isCat('sleep', 'Staying asleep', 'screen-time')
isCat('friendship', 'Friendship trouble', 'social-media')
isCat('phone_street', 'Phones while walking', 'staying-safe')

// ── Safety outranks mood, which is the one ordering that matters ────────────
//
// A grooming worry filed as a mood worry hands a frightened parent a script
// about confidence.
isCat('worried-about-stranger-messages', 'Worried about stranger messages', 'staying-safe')

// ── Silence beats a guess ───────────────────────────────────────────────────
check('a slug with no recognisable words scores nothing',
  categoryForConcern('zzz-qqq', '') === null,
  String(categoryForConcern('zzz-qqq', '')))
check('and an empty concern scores nothing',
  categoryForConcern('', null) === null)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
