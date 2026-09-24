// THE TASTER: one module of the catalogue, outside the licence wall on purpose.
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

/** THE STANDALONE LESSONS: free to open, and deliberately NOT part of the
 *  scheme (decided 24 September 2026, Justin). "What problem would you
 *  solve?" was written for Simon Squibb's idea of what school leaves out, and
 *  Justin is not sure it belongs in the curriculum, so it stands on its own:
 *  the same player and the same pages as any lesson, reached by its own free
 *  link, and absent from the manifest, so it is never counted, mapped,
 *  tracked or put on the passport. It gets its own bar rather than the
 *  taster's, because the taster's bar sells the scheme and a lead from here
 *  would be sent the scheme's letter. It can join the scheme later by moving
 *  into the manifest and out of this list. */
export const STANDALONE_MODULES = ['what-problem-would-you-solve'] as const

export function isStandaloneModule(moduleId: string): boolean {
  return (STANDALONE_MODULES as readonly string[]).includes(moduleId)
}

/** The name on the browser tab, so a page can name itself without a database
 *  read, the way the manifest does for the scheme. Keep it the row's title. */
const STANDALONE_TITLES: Record<string, string> = {
  'what-problem-would-you-solve': 'What problem would you solve?',
}

export function standaloneTitle(moduleId: string): string | undefined {
  return STANDALONE_TITLES[moduleId]
}

/** The same four shapes as the taster, for a standalone lesson. A separate
 *  predicate rather than a second list inside isTasterPath, so the taster's
 *  guard keeps meaning exactly what it says. */
export function isStandalonePath(pathname: string): boolean {
  return freeLessonPath(pathname, isStandaloneModule)
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
  return freeLessonPath(pathname, isTasterModule)
}

function freeLessonPath(pathname: string, isFree: (moduleId: string) => boolean): boolean {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return false

  const [section, moduleId] = parts
  if (!isFree(moduleId)) return false

  if (section === 'lesson') return parts.length === 2 || (parts.length === 3 && parts[2] === 'run')
  if (section === 'teach') return parts.length === 2
  if (section === 'print') return parts.length >= 2
  return false
}
