import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { announceSignup } from '@/lib/ops/signup-alert'

// The email and password way in never passes /auth/callback, so the starter
// pack posts here once the new session exists. The user comes from the
// session cookie, never from the body, and lib/ops/signup-alert.ts decides
// whether this account is new and not yet announced. Always 200: the parent's
// next screen never waits on, or learns about, the founder's alert.
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await announceSignup(user)
  } catch { /* best effort */ }
  return NextResponse.json({ ok: true })
}
