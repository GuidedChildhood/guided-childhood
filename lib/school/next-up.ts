// WHAT IS COMING UP, IN THE ORDER A PARENT NEEDS IT.
//
// Justin, 22 November 2026: the calendar page was "a bit messy with explaining
// what's coming next" and should be super simple, nothing missed. The page had
// the week as a grid, a coming up list, a full list and the routines, and no
// one place that answered "what is next". This is that answer, worked out once
// and tested (next-up.test.ts), so the page only has to draw it.
//
// The rule: anything overdue first and it stays until it is ticked; then
// today, tomorrow and the rest of the next seven days; a weekly routine joins
// on its day and the day before (the night before is when a PE kit is packed);
// everything further out folds into "later". Nothing open is ever left out:
// every item lands in exactly one of the four lists.

import { daysBetween } from './lead-up'

export type UpItem = {
  id: string
  kind: string
  title: string
  detail?: string | null
  due_date?: string | null
  due_time?: string | null
  recurs_weekday?: number | null
  cleared_on?: string | null
  child_name?: string | null
}

export type UpEntry<T extends UpItem = UpItem> = {
  item: T
  /** Days from today. Negative is overdue. Null has no date at all. */
  days: number | null
  /** The date it falls on, YYYY-MM-DD. For a routine, its next day. */
  dateIso: string | null
  routine: boolean
}

export type NextUp<T extends UpItem = UpItem> = {
  overdue: UpEntry<T>[]
  /** Today to six days out, soonest first. */
  soon: UpEntry<T>[]
  /** Seven days out and beyond, plus routines not due today or tomorrow. */
  later: UpEntry<T>[]
  /** One offs with no date. */
  undated: UpEntry<T>[]
}

/** YYYY-MM-DD plus n days, by calendar date. */
export function addDays(iso: string, n: number): string {
  const d = new Date(Date.parse(`${iso.slice(0, 10)}T12:00:00Z`) + n * 86_400_000)
  return d.toISOString().slice(0, 10)
}

/** 0 to 6, Sunday first, for a YYYY-MM-DD. */
export function weekdayOf(iso: string): number {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`).getUTCDay()
}

export function nextUp<T extends UpItem>(
  items: T[],
  todayIso: string,
  /** True when a routine is resting (the school holidays). It goes to later. */
  held: (item: T) => boolean = () => false,
): NextUp<T> {
  const out: NextUp<T> = { overdue: [], soon: [], later: [], undated: [] }
  const todayDow = weekdayOf(todayIso)
  for (const item of items) {
    if (item.recurs_weekday != null) {
      let days = (item.recurs_weekday - todayDow + 7) % 7
      // Ticked for today: it is next due in a week.
      if (days === 0 && String(item.cleared_on ?? '') === todayIso) days = 7
      const entry: UpEntry<T> = { item, days, dateIso: addDays(todayIso, days), routine: true }
      if (days <= 1 && !held(item)) out.soon.push(entry)
      else out.later.push(entry)
      continue
    }
    if (!item.due_date) { out.undated.push({ item, days: null, dateIso: null, routine: false }); continue }
    const days = daysBetween(todayIso, item.due_date)
    const entry: UpEntry<T> = { item, days, dateIso: item.due_date.slice(0, 10), routine: false }
    if (days < 0) out.overdue.push(entry)
    else if (days < 7) out.soon.push(entry)
    else out.later.push(entry)
  }
  const byWhen = (a: UpEntry<T>, b: UpEntry<T>) =>
    (a.days ?? 9999) - (b.days ?? 9999)
    || String(a.item.due_time ?? '99').localeCompare(String(b.item.due_time ?? '99'))
    || a.item.title.localeCompare(b.item.title)
  out.overdue.sort(byWhen); out.soon.sort(byWhen); out.later.sort(byWhen)
  return out
}

/** "Today", "Tomorrow", "In 3 days", "2 days late". */
export function whenWords(days: number | null): string {
  if (days == null) return 'No date'
  if (days < -1) return `${-days} days late`
  if (days === -1) return 'Yesterday'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

/** The one line that proves nothing is missed. */
export function countLine(n: NextUp): string {
  const soon = n.soon.length
  const late = n.overdue.length
  const week = soon === 0 ? 'Nothing in the next 7 days' : `${soon} ${soon === 1 ? 'thing' : 'things'} in the next 7 days`
  if (late === 0) return `${week}. Nothing overdue.`
  return `${late} overdue. ${week}.`
}
