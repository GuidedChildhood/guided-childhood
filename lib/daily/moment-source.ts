import type { SupabaseClient } from '@supabase/supabase-js'
import { restingConcernIds } from '@/lib/concerns/resting'
import { ONBOARDING_TO_SLUG, LABEL } from '@/lib/concerns/baseline'

// WHAT TODAY'S MOMENT CARD SHOULD BE ABOUT.
//
// Justin, 14 August 2026, asking how the deck chooses: "what does it come up
// with this particular moment to start... I would like it to give the timeline
// moment page if no moments have yet been raised, or if first time after sign
// up then choose what they ticked at set up, so that moment should then bring
// up cards associated with the sign up issues raised."
//
// WHAT IT WAS DOING. Two rules, and only one of them was about the family:
//
//   1. Moments flagged YESTERDAY, matched to a script by keyword. Good, and it
//      already worked.
//   2. Otherwise `pool[dayIndex % pool.length]`. A pure calendar rotation.
//
// So on day one, and on any day after a day the parent did not log anything,
// the card was chosen by the date. A family who told us at signup that gaming
// was their problem could open the app the next morning to a card about
// lunchboxes, and nothing in the product would have noticed. Rule two is
// almost always the one that fires, because most parents do not log every day.
//
// WHAT IT DOES NOW, in order, and every step is about this family:
//
//   1. Flagged yesterday. Unchanged, and still first: it is the most recent
//      thing the parent told us, and "you flagged this yesterday" is the line
//      the deck earns its trust with.
//   2. Their LIVE WORRIES, most recently raised first. This is the answer to
//      the signup question and to much more besides, because the worries they
//      ticked at setup are seeded into this same table, and so is everything
//      raised through moments, DiGi and Right now since.
//   3. What they ticked at SIGNUP, read straight off onboarding_answers. Only
//      needed on day one, before the first check in has seeded anything, which
//      is exactly the case Justin named.
//   4. The calendar. Still there, still last, because a card about nothing is
//      worse than a card about something general.
//
// AND A RESTING WORRY NEVER DRIVES A CARD. "when they say issue is doing great
// it also drops off from moments." Same rule the check in uses, from
// lib/concerns/resting.ts, so the two can never disagree about whether bedtime
// is sorted.

export type MomentTopic = {
  /** Words to match against a script's title and situation. */
  keywords: string[]
  /** Where this came from, so the card can say so honestly. */
  source: 'yesterday' | 'concern' | 'signup'
  /** The family's own name for it, for the card's eyebrow. */
  label: string | null
}

// The moment ids the timeline offers, and the words each one is about. Kept
// here rather than in the page because the concern path needs the same map:
// a concern created FROM a moment carries that moment's slug.
export const MOMENT_KEYWORDS: Record<string, string[]> = {
  morning: ['morning'],
  teeth: ['teeth'],
  dressed: ['dressed'],
  bag: ['bag'],
  lunch: ['lunch'],
  dropoff: ['drop off', 'dropoff'],
  pickup: ['pickup', 'pick up'],
  snacks: ['snack'],
  dinner: ['dinner'],
  tv_eve: ['tv'],
  homework: ['homework'],
  clothes: ['clothes', 'washing'],
  fighting: ['fighting', 'sibling'],
  bedtime: ['bedtime', 'bed', 'sleep'],
  sleep: ['sleep', 'asleep', 'bed'],
}

// Words that carry no topic, so a label like "Coming off a device" matches on
// "device" rather than on "off". Without this, near enough every concern would
// match near enough every script.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'in', 'on', 'at', 'of', 'for', 'with',
  'my', 'our', 'their', 'his', 'her', 'is', 'are', 'was', 'were', 'be', 'been',
  'do', 'does', 'did', 'not', 'no', 'off', 'up', 'out', 'about', 'this', 'that',
  'it', 'its', 'we', 'they', 'them', 'i', 'me', 'you', 'your', 'child', 'kids',
  'concerns', 'worries', 'issue', 'issues', 'problem', 'problems', 'know', 'how',
  'what', 'when', 'start', 'still', 'more', 'time', 'times', 'again',
  // Words that describe how bad a thing is rather than what it is about. They
  // are the ones most likely to appear in an unrelated script's title, and
  // "Bedtime battle" matching "Homework Every Night is a Battle" is exactly
  // the failure: the specific word missed, so the generic one decided.
  'battle', 'battles', 'row', 'rows', 'fight', 'fights', 'trouble', 'help',
  'getting', 'going', 'coming', 'doing',
  // Verb fragments that are substrings of unrelated titles. "Coming off a
  // device" carries the slug word "come", which matched "When Group Chat Drama
  // COMEs Home" and handed a parent a card about group chats. The word that
  // means something in that concern is "device".
  'come', 'comes', 'came', 'gets', 'get', 'put', 'take', 'takes', 'make', 'makes',
])

/** The words in a concern's own name that are worth matching a script on. */
export function topicWords(slugOrLabel: string): string[] {
  return slugOrLabel
    .toLowerCase()
    .replace(/^rightnow-/, '')
    .split(/[^a-z]+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w))
}

/**
 * The first keyword that actually finds something, tried in order.
 *
 * Keywords come out of a concern most specific first, because the slug is read
 * before the label, so trying them IN ORDER and stopping at the first hit is
 * what stops a vague word deciding. Matching on "any of these words" let
 * "Bedtime battle" land on "Homework Every Night is a Battle": bedtime found
 * nothing, battle found the wrong thing, and any() cannot tell the difference.
 */
export function firstMatch<T>(
  pool: T[],
  keywords: string[],
  text: (item: T) => string,
): T[] {
  for (const kw of keywords) {
    const hits = pool.filter(item => text(item).includes(kw))
    if (hits.length > 0) return hits
  }
  return []
}

/**
 * The topics today's moment card should be about, best first.
 *
 * Returns an empty array when this family has genuinely told us nothing yet,
 * which is the case Justin wants sent to the timeline rather than fobbed off
 * with a card picked by the date.
 */
export async function getMomentTopics(
  supabase: SupabaseClient,
  userId: string,
  yesterdayMoments: string[],
  onboardingAnswers: unknown,
  /**
   * Whose worries drive the card. Concerns are per child (migration 194), and
   * a deck opened on Olga's tab reading Teo's worries is the deck talking
   * about the wrong child. A concern with no child on it is a household fact
   * and still counts for everyone. Omitted, everything counts, as before.
   */
  childId?: string | null,
): Promise<MomentTopic[]> {
  const topics: MomentTopic[] = []

  // 1. What they flagged yesterday.
  for (const m of yesterdayMoments) {
    const words = MOMENT_KEYWORDS[m]
    if (words?.length) topics.push({ keywords: words, source: 'yesterday', label: null })
  }

  // 2. Their live worries, most recently raised first, minus anything resting.
  try {
    let liveQ = supabase
      .from('concerns')
      .select('id, slug, label, last_flagged_at')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
    if (childId) liveQ = liveQ.or(`child_id.eq.${childId},child_id.is.null`)
    const { data: live } = await liveQ
      .order('last_flagged_at', { ascending: false })
      .limit(12)

    const rows = (live ?? []) as { id: string; slug: string; label: string; last_flagged_at: string }[]
    if (rows.length > 0) {
      const lastScore = new Map<string, number>()
      const lastScoreAt = new Map<string, string>()
      const { data: scores } = await supabase
        .from('concern_events')
        .select('concern_id, score, created_at')
        .in('concern_id', rows.map(r => r.id))
        .not('score', 'is', null)
        .order('created_at', { ascending: false })
      for (const r of (scores ?? []) as { concern_id: string; score: number | null; created_at: string }[]) {
        if (typeof r.score === 'number' && !lastScore.has(r.concern_id)) {
          lastScore.set(r.concern_id, r.score)
          lastScoreAt.set(r.concern_id, r.created_at)
        }
      }
      const resting = restingConcernIds(rows, lastScore, lastScoreAt)

      for (const r of rows) {
        if (resting.has(r.id)) continue
        // A concern made from a moment carries that moment's slug, so the exact
        // map beats word matching when it applies.
        const words = MOMENT_KEYWORDS[r.slug] ?? topicWords(`${r.slug} ${r.label ?? ''}`)
        if (words.length) topics.push({ keywords: words, source: 'concern', label: r.label ?? null })
      }
    }
  } catch { /* the deck still works off yesterday and the calendar */ }

  // 3. What they ticked at signup. Only reachable on day one, before the first
  //    check in has seeded those answers into concerns, which is precisely the
  //    gap Justin described.
  try {
    const answers = (onboardingAnswers ?? {}) as { challenge?: string | null; challenges?: string[] | null }
    const named = answers.challenges?.length ? answers.challenges : (answers.challenge ? [answers.challenge] : [])
    for (const c of named ?? []) {
      const slug = ONBOARDING_TO_SLUG[String(c)]
      if (!slug) continue
      const label = LABEL[slug] ?? slug
      const words = MOMENT_KEYWORDS[slug] ?? topicWords(`${slug} ${label}`)
      if (words.length) topics.push({ keywords: words, source: 'signup', label })
    }
  } catch { /* signup answers are a bonus, never a requirement */ }

  return topics
}
