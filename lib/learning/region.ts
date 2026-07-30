import type { Region } from './holidays'

// Which school holiday calendar a family keeps.
//
// One read, one place. The alternative was threading a region argument through
// the forty five call sites that touch holiday behaviour, most of which are
// two levels below anything that knows which family it is. That change would
// have been large, mechanical, and exactly the kind where one missed site fails
// silently: a US family would see Thanksgiving honoured on one screen and
// ignored on the next, which is worse than being uniformly wrong.
//
// So the region is fetched where the family IS known, once per request, and
// passed to the two functions that actually consume it. Everything else keeps
// the 'uk' default, which is correct for every family on the platform today and
// is the documented fallback rather than an accident.

export const DEFAULT_REGION: Region = 'uk'

export function isRegion(v: unknown): v is Region {
  return v === 'uk' || v === 'us'
}

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * The family's school calendar, defaulting to England.
 *
 * Fails soft in both directions on purpose. A database still short of migration
 * 129 has no column, and a profile row can be missing on a brand new account;
 * neither is a reason to break a page whose subject is a child's screen time.
 * The default is not a guess, it is where every family on the platform is.
 */
export async function getFamilyRegion(
  supabase: Client,
  userId: string,
): Promise<Region> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('school_region')
      .eq('id', userId)
      .maybeSingle()
    if (error || !data) return DEFAULT_REGION
    const v = (data as { school_region?: unknown }).school_region
    return isRegion(v) ? v : DEFAULT_REGION
  } catch {
    return DEFAULT_REGION
  }
}

/** What a parent calls it, for the settings control. */
export const REGION_LABEL: Record<Region, string> = {
  uk: 'England and Wales',
  us: 'United States',
}

/**
 * The honest note under the picker.
 *
 * US spring break moves by two months between districts, which is not a detail
 * we can quietly round off: a family told their break is in March when it is in
 * April would find the app relaxed on the wrong fortnight. Saying so is better
 * than being confidently wrong, and it is the same reason every window in
 * holidays.ts is drawn wide and every piece of copy says "around".
 */
export const REGION_NOTE: Record<Region, string> = {
  uk: 'Half terms and the summer break, roughly as most English schools take them. Local authorities differ by a few days.',
  us: 'Summer, Thanksgiving and the winter break. Spring break moves by up to two months between districts, so treat that one as a rough guide.',
}
