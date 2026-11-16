import type { WorryIconName } from '@/components/onboarding/WorryIcon'
import type { ChallengeId } from '@/lib/content/stages'

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
  /**
   * What we bring for it, in five or six words, under the label.
   *
   * Justin, 16 November 2026: make it clear we drive the solutions and the
   * advice, and that the question is not off putting. A grid of problems on
   * its own reads as a list of things going wrong in your house. Each tile now
   * says the problem in the parent's words and, under it, what changes. Every
   * line is the short form of that worry's answer in lib/content/proof.ts, so
   * nothing here promises more than the result page then delivers.
   */
  promise: string
}

export const WORRIES: Worry[] = [
  { id: 'wont_put_down', label: 'Coming off screens', icon: 'wont_put_down', tint: 'var(--stage-3-bold)', promise: 'A calm ending, not a nightly row' },
  { id: 'asking_for_phone', label: 'Asking for a phone', icon: 'asking_for_phone', tint: 'var(--stage-2-bold)', promise: 'Know when they are truly ready' },
  { id: 'game_chat', label: 'Who they talk to in games', icon: 'game_chat', tint: 'var(--stage-2-bold)', promise: 'Safe friends lists, set together' },
  { id: 'seen_something', label: 'What they come across online', icon: 'seen_something', tint: 'var(--stage-3-bold)', promise: 'The words if they see something' },
  { id: 'social_media', label: 'Social media', icon: 'social_media', tint: 'var(--stage-4-bold)', promise: 'Ready for the feed before it arrives' },
  { id: 'bedtime_screens', label: 'Bedtime screens', icon: 'bedtime_screens', tint: 'var(--stage-5-bold)', promise: 'Screens out of bedrooms, no war' },
  { id: 'group_chats', label: 'Group chats', icon: 'group_chats', tint: 'var(--stage-1-bold)', promise: 'Calm rules for WhatsApp and groups' },
  { id: 'getting_round', label: 'They get round the rules', icon: 'getting_round', tint: 'var(--stage-4-bold)', promise: 'A plan they help write, so it holds' },
  { id: 'homework_screens', label: 'Homework on screens', icon: 'homework_screens', tint: 'var(--stage-1-bold)', promise: 'School work and free time kept apart' },
  { id: 'endless_youtube', label: 'Endless YouTube', icon: 'endless_youtube', tint: 'var(--stage-3-bold)', promise: 'Autoplay off, and a clear finish' },
  { id: 'game_spending', label: 'Spending in games', icon: 'game_spending', tint: 'var(--stage-2-bold)', promise: 'Pocket money rules that stick' },
  { id: 'ai_chatbots', label: 'AI chatbots', icon: 'ai_chatbots', tint: 'var(--stage-5-bold)', promise: 'Safe, smart use, by age' },
  { id: 'something_else', label: 'Something else', icon: 'something_else', tint: 'var(--tint-sage)', promise: 'Tell us, and we cover it too' },
]

// ── FOLDED, NOT DELETED (16 November 2026) ──────────────────────────────────
//
// The grid now follows what UK parents raise most (plans/2026-11-16-worry-
// question-top-12.md). These three are no longer offered: parents describe
// controller fights and the mood after as the switch off fight itself, and
// morning TV only bites at 4 to 7 with parents split on it. Every family who
// already picked one keeps it: the label, slug, answer, check in row and focus
// strip all still resolve, because every lookup below reads ALL_WORRIES.
export const RETIRED_WORRIES: Worry[] = [
  { id: 'mood_after_screens', label: 'Mood after screens', icon: 'mood_after_screens', tint: 'var(--stage-1-bold)', promise: 'See the pattern, not a hunch' },
  { id: 'controller_fights', label: 'Controller fights', icon: 'controller_fights', tint: 'var(--stage-2-bold)', promise: 'The timer calls time, not you' },
  { id: 'morning_tv', label: 'Morning TV', icon: 'morning_tv', tint: 'var(--stage-1-bold)', promise: 'Out of the door without the telly' },
]

/** Offered and retired together: what any saved answer can resolve to. */
export const ALL_WORRIES: Worry[] = [...WORRIES, ...RETIRED_WORRIES]

/** The picker, not a worry: it has no slug, so it is never handed back as one. */
export const CATCH_ALL_ID = 'something_else'

/** Where the ticks live between page loads, so a dropped tab loses nothing. */
export const WORRIES_KEY = 'gc_setup_challenges'

/** The ticked ones, in the order they were ticked, minus the catch all. */
export function namedWorries(ids: string[]): Worry[] {
  return ids
    .map(id => ALL_WORRIES.find(w => w.id === id))
    .filter((w): w is Worry => w !== undefined && w.id !== CATCH_ALL_ID)
}

// ── WHICH PATHWAY CONTENT A WORRY OPENS ─────────────────────────────────────
//
// The nine worries above are the PARENT'S words. ChallengeId is a different
// thing wearing similar clothes: it is the routing key every stage's
// challengeActions is written against, plus lib/pathway/recommend and
// daily-tasks. Six of them, authored by hand, one paragraph per stage per id.
//
// Widening that type to nine would mean writing forty five new paragraphs
// before a parent could tick a tile, so the two vocabularies stay separate and
// this is the join. The parent only ever sees their own words; the pathway
// only ever sees a key it has content for.
//
// Where two worries share a key that is not laziness, it is the truth: bedtime
// screens, morning TV and coming off screens are three faces of the same
// pathway work, and the parent's own words are what comes back on the reveal
// and the check in, so nothing they said is flattened on screen.
//
// something_else lands on start_conversation deliberately. A parent who could
// not find their worry in nine tiles is, more often than not, a parent who
// does not know how to open the subject, and that is content we have.
export const WORRY_TO_CHALLENGE: Record<string, ChallengeId> = {
  wont_put_down: 'screens_takeover',
  bedtime_screens: 'screens_takeover',
  morning_tv: 'screens_takeover',
  mood_after_screens: 'mood_changes',
  controller_fights: 'gaming',
  asking_for_phone: 'asking_for_phone',
  social_media: 'asking_for_phone',
  ai_chatbots: 'online_safety',
  seen_something: 'online_safety',
  game_chat: 'online_safety',
  group_chats: 'asking_for_phone',
  getting_round: 'start_conversation',
  homework_screens: 'screens_takeover',
  endless_youtube: 'screens_takeover',
  game_spending: 'gaming',
  something_else: 'start_conversation',
}

/** The pathway key for the worry a parent said mattered most. */
export function challengeFor(worryId: string | null | undefined): ChallengeId | null {
  if (!worryId) return null
  return WORRY_TO_CHALLENGE[worryId] ?? null
}

/** The parent's own words for one worry, for reading back to them. */
export function worryLabel(worryId: string): string {
  return ALL_WORRIES.find(w => w.id === worryId)?.label ?? ''
}

// ── THE SIX IDS THE QUIZ USED TO ASK IN ─────────────────────────────────────
//
// Answers saved before 9 September 2026, in localStorage and in rows already
// written, carry the old CHALLENGE_OPTIONS ids. This carries them forward onto
// the tile they would have picked today, so a parent part way through the
// funnel when this shipped loses nothing.
//
// Two of these used to land on something_else, which is unmapped, so a parent
// who said their worry was the phone or online safety had it quietly dropped
// on the way in and got the stock two instead. Both have a tile of their own
// to land on now.
export const LEGACY_TO_WORRY: Record<string, string> = {
  screens_takeover: 'wont_put_down',
  mood_changes: 'mood_after_screens',
  gaming: 'controller_fights',
  online_safety: 'seen_something',
  start_conversation: 'something_else',
  asking_for_phone: 'asking_for_phone',
}

/** Ticks from either generation of the question, as live worry ids, deduped. */
export function toWorryIds(ids: string[]): string[] {
  const known = new Set(ALL_WORRIES.map(w => w.id))
  const out: string[] = []
  for (const id of ids) {
    const worry = known.has(id) ? id : LEGACY_TO_WORRY[id]
    if (worry && !out.includes(worry)) out.push(worry)
  }
  return out
}
