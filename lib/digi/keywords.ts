import type { SupabaseClient } from '@supabase/supabase-js'

// The routing vocabulary, read from the database so the Insights board can add
// to it without a deploy (migration 150, non-negotiable 6).
//
// THE WHOLE POINT IS THAT THIS COSTS NOTHING ON THE CLOCK. It exists because
// classifyLane cost Justin 1332ms on a message about a child and the
// television, so a fix that adds its own round trip would be no fix at all.
//
// Two things keep it free:
//
// 1. The route reads it inside the FIRST gather round, which is already
//    thirteen queries running in parallel, so it hides behind the slowest one.
// 2. This module level cache means most requests never query at all. A
//    serverless instance handles many requests, and the vocabulary changes when
//    a founder taps a button, which is to say almost never.

let cache: { words: string[]; at: number } | null = null

// Five minutes. Long enough that the query is rare, short enough that a word
// added from the board is live while Justin is still looking at the board.
const TTL_MS = 5 * 60 * 1000

/**
 * The active keyword list, or an empty array if it cannot be read.
 *
 * EMPTY IS A SAFE ANSWER, and that is deliberate. fastLane still has its built
 * in list, so an empty return means routing carries on exactly as it did before
 * migration 150 rather than breaking. A routing hint must never be the reason a
 * parent gets no reply.
 */
export async function loadLaneKeywords(supabase: SupabaseClient): Promise<string[]> {
  const now = Date.now()
  if (cache && now - cache.at < TTL_MS) return cache.words

  const { data, error } = await supabase
    .from('digi_lane_keywords')
    .select('word')
    .eq('active', true)

  // A failed read and a genuinely empty table are different things, and only
  // one of them should poison the cache. Caching a failure would mean one blip
  // costs five minutes of slower routing for everybody on this instance.
  if (error) return cache?.words ?? []

  const words = (data ?? []).map(r => r.word as string).filter(Boolean)
  cache = { words, at: now }
  return words
}

/** Drop the cache so a word added from the board is live on the next message. */
export function clearLaneKeywordCache(): void {
  cache = null
}
