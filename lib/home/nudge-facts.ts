import type { SupabaseClient } from '@supabase/supabase-js'
import type { NudgeFacts } from './habit-nudges'

// The facts the habit nudges are decided on, read from rows we already hold.
//
// Nothing here is a new signal and nothing is written. A nudge that needed its
// own table would be a nudge we had decided to show before we knew whether it
// was true, and the whole point is the other way round.
//
// EVERY READ IS GUARDED. This runs on the parent home, which is the first
// screen of the app, and a nudge is the least important thing on it by a long
// way. A table that is missing, a migration not yet run by hand, a query that
// times out: all of those return "nothing to say" rather than taking the home
// page down with them. Hence the single try around the lot and the null return.

const DAY_MS = 86400000
const daysAgoIso = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString()
const daysSince = (iso: string | null | undefined) =>
  iso ? Math.floor((Date.now() - Date.parse(iso)) / DAY_MS) : 0

/** The facts for one family, or null when we cannot read them honestly. */
export async function readNudgeFacts(
  supabase: SupabaseClient,
  userId: string,
  childIds: string[],
): Promise<NudgeFacts | null> {
  if (childIds.length === 0) return null
  try {
    const weekAgo = daysAgoIso(7)
    const fortnightAgo = daysAgoIso(14)

    const [quests, sessions, weekSessions, ticks, spends, prints] = await Promise.all([
      supabase.from('family_quests').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('active', true),
      // Ever, not recently: the question is whether this family has ever met
      // the timer, and one session in March still counts as having met it.
      supabase.from('device_sessions').select('id').eq('user_id', userId).limit(1),
      supabase.from('device_sessions').select('started_at').eq('user_id', userId)
        .gte('started_at', weekAgo).limit(60),
      supabase.from('quest_ticks').select('tick_date, status').eq('user_id', userId)
        .eq('status', 'pending').order('tick_date', { ascending: true }).limit(40),
      // Screen time spends, which is how a week with screens but no timer shows
      // up at all: a parent marking time used by hand writes one of these and
      // never touches device_sessions.
      supabase.from('star_spends').select('created_at, minutes').eq('user_id', userId)
        .gte('created_at', weekAgo).limit(60),
      supabase.from('printable_completions').select('created_at').eq('user_id', userId)
        .gte('created_at', fortnightAgo).limit(40),
    ])

    // Days, not rows. Three sessions in one evening is one day of screens, and
    // counting rows would make a heavy Saturday look like a heavy week.
    const screenDays = new Set<string>()
    for (const r of (weekSessions.data ?? []) as { started_at: string }[]) {
      screenDays.add(String(r.started_at).slice(0, 10))
    }
    for (const r of (spends.data ?? []) as { created_at: string; minutes: number | null }[]) {
      if ((Number(r.minutes) || 0) > 0) screenDays.add(String(r.created_at).slice(0, 10))
    }

    const offlineDays = new Set<string>()
    for (const r of (prints.data ?? []) as { created_at: string }[]) {
      offlineDays.add(String(r.created_at).slice(0, 10))
    }

    const pending = (ticks.data ?? []) as { tick_date: string }[]
    const oldest = pending[0]?.tick_date ?? null

    // The bank, and how long it has sat. Imported lazily so a change to the
    // bank's own reads can never be the reason the home page fails to render.
    const { getStarBanks } = await import('@/lib/quests/bank')
    const banks = await getStarBanks(supabase, userId, childIds).catch(() => [])
    const bankedStars = banks.reduce((s, b) => s + Math.max(0, b.balance), 0)

    const { data: lastSpend } = await supabase.from('star_spends')
      .select('created_at').eq('user_id', userId).gt('minutes', 0)
      .order('created_at', { ascending: false }).limit(1).maybeSingle()

    return {
      activeQuests: quests.count ?? 0,
      everTimed: (sessions.data ?? []).length > 0,
      screenDaysThisWeek: screenDays.size,
      waitingTicks: pending.length,
      waitingOldestDays: oldest ? daysSince(`${oldest}T12:00:00Z`) : 0,
      bankedStars,
      // No spend ever recorded reads as a long idle, which is right: stars
      // banked by a family who has never spent any are exactly the case this
      // is looking for.
      bankedIdleDays: bankedStars > 0 ? daysSince(lastSpend?.created_at as string | undefined) || 99 : 0,
      offlineDaysThisFortnight: offlineDays.size,
    }
  } catch {
    return null
  }
}
