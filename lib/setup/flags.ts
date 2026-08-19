import { visibleSteps, type SetupFlags, type SetupStep } from './steps'
import { getFamilyHandover, offerableChildren, familySettled } from '@/lib/handover/settled'

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
  /**
   * EVERY child, each carrying whether their side is already dealt with.
   *
   * Justin, 18 August 2026: "the share code step 4 is after we have added the
   * other child so needs to have both names, as we need 2 different codes, one
   * for each child ... for example if 3 children they could be a mix of marked
   * as app and no app printable version."
   *
   * A QR code belongs to ONE child: it is their link, their jobs, their stars.
   * The step used to hand the primary child to a single button, so a family with
   * three children could share with one of them and the other two had no route
   * at all from setup.
   */
  children: { id: string; name: string | null; age_band: string | null; linked: boolean; noPhone: boolean }[]
}

export async function getSetupState(supabase: FlagClient, userId: string): Promise<SetupState> {
  const [child, push, kidLinks, profile, childCount] = await Promise.all([
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
    // Every child now, ordered primary first then oldest, so the share step can
    // list them all and the first of the list is still the primary for the
    // surfaces that only want one.
    supabase.from('children').select('id, name, age_band, is_primary, created_at, no_phone').eq('parent_id', userId)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }),
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
  // ── AND SEPARATELY, DID THEY ACTUALLY ANSWER? ──────────────────────────────
  //
  // These two are NOT the same question, and treating them as one is what put a
  // green tick on step four of a brand new account.
  //
  // Justin, 18 August 2026: "as soon as signed up it shows this page with
  // obvious error that 4 is ticked."
  //
  // handoverSettled means NOBODY IS LEFT TO OFFER IT TO, which is the right
  // question for silencing a nudge and the wrong one for ticking a step.
  // offerableChildren excludes a child in the 4 to 7 band, because we do not
  // push phones at little children, and it excludes a child still called "Your
  // child", because we will not name somebody we have not been told about. Both
  // exclusions are correct and both leave the list EMPTY, which then read as
  // "settled".
  //
  // The live database had one of each: an account created at 09:20 whose child
  // was still the placeholder, and one at 09:05 with a five year old. Both
  // showed 4 ticked before the parent had done anything at all.
  //
  // So the flag below asks the narrower question: has this family given a real
  // ANSWER. familySettled requires an actual recorded no, no_phone on the child
  // or handover_choice 'paper' on the family, rather than an absence of anyone
  // to ask.
  let answeredNoDevice = false
  try {
    const family = await getFamilyHandover(supabase as Parameters<typeof getFamilyHandover>[0], userId)
    const linked = new Set((kidLinks.data ?? []).map(k => k.child_id as string))
    // Kept, because three other surfaces read it to decide whether to NUDGE,
    // and for that job "nobody left to offer it to" is exactly right.
    handoverSettled = offerableChildren(family, linked).length === 0 && family.children.length > 0
    answeredNoDevice = familySettled(family)
  } catch { /* the step simply stays open, which is the old behaviour */ }

  // One row per child, each saying whether their side is already handled. Built
  // before the flags because childLink reads it, and returned so the share step
  // can draw a code button per child rather than one for the primary.
  const linkedIds = new Set((kidLinks.data ?? []).map(k => k.child_id as string))
  const childRows = ((child.data ?? []) as Record<string, unknown>[]).map(r => ({
    id: r.id as string,
    name: (r.name as string | null) ?? null,
    // The band rides along so the share card can wear this child's stage
    // colour, the same one their pill wears. See lib/children/colour.ts.
    age_band: (r.age_band as string | null) ?? null,
    linked: linkedIds.has(r.id as string),
    noPhone: r.no_phone === true,
  }))

  const flags: SetupFlags = {
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
    // ── EVERY CHILD, NOT ANY CHILD (18 August 2026) ────────────────────────
    //
    // Justin: "we need 2 different codes, one for each child ... if 3 children
    // they could be a mix of marked as app and no app printable version."
    //
    // This used to tick on the FIRST kid_links row, so a family with three
    // children shared with one and the step went green while two had no route
    // from setup at all. A QR code belongs to one child, so the question has to
    // be asked once per child.
    //
    // A child counts as dealt with when they are linked OR marked no phone, and
    // those two mixing freely is exactly the case Justin describes: the eldest
    // on the app, the younger two on the printed chart. The family level
    // assertion still closes the whole step, because "I have shared it" and "I
    // will run it on my phone" are answers about the household rather than about
    // one child.
    childLink: (childRows.length > 0 && childRows.every(c => c.linked || c.noPhone))
      || answeredNoDevice
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
    child: childRows[0] ? { id: childRows[0].id, name: childRows[0].name } : null,
    children: childRows,
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
