import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import KidAskScreenTime, { askDevicesFrom } from '@/components/kid/KidAskScreenTime'
import { getStarBanks } from '@/lib/quests/bank'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { getTimeSettings, getCoreUsedToday } from '@/lib/quests/time-tiers'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { getHolidayBanks } from '@/lib/quests/holiday-bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { readKidJobs } from '@/lib/kid/jobs-read'
import { readTodayState } from '@/lib/kid/today-state'
import { dealLinesFrom } from '@/lib/content/agreement-clauses'
import { toFamilyDevice, type FamilyDeviceRow } from '@/lib/devices/family'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { buddyFor } from '@/lib/kid/buddy'
import type { AgeBand } from '@/lib/content/stages'

// Ask for screen time: the child's own page for it (14 September 2026).
//
// Justin: "a much clearer, simpler designed page, very simple to select
// device and time." The ask itself was already wired through
// /api/quests/time/start (the push to the grown up, the yes box on their
// Home, the guide, the protected windows, the jobs gate). This page reads
// only what the three taps need, and the same helpers the home reads, so
// the minutes ready here are the minutes ready there.
//
// Same trust model as every child surface: the token is the auth.

export const dynamic = 'force-dynamic'

export default async function KidAskPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()
  const userId = link.user_id as string
  const childId = link.child_id as string

  // Every read fails soft: a page that only asks must never fall over on a
  // read. PromiseLike, because a Supabase builder is thenable, not a Promise.
  const soft = <T,>(p: PromiseLike<T>): Promise<T | null> => Promise.resolve(p).then(v => v, () => null)

  const [childRes, region] = await Promise.all([
    supabase.from('children').select('name, age_band, buddy, device_trust, daily_limit_minutes').eq('id', childId).maybeSingle(),
    getFamilyRegion(supabase, userId).catch(() => 'uk' as const),
  ])
  const child = (childRes.data ?? null) as { name?: string | null; age_band?: string | null; buddy?: string | null; device_trust?: string | null; daily_limit_minutes?: number | null } | null
  const ageBand = (child?.age_band ?? null) as AgeBand | null

  const [banks, usedToday, tierSettings, coreUsed, holidays, devicesRes, jobs, today, agreementRes, askRes] = await Promise.all([
    soft(getStarBanks(supabase, userId, [childId], { [childId]: ageBand })),
    soft(getMinutesUsedToday(supabase, userId, [childId])),
    soft(getTimeSettings(supabase, userId, [{ id: childId, age_band: ageBand }])),
    soft(getCoreUsedToday(supabase, userId, [childId])),
    soft(getHolidayBanks(supabase, userId, [childId], new Date(), region)),
    soft(supabase.from('family_devices').select('id, label, kind, guide_key, shared, retired_at')
      .eq('user_id', userId).or(`child_id.eq.${childId},child_id.is.null`).is('retired_at', null).order('created_at', { ascending: true })),
    soft(readKidJobs(supabase, userId, childId)),
    readTodayState(supabase, childId),
    soft(supabase.from('family_agreements').select('bedroom_rule_time, bedroom_rule_location, extra_agreements').eq('user_id', userId).maybeSingle()),
    // A live ask, so a child who left mid wait lands back on the wait.
    soft(supabase.from('device_requests').select('id, device, minutes, status, created_at')
      .eq('child_id', childId).in('status', ['pending', 'approved'])
      .gte('created_at', new Date(Date.now() - 24 * 3600_000).toISOString())
      .order('created_at', { ascending: false }).limit(1).maybeSingle()),
  ])

  const bank = banks?.[0] ?? null
  const starMinutes = (bank as { starMinutes?: number } | null)?.starMinutes ?? STAR_MINUTES
  const settings = tierSettings?.get(childId)
  const coreMinutesLeft = settings && settings.coreMinutesDaily > 0
    ? Math.max(0, settings.coreMinutesDaily - (coreUsed?.get(childId) ?? 0))
    : 0
  const holiday = holidays?.[0] ?? null
  const parentLimit = child?.daily_limit_minutes
  const recommendedMinutes = parentLimit != null && parentLimit > 0 ? parentLimit : recommendedDailyMinutes(ageBand, { region })
  const devices = askDevicesFrom(((devicesRes?.data ?? []) as FamilyDeviceRow[]).map(toFamilyDevice))
  const ticked = new Set((jobs?.todayTicks ?? []).map(t => t.quest_id))
  const left = (jobs?.dueQuests ?? []).filter(q => !ticked.has(q.id))
  const buddy = buddyFor(child?.buddy ?? null)
  const askRow = (askRes?.data ?? null) as { id: string; device: string; minutes: number; status: string } | null

  return (
    <KidAskScreenTime
      token={token}
      childName={child?.name && child.name !== 'Your child' ? child.name : 'Superstar'}
      friend={{ name: buddy.name, img: buddy.img }}
      devices={devices}
      balanceStars={bank?.balance ?? 0}
      starMinutes={starMinutes}
      coreMinutesLeft={coreMinutesLeft}
      holidayMinutes={holiday?.spendableNow ? holiday.remaining : 0}
      recommendedMinutes={recommendedMinutes}
      usedTodayMinutes={usedToday?.get(childId) ?? 0}
      asksFirst={(child?.device_trust ?? 'ask') !== 'trusted'}
      jobsLeft={left.map(q => ({ title: q.title, emoji: (q as { emoji?: string | null }).emoji ?? null, minutes: (q.stars ?? 1) * starMinutes }))}
      blockingJobs={[...new Set(left.filter(q => (q as { blocks_screens?: boolean }).blocks_screens).map(q => q.title))]}
      fiveLeft={today.leftLabels}
      dealLines={dealLinesFrom(agreementRes?.data ?? null).map(l => l.text)}
      initialAsk={askRow ? { id: String(askRow.id), device: String(askRow.device), minutes: Number(askRow.minutes), status: String(askRow.status) } : null}
    />
  )
}
