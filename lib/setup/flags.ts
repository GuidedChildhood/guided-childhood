import { visibleSteps, type SetupFlags, type SetupStep } from './steps'
import { getFamilyHandover, offerableChildren } from '@/lib/handover/settled'

// The setup state in one place, so the Home entry, the floating next step bar
// and the Setup Quest page read exactly the same flags and the same list.
//
// ── DONE MEANS DONE ─────────────────────────────────────────────────────────
//
// Every flag below is a record of something that HAPPENED, never of something
// being seen. That is the one rule the plan asks for by name, because it was
// broken once already: the daily practice step ticked off the page having been
// opened, and had to be fixed on 13 August 2026. The note against each flag
// says what the parent had to actually do to earn it.

type FlagClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export type SetupState = {
  flags: SetupFlags
  steps: SetupStep[]
  doneCount: number
  total: number
  complete: boolean
  current: SetupStep | null
  /**
   * This family has said no to a child device, so nothing should keep asking.
   *
   * Exposed on the state rather than kept private, because the setup path is
   * not the only thing that needs it. The coverage card on Home and the
   * welcome card both key off the same childLink flag, so handing this back
   * lets one read silence all three instead of each making its own.
   *
   * Since 14 August 2026 it also TICKS the share step rather than hiding it.
   * See the note in lib/setup/steps.ts.
   */
  handoverSettled: boolean
  /** The primary child, for the share step's two doors on the setup page. */
  child: { id: string; name: string | null } | null
}

export async function getSetupState(supabase: FlagClient, userId: string): Promise<SetupState> {
  const [child, agreement, push, kidLinks, profile, childCount] = await Promise.all([
    // ── NOT maybeSingle ON is_primary, AND THE LIVE DATA IS WHY ──────────────
    //
    // The obvious read here is .eq('is_primary', true).maybeSingle(), and it is
    // what every other caller does. On the live account it returns an ERROR and
    // no row, because FOUR of the five children carry is_primary = true: Teo and
    // three test children all called Toon. PostgREST treats more than one row as
    // a failure for single, so data comes back null and the share step would
    // have rendered "Add your child first" to a parent with five children on the
    // account.
    //
    // Nothing guarantees one primary per family. There is no unique constraint,
    // and every path that adds a child can set the flag. So this asks for the
    // list and takes the first, ordered so the answer is stable between loads
    // rather than whatever the planner hands back: a primary if there is one,
    // then oldest first.
    supabase.from('children').select('id, name, is_primary, created_at').eq('parent_id', userId)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1),
    supabase.from('family_agreements').select('id, signed_by_parent, signed_by_child')
      .eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('push_subscriptions').select('endpoint').eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('kid_links').select('child_id').eq('user_id', userId),
    supabase.from('profiles').select('home_screen_at, only_one_child_at, child_app_settled_at').eq('id', userId).maybeSingle(),
    supabase.from('children').select('id', { count: 'exact', head: true }).eq('parent_id', userId),
  ])

  // HAS THIS FAMILY ALREADY SAID NO TO A CHILD DEVICE?
  //
  // Read after the others rather than inside the Promise.all, because it is
  // allowed to fail. A handover read that throws must cost the tick, never the
  // setup page.
  let handoverSettled = false
  try {
    const family = await getFamilyHandover(supabase as Parameters<typeof getFamilyHandover>[0], userId)
    const linked = new Set((kidLinks.data ?? []).map(k => k.child_id as string))
    // Settled when nobody is left to offer it to: either every child has been
    // answered for, or the ones who have not are already linked.
    handoverSettled = offerableChildren(family, linked).length === 0 && family.children.length > 0
  } catch { /* the step simply stays open, which is the old behaviour */ }

  const flags: SetupFlags = {
    // DONE WHEN: BOTH have signed it. Not when the row exists.
    //
    // Justin, 16 August 2026: "does the agreement get saved unless both are
    // signed?" It does, and the live database is what settles it: four of the
    // six agreements on the product are signed by nobody, signed_by_parent and
    // signed_by_child both false, and every one of those families had a green
    // tick against step one.
    //
    // The row is a DRAFT. The builder writes it as clauses are chosen, which is
    // right, because losing a half built agreement because somebody closed a tab
    // would be worse than anything this fixes. What was wrong was reading the
    // draft as the deed. It is the same fault as the daily practice step ticking
    // off a page being opened, fixed on 13 August, and it landed in the one step
    // whose whole promise is "they click sign, then a big green tick".
    //
    // A signature is the only thing that makes an agreement an agreement. Both
    // of them, because a boundary one person set is a rule, and the entire
    // argument for this feature is that a boundary you both chose is not.
    agreement: !!agreement.data?.signed_by_parent && !!agreement.data?.signed_by_child,

    // DONE WHEN: a link was created for a child, OR this family answered the
    // question the other way.
    //
    // The second half is the change of 14 August 2026. "No phone, keep it on
    // the fridge" is an ANSWER, and a step whose question has been answered is
    // finished. Leaving it open turned a deliberate choice into a permanent
    // reproach, which is the exact thing lib/handover/settled.ts exists to
    // stop. Nothing is lost by closing it: the six month re-offer in that file
    // is what tells a family later that the child app is there when a phone
    // eventually arrives.
    // The third door, added 17 August 2026. A kid_links row means the code was
    // genuinely made; handoverSettled means they said there is no device. This
    // is the case neither covered: a parent who showed their child the code, or
    // who will co-view on their own phone, and now wants to get on.
    //
    // Without it the step could not be closed at all from the step itself, which
    // is the un-tickable step this product has now had to fix three times. See
    // migration 204.
    childLink: (kidLinks.data ?? []).length > 0
      || handoverSettled
      || !!(profile.data as { child_app_settled_at?: string | null } | null)?.child_app_settled_at,

    // DONE WHEN: the app has been opened from the home screen, OR reminders
    // are on. Either half genuinely delivers the step, so either half finishes
    // it.
    //
    // Not both, deliberately. Requiring both would strand a parent on a laptop
    // and a parent who has declined notifications at two of three for ever,
    // which is the un-tickable step that lib/handover/settled.ts was written
    // to end. And on iPhone the two are not independent anyway: Apple only
    // allows web push once the app IS on the home screen, so a push
    // subscription there is proof of both.
    //
    // home_screen_at is written by the app being opened in standalone mode,
    // never by a parent tapping to say they did it. See migration 197.
    homeScreen: !!push.data || !!(profile.data as { home_screen_at?: string | null } | null)?.home_screen_at,

    // DONE WHEN: there is more than one child, OR the parent said there is only
    // the one.
    //
    // The same two door shape as the share step, for the same reason. Most
    // families have one child, and a step that only a second child could tick
    // would leave most of them permanently at three of four, told they are
    // incomplete for having the family they have.
    //
    // only_one_child_at is a timestamp rather than a boolean so it can tell a
    // no from a not asked, and so the answer can be revisited later. Migration
    // 198.
    children: (childCount.count ?? 0) > 1
      || !!(profile.data as { only_one_child_at?: string | null } | null)?.only_one_child_at,
  }

  const steps = visibleSteps()
  const doneCount = steps.filter(s => flags[s.key]).length
  const current = steps.find(s => !flags[s.key]) ?? null

  return {
    flags,
    steps,
    doneCount,
    total: steps.length,
    complete: current === null,
    current,
    handoverSettled,
    child: (() => {
      const row = (child.data ?? [])[0]
      return row ? { id: row.id as string, name: (row.name as string | null) ?? null } : null
    })(),
  }
}

// Done means every child on the account has a birthday, not just the primary
// one. A second child with no date is a second learning sheet that cannot be
// built.
//
// KEPT AFTER THE BIRTHDAY STEP WAS CUT (14 August 2026), because it was never
// really about setup. Signup asks for month and year now, so this is true for
// every new family and the step had nothing to say. The predicate itself is
// still the honest answer to "can we work out this child's school year", which
// is a question the learning sheets and lib/learning/term.ts still ask.
//
// It reads done in two cases where we genuinely have nothing to ask for: an
// account with no children yet, which onboarding is about to fix anyway, and an
// error on the read. That second one matters. The column arrives with migration
// 083, and on a deploy where it has not run the select fails, so failing to
// "done" is the difference between a quiet path and a step every parent is
// shown, cannot complete, and cannot get rid of.
export function allBirthdaysIn(
  result: { data: { date_of_birth?: string | null }[] | null; error?: unknown } | null,
): boolean {
  if (!result || result.error || !result.data) return true
  return !result.data.some(row => !row.date_of_birth)
}
