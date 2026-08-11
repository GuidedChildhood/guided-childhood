// What a family has told us, and what they own, translated into the eight
// script categories.
//
// Kept apart from the recommender because these are editorial judgements, not
// logic. Somebody who knows the library should be able to argue with the line
// that says a friendship worry belongs in social media without reading a
// scoring loop first.
//
// The eight live categories, after migration 151:
//   screen-time, social-media, gaming, staying-safe,
//   mood-confidence, family-rules, school-and-ai, everyday-routines

/**
 * Concern slug to script category.
 *
 * The slugs are the fixed vocabulary DiGi is given when it files a concern
 * during a conversation (see the concern tool in lib/digi/tools.ts). Anything
 * not listed here simply carries no category signal, which is the right
 * failure: it falls back to the other signals rather than guessing.
 */
export const CONCERN_TO_CATEGORY: Record<string, string> = {
  screen_time: 'screen-time',
  // Sleep sits in screen time rather than routines because on this platform a
  // sleep concern is almost always a device in a bedroom, and that is where
  // the scripts for it live.
  sleep: 'screen-time',

  gaming: 'gaming',
  social_media: 'social-media',

  // Friendship trouble at these ages runs through group chats far more often
  // than it runs through the playground, and the words for it are in social
  // media. Falling out is not a mood problem until it has been one for a while.
  friendship: 'social-media',

  mood: 'mood-confidence',
  anxiety: 'mood-confidence',

  safety: 'staying-safe',
  // What they saw. Staying safe holds the "something went wrong online"
  // scripts, which is what a content concern nearly always is.
  content: 'staying-safe',

  school: 'school-and-ai',
  ai: 'school-and-ai',

  // A concern about devices is a concern about the deal around them: who gets
  // one, when, and on what terms.
  devices: 'family-rules',

  siblings: 'everyday-routines',
  routines: 'everyday-routines',

  // ── THE DAILY MOMENT KEYS ────────────────────────────────────────────────
  //
  // The end of day tagger writes the MOMENT KEY straight into concerns.slug,
  // so a moment that is not named here scores nothing and the promise on that
  // screen, "we will show you the right scripts tomorrow", is not kept. Every
  // key that has an obvious home gets one.
  //
  // The five screen moments Justin asked for on 11 August are the ones this
  // matters most for: a parent flagging the handover fight and being handed a
  // script about packed lunches would be worse than being handed nothing.
  come_off: 'screen-time',
  tv_morning: 'screen-time',
  tv_eve: 'screen-time',
  phone_car: 'screen-time',
  phone_out: 'family-rules',
  // Not screen time. A child walking into a road while looking down is a
  // safety conversation, and the words for it are the staying safe ones.
  phone_street: 'staying-safe',

  // The routine tiles, which have been writing unmapped slugs since the tagger
  // shipped. Cheap to fix while the file is open.
  bedtime: 'screen-time',
  homework: 'school-and-ai',
  morning: 'everyday-routines',
  teeth: 'everyday-routines',
  dressed: 'everyday-routines',
  bag: 'everyday-routines',
  lunch: 'everyday-routines',
  dropoff: 'everyday-routines',
  pickup: 'everyday-routines',
  snacks: 'everyday-routines',
  dinner: 'everyday-routines',
  clothes: 'everyday-routines',
  fighting: 'everyday-routines',
}

/**
 * Device kind to the categories that device makes likely.
 *
 * Deliberately generous, and never used to rule anything out. See the comment
 * in getRecommendedScript: a child games on a phone and does homework on a
 * tablet, so these promote and never demote.
 *
 * Kinds are the check constraint on family_devices.kind (migration 106).
 */
export const DEVICE_KIND_TO_CATEGORIES: Record<string, string[]> = {
  // The one device that is a whole social world, so it earns three.
  phone: ['social-media', 'staying-safe', 'screen-time'],
  tablet: ['screen-time', 'staying-safe'],
  // Shared, in a room, and almost always an argument about when it goes off.
  tv: ['screen-time'],
  console: ['gaming'],
  computer: ['school-and-ai', 'gaming'],
}
