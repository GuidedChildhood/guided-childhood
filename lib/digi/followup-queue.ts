// ONE "HOW DID THAT GO?" AT A TIME, AND NONE THAT HAVE GONE STALE.
//
// Justin, 7 October 2026, with a screenshot of his own Notifications page:
// "Teo asked same thing 3 times, please review and fix ... it needs to show
// once."
//
// What had happened, read off the live tables rather than guessed: three
// separate DiGi conversations, on 11 August, 1 September and 25 September,
// each booked a follow up for Teo. Each became a "How did that go?" card on
// its due date. None was answered, and a card never expired, so two months
// on the page carried three near identical questions, the oldest about a
// bedroom rule from August. Nothing was duplicating; nothing was ever
// finishing.
//
// Three rules, all pure so the guard can run them rather than read them:
//
//   1. ONE CARD PER CHILD. A due follow up whose child already has an
//      unanswered card WAITS. It is not cancelled and not stacked; it lands
//      when the earlier one is answered, dismissed or expires.
//   2. WAITING HAS A LIMIT. A follow up that has waited more than
//      HOLD_MAX_DAYS past its due date is cancelled rather than delivered,
//      because "did you get a chance to try X" about a month ago is not a
//      fair question.
//   3. CARDS EXPIRE. An unanswered card older than CARD_STALE_DAYS is
//      dismissed by the morning cron. The outcome row underneath stays
//      unanswered, which is the honest record: we do not know how it went.
//
// A follow up attached to a WORRY never takes a card slot at all: that
// question is asked on the worry's own row in the check in (21 September
// 2026), so it is delivered as an outcome only and leaves the card queue to
// the advice that has nowhere else to be asked.

/** An unanswered "How did that go?" older than this is dismissed. */
export const CARD_STALE_DAYS = 14

/** A due follow up waits behind an earlier card at most this long, then is cancelled. */
export const HOLD_MAX_DAYS = 10

/** A check in invite ("DiGi can help with bedtime") older than this is dismissed. */
export const CHECKIN_INVITE_DAYS = 7

export type DueFollowup = {
  id: string
  /** Who the card would be for: `${user_id}:${child_id ?? 'family'}`. */
  key: string
  /** Attached to a worry: asked on the check in row, never a card. */
  onWorry: boolean
  /** The London date it fell due, YYYY-MM-DD. */
  dueOn: string
}

export type DeliveryPlan = { deliver: string[]; hold: string[]; cancel: string[] }

/** Whole days from `from` to `to`, both YYYY-MM-DD. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0
  return Math.round((b + -a) / 86400000)
}

/**
 * Which of today's due follow ups go out, which wait, and which are let go.
 *
 * `pendingCardKeys` are the children (by key) who already have an unanswered
 * card. Earliest due first, so a family's oldest promise is the one kept.
 */
export function planDeliveries(due: DueFollowup[], pendingCardKeys: Set<string>, today: string): DeliveryPlan {
  const plan: DeliveryPlan = { deliver: [], hold: [], cancel: [] }
  const taken = new Set(pendingCardKeys)
  const ordered = due.slice().sort((a, b) => a.dueOn.localeCompare(b.dueOn) || a.id.localeCompare(b.id))
  for (const f of ordered) {
    if (f.onWorry) { plan.deliver.push(f.id); continue }
    if (taken.has(f.key)) {
      if (daysBetween(f.dueOn, today) > HOLD_MAX_DAYS) plan.cancel.push(f.id)
      else plan.hold.push(f.id)
      continue
    }
    taken.add(f.key)
    plan.deliver.push(f.id)
  }
  return plan
}

/** The ISO instant before which a card made then is stale, for a query's `lt`. */
export function staleBefore(now: Date, days: number): string {
  return new Date(now.getTime() + -(days * 86400000)).toISOString()
}

// ── AN EXPIRING THREAD IS NOT A LOST ISSUE (Justin, later the same day) ─────
//
// "We don't want to miss those issues if dropped off after 2 weeks, also to
// ask DiGi it needs to know what the issue was so can allude to it."
//
// So a card that expires does two things instead of one. The thread it
// carried goes onto the tracker as a worry when it was not already on one,
// named from the moment the parent described (the trigger) or, failing that,
// the topic, so the daily check in keeps asking in the place parents actually
// answer (15 of 40 there against 0 of 6 on a card). And every card, new or
// old, opens DiGi with the thread itself rather than its title.

/** The topic slugs DiGi files a follow up under, said as a worry a parent would recognise. */
export const TOPIC_LABELS: Record<string, string> = {
  screen_time: 'Screen time',
  gaming: 'Gaming',
  social_media: 'Social media',
  sleep: 'Sleep',
  mood: 'Mood',
  anxiety: 'Worries and anxiety',
  safety: 'Staying safe online',
  school: 'School',
  siblings: 'Sibling fights over screens',
  routines: 'Routines',
  devices: 'Devices',
  friendship: 'Friendships',
  content: 'What they come across',
  ai: 'AI tools',
  new_phone: 'The first phone',
  new_game: 'A new game',
  parent_stress: 'Parent stress',
}

/**
 * The worry an expiring thread becomes. The trigger first, because it is the
 * parent's own words for the moment ("goes straight to the TV before
 * breakfast"); the topic as the fallback. Null when there is nothing honest
 * to name, in which case the thread stays an unanswered outcome and nothing
 * is invented.
 */
export function issueLabelFrom(input: { trigger?: string | null; topic?: string | null }): string | null {
  const trigger = (input.trigger ?? '').replace(/\s+/g, ' ').trim()
  if (trigger.length >= 6 && trigger.length <= 80) {
    return trigger.charAt(0).toUpperCase() + trigger.slice(1).replace(/[.!?]+$/, '')
  }
  const topic = (input.topic ?? '').trim().toLowerCase()
  return TOPIC_LABELS[topic] ?? null
}

/**
 * What the parent's first message to DiGi says when they tap a follow up
 * card, so DiGi can pick the thread up rather than being handed its title.
 */
export function followUpOpener(question: string): string {
  const q = question.replace(/\s+/g, ' ').trim().slice(0, 220)
  return `You said you would check back on this: ${q} Let us pick it up from there.`
}
