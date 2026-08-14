import type { SupabaseClient } from '@supabase/supabase-js'

// HAS THIS FAMILY ALREADY SAID NO TO A CHILD DEVICE?
//
// Justin, 14 August 2026: "if a parent selects that they want to co view and
// use printable star charts instead of share device we don't want to keep
// telling them to share or set up child device. But later in we just need to
// make them aware when they get a phone that we can share child's app."
//
// THE PROBLEM THIS FILE EXISTS TO END. The answer to that question was already
// recorded in three different columns, and each one was read by almost
// nothing:
//
//   children.no_phone         read in ONE file, app/(dashboard)/dashboard/quests/page.tsx
//   children.use_mode         read for display in three components
//   profiles.handover_choice  read in ONE page, the Home overlay gate
//
// Against that, FOURTEEN surfaces ask the parent to set up the child's device:
// a setup step, a welcome card, the coverage card on Home, a push from the
// settings nudge cron, a day fourteen email, the agreement banner, the
// passport TO DO line, the stage readiness block, two cards in the jobs
// manager, the quests banner and more. Not one consulted no_phone or
// handover_choice. So a parent could tap "Olga has no phone, keep it on the
// fridge", silence a single card, and go on receiving a push notification
// telling them Olga can run her own side now.
//
// The fix is not another flag. It is ONE predicate that every surface asks,
// reading the flags that already exist. A fifteenth surface added next month
// gets this for free if it asks, and the reason it will ask is that this is
// now the only way to find out.
//
// WHAT COUNTS AS SETTLED, and why each one:
//
//   no_phone            The parent said it in as many words. Unambiguous.
//   handover_choice     'paper' is the family answering the login overlay with
//     = 'paper'         "We do it on paper". Family level rather than per
//                       child, which is a limitation of migration 103 and not
//                       something to paper over here: a family that answers it
//                       is answering for the household.
//
// WHAT DOES NOT COUNT, and this is the important one:
//
//   use_mode = 'coview' does NOT settle it on its own. Co-view means the app
//   is opened on the grown up's device, which is the right answer for a six
//   year old and says nothing about whether a fourteen year old should have
//   their own. Worse, use_mode is nullable and every reader treats null the
//   same as coview-by-age, so a deliberate co-view is indistinguishable in the
//   data from a question nobody has answered. Treating it as a refusal would
//   silence the offer for every under eleven in the product, including the
//   families who simply have not got there yet.
//
//   The one exception is co-view CHOSEN for a child old enough to have been
//   offered their own: that is a parent actively picking together over their
//   own device, and it is the closest thing to Justin's "selects that they
//   want to co view". So it settles only above the youngest band.

/** Age bands where the child app is only ever offered as co-view anyway. */
const YOUNGEST = new Set(['4-7'])

export type ChildHandover = {
  id: string
  name: string | null
  ageBand: string | null
  noPhone: boolean
  noPhoneAt: string | null
  useMode: string | null
}

export type FamilyHandover = {
  /** 'paper' | 'linked' | null, from profiles.handover_choice. Family level. */
  choice: string | null
  children: ChildHandover[]
}

/** Has this family settled on no child device, for this child? */
export function isSettled(family: FamilyHandover, child: ChildHandover): boolean {
  if (family.choice === 'paper') return true
  if (child.noPhone) return true
  // Co-view chosen for a child old enough to have been offered their own.
  if (child.useMode === 'coview' && child.ageBand && !YOUNGEST.has(child.ageBand)) return true
  return false
}

/** Has the whole family settled? True only when every child has. */
export function familySettled(family: FamilyHandover): boolean {
  if (family.choice === 'paper') return true
  if (family.children.length === 0) return false
  return family.children.every(c => isSettled(family, c))
}

/**
 * The children who could still be offered a device of their own: old enough,
 * not settled, and not already linked.
 *
 * `linked` is the set of child ids that already have a kid_links row, which
 * every caller already has to hand because it is what they were checking
 * before they had this.
 */
export function offerableChildren(family: FamilyHandover, linked: Set<string>): ChildHandover[] {
  return family.children.filter(c =>
    c.ageBand && !YOUNGEST.has(c.ageBand)
    && !linked.has(c.id)
    && !isSettled(family, c)
    && !!c.name && c.name !== 'Your child'
  )
}

// ── THE LATER RE-OFFER ──────────────────────────────────────────────────────
//
// "But later in we just need to make them aware when they get a phone that we
// can share child's app."
//
// The word doing the work is LATER. Not never, which is what silencing every
// surface would otherwise mean, and not soon, which is the nagging we are
// removing. A child who had no phone at nine very often has one at eleven, and
// the parent who told us no in year four has no reason to remember that this
// product can put jobs on it.
//
// SIX MONTHS, and only once per stretch of six months. It is long enough that
// it can never read as the same nag returning, and short enough to catch the
// birthday or the start of secondary school that changed the answer. A parent
// who says no again simply resets their own clock by tapping it away.
//
// The other trigger is the one that actually predicts a phone: the child
// moving up an age band. That is handled by the caller, which knows the band,
// rather than by a date comparison here.
export const REOFFER_AFTER_DAYS = 182

/**
 * Children whose "no device" answer is old enough to be worth asking about
 * once more. Never children who were never asked, and never the youngest band,
 * who are on paper by design rather than by decision.
 */
export function reofferChildren(family: FamilyHandover, now = Date.now()): ChildHandover[] {
  return family.children.filter(c => {
    if (!c.noPhone || !c.noPhoneAt) return false
    if (!c.ageBand || YOUNGEST.has(c.ageBand)) return false
    if (!c.name || c.name === 'Your child') return false
    const days = (now - new Date(c.noPhoneAt).getTime()) / 86_400_000
    return days >= REOFFER_AFTER_DAYS
  })
}

/**
 * One read for the whole family, shaped for every caller above.
 *
 * Fails soft on both halves. Before migration 193 the no_phone_at column is
 * simply not there, and a page that already works must not start throwing
 * because a re-offer clock is missing: it degrades to "settled, never
 * re-offered", which is the safe direction. Nagging a family who said no is
 * the failure worth avoiding; a late re-offer is not.
 */
export async function getFamilyHandover(
  supabase: SupabaseClient,
  userId: string,
): Promise<FamilyHandover> {
  const [profileRes, childrenRes] = await Promise.all([
    supabase.from('profiles').select('handover_choice').eq('id', userId).maybeSingle(),
    supabase.from('children').select('id, name, age_band, no_phone, no_phone_at, use_mode').eq('parent_id', userId),
  ])

  // Before migration 193 the select above fails as a whole on the unknown
  // column, so fall back to the columns that have existed since 105.
  let rows = childrenRes.data as Record<string, unknown>[] | null
  if (childrenRes.error) {
    const { data } = await supabase
      .from('children').select('id, name, age_band, no_phone, use_mode').eq('parent_id', userId)
    rows = data as Record<string, unknown>[] | null
  }

  return {
    choice: (profileRes.data?.handover_choice as string | null) ?? null,
    children: (rows ?? []).map(r => ({
      id: r.id as string,
      name: (r.name as string | null) ?? null,
      ageBand: (r.age_band as string | null) ?? null,
      noPhone: r.no_phone === true,
      noPhoneAt: (r.no_phone_at as string | null) ?? null,
      useMode: (r.use_mode as string | null) ?? null,
    })),
  }
}
