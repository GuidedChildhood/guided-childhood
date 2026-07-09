import type { SupabaseClient } from '@supabase/supabase-js'

// The free plan gives a weekly renewing allowance of scripts, not a
// lifetime cap. The Duolingo shape: a soft ceiling that refreshes, never a
// permanent wall. A free script already opened stays open forever, nothing
// free ever degrades; a free script never opened locks only once this
// week's allowance is used, and the allowance returns every week.
export const FREE_SCRIPTS_PER_WEEK = 3

function weekAgoIso(): string {
  return new Date(Date.now() - 7 * 86400000).toISOString()
}

export async function isScriptLocked(
  supabase: SupabaseClient,
  userId: string,
  isPaid: boolean,
  script: { sort_order: number; is_free: boolean }
): Promise<boolean> {
  if (isPaid) return false
  if (!script.is_free) return true

  const { data: existing } = await supabase
    .from('script_completions')
    .select('id')
    .eq('user_id', userId)
    .eq('script_sort_order', script.sort_order)
    .maybeSingle()
  if (existing) return false

  // Only free scripts opened in the last seven days count against the week.
  const [{ data: completions }, { data: freeScripts }] = await Promise.all([
    supabase.from('script_completions').select('script_sort_order').eq('user_id', userId).gte('completed_at', weekAgoIso()),
    supabase.from('scripts').select('sort_order').eq('is_free', true),
  ])
  const freeOrders = new Set((freeScripts ?? []).map(s => s.sort_order))
  const usedThisWeek = (completions ?? []).filter(c => freeOrders.has(c.script_sort_order)).length

  return usedThisWeek >= FREE_SCRIPTS_PER_WEEK
}
