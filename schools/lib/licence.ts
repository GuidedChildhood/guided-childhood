import { cookies } from 'next/headers'
import { ACCESS_COOKIE, tokenAccess, type Access } from './access'
import { LANGUAGES_COOKIE, languagesLive, languagesTokenAccess } from './languages-access'

// "Is this visitor a school that has paid?" asked from a server component.
//
// Kept OUT of lib/access.ts on purpose: that file is imported by proxy.ts,
// which runs in the edge proxy, and next/headers has no business being
// dragged in there. access.ts stays pure crypto and path rules; this is the
// one request bound question, asked where a request exists.
//
// The taster pages are the only callers. They are open to the world, so they
// render for everybody, and this decides whether the visitor also gets the
// sales bar sitting on top. A licensed school never sees an advert for the
// thing it has already bought.
export async function hasLicence(): Promise<boolean> {
  return (await currentAccess()) !== null
}

/** The finer answer: a licence, a pilot with its phase, or null. The
 *  curriculum map uses it to say which two lessons a pilot opens, and the
 *  unlock page to say so when a pilot school taps a third. */
export async function currentAccess(): Promise<Access | null> {
  const store = await cookies()
  return tokenAccess(store.get(ACCESS_COOKIE)?.value)
}

/** What the nav needs: the two rooms for any code, and the right word on
 *  the chip. A pilot school is named as one, never as licensed. The
 *  languages tab shows for a languages code, or for everyone once
 *  LANGUAGES_LIVE is on; a scheme code alone never shows it. */
export async function navAccess(): Promise<{ licensed: boolean; pilot: boolean; languages: boolean }> {
  const access = await currentAccess()
  const store = await cookies()
  const languages = languagesLive() || (await languagesTokenAccess(store.get(LANGUAGES_COOKIE)?.value)) !== null
  return { licensed: access !== null, pilot: access?.tier === 'pilot', languages }
}

/** The access code behind a valid cookie, with what it opens, or null.
 *
 *  Only for the parent share link (lib/parent-share.ts), which turns the code
 *  into a pseudonym and never prints it. The code is read off the cookie only
 *  AFTER tokenAccess has checked its signature, expiry and that the code is
 *  still on a list, so a hand edited cookie names nothing. */
export async function currentSchool(): Promise<{ code: string; access: Access } | null> {
  const store = await cookies()
  const token = store.get(ACCESS_COOKIE)?.value
  const access = await tokenAccess(token)
  if (!access || !token) return null
  const code = token.split('|')[0]
  return code ? { code, access } : null
}
