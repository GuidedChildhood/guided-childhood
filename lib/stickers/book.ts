import type { SupabaseClient } from '@supabase/supabase-js'
import { getAllStagesProgress } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { earnedFriends, streakCurrency } from '@/lib/pathway/streak-unlock'
import { childWorries, type ChildWorry } from '@/lib/concerns/sorted'
import { STICKERS, sortedSticker, type Sticker } from './catalog'

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

/** One stage's lessons for this child: how many passed, how many there are, and whether the page is stamped. */
export type StageLessons = { done: number; total: number; complete: boolean }

type Ctx = {
  credits: number
  sheets: number
  /** Completed days, the currency the Planet Friends are bought with. */
  streaks: number
  /** Friends actually earned, which is completed days and nothing else. */
  friends: number
  /** Lessons passed by this child, all stages. */
  lessons: number
  /** Each stage's lessons, by stage number 1 to 5, for the stamp tiles. */
  stages: Record<number, StageLessons>
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
    // A stamp tile used to say "0 of 1", a number nobody could act on. Now it
    // counts the lessons of its stage, so a child sees the page filling.
    case 'stamp': return ctx.stages[rule.n]?.done ?? 0
    case 'lessons': return ctx.lessons
    // Sorted stamps are built below from the worries themselves.
    case 'sorted': return 0
  }
}

/** The target, in the same units as progressFor. */
function targetFor(rule: Sticker['rule'], ctx: Ctx): number {
  if (rule.kind === 'friend') return rule.streaks
  if (rule.kind === 'stamp') return Math.max(1, ctx.stages[rule.n]?.total ?? 0)
  return rule.n
}

/**
 * Whether it is earned outright.
 *
 * Every rule is a simple threshold. A Friend counts Friends rather than days
 * because earnedFriends has already walked the uneven ladder, and it is the same
 * function My wins reads, so the two surfaces cannot disagree about Pebble
 * again.
 */
function isEarned(rule: Sticker['rule'], ctx: Ctx): boolean {
  if (rule.kind === 'friend') return ctx.friends >= rule.n
  // A stamp is the whole stage done, lessons and scripts, the same test the
  // parent's passport page seals a page on. Not the lesson count alone.
  if (rule.kind === 'stamp') return ctx.stages[rule.n]?.complete ?? false
  if (rule.kind === 'sorted') return false
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
  const [credits, sheets, streaks, stages, lessons, worries, owned] = await Promise.all([
    creditsFor(supabase, child.id),
    countSheets(supabase, userId, child.id),
    streaksFor(supabase, child.id),
    stageLessonsFor(supabase, userId, child.id),
    lessonsFor(supabase, userId, child.id),
    childWorries(supabase, userId, child.id),
    ownedKeys(supabase, child.id),
  ])
  // Friends come from completed days only. The stages sit alongside them and
  // feed their own tier rather than being folded in: they used to be read by
  // user_id, the parent's stage progress, and adding that here is what let a
  // grown up finishing lessons hand every child in the house a Planet Friend.
  const ctx: Ctx = { credits, sheets, streaks, lessons, stages, friends: earnedFriends(streaks) }

  const toPersist: { user_id: string; child_id: string; sticker_key: string; reason: string }[] = []
  const stickers: StickerState[] = STICKERS.map(s => {
    const need = targetFor(s.rule, ctx)
    const have = progressFor(s.rule, ctx)
    const derived = isEarned(s.rule, ctx)
    if (derived && !owned.has(s.key)) {
      toPersist.push({ user_id: userId, child_id: child.id, sticker_key: s.key, reason: s.rule.kind })
    }
    // A FRIEND IS DERIVED, NEVER REMEMBERED.
    //
    // Justin, 8 August 2026, looking at Teo's book: "there is no way Teo has
    // achieved these rewards, check maths." He was right. Teo has 3 full days,
    // which buys Pebble at 2 and nothing else, and the book showed four
    // Friends. Iris has 0 full days and showed three.
    //
    // The cause is the ratchet on the line below, and the live rows name it
    // themselves: every wrong one carries reason 'stage'. They were written by
    // the OLD stage route, where a parent finishing lessons handed every child
    // in the house a Friend. That route was deleted from the code and migration
    // 165 was written to clear the rows it left, and because a written row made
    // the sticker earned FOREVER, neither could ever take effect. The book
    // could not correct itself.
    //
    // The ratchet is right for a currency that falls. Credits are spent, so a
    // child who banks fifty and buys something must not lose the sticker they
    // earned at fifty. Completed days never fall. So for a Friend the ratchet
    // protects nothing and preserves everything, including mistakes, and the
    // derivation is always at least as generous as the row.
    //
    // Keeping it keyed on the RULE rather than on reason 'stage' matters: this
    // fixes the class, so the next currency we get wrong corrects itself on the
    // next read instead of needing a migration and a year of nobody noticing.
    const ratchet = s.rule.kind === 'credits' || s.rule.kind === 'sheets'
    return { ...s, earned: (ratchet && owned.has(s.key)) || derived, have: Math.min(have, need), need }
  })

  // THE SORTED STAMPS, one per worry the parent has raised for this child.
  //
  // Justin, 2 September 2026: "trace the moment that the parent said phones in
  // the car were a problem: as the star went to 5 stars, so great, you scored a
  // stamp in your passport."
  //
  // A live worry is a locked stamp showing the stars so far, the same five the
  // parent tapped at the check in. Five stars sorts it and stamps it. It
  // RATCHETS: a worry that comes back later (the parent logs the moment again,
  // the rest lifts on their side) keeps its stamp on the child's, because the
  // child did sort it once and a stamp taken back is a punishment for their
  // grown up's honesty. A worry the parent has since deleted disappears with
  // its stamp, which is the one way the row can go.
  for (const w of worries) {
    const s = sortedSticker(w)
    const earned = w.sorted || owned.has(s.key)
    if (w.sorted && !owned.has(s.key)) {
      toPersist.push({ user_id: userId, child_id: child.id, sticker_key: s.key, reason: 'sorted' })
    }
    stickers.push({ ...s, earned, have: earned ? 5 : Math.min(w.stars, 5), need: 5 })
  }

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
 * Each stage's lessons for this child, and whether its page is stamped.
 *
 * The same reading the parent's passport uses, so a page that shows a seal on
 * the grown up side is the page that hands the child their stamp, and the
 * lessons done of total under a locked stamp is the same count the parent's
 * checklist prints. Fails soft to empty: a stamp is a reward, and a query
 * that cannot answer should hand back the quiet answer rather than invent one.
 */
async function stageLessonsFor(supabase: SupabaseClient, userId: string, childId: string | null = null): Promise<Record<number, StageLessons>> {
  const STAGES = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const
  const out: Record<number, StageLessons> = {}
  try {
    // THIS child's pages, not the household's. Without the child the
    // youngest's rarity tier was paid out of the eldest's lessons.
    const [progress, passed] = await Promise.all([
      getAllStagesProgress(supabase, userId, 0, childId),
      getPassedStageQuizzes(supabase, userId, childId),
    ])
    STAGES.forEach((s, i) => {
      const p = progress[s]
      if (!p) return
      // The one rule, shared with the parent's book and the verify page.
      out[i + 1] = { done: p.lessonsDone, total: p.lessonsTotal, complete: isStageStamped(p, passed, i + 1) }
    })
  } catch { /* quiet */ }
  return out
}

/**
 * Lessons this child has passed, across every stage.
 *
 * Distinct lessons, passed at the player's real seventy percent line, scoped
 * the way the stage progress scopes them: this child's rows plus the
 * household rows with no child on them, so a lesson a parent led with the
 * child beside them counts. A retake does not count twice.
 */
async function lessonsFor(supabase: SupabaseClient, userId: string, childId: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('passed', true)
      .or(`child_id.eq.${childId},child_id.is.null`)
    return new Set((data ?? []).map(r => String(r.lesson_id))).size
  } catch { return 0 }
}

// The worries reach the book through lib/concerns/sorted, the one reading the
// wins queue shares, so the stamp and the celebration can never disagree.
export type { ChildWorry }

async function ownedKeys(supabase: SupabaseClient, childId: string): Promise<Set<string>> {
  try {
    const { data } = await supabase.from('earned_stickers').select('sticker_key').eq('child_id', childId)
    return new Set((data ?? []).map(r => String(r.sticker_key)))
  } catch { return new Set() }
}
