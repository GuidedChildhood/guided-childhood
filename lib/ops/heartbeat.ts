import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The wrapper every scheduled job goes through so that "did it run?" has an
// answer.
//
// Two rules shape all of this:
//
// 1. The heartbeat must never break the job. A monitoring table that can take
//    down the digest is worse than no monitoring at all, so every write here is
//    wrapped and every failure swallowed. A missing heartbeat row costs an
//    amber square on a board. A thrown heartbeat costs a parent their email.
//
// 2. The start row is written before the work, not after. A job killed by a
//    timeout never reaches its own finally block on Vercel, so a row with
//    finished_at still null is exactly the signal wanted: it started and never
//    came back. Writing only on success would make a timeout look like a job
//    that never ran, which is the confusion this whole table exists to end.

type Client = SupabaseClient

function admin(): Client | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * The count a run should be judged by, dug out of whatever the route replies.
 *
 * Routes were written long before this table and answer in their own words:
 * the digest says `sent`, the age up sweep says `moved`, the push crons say
 * `delivered`. Rather than rewrite twenty three replies to satisfy a monitor,
 * the monitor reads the shapes already in use. Unknown shapes record null,
 * which the board shows as "ran, count unknown" rather than a misleading zero.
 */
/**
 * Whether a reply that arrived as 200 is actually reporting a failure.
 *
 * The status code is not the whole truth in this codebase. The push cron spent
 * weeks answering 200 with {"error":{"code":"401","message":"Protected
 * deployment"}} in its body, having delivered nothing at all, and a monitor
 * reading only the status would have shown it green the entire time. That is
 * the same false health this subsystem exists to end, so the body gets read.
 *
 * Only the singular `error` counts. Several routes report `errors: 0` as an
 * ordinary tally, and a run that carefully tells you nothing went wrong must
 * never be marked as having gone wrong.
 */
export function bodyReportsFailure(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  const err = b.error
  if (err === null || err === undefined) return false
  if (typeof err === 'string') return err.trim().length > 0
  if (typeof err === 'object') return Object.keys(err as object).length > 0
  return Boolean(err)
}

export function processedFrom(body: unknown): number | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  for (const field of ['processed', 'sent', 'delivered', 'moved', 'updated', 'created', 'count', 'due']) {
    const v = b[field]
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  return null
}

export type RunHandle = { finish(body: unknown, ok?: boolean): Promise<void>; fail(err: unknown): Promise<void> }

const NOOP: RunHandle = { async finish() {}, async fail() {} }

/**
 * Open a heartbeat for a job. Always returns a handle, even when the database
 * is unreachable, so callers never branch on whether monitoring is available.
 */
export async function beginRun(job: string): Promise<RunHandle> {
  const supabase = admin()
  if (!supabase) return NOOP

  const startedAt = Date.now()
  let id: string | null = null
  try {
    const { data } = await supabase
      .from('cron_runs')
      .insert({ job, started_at: new Date(startedAt).toISOString() })
      .select('id')
      .single()
    id = (data as { id?: string } | null)?.id ?? null
  } catch {
    return NOOP
  }
  if (!id) return NOOP

  const close = async (patch: Record<string, unknown>) => {
    try {
      await supabase
        .from('cron_runs')
        .update({ finished_at: new Date().toISOString(), duration_ms: Date.now() - startedAt, ...patch })
        .eq('id', id)
    } catch {
      // Swallowed on purpose. See rule 1 above.
    }
  }

  return {
    async finish(body, ok = true) {
      // The reply is stored verbatim. When a job misbehaves months from now the
      // question is always "what did it actually say", and a summarised number
      // cannot answer it.
      await close({ ok, processed: processedFrom(body), detail: body ?? null })
    },
    async fail(err) {
      const message = err instanceof Error ? err.message : String(err)
      await close({ ok: false, error: message.slice(0, 2000) })
    },
  }
}

/**
 * Wrap a route handler so it records itself.
 *
 * Deliberately transparent: the wrapped handler returns exactly what the
 * original returned, including its status code, and rethrows exactly what the
 * original threw. Adding monitoring must not change a single response a cron
 * gives, or the monitoring becomes a thing to debug in its own right.
 *
 * An unauthorised call records nothing. Vercel's scheduler always carries the
 * secret, so a 401 is someone probing the URL, and probes are not runs.
 */
export function withHeartbeat<T extends unknown[]>(
  job: string | ((...args: T) => string),
  handler: (...args: T) => Promise<Response>,
): (...args: T) => Promise<Response> {
  return async (...args: T) => {
    let run: RunHandle = NOOP
    let opened = false

    try {
      const response = await (async () => {
        // A function form exists for the one route serving several schedules:
        // job reminders is three cron entries separated only by ?band=, and
        // recording them under one name would hide a single band going quiet.
        run = await beginRun(typeof job === 'function' ? job(...args) : job)
        opened = true
        return handler(...args)
      })()

      if (response.status === 401) {
        // Not a run. Remove the row rather than leave a phantom start.
        await run.finish({ unauthorised: true }, false)
        return response
      }

      // Reading the body consumes the stream, so it is cloned first and the
      // original handed back untouched.
      let body: unknown = null
      try {
        body = await response.clone().json()
      } catch {
        body = null
      }
      await run.finish(body, response.ok && !bodyReportsFailure(body))
      return response
    } catch (err) {
      if (opened) await run.fail(err)
      throw err
    }
  }
}
