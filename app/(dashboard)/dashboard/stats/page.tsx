import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { buildParentReport } from '@/lib/balance/parent-report'
import BalanceReport from '@/components/balance/BalanceReport'
import ParentStartTimer from '@/components/balance/ParentStartTimer'

// The parent balance stats: the screen time graph that replaces the old
// tipping scales card on the Quests page. Reads this week's device sessions,
// buckets them by what the device is for, marks the science based healthy
// level, and reports the off screen wins. Everything best effort: a thin or
// empty week still renders, it just says so.

import { buildOffscreen } from '@/lib/balance/offscreen'
import { buildPace, ukWeekday } from '@/lib/balance/pace'
import PaceCard from '@/components/balance/PaceCard'

export const metadata = { title: 'Balance and stats — Guided Childhood' }

// One week, the same week. This page used to count a rolling last 7 days
// while the star bank, the quest board and the rollover cron all count the
// star week, which starts Monday in London. So the same child read 163 stars
// here and 116 on the Quests page, and "Total this week" on a Wednesday was
// quietly reaching back into last Thursday and Friday. Two numbers for one
// week, neither wrong on its own terms, is the seam this removes.
import { starWeekStart, starWeekStartIso } from '@/lib/quests/star-week'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band, daily_limit_minutes')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const sinceDay = starWeekStart()
  const sinceIso = starWeekStartIso()

  let deviceMinutes: { device: string; minutes: number }[] = []
  let offscreen = { activities: 0, stars: 0, minutes: 0 }
  // Counted first, totalled once at the end through the shared builder, so this
  // page and the tracker can never drift apart again.
  let jobs: { title: string; minutes?: number | null }[] = []
  let jobStars = 0, sheets_ = 0, sheetStars = 0

  if (child?.id) {
    try {
      const { data: sessions } = await supabase
        .from('device_sessions')
        .select('device, minutes')
        .eq('child_id', child.id)
        .gte('started_at', sinceIso)
      const map = new Map<string, number>()
      for (const s of sessions ?? []) {
        const d = (s.device as string) || 'Screen'
        map.set(d, (map.get(d) ?? 0) + (Number(s.minutes) || 0))
      }
      deviceMinutes = [...map.entries()].map(([device, minutes]) => ({ device, minutes }))
    } catch { /* thin week */ }

    try {
      const [{ data: quests }, { data: ticks }] = await Promise.all([
        supabase.from('family_quests').select('id, stars, title').eq('child_id', child.id),
        supabase.from('quest_ticks').select('quest_id').eq('child_id', child.id).eq('status', 'approved').gte('tick_date', sinceDay),
      ])
      const byId = new Map((quests ?? []).map(q => [q.id as string, { stars: Number(q.stars) || 1, title: (q.title as string) ?? '' }]))
      const approved = ticks ?? []
      // Carry the title through, so each job's minutes come from what it
      // actually is rather than one average across all of them.
      jobs = approved.map(t => ({ title: byId.get(t.quest_id as string)?.title ?? '' }))
      jobStars = approved.reduce((sum, t) => sum + (byId.get(t.quest_id as string)?.stars ?? 1), 0)
    } catch { /* thin week */ }

    // A finished printable is one of the clearest off screen wins there is: a
    // page coloured at the table, away from a screen. Confirmed ones count here
    // beside the jobs, so the off screen total reflects the whole real world
    // effort rather than jobs alone. Fails soft before migration 087.
    try {
      const { data: sheets } = await supabase
        .from('printable_completions')
        .select('stars')
        .eq('child_id', child.id).eq('status', 'confirmed')
        .gte('created_at', sinceIso)
      const done = sheets ?? []
      sheets_ = done.length
      sheetStars = done.reduce((sum, s) => sum + (Number(s.stars) || 0), 0)
    } catch { /* pre 087, jobs only */ }

    offscreen = buildOffscreen({ jobs, jobStars, sheets: sheets_, sheetStars })
  }

  const report = buildParentReport({
    childName: child?.name ?? null,
    ageBand: (child?.age_band as string | null) ?? null,
    dailyLimitMins: (child?.daily_limit_minutes as number | null) ?? null,
    deviceMinutes,
    offscreen,
    daysSoFar: ukWeekday(),
  })

  // The pace: the same weekly total and the same age matched guide the report
  // already works out, turned into a daily average and one number for tomorrow.
  // A parent reads this and knows what to do. The graph below is for the parent
  // who then wants to know why.
  const pace = buildPace({
    usedThisWeek: report.totalWeekMins,
    dailyGuide: Math.round(report.healthyWeekMins / 7),
  })

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ‹ Quests
      </Link>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '10px 0 8px' }}>Balance and stats</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20 }}>
        {child?.name && child.name !== 'Your child' ? `${child.name}'s week` : 'This week'}
      </h1>
      {child?.id && <ParentStartTimer childId={child.id} childName={child.name} />}
      <PaceCard pace={pace} childName={child?.name} />
      <BalanceReport report={report} />
    </div>
  )
}
