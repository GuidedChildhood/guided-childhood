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
  // ── THE TWO THAT WERE MISSING, AND COST EVERY NEW FAMILY THEIR CHECK IN ───
  //
  // The canonical list is ChallengeId in lib/content/stages.ts: screens_takeover,
  // mood_changes, gaming, online_safety, start_conversation, asking_for_phone.
  // Three of those six had no key here, and asking_for_phone is the SECOND most
  // common answer on the live product, five of the twelve accounts.
  //
  // The effect was total and silent. No key means no slug, no slug means this
  // returns [], no concerns are seeded, and the check in page opens on "All done
  // for today" on the morning a family signs up, while the rung on Home still
  // reads not done. That is the loop Justin kept hitting, and it was never the
  // rung: there was genuinely nothing to ask about.
  //
  // LABEL already carried 'phones-and-messaging' with nothing pointing at it,
  // which is the tell that this mapping was always meant to exist.
  asking_for_phone: 'phones-and-messaging',
  start_conversation: 'phones-and-messaging',
  // online_safety and something_else stay deliberately absent. A catch all is a
  // picker, not a rateable thing, and the daily card already filters those out
  // by slug. A baseline row nobody can honestly score is worse than none. They
  // are safe to leave out now that an unmapped answer falls back to the four
  // common ones rather than to nothing.
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
// ── THE SOURCE VALUE THAT KILLED EVERY BASELINE EVER SEEDED ─────────────────
//
// concerns.source is constrained to ('moment','script','digi','rightnow',
// 'checkin'). This file inserted 'onboarding' below and 'baseline' in
// seedChildBaseline, and BOTH violate that check. Postgres rejected the insert,
// the `if (error) return []` swallowed it, and the caller saw an empty array
// that looks exactly like "nothing to seed".
//
// So the baseline has never worked. Not for a mis-mapped challenge, not for a
// correctly mapped one, not for a second child. Every family who ever signed up
// opened their first check in on "All done for today", and the live database
// agrees: 27 concerns across the product, sourced only moment, digi and
// rightnow. Not one from onboarding.
//
// 'checkin' is the honest value of the five allowed: these rows exist to be
// checked in on, and that is the surface that creates and then reads them. The
// constraint is not widened, because it was doing its job and the code was
// wrong.
const BASELINE_SOURCE = 'checkin'

export const COMMON_BASELINE_SLUGS = [
  'bedtime-screens',
  'wont-put-down',
  'mood-after-screens',
  'phones-and-messaging',
] as const

// ── TWO TO START, NOT FOUR (2 September 2026) ───────────────────────────────
//
// Justin, looking at his own first check in with three children: "maybe we
// should have 2 each basic standard questions to start to keep it easy, then
// we add based on parents' moments etc from then on each day... just don't
// want too many on first check in until we know issues."
//
// He is right about the shape of the product. The worries a family actually
// has arrive through DiGi, Right now, the moments and the wellbeing check in,
// each of which raises a row for the child it was about (lib/concerns/raise),
// and a worry scored top rests (lib/concerns/resting). The baseline is only
// the first two rungs of that ladder, so it should be the two everybody with
// a screen in the house can honestly answer on day one. The other two common
// ones are still in COMMON_BASELINE_SLUGS for the older readers of it.
export const STARTER_SLUGS = ['bedtime-screens', 'wont-put-down'] as const
const STARTER_COUNT = STARTER_SLUGS.length

/** The starters, minus any the chosen list already carries, up to the count. */
function topUp(chosen: string[]): string[] {
  const out = [...chosen]
  for (const s of STARTER_SLUGS) {
    if (out.length >= STARTER_COUNT) break
    if (!out.includes(s)) out.push(s)
  }
  return out
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
  /** The child the sign up answers were about. Looked up as the primary when absent. */
  childId?: string | null,
): Promise<BaselineConcern[]> {
  const answers = (onboardingAnswers ?? {}) as {
    challenge?: string | null
    challenges?: string[] | null
  }
  const named = [
    ...(Array.isArray(answers.challenges) ? answers.challenges : []),
    ...(answers.challenge ? [answers.challenge] : []),
  ]

  const mapped = Array.from(new Set(
    named.map(c => ONBOARDING_TO_SLUG[String(c)]).filter(Boolean)
  ))

  // ── AN UNMAPPED ANSWER MUST NEVER MEAN NO CHECK IN ────────────────────────
  //
  // This used to `return []` when nothing matched, and that single line is what
  // turned a missing key into a dead product surface: no rows, so the check in
  // page says "All done for today" on day one, so the first thing the daily loop
  // asks a new family to do is the one thing it will not let them do.
  //
  // Mapping asking_for_phone fixes today's version of it. This fixes the SHAPE
  // of it, which matters more, because the map has now fallen behind the
  // onboarding options twice and will again the next time somebody adds a
  // question: a family who answers something we have no slug for gets the four
  // common worries instead of an empty page.
  //
  // The four are a fair thing to ask anybody with a screen in the house, and a
  // parent who finds one irrelevant answers "going great" once and it rests. An
  // approximate question they can answer beats a perfect one they never see.
  // What was chosen at sign up, topped up from the two starters to two. A
  // parent who chose two sees exactly those two; one who chose one sees it
  // plus a starter; one whose answer has no slug sees the two starters.
  const slugs = topUp(mapped)
  if (slugs.length === 0) return []

  // ── PER CHILD, NOT PER FAMILY (2 September 2026) ─────────────────────────
  //
  // This used to refuse to run once the family had ANY concern. Setup adds the
  // other children before the first check in and seeds each of them as they
  // arrive, so by the time the primary child was looked at the family already
  // had rows, this returned nothing, and the primary fell through to the stock
  // list like everybody else. Justin, on his own account: "I'm not sure where
  // the first options are coming from? When we signed up I only selected 2."
  // He had, and the app had thrown them away. The guard is now the same one
  // seedChildBaseline uses: nothing for a child who already has a worry.
  const { data: child } = childId
    ? { data: { id: childId } }
    : await supabase
        .from('children')
        .select('id')
        .eq('parent_id', userId)
        .eq('is_primary', true)
        .maybeSingle()
  if (!child?.id) return []

  const { data: existing, error: readError } = await supabase
    .from('concerns')
    .select('id')
    .eq('user_id', userId)
    .eq('child_id', child.id)
    .limit(1)
  if (readError || (existing ?? []).length > 0) return []

  // ── A BASELINE IS AS OF YESTERDAY, AND THAT IS WHAT MAKES IT ANSWERABLE ───
  //
  // Justin, 18 August 2026: "when I get to check in it only allows me to check
  // in the first line then says done" and "the toggle also updated as done when
  // I do the first child."
  //
  // One cause, and it is a chain of three correct looking things:
  //
  //   1. these rows are stamped last_flagged_at = NOW, so today
  //   2. rating the FIRST line calls markFirstCheckIn, which sets
  //      profiles.first_checkin_at for the first time
  //   3. lib/checkin/today.ts then switches on its review rule, "do not ask
  //      about something flagged today", because a first check in now exists
  //
  // So the second page load filters out every remaining baseline row, for every
  // child at once, because they were all seeded today. One rating and the whole
  // family reads as done. The review rule is right, the seeding was wrong to
  // put the rows inside its window.
  //
  // Backdating one day says what a baseline actually is: where things stood
  // before today, which is exactly the thing a check in reviews. It is also the
  // same repair that was applied by hand to the live rows on 17 August, now
  // done at the source so it never needs applying again.
  const now = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: inserted, error } = await supabase
    .from('concerns')
    .insert(slugs.map(slug => ({
      user_id: userId,
      child_id: child.id,
      source: BASELINE_SOURCE,
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

  // Backdated one day, for the reason spelled out in seedBaselineConcerns
  // above: a row stamped today is inside the check in's own review window, so
  // the first rating of the day would filter this child's remaining rows away
  // and read as done.
  const now = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: inserted, error } = await supabase
    .from('concerns')
    .insert(STARTER_SLUGS.map(slug => ({
      user_id: userId,
      child_id: childId,
      source: BASELINE_SOURCE,
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
