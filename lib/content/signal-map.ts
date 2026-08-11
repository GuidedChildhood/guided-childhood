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

  // ── THE RIGHT NOW KEYS ───────────────────────────────────────────────────
  //
  // The rescue flow writes `rightnow-<situation>` into concerns.slug, and not
  // one of those slugs has ever been in this map. Across the whole platform
  // they are the LARGEST source of concern flags there is: on 11 August 2026,
  // rightnow-bedtime and rightnow-something-else led the table on nine flags
  // each, ahead of every mapped slug in the file.
  //
  // So the single loudest thing a parent ever does, tapping the red button
  // mid row and telling us exactly what is happening, has been scoring zero in
  // the recommender since the rescue shipped.
  //
  // The categories are not a new judgement. app/api/rightnow/route.ts already
  // holds a category per situation, uses it to pick the rescue script, and then
  // throws it away when it writes the concern. These are the same values, and
  // the two should be changed together.
  'rightnow-wont-get-up': 'screen-time',
  'rightnow-morning-tv': 'screen-time',
  'rightnow-tv-off': 'screen-time',
  'rightnow-phone-handover': 'screen-time',
  'rightnow-bedtime': 'screen-time',
  'rightnow-sibling-fight': 'screen-time',
  'rightnow-homework': 'screen-time',
  // Deliberately absent: rightnow-something-else and rightnow-custom. Both mean
  // "not one of the seven", so pinning either to a category would be inventing
  // a signal. They fall through to the keyword pass below, which reads the real
  // words the parent typed.

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
 * The keyword pass, for slugs nobody wrote down in advance.
 *
 * ── Why a fixed table was never going to be enough ───────────────────────────
 *
 * CONCERN_TO_CATEGORY is a fixed vocabulary, and two of the three things that
 * write to concerns.slug do not use a fixed vocabulary. DiGi files a concern
 * during a conversation and invents the slug from what the parent said, and the
 * Right Now custom box takes whatever they typed. Real rows on 11 August 2026:
 *
 *   morning-screen-time      screen-time-endings      evening-neediness
 *   after-school-tv          open-communication-teen  ai-deepfake-literacy
 *   sleep-mood-dip           online-safety            high-energy-activity
 *
 * Every one of those is a parent telling us something specific and every one
 * scored zero. Three of them are the words "screen time" with a hyphen in a
 * different place.
 *
 * So this is a second pass, not a replacement: the exact table still wins,
 * because it carries editorial judgements that a keyword cannot (friendship
 * belongs in social media, sleep belongs in screen time). This only runs when
 * the table has no answer, and returns null rather than guessing when nothing
 * matches, because a wrong category is worse than no category.
 *
 * ORDER MATTERS. The first rule that matches wins, so the most specific
 * phrases come first and the loosest single words come last.
 */
const CONCERN_KEYWORDS: [RegExp, string][] = [
  // Sleep, first and on its own, because it is the one word that would
  // otherwise be caught by a later rule and land somewhere plausible and wrong.
  // "sleep-mood-dip" reads as mood if the mood rule gets there first, and the
  // judgement in CONCERN_TO_CATEGORY above is explicit that on this platform a
  // sleep problem is a device in a bedroom.
  [/sleep|bed[\s_-]?time|wake|waking|tired|late[\s_-]?night/i, 'screen-time'],
  // Screens, which is most of them and the reason the product exists.
  [/screen[\s_-]?time|screens?\b|tv\b|telly|tablet|ipad|device|handover|hand[\s_-]?over|switch[\s_-]?off|turn[\s_-]?off|youtube|netflix/i, 'screen-time'],
  [/gaming|game[sr]?\b|console|xbox|playstation|roblox|fortnite|minecraft|switch\b/i, 'gaming'],
  [/social[\s_-]?media|instagram|snapchat|tiktok|whatsapp|group[\s_-]?chat|friendship|friends?\b|follow(er|ing)/i, 'social-media'],
  // Anything that is a child at risk goes to staying safe, and it is listed
  // above mood on purpose: a grooming worry filed as a mood worry would hand a
  // parent a script about confidence.
  [/safety|safe\b|stranger|groom|predator|scam|porn|nude|explicit|inappropriate|content|bully|bullied|sextort/i, 'staying-safe'],
  [/school|homework|teacher|revision|exam|\bai\b|chatgpt|deepfake|cheating/i, 'school-and-ai'],
  [/mood|anxi|worry|worried|sad|low\b|confidence|self[\s_-]?esteem|angry|anger|meltdown|emotional|neediness|clingy|communication|talking|withdraw/i, 'mood-confidence'],
  [/rules?|boundar|deal\b|contract|pocket[\s_-]?money|phone[\s_-]?request|first[\s_-]?phone|age[\s_-]?limit/i, 'family-rules'],
  [/sleep|bed(time)?|wake|waking|tired|morning|routine|dinner|meal|snack|teeth|dress|lunch|sibling|fight|chore/i, 'everyday-routines'],
]

/**
 * The category a concern points at: the exact table first, then the words.
 *
 * `label` is the human sentence stored beside the slug, which is often richer
 * than the slug itself ("using seith too much" against rightnow-custom), so
 * both are read.
 */
export function categoryForConcern(slug: string, label?: string | null): string | null {
  const exact = CONCERN_TO_CATEGORY[slug]
  if (exact) return exact
  const text = `${slug} ${label ?? ''}`.replace(/[_-]/g, ' ')
  for (const [re, category] of CONCERN_KEYWORDS) {
    if (re.test(text)) return category
  }
  return null
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
