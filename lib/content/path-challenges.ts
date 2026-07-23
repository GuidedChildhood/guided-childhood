// The characters hiding along the child's path, and the surprises behind
// them. Tapping a character reveals a small challenge, an extra way to earn
// stars beyond the set jobs: surprise your grown up with an unasked job, a
// craft, a book, the kitchen, the bedroom, a kind thing. One character keeps
// the school quiz behind them instead. The day rotates who holds what, so
// the path has something fresh to find every day without any storage.

import { characterByKey } from '@/lib/content/stage-characters'

export type PathCharacter = { key: string; name: string; img: string }

// The Planet Friends hide along the path now, drawn from the one source of
// truth as transparent cut outs so they float clean like DiGi.
const onPath = (key: string): PathCharacter => {
  const c = characterByKey(key)
  return { key, name: c?.name ?? key, img: c?.cutout ?? '' }
}

export const PATH_CHARACTERS: PathCharacter[] = [onPath('orbit'), onPath('nova'), onPath('bloop')]

export type PathChallenge = {
  emoji: string
  title: string
  body: string
  // Where acting on it happens: pitch it to the grown up as a quest, or it
  // is simply a do it now dare with the stars coming through the usual jobs.
  cta: string
}

export const PATH_CHALLENGES: PathChallenge[] = [
  {
    emoji: '🎁', title: 'Surprise your grown up',
    body: 'Pick a job nobody asked you to do and just do it. Then watch their face. Pitch it as a quest first if you want the stars too.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '✂️', title: 'Make something real',
    body: 'Paper, cardboard, pens, anything. Twenty minutes of making beats twenty minutes of watching. Show your grown up what you made.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '📚', title: 'Read a book today',
    body: 'Twenty minutes lost in a book is one of the biggest star jobs there is. Find it on your list.',
    cta: 'See my jobs',
  },
  {
    emoji: '🍳', title: 'Kitchen helper',
    body: 'Ask what is for dinner and help make it. Chefs who help earn stars, and dinner tastes better when you made it.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '🛏️', title: 'Bedroom blitz',
    body: 'Five minutes, everything off the floor, race the clock. Blitzers can pitch it for stars.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '💛', title: 'The secret kind thing',
    body: 'Do one kind thing for someone in your house and do not tell them it was you. See how long it takes them to notice.',
    cta: 'See my jobs',
  },
]

export function challengeFor(dayIndex: number, characterIndex: number): PathChallenge {
  return PATH_CHALLENGES[(dayIndex + characterIndex * 2) % PATH_CHALLENGES.length]
}
