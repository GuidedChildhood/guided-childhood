import type { SupabaseClient } from '@supabase/supabase-js'
import { getDailyStreak } from '@/lib/pathway/streak'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { STICKERS, type Sticker } from './catalog'

// The sticker book, read for one child. Earning is reconciled on read from the
// real numbers so it can never disagree with the rest of the app: sticker
// credits banked, confirmed printables, the stage the child is on, and the daily
// streak. Anything newly earned is written to earned_stickers so it becomes
// permanent, then a broken streak or a spent credit never takes it back. Every
// read fails soft before migration 101 lands, the way the printable loop fails
// soft before 087.
//
// Credits, not the all time star total, since migration 124. The old rule paid
// the book for EARNING, which is the same thing the star chart already rewards,
// and it was also why a weekly star reset could not ship on its own: sticker
// progress hung off the very number the reset clears, so every Monday would have
// taken stickers away. Credits come from minutes earned and deliberately not
// spent, so the chart pays doing the jobs and the book pays restraint.

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

type Ctx = { credits: number; sheets: number; stage: number; streak: number }

function progressFor(rule: Sticker['rule'], ctx: Ctx): number {
  switch (rule.kind) {
    case 'credits': return ctx.credits
    case 'sheets': return ctx.sheets
    case 'stage': return ctx.stage
    case 'streak': return ctx.streak
  }
}

/**
 * Sticker credits banked for this child, all time.
 *
 * Fails soft to zero before migration 124 lands, the same way the printable loop
 * fails soft before 087. Zero is the right answer either way: a child with no
 * credits row has saved nothing yet, and a missing table cannot take away a
 * sticker already written to earned_stickers.
 */
async function creditsFor(supabase: SupabaseClient, childId: string): Promise<number> {
  const { data, error } = await supabase
    .from('sticker_credits')
    .select('credits')
    .eq('child_id', childId)
  if (error || !data) return 0
  return data.reduce((sum, r) => sum + (Number(r.credits) || 0), 0)
}

export async function getStickerBook(
  supabase: SupabaseClient,
  userId: string,
  child: { id: string; age_band: string | null },
): Promise<StickerBook> {
  const stage = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 1

  // The star bank is no longer read here at all. It was the cumulative lifetime
  // total, which is the number the weekly reset exists to stop handing out, and
  // reading it here is what tied sticker progress to a figure that now resets.
  const [credits, sheets, streak, owned] = await Promise.all([
    creditsFor(supabase, child.id),
    countSheets(supabase, userId, child.id),
    dailyStreakCount(supabase, userId),
    ownedKeys(supabase, child.id),
  ])
  const ctx: Ctx = { credits, sheets, stage, streak }

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
