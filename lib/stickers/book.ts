import type { SupabaseClient } from '@supabase/supabase-js'
import { getStarBanks } from '@/lib/quests/bank'
import { getDailyStreak } from '@/lib/pathway/streak'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { STICKERS, type Sticker } from './catalog'

// The sticker book, read for one child. Earning is reconciled on read from the
// real numbers so it can never disagree with the rest of the app: the all time
// star total from the bank, confirmed printables, the stage the child is on,
// and the daily streak. Anything newly earned is written to earned_stickers so
// it becomes permanent, then a broken streak or a spent star never takes it
// back. Every read fails soft before migration 101 lands, the way the printable
// loop fails soft before 087.

export type StickerState = Sticker & {
  earned: boolean
  // Progress toward the target, both clamped to the target so a bar never
  // overfills: e.g. 6 of 10 stars.
  have: number
  need: number
}

export type StickerBook = {
  stickers: StickerState[]
  earnedCount: number
  total: number
}

type Ctx = { stars: number; sheets: number; stage: number; streak: number }

function progressFor(rule: Sticker['rule'], ctx: Ctx): number {
  switch (rule.kind) {
    case 'stars': return ctx.stars
    case 'sheets': return ctx.sheets
    case 'stage': return ctx.stage
    case 'streak': return ctx.streak
  }
}

export async function getStickerBook(
  supabase: SupabaseClient,
  userId: string,
  child: { id: string; age_band: string | null },
): Promise<StickerBook> {
  const stage = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 1

  const [banks, sheets, streak, owned] = await Promise.all([
    getStarBanks(supabase, userId, [child.id]),
    countSheets(supabase, userId, child.id),
    dailyStreakCount(supabase, userId),
    ownedKeys(supabase, child.id),
  ])
  const ctx: Ctx = { stars: banks[0]?.earned ?? 0, sheets, stage, streak }

  const toPersist: { user_id: string; child_id: string; sticker_key: string; reason: string }[] = []
  const stickers: StickerState[] = STICKERS.map(s => {
    const have = progressFor(s.rule, ctx)
    const derived = have >= s.rule.n
    if (derived && !owned.has(s.key)) {
      toPersist.push({ user_id: userId, child_id: child.id, sticker_key: s.key, reason: s.rule.kind })
    }
    return { ...s, earned: owned.has(s.key) || derived, have: Math.min(have, s.rule.n), need: s.rule.n }
  })

  // Make the newly earned permanent. Idempotent and best effort: the derived
  // earning above already shows the sticker even if this write cannot run yet.
  if (toPersist.length) {
    try {
      await supabase
        .from('earned_stickers')
        .upsert(toPersist, { onConflict: 'child_id,sticker_key', ignoreDuplicates: true })
    } catch { /* pre migration 101 */ }
  }

  return { stickers, earnedCount: stickers.filter(s => s.earned).length, total: stickers.length }
}

async function countSheets(supabase: SupabaseClient, userId: string, childId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('printable_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('child_id', childId).eq('status', 'confirmed')
    return count ?? 0
  } catch { return 0 }
}

async function dailyStreakCount(supabase: SupabaseClient, userId: string): Promise<number> {
  try { return (await getDailyStreak(supabase, userId)).count } catch { return 0 }
}

async function ownedKeys(supabase: SupabaseClient, childId: string): Promise<Set<string>> {
  try {
    const { data } = await supabase.from('earned_stickers').select('sticker_key').eq('child_id', childId)
    return new Set((data ?? []).map(r => String(r.sticker_key)))
  } catch { return new Set() }
}
