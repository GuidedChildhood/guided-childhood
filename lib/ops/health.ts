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

  // Meaning search. A missing key is a CHOICE, not a fault: DiGi falls back to
  // keyword matching and every answer still works, so it is amber and stays on
  // the board rather than landing in an inbox. The fault case is the one below,
  // where the key is present and the bank still is not embedded.
  checks.push(
    has('EMBEDDING_API_KEY')
      ? {
          key: 'embeddings', label: 'Meaning search', level: 'ok', headline: 'Configured',
          detail: `Provider ${env.EMBEDDING_API_KEY?.trim().startsWith('sk-') ? 'OpenAI' : 'Voyage'}, so DiGi finds research and memories by what a parent means rather than the words they typed.`,
        }
      : {
          key: 'embeddings', label: 'Meaning search', level: 'warn', headline: 'Not set',
          detail: 'EMBEDDING_API_KEY is absent, so retrieval falls back to keyword matching. It works, and it is what misses the parent who describes a worry rather than naming it.',
        },
  )

  checks.push(
    has('CRON_SECRET')
      ? { key: 'cron_secret', label: 'Cron auth', level: 'ok', headline: 'Configured', detail: 'Scheduled jobs can authenticate.' }
      : { key: 'cron_secret', label: 'Cron auth', level: 'down', headline: 'Not set', detail: 'Every scheduled job returns 401 and does nothing at all.' },
  )

  return checks
}


/**
 * Columns the code cannot run without.
 *
 * This exists because of the worst outage this product has had. trial_ends_at
 * was added to the repo on 24 July in the same commit as the code that selects
 * it, and the migration was never applied. Every query naming it failed from
 * that moment: all three email crons, the DiGi paywall, agreement, rehearse,
 * rightnow, printables and the kid lesson pages. PostgREST returns an error,
 * the routes destructure only `data`, and `?? []` turns a broken query into
 * "nobody was due" and replies 200. It ran silently for five weeks and was
 * found by hand.
 *
 * Config checks could never have caught it. Every key was set. The heartbeat
 * could not either: the crons ran, and cheerfully reported nothing to do.
 *
 * So the board asks the database directly whether the columns exist. Listed by
 * hand rather than derived from the migrations folder, because the question
 * that matters is not "is every migration applied" but "can the code that runs
 * today actually read what it asks for". A column removed by hand in the
 * dashboard is caught by this and would be missed by a migration count.
 *
 * Add a row here whenever a column becomes load bearing. It costs one line and
 * buys back five weeks.
 */
const REQUIRED_COLUMNS: { table: string; column: string; breaks: string }[] = [
  { table: 'profiles', column: 'trial_ends_at', breaks: 'every email cron, the DiGi paywall, agreement, rehearse, rightnow and printables' },
  { table: 'profiles', column: 'onboarding_complete', breaks: 'the weekly digest picks nobody' },
  { table: 'profiles', column: 'email_opt_out', breaks: 'the weekly digest picks nobody' },
  { table: 'profiles', column: 'school_region', breaks: 'holiday dates fall back to the UK for every family' },
  { table: 'children', column: 'age_band', breaks: 'the stage a child is on, everywhere' },
  { table: 'family_quests', column: 'band', breaks: 'job reminders fire at the wrong time of day' },
  { table: 'family_quests', column: 'schedule_days', breaks: 'jobs set to certain days run every day' },
  { table: 'email_log', column: 'email_key', breaks: 'emails send twice or not at all' },
  { table: 'cron_runs', column: 'job', breaks: 'this board' },
  { table: 'spotlight_shown', column: 'spotlight_key', breaks: 'the weekly spotlight repeats itself' },
  { table: 'push_subscriptions', column: 'device_id', breaks: 'every push send, silently: the route replies 200 with the failure in the body' },
]

/**
 * Ask the database which of those it actually has.
 *
 * One read of information_schema rather than a probe per column, so this stays
 * cheap enough to run on every page load.
 */
export async function schemaChecks(supabase: Client | null = admin()): Promise<Check[]> {
  if (!supabase) {
    return [{
      key: 'schema', label: 'Database schema', level: 'warn',
      headline: 'Not checked', detail: 'No service key, so the columns could not be read.',
    }]
  }

  try {
    const { data, error } = await supabase.rpc('required_columns_present', {
      wanted: REQUIRED_COLUMNS.map(c => `${c.table}.${c.column}`),
    })
    if (error) throw new Error(error.message)

    const present = new Set((data ?? []) as string[])
    const missing = REQUIRED_COLUMNS.filter(c => !present.has(`${c.table}.${c.column}`))

    if (missing.length === 0) {
      return [{
        key: 'schema', label: 'Database schema', level: 'ok',
        headline: `All ${REQUIRED_COLUMNS.length} columns present`,
        detail: 'Every column the running code depends on exists in the database.',
      }]
    }

    return missing.map(m => ({
      key: `schema:${m.table}.${m.column}`,
      label: `Missing column ${m.table}.${m.column}`,
      level: 'down' as Level,
      headline: 'The code asks for this and it is not there',
      detail: `Breaks ${m.breaks}. Queries naming it fail, and the routes read the failure as an empty result, so it looks like there was nothing to do. Apply the migration that adds it.`,
    }))
  } catch (e) {
    return [{
      key: 'schema', label: 'Database schema', level: 'warn',
      headline: 'Could not be checked',
      detail: e instanceof Error ? e.message : 'The column list could not be read.',
    }]
  }
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

/**
 * Is the research bank actually searchable by meaning.
 *
 * Justin: "can we have a routine that checks this board for me, or should I be
 * doing that check?"
 *
 * Neither. A board somebody has to remember to read is the same failure as a
 * query somebody has to remember to run, only prettier, and the whole reason
 * this needed a check is that it breaks WITHOUT LOOKING BROKEN. So it joins the
 * sweep that already runs every morning and only writes to him when something
 * is genuinely down.
 *
 * The level is chosen carefully. No key at all is amber, because that is a
 * decision and the product still works. A key present with findings still
 * unembedded is DOWN, because the daily sweep exists precisely to stop that and
 * its continued existence means the sweep is not working.
 */
export async function knowledgeCheck(supabase: Client | null = admin()): Promise<Check[]> {
  if (!supabase || !process.env.EMBEDDING_API_KEY?.trim()) return []
  try {
    const [total, embedded] = await Promise.all([
      supabase.from('expert_knowledge').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('expert_knowledge').select('id', { count: 'exact', head: true }).eq('active', true).not('embedding', 'is', null),
    ])
    const t = total.count ?? 0
    const e = embedded.count ?? 0
    if (t === 0) return []
    return [
      e >= t
        ? { key: 'knowledge_embedded', label: 'Research bank', level: 'ok', headline: `${e} of ${t} searchable`, detail: 'Every active finding has a meaning vector.' }
        : {
            key: 'knowledge_embedded', label: 'Research bank', level: 'down',
            headline: `${t - e} of ${t} unreachable`,
            detail: 'The key is set but these findings have no vector, so they can only be found if a parent happens to type a matching word. The daily embed sweep should have fixed this, so it is not running or it is failing.',
          },
    ]
  } catch {
    // Pre migration 142 the column does not exist. Silence is right: a check
    // that shouts about a feature not yet installed is noise.
    return []
  }
}

export async function readHealth(now = Date.now()): Promise<Health> {
  const [schema, jobs, knowledge] = await Promise.all([schemaChecks(), jobHealth(admin(), now), knowledgeCheck()])
  const services = [...serviceChecks(), ...schema, ...knowledge]
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
