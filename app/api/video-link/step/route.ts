import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_STARTED_COOKIE, VIDEO_STEPS_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, isStageStep, stepCount } from '@/lib/video/link'
import { UTM_COOKIE, utmFromCookie } from '@/lib/video/utm'
import { insertLinkEvent } from '@/lib/video/follow'

// A step after the stage check start (migration 398): the parent reached their
// pathway, or opened the save screen. The stage check posts each once.
//
// Round 1 of the paid adverts had 8 starts and no accounts, and nothing past
// the start could say where they stopped. Counted against the same code as the
// start (the started cookie), so per link opened, started, pathway and save
// read as one funnel. A browser with no counted start counts nothing, and each
// step counts once per browser per follow.
//
// Nothing about the visitor is stored: a code, the step's name, the post's
// UTMs and the time.

export async function POST(req: NextRequest) {
  let step: unknown = null
  try { step = (await req.json())?.step } catch { /* no body, nothing to count */ }
  if (!isStageStep(step)) return NextResponse.json({ ok: true, counted: false })

  const next = stepCount({
    started: req.cookies.get(VIDEO_STARTED_COOKIE)?.value,
    steps: req.cookies.get(VIDEO_STEPS_COOKIE)?.value,
  }, step)
  if (!next) return NextResponse.json({ ok: true, counted: false })

  let counted = false
  try {
    counted = await insertLinkEvent(createAdminClient(), { code: next.code, kind: step }, utmFromCookie(req.cookies.get(UTM_COOKIE)?.value))
  } catch { /* a missed count must never cost a parent their pathway */ }

  const res = NextResponse.json({ ok: true, counted })
  if (counted) {
    res.cookies.set(VIDEO_STEPS_COOKIE, next.cookie, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: VIDEO_LINK_MAX_AGE_SECONDS,
    })
  }
  return res
}
