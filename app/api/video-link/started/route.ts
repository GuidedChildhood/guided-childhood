import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_LINK_COOKIE, VIDEO_STARTED_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, startCode } from '@/lib/video/link'
import { UTM_COOKIE, utmFromCookie } from '@/lib/video/utm'
import { insertLinkEvent } from '@/lib/video/follow'
import { REF_COOKIE } from '@/lib/referrals'
import { SCHOOL_LINK_COOKIE } from '@/lib/school/link'

// A stage check was begun (migrations 372, 379 and 388). The stage check calls
// this once, on the first answer, for every visitor.
//
// Until 379 only a visitor holding a film cookie was counted, so the founder
// could not say how many checks had been begun at all. Now every start is
// counted against the link that sent them, or, with no link, against a
// member's referral link, a school newsletter, or no link (lib/video/link
// startCode). Counted once per browser per follow: the started cookie says
// this one is already in.
//
// Since 388 the row carries the post's UTMs when the visit had them, so a
// start with no source link but utm_source=tiktok is no longer just "direct".
//
// Nothing about the visitor is stored. The row is a code, the word started,
// the post's UTMs and the time.

export async function POST(req: NextRequest) {
  const code = startCode({
    video: req.cookies.get(VIDEO_LINK_COOKIE)?.value,
    started: req.cookies.get(VIDEO_STARTED_COOKIE)?.value,
    referral: req.cookies.get(REF_COOKIE)?.value,
    school: req.cookies.get(SCHOOL_LINK_COOKIE)?.value,
  })
  if (!code) return NextResponse.json({ ok: true, counted: false })

  let counted = false
  try {
    counted = await insertLinkEvent(createAdminClient(), { code, kind: 'started' }, utmFromCookie(req.cookies.get(UTM_COOKIE)?.value))
  } catch { /* a missed count must never cost a parent the stage check */ }

  const res = NextResponse.json({ ok: true, counted })
  if (counted) {
    res.cookies.set(VIDEO_STARTED_COOKIE, code, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: VIDEO_LINK_MAX_AGE_SECONDS,
    })
  }
  return res
}
