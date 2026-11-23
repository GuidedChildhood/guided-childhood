// Picks and records one script reminder, or decides to send nothing.
//
// Used by the device timer cron (the words ride on the "screen time is up"
// push the parent already gets, so no extra notification) and by the weekly
// "words for this week" cron. Server only: it reads with the service role.
// The rules themselves are pure and tested in lib/scripts/nudge.ts.

import type { SupabaseClient } from '@supabase/supabase-js'
import { hasFullAccess } from '@/lib/access'
import { momentFor, type MomentKey } from '@/lib/scripts/moments'
import { nudgeAllowed, pickScript, type PastNudge } from '@/lib/scripts/nudge'

export type PreparedNudge = { id: string; sortOrder: number; say: string }

export async function prepareNudge(
  admin: SupabaseClient,
  userId: string,
  opts: { kind: 'timer_end' | 'weekly'; childId?: string | null; moment?: MomentKey | null; preferSortOrder?: number | null },
): Promise<PreparedNudge | null> {
  // The cap first: two a week, never two in a day. Before migration 402 the
  // table is missing, and the answer is to send nothing.
  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const { data: pastRows, error: pastError } = await admin
    .from('script_nudges').select('script_sort_order, sent_at, worked')
    .eq('user_id', userId).gte('sent_at', since)
  if (pastError) return null
  const past = (pastRows ?? []) as PastNudge[]
  if (!nudgeAllowed(past.map(p => p.sent_at))) return null

  const [{ data: profile }, { data: kids }, { data: pinRows }] = await Promise.all([
    admin.from('profiles').select('subscription_status, trial_ends_at').eq('id', userId).maybeSingle(),
    admin.from('children').select('id, stage_id, is_primary').eq('parent_id', userId),
    admin.from('script_pins').select('script_sort_order').eq('user_id', userId),
  ])
  const child = (kids ?? []).find(k => k.id === opts.childId) ?? (kids ?? []).find(k => k.is_primary) ?? (kids ?? [])[0]
  const stage = (child?.stage_id as string | null) ?? null
  if (!stage) return null
  const paid = hasFullAccess(profile as Parameters<typeof hasFullAccess>[0])
  const pins = (pinRows ?? []).map(r => r.script_sort_order as number)

  const { data: rows } = await admin
    .from('scripts').select('sort_order, title, situation, category, say_this, is_free')
    .eq('stage_id', stage)
  let candidates = (rows ?? [])
    .filter(r => r.say_this && (paid || r.is_free))
    .filter(r => !opts.moment || momentFor({ title: r.title as string, situation: r.situation as string, category: r.category as string }) === opts.moment)
    .map(r => ({ sort_order: r.sort_order as number, say: r.say_this as string }))
  if (opts.preferSortOrder != null) {
    const preferred = candidates.filter(c => c.sort_order === opts.preferSortOrder)
    if (preferred.length) candidates = preferred
  }

  const pick = pickScript(candidates, pins, past)
  if (!pick) return null
  const { data: row, error } = await admin
    .from('script_nudges').insert({ user_id: userId, script_sort_order: pick.sort_order, kind: opts.kind })
    .select('id').single()
  if (error || !row) return null
  return { id: row.id as string, sortOrder: pick.sort_order, say: pick.say }
}
