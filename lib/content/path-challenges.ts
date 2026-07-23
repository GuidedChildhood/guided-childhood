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

// The surprise dares: small, real, everyday routines a child can actually do,
// the good habits that build up around the stars. Kept concrete so a child
// always knows exactly what to go and do, and can pitch it to a grown up for a
// star too.
export const PATH_CHALLENGES: PathChallenge[] = [
  {
    emoji: '🛏️', title: 'Make your bed',
    body: 'Straighten your covers and pop your pillow up when you get up. A tidy bed to climb back into tonight.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '🪥', title: 'Brush your teeth before bed',
    body: 'Give your teeth a proper brush before you say goodnight. Two minutes, top and bottom, keeps your smile strong.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '📚', title: 'Read a book before bedtime',
    body: 'Read a book before lights out tonight. A story is a lovely way to wind down, much better than a screen.',
    cta: 'See my jobs',
  },
  {
    emoji: '👕', title: 'Get your clothes ready',
    body: 'Lay out your clothes for tomorrow before bed, so the morning is quick and easy.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '🧺', title: 'Clothes in the laundry basket',
    body: 'Any dirty clothes on the floor go straight in the laundry basket. Quick to do and your room stays tidy.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '🍽️', title: 'Clear your plate',
    body: 'After you eat, take your plate to the kitchen and give it a little rinse. A big helper move.',
    cta: 'Pitch it as a quest',
  },
  {
    emoji: '💛', title: 'A secret kind thing',
    body: 'Do one kind thing for someone in your house and do not tell them it was you. See how long it takes them to notice.',
    cta: 'See my jobs',
  },
]

export function challengeFor(dayIndex: number, characterIndex: number): PathChallenge {
  return PATH_CHALLENGES[(dayIndex + characterIndex * 2) % PATH_CHALLENGES.length]
}
