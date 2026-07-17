import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only. The product pulse: a de-identified aggregate read across all
// families, so the insight board is useful from day one, not only once DiGi has
// been chatted to. Counts and sums only, never a single family's detail. This is
// the general data gathering that helps decide what to build and shows how
// healthy the product is week to week.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const admin = createAdminClient()
  const now = Date.now()
  const weekAgoDate = new Date(now - 7 * 86_400_000).toISOString().slice(0, 10)
  const weekAgoIso = new Date(now - 7 * 86_400_000).toISOString()
  const monthAgoIso = new Date(now - 30 * 86_400_000).toISOString()

  try {
    const [childrenRes, questsRes, ticksRes, spendsRes, wellbeingRes] = await Promise.all([
      admin.from('children').select('age_band, parent_id'),
      admin.from('family_quests').select('id', { count: 'exact', head: true }).eq('active', true),
      admin.from('quest_ticks').select('user_id, status, tick_date').gte('tick_date', weekAgoDate),
      admin.from('star_spends').select('user_id, minutes, created_at').gte('created_at', weekAgoIso),
      admin.from('wellbeing_checkins').select('parent_mood, created_at').gte('created_at', monthAgoIso),
    ])

    const kids = childrenRes.data ?? []
    const families = new Set(kids.map(k => k.parent_id as string).filter(Boolean)).size
    const byStage: Record<string, number> = {}
    for (const k of kids) { const b = (k.age_band as string) || 'unknown'; byStage[b] = (byStage[b] ?? 0) + 1 }

    const ticks = ticksRes.data ?? []
    const approved = ticks.filter(t => t.status === 'approved').length
    const approvalRate = ticks.length > 0 ? Math.round((approved / ticks.length) * 100) : null

    const spends = spendsRes.data ?? []
    const screenMinsWeek = spends.reduce((s, x) => s + (Number(x.minutes) || 0), 0)

    // Active families: any family that ticked a quest or used screen time in the
    // last 7 days. The single clearest retention signal.
    const active = new Set<string>()
    for (const t of ticks) if (t.user_id) active.add(t.user_id as string)
    for (const s of spends) if (s.user_id) active.add(s.user_id as string)

    const wb = wellbeingRes.data ?? []
    const moods = wb.map(w => Number(w.parent_mood)).filter(n => n >= 1 && n <= 5)
    const avgParentMood = moods.length ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10 : null

    return NextResponse.json({
      generatedAt: new Date(now).toISOString(),
      families,
      children: kids.length,
      byStage,
      questsSet: questsRes.count ?? 0,
      ticksThisWeek: approved,
      approvalRate,
      screenMinsWeek,
      activeFamilies7d: active.size,
      wellbeingCheckins30d: wb.length,
      avgParentMood,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Pulse failed' }, { status: 502 })
  }
}
