// The clean single character intro clips (no busy classroom, just the
// character doing their signature move on a dark stadium background) that
// the lesson intro plays with a typed speech bubble. These are the DiGi
// Squad kids, distinct from DiGi the star; using them here is on brief
// (JP wanted the football boy and the dancing girl, not the abstract
// star). Adding a character is a data entry here, never a code change.

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export type IntroCharacter = {
  key: string
  clip: string
  line: string
  accent: string
}

export const INTRO_CHARACTERS: Record<string, IntroCharacter> = {
  football: {
    key: 'football',
    clip: CDN + 'hf_20260617_105245_a28311bc-06fc-4264-ad15-ccea549d68f5.mp4',
    line: 'Ready to be the boss of your screen? Let us learn the trick together.',
    accent: 'var(--terracotta)',
  },
  dance: {
    key: 'dance',
    clip: CDN + 'hf_20260617_105251_457b92ac-1105-43cf-af8f-584527ecf171.mp4',
    line: 'Yay, you came back! Today is going to be brilliant. Let us go.',
    accent: 'var(--terracotta)',
  },
  celebrate: {
    key: 'celebrate',
    clip: CDN + 'hf_20260617_105248_4641ac49-fabf-4dba-9efa-bd470fcfbe85.mp4',
    line: 'You are doing so well. One more brilliant thing to learn, come on!',
    accent: 'var(--terracotta)',
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
