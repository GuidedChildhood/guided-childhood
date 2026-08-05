import type { createClient } from '@/lib/supabase/server'

// The road to social media: the one stretch of the pathway that is walked by
// the parent AND the child, and only counts when both have walked it.
//
// Justin: "on the parents pathway every month we need an appearance of Nova
// that says come this way for the road to social media. It needs to then only
// be completed when they complete relevant lesson on social media and children
// have done their necessary part, like an extra on the Duolingo pathway, keeps
// them on track to get the passport pass."
//
// WHAT THE ROAD IS. Eighteen lessons already in the library, category 'social
// media', running from Followers are not friends at eleven through Strangers,
// DMs and grooming and Nudes, the law and sextortion in the middle years to
// Taking the wheel at sixteen. They were sitting in the lesson hub in sort
// order with nothing marking them out as a sequence, so a parent met them as
// eighteen entries in a list rather than as the run up to the thing the whole
// product is pointed at.
//
// WHY BOTH SIDES HAVE TO TICK. This is the difference between this road and
// every other row on the passport. A parent who has read about grooming and a
// thirteen year old who has not is precisely the gap the road exists to close.
// Until migration 162 the app could not even see that gap: parent and child
// wrote the same lesson_completions row, so either one doing it looked like
// both. lesson_pass_by records which side, and a leg is complete only when
// there is one of each.
//
// WHY NOVA. She is the Stage 4 Planet Friend, ages 13 to 15, whose whole role
// is "making your own good choices". The road to social media IS stage four. It
// is her road, so she is the one who walks out and points down it.
//
// WHY MONTHLY. One leg a month is the pace this can be done at without it
// becoming homework, and it lands eighteen legs across the years from eleven to
// sixteen with room to spare. The card names the month's leg and does not lock
// anything: a family who wants to do three in a weekend should be able to, and
// a family who does none this month has simply not moved, which the card says
// plainly rather than punishing.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

/** One leg of the road: a lesson, and which of the two sides has done it. */
export type RoadLeg = {
  lessonId: string
  title: string
  /** 3, 4 or 5. A leg above the child's stage is not offered yet. */
  stageNum: number
  keyMessage: string | null
  parentDone: boolean
  childDone: boolean
}

export type SocialRoad = {
  /** Every leg at or below the child's stage, in order. */
  legs: RoadLeg[]
  /** The first leg not finished by both sides, or null when the road is walked. */
  current: RoadLeg | null
  /** Legs where both sides have ticked. */
  complete: number
  /** How many legs are open to this child at all. */
  total: number
  /** Legs waiting behind the child's current stage, named rather than hidden. */
  ahead: number
}

const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

/**
 * The road for one child, read live.
 *
 * Only legs at or below the child's stage are offered, the same forward only
 * age gate the child's own lesson list applies. An eleven year old is not shown
 * Nudes, the law and sextortion because it happens to sit next in sort order.
 *
 * Fails soft to an empty road: before migration 162, or on any unreadable
 * table, the card simply does not render rather than taking the pathway down.
 */
export async function getSocialRoad(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null,
  childStageNum: number | null,
): Promise<SocialRoad | null> {
  if (!childId || !childStageNum) return null

  try {
    const [{ data: lessons }, { data: passes }] = await Promise.all([
      supabase.from('lessons')
        .select('id, title, stage_id, key_message, sort_order')
        .eq('audience', 'parent').eq('category', 'social media').eq('status', 'live')
        .order('sort_order', { ascending: true }),
      supabase.from('lesson_pass_by')
        .select('lesson_id, who, child_id').eq('user_id', userId),
    ])
    if (!lessons?.length) return null

    const parentPassed = new Set(
      (passes ?? []).filter(p => p.who === 'parent').map(p => p.lesson_id as string),
    )
    const childPassed = new Set(
      (passes ?? []).filter(p => p.who === 'child' && p.child_id === childId).map(p => p.lesson_id as string),
    )

    const all = lessons.map(l => ({
      lessonId: l.id as string,
      title: l.title as string,
      stageNum: STAGE_NUM[l.stage_id as string] ?? 5,
      keyMessage: (l.key_message as string | null) ?? null,
      parentDone: parentPassed.has(l.id as string),
      childDone: childPassed.has(l.id as string),
    }))

    const legs = all.filter(l => l.stageNum <= childStageNum)
    const current = legs.find(l => !(l.parentDone && l.childDone)) ?? null
    return {
      legs,
      current,
      complete: legs.filter(l => l.parentDone && l.childDone).length,
      total: legs.length,
      ahead: all.length - legs.length,
    }
  } catch {
    return null
  }
}

/**
 * What is still needed on this leg, in the parent's words.
 *
 * Written here rather than in the component so the same sentence can be reused
 * by anything else that wants to name the next step, and so it stays one
 * definition of what "not done yet" means.
 */
export function legNextStep(leg: RoadLeg, childName: string | null): string {
  // A name takes has, a bare "they" takes have. Getting this wrong reads as
  // sloppy in the one place a parent is being asked to trust the reading:
  // "Alma have done this one" was the first thing visible in the harness.
  const subject = childName ?? 'They'
  const verb = childName ? 'has' : 'have'
  const object = childName ?? 'they'
  if (!leg.parentDone && !leg.childDone) return `Neither of you has done this one yet. You first, then ${object}.`
  if (!leg.parentDone) return `${subject} ${verb} done this one. Your turn.`
  return `You have done this one. ${subject} still ${childName ? 'needs' : 'need'} their turn.`
}
