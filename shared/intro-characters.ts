// The lesson intro clips: a Planet Friend doing a cheerful little move on a
// soft ground, animated from the character art in stage-characters so the
// films match the family everywhere. The lesson intro plays one with a typed
// speech bubble.
//
// KEYED BY THE CAST, NOT BY THE CLIP. Until 13 September 2026 this map was
// keyed by the July slot names (football, dance, celebrate) and a title slide
// named its clip rather than its friend. Two things went wrong with that.
// Eight lessons opened on a friend that was not their cast, because the slot
// a deck was written against in July no longer matched the row's casting.
// And the three newest modules wrote the friend's real name on the title
// slide, which this map had never heard of, so they fell through to the title
// heuristic below and opened on a coin flip. The first slide of a lesson, on
// the wall, is the one that says which friend this is, and it was wrong more
// than a third of the time.
//
// So the keys are now the CharacterKeys the rest of the platform uses, and
// the July names are kept as aliases so nothing already written stops
// playing. DiGi has no clip on purpose: the golden star is drawn in code
// (DigiCharacter) and AnimatedIntro renders it in the frame instead of a
// video, so a DiGi lesson opens on DiGi rather than on whichever friend had
// a film.

import type { CharacterKey } from './schools-curriculum'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export type IntroCharacter = {
  key: CharacterKey
  // Absent for DiGi: the star is drawn, not filmed.
  clip?: string
  line: string
  accent: string
}

export const INTRO_CHARACTERS: Record<CharacterKey, IntroCharacter> = {
  // Pebble, full of wonder, the first safe steps.
  pebble: {
    key: 'pebble',
    clip: CDN + 'hf_20260723_193943_c175c26c-8f2d-4b14-addf-a51bec570f4a.mp4',
    line: 'You are doing so well. One more brilliant thing to learn, come on!',
    accent: '#E6B93E',
  },
  // Bloop, creative and clever, the habits.
  bloop: {
    key: 'bloop',
    clip: CDN + 'hf_20260723_193941_51b5a9bf-2e6e-4499-8eab-c22442f18ddf.mp4',
    line: 'Yay, you came back! Today is going to be brilliant. Let us go.',
    accent: '#7CB342',
  },
  // Orbit, the explorer, the checks and the big questions.
  orbit: {
    key: 'orbit',
    clip: CDN + 'hf_20260723_193939_2cf82ba4-819a-46f7-80a7-da7d97765a73.mp4',
    line: 'Big question today, and by the end you will have your own answer. Let us go.',
    accent: '#4C9FD6',
  },
  // Nova, steady and calm, hosts the KS4 modules, which carry the heaviest
  // topics in the scheme, so the welcome is level rather than bouncy.
  // Generated 30 August 2026 from the stage-characters cutout art, so the
  // film cannot drift off model. Approved by Justin the same day; migration
  // 233 writes the key onto the KS4 and KS5 title slides.
  nova: {
    key: 'nova',
    clip: CDN + 'hf_20260830_005603_cfd531b3-9541-4de5-a5ec-826f8eeea6a1.mp4',
    line: 'Good to see you. Today is one that really matters, so let us take it on together.',
    accent: '#9B72CF',
  },
  // Cosmo, bright and forward looking, hosts the KS5 modules: AI, data
  // rights and the working life ahead.
  cosmo: {
    key: 'cosmo',
    clip: CDN + 'hf_20260830_005603_76794415-8bc1-45e5-ba88-dd47b7d49c14.mp4',
    line: 'Big one today: the tools, your rights, and the road ahead. Let us get you ready.',
    accent: '#E8873C',
  },
  // DiGi, the golden star, drawn in code. The line is the one the pilot
  // lesson's welcome beat says (migration 289), because a guide that opens
  // by calling itself a machine is the AI lessons in one sentence. A title
  // slide can carry its own `line` where a lesson wants it quieter.
  digi: {
    key: 'digi',
    line: 'Hello. I am DiGi. I am a machine, and I am quite good at this. Shall we start?',
    accent: '#C99A28',
  },
}

// The July slot names, so a deck written before 13 September 2026 keeps
// opening on the friend it always did. Migration 296 rewrites the rows to
// the real keys; these stay so a stale row or a hand written deck cannot
// fall through to the heuristic.
const ALIASES: Record<string, CharacterKey> = {
  football: 'orbit',
  dance: 'bloop',
  celebrate: 'pebble',
}

export function isCharacterKey(key: unknown): key is CharacterKey {
  return typeof key === 'string' && key in INTRO_CHARACTERS
}

// Choose a character for a lesson. A real key wins, then an alias, then the
// title heuristic that every deck relied on before the keys existed: screen
// and gaming lessons get Orbit, everything else alternates Bloop and Pebble,
// deterministic by title length so it is stable per lesson.
export function introCharacterFor(key: string | undefined, title: string): IntroCharacter {
  if (isCharacterKey(key)) return INTRO_CHARACTERS[key]
  if (key && ALIASES[key]) return INTRO_CHARACTERS[ALIASES[key]]
  const t = title.toLowerCase()
  if (/screen|game|gaming|boss|time|device|phone/.test(t)) return INTRO_CHARACTERS.orbit
  return title.length % 2 === 0 ? INTRO_CHARACTERS.bloop : INTRO_CHARACTERS.pebble
}
