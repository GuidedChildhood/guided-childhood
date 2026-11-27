import type { SupabaseClient } from '@supabase/supabase-js'

// THE SCHOOL PASS (Justin, 27 November 2026; plan plans/2026-11-27-school-pass.md).
//
// When a school pays for the licence, its families (those who came in through
// the school's link, migration 353) keep part of the product free after the
// four free days, for as long as the licence runs:
//
//   lessons, the homework helper, the star chart and the school calendar: free
//   scripts and DiGi: a taste, ten of each in total, then the membership
//   everything else: the membership, exactly as for every other family
//
// The pass is live when the school's link carries a licensed_until date that
// has not passed (migration 408). Justin sets it on the admin schools page
// when the invoice is paid, so a newsletter link alone still grants nothing.
//
// The path rule and the numbers are pure and tested (school-pass.test.ts).
// The two database questions go through definer functions so the parent's own
// session can ask them while school_links stays service role only.

export const SCHOOL_PASS_SCRIPTS = 10
export const SCHOOL_PASS_DIGI = 10

// What a pass opens, as path prefixes. Home is there so a pass family lands
// somewhere; children and setup so they can add a child; scripts and DiGi so
// the taste can be reached (each item is then metered). Every other dashboard
// path still meets the membership, and the upgrade page says what it opens.
const PASS_PREFIXES = [
  '/dashboard/lessons',
  '/dashboard/learning',
  '/dashboard/homework',
  '/dashboard/quests',
  '/dashboard/school',
  '/dashboard/printables',
  '/dashboard/scripts',
  '/dashboard/digi',
  '/dashboard/setup',
] as const

/** Does the school pass open this dashboard path? Pure, so it is tested. */
export function schoolPassOpens(pathname: string): boolean {
  if (pathname === '/dashboard') return true
  return PASS_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

/** Is a pass that runs to this date live today? Both YYYY-MM-DD. Pure. */
export function passIsLive(untilIso: string | null | undefined, todayIso: string): boolean {
  if (!untilIso || !/^\d{4}-\d{2}-\d{2}/.test(untilIso)) return false
  return untilIso.slice(0, 10) >= todayIso.slice(0, 10)
}

/**
 * Does this parent hold a live school pass? Works with the parent's own
 * client or the service role (the child's link pages read as the service
 * role). Any failure, including a database without migration 408, is no pass,
 * which is the old behaviour: nothing is opened by an error.
 */
export async function hasSchoolPass(client: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data, error } = await client.rpc('school_pass_until', { p_user: userId })
    if (error) return false
    return passIsLive(typeof data === 'string' ? data : null, new Date().toISOString())
  } catch {
    return false
  }
}

/**
 * May this parent use one more script or DiGi message on the pass? claim adds
 * it to their ten; peek only asks (for lists, which must not spend the taste).
 * Needs the parent's own session: the database reads auth.uid().
 */
export async function useSchoolPass(
  client: SupabaseClient,
  kind: 'script' | 'digi',
  ref: string,
  claim: boolean,
): Promise<boolean> {
  try {
    const { data, error } = await client.rpc('school_pass_use', {
      p_kind: kind,
      p_ref: ref,
      p_cap: kind === 'script' ? SCHOOL_PASS_SCRIPTS : SCHOOL_PASS_DIGI,
      p_claim: claim,
    })
    if (error) return false
    return data === true
  } catch {
    return false
  }
}
