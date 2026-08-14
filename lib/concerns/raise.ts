import type { SupabaseClient } from '@supabase/supabase-js'
import { logConcernEvent, type ConcernLinkType } from './events'

// RAISING A WORRY, ONCE, THE SAME WAY EVERYWHERE.
//
// Five routes raise concerns: the moments timeline, Right now, Right now
// custom, the wellbeing check in and DiGi. Each wrote its own upsert, and the
// audit on 14 August 2026 found the copies had drifted in two ways that both
// cost the family real history.
//
// ONE, THE COUNT RESET TO 1. app/api/digi/route.ts read its "have we seen this
// before" from `liveConcerns`, which is the DISPLAY list: filtered to open and
// improving, ordered by recency and capped at six. A concern the family had
// resolved, or their seventh oldest, is simply not in it. So `prior` came back
// undefined and the upsert wrote times_flagged: 1 over a row that said 4, and
// status 'open' over a row that said resolved.
//
// times_flagged is not decoration. lib/digi/wisdom.ts calls a concern STUCK at
// three or more, lib/alerts/suggestions.ts gates on the same number,
// lib/pathway/recommend.ts and journey.ts both read it, and
// IsItWorkingReport orders by it. Resetting it to 1 tells every one of those
// that a worry raised five times is brand new, which is precisely backwards:
// the fifth raise is the one that most deserves a different approach.
//
// TWO, THE PRIOR LOOKUP IGNORED THE CHILD. Migration 194 moved the key to
// (user_id, child_id, slug), so a lookup filtered only on slug can now match a
// SIBLING's row and copy their count and status onto this child's.
//
// So: one function, reading the actual row by the actual key.

export type RaiseConcernInput = {
  slug: string
  label: string
  /** Where it came from, for the concerns.source column. */
  source: 'moment' | 'digi' | 'rightnow' | 'checkin' | 'onboarding'
  /** What the parent had been using, for the event log. */
  linkedType?: ConcernLinkType | null
}

/** Tidy a free text slug into the kebab form the ledger uses. */
export function toSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

/**
 * Raise a worry against one child, creating it or bumping it.
 *
 * Returns the slug when it landed, null when it did not. Best effort by
 * design: the ledger must never be the reason a parent's actual request fails,
 * which is why every caller wraps it in a try and carries on.
 */
export async function raiseConcern(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  input: RaiseConcernInput,
): Promise<string | null> {
  const slug = toSlug(input.slug)
  const label = input.label.trim().slice(0, 200)
  if (!slug || !label) return null

  try {
    // THE ACTUAL ROW, by the actual key. Not a display list, not slug alone.
    // A row the family resolved months ago is still the row this raise belongs
    // to, and it carries the count that makes the next answer smarter.
    let q = supabase
      .from('concerns')
      .select('status, times_flagged')
      .eq('user_id', userId)
      .eq('slug', slug)
    q = childId ? q.eq('child_id', childId) : q.is('child_id', null)
    const { data: prior } = await q.maybeSingle()

    const { error } = await supabase.from('concerns').upsert({
      user_id: userId,
      child_id: childId,
      source: input.source,
      slug,
      label,
      // A resolved worry that comes back reopens. Anything else keeps the
      // status it had, because a raise is not a verdict on how it is going.
      status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
      times_flagged: prior ? (prior.times_flagged ?? 0) + 1 : 1,
      // THE COLUMN THAT WAKES A RESTED CONCERN. lib/checkin/today.ts rests a
      // concern scored in the top band and brings it back when last_flagged_at
      // is newer than that score. So this line is the entire "unless they raise
      // another moment, or DiGi raises it" half of that rule.
      last_flagged_at: new Date().toISOString(),
    }, { onConflict: 'user_id,child_id,slug' })

    if (error) return null

    await logConcernEvent(supabase, userId, slug, {
      event: prior?.status === 'resolved' ? 'recurred' : 'flagged',
      source: input.source,
      linkedType: input.linkedType ?? null,
    })

    return slug
  } catch {
    return null
  }
}
