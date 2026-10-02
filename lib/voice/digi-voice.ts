// DiGi's voice, both ways, in the parent's chat (2 October 2026).
//
// Justin asked for two options: a parent can talk to DiGi, and DiGi can read
// its answer aloud, without either becoming annoying. The plan is
// plans/2026-10-02-digi-voice-plan.md. This file holds the parts with rules in
// them, so the chat only wires buttons:
//
//   1. Dictation. The browser's own speech recognition, en-GB, free. The words
//      go into the box for the parent to check, nothing sends itself, and no
//      audio is kept anywhere: the browser hands us text and that is all we
//      ever hold. Where the browser has no recognition the button is hidden,
//      and the phone keyboard's own microphone still works as before.
//   2. The spoken line. A reply can run to several paragraphs, and hearing all
//      of it read out is the annoying version. So DiGi says the one line worth
//      hearing, the words to say to the child when the reply has them, and the
//      rest stays on screen.
//   3. The setting. Read aloud is off until the parent turns it on, and the
//      choice is remembered on that device only.
//
// The speaking itself goes through lib/voice/english-voice, the one British
// voice rule, so DiGi's name is said properly here too.

import { speakEnglish } from '@/lib/voice/english-voice'

// ── 1. Dictation ─────────────────────────────────────────────────────────────

// The recognition API is still prefixed in Safari and Chrome, and missing in
// Firefox. Typed loosely on purpose: it is not in the DOM lib types.
type RecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

function recognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** True when this browser can turn speech into text, so the button can show. */
export function canDictate(): boolean {
  return recognitionCtor() !== null
}

export type Dictation = { stop: () => void }

/**
 * Start listening. `onText` gets the whole transcript so far every time it
 * changes (final words plus the ones still being heard), so the box can show
 * the words arriving. `onEnd` fires once, however listening stopped, with a
 * plain reason when it was a refusal the parent can act on.
 */
export function startDictation(handlers: {
  onText: (text: string) => void
  onEnd: (problem?: 'blocked' | 'no-speech' | 'failed') => void
}): Dictation | null {
  const Ctor = recognitionCtor()
  if (!Ctor) return null
  let rec: RecognitionLike
  try { rec = new Ctor() } catch { return null }

  rec.lang = 'en-GB'
  rec.continuous = true
  rec.interimResults = true

  let finalText = ''
  let problem: 'blocked' | 'no-speech' | 'failed' | undefined
  let ended = false

  rec.onresult = e => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]
      const words = r[0]?.transcript ?? ''
      if (r.isFinal) finalText += words
      else interim += words
    }
    handlers.onText(tidy(finalText + interim))
  }
  rec.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') problem = 'blocked'
    else if (e.error === 'no-speech') problem = 'no-speech'
    else if (e.error !== 'aborted') problem = 'failed'
  }
  rec.onend = () => {
    if (ended) return
    ended = true
    handlers.onEnd(problem)
  }

  try { rec.start() } catch { return null }
  return { stop: () => { try { rec.stop() } catch { /* already stopped */ } } }
}

// Engines leave double spaces and a lower case first letter. Small things,
// but the parent reads this back before sending it.
function tidy(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t ? t[0].toUpperCase() + t.slice(1) : ''
}

// ── 2. The spoken line ───────────────────────────────────────────────────────

const MARKUP = /\*\*|\[([^\]]+)\]\([^)]+\)/g
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu

function plain(text: string): string {
  return text.replace(MARKUP, (_m, label?: string) => label ?? '').replace(EMOJI, '').replace(/\s+/g, ' ').trim()
}

/**
 * The one line DiGi says out loud for a reply.
 *
 * First choice: words for the parent to say, the first quoted run of five
 * words or more, spoken as "Try saying: ...". That is the line a parent most
 * needs to hear in their head before they say it. Otherwise the opening two
 * sentences, which is where DiGi puts its point. Capped so it never becomes a
 * lecture read aloud.
 */
export function spokenLine(reply: string): string {
  const text = plain(reply)
  if (!text) return ''

  const quoted = text.match(/[“"]([^“”"]{12,240})[”"]/g) ?? []
  for (const q of quoted) {
    const inner = q.slice(1, -1).trim()
    if (inner.split(/\s+/).length >= 5) return `Try saying: ${inner}`
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text]
  let out = ''
  for (const s of sentences.slice(0, 2)) {
    if ((out + s).length > 260 && out) break
    out += s
  }
  out = out.trim()
  return out.length > 300 ? `${out.slice(0, 297).replace(/\s+\S*$/, '')}…` : out
}

// ── 3. Speaking, and stopping ────────────────────────────────────────────────

/**
 * Say the line for a reply. `onDone` fires when it finishes or is stopped,
 * so DiGi's face can stop talking with it. Returns false when there is nothing
 * to say or no speech on this device.
 */
export function readAloud(reply: string, onDone: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
  const line = spokenLine(reply)
  if (!line) return false
  stopReading()
  speakEnglish(line, { warm: true, rate: 1 })
  // speakEnglish does not hand back the utterance, so the end is watched on
  // the engine itself: poll until it has started and then gone quiet.
  // A minute is the backstop for an engine that queues and never speaks.
  let started = false
  let ticks = 0
  const timer = window.setInterval(() => {
    const synth = window.speechSynthesis
    ticks++
    if (synth.speaking) started = true
    else if (started || !synth.pending || ticks > 300) { window.clearInterval(timer); onDone() }
  }, 200)
  return true
}

export function stopReading(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try { window.speechSynthesis.cancel() } catch { /* speech optional */ }
}

// ── 4. Hands free (2 October 2026) ───────────────────────────────────────────
//
// Justin asked whether DiGi could be triggered by voice, "like saying hey
// DiGi". A wake word means a microphone open all day, which a web page cannot
// do and which a parenting product should not want. Hands free is the honest
// version: a switch in the chat that holds a spoken conversation while the
// page is open. The parent talks, a pause sends it, DiGi answers aloud, and
// the microphone opens again when DiGi stops.
//
// The rules, held in DigiChat and checked by scripts/check-digi-voice.mjs:
//   off every time the page opens, never remembered, because a microphone
//   that opens by itself is the one thing this must never do;
//   a visible listening sign the whole time it is on;
//   off by itself after HANDS_FREE_QUIET_MS with nothing said, when the page
//   is hidden, or when the microphone is blocked;
//   the microphone is never open while DiGi is speaking, so it cannot hear
//   itself.

/** A pause this long after the last word sends what was said. */
export const HANDS_FREE_PAUSE_MS = 1800

/** Two quiet minutes and hands free turns itself off. */
export const HANDS_FREE_QUIET_MS = 2 * 60 * 1000

// ── The remembered setting ───────────────────────────────────────────────────

const KEY = 'gc-digi-read-aloud'

/** Off unless this device has been told otherwise. */
export function readAloudOn(): boolean {
  try { return window.localStorage.getItem(KEY) === 'on' } catch { return false }
}

export function setReadAloud(on: boolean): void {
  try { window.localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* per device nicety */ }
}
