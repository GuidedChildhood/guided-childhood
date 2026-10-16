// The four day re engagement line, as a rule (app/api/push/reengage).
//
// A parent who has been quiet for QUIET_DAYS or more gets one warm DiGi nudge,
// never more than one every MIN_GAP_DAYS. It is deliberately independent of the
// nightly evening push: when the evening goes quiet after seven unanswered
// nights (lib/push/evening.ts), this is the only line that keeps reaching them.

export const REENGAGE_QUIET_DAYS = 3
export const REENGAGE_MIN_GAP_DAYS = 4

/**
 * Should this parent get the nudge today?
 * quietDays: whole days since they last showed up.
 * daysSinceLastNudge: whole days since the last one, or null if never.
 */
export function reengageDue(quietDays: number, daysSinceLastNudge: number | null): boolean {
  if (quietDays < REENGAGE_QUIET_DAYS) return false
  if (daysSinceLastNudge !== null && daysSinceLastNudge < REENGAGE_MIN_GAP_DAYS) return false
  return true
}
