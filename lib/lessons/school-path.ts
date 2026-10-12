import type { StageId } from '@/lib/pathway/progress'
import { positionOf } from '@gc/shared/schools-curriculum'

// THE CHILD'S LESSONS ARE THE SCHOOL LESSONS (29 September 2026).
//
// Justin chose "the child learns, the parent closes it": the child plays the
// school version of each lesson in their own app, passing its check ticks
// Lessons and tests on the passport, and the parent gets one question to ask
// at tea. The parent library stays as the parent's own learning and stops
// being the thing the passport counts. Plan: plans/2026-09-29-lessons-plan.md.
//
// Before this the child app showed the parent library, 102 lessons written for
// adults, and the passport counted 25 to 40 of them per stage. The school
// scheme is written for the child, Oak structured, and every module carries a
// check and a family question.
//
// This file is the one place a stage is matched to its key stages, so the
// passport, the child's list and the parent's view cannot disagree about what
// "this stage's lessons" means. KS2 runs to age 11 and sits with Builder,
// which is where a Year 6 child reads their stage.

export const STAGE_KEY_STAGES: Record<StageId, string[]> = {
  foundation: ['EYFS', 'KS1'],
  builder: ['KS2'],
  explorer: ['KS3'],
  shaper: ['KS4'],
  independent: ['KS5'],
}

export type SchoolModule = { id: string; module_id?: string; title: string; key_stage?: string }

/**
 * The stage's school modules, in the order the scheme teaches them.
 *
 * The rows arrive in sort_order, which is the order they were BUILT (n), not
 * the order they are taught. Until 30 September 2026 the two agreed for the
 * Foundation page. Then four under 7 lessons arrived as 30 to 33, and sort
 * order alone would have given a Reception child the two Year 1 lessons before
 * the two new Reception ones. So the key stage decides first, EYFS before KS1,
 * and the manifest's own position inside the key stage decides next, the same
 * order the curriculum map prints (positionOf in shared/schools-curriculum.ts).
 *
 * A row the manifest does not know is left out. Those are the standalone
 * lessons (smart glasses, the two enterprise lessons), which share the table
 * and deliberately sit outside the scheme: never counted, never on the
 * passport (schools/lib/taster.ts). Without this the Builder passport would
 * have counted the smart glasses lesson as one of its ten.
 */
export function schoolModulesForStage<T extends SchoolModule>(rows: T[] | null | undefined, stageId: StageId): T[] {
  const stages = STAGE_KEY_STAGES[stageId] ?? []
  const place = (r: T) => stages.indexOf(r.key_stage ?? '') * 1000 + (positionOf(r.module_id ?? '')?.index ?? 0)
  return (rows ?? [])
    .filter(r => stages.includes(r.key_stage ?? '') && positionOf(r.module_id ?? '') !== null)
    .sort((a, b) => place(a) - place(b))
}

/** The stage a module belongs to, or null for a key stage no stage claims. */
export function stageForKeyStage(keyStage: string | null | undefined): StageId | null {
  for (const [stage, list] of Object.entries(STAGE_KEY_STAGES) as [StageId, string[]][]) {
    if (list.includes(keyStage ?? '')) return stage
  }
  return null
}

/** The credit key a passed school module carries in lessonCreditKeys. */
export const schoolCreditKey = (lessonId: string) => `school_lesson:${lessonId}`

/**
 * Under 7 the lesson is done together on the grown up's phone: EYFS and KS1
 * children cannot read a deck alone, and joint media engagement is where
 * learning sticks at that age.
 */
export const isTogetherStage = (stageId: StageId | null | undefined) => stageId === 'foundation'

// ── A CHILD'S LESSONS FOLLOW THEIR SCHOOL YEAR (9 October 2026) ─────────────
//
// Justin, deciding the sync plan's question 2: a child's lessons follow their
// school year, not their birthday (plans/2026-10-09-curriculum-sync-plan.md,
// section C). The stage still opens on a birthday elsewhere, and that put a
// Year 8 child who turned 13 on the KS4 decks (sextortion, consent and the
// law, self harm content) up to two years before their class met them, alone.
// Hiding those lessons instead, as the plan's first version said, left the
// same child a road of nothing but "waits for Year 10". So the lessons come
// from the key stage the child's school year sits in, and every child meets a
// lesson in the year their class does.
//
// England's school year starts on 1 September, and a child starts Reception
// in the September after they turn four. With no date of birth the age band
// decides, as it always has.

const YEAR_KEY_STAGE_STAGE: { upTo: number; stage: StageId }[] = [
  { upTo: 2, stage: 'foundation' }, // Reception (0) to Year 2: EYFS and KS1
  { upTo: 6, stage: 'builder' }, // Years 3 to 6: KS2
  { upTo: 9, stage: 'explorer' }, // Years 7 to 9: KS3
  { upTo: 11, stage: 'shaper' }, // Years 10 and 11: KS4
  { upTo: Infinity, stage: 'independent' }, // Years 12 and 13: KS5
]

/** The English school year a child is in: Reception is 0, Year 6 is 6. Null without a valid date. */
export function schoolYearFromDob(dob: string | Date | null | undefined, on: Date = new Date()): number | null {
  if (!dob) return null
  const birth = typeof dob === 'string' ? new Date(`${dob.slice(0, 10)}T00:00:00Z`) : dob
  if (Number.isNaN(birth.getTime())) return null
  // The September that starts the school year we are in, and the September
  // that starts the cohort the child was born into (1 September to 31 August).
  const yearStart = on.getUTCMonth() >= 8 ? on.getUTCFullYear() : on.getUTCFullYear() - 1
  const cohortStart = birth.getUTCMonth() >= 8 ? birth.getUTCFullYear() : birth.getUTCFullYear() - 1
  return yearStart - cohortStart - 5
}

/** The stage whose lessons a school year meets. Below Reception counts as Foundation. */
export function stageForSchoolYear(year: number): StageId {
  return YEAR_KEY_STAGE_STAGE.find(b => year <= b.upTo)!.stage
}

const BAND_STAGE: Record<string, StageId> = {
  '4-7': 'foundation', '8-10': 'builder', '11-13': 'explorer', '13-15': 'shaper', '16+': 'independent',
}

/**
 * Whose lessons a child gets: their school year's stage when we know their
 * date of birth, their age band's otherwise. Every place a lesson is chosen
 * for a child reads this, and nothing else.
 */
export function lessonStageFor(child: { date_of_birth?: string | null; age_band?: string | null } | null | undefined, on: Date = new Date()): StageId {
  const year = schoolYearFromDob(child?.date_of_birth ?? null, on)
  if (year !== null) return stageForSchoolYear(year)
  return BAND_STAGE[child?.age_band ?? ''] ?? 'builder'
}

const STAGE_RANK: Record<StageId, number> = { foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5 }

/**
 * Whether a child may open a module: at or below their lessons' stage. A
 * module from an earlier stage stays open (a Year 8 child can catch up on a
 * KS2 lesson); one from a later stage waits for the year their class meets it.
 */
export function moduleOpenFor(moduleKeyStage: string | null | undefined, childLessonStage: StageId): boolean {
  const stage = stageForKeyStage(moduleKeyStage)
  if (!stage) return true
  return STAGE_RANK[stage] <= STAGE_RANK[childLessonStage]
}

// ── ONE A WEEK, WITH A MECHANISM (plan v10, item 1.5) ────────────────────────

/** The weekly lesson's award. The opener's old self started award was 3. */
export const WEEKLY_LESSON_STARS = 10

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Whether a NEW mission may start today. The pace refuses only where a row
 * would be created: a child whose last passing school lesson was inside seven
 * days waits for the next week. Reopening a mission that already exists is
 * always allowed, so a retake the day after a fail is never turned away; so is
 * a restart of a skipped lesson and the first lesson of a stage, so a family
 * joining on a Thursday starts that day.
 */
export function newMissionAllowed({
  lastPassAt, isFirstOfStage, isSkippedRestart, now = Date.now(),
}: { lastPassAt: string | null; isFirstOfStage: boolean; isSkippedRestart: boolean; now?: number }): boolean {
  if (isFirstOfStage || isSkippedRestart) return true
  if (!lastPassAt) return true
  const at = Date.parse(lastPassAt)
  return Number.isNaN(at) || now - at >= WEEK_MS
}
