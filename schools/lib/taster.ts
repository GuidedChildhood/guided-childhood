// THE TASTER: one module of twenty three, outside the licence wall on purpose.
//
// Decided 11 September 2026 (Justin): "how can I send that one sample lesson
// so teachers can get a taster, then leads, then to sign up, request an
// invoice page." The two ends of that already existed. The middle did not: a
// lesson link sent to a teacher hit /unlock and bounced, and the only form on
// the site asked for a purchase order number, which is the last thing a
// browsing teacher has rather than the first.
//
// THIS AMENDS THE OPEN MAP DECISION of 30 August 2026, which put the paid
// wall at "the lessons, the scripts, the packs and the testing". One module
// now sits outside it. The catalogue is still the product; a single worked
// example is the advert for it, and a scheme nobody has seen teach is a
// scheme nobody buys.
//
// WHY THE REAL PAGES AND NOT A DEMO. /lesson/[module] is already the page a
// teacher opens the night before: objective, essential question,
// misconceptions, differentiation, SEND and EAL, timing, the named cycles,
// and one button to teach. That page IS the argument for zero prep. A cut
// down demo would sell the product worse than the product does, and would be
// a second thing to keep in step with every migration.

/** The modules anyone may see without a school code. Keep this SHORT. Every
 *  entry is a lesson given away, and the reason it works is that it is the
 *  exception. ks3-12 is the pilot: thirty one slides, six animated beats, the
 *  full printable pack, and the one Justin sends. */
export const TASTER_MODULES = ['ks3-12-misinfo-deepfakes'] as const

export function isTasterModule(moduleId: string): boolean {
  return (TASTER_MODULES as readonly string[]).includes(moduleId)
}

/** The routes a taster module is allowed to reach, and no others.
 *
 *  Deliberately NOT a `startsWith('/lesson/')` test. The module id is pulled
 *  out and checked against the list, so opening the taster opens exactly one
 *  module's pages and every other module meets the code door exactly as it
 *  did yesterday.
 *
 *  The four shapes are the whole teacher journey for one lesson: the prep
 *  page, its run sheet, the player, and the printable pack. Anything deeper
 *  under /print (the booklet, the organiser, the two quizzes, the record) is
 *  included on purpose, because "zero prep" is proved by the pack rather than
 *  by the slides. */
export function isTasterPath(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return false

  const [section, moduleId] = parts
  if (!isTasterModule(moduleId)) return false

  if (section === 'lesson') return parts.length === 2 || (parts.length === 3 && parts[2] === 'run')
  if (section === 'teach') return parts.length === 2
  if (section === 'print') return parts.length >= 2
  return false
}
