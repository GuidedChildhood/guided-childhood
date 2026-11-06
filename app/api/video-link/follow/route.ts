import { NextRequest, NextResponse } from 'next/server'
import { followLink, rememberLink, rememberUtm } from '@/lib/video/follow'
import { readUtm } from '@/lib/video/utm'

// /starter-pack?src=<code>, read (migrations 379 and 387).
//
// The Planet Post went to print with ?src=planet-post-1 and The Guided Planet
// publishes ?src=guided-planet-00N, and until now nothing read either. The
// stage check posts the src here once on arrival; a live code is counted and
// remembered exactly as /v/<code> would, an unknown one is ignored and the
// visitor's start counts as no link.
//
// Since 387 the stage check posts the visit's UTMs as well, with or without a
// src. They go on the opened row and into their own cookie for the start and
// the trial grant. With no src, a utm_campaign that is itself a live code is
// followed as one (funnel audit, fix 7), so a post that carries only UTMs is
// still counted against its link when the slug and the code are the same.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { src?: unknown; utm?: unknown }
  const utm = readUtm(body.utm && typeof body.utm === 'object' ? body.utm as Record<string, unknown> : null)
  const src = typeof body.src === 'string' && body.src.trim() ? body.src : utm.utm_campaign ?? null
  const code = await followLink(src, utm)
  const res = NextResponse.json({ ok: true, followed: Boolean(code) })
  rememberUtm(res, utm, Boolean(code))
  return code ? rememberLink(res, code) : res
}
