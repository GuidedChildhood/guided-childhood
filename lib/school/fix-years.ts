// A school date lands in the right year, or says it has passed.
//
// Justin, 25 November 2026: "364 days late". He snapped a school calendar that
// printed 2025, and nine entries went in a year in the past and led the page
// as overdue. On the same calendar, lines with a weekday and no year ("Tuesday
// 3 February") came back as 2027, a year in which 3 February is a Wednesday.
//
// Two plain rules, applied after the model answers, because a wrong year on a
// school date is worse than no date:
//
//   1. A WRITTEN WEEKDAY DECIDES THE YEAR. A date falls on a given weekday in
//      only some years, so "Tuesday 3 February" names its own year. When the
//      returned date is not that weekday, the year moves to the nearest one
//      where it is (last year, this year or next). A year printed in the text
//      is never overruled.
//   2. A DATE THAT HAS PASSED IS MARKED, NOT HIDDEN. The parent sees "already
//      passed" and it is not ticked, so an old calendar cannot fill the page
//      with overdue entries, and a real late form can still be added.

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const WRITTEN = new RegExp(`\\b(${DAYS.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTHS.join('|')})(?:\\s+(\\d{4}))?`, 'i')

type Dated = { title: string; detail?: string | null; due_date?: string | null; past?: boolean }

const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const weekdayOf = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()

/** The date the text itself names, with the year its weekday fits. Null when the text names none. */
export function yearFromWeekday(text: string, dueIso: string, todayIso: string): string | null {
  const m = WRITTEN.exec(text)
  if (!m) return null
  const weekday = DAYS.indexOf(m[1].toLowerCase())
  const day = Number(m[2])
  const month = MONTHS.indexOf(m[3].toLowerCase()) + 1
  const [dy, dm, dd] = dueIso.split('-').map(Number)
  // Only when the text is about the same day and month the model returned.
  if (dm !== month || dd !== day) return null
  if (m[4]) return iso(Number(m[4]), month, day)
  if (weekdayOf(dy, month, day) === weekday) return dueIso
  const thisYear = Number(todayIso.slice(0, 4))
  const fits = [thisYear - 1, thisYear, thisYear + 1]
    .filter(y => weekdayOf(y, month, day) === weekday)
    .map(y => iso(y, month, day))
  if (fits.length === 0) return dueIso
  // The nearest one still to come, else the most recent one gone.
  return fits.find(d => d >= todayIso) ?? fits[fits.length - 1]
}

/** Put each item in the year its own words name, and mark the ones already gone. */
export function fixYears<T extends Dated>(items: T[], todayIso: string): T[] {
  return items.map(it => {
    if (!it.due_date) return it
    const due = yearFromWeekday(`${it.detail ?? ''} ${it.title}`, it.due_date, todayIso) ?? it.due_date
    return { ...it, due_date: due, ...(due < todayIso ? { past: true } : {}) }
  })
}
