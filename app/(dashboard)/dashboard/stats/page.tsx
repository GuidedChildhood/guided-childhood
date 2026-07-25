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

export const metadata = { title: 'Balance and stats — Guided Childhood' }

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

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

  const sinceIso = new Date(Date.now() - WEEK_MS).toISOString()
  const sinceDay = sinceIso.slice(0, 10)

  let deviceMinutes: { device: string; minutes: number }[] = []
  let offscreen = { activities: 0, stars: 0, minutes: 0 }

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
        supabase.from('family_quests').select('id, stars').eq('child_id', child.id),
        supabase.from('quest_ticks').select('quest_id').eq('child_id', child.id).eq('status', 'approved').gte('tick_date', sinceDay),
      ])
      const starById = new Map((quests ?? []).map(q => [q.id as string, Number(q.stars) || 1]))
      const approved = ticks ?? []
      offscreen = {
        activities: approved.length,
        stars: approved.reduce((sum, t) => sum + (starById.get(t.quest_id as string) ?? 1), 0),
        // We do not track off screen minutes directly, so estimate gently from
        // the count of real world wins rather than claim a false zero.
        minutes: approved.length * 15,
      }
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
      offscreen = {
        activities: offscreen.activities + done.length,
        stars: offscreen.stars + done.reduce((sum, s) => sum + (Number(s.stars) || 0), 0),
        minutes: offscreen.minutes + done.length * 20,
      }
    } catch { /* pre 087, jobs only */ }
  }

  const report = buildParentReport({
    childName: child?.name ?? null,
    ageBand: (child?.age_band as string | null) ?? null,
    dailyLimitMins: (child?.daily_limit_minutes as number | null) ?? null,
    deviceMinutes,
    offscreen,
  })

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ‹ Quests
      </Link>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '10px 0 8px' }}>Balance and stats</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20 }}>
        {child?.name && child.name !== 'Your child' ? `${child.name}'s week` : 'This week'}
      </h1>
      {child?.id && <ParentStartTimer childId={child.id} childName={child.name} />}
      <BalanceReport report={report} />
    </div>
  )
}
