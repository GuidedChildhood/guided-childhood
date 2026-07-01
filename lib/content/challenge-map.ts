import type { ChallengeId } from './stages'

// Maps the challenge a parent picked in the starter-pack quiz to the
// scripts category it matches, so that answer stays useful after signup
// instead of being read once on the quiz result screen and never again.
export const CHALLENGE_TO_CATEGORY: Record<ChallengeId, string> = {
  screens_takeover: 'screen-habits',
  mood_changes: 'wellbeing',
  gaming: 'gaming',
  online_safety: 'safety',
  start_conversation: 'relationships',
  asking_for_phone: 'first-device',
}
