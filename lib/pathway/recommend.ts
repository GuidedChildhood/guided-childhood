import type { createClient } from '@/lib/supabase/server'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'
import { categoryForConcern, DEVICE_KIND_TO_CATEGORIES } from '@/lib/content/signal-map'
import type { ChallengeId } from '@/lib/content/stages'
import type { StageId } from './progress'
import { chooseScript, eligibleScripts, rankScripts, scoreScript } from './recommend-pick'
import { dipsFrom, type WellbeingCheck } from './checkin-dips'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export interface RecommendedScript {
  sort_order: number
  title: string
  situation: string
  is_free: boolean
  matchesChallenge: boolean
  /** Why this one, in words a parent can check against their own life. Null when nothing but stage order chose it. */
  reason: string | null
  reasonKey: 'concern' | 'dip' | 'device' | 'challenge' | 'returning' | 'opened' | null
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
// FOUR SIGNALS NOW, and the order between them is the whole argument:
//
//   1. LIVE CONCERNS, hardest. A concern row is written when this family
//      actually raised something, in DiGi, in a moment, or in right now. It is
//      the closest thing we have to "previous conversations" and it is the only
//      signal that carries a count: something flagged four times is four times
//      the thing something flagged once is.
//   2. DIPS ON THE WEEKLY CHECK IN. Justin, 11 August 2026: "shouldn't we have
//      a better script that relates to dips on check in or previous moments."
//      wellbeing_checks has held five scores out of five per child per week
//      since migration 001 and this function had never read one of them. A
//      concern is a family SAYING something is wrong; a dip is a family
//      MEASURING it, which is quieter and harder to argue with. See
//      checkin-dips.ts.
//   3. THE DEVICES IN THE HOUSE. A console in the hall is real evidence that
//      gaming scripts will land. Weaker than both of the above, because owning
//      a thing is not the same as struggling with it.
//   4. THE SIGNUP ANSWER, weakest, and kept rather than dropped because on day
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
type ScriptSignals = {
  eligible: ScriptRow[]
  byCategory: Map<string, { score: number; reason: string; key: RecommendedScript['reasonKey'] }>
  scoreOf: (category: string | null) => number
  opened: Set<number>
  returned: Set<number>
  /** Shown on the shelf three separate days, never opened. See recommend-pick.ts. */
  tired: Set<number>
  challengeCategory: string | null
}

// Everything the recommender knows about this family, gathered once. Shared
// by the single pick below and the top five (getTopScripts), so the two can
// never rank the same day from different evidence.
async function gatherSignals(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null | undefined,
  childId: string | null,
): Promise<ScriptSignals | null> {
  const today = londonToday()

  // WHOSE signals. Justin, 20 August 2026: scripts "should relate to each
  // child's issues". Concerns have carried a child since migration 194, check
  // ins since day one, and completions since 213, and this read them all
  // family wide, so Teo and Olga got the same recommendation whenever they
  // shared a stage. When the caller names a child, the concern, dip and
  // done-already signals are that child's own. A row with no child on it is a
  // household fact and still counts for everyone; devices and the signup
  // answer stay family wide because they genuinely are.
  const childOr = childId ? `child_id.eq.${childId},child_id.is.null` : null

  let completionsQ = supabase
    .from('script_completions')
    .select('script_sort_order, status, not_needed_until')
    .eq('user_id', userId)
  if (childOr) completionsQ = completionsQ.or(childOr)

  // Open and improving both count. A concern getting better is still a
  // concern, and the script that helps is often the one that keeps it going.
  let concernsQ = supabase
    .from('concerns')
    .select('slug, label, times_flagged, last_flagged_at')
    .eq('user_id', userId)
    .in('status', ['open', 'improving'])
  if (childOr) concernsQ = concernsQ.or(childOr)

  // The weekly check in, which this has never read. See checkin-dips.ts: five
  // scores out of five that a parent sits down and gives us on purpose, and
  // the recommender was ranking on the strength of owning a tablet instead.
  let checksQ = supabase
    .from('wellbeing_checks')
    .select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication')
    .eq('parent_id', userId)
  if (childOr) checksQ = checksQ.or(childOr)

  // What the shelf has been showing (surface_events, migration 238). Failing
  // soft to an empty list on a database the migration has not reached, the
  // same reasoning as the only_on_signal guard below.
  let shownQ = supabase
    .from('surface_events')
    .select('item, day')
    .eq('user_id', userId)
    .eq('surface', 'script')
    .eq('event', 'shown')
  if (childOr) shownQ = shownQ.or(childOr)

  const [{ data: scripts }, { data: completions }, { data: concerns }, { data: devices }, { data: checks }, { data: shownRows }] = await Promise.all([
    supabase
      .from('scripts')
      .select('sort_order, title, situation, category, is_free')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true }),
    completionsQ,
    concernsQ
      .order('times_flagged', { ascending: false })
      .order('last_flagged_at', { ascending: false })
      .limit(12),
    supabase
      .from('family_devices')
      .select('label, kind')
      .eq('user_id', userId)
      .is('retired_at', null)
      .limit(20),
    checksQ
      .order('week_start', { ascending: false })
      .limit(12),
    shownQ
      .order('day', { ascending: false })
      .limit(400),
  ])

  if (!scripts || scripts.length === 0) return null

  // Which scripts may only speak when spoken to (migration 185).
  //
  // Asked for in its own query, and failing soft, ON PURPOSE. Selecting the
  // column alongside the rest would tie this function to the migration having
  // run: on a deploy that landed first, the whole select would error, scripts
  // would come back empty, and every family would lose their recommended card
  // until somebody opened the SQL editor. Separated, the worst case is that the
  // guard is not yet in force, which is exactly where we are today anyway.
  const flagged = new Set<number>()
  try {
    const { data: guarded } = await supabase
      .from('scripts')
      .select('sort_order')
      .eq('stage_id', stageId)
      .eq('only_on_signal', true)
    for (const g of (guarded ?? []) as { sort_order: number }[]) flagged.add(g.sort_order)
  } catch { /* column not there yet, so nothing is guarded */ }

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
  //   read        reached the end of (migration 183). Counts on the passport
  //               and is STILL OFFERED, deliberately, in the same demoted place
  //               as opened. Reading the words is not the same as having said
  //               them, so the script has more to give this family and retiring
  //               it on a scroll would take it away for a conversation that has
  //               not happened yet. Only 'used' retires anything.
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

  // Shown for three separate days and never once opened: the family has seen
  // the card and walked past it, and the shelf should turn rather than
  // repeat itself. Distinct DAYS, not renders, because the write side
  // records at most one shown per pick per day.
  const shownDays = new Map<number, Set<string>>()
  for (const e of (shownRows ?? []) as { item: string; day: string }[]) {
    const so = Number(e.item)
    if (!Number.isFinite(so)) continue
    const held = shownDays.get(so) ?? new Set<string>()
    held.add(e.day)
    shownDays.set(so, held)
  }
  const tired = new Set<number>()
  for (const [so, days] of shownDays) {
    if (days.size >= 3 && !opened.has(so)) tired.add(so)
  }

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
      // Slug first, then the words. Two of the three things that write a
      // concern do not use a fixed vocabulary, so the exact table alone was
      // dropping the loudest signals on the platform. See signal-map.ts.
      categoryForConcern(c.slug, c.label),
      100 + weight * 10,
      concernReason(c.label, raised),
      'concern',
    )
  }

  // 2. Check in dips, which sit between a concern and a device on purpose.
  //
  // A concern is a family SAYING something is a problem, the strongest signal
  // there is. A dip is a family MEASURING one, quieter and harder to argue
  // with, and both beat the fact that there is a console in the hall.
  for (const dip of dipsFrom((checks ?? []) as WellbeingCheck[])) {
    offer(dip.category, dip.score, dip.reason, 'dip')
  }

  // 3. Devices. One score whichever device raised it, because two tablets are
  // not twice the reason.
  for (const d of (devices ?? []) as DeviceRow[]) {
    for (const category of DEVICE_KIND_TO_CATEGORIES[d.kind] ?? []) {
      offer(category, 50, `Because there is ${article(d.label)} in the house`, 'device')
    }
  }

  // 4. The signup answer.
  const challengeCategory = challenge ? CHALLENGE_TO_CATEGORY[challenge] ?? null : null
  offer(challengeCategory, 25, 'Matches what you told us at the start', 'challenge')

  const scoreOf = (category: string | null) => (category ? byCategory.get(category)?.score ?? 0 : 0)

  // Scripts that assert something about a child never speak first. The rule,
  // and the morning it was written on, are in eligibleScripts. It guards
  // every recommendation, the top five included, not just the first card.
  const eligible = eligibleScripts(pool, flagged)
  // Never strand a family with no card at all. If the guard emptied the pool
  // there was nothing honest left to recommend anyway.
  if (eligible.length === 0) return null

  return { eligible, byCategory, scoreOf, opened, returned, tired, challengeCategory }
}

export async function getRecommendedScript(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null | undefined,
  opts?: { preferFree?: boolean; childId?: string | null }
): Promise<RecommendedScript | null> {
  const sig = await gatherSignals(supabase, userId, stageId, challenge, opts?.childId ?? null)
  if (!sig) return null
  const { eligible, byCategory, scoreOf, opened, returned, tired, challengeCategory } = sig

  const freeOnly = opts?.preferFree ? eligible.filter(s => s.is_free) : []
  // Restricted to free scripts when the parent cannot open a paid one, and
  // only falling back to the whole pool when the stage holds no free script at
  // all, which is a content gap rather than something to solve here.
  const searchable = opts?.preferFree && freeOnly.length > 0 ? freeOnly : eligible

  const chosen = chooseScript(searchable, { scoreOfCategory: scoreOf, opened, returned, tired, dayIndex: dayIndex() })
  const best = scoreScript(chosen, { scoreOfCategory: scoreOf, opened, returned, tired })

  const signal = chosen.category ? byCategory.get(chosen.category) : undefined
  const carried = best > 0 && !!signal
  const returning = returned.has(chosen.sort_order)
  // The same script coming up day after day is usually this: every script in
  // the family's top category has been glanced at, none marked used or not
  // needed, so the tie breaks the same way every morning. Justin: "whatever
  // the first card is, always seems the same." Saying so, and naming the two
  // taps that move it on, turns a thing that looks stuck into a choice.
  const reopened = !returning && opened.has(chosen.sort_order)

  return {
    sort_order: chosen.sort_order,
    title: chosen.title,
    situation: chosen.situation,
    is_free: chosen.is_free,
    matchesChallenge: !!challengeCategory && chosen.category === challengeCategory,
    reason: returning
      ? 'You set this aside a while back. Worth another look now'
      : reopened
        ? 'Still open from last time. Tap used it or not needed and the next one steps up'
        : carried ? signal!.reason : null,
    reasonKey: returning ? 'returning' : reopened ? 'opened' : carried ? signal!.key : null,
  }
}

// The top five scripts for this child, strongest first.
//
// Justin, 1 September 2026: "a top 5 of scripts that apply to details we
// gather for each child and they are recommended scripts to choose from
// based on what they have told us and what's best for the age."
//
// Position one is exactly getRecommendedScript's answer (same signals, same
// tie rotation), so the road's lead card and this shelf can never disagree.
// Free is not filtered here: the shelf is the honest library view and a
// locked card says so on its face, while the road's own lead link keeps its
// paywall safe route through safeScriptHref.
export async function getTopScripts(
  supabase: SupabaseClient,
  userId: string,
  stageId: StageId,
  challenge: ChallengeId | null | undefined,
  opts?: { childId?: string | null; limit?: number }
): Promise<RecommendedScript[]> {
  const sig = await gatherSignals(supabase, userId, stageId, challenge, opts?.childId ?? null)
  if (!sig) return []
  const { eligible, byCategory, scoreOf, opened, returned, tired, challengeCategory } = sig

  const scoring = { scoreOfCategory: scoreOf, opened, returned, tired }
  const ranked = rankScripts(eligible, { ...scoring, dayIndex: dayIndex() }, opts?.limit ?? 5)

  return ranked.map(s => {
    const best = scoreScript(s, scoring)
    const signal = s.category ? byCategory.get(s.category) : undefined
    const carried = best > 0 && !!signal
    const returning = returned.has(s.sort_order)
    const reopened = !returning && opened.has(s.sort_order)
    return {
      sort_order: s.sort_order,
      title: s.title,
      situation: s.situation,
      is_free: s.is_free,
      matchesChallenge: !!challengeCategory && s.category === challengeCategory,
      reason: returning
        ? 'You set this aside a while back. Worth another look now'
        : reopened
          ? 'You have opened this one before'
          : carried ? signal!.reason : null,
      reasonKey: returning ? 'returning' : reopened ? 'opened' : carried ? signal!.key : null,
    }
  })
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

/**
 * Which day it is, as a number, for rotating between equally good scripts.
 *
 * Read off the London date rather than the raw clock, so the card turns over at
 * a British midnight rather than at a UTC one, and so it holds still for the
 * whole of a day rather than drifting through it.
 */
function dayIndex(): number {
  return Math.floor(Date.parse(`${londonToday()}T00:00:00Z`) / 86400000)
}
