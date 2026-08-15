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
