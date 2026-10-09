import type { createClient } from '@/lib/supabase/server'
import type { StageId } from './progress'
import { homeSetupCount, toFamilyDevice, type FamilyDeviceRow } from '@/lib/devices/family'
import { createAdminClient } from '@/lib/supabase/admin'
import { listStarLessons } from '@/lib/quests/star-lesson-catalogue'
import { schoolModulesForStage } from '@/lib/lessons/school-path'
import { childLessonPath, type CompletionRow } from './lesson-path'
import type { PassByRow } from './lesson-credit'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// The journey: the three strands of the pathway resolved into real counts
// and the one next thing for each. Devices set up, moments worked through,
// lessons done. This is what the single spine pathway renders, so a parent
// sees one clear next step instead of a pile of separate features.

function deviceAgeToStage(minAge: number): StageId {
  if (minAge <= 7) return 'foundation'
  if (minAge <= 10) return 'builder'
  if (minAge <= 13) return 'explorer'
  if (minAge <= 15) return 'shaper'
  return 'independent'
}

export interface Journey {
  devices: { done: number; total: number; nextName: string | null; href: string }
  moments: { open: number; topLabel: string | null; href: string }
  lessons: { done: number; total: number; nextTitle: string | null; href: string }
}

export async function getJourney(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  /**
   * Whose lessons. The lesson strand is the CHILD's school path since
   * 9 October 2026, so it reads one child's passes. Null keeps the household
   * reading for a caller with no child in view.
   */
  childId: string | null = null,
): Promise<Journey> {
  // The passport counts the same screens the devices page does, so it reads
  // progress the same guarded way: per screen after migration 169, per guide
  // before it. Naming a column that is not there yet fails the whole query, and
  // migrations here are run by hand, so the fallback is not optional.
  const readProgress = async (): Promise<{
    rows: { device_key: string; status?: string; family_device_id?: string | null }[]
    perDevice: boolean
  }> => {
    const withDevice = await supabase
      .from('device_setup_progress').select('device_key, status, family_device_id').eq('user_id', userId)
    if (!withDevice.error) return { rows: withDevice.data ?? [], perDevice: true }
    const legacy = await supabase
      .from('device_setup_progress').select('device_key, status').eq('user_id', userId)
    return { rows: legacy.data ?? [], perDevice: false }
  }

  const [
    { data: deviceGuides },
    progress,
    { data: concerns },
    stageModules,
    { data: lessonCompletions },
    { data: passBy },
    { data: familyDevices },
  ] = await Promise.all([
    supabase.from('device_guides').select('device_key, name, min_age').order('min_age', { ascending: true }),
    readProgress(),
    supabase.from('concerns').select('label, times_flagged').eq('user_id', userId).in('status', ['open', 'improving']).order('times_flagged', { ascending: false }).limit(1),
    // The child's school modules for the stage, in teaching order. The admin
    // client, because the curriculum catalogue is service role only; ids and
    // titles are all that is read.
    listStarLessons(createAdminClient()).then(rows => schoolModulesForStage(rows, stageId)),
    (() => {
      const q = supabase.from('lesson_completions').select('lesson_id, lesson_source, passed, child_id').eq('user_id', userId)
      return childId ? q.or(`child_id.eq.${childId},child_id.is.null`) : q
    })(),
    childId
      ? supabase.from('lesson_pass_by').select('lesson_id, who, child_id').eq('user_id', userId)
      : Promise.resolve({ data: null }),
    supabase.from('family_devices').select('id, label, kind, guide_key, shared, retired_at').eq('user_id', userId),
  ])

  // Devices.
  //
  // When the family has told us what is in the house, this counts their house:
  // every device they listed, not bucketed by stage, because "2 of 3 set up"
  // about their own iPad, Switch and Smart TV is a sentence a parent can act on
  // and "2 of 11 guides for ages 11 to 13" is not.
  //
  // Without a list it falls back to the age bucketed catalogue, minus anything
  // marked not in our home, which is what this row always showed.
  //
  // Counted by status !== 'not_owned', which is what progress.ts and
  // passport-sections.ts have always used and what this file did NOT. It asked
  // for status === 'done', and migration 306 added a third value, 'agreed', for
  // a family who owns a screen and has decided it runs on an agreement rather
  // than on controls. That would have counted on the passport and not here, so
  // Home would have said 2 of 3 set up while the passport said All set about
  // the same three screens. Two surfaces disagreeing about one number is the
  // bug this codebase keeps coming back to, and it is worse than either answer.
  const guideRows = progress.rows.filter(d => !d.family_device_id)
  const doneKeys = new Set(guideRows.filter(d => (d.status ?? 'done') !== 'not_owned').map(d => d.device_key))
  const notOwnedKeys = new Set(guideRows.filter(d => d.status === 'not_owned').map(d => d.device_key))
  // null, not an empty set, before 169: no screens ticked and cannot tell yet
  // are different answers, and only one of them should blank the passport.
  const doneDeviceIds = progress.perDevice
    ? new Set(progress.rows.filter(d => d.family_device_id && (d.status ?? 'done') !== 'not_owned').map(d => d.family_device_id as string))
    : null
  const home = ((familyDevices ?? []) as FamilyDeviceRow[]).map(toFamilyDevice)
  const homeCount = homeSetupCount(home, doneKeys, doneDeviceIds)

  let devicesDoneCount: number
  let devicesTotal: number
  let nextDeviceName: string | null
  if (homeCount.total > 0) {
    devicesDoneCount = homeCount.done
    devicesTotal = homeCount.total
    nextDeviceName = homeCount.next?.label ?? null
  } else {
    const devicesInStage = (deviceGuides ?? [])
      .filter(d => deviceAgeToStage(d.min_age) === stageId && !notOwnedKeys.has(d.device_key))
    devicesDoneCount = devicesInStage.filter(d => doneKeys.has(d.device_key)).length
    devicesTotal = devicesInStage.length
    nextDeviceName = devicesInStage.find(d => !doneKeys.has(d.device_key))?.name ?? null
  }

  // Moments, the live concerns
  const openConcerns = concerns ?? []

  // Lessons: the CHILD's school path, from the one lesson count. Until
  // 9 October 2026 this strand counted the PARENT library and linked the
  // parent's own player, which is how Home said "Do a lesson with Teo" and
  // opened a lesson written for the adult. It also counted failed runs as
  // done. The child learns it in their own app; the parent's row points at
  // the child's lessons.
  const path = childLessonPath({
    modules: stageModules,
    completions: (lessonCompletions ?? []) as CompletionRow[],
    passBy: passBy as PassByRow[] | null,
    childId,
  })
  const totalLessons = path.school.total
  const lessonsDone = path.school.done
  const nextLessonTitle = path.school.next
    ? stageModules.find(m => m.id === path.school.next?.id)?.title ?? null
    : null
  const nextLessonHref = childId
    ? `/dashboard/lessons/path?child=${childId}`
    : '/dashboard/lessons/path'

  return {
    devices: {
      done: devicesDoneCount,
      total: devicesTotal,
      nextName: nextDeviceName,
      href: '/dashboard/devices',
    },
    moments: {
      open: openConcerns.length,
      topLabel: openConcerns[0]?.label ?? null,
      href: '/dashboard/daily',
    },
    lessons: {
      done: lessonsDone,
      total: totalLessons,
      nextTitle: nextLessonTitle,
      href: nextLessonHref,
    },
  }
}
