// Early reminders for homework and projects, leading up to the day.
//
// Justin, 19 November 2026, after snapping the Anderson shelter project letter:
// the date went in, but the alerts showed at once for something due 1 December
// and nothing helped the project get started. A project that takes two weeks
// needs a nudge to start, a nudge to check in, and the night before, the way
// Apple Reminders offers an early reminder on top of the due time.
//
// The plan is worked out from the day the item was ADDED, so it stays the same
// every time it is read: a project added 12 days out gets a week before and
// three days before; one added 5 days out gets three days before; one added
// two days out gets only the night before, which the evening cron already sends.
// A parent can turn either early reminder on or off (school_actions.remind_days,
// migration 401). Null means this automatic plan; an empty list means none.

/** Kinds that are work to do over days, rather than a thing to bring. */
export const LEAD_KINDS = new Set(['homework', 'deadline'])

/** The early reminders a parent can choose, in days before the due date. */
export const LEAD_CHOICES = [7, 3] as const

const DAY = 86_400_000

/** Whole days from one ISO date to another, by calendar date. */
export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${fromIso.slice(0, 10)}T12:00:00Z`)
  const b = Date.parse(`${toIso.slice(0, 10)}T12:00:00Z`)
  return Math.round((b - a) / DAY)
}

/** The automatic plan, from how far away the due date was when it was added. */
export function defaultLeadDays(kind: string, dueDate: string | null, addedIso: string): number[] {
  if (!LEAD_KINDS.has(kind) || !dueDate) return []
  const room = daysBetween(addedIso, dueDate)
  const out: number[] = []
  if (room >= 8) out.push(7)
  if (room >= 4) out.push(3)
  return out
}

/** The early reminders for this item: the parent's choice, or the automatic plan. */
export function leadDays(a: { kind: string; due_date: string | null; created_at?: string | null; remind_days?: number[] | null }, todayIso: string): number[] {
  if (!LEAD_KINDS.has(a.kind) || !a.due_date) return []
  if (Array.isArray(a.remind_days)) return a.remind_days.filter(d => (LEAD_CHOICES as readonly number[]).includes(d))
  return defaultLeadDays(a.kind, a.due_date, a.created_at ?? todayIso)
}

/**
 * The day a dated item starts showing on the notifications page.
 *
 * Its first early reminder, or two days out for anything else. Before that it
 * lives on the school calendar, where it was always visible, but it is not an
 * alert: a 1 December project is not something to act on on 19 November.
 * Undated items and weekly routines are not handled here and keep showing.
 */
export function showFrom(a: { kind: string; due_date: string | null; created_at?: string | null; remind_days?: number[] | null }, todayIso: string): string | null {
  if (!a.due_date) return null
  const lead = leadDays(a, todayIso)
  const before = lead.length ? Math.max(...lead) : 2
  const d = new Date(Date.parse(`${a.due_date}T12:00:00Z`) - before * DAY)
  return d.toISOString().slice(0, 10)
}

/** "Tue 1 Dec" from an ISO date. */
export function shortDate(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/** "12 days to go", "3 days to go", "tomorrow", "today". */
export function toGo(dueIso: string, todayIso: string): string {
  const n = daysBetween(todayIso, dueIso)
  if (n <= 0) return 'today'
  if (n === 1) return 'tomorrow'
  return `${n} days to go`
}

/** What the early reminder says, to the parent and to the child. */
export function leadMessage(title: string, daysLeft: number, dueIso: string, who: 'parent' | 'child', childName?: string | null): string {
  const when = daysLeft === 7 ? 'in a week' : `in ${daysLeft} days`
  if (who === 'child') {
    return daysLeft >= 7
      ? `${title} is due ${when}. Start a little bit this week and it stays easy ⭐`
      : `${title} is due ${when}. A little bit tonight? ⭐`
  }
  const forWho = childName ? ` for ${childName}` : ''
  return daysLeft >= 7
    ? `${title}${forWho} is due ${when} (${shortDate(dueIso)}). A good week to start it.`
    : `${title}${forWho} is due ${when} (${shortDate(dueIso)}). A little tonight keeps it calm.`
}
