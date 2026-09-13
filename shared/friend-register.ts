// WHICH FRIEND, AND HOW IT MOVES.
//
// Two small decisions every lesson surface used to make by hand, or not at
// all, now made in one place so the wall, the beats and the intro agree.
//
// THE REGISTER is the treatment ladder from
// plans/2026-09-07-planet-friends-lesson-animation-system.md: the same cast
// across the scheme, but a Reception class gets a friend that springs and a
// Year 11 class gets one that holds still and lets the words move. It is
// chosen by key stage, never per slide, so a KS4 lesson cannot accidentally
// bounce. The four DSL modules are DiGi only and Still by the row's own
// casting, which is a safeguarding decision and not a style one.
//
// THE CHARACTER is read off the row's cast line, which is free text written
// by a person ("Bloop opens, DiGi closes on staying the maker"). The first
// friend named is the one who carries the lesson; DiGi always closes it
// regardless. "DiGi only" and "DiGi carries the calm register" resolve to
// DiGi, and so does "Pebble with DiGi Junior" resolve to Pebble, because the
// earliest mention wins.

import { CHARACTERS, type CharacterKey } from './schools-curriculum'

export type Register = 'bouncy' | 'playful' | 'level' | 'still'

export function registerFor(keyStage: string | null | undefined): Register {
  switch ((keyStage ?? '').toUpperCase()) {
    case 'EYFS':
    case 'KS1':
      return 'bouncy'
    case 'KS2':
      return 'playful'
    case 'KS3':
      return 'level'
    default:
      return 'still'
  }
}

// The friend a cast line names first, or undefined when it names none, in
// which case the player behaves exactly as it did before the friends
// existed: DiGi closes, nothing else appears.
export function characterKeyFor(castLine: string | null | undefined): CharacterKey | undefined {
  if (!castLine) return undefined
  const t = castLine.toLowerCase()
  let best: { key: CharacterKey; at: number } | undefined
  for (const key of Object.keys(CHARACTERS) as CharacterKey[]) {
    const at = t.indexOf(key)
    if (at >= 0 && (!best || at < best.at)) best = { key, at }
  }
  return best?.key
}
