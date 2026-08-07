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

// BEFORE MIGRATION 166 LANDS.
//
// device_id is added by migration 166, and migrations here are run by hand in
// the Supabase editor, so there is always a window where the deployed code
// knows about a column the database does not have. Every other read in this
// codebase fails soft across that window. These did not, and it cost the whole
// product its notifications:
//
//   sendPush selected device_id, PostgREST answered 42703 column does not
//   exist, and the very next line is `if (error) return { sent: 0 }`. Correct
//   handling of a read that failed, and the read failed for every family, every
//   time, so nothing was sent to anybody.
//
//   pushToChild swallowed the same error into a null and returned early.
//
//   Both subscribe routes wrote device_id, so the insert failed too and turning
//   reminders on answered 500.
//
// Justin, 6 August 2026: "Pwas are not firing once."
//
// So the column set is asked for, and if the database has not got there yet the
// read is made again without it. One extra round trip only on the failure path,
// and it disappears by itself the moment 166 runs.
export const DEVICE_COLUMNS = 'endpoint, p256dh, auth, device_id, child_id, updated_at, created_at'
export const LEGACY_COLUMNS = 'endpoint, p256dh, auth, child_id, updated_at, created_at'

/**
 * True when a failed query is Postgres saying it has never heard of a column.
 *
 * Narrow on purpose. Any other failure, a timeout, a permission problem, the
 * database being down, must still surface as an error: retrying those without
 * device_id would turn a real outage into a silent half working send, which is
 * the exact shape of fault this file exists to stop.
 */
export function isMissingColumn(err: unknown, column: string): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { code?: string; message?: string }
  // 42703 is Postgres. PGRST204 is PostgREST's own schema cache miss, which is
  // what a write gets when the column is not in its cached schema yet.
  if (e.code === '42703' || e.code === 'PGRST204') return true
  return typeof e.message === 'string' && e.message.includes(column)
}

/** The fields this needs. Any subscription row satisfies it. */
export type DeviceRow = {
  endpoint: string
  device_id?: string | null
  child_id?: string | null
  updated_at?: string | null
  created_at?: string | null
}

/**
 * A subscription row as the senders use it: enough to dedupe AND to send.
 *
 * Named here because selecting with a column list held in a variable, which the
 * fallback above requires, costs the generated row type: supabase-js can only
 * infer the shape from a string literal it can see. So the callers assert this
 * instead, and the assertion is honest as long as both column lists above
 * contain endpoint, p256dh and auth, which is the whole point of them.
 */
export type PushRow = DeviceRow & { p256dh: string; auth: string }

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
