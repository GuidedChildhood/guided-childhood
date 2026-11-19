// WHICH AI ANSWER ENGINE SENT THIS VISIT.
//
// Justin, 19 November 2026: "make analytics tag visits that come from
// chatgpt.com, perplexity.ai, gemini.google.com and claude.ai so I can see AI
// search traffic". Two signals, either is enough:
//
//   1. The referrer host. When a parent taps a link inside an AI answer, most
//      of these send their own address as the referrer.
//   2. utm_source. ChatGPT search adds ?utm_source=chatgpt.com to the links it
//      cites, which survives even when the referrer is stripped.
//
// The result is one short name from AI_SOURCES, never the referrer itself, so
// nothing about the conversation the parent was having reaches us. Copilot is
// included because Bing's answers reach parents through it.
//
// Pure and dependency free, so `npm run posthog-test` runs it under plain node.

export const AI_SOURCES = ['chatgpt', 'perplexity', 'gemini', 'claude', 'copilot'] as const
export type AiSource = (typeof AI_SOURCES)[number]

/** Host (or utm_source value) to source. A host matches itself and its subdomains. */
const HOSTS: [string, AiSource][] = [
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['openai.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
  ['bard.google.com', 'gemini'],
  ['claude.ai', 'claude'],
  ['copilot.microsoft.com', 'copilot'],
]

function fromHost(host: string): AiSource | null {
  const h = host.toLowerCase().replace(/^www\./, '')
  for (const [domain, source] of HOSTS) {
    if (h === domain || h.endsWith(`.${domain}`)) return source
  }
  return null
}

function hostOf(url: string): string | null {
  try { return new URL(url).host } catch { return null }
}

/**
 * The AI source of a visit, or null. `referrer` is document.referrer, `search`
 * is location.search. utm_source may be a host (chatgpt.com) or a bare name
 * (perplexity), so both are read.
 */
export function aiSourceOf(referrer: string | null | undefined, search: string | null | undefined): AiSource | null {
  const refHost = referrer ? hostOf(referrer) : null
  const fromRef = refHost ? fromHost(refHost) : null
  if (fromRef) return fromRef

  const utm = search ? new URLSearchParams(search).get('utm_source') : null
  if (!utm) return null
  const value = utm.trim().toLowerCase()
  if ((AI_SOURCES as readonly string[]).includes(value)) return value as AiSource
  return fromHost(value)
}

export function isAiSource(value: unknown): value is AiSource {
  return typeof value === 'string' && (AI_SOURCES as readonly string[]).includes(value)
}
