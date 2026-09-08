import type { WorryIconName } from '@/components/onboarding/WorryIcon'

// What a parent is asked at the end of setup, and the single place it is said.
//
// ── WHY IT IS OUT HERE, AND NOT IN THE WIZARD ───────────────────────────────
//
// The same reason lib/pathway/challenge-labels.ts is: buried inside the
// onboarding page this list could only be read by a browser with a session, so
// nothing could check it and nothing could draw it anywhere else. Out here it
// has one type import and no runtime imports, so scripts/check-focus-labels.mjs
// reads it, /dev/worries draws it, and the wizard and the fixture can never
// drift into showing different questions.
//
// ── THE RULE FOR ADDING ONE ─────────────────────────────────────────────────
//
// Every id here needs, in the SAME commit:
//   1. a slug in ONBOARDING_TO_SLUG (lib/concerns/baseline), or the tick never
//      becomes a concern and the family's first check in is empty
//   2. a label in that file's LABEL, or the check in row is named after a slug
//   3. a label in CHALLENGE_LABELS (lib/pathway/challenge-labels), or the
//      focus strip on Home silently stops rendering for that family
//
// All three have been missed before, each time silently. The guard script
// exists because of it: run `node scripts/check-focus-labels.mjs`.
//
// ── THE ORDER ───────────────────────────────────────────────────────────────
//
// The four every house recognises first, so the grid reads as "yes, that is
// us" before it reads as a menu, then the three that arrive as a child gets
// older, then the one nobody wants to say out loud. something_else is last and
// is deliberately unmapped: a catch all is a picker, not a thing anybody can
// honestly give five stars to.

export type Worry = {
  id: string
  label: string
  icon: WorryIconName
  /** The pastel behind the drawing. Plate colour only, never the card fill. */
  tint: string
}

export const WORRIES: Worry[] = [
  { id: 'wont_put_down', label: 'Will not put it down', icon: 'wont_put_down', tint: 'var(--stage-3-bold)' },
  { id: 'bedtime_screens', label: 'Bedtime screens', icon: 'bedtime_screens', tint: 'var(--stage-5-bold)' },
  { id: 'mood_after_screens', label: 'Mood after screens', icon: 'mood_after_screens', tint: 'var(--stage-1-bold)' },
  { id: 'controller_fights', label: 'Controller fights', icon: 'controller_fights', tint: 'var(--stage-2-bold)' },
  { id: 'morning_tv', label: 'Morning TV', icon: 'morning_tv', tint: 'var(--stage-1-bold)' },
  { id: 'asking_for_phone', label: 'Asking for a phone', icon: 'asking_for_phone', tint: 'var(--stage-2-bold)' },
  { id: 'social_media', label: 'Social media', icon: 'social_media', tint: 'var(--stage-4-bold)' },
  { id: 'ai_chatbots', label: 'AI chatbots', icon: 'ai_chatbots', tint: 'var(--stage-5-bold)' },
  { id: 'seen_something', label: 'Seeing things they should not', icon: 'seen_something', tint: 'var(--stage-3-bold)' },
  { id: 'something_else', label: 'Something else', icon: 'something_else', tint: 'var(--tint-sage)' },
]

/** The picker, not a worry: it has no slug, so it is never handed back as one. */
export const CATCH_ALL_ID = 'something_else'

/** Where the ticks live between page loads, so a dropped tab loses nothing. */
export const WORRIES_KEY = 'gc_setup_challenges'

/** The ticked ones, in the order they were ticked, minus the catch all. */
export function namedWorries(ids: string[]): Worry[] {
  return ids
    .map(id => WORRIES.find(w => w.id === id))
    .filter((w): w is Worry => w !== undefined && w.id !== CATCH_ALL_ID)
}
