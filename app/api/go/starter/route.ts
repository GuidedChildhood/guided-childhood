import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { starterCtaToken } from '@/lib/email'
import { APP_ORIGIN } from '@/lib/config/site'

export const dynamic = 'force-dynamic'

// The starter pack link from any pre sign up email, resolved on the click.
//
// A parent who has already joined should never be invited to go and start the
// thing they are already inside. The lead crons do check for an account before
// sending, but that check is exact address only, so someone who took a
// printable as you+test@gmail.com and joined as you@gmail.com reads as a
// stranger every time. Nor can any send time check know about an account made
// the next morning, while the email sits in the inbox for a fortnight.
//
// So the decision moves to the moment it is acted on, where both are known.
//
// Fail towards the pack. Every unknown here, a bad token, an unreachable
// database, an address we have never seen, ends at /starter-pack, which is
// where an unrecognised reader should land anyway. Nobody meets an error page
// because we could not work out who they were.

const APP = APP_ORIGIN

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('e') ?? ''
  const token = req.nextUrl.searchParams.get('k') ?? ''
  const addr = raw.trim().toLowerCase()

  const pack = NextResponse.redirect(`${APP}/starter-pack`, 302)
  if (!addr || !token || token !== starterCtaToken(addr)) return pack

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return pack

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    // ilike rather than eq: addresses are stored as the parent typed them, and
    // a capital letter is not a different person. No wildcards in addr, so this
    // is an exact match that ignores case.
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .ilike('email', addr)
      .limit(1)
      .maybeSingle()

    // The dashboard is behind auth, so a member who is signed out meets the
    // login page and arrives where they meant to go either way.
    if (data?.id) return NextResponse.redirect(`${APP}/dashboard`, 302)
  } catch {
    // Fall through to the pack. See the note above.
  }

  return pack
}
