import type { SupabaseClient } from '@supabase/supabase-js'
import { getStarLessonByHomeCode } from '@/lib/quests/star-lesson-catalogue'

// THE HOME CODE, IN ONE PLACE.
//
// The code printed on the parent note a class lesson sends home (migration
// 230). Two doors read it: the card at the foot of the lessons page, and
// /home-code/[code], where the QR on the parent note lands. One normaliser,
// one lookup, one write, so a code that works on paper works at both.
//
// WHAT A CODE RECORDS, SINCE 12 OCTOBER 2026 (sync plan B, migration 373).
// It used to write a school_lesson completion with passed: true. School
// lessons never get lesson_pass_by rows, so the legacy credit rule counted it:
// the module showed as passed, counted toward the stage, dropped off the
// child's list, and a later real pass at home lost its tick. The code is the
// same for every school every year, so one photo in a parents' group passed
// the lesson for anyone, and a code with no child credited every child in
// the house.
//
// Justin decided on 9 October 2026: a class lesson's home code records "met
// in class", and only the child's own check at home ticks the passport. So a
// code writes one lesson_coverage row (child, module, source home_code,
// date) and nothing else. It ticks nothing and pays nothing until PR 5's
// child only check questions exist; until then it is the record the card
// shows and the chip the child's list will carry.

/** The cookie that carries a scanned code through the starter pack (sync plan B). */
export const HOME_CODE_COOKIE = 'gc_home_code'
/** A book bag can sit by the door for a while. */
export const HOME_CODE_COOKIE_SECONDS = 30 * 24 * 60 * 60

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

export const BAD_CODE = 'That code does not look right. It is four letters or numbers, like HOME 7K3F.'

export type Coverage =
  | { ok: true; lessonId: string; moduleId: string; title: string; yearBand: string | null; already: boolean }
  | { ok: false; status: number; error: string }

/**
 * Record that this child's class met the lesson behind a home code.
 *
 * Whose record it lands on is checked, never trusted: the child must be the
 * signed in parent's own. A code with no child is refused rather than
 * written to the household, because a household row was exactly how one
 * code used to credit every child in the house. The write is idempotent on
 * (child, module, source), and a second entry of the same code says so
 * rather than doubling anything.
 */
export async function recordCoverage(
  supabase: SupabaseClient,
  admin: SupabaseClient,
  userId: string,
  childId: string | null | undefined,
  code: string,
): Promise<Coverage> {
  const homeCode = normaliseHomeCode(code)
  if (!homeCode) return { ok: false, status: 400, error: BAD_CODE }
  if (typeof childId !== 'string' || !childId) {
    return { ok: false, status: 400, error: 'Choose which child this code is for.' }
  }

  // Exact match or silence, like the verify page: a wrong code learns only
  // that it is wrong. The admin client for the catalogue read: the content
  // tables revoked anon in migration 275, and this is a signed in parent
  // reading one lesson title, never anything about anybody else.
  const lesson = await getStarLessonByHomeCode(admin, homeCode)
  if (!lesson) return { ok: false, status: 404, error: 'No lesson found for that code. Check it against the sheet and try again.' }
  const moduleId = (lesson as { module_id?: string | null }).module_id ?? null
  if (!moduleId) return { ok: false, status: 404, error: 'No lesson found for that code. Check it against the sheet and try again.' }

  const { data: owned } = await supabase
    .from('children').select('id').eq('id', childId).eq('parent_id', userId).maybeSingle()
  if (!owned) return { ok: false, status: 404, error: 'Choose which child this code is for.' }

  const { data: existing } = await supabase
    .from('lesson_coverage')
    .select('id')
    .eq('child_id', childId)
    .eq('module_id', moduleId)
    .eq('source', 'home_code')
    .maybeSingle()

  if (!existing) {
    const { error } = await supabase
      .from('lesson_coverage')
      .insert({ user_id: userId, child_id: childId, module_id: moduleId, source: 'home_code' })
    // 23505 is the unique row landing from a double tap: already recorded,
    // which is the same answer as `existing`.
    if (error && error.code !== '23505') return { ok: false, status: 500, error: error.message }
  }

  return {
    ok: true,
    lessonId: lesson.id,
    moduleId,
    title: lesson.title,
    yearBand: (lesson as { year_band?: string | null }).year_band ?? null,
    already: !!existing,
  }
}
