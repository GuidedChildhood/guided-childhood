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
 *  into the manifest and out of this list.
 *
 *  "Could you be an entrepreneur?" joined it on 26 September 2026, Justin's
 *  fifth decision in plans/2026-09-24-simon-squibb-weighed.md: the real UK
 *  figures on working for yourself, and a small safe way to try it, for the
 *  same Year 8 and Year 9 classes, outside the scheme for the same reason.
 *
 *  "Should people wear smart glasses?" joined it the same day, and it is the
 *  third and last the taster wall allows. Justin promised Votes for Schools a
 *  lesson built on their national vote (58,767 pupils, September 2026) and
 *  asked for it free, so every school that voted can teach it, customer or
 *  not. It is the first for primary: Years 5 and 6, which is why a lesson now
 *  carries its own year groups instead of the bar assuming Years 8 and 9.
 *  plans/2026-09-26-smart-glasses-lesson-plan.md. */
export const STANDALONE_MODULES = ['what-problem-would-you-solve', 'could-you-be-an-entrepreneur', 'should-people-wear-smart-glasses'] as const

export function isStandaloneModule(moduleId: string): boolean {
  return (STANDALONE_MODULES as readonly string[]).includes(moduleId)
}

/** The name on the browser tab, so a page can name itself without a database
 *  read, the way the manifest does for the scheme. Keep it the row's title. */
const STANDALONE_TITLES: Record<string, string> = {
  'what-problem-would-you-solve': 'What problem would you solve?',
  'could-you-be-an-entrepreneur': 'Could you be an entrepreneur?',
  'should-people-wear-smart-glasses': 'Should people wear smart glasses?',
}

export function standaloneTitle(moduleId: string): string | undefined {
  return STANDALONE_TITLES[moduleId]
}

/** Who each lesson is for, said the two ways the bar needs it: the band as a
 *  heading says it ("Years 5 and 6") and the band a sentence about one class
 *  needs ("any Year 5 or Year 6 class"). Keep `band` the row's year_band. */
const STANDALONE_YEARS: Record<string, { band: string; anyClass: string }> = {
  'what-problem-would-you-solve': { band: 'Years 8 and 9', anyClass: 'any Year 8 or Year 9 class' },
  'could-you-be-an-entrepreneur': { band: 'Years 8 and 9', anyClass: 'any Year 8 or Year 9 class' },
  'should-people-wear-smart-glasses': { band: 'Years 5 and 6', anyClass: 'any Year 5 or Year 6 class' },
}

export function standaloneYears(moduleId: string): { band: string; anyClass: string } | undefined {
  return STANDALONE_YEARS[moduleId]
}

/** The other standalone lessons, so each one's free bar can name the rest. A
 *  teacher who has just taught one is the likeliest person to teach the next,
 *  and with a primary lesson among them each is named with its own years, so
 *  a Year 9 teacher is never sent to a Year 5 lesson without being told. */
export function otherStandaloneLessons(moduleId: string): { moduleId: string; title: string; years: string }[] {
  return STANDALONE_MODULES
    .filter(id => id !== moduleId)
    .map(id => ({ moduleId: id, title: STANDALONE_TITLES[id] ?? id, years: STANDALONE_YEARS[id]?.band ?? '' }))
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
