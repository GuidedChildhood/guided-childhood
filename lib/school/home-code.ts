import type { SupabaseClient } from '@supabase/supabase-js'
import { starLessonIdsByModule } from '@/lib/quests/star-lesson-catalogue'
import { placementOf, pageModules } from '@gc/shared/passport-areas'
import type { PassportStage } from '@gc/shared/passport-stages'

// THE HOME CODE, IN ONE PLACE.
//
// The code printed on the parent note a class lesson sends home (migration
// 230). It used to be normalised inside the redeem route and nowhere else,
// which was fine while that route was the only door. There are two doors
// now: the card at the foot of the lessons page, and /home-code/[code],
// where the QR on the parent note lands. One normaliser, one lookup, so a
// code that works on paper works at both.

/**
 * Crockford normalisation, the same forgiveness as /verify: case never
 * matters, I and L read as 1, O reads as 0, the HOME prefix is optional.
 * Returns null for anything that is not four Crockford characters.
 */
export function normaliseHomeCode(raw: string): string | null {
  const cleaned = raw
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/^HOME/, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
  if (!/^[0-9A-HJKMNP-TV-Z]{4}$/.test(cleaned)) return null
  return `HOME-${cleaned}`
}

/**
 * The four characters on their own, for showing a code back to a parent.
 * Re-exported from shared so the schools app's QR and this app's landing
 * page can never disagree about what the prefix is.
 */
export { shortHomeCode as shortCode } from '@gc/shared/home-code-link'

export type PassportFill = {
  /** The school module the code credits, e.g. ks2-09. */
  moduleId: string
  /** Which of the five passport pages it fills, or null when it fills none. */
  placement: PassportStage | null
  /** Modules on that page this child had already done, BEFORE this code. */
  before: string[]
}

/**
 * What the passport page looked like before this code landed, so the card at
 * home can draw the fill from there to here rather than just asserting it.
 *
 * `lesson_completions` stores lesson uuids, not module ids, so the page's
 * modules are resolved to ids first (through the catalogue, the parent app's
 * only door to school_lessons) and the completions read against those.
 *
 * Fails soft to an empty `before`. An animation that starts from zero is a
 * smaller wrong than a card that will not render, and the numbers on the
 * page come from `before` plus today either way.
 */
export async function passportFillFor(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  userId: string,
  childId: string | null,
  moduleId: string,
): Promise<PassportFill> {
  const placement = placementOf(moduleId)
  const stage = placement && placement !== 'after' ? placement : null
  if (!stage) return { moduleId, placement: null, before: [] }

  try {
    const ids = pageModules(stage).map(m => m.moduleId).filter(id => id !== moduleId)
    if (ids.length === 0) return { moduleId, placement: stage, before: [] }

    // The admin client for the catalogue read: the content tables revoked
    // anon in migration 275, and this is a signed in parent reading lesson
    // titles, never anything about anybody else.
    const byLessonId = await starLessonIdsByModule(admin, ids)
    if (byLessonId.size === 0) return { moduleId, placement: stage, before: [] }

    // The completions, as the parent: their own rows, under their own RLS.
    let q = supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('lesson_source', 'school_lesson')
      .in('lesson_id', [...byLessonId.keys()])
    q = childId ? q.eq('child_id', childId) : q.is('child_id', null)
    const { data: done } = await q

    const before = (done ?? [])
      .map(d => byLessonId.get(d.lesson_id as string))
      .filter((v): v is string => !!v)
    return { moduleId, placement: stage, before }
  } catch {
    return { moduleId, placement: stage, before: [] }
  }
}
