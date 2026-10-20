import type { SupabaseClient } from '@supabase/supabase-js'
import { matchScripts, type MatchableScript } from '@/lib/digi/script-match'
import { MISSIONS } from '@/lib/planet/missions'
import type { StageId } from '@/lib/pathway/progress'
import type { FreeScript } from '@/lib/muse/connector'

const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

type Row = FreeScript & MatchableScript & { stage_id: StageId }

// The Planet Friends mission prompts are scripts rows, free because the planet
// is on every child link (migration 253), but they are "talk about the rocket
// you built", not advice. Checked against the live library on 20 October
// 2026: "how do I talk to my son about a scary video" matched the satellite
// dish mission. They are never an answer to a parent's question.
const MISSION_SCRIPTS = new Set(MISSIONS.map(m => m.scriptOrder))

// The words a parent uses to ASK, which say nothing about WHICH script fits.
// "My 9 year old keeps asking for Roblox" matched "Someone asking to meet in
// person" on the word asking alone, the worst possible pairing for a gaming
// question. Stripped here rather than in the shared matcher, because DiGi in
// the app has a conversation around the match and Muse has nothing but it.
const ASKING_WORDS = /\b(asking|asks|asked|ask|keeps|keep|kept|talk|talking|start|started|where|what|words|tell|told|year|years|old|son|daughter|kid|kids|children)\b/gi

/**
 * The free scripts that fit a parent's words, best first.
 *
 * Free only, by the query rather than by trust: a paid script's say_this is the
 * product, and an open API that returned it would hand the library to anyone
 * patient enough to ask three hundred questions. The rarity matcher is the one
 * DiGi uses (lib/digi/script-match.ts), so Muse and the app pick alike.
 *
 * Matched across the whole free set, best score first, and the child's stage
 * only drops matches more than one stage away. Both stricter versions were
 * tried on the live library and were worse: matching inside one stage makes
 * every shared word look rare across twenty rows, and putting same stage
 * first pushed "The Year 6 phone plan" below a room script for a parent
 * asking about a phone for secondary school.
 */
export async function findFreeScripts(
  admin: SupabaseClient,
  query: string,
  stage: StageId | null,
  limit = 3,
): Promise<FreeScript[]> {
  const { data } = await admin
    .from('scripts')
    .select('id, sort_order, stage_id, title, situation, say_this, not_this, category')
    .eq('is_free', true)
  const rows = ((data ?? []) as Row[]).filter(r => !MISSION_SCRIPTS.has(r.sort_order))
  if (rows.length === 0) return []

  const words = query.replace(ASKING_WORDS, ' ')
  const matched = matchScripts(rows, words, limit * 2) as Row[]
  const at = stage ? STAGE_ORDER.indexOf(stage) : -1
  const near = at < 0 ? matched : matched.filter(r => Math.abs(STAGE_ORDER.indexOf(r.stage_id)-at) <= 1)
  const ordered = near.length > 0 ? near : matched

  return ordered.slice(0, limit).map(r => ({ id: r.id, title: r.title, situation: r.situation, say_this: r.say_this, not_this: r.not_this }))
}
