// WHICH YEAR, AND WHAT IT BUILDS ON (11 November 2026).
//
// The scheme was sequenced by key stage and no finer. Nine KS2 lessons across
// four years is a decision every school had to make for itself, with nothing
// from us, and "what does Year 4 teach?" had no answer on any page. The
// progression review found it against every strong scheme, which all answer
// that question first (plans/2026-11-11-progression-and-assessment-review.md,
// amendment 3).
//
// Two things live here, and only here:
//
//   SUGGESTED_YEAR  the year group each lesson is suggested for
//   BUILDS_ON       the earlier lessons each one says it builds on
//
// A SUGGESTION, NEVER A RULE. Every lesson still stands alone, and a school
// with a two year rolling programme or a mixed age class will move things.
// Every page that shows a year says so.
//
// HOW THE YEARS WERE CHOSEN. The scheme's own order is kept inside each key
// stage, so the retrieval thread survives (each starter looks back at the one
// before), and the order is cut into years so that no lesson lands before a
// lesson it builds on. Three placements lean on the lesson itself: Why
// thirteen? closes Year 6, where the question is live; Is it doing my
// thinking? sits in Year 8, inside the Years 7 and 8 band its own row names;
// Readiness at 16 closes Year 11.
//
// WHERE BUILDS_ON COMES FROM. Each lesson's own prior knowledge lines, read
// off the lesson rows. Most name the earlier lesson by its number; five name
// it in words, and those are written out here from the same lines.
// scripts/check-progression.mjs holds this file to the lesson files: a lesson
// that names an earlier lesson and is not linked to it here fails the build,
// and so does a lesson placed before something it builds on.
//
// No imports beyond the manifest, so the guard reads it under plain node.

import { CURRICULUM, type KeyStage } from './schools-curriculum'

/** Year groups as numbers: 0 is Reception, 1 to 13 are the years. */
export const YEARS_OF: Record<KeyStage, number[]> = {
  EYFS: [0],
  KS1: [1, 2],
  KS2: [3, 4, 5, 6],
  KS3: [7, 8, 9],
  KS4: [10, 11],
  KS5: [12, 13],
}

export function yearName(year: number): string {
  return year === 0 ? 'Reception' : `Year ${year}`
}

export const SUGGESTED_YEAR: Record<string, number> = {
  'eyfs-01-screens-kindness': 0,
  'eyfs-30-the-screen-never-says-stop': 0,
  'eyfs-31-paws-off-ask-first': 0,

  'ks1-02-kind-screens-calm-bodies': 1,
  'ks1-03-real-pretend-computer': 1,
  'ks1-32-private-like-a-toothbrush': 2,
  'ks1-33-who-is-on-the-other-side': 2,

  'ks2-04-screen-routines': 3,
  'ks2-05-gaming-time-spend': 3,
  'ks2-06-how-algorithms-work': 4,
  'ks2-07-privacy-reputation': 4,
  'ks2-08-kind-safe-online': 5,
  'ks2-09-copyright-ownership': 5,
  'ks2-23-when-a-machine-talks-like-a-friend': 5,
  'ks2-25-stay-the-maker': 6,
  'ks2-26-why-thirteen': 6,

  'ks3-27-when-it-turns-on-you': 7,
  'ks3-10-mood-and-screens': 7,
  'ks3-11-social-workarounds': 7,
  'ks3-12-misinfo-deepfakes': 8,
  'ks3-13-scams-fraud-money': 8,
  'ks3-24-is-it-doing-my-thinking': 8,
  'ks3-14-bodies-image-pressure': 9,
  'ks3-22-when-an-ai-acts-like-a-friend': 9,
  'ks3-34-who-owns-what-you-make': 9,

  'ks4-29-did-not-go-looking': 10,
  'ks4-15-manipulation-persuasion': 10,
  'ks4-28-the-money-and-the-odds': 10,
  'ks4-16-consent-images-law': 10,
  'ks4-17-sextortion': 11,
  'ks4-18-radicalisation-misogyny': 11,
  'ks4-19-readiness-at-16': 11,

  'ks5-20-ai-mastery-data-rights': 12,
  'ks5-21-digital-identity-future-work': 13,
}

export const BUILDS_ON: Record<string, string[]> = {
  'eyfs-30-the-screen-never-says-stop': ['eyfs-01-screens-kindness'],
  'eyfs-31-paws-off-ask-first': ['eyfs-01-screens-kindness', 'eyfs-30-the-screen-never-says-stop'],

  'ks1-02-kind-screens-calm-bodies': ['eyfs-01-screens-kindness'],
  'ks1-03-real-pretend-computer': ['eyfs-01-screens-kindness'],
  'ks1-32-private-like-a-toothbrush': ['eyfs-31-paws-off-ask-first', 'ks1-02-kind-screens-calm-bodies'],
  'ks1-33-who-is-on-the-other-side': ['ks1-02-kind-screens-calm-bodies', 'ks1-03-real-pretend-computer', 'ks1-32-private-like-a-toothbrush'],

  'ks2-04-screen-routines': ['ks1-02-kind-screens-calm-bodies'],
  'ks2-05-gaming-time-spend': ['ks2-04-screen-routines'],
  'ks2-06-how-algorithms-work': ['ks2-05-gaming-time-spend'],
  'ks2-07-privacy-reputation': ['ks2-06-how-algorithms-work'],
  'ks2-08-kind-safe-online': ['ks2-07-privacy-reputation'],
  'ks2-09-copyright-ownership': ['ks1-03-real-pretend-computer'],
  'ks2-23-when-a-machine-talks-like-a-friend': ['ks1-03-real-pretend-computer', 'ks1-33-who-is-on-the-other-side', 'ks2-06-how-algorithms-work', 'ks2-08-kind-safe-online'],
  'ks2-25-stay-the-maker': ['ks2-09-copyright-ownership'],
  // In words in the lesson: "the privacy lesson" and "the gaming lesson".
  'ks2-26-why-thirteen': ['ks2-05-gaming-time-spend', 'ks2-07-privacy-reputation'],

  // In words: "the KS2 lesson on being kind and safe online".
  'ks3-27-when-it-turns-on-you': ['ks2-08-kind-safe-online'],
  'ks3-10-mood-and-screens': ['ks2-06-how-algorithms-work'],
  'ks3-11-social-workarounds': ['ks2-06-how-algorithms-work', 'ks2-26-why-thirteen'],
  'ks3-12-misinfo-deepfakes': ['ks1-03-real-pretend-computer', 'ks2-06-how-algorithms-work', 'ks2-09-copyright-ownership'],
  'ks3-13-scams-fraud-money': ['ks3-12-misinfo-deepfakes'],
  'ks3-14-bodies-image-pressure': ['ks2-06-how-algorithms-work', 'ks3-10-mood-and-screens', 'ks3-12-misinfo-deepfakes'],
  'ks3-22-when-an-ai-acts-like-a-friend': ['ks2-23-when-a-machine-talks-like-a-friend', 'ks3-10-mood-and-screens', 'ks3-12-misinfo-deepfakes'],
  'ks3-24-is-it-doing-my-thinking': ['ks2-25-stay-the-maker'],
  // In words: My work and other people's work, Stay the maker, Is it doing my thinking?
  'ks3-34-who-owns-what-you-make': ['ks2-09-copyright-ownership', 'ks2-25-stay-the-maker', 'ks3-24-is-it-doing-my-thinking'],

  // In words: "the KS3 lesson on online conflict". Its line about manipulation
  // and persuasion is conditional ("if your class has had"), and that lesson
  // comes after this one in the scheme, so it is not a link here.
  'ks4-29-did-not-go-looking': ['ks3-27-when-it-turns-on-you'],
  'ks4-15-manipulation-persuasion': ['ks2-06-how-algorithms-work', 'ks3-13-scams-fraud-money'],
  // In words: "manipulation and persuasion at KS4" and the KS2 lesson on games.
  'ks4-28-the-money-and-the-odds': ['ks2-05-gaming-time-spend', 'ks4-15-manipulation-persuasion'],
  'ks4-16-consent-images-law': ['ks2-07-privacy-reputation'],
  'ks4-17-sextortion': ['ks3-13-scams-fraud-money', 'ks4-16-consent-images-law'],
  'ks4-18-radicalisation-misogyny': ['ks2-06-how-algorithms-work', 'ks4-15-manipulation-persuasion'],
  'ks4-19-readiness-at-16': ['ks3-10-mood-and-screens', 'ks3-11-social-workarounds', 'ks4-15-manipulation-persuasion'],

  'ks5-20-ai-mastery-data-rights': ['ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation', 'ks3-12-misinfo-deepfakes'],
  'ks5-21-digital-identity-future-work': ['ks2-07-privacy-reputation', 'ks5-20-ai-mastery-data-rights'],
}

export function suggestedYear(moduleId: string): number | null {
  return SUGGESTED_YEAR[moduleId] ?? null
}

/** The lessons suggested for one year group, in the scheme's own order. */
export function lessonsForYear(year: number) {
  return CURRICULUM.filter(m => SUGGESTED_YEAR[m.moduleId] === year)
}

/** The earlier lessons a lesson builds on, in teaching order. */
export function buildsOn(moduleId: string) {
  const ids = BUILDS_ON[moduleId] ?? []
  return CURRICULUM.filter(m => ids.includes(m.moduleId))
}

/** The later lessons that build on a lesson, in teaching order. */
export function leadsTo(moduleId: string) {
  return CURRICULUM.filter(m => (BUILDS_ON[m.moduleId] ?? []).includes(moduleId))
}
