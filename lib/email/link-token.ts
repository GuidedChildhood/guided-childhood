import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

// AN EMAIL ADDRESS, SEALED, FOR A LINK (6 November 2026).
//
// The pre sign up emails carry two links that have to know who they were sent
// to: the one click stop (/api/email/unsubscribe) and the starter pack link
// that checks for an account on the click (/api/go/starter). Both used to put
// the address itself in the query string, ?e=you@example.com, with an HMAC
// beside it. The HMAC stopped forgery but not exposure: a URL lands in request
// logs, analytics, browser history and the Referer header of the next request
// (the funnel audit, fix 8).
//
// So the address now travels sealed. AES-256-GCM under a key derived from
// CRON_SECRET, the secret those HMACs already used, so no new environment
// value: the link is opaque to everyone but this server, a fresh random IV
// makes every send different, and the GCM tag means a token nobody minted
// opens nothing. The purpose is sealed in with the address, so a stop token
// can never be replayed as a starter link or the other way round.
//
// No database row. A lead may have been emailed from any of three places, and
// a table of tokens would be one more thing to keep in step with all of them.

export type LinkPurpose = 'unsub' | 'cta'

const VERSION = 'v1'

function key(): Buffer {
  return createHash('sha256')
    .update(`gc-email-link:${process.env.CRON_SECRET ?? 'dev'}`)
    .digest()
}

const normalise = (email: string) => email.trim().toLowerCase()

export function sealEmail(email: string, purpose: LinkPurpose): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const body = Buffer.concat([cipher.update(`${purpose}:${normalise(email)}`, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${VERSION}.${Buffer.concat([iv, tag, body]).toString('base64url')}`
}

/** The address a token was sealed for, or null for anything we did not mint
 *  for this purpose: a bad shape, a tampered byte, the wrong purpose. */
export function openEmail(token: string | null | undefined, purpose: LinkPurpose): string | null {
  if (!token || token.length > 600 || !token.startsWith(`${VERSION}.`)) return null
  try {
    const raw = Buffer.from(token.slice(VERSION.length + 1), 'base64url')
    if (raw.length < 12 + 16 + 1) return null
    const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(12, 28))
    const plain = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8')
    const prefix = `${purpose}:`
    if (!plain.startsWith(prefix)) return null
    const addr = plain.slice(prefix.length)
    return addr.includes('@') ? addr : null
  } catch {
    return null
  }
}
