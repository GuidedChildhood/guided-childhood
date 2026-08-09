import { createClient } from '@supabase/supabase-js'

// The ONLY Supabase client in the schools app, and the whole point of it:
// the plain anon key with no cookies, no session and no auth state. It can
// read exactly what the database's RLS says the world may read, which for
// this app is the school_lessons content ("School lessons are public",
// migration 023). There is no server client, no admin client and no way to
// ask who the visitor is; the wiring check (check 7) fails the build if one
// ever appears here.
//
// The build placeholder keeps `next build` green on a machine with no env,
// the same pattern the parents app uses; the real values always win on
// Vercel.
export const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-placeholder',
  { auth: { persistSession: false, autoRefreshToken: false } }
)
