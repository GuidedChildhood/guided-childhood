import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service role client for routes with no user session (webhooks, cron).
// The codebase has historically used two names for the same secret
// (SUPABASE_SERVICE_KEY in the env template and the Stripe webhook,
// SUPABASE_SERVICE_ROLE_KEY in the school inbound route), so this accepts
// either and every new route goes through here instead of picking a side.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminClient = SupabaseClient<any, 'public', any>

export function createAdminClient(): AdminClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (!key) throw new Error('Missing SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}
