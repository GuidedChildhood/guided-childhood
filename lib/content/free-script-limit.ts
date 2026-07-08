import type { SupabaseClient } from '@supabase/supabase-js'

// The free plan promise is 5 free scripts, honoured with a real,
// personal, moving count rather than a static count of every script
// flagged is_free (which spans dozens of panic moments and never
// reflected what one parent had actually read). A free script already
// opened stays open forever, nothing free ever degrades; a free script
// never opened locks once 5 distinct ones have been read.
export const FREE_SCRIPT_LIMIT = 5

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

  const [{ data: completions }, { data: freeScripts }] = await Promise.all([
    supabase.from('script_completions').select('script_sort_order').eq('user_id', userId),
    supabase.from('scripts').select('sort_order').eq('is_free', true),
  ])
  const freeOrders = new Set((freeScripts ?? []).map(s => s.sort_order))
  const usedCount = (completions ?? []).filter(c => freeOrders.has(c.script_sort_order)).length

  return usedCount >= FREE_SCRIPT_LIMIT
}
