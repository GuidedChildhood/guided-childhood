import type { SupabaseClient } from '@supabase/supabase-js'
import { ONBOARDING_TO_SLUG, LABEL } from '@/lib/concerns/worry-map'

// ── WHAT THIS FAMILY KEEPS, FROM THEIR OWN ROWS ─────────────────────────────
//
// Review board, 13 October 2026 (paywall-ask-is-personal): the choose screen
// and the upgrade page said the same thing to every family and listed
// features. The ask that converts is the one that names what is already
// theirs: Teo's name, the worry they are tracking, the check ins so far, the
// star quest, the scripts they have opened.
//
// Every number here is a count of their own rows, never a guess and never a
// composite. A zero hides the line, and when every line is hidden the screens
// say so honestly rather than inventing progress (see keepsItems).
//
// Read with the parent's own session client, so RLS is the fence: a family can
// only ever be told about its own rows. Every read is best effort. A failed
// count costs a line on a sales screen, and failing the page would cost the
// screen that takes the money.

export type WhatYouKeep = {
  /** The child the account leads with, or null when no real name was given. */
  childName: string | null
  /** The worry this family is tracking, or the one named at sign up. */
  worry: string | null
  /** True when the worry is only the sign up answer, with no row yet. */
  worryNamedOnly: boolean
  /** Check ins answered on a worry (concern_events 'checked'). */
  checkIns: number
  /** Scripts opened, read or used (script_completions, set asides excluded). */
  scriptsOpened: number
  /** Active jobs on the star quest. */
  questJobs: number
  /** Stars the parent has approved on those jobs. */
  starsEarned: number
}

/** The upgrade page's honest empty state: nothing of theirs yet, and the next step. */
export const KEEP_FALLBACK = 'Nothing to name yet. Your first check in takes a minute, and it is the starting point every later one is measured against.'

export const EMPTY_KEEP: WhatYouKeep = {
  childName: null, worry: null, worryNamedOnly: false,
  checkIns: 0, scriptsOpened: 0, questJobs: 0, starsEarned: 0,
}

async function count(q: PromiseLike<{ count: number | null; error: unknown }>): Promise<number> {
  try {
    const { count: n, error } = await q
    return error ? 0 : n ?? 0
  } catch {
    return 0
  }
}

/** The sign up answer, as the label every other screen already uses for it. */
function namedAtSignUp(answers: unknown): string | null {
  const a = (answers ?? {}) as { challenge?: string | null; challenges?: string[] | null; challenge_other?: string | null }
  const ids = [...(Array.isArray(a.challenges) ? a.challenges : []), ...(a.challenge ? [a.challenge] : [])]
  for (const id of ids) {
    const slug = ONBOARDING_TO_SLUG[String(id)]
    if (slug && LABEL[slug]) return LABEL[slug]
  }
  const other = typeof a.challenge_other === 'string' ? a.challenge_other.trim() : ''
  return other && other.length <= 60 ? other : null
}

export async function getWhatYouKeep(supabase: SupabaseClient, userId: string): Promise<WhatYouKeep> {
  try {
    const [kidsRes, profileRes, concernRes, checkIns, scriptsOpened, questJobs, starsEarned] = await Promise.all([
      // Primary first, then oldest: the same order lib/children/server.ts reads.
      supabase.from('children').select('name').eq('parent_id', userId)
        .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1),
      supabase.from('profiles').select('onboarding_answers').eq('id', userId).maybeSingle(),
      supabase.from('concerns').select('label').eq('user_id', userId).in('status', ['open', 'improving'])
        .order('times_flagged', { ascending: false }).order('last_flagged_at', { ascending: false }).limit(1),
      count(supabase.from('concern_events').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('event', 'checked')),
      count(supabase.from('script_completions').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).neq('status', 'not_needed')),
      count(supabase.from('family_quests').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('active', true)),
      count(supabase.from('quest_ticks').select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('status', 'approved')),
    ])

    const rawName = ((kidsRes.data ?? [])[0] as { name?: string | null } | undefined)?.name?.trim() ?? ''
    // 'Your child' is the placeholder setup writes when the name is skipped.
    const childName = rawName && rawName.toLowerCase() !== 'your child' ? rawName : null

    const tracked = ((concernRes.data ?? [])[0] as { label?: string | null } | undefined)?.label?.trim() || null
    const named = tracked ? null : namedAtSignUp((profileRes.data as { onboarding_answers?: unknown } | null)?.onboarding_answers)

    return {
      childName,
      worry: tracked ?? named,
      worryNamedOnly: !tracked && !!named,
      checkIns, scriptsOpened, questJobs, starsEarned,
    }
  } catch {
    return EMPTY_KEEP
  }
}

/** "Bedtime screens" reads as "bedtime screens" mid sentence; "AI chatbots" stays. */
function midSentence(label: string): string {
  return label.length > 1 && label[1] === label[1].toLowerCase()
    ? label[0].toLowerCase() + label.slice(1)
    : label
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

/** "Teo's", or "your child's" when no name was given. */
export function possessive(childName: string | null): string {
  return childName ? `${childName}’s` : 'your child’s'
}

/**
 * The lines the choose screen and the upgrade page list. Only what exists:
 * an empty list means the caller shows its honest fallback.
 */
export function keepsItems(k: WhatYouKeep): string[] {
  const items: string[] = []
  // The check in count is across every worry, so it is its own line rather
  // than being pinned to the one worry named above it.
  if (k.worry) {
    items.push(k.worryNamedOnly
      ? `${k.worry}, the worry you named, ready for its first check in`
      : `${k.worry}, the worry you are tracking`)
  }
  if (k.checkIns > 0) {
    items.push(`${plural(k.checkIns, 'check in', 'check ins')} so far, each one measured against the first`)
  }
  if (k.questJobs > 0) {
    const whose = possessive(k.childName)
    const head = `${whose[0].toUpperCase()}${whose.slice(1)} star quest, with ${plural(k.questJobs, 'job', 'jobs')} on it`
    items.push(k.starsEarned > 0 ? `${head} and ${plural(k.starsEarned, 'star', 'stars')} earned` : head)
  }
  if (k.scriptsOpened > 0) {
    items.push(`${plural(k.scriptsOpened, 'script', 'scripts')} you have opened`)
  }
  return items
}

/** The heading over that list, named for the child when we have a name. */
export function keepsHeading(k: WhatYouKeep): string {
  return k.childName ? `What you keep for ${k.childName}` : 'What your family keeps'
}

/**
 * Has the parent given something and seen something back? THE-STORY section 9
 * puts the ask here: after the first check in or the first script, which is
 * when the ask repeats on Home.
 */
export function hasSeenSomethingBack(k: WhatYouKeep): boolean {
  return k.checkIns > 0 || k.scriptsOpened > 0
}

/**
 * One sentence for the trial card on Home, once hasSeenSomethingBack is true.
 * Null otherwise, so the card says nothing it cannot back.
 */
export function keepsLine(k: WhatYouKeep): string | null {
  if (!hasSeenSomethingBack(k)) return null
  const parts: string[] = []
  if (k.worry && !k.worryNamedOnly) parts.push(midSentence(k.worry))
  if (k.checkIns > 0) parts.push(plural(k.checkIns, 'check in', 'check ins'))
  if (k.questJobs > 0) parts.push(`${possessive(k.childName)} star quest`)
  if (k.scriptsOpened > 0) parts.push(plural(k.scriptsOpened, 'script', 'scripts'))
  if (!parts.length) return null
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
  return `So far: ${list}. All of it stays when you join.`
}
