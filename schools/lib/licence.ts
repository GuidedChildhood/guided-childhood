import { cookies } from 'next/headers'
import { ACCESS_COOKIE, tokenAccess, type Access } from './access'

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
 *  the chip. A pilot school is named as one, never as licensed. */
export async function navAccess(): Promise<{ licensed: boolean; pilot: boolean }> {
  const access = await currentAccess()
  return { licensed: access !== null, pilot: access?.tier === 'pilot' }
}
