// Maps the challenge a parent picked at signup to the scripts category
// it matches, so that answer stays useful after signup instead of being
// read once on the quiz result screen and never again.
//
// VALUES MUST BE LIVE CATEGORIES. Migration 151 collapsed fourteen category
// values down to eight, and this file did not move with it, so four of the
// eleven answers below pointed at categories that no longer exist in the
// database. A parent who told us at signup that their worry was moods, or
// safety, or a first phone, was matched against nothing: the filter found
// zero rows, fell through to plain sort order, and the promise that we had
// listened quietly stopped being true.
//
// It failed silently, which is why it survived, because a filter matching
// nothing looks exactly like a parent who has already read everything.
//
// The eight live values, and the only ones allowed here:
//   screen-time, social-media, gaming, staying-safe,
//   mood-confidence, family-rules, school-and-ai, everyday-routines
//
// Keys cover both generations of challenge ids: the original starter-pack
// quiz set (screens_takeover, mood_changes, ...) and the current onboarding
// set (morning_tv, wont_put_down, ...).
export const CHALLENGE_TO_CATEGORY: Record<string, string> = {
  // Original starter-pack quiz ids
  screens_takeover: 'screen-time',
  mood_changes: 'mood-confidence',
  gaming: 'gaming',
  online_safety: 'staying-safe',
  // Starting a conversation and asking for a phone both land in family rules,
  // which is where migration 151 put first-device and relationships.
  start_conversation: 'family-rules',
  asking_for_phone: 'family-rules',
  // Current onboarding ids
  morning_tv: 'screen-time',
  controller_fights: 'gaming',
  wont_put_down: 'screen-time',
  bedtime_screens: 'screen-time',
  mood_after_screens: 'mood-confidence',
}
