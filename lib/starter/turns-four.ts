// THE UNDER 4 LIST (Justin agreed, 12 November 2026).
//
// A parent of a 2 or 3 year old meets "We start at 4" (components/children/
// StartsAtFour.tsx). That used to be a dead end, which the board's audience
// lens named: she is a warm customer later. Now she can leave an email for the
// month her child turns 4, and we write ONCE, that month, with the stage check.
// Nothing before it, no nurture, no trial nudges.
//
// Stored in starter_leads (no new table): stage_id 'under-4' and the month in
// answers.turnsFour. nurtured_at is stamped at capture so the generic lead
// nurture in app/api/email/cron never sends this parent a "start your trial"
// note about a product written for an older child. The turns four email is
// logged in lead_email_log under TURNS_FOUR_KEY, so it goes once.

export const UNDER_FOUR_STAGE = 'under-4'
export const TURNS_FOUR_KEY = 'turns-four'

/** A YYYY-MM month, or null. */
export function cleanMonth(v: unknown): string | null {
  return typeof v === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(v) ? v : null
}

/** This month in London as YYYY-MM. */
export function londonMonth(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit' }).format(now).slice(0, 7)
}
