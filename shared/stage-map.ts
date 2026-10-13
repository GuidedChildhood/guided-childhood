// THE ONE STAGE MAP (sync plan D, 12 October 2026).
//
// Three copies of "which stage does a key stage belong to" disagreed on
// 9 October 2026: shared/passport-stages.ts put KS3 on Shaper and KS5 after
// the passport, lib/lessons/school-path.ts put KS3 on Explorer and KS5 on
// Independent, and scripts/check-module-contract.mjs carried a third copy of
// the first. So the ks3-12 parent sheet said "Today filled the Making
// choices page" while the child's own app ticked Explorer, and the wall's
// passport beat read its page off the slide rather than the module.
//
// This file is the only place the answer lives. Everything else derives from
// it: the passport pages, the child's lesson list, the printed note, the
// contract guard. scripts/check-lesson-path.mjs reads this file as text and
// holds every copy equal, so it has NO IMPORTS and keeps each table on one
// line, the way shared/home-code-link.ts does for the same reason.
//
// The stamps follow the cast (digi-squad/README.md): Pebble fronts the
// first steps, Bloop the good habits, Orbit the questions, Nova the choices
// and Cosmo the sixth form. Before this file Orbit was stamping two pages and
// Cosmo none.
//
// KS5 fills Independent, as the child's own lessons have always counted it.
// The old "after the passport" placement left two lessons with no page while
// home ticked them on the last one.

export type StageId = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'
export type KeyStage = 'EYFS' | 'KS1' | 'KS2' | 'KS3' | 'KS4' | 'KS5'

export const STAGE_IDS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

/** A key stage's stage. The whole map, on one line, so a guard can read it as text. */
export const STAGE_OF_KEY_STAGE: Record<KeyStage, StageId> = { EYFS: 'foundation', KS1: 'foundation', KS2: 'builder', KS3: 'explorer', KS4: 'shaper', KS5: 'independent' }

/** A stage's key stages, in teaching order. Derived, never typed twice. */
export const KEY_STAGES_OF_STAGE: Record<StageId, KeyStage[]> = STAGE_IDS.reduce((acc, stage) => {
  acc[stage] = (Object.keys(STAGE_OF_KEY_STAGE) as KeyStage[]).filter(ks => STAGE_OF_KEY_STAGE[ks] === stage)
  return acc
}, {} as Record<StageId, KeyStage[]>)

/**
 * The passport page each stage fills: its stamp (the Planet Friend), the key
 * stages it covers as a label, its page name and its number in the book.
 */
export const STAGE_PAGES: Record<StageId, { stamp: string; keyStage: string; page: string; number: number }> = {
  foundation:  { stamp: 'Pebble', keyStage: 'EYFS and KS1', page: 'First steps',      number: 1 },
  builder:     { stamp: 'Bloop',  keyStage: 'KS2',          page: 'Good habits',      number: 2 },
  explorer:    { stamp: 'Orbit',  keyStage: 'KS3',          page: 'Asking questions', number: 3 },
  shaper:      { stamp: 'Nova',   keyStage: 'KS4',          page: 'Making choices',   number: 4 },
  independent: { stamp: 'Cosmo',  keyStage: 'KS5',          page: 'Ready at sixteen', number: 5 },
}

/** The stage a key stage belongs to, or null for a string no stage claims. */
export function stageOfKeyStage(keyStage: string | null | undefined): StageId | null {
  return (STAGE_OF_KEY_STAGE as Record<string, StageId>)[keyStage ?? ''] ?? null
}
