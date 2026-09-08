import { createClient } from '@supabase/supabase-js'

// THE ONLY SUPABASE CLIENT IN THE SCHOOLS APP, AND IT IS SERVER ONLY.
//
// This file used to be anon.ts and used to hold the public anon key. The
// comment on it said the key "can read exactly what the database's RLS says
// may be read", which was true and was the problem: RLS said the whole
// curriculum was public.
//
// WHAT WAS WRONG. The access gate in proxy.ts is real and fails closed, so
// nobody browsed to a lesson page without a school code. But the gate
// protects the PAGES, not the CONTENT. schools.school_lessons carried an RLS
// policy of USING (true) and the anon role held SELECT on it, so anyone could
// call the database API directly and read all 21 modules, 479 slides, every
// exit quiz answer key and every DSL note. Verified on 8 September by running
// the query as the anon role.
//
// And the key was not secret. It is NEXT_PUBLIC_SUPABASE_ANON_KEY, published
// by design, and the parents app ships it to every browser through
// createBrowserClient. Thirty seconds in devtools was the whole attack.
//
// WHAT CHANGED. Justin chose the fix on 8 September: the content is served
// only through this server, never reachable from a browser or from the API
// directly. So this client now authenticates with the service role key and
// the anon role's read on schools.school_lessons is revoked (migration 274).
//
// THE RULE THAT REPLACES THE OLD ONE. The old rule was "anon key only, and
// the wiring check fails the build if a privileged client appears". That rule
// existed to stop a privileged key reaching a browser, which is still exactly
// right, so it is not dropped, it is re-pointed: this module must never be
// imported by a client component. The wiring check enforces it, and the guard
// below is the belt to that braces. Every one of the schools app's reads is
// already in a server component, which is what made this fix safe to make.
//
// IF YOU ARE ADDING A FEATURE HERE: this key can read the entire database,
// including family data in the parents app. Select the columns you need, never
// select * into something a page renders wholesale, and never pass a row from
// here into a client component without picking the fields first.
if (typeof window !== 'undefined') {
  throw new Error(
    'schools/lib/supabase/server-db is server only. It holds a key that can read ' +
    'the whole database, and importing it into a client component would publish ' +
    'that key to every browser. Read the data in a server component and pass down ' +
    'only the fields the component needs.'
  )
}

// The service role key when it is set, the anon key when it is not. That
// fallback is not a hole: after migration 274 the anon role cannot read
// school_lessons at all, so a deploy missing the key fails loudly with a
// permission error rather than quietly serving content it should not. The
// build placeholders keep `next build` green on a machine with no env.
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'build-placeholder'

// DEFAULT SCHEMA. Migration 177 moved school_lessons out of public and into
// the schools schema at the split cutover, and the old client was never told,
// so every content page was quietly querying a table that no longer existed
// there. That is why the live site showed an empty catalogue on launch day
// while the invoice form kept working: pricing/actions.ts was the one caller
// that named .schema('schools') by hand. Setting the default here fixes every
// call site at once. An explicit .schema() on a query still wins, so the
// invoice insert is unaffected.
export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  key,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'schools' },
  }
)
