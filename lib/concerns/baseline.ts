import type { createClient } from '@/lib/supabase/server'
import { resolveWorry } from './normalise'
import { ONBOARDING_TO_SLUG, LABEL, COMMON_BASELINE_SLUGS, STARTER_SLUGS, BASELINE_SOURCE } from './worry-map'
export { ONBOARDING_TO_SLUG, LABEL, COMMON_BASELINE_SLUGS, STARTER_SLUGS }

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

const STARTER_COUNT = STARTER_SLUGS.length

// The free text slug used to be built here, from the raw typed line. It lives
// in lib/concerns/normalise now, alongside the matching that usually means we
// never need it: worrySlug produces the same shape lib/concerns/raise toSlug
// does, deliberately, so a worry raised at setup and the same worry raised
// later through DiGi or a moment land on ONE row rather than two saying the
// same thing. scripts/check-focus-labels reads THIS file as plain text and
// regexes two blocks out of it, which a value import does not disturb.

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
    challenge_other?: string | null
  }
  const named = [
    ...(Array.isArray(answers.challenges) ? answers.challenges : []),
    ...(answers.challenge ? [answers.challenge] : []),
  ]

  const mapped = Array.from(new Set(
    named.map(c => ONBOARDING_TO_SLUG[String(c)]).filter(Boolean)
  ))

  // ── SOMETHING ELSE, IN THEIR OWN WORDS ──────────────────────────────────
  //
  // Justin, 9 September 2026: "How do we deal with something else? Note they
  // can add as many as they want and all areas we will cover through the
  // journey."
  //
  // Something else was the one tile that did nothing. It has no slug on
  // purpose, because a catch all is a picker rather than a rateable thing, so
  // ticking it wrote no row and the parent's actual worry was dropped between
  // the question and the check in.
  //
  // It takes their words now, and their words become a concern like any other.
  // Nothing new is needed to carry it: DiGi, the moments deck and Right now
  // have written free form slugs since August (teeth, sibling-fights,
  // football-post-game-upset are all live rows), so the ledger has always been
  // able to hold a worry we did not think of. This is the same door, opened at
  // the front instead of only halfway through.
  // ── WHAT THEY TYPED, AND WHAT WE THEN CALL IT FOR EVER ──────────────────
  //
  // Justin, 10 September 2026: "they can free type in Something else and can
  // have spelling mistakes and that carries through every time we reference
  // it, how can we fix?"
  //
  // This used to take the raw line as BOTH the label and, through otherSlug,
  // the key. So "wont get of the swich" became a permanent title on every
  // check in, every weekly email and the passport stamp when they finally
  // sorted it, and the typo was baked into the row's identity where no later
  // fix could reach it.
  //
  // resolveWorry does two things instead. Where the words are one of ours in
  // the parent's phrasing, and most of them are, it lands on that worry's slug
  // with our spelling, which also means the row shares the scripts and pathway
  // content that already exist for it rather than being a lonely one off
  // nobody has written anything for. Where the words are genuinely their own it
  // keeps them, tidied and never corrected, and builds the slug from the tidied
  // form. See lib/concerns/normalise.
  const own = resolveWorry(answers.challenge_other ?? '')
  const ownWords = own.label
  const ownSlug = own.slug

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
  // Their own words go FIRST, because a parent who typed something rather than
  // tapping a tile has told us the thing they came here about.
  const slugs = ownSlug ? [ownSlug, ...mapped.filter(m => m !== ownSlug)] : topUp(mapped)
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
      // Their own words are the label when it is their own row, so the check in
      // asks about "getting off the Switch at teatime" rather than a slug.
      label: slug === ownSlug ? ownWords : LABEL[slug] ?? slug,
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
