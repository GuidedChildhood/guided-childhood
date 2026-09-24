import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_COOKIE, isOpenPath, tokenAccess } from '@/lib/access'
import { isStandalonePath, isTasterPath } from '@/lib/taster'
import { isPilotPath } from '@/lib/pilot'

// The outer door of the schools site (Next 16 calls this file proxy.ts; it is
// the old middleware). Two jobs, in this order:
//
// 1. Keep Next's discovery pointed HERE. Without this file Next walks up to
//    the workspace root and compiles the PARENT app's middleware into the
//    schools build, which broke the build once already the day the parent
//    middleware picked up @/lib/access. See the note in next.config.ts.
//
// 2. Hold the access gate. Home and pricing are open to the world; the
//    curriculum, the hub, the lessons and the printables need the code
//    (lib/access.ts carries the decision and the reasoning).
//
// It fails CLOSED. If the env is missing the signature can never verify, so
// an unconfigured deploy locks the content rather than leaking it. That is
// the right way round for a paywall, and the unlock page says so plainly
// instead of leaving anyone guessing.

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Two separate questions, composed here rather than tangled together.
  // isOpenPath is the PERMANENT open map: the pages that sell the scheme.
  // isTasterPath is the TEMPORARY sample: one module of the catalogue, let
  // through on purpose so a lesson link Justin sends actually opens. Keeping
  // them apart means the sample can be widened, narrowed or withdrawn without
  // anybody having to reason about the paid wall at the same time.
  // isStandalonePath is the third: a lesson that is free because it stands
  // outside the scheme altogether, so letting it through opens nothing paid.
  if (isOpenPath(pathname) || isTasterPath(pathname) || isStandalonePath(pathname)) return NextResponse.next()

  // Three answers from the cookie: a licence opens everything; a pilot opens
  // its two lessons and the Hub (lib/pilot.ts) and meets the door with the
  // pilot message everywhere else; no cookie meets the door as before.
  const token = request.cookies.get(ACCESS_COOKIE)?.value
  const access = await tokenAccess(token)
  if (access?.tier === 'licence') return NextResponse.next()
  if (access?.tier === 'pilot' && isPilotPath(pathname, access.phase)) return NextResponse.next()

  // Remember where they were headed so the unlock page can put them back
  // there, rather than dumping every teacher on the home page.
  const url = request.nextUrl.clone()
  url.pathname = '/unlock'
  url.search = `?next=${encodeURIComponent(pathname + search)}${access?.tier === 'pilot' ? '&pilot=1' : ''}`
  return NextResponse.redirect(url)
}

// Everything except Next's own plumbing and the static files. The finer
// grained open list lives in lib/access.ts, checked above, because a matcher
// regex is the wrong place to keep a product decision.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
