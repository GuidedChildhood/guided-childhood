import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readTrust } from '@/lib/quests/device-time'
import { getStarBanks } from '@/lib/quests/bank'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'

// What the parent's screen time card needs in one call: each child, their star
// balance, and their live device session if one is running. Scoped to the
// parent's own children by their session and RLS.

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: children } = await supabase
    .from('children').select('id, name, age_band, device_trust').eq('parent_id', user.id).order('is_primary', { ascending: false })
  const kids = children ?? []
  if (kids.length === 0) return NextResponse.json({ children: [] })

  const ids = kids.map(c => c.id as string)
  const nowIso = new Date().toISOString()
  const weekStartIso = new Date(Date.now() - 7 * 86400000).toISOString()
  // "Today" follows the same UTC day the rest of the board uses.
  const dayStartIso = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z').toISOString()
  const [banks, { data: sessions }, { data: requests }, usedToday, { data: weekSessions }] = await Promise.all([
    getStarBanks(supabase, user.id, ids),
    supabase.from('device_sessions')
      .select('id, child_id, device, minutes, stars, ends_at, started_at')
      .eq('user_id', user.id).eq('status', 'active').gt('ends_at', nowIso),
    supabase.from('device_requests')
      .select('id, child_id, device, minutes, created_at')
      .eq('user_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
    getMinutesUsedToday(supabase, user.id, ids),
    // The last seven days of timer blocks, for the where the time goes read:
    // which devices carry the time, how many sittings, and how many today.
    supabase.from('device_sessions')
      .select('child_id, device, minutes, started_at')
      .eq('user_id', user.id).gte('started_at', weekStartIso).in('child_id', ids),
  ])
  // Gifted time still owed in jobs, and the timer rule acceptance, per
  // child. Both land with migration 080, so each read fails soft on an
  // older database and the card simply shows neither line yet.
  const giftOwedBy = new Map<string, number>()
  {
    const { data: debts, error } = await supabase
      .from('gift_debts').select('child_id, stars_owed')
      .eq('user_id', user.id).eq('settled', false)
    if (!error) {
      for (const d of debts ?? []) {
        const cid = String(d.child_id)
        giftOwedBy.set(cid, (giftOwedBy.get(cid) ?? 0) + (Number(d.stars_owed) || 0))
      }
    }
  }
  const agreedBy = new Map<string, string>()
  {
    const { data: links, error } = await supabase
      .from('kid_links').select('child_id, agreed_at')
      .eq('user_id', user.id).not('agreed_at', 'is', null)
    if (!error) {
      for (const l of links ?? []) agreedBy.set(String(l.child_id), String(l.agreed_at))
    }
  }

  const bankBy = new Map(banks.map(b => [b.child_id, b.balance]))
  const sessionBy = new Map((sessions ?? []).map(s => [s.child_id as string, s]))
  const requestBy = new Map((requests ?? []).map(r => [r.child_id as string, r]))

  // Per child, per device: minutes and sittings this week, heaviest first,
  // plus how many sittings today. Running blocks count at their planned
  // length, same as the today number does.
  const weekBy = new Map<string, Map<string, { minutes: number; sessions: number }>>()
  const todayCountBy = new Map<string, number>()
  for (const s of weekSessions ?? []) {
    const cid = String(s.child_id)
    const dev = String(s.device)
    let devices = weekBy.get(cid)
    if (!devices) { devices = new Map(); weekBy.set(cid, devices) }
    const agg = devices.get(dev) ?? { minutes: 0, sessions: 0 }
    agg.minutes += Number(s.minutes) || 0
    agg.sessions += 1
    devices.set(dev, agg)
    if (String(s.started_at) >= dayStartIso) {
      todayCountBy.set(cid, (todayCountBy.get(cid) ?? 0) + 1)
    }
  }

  return NextResponse.json({
    children: kids.map(c => {
      const ageBand = (c as { age_band?: string | null }).age_band ?? null
      return {
        id: c.id,
        name: c.name,
        trust: readTrust((c as { device_trust?: string }).device_trust),
        balance: bankBy.get(c.id as string) ?? 0,
        session: sessionBy.get(c.id as string) ?? null,
        request: requestBy.get(c.id as string) ?? null,
        ageBand,
        usedToday: usedToday.get(c.id as string) ?? 0,
        recommended: recommendedDailyMinutes(ageBand),
        week: Array.from((weekBy.get(c.id as string) ?? new Map<string, { minutes: number; sessions: number }>()).entries())
          .map(([device, agg]) => ({ device, minutes: agg.minutes, sessions: agg.sessions }))
          .sort((a, b) => b.minutes - a.minutes),
        sessionsToday: todayCountBy.get(c.id as string) ?? 0,
        giftOwed: giftOwedBy.get(c.id as string) ?? 0,
        agreedAt: agreedBy.get(c.id as string) ?? null,
      }
    }),
  })
}
