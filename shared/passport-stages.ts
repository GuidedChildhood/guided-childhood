// WHICH PASSPORT PAGE A SCHOOL LESSON FILLS.
//
// Every school module tells the parent, in its own parent note, that the
// lesson has a place on the child's passport page and that each stage ends
// with a stamp that is earned, never just a birthday reached. This file is
// where a lesson knows what page that is. Awarding a stamp to a child stays
// with the passport codes lane, which owns public.stage_passports and the
// codes; nothing here writes one.
//
// THE STAMP BELONGS TO THE STAGE, NOT THE LESSON. A lesson fills a page;
// finishing the pages earns the Planet Friend.
//
// SINCE 12 OCTOBER 2026 THE ANSWER IS NOT WRITTEN HERE (sync plan D). This
// file used to carry its own key stage to page table, and it disagreed with
// the child's own lesson list (lib/lessons/school-path.ts) on KS3, KS4 and
// KS5, so a parent sheet named one page while home ticked another. The one
// table is shared/stage-map.ts, and this file only re-exports it under the
// names the passport surfaces have always imported. A guard reads both as
// text and fails the build if a literal map ever comes back here.

import { STAGE_OF_KEY_STAGE, STAGE_PAGES, type StageId } from './stage-map'

export type PassportStage = StageId

/**
 * Every stage fills a page, since 12 October 2026: KS5 fills Independent, as
 * home has always counted it, so nothing sits "after" the passport any more.
 * The alias stays for the readers that imported it.
 */
export type PassportPlacement = PassportStage

export const PASSPORT_STAGES: Record<PassportStage, { stamp: string; keyStage: string; page: string }> = STAGE_PAGES

/** A module's page, from the only age signal a module actually carries: its key stage. */
export const PLACEMENT_BY_KEY_STAGE: Record<string, PassportPlacement> = STAGE_OF_KEY_STAGE

export const stampFor = (p: PassportPlacement): string | null => PASSPORT_STAGES[p]?.stamp ?? null
