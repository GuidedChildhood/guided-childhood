// HANDING DIGI A QUESTION WITHOUT PUTTING IT IN THE URL (7 November 2026).
//
// About thirty places open DiGi with a question already written: a script, a
// lesson, Help now, a homework the family is stuck on, a child's ask to change
// the family deal, a follow up DiGi promised. They all used to do it the same
// way, /dashboard/digi?q=<the question>, and the question often held a child's
// name and the family's own words ("Olga asked to keep her phone till nine").
// A URL is not a private place: it is written into request logs, analytics,
// browser history on a shared machine and the Referer header of the next
// request. PR 1450 took names and emails out of every other URL and left this
// one for its own change, because it is a handoff, not a parameter.
//
// So the question now travels one of two ways, and never as words in the URL:
//
//   1. IN THE TAB, from client code. The link's tap (or the code about to
//      router.push) holds the question in this tab's sessionStorage and goes to
//      /dashboard/digi?held=1. DiGi takes it once and forgets it. This is
//      DigiAskLink and holdDigiPrompt below, and it is the only way a client
//      component may hand DiGi a question.
//
//   2. SEALED, from server code. A server component, a cron writing a card, a
//      notification collector: none of them has a tab, and a card's href can be
//      tapped a week later from a push. They call digiPromptHref
//      (lib/digi/prompt-token.ts), which seals the question with AES-GCM for
//      THIS parent only and puts the opaque token in ?p=. The DiGi page opens it
//      on the server. Nobody reading the log can read the question, and a link
//      forwarded to someone else opens nothing.
//
// Only a question that is a fixed string in the code may still ride as ?q=
// words (PhoneHeadsUp's "When should my child get their first phone"). It names
// nobody and is the same for every family. A script title or a device guide is
// child free too, but it arrives in a variable, and the guard
// (scripts/check-no-pii-in-urls.mjs) cannot tell a variable holding a script
// title from one holding a child's name, so every computed question takes the
// handoff. One rule a machine can check beats thirty judgement calls.
//
// The old ?q= and ?ask= are still READ, for push notifications and cards
// already sitting on phones, and stripped from the address bar the moment the
// page opens.

/** send: DiGi asks it straight away (the old ?q=). draft: it waits in the box
 *  for the parent to edit or send (the old ?ask=). */
export type DigiHandoffMode = 'send' | 'draft'
export type DigiHandoff = { text: string; mode: DigiHandoffMode }

export const DIGI_PATH = '/dashboard/digi'
/** The marker that says "a question is waiting in this tab". It carries nothing. */
export const DIGI_HELD_PARAM = 'held'
/** Every parameter that can hand DiGi a question, stripped once it has been read. */
export const DIGI_PROMPT_PARAMS = ['q', 'ask', 'p', DIGI_HELD_PARAM] as const

const HELD_KEY = 'gc_digi_handoff'
/** A held question older than this was abandoned (a tap that never landed). */
const HELD_TTL_MS = 5 * 60 * 1000
/** Long enough for a homework paragraph and its framing, short enough that a
 *  mangled hold cannot stuff the box. */
export const MAX_PROMPT_CHARS = 1000

export type DigiLinkOpts = {
  /** A child's id (a uuid, never a name) so DiGi opens that child's thread. */
  child?: string | null
  /** A device guide key (home_broadband, ipad) so DiGi loads that guide. */
  device?: string | null
}

export function clampPrompt(text: string): string {
  return String(text ?? '').slice(0, MAX_PROMPT_CHARS)
}

/** /dashboard/digi with only the harmless parameters, plus any extra pairs. */
export function digiPath(opts: DigiLinkOpts = {}, extra: Record<string, string> = {}): string {
  const params = new URLSearchParams()
  if (opts.child) params.set('child', opts.child)
  if (opts.device) params.set('device', opts.device)
  for (const [k, v] of Object.entries(extra)) params.set(k, v)
  const qs = params.toString()
  return qs ? `${DIGI_PATH}?${qs}` : DIGI_PATH
}

/** Where a held question is collected: /dashboard/digi?held=1. */
export function digiHeldHref(opts: DigiLinkOpts = {}): string {
  return digiPath(opts, { [DIGI_HELD_PARAM]: '1' })
}

/** Hold a question in this tab for DiGi to take on arrival. Call it in the tap,
 *  before navigating. If storage is blocked DiGi simply opens empty. */
export function holdDigiPrompt(text: string, mode: DigiHandoffMode = 'send'): void {
  // Not trimmed: "My situation: " keeps its space, because the parent's answer
  // is joined straight onto it when they send.
  const t = clampPrompt(text)
  if (!t.trim()) return
  try {
    sessionStorage.setItem(HELD_KEY, JSON.stringify({ text: t, mode, at: Date.now() }))
  } catch { /* DiGi opens empty, which is what it does without a question */ }
}

/** The held question, once. Removed as it is read, so a refresh or a later
 *  visit never asks it again. */
export function takeHeldDigiPrompt(): DigiHandoff | null {
  try {
    const raw = sessionStorage.getItem(HELD_KEY)
    sessionStorage.removeItem(HELD_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as { text?: unknown; mode?: unknown; at?: unknown }
    if (typeof v.text !== 'string' || !v.text.trim()) return null
    if (typeof v.at !== 'number' || Date.now() - v.at > HELD_TTL_MS) return null
    return { text: clampPrompt(v.text), mode: v.mode === 'draft' ? 'draft' : 'send' }
  } catch {
    return null
  }
}
