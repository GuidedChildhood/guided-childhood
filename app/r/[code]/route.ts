import { NextResponse } from 'next/server'
import { normaliseCode, REF_COOKIE, REF_COOKIE_DAYS } from '@/lib/referrals'

// A shared referral link: guidedchildhood.com/r/SARAH47.
//
// Remembers the code on the friend's device and sends them to the stage check,
// because every way in starts there (non negotiable 9). The code is applied at
// checkout, where the friend's £5 off is added. A code that is not real does
// nothing; the friend still lands on the stage check.
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = normaliseCode(raw)
  const res = NextResponse.redirect(new URL('/starter-pack', request.url), { status: 302 })
  if (code) {
    res.cookies.set(REF_COOKIE, code, {
      maxAge: REF_COOKIE_DAYS * 86_400,
      sameSite: 'lax',
      secure: true,
      httpOnly: true,
      path: '/',
    })
  }
  return res
}
