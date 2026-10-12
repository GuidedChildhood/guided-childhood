import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_LINK_COOKIE, VIDEO_STARTED_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, normaliseLinkCode } from '@/lib/video/link'

// A stage check was begun (migration 372). The stage check calls this once,
// on the first answer, for every visitor; only a visitor who came through a
// film link has the cookie, so everyone else costs one cookie read and an
// empty reply. Counted once per browser per follow: the started cookie says
// this one is already in.
//
// Nothing about the visitor is stored. The row is the film's code, the word
// started and the time.

export async function POST(req: NextRequest) {
  const code = normaliseLinkCode(req.cookies.get(VIDEO_LINK_COOKIE)?.value)
  if (!code || req.cookies.get(VIDEO_STARTED_COOKIE)?.value === code) return NextResponse.json({ ok: true, counted: false })

  let counted = false
  try {
    const { error } = await createAdminClient().from('video_link_events').insert({ code, kind: 'started' })
    counted = !error
  } catch { /* a missed count must never cost a parent the stage check */ }

  const res = NextResponse.json({ ok: true, counted })
  if (counted) {
    res.cookies.set(VIDEO_STARTED_COOKIE, code, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: VIDEO_LINK_MAX_AGE_SECONDS,
    })
  }
  return res
}
