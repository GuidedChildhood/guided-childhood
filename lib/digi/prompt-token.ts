import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { clampPrompt, digiPath, DIGI_PATH, type DigiHandoff, type DigiHandoffMode, type DigiLinkOpts } from '../../shared/digi-handoff'

// A QUESTION FOR DIGI, SEALED, FOR A LINK BUILT ON THE SERVER (7 November 2026).
//
// The server half of lib/digi/handoff.ts (read that first for why). A server
// component, a cron writing a follow up card or a notification collector has
// no tab to hold a question in, and a card's href may be tapped days later from
// a push, so the question goes into the link, sealed.
//
// The same scheme as lib/email/link-token.ts: AES-256-GCM under a key derived
// from CRON_SECRET (no new environment value), a fresh random IV every time and
// a GCM tag so a token nobody minted opens nothing. Two differences:
//
//   - The key is derived under its own label, so a DiGi token can never be
//     opened as an email link or the other way round.
//   - The parent's id is sealed in with the question, and the DiGi page only
//     opens a token for the parent who is signed in. A link forwarded, or left
//     in a shared browser's history, opens an empty DiGi for anyone else.
//
// No database row: a question that only lives as long as the link needs no
// table, and a card's stored href already carries it.
//
// If CRON_SECRET is ever rotated, links minted before it open an empty DiGi.
// That is the right failure: nothing is shown, nothing breaks.

const VERSION = 'd1'

function key(): Buffer {
  return createHash('sha256')
    .update(`gc-digi-prompt:${process.env.CRON_SECRET ?? 'dev'}`)
    .digest()
}

export function sealDigiPrompt(userId: string, text: string, mode: DigiHandoffMode = 'send'): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const plain = JSON.stringify({ u: userId, m: mode, t: clampPrompt(text) })
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return `${VERSION}.${Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')}`
}

/** The question a token holds, or null for anything this server did not mint
 *  for this parent: a bad shape, a tampered byte, someone else's link. */
export function openDigiPrompt(token: string | null | undefined, userId: string): DigiHandoff | null {
  if (!token || token.length > 3000 || !token.startsWith(`${VERSION}.`)) return null
  try {
    const raw = Buffer.from(token.slice(VERSION.length + 1), 'base64url')
    if (raw.length < 12 + 16 + 1) return null
    const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(12, 28))
    const v = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8'))
    if (!v || v.u !== userId || typeof v.t !== 'string' || !v.t.trim()) return null
    return { text: clampPrompt(v.t), mode: v.m === 'draft' ? 'draft' : 'send' }
  } catch {
    return null
  }
}

/** /dashboard/digi?p=<sealed> for this parent, with the child and device kept
 *  as they are (an id and a guide key, never a name). */
export function digiPromptHref(
  userId: string,
  text: string,
  opts: DigiLinkOpts & { mode?: DigiHandoffMode } = {},
): string {
  return digiPath(opts, { p: sealDigiPrompt(userId, text, opts.mode ?? 'send') })
}

/** A card href written before 7 November 2026 may still say ?q=<words> or
 *  ?ask=<words>. Reseal it on the way out so the words never reach a link.
 *  Anything that is not such a DiGi link comes back untouched. */
export function resealDigiHref(href: string | null | undefined, userId: string): string | null {
  if (!href || !href.startsWith(DIGI_PATH)) return href ?? null
  let url: URL
  try { url = new URL(href, 'https://x.invalid') } catch { return href }
  if (url.pathname !== DIGI_PATH) return href
  const q = url.searchParams.get('q')
  const ask = url.searchParams.get('ask')
  if (!q && !ask) return href
  return digiPromptHref(userId, (q ?? ask) as string, {
    child: url.searchParams.get('child'),
    device: url.searchParams.get('device'),
    mode: q ? 'send' : 'draft',
  })
}

/** The question this DiGi page was handed, from its search params: a sealed
 *  ?p= for this parent, else the ?q= (send) or ?ask= (draft) words that links
 *  carried before 7 November 2026 and pushes already on phones still do. A
 *  question held in the tab (?held=1) is not here: only the browser has it. */
export function resolveDigiHandoff(
  params: { p?: string | null; q?: string | null; ask?: string | null },
  userId: string,
): DigiHandoff | null {
  const sealed = openDigiPrompt(params.p, userId)
  if (sealed) return sealed
  if (typeof params.q === 'string' && params.q.trim()) return { text: clampPrompt(params.q), mode: 'send' }
  if (typeof params.ask === 'string' && params.ask.trim()) return { text: params.ask.slice(0, 300), mode: 'draft' }
  return null
}
