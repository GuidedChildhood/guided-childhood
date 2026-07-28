// One English voice rule for every line the browser speaks aloud.
//
// Two places in the app speak live text through the device: the child's timer
// counting down to the handover, and the rehearsal child answering back. Both
// used to take whatever voice the device offered first, which on a phone or
// laptop set to US English is an American voice. An American voice reads our
// words with the wrong vowels and, worst of all, says DiGi wrong.
//
// So the rule lives here once. Ask for en-GB on the utterance, walk a ladder
// that puts British voices above every other consideration including quality,
// and only fall out of English entirely when the device genuinely has nothing.
//
// This covers the live browser voice only. DiGi's recorded voice, the one that
// reads a script's say this line, is pre generated audio in lib/content/script
// -voice.ts and changes by regenerating that batch, never by code.

const BRITISH_LANGS = ['en-gb', 'en-ie', 'en-au', 'en-nz', 'en-za']

// The device voices that are British and warm, named because the platforms do
// not tag quality in any readable way. Kate, Serena and Martha are Apple's
// en-GB women, Sonia and Libby are Microsoft's, Google ships one.
const WARM_BRITISH = /kate|serena|martha|sonia|libby|hazel|google uk english female|amelie|stephanie/i

// Apple and Chrome both ship higher quality variants of the same voice under
// these words. Preferred inside British, never used to jump outside it.
const HIGH_QUALITY = /enhanced|premium|natural|neural/i

function isBritish(v: SpeechSynthesisVoice): boolean {
  const lang = (v.lang ?? '').toLowerCase().replace('_', '-')
  return BRITISH_LANGS.includes(lang)
}

/**
 * The best English voice on this device, British first.
 *
 * The ladder is deliberately accent before quality: a plain British voice
 * beats a beautiful American one, because the accent is the thing a parent
 * and a child actually notice. Returns null when the device has no English
 * voice at all, in which case the caller should let the browser pick and
 * rely on the en-GB lang hint instead.
 */
export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
  opts: { warm?: boolean } = {},
): SpeechSynthesisVoice | null {
  const english = voices.filter(v => (v.lang ?? '').toLowerCase().startsWith('en'))
  if (english.length === 0) return null

  const british = english.filter(isBritish)
  const gb = british.filter(v => (v.lang ?? '').toLowerCase().replace('_', '-') === 'en-gb')
  const pool = gb.length > 0 ? gb : british

  if (pool.length > 0) {
    if (opts.warm) {
      const warmAndGood = pool.find(v => WARM_BRITISH.test(v.name) && HIGH_QUALITY.test(v.name))
      if (warmAndGood) return warmAndGood
      const warm = pool.find(v => WARM_BRITISH.test(v.name))
      if (warm) return warm
    }
    const good = pool.find(v => HIGH_QUALITY.test(v.name))
    return good ?? pool[0]
  }

  // Nothing British on this device. Take the best English there is and let the
  // en-GB lang hint nudge the engine's pronunciation where it can.
  return english.find(v => HIGH_QUALITY.test(v.name)) ?? english[0]
}

// How DiGi's name is said out loud. Written as DiGi everywhere a parent or a
// child reads it, spelled for the engine only here, so the speech layer says
// it the English way rather than the hard American one. Changing the sound is
// changing this one string.
//
// The target is the first two syllables of "digital": DIJ ee. Two things have
// to be right, and the earlier spelling only got one of them. Dijee wins the
// soft g, but a single consonant between two vowels is the English cue for a
// long first vowel, the same rule that separates dinner from diner, so an
// engine reading Dijee is being told to say DYE jee or DEE jee. Doubling it
// closes the syllable and forces the short i, which is why didgeridoo is spelt
// the way it is: didge is already the English spelling of exactly this sound.
const DIGI_SPOKEN = 'Didgee'

/** The same sentence, respelled so a speech engine says our names properly. */
export function sayable(text: string): string {
  return text.replace(/\bDiGi\b/g, DIGI_SPOKEN)
}

// Chrome loads its voice list asynchronously and getVoices() returns an empty
// array until it has. Called once on mount, this makes sure the list is warm
// by the time anything actually speaks, so a cold page does not silently fall
// back to the device default (American) voice.
export function warmVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    const synth = window.speechSynthesis
    synth.getVoices()
    if (synth.getVoices().length === 0) {
      const once = () => synth.removeEventListener('voiceschanged', once)
      synth.addEventListener('voiceschanged', once)
    }
  } catch { /* speech optional */ }
}

export type SpeakOptions = {
  pitch?: number
  rate?: number
  volume?: number
  /** Reach for a warm named British woman before any other British voice. */
  warm?: boolean
  /** Stop anything already speaking first. */
  cancelFirst?: boolean
}

/**
 * Say a line in English, best effort. Silent when the browser has no speech,
 * no voice, or the device is muted, exactly as before: nothing here should
 * ever be able to throw into a countdown or a rehearsal.
 */
export function speakEnglish(text: string, opts: SpeakOptions = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    if (opts.cancelFirst) synth.cancel()
    const u = new SpeechSynthesisUtterance(sayable(text))
    // The lang hint goes on every utterance, whether or not we found a voice.
    // Some engines honour it on their own and it costs nothing when they do not.
    u.lang = 'en-GB'
    const pick = pickEnglishVoice(synth.getVoices?.() ?? [], { warm: opts.warm })
    if (pick) u.voice = pick
    if (opts.pitch !== undefined) u.pitch = opts.pitch
    if (opts.rate !== undefined) u.rate = opts.rate
    if (opts.volume !== undefined) u.volume = opts.volume
    synth.speak(u)
  } catch { /* speech optional */ }
}
