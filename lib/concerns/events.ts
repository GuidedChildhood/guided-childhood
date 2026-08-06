import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// The append only half of the concerns ledger. See migration 164.
//
// `concerns` still holds where a family is right now, and every existing call
// site reads it exactly as before. This writes down how they got there: one row
// each time a concern is raised, checked, resolved or comes back, never updated
// afterwards.
//
// THE RULE THIS FILE EXISTS TO ENFORCE: writing history must never break the
// thing that made history. Every function here swallows its own errors. A
// parent tapping "better" on a bedtime battle at half past nine gets their
// answer saved and their card folded whether or not the event log accepted the
// row. Losing one row of evidence is a bad day for us. Throwing an error into
// that tap is a bad day for them, and they are the reason the row exists.

export type ConcernEventName =
  | 'flagged'
  | 'checked'
  | 'resolved'
  | 'recurred'
  | 'reopened'

export type ConcernLinkType = 'script' | 'lesson' | 'digi' | 'moment' | 'rightnow'

export type ConcernEventInput = {
  event: ConcernEventName
  /** 0 fine to 10 the worst it gets. Always optional, never blocking. */
  severity?: number | null
  /** Asked once at resolution: looking back, how bad was it at the start. */
  severityAtStart?: number | null
  answer?: 'better' | 'same' | 'hard' | null
  source?: string | null
  linkedType?: ConcernLinkType | null
  linkedId?: string | null
}

/** Keeps a stray 11 or a string out of a smallint column. */
function clean(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  if (rounded < 0 || rounded > 10) return null
  return rounded
}

/**
 * True when a value is a usable 0 to 10 rating. Exported so routes can reject a
 * bad payload explicitly rather than silently storing null and looking fine.
 */
export function isSeverity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10
}

/**
 * Write one event against a concern the caller already knows the id of.
 *
 * Returns true when the row landed, so a caller that genuinely wants to know can
 * ask, but nothing in the app should branch on it.
 */
export async function logConcernEventById(
  supabase: SupabaseClient,
  userId: string,
  concernId: string,
  input: ConcernEventInput,
): Promise<boolean> {
  try {
    const { error } = await supabase.from('concern_events').insert({
      concern_id: concernId,
      user_id: userId,
      event: input.event,
      severity: clean(input.severity),
      severity_at_start: clean(input.severityAtStart),
      answer: input.answer ?? null,
      source: input.source ?? null,
      linked_type: input.linkedType ?? null,
      linked_id: input.linkedId ?? null,
    })
    return !error
  } catch {
    return false
  }
}

/**
 * Write one event against a concern identified the way the rest of the app
 * identifies them, by slug.
 *
 * Most call sites have just upserted on (user_id, slug) and do not hold the id,
 * so this looks it up. If the concern is not there we do nothing: an event with
 * no concern to hang off is worse than no event, and this is not the place to
 * discover that something upstream failed.
 */
export async function logConcernEvent(
  supabase: SupabaseClient,
  userId: string,
  slug: string,
  input: ConcernEventInput,
): Promise<boolean> {
  try {
    const { data: concern } = await supabase
      .from('concerns')
      .select('id')
      .eq('user_id', userId)
      .eq('slug', slug)
      .maybeSingle()

    if (!concern?.id) return false
    return await logConcernEventById(supabase, userId, concern.id as string, input)
  } catch {
    return false
  }
}

/**
 * Write the same event for several slugs at once, for the check ins that upsert
 * a batch of concerns in one go.
 *
 * One lookup and one insert rather than N of each, because these run inside a
 * request a parent is waiting on.
 */
export async function logConcernEvents(
  supabase: SupabaseClient,
  userId: string,
  slugs: string[],
  input: ConcernEventInput,
): Promise<number> {
  if (slugs.length === 0) return 0
  try {
    const { data: concerns } = await supabase
      .from('concerns')
      .select('id, slug')
      .eq('user_id', userId)
      .in('slug', slugs)

    if (!concerns?.length) return 0

    const rows = concerns.map(c => ({
      concern_id: c.id as string,
      user_id: userId,
      event: input.event,
      severity: clean(input.severity),
      severity_at_start: clean(input.severityAtStart),
      answer: input.answer ?? null,
      source: input.source ?? null,
      linked_type: input.linkedType ?? null,
      linked_id: input.linkedId ?? null,
    }))

    const { error } = await supabase.from('concern_events').insert(rows)
    return error ? 0 : rows.length
  } catch {
    return 0
  }
}
