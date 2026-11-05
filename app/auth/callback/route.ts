import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { announceSignup } from '@/lib/ops/signup-alert'
import { safeNext } from '@/lib/auth/safe-next'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Checked, never glued on raw: next=@evil.example made the redirect below
  // https://our.site@evil.example, which is another host (lib/auth/safe-next.ts).
  const next = safeNext(searchParams.get('next')) ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Google, Apple and email confirmation all land here the first time an
      // account gets a session. The alert only fires for an account made in
      // the last two days and only once (lib/ops/signup-alert.ts), so a
      // returning member signing in sends nothing.
      await announceSignup(data.user)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
