'use server'

import { cookies } from 'next/headers'
import { LANGUAGES_COOKIE, LANGUAGES_MAX_AGE, issueLanguagesToken, languagesCodesConfigured, matchLanguagesCode } from '@/lib/languages-access'

// The languages code turns into its own signed cookie, the same way the
// scheme's code does in app/unlock/actions.ts. Never stored, never logged.

export type UnlockResult = { ok: true } | { ok: false; error: string }

export async function unlockLanguages(formData: FormData): Promise<UnlockResult> {
  const typed = String(formData.get('code') ?? '')
  if (!typed.trim()) return { ok: false, error: 'Pop your languages code in first.' }

  // 10 November 2026: Justin saved a code in Vercel and the door kept saying it
  // did not match, because the env var had not reached the live deployment.
  // From the outside that is indistinguishable from a typing mistake, so the
  // door now says which one it is.
  if (!languagesCodesConfigured()) {
    return { ok: false, error: 'No languages code has reached this site yet. If one has just been added, the site needs redeploying before it works.' }
  }

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
