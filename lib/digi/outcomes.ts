import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// Did it work.
//
// Justin: "when we offer advice we gather and catch up in a few days to see if
// our solution worked, and if yes we weight it for future solutions, and if no
// we offer the next best alternative and again catch up and learn from feedback
// until DiGi is super intelligent in his field."
//
// This is the counted half of DiGi's learning. Everything else it knows about
// what works is inferred: a concern that changed status, a script somebody
// ticked, and digi_wisdom.evidence_count, which is the MODEL'S OWN GUESS at how
// much evidence sits behind a pattern, parsed out of its JSON. Useful, and not
// the same thing as a parent saying "we tried that and it did not work".
//
// One row per suggestion DiGi followed up on. Verdict filled in when the parent
// answers the card. See migration 147 and
// plans/week-of-2026-08-01-digi-closed-loop-plan.md.
//
// THE ONE THING TO GET RIGHT IN THE WORDING, everywhere this surfaces: "it did
// not work" is the most valuable row in the table, not a complaint. It is the
// row that earns a parent a different suggestion. If the product makes saying it
// feel like criticism, every answer skews kind and the whole ledger becomes
// flattery with a count attached.

export type Verdict = 'worked' | 'partly' | 'no'

export const VERDICTS: Verdict[] = ['worked', 'partly', 'no']

export function isVerdict(v: unknown): v is Verdict {
  return typeof v === 'string' && (VERDICTS as string[]).includes(v)
}

/**
 * The parts of a situation that make it countable across families.
 *
 * Justin's example is "early morning, age 8, will not come off the TV". That is
 * not a topic, it is a combination, and free text cannot be counted. Age band
 * comes from the child, the rest comes from DiGi at the time it schedules the
 * follow up.
 */
export type Situation = {
  topic: string | null
  time_band: TimeBand | null
  trigger: string | null
}

/**
 * When in the day it happens.
 *
 * Kept as a small closed list because the whole point is that two families'
 * mornings land in the same bucket. Free text would give us "before school",
 * "the school run" and "mornings" as three separate patterns with one row each.
 */
export const TIME_BANDS = ['morning', 'after_school', 'evening', 'bedtime', 'weekend', 'any'] as const
export type TimeBand = (typeof TIME_BANDS)[number]

export function isTimeBand(v: unknown): v is TimeBand {
  return typeof v === 'string' && (TIME_BANDS as readonly string[]).includes(v)
}

/** Trim a model supplied trigger to something short enough to cluster on. */
export function cleanTrigger(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.replace(/\s+/g, ' ').trim()
  return t ? t.slice(0, 120) : null
}

export type OutcomeRow = {
  id: string
  suggestion: string
  verdict: Verdict | null
  topic: string | null
  time_band: string | null
  trigger: string | null
  parent_note: string | null
  created_at: string
  answered_at: string | null
}

/**
 * What this family has already tried, so a second suggestion is not the first.
 *
 * The "no" rows lead, because those are the ones that must not be repeated. A
 * guide that suggests the thing you already told it failed is worse than one
 * with no memory at all, since the first is actively not listening.
 */
export async function getTriedAlready(
  supabase: SupabaseClient,
  userId: string,
  limit = 6,
): Promise<string> {
  const { data } = await supabase
    .from('digi_outcomes')
    .select('suggestion, verdict, trigger, answered_at')
    .eq('user_id', userId)
    .not('verdict', 'is', null)
    .order('answered_at', { ascending: false })
    .limit(limit)

  const rows = (data ?? []) as { suggestion: string; verdict: Verdict; trigger: string | null }[]
  if (rows.length === 0) return ''

  const say = (v: Verdict) => (v === 'worked' ? 'worked' : v === 'partly' ? 'helped a bit' : 'did not work')

  return '\n\nWHAT THIS FAMILY HAS ALREADY TRIED, and what they told us happened. This is their own verdict, so treat it as settled rather than something to talk them out of. Never suggest again anything marked as not working, unless you say plainly that you are suggesting it differently and why. Build on what worked:\n' +
    rows.map(r => `- ${r.trigger ? `[${r.trigger}] ` : ''}${r.suggestion} → ${say(r.verdict)}`).join('\n')
}

/**
 * Across families: what has actually been rated for a situation like this one.
 *
 * De-identified by construction. Only the shape and the verdict are read, never
 * parent_note, which is a parent's own words about their own child. Same rule
 * that governs rebuildWisdom.
 *
 * A suggestion needs THREE verdicts before it can be offered as something that
 * works elsewhere. Two is a coincidence with a plural, and the whole brain is
 * built to avoid dressing an anecdote as a pattern.
 */
const MIN_VERDICTS = 3

export async function getRatedForSituation(
  supabase: SupabaseClient,
  ageBand: string | null,
  topic: string | null,
  timeBand: string | null,
  limit = 3,
): Promise<string> {
  if (!topic) return ''

  let query = supabase
    .from('digi_outcomes')
    .select('suggestion, verdict, age_band, time_band')
    .eq('topic', topic)
    .not('verdict', 'is', null)
    .limit(400)
  if (timeBand && timeBand !== 'any') query = query.eq('time_band', timeBand)

  const { data } = await query
  const rows = (data ?? []) as { suggestion: string; verdict: Verdict; age_band: string | null }[]
  if (rows.length === 0) return ''

  // Group by the suggestion itself. Two families will never phrase a suggestion
  // identically, but DiGi wrote these, not the parents, so near duplicates are
  // the norm rather than the exception. Lowercased and squashed is enough here;
  // anything cleverer belongs in the clustering pass, not in a retrieval path
  // that runs on every message.
  const groups = new Map<string, { text: string; worked: number; partly: number; no: number; sameAge: number }>()
  for (const r of rows) {
    const key = r.suggestion.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90)
    if (!key) continue
    const g = groups.get(key) ?? { text: r.suggestion, worked: 0, partly: 0, no: 0, sameAge: 0 }
    g[r.verdict] += 1
    if (ageBand && r.age_band === ageBand) g.sameAge += 1
    groups.set(key, g)
  }

  const ranked = [...groups.values()]
    .map(g => ({ g, total: g.worked + g.partly + g.no }))
    .filter(x => x.total >= MIN_VERDICTS)
    // Success rate, with a partly counting half. Then same age families as the
    // tie break, because a thing that works for eight year olds is not a thing
    // that works for fourteen year olds.
    .map(x => ({ ...x, rate: (x.g.worked + x.g.partly * 0.5) / x.total }))
    .sort((a, b) => b.rate - a.rate || b.g.sameAge - a.g.sameAge)
    .filter(x => x.rate > 0.5)
    .slice(0, limit)

  if (ranked.length === 0) return ''

  return '\n\nRATED BY OTHER FAMILIES for a situation like this one. These are things we suggested to families in the same spot who then told us how it went, ordered by how often it helped. Offer the closest one FIRST when it genuinely fits, in your own words, as a place to start and never as a rule. Never quote the numbers, never mention other families by any detail, and if it does not fit the question, ignore it entirely and answer normally:\n' +
    ranked.map(x => `- ${x.g.text}`).join('\n')
}
