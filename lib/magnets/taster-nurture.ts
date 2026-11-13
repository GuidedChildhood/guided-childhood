// The taster nurture schedule (11 November 2026), as arithmetic.
//
// A free taster lead gets three emails in a week: the taster at once (the
// magnet email, transactional), the stage check on day 1, the full pack and
// the membership on day 7. Days 0, 1 and 7 because the one a week floor in
// sendEmail (six days between programme emails) leaves no other way to fit
// two programme emails into seven days.
//
// Pure, no imports, so the test runs it without a database. The cron in
// app/api/email/cron/route.ts asks this which email is due and does the rest.

export const TASTER_STAGE_KEY = 'taster-stage'
export const TASTER_FULL_PACK_KEY = 'taster-full-pack'
// In days since the claim. The email cron runs once a day at 08:00 UTC
// (vercel.json), so "day 1" is the first run at least twelve hours after the
// claim: a Saturday afternoon taster gets the stage check on Sunday morning.
// 6.5 aims the full pack at the same weekday a week on; when the floor holds
// it by a few seconds it goes the next morning instead.
export const TASTER_STAGE_DAY = 0.5
export const TASTER_FULL_PACK_DAY = 6.5
/** After this many days a taster lead is simply a lead, and the teasers carry on. */
export const TASTER_NURTURE_WINDOW_DAYS = 30

export type TasterNurtureKey = typeof TASTER_STAGE_KEY | typeof TASTER_FULL_PACK_KEY

/**
 * Which taster email is due, if any. The stage check always comes first, so a
 * lead whose day 1 email was held back by the floor gets it before the full
 * pack, and the floor then spaces the full pack a week after it.
 */
export function tasterEmailDue(ageDays: number, sent: ReadonlySet<string>): TasterNurtureKey | null {
  if (!Number.isFinite(ageDays) || ageDays > TASTER_NURTURE_WINDOW_DAYS) return null
  if (!sent.has(TASTER_STAGE_KEY)) return ageDays >= TASTER_STAGE_DAY ? TASTER_STAGE_KEY : null
  if (!sent.has(TASTER_FULL_PACK_KEY) && ageDays >= TASTER_FULL_PACK_DAY) return TASTER_FULL_PACK_KEY
  return null
}

// ── THE TASTER SERIES (13 November 2026) ─────────────────────────────────────
//
// Justin, passing on a talk about lead magnets ("stop sending PDFs, send an
// email a day"), then "Yes, daily for the series". A parent who ticks "send me
// the 5 day series" on a free taster page gets, after the printable itself:
//
//   day 1  page 1 of the taster in the email, and one tip for using it
//   day 2  page 2 and a tip
//   day 3  page 3 and a tip
//   day 4  the free stage check
//   day 5  the rest of the pack: free in the app for four days, or Etsy to keep
//
// Daily, because it is a series they asked for by name, so it sends as kind
// 'series' (no weekly floor, the stop link still wins). After day 5 the weekly
// floor counts on from the last one. Weighed in
// plans/2026-11-13-email-series-advice-weighed.md.
//
// "Day n" is the first 08:00 run at least n minus a half days after the claim,
// so a Saturday afternoon claim gets page 1 on Sunday morning. One email a run.

export const SERIES_PAGE_1_KEY = 'series-1'
export const SERIES_PAGE_2_KEY = 'series-2'
export const SERIES_PAGE_3_KEY = 'series-3'
export const SERIES_STAGE_KEY = 'series-stage'
export const SERIES_FULL_PACK_KEY = 'series-full-pack'

export const SERIES_ORDER = [SERIES_PAGE_1_KEY, SERIES_PAGE_2_KEY, SERIES_PAGE_3_KEY, SERIES_STAGE_KEY, SERIES_FULL_PACK_KEY] as const
export type SeriesKey = typeof SERIES_ORDER[number]

/**
 * Which series email is due, if any: the first one not yet sent, once the
 * lead is old enough for its place in the order. Never two in one run, never
 * out of order, and since the cron sends one a run, a day missed (a failed
 * send) never bunches two together.
 */
export function seriesEmailDue(ageDays: number, sent: ReadonlySet<string>): SeriesKey | null {
  if (!Number.isFinite(ageDays) || ageDays > TASTER_NURTURE_WINDOW_DAYS) return null
  const i = SERIES_ORDER.findIndex(k => !sent.has(k))
  if (i === -1) return null
  return ageDays >= i + 0.5 ? SERIES_ORDER[i] : null
}

/** The page a page email shows (1 to 3), or null for the stage and pack emails. */
export function seriesPageNumber(key: SeriesKey): number | null {
  const i = SERIES_ORDER.indexOf(key)
  return i < 3 ? i + 1 : null
}
