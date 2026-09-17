import { londonNow } from '@/lib/time/london'
import type { createClient } from '@/lib/supabase/server'
import { seedBaselineConcerns, seedChildBaseline } from '@/lib/concerns/baseline'
import { restingConcernIds, TOP_BAND } from '@/lib/concerns/resting'
import { readScores, type ScoredEvent } from '@/lib/concerns/scores'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type CheckInRow = {
  /**
   * The concern's own id, and it is what the save posts.
   *
   * Slug alone stopped being unique on 15 August 2026. Concerns went per child
   * with migration 194, and seedChildBaseline gives every new child the SAME
   * four common worries, so a two child family has two rows with slug
   * 'phone-handover-fight'. /api/daily/concern-check looked its concern up by
   * (user_id, slug) with maybeSingle, which returns an ERROR on two rows, so
   * the route would have 404ed and, before the same day's fix, the card would
   * have gone green over nothing and the rung would never have ticked.
   *
   * It had not fired yet only because the one two child account on the product
   * predates the seeding. It would have fired for every family who used the new
   * "add your other children" setup step.
   */
  id: string
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  lastScore: number | null
  /** Whose worry this is. concerns.child_id has always been set; nothing read it. */
  childId: string | null
  childName: string | null
  /**
   * Where the worry came from: 'digi', 'moment', 'rightnow', 'checkin' or
   * 'onboarding'. Written by lib/concerns/raise on every raise since August and
   * read by nothing until now, which is why a worry a parent raised in a chat
   * with DiGi on Tuesday arrived in Wednesday's check in as an anonymous row.
   */
  source: string | null
  /**
   * First time this worry has reached the check in: never rated, and not part
   * of a starting set the app seeded for them.
   *
   * Justin, 14 August 2026: "any issue raised in digi we can add to check in."
   * It always was added. What it never did was arrive with anything: no note of
   * where it came from and no next move, so the one row on the page the parent
   * had actually asked for help about looked exactly like the four the app had
   * guessed at.
   */
  isNew: boolean
}

export type TodayCheckIn = {
  rows: CheckInRow[]
  /** Their first ever, so the card frames itself as the starting point. */
  baseline: boolean
  /**
   * ONE CHILD AT A TIME, and who is left after this one.
   *
   * Justin, 18 August 2026: "maybe there is a better way and the parent runs
   * through one child first then says done, on to next child? Would that be
   * easy to code and work smoother?"
   *
   * It is both, and it is the shape the rest of the app already has. A flat
   * list of every child's worries is a wall: eight rows on a phone, each one
   * needing the parent to check a name before they can answer, and no point at
   * which anything is finished. Four rows twice is two short jobs, and the
   * switcher in the layout already means "which child" everywhere else, so this
   * is the odd one out rather than the special case.
   *
   * `queue` is every child who still has something to answer today, in the same
   * primary first order as the pills, so the page can say "Olgie is done, now
   * Teo" and know when there is genuinely nobody left.
   */
  queue: { id: string; name: string | null; outstanding: number }[]
  /** The child these rows belong to. Null only when the family has none. */
  childId: string | null
  childName: string | null
  /**
   * DAY ONE, WHICH IS AN ACKNOWLEDGEMENT RATHER THAN A READING.
   *
   * Justin, 17 September 2026, having just signed up and done his own first
   * check in: "it's just to acknowledge first concerns raised so seems overkill
   * to ask them to do a check in maybe we should just acknowledge they are
   * added to solve first and are on next day".
   *
   * Read from that account: seven concerns written fifteen seconds after it
   * existed, then all seven rated between 20:59:29 and 21:00:04. Seven ratings
   * in thirty five seconds, every one the same score, from a parent who had not
   * yet watched one day with any of those worries in mind. That number is what
   * the weekly email, the passport stamp and every "is it getting better"
   * sentence are measured against.
   *
   * Non null means show the list to agree to, not the stars. Every child at
   * once, because reading your own worries back is one job rather than one per
   * child, and it is the moment a parent remembers the one they forgot.
   */
  acknowledge: null | {
    children: { id: string; name: string | null; concerns: { id: string; label: string }[] }[]
  }
}

// ── HOW MANY IN ONE DAY ─────────────────────────────────────────────────────
//
// Three per child, and it is a cap on the DAY rather than on the page. It used
// to be five per load with nothing behind it, so a parent who answered five
// got five more on the next render: that is how seven ratings happened in
// thirty five seconds. A worry that does not fit today is not skipped, it is
// first in the queue tomorrow, because the order is longest unasked first.
const DAILY_CAP = 3

// The generic Something else catch all is a picker, not a real moment, so it
// is never a rateable check in row. Guarded by slug even if an old row exists.
const GENERIC = new Set(['something-else', 'something_else', 'other'])

/**
 * Everything the check in needs, in one place.
 *
 * ── WHY THIS IS A LIBRARY AND NOT A PAGE ────────────────────────────────────
 *
 * Justin, 13 August 2026: "check in going to wrong section both on the welcome
 * from DiGi link and the top of things to do today... check in is different
 * from moments."
 *
 * He is right and it was structural. The check in was rendered ON the daily
 * deck page, above the moments deck, and all three links to it were
 * /dashboard/daily#checkin. So every route to "check in" landed a parent on
 * the moments page and asked them to scroll, and the two things this product
 * keeps most carefully apart, a reading and a moment, shared one screen and
 * one URL.
 *
 * It has its own page now. This loader is what stops the two drifting: the
 * page reads it, and nothing else builds this list by hand.
 */
export async function getTodayCheckIn(
  supabase: SupabaseClient,
  userId: string,
  /** Which child to ask about. Falls back to the first with anything left. */
  childIdParam?: string | null,
): Promise<TodayCheckIn> {
  // ── "TODAY" IS THE FAMILY'S TODAY, NOT THE SERVER'S ────────────────────────
  //
  // Justin, 9 September 2026: "check that this refreshes each day."
  //
  // It did not, quite. This was `new Date().toISOString().split('T')[0]`, which
  // is the date in UTC, and the server runs in UTC while every family using
  // this product is in the UK. From late March to late October the two are an
  // hour apart, and that hour lands in exactly the wrong place:
  //
  //   A check in done at 00:30 on Tuesday is stored 23:30 Monday UTC, so it
  //   counts as MONDAY. The parent is asked the same questions again a few
  //   hours later.
  //
  //   Between midnight and 1am on Tuesday the server still reads Monday, so a
  //   parent who did Monday's check in and looks after midnight is told they
  //   are done for a day that has already started.
  //
  // lib/time/london was written for this and six other files already use it.
  // The check in, which is the one thing in the product that has to know what
  // day it is, was the one that did not.
  const today = londonNow().dateStr

  // ── THE NEW COLUMN IS READ ON ITS OWN, AND ITS ABSENCE MEANS CARRY ON ────
  //
  // Migrations run by hand here, so naming concerns_confirmed_at inside the
  // profiles select would fail that whole query on any environment where 304
  // has not been applied yet, and this loader IS the check in. A side query
  // that is allowed to fail costs one round trip and cannot take the daily
  // loop down with it.
  //
  // Missing column means treat everyone as confirmed, which is exactly the
  // behaviour before this change: rate on day one. So the deploy is safe in
  // either order, and the new screen simply starts appearing once 304 runs.
  const confirmedRead = await supabase
    .from('profiles').select('concerns_confirmed_at').eq('id', userId).maybeSingle()
  const confirmed = confirmedRead.error
    ? true
    : (confirmedRead.data as { concerns_confirmed_at?: string | null } | null)?.concerns_confirmed_at != null

  const [{ data: profile }, { data: live }, { data: kids }, { data: doneToday }] = await Promise.all([
    supabase.from('profiles').select('first_checkin_at, onboarding_answers').eq('id', userId).maybeSingle(),
    // Live concerns flagged before today and not yet checked today.
    //
    // child_id joined the select on 14 August 2026. It has been on this table
    // since the beginning and every one of the 27 rows on the live account has
    // it set, but nothing had ever read it, so the check in could not say whose
    // worry it was asking about. In a one child family that is invisible. In a
    // two child family the parent is rating "Sibling fighting" and "Gaming
    // concerns" in one undifferentiated list with no idea which child each
    // belongs to, and the numbers land against a child they never chose.
    //
    // The limit is raised because the "going great" filter below removes rows
    // AFTER the query, and a limit of 5 applied first would quietly return two.
    supabase.from('concerns')
      .select('id, slug, label, times_flagged, last_flagged_at, child_id, source')
      .eq('user_id', userId)
      .in('status', ['open', 'improving'])
      // NOT filtered to "flagged before today" here any more. See the note by
      // neverCheckedIn below: that rule is a REVIEW rule, and it silently
      // deleted the baseline for every family on the day they signed up.
      
      .or(`last_checked_at.is.null,last_checked_at.lt.${today}`)
      // ── LONGEST UNASKED FIRST ─────────────────────────────────────────────
      //
      // This was newest flagged first, which put the same few worries at the
      // top for ever: a worry raised in week one and never asked about sank
      // below every moment logged since, and with a cap on the day it would
      // never be reached at all. Oldest answer first is what makes the cap a
      // rotation rather than a cliff, so everything the parent named comes
      // round and nothing quietly falls off the bottom of the list.
      //
      // Never asked sorts first of all, which is right: a worry the app has
      // never put a question to outranks one answered a fortnight ago.
      .order('last_checked_at', { ascending: true, nullsFirst: true })
      .limit(20),
    // Ordered the same way the switcher pills are, so "the first child" means
    // the same thing on both and the queue below reads in the order a parent
    // sees along the top of the page.
    supabase.from('children').select('id, name, is_primary').eq('parent_id', userId)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }),
    // What today has already taken, per child. The cap is on the DAY, so it
    // has to count the answers already given rather than the rows on this
    // render, or a reload hands the parent another three.
    supabase.from('concerns').select('child_id').eq('user_id', userId)
      .gte('last_checked_at', today),
  ])

  type Row = { id: string; slug: string; label: string; times_flagged: number; last_flagged_at: string; child_id: string | null; source?: string | null }
  const liveRows = ((live ?? []) as Row[])
    .filter(c => c.slug && !GENERIC.has(c.slug) && (c.label ?? '').trim().toLowerCase() !== 'something else')

  // ── THE REVIEW RULE MUST NOT EAT THE BASELINE ────────────────────────────
  //
  // Justin, 16 August 2026, still on "All done for today" after the worries
  // finally existed: "please fix the check in from this first page as keeps
  // saying done."
  //
  // The query used to filter .lt('last_flagged_at', today), and that rule is
  // correct for a REVIEW: do not ask a parent how last night went about
  // something they flagged twenty minutes ago. It is wrong for a BASELINE,
  // which is not a review of anything, and this file already said so in as many
  // words a few lines down while only applying it to freshly seeded rows.
  //
  // So a family whose worries were created today, whether by onboarding, by the
  // seeding, or by naming three things in their first ten minutes, had every row
  // filtered out and met an empty check in on the one day they were willing to
  // try it. Same empty page, third distinct cause: first no mapping, then a
  // check constraint rejecting the insert, now the rows existing and being
  // filtered away.
  //
  // The filter moves to where it belongs: applied only once there is a first
  // check in to review against.
  const neverCheckedIn = !profile?.first_checkin_at
  const cutoff = neverCheckedIn ? null : today
  const liveRowsFiltered = cutoff
    ? liveRows.filter(c => String(c.last_flagged_at) < cutoff)
    : liveRows
  const seeded = neverCheckedIn && liveRowsFiltered.length === 0
    ? await seedBaselineConcerns(supabase, userId, profile?.onboarding_answers)
    : []

  // ── EVERY CHILD HAS SOMETHING TO BE ASKED ABOUT, CHECKED EVERY TIME ──────
  //
  // Justin, 18 August 2026: "make sure the check in is working for each child,
  // that it looks for baseline concerns on every check in."
  //
  // seedBaselineConcerns above only ever fires on a family's FIRST check in,
  // and it seeds against the primary child. So a second child added in week
  // three got nothing: no concerns, no rows, never in the queue, and the check
  // in behaved as though they did not exist. Adding a child is exactly when a
  // parent expects the app to start paying attention to them.
  //
  // So the question is asked on every load rather than once ever. One read for
  // who is already covered, then seedChildBaseline for anybody who is not, and
  // that function is itself a no op for a child with any concern of their own,
  // so this cannot double up on a child who simply answered everything today.
  const { data: coveredRows } = await supabase
    .from('concerns').select('child_id').eq('user_id', userId)
  const covered = new Set(
    ((coveredRows ?? []) as { child_id: string | null }[])
      .map(r => r.child_id).filter((id): id is string => !!id),
  )
  // The primary child is seeded from what the parent said at sign up, every
  // other child from the two starters, whichever order they were added in.
  // Before 2 September the primary only got the sign up answers when the
  // family had no concerns at all, which setup's add a child step makes false
  // before the first check in ever opens.
  const uncovered = ((kids ?? []) as { id: string; is_primary?: boolean | null }[]).filter(k => !covered.has(k.id))
  const childSeeded = uncovered.length > 0
    ? (await Promise.all(uncovered.map(k => k.is_primary
        ? seedBaselineConcerns(supabase, userId, profile?.onboarding_answers, k.id)
        : seedChildBaseline(supabase, userId, k.id)))).flat()
    : []

  const rows = seeded.length > 0 ? seeded : [...liveRowsFiltered, ...childSeeded]

  // ── DAY ONE: THE LIST TO AGREE TO, NOT THE STARS ─────────────────────────
  //
  // Everything above still runs, because the rows have to EXIST before they can
  // be acknowledged: the seeding is what turns what a parent typed at sign up
  // into real worries, and that part was working (Justin's "Biting" was written
  // correctly and was the first card he rated). What changes is what we do with
  // them on the first visit.
  //
  // Every child at once, rather than the one child at a time the rating flow
  // uses. Reading your own worries back is one short job, not one per child,
  // and splitting it would mean confirming the same thing twice.
  if (!confirmed) {
    const byChild = new Map<string, { id: string; name: string | null; concerns: { id: string; label: string }[] }>()
    for (const k of (kids ?? []) as { id: string; name: string | null }[]) {
      byChild.set(k.id, { id: k.id, name: k.name && k.name !== 'Your child' ? k.name : null, concerns: [] })
    }
    const firstChild = ((kids ?? []) as { id: string }[])[0]?.id ?? null
    for (const c of rows) {
      // A worry with no child belongs to the household and rides with the first
      // child, the same rule the queue below uses, because "Family" is not a
      // person to check in about.
      const key = c.child_id ?? firstChild
      if (key) byChild.get(key)?.concerns.push({ id: c.id, label: c.label })
    }
    const withAny = [...byChild.values()].filter(k => k.concerns.length > 0)
    return {
      rows: [],
      // The starting point wording belongs on this screen now, so the flag it
      // drives stays true for it.
      baseline: true,
      queue: [],
      childId: null,
      childName: null,
      acknowledge: { children: withAny.length > 0 ? withAny : [...byChild.values()] },
    }
  }

  // Whose FIRST reading this is, judged per child rather than per family.
  //
  // The flag decides whether the card says "where things are now" or "how is it
  // going", and for a child seeded thirty seconds ago there is no last time to
  // compare against however long the family has been here. A household on week
  // ten adding a six year old should meet the starting point wording for her
  // and the review wording for her brother.
  const freshIds = new Set([...seeded, ...childSeeded].map(c => c.id))

  // What they said last time, so the card can show it back and the verdict can
  // name the move. A second wave by necessity: it needs the concern ids.
  let read = readScores([], TOP_BAND)
  if (rows.length > 0) {
    const { data: scores } = await supabase
      .from('concern_events')
      .select('concern_id, score, created_at')
      .in('concern_id', rows.map(c => c.id))
      .not('score', 'is', null)
      .order('created_at', { ascending: false })
    read = readScores((scores ?? []) as ScoredEvent[], TOP_BAND)
  }
  const lastScoreByConcern = read.last

  // ── GOING GREAT MEANS WE STOP ASKING ────────────────────────────────────────
  //
  // Justin, 14 August 2026: "if doing great we can stop asking at check in
  // unless they raise another moment then we add to check in or any issue
  // raised in digi we can add to check in."
  //
  // This is the rule that keeps the check in short enough to be done. A family
  // who has sorted bedtime was asked about bedtime every week for ever, so the
  // list only ever grew, and a list that only grows is a list that stops being
  // filled in. Worse, it taught the parent that saying "going great" achieves
  // nothing.
  //
  // The rule itself lives in lib/concerns/resting.ts because the moments deck
  // applies exactly the same judgement: a worry the parent has just called
  // sorted must not still be shaping what today's card coaches them through.
  // Two copies of this would drift, and the day they drifted the check in would
  // be congratulating a family on something the deck was still worrying about.
  const resting = restingConcernIds(rows, read.topRun, read.lastAt)

  const nameById = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))
  const answerable = rows.filter(c => !resting.has(c.id))

  // ── WHO STILL HAS SOMETHING TO ANSWER ────────────────────────────────────
  //
  // Built before the slice, deliberately. The five row cap is a limit on how
  // much is asked at once, not a statement about who is finished, and counting
  // after it would tell a parent a child was done when they had six worries.
  //
  // A concern with no child_id belongs to the household. It rides with the
  // FIRST child rather than making a queue entry of its own, because "Family"
  // is not a person to check in about and a parent would read it as a third
  // child they do not have.
  //
  // WHAT TODAY HAS ALREADY TAKEN. The cap is on the day, so a child who has
  // answered their three is finished until tomorrow and must drop out of the
  // queue: leaving them in would say "2 left" about questions the page will
  // not ask, which is the same lie as a badge that counts something you cannot
  // reach.
  const takenByChild = new Map<string, number>()
  for (const r of ((doneToday ?? []) as { child_id: string | null }[])) {
    const key = r.child_id ?? ((kids ?? []) as { id: string }[])[0]?.id ?? null
    if (key) takenByChild.set(key, (takenByChild.get(key) ?? 0) + 1)
  }
  const roomFor = (childId: string) => Math.max(0, DAILY_CAP - (takenByChild.get(childId) ?? 0))

  const queue = ((kids ?? []) as { id: string; name: string | null }[])
    .map(k => ({
      id: k.id,
      name: k.name && k.name !== 'Your child' ? k.name : null,
      outstanding: Math.min(answerable.filter(c => c.child_id === k.id).length, roomFor(k.id)),
    }))
    .filter(k => k.outstanding > 0)

  const orphans = answerable.filter(c => !c.child_id)
  if (orphans.length > 0 && queue.length > 0) {
    queue[0].outstanding = Math.min(queue[0].outstanding + orphans.length, roomFor(queue[0].id))
  }

  // The child being asked about: the param when it still has something left,
  // otherwise the first child who does. So finishing Olgie and coming back
  // lands on Teo without the parent choosing, and a stale ?child= from a
  // bookmark never shows an empty page while another child is waiting.
  const current = queue.find(k => k.id === childIdParam) ?? queue[0] ?? null

  const mine = current
    ? answerable.filter(c => c.child_id === current.id || (!c.child_id && current.id === queue[0]?.id))
    : answerable
  // Three, less whatever today already took. Not five per render, which is what
  // let seven ratings happen in thirty five seconds: answering five simply
  // produced the next two on the following load, so the number meant nothing.
  const asked = current ? mine.slice(0, roomFor(current.id)) : mine.slice(0, DAILY_CAP)

  return {
    acknowledge: null,
    baseline: asked.length > 0 && asked.every(c => freshIds.has(c.id)),
    queue,
    childId: current?.id ?? null,
    childName: current?.name ?? null,
    rows: asked.map(c => {
      const name = c.child_id ? nameById.get(c.child_id) ?? null : null
      return {
        id: c.id,
        slug: c.slug,
        label: c.label,
        timesFlagged: c.times_flagged,
        lastFlaggedAt: c.last_flagged_at,
        lastScore: lastScoreByConcern.get(c.id) ?? null,
        childId: c.child_id ?? null,
        childName: name && name !== 'Your child' ? name : null,
        source: (c as Row).source ?? null,
        // Never rated, and not one the app seeded a moment ago. A seeded row is
        // the app's guess and says so in its own words; this is the parent's
        // own, carried over from wherever they raised it.
        isNew: (lastScoreByConcern.get(c.id) ?? null) == null && !freshIds.has(c.id),
      }
    }),
  }
}
