import { createClient } from '@supabase/supabase-js'

// The ONLY Supabase client in the schools app, and the whole point of it:
// the plain anon key with no cookies, no session and no auth state. It can
// read exactly what the database's RLS says may be read, which for this app
// is the school_lessons content and nothing else. There is no server client,
// no admin client and no way to ask who the visitor is; the wiring check
// (check 7) fails the build if one ever appears here. Who may SEE these
// pages is decided one layer up, by the access cookie in proxy.ts, not here.
//
// DEFAULT SCHEMA. Migration 177 moved school_lessons out of public and into
// the schools schema at the split cutover, and this client was never told,
// so every content page was quietly querying a table that no longer exists
// there. That is why the live site showed an empty catalogue on launch day
// while the invoice form kept working: pricing/actions.ts is the one caller
// that named .schema('schools') by hand. Setting the default here fixes all
// twelve call sites at once and means nobody has to remember again. An
// explicit .schema() on a query still wins, so the invoice insert is
// unaffected.
//
// The build placeholder keeps `next build` green on a machine with no env,
// the same pattern the parents app uses; the real values always win on
// Vercel.
export const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'schools' },
  }
)
