import { cookies } from 'next/headers'
import { ACCESS_COOKIE, tokenIsValid } from './access'

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
  const store = await cookies()
  return tokenIsValid(store.get(ACCESS_COOKIE)?.value)
}
