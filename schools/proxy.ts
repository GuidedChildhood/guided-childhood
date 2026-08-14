import { NextResponse } from 'next/server'

// Deliberately a pass through. The schools app has no login, no session and
// no gated route, so there is nothing for a proxy to decide; this file
// exists so Next's discovery finds IT rather than walking up the workspace
// root and compiling the parent app's middleware into this build (see the
// note in next.config.ts). If the schools product ever needs real request
// logic, it goes here, never above this directory.

export function proxy() {
  return NextResponse.next()
}

// Match nothing: pure documentation of intent, zero runtime cost per request.
export const config = { matcher: [] }
