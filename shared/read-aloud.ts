// READ IT TO ME, IN THE DEVICE'S OWN BRITISH VOICE (sync plan G3).
//
// The lesson's key stage decides whether a grown up reads it, so an eight
// year old reads a KS2 deck of up to 2,600 words alone. The SEND lens asked
// for two things: a switch a parent can set for any child ("does lessons
// with me", children.lessons_together, migration 373), and a read aloud
// button on the child's deck that uses the phone's own voice. No model call
// on the child's side, nothing sent anywhere, nothing kept: the browser
// speaks the words that are already on the screen.
//
// Shared because the schools app and the parents app both mount the one
// player (shared/components/LessonPlayer.tsx). No imports, like the rest of
// shared/.

const BRITISH = /^en[-_]GB/i

function britishVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices()
    const gb = voices.filter(v => BRITISH.test(v.lang))
    if (gb.length === 0) return null
    // A named system voice over a novelty one, and a local one over a
    // network one, which is what keeps it working on a bus with no signal.
    return gb.find(v => v.localService && /daniel|kate|serena|oliver|arthur|martha/i.test(v.name))
      ?? gb.find(v => v.localService)
      ?? gb[0]
  } catch {
    return null
  }
}

/** Whether this browser can speak at all. False on the server. */
export function canReadAloud(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

/**
 * Speak a slide's words. Returns false where the browser cannot, so the
 * button can hide rather than do nothing. Any earlier reading stops first.
 */
export function readAloud(text: string, onEnd?: () => void): boolean {
  if (!canReadAloud()) return false
  const line = text.replace(/\s+/g, ' ').trim()
  if (!line) return false
  stopReadingAloud()
  try {
    const u = new SpeechSynthesisUtterance(line)
    u.lang = 'en-GB'
    const voice = britishVoice()
    if (voice) u.voice = voice
    // A touch under full speed: a child following the words on the screen
    // keeps up, and the voice reads a question as a question.
    u.rate = 0.95
    u.pitch = 1
    if (onEnd) {
      u.onend = onEnd
      u.onerror = onEnd
    }
    window.speechSynthesis.speak(u)
    return true
  } catch {
    return false
  }
}

export function stopReadingAloud(): void {
  if (!canReadAloud()) return
  try { window.speechSynthesis.cancel() } catch { /* speech is optional */ }
}

// The keys a slide's words live under, in reading order, and the ones that
// are never for the child: the teacher's script, the grown up's line, the
// feedback that would give a check question away.
const SPOKEN_KEYS = ['eyebrow', 'title', 'heading', 'label', 'outcome', 'why', 'question', 'prompt', 'text', 'body', 'figure', 'claim', 'caption', 'line']
const SPOKEN_LISTS: Record<string, (item: Record<string, unknown>) => string> = {
  gains: i => String(i),
  points: i => String(i),
  lines: i => String(i),
  words: i => `${i.word ?? ''}. ${i.meaning ?? ''}`,
  steps: i => `${i.title ?? ''}. ${i.text ?? ''}`,
  options: i => String(i.text ?? ''),
}
const NEVER = new Set(['script', 'together_prompt', 'feedback', 'lookFor', 'kidReveal', 'source'])

/** The words on one slide, as a child hears them read. Nothing the deck hides from the child. */
export function slideSpeech(slide: Record<string, unknown>): string {
  const parts: string[] = []
  const take = (obj: Record<string, unknown>) => {
    for (const k of SPOKEN_KEYS) {
      const v = obj[k]
      if (typeof v === 'string' && v.trim() && !NEVER.has(k)) parts.push(v.trim())
    }
    for (const [k, read] of Object.entries(SPOKEN_LISTS)) {
      const list = obj[k]
      if (!Array.isArray(list)) continue
      list.forEach((item, i) => {
        if (item === null || item === undefined) return
        const spoken = typeof item === 'object' ? read(item as Record<string, unknown>) : String(item)
        if (!spoken.trim()) return
        parts.push(k === 'options' ? `Option ${i + 1}. ${spoken.trim()}` : spoken.trim())
      })
    }
  }
  take(slide)
  // An interactive keeps its words under config.
  if (slide.config && typeof slide.config === 'object') take(slide.config as Record<string, unknown>)
  return parts.join('. ').replace(/\.\s*\./g, '.').replace(/([?!])\s*\./g, '$1')
}
