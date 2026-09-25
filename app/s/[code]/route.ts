import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { SCHOOL_LINK_COOKIE, SCHOOL_LINK_MAX_AGE_SECONDS, normaliseLinkCode } from '@/lib/school/link'

// The school link, /s/<code> (migration 353).
//
// A school puts this in its newsletter. It remembers which school sent the
// family, in a cookie, and hands them to the stage check, which is where every
// way in lands (non negotiable 9). /api/trial/start reads the cookie when the
// free days are granted and writes it onto the profile, once.
//
// An unknown or switched off code still lands on the stage check, with no
// cookie. A parent who typed the link wrong should meet the product, not an
// error page, and a code that says nothing true should not be remembered.

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = normaliseLinkCode(raw)
  const to = new URL('/starter-pack', req.nextUrl.origin)

  let known = false
  if (code) {
    try {
      const { data } = await createAdminClient()
        .from('school_links').select('code').eq('code', code).eq('active', true).maybeSingle()
      known = Boolean(data)
    } catch { /* the stage check is the fallback either way */ }
  }

  if (!known) return NextResponse.redirect(to)

  to.searchParams.set('school', code!)
  const res = NextResponse.redirect(to)
  res.cookies.set(SCHOOL_LINK_COOKIE, code!, {
    maxAge: SCHOOL_LINK_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  return res
}
