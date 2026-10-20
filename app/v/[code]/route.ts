import { NextRequest, NextResponse } from 'next/server'
import { followLink, rememberLink } from '@/lib/video/follow'

// The source link, /v/<code> (migrations 372 and 379).
//
// A film's caption, a LinkedIn first comment, a group seed, a Facebook post or
// the share action on the stage result carries this. It counts the follow,
// remembers which link sent the family in a cookie, and hands them to the
// stage check, where every way in lands (non negotiable 9). The stage check
// counts a start against the same code (/api/video-link/started) and
// /api/trial/start writes it onto the profile at the grant.
//
// An unknown or switched off code still lands on the stage check, with no
// cookie and no count: a parent who typed it wrong meets the product, not an
// error page.

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const to = new URL('/starter-pack', req.nextUrl.origin)
  const code = await followLink(raw)
  const res = NextResponse.redirect(to)
  return code ? rememberLink(res, code) : res
}
