// The clean single character intro clips: a Planet Friend doing a cheerful
// little move on a soft cream background, animated from the character art in
// stage-characters so the films match the family everywhere. The lesson intro
// plays one with a typed speech bubble. These replace the old DiGi Squad kids.
// The three slots keep their names so introCharacterFor stays unchanged;
// adding a character is a data entry here, never a code change.

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export type IntroCharacter = {
  key: string
  clip: string
  line: string
  accent: string
}

export const INTRO_CHARACTERS: Record<string, IntroCharacter> = {
  // Orbit, the explorer, leads the screen and gaming lessons.
  football: {
    key: 'football',
    clip: CDN + 'hf_20260723_193939_2cf82ba4-819a-46f7-80a7-da7d97765a73.mp4',
    line: 'Ready to be the boss of your screen? Let us learn the trick together.',
    accent: '#4C9FD6',
  },
  // Bloop, creative and clever, for the everyday lessons.
  dance: {
    key: 'dance',
    clip: CDN + 'hf_20260723_193941_51b5a9bf-2e6e-4499-8eab-c22442f18ddf.mp4',
    line: 'Yay, you came back! Today is going to be brilliant. Let us go.',
    accent: '#7CB342',
  },
  // Pebble, full of wonder, cheers the rest.
  celebrate: {
    key: 'celebrate',
    clip: CDN + 'hf_20260723_193943_c175c26c-8f2d-4b14-addf-a51bec570f4a.mp4',
    line: 'You are doing so well. One more brilliant thing to learn, come on!',
    accent: '#E6B93E',
  },
}

// Choose a character for a lesson. Explicit key wins; otherwise a gentle
// pick from the title so screen and gaming lessons get the footballer and
// everything else alternates between the dancer and the celebration leap.
export function introCharacterFor(key: string | undefined, title: string): IntroCharacter {
  if (key && INTRO_CHARACTERS[key]) return INTRO_CHARACTERS[key]
  const t = title.toLowerCase()
  if (/screen|game|gaming|boss|time|device|phone/.test(t)) return INTRO_CHARACTERS.football
  // Deterministic alternation by title length, so it is stable per lesson.
  return title.length % 2 === 0 ? INTRO_CHARACTERS.dance : INTRO_CHARACTERS.celebrate
}
