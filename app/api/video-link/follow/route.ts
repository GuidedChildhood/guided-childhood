import { NextRequest, NextResponse } from 'next/server'
import { followLink, rememberLink } from '@/lib/video/follow'

// /starter-pack?src=<code>, read (migration 379).
//
// The Planet Post went to print with ?src=planet-post-1 and The Guided Planet
// publishes ?src=guided-planet-00N, and until now nothing read either. The
// stage check posts the src here once on arrival; a live code is counted and
// remembered exactly as /v/<code> would, an unknown one is ignored and the
// visitor's start counts as no link.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { src?: unknown }
  const code = await followLink(body.src)
  const res = NextResponse.json({ ok: true, followed: Boolean(code) })
  return code ? rememberLink(res, code) : res
}
