import type { createClient } from '@/lib/supabase/server'
import type { ChecklistSection } from '@/components/pathway/PassportStamps'
import type { StageProgress, StageId } from '@/lib/pathway/progress'
import { computeJobsStreak, jobsTodayStatus, type StreakQuest, type StreakTick } from '@/lib/pathway/jobs-streak'
import type { ParentReport } from '@/lib/balance/parent-report'

// The passport's five section checklist, in one place.
//
// It used to be built inside the Is it working report, which is where all the
// live readings happened to be fetched. When that report became a section of
// the pathway page rather than its own page, the passport it fed was left
// behind: the report kept building the rows and stopped rendering them, and the
// pathway page built its own thinner stamps with no sections at all. So
// PassportBook silently fell back to the old four task list and the rows, their
// how it goes green lines, the kept up not ticked off chip and the ahead of age
// safety warning all became unreachable. Nothing typechecked as broken because
// sections is optional.
//
// It lives here now so there is exactly one definition of those five rows, and
// the page that renders the passport is the page that builds them.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

const STAGE_SLUGS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

// The upper age of each band, for spotting a device set up ahead of the child.
const AGE_BAND_UPPER: Record<string, number> = { '4-7': 7, '8-10': 10, '11-13': 13, '13-15': 15, '16+': 99 }

export type PassportChild = {
  id: string
  age_band?: string | null
}

export type StageSections = {
  /** The five rows for this stage. */
  sections: ChecklistSection[]
  /** The flat average of the five rows, which is what the current stage's ring reads. */
  blended: number
}

/**
 * The five rows per stage number (1 to 5), plus each stage's blended percent.
 *
 * Devices and lessons vary per stage, straight from the blend. Moments, jobs
 * and screen balance read for the child right now, so they belong to the stage
 * the child is actually on and show as Later everywhere else: a stage still
 * ahead must never borrow today's wellbeing and read a progress it has not
 * earned.
 *
 * parentReport is passed in rather than built here, because the page that shows
 * the balance report has already built it and building it twice would give one
 * page two sources for the same week.
 */
export async function buildPassportSections(
  supabase: SupabaseClient,
  userId: string,
  child: PassportChild | null,
  allProgress: Record<StageId, StageProgress> | null,
  currentStageNum: number | null,
  opts: { openMoments: number; solvedMoments: number; parentReport: ParentReport | null },
): Promise<Record<number, StageSections>> {
  const out: Record<number, StageSections> = {}
  if (!allProgress || !currentStageNum) return out

  const { openMoments, solvedMoments, parentReport } = opts

  // Moments: how much of what this family has raised is now sorted.
  const momentsTotal = openMoments + solvedMoments
  const momentsPct = momentsTotal > 0 ? Math.round((solvedMoments / momentsTotal) * 100) : 100

  let jobsStatus: 'on_track' | 'pending' | 'none' = 'none'
  let jobsStreakDays = 0
  let aheadNames: string[] = []
  let homeDeviceCount = 0

  if (child?.id) {
    const sinceJobs = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10)
    const childUpper = child.age_band ? (AGE_BAND_UPPER[child.age_band] ?? 99) : 99
    const [jqRes, jtRes, dgRes, dpRes, fdRes] = await Promise.all([
      supabase.from('family_quests').select('id, schedule, schedule_days, created_at').eq('user_id', userId).eq('child_id', child.id).eq('active', true),
      supabase.from('quest_ticks').select('quest_id, tick_date, status').eq('user_id', userId).eq('child_id', child.id).gte('tick_date', sinceJobs),
      supabase.from('device_guides').select('device_key, name, min_age'),
      supabase.from('device_setup_progress').select('device_key, status').eq('user_id', userId),
      supabase.from('family_devices').select('id').eq('user_id', userId).is('retired_at', null),
    ])
    // Has this family told us what is actually in the house? Until they do, the
    // devices row is measured against our whole catalogue, and the row says so
    // rather than quietly showing a percentage of the wrong thing.
    homeDeviceCount = (fdRes.data ?? []).length
    const jq = (jqRes.data ?? []) as StreakQuest[]
    const jt = (jtRes.data ?? []) as StreakTick[]
    jobsStatus = jobsTodayStatus(jq, jt)
    jobsStreakDays = computeJobsStreak(jq, jt).streakDays
    // A device counts as ahead only when it is actually set up (owned) and its
    // minimum age is above the child's band, like a smartphone for a young one.
    const doneKeys = new Set((dpRes.data ?? []).filter(d => d.status !== 'not_owned').map(d => d.device_key))
    aheadNames = (dgRes.data ?? [])
      .filter(d => doneKeys.has(d.device_key) && (d.min_age as number) > childUpper)
      .map(d => d.name as string)
  }

  const jobsPct = jobsStatus === 'on_track' ? 100 : jobsStatus === 'pending' ? 40 : 0
  // Balance reading: healthy or a light week is full, over is a nudge, well
  // over is the clear to do. Never a lock, just the honest heads up.
  const balancePct = !parentReport ? 100
    : parentReport.status === 'well_over' ? 0
    : parentReport.status === 'over' ? 50 : 100
  const balanceDetail = !parentReport ? 'No screens logged'
    : parentReport.status === 'under' ? 'Light week'
    : parentReport.status === 'healthy' ? 'Healthy'
    : parentReport.status === 'over' ? 'A bit over' : 'Well over'

  for (let id = 1; id <= 5; id++) {
    const prog = allProgress[STAGE_SLUGS[id - 1]]
    if (!prog) continue
    const isCurrent = id === currentStageNum
    const reached = isCurrent || prog.contentComplete || id < currentStageNum

    const sections: ChecklistSection[] = [
      {
        key: 'devices', emoji: '🔧', label: 'Devices set up',
        pct: reached ? prog.devicesPct : 0,
        detail: !reached ? 'Ahead' : prog.devicesPct >= 100 ? 'All set' : prog.devicesPct === 0 ? 'To set up' : `${prog.devicesPct}%`,
        href: '/dashboard/devices',
        help: homeDeviceCount > 0
          ? `Measured against the ${homeDeviceCount} screen${homeDeviceCount === 1 ? '' : 's'} you listed as yours. Work through the setup guide for each one, and add anything new the day it arrives.`
          : 'List the screens you actually have first, on the Devices page. Until you do this counts every guide we publish rather than your house.',
        ...(isCurrent && aheadNames.length > 0
          ? { alert: `${aheadNames.join(', ')} is set up ahead of their age. Worth a look together.` }
          : {}),
      },
      {
        key: 'moments', emoji: '💬', label: 'Moments to resolve',
        pct: isCurrent ? momentsPct : 0,
        detail: !isCurrent ? 'Later' : openMoments > 0 ? `${openMoments} to resolve` : 'All clear',
        href: '/dashboard/moments',
        help: 'Open a moment, use the words it gives you, and mark it resolved when it is done.',
      },
      {
        key: 'lessons', emoji: '📚', label: 'Lessons and tests',
        pct: prog.lessonsPct,
        detail: prog.lessonsTotal > 0 ? `${prog.lessonsDone} of ${prog.lessonsTotal}` : 'None yet',
        href: `/dashboard/lessons?stage=${id}`,
        help: 'Watch or lead each lesson for this stage, then pass its check. A failed run does not count, so it can be retaken.',
      },
      {
        key: 'jobs', emoji: '⭐', label: 'Jobs and routines',
        pct: isCurrent ? jobsPct : 0,
        detail: !isCurrent ? 'Later' : jobsStreakDays > 0 ? `${jobsStreakDays} day streak` : jobsStatus === 'pending' ? 'Jobs to do' : 'Set a job',
        href: '/dashboard/quests',
        help: 'Goes green once the jobs are set and being done on time, and stays green while that keeps up.',
        ongoing: true,
      },
      {
        key: 'balance', emoji: '⚖️', label: 'Screen balance',
        pct: isCurrent ? balancePct : 0,
        detail: !isCurrent ? 'Later' : balanceDetail,
        // The balance report is further down the same page the passport is on.
        href: '#screen-balance',
        help: 'Goes green when the week averages at or under the healthy amount for their age. Judged across the whole week, so one big Saturday is fine.',
        ongoing: true,
      },
    ]

    out[id] = {
      sections,
      blended: Math.round(sections.reduce((sum, x) => sum + x.pct, 0) / sections.length),
    }
  }

  return out
}
