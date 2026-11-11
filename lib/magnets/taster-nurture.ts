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
