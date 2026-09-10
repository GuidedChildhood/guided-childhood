// What a parent types becomes something we can print for the next five years.
//
// Justin, 10 September 2026: "they can free type in Something else and can have
// spelling mistakes and that carries through every time we reference it."
//
// So this holds the three promises lib/concerns/normalise makes:
//
//   1. Free text that IS one of our worries lands on that worry's slug, with
//      our spelling, so it shares history and scripts instead of being a lonely
//      one off with a typo in the title.
//   2. Free text that is genuinely their own keeps their words. Tidied, never
//      corrected: "Ollie's Discord" is not a mistake.
//   3. A near miss does not become a wrong match. One edit is a slip. Two is a
//      guess, and a guess here files a parent's worry under something they
//      never said.
//
// Usage: node --experimental-strip-types scripts/check-worry-normalise.mjs

import { resolveWorry, matchWorry, tidyWorry } from '../lib/concerns/normalise.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const slugOf = s => resolveWorry(s).slug
const labelOf = s => resolveWorry(s).label

// ── 1. Their words, our worry ───────────────────────────────────────────────
const KNOWN = [
  ['wont get off fortnite', 'controller-fights'],
  ['Xbox every night', 'controller-fights'],
  ['tiktok all evening', 'social-media'],
  ['snapchat streaks', 'social-media'],
  ['always on her phone', 'phones-and-messaging'],
  ['wont sleep, on it in bed', 'bedtime-screens'],
  ['moody after screens', 'mood-after-screens'],
  ['chatgpt doing his homework', 'ai-chatbots'],
  ['saw something violent', 'seen-something'],
  ['glued to it', 'wont-put-down'],
]
for (const [typed, slug] of KNOWN) {
  check(`"${typed}" is ${slug}`, slugOf(typed) === slug, `got ${slugOf(typed)}`)
}
check('and it carries OUR spelling, not theirs',
  labelOf('tiktok all evening') === 'Social media', labelOf('tiktok all evening'))

// ── 2. One slip still lands ─────────────────────────────────────────────────
const TYPOS = [
  ['tikok every night', 'social-media'],
  ['fornite until midnight', 'controller-fights'],
  ['instgram', 'social-media'],
  ['obssessed with it', 'wont-put-down'],
]
for (const [typed, slug] of TYPOS) {
  check(`the typo "${typed.split(' ')[0]}" still finds ${slug}`, slugOf(typed) === slug, `got ${slugOf(typed)}`)
}

// ── 3. A guess is worse than their own words ────────────────────────────────
//
// Two edits out is not a slip, and short words are not safe to edit at all:
// bed and bad, game and gate.
check('two edits away is not a match', matchWorry('tikkak') === null, JSON.stringify(matchWorry('tikkak')))
// "fortnight" is two weeks. It is three edits from the game and it is a word
// parents genuinely use, so matching it would file "back in a fortnight" under
// controller fights.
check('a real word near a brand name is left alone',
  matchWorry('we agreed a fortnight away from it') === null,
  JSON.stringify(matchWorry('we agreed a fortnight away from it')))
check('a short word is never edit matched', matchWorry('bad day') === null, JSON.stringify(matchWorry('bad day')))
check('an unrelated worry stays their own',
  matchWorry('she will not talk to me about any of it') === null)

// ── 4. Their own words are kept, and only tidied ────────────────────────────
check('their own words survive',
  labelOf("Ollie's Discord server") === "Ollie's Discord server", labelOf("Ollie's Discord server"))
check('spaces collapse and edges trim', tidyWorry('  too   much   tv  ') === 'Too much tv')
check('shouting comes down', tidyWorry('WONT LISTEN AT ALL') === 'Wont listen at all')
check('an abbreviation is not shouting', tidyWorry('TV in the morning') === 'TV in the morning')
check('trailing punctuation goes', tidyWorry('help!!!') === 'Help')
check('the first letter goes up', tidyWorry('teeth and tablets') === 'Teeth and tablets')
check('nothing in, nothing out', resolveWorry('   ').slug === '' && resolveWorry('').label === '')
check('the cap holds', tidyWorry('x'.repeat(200)).length === 80)

// ── 5. The slug comes from what we settled on ───────────────────────────────
//
// The whole bug: the slug used to be built from the raw line, so a typo was
// baked into the KEY as well as the label and no later fix could reach it.
check('the slug is kebab and clean', slugOf('Ollie and his DISCORD server!') === 'ollie-and-his-discord-server',
  slugOf('Ollie and his DISCORD server!'))
check('a matched worry never keeps the typed slug',
  slugOf('tikok') === 'social-media', slugOf('tikok'))

// ── 6. The doors it has to be fitted to ─────────────────────────────────────
//
// A normaliser nothing calls is a comment. Read as text, because these are
// server files with imports this script has no business pulling in.
import { readFileSync } from 'node:fs'
const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => (l.trim().startsWith('//') ? '' : l)).join('\n')

const baseline = strip(readFileSync(new URL('../lib/concerns/baseline.ts', import.meta.url), 'utf8'))
check('the signup worry goes through resolveWorry', /resolveWorry\(/.test(baseline))
check('and the raw typed line is no longer the slug',
  !/otherSlug\(/.test(baseline), 'otherSlug is back, so a typo is a database key again')

const picker = strip(readFileSync(new URL('../components/onboarding/WorryPicker.tsx', import.meta.url), 'utf8'))
check('and the parent is told which worry it is kept with',
  /resolveWorry\(/.test(picker) && /matched/.test(picker),
  'filing their words under one of ours silently is how they think we lost it')

console.log(failures === 0 ? '\nall passed' : `\n${failures} failed`)
process.exit(failures === 0 ? 0 : 1)
