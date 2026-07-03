import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service role client for routes that run without a user session (cron,
// webhooks, inbound mail). Accepts either env var name because the
// project has historically used both: SUPABASE_SERVICE_KEY (Stripe
// webhook, push) and SUPABASE_SERVICE_ROLE_KEY (school inbound). With
// this, whichever one is set in Vercel works everywhere.
export function createAdminClient(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('No Supabase service key configured')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}
