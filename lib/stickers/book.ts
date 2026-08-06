import type { SupabaseClient } from '@supabase/supabase-js'
import { getAllStagesProgress } from '@/lib/pathway/progress'
import { earnedFriends, streakCurrency } from '@/lib/pathway/streak-unlock'
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

type Ctx = {
  credits: number
  sheets: number
  /** Completed days, the currency the Planet Friends are bought with. */
  streaks: number
  /** Friends actually earned, the further of the streak and stamped stage routes. */
  friends: number
  /** Passport pages stamped. */
  stamps: number
}

/** How far along this sticker is, in whatever it is counted in. */
function progressFor(rule: Sticker['rule'], ctx: Ctx): number {
  switch (rule.kind) {
    case 'credits': return ctx.credits
    case 'sheets': return ctx.sheets
    // Both count completed days, which is what makes the bar on a locked
    // Friend mean something ("6 of 10 full days") rather than counting
    // Friends toward a Friend.
    case 'friend': return ctx.streaks
    case 'streak': return ctx.streaks
    case 'stamp': return ctx.stamps
  }
}

/** The target, in the same units as progressFor. */
function targetFor(rule: Sticker['rule']): number {
  return rule.kind === 'friend' ? rule.streaks : rule.n
}

/**
 * Whether it is earned outright.
 *
 * Everything is a simple threshold except a Friend, which also comes if the
 * family stamped the matching stage without the days: earnedFriends takes the
 * further of the two routes, and it is the same function My wins reads, so the
 * two surfaces cannot disagree about Pebble again.
 */
function isEarned(rule: Sticker['rule'], ctx: Ctx): boolean {
  if (rule.kind === 'friend') return ctx.friends >= rule.n
  return progressFor(rule, ctx) >= rule.n
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
  // The star bank is no longer read here at all. It was the cumulative lifetime
  // total, which is the number the weekly reset exists to stop handing out, and
  // reading it here is what tied sticker progress to a figure that now resets.
  //
  // Nor is the age band. That was the age rule, and killing it is the whole
  // point of this pass: see the note on the friend rule in catalog.ts.
  const [credits, sheets, streaks, stamps, owned] = await Promise.all([
    creditsFor(supabase, child.id),
    countSheets(supabase, userId, child.id),
    streaksFor(supabase, child.id),
    stampsFor(supabase, userId),
    ownedKeys(supabase, child.id),
  ])
  const ctx: Ctx = { credits, sheets, streaks, stamps, friends: earnedFriends(stamps, streaks) }

  const toPersist: { user_id: string; child_id: string; sticker_key: string; reason: string }[] = []
  const stickers: StickerState[] = STICKERS.map(s => {
    const need = targetFor(s.rule)
    const have = progressFor(s.rule, ctx)
    const derived = isEarned(s.rule, ctx)
    if (derived && !owned.has(s.key)) {
      toPersist.push({ user_id: userId, child_id: child.id, sticker_key: s.key, reason: s.rule.kind })
    }
    return { ...s, earned: owned.has(s.key) || derived, have: Math.min(have, need), need }
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

/**
 * Completed days for THIS CHILD.
 *
 * It used to be getDailyStreak(supabase, userId), which reads daily_sessions,
 * moment_completions and quest_ticks by user_id only. That is the PARENT's
 * daily habit. Everything else in this book is keyed on child_id, so in a house
 * with two children both books awarded Week Streak for the same grown up
 * activity and neither child had done it. It was also a third separate meaning
 * of the word streak inside one product.
 *
 * Now it is the same number the Friends are bought with and the same one My
 * wins prints as "Streaks earned": completed days from kid_days, or the older
 * job_streaks run, whichever is further along. Both fail soft to zero.
 */
async function streaksFor(supabase: SupabaseClient, childId: string): Promise<number> {
  let jobStreaks = 0
  try {
    const { count } = await supabase
      .from('job_streaks').select('id', { count: 'exact', head: true }).eq('child_id', childId)
    jobStreaks = count ?? 0
  } catch { jobStreaks = 0 }

  let completedDays = 0
  try {
    const { count } = await supabase
      .from('kid_days').select('id', { count: 'exact', head: true })
      .eq('child_id', childId).not('completed_at', 'is', null)
    completedDays = count ?? 0
  } catch { completedDays = 0 }

  return streakCurrency(jobStreaks, completedDays)
}

/**
 * Passport pages stamped, which is the rare tier.
 *
 * The same reading the parent's passport uses, so a page that shows a seal on
 * the grown up side is the page that hands the child their stamp. Fails soft to
 * zero: a stamp is a reward, and a query that cannot answer should hand back
 * the quiet number rather than invent one.
 */
async function stampsFor(supabase: SupabaseClient, userId: string): Promise<number> {
  const STAGES = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const
  try {
    const progress = await getAllStagesProgress(supabase, userId, 0)
    return STAGES.filter(s => progress[s]?.contentComplete).length
  } catch { return 0 }
}

async function ownedKeys(supabase: SupabaseClient, childId: string): Promise<Set<string>> {
  try {
    const { data } = await supabase.from('earned_stickers').select('sticker_key').eq('child_id', childId)
    return new Set((data ?? []).map(r => String(r.sticker_key)))
  } catch { return new Set() }
}
