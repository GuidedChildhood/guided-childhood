import { countsTowardPathway } from './script-status'
import type { createClient } from '@/lib/supabase/server'
import { stageDevicePct } from '@/lib/devices/family'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type StageId = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

function deviceAgeToStage(minAge: number): StageId {
  if (minAge <= 7) return 'foundation'
  if (minAge <= 10) return 'builder'
  if (minAge <= 13) return 'explorer'
  if (minAge <= 15) return 'shaper'
  return 'independent'
}

/** Which stage a family device belongs to, via the guide that covers it. */
function guideStageLookup(guides: { device_key: string; min_age: number }[] | null) {
  const byKey = new Map((guides ?? []).map(g => [g.device_key, g.min_age]))
  return (guideKey: string): string | null => {
    const minAge = byKey.get(guideKey)
    return minAge === undefined ? null : deviceAgeToStage(minAge)
  }
}

export interface StageProgress {
  scriptsPct: number
  streakPct: number
  devicesPct: number
  lessonsPct: number
  // The passport page shows lessons as the simple visible process:
  // done of total, straight from the completions.
  lessonsDone: number
  lessonsTotal: number
  overallPct: number
  // Scripts as counts, not only a percent, since 18 August 2026: the passport
  // timeline paces items left against weeks left, and items are lessons plus
  // scripts, the same two the stamp counts.
  scriptsDone: number
  scriptsTotal: number
  // The stamp is earned when the stage's real tasks, its lessons and scripts,
  // are all done. Deliberately not gated on a four week streak, so completing
  // the content a parent can actually finish is what fills and earns the
  // stamp. The streak and devices still lift the ring, they just do not block
  // the badge.
  contentComplete: boolean
}

// ── WHOSE LESSON COUNTS, THE MULTI CHILD RULE ───────────────────────────────
//
// Justin, 18 August 2026: "the passport has to be per child, individual task,
// quests lessons digi moments etc all child related." The data model for it is
// migration 162's lesson_pass_by, which records WHO passed: a child row for a
// pass on a kid link, a parent row (null child_id) for the signed in
// dashboard, because "a parent watching a lesson is watching it for the
// family rather than for one child".
//
// So for child X a lesson is credited when any of these holds:
//   1. X passed it on their own link (a pass_by row with X's child_id).
//   2. The parent passed it (a pass_by row with who parent), which counts for
//      every child by 162's own doctrine.
//   3. LEGACY: a lesson_completions pass exists and pass_by knows nothing
//      about that lesson at all. pass_by is additive since 162 and was never
//      backfilled, so the absence of a row is history, not absence of work.
//      Without this rule every family who learned before mid August would
//      wake to an emptier passport.
//
// A sibling's own pass (a pass_by row with a DIFFERENT child_id, and no
// parent or legacy credit) is exactly what stops counting, which is the
// point: the eldest doing their lessons never filled the youngest's page.
type PassByRow = { lesson_id: string; who: string; child_id: string | null }
function lessonCreditKeys(
  completions: { lesson_id: string; lesson_source: string; passed: boolean | null }[] | null,
  passBy: PassByRow[] | null,
  childId: string | null,
): Set<string> {
  const passedCompletions = (completions ?? []).filter(c => c.passed !== false)
  if (!childId || passBy === null) {
    return new Set(passedCompletions.map(c => `${c.lesson_source}:${c.lesson_id}`))
  }
  const knownToPassBy = new Set((passBy ?? []).map(r => r.lesson_id))
  const credited = new Set<string>()
  for (const r of passBy ?? []) {
    // A parent row with a NULL child is the old doctrine (watching for the
    // family) and credits every child. A parent row that NAMES a child is the
    // new doctrine arriving (the plumbing session's write side change: the
    // parent watched WITH that child, from ?child=) and credits that child
    // only. Today every parent row is null so both readings agree; when the
    // write side lands, this line starts meaning it without an edit here.
    const parentCredit = r.who === 'parent' && (r.child_id === null || r.child_id === childId)
    if (parentCredit || r.child_id === childId) credited.add(r.lesson_id)
  }
  const out = new Set<string>()
  for (const c of passedCompletions) {
    if (credited.has(c.lesson_id) || !knownToPassBy.has(c.lesson_id)) {
      out.add(`${c.lesson_source}:${c.lesson_id}`)
    }
  }
  return out
}

// Blends four independent signals into one progress number per stage:
// scripts actually read, the daily practice streak, devices set up for
// that age, and lessons marked done. Each was previously tracked in
// isolation with no combined view anywhere in the app.
export async function getStageProgress(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  streakWeeks: number,
  /**
   * Whose passport the lessons count for. Null keeps the family wide reading,
   * which is the pre multi child behaviour and stays right for surfaces that
   * genuinely ask the household question. See lessonCreditKeys for the rule.
   */
  childId: string | null = null,
): Promise<StageProgress> {
  const [
    { data: stageScripts },
    { data: userCompletedScripts },
    { data: stageDeviceGuides },
    { data: deviceProgress },
    { data: lessonsForStage },
    { data: lessonCompletions },
    { data: familyDevices },
    { data: passBy },
  ] = await Promise.all([
    supabase.from('scripts').select('sort_order').eq('stage_id', stageId),
    supabase.from('script_completions').select('script_sort_order, status').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, min_age'),
    supabase.from('device_setup_progress').select('device_key, status').eq('user_id', userId),
    supabase.from('lessons').select('id').eq('stage_id', stageId).eq('audience', 'parent').neq('status', 'stub'),
    supabase.from('lesson_completions').select('lesson_id, lesson_source, passed').eq('user_id', userId),
    // The family's own device list, from migration 106. Before that migration,
    // or before they have told us, this comes back empty and the catalogue
    // reading below is used exactly as it was.
    supabase.from('family_devices').select('guide_key, retired_at').eq('user_id', userId),
    childId
      ? supabase.from('lesson_pass_by').select('lesson_id, who, child_id').eq('user_id', userId)
      : Promise.resolve({ data: null }),
  ])

  // Scripts: how many of this stage's scripts this family has RESOLVED, which
  // is a stricter word than it used to be and the difference matters.
  //
  // A row used to be written simply by opening a script, and every row counted
  // here, at thirty per cent of the blend. So browsing ten scripts moved a
  // child's passport a third of the way through a stage with no conversation
  // having happened, and none of the ten could ever be offered again.
  //
  // Resolved now means the parent said something: they used it, or they read
  // it and said it does not apply. Merely opening one counts for nothing, which
  // is what makes "not needed at this time" possible and what lets an unfinished
  // script come back. See migration 157.
  const stageScriptOrders = new Set((stageScripts ?? []).map(s => s.sort_order))
  const completedInStage = (userCompletedScripts ?? [])
    .filter(c => stageScriptOrders.has(c.script_sort_order))
    .filter(c => countsTowardPathway((c as { status?: string }).status))
    .length
  const scriptsPct = stageScriptOrders.size > 0 ? Math.round((completedInStage / stageScriptOrders.size) * 100) : 0

  // Streak: consistency credit, caps out at 4 weeks so it does not require
  // a permanent streak to ever show full marks.
  const streakPct = Math.min(Math.round((streakWeeks / 4) * 100), 100)

  // Devices: bucket each guide to a stage by its minimum age, then read against
  // only the devices the family actually has.
  //
  // Their own list wins when they have given us one, because that is the whole
  // point of asking at setup: a house with an iPad and a Switch is measured
  // against an iPad and a Switch, not against nineteen published guides four of
  // which are social apps. Without a list we fall back to the catalogue minus
  // anything they marked not in our home, which is how this always read.
  const notOwnedDeviceKeys = new Set((deviceProgress ?? []).filter(d => d.status === 'not_owned').map(d => d.device_key))
  const doneDeviceKeys = new Set((deviceProgress ?? []).filter(d => d.status !== 'not_owned').map(d => d.device_key))
  const stageOfGuide = guideStageLookup(stageDeviceGuides)
  const homeDevices = (familyDevices ?? []).filter(d => !d.retired_at).map(d => ({ guideKey: d.guide_key as string | null }))

  const devicesPct = homeDevices.length > 0
    ? stageDevicePct({ homeDevices, stageOfGuide, stageId, doneGuideKeys: doneDeviceKeys }).pct
    : (() => {
        const guidesInStage = (stageDeviceGuides ?? []).filter(d => deviceAgeToStage(d.min_age) === stageId)
        const ownedInStage = guidesInStage.filter(d => !notOwnedDeviceKeys.has(d.device_key))
        const done = ownedInStage.filter(d => doneDeviceKeys.has(d.device_key)).length
        return ownedInStage.length > 0 ? Math.round((done / ownedInStage.length) * 100) : 100
      })()

  // Lessons. Counted exactly the way the Lessons page counts them, because
  // for months the two disagreed in public.
  //
  // Justin, 8 August 2026: "It says 5 of 37 on passport page but click through
  // is 3 of 29 so needs to be clear." Both numbers were wrong in the same
  // direction and for two separate reasons, measured on the live database:
  //
  //   total  the passport added the 8 AI module lessons to the stage's 29
  //          parent lessons and got 37. The Lessons page counts 29, and says
  //          why: only the family library set moves the progress report,
  //          because that is the set the child sees on their own page. The AI
  //          modules ride along as bonus.
  //   done   the passport counted ANY completion row, so a check that was
  //          FAILED still ticked. Four rows, one of them failed, plus one AI,
  //          reads as 5. The Lessons page counts passes only, and got 3.
  //
  // A failed run counting as done is the worse half: it inflates a parent's
  // progress with work their child got wrong, which is the one number in the
  // product that has to be honest. Both rules now match the Lessons page.
  const passedCompletionKeys = lessonCreditKeys(lessonCompletions, passBy as PassByRow[] | null, childId)
  const totalLessonsInStage = lessonsForStage?.length ?? 0
  const lessonsDone =
    (lessonsForStage ?? []).filter(l => passedCompletionKeys.has(`lesson:${l.id}`)).length
  const lessonsPct = totalLessonsInStage > 0 ? Math.round((lessonsDone / totalLessonsInStage) * 100) : 0

  // Lessons carry the most weight in the passport circle: the stamp is
  // about what the child learned, with the daily habit and setup behind it.
  const overallPct = Math.round(lessonsPct * 0.4 + scriptsPct * 0.3 + streakPct * 0.15 + devicesPct * 0.15)

  const totalContent = stageScriptOrders.size + totalLessonsInStage
  const doneContent = completedInStage + lessonsDone
  const contentComplete = totalContent > 0 && doneContent === totalContent

  return { scriptsPct, streakPct, devicesPct, lessonsPct, lessonsDone, lessonsTotal: totalLessonsInStage, scriptsDone: completedInStage, scriptsTotal: stageScriptOrders.size, overallPct, contentComplete }
}

export function nextStageId(current: StageId): StageId | null {
  const idx = STAGE_ORDER.indexOf(current)
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null
}

// All five stages' progress in one pass, for the passport. getStageProgress is
// perfect for one stage but runs seven queries; calling it five times would be
// thirty five. This fetches the raw rows once and computes every stage in
// memory, so the passport is cheap. The number per stage matches
// getStageProgress exactly: the blend of scripts, streak, devices and lessons.
export async function getAllStagesProgress(
  supabase: SupabaseClient,
  userId: string,
  streakWeeks: number,
  /** Whose passport. Null keeps the family wide reading. See lessonCreditKeys. */
  childId: string | null = null,
): Promise<Record<StageId, StageProgress>> {
  const [
    { data: scripts },
    { data: completedScripts },
    { data: deviceGuides },
    { data: deviceProgress },
    { data: lessons },
    { data: lessonCompletions },
    { data: familyDevices },
    { data: passBy },
  ] = await Promise.all([
    supabase.from('scripts').select('sort_order, stage_id'),
    supabase.from('script_completions').select('script_sort_order, status').eq('user_id', userId),
    supabase.from('device_guides').select('device_key, min_age'),
    supabase.from('device_setup_progress').select('device_key, status').eq('user_id', userId),
    supabase.from('lessons').select('id, stage_id').eq('audience', 'parent').neq('status', 'stub'),
    supabase.from('lesson_completions').select('lesson_id, lesson_source, passed').eq('user_id', userId),
    supabase.from('family_devices').select('guide_key, retired_at').eq('user_id', userId),
    childId
      ? supabase.from('lesson_pass_by').select('lesson_id, who, child_id').eq('user_id', userId)
      : Promise.resolve({ data: null }),
  ])

  // Same stricter rule as getStageProgress above: resolved, not merely opened.
  // These two functions feed the road and the passport respectively, and a
  // parent who saw them disagree would be right to stop trusting both.
  const completedScriptOrders = new Set(
    (completedScripts ?? [])
      .filter(c => countsTowardPathway((c as { status?: string }).status))
      .map(c => c.script_sort_order),
  )
  // Devices only count the ones a family actually has: a device marked not in
  // our home drops out of the denominator, so the passport reads against their
  // real devices, never all nineteen guides. A device set up counts as done.
  const notOwnedDeviceKeys = new Set((deviceProgress ?? []).filter(d => d.status === 'not_owned').map(d => d.device_key))
  const doneDeviceKeys = new Set((deviceProgress ?? []).filter(d => d.status !== 'not_owned').map(d => d.device_key))
  const passedCompletionKeys = lessonCreditKeys(lessonCompletions, passBy as PassByRow[] | null, childId)
  const streakPct = Math.min(Math.round((streakWeeks / 4) * 100), 100)
  // Their own list of what is in the house, when they have given us one.
  const stageOfGuide = guideStageLookup(deviceGuides)
  const homeDevices = (familyDevices ?? []).filter(d => !d.retired_at).map(d => ({ guideKey: d.guide_key as string | null }))

  const out = {} as Record<StageId, StageProgress>
  for (const stageId of STAGE_ORDER) {
    const stageScripts = (scripts ?? []).filter(s => s.stage_id === stageId)
    const scriptsDone = stageScripts.filter(s => completedScriptOrders.has(s.sort_order)).length
    const scriptsPct = stageScripts.length > 0 ? Math.round((scriptsDone / stageScripts.length) * 100) : 0

    // Their real devices when we know them, the catalogue minus not owned when
    // we do not. Either way, no owned devices for this stage means nothing to
    // set up here, so that part of the ring is full rather than stuck at zero.
    let devicesPct: number
    if (homeDevices.length > 0) {
      devicesPct = stageDevicePct({ homeDevices, stageOfGuide, stageId, doneGuideKeys: doneDeviceKeys }).pct
    } else {
      const guidesInStage = (deviceGuides ?? []).filter(d => deviceAgeToStage(d.min_age) === stageId)
      const ownedInStage = guidesInStage.filter(d => !notOwnedDeviceKeys.has(d.device_key))
      const devicesDone = ownedInStage.filter(d => doneDeviceKeys.has(d.device_key)).length
      devicesPct = ownedInStage.length > 0 ? Math.round((devicesDone / ownedInStage.length) * 100) : 100
    }

    // Same rule as the single stage version above and as the Lessons page:
    // family library lessons only, and a pass only. See the long note there.
    const stageLessons = (lessons ?? []).filter(l => l.stage_id === stageId)
    const totalLessons = stageLessons.length
    const lessonsDone =
      stageLessons.filter(l => passedCompletionKeys.has(`lesson:${l.id}`)).length
    const lessonsPct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0

    const totalContent = stageScripts.length + stageLessons.length
    const doneContent = scriptsDone + lessonsDone
    out[stageId] = {
      scriptsPct, streakPct, devicesPct, lessonsPct,
      lessonsDone, lessonsTotal: totalLessons,
      scriptsDone, scriptsTotal: stageScripts.length,
      overallPct: Math.round(lessonsPct * 0.4 + scriptsPct * 0.3 + streakPct * 0.15 + devicesPct * 0.15),
      contentComplete: totalContent > 0 && doneContent === totalContent,
    }
  }
  return out
}
