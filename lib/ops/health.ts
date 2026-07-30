import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { JOBS, CRITICAL, type Job } from './jobs'

// One read that answers: is anything broken right now?
//
// Two different questions live here and they fail in different ways, so they
// are checked differently.
//
// Config is checked by looking. A missing RESEND_API_KEY makes the email cron
// return "skipped" and stop, which from outside looks exactly like a morning
// when nobody was due anything. That class of fault is invisible in the data
// and obvious in the environment, so the environment is what gets read.
//
// Crons are checked by absence. A job that is dead does not write a row, so the
// heartbeat is judged on how long it has been since the last one against how
// long the schedule says it should be. This is the only check that can catch a
// job which stops being scheduled at all, which is what happened to the digest.

type Client = SupabaseClient

export type Level = 'ok' | 'warn' | 'down'

export type Check = {
  key: string
  label: string
  level: Level
  headline: string
  detail: string
}

export type JobHealth = {
  job: Job
  level: Level
  lastRunAt: string | null
  lastOk: boolean | null
  lastProcessed: number | null
  lastError: string | null
  hoursSince: number | null
  overdueBy: number | null   // hours past the expected gap, null when on time
  failures7d: number
  runs7d: number
}

export type Health = {
  level: Level
  checkedAt: string
  services: Check[]
  jobs: JobHealth[]
  summary: { down: number; warn: number; ok: number }
}

const WORST: Record<Level, number> = { ok: 0, warn: 1, down: 2 }
export function worst(levels: Level[]): Level {
  return levels.reduce<Level>((acc, l) => (WORST[l] > WORST[acc] ? l : acc), 'ok')
}

function admin(): Client | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * The environment checks.
 *
 * Config only, no outbound calls. A live ping to Resend or Stripe on every page
 * load would spend real quota to answer a question the key's presence already
 * answers, and would make the board itself flaky when a provider is briefly
 * slow. Whether a key actually works is proved by the heartbeat: a job that
 * runs and reports sends is a working key, and no ping is more convincing than
 * that.
 */
export function serviceChecks(env: NodeJS.ProcessEnv = process.env): Check[] {
  const has = (k: string) => Boolean(env[k]?.trim())

  const checks: Check[] = []

  checks.push(
    has('RESEND_API_KEY')
      ? {
          key: 'resend', label: 'Email (Resend)', level: 'ok',
          headline: 'Configured',
          detail: `Sending as ${env.EMAIL_FROM?.trim() || 'the default from address'}.`,
        }
      : {
          key: 'resend', label: 'Email (Resend)', level: 'down',
          headline: 'No API key',
          detail: 'Every email cron returns skipped and stops. Nobody receives anything, and nothing errors.',
        },
  )

  const supabaseReady = has('NEXT_PUBLIC_SUPABASE_URL') && (has('SUPABASE_SERVICE_KEY') || has('SUPABASE_SERVICE_ROLE_KEY'))
  checks.push(
    supabaseReady
      ? { key: 'supabase', label: 'Database', level: 'ok', headline: 'Configured', detail: 'URL and service key both present.' }
      : { key: 'supabase', label: 'Database', level: 'down', headline: 'Not configured', detail: 'Without the service key no cron can read or write anything.' },
  )

  const stripeKeys = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_FOUNDER', 'STRIPE_PRICE_STANDARD']
  const missingStripe = stripeKeys.filter(k => !has(k))
  checks.push(
    missingStripe.length === 0
      ? { key: 'stripe', label: 'Payments (Stripe)', level: 'ok', headline: 'Configured', detail: 'Secret, webhook and the founder and standard prices are all set.' }
      : {
          key: 'stripe', label: 'Payments (Stripe)', level: 'down',
          headline: `${missingStripe.length} value${missingStripe.length === 1 ? '' : 's'} missing`,
          detail: `${missingStripe.join(', ')} not set. Checkout fails or the webhook never confirms the upgrade.`,
        },
  )

  checks.push(
    has('ANTHROPIC_API_KEY')
      ? {
          key: 'digi', label: 'DiGi', level: 'ok', headline: 'Configured',
          detail: `Model ${env.DIGI_MODEL?.trim() || 'claude-fable-5'} (the default applies when DIGI_MODEL is unset).`,
        }
      : { key: 'digi', label: 'DiGi', level: 'down', headline: 'No API key', detail: 'DiGi cannot reply. Every pathway request fails.' },
  )

  checks.push(
    has('CRON_SECRET')
      ? { key: 'cron_secret', label: 'Cron auth', level: 'ok', headline: 'Configured', detail: 'Scheduled jobs can authenticate.' }
      : { key: 'cron_secret', label: 'Cron auth', level: 'down', headline: 'Not set', detail: 'Every scheduled job returns 401 and does nothing at all.' },
  )

  return checks
}

/**
 * Judge each job on its heartbeat.
 *
 * A job with no row ever is warn rather than down: on a freshly deployed
 * monitor that is simply a job whose turn has not come round yet, and opening
 * with a wall of red would teach the reader to ignore the board on day one.
 * Once a job has run, silence past its schedule is a real fault and reads as one.
 */
export async function jobHealth(supabase: Client | null = admin(), now = Date.now()): Promise<JobHealth[]> {
  if (!supabase) {
    return JOBS.map(job => ({
      job, level: 'warn' as Level, lastRunAt: null, lastOk: null, lastProcessed: null,
      lastError: null, hoursSince: null, overdueBy: null, failures7d: 0, runs7d: 0,
    }))
  }

  // One row per job, straight from the database.
  //
  // Not a capped read picked over in JavaScript. The jobs run at wildly
  // different rates, so any "most recent N rows" is almost entirely the every
  // minute job within a day, and the weekly and monthly ones drop off the end
  // and read as never having run. See cron_job_status in migration 130.
  type StatusRow = {
    job: string
    started_at: string
    ok: boolean | null
    processed: number | null
    error: string | null
    runs_7d: number
    failures_7d: number
  }

  const { data } = await supabase.rpc('cron_job_status')
  const lastByJob = new Map<string, StatusRow>()
  for (const row of (data ?? []) as StatusRow[]) lastByJob.set(row.job, row)

  return JOBS.map(job => {
    const last = lastByJob.get(job.path) ?? null
    const runs7d = last ? Number(last.runs_7d ?? 0) : 0
    const failures7d = last ? Number(last.failures_7d ?? 0) : 0

    if (!last) {
      return {
        job, level: 'warn' as Level, lastRunAt: null, lastOk: null, lastProcessed: null,
        lastError: null, hoursSince: null, overdueBy: null, failures7d, runs7d,
      }
    }

    const since = now - new Date(last.started_at).getTime()
    const hoursSince = Math.floor(since / 3600000)
    const overdue = since > job.expectedGapMs ? Math.floor((since - job.expectedGapMs) / 3600000) : null

    // Ordered worst first: a job that is both failing and overdue is a down job,
    // and the overdue reading is the more useful of the two to show.
    let level: Level = 'ok'
    if (overdue !== null) level = CRITICAL.has(job.path) ? 'down' : 'warn'
    else if (last.ok === false) level = 'down'
    else if (last.ok === null && last.started_at) level = 'warn' // started, never reported back
    else if (failures7d > 0) level = 'warn'

    return {
      job, level, lastRunAt: last.started_at, lastOk: last.ok, lastProcessed: last.processed,
      lastError: last.error, hoursSince, overdueBy: overdue, failures7d, runs7d,
    }
  })
}

export async function readHealth(now = Date.now()): Promise<Health> {
  const services = serviceChecks()
  const jobs = await jobHealth(admin(), now)
  const levels = [...services.map(s => s.level), ...jobs.map(j => j.level)]

  return {
    level: worst(levels),
    checkedAt: new Date(now).toISOString(),
    services,
    jobs,
    summary: {
      down: levels.filter(l => l === 'down').length,
      warn: levels.filter(l => l === 'warn').length,
      ok: levels.filter(l => l === 'ok').length,
    },
  }
}
