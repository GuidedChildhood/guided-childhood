// ONE LESSON COUNT, FOR EVERY SURFACE THAT SHOWS ONE.
//
// Plan: plans/2026-10-08-lessons-hub-plan.md (version 10, PR 1, item 1.3).
//
// Justin opened this work by looking at Lessons for Teo on his phone and
// finding a page that said "0 of 18 passed" over a list the passport counted
// as ten. That was not a bug in either number. It was four readers:
// progress.ts counted the child's school modules plus the age band's AI
// modules, /path counted the school modules alone, journey.ts counted the
// PARENT library, and Home kept a fourth count of its own feeding its
// "move the passport on" copy. Every one of them was defensible on its own
// and no two agreed.
//
// So this is the only place a lesson count is worked out. It is pure over
// rows, takes no database and no client, and a guard runs it on fixtures with
// nothing mocked, because the bug it exists to stop is two loops that happen
// to agree until one is edited.
//
// ── WHAT IT RETURNS, AND WHY THEY ARE SEPARATE NUMBERS ─────────────────────
//
// `school` is the stage's own modules, the ones the child plays in their app.
// `ai` is the age band's AI modules, which a parent plays on the dashboard.
// They are returned APART, on purpose, and composed by the caller:
//
//   The passport folded the AI modules into its lessons count on 13 September
//   2026 so the stamp could not be earned without them (AI literate is in the
//   definition of ready). That decision stands. But a child's own surfaces,
//   the list, the road and the planets, must print `school` alone, because a
//   child cannot open an AI module and a road with twelve dots over ten
//   playable rows is a road that lies.
//
//   Whether the passport keeps the AI modules in its lessons count is
//   decision 1 in the plan, and it is Justin's. Either answer is one line in
//   the caller, never a second count in here.
//
// `anyLesson` is the third number, and it belongs to the planets. A planet
// opens on lessons passed of ANY kind, so it counts non school completions
// plus finished missions, which is what lib/planet/server.ts counted before
// this file existed. It is returned explicitly rather than derived, because
// routing the planets through a school only count would have shut a planet
// that was open yesterday for a child whose passes were all in the Learn tab.
//
// `statusById` is the per module state every surface renders from, so the
// hub, the child's list and the road cannot disagree about which lesson is
// this week's.

import { AI_AUDIENCE_TO_STAGE } from '@/lib/pathway/readiness-areas'
import { lessonCreditKeys, type PassByRow } from '@/lib/pathway/lesson-credit'
import { schoolCreditKey, type SchoolModule } from '@/lib/lessons/school-path'

export type CompletionRow = {
  lesson_id: string
  lesson_source: string
  passed: boolean | null
}

export type MissionRow = {
  lesson_id: string
  status: string
  /** Set only on a finish carrying the opener's cookie. Never from a query string. */
  done_together?: boolean | null
  /** When the stars were paid, once, on the first finish. */
  paid_at?: string | null
  attempts?: number | null
}

export type AiModuleRow = { id: string; audience: string | null }

/** A `source: 'remember'` answer, for the road's kept state. PR 6 passes these; nobody else needs to. */
export type RememberRow = { lesson_id: string | null; answered_at: string }

/**
 * What one module is, for every surface that draws it.
 *
 * `passed` and `skipped` are facts. `thisWeek` is the one module that is
 * open: the first neither passed nor skipped. `locked` is the paywall and
 * nothing else, and it is never shown to a child as a padlock (the child's
 * row says "After lesson 6, this one is waiting for you" instead; the plan
 * spent three rounds taking the money out of the child's words and a greyed
 * out friend behind a lock puts it straight back).
 *
 * `paced` is the rest: a module that is neither passed, nor this week's, nor
 * locked. It carries no button, because the opener refuses a second school
 * lesson inside seven days and a button that bounces is worse than no button.
 *
 * `kept` is passed plus time: the lesson survived a Remember check ninety or
 * more days after its pass. `keptRings` counts those, capped at four, which
 * is what keeps the road moving after a stage's modules run out.
 */
export type ModuleState = {
  state: 'passed' | 'thisWeek' | 'paced' | 'locked'
  doneTogether: boolean
  kept: boolean
  keptRings: number
}

export type LessonPathResult = {
  school: {
    done: number
    total: number
    /** The first module neither passed nor skipped, with its 1 indexed place in teaching order. */
    next: { id: string; position: number } | null
  }
  ai: { done: number; total: number }
  /** The planets' own number: lessons passed of any kind. */
  anyLesson: number
  statusById: Record<string, ModuleState>
}

/**
 * The passport's lessons pair: the school modules plus the age band's AI
 * modules, which is how the stamp has read since 13 September 2026.
 *
 * Decision 1 in the plan (do the AI modules stay in the stamp's lessons
 * count) is THIS function. Every surface that talks about the stamp, the
 * passport in progress.ts and Home's "move the passport on" card, reads it,
 * so whichever way Justin decides is one edit and the two cannot drift. A
 * child's own surfaces never read it: they print `school` alone.
 */
export function passportLessons(path: LessonPathResult): { done: number; total: number } {
  return {
    done: path.school.done + path.ai.done,
    total: path.school.total + path.ai.total,
  }
}

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

export function childLessonPath({
  modules,
  aiModules,
  completions,
  missions,
  passBy,
  childId,
  stageNum,
  paid,
  rememberRows,
}: {
  /** The stage's school modules, already in teaching order (schoolModulesForStage). */
  modules: SchoolModule[] | null | undefined
  /** Every AI module row. Filtered to this stage here, by the one imported map. */
  aiModules?: AiModuleRow[] | null
  /** The child's completions. All sources and all time: `anyLesson` needs the lot. */
  completions: CompletionRow[] | null | undefined
  /** The child's missions. Finished ones are half of `anyLesson`, and `skipped` moves `next`. */
  missions?: MissionRow[] | null
  /** migration 162's who passed rows. Null means "unknown", which credits the household. */
  passBy: PassByRow[] | null
  childId: string | null
  /** 1 to 5. Only used to pick this stage's AI modules. */
  stageNum?: number
  /** Full access. The paywall is the only thing `locked` means. */
  paid?: boolean
  /** PR 6 only. Defaulted so the six callers that do not care pass nothing. */
  rememberRows?: RememberRow[] | null
}): LessonPathResult {
  const mods = modules ?? []
  const comps = completions ?? []
  const miss = missions ?? []

  // The one credit rule, shared by import with the passport and the four
  // readiness areas: a child's own pass, or a parent's pass for the family,
  // or a legacy completion that migration 162 never knew about. A sibling's
  // own pass is exactly what does not count.
  const credited = lessonCreditKeys(comps, passBy, childId)

  const skipped = new Set(miss.filter(m => m.status === 'skipped').map(m => m.lesson_id))
  const isPassed = (id: string) => credited.has(schoolCreditKey(id))

  // `next` is the first module neither passed nor skipped. A skipped module
  // does not block the road, which is the whole point of letting a parent
  // start a different one after three weeks.
  let next: { id: string; position: number } | null = null
  for (let i = 0; i < mods.length; i += 1) {
    const id = mods[i].id
    if (!isPassed(id) && !skipped.has(id)) {
      next = { id, position: i + 1 }
      break
    }
  }

  // Kept, per lesson: a remember answer ninety or more days after the pass.
  // Each further ninety day survival closes a quarter of the dot's ring,
  // capped at four, and no two can land inside the same ninety days. Two
  // states alone would be eighteen transitions all spent by about month
  // seven, which is not the three years the road is meant to carry.
  const keptRingsById = new Map<string, number>()
  if (rememberRows && rememberRows.length) {
    const passedAtById = new Map<string, number>()
    for (const m of miss) {
      if (m.status !== 'done' || !m.paid_at) continue
      passedAtById.set(m.lesson_id, Date.parse(m.paid_at))
    }
    const byLesson = new Map<string, number[]>()
    for (const r of rememberRows) {
      if (!r.lesson_id) continue
      const at = Date.parse(r.answered_at)
      if (Number.isNaN(at)) continue
      const list = byLesson.get(r.lesson_id) ?? []
      list.push(at)
      byLesson.set(r.lesson_id, list)
    }
    for (const [lessonId, times] of byLesson) {
      const passedAt = passedAtById.get(lessonId)
      if (passedAt === undefined || Number.isNaN(passedAt)) continue
      let rings = 0
      let mark = passedAt
      for (const at of times.sort((a, b) => a - b)) {
        if (rings >= 4) break
        if (at - mark >= NINETY_DAYS_MS) {
          rings += 1
          mark = at
        }
      }
      if (rings > 0) keptRingsById.set(lessonId, rings)
    }
  }

  const togetherById = new Set(miss.filter(m => m.done_together === true).map(m => m.lesson_id))

  const statusById: Record<string, ModuleState> = {}
  for (let i = 0; i < mods.length; i += 1) {
    const id = mods[i].id
    const rings = keptRingsById.get(id) ?? 0
    let state: ModuleState['state']
    if (isPassed(id)) state = 'passed'
    else if (next && id === next.id) state = 'thisWeek'
    // The free taste survives: the first module is always open, and the
    // module that is next open is always open, whatever the paywall says. A
    // family that has not paid can walk a stage at one a week, which is
    // deliberate and is decision 5 in the plan.
    else if (!paid && i > 0) state = 'locked'
    else state = 'paced'
    statusById[id] = {
      state,
      doneTogether: togetherById.has(id),
      kept: rings > 0,
      keptRings: rings,
    }
  }

  const schoolDone = mods.filter(m => isPassed(m.id)).length

  // This stage's AI modules, filtered by the one imported map rather than a
  // fifth copy of it. Three copies of that map already existed in the repo.
  const aiInStage = stageNum
    ? (aiModules ?? []).filter(m => AI_AUDIENCE_TO_STAGE[m.audience ?? ''] === stageNum)
    : []
  const aiDone = aiInStage.filter(m => credited.has(`ai_lesson:${m.id}`)).length

  // The planets' number, over whatever rows the caller passes (all time for
  // the planets and the sticker book, one month for the review email, a week
  // for the catch up card). Not school completions, because since
  // 29 September a star lesson pass writes one of those AND finishes a
  // mission, so counting both would open two planets for one lesson; and a
  // mission is `done` only on a pass (plan item 1.2). Distinct per source and
  // lesson, so a household row beside the child's own row for the same lesson
  // counts once. Over one child's rows that is exactly the head counts
  // lib/planet/server.ts used to run, because both tables are unique there.
  const anyLesson =
    new Set(comps.filter(c => c.passed === true && c.lesson_source !== 'school_lesson').map(c => `${c.lesson_source}:${c.lesson_id}`)).size +
    new Set(miss.filter(m => m.status === 'done').map(m => m.lesson_id)).size

  return {
    school: { done: schoolDone, total: mods.length, next },
    ai: { done: aiDone, total: aiInStage.length },
    anyLesson,
    statusById,
  }
}
