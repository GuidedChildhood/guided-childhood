import type { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VIDEO_LINK_COOKIE, VIDEO_STARTED_COOKIE, VIDEO_LINK_MAX_AGE_SECONDS, normaliseLinkCode } from '@/lib/video/link'
import { UTM_COOKIE, utmCookieValue, utmColumns, type Utm } from '@/lib/video/utm'
import { hasUtm } from '@gc/shared/utm'

// Following a source link, in one place (migrations 372, 379 and 387).
//
// Two ways in share it: /v/<code> in a caption, and /starter-pack?src=<code>
// on things already printed or published (the Planet Post went to print with
// ?src=planet-post-1 and nothing read it). Both count the follow, remember the
// code in a cookie for the start counter and the trial grant, and clear any
// earlier start marker, because a new follow is a new chance to start.
//
// Since 387 the follow carries the post's UTMs too: on the opened row, and in
// their own cookie for the start counter and the trial grant.
//
// Server only: it writes with the service role.

/** Insert an event row with its UTMs; on a database without 387, without them. */
export async function insertLinkEvent(
  admin: ReturnType<typeof createAdminClient>,
  row: { code: string; kind: 'opened' | 'started' },
  utm?: Utm | null,
): Promise<boolean> {
  const cols = utmColumns(utm)
  const { error } = await admin.from('video_link_events').insert({ ...row, ...cols })
  if (!error) return true
  if (!hasUtm(cols)) return false
  // The count matters more than its UTMs: a database that has not had 387
  // rejects the new columns, so the row goes in without them.
  const retry = await admin.from('video_link_events').insert(row)
  return !retry.error
}

/** The code when it is a live link, after counting the follow; null otherwise. */
export async function followLink(raw: unknown, utm?: Utm | null): Promise<string | null> {
  const code = normaliseLinkCode(typeof raw === 'string' ? raw : null)
  if (!code) return null
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('video_links').select('code').eq('code', code).eq('active', true).maybeSingle()
    if (!data) return null
    await insertLinkEvent(admin, { code, kind: 'opened' }, utm)
    return code
  } catch {
    // The stage check is the fallback either way.
    return null
  }
}

const COOKIE = () => ({ httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' })

/** Remember the followed code on this browser and clear the last start marker. */
export function rememberLink(res: NextResponse, code: string): NextResponse {
  res.cookies.set(VIDEO_LINK_COOKIE, code, { ...COOKIE(), maxAge: VIDEO_LINK_MAX_AGE_SECONDS })
  res.cookies.set(VIDEO_STARTED_COOKIE, '', { ...COOKIE(), maxAge: 0 })
  return res
}

/**
 * Remember the UTMs of this visit. A visit that carries UTMs replaces the last
 * ones. A followed link without UTMs clears them, so a new post is never
 * credited with an older post's campaign. A visit with neither leaves them be.
 */
export function rememberUtm(res: NextResponse, utm: Utm | null | undefined, followed: boolean): NextResponse {
  const value = utmCookieValue(utm)
  if (value) res.cookies.set(UTM_COOKIE, value, { ...COOKIE(), maxAge: VIDEO_LINK_MAX_AGE_SECONDS })
  else if (followed) res.cookies.set(UTM_COOKIE, '', { ...COOKIE(), maxAge: 0 })
  return res
}
