import type { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_LINK_COOKIE, VIDEO_STARTED_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, normaliseLinkCode } from '@/lib/video/link'

// Following a source link, in one place (migrations 372 and 379).
//
// Two ways in share it: /v/<code> in a caption, and /starter-pack?src=<code>
// on things already printed or published (the Planet Post went to print with
// ?src=planet-post-1 and nothing read it). Both count the follow, remember the
// code in a cookie for the start counter and the trial grant, and clear any
// earlier start marker, because a new follow is a new chance to start.
//
// Server only: it writes with the service role.

/** The code when it is a live link, after counting the follow; null otherwise. */
export async function followLink(raw: unknown): Promise<string | null> {
  const code = normaliseLinkCode(typeof raw === 'string' ? raw : null)
  if (!code) return null
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('video_links').select('code').eq('code', code).eq('active', true).maybeSingle()
    if (!data) return null
    await admin.from('video_link_events').insert({ code, kind: 'opened' })
    return code
  } catch {
    // The stage check is the fallback either way.
    return null
  }
}

/** Remember the followed code on this browser and clear the last start marker. */
export function rememberLink(res: NextResponse, code: string): NextResponse {
  const cookie = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' }
  res.cookies.set(VIDEO_LINK_COOKIE, code, { ...cookie, maxAge: VIDEO_LINK_MAX_AGE_SECONDS })
  res.cookies.set(VIDEO_STARTED_COOKIE, '', { ...cookie, maxAge: 0 })
  return res
}
