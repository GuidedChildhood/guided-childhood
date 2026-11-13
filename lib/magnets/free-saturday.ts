// Free Saturday (13 November 2026): which free taster is "this week's".
//
// Justin asked for a carousel every week that offers one free resource and
// gets followers to leave an email or sign in for the free downloads. The
// Saturday post names the taster; guidedchildhood.com/free/this-week opens it.
// One stable link means the Instagram bio and every Story link sticker never
// need editing, and the carousel can say "link in bio" and be true.
//
// The schedule is content/printables/free-saturdays.json. This week's taster is
// the most recent Saturday on or before today with a slug, in London time,
// because a Saturday post goes out at 10:00 UK time. A reserved Saturday (no
// slug) keeps the previous week's taster live.
//
// Pure, so the test imports it without Next.

export type FreeSaturday = { date: string; slug: string | null; why: string }

/** Today's date in London as YYYY-MM-DD. */
export function londonDate(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

/** The slug of this week's taster, or null before the first Saturday. */
export function thisWeeksSlug(saturdays: FreeSaturday[], today: string): string | null {
  let pick: string | null = null
  for (const s of [...saturdays].sort((a, b) => a.date.localeCompare(b.date))) {
    if (s.date > today) break
    if (s.slug) pick = s.slug
  }
  return pick
}

/** The Saturday a slug is scheduled for next, on or after today, if any. */
export function nextSaturdayFor(saturdays: FreeSaturday[], slug: string, today: string): string | null {
  const hit = saturdays.filter(s => s.slug === slug && s.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]
  return hit?.date ?? null
}
