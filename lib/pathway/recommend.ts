import type { createClient } from '@/lib/supabase/server'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import { CONCERN_TO_CATEGORY, DEVICE_KIND_TO_CATEGORIES } from '@/lib/content/signal-map'
import type { ChallengeId } from '@/lib/content/stages'
import type { StageId } from './progress'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface RecommendedScript {
  sort_order: number
  title: string
  situation: string
  is_free: boolean
  matchesChallenge: boolean
  /** Why this one, in words a parent can check against their own life. Null when nothing but stage order chose it. */
  reason: string | null
  reasonKey: 'concern' | 'device' | 'challenge' | 'returning' | null
}

// The single best next script for this family.
//
// Justin: "can we make sure the scripts that come up are either relating to
// previous conversations, or at least related to the devices or platforms they
// would use."
//
// WHAT IT USED TO DO. One signal: the challenge picked once at signup. So a
// family who told us "mornings" in March and has spent since then telling DiGi
// about a console every week was still being handed morning scripts, and the
// library looked like a shelf rather than something paying attention.
//
// THREE SIGNALS NOW, and the order between them is the whole argument:
//
//   1. LIVE CONCERNS, hardest. A concern row is written when this family
//      actually raised something, in DiGi, in a moment, or in right now. It is
//      the closest thing we have to "previous conversations" and it is the only
//      signal that carries a count: something flagged four times is four times
//      the thing something flagged once is.
//   2. THE DEVICES IN THE HOUSE. A console in the hall is real evidence that
//      gaming scripts will land. Weaker than a concern, because owning a thing
//      is not the same as struggling with it.
//   3. THE SIGNUP ANSWER, weakest, and kept rather than dropped because on day
//      one it is the only thing we know.
//
// NO PENALTIES, ONLY EVIDENCE. It is tempting to demote gaming scripts for a
// family with no console listed. That would be wrong: children game on phones,
// at friends' houses, on school laptops, and a device list is something a
// parent filled in once and may never have finished. Absence of a device is
// not evidence of absence of the problem, and hiding the script a family needs
// is a far worse failure than showing one they do not.
//
// With preferFree set, free scripts win over paid ones, so an unpaid parent
// following "open my recommended script" is never routed into the reader's
// paywall redirect.
export async function getRecommendedScript(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null | undefined,
  opts?: { preferFree?: boolean }
): Promise<RecommendedScript | null> {
  const today = londonToday()

  const [{ data: scripts }, { data: completions }, { data: concerns }, { data: devices }] = await Promise.all([
    supabase
      .from('scripts')
      .select('sort_order, title, situation, category, is_free')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true }),
    supabase
      .from('script_completions')
      .select('script_sort_order, status, not_needed_until')
      .eq('user_id', userId),
    // Open and improving both count. A concern getting better is still a
    // concern, and the script that helps is often the one that keeps it going.
    supabase
      .from('concerns')
      .select('slug, label, times_flagged, last_flagged_at')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      .order('times_flagged', { ascending: false })
      .order('last_flagged_at', { ascending: false })
      .limit(12),
    supabase
      .from('family_devices')
      .select('label, kind')
      .eq('user_id', userId)
      .is('retired_at', null)
      .limit(20),
  ])

  if (!scripts || scripts.length === 0) return null

  // WHAT COUNTS AS FINISHED, which is the other half of Justin's ask: "there
  // also needs to know that the scripts had been done, and rerun them to
  // finish the pathway."
  //
  // Before migration 157 every row here meant done, including rows written by
  // merely opening a script, so a parent who glanced at ten never saw any of
  // them again. Now:
  //
  //   used        finished. Gone from the recommender for good.
  //   not_needed  set aside until not_needed_until, then it comes back, which
  //               is the whole point of a return date. A null date is treated
  //               as set aside indefinitely, because a parent said not needed
  //               and we have no day on which to disagree.
  //   opened      looked at and put down. Still offered, because it counted
  //               for nothing on the passport and pretending otherwise is what
  //               left families with a pathway they could not finish. Demoted
  //               below anything unseen, so it comes back round rather than
  //               sitting at the top of the page being ignored again.
  const resolved = new Set<number>()
  const opened = new Set<number>()
  const returned = new Set<number>()
  for (const c of (completions ?? []) as CompletionRow[]) {
    if (c.status === 'used') { resolved.add(c.script_sort_order); continue }
    if (c.status === 'not_needed') {
      if (!c.not_needed_until || c.not_needed_until > today) resolved.add(c.script_sort_order)
      else returned.add(c.script_sort_order)
      continue
    }
    opened.add(c.script_sort_order)
  }

  const pool = scripts.filter(s => !resolved.has(s.sort_order))
  if (pool.length === 0) return null

  // Category to best reason, built once. Where two concerns point at the same
  // category the stronger one wins, so the reason a parent reads is the one
  // they would have given themselves.
  const byCategory = new Map<string, { score: number; reason: string; key: RecommendedScript['reasonKey'] }>()
  const offer = (category: string | null, score: number, reason: string, key: RecommendedScript['reasonKey']) => {
    if (!category || score <= 0) return
    const held = byCategory.get(category)
    if (!held || score > held.score) byCategory.set(category, { score, reason, key })
  }

  // 1. Concerns. Weighted by how often it has come up, capped at five so one
  // runaway topic cannot bury everything else this family is dealing with.
  for (const c of (concerns ?? []) as ConcernRow[]) {
    const raised = Math.max(1, c.times_flagged ?? 1)
    // Capped for SCORING only, so one runaway topic cannot bury everything
    // else this family is dealing with. The copy below uses the real count,
    // because telling a parent five when they have said it nine times is a
    // small lie about the one thing they most want us to have heard.
    const weight = Math.min(5, raised)
    offer(
      CONCERN_TO_CATEGORY[c.slug] ?? null,
      100 + weight * 10,
      concernReason(c.label, raised),
      'concern',
    )
  }

  // 2. Devices. One score whichever device raised it, because two tablets are
  // not twice the reason.
  for (const d of (devices ?? []) as DeviceRow[]) {
    for (const category of DEVICE_KIND_TO_CATEGORIES[d.kind] ?? []) {
      offer(category, 50, `Because there is ${article(d.label)} in the house`, 'device')
    }
  }

  // 3. The signup answer.
  const challengeCategory = challenge ? CHALLENGE_TO_CATEGORY[challenge] ?? null : null
  offer(challengeCategory, 25, 'Matches what you told us at the start', 'challenge')

  const freeOnly = opts?.preferFree ? pool.filter(s => s.is_free) : []
  // Restricted to free scripts when the parent cannot open a paid one, and
  // only falling back to the whole pool when the stage holds no free script at
  // all, which is a content gap rather than something to solve here.
  const searchable = opts?.preferFree && freeOnly.length > 0 ? freeOnly : pool

  const scoreOf = (s: ScriptRow) => {
    const signal = s.category ? byCategory.get(s.category) : undefined
    let score = signal?.score ?? 0
    // A script already glanced at loses to anything unseen carrying the same
    // signal, and still beats a script with no signal at all.
    if (opened.has(s.sort_order)) score -= 30
    // One nudge for a script that was set aside and whose day has come, so a
    // return actually happens rather than waiting for the category to win on
    // its own.
    if (returned.has(s.sort_order)) score += 15
    return score
  }

  let chosen = searchable[0]
  let best = scoreOf(chosen)
  for (const s of searchable.slice(1)) {
    const score = scoreOf(s)
    // Strictly greater, so an equal score keeps the earlier sort order and the
    // stage still reads in the sequence it was written in.
    if (score > best) { chosen = s; best = score }
  }

  const signal = chosen.category ? byCategory.get(chosen.category) : undefined
  const carried = best > 0 && !!signal
  const returning = returned.has(chosen.sort_order)

  return {
    sort_order: chosen.sort_order,
    title: chosen.title,
    situation: chosen.situation,
    is_free: chosen.is_free,
    matchesChallenge: !!challengeCategory && chosen.category === challengeCategory,
    reason: returning
      ? 'You set this aside a while back. Worth another look now'
      : carried ? signal!.reason : null,
    reasonKey: returning ? 'returning' : carried ? signal!.key : null,
  }
}

type ScriptRow = { sort_order: number; title: string; situation: string; category: string | null; is_free: boolean }
type CompletionRow = { script_sort_order: number; status?: string | null; not_needed_until?: string | null }
type ConcernRow = { slug: string; label: string | null; times_flagged: number | null }
type DeviceRow = { label: string; kind: string }

/**
 * The reason line for a concern, in the family's own words where they are
 * usable.
 *
 * The label is written by DiGi during a conversation, so it is free text and
 * gets treated as such: trimmed, capped, stripped of the dashes that are not
 * allowed anywhere in our copy, and dropped entirely if it comes back empty or
 * unreasonably long rather than printed at a parent as a wall of model output.
 *
 * THE LABEL IS NEVER GRAFTED INTO A CLAUSE. An earlier version wrote
 * "Because ${label} keeps coming up", which produced "Because group chats
 * keeps coming up" and "Because switch rows every night", lowercasing a
 * console into a light switch. There is no way to fix agreement and casing for
 * text a model wrote, so the label gets its own sentence and the sentence
 * about it gets another. Both are then true whatever arrives.
 */
function concernReason(label: string | null, flags: number): string {
  const clean = (label ?? '')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:!?]+$/, '')
  const tail =
    flags > 2 ? `You have raised this ${spell(flags)} times`
    : flags === 2 ? 'You have raised this twice'
    : 'You raised this recently'
  if (!clean || clean.length > 46) {
    return flags > 1 ? 'Because this keeps coming up for you' : 'Because you raised this recently'
  }
  return `${clean}. ${tail}`
}

/** Small numbers as words, because "raised this 3 times" reads like a receipt. */
function spell(n: number): string {
  return ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n)
}

/** "Ella's iPad" becomes "an Ella's iPad" without this. Crude on purpose: it only has to read right. */
function article(label: string): string {
  const clean = label.replace(/[–—-]/g, ' ').replace(/\s+/g, ' ').trim()
  if (!clean) return 'a device'
  if (/^(the|a|an|my|our|his|her|their)\b/i.test(clean)) return clean
  if (/[''`]s\b/.test(clean)) return clean
  return `${/^[aeiou]/i.test(clean) ? 'an' : 'a'} ${clean}`
}

/** Today in Europe/London, matching the date the status route writes. */
function londonToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
}
