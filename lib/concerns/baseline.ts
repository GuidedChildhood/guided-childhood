import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type BaselineConcern = {
  id: string
  slug: string
  label: string
  times_flagged: number
  last_flagged_at: string
  /** Whose worry it is. Written at insert since the beginning; returned since
   *  14 August 2026, when the check in finally started saying whose it was. */
  child_id: string | null
}

// The onboarding ids, and the ledger slugs they belong on. Both the current
// wizard ids and the older starter quiz ones are here, mapped onto the same
// row where they mean the same thing, so a worry named at signup never lands
// as a second concern saying what an existing one already says.
//
// Concern slugs are free form kebab case across the product (bedtime,
// morning-tv-habit, rightnow-tv-off), written by DiGi and the moments deck.
// There is no registry to add to, so these are simply the same shape.
const ONBOARDING_TO_SLUG: Record<string, string> = {
  morning_tv: 'morning-tv',
  controller_fights: 'controller-fights',
  wont_put_down: 'wont-put-down',
  bedtime_screens: 'bedtime-screens',
  mood_after_screens: 'mood-after-screens',
  screens_takeover: 'wont-put-down',
  mood_changes: 'mood-after-screens',
  gaming: 'controller-fights',
  // something_else and online_safety are deliberately absent. A catch all is
  // a picker, not a rateable thing, and the daily card already filters those
  // out by slug. A baseline row nobody can honestly score is worse than none.
}

// What the parent sees on the row. Plain, and in their words rather than
// ours: these are the six the wizard offers, spelled out.
const LABEL: Record<string, string> = {
  'morning-tv': 'Morning TV',
  'controller-fights': 'Controller fights',
  'wont-put-down': 'Will not put it down',
  'bedtime-screens': 'Bedtime screens',
  'mood-after-screens': 'Mood after screens',
}

/**
 * Turn what a parent named at signup into their first real concern rows.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * Onboarding asks what is hard and writes the answer to
 * profiles.onboarding_answers, and nothing has ever read it as a concern. Of
 * the eight most recent accounts, six have a named challenge and ZERO concern
 * rows. So a parent told us their worry in the first two minutes and the app
 * carried on as though they had not: no check in to do, nothing on the journey
 * table, nothing for DiGi's live concerns block, and no baseline to measure
 * against for as long as they stayed.
 *
 * This is not inventing data. It is finally recording the answer to a question
 * we already asked, on the row that answer has always belonged on.
 *
 * Idempotent by construction: it does nothing at all when the family already
 * has any concern, so it can only ever run once and can never race a real
 * concern raised through DiGi or Right now.
 *
 * Returns the rows to check in on, or an empty list if there was nothing
 * nameable, in which case the caller shows no baseline card rather than an
 * empty one.
 */
export async function seedBaselineConcerns(
  supabase: SupabaseClient,
  userId: string,
  onboardingAnswers: unknown,
): Promise<BaselineConcern[]> {
  const answers = (onboardingAnswers ?? {}) as {
    challenge?: string | null
    challenges?: string[] | null
  }
  const named = [
    ...(Array.isArray(answers.challenges) ? answers.challenges : []),
    ...(answers.challenge ? [answers.challenge] : []),
  ]

  const slugs = Array.from(new Set(
    named.map(c => ONBOARDING_TO_SLUG[String(c)]).filter(Boolean)
  ))
  if (slugs.length === 0) return []

  // Only ever on a genuinely empty ledger. A family with concerns already has
  // a real list and does not need one conjured behind it.
  const { data: existing, error: readError } = await supabase
    .from('concerns')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
  if (readError || (existing ?? []).length > 0) return []

  const { data: child } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', userId)
    .eq('is_primary', true)
    .maybeSingle()

  const now = new Date().toISOString()
  const { data: inserted, error } = await supabase
    .from('concerns')
    .insert(slugs.map(slug => ({
      user_id: userId,
      child_id: child?.id ?? null,
      source: 'onboarding',
      slug,
      label: LABEL[slug] ?? slug,
      status: 'open',
      times_flagged: 1,
      last_flagged_at: now,
    })))
    .select('id, slug, label, times_flagged, last_flagged_at, child_id')

  if (error) return []
  return (inserted ?? []) as BaselineConcern[]
}
