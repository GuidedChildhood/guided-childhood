// Maps the challenge a parent picked at signup to the scripts category
// it matches, so that answer stays useful after signup instead of being
// read once on the quiz result screen and never again.
//
// Keys cover both generations of challenge ids: the original starter-pack
// quiz set (screens_takeover, mood_changes, ...) and the current onboarding
// set (morning_tv, wont_put_down, ...). Values must be real categories from
// the scripts seeds: screen-time, online-safety, mental-health, gaming,
// first-device, social-media, relationships, family-rules, cyberbullying,
// identity, body-image, school, ai-technology, daily-moments.
export const CHALLENGE_TO_CATEGORY: Record<string, string> = {
  // Original starter-pack quiz ids
  screens_takeover: 'screen-time',
  mood_changes: 'mental-health',
  gaming: 'gaming',
  online_safety: 'online-safety',
  start_conversation: 'relationships',
  asking_for_phone: 'first-device',
  // Current onboarding ids
  morning_tv: 'screen-time',
  controller_fights: 'gaming',
  wont_put_down: 'screen-time',
  bedtime_screens: 'screen-time',
  mood_after_screens: 'mental-health',
}
