import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_LINK_COOKIE, VIDEO_STARTED_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, normaliseLinkCode } from '@/lib/video/link'

// The video link, /v/<code> (migration 372).
//
// A film's caption or bio carries this. It counts the follow, remembers which
// film sent the family in a cookie, and hands them to the stage check, where
// every way in lands (non negotiable 9). The stage check counts a start
// against the same code (/api/video-link/started) and /api/trial/start writes
// it onto the profile at the grant.
//
// An unknown or switched off code still lands on the stage check, with no
// cookie and no count: a parent who typed it wrong meets the product, not an
// error page.

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = normaliseLinkCode(raw)
  const to = new URL('/starter-pack', req.nextUrl.origin)

  let known = false
  if (code) {
    try {
      const admin = createAdminClient()
      const { data } = await admin.from('video_links').select('code').eq('code', code).eq('active', true).maybeSingle()
      known = Boolean(data)
      if (known) await admin.from('video_link_events').insert({ code, kind: 'opened' })
    } catch { /* the stage check is the fallback either way */ }
  }

  if (!known) return NextResponse.redirect(to)

  const res = NextResponse.redirect(to)
  const cookie = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' }
  res.cookies.set(VIDEO_LINK_COOKIE, code!, { ...cookie, maxAge: VIDEO_LINK_MAX_AGE_SECONDS })
  // A new follow of a film link is a new chance to start, so the start marker
  // from any earlier film is cleared.
  res.cookies.set(VIDEO_STARTED_COOKIE, '', { ...cookie, maxAge: 0 })
  return res
}
