import type { createClient } from '@/lib/supabase/server'
import { buildOffscreen } from '@/lib/balance/offscreen'
import { buildParentReport, type ParentReport } from '@/lib/balance/parent-report'
import { starWeekStart } from '@/lib/quests/star-week'
import { ukWeekday } from '@/lib/balance/pace'

// This week's balance for one child, assembled once.
//
// The pathway page needs it twice: the passport's screen balance row reads it,
// and the balance report further down the same page shows it. Assembling it in
// two places is how one page ends up quoting two different totals for the same
// week, so it is assembled here and passed to both.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type WeekReportChild = {
  id: string
  name?: string | null
  age_band?: string | null
}

/**
 * The week's screen minutes per device against the healthy amount for the
 * child's age, with the off screen effort beside it. Null when there is no
 * child to read for.
 *
 * The window is the star week. Confirmed printables count as off screen
 * effort beside the approved jobs, and fail soft to jobs alone before migration
 * 087, exactly as this read has always behaved.
 */
export async function getWeekParentReport(
  supabase: SupabaseClient,
  userId: string,
  child: WeekReportChild | null,
): Promise<ParentReport | null> {
  if (!child?.id) return null

  // The star week, Monday in London, the same week the star bank and the quest
  // board count. This used to roll back seven days, which is how the pathway
  // page and the stats page came to quote two different totals for "this week"
  // for the same child. The comment above this function warns about exactly
  // that, one page quoting two totals; the window was the way it got in.
  const weekAgo = starWeekStart()

  const [sessionsRes, questsRes, ticksRes] = await Promise.all([
    supabase.from('device_sessions').select('device, minutes, activity').eq('user_id', userId).eq('child_id', child.id).gte('started_at', weekAgo),
    supabase.from('family_quests').select('id, stars, title').eq('user_id', userId).eq('child_id', child.id).eq('active', true),
    supabase.from('quest_ticks').select('quest_id').eq('user_id', userId).eq('child_id', child.id).eq('status', 'approved').gte('tick_date', weekAgo),
  ])

  const byId = new Map((questsRes.data ?? []).map(q => [q.id as string, { stars: Number(q.stars) || 1, title: (q.title as string) ?? '' }]))
  const approved = ticksRes.data ?? []
  // Carry the title through, so each job's minutes come from what it actually
  // is rather than one average across all of them.
  const jobs = approved.map(t => ({ title: byId.get(t.quest_id as string)?.title ?? '' }))
  const jobStars = approved.reduce((sum, t) => sum + (byId.get(t.quest_id as string)?.stars ?? 1), 0)

  // A page coloured at the table is off screen effort in the plainest sense,
  // whether the child ticked it or the parent recorded it.
  let sheetCount = 0
  let sheetStars = 0
  try {
    const { data: sheets } = await supabase
      .from('printable_completions')
      .select('stars')
      .eq('child_id', child.id).eq('status', 'confirmed')
      .gte('created_at', weekAgo)
    sheetCount = (sheets ?? []).length
    sheetStars = (sheets ?? []).reduce((sum, s) => sum + (Number(s.stars) || 0), 0)
  } catch { /* pre 087, jobs only */ }

  return buildParentReport({
    childName: child.name ?? null,
    ageBand: child.age_band ?? null,
    // activity rides along so a computer lands in the bucket the child named
    // rather than the one its name implies. Null for every other device, which
    // is what the mapper wants.
    deviceMinutes: (sessionsRes.data ?? []).map(d => ({
      device: d.device as string,
      minutes: d.minutes as number,
      activity: (d as { activity?: string | null }).activity ?? null,
    })),
    offscreen: buildOffscreen({ jobs, jobStars, sheets: sheetCount, sheetStars }),
    daysSoFar: ukWeekday(),
  })
}
