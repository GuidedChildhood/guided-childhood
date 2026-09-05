import { soundEnabled } from '@/lib/sound/kidSounds'

// The planet's sounds, made with Web Audio so there are no files to load and
// nothing plays on the parent's side. Every touch makes a sound (design
// section 2.1), the music box plays a public domain nursery rhyme during a
// rest, and the child's own mute (the same one the quest screen uses) turns
// all of it off. Browsers only allow audio after a gesture, so the first tap
// wakes the context and everything before it is silent, which is fine.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch { return null }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, peak = 0.12, type: OscillatorType = 'triangle', glideTo?: number): void {
  const osc = c.createOscillator()
  const gain = c.createGain()
  const t0 = c.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function hush(c: AudioContext, start: number, dur: number, cutoff: number, kind: 'lowpass' | 'highpass', peak = 0.08): void {
  const frames = Math.floor(c.sampleRate * dur)
  const buffer = c.createBuffer(1, frames, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = kind
  filter.frequency.value = cutoff
  const gain = c.createGain()
  const t0 = c.currentTime + start
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  src.connect(filter).connect(gain).connect(c.destination)
  src.start(t0)
  src.stop(t0 + dur + 0.05)
}

export type Fx = 'tap' | 'sprinkle' | 'boop' | 'giggle' | 'shh' | 'yawn' | 'chime' | 'sparkle'

export function playFx(name: Fx): void {
  if (!soundEnabled()) return
  const c = getCtx()
  if (!c) return
  switch (name) {
    case 'tap': tone(c, 620, 0, 0.08, 0.10); break
    case 'sprinkle': hush(c, 0, 0.4, 3000, 'highpass', 0.05); tone(c, 1760, 0.02, 0.12, 0.06, 'sine'); tone(c, 2349, 0.12, 0.14, 0.06, 'sine'); tone(c, 2960, 0.22, 0.18, 0.05, 'sine'); break
    case 'boop': tone(c, 300, 0, 0.14, 0.14, 'sine', 160); break
    case 'giggle': tone(c, 660, 0, 0.08, 0.12); tone(c, 880, 0.09, 0.08, 0.12); tone(c, 990, 0.18, 0.1, 0.12); break
    case 'shh': hush(c, 0, 0.7, 2200, 'highpass', 0.04); break
    case 'yawn': tone(c, 440, 0, 0.7, 0.09, 'sine', 220); break
    case 'chime': tone(c, 784, 0, 0.16, 0.13, 'sine'); tone(c, 1175, 0.09, 0.24, 0.13, 'sine'); break
    case 'sparkle': tone(c, 1568, 0, 0.09, 0.08, 'sine'); tone(c, 2093, 0.07, 0.12, 0.07, 'sine'); break
  }
}

// Twinkle Twinkle Little Star, which has been public domain for two
// centuries and is about a star, which is the whole toy. C D E F G A in the
// fifth octave.
const C = 523.25, D = 587.33, E = 659.25, F = 698.46, G = 783.99, A = 880
const TWINKLE: [number, number][] = [
  [C, 1], [C, 1], [G, 1], [G, 1], [A, 1], [A, 1], [G, 2],
  [F, 1], [F, 1], [E, 1], [E, 1], [D, 1], [D, 1], [C, 2],
  [G, 1], [G, 1], [F, 1], [F, 1], [E, 1], [E, 1], [D, 2],
  [G, 1], [G, 1], [F, 1], [F, 1], [E, 1], [E, 1], [D, 2],
  [C, 1], [C, 1], [G, 1], [G, 1], [A, 1], [A, 1], [G, 2],
  [F, 1], [F, 1], [E, 1], [E, 1], [D, 1], [D, 1], [C, 2],
]

/** How long the music box plays before it fades out and the planet goes quiet. */
export const TUNE_MINUTES = 10

/**
 * Start the music box. Tier 1 hears the rhyme at a music box pace; Tier 2
 * hears it slower and an octave down, more like a lullaby than a toy. Loops
 * with a breath between rounds and fades out after TUNE_MINUTES. Returns the
 * stop function; call it when the rest ends or the screen goes.
 */
export function startTune(kind: 'twinkle' | 'slow'): () => void {
  if (!soundEnabled()) return () => {}
  const c = getCtx()
  if (!c) return () => {}
  const beat = kind === 'slow' ? 0.72 : 0.48
  const pitch = kind === 'slow' ? 0.5 : 1
  const master = c.createGain()
  master.gain.value = 0.9
  master.connect(c.destination)
  const startedAt = c.currentTime
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function playRound() {
    if (stopped) return
    const elapsed = c!.currentTime - startedAt
    if (elapsed > TUNE_MINUTES * 60) { master.gain.linearRampToValueAtTime(0.0001, c!.currentTime + 2); return }
    let t = 0
    for (const [freq, len] of TWINKLE) {
      const osc = c!.createOscillator()
      const gain = c!.createGain()
      const t0 = c!.currentTime + t
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq * pitch, t0)
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.min(len * beat, 1.4))
      osc.connect(gain).connect(master)
      osc.start(t0)
      osc.stop(t0 + len * beat + 0.1)
      t += len * beat
    }
    timer = setTimeout(playRound, (t + 2.5) * 1000)
  }
  playRound()

  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
    try { master.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.4) } catch { /* already gone */ }
    setTimeout(() => { try { master.disconnect() } catch { /* already gone */ } }, 600)
  }
}
