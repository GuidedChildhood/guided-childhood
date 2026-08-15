import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_COOKIE, isOpenPath, tokenIsValid } from '@/lib/access'

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

  if (isOpenPath(pathname)) return NextResponse.next()

  const token = request.cookies.get(ACCESS_COOKIE)?.value
  if (await tokenIsValid(token)) return NextResponse.next()

  // Remember where they were headed so the unlock page can put them back
  // there, rather than dumping every teacher on the home page.
  const url = request.nextUrl.clone()
  url.pathname = '/unlock'
  url.search = `?next=${encodeURIComponent(pathname + search)}`
  return NextResponse.redirect(url)
}

// Everything except Next's own plumbing and the static files. The finer
// grained open list lives in lib/access.ts, checked above, because a matcher
// regex is the wrong place to keep a product decision.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
