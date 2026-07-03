// Maps the challenge a parent picked (starter pack quiz or onboarding) to
// the scripts category it matches, so that answer stays useful after signup
// instead of being read once on the quiz result screen and never again.
//
// Two vocabularies feed this map: the original quiz ids (screens_takeover,
// mood_changes...) stored for early users, and the onboarding ids
// (morning_tv, controller_fights...) stored since the DiGi onboarding flow.
// Values must be categories that actually exist in the scripts table:
// first-device, social-media, gaming, cyberbullying, mental-health,
// body-image, identity, ai-technology, family-rules, school, relationships,
// daily-moments. A challenge with no clean match is omitted so matching
// falls back to stage order instead of matching nothing forever.
export const CHALLENGE_TO_CATEGORY: Record<string, string> = {
  // Original quiz ids
  screens_takeover: 'family-rules',
  mood_changes: 'mental-health',
  gaming: 'gaming',
  online_safety: 'cyberbullying',
  start_conversation: 'relationships',
  asking_for_phone: 'first-device',
  // Onboarding ids
  morning_tv: 'family-rules',
  controller_fights: 'gaming',
  wont_put_down: 'family-rules',
  bedtime_screens: 'family-rules',
  mood_after_screens: 'mental-health',
}
