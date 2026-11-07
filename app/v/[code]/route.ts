import { NextRequest, NextResponse } from 'next/server'
import { followLink, rememberLink, rememberUtm } from '@/lib/video/follow'
import { readUtm, utmQuery, VIA_PARAM, VIA_LINK } from '@/lib/video/utm'

// The source link, /v/<code> (migrations 372, 379 and 388).
//
// A film's caption, a LinkedIn first comment, a group seed, a Facebook post or
// the share action on the stage result carries this. It counts the follow,
// remembers which link sent the family in a cookie, and hands them to the
// stage check, where every way in lands (non negotiable 9). The stage check
// counts a start against the same code (/api/video-link/started) and
// /api/trial/start writes it onto the profile at the grant.
//
// Since 388 the post's UTMs come too (funnel audit, 6 November 2026): counted
// on the opened row, remembered for the start and the grant, and kept on the
// redirect so PostHog's $pageview sees them. Only the four cleaned utm_* values
// travel; any other parameter on the link is left behind. via=v tells the
// stage check this visit is already counted and came from a post, so it opens
// on question one.
//
// An unknown or switched off code still lands on the stage check, with no
// cookie and no count: a parent who typed it wrong meets the product, not an
// error page.

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const utm = readUtm(req.nextUrl.searchParams)
  const to = new URL('/starter-pack', req.nextUrl.origin)
  to.search = [`${VIA_PARAM}=${VIA_LINK}`, utmQuery(utm)].filter(Boolean).join('&')
  const code = await followLink(raw, utm)
  const res = NextResponse.redirect(to)
  rememberUtm(res, utm, Boolean(code))
  return code ? rememberLink(res, code) : res
}
