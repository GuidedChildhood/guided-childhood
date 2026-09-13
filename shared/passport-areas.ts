// THE FOUR AREAS, ON THE SCHOOL SIDE, AND ONE AREA PER MODULE.
//
// Justin, 13 September 2026, on the schools lessons: "make sure the passport
// theme carries through and updates for progression as agreed, fills up,
// makes sense, matches the other platform passport." The other platform is
// the parents app, where the same morning's ask put the four agreed areas on
// every passport page (PR #1057, lib/content/literacy.ts and
// components/pathway/StageAreas.tsx). This file is the school side of that
// canon, so a page drawn on a classroom wall builds the same four things a
// parent reads at home, in the same order, with the same names.
//
// WHY A COPY AND NOT AN IMPORT. The parents app's lib/ is not reachable from
// shared/ or from the schools app, and the schools app must build on its own.
// So the keys, names, order and start stages are copied here, and
// scripts/check-passport-areas.mjs holds the copy against the original: if
// the parents side ever renames an area or moves a start age, CI fails until
// this file follows. One passport, two products, one source of truth with a
// guarded mirror.
//
// ONE AREA PER MODULE, BY HAND. The parents side derives an area from a
// lesson's category with a regex. A school module carries Education for a
// Connected World strands instead, and two or three of them, so a regex over
// its title would make ks2-07 (privacy AND reputation) land wherever the
// pattern order happened to put it. The honest thing is one deliberate
// choice per module, written down with its reason, and a guard that every
// module in the curriculum has one.

import { CURRICULUM, type CurriculumModule } from './schools-curriculum'
import { PLACEMENT_BY_KEY_STAGE, type PassportPlacement, type PassportStage } from './passport-stages'

export type AreaKey = 'safe' | 'balance' | 'ai' | 'social'

/** The four, in the order every surface prints them (the parents canon). */
export const AREA_ORDER: AreaKey[] = ['safe', 'balance', 'ai', 'social']

// `name` is the parents app's LITERACY_AREAS name; `short` is the two word
// form StageAreas prints in a 140px card, so the block reads the same on both
// sides of the home and school line.
export const AREAS: Record<AreaKey, { name: string; short: string }> = {
  safe:    { name: 'Safe online',        short: 'Safe online' },
  balance: { name: 'Healthy balance',    short: 'Healthy balance' },
  ai:      { name: 'AI and chatbots',    short: 'AI literate' },
  social:  { name: 'Social media ready', short: 'Social ready' },
}

// The stage each area starts at, the parents app's AREA_START. Social media
// readiness begins at 11 because the judgement is built before any account
// exists. A page that carries a school lesson in an area anyway shows it: the
// page builds what its lessons build, and a wall that said "later" about the
// lesson the class just did would be lying to the room.
export const AREA_START: Record<AreaKey, number> = { safe: 1, balance: 1, ai: 1, social: 3 }

/** The passport's five pages, numbered the way the parents book numbers them. */
export const STAGE_NUMBER: Record<PassportStage, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}
export const STAGE_BY_NUMBER: PassportStage[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

// The choice per module. The comment is the reason, in the parents canon's
// own terms: kindness, privacy and reporting are Safe online; bodies, sleep,
// mood and gaming are Healthy balance; what is real, algorithms, machines that
// talk and the tools are AI and chatbots; friends, sharing, money, ownership
// and readiness for accounts are Social media ready.
export const SCHOOL_MODULE_AREA: Record<string, AreaKey> = {
  'eyfs-01-screens-kindness':                 'safe',    // kind on a screen, ask a grown up
  'ks1-02-kind-screens-calm-bodies':          'balance', // the wiggly body when the screen goes off
  'ks1-03-real-pretend-computer':             'ai',      // real, pretend, or made by a computer
  'ks2-04-screen-routines':                   'balance', // warn, finish, swap
  'ks2-05-gaming-time-spend':                 'balance', // gaming time first, the spend is the trick inside it
  'ks2-06-how-algorithms-work':               'ai',      // you watch, it learns, it serves more
  'ks2-07-privacy-reputation':                'safe',    // the share test is a safety test: where I am, future me
  'ks2-08-kind-safe-online':                  'safe',    // do not pile on, save the evidence, tell someone
  'ks2-09-copyright-ownership':               'social',  // making, sharing and owning your work
  'ks2-23-when-a-machine-talks-like-a-friend':'ai',      // a machine that says it likes you
  'ks2-25-stay-the-maker':                    'ai',      // if the computer made it, whose is it
  'ks3-10-mood-and-screens':                  'balance', // better, worse, or nothing, for a week
  'ks3-11-social-workarounds':                'social',  // the rule and the protection behind it
  'ks3-12-misinfo-deepfakes':                 'ai',      // three checks before you believe or share
  'ks3-13-scams-fraud-money':                 'social',  // money and the three tells, the parents canon's own line
  'ks3-14-bodies-image-pressure':             'balance', // who edited this, who profits from me feeling worse
  'ks3-22-when-an-ai-acts-like-a-friend':     'ai',      // does it ever have a day of its own
  'ks3-24-is-it-doing-my-thinking':           'ai',      // help that gets you to the work, or does the work
  'ks4-15-manipulation-persuasion':           'ai',      // name the technique, follow the money
  'ks4-16-consent-images-law':                'safe',    // consent, the law, and the options afterwards
  'ks4-17-sextortion':                        'safe',    // do not pay, do not keep it secret, report it
  'ks4-18-radicalisation-misogyny':           'ai',      // who wants me angry, what happens if I keep watching
  'ks4-19-readiness-at-16':                   'social',  // the first week of full access, planned
  'ks5-20-ai-mastery-data-rights':            'ai',      // use it like a professional, check it like an editor
  'ks5-21-digital-identity-future-work':      'social',  // what is still worth paying you for
}

export function areaOf(moduleId: string): AreaKey | null {
  return SCHOOL_MODULE_AREA[moduleId] ?? null
}

/** Which page a module fills, from the curriculum's own key stage. */
export function placementOf(moduleId: string): PassportPlacement | null {
  const m = CURRICULUM.find(x => x.moduleId === moduleId)
  return m ? PLACEMENT_BY_KEY_STAGE[m.keyStage] ?? null : null
}

/** The school modules that fill one page, in teaching order. */
export function pageModules(placement: PassportStage): CurriculumModule[] {
  return CURRICULUM.filter(m => PLACEMENT_BY_KEY_STAGE[m.keyStage] === placement)
}

export type PageCount = { done: number; total: number }

/** Lessons done of total on a page, for a set of module ids already filled. */
export function pageLessons(placement: PassportStage, done: Iterable<string>): PageCount {
  const doneSet = new Set(done)
  const mods = pageModules(placement)
  return { done: mods.filter(m => doneSet.has(m.moduleId)).length, total: mods.length }
}

export type AreaCount = {
  key: AreaKey
  name: string
  short: string
  done: number
  total: number
  /** Drawn live, or ghosted as "later": the start table, unless the page carries a lesson in it. */
  started: boolean
}

/** The four areas on one page, each done of total, in the canon's order. */
export function pageAreas(placement: PassportStage, done: Iterable<string>): AreaCount[] {
  const doneSet = new Set(done)
  const mods = pageModules(placement)
  const stage = STAGE_NUMBER[placement]
  return AREA_ORDER.map(key => {
    const here = mods.filter(m => SCHOOL_MODULE_AREA[m.moduleId] === key)
    const total = here.length
    return {
      key, name: AREAS[key].name, short: AREAS[key].short,
      done: here.filter(m => doneSet.has(m.moduleId)).length,
      total,
      started: stage >= AREA_START[key] || total > 0,
    }
  })
}
