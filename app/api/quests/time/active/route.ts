import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { readTrust } from '@/lib/quests/device-time'
import { londonToday } from '@/lib/pathway/today'
import { questDueToday } from '@/lib/quests/due'
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
    getStarBanks(supabase, user.id, ids, Object.fromEntries(kids.map(c => [c.id as string, (c.age_band as string | null) ?? null]))),
    // family_device_id arrives with migration 106. Asked for optimistically and
    // retried without it on an older database, so the timer keeps working
    // whether or not the migration has been run yet.
    supabase.from('device_sessions')
      .select('id, child_id, device, family_device_id, minutes, stars, ends_at, started_at')
      .eq('user_id', user.id).eq('status', 'active').gt('ends_at', nowIso)
      .then(res => res.error
        ? supabase.from('device_sessions')
            .select('id, child_id, device, minutes, stars, ends_at, started_at')
            .eq('user_id', user.id).eq('status', 'active').gt('ends_at', nowIso)
        : res),
    // Only asks from the last twelve hours, the same freshness window the
    // child's banner uses. A stale overnight ask is no longer offered for
    // approval, so a parent can never approve one the child can no longer see.
    supabase.from('device_requests')
      .select('id, child_id, device, family_device_id, minutes, created_at')
      .eq('user_id', user.id).eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 12 * 3600000).toISOString())
      .order('created_at', { ascending: false })
      .then(res => res.error
        ? supabase.from('device_requests')
            .select('id, child_id, device, minutes, created_at')
            .eq('user_id', user.id).eq('status', 'pending')
            .gte('created_at', new Date(Date.now() - 12 * 3600000).toISOString())
            .order('created_at', { ascending: false })
        : res),
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

  // The family's own device names, so a running block and a waiting ask both
  // say which screen rather than which category. Fails soft before migration
  // 106, where every name simply resolves to null and the kind is used.
  const deviceNameById = new Map<string, string>()
  {
    const { data: fam, error } = await supabase
      .from('family_devices').select('id, label').eq('user_id', user.id)
    if (!error) for (const d of fam ?? []) deviceNameById.set(String(d.id), String(d.label))
  }
  // The row shape depends on whether the optimistic select above kept its
  // family_device_id, so this reads it off loosely rather than claiming a type
  // the fallback query does not have.
  const nameOf = (row: object | null | undefined): string | null => {
    const id = (row as { family_device_id?: string | null } | null | undefined)?.family_device_id
    return id ? deviceNameById.get(String(id)) ?? null : null
  }

  const bankBy = new Map(banks.map(b => [b.child_id, b.balance]))
  // What one star buys THIS child (migration 225), for the parent card's copy.
  const rateBy = new Map(banks.map(b => [b.child_id, b.starMinutes]))
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

  // JOBS STILL TO DO TODAY, per child.
  //
  // Justin, 8 August 2026: "when they ask to watch tv or use device give them
  // the nudge to do tasks to unlock timer."
  //
  // ScreenGateBanner already does this, but only for jobs a parent has
  // explicitly flagged as "before screens", and almost nobody has set that
  // flag. So a family with ten jobs and none done sees no prompt at all when
  // the timer is started, and the rule the child is held to on their own phone
  // quietly does not exist on the grown up's.
  //
  // This is the plain count instead: due today, not yet approved. Not a gate.
  // The parent still starts whatever they like, which is non negotiable one,
  // DiGi and this product never allow or deny. It just stops the timer being
  // the one screen in the app that does not know the jobs exist.
  //
  // Read on its own and failing soft to nothing, so a timer a parent needs in
  // the moment can never be held up by a count that is only there to inform.
  const jobsLeftBy = new Map<string, { count: number; first: string | null }>()
  try {
    const { data: dueJobs } = await supabase
      .from('family_quests')
      .select('id, title, child_id, active, schedule, schedule_days')
      .eq('user_id', user.id).eq('active', true).in('child_id', ids)
    const { data: ticksToday } = await supabase
      .from('quest_ticks')
      .select('quest_id, child_id, status')
      .eq('user_id', user.id).eq('tick_date', londonToday()).in('child_id', ids)
    const settled = new Set((ticksToday ?? [])
      .filter(t => t.status === 'approved' || t.status === 'pending')
      .map(t => `${t.child_id}|${t.quest_id}`))
    for (const j of dueJobs ?? []) {
      const cid = String(j.child_id ?? '')
      if (!cid || settled.has(`${cid}|${j.id}`)) continue
      // Due TODAY by its own schedule, not merely active. The quests board
      // counts it this way ("0 of 10 done today"), and a timer saying 14 next
      // to a board saying 10 is two numbers for one thing, which is worse than
      // no number at all.
      if (!questDueToday(String(j.schedule ?? 'daily'), (j.schedule_days as number[] | null) ?? null)) continue
      const cur = jobsLeftBy.get(cid) ?? { count: 0, first: null }
      jobsLeftBy.set(cid, { count: cur.count + 1, first: cur.first ?? String(j.title ?? '') })
    }
  } catch { /* informational only, never blocks the timer */ }

  // THE PLANET ASK. Planet Friends (slice 1): a child whose Friends are
  // asleep in their pods can ask to wake them early, and the ask has to
  // reach the parent the same way a screen time ask does, in the pop up, or
  // "never allow or deny" is not true inside the toy. Read off the planet
  // row, pending and fresh, and fails soft to nothing on a database still
  // short of migration 252.
  const planetAskBy = new Map<string, { id: string; minutesLeft: number; createdAt: string; kind: 'wake' | 'mission'; title: string | null; missionKey: string | null }>()
  try {
    const { data: homes, error } = await supabase
      .from('planet_homes').select('child_id, ask').eq('user_id', user.id).in('child_id', ids)
    if (!error) {
      for (const g of homes ?? []) {
        const ask = (g as { ask?: { id?: string; status?: string; minutesLeft?: number; createdAt?: string; kind?: string; title?: string; missionKey?: string } | null }).ask
        if (!ask || ask.status !== 'pending' || !ask.id || !ask.createdAt) continue
        // A wake ask is about a nap that ends within the hour; a mission ask
        // waits for the grown up, who may be at work. Twelve hours for those.
        const fresh = ask.kind === 'mission' ? 12 * 3600000 : 2 * 3600000
        if (Date.now() - new Date(ask.createdAt).getTime() > fresh) continue
        planetAskBy.set(String(g.child_id), {
          id: ask.id, minutesLeft: Number(ask.minutesLeft) || 0, createdAt: ask.createdAt,
          kind: ask.kind === 'mission' ? 'mission' : 'wake', title: typeof ask.title === 'string' ? ask.title : null,
          missionKey: typeof ask.missionKey === 'string' ? ask.missionKey : null,
        })
      }
    }
  } catch { /* no planet yet, nothing to ask */ }

  return NextResponse.json({
    children: kids.map(c => {
      const ageBand = (c as { age_band?: string | null }).age_band ?? null
      return {
        id: c.id,
        name: c.name,
        trust: readTrust((c as { device_trust?: string }).device_trust),
        balance: bankBy.get(c.id as string) ?? 0,
        starMinutes: rateBy.get(c.id as string) ?? 5,
        session: (() => {
          const sess = sessionBy.get(c.id as string)
          return sess ? { ...sess, deviceName: nameOf(sess) } : null
        })(),
        request: (() => {
          const rq = requestBy.get(c.id as string)
          return rq ? { ...rq, deviceName: nameOf(rq) } : null
        })(),
        ageBand,
        usedToday: usedToday.get(c.id as string) ?? 0,
        recommended: recommendedDailyMinutes(ageBand),
        week: Array.from((weekBy.get(c.id as string) ?? new Map<string, { minutes: number; sessions: number }>()).entries())
          .map(([device, agg]) => ({ device, minutes: agg.minutes, sessions: agg.sessions }))
          .sort((a, b) => b.minutes - a.minutes),
        sessionsToday: todayCountBy.get(c.id as string) ?? 0,
        giftOwed: giftOwedBy.get(c.id as string) ?? 0,
        agreedAt: agreedBy.get(c.id as string) ?? null,
        jobsLeft: jobsLeftBy.get(c.id as string) ?? { count: 0, first: null },
        planet: planetAskBy.get(c.id as string) ?? null,
      }
    }),
  })
}
