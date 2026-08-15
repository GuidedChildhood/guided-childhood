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
export const ONBOARDING_TO_SLUG: Record<string, string> = {
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
export const LABEL: Record<string, string> = {
  'morning-tv': 'Morning TV',
  'controller-fights': 'Controller fights',
  'wont-put-down': 'Will not put it down',
  'bedtime-screens': 'Bedtime screens',
  'mood-after-screens': 'Mood after screens',
  'phones-and-messaging': 'Phones and messaging',
}

// ── THE FOUR COMMON ONES, FOR A CHILD WITH NO HISTORY ───────────────────────
//
// plans/setup-quest-three-steps.md: "The baseline asks four common ones to
// start, about phones, social media and the rest, rather than reviewing
// concerns a new family does not have yet."
//
// This is what a SECOND child gets, and the distinction from the family
// baseline above matters. That one records an answer the parent actually gave,
// about the child they gave it about. A second child added in month three was
// never asked about at signup, and reusing the first child's answers would be
// the app putting words in a parent's mouth about a different person.
//
// So a new child starts on the four every family recognises. They are a
// starting point to rate, not claims about this child, and the resting rule in
// lib/concerns/resting.ts retires any that come back as fine, so a parent who
// says all four are going great is asked about none of them again.
export const COMMON_BASELINE_SLUGS = [
  'bedtime-screens',
  'wont-put-down',
  'mood-after-screens',
  'phones-and-messaging',
] as const

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

/**
 * Give ONE child their own starting worries, so they appear at the next check
 * in.
 *
 * ── WHY A SECOND FUNCTION AND NOT A PARAMETER ───────────────────────────────
 *
 * Justin, 14 August 2026, on the check in reading done: "may be done for other
 * child as this will need to be child by child so part of the set up list will
 * need to have add other children."
 *
 * The live database showed the whole of it. All 27 concerns on the account
 * belong to Teo; Olga, added later, has none at all. So even once the rung
 * counts children separately, Olga can never be asked about anything, because
 * seedBaselineConcerns above refuses to run for a family that already has
 * concerns. That guard is right and must stay: it is what stops a real ledger
 * being conjured behind a family who have been using the product for months.
 *
 * This asks the narrower question, per child rather than per family, so a child
 * added in month three gets the same start as a child added on day one.
 *
 * Idempotent the same way, on the same principle: it does nothing for a child
 * who already has a worry of their own.
 */
export async function seedChildBaseline(
  supabase: SupabaseClient,
  userId: string,
  childId: string,
): Promise<BaselineConcern[]> {
  const { data: existing, error: readError } = await supabase
    .from('concerns')
    .select('id')
    .eq('user_id', userId)
    .eq('child_id', childId)
    .limit(1)
  if (readError || (existing ?? []).length > 0) return []

  const now = new Date().toISOString()
  const { data: inserted, error } = await supabase
    .from('concerns')
    .insert(COMMON_BASELINE_SLUGS.map(slug => ({
      user_id: userId,
      child_id: childId,
      source: 'baseline',
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
