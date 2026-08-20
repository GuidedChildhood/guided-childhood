import type { SupabaseClient } from '@supabase/supabase-js'

// WHAT YOUR CHILD DID WHILE YOU WERE AWAY.
//
// Justin, 8 August 2026: "this does not come boring for parents each day and it
// work is they log in time to time and how we keep them coming back to feel
// they are getting real use, feedback, enjoyment, seeing their child progress."
//
// The home page is a to do list, and a to do list is only ever a demand. Three
// tasks, reset every day whether or not anybody came, so a parent opening it on
// Tuesday having last looked on Friday is handed the same three jobs with no
// acknowledgement that four days passed. The app asks and never reports back.
//
// The odd thing is that the report already exists in the database. In those four
// days the child ticked jobs, finished days, handed in a printable, maybe
// brought a Planet Friend home. Every one of those is a row nobody ever showed
// the parent as news.
//
// So this reads the gap. Not a dashboard, not a chart, not another number to
// keep up: the handful of things that actually happened, in the child's name,
// since the last time this parent was looking.
//
// WHAT IT DELIBERATELY IS NOT
//
// It is not a streak, a score or a comparison. The parent is never told they
// missed anything, and the card never appears to say "you have not been here in
// a while". A product about screen time that guilts people into opening it more
// has lost the argument before it starts. If nothing happened, there is no card:
// silence is the correct output, and the day's pathway stands on its own.

/** How long a gap has to be before it counts as a new visit. */
const NEW_VISIT_HOURS = 4

/**
 * How far back a summary will ever reach.
 *
 * A parent returning after two months should get "here is the recent shape of
 * things", not sixty days of every tick. Thirty is generous and still readable.
 */
const MAX_WINDOW_DAYS = 30

export type CatchupLine = {
  /** Stable key so the card can render without an index. */
  key: string
  emoji: string
  text: string
}

export type Catchup = {
  /** When this summary counts from. */
  since: string
  /** Whole days between then and now, for the heading. */
  days: number
  lines: CatchupLine[]
  /** Anything actually waiting on the parent. Never mixed in with the news. */
  waiting: CatchupLine[]
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

/**
 * Move the visit marks on, and say what window to summarise.
 *
 * Returns null when there is nothing to summarise: a first ever load, or a
 * parent who is already here and has simply refreshed. Both are cases where the
 * right card is no card.
 *
 * The write is best effort and never blocks the page. A home page that will not
 * render because a timestamp could not be saved is a far worse bug than a
 * summary that shows twice.
 */
export async function rollVisit(
  supabase: SupabaseClient,
  userId: string,
  now: Date = new Date(),
): Promise<{ since: Date } | null> {
  // Reads its own state rather than taking it from the page's profile query,
  // and that is deliberate. home_last_at and home_catchup_from arrive with
  // migration 168, migrations here are run by hand, and naming a column that
  // does not exist yet fails the WHOLE query it is part of. Adding these two to
  // the home page's main profile select would have taken the home page down
  // between deploy and migration, which is exactly how the push columns took
  // notifications down two days ago. Kept separate, the worst this feature can
  // do before 168 lands is not appear.
  let profile: { home_last_at?: string | null; home_catchup_from?: string | null } | null = null
  try {
    const { data, error } = await supabase
      .from('profiles').select('home_last_at, home_catchup_from').eq('id', userId).maybeSingle()
    if (error) return null
    profile = data
  } catch { return null }

  const lastAt = profile?.home_last_at ? new Date(profile.home_last_at) : null
  const gapMs = lastAt ? now.getTime() - lastAt.getTime() : Infinity
  const isNewVisit = gapMs > NEW_VISIT_HOURS * 3600_000

  // The catchup mark only moves on a new visit, and it moves to the END of the
  // last one. Everything from there to now is genuinely news. Within a visit it
  // stays put, so a refresh does not wipe the card halfway through reading it.
  const nextCatchup = isNewVisit && lastAt ? lastAt : (profile?.home_catchup_from ?? null)

  try {
    await supabase.from('profiles').update({
      home_last_at: now.toISOString(),
      home_catchup_from: nextCatchup ? new Date(nextCatchup).toISOString() : null,
    }).eq('id', userId)
  } catch { /* the page matters more than the bookmark */ }

  if (!isNewVisit || !nextCatchup) return null

  const floor = new Date(now.getTime() - MAX_WINDOW_DAYS * 86400_000)
  const since = new Date(nextCatchup)
  return { since: since < floor ? floor : since }
}

/**
 * The news itself.
 *
 * Every read fails soft to nothing. This card is a bonus on a page that has
 * other things on it, and a table that cannot be reached should cost a parent
 * one line of good news rather than their whole home page.
 */
export async function getCatchup(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  childName: string | null,
  since: Date,
  now: Date = new Date(),
): Promise<Catchup | null> {
  const sinceIso = since.toISOString()
  const sinceDay = sinceIso.slice(0, 10)
  const who = childName ?? 'They'
  // "has" for a name, "have" for They. Justin, 8 August 2026: "should say has
  // finished." He is right, and the tense is the reason: these are things that
  // happened while the parent was away and are still true when they read it,
  // which is the present perfect, not the simple past. "Teo finished 3 full
  // days" is a report on a closed period; "Teo has finished 3 full days" is
  // where the child stands right now, which is what this card is for.
  const hasHave = childName ? 'has' : 'have'

  const count = async (fn: () => PromiseLike<{ count: number | null }>): Promise<number> => {
    try { return (await fn()).count ?? 0 } catch { return 0 }
  }

  // Scoped to THIS child where a child is named. This function took a childId
  // for its copy and then threw it away with a void, so "Jody has finished 3
  // full days" was the whole household's count wearing Jody's name. The
  // waiting counts at the end stay family wide on purpose: they are the
  // parent's to-do, not the child's news.
  const scope = childId ? `child_id.eq.${childId},child_id.is.null` : null
  // Loosely typed on purpose: the builder's own generics recurse too deep for
  // tsc when threaded through a generic helper, and this only ever forwards.
  const scoped = (q: { or: (f: string) => unknown }) => (scope ? q.or(scope) : q) as never

  const [stars, fullDays, sheets, friends, lessons, waitingSheets, waitingAsks] = await Promise.all([
    // Jobs the parent approved, which is the child's actual work landing.
    count(() => scoped(supabase.from('quest_ticks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'approved').gte('approved_at', sinceIso))),
    count(() => scoped(supabase.from('kid_days')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).not('completed_at', 'is', null).gte('completed_at', sinceIso))),
    count(() => scoped(supabase.from('printable_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'confirmed').gte('decided_at', sinceIso))),
    // A Planet Friend arriving is the rarest thing that happens here, so it is
    // read separately rather than inferred from the day count.
    count(() => scoped(supabase.from('earned_stickers')
      .select('id', { count: 'exact', head: true })
      // Both sides of the 19 August merge: main corrected the column to
      // earned_at (created_at does not exist on earned_stickers), this branch
      // scoped the count to the child. Each fixed a different way the number
      // could be wrong.
      .eq('user_id', userId).like('sticker_key', 'friend-%').gte('earned_at', sinceIso))),
    // LESSONS PASSED.
    //
    // Justin, 8 August 2026: "can we update parents when lessons are watched by
    // a child so we keep them updated that they are learning."
    //
    // The push already exists and is good: finish a lesson and the parent's
    // phone names it and the score. What was missing is the other half, for the
    // parent who was not looking at their phone at four o'clock on a Tuesday.
    // A notification is a moment and it is gone; this is the record of it, and
    // "they are learning" is a thing you feel from a week, not from one buzz.
    //
    // Only passes. Having a go is worth a push in the moment, because trying is
    // the thing to encourage right then, but a summary of the week should
    // report what stuck.
    count(() => scoped(supabase.from('lesson_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('passed', true).gte('completed_at', sinceIso))),
    // Waiting on the parent. Deliberately a separate list: news is a gift and a
    // request is a job, and running them together turns the good news into a
    // preamble for another demand.
    count(() => supabase.from('printable_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending')),
    count(() => supabase.from('quest_requests')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending')),
  ])

  void sinceDay

  const lines: CatchupLine[] = []
  if (friends > 0) {
    lines.push({
      key: 'friends', emoji: '🪐',
      text: friends === 1
        ? `${who} ${hasHave} brought a new Planet Friend home`
        : `${who} ${hasHave} brought ${friends} new Planet Friends home`,
    })
  }
  if (fullDays > 0) {
    lines.push({
      key: 'days', emoji: '⭐',
      text: `${who} ${hasHave} finished ${plural(fullDays, 'full day', 'full days')}, all five each time`,
    })
  }
  // Above the jobs, because "they learned something" is the line a parent wants
  // most and the one the product is actually for. Jobs are the mechanism.
  if (lessons > 0) {
    lines.push({
      key: 'lessons', emoji: '💡',
      text: `${who} ${hasHave} passed ${plural(lessons, 'lesson', 'lessons')}`,
    })
  }
  if (stars > 0) {
    lines.push({ key: 'stars', emoji: '✅', text: `${plural(stars, 'job', 'jobs')} done and approved` })
  }
  if (sheets > 0) {
    lines.push({ key: 'sheets', emoji: '🖍️', text: `${plural(sheets, 'printable', 'printables')} finished away from a screen` })
  }

  const waiting: CatchupLine[] = []
  if (waitingSheets > 0) {
    waiting.push({ key: 'w-sheets', emoji: '🖍️', text: `${plural(waitingSheets, 'finished sheet', 'finished sheets')} waiting for you to confirm` })
  }
  if (waitingAsks > 0) {
    waiting.push({ key: 'w-asks', emoji: '🙋', text: `${plural(waitingAsks, 'job', 'jobs')} ${who} asked to add` })
  }

  if (lines.length === 0 && waiting.length === 0) return null

  const days = Math.max(1, Math.round((now.getTime() - since.getTime()) / 86400_000))
  return { since: sinceIso, days, lines, waiting }
}
