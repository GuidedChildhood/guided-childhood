import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { habitMetrics, type SessionRow } from '@/lib/home/habit-metrics'
import { londonToday } from '@/lib/pathway/today'
import { valueSignals, secondCheckInUsers, type ValueSignals } from '@/lib/home/value-signals'

// Founder only. The product pulse: a de-identified aggregate read across all
// families, so the insight board is useful from day one, not only once DiGi has
// been chatted to. Counts and sums only, never a single family's detail. This is
// the general data gathering that helps decide what to build and shows how
// healthy the product is week to week.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

// Supabase returns at most 1000 rows a query. A count that silently stops at
// 1000 would read as a real number, so these read every page or fail.
async function allRows<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const out: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await page(from, from + 999)
    if (error) throw error
    out.push(...(data ?? []))
    if ((data ?? []).length < 1000) return out
  }
}

// The five value signals (lib/home/value-signals.ts), or null when any source
// cannot be read. Null means unknown, never zero: the review board prints
// "unknown" for it rather than a count it could not make.
async function readValueSignals(admin: ReturnType<typeof createAdminClient>, parentIds: string[]): Promise<ValueSignals | null> {
  try {
    const [memory, links, events, scriptEvents, outcomes] = await Promise.all([
      allRows<{ user_id: string }>((a, b) => admin.from('digi_memory').select('user_id').eq('active', true).range(a, b)),
      allRows<{ user_id: string }>((a, b) => admin.from('kid_links').select('user_id').not('last_seen_at', 'is', null).range(a, b)),
      allRows<{ concern_id: string; user_id: string; score: number | null }>((a, b) =>
        admin.from('concern_events').select('concern_id, user_id, score').not('score', 'is', null).range(a, b)),
      allRows<{ user_id: string }>((a, b) =>
        admin.from('concern_events').select('user_id').eq('linked_type', 'script').not('answer', 'is', null).range(a, b)),
      allRows<{ user_id: string }>((a, b) => admin.from('digi_outcomes').select('user_id').not('verdict', 'is', null).range(a, b)),
    ])
    return valueSignals({
      families: parentIds,
      memory: memory.map(r => r.user_id),
      childLink: links.map(r => r.user_id),
      secondCheckIn: secondCheckInUsers(events),
      scriptVerdict: scriptEvents.map(r => r.user_id),
      followUpAnswered: outcomes.map(r => r.user_id),
    })
  } catch {
    return null
  }
}

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
  const sixtyDaysAgoDate = new Date(now - 60 * 86_400_000).toISOString().slice(0, 10)

  try {
    const [childrenRes, questsRes, ticksRes, spendsRes, wellbeingRes, kidLinksRes, sessionsRes, dayRes] = await Promise.all([
      admin.from('children').select('age_band, parent_id'),
      admin.from('family_quests').select('id', { count: 'exact', head: true }).eq('active', true),
      admin.from('quest_ticks').select('user_id, status, tick_date').gte('tick_date', weekAgoDate),
      admin.from('star_spends').select('user_id, minutes, created_at').gte('created_at', weekAgoIso),
      admin.from('wellbeing_checkins').select('parent_mood, created_at').gte('created_at', monthAgoIso),
      // Child app adoption: who set up the child link at all, and whose child is
      // actually using it (ticking a job or running a screen time timer).
      admin.from('kid_links').select('user_id'),
      admin.from('device_sessions').select('user_id, started_at').gte('started_at', weekAgoIso),
      // The habit itself: completed days, sixty days back, for day done rate,
      // streak lengths and who came back (lib/home/habit-metrics.ts).
      admin.from('daily_sessions').select('user_id, session_date').gte('session_date', sixtyDaysAgoDate).not('completed_at', 'is', null),
    ])

    const kids = childrenRes.data ?? []
    const families = new Set(kids.map(k => k.parent_id as string).filter(Boolean)).size
    const parentIds = [...new Set(kids.map(k => k.parent_id as string).filter(Boolean))]
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

    // The child app funnel: how many families set up the child link, and how
    // many have a child actually using it (a tick or a screen time session in
    // the last week). The honest read on whether the child side lands.
    const sessions = sessionsRes.data ?? []
    const childAppSetUp = new Set((kidLinksRes.data ?? []).map(k => k.user_id as string).filter(Boolean)).size
    const childActive = new Set<string>()
    for (const t of ticks) if (t.user_id) childActive.add(t.user_id as string)
    for (const s of sessions) if (s.user_id) childActive.add(s.user_id as string)

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
      childAppSetUp,
      childActive7d: childActive.size,
      wellbeingCheckins30d: wb.length,
      avgParentMood,
      habit: habitMetrics((dayRes.data ?? []) as SessionRow[], londonToday()),
      // Null when a source could not be read. The weekly board prints that as unknown.
      valueSignals: await readValueSignals(admin, parentIds),
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Pulse failed' }, { status: 502 })
  }
}
