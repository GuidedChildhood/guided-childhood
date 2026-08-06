// One row per device, at send time.
//
// Justin, 6 August 2026: "Every reminder eg jobs or agree timer seems to send 4
// pwas to child's phone." Teo had five subscriptions to one phone.
//
// Migration 166 cleans the table and gives new rows a device_id, but this is
// the layer that has to hold regardless, because it is the one the child feels.
// A row can still slip in between the delete and the write in a subscribe, an
// older client can subscribe without a device_id, and a family can be halfway
// through the migration. None of that should reach a phone as a second buzz.
//
// So every sender runs its rows through here first, and the rule is simple:
// send once per device, newest wins.

/** The fields this needs. Any subscription row satisfies it. */
export type DeviceRow = {
  endpoint: string
  device_id?: string | null
  child_id?: string | null
  updated_at?: string | null
  created_at?: string | null
}

/**
 * The push service host, which is the best device identity available for a row
 * written before device_id existed.
 *
 * One phone talks to exactly one push service: an iPhone to
 * web.push.apple.com, an Android or desktop Chrome to fcm.googleapis.com. So
 * two rows for one child on the same host are almost always one phone that
 * resubscribed, which is precisely the pile up.
 *
 * A malformed endpoint falls back to the endpoint itself, so it groups with
 * nothing and is sent to rather than silently dropped. Losing a real
 * notification is worse than sending one extra.
 */
export function platformKey(endpoint: string): string {
  try {
    return new URL(endpoint).host
  } catch {
    return endpoint
  }
}

/** Newest first, so the first row seen for a device is the one to keep. */
function freshness(r: DeviceRow): number {
  const t = Date.parse(r.updated_at ?? r.created_at ?? '')
  return Number.isNaN(t) ? 0 : t
}

/**
 * Collapse subscription rows down to one per device.
 *
 * Keyed on device_id when the row has one, because that is a real device and
 * two genuine phones on the same push service must both still be reached. Rows
 * without one fall back to the push host, which over counts devices never and
 * under counts them only for a family running two browsers of the same kind on
 * the same account, who resubscribe on their next visit and get a device_id.
 *
 * The child_id is part of the key as well. Two children in one house on two
 * phones both reach Apple, and grouping on the host alone would have silenced
 * one of them, which is a far worse bug than the one this fixes.
 */
export function oneRowPerDevice<T extends DeviceRow>(rows: T[]): T[] {
  const best = new Map<string, T>()
  for (const r of [...rows].sort((a, b) => freshness(b) - freshness(a))) {
    const key = `${r.child_id ?? '-'}|${r.device_id ?? `host:${platformKey(r.endpoint)}`}`
    if (!best.has(key)) best.set(key, r)
  }
  return [...best.values()]
}
