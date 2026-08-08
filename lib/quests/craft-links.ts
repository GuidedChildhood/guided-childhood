// Which quests are a game you can actually open, and where it lives.
//
// Justin, 8 August 2026, on a job row reading "Play Goodnight Screens pairs":
// "Play good night screens should take you there."
//
// It went nowhere, because a job row is a plain div. That is right for most of
// them: "put your shoes away" has no page and never will. But some jobs ARE a
// thing we made, sitting on the game pack page a tap away, and naming one at a
// parent without opening it is the app knowing something and not saying it.
//
// Same shape as kidLessonForQuestTitle in kid-lessons.ts, deliberately: match
// on the title, return null when there is no clean match, and let the caller
// decide what to do with a hit. A quest whose title we do not recognise stays a
// plain row rather than becoming a link to a guess.

/** Matches the BandKey union in CraftPack, which is what decides what renders. */
export type CraftBand = 'young' | 'middle' | 'older' | 'family'

export type CraftSheet = { title: string; slug: string; band: CraftBand }

/**
 * The nine sheets in the game pack, in page order.
 *
 * Titles here have to match the `title` prop on each Sheet in CraftPack.tsx,
 * because that is what a quest gets named after when a parent adds one. Slugs
 * are the anchors on those sheets.
 */
export const CRAFT_SHEETS: CraftSheet[] = [
  { title: 'Robot Parent', slug: 'robot-parent', band: 'young' },
  { title: 'My Screen Rules door poster', slug: 'screen-rules-poster', band: 'young' },
  { title: 'Goodnight Screens pairs', slug: 'goodnight-screens-pairs', band: 'young' },
  { title: 'Password Monster', slug: 'password-monster', band: 'middle' },
  { title: 'The Feed: snakes and ladders', slug: 'the-feed-snakes-and-ladders', band: 'middle' },
  { title: 'Advert Detective Bingo', slug: 'advert-detective-bingo', band: 'middle' },
  { title: 'Deepfake or Real: the family quiz', slug: 'deepfake-or-real', band: 'older' },
  { title: 'Algorithm Architect', slug: 'algorithm-architect', band: 'older' },
  { title: 'Device free dinner cards', slug: 'device-free-dinner-cards', band: 'family' },
]

/**
 * Verbs a quest title picks up on its way to a parent's board.
 *
 * A craft becomes a job called "Play Goodnight Screens pairs" or "Make Password
 * Monster", so an exact title match finds nothing. Stripping the verb is the
 * whole trick, and it is a short closed list rather than a regex because a
 * quest called "Play fighting is not allowed" should match nothing at all.
 */
const LEAD_VERBS = ['play', 'make', 'print', 'do', 'build']

function normalise(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/, '')
}

/**
 * The game pack sheet a quest title names, or null.
 *
 * Matches the full title first, then the title with a leading verb removed.
 * Never a fuzzy or partial match: landing a parent on the wrong sheet is worse
 * than leaving the row as plain text, because it looks like the app understood
 * and then took them somewhere unrelated.
 */
export function craftForQuestTitle(title: string | null | undefined): CraftSheet | null {
  const t = normalise(title ?? '')
  if (!t) return null

  const exact = CRAFT_SHEETS.find(c => normalise(c.title) === t)
  if (exact) return exact

  const verb = LEAD_VERBS.find(v => t.startsWith(`${v} `))
  if (!verb) return null
  const rest = t.slice(verb.length + 1)
  return CRAFT_SHEETS.find(c => normalise(c.title) === rest) ?? null
}

/** A sheet by its anchor slug, for a page opening on a hash. */
export function craftBySlug(slug: string): CraftSheet | null {
  return CRAFT_SHEETS.find(c => c.slug === slug) ?? null
}

/** Where that sheet lives, anchored so the tap lands on the sheet itself. */
export function craftHref(sheet: CraftSheet): string {
  return `/dashboard/quests/crafts#${sheet.slug}`
}
