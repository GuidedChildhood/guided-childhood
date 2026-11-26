// ONE LESSON PER STAGE, OPEN TO ANYONE (Justin, 26 November 2026).
//
// "Let's make these lessons available and build walk throughs." The homepage
// leads with what school teaches this term, so a parent can get there first,
// and the only honest proof of that is a real lesson they can open without an
// account. One per stage, each one already quoted on the homepage from
// lib/content/stage-outcomes.ts.
//
// Kept in its own file because scripts/check-stage-outcomes.mjs parses
// stage-outcomes.ts with a strict pattern, and an extra field there would read
// as an empty stage.
//
// Picks (platform map, 26 November):
//   Foundation   ks1-32  private like a toothbrush, made for home
//   Builder      ks2-06  how algorithms work
//   Explorer     ks3-13  scams, fraud and money, so the schools taster
//                        (ks3-12) stays the schools' own
//   Shaper       ks4-15  manipulation and persuasion; not ks4-29, which is on
//                        the heavy list and wants a heads up first
//   Independent  ks5-20  AI mastery and data rights
//
// Only the together deck is shown, read through getStarLessonForShare, which
// never selects the teacher notes or the DSL note. Nothing is recorded.
export const TRY_LESSONS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'ks1-32-private-like-a-toothbrush',
  2: 'ks2-06-how-algorithms-work',
  3: 'ks3-13-scams-fraud-money',
  4: 'ks4-15-manipulation-persuasion',
  5: 'ks5-20-ai-mastery-data-rights',
}

export function isTryModule(moduleId: string): boolean {
  return (Object.values(TRY_LESSONS) as string[]).includes(moduleId)
}
