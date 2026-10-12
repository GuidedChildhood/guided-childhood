import { NextRequest, NextResponse } from 'next/server'
import { HOME_CODE_COOKIE, HOME_CODE_COOKIE_SECONDS, normaliseHomeCode } from '@/lib/school/home-code'

// A CODE THAT SURVIVES SIGNING UP (sync plan B).
//
// A signed out parent who scans the QR on the parent note lands on
// /home-code/[code], which explains the code and offers the starter pack.
// Until 12 October 2026 the code was lost at that door: the starter pack
// made the account and the child, and the sheet in the book bag had to be
// found and typed again a week later, which is to say never.
//
// So the landing page's "Start your child's passport" button comes through
// here. The code goes in a short cookie, signed in nowhere because it is
// not a secret (the curriculum is public and a wrong code learns only that
// it is wrong), and the end of the starter pack redeems it for the new child
// (/api/school-code/pending, called from lib/starter/finish-setup.ts). The
// destination is still /starter-pack, the product's own front door.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const home = normaliseHomeCode(req.nextUrl.searchParams.get('code') ?? '')
  const res = NextResponse.redirect(new URL('/starter-pack', req.url))
  if (home) {
    res.cookies.set(HOME_CODE_COOKIE, home, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: HOME_CODE_COOKIE_SECONDS,
    })
  }
  return res
}
