'use server'

import { cookies } from 'next/headers'
import { LANGUAGES_COOKIE, LANGUAGES_MAX_AGE, issueLanguagesToken, matchLanguagesCode } from '@/lib/languages-access'

// The languages code turns into its own signed cookie, the same way the
// scheme's code does in app/unlock/actions.ts. Never stored, never logged.

export type UnlockResult = { ok: true } | { ok: false; error: string }

export async function unlockLanguages(formData: FormData): Promise<UnlockResult> {
  const typed = String(formData.get('code') ?? '')
  if (!typed.trim()) return { ok: false, error: 'Pop your languages code in first.' }

  const code = matchLanguagesCode(typed)
  if (!code) {
    await new Promise(r => setTimeout(r, 500))
    return { ok: false, error: 'That code did not match. Email hello@guidedchildhood.com and we will send it again.' }
  }

  const store = await cookies()
  store.set(LANGUAGES_COOKIE, await issueLanguagesToken(code), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: LANGUAGES_MAX_AGE,
  })
  return { ok: true }
}
