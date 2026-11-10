'use server'

import { cookies } from 'next/headers'
import { ACCESS_COOKIE, ACCESS_MAX_AGE, issueToken, matchCode } from '@/lib/access'

// Turning a typed code into the signed cookie the proxy checks. The code is
// never stored, never logged and never written anywhere: it is compared, and
// what survives is a signature over the code and an expiry.

export type UnlockResult = { ok: true } | { ok: false; error: string }

export async function unlock(formData: FormData): Promise<UnlockResult> {
  const typed = String(formData.get('code') ?? '')
  if (!typed.trim()) {
    return { ok: false, error: 'Pop your school code in first.' }
  }

  const code = matchCode(typed)

  // A fixed pause on every wrong answer. The codes are long enough that
  // guessing is not the real risk, but a form that answers instantly is a
  // form that can be hammered, and half a second costs a real teacher who
  // types it wrong once nothing at all.
  if (!code) {
    await new Promise(r => setTimeout(r, 500))
    return {
      ok: false,
      error: 'That code did not match. It is on your invoice and your welcome email. If you cannot find it, email hello@guidedchildhood.com and we will send it again.',
    }
  }

  // 10 November 2026: with a right code and no signing key this used to hang
  // on "Checking" for ever, because signing a cookie with an empty key throws
  // (found on the languages door, which shares the key). It now says so.
  if (!(process.env.SCHOOLS_ACCESS_SECRET || '').trim()) {
    return { ok: false, error: 'Your code is right, but the site is missing its signing key (SCHOOLS_ACCESS_SECRET), so it cannot open yet. Email hello@guidedchildhood.com.' }
  }

  const store = await cookies()
  store.set(ACCESS_COOKIE, await issueToken(code), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_MAX_AGE,
  })

  return { ok: true }
}
