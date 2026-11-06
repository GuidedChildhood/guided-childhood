import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLessonForShare } from '@/lib/quests/star-lesson-catalogue'
import {
  readParentShare, shareSecret, parentSharePath, shareCookieValue,
  SCHOOL_SHARE_COOKIE, SCHOOL_SHARE_COOKIE_SECONDS,
} from '@/lib/school/share'
import { HOME_CODE_COOKIE, HOME_CODE_COOKIE_SECONDS, normaliseHomeCode } from '@/lib/school/home-code'

// THE FREE ACCOUNT DOOR ON A SHARED LESSON (5 November 2026).
//
// The teaser's button comes through here, on the pattern of /s/<code> and
// /api/school-code/remember: remember what we need in cookies, then the
// starter pack, the one way an account is made (non negotiable 9), with
// ?next= back to the lesson (lib/starter/next.ts).
//
//   gc_school_share   which school's link it was, read once by /api/trial/start
//                     at the trial grant and written onto the profile
//                     (migration 386). Verified again there, never trusted.
//   gc_home_code      the lesson's home code, so the end of the starter pack
//                     records that the new child's class met it, exactly as a
//                     scan of the QR on the parent note would.
//
// A link that does not verify still lands on the starter pack, with no cookie
// and no next: a parent who mistyped should meet the product, not an error,
// and a link that says nothing true should not be remembered.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ module: string; token: string }> }) {
  const { module: rawModule, token } = await params
  const share = await readParentShare(decodeURIComponent(rawModule), decodeURIComponent(token), shareSecret())
  if (!share) return NextResponse.redirect(new URL('/starter-pack', req.nextUrl.origin))

  const back = parentSharePath(share.moduleId, share.token)
  const to = new URL('/starter-pack', req.nextUrl.origin)
  to.searchParams.set('next', back)
  const res = NextResponse.redirect(to)

  const cookie = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' }
  res.cookies.set(SCHOOL_SHARE_COOKIE, shareCookieValue(share.moduleId, share.token), { ...cookie, maxAge: SCHOOL_SHARE_COOKIE_SECONDS })

  // Best effort: a lesson with no home code, or a read that fails, still gets
  // the parent to the starter pack with the school remembered.
  try {
    const row = await getStarLessonForShare(createAdminClient(), share.moduleId)
    const home = row?.home_code ? normaliseHomeCode(row.home_code) : null
    if (home) res.cookies.set(HOME_CODE_COOKIE, home, { ...cookie, maxAge: HOME_CODE_COOKIE_SECONDS })
  } catch { /* the school is remembered either way */ }

  return res
}
