// School actions placed onto the Our school week fridge sheet.
//
// The school catch (lib/school/extract.ts) turns forwarded school emails and
// photographed letters into school_actions rows. This decides which of them
// belong on a given printed week and where: the day (Monday 0 to Friday 4) and
// the child's column, or the whole family's column when no child is named.
//
// Pure, so it is tested without a database (week-items.test.ts).

import type { SchoolItem } from '@/components/printables/SchoolWeekSheet'

export type SchoolActionRow = {
  title: string
  kind: string
  due_date: string | null
  child_id: string | null
  recurs_weekday: number | null
  status?: string | null
}

const KIND_PREFIX: Record<string, string> = {
  homework: 'Due: ', deadline: 'Due: ', payment: 'Pay: ', kit: '', event: '', notice: '',
}

/** Days between two YYYY-MM-DD dates, by the calendar, never by the clock. */
function dayGap(from: string, to: string): number {
  const a = Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10))
  const b = Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10))
  return Math.round((b - a) / 86400000)
}

/**
 * The items for the week starting `weekStart` (a Monday, YYYY-MM-DD).
 * `childIds` is the sheet's column order; a row for a child not in it goes to
 * the family column rather than vanishing. Weekends are not printed. At most
 * three items per cell, so a busy week never pushes the sheet off its page.
 */
export function schoolItemsForWeek(rows: SchoolActionRow[], weekStart: string, childIds: string[]): SchoolItem[] {
  const out: SchoolItem[] = []
  for (const r of rows) {
    if (r.status && r.status !== 'open') continue
    let day: number | null = null
    if (r.recurs_weekday !== null && r.recurs_weekday !== undefined) {
      // 0 Sunday to 6 Saturday (migration 037), onto 0 Monday to 4 Friday.
      const d = r.recurs_weekday - 1
      if (d >= 0 && d <= 4) day = d
    } else if (r.due_date) {
      const d = dayGap(weekStart, r.due_date.slice(0, 10))
      if (d >= 0 && d <= 4) day = d
    }
    if (day === null) continue
    const idx = r.child_id ? childIds.indexOf(r.child_id) : -1
    const text = `${KIND_PREFIX[r.kind] ?? ''}${r.title}`.trim().slice(0, 48)
    if (!text) continue
    out.push({ day, child: idx >= 0 ? idx : null, text })
  }
  const perCell = new Map<string, number>()
  return out.filter(it => {
    const k = `${it.day}:${it.child}`
    const n = (perCell.get(k) ?? 0) + 1
    perCell.set(k, n)
    return n <= 3
  })
}
