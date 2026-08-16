import { createAdminClient } from '@/lib/supabase/admin'
import { TRIAL_DAYS } from '@/lib/access'

// ── THE TERMS OF THE OFFER, READ FROM THE DATABASE ──────────────────────────
//
// Justin, 14 August 2026, on the two path sign up: the trial limits are
// "configurable, not hardcoded".
//
// Two numbers decide what four free days are actually worth: how many days,
// and how many times DiGi answers in one of them. Both were constants. The
// DiGi cap was `const FREE_DAILY_LIMIT = 3` halfway down a 900 line route
// file, and moving it to two meant a deploy and a build. They are pricing
// decisions, and pricing decisions belong in data.
//
// ── WHY IT STILL CARRIES ITS OWN NUMBERS ────────────────────────────────────
//
// Every read falls back, twice: to the seeded value from migration 201, and
// under that to the constant this file was written with. A configuration
// table that can take the product down is worse than the constants it
// replaced, and this one sits in front of the trial, which is the first four
// days of every single family's experience.
//
// So the failure modes are all boring. No service key (the marketing Vercel
// project has none): fallbacks. Table missing because 196 has not been run
// yet: fallbacks. Row deleted, value nonsense, database slow: fallbacks. A
// wrong number is a pricing bug somebody notices. A thrown error is a parent
// who cannot finish signing up.
//
// ── THE CACHE ───────────────────────────────────────────────────────────────
//
// One round trip a minute per warm lambda. These values change roughly never,
// and the callers are on paths a parent is waiting on: the sign up choice, the
// checkout redirect, every DiGi message. Sixty seconds is short enough that
// Justin changing a number sees it inside a minute and long enough that the
// table is not read on every keystroke.

export type TrialConfig = {
  /** Free days on both paths. Also the Stripe trial_period_days. */
  days: number
  /** DiGi messages a day while the trial is running, on both paths. */
  digiDailyLimit: number
}

// The floor under everything. TRIAL_DAYS is imported rather than repeated so
// the pure gate in lib/access.ts and this reader can never disagree about what
// four means when the database is unreachable.
const FALLBACK: TrialConfig = {
  days: TRIAL_DAYS,
  digiDailyLimit: 3,
}

const CACHE_MS = 60_000

let cached: { at: number; value: TrialConfig } | null = null

/** A jsonb number, defended against every shape it could come back as. */
function asPositiveInt(raw: unknown, fallback: number): number {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n)) return fallback
  const rounded = Math.round(n)
  return rounded > 0 ? rounded : fallback
}

export async function getTrialConfig(): Promise<TrialConfig> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value

  let value = FALLBACK
  try {
    const { data } = await createAdminClient()
      .from('platform_config')
      .select('key, value')
      .in('key', ['trial_days', 'trial_digi_daily_limit'])

    const byKey = new Map((data ?? []).map(r => [r.key as string, r.value]))
    value = {
      days: asPositiveInt(byKey.get('trial_days'), FALLBACK.days),
      digiDailyLimit: asPositiveInt(byKey.get('trial_digi_daily_limit'), FALLBACK.digiDailyLimit),
    }
  } catch {
    // Named in the comment above and deliberately silent here: every caller
    // is on a path a parent is waiting on, and the fallback is the same
    // number the table was seeded with.
    value = FALLBACK
  }

  cached = { at: Date.now(), value }
  return value
}

/** The moment the free days run out, counted from now. */
export async function trialEndsAtFromNow(): Promise<string> {
  const { days } = await getTrialConfig()
  return new Date(Date.now() + days * 86400000).toISOString()
}
