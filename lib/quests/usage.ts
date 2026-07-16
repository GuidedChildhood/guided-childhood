// How many minutes of screen time a child has logged so far today. Two paths
// feed it, and it must count each once:
//   - device_sessions: a running or finished timer block (phone child, or a
//     parent granted block, bonus included).
//   - star_spends: minutes the parent marked as used directly (the co view,
//     no phone child). A star spent grant also writes a spend, tied to its
//     session by spend_id, so those are skipped here to avoid double counting.
// "Today" follows the same UTC day the rest of the board uses for tick dates.

type UsageClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export async function getMinutesUsedToday(
  supabase: UsageClient,
  userId: string,
  childIds: string[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  if (childIds.length === 0) return out
  for (const id of childIds) out.set(id, 0)

  const dayStart = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z').toISOString()

  const [sessRes, spendRes] = await Promise.all([
    supabase.from('device_sessions')
      .select('child_id, minutes, spend_id, started_at')
      .eq('user_id', userId).gte('started_at', dayStart).in('child_id', childIds),
    supabase.from('star_spends')
      .select('id, child_id, minutes, created_at')
      .eq('user_id', userId).gte('created_at', dayStart).in('child_id', childIds),
  ])

  const linkedSpendIds = new Set<string>()
  for (const s of sessRes.data ?? []) {
    const cid = String(s.child_id)
    out.set(cid, (out.get(cid) ?? 0) + (Number(s.minutes) || 0))
    if (s.spend_id) linkedSpendIds.add(String(s.spend_id))
  }
  for (const sp of spendRes.data ?? []) {
    if (linkedSpendIds.has(String(sp.id))) continue
    const cid = String(sp.child_id)
    out.set(cid, (out.get(cid) ?? 0) + (Number(sp.minutes) || 0))
  }

  return out
}
